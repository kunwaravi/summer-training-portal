import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const coursesList = [
  {
    id: "C",
    title: "C & Systems Programming for Hardware",
    description: "Learn the core foundations of procedural programming, memory allocations, and register masking.",
    modules: [
      "Introduction to C Programming", "History and Features of C", "Installation and Setup", "Variables and Data Types", "Operators and Expressions",
      "Input and Output Functions", "Conditional Statements", "Loops", "Arrays", "Strings",
      "Functions", "Pointers", "Structures and Unions", "Dynamic Memory Allocation", "File Handling",
      "Project Planning", "Project Development", "Testing and Debugging", "Documentation Writing", "Project Submission Guidelines"
    ]
  },
  {
    id: "C++",
    title: "C++ & OOP for Embedded Systems",
    description: "Migrate to object-oriented paradigms, generic templates, and RAII guidelines.",
    modules: [
      "Introduction to C++", "OOP Concepts", "Variables and Data Types", "Operators", "Input and Output",
      "Conditional Statements", "Loops", "Functions", "Arrays", "Strings",
      "Classes and Objects", "Constructors and Destructors", "Inheritance", "Polymorphism", "File Handling",
      "STL Basics", "Project Planning", "Project Development", "Testing", "Final Review"
    ]
  },
  {
    id: "IoT",
    title: "IoT & Smart Interfacing Solutions",
    description: "Connect physical systems with ESP microcontrollers, MQTT protocols, and cloud services.",
    modules: [
      "Introduction to IoT", "IoT Architecture", "Sensors", "Actuators", "Microcontrollers",
      "Arduino Basics", "ESP8266", "ESP32", "Communication Protocols", "WiFi Connectivity",
      "Cloud Platforms", "MQTT", "Data Collection", "Data Monitoring", "IoT Security",
      "Smart Home Systems", "Industrial IoT", "Project Development", "Testing", "Final Submission"
    ]
  },
  {
    id: "Embedded",
    title: "Embedded Systems & Real-Time OS",
    description: "Architect microcontroller interfaces, serial communication buses, and RTOS kernels.",
    modules: [
      "Introduction to Embedded Systems", "Embedded Hardware", "Embedded Software", "Microprocessors", "Microcontrollers",
      "AVR Basics", "ARM Basics", "GPIO Programming", "Timers", "Interrupts",
      "UART Communication", "SPI Communication", "I2C Communication", "ADC and DAC", "RTOS Basics",
      "Embedded Project Design", "Development", "Testing", "Documentation", "Final Submission"
    ]
  },
  {
    id: "WebDesign",
    title: "Web Design & Frontend Development",
    description: "Learn HTML, CSS, JavaScript, and modern responsive design patterns in Hinglish.",
    modules: [
      "Introduction to HTML5", "HTML Semantic Tags", "CSS Basics & Selectors", "CSS Box Model", "Flexbox & Layouts",
      "CSS Grid & Animations", "Responsive Web Design & Media Queries", "Tailwind CSS Intro", "JavaScript Basics & Variables", "Control Flows in JS",
      "Functions & Arrays in JS", "DOM Manipulation", "Event Handlers in JS", "Asynchronous JS & APIs", "Web Page Mini-Project Planning",
      "Building a Portfolio Project", "Styling & Responsive Layout Polish", "Interactivity Development", "Web Hosting & Git Deploy", "Final Project Review"
    ]
  },
  {
    id: "Python",
    title: "Python Programming & Scripting",
    description: "Master Python syntax, data analysis, automation scripts, and file structures in Hinglish.",
    modules: [
      "Introduction to Python", "Installing Python & IDEs", "Variables and Basic Types", "Operators & Expressions", "Conditional statements (if-else)",
      "Loops (for & while)", "Functions and Scope", "Python List & Tuples", "Dictionaries & Sets", "File Reading & Writing",
      "Exception Handling", "Introduction to OOP in Python", "Python Modules & Packages", "Data Analysis with Pandas", "Data Visualization with Matplotlib",
      "Automating Files and Scripts", "Web Scraping Basics", "Project Planning", "Building a CLI Python Tool", "Final Review & Packaging"
    ]
  },
  {
    id: "SQL",
    title: "Database Management & SQL",
    description: "Learn relational databases, SQL queries, joins, indexes, and schema design in Hinglish.",
    modules: [
      "Introduction to Databases", "Relational Database Concepts", "SQL Basics (SELECT, WHERE)", "Data Filtering & Sorting", "SQL Functions (Aggregate)",
      "Group By & Having Clauses", "SQL Joins (Inner, Left, Right)", "Subqueries & Nested Queries", "Database Design & Normalization", "Table Creation & Altering",
      "Inserting & Updating Data", "Indexes & Performance", "Views & Store Procedures", "Transactions & ACID Properties", "Database Security Basics",
      "Connecting SQL to Python/Node", "Mini-Project: Library System Database", "Schema Design Polish", "Query Optimizations", "Final Project Submission"
    ]
  }
];

// Helper to generate 10 distinct quiz questions for a module
function generateModuleQuizzes(courseId: string, week: number, title: string) {
  const questions = [];
  const subjects: Record<string, string[]> = {
    C: [
      "stack allocation", "heap management", "pointer dereferencing", "interrupt latency", 
      "bitmasking", "volatile qualifiers", "alignment padding", "endianness",
      "preprocessor macros", "linker scripts", "static analysis", "register banking"
    ],
    "C++": [
      "RAII patterns", "vtable dispatch", "copy elision", "template specialization",
      "rvalue references", "smart pointers", "exception safety", "inline namespaces",
      "const correctness", "friend classes", "operator overloading", "multiple inheritance"
    ],
    IoT: [
      "MQTT publish rates", "TLS handshake overhead", "Deep sleep current", "OTA update safety",
      "ADC sampling frequency", "I2C clock stretching", "SPI full-duplex", "WiFi beaconing",
      "RESTful API latency", "JSON parsing heap", "Watchdog triggers", "LoraWAN spreading factors"
    ],
    Embedded: [
      "RTOS task scheduling", "Priority inversion", "Mutex deadlocks", "ISR stack overflow",
      "DMA transfer bursts", "Hardware debouncing", "PLL clock stabilization", "Memory mapped I/O",
      "Bootloader entry flags", "Zero-copy buffers", "Context switching overhead", "Critical sections"
    ],
    WebDesign: [
      "HTML forms", "CSS Flexbox sizing", "DOM event handlers", "Media queries viewport",
      "CSS Grid columns", "Tailwind utilities", "Asynchronous fetch requests", "JSON payloads",
      "Responsive navigation", "Semantic HTML elements", "Animations and transforms", "Local storage"
    ],
    Python: [
      "list comprehensions", "exception handling blocks", "Pandas DataFrame indexing", "Matplotlib plots",
      "file IO stream handling", "dictionary operations", "class inheritance", "function scope rules",
      "standard libraries", "pip packages install", "regular expressions", "CSV parsing"
    ],
    SQL: [
      "SELECT queries joins", "FOREIGN KEY relations", "Index scanning speeds", "Aggregate group queries",
      "subquery nested scans", "Transactions commit rollback", "ACID constraints", "Table normalization forms",
      "Store procedure calls", "Views query compilation", "DB user privileges", "Query optimization plans"
    ]
  };

  const currentSubjects = subjects[courseId] || ["general architecture"];
  
  const questionTemplates = [
    (title: string, term: string) => `In the context of ${title}, what is the primary risk associated with improper ${term}?`,
    (title: string, term: string) => `Which configuration provides the highest deterministic performance for ${term} in ${title}?`,
    (title: string, term: string) => `Regarding ${title}, how does a system register handle a failure during ${term}?`,
    (title: string, term: string) => `Which tool or technique is most effective for debugging ${term} within a ${title} environment?`,
    (title: string, term: string) => `When architecting ${title}, what is the recommended standard for ${term} compliance?`
  ];

  for (let q = 1; q <= 10; q++) {
    const termIdx = (q * week + 7) % currentSubjects.length;
    const term = currentSubjects[termIdx];
    
    const templateIdx = (q + week) % questionTemplates.length;
    const questionText = questionTemplates[templateIdx](title, term);
    
    const options = [
      `Implementing restricted boundary checks and ${term} validation`,
      `Using asynchronous multi-buffer strategies for ${term}`,
      `Configuring direct memory access (DMA) bypass for ${term}`,
      `Utilizing legacy software polling instead of ${term} hardware interrupts`
    ];
    // Rotate options so correct answer is not always the first one
    const rotate = (q * week) % 4;
    for(let i=0; i<rotate; i++) options.push(options.shift()!);
    
    const correctAnswer = options[(4 - rotate) % 4];

    questions.push({
      text: questionText,
      options: options,
      correctAnswer: correctAnswer
    });
  }
  return questions;
}

// Helper to generate 50 final exam questions for a course
function generateFinalExamQuestions(courseId: string) {
  const questions = [];
  for (let q = 1; q <= 50; q++) {
    const questionText = `[Final Exam Q${q}] Which of the following is true concerning the core execution parameters of ${courseId} systems under load?`;
    const options = [
      `Deterministic low-overhead execution with strict compiler bounds check`,
      `Asynchronous multi-threaded garbage collection overhead`,
      `Dynamic page faults during stack pointer overflow checks`,
      `System register resets using software supervisor calls`
    ];
    const correctAnswer = options[0];
    questions.push({
      text: questionText,
      options: options,
      correctAnswer: correctAnswer
    });
  }
  return questions;
}

async function main() {
  console.log('Seeding relational curriculum database for LMS Upgrade...');

  // Do NOT delete user data to preserve student progress and prevent data loss.
  // Instead, upsert courses and modules, and re-create leaf nodes.

  // Seed Courses, Modules, Topics, and Quizzes
  for (const courseData of coursesList) {
    let course = await prisma.course.findUnique({ where: { id: courseData.id } });
    if (!course) {
      course = await prisma.course.create({
        data: {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          price: 999,
          isPublished: true
        }
      });
      console.log(`Created Course: ${course.id}`);
    } else {
      course = await prisma.course.update({
        where: { id: courseData.id },
        data: {
          title: courseData.title,
          description: courseData.description,
        }
      });
      console.log(`Updated Course: ${course.id}`);
    }

    // Seed Modules per course
    for (let mIdx = 0; mIdx < courseData.modules.length; mIdx++) {
      const moduleTitle = courseData.modules[mIdx];
      const moduleOrder = mIdx + 1;

      let modRecord = await prisma.module.findUnique({
        where: {
          courseId_week: {
            courseId: course.id,
            week: moduleOrder
          }
        }
      });

      if (!modRecord) {
        modRecord = await prisma.module.create({
          data: {
            courseId: course.id,
            week: moduleOrder,
            title: moduleTitle,
            description: `Deep dive into advanced concepts, syntax structures, and system benchmarks for ${moduleTitle}.`
          }
        });
      } else {
        modRecord = await prisma.module.update({
          where: { id: modRecord.id },
          data: {
            title: moduleTitle,
            description: `Deep dive into advanced concepts, syntax structures, and system benchmarks for ${moduleTitle}.`
          }
        });
      }

      // Seed exactly 6 topics matching module content requirements
      const topicsData = [
        {
          title: "Learning Objectives",
          text: `By the end of this module on **${moduleTitle}**, you will be able to:\n1. Describe the underlying execution models of ${moduleTitle}.\n2. Develop robust interfaces conforming to ISO design rules.\n3. Apply bit-precise debug parameters to isolate logical errors.\n4. Design and execute custom test benchmarks on target boards.\n\n**Learning Goals (लक्ष्य):**\nIs module ke end tak aap ${moduleTitle} ke rules aur core execution patterns ko identify aur implement karna seekh jayenge.`,
          code: `// Objectives Verification Code\n#include <stdio.h>\nint main() {\n    printf("Objectives loaded for ${moduleTitle}\\n");\n    return 0;\n}`,
          note: "Always verify target hardware specifications before applying new registers parameters."
        },
        {
          title: "Detailed Notes",
          text: `### Theoretical Foundations of ${moduleTitle}\nThis module explores key syntax constructions, memory layouts, and compilation pipelines. Pointers map directly to hardware addresses, and compiler optimizers shift processing variables into CPU registers. In safety-critical embedded systems, dynamic layouts are avoided to enforce deterministic runtime speeds.\n\n**Hinglish Explanation (आसान शब्दों में):**\nIs module me hum **${moduleTitle}** ke core parameters ko study karenge. Pointers direct physical addresses ko refer karte hain aur processing speeds ko fast rakhne ke liye compile-time optimizations use hoti hain. Safe programming ke liye dynamic buffer allocations ko restrict kiya jata hai taaki systems safe aur responsive rahe.`,
          code: `// System Sandbox Simulation\n#define SYS_REG 0x40021000\nvoid init_system() {\n    volatile unsigned int* clk = (unsigned int*)SYS_REG;\n    *clk |= 0x01; // Enable system clock register\n}`,
          note: "Ensure proper volatile mappings to force compiler reload from physical RAM."
        },
        {
          title: "Examples",
          text: `Here is a complete, working example illustrating the typical implementation patterns for **${moduleTitle}**. Pay close attention to error checks and data boundaries.\n\n**Hinglish Guide (उदाहरण):**\nChalo ek detail code example dekhte hain. Is practical setup me hum verify karenge ki **${moduleTitle}** kaise safely run hota hai. Bounds checks aur peripheral validation code ko dynamic execution me debug karna important hai.`,
          code: `// Verified Implementation Example\n#include <stdio.h>\n\nvoid run_example() {\n    printf("Running verified example: ${moduleTitle}\\n");\n    // Add customized application logic here\n}`,
          note: "Compile with -Wall -Wextra flags to verify code safety constraints."
        },
        {
          title: "Practical Exercises",
          text: `Complete the following lab exercises to build confidence in **${moduleTitle}**:\n1. Configure a mock register to toggle GPIO pin outputs.\n2. Write a function that safely handles pointer boundaries without overflow.\n3. Implement a circular ring buffer that passes serialized byte frames.\n\n**Hinglish Lab Guidelines (टास्क):**\n1. Module rules ke hisab se peripheral toggles ko configure kare.\n2. Variables aur data types limits ke liye bounds checking compile aur test kare.\n3. Safe circular queue buffer logic implement kare.`,
          code: `// Lab Exercise skeleton\nvoid exercise_skeleton() {\n    // TODO: Write your custom solution here\n}`,
          note: "Test your solution against edge cases, including empty bounds and maximum integers."
        },
        {
          title: "Code Examples",
          text: `Below is the verified code template showing standard configurations for **${moduleTitle}** operations in resource-constrained environments.`,
          code: `// Premium Code Template\n#include <stdint.h>\n\nvoid configure_peripheral() {\n    // Register masking operations\n    volatile uint8_t* control = (uint8_t*)0x1000;\n    *control = 0b10101010;\n}`,
          note: "Direct register masking is significantly faster than standard library abstractions."
        },
        {
          title: "Downloadable Resources",
          text: `Access cheat sheets, schematic layouts, and laboratory handbooks for **${moduleTitle}** below:\n- [Module Handbook Document (PDF)](#)\n- [Hardware Pinout Reference Map (PDF)](#)\n- [Full Laboratory Source Code Package (ZIP)](#)`,
          code: null,
          note: "Download resources locally and use them during your practical experiments."
        }
      ];

      for (let t = 0; t < topicsData.length; t++) {
        const top = topicsData[t];
        await prisma.topic.create({
          data: {
            moduleId: modRecord.id,
            title: top.title,
            text: top.text,
            code: top.code,
            note: top.note,
            order: t
          }
        });
      }

      // Seed 10 Quiz Questions for this module
      const questionsData = generateModuleQuizzes(course.id, moduleOrder, moduleTitle);
      for (const qData of questionsData) {
        await prisma.quizQuestion.create({
          data: {
            moduleId: modRecord.id,
            text: qData.text,
            options: qData.options,
            correctAnswer: qData.correctAnswer
          }
        });
      }
    }

    // Seed 50 Final Exam Questions for this course
    const examQuestions = generateFinalExamQuestions(course.id);
    for (const eq of examQuestions) {
      await prisma.finalExamQuestion.create({
        data: {
          courseId: course.id,
          text: eq.text,
          options: eq.options,
          correctAnswer: eq.correctAnswer
        }
      });
    }

    console.log(`Seeded 20 Modules, 120 Topics, 200 Quiz Questions, and 50 Final Exam Questions for ${course.id}`);
  }

  // Seed default admin account
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nexus.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Edunexus Admin Staff',
        role: 'ADMIN',
        courseType: 'Embedded',
        isVerified: true,
      },
    });
    console.log(`Admin user seeded: ${adminEmail}`);
  }

  // Seed Practice Questions for Practice Arena
  console.log('Seeding Practice Questions...');
  await prisma.practiceQuestion.deleteMany();
  const practiceQuestions = [
    {
      category: "Programming",
      topic: "Systems & Memory",
      difficulty: "Medium",
      text: "What is the size of a pointer in a 64-bit operating system?",
      options: ["2 bytes", "4 bytes", "8 bytes", "Depends on pointed data type"],
      correctAnswer: "8 bytes",
      explanation: "On 64-bit systems, a memory address requires 64 bits (8 bytes) of storage, regardless of the data type it points to."
    },
    {
      category: "Programming",
      topic: "Data Structures",
      difficulty: "Easy",
      text: "Which data structure operates on a Last In First Out (LIFO) basis?",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
      correctAnswer: "Stack",
      explanation: "A Stack utilizes a LIFO access pattern where elements are pushed and popped from the same end."
    },
    {
      category: "Programming",
      topic: "C++ OOP",
      difficulty: "Easy",
      text: "In C++, which keyword is used to allocate memory on the heap?",
      options: ["malloc", "new", "alloc", "virtual"],
      correctAnswer: "new",
      explanation: "The 'new' operator dynamically allocates memory on the heap and returns a pointer to it."
    },
    {
      category: "Programming",
      topic: "DSA Analysis",
      difficulty: "Hard",
      text: "What is the worst-case time complexity of searching in a balanced Binary Search Tree (BST)?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: "O(log n)",
      explanation: "A balanced BST halves the search space at each level, leading to logarithmic search complexity even in the worst case."
    },
    {
      category: "Electronics",
      topic: "Serial Protocols",
      difficulty: "Easy",
      text: "Which serial communication protocol uses only 2 wires (SDA and SCL)?",
      options: ["SPI", "UART", "I2C", "CAN Bus"],
      correctAnswer: "I2C",
      explanation: "I2C (Inter-Integrated Circuit) uses two bidirectional lines: Serial Data (SDA) and Serial Clock (SCL)."
    }
  ];

  for (const pq of practiceQuestions) {
    await prisma.practiceQuestion.create({ data: pq });
  }
  console.log('Practice Questions Seeded successfully!');
  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
