import { StudyTopic } from '../types/task';

export const studyTopics: StudyTopic[] = [
  {
    id: 'binary-search',
    title: 'Binary Search',
    icon: 'Search',
    category: 'Algorithms',
    summary: 'Master divide-and-conquer searching on sorted data in O(log n) time.',
    lesson: {
      title: 'Binary Search Algorithm',
      teacherIntro: "Today we're learning Binary Search! 🔎 It's one of the most powerful divide-and-conquer algorithms ever designed.",
      explanation: 'Binary Search operates exclusively on sorted sequences. Instead of scanning one item at a time from left to right (linear search), it inspects the middle element. If the target is smaller, the search immediately discards the entire upper half; if larger, it discards the lower half. This slashes the search universe in two with every single check!',
      realWorldAnalogy: 'Imagine searching for the word "Polymorphism" in a physical 1,000-page dictionary. You don\'t start reading from page 1! You flip open the middle (letter M). Since P comes after M, you ignore the first 500 pages completely and open the middle of the second half.',
      keyPoints: [
        'Prerequisite: The input array MUST be sorted.',
        'Time Complexity: O(log n) average and worst case.',
        'Space Complexity: O(1) iterative, O(log n) recursive.',
        'Beware integer overflow when computing mid: use `low + Math.floor((high - low) / 2)`.',
      ],
      codeSnippet: `function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // Not found
}`,
      language: 'typescript',
    },
    quiz: {
      question: 'What is the time complexity of Binary Search on a sorted array with n elements?',
      options: [
        'A. O(n)',
        'B. O(log n)',
        'C. O(n²)',
        'D. O(1)',
      ],
      correctIndex: 1,
      explanation: 'Binary Search divides the remaining search window in half at each iteration, resulting in a logarithmic time complexity of O(log n).',
    },
  },
  {
    id: 'java-oop',
    title: 'Java OOP',
    icon: 'Code2',
    category: 'Programming',
    summary: 'Understand the 4 core pillars: Encapsulation, Inheritance, Polymorphism, and Abstraction.',
    lesson: {
      title: 'Object-Oriented Programming in Java',
      teacherIntro: "Welcome to Java OOP! ☕ Once you grasp these 4 core pillars, designing robust software becomes second nature.",
      explanation: 'Java is class-centric. Encapsulation bundles data with code inside private fields and getters/setters. Inheritance allows child classes to inherit attributes and methods from parents using `extends`. Polymorphism lets an entity take multiple forms (method overloading at compile time and overriding at runtime). Abstraction hides complex implementation details and only exposes essential features via abstract classes and interfaces.',
      realWorldAnalogy: 'Think of a Modern Smartphone: You interact with the touchscreen (Interface/Abstraction) and adjust the volume buttons without knowing how the microchip voltage is altered inside (Encapsulation). Apple and Samsung both build phones with common battery and speaker designs (Inheritance), yet each model plays audio with unique sound equalizer profiles (Polymorphism).',
      keyPoints: [
        'Encapsulation: Data hiding with private access modifiers and public accessors.',
        'Inheritance: Code reusability using `class Child extends Parent`.',
        'Polymorphism: Static (overloading) vs Dynamic (overriding with @Override).',
        'Abstraction: Contract enforcement via `interface` and `abstract class`.',
      ],
      codeSnippet: `// Interface representing an Abstraction
interface Printable {
  void print();
}

class Document implements Printable {
  private String content; // Encapsulation

  public Document(String content) {
    this.content = content;
  }

  @Override
  public void print() { // Polymorphism
    System.out.println("Printing: " + content);
  }
}`,
      language: 'java',
    },
    quiz: {
      question: 'Which OOP pillar is demonstrated when a subclass provides its own specific implementation of a method defined in its superclass?',
      options: [
        'A. Encapsulation',
        'B. Abstraction',
        'C. Runtime Polymorphism (Method Overriding)',
        'D. Compile-time Overloading',
      ],
      correctIndex: 2,
      explanation: 'Method overriding is a classic example of dynamic/runtime polymorphism, where Java resolves the method call based on the runtime object type.',
    },
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    icon: 'Layers',
    category: 'Algorithms',
    summary: 'Compare fundamental data structures: Arrays, Linked Lists, Stacks, Queues, and Hash Maps.',
    lesson: {
      title: 'Fundamental Data Structures',
      teacherIntro: "Let's explore DSA! 🧱 Choosing the right data structure can make your program 1,000x faster.",
      explanation: 'Arrays provide O(1) random access via index, but dynamic resizing or mid-insertion requires O(n) shifting. Linked Lists allow O(1) head/tail insertions without contiguous memory, but lookup is O(n). Stacks adhere to Last-In-First-Out (LIFO) for undo systems, Queues operate on First-In-First-Out (FIFO) for scheduling, and Hash Maps offer O(1) average lookup using hash functions.',
      realWorldAnalogy: 'Imagine a Cafeteria Plate Dispenser: When clean plates are stacked, you always take the top one first (Stack - LIFO). Meanwhile, customers standing in line at the cash register are served strictly in order of arrival (Queue - FIFO).',
      keyPoints: [
        'Hash Map: O(1) average lookup/insert, but O(n) worst case if collisions cascade.',
        'Stack: Push and Pop at O(1) time complexity.',
        'Queue: Enqueue and Dequeue at O(1) time complexity with two pointers.',
        'Space/Time Tradeoff: Hash tables trade memory footprint for constant-time speed.',
      ],
      codeSnippet: `// Quick Stack Implementation
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  isEmpty(): boolean { return this.items.length === 0; }
}`,
      language: 'typescript',
    },
    quiz: {
      question: 'Which data structure is most appropriate for implementing the "Undo" feature in a text editor?',
      options: [
        'A. Queue (FIFO)',
        'B. Stack (LIFO)',
        'C. Binary Search Tree',
        'D. Hash Set',
      ],
      correctIndex: 1,
      explanation: 'A Stack uses Last-In-First-Out (LIFO), which perfectly matches Undo: the most recent action executed must be the first one undone.',
    },
  },
  {
    id: 'sql',
    title: 'SQL & Relational Queries',
    icon: 'Database',
    category: 'Database',
    summary: 'Master declarative data querying with SELECT, JOINs, aggregations, and subqueries.',
    lesson: {
      title: 'SQL Relational Queries',
      teacherIntro: "Time to master SQL! 📊 SQL is the universal language for asking questions to relational databases.",
      explanation: 'SQL is declarative: you describe WHAT data you want, and the database optimizer figures out HOW to fetch it. Key concepts include INNER JOIN (returns rows with matches in both tables), LEFT JOIN (returns all rows from left table plus matching rights), GROUP BY for aggregating statistics with functions like COUNT, SUM, AVG, and HAVING for filtering aggregated groups.',
      realWorldAnalogy: 'Think of Two Guest Lists: List A is students in Math class, List B is students in Physics. An INNER JOIN gives you students taking BOTH classes. A LEFT JOIN gives you all Math students, showing their Physics grade if they take it, or blank if they do not.',
      keyPoints: [
        'Query execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT.',
        'WHERE filters individual rows before aggregation; HAVING filters aggregated groups.',
        'Always index columns used frequently in WHERE and JOIN ON conditions.',
      ],
      codeSnippet: `SELECT 
  d.department_name, 
  COUNT(e.id) AS total_employees, 
  AVG(e.salary) AS average_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.department_name
HAVING COUNT(e.id) > 5
ORDER BY average_salary DESC;`,
      language: 'sql',
    },
    quiz: {
      question: 'What is the primary difference between the WHERE clause and the HAVING clause in SQL?',
      options: [
        'A. WHERE filters rows before aggregation, while HAVING filters groups after aggregation',
        'B. HAVING filters rows before aggregation, while WHERE filters afterwards',
        'C. WHERE works only with numbers, HAVING only with text strings',
        'D. There is no difference; they are interchangeable',
      ],
      correctIndex: 0,
      explanation: 'WHERE filters rows prior to any grouping, whereas HAVING is specifically designed to filter the results produced by GROUP BY aggregations.',
    },
  },
  {
    id: 'dbms',
    title: 'DBMS & ACID Properties',
    icon: 'Server',
    category: 'Database',
    summary: 'Understand Atomicity, Consistency, Isolation, Durability, and database normalization.',
    lesson: {
      title: 'Database Management & ACID Guarantees',
      teacherIntro: "Welcome to DBMS! 🗄️ When billions of dollars move across bank accounts, ACID properties prevent catastrophic failure.",
      explanation: 'A transaction is an atomic unit of work. ACID guarantees reliability: Atomicity ("all or nothing" execution), Consistency (maintains valid database constraints), Isolation (concurrent transactions execute without corrupting each other), and Durability (committed changes survive system power outages or crashes).',
      realWorldAnalogy: 'Bank Transfer: If Alice transfers $100 to Bob, step 1 deducts $100 from Alice and step 2 adds $100 to Bob. If the server crashes between step 1 and step 2, Atomicity ensures Alice gets her $100 back rather than vanishing into thin air!',
      keyPoints: [
        'Atomicity: Transactions cannot be partially completed; they commit or rollback entirely.',
        'Isolation Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.',
        'Durability: Write-Ahead Logging (WAL) ensures committed transactions persist on disk.',
        'Normalization (1NF -> 3NF): Removes data redundancy and update anomalies.',
      ],
      codeSnippet: `BEGIN TRANSACTION;

UPDATE accounts 
SET balance = balance - 100 
WHERE account_id = 'alice_01';

UPDATE accounts 
SET balance = balance + 100 
WHERE account_id = 'bob_02';

COMMIT; -- All or nothing guarantee!`,
      language: 'sql',
    },
    quiz: {
      question: 'Which ACID property guarantees that once a transaction has completed, its changes will not be lost even if the system crashes immediately afterwards?',
      options: [
        'A. Atomicity',
        'B. Consistency',
        'C. Isolation',
        'D. Durability',
      ],
      correctIndex: 3,
      explanation: 'Durability guarantees that once a transaction is committed, its effects are permanently recorded in non-volatile storage and survive crashes.',
    },
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering & Clean Architecture',
    icon: 'Workflow',
    category: 'Engineering',
    summary: 'SOLID principles, modular system design, automated testing, and CI/CD pipelines.',
    lesson: {
      title: 'Software Engineering Best Practices',
      teacherIntro: "Welcome to Software Engineering! 🛠️ Writing code that works is only step one; writing code that teams can maintain for 10 years is engineering.",
      explanation: 'Clean architecture prioritizes separation of concerns, loose coupling, and high cohesion. The SOLID principles guide object-oriented design: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Coupled with automated unit tests and CI/CD pipelines, engineering turns fragile scripts into robust systems.',
      realWorldAnalogy: 'Lego vs Clay: Clay models are quick to shape, but changing an arm ruins the torso. Lego bricks have standardized snap interfaces (Interfaces/Contracts); you can swap a red brick for a blue one instantly without breaking the castle.',
      keyPoints: [
        'Single Responsibility Principle: A module should have one, and only one, reason to change.',
        'DRY: Don\'t Repeat Yourself; abstract common logic cleanly.',
        'Testing Pyramid: Many fast unit tests, fewer integration tests, minimal end-to-end tests.',
        'Code Reviews: Catch architectural flaws, security risks, and improve team knowledge sharing.',
      ],
      codeSnippet: `// Dependency Inversion: depend on abstractions, not concretions
interface Notifier {
  send(message: string): Promise<void>;
}

class TaskService {
  constructor(private notifier: Notifier) {}

  async completeTask(taskId: string): Promise<void> {
    // perform task completion logic...
    await this.notifier.send(\`Task \${taskId} finished successfully!\`);
  }
}`,
      language: 'typescript',
    },
    quiz: {
      question: 'What does the "S" in the SOLID design principles stand for?',
      options: [
        'A. Scalable Architecture Principle',
        'B. Single Responsibility Principle',
        'C. Standardized Interface Principle',
        'D. Secure Coding Principle',
      ],
      correctIndex: 1,
      explanation: 'The "S" stands for Single Responsibility Principle: every class or module should have one responsibility and only one reason to change.',
    },
  },
  {
    id: 'computer-networks',
    title: 'Computer Networks',
    icon: 'Wifi',
    category: 'Networking',
    summary: 'OSI 7-Layer Model, TCP vs UDP, HTTP/HTTPS, DNS resolution, and IP routing.',
    lesson: {
      title: 'Computer Networks & Internet Protocols',
      teacherIntro: "Let's explore Computer Networks! 🌐 Every time you load a webpage, hundreds of packets dance across continents in milliseconds.",
      explanation: 'The OSI model separates communication into 7 distinct layers: Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, and Application (HTTP/DNS). TCP provides reliable, ordered, and error-checked delivery via 3-way handshake (`SYN -> SYN-ACK -> ACK`). UDP provides low-latency, connectionless transmission without delivery guarantees, making it ideal for video streaming and gaming.',
      realWorldAnalogy: 'Registered Post vs Walkie-Talkie: TCP is like certified mail with return receipt; you guarantee the recipient signed for every page before proceeding. UDP is like broadcasting over a radio; if static drops 2 seconds of audio, you keep talking in real-time instead of halting everything.',
      keyPoints: [
        'TCP: Reliable, ordered, connection-oriented (3-way handshake), flow control.',
        'UDP: Connectionless, fast, lightweight header (8 bytes vs 20 bytes for TCP).',
        'DNS: Translates human-readable domain names (example.com) into numeric IP addresses (93.184.216.34).',
        'HTTPS: HTTP layered over TLS/SSL encryption on port 443.',
      ],
      codeSnippet: `// Conceptual TCP 3-Way Handshake
// Client                     Server
//   | -------- SYN ---------> |  "Can we talk? (seq=100)"
//   | <---- SYN-ACK --------- |  "Yes! (seq=300, ack=101)"
//   | -------- ACK ---------> |  "Connection established! (ack=301)"
`,
      language: 'text',
    },
    quiz: {
      question: 'Which transport layer protocol is connectionless and prioritizes minimal latency over guaranteed packet delivery?',
      options: [
        'A. TCP',
        'B. UDP',
        'C. HTTP',
        'D. SSH',
      ],
      correctIndex: 1,
      explanation: 'UDP (User Datagram Protocol) does not perform handshakes or guarantee delivery, making it ideal for real-time applications like live streaming and gaming.',
    },
  },
];
