import { ChangeEvent } from "react";
import { Terminal, Copy } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onLoadSample: () => void;
}

export default function JobDescriptionInput({ value, onChange, onLoadSample }: JobDescriptionInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Target Job Description
        </label>
        <button
          onClick={onLoadSample}
          type="button"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline flex items-center gap-1"
        >
          <Terminal className="w-3.5 h-3.5" />
          Load Sample Job
        </button>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          rows={7}
          placeholder="Paste the target job description here. Mention key tools, experience levels, and responsibility descriptions..."
          className="w-full rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-md p-4 text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all duration-200 resize-none leading-relaxed placeholder-slate-400 dark:placeholder-slate-500"
        />
        <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-black/30 px-1.5 py-0.5 rounded border border-slate-200/40 dark:border-white/10">
          {value.length} characters
        </div>
      </div>
    </div>
  );
}
