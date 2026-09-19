import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../../types/task';
import { useNotification } from '../../context/NotificationContext';

interface QuickCheckProps {
  quiz: QuizQuestion;
  topicTitle?: string;
  onAnswerCorrect?: () => void;
}

export const QuickCheck: React.FC<QuickCheckProps> = ({
  quiz,
  topicTitle = 'Quick Check',
  onAnswerCorrect,
}) => {
  const { showNotification } = useNotification();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (hasSubmitted) return;
    setSelectedIndex(index);
    setHasSubmitted(true);

    const isCorrect = index === quiz.correctIndex;
    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // fallback
      }
      showNotification('success', 'Correct Answer! 🌟', 'You nailed the Quick Check.');
      if (onAnswerCorrect) onAnswerCorrect();
    } else {
      showNotification('warning', 'Almost there! 💡', 'Review the explanation below.');
    }
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setHasSubmitted(false);
  };

  const isCorrect = selectedIndex === quiz.correctIndex;

  return (
    <div className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/50 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              AI Quick Check
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">{topicTitle}</span>
          </div>
        </div>

        {hasSubmitted && (
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry
          </button>
        )}
      </div>

      {/* Question */}
      <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-4 leading-relaxed">
        {quiz.question}
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {quiz.options.map((option, index) => {
          let btnStyle = 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800';

          if (hasSubmitted) {
            if (index === quiz.correctIndex) {
              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500';
            } else if (index === selectedIndex) {
              btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300 font-semibold ring-1 ring-rose-500';
            } else {
              btnStyle = 'opacity-40 border-transparent';
            }
          }

          return (
            <button
              key={index}
              disabled={hasSubmitted}
              onClick={() => handleSelect(index)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
            >
              <span>{option}</span>
              {hasSubmitted && index === quiz.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
              )}
              {hasSubmitted && index === selectedIndex && index !== quiz.correctIndex && (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation Card */}
      {hasSubmitted && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
            isCorrect
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            {isCorrect ? 'Well done!' : 'Explanation & Insight:'}
          </div>
          <p>{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuickCheck;
