import { motion } from "motion/react";
import { Lightbulb, ShieldCheck, HelpCircle } from "lucide-react";

interface NegotiationTipsProps {
  tips: string[];
}

export default function NegotiationTips({ tips }: NegotiationTipsProps) {
  if (!tips || tips.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400">
        No specific strategic negotiation tips provided.
      </div>
    );
  }

  // Define some custom high-end icons to alternate styling
  const icons = [
    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />,
    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />,
    <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
  ];

  return (
    <div className="space-y-4">
      {/* Section Subheader */}
      <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-white/10 pb-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
          Strategic Compensation Leverage Tips
        </h4>
      </div>

      {/* Grid structure for high-impact highlighted tip cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="p-4 rounded-2xl border border-blue-500/10 dark:border-blue-500/5 bg-blue-500/5 dark:bg-blue-500/10 flex gap-3.5 items-start"
          >
            {/* Styled Icon Wrapper */}
            <div className="flex items-center justify-center p-2 rounded-xl bg-white dark:bg-black/20 shadow-sm border border-blue-200/20 dark:border-white/5">
              {icons[i % icons.length]}
            </div>

            <div className="space-y-1">
              <h5 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                Tactical Directive 0{i + 1}
              </h5>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {tip}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
