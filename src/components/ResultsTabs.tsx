import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import {
  Brain,
  ShieldAlert,
  Compass,
  FileText,
  Copy,
  Check,
  Award,
  Sparkles,
  Gauge,
  Coins,
  Download,
  Send,
  MessageSquare,
  Loader2
} from "lucide-react";
import { PrepKitResponse } from "../types";
import { sendChatMessage, ChatMessage } from "../services/api";

// Import custom reusable sub-components
import ATSScoreCard from "./ATSScoreCard";
import KeywordBadgeList from "./KeywordBadgeList";
import ResumeImprovementCards from "./ResumeImprovementCards";
import SalaryQuestionCards from "./SalaryQuestionCards";
import NegotiationTips from "./NegotiationTips";
import AnswerFrameworkAccordion from "./AnswerFrameworkAccordion";

interface ResultsTabsProps {
  data: PrepKitResponse;
  jobDescription?: string;
}

export default function ResultsTabs({ data, jobDescription = "" }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Welcome to your interactive AI Mentor briefing room. I have analyzed your resume against the target role requirements and identified key preparation parameters. Ask me any strategic questions—from coding framework deep dives to soft-skill positioning or salary scenarios."
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const tabs = [
    { id: "skill_gaps", label: "Skill Gaps", icon: <Brain className="w-4 h-4" /> },
    { id: "ats_optimization", label: "ATS Optimization", icon: <Gauge className="w-4 h-4" /> },
    { id: "core_questions", label: "Core Questions", icon: <FileText className="w-4 h-4" /> },
    { id: "tough_scenarios", label: "Tough Scenarios", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "salary_negotiation", label: "Salary Negotiation", icon: <Coins className="w-4 h-4" /> },
    { id: "outreach_pitch", label: "Outreach Pitch", icon: <Send className="w-4 h-4" /> },
    { id: "coach_strategy", label: "Coach Strategy", icon: <Compass className="w-4 h-4" /> },
    { id: "ai_chat", label: "AI Mentor Chat", icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Safely extract nested structures with robust defaults to survive missing data models
  const skillGaps = data.skill_gaps ?? [];
  const questions = data.questions ?? [];
  const pushbackQuestions = data.pushback_questions ?? [];
  const coachReport = data.coach_report ?? "";
  
  const outreachAssets = data.outreach_assets ?? {
    cold_email: "Generating cold email...",
    linkedin_pitch: "Generating LinkedIn pitch...",
    thank_you_note: "Generating thank-you note..."
  };

  const atsScore = data.ats_analysis?.ats_score ?? 70;
  const missingKeywords = data.ats_analysis?.missing_keywords ?? [];
  const resumeImprovements = data.ats_analysis?.resume_improvements ?? [];

  const hrQuestions = data.salary_negotiation?.hr_questions ?? [];
  const negotiationTips = data.salary_negotiation?.negotiation_tips ?? [];
  const recommendedFrameworks = data.salary_negotiation?.recommended_answer_frameworks ?? [];

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    const updatedMessages = [...chatMessages, { role: "user", content: userMessage } as ChatMessage];
    setChatInput("");
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      const jobDesc = jobDescription || data.ats_analysis?.missing_keywords?.join(", ") || "Target Position";
      const resumeText = data.resume_text || `Skill Gaps: ${skillGaps.join(", ")}`;
      
      const reply = await sendChatMessage(
        userMessage,
        chatMessages,
        resumeText,
        jobDesc,
        data.resume_id ?? undefined
      );

      setChatMessages((prev) => [...prev, { role: "assistant", content: reply } as ChatMessage]);
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ System offline: ${err?.message || "Failed to communicate with AI Mentor. Please check backend configurations."}`
        } as ChatMessage
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/45 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-white/10 overflow-hidden shadow-2xl">
      {/* Tab bar header */}
      <div className="flex border-b border-slate-200/40 dark:border-white/10 bg-slate-50/30 dark:bg-slate-950/40 overflow-x-auto scrollbar-none shrink-0">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`relative flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors shrink-0 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-extrabold"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 dark:bg-blue-400"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display Area */}
      <div className="flex-1 p-6 overflow-y-auto min-h-[420px] max-h-[720px] scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Tab 1: Skill Gaps (index 0) */}
            {activeTab === 0 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-600/10 dark:bg-blue-500/5 border border-blue-200/40 dark:border-blue-500/20 rounded-2xl flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Discovered Gaps & Mismatch Vectors
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      These are the technical requirements, scale, or leadership roles from the job description not fully matching your resume credentials.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {skillGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="group relative p-4 rounded-xl border border-slate-200/40 dark:border-white/5 bg-slate-50/20 dark:bg-white/5 backdrop-blur-md hover:border-blue-500/30 dark:hover:border-white/15 transition-all flex items-start gap-3"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold shrink-0 mt-0.5 font-mono">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed pr-8">
                        {gap}
                      </p>
                      <button
                        onClick={() => handleCopyText(gap, `gap-${i}`)}
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === `gap-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: ATS Optimization (index 1) */}
            {activeTab === 1 && (
              <div className="space-y-6">
                {/* Score Card overview */}
                <ATSScoreCard score={atsScore} />

                {/* Split list metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left keywords chips */}
                  <div className="lg:col-span-5">
                    <KeywordBadgeList keywords={missingKeywords} />
                  </div>
                  {/* Right improvements panel */}
                  <div className="lg:col-span-7">
                    <ResumeImprovementCards improvements={resumeImprovements} />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Core Questions (index 2) */}
            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-600/10 dark:bg-blue-500/5 border border-blue-200/40 dark:border-blue-500/15 rounded-2xl flex items-start gap-3">
                  <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Tailored Competency & Behavioral Questions
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Tailored strictly to challenge your skill gaps. Practice these using the SAR (State, Action, Result) model.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {questions.map((question, i) => (
                    <div
                      key={i}
                      className="group relative p-5 rounded-2xl border border-slate-200/40 dark:border-white/5 bg-slate-50/20 dark:bg-white/5 backdrop-blur-md hover:border-blue-500/20 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-500/15 px-2 py-0.5 rounded-md border border-blue-200/30 dark:border-blue-500/10 font-mono">
                          Question {i + 1}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-bold leading-relaxed pr-8">
                        {question}
                      </p>
                      <button
                        onClick={() => handleCopyText(question, `q-${i}`)}
                        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === `q-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Tough Scenarios (index 3) */}
            {activeTab === 3 && (
              <div className="space-y-4">
                <div className="p-4 bg-rose-500/10 dark:bg-rose-500/5 border border-rose-250/30 dark:border-rose-500/15 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      High-Stress Pushbacks & Objections
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Interviewers may point out weaknesses in a direct, confrontational style. Practice addressing these objections confidently.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {pushbackQuestions.map((pushback, i) => (
                    <div
                      key={i}
                      className="group relative p-5 rounded-2xl border border-slate-200/40 dark:border-white/5 bg-slate-50/20 dark:bg-white/5 backdrop-blur-md hover:border-rose-500/20 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-200/30 dark:border-rose-500/10 font-mono">
                          Critical Objection {i + 1}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed pr-8">
                        {pushback}
                      </p>
                      <button
                        onClick={() => handleCopyText(pushback, `p-${i}`)}
                        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === `p-${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Salary Negotiation (index 4) */}
            {activeTab === 4 && (
              <div className="space-y-6">
                {/* 1. Tactical leverage tips highlights */}
                <NegotiationTips tips={negotiationTips} />

                {/* 2. HR compensation questions */}
                <SalaryQuestionCards questions={hrQuestions} />

                {/* 3. Word-for-word scripts accordion */}
                <AnswerFrameworkAccordion frameworks={recommendedFrameworks} />
              </div>
            )}

            {/* Tab 6: Outreach Pitch (index 5) */}
            {activeTab === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Professional Networking Assets
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Card 1: Cold Email to Hiring Manager */}
                  <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        Cold Email Pitch (Hiring Manager)
                      </h4>
                      <button
                        onClick={() => handleCopyText(outreachAssets.cold_email, "cold_email")}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {copiedIndex === "cold_email" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Email</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs p-4 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-900/50 max-h-[300px] overflow-y-auto">
                      {outreachAssets.cold_email}
                    </pre>
                  </div>

                  {/* Card 2: LinkedIn Message */}
                  <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-indigo-500" />
                        LinkedIn Invite Pitch (Recruiter)
                      </h4>
                      <button
                        onClick={() => handleCopyText(outreachAssets.linkedin_pitch, "linkedin_pitch")}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {copiedIndex === "linkedin_pitch" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Pitch</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs p-4 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-900/50 max-h-[150px] overflow-y-auto">
                      {outreachAssets.linkedin_pitch}
                    </pre>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span>Designed to fit under LinkedIn's 300 character limit.</span>
                      <span>Length: {outreachAssets.linkedin_pitch.length} chars</span>
                    </div>
                  </div>

                  {/* Card 3: Thank You Note */}
                  <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-indigo-500" />
                        Post-Interview Thank You Note
                      </h4>
                      <button
                        onClick={() => handleCopyText(outreachAssets.thank_you_note, "thank_you_note")}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {copiedIndex === "thank_you_note" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Note</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs p-4 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed border border-slate-100 dark:border-slate-900/50 max-h-[300px] overflow-y-auto">
                      {outreachAssets.thank_you_note}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Coach Strategy (index 6) */}
            {activeTab === 6 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Executive Coach Briefing
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyText(coachReport, "coach_report")}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {copiedIndex === "coach_report" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>

                    {/* Download PDF Button */}
                    <button
                      onClick={() => {
                        const printContent = document.getElementById("printable-coach-report")?.innerHTML;
                        if (printContent) {
                          const win = window.open("", "_blank");
                          if (win) {
                            win.document.write(`
                              <html>
                                <head>
                                  <title>Career Command Center Strategy Report</title>
                                  <style>
                                    body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 800px; margin: 0 auto; }
                                    pre { background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; overflow-x: auto; }
                                    code { font-family: monospace; background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-size: 0.9em; }
                                    h1 { color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; font-size: 1.8em; margin-top: 30px; }
                                    h2 { color: #1e40af; border-bottom: 1px solid #93c5fd; padding-bottom: 6px; font-size: 1.4em; margin-top: 25px; }
                                    h3 { color: #1e3a8a; font-size: 1.1em; margin-top: 20px; }
                                    blockquote { border-left: 4px solid #3b82f6; padding: 8px 16px; background: #eff6ff; color: #1e3a8a; font-style: italic; border-radius: 0 8px 8px 0; margin: 20px 0; }
                                    ul, ol { padding-left: 20px; }
                                    li { margin-bottom: 6px; }
                                    hr { border: 0; border-top: 1px solid #cbd5e1; margin: 30px 0; }
                                  </style>
                                </head>
                                <body>
                                  ${printContent}
                                  <script>
                                    window.onload = function() {
                                      window.print();
                                      window.close();
                                    }
                                  </script>
                                </body>
                              </html>
                            `);
                            win.document.close();
                          }
                        }
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Render elegant Markdown content using simple div wrapper and styling class */}
                <div id="printable-coach-report" className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 overflow-x-hidden md:text-base markdown-body">
                  <ReactMarkdown>{coachReport}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Tab 8: AI Mentor Chat (index 7) */}
            {activeTab === 7 && (
              <div className="flex flex-col h-[500px] max-h-[500px] border border-slate-200/40 dark:border-white/5 bg-slate-50/10 dark:bg-slate-950/20 rounded-2xl overflow-hidden">
                {/* Chat Header Info */}
                <div className="px-5 py-3 border-b border-slate-200/40 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Interactive Strategy Session
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-medium font-mono uppercase tracking-wider border border-emerald-500/20">
                    Live Groq RAG Context
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col scrollbar-thin">
                  {chatMessages.map((msg, i) => {
                    const isAssistant = msg.role === "assistant";
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 max-w-[85%] ${
                          isAssistant ? "self-start" : "self-end flex-row-reverse"
                        }`}
                      >
                        {isAssistant && (
                          <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm border border-blue-200/20">
                            <Brain className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            isAssistant
                              ? "bg-white dark:bg-white/5 border border-slate-200/40 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none"
                              : "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-tr-none"
                          }`}
                        >
                          {isAssistant ? (
                            <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed space-y-2 markdown-body">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading Bubble */}
                  {isChatLoading && (
                    <div className="flex items-start gap-2.5 max-w-[85%] self-start">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/20">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200/40 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-tl-none flex items-center gap-2">
                        <span className="text-xs font-medium animate-pulse">Mentor is reflecting on your dossier...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Panel */}
                <form
                  onSubmit={handleSendChatMessage}
                  className="p-3.5 border-t border-slate-200/40 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 flex gap-2.5 items-center shrink-0"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isChatLoading}
                    placeholder="Ask about matching skills, specific gaps, interview tips..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200/40 dark:border-white/10 bg-white/70 dark:bg-slate-950/70 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="px-4.5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Ask Mentor</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
