import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, HelpCircle } from "lucide-react";

interface SalaryQuestionCardsProps {
  questions: string[];
}

export default function SalaryQuestionCards({ questions }: SalaryQuestionCardsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
        No specific salary questions generated. Ensure job description mentions compensation.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Subheader */}
      <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-white/10 pb-2">
        <HelpCircle className="w-4 h-4 text-purple-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
          Critical HR Compensation Trap Questions
        </h4>
      </div>

      {/* Grid of question cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="group relative p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:border-purple-500/20 dark:hover:border-purple-500/10 hover:shadow-xl hover:shadow-purple-500/5 transition-all flex flex-col justify-between min-h-[140px]"
          >
            <div>
              {/* Question Number Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/15 px-2 py-0.5 rounded-md border border-purple-200/30 dark:border-purple-500/10 font-mono">
                  Question 0{i + 1}
                </span>
                
                {/* Micro hover Copy Button */}
                <button
                  onClick={() => handleCopyText(q, i)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-purple-500 transition-all rounded p-1 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  title="Copy question text"
                >
                  {copiedIndex === i ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Question Text */}
              <p className="text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                {q}
              </p>
            </div>

            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-4 uppercase tracking-widest">
              Negotiation Scenario
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
