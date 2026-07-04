import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Sparkles, Brain, Compass, Terminal, Gauge, Coins } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export default function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  const [currentTipIdx, setCurrentTipIdx] = useState(0);

  const loadingTips = [
    { text: "Reading PDF resume credentials...", icon: <Terminal className="w-4 h-4 text-indigo-400" /> },
    { text: "Extracting work histories & core competency indexes...", icon: <Brain className="w-4 h-4 text-emerald-400" /> },
    { text: "ATS Optimizer mapping keyword density and syntax gaps...", icon: <Sparkles className="w-4 h-4 text-blue-400" /> },
    { text: "ATS Optimizer evaluating resume rating & phrasing optimizations...", icon: <Gauge className="w-4 h-4 text-emerald-400" /> },
    { text: "Identifying scope disparities and experience mismatch areas...", icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { text: "Drafting custom behavioral questions and pressure scenarios...", icon: <Brain className="w-4 h-4 text-indigo-400" /> },
    { text: "Salary Negotiator mapping compensation trap questions & tactical tips...", icon: <Coins className="w-4 h-4 text-yellow-400" /> },
    { text: "Salary Negotiator scripting high-leverage verbal answer frameworks...", icon: <Compass className="w-4 h-4 text-indigo-400" /> },
    { text: "Finalizing career coach strategic action plan...", icon: <Sparkles className="w-4 h-4 text-pink-400" /> },
  ];

  useEffect(() => {
    if (!isLoading) return;

    const timer = setInterval(() => {
      setCurrentTipIdx((prev) => (prev + 1) % loadingTips.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center flex flex-col items-center gap-6"
          >
            {/* Spinning Indicator */}
            <div className="relative flex items-center justify-center w-16 h-16">
              <Loader2 className="absolute w-12 h-12 text-indigo-500 animate-spin" />
              <div className="w-6 h-6 rounded-full bg-indigo-500/10 animate-ping" />
            </div>

            {/* Core Message */}
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                AI Career Coach Active
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Analyzing credentials. This usually takes 5-10 seconds.
              </p>
            </div>

            {/* Rotating Tips */}
            <div className="w-full min-h-[52px] py-3 px-4 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTipIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2.5 text-xs text-slate-300 font-medium"
                >
                  {loadingTips[currentTipIdx].icon}
                  <span>{loadingTips[currentTipIdx].text}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Micro progress line */}
            <div className="w-full h-1 bg-slate-850 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "5%" }}
                animate={{ width: "95%" }}
                transition={{ duration: 15, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
