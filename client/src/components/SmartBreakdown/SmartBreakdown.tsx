import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Clock, Check, Plus, X, Layers, BrainCircuit } from 'lucide-react';
import { aiSimulator } from '../../services/aiSimulator';
import { GeneratedSubtaskDraft, TaskBreakdownResult } from '../../utils/taskBreakdown';

interface SmartBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskDescription?: string;
  todoId?: string;
  onApplySubtasks: (subtasks: GeneratedSubtaskDraft[]) => void;
}

export const SmartBreakdown: React.FC<SmartBreakdownModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  taskDescription,
  onApplySubtasks,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<TaskBreakdownResult | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOpen && taskTitle) {
      setLoading(true);
      aiSimulator.generateTaskBreakdown(taskTitle, taskDescription).then((res) => {
        setResult(res);
        // Default select all
        setSelectedIndices(new Set(res.subtasks.map((_, i) => i)));
        setLoading(false);
      });
    }
  }, [isOpen, taskTitle, taskDescription]);

  if (!isOpen) return null;

  const toggleSelect = (index: number) => {
    const next = new Set(selectedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedIndices(next);
  };

  const toggleSelectAll = () => {
    if (!result) return;
    if (selectedIndices.size === result.subtasks.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(result.subtasks.map((_, i) => i)));
    }
  };

  const handleApply = () => {
    if (!result) return;
    const chosen = result.subtasks.filter((_, i) => selectedIndices.has(i));
    onApplySubtasks(chosen);
    onClose();
  };

  const totalSelectedMinutes = result
    ? result.subtasks
        .filter((_, i) => selectedIndices.has(i))
        .reduce((sum, s) => sum + s.estimatedMinutes, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 animate-pulse-slow">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                  AI Task Breakdown
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                  Smart Decomposition
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                Analyzing: "{taskTitle}"
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-spin">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                AI Teacher is breaking down your task...
              </p>
              <p className="text-xs text-slate-400">
                Detecting core milestones, dependencies, and time estimates
              </p>
            </div>
          ) : result ? (
            <>
              {/* AI Teacher Advice Bubble */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      AI Study Coach
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded-full font-medium">
                      {result.topicDetected}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed font-medium">
                    "{result.advice}"
                  </p>
                </div>
              </div>

              {/* Subtasks Selection Header */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  Recommended Subtasks ({result.subtasks.length})
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" /> ~{totalSelectedMinutes} mins total
                  </span>
                  <button
                    onClick={toggleSelectAll}
                    className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    {selectedIndices.size === result.subtasks.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Subtask Items */}
              <div className="space-y-2">
                {result.subtasks.map((subtask, index) => {
                  const isSelected = selectedIndices.has(index);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleSelect(index)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800 shadow-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                          {subtask.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3" /> {subtask.estimatedMinutes}m
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={loading || selectedIndices.size === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            Add {selectedIndices.size} Subtasks to Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartBreakdown;
