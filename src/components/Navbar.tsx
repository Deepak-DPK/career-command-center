import { motion } from "motion/react";
import { LogOut, Sun, Moon, Briefcase, Sparkles, User } from "lucide-react";
import { UserSession } from "../types";

interface NavbarProps {
  user: UserSession | null;
  onSignOut: () => void;
  onSignInMock: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({ user, onSignOut, onSignInMock, darkMode, setDarkMode }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/40 dark:border-white/10 bg-white/60 dark:bg-slate-950/40 backdrop-blur-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-md shadow-indigo-500/20 text-white">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
              Career Command Center
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Elevate Your Position</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Light/Dark Mode Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {/* User Metadata */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {user.displayName || "Career Commander"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {user.email || "user@careerccc.ai"}
                </span>
              </div>

              {/* Avatar */}
              <div className="relative group">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User Avatar"}
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
              </div>

              {/* Log Out Button */}
              <button
                onClick={onSignOut}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/30 transition-all duration-200 flex items-center gap-1.5 text-xs font-semibold"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInMock}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Access Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
