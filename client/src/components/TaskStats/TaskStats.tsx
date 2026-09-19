import React from 'react';
import { CheckCircle2, Clock, Flame, AlertTriangle, Zap } from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import { computeAnalytics } from '../../utils/taskAnalyzer';

export const TaskStats: React.FC = () => {
  const { todos, focusStreak } = useTodos();
  const stats = computeAnalytics(todos);

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      sublabel: `${stats.pendingTasks} in progress`,
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      sublabel: `${stats.completionRate}% completion rate`,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'High Priority',
      value: stats.highPriorityCount,
      sublabel: 'Urgent action required',
      icon: Flame,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      label: 'Overdue',
      value: stats.overdueTasks,
      sublabel: stats.overdueTasks > 0 ? 'Needs attention' : 'All up to date!',
      icon: AlertTriangle,
      color: stats.overdueTasks > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400',
      bg: stats.overdueTasks > 0 ? 'bg-amber-500/10' : 'bg-slate-500/10',
    },
    {
      label: 'Focus Streak',
      value: `${focusStreak} sessions`,
      sublabel: focusStreak > 0 ? 'High focus mode 🔥' : 'Start a focus timer',
      icon: Zap,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="flex flex-col p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {c.label}
              </span>
              <div className={`p-2 rounded-xl ${c.bg} ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {c.value}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium truncate">
              {c.sublabel}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;
