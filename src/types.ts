export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isMockUser?: boolean;
}

export interface ATSAnalysis {
  ats_score: number;
  missing_keywords: string[];
  resume_improvements: string[];
}

export interface AnswerFramework {
  title: string;
  framework: string;
  example: string;
}

export interface SalaryNegotiation {
  hr_questions: string[];
  negotiation_tips: string[];
  recommended_answer_frameworks: AnswerFramework[];
}

export interface OutreachAssets {
  cold_email: string;
  linkedin_pitch: string;
  thank_you_note: string;
}

export interface PrepKitResponse {
  skill_gaps: string[];
  ats_analysis: ATSAnalysis;
  questions: string[];
  pushback_questions: string[];
  salary_negotiation: SalaryNegotiation;
  coach_report: string;
  outreach_assets?: OutreachAssets;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
