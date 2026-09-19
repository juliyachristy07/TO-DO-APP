import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Sun,
  Moon,
  Bell,
  Menu,
  X,
  Zap,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useTodos } from '../../context/TodoContext';
import { useNotification } from '../../context/NotificationContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { settings, toggleTheme } = useSettings();
  const { focusStreak, todos } = useTodos();
  const { showNotification } = useNotification();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const completedToday = todos.filter((t) => t.completed).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  AI Todo Teacher
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  <Sparkles className="w-2.5 h-2.5" /> PRO
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-400 font-medium -mt-0.5">
                Smart Todo Manager & Study Coach
              </p>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Focus Streak Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold"
            title={`${focusStreak} focus sessions completed today`}
          >
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>{focusStreak} Streak</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark/light mode"
            title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {completedToday > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Activity & Alerts
                  </h4>
                  <span className="text-[10px] text-slate-400">Today</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">AI Teacher active</p>
                      <p className="text-[11px] text-slate-500">
                        Smart priority and study assistance are ready.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{completedToday} tasks completed</p>
                      <p className="text-[11px] text-slate-500">Keep up the steady progress!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {settings.userName.charAt(0)}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {settings.userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
