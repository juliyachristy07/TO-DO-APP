import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  Zap,
  Target,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import { useSettings } from '../../context/SettingsContext';
import { useNotification } from '../../context/NotificationContext';
import { focusPrompts } from '../../utils/motivation';

export const FocusMode: React.FC = () => {
  const { todos, logFocusSession, focusStreak, toggleTodo } = useTodos();
  const { settings } = useSettings();
  const { showNotification } = useNotification();

  const [durationMinutes, setDurationMinutes] = useState(settings.focusDuration || 25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState((settings.focusDuration || 25) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeTodos = todos.filter((t) => !t.completed);
  const selectedTask = todos.find((t) => t.id === selectedTaskId);

  // Set default selected task if none
  useEffect(() => {
    if (!selectedTaskId && activeTodos.length > 0) {
      setSelectedTaskId(activeTodos[0].id);
    }
  }, [activeTodos, selectedTaskId]);

  // Adjust timeLeft if duration changes while not running
  const changeDuration = (mins: number) => {
    setDurationMinutes(mins);
    if (!isRunning) {
      setTimeLeftSeconds(mins * 60);
    }
  };

  // Play gentle web audio chime if sound is enabled
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Main countdown effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);

            // Log completed session
            logFocusSession({
              taskId: selectedTask?.id,
              taskTitle: selectedTask?.title || 'General Focus Session',
              durationMinutes,
              completedAt: new Date().toISOString(),
              interrupted: false,
            });

            playChime();

            // Celebration
            try {
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }

            showNotification(
              'success',
              'Sprint Completed! 🏆',
              `Phenomenal focus on "${selectedTask?.title || 'your goals'}"!`
            );

            return durationMinutes * 60;
          }

          // Cycle motivation prompts every 5 minutes
          if (prev % 300 === 0) {
            setQuoteIndex((q) => (q + 1) % focusPrompts.length);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, durationMinutes, selectedTask, logFocusSession, showNotification, soundEnabled]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeftSeconds(durationMinutes * 60);
  };

  // Calculations for display
  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeftSeconds) / totalSeconds) * 100);
  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Pomodoro Focus Mode
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Deep Work
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immerse yourself in uninterrupted study blocks with live AI encouragement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>{focusStreak} Today</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Mute alert chime' : 'Enable alert chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Linked Task Selector */}
        <div className="w-full max-w-md mb-8">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-indigo-500" /> Focus Target Task
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            disabled={isRunning}
            className="w-full text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs cursor-pointer disabled:opacity-60"
          >
            {activeTodos.length > 0 ? (
              activeTodos.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.priority.toUpperCase()}] {t.title}
                </option>
              ))
            ) : (
              <option value="">General Focus / No Task</option>
            )}
          </select>
        </div>

        {/* Circular Progress Timer */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
            {/* Background ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke="url(#timerGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              fill="transparent"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time digits & Status in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">
              {isRunning ? 'Session Active' : 'Ready to start'}
            </span>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-2 mt-6 mb-8">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => changeDuration(mins)}
              disabled={isRunning}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                durationMinutes === mins
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start Focus
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {selectedTask && (
            <button
              onClick={() => toggleTodo(selectedTask.id)}
              className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
              title="Mark target task complete"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Motivation Speech Card */}
      <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="w-5 h-5 animate-bounce-subtle" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
              AI Focus Coach
            </span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
              Live Prompt
            </span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed font-medium">
            "{focusPrompts[quoteIndex]}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
