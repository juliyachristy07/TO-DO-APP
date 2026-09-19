import React from 'react';
import {
  ListFilter,
  ArrowDownUp,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import { StatusFilter, Category, SortOption } from '../../types/task';
import { isTaskOverdue, isTaskDueToday } from '../../utils/taskAnalyzer';

export const FilterBar: React.FC = () => {
  const {
    todos,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
  } = useTodos();

  // Compute live counts
  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
    highPriority: todos.filter((t) => t.priority === 'high' && !t.completed).length,
    today: todos.filter((t) => isTaskDueToday(t) && !t.completed).length,
    overdue: todos.filter((t) => isTaskOverdue(t)).length,
  };

  const statusOptions: Array<{
    id: StatusFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    badgeColor?: string;
  }> = [
    { id: 'all', label: 'All Tasks', icon: Layers, count: counts.all },
    { id: 'active', label: 'Active', icon: Clock, count: counts.active },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: counts.completed },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: Flame,
      count: counts.highPriority,
      badgeColor: 'text-rose-500',
    },
    { id: 'today', label: 'Due Today', icon: Calendar, count: counts.today },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: AlertTriangle,
      count: counts.overdue,
      badgeColor: 'text-amber-500',
    },
  ];

  const categories: Array<Category | 'All'> = [
    'All',
    'Study',
    'Coding',
    'Project',
    'Exam',
    'Personal',
    'Other',
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top row: Status Tabs + Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = statusFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setStatusFilter(opt.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{opt.label}</span>
                {typeof opt.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : opt.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ArrowDownUp className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer"
          >
            <option value="priority">Priority (High to Low)</option>
            <option value="dueDate">Due Date (Earliest)</option>
            <option value="createdAt">Date Created (Newest)</option>
            <option value="progress">Progress %</option>
          </select>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
          <ListFilter className="w-3 h-3" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
