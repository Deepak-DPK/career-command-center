import { motion } from "motion/react";
import { Briefcase, Brain, Award, ShieldAlert, Sparkles, LogIn, ChevronRight, Play } from "lucide-react";

interface LandingHeroProps {
  onSignInWithGoogle: () => void;
  onSignInMock: () => void;
  isAuthenticating: boolean;
}

export default function LandingHero({ onSignInWithGoogle, onSignInMock, isAuthenticating }: LandingHeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center z-10"
      >
        {/* Glow Tagline */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 dark:bg-blue-500/10 border border-blue-200/40 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
          <span>AI-Powered Interview Preparation</span>
        </motion.div>

        {/* Big Display Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Career <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent">Command Center</span>
        </motion.h1>

        {/* Descriptive Tagline Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Bridge experience gaps, conquer tough objections, and unlock tailored interview preparation material modeled after executive career-coaching playbooks.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16"
        >
          {/* Sign in with Google Button */}
          <button
            onClick={onSignInWithGoogle}
            disabled={isAuthenticating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-[size:200%_auto] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:bg-[position:right_center] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {isAuthenticating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.078-1.314-.176-1.88H12.24z" />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Quick Sandbox / Developer Guest Access */}
          <button
            onClick={onSignInMock}
            disabled={isAuthenticating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:bg-white/65 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 text-emerald-500 fill-current" />
            <span>Launch Sandbox Mode</span>
          </button>
        </motion.div>

        {/* Short Feature Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Skill Gaps Mapping</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Analyze your PDF resume against job descriptions to expose hidden qualification mismatches.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Provocative Objections</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Prepare for tough, defensive scenarios and interviewers looking to pick apart experience gaps.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 shadow-sm flex flex-col gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Advisory Coaching</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Receive customized markdown coach strategy, elevator pitches, and custom 30-60-90 day plans.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
