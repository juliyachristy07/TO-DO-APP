import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bot,
  Bell,
  Volume2,
  Trash2,
  RotateCcw,
  User,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useTodos } from '../../context/TodoContext';
import { useNotification } from '../../context/NotificationContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, toggleTheme } = useSettings();
  const { clearCompleted, clearAll, resetToDemoData, todos } = useTodos();
  const { showNotification } = useNotification();

  const [nameInput, setNameInput] = useState(settings.userName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateSettings({ userName: nameInput.trim() });
    showNotification('success', 'Profile Updated', `Name set to "${nameInput.trim()}".`);
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Application Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your AI study teacher, Pomodoro focus duration, and data storage.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">User Profile</h3>
          </div>

          <form onSubmit={handleSaveName} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Display Name (Used in AI Greetings)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Theme & Display */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            {settings.theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Appearance & Theme
            </h3>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Interface Mode
              </p>
              <p className="text-[11px] text-slate-400">
                Currently in {settings.theme === 'dark' ? 'Dark' : 'Light'} Mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
            >
              Toggle to {settings.theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* AI Coach Preferences */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              AI Coach & Assistance
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  AI Teacher Coach Panel
                </p>
                <p className="text-[11px] text-slate-400">
                  Shows speech bubbles and motivation banners
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.aiCoachEnabled}
                onChange={(e) => updateSettings({ aiCoachEnabled: e.target.checked })}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Completion Audio Sound
                </p>
                <p className="text-[11px] text-slate-400">
                  Plays gentle harmonic chime upon completing focus timer
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Focus Duration Preferences */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Default Focus Duration
            </h3>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Standard Sprint Interval
            </p>
            <div className="flex gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => updateSettings({ focusDuration: mins })}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    settings.focusDuration === mins
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone / Local Data Management */}
      <div className="p-6 rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 space-y-4">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-sm font-bold">Data Management & Reset</h3>
        </div>
        <p className="text-xs text-rose-800/80 dark:text-rose-300/80 leading-relaxed">
          Manage your browser localStorage data. You can clean completed tasks, restore default
          student demo tasks, or wipe everything.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={clearCompleted}
            disabled={completedCount === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed Tasks ({completedCount})</span>
          </button>

          <button
            onClick={resetToDemoData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 hover:bg-indigo-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Demo Tasks</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all tasks and stored history?')) {
                clearAll();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-sm shadow-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
