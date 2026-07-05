import { useState, useEffect, useCallback } from "react";
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
  Compass,
  Trash2
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
  auth 
} from "./firebase/config";
import { 
  savePrepKitToDB, 
  fetchPrepKitsFromDB, 
  deletePrepKitFromDB,
  SavedPrepKit 
} from "./supabaseClient";
import { onAuthStateChanged } from "firebase/auth";
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

  // History states
  const [history, setHistory] = useState<SavedPrepKit[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // App running states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [prepKit, setPrepKit] = useState<PrepKitResponse | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  // Local state persistence: Load previous generation & user session on mount
  useEffect(() => {
    // Theme setup
    const isDark = localStorage.getItem("theme") !== "light";
    setDarkMode(isDark);

    // Load persisted prep kit (session scoped to avoid cross-user or persistent leak)
    const storedKit = sessionStorage.getItem("ccc_latest_kit");
    const storedJob = sessionStorage.getItem("ccc_latest_job");
    if (storedKit) {
      try {
        setPrepKit(JSON.parse(storedKit));
      } catch (e) {
        console.error("Failed to parse cached prep kit:", e);
      }
    }
    if (storedJob) {
      setJobDescription(storedJob);
    }

    // Load cached sandbox session if available
    const cachedUser = sessionStorage.getItem("ccc_sandbox_user");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error("Failed to parse cached user:", e);
      }
    }
  }, []);

  // Listen for real Firebase auth session updates to persist login on refresh
  useEffect(() => {
    if (isRealFirebase && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser((currentUser) => {
            if (currentUser?.isMockUser) {
              return currentUser;
            }
            return null;
          });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Fetch history when user session changes
  useEffect(() => {
    if (user) {
      const loadHistory = async () => {
        setIsHistoryLoading(true);
        try {
          const kits = await fetchPrepKitsFromDB(user.uid);
          setHistory(kits);
        } catch (error) {
          console.error("Failed to load user history:", error);
        } finally {
          setIsHistoryLoading(false);
        }
      };
      loadHistory();
    } else {
      setHistory([]);
      // Clear active states and cache on logout to avoid leaking data to different users or sandbox
      setPrepKit(null);
      setJobDescription("");
      setSelectedFile(null);
      
      sessionStorage.removeItem("ccc_latest_kit");
      sessionStorage.removeItem("ccc_latest_job");
      sessionStorage.removeItem("ccc_mock_history");
      sessionStorage.removeItem("ccc_sandbox_user");
      
      localStorage.removeItem("ccc_latest_kit");
      localStorage.removeItem("ccc_latest_job");
      localStorage.removeItem("ccc_mock_history");
    }
  }, [user]);

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
        sessionStorage.setItem("ccc_sandbox_user", JSON.stringify(session));
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
      sessionStorage.setItem("ccc_sandbox_user", JSON.stringify(mockUser));
      addToast("Launched Command Center in Sandbox Mode!", "success");
      setIsAuthenticating(false);
    }, 600);
  };

  const handleSignOut = useCallback(async () => {
    try {
      await signOutUser();
      setUser(null);
      sessionStorage.removeItem("ccc_sandbox_user");
      addToast("Successfully logged out.", "info");
    } catch (error) {
      addToast("Failed to clear auth session.", "error");
    }
  }, []);

  // Inactivity timeout: Auto-logout after 15 minutes of idle time
  useEffect(() => {
    if (!user) return;

    const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleSignOut();
        addToast("Logged out automatically due to inactivity.", "info");
      }, INACTIVITY_TIMEOUT);
    };

    // Track user interactions to reset the idle timer
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    
    resetTimer();

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, handleSignOut]);

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
      const result = await generatePrepKit(selectedFile, jobDescription, user?.uid);
      setPrepKit(result);
      setIsSuccess(true);
      addToast("Analysis completed! Career Prep Kit successfully generated.", "success");

      // Persist results in local state (session storage to avoid persistent leak)
      sessionStorage.setItem("ccc_latest_kit", JSON.stringify(result));
      sessionStorage.setItem("ccc_latest_job", jobDescription);

      // Save to database/history if user logged in
      if (user) {
        try {
          const docId = await savePrepKitToDB(
            user.uid,
            jobDescription,
            selectedFile.name,
            result
          );
          setHistory((prev) => [
            {
              id: docId,
              userId: user.uid,
              jobDescription,
              resumeFilename: selectedFile.name,
              prepKit: result,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        } catch (dbError) {
          console.error("Failed to save kit to database:", dbError);
          addToast("Failed to save report to database history.", "error");
        }
      }

      // Brief success animation flash
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error: any) {
      addToast(error?.message || "An error occurred during report generation.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadHistoryItem = (item: SavedPrepKit) => {
    setPrepKit(item.prepKit);
    setJobDescription(item.jobDescription);
    addToast(`Loaded Strategy Package for ${item.resumeFilename}!`, "success");
    sessionStorage.setItem("ccc_latest_kit", JSON.stringify(item.prepKit));
    sessionStorage.setItem("ccc_latest_job", item.jobDescription);
  };

  const handleDeleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this saved prep kit?")) {
      return;
    }
    try {
      await deletePrepKitFromDB(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      addToast("Saved strategy kit deleted.", "success");
    } catch (error) {
      console.error("Failed to delete prep kit:", error);
      addToast("Failed to delete the saved strategy kit.", "error");
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

                {/* Saved Strategy History Panel */}
                <div className="bg-white/45 dark:bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      Saved Strategy History
                    </h3>
                    <span className="text-[10px] bg-indigo-100/60 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
                      {history.length} Saved
                    </span>
                  </div>

                  {isHistoryLoading ? (
                    <div className="flex items-center justify-center py-6 text-xs text-slate-400">
                      <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
                      Loading history...
                    </div>
                  ) : history.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
                      No saved strategy kits yet. Generate your first kit to save it here!
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {history.map((item) => {
                        const date = item.createdAt 
                          ? new Date(item.createdAt)
                          : new Date();
                        const formattedDate = date.toLocaleDateString(undefined, { 
                          month: "short", 
                          day: "numeric", 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        });

                        return (
                          <div
                            key={item.id}
                            className="w-full flex items-center gap-2 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/50 hover:bg-indigo-50/10 dark:hover:bg-indigo-950/20 transition-all duration-200 group relative"
                          >
                            <button
                              onClick={() => handleLoadHistoryItem(item)}
                              className="flex-1 text-left flex flex-col gap-1 cursor-pointer min-w-0"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                  {item.resumeFilename}
                                </span>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                                  {formattedDate}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate line-clamp-1">
                                {item.jobDescription}
                              </p>
                            </button>
                            <button
                              onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200 cursor-pointer shrink-0 opacity-60 hover:opacity-100 focus:opacity-100"
                              title="Delete saved kit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
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
                              sessionStorage.removeItem("ccc_latest_kit");
                              sessionStorage.removeItem("ccc_latest_job");
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
                        <ResultsTabs data={prepKit} jobDescription={jobDescription} />
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
