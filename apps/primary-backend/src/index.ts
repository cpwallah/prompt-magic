import { prismaa } from "@repo/db/client";
import express, { Request, Response } from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Create a project
app.post(
  "/project",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const { prompt } = req.body;
    const userId = req.userId;

    // Ensure userId is defined and is a string
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ message: "User ID is missing or invalid" });
      return;
    }

    const description = prompt.split("\n")[0] || null; // If prompt is empty, use null for description

    try {
      // Create the project
      const project = await prismaa.project.create({
        data: {
          description, // Nullable description
          userId, // This should now be a string
        },
      });
      res.json({ projectId: project.id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating project:", error);
        res
          .status(500)
          .json({ message: "Error creating project", error: error.message });
      } else {
        console.error("Unknown error:", error);
        res
          .status(500)
          .json({ message: "Unknown error occurred", error: "Unknown error" });
      }
    }
  }
);

// Get projects by userId
app.get(
  "/projects",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId;

    // Ensure userId is defined and is a string
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ message: "User ID is missing or invalid" });
      return;
    }

    try {
      // Fetch the project by userId - use findUnique or findFirst for single results
      const project = await prismaa.project.findFirst({
        where: { userId },
      });

      // If no project found for this userId, return a 404 error
      if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
      }

      // Return the project details
      res.json(project);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching project:", error);
        res
          .status(500)
          .json({ message: "Error fetching project", error: error.message });
      } else {
        console.error("Unknown error:", error);
        res
          .status(500)
          .json({ message: "Unknown error occurred", error: "Unknown error" });
      }
    }
  }
);

app.get("/prompts/:projectId", authMiddleware, async (req, res) => {
  // const userId = req.userId!;
  const projectId = req.params.projectId;
  const prompts = await prismaa.prompt.findMany({
    where: { projectId },
  });
  res.json({ prompts });
});

app.get("/actions/:projectId", authMiddleware, async (req, res) => {
  // const userId = req.userId!;
  const projectId = req.params.projectId;
  const actions = await prismaa.action.findMany({
    where: { projectId },
  });
  res.json({ actions });
});
// Start the server
app.listen(3010, () => {
  console.log("Server is running on port 3010");
});
