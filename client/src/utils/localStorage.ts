import { Todo, AppSettings, FocusSession } from '../types/task';

const KEYS = {
  TODOS: 'ai_todo_tasks_v1',
  SETTINGS: 'ai_todo_settings_v1',
  FOCUS_SESSIONS: 'ai_todo_focus_v1',
  STUDY_PROGRESS: 'ai_todo_study_progress_v1',
};

export const defaultSettings: AppSettings = {
  theme: 'dark',
  aiCoachEnabled: true,
  soundEnabled: true,
  focusDuration: 25,
  userName: 'Juliya',
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
};

export const storage = {
  getTodos: (fallback: Todo[] = []): Todo[] => loadFromStorage(KEYS.TODOS, fallback),
  setTodos: (todos: Todo[]): void => saveToStorage(KEYS.TODOS, todos),

  getSettings: (): AppSettings => loadFromStorage(KEYS.SETTINGS, defaultSettings),
  setSettings: (settings: AppSettings): void => saveToStorage(KEYS.SETTINGS, settings),

  getFocusSessions: (): FocusSession[] => loadFromStorage(KEYS.FOCUS_SESSIONS, []),
  setFocusSessions: (sessions: FocusSession[]): void => saveToStorage(KEYS.FOCUS_SESSIONS, sessions),

  getCompletedTopics: (): string[] => loadFromStorage(KEYS.STUDY_PROGRESS, []),
  setCompletedTopics: (topics: string[]): void => saveToStorage(KEYS.STUDY_PROGRESS, topics),

  clearAllData: (): void => {
    localStorage.removeItem(KEYS.TODOS);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.FOCUS_SESSIONS);
    localStorage.removeItem(KEYS.STUDY_PROGRESS);
  },
};
