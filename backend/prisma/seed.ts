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
  }
];

// Helper to generate 10 quiz questions for a module
function generateModuleQuizzes(courseId: string, order: number, title: string) {
  const questions = [];
  const subjects: Record<string, string[]> = {
    C: ["compilation execution", "memory addresses", "type allocations", "pointer arithmetic", "binary structures"],
    "C++": ["OOP principles", "class instances", "vtables vptrs", "smart references", "generic templates"],
    IoT: ["cloud nodes", "ESP32 registers", "MQTT brokers", "SPI signals", "ADC resolutions"],
    Embedded: ["NVIC interrupts", "FreeRTOS queues", "ARM memory mappings", "GPIO configs", "timer clocks"]
  };

  const currentSubjects = subjects[courseId] || ["general concepts"];

  for (let q = 1; q <= 10; q++) {
    const term = currentSubjects[(q + order) % currentSubjects.length];
    const questionText = `Regarding ${title}, which option represents the optimal setup for ${term}?`;
    const options = [
      `Pre-allocated static stack configuration to minimize ${term} latency`,
      `Dynamic heap allocation during runtime validation`,
      `Fallback checking using standard peripheral interrupt flags`,
      `Default compiler optimization utilizing register caching`
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

  // Clean old contents in reverse order of dependencies
  await prisma.topic.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.practiceQuestion.deleteMany();
  await prisma.practiceAttempt.deleteMany();
  await prisma.moduleProgress.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.projectSubmission.deleteMany();
  await prisma.finalExamQuestion.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.certificateRecord.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.forumComment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  // Seed Courses, Modules, Topics, and Quizzes
  for (const courseData of coursesList) {
    const course = await prisma.course.create({
      data: {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        price: 999,
        isPublished: true
      }
    });

    console.log(`Created Course: ${course.id}`);

    // Seed 20 Modules per course
    for (let mIdx = 0; mIdx < courseData.modules.length; mIdx++) {
      const moduleTitle = courseData.modules[mIdx];
      const moduleOrder = mIdx + 1;

      const modRecord = await prisma.module.create({
        data: {
          courseId: course.id,
          week: moduleOrder,
          title: moduleTitle,
          description: `Deep dive into advanced concepts, syntax structures, and system benchmarks for ${moduleTitle}.`
        }
      });

      // Seed exactly 6 topics matching module content requirements
      const topicsData = [
        {
          title: "Learning Objectives",
          text: `By the end of this module on **${moduleTitle}**, you will be able to:\n1. Describe the underlying execution models of ${moduleTitle}.\n2. Develop robust interfaces conforming to ISO design rules.\n3. Apply bit-precise debug parameters to isolate logical errors.\n4. Design and execute custom test benchmarks on target boards.`,
          code: `// Objectives Verification Code\n#include <stdio.h>\nint main() {\n    printf("Objectives loaded for ${moduleTitle}\\n");\n    return 0;\n}`,
          note: "Always verify target hardware specifications before applying new registers parameters."
        },
        {
          title: "Detailed Notes",
          text: `### Theoretical Foundations of ${moduleTitle}\nThis module explores key syntax constructions, memory layouts, and compilation pipelines. Pointers map directly to hardware addresses, and compiler optimizers shift processing variables into CPU registers. In safety-critical embedded systems, dynamic layouts are avoided to enforce deterministic runtime speeds.`,
          code: `// System Sandbox Simulation\n#define SYS_REG 0x40021000\nvoid init_system() {\n    volatile unsigned int* clk = (unsigned int*)SYS_REG;\n    *clk |= 0x01; // Enable system clock register\n}`,
          note: "Ensure proper volatile mappings to force compiler reload from physical RAM."
        },
        {
          title: "Examples",
          text: `Here is a complete, working example illustrating the typical implementation patterns for **${moduleTitle}**. Pay close attention to error checks and data boundaries.`,
          code: `// Verified Implementation Example\n#include <stdio.h>\n\nvoid run_example() {\n    printf("Running verified example: ${moduleTitle}\\n");\n    // Add customized application logic here\n}`,
          note: "Compile with -Wall -Wextra flags to verify code safety constraints."
        },
        {
          title: "Practical Exercises",
          text: `Complete the following lab exercises to build confidence in **${moduleTitle}**:\n1. Configure a mock register to toggle GPIO pin outputs.\n2. Write a function that safely handles pointer boundaries without overflow.\n3. Implement a circular ring buffer that passes serialized byte frames.`,
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
