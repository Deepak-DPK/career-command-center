import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileText, Check, AlertCircle, X } from "lucide-react";

interface UploadCardProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onError: (message: string) => void;
}

export default function UploadCard({ selectedFile, onFileSelect, onError }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File | null) => {
    if (!file) return;

    // Type checking
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      onError("Invalid file type. Only PDF resumes are accepted.");
      return;
    }

    // Size checking (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      onError("File is too large. Resume PDF must be under 10MB.");
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
        PDF Resume Upload
      </label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,application/pdf"
        className="hidden"
        id="resume-file-input"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[180px] ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.99]"
            : selectedFile
            ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10 backdrop-blur-md"
            : "border-slate-200/60 dark:border-white/10 hover:border-slate-350 dark:hover:border-white/20 bg-white/30 dark:bg-white/5 backdrop-blur-md"
        }`}
      >
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div className="w-full text-center">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30">
                <Check className="w-3 h-3" />
                Validated
              </span>
              <button
                onClick={handleClear}
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <UploadCloud className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span className="text-indigo-600 dark:text-indigo-400 hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF file only (Max 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
