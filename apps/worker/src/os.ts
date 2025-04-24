// import fs from "fs/promises";
// import path from "path";
// import { spawnSync } from "child_process";

// const BASE_WORKER_DIR = process.env.BASE_WORKER_DIR || "/tmp/bolty-worker";

// async function ensureBaseDirExists() {
//   try {
//     await fs.mkdir(BASE_WORKER_DIR, { recursive: true });
//   } catch (err) {
//     console.error("Error creating base worker directory:", err);
//   }
// }

// async function setup() {
//   await ensureBaseDirExists();
// }
// setup();

// export async function onFileUpdate(filePath: string, fileContent: string) {
//   const fullPath = path.join(BASE_WORKER_DIR, filePath);
//   await fs.mkdir(path.dirname(fullPath), { recursive: true });
//   await fs.writeFile(fullPath, fileContent, "utf-8");
// }

// export function onShellCommand(shellCommand: string) {
//   const commands = shellCommand
//     .split("\n")
//     .map((cmd) => cmd.trim())
//     .filter(Boolean);

//   for (const command of commands) {
//     console.log(`Running command: ${command}`);

//     const [cmdRaw, ...args] = command.split(" ");
//     const cmd = cmdRaw || "echo"; // fallback just in case

//     const result = spawnSync(cmd, args, {
//       cwd: BASE_WORKER_DIR,
//       encoding: "utf-8",
//       stdio: "inherit",
//     });

//     if (result.error) {
//       console.error(`Error running command: ${result.error.message}`);
//     }
//   }
// }

// import { spawnSync } from "child_process";
// import { join } from "path";

// export const BASE_WORKER_DIR =
//   process.env.BASE_WORKER_DIR ||
//   join(
//     "C:",
//     "Users",
//     "swaini negi",
//     "AppData",
//     "Local",
//     "Temp",
//     "bolty-worker"
//   );

// export function onShellCommand(shellCommand: string) {
//   const commands = shellCommand
//     .split("\n")
//     .map((cmd) => cmd.trim())
//     .filter(Boolean);

//   for (const command of commands) {
//     console.log(`Running command: ${command}`);
//     const [cmdRaw, ...args] = command.split(" ");
//     const cmd = cmdRaw === "pnpm" ? "pnpm.cmd" : cmdRaw || "echo";

//     const result = spawnSync(cmd, args, {
//       cwd: BASE_WORKER_DIR,
//       stdio: "inherit",
//       shell: true, // Use shell to resolve pnpm.cmd
//       env: {
//         ...process.env,
//         PATH: `${process.env.PATH};C:\\Users\\swaini negi\\AppData\\Roaming\\npm`,
//       }, // Add pnpm path
//     });

//     if (result.error) {
//       console.error(`Error running command: ${result.error.message}`);
//       continue;
//     }
//     if (result.status !== 0) {
//       console.error(`Command exited with code ${result.status}`);
//       continue;
//     }
//   }
// }

// export async function onFileUpdate(filePath: string, fileContent: string) {
//   const fullPath = join(BASE_WORKER_DIR, filePath);
//   console.log(`Writing to: ${fullPath}`);
//   // Ensure directory exists
//   const { dirname } = require("path");
//   const { mkdir } = require("fs/promises");
//   await mkdir(dirname(fullPath), { recursive: true });
//   // Write file
//   const { writeFile } = require("fs/promises");
//   await writeFile(fullPath, fileContent, "utf-8");
// }

// imp
// import { spawnSync } from "child_process";
// import { join } from "path";

// export const BASE_WORKER_DIR =
//   process.env.BASE_WORKER_DIR ||
//   join(
//     "C:",
//     "Users",
//     "swaini negi",
//     "AppData",
//     "Local",
//     "Temp",
//     "bolty-worker"
//   );

// export function onShellCommand(shellCommand: string) {
//   const commands = shellCommand
//     .split("\n")
//     .map((cmd) => cmd.trim())
//     .filter(Boolean);

//   for (const command of commands) {
//     console.log(`Running command: ${command}`);
//     const [cmdRaw, ...args] = command.split(" ");
//     let cmd = cmdRaw === "pnpm" ? "pnpm.cmd" : cmdRaw || "echo";

//     // Skip invalid commands involving node and expo CLI
//     if (cmd === "node" && args.join(" ").includes("expo/bin/cli.js")) {
//       console.warn(`Skipping invalid command: ${command}`);
//       console.log(
//         `Running fallback: pnpm.cmd install @react-native-async-storage/async-storage`
//       );
//       cmd = "pnpm.cmd";
//       args.splice(
//         0,
//         args.length,
//         "install",
//         "@react-native-async-storage/async-storage"
//       );
//     }

//     const result = spawnSync(cmd, args, {
//       cwd: BASE_WORKER_DIR,
//       stdio: "inherit",
//       shell: true,
//       env: {
//         ...process.env,
//         PATH: `${process.env.PATH};C:\\Users\\swaini negi\\AppData\\Roaming\\npm`,
//       },
//     });

//     if (result.error) {
//       console.error(`Error running command: ${result.error.message}`);
//       continue;
//     }
//     if (result.status !== 0) {
//       console.error(`Command exited with code ${result.status}`);
//       continue;
//     }
//   }
// }

// export async function onFileUpdate(filePath: string, fileContent: string) {
//   const fullPath = join(BASE_WORKER_DIR, filePath);
//   console.log(`Writing to: ${fullPath}`);
//   const { dirname } = require("path");
//   const { mkdir } = require("fs/promises");
//   await mkdir(dirname(fullPath), { recursive: true });
//   const { writeFile } = require("fs/promises");
//   await writeFile(fullPath, fileContent, "utf-8");
// }

// vimp
// import { spawnSync } from "child_process";
// import { join } from "path";
// import { promises as fs } from "fs";

// export const BASE_WORKER_DIR =
//   process.env.BASE_WORKER_DIR ||
//   join(
//     "C:",
//     "Users",
//     "swaini negi",
//     "AppData",
//     "Local",
//     "Temp",
//     "bolty-worker"
//   );

// export async function onShellCommand(
//   shellCommand: string,
//   projectId: string
// ): Promise<void> {
//   const commands = shellCommand
//     .split("\n")
//     .map((cmd) => cmd.trim())
//     .filter(Boolean);

//   for (const command of commands) {
//     console.log(`Running command for project ${projectId}: ${command}`);
//     const [cmdRaw, ...args] = command.split(" ");
//     let cmd = cmdRaw === "pnpm" ? "pnpm.cmd" : cmdRaw || "echo";

//     // Skip invalid commands involving node and expo CLI
//     if (cmd === "node" && args.join(" ").includes("expo/bin/cli.js")) {
//       console.warn(
//         `Skipping invalid command for project ${projectId}: ${command}`
//       );
//       console.log(
//         `Running fallback for project ${projectId}: pnpm.cmd install @react-native-async-storage/async-storage`
//       );
//       cmd = "pnpm.cmd";
//       args.splice(
//         0,
//         args.length,
//         "install",
//         "@react-native-async-storage/async-storage"
//       );
//     }

//     const projectDir = join(BASE_WORKER_DIR, projectId);
//     await fs.mkdir(projectDir, { recursive: true });

//     const result = spawnSync(cmd, args, {
//       cwd: projectDir, // Use project-specific directory
//       stdio: "inherit",
//       shell: true,
//       env: {
//         ...process.env,
//         PATH: `${process.env.PATH};C:\\Users\\swaini negi\\AppData\\Roaming\\npm`,
//       },
//     });

//     if (result.error) {
//       console.error(
//         `Error running command for project ${projectId}: ${result.error.message}`
//       );
//       continue;
//     }
//     if (result.status !== 0) {
//       console.error(
//         `Command exited with code ${result.status} for project ${projectId}`
//       );
//       continue;
//     }
//   }
// }

// export async function onFileUpdate(
//   filePath: string,
//   fileContent: string,
//   projectId: string
// ): Promise<void> {
//   const projectDir = join(BASE_WORKER_DIR, projectId);
//   const fullPath = join(projectDir, filePath);
//   console.log(`Writing to: ${fullPath} for project ${projectId}`);
//   await fs.mkdir(projectDir, { recursive: true });
//   await fs.writeFile(fullPath, fileContent, "utf-8");
// }

import { spawnSync } from "child_process";
import { join, dirname } from "path";
import { promises as fs } from "fs";

// Map to Windows path that code-server sees as /tmp/bolty-worker
export const BASE_WORKER_DIR =
  process.env.BASE_WORKER_DIR ||
  join(
    "C:",
    "Users",
    "swaini negi",
    "AppData",
    "Local",
    "Temp",
    "bolty-worker"
  );

export async function onShellCommand(
  shellCommand: string,
  projectId: string
): Promise<void> {
  const commands = shellCommand
    .split("\n")
    .map((cmd) => cmd.trim())
    .filter(Boolean);

  for (const command of commands) {
    console.log(`Running command for project ${projectId}: ${command}`);
    const [cmdRaw, ...args] = command.split(" ");
    let cmd = cmdRaw === "pnpm" ? "pnpm.cmd" : cmdRaw || "echo";

    const projectDir = join(BASE_WORKER_DIR, projectId);
    try {
      await fs.mkdir(projectDir, { recursive: true });
    } catch (error: any) {
      console.error(
        `Failed to create project directory ${projectDir}:`,
        error.message
      );
      throw error;
    }

    const result = spawnSync(cmd, args, {
      cwd: projectDir,
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        PATH: `${process.env.PATH};C:\\Users\\swaini negi\\AppData\\Roaming\\npm`,
      },
    });

    if (result.error) {
      console.error(
        `Error running command for project ${projectId}: ${result.error.message}`
      );
      throw new Error(`Command failed: ${result.error.message}`);
    }
    if (result.status !== 0) {
      console.error(
        `Command exited with code ${result.status} for project ${projectId}: ${command}`
      );
      throw new Error(`Command failed with exit code ${result.status}`);
    }
  }
}

export async function onFileUpdate(
  filePath: string,
  fileContent: string,
  projectId: string
): Promise<void> {
  const projectDir = join(BASE_WORKER_DIR, projectId);
  const fullPath = join(projectDir, filePath);
  console.log(
    `Writing to: ${fullPath} for project ${projectId} with content length ${fileContent.length}`
  );
  try {
    await fs.mkdir(dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, fileContent, "utf-8");
    console.log(`Successfully wrote file: ${fullPath}`);
    // Verify the file was written
    const writtenContent = await fs.readFile(fullPath, "utf-8");
    if (writtenContent !== fileContent) {
      console.warn(
        `Content mismatch in ${fullPath}: Expected ${fileContent.length} chars, got ${writtenContent.length} chars`
      );
    }
  } catch (error: any) {
    console.error(`Error writing file ${fullPath}:`, error.message);
    throw new Error(`Failed to write file ${fullPath}: ${error.message}`);
  }
}
