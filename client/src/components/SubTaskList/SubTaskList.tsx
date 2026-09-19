import React, { useState } from 'react';
import { Check, Plus, Trash2, Clock } from 'lucide-react';
import { SubTask } from '../../types/task';
import { useTodos } from '../../context/TodoContext';

interface SubTaskListProps {
  todoId: string;
  subtasks: SubTask[];
  onOpenBreakdown?: () => void;
}

export const SubTaskList: React.FC<SubTaskListProps> = ({
  todoId,
  subtasks,
  onOpenBreakdown,
}) => {
  const { toggleSubtask, deleteSubtask, addSubtask } = useTodos();
  const [newTitle, setNewTitle] = useState('');
  const [newMinutes, setNewMinutes] = useState('15');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addSubtask(todoId, newTitle.trim(), parseInt(newMinutes, 10) || 15);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span>
          Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
        </span>
        <div className="flex items-center gap-2">
          {onOpenBreakdown && (
            <button
              onClick={onOpenBreakdown}
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-medium"
            >
              AI Breakdown
            </button>
          )}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      {/* Subtask Items */}
      <div className="space-y-1.5">
        {subtasks.map((st) => (
          <div
            key={st.id}
            className="group flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
              <button
                type="button"
                onClick={() => toggleSubtask(todoId, st.id)}
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  st.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-indigo-500'
                }`}
              >
                {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </button>
              <span
                className={`truncate ${
                  st.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {st.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {st.estimatedMinutes && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" /> {st.estimatedMinutes}m
                </span>
              )}
              <button
                type="button"
                onClick={() => deleteSubtask(todoId, st.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity"
                title="Delete subtask"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inline Add Subtask Form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1 animate-fade-in">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="New subtask title..."
            autoFocus
            className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="5"
              step="5"
              value={newMinutes}
              onChange={(e) => setNewMinutes(e.target.value)}
              title="Estimated minutes"
              className="w-14 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-center text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-[10px] text-slate-400">m</span>
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default SubTaskList;
