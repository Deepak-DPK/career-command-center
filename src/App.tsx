import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Sparkles,
  Award,
  Terminal,
  Clock,
  Briefcase,
  HelpCircle,
  FileCheck2,
  Lock,
  Compass
} from "lucide-react";

import { UserSession, PrepKitResponse, ToastMessage } from "./types";
import Navbar from "./components/Navbar";
import LandingHero from "./components/LandingHero";
import UploadCard from "./components/UploadCard";
import JobDescriptionInput from "./components/JobDescriptionInput";
import GenerateButton from "./components/GenerateButton";
import ResultsTabs from "./components/ResultsTabs";
import LoadingOverlay from "./components/LoadingOverlay";
import ErrorToast from "./components/ErrorToast";

import {
  signInWithGoogle,
  signOutUser,
  isRealFirebase,
  getPersistedUser
} from "./firebase/config";
import { generatePrepKit } from "./services/api";
import { SAMPLE_JOBS } from "./data/samples";

export default function App() {
  // Session state
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [sampleIndex, setSampleIndex] = useState(0);

  // App running states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [prepKit, setPrepKit] = useState<PrepKitResponse | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
  async function restoreSession() {
    const isDark = localStorage.getItem("theme") !== "light";
    setDarkMode(isDark);

    const storedKit = localStorage.getItem("ccc_latest_kit");
    const storedJob = localStorage.getItem("ccc_latest_job");

    if (storedKit) {
      try {
        setPrepKit(JSON.parse(storedKit));
      } catch (e) {
        console.error(e);
        localStorage.removeItem("ccc_latest_kit");
      }
    }

    if (storedJob) {
      setJobDescription(storedJob);
    }

    try {
      const firebaseUser = await getPersistedUser();
      if (firebaseUser) {
        setUser(firebaseUser);
        return;
      }
    } catch (err) {
      console.error("Firebase restore failed:", err);
    }

    const cachedUser = localStorage.getItem("ccc_sandbox_user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        localStorage.removeItem("ccc_sandbox_user");
      }
    }
  }

  restoreSession();
}, []);
  // Update HTML class when dark mode changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toast notifications helpers
  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Authenticate triggers
  const handleSignInGoogle = async () => {
    setIsAuthenticating(true);
    try {
      const session = await signInWithGoogle();
      setUser(session);
      addToast(`Welcome to Career Command Center, ${session.displayName || "Commander"}!`, "success");
      
      // Persist sandbox session if applicable
      if (session.isMockUser) {
        localStorage.setItem("ccc_sandbox_user", JSON.stringify(session));
      }
    } catch (error: any) {
      addToast(error?.message || "Sign-in with Google failed.", "error");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignInMock = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const mockUser: UserSession = {
        uid: "sandbox_commander_99",
        email: "guest@careerccc.ai",
        displayName: "Sandbox Guest",
        photoURL: null,
        isMockUser: true,
      };
      setUser(mockUser);
      localStorage.setItem("ccc_sandbox_user", JSON.stringify(mockUser));
      addToast("Launched Command Center in Sandbox Mode!", "success");
      setIsAuthenticating(false);
    }, 600);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      localStorage.removeItem("ccc_sandbox_user");
      addToast("Successfully logged out.", "info");
    } catch (error) {
      addToast("Failed to clear auth session.", "error");
    }
  };

  // Cycle and load job samples
  const handleLoadSample = () => {
    const sample = SAMPLE_JOBS[sampleIndex];
    setJobDescription(sample.description);
    setSampleIndex((prev) => (prev + 1) % SAMPLE_JOBS.length);
    addToast(`Loaded target role: ${sample.title} at ${sample.company}`, "info");
  };

  // Generate Career Prep Kit core handler
  const handleGenerate = async () => {
    if (!selectedFile) {
      addToast("Please upload a PDF Resume to analyze.", "error");
      return;
    }
    if (!jobDescription || !jobDescription.trim()) {
      addToast("Please provide a Target Job Description to map against.", "error");
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const result = await generatePrepKit(selectedFile, jobDescription);
      setPrepKit(result);
      setIsSuccess(true);
      addToast("Analysis completed! Career Prep Kit successfully generated.", "success");

      // Persist results in local state (local storage)
      localStorage.setItem("ccc_latest_kit", JSON.stringify(result));
      localStorage.setItem("ccc_latest_job", jobDescription);

      // Brief success animation flash
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error: any) {
      addToast(error?.message || "An error occurred during report generation.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Global Navigation Header */}
      <Navbar
        user={user}
        onSignOut={handleSignOut}
        onSignInMock={handleSignInMock}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {!user ? (
            /* 1. Landing / Auth Page */
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col"
            >
              <LandingHero
                onSignInWithGoogle={handleSignInGoogle}
                onSignInMock={handleSignInMock}
                isAuthenticating={isAuthenticating}
              />
            </motion.div>
          ) : (
            /* 2. Command Dashboard Page */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column (Inputs) - Takes 5 grid spots */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Command Panel
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Deploy your credentials and target criteria to extract the strategy package.
                  </p>
                </div>

                {/* PDF Resume Drag-and-Drop */}
                <div className="bg-white/45 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-xl flex flex-col gap-4">
                  <UploadCard
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                    onError={(err) => addToast(err, "error")}
                  />
                </div>

                {/* Job Description Textarea */}
                <div className="bg-white/45 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-xl flex flex-col gap-4">
                  <JobDescriptionInput
                    value={jobDescription}
                    onChange={setJobDescription}
                    onLoadSample={handleLoadSample}
                  />
                </div>

                {/* Trigger Action Button */}
                <GenerateButton
                  onClick={handleGenerate}
                  disabled={!selectedFile || !jobDescription.trim()}
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                />

                {/* Sandbox / Real Firebase Notice Box */}
                <div className="p-4 rounded-xl border border-slate-200/40 dark:border-white/5 bg-slate-100/30 dark:bg-white/5 backdrop-blur-md text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Deployment & Key Integrations</span>
                  </div>
                  {!isRealFirebase ? (
                    <p>
                      Currently operating in <span className="text-indigo-600 dark:text-indigo-400 font-bold">Sandbox Mode</span>. 
                      You can drop any PDF file and job description to preview high-fidelity strategic coaching mock data instantly. To activate actual Gemini processing, declare your <span className="font-mono">GEMINI_API_KEY</span> in the project's Secrets panel.
                    </p>
                  ) : (
                    <p>
                      Connected securely to Google Gemini API on the server. All calculations are handled without browser exposures. To configure persistent hosting, run <span className="font-mono">npm run build</span> and export your artifact.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column (AI Insights Output) - Takes 7 grid spots */}
              <div className="lg:col-span-7 flex flex-col">
                <AnimatePresence mode="wait">
                  {prepKit ? (
                    /* Active Results Output */
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="flex-grow flex flex-col gap-6"
                    >
                      <div className="flex items-center justify-between shrink-0">
                        <div className="flex flex-col gap-1">
                          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Intelligence Command
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Generated prep kit metrics based on your career analysis.
                          </p>
                        </div>
                        {/* Clear Cache Action */}
                        <button
                          onClick={() => {
                            if (window.confirm("Clear the current active kit and inputs?")) {
                              setPrepKit(null);
                              setSelectedFile(null);
                              setJobDescription("");
                              localStorage.removeItem("ccc_latest_kit");
                              localStorage.removeItem("ccc_latest_job");
                              addToast("Preparation Command Center reset successfully.", "info");
                            }
                          }}
                          className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          Reset Dashboard
                        </button>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <ResultsTabs data={prepKit} />
                      </div>
                    </motion.div>
                  ) : (
                    /* Awaiting Input Empty State */
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-grow flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200/60 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-md min-h-[480px]"
                    >
                      <div className="relative w-16 h-16 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/30 dark:border-blue-500/30 mb-5 shadow-sm">
                        <Brain className="w-8 h-8 animate-pulse text-blue-500" />
                        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                        Awaiting Flight Directive
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                        Upload your PDF Resume and a Job Description in the Command Panel, then trigger the AI strategist to launch your customized interview war-room.
                      </p>
                      
                      {/* Micro list helper */}
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md w-full">
                        <div className="p-3 text-left rounded-xl bg-white/40 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 flex items-start gap-2.5 backdrop-blur-sm">
                          <FileCheck2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Resume Diagnostic</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Scans work scopes, frameworks, and scale credentials.</p>
                          </div>
                        </div>
                        <div className="p-3 text-left rounded-xl bg-white/40 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 flex items-start gap-2.5 backdrop-blur-sm">
                          <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Strategic Response</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Outputs objection templates, pitches, and dynamic tactics.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Interactive Elements */}
      <LoadingOverlay isLoading={isLoading} />
      <ErrorToast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
