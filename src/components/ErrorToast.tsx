import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ErrorToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function ErrorToast({ toasts, removeToast }: ErrorToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const bgColors = {
    success: "bg-slate-900/95 border-emerald-500/30 text-emerald-100 shadow-lg shadow-emerald-950/20",
    error: "bg-slate-900/95 border-rose-500/30 text-rose-100 shadow-lg shadow-rose-950/20",
    info: "bg-slate-900/95 border-blue-500/30 text-blue-100 shadow-lg shadow-blue-950/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex items-start gap-3 p-4 rounded-xl border ${bgColors[toast.type]} backdrop-blur-md`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 transition-colors shrink-0 rounded-lg p-0.5 hover:bg-slate-800"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
