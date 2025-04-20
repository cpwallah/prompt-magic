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
import { spawnSync } from "child_process";
import { join } from "path";

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

export function onShellCommand(shellCommand: string) {
  const commands = shellCommand
    .split("\n")
    .map((cmd) => cmd.trim())
    .filter(Boolean);

  for (const command of commands) {
    console.log(`Running command: ${command}`);
    const [cmdRaw, ...args] = command.split(" ");
    let cmd = cmdRaw === "pnpm" ? "pnpm.cmd" : cmdRaw || "echo";

    // Skip invalid commands involving node and expo CLI
    if (cmd === "node" && args.join(" ").includes("expo/bin/cli.js")) {
      console.warn(`Skipping invalid command: ${command}`);
      console.log(
        `Running fallback: pnpm.cmd install @react-native-async-storage/async-storage`
      );
      cmd = "pnpm.cmd";
      args.splice(
        0,
        args.length,
        "install",
        "@react-native-async-storage/async-storage"
      );
    }

    const result = spawnSync(cmd, args, {
      cwd: BASE_WORKER_DIR,
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        PATH: `${process.env.PATH};C:\\Users\\swaini negi\\AppData\\Roaming\\npm`,
      },
    });

    if (result.error) {
      console.error(`Error running command: ${result.error.message}`);
      continue;
    }
    if (result.status !== 0) {
      console.error(`Command exited with code ${result.status}`);
      continue;
    }
  }
}

export async function onFileUpdate(filePath: string, fileContent: string) {
  const fullPath = join(BASE_WORKER_DIR, filePath);
  console.log(`Writing to: ${fullPath}`);
  const { dirname } = require("path");
  const { mkdir } = require("fs/promises");
  await mkdir(dirname(fullPath), { recursive: true });
  const { writeFile } = require("fs/promises");
  await writeFile(fullPath, fileContent, "utf-8");
}
