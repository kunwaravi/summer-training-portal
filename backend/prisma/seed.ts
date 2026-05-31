import { PrismaClient } from '@prisma/client';
import { curriculum, quizzes } from '../src/lib/curriculumData';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const courseMetadata: Record<string, { title: string, description: string }> = {
  // Programming Category
  "C": {
    title: "C & Systems Programming for Hardware",
    description: "Learn the core foundations of procedural programming, memory allocations, and register masking."
  },
  "C++": {
    title: "C++ & OOP for Embedded Systems",
    description: "Migrate to object-oriented paradigms, generic templates, and RAII guidelines."
  },
  "Python": {
    title: "Python for Automation & Systems",
    description: "Learn scripting, text-parsing, file automation, and USB serial communications."
  },
  "Java": {
    title: "Java Enterprise Foundations & OOP",
    description: "Master Java JVM models, multi-threading, concurrency locks, and enterprise structures."
  },
  "WebDev": {
    title: "Modern Full-Stack Web Development",
    description: "Build premium responsive UIs with React and Express backend APIs."
  },
  "DSA": {
    title: "Data Structures & Algorithms",
    description: "Analyze time complexities, trees, graphs, sorting paths, and dynamic programming."
  },

  // Electronics Category
  "Arduino": {
    title: "Arduino Prototyping & C++ Firmware",
    description: "Interface analog/digital sensors and program AVR Atmega microcontrollers."
  },
  "IoT": {
    title: "IoT & Smart Interfacing Solutions",
    description: "Connect physical systems with ESP microcontrollers, MQTT protocols, and cloud services."
  },
  "Embedded": {
    title: "Embedded Systems & Real-Time OS",
    description: "Architect microcontroller interfaces, serial communication buses, and RTOS kernels."
  },
  "M8085": {
    title: "Microprocessor 8085 Assembly & Hardware",
    description: "Study 8085 microarchitecture, execution timings, and 8-bit Assembly."
  },
  "M8051": {
    title: "Microcontroller 8051 Embedded Architecture",
    description: "Program 8051 microcontrollers, Keil C compilers, and hardware registers."
  },
  "STM32": {
    title: "STM32 ARM Cortex-M Firmware Development",
    description: "Write STM32 bare-metal drivers, DMA channels, and peripheral configurations."
  },
  "RaspberryPi": {
    title: "Raspberry Pi Single-Board Computing & Linux",
    description: "Host Linux servers, script hardware GPIOs, and compile systems using Raspberry Pi."
  },
  "DigitalElec": {
    title: "Digital Electronics & Combinational Logic",
    description: "Design logic gate circuits, K-maps, multiplexers, and digital counters."
  },
  "AnalogElec": {
    title: "Analog Electronics & Active Circuit Design",
    description: "Analyze active semiconductor circuits, transistor amplifiers, and Op-Amps."
  },
  "PCBDesign": {
    title: "PCB Design & Board Schematics Layout",
    description: "Design custom PCB schematics, route trace paths, and export Gerber packages."
  },

  // AI & Emerging Technologies Category
  "AI": {
    title: "Artificial Intelligence Foundations",
    description: "Explore state searches, heuristic patterns, minimax paths, and AI basics."
  },
  "ML": {
    title: "Machine Learning & Statistical Models",
    description: "Build regressions, classification models, decision forests, and k-means clustering."
  },
  "Robotics": {
    title: "Robotics Kinematics & ROS Kernels",
    description: "Analyze mechanical kinematics, PID control loops, and build ROS nodes."
  },
  "ComputerVision": {
    title: "Computer Vision & OpenCV Processing",
    description: "Apply convolution filters, edge detection, camera calibration, and object trackers."
  }
};

async function main() {
  console.log('Seeding relational curriculum database...');

  // Clean old contents in reverse order of dependencies
  await prisma.topic.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.practiceQuestion.deleteMany();
  await prisma.practiceAttempt.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  // Seed Courses
  for (const [courseId, meta] of Object.entries(courseMetadata)) {
    const course = await prisma.course.create({
      data: {
        id: courseId,
        title: meta.title,
        description: meta.description,
        price: 999, // ₹999 for the certificate
        isPublished: true,
      }
    });

    console.log(`Upserted Course: ${course.id}`);

    // Seed Modules and Topics
    let courseModules = curriculum[courseId];
    if (!courseModules) {
      // Dynamic Mock Curriculum Generator
      courseModules = Array.from({ length: 5 }, (_, modIdx) => {
        const modOrder = modIdx + 1;
        return {
          order: modOrder,
          title: `Module ${modOrder}: Advanced Concepts in ${meta.title}`,
          description: `Deep dive into advanced patterns, implementation structures, and system benchmarks in ${meta.title}.`,
          topics: Array.from({ length: 3 }, (_, topIdx) => {
            const topOrder = topIdx + 1;
            return {
              title: `Topic ${modOrder}.${topOrder}: Core Foundations of ${meta.title}`,
              text: `This detailed handbook topic introduces core concepts, architectural layers, and performance considerations for ${meta.title}. It discusses standard workflows, state processing, and best practices for developing premium implementations.`,
              code: `// Sample Implementation in ${courseId}\nvoid run_demo() {\n    // Dynamic mock demo code snippet\n}`,
              note: `Ensure appropriate error bounds and system validation are applied when deploying this segment.`
            };
          })
        };
      });
    }

    if (courseModules) {
      for (const moduleData of courseModules) {
        const moduleRecord = await prisma.module.create({
          data: {
            courseId: courseId,
            order: moduleData.order,
            title: moduleData.title,
            description: moduleData.description
          }
        });
        
        console.log(`Upserted Module: ${courseId} - Order ${moduleData.order}`);

        for (let i = 0; i < moduleData.topics.length; i++) {
          const topicData = moduleData.topics[i];
          await prisma.topic.create({
            data: {
              moduleId: moduleRecord.id,
              title: topicData.title,
              text: topicData.text,
              code: topicData.code || null,
              note: topicData.note || null,
              order: i
            }
          });
        }
      }
      
      // Seed Quizzes
      let courseQuizzes = quizzes[courseId];
      if (!courseQuizzes && courseModules.length > 0) {
        courseQuizzes = {
          questions: Array.from({ length: 5 }, (_, qIdx) => {
            return {
              id: qIdx + 1,
              text: `Which of the following best describes the core principle of ${meta.title} in Module 1?`,
              options: [
                "Pre-allocated compile-time constraints with zero overhead",
                "Dynamic runtime heap allocations without bounds verification",
                "Asynchronous multiplexing without task prioritization",
                "Deterministic low-level register binding"
              ],
              correctAnswer: "Pre-allocated compile-time constraints with zero overhead"
            };
          })
        };
      }

      if (courseQuizzes && courseModules.length > 0) {
        const firstModule = await prisma.module.findFirst({
          where: { courseId, order: courseModules[0].order }
        });
        
        if (firstModule) {
          for (const question of courseQuizzes.questions) {
            await prisma.quizQuestion.create({
              data: {
                moduleId: firstModule.id,
                text: question.text,
                options: JSON.stringify(question.options),
                correctAnswer: question.correctAnswer
              }
            });
          }
          console.log(`Seeded Final Quiz for: ${courseId}`);
        }
      }
    }
  }

  // Seed default admin account
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("FATAL ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be defined for seeding!");
    process.exit(1);
  }

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

  // Seed Practice Questions
  console.log('Seeding Practice Questions...');
  const practiceQuestions = [
    {
      category: "Programming",
      topic: "Systems & Memory",
      difficulty: "Medium",
      text: "What is the size of a pointer in a 64-bit operating system?",
      options: JSON.stringify(["2 bytes", "4 bytes", "8 bytes", "Depends on pointed data type"]),
      correctAnswer: "8 bytes",
      explanation: "On 64-bit systems, a memory address requires 64 bits (8 bytes) of storage, regardless of the data type it points to."
    },
    {
      category: "Programming",
      topic: "Data Structures",
      difficulty: "Easy",
      text: "Which data structure operates on a Last In First Out (LIFO) basis?",
      options: JSON.stringify(["Queue", "Stack", "Linked List", "Binary Tree"]),
      correctAnswer: "Stack",
      explanation: "A Stack utilizes a LIFO access pattern where elements are pushed and popped from the same end."
    },
    {
      category: "Programming",
      topic: "C++ OOP",
      difficulty: "Easy",
      text: "In C++, which keyword is used to allocate memory on the heap?",
      options: JSON.stringify(["malloc", "new", "alloc", "virtual"]),
      correctAnswer: "new",
      explanation: "The 'new' operator dynamically allocates memory on the heap and returns a pointer to it."
    },
    {
      category: "Programming",
      topic: "DSA Analysis",
      difficulty: "Hard",
      text: "What is the worst-case time complexity of searching in a balanced Binary Search Tree (BST)?",
      options: JSON.stringify(["O(1)", "O(log n)", "O(n)", "O(n log n)"]),
      correctAnswer: "O(log n)",
      explanation: "A balanced BST halves the search space at each level, leading to logarithmic search complexity even in the worst case."
    },
    {
      category: "Programming",
      topic: "Python Structures",
      difficulty: "Easy",
      text: "Which of the following is NOT a primitive data type in Python?",
      options: JSON.stringify(["int", "float", "str", "list"]),
      correctAnswer: "list",
      explanation: "Lists in Python are dynamic, mutable arrays, which are object types rather than raw primitives."
    },
    {
      category: "Electronics",
      topic: "Circuit Prototyping",
      difficulty: "Medium",
      text: "What is the primary function of a pull-up resistor on a microcontroller input pin?",
      options: JSON.stringify([
        "To limit current entering the MCU",
        "To boost analog input voltage signals",
        "To ensure the pin reads a stable HIGH state when not driven LOW",
        "To discharge stray input capacitance"
      ]),
      correctAnswer: "To ensure the pin reads a stable HIGH state when not driven LOW",
      explanation: "Without a pull-up resistor, an unconnected input pin would float and produce unpredictable noise-based readings."
    },
    {
      category: "Electronics",
      topic: "Serial Protocols",
      difficulty: "Easy",
      text: "Which serial communication protocol uses only 2 wires (SDA and SCL)?",
      options: JSON.stringify(["SPI", "UART", "I2C", "CAN Bus"]),
      correctAnswer: "I2C",
      explanation: "I2C (Inter-Integrated Circuit) uses two bidirectional lines: Serial Data (SDA) and Serial Clock (SCL)."
    },
    {
      category: "Electronics",
      topic: "RTOS Firmware",
      difficulty: "Medium",
      text: "What does RTOS stand for in embedded firmware engineering?",
      options: JSON.stringify([
        "Random Task Operating Standard",
        "Real-Time Operating System",
        "Register Transfer Output State",
        "Read-Triggered Oscillator Source"
      ]),
      correctAnswer: "Real-Time Operating System",
      explanation: "RTOS is an operating system designed to run applications with precise timing constraints and task schedulers."
    },
    {
      category: "Electronics",
      topic: "ARM Microcontrollers",
      difficulty: "Hard",
      text: "In a STM32 ARM microcontroller, what is the default vector reset execution speed driven by?",
      options: JSON.stringify([
        "HSE (High-Speed External) Crystal",
        "LSE (Low-Speed External) Crystal",
        "HSI (High-Speed Internal) RC Oscillator",
        "PLL (Phase-Locked Loop) Multiplier"
      ]),
      correctAnswer: "HSI (High-Speed Internal) RC Oscillator",
      explanation: "Upon reset, STM32 chips boot using the HSI oscillator (usually 8MHz or 16MHz) before the firmware configures the external HSE crystal PLL."
    },
    {
      category: "Electronics",
      topic: "Components",
      difficulty: "Easy",
      text: "Which electronic component opposes sudden changes in electric current?",
      options: JSON.stringify(["Resistor", "Capacitor", "Inductor", "Diode"]),
      correctAnswer: "Inductor",
      explanation: "Inductors store energy in a magnetic field and oppose changes in current flow, obeying Lenz's law."
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
