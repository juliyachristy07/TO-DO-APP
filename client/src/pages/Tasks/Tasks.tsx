import React, { useState } from 'react';
import {
  PlusCircle,
  CheckSquare,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useTodos } from '../../context/TodoContext';
import { SearchBar } from '../../components/SearchBar';
import { FilterBar } from '../../components/FilterBar';
import { TaskCard } from '../../components/TaskCard';
import { TaskForm } from '../../components/TaskForm';
import { EmptyState } from '../../components/EmptyState';
import { Todo } from '../../types/task';

export const Tasks: React.FC = () => {
  const { filteredTodos, clearCompleted, todos, addTodo, updateTodo } = useTodos();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const completedCount = todos.filter((t) => t.completed).length;

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
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
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Task Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {todos.length} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize, prioritize, and break down complex coursework into actionable subtasks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done ({completedCount})</span>
            </button>
          )}

          <button
            onClick={() => {
              setEditingTodo(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <SearchBar />
        <FilterBar />
      </div>

      {/* Task List Grid */}
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTodos.map((todo) => (
            <TaskCard key={todo.id} todo={todo} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks match your criteria"
          description="Try adjusting your search query, status filters, or create a brand new task with AI assistance."
          actionLabel="Create Task"
          onAction={() => {
            setEditingTodo(null);
            setIsFormOpen(true);
          }}
          icon="sparkles"
        />
      )}

      {/* Task Creation & Edit Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleFormSubmit}
        initialTodo={editingTodo}
      />
    </div>
  );
};

export default Tasks;
