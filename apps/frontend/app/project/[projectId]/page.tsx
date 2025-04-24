// imp
// "use client"
// import { Appbar } from "@/components/Appbar"
// import { Button } from "@/components/ui/button"
// import { Send } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { usePrompts } from "@/hooks/usePrompts"
// import { useActions } from "@/hooks/useActions"

// export default function ProjectPage({params}:{params:{projectId:string}}){
//     const {prompts}=usePrompts(params.projectId);
//     const {actions}=useActions(params.projectId);
//     return <div>
//         {/* <Appbar/> */}
//         <div className="flex h-screen">
//         <div className="w-1/4 h-screen flex flex-col justify-between p-4">
//             <div>
//                 Chat History
//                 {prompts.filter((prompt)=>prompt.type==="USER").map((prompt)=>(
//                     <div key={prompt.id}>
//                         {prompt.content}
//                     </div>
//                 ))}
//                 {actions.map((action)=>(
//                     <div key={action.id}>
//                         {action.content}
//                     </div>
//                 ))}
//             </div>
//             <div className="flex gap-2">
//                 <Input/>
//                 <Button>
//                     <Send/>
//                 </Button>
//             </div>
//         </div>
//         <div className="w-3/4 p-8">
//             <iframe src="http://localhost:8080" width={"100%"} height={"100%"} /> //WORKER_URL
//         </div>
//         {/* Project {params.projectId} */}
//     </div>
//     </div>
// }


 "use client";

 import { use } from "react";
 import { usePrompts } from "@/hooks/usePrompts";
 import { useActions } from "@/hooks/useActions";

interface Prompt {
   id: string;
   content: string;
    type: "USER" | "SYSTEM";
    createdAt: Date;
  }

  interface Action {
    id: string;
    content: string;
    createdAt: Date;
  }

 interface ProjectPageProps {
   params: Promise<{ projectId: string }>;
 }

 export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = use(params);
  const { prompts, isLoading: promptsLoading, error: promptsError } = usePrompts(projectId);
  const { actions, isLoading: actionsLoading, error: actionsError } = useActions(projectId);

  const actionsArray = Array.isArray(actions) ? actions : [];

  return (
    <div className="flex h-screen">
      {/* Left Side: Prompts followed by Actions */}
      <div className="w-1/3 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Prompts</h2>
        {promptsError && <p className="text-red-500">{promptsError}</p>}
        {promptsLoading ? (
          <p>Loading prompts...</p>
        ) : prompts.length > 0 ? (
          prompts.map((prompt) => (
            <div key={prompt.id} className="border-b py-2">
              <p>{prompt.content}</p>
              <small>
                {prompt.type} - {prompt.createdAt.toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p>No prompts available</p>
        )}

        <h2 className="text-xl font-bold mt-6 mb-4">Actions</h2>
         {actionsError && <p className="text-red-500">{actionsError}</p>}
         {actionsLoading ? (
           <p>Loading actions...</p>
         ) : actionsArray.length > 0 ? (
           actionsArray.map((action) => (
             <div key={action.id} className="border-b py-2">
               <p>{action.content}</p>
               <small>{action.createdAt.toLocaleString()}</small>
             </div>
           ))
         ) : (
           <p>No actions available</p>
         )}
       </div>

       {/* Right Side: VS Code Embedded */}
       <div className="w-2/3 p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-bold mb-4">VS Code Editor</h2>
         <p className="text-gray-300 mb-2">
          Viewing files at: <code>/tmp/bolty-worker</code>
        </p>
        <iframe
          src="http://localhost:8080/?folder=/Temp/bolty-worker"
          className="w-full h-[80vh] border-0"
          title="VS Code"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
        <p className="text-sm text-gray-400 mt-2">
          If the editor doesn’t load,{" "}
          <a
            href="http://localhost:8080/?folder=/Temp/bolty-worker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            open VS Code in a new tab
          </a>.
        </p>
      </div>
    </div>
  );
}
