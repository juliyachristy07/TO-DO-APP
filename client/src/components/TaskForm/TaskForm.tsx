import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Clock,
  Calendar,
  Layers,
  Plus,
  BrainCircuit,
  Bot,
  Check,
} from 'lucide-react';
import { Todo, Priority, Category } from '../../types/task';
import { analyzeTaskPriority, PrioritySuggestion } from '../../utils/taskAnalyzer';
import { breakDownTask, GeneratedSubtaskDraft } from '../../utils/taskBreakdown';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    category: Category;
    priority: Priority;
    dueDate?: string;
    estimatedMinutes: number;
    subtasks?: GeneratedSubtaskDraft[];
  }) => void;
  initialTodo?: Todo | null;
}

export const TaskForm: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTodo,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Study');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [draftSubtasks, setDraftSubtasks] = useState<GeneratedSubtaskDraft[]>([]);

  // AI Smart Priority live state
  const [prioritySuggestion, setPrioritySuggestion] = useState<PrioritySuggestion | null>(null);
  const [isAnalyzingPriority, setIsAnalyzingPriority] = useState(false);

  // Sync initialTodo if editing
  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title);
      setDescription(initialTodo.description || '');
      setCategory(initialTodo.category);
      setPriority(initialTodo.priority);
      setDueDate(initialTodo.dueDate || '');
      setDraftSubtasks(
        (initialTodo.subtasks || []).map((st) => ({
          title: st.title,
          estimatedMinutes: st.estimatedMinutes || 15,
        }))
      );
      setTitle('');
      setDescription('');
      setCategory('Study');
      setPriority('medium');
      setDueDate('');
      setEstimatedMinutes(45);
      setDraftSubtasks([]);
    }
  }, [initialTodo, isOpen]);

  // Real-time AI Priority recommendation evaluator
  useEffect(() => {
    if (!title.trim() || title.trim().length < 3) {
      setPrioritySuggestion(null);
      return;
    }

    setIsAnalyzingPriority(true);
    const timer = setTimeout(() => {
      const suggestion = analyzeTaskPriority(title, dueDate, category);
      setPrioritySuggestion(suggestion);
      setIsAnalyzingPriority(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [title, dueDate, category]);

  // Live AI Subtask auto-breakdown trigger
  const handleAutoBreakdown = () => {
    if (!title.trim()) return;
    const result = breakDownTask(title, description);
    setDraftSubtasks(result.subtasks);
  };

  const handleApplySuggestedPriority = () => {
    if (prioritySuggestion) {
      setPriority(prioritySuggestion.recommendedPriority);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      dueDate: dueDate || undefined,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      subtasks: draftSubtasks,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {initialTodo ? 'Edit Task' : 'Create Smart Task'}
              </h3>
              <p className="text-xs text-slate-400">
                AI Teacher assists with priorities and subtask breakdowns
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare Java OOP for exam"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* AI Smart Priority Recommendation Banner */}
          {prioritySuggestion && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs animate-fade-in space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Smart Priority Recommendation
                </span>
                <span
                  className={`capitalize px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    prioritySuggestion.recommendedPriority === 'high'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                      : prioritySuggestion.recommendedPriority === 'medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  }`}
                >
                  {prioritySuggestion.recommendedPriority}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {prioritySuggestion.reason}
              </p>
              {priority !== prioritySuggestion.recommendedPriority && (
                <button
                  type="button"
                  onClick={handleApplySuggestedPriority}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Set priority to "{prioritySuggestion.recommendedPriority}"
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, resources, or exam chapters..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="Study">Study</option>
                <option value="Coding">Coding</option>
                <option value="Project">Project</option>
                <option value="Exam">Exam</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 rounded-lg capitalize font-medium transition-all ${
                      priority === p
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date & Estimated Minutes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
              </input>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Est. Time (mins)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Optional Subtasks with AI Auto-Breakdown */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Initial Subtasks ({draftSubtasks.length})
              </span>
              <button
                type="button"
                disabled={!title.trim()}
                onClick={handleAutoBreakdown}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold disabled:opacity-40 disabled:no-underline"
              >
                <BrainCircuit className="w-3.5 h-3.5" /> AI Generate Steps
              </button>
            </div>

            {draftSubtasks.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {draftSubtasks.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <span className="truncate">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => setDraftSubtasks((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-500 p-0.5 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                Tip: Enter a topic like "Prepare Java OOP for exam" and click AI Generate Steps.
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            {initialTodo ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
