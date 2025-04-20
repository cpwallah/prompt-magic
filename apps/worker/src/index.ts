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

// import cors from "cors";
// import express, { Request, Response, NextFunction } from "express";
// import { prismaa } from "@repo/db/client";
// import Anthropic from "@anthropic-ai/sdk";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";

// // Define interfaces for type safety
// interface PromptRequestBody {
//   prompt: string;
//   userId: string;
//   projectId: string;
// }

// interface Prompt {
//   id?: string;
//   content: string;
//   type: "USER" | "SYSTEM";
//   projectId: string;
//   createdAt?: Date;
// }

// // Error type for better error handling
// interface ServerError extends Error {
//   status?: number;
// }

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Error handling middleware
// app.use((err: ServerError, req: Request, res: Response, next: NextFunction) => {
//   console.error("Server error:", err);
//   res.status(err.status || 500).json({
//     error: "Internal server error",
//     message: err.message,
//   });
// });

// app.post(
//   "/prompt",
//   async (req: Request<{}, {}, PromptRequestBody>, res: Response) => {
//     try {
//       // Validate request body
//       const { prompt, userId, projectId } = req.body ?? {};
//       if (!prompt || !userId || !projectId) {
//         const error: ServerError = new Error(
//           "Missing required fields: prompt, userId, projectId"
//         );
//         error.status = 400;
//         throw error;
//       }

//       // Initialize Anthropic client
//       const client = new Anthropic();

//       // Create user prompt
//       await prismaa?.prompt
//         ?.create({
//           data: {
//             content: prompt,
//             projectId,
//             type: "USER",
//           },
//         })
//         .catch((error: unknown) => {
//           console.error("Error creating prompt:", error);
//           throw new Error("Failed to create prompt");
//         });

//       // Fetch all prompts
//       const allPrompts: Prompt[] =
//         (await prismaa?.prompt
//           ?.findMany({
//             where: {
//               projectId,
//             },
//             orderBy: {
//               createdAt: "asc",
//             },
//           })
//           .catch((error: unknown) => {
//             console.error("Error fetching prompts:", error);
//             throw new Error("Failed to fetch prompts");
//           })) ?? [];

//       // Initialize artifact processor with safe defaults
//       let artifactProcessor = new ArtifactProcessor(
//         "",
//         onFileUpdate ?? (() => {}),
//         onShellCommand ?? (() => {})
//       );
//       let artifact: string = "";

//       // Process the message stream
//       const response = client?.messages
//         ?.stream({
//           messages: allPrompts.map(
//             (p: Prompt = { content: "", type: "SYSTEM", projectId }) => ({
//               role: p.type === "USER" ? "user" : "assistant",
//               content: p.content ?? "",
//             })
//           ),
//           system: systemPrompt("REACT_NATIVE"),
//           model: "claude-3-7-sonnet-20250219",
//           max_tokens: 8000,
//         })
//         .on("text", (text: string = "") => {
//           try {
//             artifactProcessor.append(text);
//             artifactProcessor.parse();
//             artifact += text;
//           } catch (error: unknown) {
//             console.error("Error processing text stream:", error);
//           }
//         })
//         .on("finalMessage", async (message: any = {}) => {
//           try {
//             console.log("done!");
//             await prismaa?.prompt?.create({
//               data: {
//                 content: artifact ?? "",
//                 projectId,
//                 type: "SYSTEM",
//               },
//             });
//           } catch (error: unknown) {
//             console.error("Error saving final message:", error);
//           }
//         })
//         .on("error", (error: unknown) => {
//           console.error("Stream error:", error);
//         });

//       res.json({
//         response: response ?? null,
//         status: "success",
//       });
//     } catch (error: unknown) {
//       const serverError = error as ServerError;
//       console.error("Request error:", serverError);
//       res.status(serverError.status || 500).json({
//         error: "Internal server error",
//         message: serverError.message ?? "An unexpected error occurred",
//       });
//     }
//   }
// );

// const PORT: number = 9091;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // Handle uncaught exceptions
// process.on("uncaughtException", (error: Error) => {
//   console.error("Uncaught Exception:", error);
// });

// // Handle unhandled promise rejections
// process.on(
//   "unhandledRejection",
//   (reason: unknown, promise: Promise<unknown>) => {
//     console.error("Unhandled Rejection at:", promise, "reason:", reason);
//   }
// );
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { prismaa } from "@repo/db/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { systemPrompt } from "./systemPrompt";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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

      // Initialize Gemini client
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        const error: ServerError = new Error(
          "Google API key is not configured"
        );
        error.status = 500;
        throw error;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Create user prompt in database
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
      console.log("allPrompts:", allPrompts);

      // Initialize artifact processor
      const artifactProcessor = new ArtifactProcessor(
        "",
        async (filePath: string, fileContent: string) =>
          await onFileUpdate(filePath, fileContent),
        async (shellCommand: string) => await onShellCommand(shellCommand)
      );
      let artifact: string = "";

      // Prepare chat history for Gemini
      const validPrompts = allPrompts.filter(
        (p) => p.type === "USER" || p.type === "SYSTEM"
      );
      console.log("validPrompts:", validPrompts);

      // Initialize chatHistory as an empty array to prevent undefined
      let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
        validPrompts.map((p: Prompt) => ({
          role: p.type === "USER" ? ("user" as const) : ("model" as const),
          parts: [{ text: p.content }],
        }));
      console.log("chatHistory after map:", chatHistory);

      // Ensure history starts with a 'user' role
      if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
        chatHistory.unshift({
          role: "user" as const,
          parts: [{ text: "Initialize conversation" }],
        });
      }
      console.log("Final chatHistory:", chatHistory);

      // Combine system prompt with the current user prompt
      const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltArtifact> and <boltAction> tags as specified in the artifact instructions.`;

      // Start a chat session with Gemini
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 8000,
        },
      });

      // Stream the response from Gemini
      const result = await chat.sendMessageStream(combinedPrompt);

      // Process the stream
      for await (const chunk of result.stream) {
        const text = chunk.text();
        try {
          console.log("Gemini chunk:", text);
          artifactProcessor.append(text);
          await artifactProcessor.parse();
          artifact += text;
        } catch (error: unknown) {
          console.error("Error processing text stream:", error);
        }
      }

      // Save the final response to the database
      await prismaa?.prompt
        ?.create({
          data: {
            content: artifact ?? "",
            projectId,
            type: "SYSTEM",
          },
        })
        .catch((error: unknown) => {
          console.error("Error saving final message:", error);
        });

      res.json({
        response: artifact,
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
