// imp
// import { BACKEND_URL } from "@/config";
// import { useAuth } from "@clerk/nextjs";
// import axios from "axios";
// import { useEffect, useState } from "react";

// interface Action{
//     id:string,
//     content:string,
//     createdAt:Date,
// }
// export function useActions(projectId:string){
//     const [actions,setactions]=useState<Action[]>([]);
//     const {getToken}=useAuth();
//     useEffect(()=>{
//         async function getactions(){
//             const token=await getToken();
//             axios.get(`http://localhost:3010/actions/${projectId}`,{
//                 headers:{
//                     "Authorization":`Bearer ${token}`
//                 }
//             }).then((res)=>{
//                 setactions(res.data);
//             })
//         }
//         getactions();
//         let interval=setInterval(getactions,1000);
//         return ()=>clearInterval(interval);
//     },[])
//     return{
//         actions,
//     }

// }

import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Action {
  id: string;
  content: string;
  createdAt: Date;
}

interface UseActionsResult {
  actions: Action[];
  isLoading: boolean;
  error?: string;
}

export function useActions(projectId: string): UseActionsResult {
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const { getToken } = useAuth();

  useEffect(() => {
    async function getActions() {
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) throw new Error("Authentication token missing");
        const res = await axios.get(`${BACKEND_URL}/actions/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const fetchedActions = Array.isArray(res.data.actions) ? res.data.actions : [];
        setActions(fetchedActions);
      } catch (err: any) {
        setError(err.message || "Failed to fetch actions");
        setActions([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (projectId) {
      getActions();
      const interval = setInterval(getActions, 20000);
      return () => clearInterval(interval);
    }
  }, [projectId]);

  return { actions, isLoading, error };
}