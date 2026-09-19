export type Priority = 'low' | 'medium' | 'high';

export type Category = 'Study' | 'Coding' | 'Project' | 'Exam' | 'Personal' | 'Other';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  estimatedMinutes: number;
  completed: boolean;
  subtasks: SubTask[];
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  completedAt: string;
  interrupted: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  title: string;
  teacherIntro: string;
  explanation: string;
  realWorldAnalogy: string;
  keyPoints: string[];
  codeSnippet?: string;
  language?: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  icon: string;
  category: string;
  summary: string;
  lesson: LessonContent;
  quiz: QuizQuestion;
}

export type AIMood = 'friendly' | 'thinking' | 'explaining' | 'celebrating' | 'focused' | 'motivating';

export interface AIMessage {
  id: string;
  text: string;
  mood: AIMood;
  actionLabel?: string;
  actionRoute?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'ai';
  title: string;
  message?: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  aiCoachEnabled: boolean;
  soundEnabled: boolean;
  focusDuration: number; // in minutes (e.g. 25)
  userName: string;
}

export type StatusFilter = 'all' | 'active' | 'completed' | 'high-priority' | 'today' | 'overdue';

export type SortOption = 'priority' | 'dueDate' | 'createdAt' | 'progress';
