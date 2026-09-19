import { Todo, AIMood } from '../types/task';
import { isTaskOverdue } from './taskAnalyzer';

export interface DynamicCoachState {
  greeting: string;
  message: string;
  subMessage: string;
  mood: AIMood;
  actionLabel?: string;
  actionRoute?: string;
}

/**
 * Returns time-appropriate greeting (e.g. Good morning, Juliya)
 */
export const getTimeGreeting = (userName = 'Juliya'): string => {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${userName} 🌅`;
  if (hour < 17) return `Good afternoon, ${userName} ☀️`;
  return `Good evening, ${userName} 👋`;
};

/**
 * Generates lively AI Teacher coach messages based on real-time task states
 */
export const getCoachMessage = (todos: Todo[], focusStreak = 0): DynamicCoachState => {
  const completedToday = todos.filter((t) => {
    if (!t.completed || !t.completedAt) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.completedAt.startsWith(today);
  }).length;

  const pending = todos.filter((t) => !t.completed);
  const overdue = todos.filter(isTaskOverdue);
  const highPriorityPending = pending.filter((t) => t.priority === 'high');

  // Case 1: Overdue tasks require gentle accountability
  if (overdue.length > 0) {
    return {
      greeting: 'Gentle Reminder! ⏰',
      message: `You have ${overdue.length} overdue ${overdue.length === 1 ? 'task' : 'tasks'}. Don't try to finish everything at once.`,
      subMessage: `Let's tackle "${overdue[0].title}" first with a 15-minute quick sprint!`,
      mood: 'thinking',
      actionLabel: 'Focus on This Task',
      actionRoute: '/focus',
    };
  }

  // Case 2: Great progress / many tasks completed today
  if (completedToday >= 3) {
    return {
      greeting: 'Incredible Pace! 🌟',
      message: `Hey! 👋 You completed ${completedToday} tasks today!`,
      subMessage: 'Great progress! Let\'s finish one more or test your knowledge in AI Study Mode.',
      mood: 'celebrating',
      actionLabel: 'Explore Study Mode',
      actionRoute: '/study',
    };
  }

  // Case 3: High focus streak
  if (focusStreak >= 2) {
    return {
      greeting: 'Focus Master! 🔥',
      message: `You're on a ${focusStreak}-session focus streak!`,
      subMessage: 'Your brain is in high-retention mode. Keep this momentum rolling!',
      mood: 'focused',
      actionLabel: 'Continue Focus',
      actionRoute: '/focus',
    };
  }

  // Case 4: High priority tasks pending
  if (highPriorityPending.length > 0) {
    const top = highPriorityPending[0];
    const isJava = top.title.toLowerCase().includes('java');
    return {
      greeting: 'High Priority Alert 🎯',
      message: isJava
        ? 'Your Java task looks big. Want me to break it into smaller steps?'
        : `You have ${highPriorityPending.length} high-priority tasks waiting for action.`,
      subMessage: `Consider starting with "${top.title}". Small steps lead to big victories.`,
      mood: 'motivating',
      actionLabel: isJava ? 'Open Smart Breakdown' : 'View Tasks',
      actionRoute: '/tasks',
    };
  }

  // Case 5: All tasks completed!
  if (pending.length === 0 && todos.length > 0) {
    return {
      greeting: 'All Caught Up! 🎉',
      message: 'Zero pending tasks! You have completed everything on your list today.',
      subMessage: 'Reward yourself or level up your skills by exploring a topic in AI Study Mode.',
      mood: 'celebrating',
      actionLabel: 'Level Up Skills',
      actionRoute: '/study',
    };
  }

  // Case 6: Standard default encouragement
  return {
    greeting: 'Ready to Learn? 🚀',
    message: 'Welcome to your smart workspace! Every big achievement starts with a single step.',
    subMessage: 'Pick a task below or let me suggest an optimized study plan for today.',
    mood: 'friendly',
    actionLabel: 'View Active Tasks',
    actionRoute: '/tasks',
  };
};

/**
 * Focus mode periodic motivation prompts
 */
export const focusPrompts = [
  "Breathe deeply. Single-tasking is your superpower.",
  "You're in the deep focus zone! Keep distractions away.",
  "Every minute of focused practice builds neural pathways.",
  "Great discipline! Halfway through this sprint.",
  "Almost there! Finish this session strong and claim your streak.",
];
