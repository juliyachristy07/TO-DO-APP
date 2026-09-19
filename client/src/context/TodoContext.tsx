import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Todo,
  SubTask,
  Category,
  Priority,
  StatusFilter,
  SortOption,
  FocusSession,
} from '../types/task';
import { storage } from '../utils/localStorage';
import { initialDemoTasks } from '../data/demoTasks';
import { isTaskOverdue, isTaskDueToday, calculateTaskProgress } from '../utils/taskAnalyzer';
import { useNotification } from './NotificationContext';

export interface AddTodoInput {
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string;
  estimatedMinutes?: number;
  subtasks?: Array<{ title: string; estimatedMinutes?: number }>;
}

interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  categoryFilter: Category | 'All';
  setCategoryFilter: (cat: Category | 'All') => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  addTodo: (input: AddTodoInput) => Todo;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;

  addSubtask: (todoId: string, title: string, estimatedMinutes?: number) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;
  addSubtasksToTask: (todoId: string, subtasks: Array<{ title: string; estimatedMinutes?: number }>) => void;

  clearCompleted: () => void;
  clearAll: () => void;
  resetToDemoData: () => void;

  focusSessions: FocusSession[];
  logFocusSession: (session: Omit<FocusSession, 'id'>) => void;
  focusStreak: number;

  completedTopics: string[];
  markTopicCompleted: (topicId: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showNotification } = useNotification();

  // Initialize todos from localStorage or seed with initial demo tasks
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = storage.getTodos([]);
    if (saved && saved.length > 0) return saved;
    storage.setTodos(initialDemoTasks);
    return initialDemoTasks;
  });

  // Focus sessions
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() =>
    storage.getFocusSessions()
  );

  // Completed study topics
  const [completedTopics, setCompletedTopics] = useState<string[]>(() =>
    storage.getCompletedTopics()
  );

  // Filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('priority');

  // Persist todos
  useEffect(() => {
    storage.setTodos(todos);
  }, [todos]);

  // Persist focus sessions
  useEffect(() => {
    storage.setFocusSessions(focusSessions);
  }, [focusSessions]);

  // Persist completed study topics
  useEffect(() => {
    storage.setCompletedTopics(completedTopics);
  }, [completedTopics]);

  // Add new todo
  const addTodo = (input: AddTodoInput): Todo => {
    const newTodo: Todo = {
      id: 'task-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: input.title.trim(),
      description: input.description?.trim(),
      category: input.category,
      priority: input.priority,
      dueDate: input.dueDate,
      estimatedMinutes: input.estimatedMinutes || 30,
      completed: false,
      createdAt: new Date().toISOString(),
      subtasks: (input.subtasks || []).map((st) => ({
        id: 'sub-' + Math.random().toString(36).substring(2, 8),
        title: st.title.trim(),
        completed: false,
        estimatedMinutes: st.estimatedMinutes || 15,
      })),
    };

    setTodos((prev) => [newTodo, ...prev]);
    showNotification('success', 'Task Created! ✨', `"${newTodo.title}" has been added.`);
    return newTodo;
  };

  // Update existing todo
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showNotification('info', 'Task Updated', 'Changes saved successfully.');
  };

  // Delete todo
  const deleteTodo = (id: string) => {
    const toDelete = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    showNotification('warning', 'Task Deleted', `"${toDelete?.title || 'Task'}" was removed.`);
  };

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            // Trigger confetti delight!
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#22c55e', '#f59e0b'],
              });
            } catch {
              // ignore if canvas not mounted
            }
            showNotification('success', 'Great Job! 🎉', `"${t.title}" completed!`);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
            // also mark subtasks if completing
            subtasks: nextCompleted
              ? t.subtasks.map((st) => ({ ...st, completed: true }))
              : t.subtasks,
          };
        }
        return t;
      })
    );
  };

  // Subtask management
  const addSubtask = (todoId: string, title: string, estimatedMinutes = 15) => {
    if (!title.trim()) return;
    const newSub: SubTask = {
      id: 'sub-' + Math.random().toString(36).substring(2, 8),
      title: title.trim(),
      completed: false,
      estimatedMinutes,
    };

    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subtasks: [...t.subtasks, newSub],
          };
        }
        return t;
      })
    );
    showNotification('info', 'Subtask Added', `Added "${title}"`);
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === todoId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allCompleted =
            updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);

          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allCompleted ? true : t.completed,
            completedAt: allCompleted && !t.completed ? new Date().toISOString() : t.completedAt,
          };
        }
        return t;
      })
    );
  };

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subtasks: t.subtasks.filter((st) => st.id !== subtaskId),
          };
        }
        return t;
      })
    );
  };

  const addSubtasksToTask = (
    todoId: string,
    newSubtasks: Array<{ title: string; estimatedMinutes?: number }>
  ) => {
    const formatted: SubTask[] = newSubtasks.map((st) => ({
      id: 'sub-' + Math.random().toString(36).substring(2, 8),
      title: st.title.trim(),
      completed: false,
      estimatedMinutes: st.estimatedMinutes || 15,
    }));

    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            subtasks: [...t.subtasks, ...formatted],
          };
        }
        return t;
      })
    );
    showNotification(
      'ai',
      'AI Breakdown Applied! 💡',
      `Added ${newSubtasks.length} smart subtasks to your task.`
    );
  };

  // Clear operations
  const clearCompleted = () => {
    const count = todos.filter((t) => t.completed).length;
    if (count === 0) return;
    setTodos((prev) => prev.filter((t) => !t.completed));
    showNotification('info', 'Cleaned up', `Cleared ${count} completed tasks.`);
  };

  const clearAll = () => {
    setTodos([]);
    showNotification('warning', 'List Cleared', 'All tasks have been removed.');
  };

  const resetToDemoData = () => {
    setTodos(initialDemoTasks);
    showNotification('info', 'Demo Data Loaded', 'Restored 5 realistic student tasks.');
  };

  // Focus sessions logging
  const logFocusSession = (session: Omit<FocusSession, 'id'>) => {
    const newSession: FocusSession = {
      ...session,
      id: 'focus-' + Math.random().toString(36).substring(2, 9),
    };
    setFocusSessions((prev) => [newSession, ...prev]);
    showNotification('success', 'Focus Session Completed! ⏱️', `Logged ${session.durationMinutes} mins.`);
  };

  // Calculate focus streak (number of completed sessions today)
  const focusStreak = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return focusSessions.filter((s) => s.completedAt.startsWith(today) && !s.interrupted).length;
  }, [focusSessions]);

  // Study progress
  const markTopicCompleted = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      setCompletedTopics((prev) => [...prev, topicId]);
      showNotification('success', 'Topic Mastered! 🎓', 'Saved in your AI Study progress.');
    }
  };

  // Filter and Sort computation
  const filteredTodos = useMemo(() => {
    return todos
      .filter((todo) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = todo.title.toLowerCase().includes(q);
          const matchDesc = todo.description?.toLowerCase().includes(q);
          const matchSubtask = todo.subtasks.some((st) => st.title.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchSubtask) return false;
        }

        // Category filter
        if (categoryFilter !== 'All' && todo.category !== categoryFilter) {
          return false;
        }

        // Status filter
        if (statusFilter === 'active') return !todo.completed;
        if (statusFilter === 'completed') return todo.completed;
        if (statusFilter === 'high-priority') return todo.priority === 'high';
        if (statusFilter === 'today') return isTaskDueToday(todo);
        if (statusFilter === 'overdue') return isTaskOverdue(todo);

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          const weight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          if (weight[b.priority] !== weight[a.priority]) {
            return weight[b.priority] - weight[a.priority];
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        if (sortBy === 'progress') {
          return calculateTaskProgress(b) - calculateTaskProgress(a);
        }

        // Default 'createdAt'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [todos, searchQuery, statusFilter, categoryFilter, sortBy]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        sortBy,
        setSortBy,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        addSubtasksToTask,
        clearCompleted,
        clearAll,
        resetToDemoData,
        focusSessions,
        logFocusSession,
        focusStreak,
        completedTopics,
        markTopicCompleted,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
