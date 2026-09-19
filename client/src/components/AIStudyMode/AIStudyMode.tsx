import React, { useState } from 'react';
import {
  GraduationCap,
  Bot,
  Sparkles,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Code2,
  ListOrdered,
  Search,
  Layers,
  Database,
  Server,
  Workflow,
  Wifi,
} from 'lucide-react';
import { studyTopics } from '../../data/studyData';
import { useTodos } from '../../context/TodoContext';
import { QuickCheck } from '../QuickCheck';
import { ProgressBar } from '../ProgressBar';

export const AIStudyMode: React.FC = () => {
  const { completedTopics, markTopicCompleted } = useTodos();
  const [selectedTopicId, setSelectedTopicId] = useState<string>(studyTopics[0].id);

  const currentTopicIndex = studyTopics.findIndex((t) => t.id === selectedTopicId);
  const currentTopic = studyTopics[currentTopicIndex] || studyTopics[0];

  const isCurrentTopicCompleted = completedTopics.includes(currentTopic.id);
  const masteryPercentage = Math.round((completedTopics.length / studyTopics.length) * 100);

  const handleNextLesson = () => {
    const nextIndex = (currentTopicIndex + 1) % studyTopics.length;
    setSelectedTopicId(studyTopics[nextIndex].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-4 h-4" />;
      case 'Code2':
        return <Code2 className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'Database':
        return <Database className="w-4 h-4" />;
      case 'Server':
        return <Server className="w-4 h-4" />;
      case 'Workflow':
        return <Workflow className="w-4 h-4" />;
      case 'Wifi':
        return <Wifi className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Top Banner with Progress */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              AI Study Mode
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Curriculum Mastery
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Interactive computer science lessons, real-world analogies, and diagnostic quick checks.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            <span>Overall Curriculum Mastery</span>
            <span>{masteryPercentage}%</span>
          </div>
          <ProgressBar progress={masteryPercentage} size="md" color="teacher" />
          <span className="text-[10px] text-slate-400 mt-1 block">
            {completedTopics.length} of {studyTopics.length} topics mastered
          </span>
        </div>
      </div>

      {/* Main Grid: Topic Selector Tabs + Lesson Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Topics Nav */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-2">
            Core CS Topics
          </h3>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {studyTopics.map((topic, i) => {
              const isSelected = topic.id === currentTopic.id;
              const isDone = completedTopics.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all shrink-0 lg:shrink w-64 lg:w-full ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {renderTopicIcon(topic.icon)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold leading-tight">
                        {topic.title}
                      </h4>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {topic.category}
                      </span>
                    </div>
                  </div>

                  {isDone ? (
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-white' : 'text-emerald-500'
                      }`}
                    />
                  ) : (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{i + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content: Active Lesson Card */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Teacher Lesson Intro Speech Bubble */}
          <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Bot className="w-7 h-7 animate-pulse-slow" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  AI Teacher
                </span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                  {currentTopic.title} Lesson
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 leading-relaxed">
                "{currentTopic.lesson.teacherIntro}"
              </p>
            </div>
          </div>

          {/* Lesson Deep Dive Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" /> Conceptual Deep Dive
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {currentTopic.lesson.title}
              </h3>
            </div>

            {/* Explanation */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentTopic.lesson.explanation}
            </p>

            {/* Real World Analogy Callout */}
            <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs sm:text-sm space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Real-World Analogy</span>
              </div>
              <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed italic">
                "{currentTopic.lesson.realWorldAnalogy}"
              </p>
            </div>

            {/* Code Snippet if applicable */}
            {currentTopic.lesson.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-semibold uppercase flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" /> Reference Implementation (
                    {currentTopic.lesson.language || 'code'})
                  </span>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                  <code>{currentTopic.lesson.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Key Points Bullet List */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-indigo-500" /> Key Takeaways
              </h4>
              <ul className="space-y-2">
                {currentTopic.lesson.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Quick Check Quiz */}
          <QuickCheck
            key={currentTopic.id}
            quiz={currentTopic.quiz}
            topicTitle={currentTopic.title}
            onAnswerCorrect={() => markTopicCompleted(currentTopic.id)}
          />

          {/* Navigation Controls: Mark Completed / Next Lesson */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => markTopicCompleted(currentTopic.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                isCurrentTopicCompleted
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCurrentTopicCompleted ? 'Topic Mastered' : 'Mark as Mastered'}
            </button>

            <button
              onClick={handleNextLesson}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/20"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudyMode;
