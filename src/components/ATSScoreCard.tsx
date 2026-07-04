import { motion } from "motion/react";
import { Gauge, Sparkles } from "lucide-react";

interface ATSScoreCardProps {
  score: number;
}

export default function ATSScoreCard({ score }: ATSScoreCardProps) {
  // Determine color theme & label based on ATS score thresholds
  let scoreColor = "text-rose-500 dark:text-rose-400";
  let scoreBg = "bg-rose-500/10";
  let scoreBorder = "border-rose-500/30";
  let scoreLabel = "Poor Match";
  let scoreDesc = "Your resume has high friction with the core requirements. Essential metrics and context are missing.";

  if (score > 40 && score <= 70) {
    scoreColor = "text-amber-500 dark:text-amber-400";
    scoreBg = "bg-amber-500/10";
    scoreBorder = "border-amber-500/30";
    scoreLabel = "Moderate Alignment";
    scoreDesc = "A solid base, but several high-impact terms and operational metrics should be integrated.";
  } else if (score > 70) {
    scoreColor = "text-emerald-500 dark:text-emerald-400";
    scoreBg = "bg-emerald-500/10";
    scoreBorder = "border-emerald-500/30";
    scoreLabel = "Excellent Strategy";
    scoreDesc = "Excellent architectural mapping. Minor refinement will secure full automatic system bypass.";
  }

  // Ring parameters for the radial SVG circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6">
      {/* Radial score gauge */}
      <div className="relative shrink-0 flex items-center justify-center w-36 h-36">
        <svg className="w-full h-full -rotate-90">
          {/* Base Track circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-slate-200 dark:stroke-white/5 fill-transparent"
            strokeWidth="10"
          />
          {/* Animated Glow outline */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            className={`fill-transparent opacity-30 blur-[2px] ${
              score > 70 ? "stroke-emerald-500" : score > 40 ? "stroke-amber-500" : "stroke-rose-500"
            }`}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {/* Primary value indicator */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            className={`fill-transparent transition-all duration-300 ${
              score > 70 ? "stroke-emerald-500" : score > 40 ? "stroke-amber-500" : "stroke-rose-500"
            }`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Floating text value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight font-mono text-slate-800 dark:text-white"
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Score
          </span>
        </div>
      </div>

      {/* Meta context description */}
      <div className="flex-grow space-y-2.5 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreBg} ${scoreColor} ${scoreBorder}`}>
            <Gauge className="w-3.5 h-3.5" />
            {scoreLabel}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
            ATS Optimizer Agent
          </span>
        </div>
        <h3 className="text-base font-extrabold tracking-tight text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Semantic Resonance Rating
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
          {scoreDesc}
        </p>
      </div>
    </div>
  );
}
