import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Tags, Info } from "lucide-react";

interface KeywordBadgeListProps {
  keywords: string[];
}

export default function KeywordBadgeList({ keywords }: KeywordBadgeListProps) {
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  const handleCopyWord = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1500);
  };

  if (!keywords || keywords.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
        No missing keywords identified. Your resume matches critical tags perfectly!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header section with count */}
      <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-white/10 pb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-sans">
          <Tags className="w-4 h-4 text-blue-500" />
          Critical Keyword Gaps ({keywords.length})
        </h4>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
          <Info className="w-3 h-3" /> Click tag to copy
        </span>
      </div>

      {/* Grid containing micro-animated tags */}
      <div className="flex flex-wrap gap-2.5">
        {keywords.map((word, i) => {
          const isCopied = copiedWord === word;
          return (
            <motion.button
              key={word}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() => handleCopyWord(word)}
              className={`relative group inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer select-none ${
                isCopied
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-md shadow-emerald-500/5"
                  : "bg-white/40 dark:bg-white/5 border-slate-200/50 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-[1px]"
              }`}
            >
              <span>{word}</span>
              <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 shrink-0" />
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
