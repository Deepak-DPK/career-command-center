import axios from "axios";
import { PrepKitResponse } from "../types";

// Dynamic API base selection (with relative path support for Express)
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "https://career-command-center-backend.onrender.com";

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120-second timeout to handle Render backend cold starts
});

/**
 * Service to generate Career Prep Kits from PDF resume and job descriptions.
 * Uses multipart/form-data.
 */
export async function generatePrepKit(
  resumeFile: File,
  jobDescription: string,
  userId?: string,
  onProgress?: (percent: number) => void
): Promise<PrepKitResponse> {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);
  if (userId) {
    formData.append("user_id", userId);
  }

  try {
    const response = await apiInstance.post<PrepKitResponse>("/generate-prep-kit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (onProgress) onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("API error during Prep Kit generation:", error);

    if (error.code === "ECONNABORTED") {
      throw new Error("The request timed out. Gathering tactical analytics takes deep effort—please try again.");
    }

    const serverErrorMessage = error.response?.data?.error || error.response?.data?.details;
    if (serverErrorMessage) {
      throw new Error(serverErrorMessage);
    }

    throw new Error(error.message || "Failed to communicate with Career Command Center server.");
  }
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Service to communicate with the RAG Chat API on the backend.
 */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  resumeText: string,
  jobDescription: string,
  resumeId?: string,
  userId?: string
): Promise<string> {
  try {
    const response = await apiInstance.post<{ reply: string }>("/chat", {
      message,
      history,
      resume_text: resumeText,
      job_description: jobDescription,
      resume_id: resumeId,
      user_id: userId,
    });
    return response.data.reply;
  } catch (error: any) {
    console.error("API error during chat:", error);
    const serverErrorMessage = error.response?.data?.error || error.response?.data?.details || error.response?.data?.detail;
    if (serverErrorMessage) {
      throw new Error(serverErrorMessage);
    }
    throw new Error("Failed to communicate with Career Command Center AI Mentor.");
  }
}
