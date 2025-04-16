// /*
//     <boltArtifact>
//         <boltAction type="shell">
//             npm run start
//         </boltAction>
//         <boltAction type="file" filePath="src/index.js">
//             console.log("Hello, world!");
//         </boltAction>
//     </boltArtifact>
// */

// export class ArtifactProcessor {
//   public currentArtifact: string;
//   private onFileContent: (filePath: string, fileContent: string) => void;
//   private onShellCommand: (shellCommand: string) => void;

//   constructor(
//     currentArtifact: string,
//     onFileContent: (filePath: string, fileContent: string) => void,
//     onShellCommand: (shellCommand: string) => void
//   ) {
//     this.currentArtifact = currentArtifact;
//     this.onFileContent = onFileContent;
//     this.onShellCommand = onShellCommand;
//   }

//   append(artifact: string) {
//     this.currentArtifact += artifact;
//   }

//   parse() {
//     const latestActionStart = this.currentArtifact
//       .split("\n")
//       .findIndex((line) => line.includes("<boltAction type="));
//     const latestActionEnd =
//       this.currentArtifact
//         .split("\n")
//         .findIndex((line) => line.includes("</boltAction>")) ??
//       this.currentArtifact.split("\n").length - 1;

//     if (latestActionStart === -1) {
//       return;
//     }

//     const latestActionType = this.currentArtifact
//       .split("\n")
//       [latestActionStart].split("type=")[1]
//       .split(" ")[0]
//       .split(">")[0];
//     const latestActionContent = this.currentArtifact
//       .split("\n")
//       .slice(latestActionStart, latestActionEnd + 1)
//       .join("\n");

//     try {
//       if (latestActionType === '"shell"') {
//         let shellCommand = latestActionContent.split("\n").slice(1).join("\n");
//         if (shellCommand.includes("</boltAction>")) {
//           shellCommand = shellCommand.split("</boltAction>")[0];
//           this.currentArtifact =
//             this.currentArtifact.split(latestActionContent)[1];
//           this.onShellCommand(shellCommand);
//         }
//       } else if (latestActionType === '"file"') {
//         const filePath = this.currentArtifact
//           .split("\n")
//           [latestActionStart].split("filePath=")[1]
//           .split(">")[0];
//         let fileContent = latestActionContent.split("\n").slice(1).join("\n");
//         if (fileContent.includes("</boltAction>")) {
//           fileContent = fileContent.split("</boltAction>")[0];
//           this.currentArtifact =
//             this.currentArtifact.split(latestActionContent)[1];
//           this.onFileContent(filePath.split('"')[1], fileContent);
//         }
//       }
//     } catch (e) {}
//   }
// }
export class ArtifactProcessor {
  public currentArtifact: string;
  private onFileContent: (filePath: string, fileContent: string) => void;
  private onShellCommand: (shellCommand: string) => void;

  constructor(
    currentArtifact: string,
    onFileContent: (filePath: string, fileContent: string) => void,
    onShellCommand: (shellCommand: string) => void
  ) {
    this.currentArtifact = currentArtifact;
    this.onFileContent = onFileContent;
    this.onShellCommand = onShellCommand;
  }

  append(artifact: string) {
    this.currentArtifact += artifact;
  }

  parse() {
    if (!this.currentArtifact) {
      console.error("Artifact content is empty or undefined.");
      return;
    }

    const lines = this.currentArtifact.split("\n");
    const latestActionStart = lines.findIndex((line) =>
      line.includes('<boltAction type="')
    );
    const latestActionEnd = lines.findIndex(
      (line, index) =>
        line.includes("</boltAction>") && index > latestActionStart
    );

    if (
      latestActionStart === -1 ||
      latestActionEnd === -1 ||
      latestActionStart >= latestActionEnd
    ) {
      console.error(
        "Invalid action block: Start or End not found or malformed."
      );
      return;
    }

    const match = this.currentArtifact.match(/<boltAction\s+type="([^"]+)"/);
    const latestActionType = match?.[1];

    if (!latestActionType) {
      console.error("Action type not found.");
      return;
    }

    const latestActionContent = lines
      .slice(latestActionStart, latestActionEnd + 1)
      .join("\n");

    try {
      if (latestActionType === "shell") {
        let shellCommand = latestActionContent.split("\n").slice(1).join("\n");
        if (typeof shellCommand !== "string" || !shellCommand.trim()) {
          console.error("Shell command is empty, undefined, or invalid.");
          return;
        }
        shellCommand = shellCommand.replace(/<\/boltAction>\s*$/, "").trim();
        this.currentArtifact = this.currentArtifact
          .split(latestActionContent)
          .slice(1)
          .join("\n");
        if (shellCommand) {
          this.onShellCommand?.(shellCommand);
        } else {
          console.error("Shell command is empty after processing.");
        }
      } else if (latestActionType === "file") {
        const matchFilePath = this.currentArtifact.match(/filePath="([^"]+)"/);
        const filePath = matchFilePath?.[1];
        if (!filePath) {
          console.error("File path not found.");
          return;
        }
        let fileContent = latestActionContent.split("\n").slice(1).join("\n");
        if (typeof fileContent !== "string" || !fileContent.trim()) {
          console.error("File content is empty, undefined, or invalid.");
          return;
        }
        fileContent = fileContent.replace(/<\/boltAction>\s*$/, "").trim();
        this.currentArtifact = this.currentArtifact
          .split(latestActionContent)
          .slice(1)
          .join("\n");
        if (filePath && fileContent) {
          this.onFileContent?.(filePath, fileContent);
        } else {
          console.error("File path or content is empty after processing.");
        }
      } else {
        console.error(`Unknown action type: ${latestActionType}`);
      }
    } catch (error) {
      console.error("Error occurred during parsing:", error);
    }
  }
}
