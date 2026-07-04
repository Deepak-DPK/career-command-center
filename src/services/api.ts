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
  onProgress?: (percent: number) => void
): Promise<PrepKitResponse> {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

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
