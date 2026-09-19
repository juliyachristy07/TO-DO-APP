import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'teacher' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  color = 'brand',
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  const colorClasses = {
    brand: 'from-indigo-500 to-purple-600',
    teacher: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
  }[color];

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heightClasses} p-0.5`}
      >
        <div
          className={`h-full bg-gradient-to-r ${colorClasses} rounded-full transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
