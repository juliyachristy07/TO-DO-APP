import { Todo, Priority, Category, StudyTopic } from '../types/task';
import { breakDownTask, TaskBreakdownResult } from '../utils/taskBreakdown';
import { analyzeTaskPriority, PrioritySuggestion } from '../utils/taskAnalyzer';
import { getCoachMessage, DynamicCoachState } from '../utils/motivation';
import { studyTopics } from '../data/studyData';

/**
 * AI Simulator Service
 *
 * NOTE: This is a frontend rule-based simulator replicating AI intelligence.
 * All functions return Promises so that replacing this with a real AI API endpoint
 * (e.g., Google Gemini, OpenAI, Claude) requires zero changes in the calling components.
 */
export const aiSimulator = {
  /**
   * Generates dynamic contextual AI Teacher Coach messages
   */
  async generateCoachMessage(todos: Todo[], focusStreak = 0): Promise<DynamicCoachState> {
    // Simulate brief AI inference latency (e.g. 150ms)
    await new Promise((res) => setTimeout(res, 100));
    return getCoachMessage(todos, focusStreak);
  },

  /**
   * Breaks down a large task or study goal into atomic actionable subtasks
   */
  async generateTaskBreakdown(title: string, description?: string): Promise<TaskBreakdownResult> {
    await new Promise((res) => setTimeout(res, 250));
    return breakDownTask(title, description);
  },

  /**
   * Evaluates task title, due date, and category to recommend priority with reasons
   */
  async generatePrioritySuggestion(
    title: string,
    dueDate?: string,
    category?: Category
  ): Promise<PrioritySuggestion> {
    await new Promise((res) => setTimeout(res, 120));
    return analyzeTaskPriority(title, dueDate, category);
  },

  /**
   * Retrieves or synthesizes study explanation for a curriculum topic
   */
  async generateStudyExplanation(topicId: string): Promise<StudyTopic | null> {
    await new Promise((res) => setTimeout(res, 150));
    const topic = studyTopics.find((t) => t.id === topicId || t.title.toLowerCase() === topicId.toLowerCase());
    return topic || studyTopics[0];
  },

  /**
   * Generates diagnostic quick quiz questions for self-assessment
   */
  async generateQuickQuestion(topicId: string) {
    await new Promise((res) => setTimeout(res, 120));
    const topic = studyTopics.find((t) => t.id === topicId);
    return topic ? topic.quiz : studyTopics[0].quiz;
  },

  /**
   * Answers a user question about a task or topic (interactive AI coach response)
   */
  async askTeacherQuestion(question: string, contextTask?: string): Promise<string> {
    await new Promise((res) => setTimeout(res, 350));
    const q = question.toLowerCase();

    if (q.includes('time') || q.includes('complexity')) {
      return "For time complexity, look for how the search space or loop shrinks: single loops are typically O(n), nested loops O(n²), and dividing in half each step is O(log n)!";
    }
    if (q.includes('start') || q.includes('how to begin') || q.includes('overwhelmed')) {
      return `When feeling overwhelmed with ${contextTask ? `"${contextTask}"` : 'a large task'}, pick the smallest 5-minute subtask. Action cures anxiety!`;
    }
    if (q.includes('remember') || q.includes('exam') || q.includes('memorize')) {
      return "Active recall (testing yourself without notes) and spaced repetition have 3x higher retention than passive rereading. Try the Quick Check quizzes!";
    }
    return `Great question! When approaching ${contextTask ? `"${contextTask}"` : 'this topic'}, focus on understanding the core mental model first before diving into intricate syntax.`;
  },
};
