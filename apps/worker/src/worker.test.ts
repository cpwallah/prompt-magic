// import { expect, test } from "vitest";

// import { ArtifactProcessor } from "./parser";

// test("Action with shell and file", () => {
//   const boltAction = `<boltArtifact>
//           <boltAction type="shell">
//               npm run start
//           </boltAction>
//           <boltAction type="file" filePath="src/index.js">
//               console.log("Hello, world!");
//           </boltAction>
//       </boltArtifact>`;
//   const artifactProcessor = new ArtifactProcessor(
//     boltAction,
//     (filePath, fileContent) => {
//       expect(filePath).toBe("src/index.js");
//       expect(fileContent).toContain('console.log("Hello, world!");');
//     },
//     (shellCommand) => {
//       console.log(shellCommand);
//       expect(shellCommand).toContain("npm run start");
//     }
//   );

//   artifactProcessor.parse();
//   artifactProcessor.parse();
//   expect(artifactProcessor.currentArtifact).not.toContain("<boltAction>");
// });

// test("Action with appends", () => {
//   const boltAction = `<boltArtifact>
//           <boltAction type="shell">
//               npm run start
//           </boltAction>
//           <boltAction type="file" filePath="src/index.js">
//               console.log("Hello, world!");
//           </boltAction>
//       `;
//   const artifactProcessor = new ArtifactProcessor(
//     boltAction,
//     (filePath, fileContent) => {
//       expect(filePath).toBe("src/index.js");
//       expect(fileContent).toContain('console.log("Hello, world!");');
//     },
//     (shellCommand) => {
//       console.log(shellCommand);
//       expect(shellCommand).toContain("npm run start");
//     }
//   );

//   artifactProcessor.parse();
//   artifactProcessor.append(`
//         <boltAction type="shell">
//             npm run start
//         </boltAction>
//     `);
//   artifactProcessor.parse();
//   artifactProcessor.parse();
//   artifactProcessor.append(`
//         <boltAction type="file" filePath="src/index.js">
//             console.log("Hello, world!");
//         </boltAction>
//     `);
//   artifactProcessor.parse();
//   expect(artifactProcessor.currentArtifact).not.toContain("<boltAction>");
// });

// import { expect, test } from "vitest";
// import { ArtifactProcessor } from "./parser";

// test("Action with shell and file", async () => {
//   const boltAction = `<boltArtifact>
//           <boltAction type="shell">
//               npm run start
//           </boltAction>
//           <boltAction type="file" filePath="src/index.js">
//               console.log("Hello, world!");
//           </boltAction>
//       </boltArtifact>`;
//   const artifactProcessor = new ArtifactProcessor(
//     "",
//     async (filePath, fileContent) => {
//       expect(filePath).toBe("src/index.js");
//       expect(fileContent).toContain('console.log("Hello, world!");');
//     },
//     async (shellCommand) => {
//       console.log(shellCommand);
//       expect(shellCommand).toContain("npm run start");
//     }
//   );

//   artifactProcessor.append(boltAction);
//   await artifactProcessor.parse();
//   await artifactProcessor.parse(); // Multiple parses to ensure idempotency
//   expect(artifactProcessor.getArtifact()).toContain("<boltAction>"); // Artifact retains tags
// });

// test("Action with appends", async () => {
//   const boltAction = `<boltArtifact>
//           <boltAction type="shell">
//               npm run start
//           </boltAction>
//           <boltAction type="file" filePath="src/index.js">
//               console.log("Hello, world!");
//           </boltAction>
//       </boltArtifact>`; // Added closing tag
//   const artifactProcessor = new ArtifactProcessor(
//     "",
//     async (filePath, fileContent) => {
//       expect(filePath).toBe("src/index.js");
//       expect(fileContent).toContain('console.log("Hello, world!");');
//     },
//     async (shellCommand) => {
//       console.log(shellCommand);
//       expect(shellCommand).toContain("npm run start");
//     }
//   );

//   artifactProcessor.append(boltAction);
//   await artifactProcessor.parse();
//   artifactProcessor.append(`
//         <boltAction type="shell">
//             npm run start
//         </boltAction>
//     `);
//   await artifactProcessor.parse();
//   artifactProcessor.append(`
//         <boltAction type="file" filePath="src/index.js">
//             console.log("Hello, world!");
//         </boltAction>
//     `);
//   await artifactProcessor.parse();
//   expect(artifactProcessor.getArtifact()).toContain("<boltAction>"); // Artifact retains tags
// });

// import { expect, test } from "vitest";
// import { ArtifactProcessor } from "./parser";

// test("Action with shell and file", async () => {
//   const boltAction = `<boltArtifact>
//           <boltAction type="shell">
//               pnpm run start
//           </boltAction>
//           <boltAction type="file" filePath="src/index.js">
//               console.log("Hello, world!");
//           </boltAction>
//       </boltArtifact>`;
//   const artifactProcessor = new ArtifactProcessor(
//     "",
//     async (filePath, fileContent) => {
//       expect(filePath).toBe("src/index.js");
//       expect(fileContent).toContain('console.log("Hello, world!");');
//     },
//     async (shellCommand) => {
//       console.log(shellCommand);
//       expect(shellCommand).toContain("pnpm run start");
//     }
//   );

//   artifactProcessor.append(boltAction);
//   await artifactProcessor.parse();
//   await artifactProcessor.parse();
//   expect(artifactProcessor.getArtifact()).toContain("<boltAction>");
// });

// test("Action with appends", async () => {
//   const boltAction = `<boltArtifact>
//           <boltAction type="shell">
//               pnpm run start
//           </boltAction>
//           <boltAction type="file" filePath="src/index.js">
//               console.log("Hello, world!");
//           </boltAction>
//       </boltArtifact>`;
//   const artifactProcessor = new ArtifactProcessor(
//     "",
//     async (filePath, fileContent) => {
//       expect(filePath).toBe("src/index.js");
//       expect(fileContent).toContain('console.log("Hello, world!");');
//     },
//     async (shellCommand) => {
//       console.log(shellCommand);
//       expect(shellCommand).toContain("pnpm run start");
//     }
//   );

//   artifactProcessor.append(boltAction);
//   await artifactProcessor.parse();
//   artifactProcessor.append(`
//         <boltAction type="shell">
//             pnpm run start
//         </boltAction>
//     `);
//   await artifactProcessor.parse();
//   artifactProcessor.append(`
//         <boltAction type="file" filePath="src/index.js">
//             console.log("Hello, world!");
//         </boltAction>
//     `);
//   await artifactProcessor.parse();
//   expect(artifactProcessor.getArtifact()).toContain("<boltAction>");
// });
import { expect, test } from "vitest";
import { ArtifactProcessor } from "./parser";

test("Action with shell and file", async () => {
  const boltAction = `<boltArtifact>
          <boltAction type="shell">
              pnpm run start
          </boltAction>
          <boltAction type="file" filePath="src/index.js">
              console.log("Hello, world!");
          </boltAction>
      </boltArtifact>`;
  const artifactProcessor = new ArtifactProcessor(
    "",
    async (filePath, fileContent) => {
      expect(filePath).toBe("src/index.js");
      expect(fileContent).toContain('console.log("Hello, world!");');
    },
    async (shellCommand) => {
      console.log(shellCommand);
      expect(shellCommand).toContain("pnpm run start");
    }
  );

  artifactProcessor.append(boltAction);
  await artifactProcessor.parse();
  await artifactProcessor.parse();
  expect(artifactProcessor.getArtifact()).toContain("<boltAction>");
});

test("Action with appends", async () => {
  const boltAction = `<boltArtifact>
          <boltAction type="shell">
              pnpm run start
          </boltAction>
          <boltAction type="file" filePath="src/index.js">
              console.log("Hello, world!");
          </boltAction>
      </boltArtifact>`;
  const artifactProcessor = new ArtifactProcessor(
    "",
    async (filePath, fileContent) => {
      expect(filePath).toBe("src/index.js");
      expect(fileContent).toContain('console.log("Hello, world!");');
    },
    async (shellCommand) => {
      console.log(shellCommand);
      expect(shellCommand).toContain("pnpm run start");
    }
  );

  artifactProcessor.append(boltAction);
  await artifactProcessor.parse();
  artifactProcessor.append(`
        <boltAction type="shell">
            pnpm run start
        </boltAction>
    `);
  await artifactProcessor.parse();
  artifactProcessor.append(`
        <boltAction type="file" filePath="src/index.js">
            console.log("Hello, world!");
        </boltAction>
    `);
  await artifactProcessor.parse();
  expect(artifactProcessor.getArtifact()).toContain("<boltAction>");
});
