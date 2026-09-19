import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  Timer,
  GraduationCap,
  Flame,
  Calendar,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import { useSettings } from '../../context/SettingsContext';
import { getTimeGreeting } from '../../utils/motivation';
import { generateSmartSuggestions, isTaskDueToday } from '../../utils/taskAnalyzer';
import { AICoach } from '../../components/AICoach';
import { TaskStats } from '../../components/TaskStats';
import { TaskCard } from '../../components/TaskCard';
import { TaskForm } from '../../components/TaskForm';
import { EmptyState } from '../../components/EmptyState';
import { Todo } from '../../types/task';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { todos, addTodo, updateTodo } = useTodos();
  const { settings } = useSettings();

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const greeting = getTimeGreeting(settings.userName);
  const smartSuggestions = generateSmartSuggestions(todos);

  // Today's tasks and high priority tasks
  const todayTasks = todos.filter((t) => isTaskDueToday(t) && !t.completed);
  const highPriorityTasks = todos.filter((t) => t.priority === 'high' && !t.completed);
  const recentTasks = todos.slice(0, 4);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsTaskFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, data);
    } else {
      addTodo(data);
    }
    setEditingTodo(null);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto animate-fade-in">
      {/* Top Greeting & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ready to make progress today? Your AI Study Coach has prepared your schedule.
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingTodo(null);
              setIsTaskFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Smart Task</span>
          </button>

          <button
            onClick={() => navigate('/focus')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
          >
            <Timer className="w-4 h-4 text-indigo-500" />
            <span>Focus Mode</span>
          </button>

          <button
            onClick={() => navigate('/study')}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-xs"
          >
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span>Study Topic</span>
          </button>
        </div>
      </div>

      {/* AI Teacher Coach Main Card */}
      <AICoach />

      {/* Task KPI Statistics Row */}
      <TaskStats />

      {/* AI Smart Suggestions Bar */}
      {smartSuggestions.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-xs text-indigo-900 dark:text-indigo-200 font-medium truncate">
              <span className="font-bold mr-2 text-indigo-950 dark:text-indigo-100">
                AI Suggestion:
              </span>
              {smartSuggestions[0]}
            </div>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 shrink-0"
          >
            Manage <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Two Column Layout: Today's Tasks & Urgent Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: High Priority Queue */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                High Priority Focus ({highPriorityTasks.length})
              </h2>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              View all
            </button>
          </div>

          {highPriorityTasks.length > 0 ? (
            <div className="space-y-3">
              {highPriorityTasks.slice(0, 3).map((todo) => (
                <TaskCard key={todo.id} todo={todo} onEdit={handleEdit} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No High Priority Tasks!"
              description="You have no urgent deadlines on your radar. Great job staying ahead!"
              actionLabel="Add a Task"
              onAction={() => {
                setEditingTodo(null);
                setIsTaskFormOpen(true);
              }}
              icon="sparkles"
            />
          )}
        </div>

        {/* Right Column: Due Today / Active Tasks */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Due Today & In Progress ({todayTasks.length > 0 ? todayTasks.length : recentTasks.length})
              </h2>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {(todayTasks.length > 0 ? todayTasks : recentTasks).slice(0, 3).map((todo) => (
              <TaskCard key={todo.id} todo={todo} onEdit={handleEdit} />
            ))}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleFormSubmit}
        initialTodo={editingTodo}
      />
    </div>
  );
};

export default Dashboard;
