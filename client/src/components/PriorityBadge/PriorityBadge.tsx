import React from 'react';
import { Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { Priority } from '../../types/task';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showIcon = true,
}) => {
  const config = {
    high: {
      label: 'High Priority',
      classes: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
      icon: Flame,
    },
    medium: {
      label: 'Medium',
      classes: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
      icon: ShieldAlert,
    },
    low: {
      label: 'Low',
      classes: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
      icon: Sparkles,
    },
  }[priority];

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.classes} ${sizeClasses} transition-colors`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      {config.label}
    </span>
  );
};

export default PriorityBadge;
