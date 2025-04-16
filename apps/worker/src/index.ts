// import cors from "cors";
// import express from "express";
// import { prismaa } from "@repo/db/client";
// import Anthropic from "@anthropic-ai/sdk";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/prompt", async (req, res) => {
//   const { prompt, userId } = req.body;
//   const client = new Anthropic();
//   await prismaa.prompt.create({
//     data: {
//       content: prompt,
//       projectId,
//       type: "USER",
//     },
//   });
//   const allPrompts = await prismaa.prompt.findMany({
//     where: {
//       projectId,
//     },
//     orderBy: {
//       createdAt: "asc",
//     },
//   });
//   let artifactProcessor = new ArtifactProcessor(
//     "",
//     onFileUpdate,
//     onShellCommand
//   );
//   let artifact = "";
//   let response = client.message
//     .stream({
//       messages: allPrompts.map((p: any) => ({
//         role: p.type === "USER" ? "user" : "assistant",
//         content: p.conten,
//       })),
//       system: systemPrompt,
//       model: "claude-3-7-sonnet-20250219",
//       max_token: 8000,
//     })
//     .on("text", (text) => {
//       artifactProcessor.append(text);
//       artifactProcessor.parse();
//       artifact += text;
//     })
//     .on("finalMessage", async (message) => {
//       console.log("done!");
//       await prismaa.prompt.create({
//         data: {
//           content: artifact,
//           projectId,
//           type: "SYSTEM",
//         },
//       });
//     })
//     .on("error", (error) => {
//       console.log("error", error);
//     });
//   res.json({ response });
// });
// app.listen(9091, () => {
//   console.log("server is running on port 9091");
// });
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { prismaa } from "@repo/db/client";
import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "./systemPrompt";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";

// Define interfaces for type safety
interface PromptRequestBody {
  prompt: string;
  userId: string;
  projectId: string;
}

interface Prompt {
  id?: string;
  content: string;
  type: "USER" | "SYSTEM";
  projectId: string;
  createdAt?: Date;
}

// Error type for better error handling
interface ServerError extends Error {
  status?: number;
}

const app = express();
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    error: "Internal server error",
    message: err.message,
  });
});

app.post(
  "/prompt",
  async (req: Request<{}, {}, PromptRequestBody>, res: Response) => {
    try {
      // Validate request body
      const { prompt, userId, projectId } = req.body ?? {};
      if (!prompt || !userId || !projectId) {
        const error: ServerError = new Error(
          "Missing required fields: prompt, userId, projectId"
        );
        error.status = 400;
        throw error;
      }

      // Initialize Anthropic client
      const client = new Anthropic();

      // Create user prompt
      await prismaa?.prompt
        ?.create({
          data: {
            content: prompt,
            projectId,
            type: "USER",
          },
        })
        .catch((error: unknown) => {
          console.error("Error creating prompt:", error);
          throw new Error("Failed to create prompt");
        });

      // Fetch all prompts
      const allPrompts: Prompt[] =
        (await prismaa?.prompt
          ?.findMany({
            where: {
              projectId,
            },
            orderBy: {
              createdAt: "asc",
            },
          })
          .catch((error: unknown) => {
            console.error("Error fetching prompts:", error);
            throw new Error("Failed to fetch prompts");
          })) ?? [];

      // Initialize artifact processor with safe defaults
      let artifactProcessor = new ArtifactProcessor(
        "",
        onFileUpdate ?? (() => {}),
        onShellCommand ?? (() => {})
      );
      let artifact: string = "";

      // Process the message stream
      const response = client?.messages
        ?.stream({
          messages: allPrompts.map(
            (p: Prompt = { content: "", type: "SYSTEM", projectId }) => ({
              role: p.type === "USER" ? "user" : "assistant",
              content: p.content ?? "",
            })
          ),
          system: systemPrompt("REACT_NATIVE"),
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 8000,
        })
        .on("text", (text: string = "") => {
          try {
            artifactProcessor.append(text);
            artifactProcessor.parse();
            artifact += text;
          } catch (error: unknown) {
            console.error("Error processing text stream:", error);
          }
        })
        .on("finalMessage", async (message: any = {}) => {
          try {
            console.log("done!");
            await prismaa?.prompt?.create({
              data: {
                content: artifact ?? "",
                projectId,
                type: "SYSTEM",
              },
            });
          } catch (error: unknown) {
            console.error("Error saving final message:", error);
          }
        })
        .on("error", (error: unknown) => {
          console.error("Stream error:", error);
        });

      res.json({
        response: response ?? null,
        status: "success",
      });
    } catch (error: unknown) {
      const serverError = error as ServerError;
      console.error("Request error:", serverError);
      res.status(serverError.status || 500).json({
        error: "Internal server error",
        message: serverError.message ?? "An unexpected error occurred",
      });
    }
  }
);

const PORT: number = 9091;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
});

// Handle unhandled promise rejections
process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  }
);
