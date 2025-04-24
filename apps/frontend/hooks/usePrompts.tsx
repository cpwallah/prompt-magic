// imp
// import { BACKEND_URL } from "@/config";
// import { useAuth } from "@clerk/nextjs";
// import axios from "axios"
// import { useEffect,useState } from "react";
// interface Prompt{
//     id:string;
//     content:string;
//     type:"USER" | "SYSTEM", 
//     createdAt:Date;
// }
// export function usePrompts(projectId:string){
//     const [prompts,setPrompts]=useState<Prompt[]>([]);
//     const {getToken}=useAuth();
//     useEffect(()=>{
//         async function getPrompts(){
//             const token=await getToken();
//             axios.get(`${BACKEND_URL}/prompts/${projectId}`,{
//                 headers:{
//                     "Authorization":`Bearer ${token}`
//                 }
//             }).then((res)=>{
//                 setPrompts(res.data.prompts);
//             })
//         }
//         getPrompts();
//         let interval=setInterval(getPrompts,1000);
//         return ()=>clearInterval(interval);
//     },[])
//     return {
//         prompts,
//     };
// }

import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Prompt {
  id: string;
  content: string;
  type: "USER" | "SYSTEM";
  createdAt: Date;
}

interface UsePromptsResult {
  prompts: Prompt[];
  isLoading: boolean;
  error?: string;
}

export function usePrompts(projectId: string): UsePromptsResult {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { getToken } = useAuth();

  useEffect(() => {
    async function getPrompts() {
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error("Authentication token missing");
        const res = await axios.get(`${BACKEND_URL}/prompts/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const fetchedPrompts = Array.isArray(res.data.prompts) ? res.data.prompts : [];
        setPrompts(fetchedPrompts);
      } catch (err: any) {
        setError(err.message || "Failed to fetch prompts");
        setPrompts([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId) {
      getPrompts();
      const interval = setInterval(getPrompts, 5000);
      return () => clearInterval(interval);
    }
  }, [projectId]);

  return { prompts, isLoading, error };
}
