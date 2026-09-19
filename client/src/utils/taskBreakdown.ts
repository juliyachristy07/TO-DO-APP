export interface GeneratedSubtaskDraft {
  title: string;
  estimatedMinutes: number;
}

export interface TaskBreakdownResult {
  topicDetected: string;
  advice: string;
  subtasks: GeneratedSubtaskDraft[];
}

/**
 * Intelligent frontend task breakdown simulator using domain keyword patterns
 */
export const breakDownTask = (taskTitle: string, description?: string): TaskBreakdownResult => {
  const text = `${taskTitle} ${description || ''}`.toLowerCase();

  // 1. Java / OOP
  if (text.includes('java') || text.includes('oop') || text.includes('object oriented')) {
    return {
      topicDetected: 'Java OOP Mastery',
      advice: "Don't worry! Let's break this into small, structured steps so you build deep conceptual understanding.",
      subtasks: [
        { title: 'Revise classes, objects, and constructors', estimatedMinutes: 15 },
        { title: 'Study inheritance (super keyword, extends)', estimatedMinutes: 15 },
        { title: 'Study polymorphism (compile-time vs runtime overriding)', estimatedMinutes: 15 },
        { title: 'Study abstraction (abstract classes & methods)', estimatedMinutes: 15 },
        { title: 'Study interfaces & default implementations', estimatedMinutes: 15 },
        { title: 'Practice Java OOP coding problems on IDE', estimatedMinutes: 20 },
        { title: 'Solve previous year exam questions', estimatedMinutes: 15 },
      ],
    };
  }

  // 2. Binary Search / Search Algorithms
  if (text.includes('binary search') || text.includes('search algorithm')) {
    return {
      topicDetected: 'Binary Search Mastery',
      advice: "Binary Search is all about invariant bounds! Let's conquer the concepts and edge cases step by step.",
      subtasks: [
        { title: 'Understand search range pointers (low, high, mid calculation)', estimatedMinutes: 10 },
        { title: 'Implement standard iterative Binary Search in code', estimatedMinutes: 15 },
        { title: 'Handle duplicate values and lower/upper bound variants', estimatedMinutes: 15 },
        { title: 'Solve Binary Search on Rotated Sorted Array', estimatedMinutes: 20 },
        { title: 'Solve 1 peak element search problem', estimatedMinutes: 15 },
      ],
    };
  }

  // 3. DSA / LeetCode / Data Structures
  if (text.includes('dsa') || text.includes('leetcode') || text.includes('data structure') || text.includes('algorithm')) {
    return {
      topicDetected: 'Data Structures & Algorithms Sprint',
      advice: 'The secret to DSA is pattern recognition. We will break your session into clean stages.',
      subtasks: [
        { title: 'Review core data structure characteristics & time complexities', estimatedMinutes: 10 },
        { title: 'Solve Problem 1 (Warmup / Easy)', estimatedMinutes: 15 },
        { title: 'Analyze edge cases and optimal Big-O complexity', estimatedMinutes: 10 },
        { title: 'Solve Problem 2 (Medium pattern application)', estimatedMinutes: 20 },
        { title: 'Write down key takeaways and tricky pitfalls in study notes', estimatedMinutes: 10 },
      ],
    };
  }

  // 4. SQL / Database
  if (text.includes('sql') || text.includes('dbms') || text.includes('database') || text.includes('query')) {
    return {
      topicDetected: 'Relational Database Sprint',
      advice: "Relational queries become simple when you master the execution order. Here's your focused plan:",
      subtasks: [
        { title: 'Review SQL execution order (FROM -> WHERE -> GROUP BY -> SELECT)', estimatedMinutes: 10 },
        { title: 'Practice multi-table INNER and LEFT JOINs', estimatedMinutes: 15 },
        { title: 'Write GROUP BY queries with HAVING filters', estimatedMinutes: 15 },
        { title: 'Solve correlated nested subqueries challenge', estimatedMinutes: 20 },
        { title: 'Review indexing and query explain plans', estimatedMinutes: 10 },
      ],
    };
  }

  // 5. Web Development / Project / Portfolio / React
  if (text.includes('portfolio') || text.includes('project') || text.includes('react') || text.includes('web') || text.includes('app') || text.includes('frontend')) {
    return {
      topicDetected: 'Project Development Milestones',
      advice: "Large software projects can feel overwhelming. Let's slice it into modular, deliverable milestones!",
      subtasks: [
        { title: 'Outline core requirements, user flow, and component wireframe', estimatedMinutes: 20 },
        { title: 'Initialize project structure and configure modern styling (Tailwind/CSS)', estimatedMinutes: 15 },
        { title: 'Build hero section and main navigation shell', estimatedMinutes: 25 },
        { title: 'Implement state management and interactive features', estimatedMinutes: 35 },
        { title: 'Test responsive view on mobile and deploy live build', estimatedMinutes: 20 },
      ],
    };
  }

  // 6. Exam / Test / Revision
  if (text.includes('exam') || text.includes('test') || text.includes('quiz') || text.includes('revision') || text.includes('midterm') || text.includes('final')) {
    return {
      topicDetected: 'Exam Revision Roadmap',
      advice: "Take a deep breath! Active recall and spaced testing beat passive reading every single time.",
      subtasks: [
        { title: 'Skim syllabus and highlight high-weightage chapters', estimatedMinutes: 15 },
        { title: 'Review key definitions, formulas, and diagrams', estimatedMinutes: 25 },
        { title: 'Create 1-page quick formula/concept summary cheat sheet', estimatedMinutes: 20 },
        { title: 'Solve 3 previous year exam question papers under timed conditions', estimatedMinutes: 45 },
        { title: 'Clarify remaining doubts in AI Study Mode', estimatedMinutes: 15 },
      ],
    };
  }

  // 7. Generic Fallback decomposition
  return {
    topicDetected: 'Actionable Step-by-Step Breakdown',
    advice: "Don't worry! Let's break this into small, achievable steps so you build steady momentum.",
    subtasks: [
      { title: `Define specific objective & resources for "${taskTitle}"`, estimatedMinutes: 10 },
      { title: 'Phase 1: Research, draft outline, and set up workspace', estimatedMinutes: 20 },
      { title: 'Phase 2: Deep execution of core requirements', estimatedMinutes: 35 },
      { title: 'Phase 3: Review, verify against requirements, and refine details', estimatedMinutes: 20 },
      { title: 'Phase 4: Final wrap-up and record lessons learned', estimatedMinutes: 10 },
    ],
  };
};
