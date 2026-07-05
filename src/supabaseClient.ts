import { createClient } from "@supabase/supabase-js";
import { PrepKitResponse } from "./types";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isRealSupabase = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export interface SavedPrepKit {
  id: string;
  userId: string;
  jobDescription: string;
  resumeFilename: string;
  prepKit: PrepKitResponse;
  createdAt: string;
}

/**
 * Saves a generated Career Prep Kit to Supabase (or LocalStorage in sandbox mode).
 */
export async function savePrepKitToDB(
  userId: string,
  jobDescription: string,
  resumeFilename: string,
  prepKit: PrepKitResponse
): Promise<string> {
  if (isRealSupabase && supabase) {
    try {
      const { data, error } = await supabase
        .from("prep_kits")
        .insert([
          {
            user_id: userId,
            job_description: jobDescription,
            resume_filename: resumeFilename,
            prep_kit: prepKit,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error("Failed to save prep kit to Supabase:", error);
      throw error;
    }
  } else {
    // Sandbox / Mock Storage Fallback (Session scoped to automatically clear when session ends)
    const mockHistory = JSON.parse(sessionStorage.getItem("ccc_mock_history") || "[]");
    const newId = `mock_kit_${Date.now()}`;
    mockHistory.unshift({
      id: newId,
      userId,
      jobDescription,
      resumeFilename,
      prepKit,
      createdAt: new Date().toISOString(),
    });
    sessionStorage.setItem("ccc_mock_history", JSON.stringify(mockHistory));
    return newId;
  }
}

/**
 * Saves a generated Career Prep Kit to Supabase (or LocalStorage in sandbox mode).
 */
export async function fetchPrepKitsFromDB(userId: string): Promise<SavedPrepKit[]> {
  if (isRealSupabase && supabase) {
    try {
      const { data, error } = await supabase
        .from("prep_kits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        jobDescription: row.job_description,
        resumeFilename: row.resume_filename,
        prepKit: row.prep_kit,
        createdAt: row.created_at,
      }));
    } catch (error) {
      console.error("Failed to fetch prep kits from Supabase:", error);
      throw error;
    }
  } else {
    // Sandbox / Mock Storage Fallback
    const mockHistory = JSON.parse(sessionStorage.getItem("ccc_mock_history") || "[]");
    return mockHistory.filter((item: any) => item.userId === userId);
  }
}

/**
 * Deletes a saved Career Prep Kit from Supabase (or LocalStorage in sandbox mode).
 */
export async function deletePrepKitFromDB(id: string): Promise<void> {
  if (isRealSupabase && supabase) {
    try {
      const { error } = await supabase
        .from("prep_kits")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to delete prep kit from Supabase:", error);
      throw error;
    }
  } else {
    // Sandbox / Mock Storage Fallback
    const mockHistory = JSON.parse(sessionStorage.getItem("ccc_mock_history") || "[]");
    const updatedHistory = mockHistory.filter((item: any) => item.id !== id);
    sessionStorage.setItem("ccc_mock_history", JSON.stringify(updatedHistory));
  }
}

