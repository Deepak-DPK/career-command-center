import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy, Sparkles, FileText } from "lucide-react";

interface ResumeImprovementCardsProps {
  improvements: string[];
}

export default function ResumeImprovementCards({ improvements }: ResumeImprovementCardsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  if (!improvements || improvements.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
        No specific resume improvements are requested. Your structural phrasing fits wonderfully.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header section with count */}
      <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-white/10 pb-2">
        <FileText className="w-4 h-4 text-emerald-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
          Recommended Resume Enhancements ({improvements.length})
        </h4>
      </div>

      {/* Grid of optimization advice cards */}
      <div className="grid grid-cols-1 gap-4">
        {improvements.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="group relative p-5 rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-md hover:border-emerald-500/20 dark:hover:border-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/5 transition-all flex items-start gap-4"
          >
            {/* Visual Icon Badge */}
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </span>

            {/* Text description with code snippets highlighted */}
            <div className="flex-grow pr-8">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Enhancement Strategy {i + 1}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                {tip}
              </p>
            </div>

            {/* Float right absolute copy action */}
            <button
              onClick={() => handleCopyText(tip, i)}
              className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-500 transition-all rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              title="Copy rewrite advice"
            >
              {copiedIndex === i ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
