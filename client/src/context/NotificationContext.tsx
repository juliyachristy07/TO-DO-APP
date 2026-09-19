import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastNotification } from '../types/task';

interface NotificationContextType {
  notifications: ToastNotification[];
  showNotification: (type: ToastNotification['type'], title: string, message?: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: ToastNotification['type'], title: string, message?: string) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastNotification = { id, type, title, message };
      setNotifications((prev) => [...prev, newToast]);

      // Auto dismiss after 3.8s
      setTimeout(() => {
        removeNotification(id);
      }, 3800);
    },
    [removeNotification]
  );

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
