import React, { useState } from 'react';
import {
  Check,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';
import { Todo } from '../../types/task';
import { useTodos } from '../../context/TodoContext';
import { PriorityBadge } from '../PriorityBadge';
import { ProgressBar } from '../ProgressBar';
import { SubTaskList } from '../SubTaskList';
import { SmartBreakdown } from '../SmartBreakdown';
import { calculateTaskProgress, isTaskOverdue, isTaskDueToday } from '../../utils/taskAnalyzer';
import { GeneratedSubtaskDraft } from '../../utils/taskBreakdown';

interface TaskCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ todo, onEdit }) => {
  const { toggleTodo, deleteTodo, addSubtasksToTask } = useTodos();
  const [expanded, setExpanded] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  const progress = calculateTaskProgress(todo);
  const overdue = isTaskOverdue(todo);
  const dueToday = isTaskDueToday(todo);

  const handleApplyBreakdown = (newSubtasks: GeneratedSubtaskDraft[]) => {
    addSubtasksToTask(todo.id, newSubtasks);
    setExpanded(true);
  };

  return (
    <>
      <div
        className={`group relative rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
          todo.completed
            ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80 hover:opacity-100'
            : overdue
            ? 'bg-white dark:bg-slate-900 border-amber-300/80 dark:border-amber-900/60'
            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
        } p-4 sm:p-5 flex flex-col gap-3`}
      >
        {/* Main Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Custom Checkbox */}
            <button
              type="button"
              onClick={() => toggleTodo(todo.id)}
              className={`w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                todo.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-500 hover:scale-105'
              }`}
              aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>

            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm sm:text-base font-semibold leading-snug break-words ${
                    todo.completed
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {todo.title}
                </h3>
              </div>

              {todo.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {todo.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
            <button
              type="button"
              onClick={() => setShowBreakdownModal(true)}
              className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
              title="AI Task Breakdown"
            >
              <BrainCircuit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onEdit(todo)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => deleteTodo(todo.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badges and Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Priority */}
          <PriorityBadge priority={todo.priority} size="sm" />

          {/* Category Tag */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px]">
            <FolderGit2 className="w-3 h-3 text-slate-400" />
            {todo.category}
          </span>

          {/* Due Date Indicator */}
          {todo.dueDate && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-[11px] ${
                overdue
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/50'
                  : dueToday
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {overdue ? (
                <AlertCircle className="w-3 h-3 text-amber-600" />
              ) : (
                <Calendar className="w-3 h-3 text-slate-400" />
              )}
              {overdue ? `Overdue (${todo.dueDate})` : dueToday ? 'Due Today' : todo.dueDate}
            </span>
          )}

          {/* Estimated Time */}
          {todo.estimatedMinutes && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium ml-auto">
              <Clock className="w-3 h-3" />
              {todo.estimatedMinutes} mins
            </span>
          )}
        </div>

        {/* Progress Bar (if task has subtasks) */}
        {todo.subtasks && todo.subtasks.length > 0 && (
          <div className="mt-1">
            <ProgressBar
              progress={progress}
              size="sm"
              showLabel
              color={todo.completed ? 'teacher' : 'brand'}
            />
          </div>
        )}

        {/* Subtask Dropdown Toggle */}
        {todo.subtasks && todo.subtasks.length > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium mt-0.5 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Hide subtasks ({todo.subtasks.length})
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Show subtasks ({todo.subtasks.filter((s) => s.completed).length}/{todo.subtasks.length})
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowBreakdownModal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              AI Breakdown Task
            </button>
          </div>
        )}

        {/* Expanded Subtasks */}
        {expanded && (
          <SubTaskList
            todoId={todo.id}
            subtasks={todo.subtasks}
            onOpenBreakdown={() => setShowBreakdownModal(true)}
          />
        )}
      </div>

      {/* AI Breakdown Modal */}
      <SmartBreakdown
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        taskTitle={todo.title}
        taskDescription={todo.description}
        todoId={todo.id}
        onApplySubtasks={handleApplyBreakdown}
      />
    </>
  );
};

export default TaskCard;
