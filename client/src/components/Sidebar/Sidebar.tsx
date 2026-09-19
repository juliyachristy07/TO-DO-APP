import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  GraduationCap,
  Timer,
  BarChart3,
  Settings,
  PlusCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useTodos } from '../../context/TodoContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenNewTask }) => {
  const { todos, focusStreak } = useTodos();
  const pendingCount = todos.filter((t) => !t.completed).length;

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      to: '/tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      to: '/study',
      label: 'AI Study Mode',
      icon: GraduationCap,
      badge: 'Learn',
      highlight: true,
    },
    {
      to: '/focus',
      label: 'Focus Mode',
      icon: Timer,
      badge: undefined,
    },
    {
      to: '/analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: undefined,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      badge: undefined,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-4">
          {/* Quick Create Button */}
          <button
            onClick={() => {
              onOpenNewTask();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-500/20 active:scale-98 transition-all group"
          >
            <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span>Create Smart Task</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.highlight
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom AI Mini Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AI Productivity Tip</span>
          </div>
          <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
            Break tasks into ≤ 25 min chunks to maintain maximum dopamine and neuroplastic focus.
          </p>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
            <Zap className="w-3 h-3 fill-current" />
            <span>Streak: {focusStreak} sessions</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
