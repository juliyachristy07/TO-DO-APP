import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';
import { TodoProvider, useTodos } from './context/TodoContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Notification } from './components/Notification';
import { TaskForm } from './components/TaskForm';

// Pages
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Focus from './pages/Focus';
import Analytics from './pages/Analytics';
import AIStudyMode from './pages/AIStudyMode';
import Settings from './pages/Settings';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const { addTodo } = useTodos();

  const handleQuickAdd = (data: any) => {
    addTodo(data);
    setIsQuickTaskOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 relative">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenNewTask={() => setIsQuickTaskOpen(true)}
        />

        {/* Main Content View */}
        <main className="flex-1 lg:pl-64 w-full p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/study" element={<AIStudyMode />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Floating Toast Notification Container */}
      <Notification />

      {/* Global Quick Task Creation Modal */}
      <TaskForm
        isOpen={isQuickTaskOpen}
        onClose={() => setIsQuickTaskOpen(false)}
        onSubmit={handleQuickAdd}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <SettingsProvider>
        <NotificationProvider>
          <TodoProvider>
            <AppLayout />
          </TodoProvider>
        </NotificationProvider>
      </SettingsProvider>
    </Router>
  );
};

export default App;
