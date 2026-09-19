import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  ArrowRight,
  RefreshCw,
  Send,
  HelpCircle,
  Award,
  Zap,
} from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import { useSettings } from '../../context/SettingsContext';
import { aiSimulator } from '../../services/aiSimulator';
import { DynamicCoachState } from '../../utils/motivation';

export const AICoach: React.FC = () => {
  const navigate = useNavigate();
  const { todos, focusStreak } = useTodos();
  const { settings } = useSettings();

  const [coachState, setCoachState] = useState<DynamicCoachState | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [teacherReply, setTeacherReply] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Fetch coach state whenever todos or streak change
  const refreshAdvice = async () => {
    setIsThinking(true);
    const state = await aiSimulator.generateCoachMessage(todos, focusStreak);
    setCoachState(state);
    setIsThinking(false);
  };

  useEffect(() => {
    refreshAdvice();
  }, [todos, focusStreak]);

  if (!settings.aiCoachEnabled) {
    return null;
  }

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isAnswering) return;

    setIsAnswering(true);
    const topPending = todos.find((t) => !t.completed);
    const reply = await aiSimulator.askTeacherQuestion(userQuery, topPending?.title);
    setTeacherReply(reply);
    setIsAnswering(false);
    setUserQuery('');
  };

  const getMoodBadge = () => {
    if (isThinking) {
      return {
        label: 'Thinking...',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      };
    }
    if (isAnswering) {
      return {
        label: 'Explaining...',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      };
    }
    switch (coachState?.mood) {
      case 'celebrating':
        return {
          label: 'Great job! 🏆',
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        };
      case 'focused':
        return {
          label: 'Focus Mode 🔥',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
        };
      case 'motivating':
        return {
          label: 'Smart Coach 💡',
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
        };
      default:
        return {
          label: 'AI Teacher Active',
          color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        };
    }
  };

  const badge = getMoodBadge();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-white/40 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900/40 p-5 sm:p-6 shadow-sm backdrop-blur-md">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
        {/* Left: Avatar + Animated Speech Bubble */}
        <div className="flex items-start gap-4 flex-1">
          {/* Animated Teacher Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-800">
              <Bot className="w-8 h-8 sm:w-9 sm:h-9 animate-pulse-slow" />
            </div>
            {/* Status dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            </span>
          </div>

          {/* Speech Bubble */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                Professor Byte (AI Teacher)
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.color}`}>
                {badge.label}
              </span>
              <button
                onClick={refreshAdvice}
                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-auto"
                title="Refresh AI Teacher suggestions"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isThinking ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Dynamic Advice Text */}
            <div className="bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-3.5 shadow-sm">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                {coachState?.message || "Analyzing your study habits and today's schedule..."}
              </p>
              {coachState?.subMessage && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {coachState.subMessage}
                </p>
              )}

              {/* Instant Teacher Q&A Reply */}
              {teacherReply && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-indigo-900 dark:text-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/40 p-2 rounded-xl">
                  <span className="font-bold block mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" /> Explanation:
                  </span>
                  {teacherReply}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
          {coachState?.actionLabel && coachState.actionRoute && (
            <button
              onClick={() => navigate(coachState.actionRoute!)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/25"
            >
              <Sparkles className="w-4 h-4" />
              {coachState.actionLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => navigate('/study')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
            AI Study Curriculum
          </button>
        </div>
      </div>

      {/* Interactive Ask the Teacher Bar */}
      <div className="mt-4 pt-3 border-t border-indigo-100/60 dark:border-indigo-950/60 flex items-center">
        <form onSubmit={handleAsk} className="flex items-center gap-2 w-full">
          <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask AI Teacher: 'How does binary search work?' or 'Tips for exam anxiety'..."
            className="flex-1 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            disabled={!userQuery.trim() || isAnswering}
            className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-all shrink-0"
            title="Send to AI Teacher"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICoach;
