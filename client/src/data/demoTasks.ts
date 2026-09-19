import { Todo } from '../types/task';

// Format YYYY-MM-DD helper relative to today
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialDemoTasks: Todo[] = [
  {
    id: 'demo-1',
    title: 'Prepare Java OOP for exam',
    description: 'Comprehensive review of Object-Oriented concepts in Java before mid-term examination.',
    category: 'Exam',
    priority: 'high',
    dueDate: getRelativeDate(1), // Tomorrow
    estimatedMinutes: 90,
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Revise classes and objects', completed: true, estimatedMinutes: 15 },
      { id: 'sub-2', title: 'Study inheritance (extends, super)', completed: true, estimatedMinutes: 15 },
      { id: 'sub-3', title: 'Study polymorphism (overloading vs overriding)', completed: false, estimatedMinutes: 15 },
      { id: 'sub-4', title: 'Study abstraction (abstract classes)', completed: false, estimatedMinutes: 15 },
      { id: 'sub-5', title: 'Study interfaces & default methods', completed: false, estimatedMinutes: 15 },
      { id: 'sub-6', title: 'Practice Java OOP programs', completed: false, estimatedMinutes: 20 },
      { id: 'sub-7', title: 'Solve previous year exam questions', completed: false, estimatedMinutes: 15 },
    ],
  },
  {
    id: 'demo-2',
    title: 'Solve 3 DSA problems',
    description: 'Daily LeetCode grind focusing on Arrays and Binary Search techniques.',
    category: 'Coding',
    priority: 'high',
    dueDate: getRelativeDate(0), // Today
    estimatedMinutes: 45,
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    subtasks: [
      { id: 'sub-201', title: 'Two Sum (Hash Map approach)', completed: true, estimatedMinutes: 15 },
      { id: 'sub-202', title: 'Binary Search in rotated sorted array', completed: false, estimatedMinutes: 15 },
      { id: 'sub-203', title: 'Reverse a Linked List in-place', completed: false, estimatedMinutes: 15 },
    ],
  },
  {
    id: 'demo-3',
    title: 'Complete SQL practice',
    description: 'Master multi-table joins, aggregations, and subqueries on sample university database.',
    category: 'Study',
    priority: 'medium',
    dueDate: getRelativeDate(2),
    estimatedMinutes: 60,
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    subtasks: [
      { id: 'sub-301', title: 'Revise INNER, LEFT, RIGHT, and FULL OUTER joins', completed: true, estimatedMinutes: 20 },
      { id: 'sub-302', title: 'Practice GROUP BY with HAVING clause', completed: false, estimatedMinutes: 20 },
      { id: 'sub-303', title: 'Write correlated nested subqueries', completed: false, estimatedMinutes: 20 },
    ],
  },
  {
    id: 'demo-4',
    title: 'Revise DBMS Unit 2',
    description: 'Transaction management, ACID guarantees, and database normalization forms.',
    category: 'Exam',
    priority: 'high',
    dueDate: getRelativeDate(0), // Today
    estimatedMinutes: 50,
    completed: true,
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    subtasks: [
      { id: 'sub-401', title: 'Review ACID properties with banking examples', completed: true, estimatedMinutes: 15 },
      { id: 'sub-402', title: 'Normalization: 1NF, 2NF, 3NF and BCNF differences', completed: true, estimatedMinutes: 20 },
      { id: 'sub-403', title: 'B-Tree and B+ Tree indexing indexing basics', completed: true, estimatedMinutes: 15 },
    ],
  },
  {
    id: 'demo-5',
    title: 'Build portfolio project',
    description: 'Develop full responsive developer portfolio showcase with interactive demo links.',
    category: 'Project',
    priority: 'medium',
    dueDate: getRelativeDate(4),
    estimatedMinutes: 120,
    completed: false,
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    subtasks: [
      { id: 'sub-501', title: 'Initialize Vite + React + Tailwind CSS project', completed: true, estimatedMinutes: 20 },
      { id: 'sub-502', title: 'Design hero section with modern glassmorphism', completed: true, estimatedMinutes: 30 },
      { id: 'sub-503', title: 'Implement interactive project showcase grid', completed: false, estimatedMinutes: 40 },
      { id: 'sub-504', title: 'Deploy on Vercel and test responsive navigation', completed: false, estimatedMinutes: 30 },
    ],
  },
];
