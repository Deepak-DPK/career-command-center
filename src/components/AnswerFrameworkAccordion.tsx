import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Sparkles, Copy, Check, Info } from "lucide-react";
import { AnswerFramework } from "../types";

interface AnswerFrameworkAccordionProps {
  frameworks: AnswerFramework[];
}

export default function AnswerFrameworkAccordion({ frameworks }: AnswerFrameworkAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First card open by default
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering accordion toggle
    navigator.clipboard.writeText(text);
    setCopiedState((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

  if (!frameworks || frameworks.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
        No answer frameworks available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Subheader */}
      <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-white/10 pb-2">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
          Recommended Compensation Answer Frameworks
        </h4>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {frameworks.map((fw, i) => {
          const isOpen = expandedIndex === i;
          const copyKey = `fw-${i}`;
          const isCopied = !!copiedState[copyKey];

          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? "border-blue-500/30 bg-blue-500/5 dark:bg-white/5"
                  : "border-slate-200/55 dark:border-white/5 bg-white/30 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/10"
              }`}
            >
              {/* Header / Toggle Button */}
              <button
                onClick={() => setExpandedIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left select-none cursor-pointer"
              >
                <div className="flex items-center gap-3.5 pr-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold font-mono">
                    {i + 1}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {fw.title}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Inline Copy Shortcut */}
                  <button
                    onClick={(e) => handleCopy(fw.example, copyKey, e)}
                    className="p-1.5 rounded-lg border border-slate-200/50 dark:border-white/5 bg-white dark:bg-black/30 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-400 hover:text-blue-500 transition-all cursor-pointer"
                    title="Copy full verbal script"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Toggle Arrow icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="border-t border-slate-200/40 dark:border-white/10"
                  >
                    <div className="p-5 space-y-4 bg-slate-50/50 dark:bg-black/20">
                      {/* 1. Underlying Strategy Framework formula */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" /> Strategic Formula
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                          {fw.framework}
                        </p>
                      </div>

                      {/* 2. High-Impact Verbal Script */}
                      <div className="p-4 rounded-xl border border-emerald-500/10 dark:border-emerald-500/10 bg-emerald-500/5 dark:bg-emerald-500/5 space-y-1.5 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            Verbatim High-Impact Script
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-serif italic leading-relaxed">
                          {fw.example}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
