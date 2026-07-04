import { motion } from "motion/react";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

export default function GenerateButton({ onClick, disabled, isLoading, isSuccess }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full relative flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 select-none overflow-hidden cursor-pointer ${
        isSuccess
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
          : isLoading
          ? "bg-blue-600/70 text-white cursor-not-allowed"
          : disabled
          ? "bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-[size:200%_auto] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:bg-[position:right_center] active:scale-[0.98]"
      }`}
    >
      {/* Visual pulse glow on active hover */}
      {!disabled && !isLoading && !isSuccess && (
        <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      )}

      {isSuccess ? (
        <>
          <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />
          <span>Prep Kit Ready!</span>
        </>
      ) : isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin text-white shrink-0" />
          <span>Generating Prep Kit...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 text-blue-100 shrink-0" />
          <span>Generate Career Prep Kit</span>
        </>
      )}
    </button>
  );
}
