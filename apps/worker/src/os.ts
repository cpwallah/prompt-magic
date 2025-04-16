import fs from "fs/promises";
import path from "path";
import { spawnSync } from "child_process";

const BASE_WORKER_DIR = process.env.BASE_WORKER_DIR || "/tmp/bolty-worker";

async function ensureBaseDirExists() {
  try {
    await fs.mkdir(BASE_WORKER_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating base worker directory:", err);
  }
}

async function setup() {
  await ensureBaseDirExists();
}
setup();

export async function onFileUpdate(filePath: string, fileContent: string) {
  const fullPath = path.join(BASE_WORKER_DIR, filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, fileContent, "utf-8");
}

export function onShellCommand(shellCommand: string) {
  const commands = shellCommand
    .split("\n")
    .map((cmd) => cmd.trim())
    .filter(Boolean);

  for (const command of commands) {
    console.log(`Running command: ${command}`);

    const [cmdRaw, ...args] = command.split(" ");
    const cmd = cmdRaw || "echo"; // fallback just in case

    const result = spawnSync(cmd, args, {
      cwd: BASE_WORKER_DIR,
      encoding: "utf-8",
      stdio: "inherit",
    });

    if (result.error) {
      console.error(`Error running command: ${result.error.message}`);
    }
  }
}
