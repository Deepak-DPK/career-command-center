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
  Coins
} from "lucide-react";
import { PrepKitResponse } from "../types";

// Import custom reusable sub-components
import ATSScoreCard from "./ATSScoreCard";
import KeywordBadgeList from "./KeywordBadgeList";
import ResumeImprovementCards from "./ResumeImprovementCards";
import SalaryQuestionCards from "./SalaryQuestionCards";
import NegotiationTips from "./NegotiationTips";
import AnswerFrameworkAccordion from "./AnswerFrameworkAccordion";

interface ResultsTabsProps {
  data: PrepKitResponse;
}

export default function ResultsTabs({ data }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const tabs = [
    { id: "skill_gaps", label: "Skill Gaps", icon: <Brain className="w-4 h-4" /> },
    { id: "ats_optimization", label: "ATS Optimization", icon: <Gauge className="w-4 h-4" /> },
    { id: "core_questions", label: "Core Questions", icon: <FileText className="w-4 h-4" /> },
    { id: "tough_scenarios", label: "Tough Scenarios", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "salary_negotiation", label: "Salary Negotiation", icon: <Coins className="w-4 h-4" /> },
    { id: "coach_strategy", label: "Coach Strategy", icon: <Compass className="w-4 h-4" /> },
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

  const atsScore = data.ats_analysis?.ats_score ?? 70;
  const missingKeywords = data.ats_analysis?.missing_keywords ?? [];
  const resumeImprovements = data.ats_analysis?.resume_improvements ?? [];

  const hrQuestions = data.salary_negotiation?.hr_questions ?? [];
  const negotiationTips = data.salary_negotiation?.negotiation_tips ?? [];
  const recommendedFrameworks = data.salary_negotiation?.recommended_answer_frameworks ?? [];

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

            {/* Tab 6: Coach Strategy (index 5) */}
            {activeTab === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                    Executive Coach Briefing
                  </span>
                  <button
                    onClick={() => handleCopyText(coachReport, "coach_report")}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedIndex === "coach_report" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied Report!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Render elegant Markdown content using simple div wrapper and styling class */}
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 overflow-x-hidden md:text-base markdown-body">
                  <ReactMarkdown>{coachReport}</ReactMarkdown>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
