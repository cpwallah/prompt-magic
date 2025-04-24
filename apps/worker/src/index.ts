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

// imp
// import cors from "cors";
// import express, { Request, Response, NextFunction } from "express";
// import { prismaa } from "@repo/db/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

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

//       // Initialize Gemini client
//       const apiKey = process.env.GOOGLE_API_KEY;
//       if (!apiKey) {
//         const error: ServerError = new Error(
//           "Google API key is not configured"
//         );
//         error.status = 500;
//         throw error;
//       }
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       // Create user prompt in database
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
//       console.log("allPrompts:", allPrompts);

//       // Initialize artifact processor
//       const artifactProcessor = new ArtifactProcessor(
//         "",
//         async (filePath: string, fileContent: string) =>
//           await onFileUpdate(filePath, fileContent),
//         async (shellCommand: string) => await onShellCommand(shellCommand)
//       );
//       let artifact: string = "";

//       // Prepare chat history for Gemini
//       const validPrompts = allPrompts.filter(
//         (p) => p.type === "USER" || p.type === "SYSTEM"
//       );
//       console.log("validPrompts:", validPrompts);

//       // Initialize chatHistory as an empty array to prevent undefined
//       let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
//         validPrompts.map((p: Prompt) => ({
//           role: p.type === "USER" ? ("user" as const) : ("model" as const),
//           parts: [{ text: p.content }],
//         }));
//       console.log("chatHistory after map:", chatHistory);

//       // Ensure history starts with a 'user' role
//       if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
//         chatHistory.unshift({
//           role: "user" as const,
//           parts: [{ text: "Initialize conversation" }],
//         });
//       }
//       console.log("Final chatHistory:", chatHistory);

//       // Combine system prompt with the current user prompt
//       const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltArtifact> and <boltAction> tags as specified in the artifact instructions.`;

//       // Start a chat session with Gemini
//       const chat = model.startChat({
//         history: chatHistory,
//         generationConfig: {
//           maxOutputTokens: 8000,
//         },
//       });

//       // Stream the response from Gemini
//       const result = await chat.sendMessageStream(combinedPrompt);

//       // Process the stream
//       for await (const chunk of result.stream) {
//         const text = chunk.text();
//         try {
//           console.log("Gemini chunk:", text);
//           artifactProcessor.append(text);
//           await artifactProcessor.parse();
//           artifact += text;
//         } catch (error: unknown) {
//           console.error("Error processing text stream:", error);
//         }
//       }

//       // Save the final response to the database
//       await prismaa?.prompt
//         ?.create({
//           data: {
//             content: artifact ?? "",
//             projectId,
//             type: "SYSTEM",
//           },
//         })
//         .catch((error: unknown) => {
//           console.error("Error saving final message:", error);
//         });

//       res.json({
//         response: artifact,
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
// vimp
// import cors from "cors";
// import express, { Request, Response, NextFunction } from "express";
// import { prismaa } from "@repo/db/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

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

//       // Initialize Gemini client
//       const apiKey = process.env.GOOGLE_API_KEY;
//       if (!apiKey) {
//         const error: ServerError = new Error(
//           "Google API key is not configured"
//         );
//         error.status = 500;
//         throw error;
//       }
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       // Create user prompt in database
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
//       console.log("allPrompts:", allPrompts);

//       // Initialize artifact processor with projectId
//       const artifactProcessor = new ArtifactProcessor(
//         "",
//         projectId,
//         async (filePath: string, fileContent: string, projectId: string) =>
//           await onFileUpdate(filePath, fileContent, projectId),
//         async (shellCommand: string, projectId: string) =>
//           await onShellCommand(shellCommand, projectId)
//       );
//       let artifact: string = "";

//       // Prepare chat history for Gemini
//       const validPrompts = allPrompts.filter(
//         (p) => p.type === "USER" || p.type === "SYSTEM"
//       );
//       console.log("validPrompts:", validPrompts);

//       // Initialize chatHistory as an empty array to prevent undefined
//       let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
//         validPrompts.map((p: Prompt) => ({
//           role: p.type === "USER" ? ("user" as const) : ("model" as const),
//           parts: [{ text: p.content }],
//         }));
//       console.log("chatHistory after map:", chatHistory);

//       // Ensure history starts with a 'user' role
//       if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
//         chatHistory.unshift({
//           role: "user" as const,
//           parts: [{ text: "Initialize conversation" }],
//         });
//       }
//       console.log("Final chatHistory:", chatHistory);

//       // Combine system prompt with the current user prompt
//       const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltArtifact> and <boltAction> tags as specified in the artifact instructions.`;

//       // Start a chat session with Gemini
//       const chat = model.startChat({
//         history: chatHistory,
//         generationConfig: {
//           maxOutputTokens: 8000,
//         },
//       });

//       // Stream the response from Gemini
//       const result = await chat.sendMessageStream(combinedPrompt);

//       // Process the stream
//       for await (const chunk of result.stream) {
//         const text = chunk.text();
//         try {
//           console.log("Gemini chunk:", text);
//           artifactProcessor.append(text);
//           await artifactProcessor.parse();
//           artifact += text;
//         } catch (error: unknown) {
//           console.error("Error processing text stream:", error);
//         }
//       }

//       // Save the final response to the database
//       await prismaa?.prompt
//         ?.create({
//           data: {
//             content: artifact ?? "",
//             projectId,
//             type: "SYSTEM",
//           },
//         })
//         .catch((error: unknown) => {
//           console.error("Error saving final message:", error);
//         });

//       res.json({
//         response: artifact,
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

// vimp
// import cors from "cors";
// import express, { Request, Response, NextFunction } from "express";
// import { prismaa } from "@repo/db/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";
// import dotenv from "dotenv";
// import { promises as fs } from "fs";
// import { join } from "path";

// dotenv.config();

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

// const BASE_WORKER_DIR = join(
//   "C:",
//   "Users",
//   "swaini negi",
//   "AppData",
//   "Local",
//   "Temp",
//   "bolty-worker"
// );

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error("Server error:", err);
//   res.status(500).json({
//     error: "Internal server error",
//     message: err.message,
//   });
// });

// app.post("/project", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { prompt } = req.body;
//     const userId = req.headers.authorization?.split("Bearer ")[1];
//     if (!userId) {
//       res.status(401).json({ error: "User not authenticated" });
//       return;
//     }

//     let project = await prismaa.project.findFirst({
//       where: { userId },
//     });

//     if (!project) {
//       project = await prismaa.project.create({
//         data: {
//           description: prompt,
//           userId,
//         },
//       });
//     } else {
//       project = await prismaa.project.update({
//         where: { id: project.id },
//         data: { description: prompt },
//       });
//     }

//     res.json({ projectId: project.id });
//   } catch (error: unknown) {
//     console.error("Error creating/updating project:", error);
//     res.status(500).json({ error: "Failed to create/update project" });
//   }
// });

// app.get(
//   "/prompts/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const prompts = await prismaa.prompt.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched prompts for project ${projectId}:`, prompts);
//       res.json({ prompts });
//     } catch (error: unknown) {
//       console.error("Error fetching prompts:", error);
//       res.status(500).json({ error: "Failed to fetch prompts" });
//     }
//   }
// );

// app.get(
//   "/actions/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const actions = await prismaa.action.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched actions for project ${projectId}:`, actions);
//       res.json({ actions });
//     } catch (error: unknown) {
//       console.error("Error fetching actions:", error);
//       res.status(500).json({ error: "Failed to fetch actions" });
//     }
//   }
// );

// app.get(
//   "/files/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       const dir = join(BASE_WORKER_DIR, projectId!, "app");
//       try {
//         const files = await fs.readdir(dir);
//         res.json({ files });
//       } catch (error: any) {
//         res.json({
//           files: [],
//           error: `Failed to read directory: ${error.message}`,
//         });
//       }
//     } catch (error: unknown) {
//       console.error("Error fetching files:", error);
//       res.status(500).json({ error: "Failed to fetch files" });
//     }
//   }
// );

// app.post(
//   "/prompt",
//   async (
//     req: Request<{}, {}, PromptRequestBody>,
//     res: Response
//   ): Promise<void> => {
//     try {
//       console.log("Received /prompt request:", req.body);
//       const { prompt, userId, projectId } = req.body ?? {};
//       if (!prompt || !userId || !projectId) {
//         res.status(400).json({
//           error: "Missing required fields: prompt, userId, projectId",
//         });
//         return;
//       }

//       const apiKey = process.env.GOOGLE_API_KEY;
//       if (!apiKey) {
//         res.status(500).json({ error: "Google API key is not configured" });
//         return;
//       }
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       const projectDir = join(BASE_WORKER_DIR, projectId);
//       try {
//         await fs.rm(projectDir, { recursive: true, force: true });
//         await fs.mkdir(projectDir, { recursive: true });
//         console.log(`Cleared previous files in ${projectDir}`);
//       } catch (error: any) {
//         console.error(
//           `Failed to clear directory ${projectDir}:`,
//           error.message
//         );
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: prompt,
//           projectId,
//           type: "USER",
//         },
//       });

//       const allPrompts: Prompt[] =
//         (await prismaa.prompt.findMany({
//           where: { projectId },
//           orderBy: { createdAt: "asc" },
//         })) ?? [];
//       console.log("allPrompts:", allPrompts);

//       const artifactProcessor = new ArtifactProcessor(
//         "",
//         projectId,
//         async (filePath: string, fileContent: string, projectId: string) => {
//           console.log(
//             `Processing file update for ${filePath} in project ${projectId}`
//           );
//           try {
//             await onFileUpdate(filePath, fileContent, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `File updated: ${filePath}\n${fileContent}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for file ${filePath}:`, action);
//           } catch (error: any) {
//             console.error(`Failed to process file ${filePath}:`, error.message);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed to update file: ${filePath}\n${fileContent}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed file ${filePath}:`, action);
//           }
//         },
//         async (shellCommand: string, projectId: string) => {
//           console.log(
//             `Processing shell command for project ${projectId}: ${shellCommand}`
//           );
//           try {
//             let modifiedCommand = shellCommand;
//             if (shellCommand.includes("pnpm install")) {
//               modifiedCommand = shellCommand.replace(
//                 "pnpm install",
//                 "pnpm install --no-workspace"
//               );
//             }
//             await onShellCommand(modifiedCommand, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Shell command: ${modifiedCommand}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for shell command:`, action);

//             // Log the contents of node_modules/expo after installation
//             if (modifiedCommand.includes("pnpm install --no-workspace")) {
//               const expoDir = join(projectDir, "node_modules", "expo");
//               try {
//                 const files = await fs.readdir(expoDir);
//                 console.log(`Contents of node_modules/expo:`, files);
//                 const appEntryExists = files.includes("AppEntry.js");
//                 console.log(
//                   `AppEntry.js exists in node_modules/expo: ${appEntryExists}`
//                 );
//               } catch (error: any) {
//                 console.error(
//                   `Failed to read node_modules/expo:`,
//                   error.message
//                 );
//               }
//             }
//           } catch (error: any) {
//             console.error(
//               `Failed to process shell command: ${shellCommand}:`,
//               error.message
//             );
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed shell command: ${shellCommand}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed shell command:`, action);
//           }
//         }
//       );
//       let artifact: string = "";

//       const validPrompts = allPrompts.filter(
//         (p) => p.type === "USER" || p.type === "SYSTEM"
//       );
//       console.log("validPrompts:", validPrompts);

//       let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
//         validPrompts.map((p: Prompt) => ({
//           role: p.type === "USER" ? ("user" as const) : ("model" as const),
//           parts: [{ text: p.content }],
//         }));
//       console.log("chatHistory after map:", chatHistory);

//       if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
//         chatHistory.unshift({
//           role: "user" as const,
//           parts: [{ text: "Initialize conversation" }],
//         });
//       }
//       console.log("Final chatHistory:", chatHistory);

//       const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltArtifact> and <boltAction> tags as specified in the artifact instructions.`;

//       const chat = model.startChat({
//         history: chatHistory,
//         generationConfig: {
//           maxOutputTokens: 8000,
//         },
//       });

//       const result = await chat.sendMessageStream(combinedPrompt);

//       for await (const chunk of result.stream) {
//         const text = chunk.text();
//         try {
//           console.log("Gemini chunk:", text);
//           artifactProcessor.append(text);
//           await artifactProcessor.parse();
//           artifact += text;
//         } catch (error: unknown) {
//           console.error("Error processing text stream:", error);
//         }
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: artifact ?? "",
//           projectId,
//           type: "SYSTEM",
//         },
//       });

//       // Run npx expo start --tunnel after all actions are processed
//       try {
//         console.log(`Running npx expo start --tunnel for project ${projectId}`);
//         await onShellCommand("npx expo start --tunnel", projectId);
//         const action = await prismaa.action.create({
//           data: {
//             content: "Shell command: npx expo start --tunnel",
//             projectId,
//           },
//         });
//         console.log(`Stored action for npx expo start --tunnel:`, action);
//       } catch (error: any) {
//         console.error(
//           `Failed to run npx expo start --tunnel for project ${projectId}:`,
//           error.message
//         );
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell command: npx expo start --tunnel\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(
//           `Stored action for failed npx expo start --tunnel:`,
//           action
//         );
//       }

//       res.json({
//         response: artifact,
//         status: "success",
//       });
//     } catch (error: unknown) {
//       console.error("Request error:", error);
//       res.status(500).json({
//         error: "Internal server error",
//         message: (error as Error).message ?? "An unexpected error occurred",
//       });
//     }
//   }
// );

// const PORT: number = 9091;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// process.on("uncaughtException", (error: Error) => {
//   console.error("Uncaught Exception:", error);
// });

// process.on(
//   "unhandledRejection",
//   (reason: unknown, promise: Promise<unknown>) => {
//     console.error("Unhandled Rejection at:", promise, "reason:", reason);
//   }
// );

// swaini
// import cors from "cors";
// import express, { Request, Response, NextFunction } from "express";
// import { prismaa } from "@repo/db/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";
// import dotenv from "dotenv";
// import { promises as fs } from "fs";
// import { join } from "path";

// dotenv.config();

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

// const BASE_WORKER_DIR = join(
//   "C:",
//   "Users",
//   "swaini negi",
//   "AppData",
//   "Local",
//   "Temp",
//   "bolty-worker"
// );

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error("Server error:", err);
//   res.status(500).json({
//     error: "Internal server error",
//     message: err.message,
//   });
// });

// app.post("/project", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { prompt } = req.body;
//     const userId = req.headers.authorization?.split("Bearer ")[1];
//     if (!userId) {
//       res.status(401).json({ error: "User not authenticated" });
//       return;
//     }

//     let project = await prismaa.project.findFirst({
//       where: { userId },
//     });

//     if (!project) {
//       project = await prismaa.project.create({
//         data: {
//           description: prompt,
//           userId,
//         },
//       });
//     } else {
//       project = await prismaa.project.update({
//         where: { id: project.id },
//         data: { description: prompt },
//       });
//     }

//     res.json({ projectId: project.id });
//   } catch (error: unknown) {
//     console.error("Error creating/updating project:", error);
//     res.status(500).json({ error: "Failed to create/update project" });
//   }
// });

// app.get(
//   "/prompts/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const prompts = await prismaa.prompt.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched prompts for project ${projectId}:`, prompts);
//       res.json({ prompts });
//     } catch (error: unknown) {
//       console.error("Error fetching prompts:", error);
//       res.status(500).json({ error: "Failed to fetch prompts" });
//     }
//   }
// );

// app.get(
//   "/actions/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const actions = await prismaa.action.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched actions for project ${projectId}:`, actions);
//       res.json({ actions });
//     } catch (error: unknown) {
//       console.error("Error fetching actions:", error);
//       res.status(500).json({ error: "Failed to fetch actions" });
//     }
//   }
// );

// app.get(
//   "/files/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       const dir = join(BASE_WORKER_DIR, projectId!, "app");
//       try {
//         const files = await fs.readdir(dir);
//         res.json({ files });
//       } catch (error: any) {
//         res.json({
//           files: [],
//           error: `Failed to read directory: ${error.message}`,
//         });
//       }
//     } catch (error: unknown) {
//       console.error("Error fetching files:", error);
//       res.status(500).json({ error: "Failed to fetch files" });
//     }
//   }
// );

// app.post(
//   "/prompt",
//   async (
//     req: Request<{}, {}, PromptRequestBody>,
//     res: Response
//   ): Promise<void> => {
//     try {
//       console.log("Received /prompt request:", req.body);
//       const { prompt, userId, projectId } = req.body ?? {};
//       if (!prompt || !userId || !projectId) {
//         res.status(400).json({
//           error: "Missing required fields: prompt, userId, projectId",
//         });
//         return;
//       }

//       const apiKey = process.env.GOOGLE_API_KEY;
//       if (!apiKey) {
//         res.status(500).json({ error: "Google API key is not configured" });
//         return;
//       }
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       // Step 1: Clear all files in BASE_WORKER_DIR
//       try {
//         await fs.rm(BASE_WORKER_DIR, { recursive: true, force: true });
//         await fs.mkdir(BASE_WORKER_DIR, { recursive: true });
//         console.log(`Cleared all files in ${BASE_WORKER_DIR}`);
//       } catch (error: any) {
//         console.error(
//           `Failed to clear directory ${BASE_WORKER_DIR}:`,
//           error.message
//         );
//       }

//       // Step 2: Source .bashrc and ensure pnpm and node are installed
//       try {
//         console.log("Sourcing .bashrc and installing pnpm and node if missing");
//         await onShellCommand(
//           `bash -c "source ~/.bashrc && command -v node || (apt-get update && apt-get install -y nodejs) && command -v pnpm || npm install -g pnpm"`,
//           projectId
//         );
//         const setupAction = await prismaa.action.create({
//           data: {
//             content:
//               "Shell command: Source .bashrc and install node/pnpm if missing",
//             projectId,
//           },
//         });
//         console.log(`Stored action for environment setup:`, setupAction);
//       } catch (error: any) {
//         console.error(`Failed to set up environment:`, error.message);
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell command: Environment setup\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for failed environment setup:`, action);
//       }

//       // Step 3: Run pnpm dlx create-expo@latest in BASE_WORKER_DIR
//       try {
//         console.log(
//           `Running pnpm dlx create-expo@latest in ${BASE_WORKER_DIR}`
//         );
//         await onShellCommand(
//           `bash -c "source ~/.bashrc && cd ${BASE_WORKER_DIR} && pnpm dlx create-expo@latest chess-app --template blank-typescript --no-install"`,
//           projectId
//         );
//         const createAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: pnpm dlx create-expo@latest chess-app --template blank-typescript --no-install`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for create-expo:`, createAction);
//       } catch (error: any) {
//         console.error(
//           `Failed to run pnpm dlx create-expo@latest:`,
//           error.message
//         );
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell command: pnpm dlx create-expo@latest\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for failed create-expo:`, action);
//       }

//       // Step 4: Create projectId folder and move the Expo project files into it
//       const projectDir = join(BASE_WORKER_DIR, projectId);
//       try {
//         await fs.mkdir(projectDir, { recursive: true });
//         const expoDir = join(BASE_WORKER_DIR, "chess-app");
//         const files = await fs.readdir(expoDir);
//         for (const file of files) {
//           await fs.rename(join(expoDir, file), join(projectDir, file));
//         }
//         await fs.rm(expoDir, { recursive: true, force: true });
//         console.log(`Moved Expo project files to ${projectDir}`);
//       } catch (error: any) {
//         console.error(
//           `Failed to set up project directory ${projectDir}:`,
//           error.message
//         );
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: prompt,
//           projectId,
//           type: "USER",
//         },
//       });

//       const allPrompts: Prompt[] =
//         (await prismaa.prompt.findMany({
//           where: { projectId },
//           orderBy: { createdAt: "asc" },
//         })) ?? [];
//       console.log("allPrompts:", allPrompts);

//       const artifactProcessor = new ArtifactProcessor(
//         "",
//         projectId,
//         async (filePath: string, fileContent: string, projectId: string) => {
//           console.log(
//             `Processing file update for ${filePath} in project ${projectId}`
//           );
//           try {
//             await onFileUpdate(filePath, fileContent, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `File updated: ${filePath}\n${fileContent}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for file ${filePath}:`, action);
//           } catch (error: any) {
//             console.error(`Failed to process file ${filePath}:`, error.message);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed to update file: ${filePath}\n${fileContent}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed file ${filePath}:`, action);
//           }
//         },
//         async (shellCommand: string, projectId: string) => {
//           console.log(
//             `Processing shell command for project ${projectId}: ${shellCommand}`
//           );
//           try {
//             let modifiedCommand = shellCommand;
//             if (shellCommand.includes("pnpm install")) {
//               modifiedCommand = shellCommand.replace(
//                 "pnpm install",
//                 "pnpm install --no-workspace"
//               );
//             }
//             await onShellCommand(modifiedCommand, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Shell command: ${modifiedCommand}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for shell command:`, action);

//             // Log the contents of node_modules/expo after installation
//             if (modifiedCommand.includes("pnpm install --no-workspace")) {
//               const expoDir = join(projectDir, "node_modules", "expo");
//               try {
//                 const files = await fs.readdir(expoDir);
//                 console.log(`Contents of node_modules/expo:`, files);
//                 const appEntryExists = files.includes("AppEntry.js");
//                 console.log(
//                   `AppEntry.js exists in node_modules/expo: ${appEntryExists}`
//                 );
//               } catch (error: any) {
//                 console.error(
//                   `Failed to read node_modules/expo:`,
//                   error.message
//                 );
//               }
//             }
//           } catch (error: any) {
//             console.error(
//               `Failed to process shell command: ${shellCommand}:`,
//               error.message
//             );
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed shell command: ${shellCommand}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed shell command:`, action);
//           }
//         }
//       );
//       let artifact: string = "";

//       const validPrompts = allPrompts.filter(
//         (p) => p.type === "USER" || p.type === "SYSTEM"
//       );
//       console.log("validPrompts:", validPrompts);

//       let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
//         validPrompts.map((p: Prompt) => ({
//           role: p.type === "USER" ? ("user" as const) : ("model" as const),
//           parts: [{ text: p.content }],
//         }));
//       console.log("chatHistory after map:", chatHistory);

//       if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
//         chatHistory.unshift({
//           role: "user" as const,
//           parts: [{ text: "Initialize conversation" }],
//         });
//       }
//       console.log("Final chatHistory:", chatHistory);

//       const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltArtifact> and <boltAction> tags as specified in the artifact instructions.`;

//       const chat = model.startChat({
//         history: chatHistory,
//         generationConfig: {
//           maxOutputTokens: 8000,
//         },
//       });

//       const result = await chat.sendMessageStream(combinedPrompt);

//       for await (const chunk of result.stream) {
//         const text = chunk.text();
//         try {
//           console.log("Gemini chunk:", text);
//           artifactProcessor.append(text);
//           await artifactProcessor.parse();
//           artifact += text;
//         } catch (error: unknown) {
//           console.error("Error processing text stream:", error);
//         }
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: artifact ?? "",
//           projectId,
//           type: "SYSTEM",
//         },
//       });

//       // Step 5: Run pnpm i and pnpm expo start --tunnel in the projectId directory with .bashrc sourced
//       try {
//         console.log(
//           `Running pnpm i --no-workspace in ${projectDir} for project ${projectId}`
//         );
//         await onShellCommand(
//           `bash -c "source ~/.bashrc && cd ${projectDir} && pnpm i --no-workspace"`,
//           projectId
//         );
//         const installAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: source ~/.bashrc && cd ${projectDir} && pnpm i --no-workspace`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm i --no-workspace:`, installAction);

//         console.log(
//           `Running pnpm expo start --tunnel in ${projectDir} for project ${projectId}`
//         );
//         await onShellCommand(
//           `bash -c "source ~/.bashrc && cd ${projectDir} && pnpm expo start --tunnel --port 8081"`,
//           projectId
//         );
//         const startAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: source ~/.bashrc && cd ${projectDir} && pnpm expo start --tunnel --port 8081`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm expo start --tunnel:`, startAction);
//       } catch (error: any) {
//         console.error(
//           `Failed to run pnpm commands in ${projectDir} for project ${projectId}:`,
//           error.message
//         );
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell commands: source ~/.bashrc && cd ${projectDir} && pnpm i --no-workspace && pnpm expo start --tunnel --port 8081\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for failed pnpm commands:`, action);
//       }

//       res.json({
//         response: artifact,
//         status: "success",
//       });
//     } catch (error: unknown) {
//       console.error("Request error:", error);
//       res.status(500).json({
//         error: "Internal server error",
//         message: (error as Error).message ?? "An unexpected error occurred",
//       });
//     }
//   }
// );

// const PORT: number = 9091;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// process.on("uncaughtException", (error: Error) => {
//   console.error("Uncaught Exception:", error);
// });

// process.on(
//   "unhandledRejection",
//   (reason: unknown, promise: Promise<unknown>) => {
//     console.error("Unhandled Rejection at:", promise, "reason:", reason);
//   }
// );

// anjanas
// import cors from "cors";
// import express, { Request, Response, NextFunction } from "express";
// import { prismaa } from "@repo/db/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";
// import dotenv from "dotenv";
// import { promises as fs } from "fs";
// import { join } from "path";

// dotenv.config();

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

// const BASE_WORKER_DIR = join(
//   "C:",
//   "Users",
//   "swaini negi",
//   "AppData",
//   "Local",
//   "Temp",
//   "bolty-worker"
// );

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error("Server error:", err);
//   res.status(500).json({
//     error: "Internal server error",
//     message: err.message,
//   });
// });

// app.post("/project", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { prompt } = req.body;
//     const userId = req.headers.authorization?.split("Bearer ")[1];
//     if (!userId) {
//       res.status(401).json({ error: "User not authenticated" });
//       return;
//     }

//     let project = await prismaa.project.findFirst({
//       where: { userId },
//     });

//     if (!project) {
//       project = await prismaa.project.create({
//         data: {
//           description: prompt,
//           userId,
//         },
//       });
//     } else {
//       project = await prismaa.project.update({
//         where: { id: project.id },
//         data: { description: prompt },
//       });
//     }

//     res.json({ projectId: project.id });
//   } catch (error: unknown) {
//     console.error("Error creating/updating project:", error);
//     res.status(500).json({ error: "Failed to create/update project" });
//   }
// });

// app.get(
//   "/prompts/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const prompts = await prismaa.prompt.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched prompts for project ${projectId}:`, prompts);
//       res.json({ prompts });
//     } catch (error: unknown) {
//       console.error("Error fetching prompts:", error);
//       res.status(500).json({ error: "Failed to fetch prompts" });
//     }
//   }
// );

// app.get(
//   "/actions/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const actions = await prismaa.action.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched actions for project ${projectId}:`, actions);
//       res.json({ actions });
//     } catch (error: unknown) {
//       console.error("Error fetching actions:", error);
//       res.status(500).json({ error: "Failed to fetch actions" });
//     }
//   }
// );

// app.get(
//   "/files/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       const dir = join(BASE_WORKER_DIR, projectId!, "app");
//       try {
//         const files = await fs.readdir(dir);
//         res.json({ files });
//       } catch (error: any) {
//         res.json({
//           files: [],
//           error: `Failed to read directory: ${error.message}`,
//         });
//       }
//     } catch (error: unknown) {
//       console.error("Error fetching files:", error);
//       res.status(500).json({ error: "Failed to fetch files" });
//     }
//   }
// );

// app.post(
//   "/prompt",
//   async (
//     req: Request<{}, {}, PromptRequestBody>,
//     res: Response
//   ): Promise<void> => {
//     try {
//       console.log("Received /prompt request:", req.body);
//       const { prompt, userId, projectId } = req.body ?? {};
//       if (!prompt || !userId || !projectId) {
//         res.status(400).json({
//           error: "Missing required fields: prompt, userId, projectId",
//         });
//         return;
//       }

//       const apiKey = process.env.GOOGLE_API_KEY;
//       if (!apiKey) {
//         res.status(500).json({ error: "Google API key is not configured" });
//         return;
//       }
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       // Step 1: Clear all files in BASE_WORKER_DIR
//       try {
//         await fs.rm(BASE_WORKER_DIR, { recursive: true, force: true });
//         await fs.mkdir(BASE_WORKER_DIR, { recursive: true });
//         console.log(`Cleared all files in ${BASE_WORKER_DIR}`);
//       } catch (error: any) {
//         console.error(
//           `Failed to clear directory ${BASE_WORKER_DIR}:`,
//           error.message
//         );
//       }

//       // Step 2: Run pnpm dlx create-expo@latest directly in projectDir
//       const projectDir = join(BASE_WORKER_DIR, projectId);
//       try {
//         await fs.mkdir(projectDir, { recursive: true });
//         console.log(`Running pnpm dlx create-expo@latest in ${projectDir}`);
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd dlx create-expo@latest . --template blank-typescript`,
//           projectId
//         );
//         const createAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: pnpm.cmd dlx create-expo@latest . --template blank-typescript`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for create-expo:`, createAction);

//         // Step 3: Run pnpm i immediately to install dependencies
//         console.log(`Running pnpm i in ${projectDir} for project ${projectId}`);
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd i`,
//           projectId
//         );
//         const installAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: cd ${projectDir} && pnpm.cmd i`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm i:`, installAction);
//       } catch (error: any) {
//         console.error(
//           `Failed to run pnpm dlx create-expo@latest or pnpm i:`,
//           error.message
//         );
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell command: pnpm.cmd dlx create-expo@latest . --template blank-typescript && pnpm.cmd i\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for failed create-expo:`, action);
//         throw error;
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: prompt,
//           projectId,
//           type: "USER",
//         },
//       });

//       const allPrompts: Prompt[] =
//         (await prismaa.prompt.findMany({
//           where: { projectId },
//           orderBy: { createdAt: "asc" },
//         })) ?? [];
//       console.log("allPrompts:", allPrompts);

//       const artifactProcessor = new ArtifactProcessor(
//         "",
//         projectId,
//         async (filePath: string, fileContent: string, projectId: string) => {
//           console.log(
//             `Processing file update for ${filePath} in project ${projectId}`
//           );
//           try {
//             await onFileUpdate(filePath, fileContent, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `File updated: ${filePath}\n${fileContent}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for file ${filePath}:`, action);
//           } catch (error: any) {
//             console.error(`Failed to process file ${filePath}:`, error.message);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed to update file: ${filePath}\n${fileContent}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed file ${filePath}:`, action);
//           }
//         },
//         async (shellCommand: string, projectId: string) => {
//           console.log(
//             `Processing shell command for project ${projectId}: ${shellCommand}`
//           );
//           try {
//             let modifiedCommand = shellCommand;
//             if (shellCommand.includes("pnpm install")) {
//               modifiedCommand = shellCommand.replace(
//                 "pnpm install",
//                 "pnpm.cmd install --no-workspace"
//               );
//             }
//             await onShellCommand(modifiedCommand, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Shell command: ${modifiedCommand}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for shell command:`, action);

//             if (modifiedCommand.includes("pnpm.cmd install --no-workspace")) {
//               const expoDir = join(projectDir, "node_modules", "expo");
//               try {
//                 const files = await fs.readdir(expoDir);
//                 console.log(`Contents of node_modules/expo:`, files);
//                 const appEntryExists = files.includes("AppEntry.js");
//                 console.log(
//                   `AppEntry.js exists in node_modules/expo: ${appEntryExists}`
//                 );
//               } catch (error: any) {
//                 console.error(
//                   `Failed to read node_modules/expo:`,
//                   error.message
//                 );
//               }
//             }
//           } catch (error: any) {
//             console.error(
//               `Failed to process shell command: ${shellCommand}:`,
//               error.message
//             );
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed shell command: ${shellCommand}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed shell command:`, action);
//           }
//         }
//       );
//       let artifact: string = "";

//       const validPrompts = allPrompts.filter(
//         (p) => p.type === "USER" || p.type === "SYSTEM"
//       );
//       console.log("validPrompts:", validPrompts);

//       let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
//         validPrompts.map((p: Prompt) => ({
//           role: p.type === "USER" ? ("user" as const) : ("model" as const),
//           parts: [{ text: p.content }],
//         }));
//       console.log("chatHistory after map:", chatHistory);

//       if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
//         chatHistory.unshift({
//           role: "user" as const,
//           parts: [{ text: "Initialize conversation" }],
//         });
//       }
//       console.log("Final chatHistory:", chatHistory);

//       const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltAction> tags. The prompt can be for any app type (e.g., chess, blog, todo list), and update only the necessary files and dependencies accordingly. For new projects, the base Expo setup is already done.`;

//       const chat = model.startChat({
//         history: chatHistory,
//         generationConfig: {
//           maxOutputTokens: 8000,
//         },
//       });

//       const result = await chat.sendMessageStream(combinedPrompt);

//       for await (const chunk of result.stream) {
//         const text = chunk.text();
//         try {
//           console.log("Gemini chunk:", text);
//           artifactProcessor.append(text);
//           await artifactProcessor.parse();
//           artifact += text;
//         } catch (error: unknown) {
//           console.error("Error processing text stream:", error);
//         }
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: artifact ?? "",
//           projectId,
//           type: "SYSTEM",
//         },
//       });

//       // Step 4: Run pnpm i again (after file updates) and pnpm expo start --tunnel
//       try {
//         console.log(
//           `Running pnpm i --no-workspace in ${projectDir} for project ${projectId}`
//         );
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd i --no-workspace`,
//           projectId
//         );
//         const installAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: cd ${projectDir} && pnpm.cmd i --no-workspace`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm i --no-workspace:`, installAction);

//         console.log(
//           `Running pnpm expo start --tunnel in ${projectDir} for project ${projectId}`
//         );
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd expo start --tunnel --port 8081`,
//           projectId
//         );
//         const startAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: cd ${projectDir} && pnpm.cmd expo start --tunnel --port 8081`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm expo start --tunnel:`, startAction);
//       } catch (error: any) {
//         console.error(
//           `Failed to run pnpm commands in ${projectDir} for project ${projectId}:`,
//           error.message
//         );
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell commands: cd ${projectDir} && pnpm.cmd i --no-workspace && pnpm.cmd expo start --tunnel --port 8081\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for failed pnpm commands:`, action);
//       }

//       res.json({
//         response: artifact,
//         status: "success",
//       });
//     } catch (error: unknown) {
//       console.error("Request error:", error);
//       res.status(500).json({
//         error: "Internal server error",
//         message: (error as Error).message ?? "An unexpected error occurred",
//       });
//     }
//   }
// );

// const PORT: number = 9091;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// process.on("uncaughtException", (error: Error) => {
//   console.error("Uncaught Exception:", error);
// });

// process.on(
//   "unhandledRejection",
//   (reason: unknown, promise: Promise<unknown>) => {
//     console.error("Unhandled Rejection at:", promise, "reason:", reason);
//   }
// );

// noiceee
// import cors from "cors";
// import express, { Request, Response, NextFunction } from "express";
// import { prismaa } from "@repo/db/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { systemPrompt } from "./systemPrompt";
// import { ArtifactProcessor } from "./parser";
// import { onFileUpdate, onShellCommand } from "./os";
// import dotenv from "dotenv";
// import { promises as fs } from "fs";
// import { join } from "path";

// // Define a type for package.json content
// interface PackageJson {
//   dependencies?: Record<string, string>;
//   devDependencies?: Record<string, string>;
//   [key: string]: any;
// }

// dotenv.config();

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

// const BASE_WORKER_DIR = join(
//   "C:",
//   "Users",
//   "swaini negi",
//   "AppData",
//   "Local",
//   "Temp",
//   "bolty-worker"
// );

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error("Server error:", err);
//   res.status(500).json({
//     error: "Internal server error",
//     message: err.message,
//   });
// });

// app.post("/project", async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { prompt } = req.body;
//     const userId = req.headers.authorization?.split("Bearer ")[1];
//     if (!userId) {
//       res.status(401).json({ error: "User not authenticated" });
//       return;
//     }

//     let project = await prismaa.project.findFirst({
//       where: { userId },
//     });

//     if (!project) {
//       project = await prismaa.project.create({
//         data: {
//           description: prompt,
//           userId,
//         },
//       });
//     } else {
//       project = await prismaa.project.update({
//         where: { id: project.id },
//         data: { description: prompt },
//       });
//     }

//     res.json({ projectId: project.id });
//   } catch (error: unknown) {
//     console.error("Error creating/updating project:", error);
//     res.status(500).json({ error: "Failed to create/update project" });
//   }
// });

// app.get(
//   "/prompts/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const prompts = await prismaa.prompt.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched prompts for project ${projectId}:`, prompts);
//       res.json({ prompts });
//     } catch (error: unknown) {
//       console.error("Error fetching prompts:", error);
//       res.status(500).json({ error: "Failed to fetch prompts" });
//     }
//   }
// );

// app.get(
//   "/actions/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       if (!projectId) {
//         res.status(400).json({ error: "projectId is required" });
//         return;
//       }

//       const actions = await prismaa.action.findMany({
//         where: { projectId },
//         orderBy: { createdAt: "asc" },
//       });

//       console.log(`Fetched actions for project ${projectId}:`, actions);
//       res.json({ actions });
//     } catch (error: unknown) {
//       console.error("Error fetching actions:", error);
//       res.status(500).json({ error: "Failed to fetch actions" });
//     }
//   }
// );

// app.get(
//   "/files/:projectId",
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { projectId } = req.params;
//       const dir = join(BASE_WORKER_DIR, projectId!);
//       try {
//         const files = await fs.readdir(dir);
//         res.json({ files });
//       } catch (error: any) {
//         res.json({
//           files: [],
//           error: `Failed to read directory: ${error.message}`,
//         });
//       }
//     } catch (error: unknown) {
//       console.error("Error fetching files:", error);
//       res.status(500).json({ error: "Failed to fetch files" });
//     }
//   }
// );

// app.post(
//   "/prompt",
//   async (
//     req: Request<{}, {}, PromptRequestBody>,
//     res: Response
//   ): Promise<void> => {
//     try {
//       console.log("Received /prompt request:", req.body);
//       const { prompt, userId, projectId } = req.body ?? {};
//       if (!prompt || !userId || !projectId) {
//         res.status(400).json({
//           error: "Missing required fields: prompt, userId, projectId",
//         });
//         return;
//       }

//       const apiKey = process.env.GOOGLE_API_KEY;
//       if (!apiKey) {
//         res.status(500).json({ error: "Google API key is not configured" });
//         return;
//       }
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//       // Step 1: Clear all files in BASE_WORKER_DIR
//       try {
//         await fs.rm(BASE_WORKER_DIR, { recursive: true, force: true });
//         await fs.mkdir(BASE_WORKER_DIR, { recursive: true });
//         console.log(`Cleared all files in ${BASE_WORKER_DIR}`);
//       } catch (error: any) {
//         console.error(
//           `Failed to clear directory ${BASE_WORKER_DIR}:`,
//           error.message
//         );
//       }

//       // Step 2: Run pnpm dlx create-expo@latest directly in projectDir
//       const projectDir = join(BASE_WORKER_DIR, projectId);
//       try {
//         await fs.mkdir(projectDir, { recursive: true });
//         console.log(`Running pnpm dlx create-expo@latest in ${projectDir}`);
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd dlx create-expo@latest . --template blank-typescript`,
//           projectId
//         );
//         const createAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: pnpm.cmd dlx create-expo@latest . --template blank-typescript`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for create-expo:`, createAction);

//         // Step 3: Ensure react-native-web and related dependencies are installed
//         console.log(`Running pnpm i in ${projectDir} for project ${projectId}`);
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd i`,
//           projectId
//         );
//         const installAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: cd ${projectDir} && pnpm.cmd i`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm i:`, installAction);

//         // Step 4: Force update App.tsx with Note-Taking App as default
//         const appTsxContent = `
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, TextInput, Button, FlatList } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type Note = {
//   id: string;
//   content: string;
//   timestamp: string;
// };

// export default function App() {
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [inputText, setInputText] = useState('');

//   useEffect(() => {
//     const loadNotes = async () => {
//       try {
//         const storedNotes = await AsyncStorage.getItem('notes');
//         if (storedNotes) setNotes(JSON.parse(storedNotes));
//       } catch (error) {
//         console.error('Error loading notes:', error);
//       }
//     };
//     loadNotes();
//   }, []);

//   useEffect(() => {
//     const saveNotes = async () => {
//       try {
//         await AsyncStorage.setItem('notes', JSON.stringify(notes));
//       } catch (error) {
//         console.error('Error saving notes:', error);
//       }
//     };
//     saveNotes();
//   }, [notes]);

//   const addNote = () => {
//     if (inputText.trim()) {
//       const newNote: Note = { id: Date.now().toString(), content: inputText, timestamp: new Date().toLocaleString() };
//       setNotes([...notes, newNote]);
//       setInputText('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Note-Taking App</Text>
//       <View style={styles.inputContainer}>
//         <TextInput style={styles.input} value={inputText} onChangeText={setInputText} placeholder="Write a note..." multiline />
//         <Button title="Save" onPress={addNote} />
//       </View>
//       <FlatList
//         data={notes}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.noteItem}>
//             <Text style={styles.noteContent}>{item.content}</Text>
//             <Text style={styles.noteTimestamp}>{item.timestamp}</Text>
//           </View>
//         )}
//         style={styles.list}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   inputContainer: { marginBottom: 20 },
//   input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, minHeight: 100, marginBottom: 10 },
//   list: { flex: 1 },
//   noteItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   noteContent: { fontSize: 16 },
//   noteTimestamp: { fontSize: 12, color: '#666', marginTop: 5 },
// });
//         `;
//         await onFileUpdate("App.tsx", appTsxContent, projectId);
//         const appUpdateAction = await prismaa.action.create({
//           data: {
//             content: `File updated: App.tsx with Note-Taking App`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for App.tsx update:`, appUpdateAction);

//         // Install AsyncStorage dependency
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd install @react-native-async-storage/async-storage`,
//           projectId
//         );
//         const asyncStorageAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: pnpm.cmd install @react-native-async-storage/async-storage`,
//             projectId,
//           },
//         });
//         console.log(
//           `Stored action for AsyncStorage install:`,
//           asyncStorageAction
//         );

//         // Add type declaration
//         await onFileUpdate(
//           "types/async-storage.d.ts",
//           "declare module '@react-native-async-storage/async-storage';",
//           projectId
//         );
//         const typeAction = await prismaa.action.create({
//           data: {
//             content: `File updated: types/async-storage.d.ts`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for type declaration:`, typeAction);
//       } catch (error: any) {
//         console.error(
//           `Failed to run pnpm dlx create-expo@latest or pnpm i:`,
//           error.message
//         );
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell command: pnpm.cmd dlx create-expo@latest . --template blank-typescript && pnpm.cmd i\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for failed create-expo:`, action);
//         throw error;
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: prompt,
//           projectId,
//           type: "USER",
//         },
//       });

//       const allPrompts: Prompt[] =
//         (await prismaa.prompt.findMany({
//           where: { projectId },
//           orderBy: { createdAt: "asc" },
//         })) ?? [];
//       console.log("allPrompts:", allPrompts);

//       const artifactProcessor = new ArtifactProcessor(
//         "",
//         projectId,
//         async (filePath: string, fileContent: string, projectId: string) => {
//           console.log(
//             `Processing file update for ${filePath} in project ${projectId}`
//           );
//           try {
//             await onFileUpdate(filePath, fileContent, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `File updated: ${filePath}\n${fileContent}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for file ${filePath}:`, action);
//           } catch (error: any) {
//             console.error(`Failed to process file ${filePath}:`, error.message);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed to update file: ${filePath}\n${fileContent}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed file ${filePath}:`, action);
//           }
//         },
//         async (shellCommand: string, projectId: string) => {
//           console.log(
//             `Processing shell command for project ${projectId}: ${shellCommand}`
//           );
//           try {
//             let modifiedCommand = shellCommand;
//             if (shellCommand.includes("pnpm install")) {
//               const packageMatch = shellCommand.match(/pnpm install (.+)/);
//               if (packageMatch && packageMatch[1]) {
//                 const packageNames = packageMatch[1].split(" ").filter(Boolean);
//                 const packageJsonPath = join(projectDir, "package.json");
//                 let packageJsonContent: PackageJson = {
//                   dependencies: {},
//                   devDependencies: {},
//                 };
//                 try {
//                   const packageJsonRaw = await fs.readFile(
//                     packageJsonPath,
//                     "utf-8"
//                   );
//                   packageJsonContent = JSON.parse(packageJsonRaw);
//                 } catch (error: any) {
//                   console.error(`Failed to read package.json:`, error.message);
//                 }

//                 packageJsonContent.dependencies =
//                   packageJsonContent.dependencies || {};
//                 packageJsonContent.devDependencies =
//                   packageJsonContent.devDependencies || {};
//                 for (const packageName of packageNames) {
//                   packageJsonContent.dependencies[packageName] = "latest";
//                   const typePackage = `@types/${packageName.replace(/-native/, "")}`;
//                   packageJsonContent.devDependencies[typePackage] = "latest";
//                 }

//                 await fs.writeFile(
//                   packageJsonPath,
//                   JSON.stringify(packageJsonContent, null, 2)
//                 );
//                 console.log(
//                   `Updated package.json with dependencies: ${packageNames.join(", ")}`
//                 );
//                 modifiedCommand = `cmd.exe /c cd ${projectDir} && pnpm.cmd install`;
//               }
//             }

//             console.log(`Executing shell command: ${modifiedCommand}`);
//             await onShellCommand(modifiedCommand, projectId);
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Shell command executed: ${modifiedCommand}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for shell command:`, action);
//           } catch (error: any) {
//             console.error(
//               `Failed to process shell command: ${shellCommand}:`,
//               error.message
//             );
//             const action = await prismaa.action.create({
//               data: {
//                 content: `Failed shell command: ${shellCommand}\nError: ${error.message}`,
//                 projectId,
//               },
//             });
//             console.log(`Stored action for failed shell command:`, action);
//           }
//         }
//       );
//       let artifact: string = "";

//       const validPrompts = allPrompts.filter(
//         (p) => p.type === "USER" || p.type === "SYSTEM"
//       );
//       console.log("validPrompts:", validPrompts);

//       let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
//         validPrompts.map((p: Prompt) => ({
//           role: p.type === "USER" ? ("user" as const) : ("model" as const),
//           parts: [{ text: p.content }],
//         }));
//       console.log("chatHistory after map:", chatHistory);

//       if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
//         chatHistory.unshift({
//           role: "user" as const,
//           parts: [{ text: "Initialize conversation" }],
//         });
//       }
//       console.log("Final chatHistory:", chatHistory);

//       const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltAction> tags. The prompt can be for any app type (e.g., chess, blog, todo list), and update only the necessary files and dependencies accordingly. For new projects, the base Expo setup is already done with web support enabled. Ensure all dependencies (e.g., react-native-chessboard for a chess app) are installed via pnpm install, and include type definitions (e.g., @types/<package>) for TypeScript support where applicable.`;

//       const chat = model.startChat({
//         history: chatHistory,
//         generationConfig: {
//           maxOutputTokens: 15000,
//         },
//       });

//       const result = await chat.sendMessageStream(combinedPrompt);

//       for await (const chunk of result.stream) {
//         const text = chunk.text();
//         try {
//           console.log("Gemini chunk:", text);
//           artifactProcessor.append(text);
//           await artifactProcessor.parse();
//           artifact += text;
//         } catch (error: unknown) {
//           console.error("Error processing text stream:", error);
//         }
//       }

//       await prismaa.prompt.create({
//         data: {
//           content: artifact ?? "",
//           projectId,
//           type: "SYSTEM",
//         },
//       });

//       // Step 5: Run pnpm i and pnpm expo start --tunnel
//       try {
//         console.log(`Running pnpm i in ${projectDir} for project ${projectId}`);
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd i`,
//           projectId
//         );
//         const installAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: cd ${projectDir} && pnpm.cmd i`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm i:`, installAction);

//         console.log(
//           `Running pnpm expo start --tunnel in ${projectDir} for project ${projectId}`
//         );
//         await onShellCommand(
//           `cmd.exe /c cd ${projectDir} && pnpm.cmd expo start --tunnel --port 8081`,
//           projectId
//         );
//         const startAction = await prismaa.action.create({
//           data: {
//             content: `Shell command: cd ${projectDir} && pnpm.cmd expo start --tunnel --port 8081`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for pnpm expo start --tunnel:`, startAction);
//       } catch (error: any) {
//         console.error(
//           `Failed to run pnpm commands in ${projectDir} for project ${projectId}:`,
//           error.message
//         );
//         const action = await prismaa.action.create({
//           data: {
//             content: `Failed shell commands: cd ${projectDir} && pnpm.cmd i && pnpm.cmd expo start --tunnel --port 8081\nError: ${error.message}`,
//             projectId,
//           },
//         });
//         console.log(`Stored action for failed pnpm commands:`, action);
//       }

//       res.json({
//         response: artifact,
//         status: "success",
//       });
//     } catch (error: unknown) {
//       console.error("Request error:", error);
//       res.status(500).json({
//         error: "Internal server error",
//         message: (error as Error).message ?? "An unexpected error occurred",
//       });
//     }
//   }
// );

// const PORT: number = 9091;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// process.on("uncaughtException", (error: Error) => {
//   console.error("Uncaught Exception:", error);
// });

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
import { promises as fs } from "fs";
import { join } from "path";

// Define a type for package.json content
interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

dotenv.config();

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

const BASE_WORKER_DIR = join(
  "C:",
  "Users",
  "swaini negi",
  "AppData",
  "Local",
  "Temp",
  "bolty-worker"
);

const app = express();
app.use(cors());
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

app.post("/project", async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;
    const userId = req.headers.authorization?.split("Bearer ")[1];
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    let project = await prismaa.project.findFirst({
      where: { userId },
    });

    if (!project) {
      project = await prismaa.project.create({
        data: {
          description: prompt,
          userId,
        },
      });
    } else {
      project = await prismaa.project.update({
        where: { id: project.id },
        data: { description: prompt },
      });
    }

    res.json({ projectId: project.id });
  } catch (error: unknown) {
    console.error("Error creating/updating project:", error);
    res.status(500).json({ error: "Failed to create/update project" });
  }
});

app.get(
  "/prompts/:projectId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      if (!projectId) {
        res.status(400).json({ error: "projectId is required" });
        return;
      }

      const prompts = await prismaa.prompt.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
      });

      console.log(`Fetched prompts for project ${projectId}:`, prompts);
      res.json({ prompts });
    } catch (error: unknown) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  }
);

app.get(
  "/actions/:projectId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      if (!projectId) {
        res.status(400).json({ error: "projectId is required" });
        return;
      }

      const actions = await prismaa.action.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
      });

      console.log(`Fetched actions for project ${projectId}:`, actions);
      res.json({ actions });
    } catch (error: unknown) {
      console.error("Error fetching actions:", error);
      res.status(500).json({ error: "Failed to fetch actions" });
    }
  }
);

app.get(
  "/files/:projectId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { projectId } = req.params;
      const dir = join(BASE_WORKER_DIR, projectId!);
      try {
        const files = await fs.readdir(dir);
        res.json({ files });
      } catch (error: any) {
        res.json({
          files: [],
          error: `Failed to read directory: ${error.message}`,
        });
      }
    } catch (error: unknown) {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: "Failed to fetch files" });
    }
  }
);

app.post(
  "/prompt",
  async (
    req: Request<{}, {}, PromptRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      console.log("Received /prompt request:", req.body);
      const { prompt, userId, projectId } = req.body ?? {};
      if (!prompt || !userId || !projectId) {
        res.status(400).json({
          error: "Missing required fields: prompt, userId, projectId",
        });
        return;
      }

      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "Google API key is not configured" });
        return;
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Step 1: Check if project directory exists, skip initialization if it does
      const projectDir = join(BASE_WORKER_DIR, projectId);
      let isNewProject = false;
      try {
        await fs.access(projectDir);
        console.log(
          `Project directory ${projectDir} already exists, skipping initialization`
        );
      } catch (error: any) {
        console.log(
          `Project directory ${projectDir} does not exist, initializing new project`
        );
        isNewProject = true;
        await fs.mkdir(projectDir, { recursive: true });
        await onShellCommand(
          `cmd.exe /c cd ${projectDir} && pnpm.cmd dlx create-expo@latest . --template blank-typescript`,
          projectId
        );
        const createAction = await prismaa.action.create({
          data: {
            content: `Shell command: pnpm.cmd dlx create-expo@latest . --template blank-typescript`,
            projectId,
          },
        });
        console.log(`Stored action for create-expo:`, createAction);

        console.log(`Running pnpm i in ${projectDir} for project ${projectId}`);
        await onShellCommand(
          `cmd.exe /c cd ${projectDir} && pnpm.cmd i`,
          projectId
        );
        const installAction = await prismaa.action.create({
          data: {
            content: `Shell command: cd ${projectDir} && pnpm.cmd i`,
            projectId,
          },
        });
        console.log(`Stored action for pnpm i:`, installAction);
      }

      await prismaa.prompt.create({
        data: {
          content: prompt,
          projectId,
          type: "USER",
        },
      });

      const allPrompts: Prompt[] =
        (await prismaa.prompt.findMany({
          where: { projectId },
          orderBy: { createdAt: "asc" },
        })) ?? [];
      console.log("allPrompts:", allPrompts);

      const artifactProcessor = new ArtifactProcessor(
        "",
        projectId,
        async (filePath: string, fileContent: string, projectId: string) => {
          console.log(
            `Processing file update for ${filePath} in project ${projectId}`
          );
          try {
            await onFileUpdate(filePath, fileContent, projectId);
            const action = await prismaa.action.create({
              data: {
                content: `File updated: ${filePath}\n${fileContent}`,
                projectId,
              },
            });
            console.log(`Stored action for file ${filePath}:`, action);
          } catch (error: any) {
            console.error(`Failed to process file ${filePath}:`, error.message);
            const action = await prismaa.action.create({
              data: {
                content: `Failed to update file: ${filePath}\n${fileContent}\nError: ${error.message}`,
                projectId,
              },
            });
            console.log(`Stored action for failed file ${filePath}:`, action);
          }
        },
        async (shellCommand: string, projectId: string) => {
          console.log(
            `Processing shell command for project ${projectId}: ${shellCommand}`
          );
          try {
            let modifiedCommand = shellCommand;
            if (shellCommand.includes("pnpm install")) {
              const packageMatch = shellCommand.match(/pnpm install (.+)/);
              if (packageMatch && packageMatch[1]) {
                const packageNames = packageMatch[1].split(" ").filter(Boolean);
                const packageJsonPath = join(projectDir, "package.json");
                let packageJsonContent: PackageJson = {
                  dependencies: {},
                  devDependencies: {},
                };
                try {
                  const packageJsonRaw = await fs.readFile(
                    packageJsonPath,
                    "utf-8"
                  );
                  packageJsonContent = JSON.parse(packageJsonRaw);
                } catch (error: any) {
                  console.error(`Failed to read package.json:`, error.message);
                }

                packageJsonContent.dependencies =
                  packageJsonContent.dependencies || {};
                packageJsonContent.devDependencies =
                  packageJsonContent.devDependencies || {};
                for (const packageName of packageNames) {
                  packageJsonContent.dependencies[packageName] = "latest";
                  const typePackage = `@types/${packageName.replace(/-native/, "")}`;
                  packageJsonContent.devDependencies[typePackage] = "latest";
                }

                await fs.writeFile(
                  packageJsonPath,
                  JSON.stringify(packageJsonContent, null, 2)
                );
                console.log(
                  `Updated package.json with dependencies: ${packageNames.join(", ")}`
                );
                modifiedCommand = `cmd.exe /c cd ${projectDir} && pnpm.cmd install`;
              }
            }

            console.log(`Executing shell command: ${modifiedCommand}`);
            await onShellCommand(modifiedCommand, projectId);
            const action = await prismaa.action.create({
              data: {
                content: `Shell command executed: ${modifiedCommand}`,
                projectId,
              },
            });
            console.log(`Stored action for shell command:`, action);
          } catch (error: any) {
            console.error(
              `Failed to process shell command: ${shellCommand}:`,
              error.message
            );
            const action = await prismaa.action.create({
              data: {
                content: `Failed shell command: ${shellCommand}\nError: ${error.message}`,
                projectId,
              },
            });
            console.log(`Stored action for failed shell command:`, action);
          }
        }
      );
      let artifact: string = "";

      const validPrompts = allPrompts.filter(
        (p) => p.type === "USER" || p.type === "SYSTEM"
      );
      console.log("validPrompts:", validPrompts);

      let chatHistory: { role: "user" | "model"; parts: { text: string }[] }[] =
        validPrompts.map((p: Prompt) => ({
          role: p.type === "USER" ? ("user" as const) : ("model" as const),
          parts: [{ text: p.content }],
        }));
      console.log("chatHistory after map:", chatHistory);

      if (chatHistory.length === 0 || chatHistory[0]?.role !== "user") {
        chatHistory.unshift({
          role: "user" as const,
          parts: [{ text: "Initialize conversation" }],
        });
      }
      console.log("Final chatHistory:", chatHistory);

      const combinedPrompt = `${systemPrompt("REACT_NATIVE")}\n\nUser prompt: ${prompt}\n\nCRITICAL: Always wrap actions in <boltAction> tags. The prompt can be for any app type (e.g., chess, blog, todo list), and update only the necessary files and dependencies accordingly. For new projects, the base Expo setup is already done with web support enabled. Ensure all dependencies (e.g., react-native-chessboard for a chess app) are installed via pnpm install, and include type definitions (e.g., @types/<package>) for TypeScript support where applicable.`;

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 8000,
        },
      });

      const result = await chat.sendMessageStream(combinedPrompt);

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

      await prismaa.prompt.create({
        data: {
          content: artifact ?? "",
          projectId,
          type: "SYSTEM",
        },
      });

      // Step 4: Run pnpm i and pnpm expo start --tunnel
      try {
        console.log(`Running pnpm i in ${projectDir} for project ${projectId}`);
        await onShellCommand(
          `cmd.exe /c cd ${projectDir} && pnpm.cmd i`,
          projectId
        );
        const installAction = await prismaa.action.create({
          data: {
            content: `Shell command: cd ${projectDir} && pnpm.cmd i`,
            projectId,
          },
        });
        console.log(`Stored action for pnpm i:`, installAction);

        console.log(
          `Running pnpm expo start --tunnel in ${projectDir} for project ${projectId}`
        );
        await onShellCommand(
          `cmd.exe /c cd ${projectDir} && pnpm.cmd expo start --tunnel --port 8081`,
          projectId
        );
        const startAction = await prismaa.action.create({
          data: {
            content: `Shell command: cd ${projectDir} && pnpm.cmd expo start --tunnel --port 8081`,
            projectId,
          },
        });
        console.log(`Stored action for pnpm expo start --tunnel:`, startAction);
      } catch (error: any) {
        console.error(
          `Failed to run pnpm commands in ${projectDir} for project ${projectId}:`,
          error.message
        );
        const action = await prismaa.action.create({
          data: {
            content: `Failed shell commands: cd ${projectDir} && pnpm.cmd i && pnpm.cmd expo start --tunnel --port 8081\nError: ${error.message}`,
            projectId,
          },
        });
        console.log(`Stored action for failed pnpm commands:`, action);
      }

      res.json({
        response: artifact,
        status: "success",
      });
    } catch (error: unknown) {
      console.error("Request error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message ?? "An unexpected error occurred",
      });
    }
  }
);

const PORT: number = 9091;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
});

process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  }
);
