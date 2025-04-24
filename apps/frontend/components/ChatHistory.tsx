// "use client";

// import { usePrompts } from "../hooks/usePrompts";
// import { useEffect, useRef } from "react";

// interface Prompt {
//   id: string;
//   content: string;
//   type: "USER" | "SYSTEM";
//   createdAt: Date;
// }

// interface FileUpdate {
//   id: string;
//   filePath: string;
//   content: string;
//   createdAt: Date;
// }

// export function ChatHistory({ projectId }: { projectId: string }) {
//   const { prompts, fileUpdates } = usePrompts(projectId);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [prompts, fileUpdates]);

//   const messages = [
//     ...prompts.map((prompt) => ({
//       id: prompt.id,
//       type: prompt.type,
//       content: prompt.content,
//       createdAt: prompt.createdAt,
//     })),
//     ...fileUpdates.map((update) => ({
//       id: update.id,
//       type: "FILE_UPDATE" as const,
//       content: `File updated: ${update.filePath}`,
//       createdAt: update.createdAt,
//     })),
//   ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

//   return (
//     <div className="flex flex-col h-[500px] border rounded-lg bg-white">
//       <div
//         ref={chatContainerRef}
//         className="flex-1 overflow-y-auto p-4 space-y-4"
//       >
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.type === "USER" ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`max-w-[70%] p-3 rounded-lg ${
//                 message.type === "USER"
//                   ? "bg-blue-500 text-white"
//                   : message.type === "SYSTEM"
//                   ? "bg-gray-200 text-black"
//                   : "bg-green-200 text-black"
//               }`}
//             >
//               <p>{message.content}</p>
//               <span className="text-xs opacity-70">
//                 {new Date(message.createdAt).toLocaleTimeString()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }