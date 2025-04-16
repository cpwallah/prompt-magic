"use client";

import axios from "axios";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/config"; // Make sure BACKEND_URL = http://localhost:3010 or from .env

export function Prompt() {
  const [prompt, setPrompt] = useState("");
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/project`, // dynamic backend url from config
        {
          prompt: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Project created:", response.data);
    } catch (error: any) {
      console.error("Error creating project:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <Textarea
        placeholder="Create a chess application ..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex justify-end pt-2">
        <Button onClick={handleSubmit}>
          <Send className="mr-2 h-4 w-4" />
          Submit
        </Button>
      </div>
    </div>
  );
}
