import { Todo, Priority, Category } from '../types/task';

export interface PrioritySuggestion {
  recommendedPriority: Priority;
  confidence: number;
  reason: string;
}

export interface TaskAnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  highPriorityCount: number;
  categoryBreakdown: Record<Category, { total: number; completed: number }>;
  strongestCategory: Category | null;
  totalEstimatedHours: number;
}

/**
 * Checks if a task is overdue (due date before today and not completed)
 */
export const isTaskOverdue = (todo: Todo): boolean => {
  if (todo.completed || !todo.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

/**
 * Checks if a task is due today
 */
export const isTaskDueToday = (todo: Todo): boolean => {
  if (!todo.dueDate) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  return todo.dueDate === todayStr;
};

/**
 * Calculates subtask completion percentage for a todo
 */
export const calculateTaskProgress = (todo: Todo): number => {
  if (todo.completed) return 100;
  if (!todo.subtasks || todo.subtasks.length === 0) return 0;
  const completedCount = todo.subtasks.filter((s) => s.completed).length;
  return Math.round((completedCount / todo.subtasks.length) * 100);
};

/**
 * Rule-based priority advisor analyzing title, dueDate, and category
 */
export const analyzeTaskPriority = (
  title: string,
  dueDate?: string,
  category?: Category
): PrioritySuggestion => {
  const lower = title.toLowerCase();

  // High priority indicators
  const urgentKeywords = ['exam', 'test', 'urgent', 'asap', 'deadline', 'interview', 'tomorrow', 'final', 'presentation', 'crucial'];
  const hasUrgentKeyword = urgentKeywords.some((k) => lower.includes(k));

  let daysUntilDue: number | null = null;
  if (dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  if (hasUrgentKeyword || (daysUntilDue !== null && daysUntilDue <= 1) || category === 'Exam') {
    let reason = 'High priority suggested because ';
    if (category === 'Exam') reason += 'exam preparations require peak focus and early review.';
    else if (daysUntilDue !== null && daysUntilDue <= 1) reason += 'your deadline is due today or tomorrow!';
    else reason += `the task title contains urgent keywords ("${urgentKeywords.find((k) => lower.includes(k))}").`;

    return {
      recommendedPriority: 'high',
      confidence: 0.95,
      reason,
    };
  }

  // Medium priority indicators
  const mediumKeywords = ['project', 'assignment', 'practice', 'revise', 'homework', 'code', 'build', 'study'];
  const hasMediumKeyword = mediumKeywords.some((k) => lower.includes(k));

  if (hasMediumKeyword || (daysUntilDue !== null && daysUntilDue <= 4) || category === 'Study' || category === 'Coding') {
    return {
      recommendedPriority: 'medium',
      confidence: 0.85,
      reason: daysUntilDue !== null && daysUntilDue <= 4
        ? 'Your deadline is coming up in a few days, so Medium Priority helps maintain steady momentum.'
        : 'Active practice and study projects are best scheduled with steady Medium Priority.',
    };
  }

  return {
    recommendedPriority: 'low',
    confidence: 0.75,
    reason: 'No imminent deadline or urgent keywords detected. Low Priority allows flexible scheduling.',
  };
};

/**
 * Computes deep analytics across all todos
 */
export const computeAnalytics = (todos: Todo[]): TaskAnalyticsSummary => {
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = todos.filter(isTaskOverdue).length;
  const highPriorityCount = todos.filter((t) => t.priority === 'high' && !t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const categories: Category[] = ['Study', 'Coding', 'Project', 'Exam', 'Personal', 'Other'];
  const categoryBreakdown: Record<Category, { total: number; completed: number }> = {
    Study: { total: 0, completed: 0 },
    Coding: { total: 0, completed: 0 },
    Project: { total: 0, completed: 0 },
    Exam: { total: 0, completed: 0 },
    Personal: { total: 0, completed: 0 },
    Other: { total: 0, completed: 0 },
  };

  categories.forEach((cat) => {
    const inCat = todos.filter((t) => t.category === cat);
    categoryBreakdown[cat] = {
      total: inCat.length,
      completed: inCat.filter((t) => t.completed).length,
    };
  });

  // Determine strongest category (highest completed count)
  let strongestCategory: Category | null = null;
  let maxCompleted = 0;
  Object.entries(categoryBreakdown).forEach(([cat, stats]) => {
    if (stats.completed > maxCompleted) {
      maxCompleted = stats.completed;
      strongestCategory = cat as Category;
    }
  });

  const totalEstimatedMinutes = todos.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);
  const totalEstimatedHours = Math.round((totalEstimatedMinutes / 60) * 10) / 10;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    completionRate,
    highPriorityCount,
    categoryBreakdown,
    strongestCategory,
    totalEstimatedHours,
  };
};

/**
 * Generates smart frontend suggestions based on task states
 */
export const generateSmartSuggestions = (todos: Todo[]): string[] => {
  const suggestions: string[] = [];
  const pending = todos.filter((t) => !t.completed);
  const overdue = todos.filter(isTaskOverdue);
  const highPriority = pending.filter((t) => t.priority === 'high');
  const smallTasks = pending.filter((t) => t.estimatedMinutes <= 20);

  if (overdue.length > 0) {
    suggestions.push(`You have ${overdue.length} overdue ${overdue.length === 1 ? 'task' : 'tasks'}. Prioritize clearing "${overdue[0].title}" first.`);
  }

  if (highPriority.length > 0) {
    suggestions.push(`You have ${highPriority.length} high-priority tasks pending. Consider tackling "${highPriority[0].title}" next.`);
  }

  if (smallTasks.length >= 2) {
    suggestions.push(`You have ${smallTasks.length} quick tasks (≤20 mins). Try batching them together in a single focus sprint!`);
  }

  const javaTask = pending.find((t) => t.title.toLowerCase().includes('java'));
  if (javaTask && javaTask.subtasks.length === 0) {
    suggestions.push(`Your Java task "${javaTask.title}" looks big. Want me to break it into bite-sized subtasks?`);
  }

  if (suggestions.length === 0) {
    suggestions.push('You are completely caught up! Jump into AI Study Mode or outline your next big project.');
  }

  return suggestions;
};
