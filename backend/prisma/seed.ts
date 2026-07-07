import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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
  },
  {
    id: "CADDED_Mech",
    title: "CADDED Software (Mechanical)",
    description: "Master AutoCAD, SolidWorks, CATIA, CNC Programming, and mechanical drafting systems.",
    modules: [
      "AutoCAD Mechanical Drafting & Design",
      "SolidWorks Parametric Part Modeling & Features",
      "CATIA Surface Design & Generative Shape Design",
      "CNC Code Architecture (G-Code & M-Code)",
      "Integrated Project Work & Assembly Drafting"
    ]
  },
  {
    id: "CADDED_Civil",
    title: "CADDED Software (Civil/Architecture)",
    description: "Master AutoCAD Civil, 3DS Max rendering, Google SketchUp, and Revit BIM systems.",
    modules: [
      "AutoCAD Civil Site Drafting & Residential Plans",
      "3ds Max Architectural Visualization & Texturing",
      "Google SketchUp Rapid 3D Prototyping & Layouts",
      "Autodesk Revit (Civil) Structural Detailing & Analysis",
      "Autodesk Revit (Architecture) BIM Modeling & Schedules"
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
    ],
    CADDED_Mech: [
      "AutoCAD interface", "SolidWorks extrusion", "CATIA surface loft", "CNC G-code milling",
      "assembly coincident mates", "dimension lines layers", "parametric reference planes", "sweep guide curves",
      "spindle rotation codes", "BOM balloon detailing", "degree of freedom", "stress distribution analysis"
    ],
    CADDED_Civil: [
      "AutoCAD wall offsets", "3ds Max textures V-Ray", "SketchUp push-pull face", "Revit concrete rebar",
      "Revit wall families", "drawing sheet viewports", "site alignment parcels", "Arnold camera lighting",
      "component groups layout", "beam structural grid", "window schedule columns", "clash detection reports"
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

function getCaddedStyleText(courseId: string, week: number, topicTitle: string, moduleTitle: string, note: string) {
  let overview = "";
  let detailsText = "";
  let hinglishText = "";
  let industryCase = "";

  if (topicTitle === "Learning Objectives") {
    overview = `By the end of this module on **${moduleTitle}**, you will establish a rigorous understanding of the underlying concepts, parameters, and architectures.`;
    detailsText = `### Key Milestones & Directives
1. **Core Concept Mastery**: Understand the design rules and execution patterns of ${moduleTitle} under varying production loads.
2. **Boundary Validation**: Learn to implement safety filters and diagnostic registers to catch out-of-bound errors.
3. **Execution Profiling**: Design and execute performance test benchmarks on simulated or physical setups.`;
    hinglishText = `Is topic me hum target guidelines aur learning goals set karenge. Module clear karne ke baad aap logic execution boundaries, direct registers configuration settings, aur safe development practices implementation seekh jayenge.`;
    industryCase = `**Safety-Critical Avionics and Automotive Systems**:\nIn professional systems, engineers define strict objectives before writing drivers to ensure that standard error counters are mapped to dedicated warning interrupts, preventing runtime crashes.`;
  } else if (topicTitle === "Detailed Notes") {
    overview = `This section details the theoretical foundations, memory mappings, and execution pipelines of **${moduleTitle}**.`;
    detailsText = `### Deep Technical Foundations
Relational tables, compiler structures, or hardware registers function as bounded entities in memory. When executing instructions in safety-critical modes:
- **Optimization**: Compiler optimizations shift variables into local registries to avoid stack frame latency.
- **Thread Safety**: Mutex locks and interrupt vectors prevent race conditions and priority inversion from stalling critical tasks.
- **Resource Constraints**: Dynamically allocated structures are avoided in real-time execution loops to guarantee static execution speeds.`;
    hinglishText = `Is deep theory section me hum low-level structures and data parsing constraints parameters ko deeply clear karenge. Variable limits aur structure layout checks memory bounds verify state manage functions dynamically execute safety standard guidelines.`;
    industryCase = `**Automotive ECU Register Lockdowns**:\nSafety-critical embedded controllers restrict memory layout write access. Any attempt to write registers without clock gating causes immediate hardware hard-faults.`;
  } else if (topicTitle === "Examples") {
    overview = `Here is a complete, verified application example demonstrating standard implementation patterns for **${moduleTitle}**.`;
    detailsText = `### Analysis of the Example
The code utilizes strict boundaries checks and validates pointers/values before executing the logic. Key segments:
- **Variable Bounds**: Assert checking ensures variables stay within limits.
- **Bitwise Masking**: Directly operates on memory locations for fast state transitions.
- **Exit Verification**: Return values are checked to catch unexpected execution sequences.`;
    hinglishText = `Yeh sample code runtime error handle parameters check loops implement configuration logic compile run outputs verify karne ke liye structure guidelines show karta hai. Custom debug functions variables inputs correctly map status report details prints.`;
    industryCase = `**Flight Control Telemetry Logs**:\nTelemetry loops write sensor data blocks to local circular queues. If a queue bounds check fails, the fallback system instantly recovers the state using secondary vectors.`;
  } else if (topicTitle === "Practical Exercises") {
    overview = `Perform these hands-on lab exercises to build confidence in **${moduleTitle}** systems development.`;
    detailsText = `### Step-by-Step Lab Guidelines
1. **Scenario 1**: Implement safe bounds checking logic that halts execution if values exceed standard ranges.
2. **Scenario 2**: Write a routine to test your logic under boundary conditions (e.g., maximum integer limits, empty data frames).
3. **Scenario 3**: Run the compiled binary/logic inside the sandbox environment and verify standard logs format.`;
    hinglishText = `Is lab task exercise me aapko safe register masking limits, loops validation conditions check logic, aur boundary variables error handling tasks code manually edit karke testing tools runtime check rules verify output output outputs report.`;
    industryCase = `**Greenhouse Automated Relay Timers**:\nPractical sensors checking humidity values must average readings over multiple cycles before triggering relays to avoid false relays switching from noise spikes.`;
  } else if (topicTitle === "Code Examples") {
    overview = `Below is the verified, production-grade code template representing standard configurations for **${moduleTitle}** operations in resource-constrained environments.`;
    detailsText = `### Code Configuration Attributes
- **Optimized Headers**: Includes only required components to reduce binary footprint.
- **Static Allocations**: Forces the compiler to layout buffers in the data segment.
- **Deterministic Paths**: Guarantees constant time execution bounds regardless of input values.`;
    hinglishText = `Yeh high quality code block compiler configuration standard limits layout details variables tracking options prints structure details verification tools correct behavior confirm instructions execution timing compile parameters.`;
    industryCase = `**Industrial Boiler Temperature Monitor Interrupts**:\nboilers monitoring sensor values write to peripheral registers directly. High priority interrupt registers NVIC bypass normal RTOS task priorities.`;
  } else { // Downloadable Resources
    overview = `Access laboratory documents, schematic guides, and cheat sheets for **${moduleTitle}** to aid in your manual experiments.`;
    detailsText = `### References & Documents List
- **Technical Specifications Manual (PDF)**: Details physical layout guidelines and standard protocols.
- **Hardware Reference Board Pinout (PDF)**: Guides direct pin mapping and electrical boundaries.
- **Complete Verification Source Code Package (ZIP)**: Code skeletons and reference outputs for self-checks.`;
    hinglishText = `Is section resources references sheets, PDF layouts guides download parameters check guidelines setup manual checks compile run environment set.`;
    industryCase = `**ISO-9001 Compliance Guidelines**:\nAerospace and medical devices require warning-free compilation profiles and fully documented references for audit trails.`;
  }

  return `# ${topicTitle} — ${moduleTitle}
  
## 1. Overview
${overview}

---

## 2. Technical Deep-Dive & Design Principles
${detailsText}

---

## 3. Hinglish Study Guide (सरल शब्दों में)
**Hinglish Explanations (आसान भाषा में):**
${hinglishText}

---

## 4. Real-World Industry Use Case
${industryCase}

---

## 5. Summary & Key Takeaways
- **Key Directive**: Always check system limits and memory bounds.
- **Safety Standard**: Adhere to standard ISO and MISRA-C conventions.
- **Verification Rule**: Test boundaries under simulated conditions before production load.

💡 **Core Takeaway (याद रखने योग्य बात):**
${note}
`;
}

function generateTopicQuizzes(courseId: string, week: number, topicTitle: string, topicOrder: number) {
  const questions = [];
  const subjects: Record<string, string[]> = {
    C: [
      "compilation flags", "register allocation", "pointer storage", "memory boundaries",
      "stack allocation", "heap fragmentation", "alignment attributes", "struct layout",
      "bitmasking registers", "linker mappings", "interrupt service", "volatile variables"
    ],
    "C++": [
      "RAII templates", "virtual tables", "copy elision", "inline namespace",
      "rvalue reference", "smart pointer life", "exception boundaries", "multiple inheritance",
      "operator overloading", "friend relationships", "template arguments", "const correctness"
    ],
    IoT: [
      "MQTT payload bounds", "TLS handshake size", "Deep sleep currents", "OTA integrity check",
      "ADC scaling values", "I2C clock stretching", "SPI transmission mode", "WiFi power modes",
      "RESTful HTTP latency", "JSON buffer limits", "Watchdog interrupt rules", "LoRa spreading factors"
    ],
    Embedded: [
      "FreeRTOS scheduling", "Priority inversion prevention", "Mutex deadlock rules", "ISR stack checks",
      "DMA burst lengths", "Hardware debouncers", "PLL frequency steps", "Memory-mapped I/O offsets",
      "Bootloader checksum", "Zero-copy configurations", "Context switch timing", "Critical sections"
    ],
    WebDesign: [
      "HTML5 semantic layouts", "Flexbox alignment properties", "DOM event capturing", "Viewport responsive rules",
      "CSS Grid areas", "Tailwind styling syntax", "Fetch API error handling", "JSON payload formatting",
      "Responsive navigation logic", "Session storage access", "CSS Transforms timing", "Local storage limits"
    ],
    Python: [
      "list comprehension loops", "try-except block scopes", "Pandas DataFrame grouping", "Matplotlib subplots",
      "file context managers", "dictionary comprehension", "multiple inheritance order", "variable scope lookups",
      "standard module imports", "pip virtual environment", "regex pattern matching", "CSV dialect parsing"
    ],
    SQL: [
      "SELECT join constraints", "FOREIGN KEY cascading", "Index scan types", "Aggregate having filters",
      "subquery execution order", "Transaction rollback state", "ACID consistency locks", "Normalization constraints",
      "Stored procedure parameters", "Materialized views update", "Grant privilege control", "Query optimizer nodes"
    ]
  };

  const currentSubjects = subjects[courseId] || ["general concepts"];
  const term = currentSubjects[(week + topicOrder) % currentSubjects.length];

  for (let q = 1; q <= 10; q++) {
    const qNum = q;
    let text = "";
    let options: string[] = [];
    
    if (topicOrder === 0) { // Objectives
      text = `Regarding the objectives of ${topicTitle} in Week ${week} of ${courseId}, what is the primary learning outcome for ${term}?`;
      options = [
        `Identify core parameters and configuration bounds of ${term} safely`,
        `Enable automatic background compilation for ${term}`,
        `Bypass hardware boundary checks during ${term} loops`,
        `Delete all temporary data directories associated with ${term}`
      ];
    } else if (topicOrder === 1) { // Detailed Notes (Theory)
      text = `In the theoretical notes for ${topicTitle}, how does the system register evaluate a failure state of ${term}?`;
      options = [
        `By checking the status register bitmask and returning a structured fault flag`,
        `By triggering a physical reset of the main motherboard supervisor line`,
        `By printing a standard text alert to the serial monitor without halting`,
        `By ignoring the signal and continuing execution at a reduced frequency`
      ];
    } else if (topicOrder === 2) { // Examples
      text = `Reviewing the code or layout example in ${topicTitle}, which statement accurately describes the handling of ${term}?`;
      options = [
        `Direct memory references are validated before dereferencing to prevent crashes`,
        `Variables are declared globally to allow rapid access across concurrent threads`,
        `Standard loop bounds are overridden using compiler compiler optimization attributes`,
        `Execution logs are written directly to flash storage sector 0`
      ];
    } else if (topicOrder === 3) { // Practical Exercises
      text = `For the practical exercises in ${topicTitle}, what debugging strategy is recommended to resolve conflicts in ${term}?`;
      options = [
        `Configure a logic analyzer to trace signal transitions and check voltage thresholds`,
        `Double the system clock frequency to see if the timing race condition resolves`,
        `Comment out the boundary validation code to allow high-throughput packets`,
        `Reinstall the IDE and drivers to reset internal compiler environment parameters`
      ];
    } else if (topicOrder === 4) { // Code Examples
      text = `Analyzing the production template in ${topicTitle}, what is the main purpose of volatile masking for ${term}?`;
      options = [
        `Forces the compiler to reload the registers from physical memory on every check`,
        `Allows the optimizer to completely inline the peripheral driver functions`,
        `Encrypts the variables in RAM to protect against remote buffer exploits`,
        `Allocates variables on the stack instead of using global heap memory`
      ];
    } else { // Resources & References
      text = `According to the industry references listed in ${topicTitle}, which standard governs the deployment constraints of ${term}?`;
      options = [
        `The standard ISO and MISRA safety-critical development guidelines`,
        `The open-source community layout template for public testing`,
        `The default legacy vendor documentation for prototype boards`,
        `The standard generic API mapping for testing purposes`
      ];
    }

    const rotate = (qNum * week + topicOrder) % 4;
    for (let i = 0; i < rotate; i++) options.push(options.shift()!);
    const correctAnswer = options[(4 - rotate) % 4];

    text = `[Q${qNum}] ${text} (Focus: ${term} behavior under load)`;
    
    questions.push({
      text,
      options,
      correctAnswer
    });
  }

  return questions;
}

function getDynamicTopicsForModule(courseId: string, week: number, moduleTitle: string) {
  if (courseId === 'CADDED_Mech' || courseId === 'CADDED_Civil') {
    try {
      const filePath = path.join(__dirname, 'cadded_curriculum.json');
      if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const curriculum = JSON.parse(rawData);
        const courseData = curriculum[courseId];
        if (courseData && courseData[week.toString()]) {
          return courseData[week.toString()];
        }
      }
    } catch (err) {
      console.error(`Error loading custom CADDED curriculum from JSON:`, err);
    }
  }

  const topics = [
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

  if (courseId !== 'CADDED_Mech' && courseId !== 'CADDED_Civil') {
    for (let i = 0; i < topics.length; i++) {
      topics[i].text = getCaddedStyleText(courseId, week, topics[i].title, moduleTitle, topics[i].note);
    }
  }

  if (courseId === "IoT") {
    if (week === 1) {
      topics[1].text = `### IoT Microcontroller Baselines: ESP32 Architecture\nESP32 is a dual-core microcontroller featuring built-in Wi-Fi and Bluetooth. It has two Tensilica Xtensa 32-bit LX6 microprocessors (PRO_CPU and APP_CPU) that execute task instructions in parallel.\n\n**Hinglish Notes (सरल भाषा में):**\nESP32 dual-core microcontroller ke basic architecture ko samjhein. Isme do processing cores (PRO_CPU and APP_CPU) hote hain jo parallel execution support karte hain. Code write karne ke liye Arduino IDE ya VS Code platformio use kiya jata hai.\n\n**Real-World Industry Case:**\nSmart weather monitoring system: One core handles sensor readings while the other maintains the Wi-Fi connection and publishes updates to a remote dashboard.`;
      topics[3].text = `### Lab Task: ESP32 LED Blink & Serial Output\nWrite a basic script to initialize the built-in LED and toggle it periodically, while logging execution state to the serial port.\n\n**Wokwi Simulator (बिना हार्डवेयर सीखें):**\nNo physical ESP32 board? Simulate it online here:\n- [Interactive Wokwi ESP32 Blinking LED](https://wokwi.com/projects/arduino-esp32-blink)\n\n**Hinglish Lab Instructions:**\n1. Built-in Blue LED (GPIO 2) ko output mode me initialize karein.\n2. Pin state toggle karein and verify loops cycle.`;
      topics[3].code = `// ESP32 Basic Blinking LED\n#define LED_PIN 2\n\nvoid setup() {\n    pinMode(LED_PIN, OUTPUT);\n    Serial.begin(115200);\n}\n\nvoid loop() {\n    digitalWrite(LED_PIN, HIGH);\n    delay(500);\n    digitalWrite(LED_PIN, LOW);\n    delay(500);\n    Serial.println("ESP32 core active and blinking!");\n}`;
      topics[3].note = "Always match Serial monitor baud rate with Serial.begin value.";
    } else if (week === 2) {
      topics[1].text = `### Sensors & Analog-to-Digital Conversion (ADC)\nSensors output continuous analog voltages. ESP32 incorporates 12-bit ADCs that convert analog voltages (0V to 3.3V) into digital numbers (0 to 4095).\n\n**Hinglish Notes (सरल भाषा में):**\nAnalog to Digital Converter (ADC) physical voltage (0V to 3.3V) ko numerical digits (0 to 4095) me translate karta hai. Analog signals noise filter karne ke liye average readings ya Kalman filter variables use kiye jate hain.\n\n**Real-World Industry Case:**\nIndustrial gas leakage checker with buzzer alert system. Sensors map current voltage levels to gas concentration in PPM.`;
      topics[3].text = `### Lab Task: LDR Light Sensor Interface\nInterface a Light Dependent Resistor (LDR) sensor on ADC Pin 34 and turn on the LED if light levels fall below a threshold.\n\n**Wokwi Simulator (बिना हार्डवेयर सीखें):**\nTest it online here:\n- [Wokwi ESP32 Analog LDR Setup](https://wokwi.com/projects/322589088657637970)\n\n**Hinglish Lab Instructions:**\n1. ADC Pin 34 input initialize karein.\n2. Volts measure karke LED status controls set karein.`;
      topics[3].code = `// ESP32 Interfacing with LDR\n#define LDR_PIN 34\n#define LED_PIN 2\n\nvoid setup() {\n    pinMode(LED_PIN, OUTPUT);\n    Serial.begin(115200);\n}\n\nvoid loop() {\n    int ldrVal = analogRead(LDR_PIN);\n    Serial.printf("Analog Value: %d\\n", ldrVal);\n    if (ldrVal > 2500) { // Dark threshold\n        digitalWrite(LED_PIN, HIGH);\n    } else {\n        digitalWrite(LED_PIN, LOW);\n    }\n    delay(500);\n}`;
      topics[3].note = "12-bit ADC gives a maximum resolution value of 4095.";
    } else if (week === 3) {
      topics[1].text = `### Serial Communication Protocols: I2C, SPI, UART\nMicrocontrollers communicate with external chips using standardized serial protocols. I2C uses 2 wires (SDA/SCL), SPI uses 4 wires (MOSI/MISO/SCK/CS), and UART uses Tx/Rx.\n\n**Hinglish Notes (सरल भाषा में):**\nI2C protocol me only 2 wires (SDA aur SCL) use hote hain multi-device communication ke liye, jabki SPI me 4 wires (MISO, MOSI, SCK, CS) use hote hain high speed data transfers ke liye. UART asynchronous point-to-point communication hai.\n\n**Real-World Industry Case:**\nInterfacing a high-resolution OLED screen (I2C) and external SD card logger (SPI) to record temperature telemetry in real time.`;
      topics[3].text = `### Lab Task: OLED Display Interfacing via I2C\nConfigure the Wire library to display custom strings on an I2C-connected SSD1306 OLED screen.\n\n**Wokwi Simulator (बिना हार्डवेयर सीखें):**\nSimulate it here:\n- [Wokwi OLED I2C Simulation](https://wokwi.com/projects/305566932822458898)\n\n**Hinglish Lab Instructions:**\n1. SSD1306 display drivers configure karein.\n2. screen updates coordinate karke values prints layout karein.`;
      topics[3].code = `// I2C OLED display initialization\n#include <Wire.h>\n#include <Adafruit_GFX.h>\n#include <Adafruit_SSD1306.h>\n#define SCREEN_WIDTH 128\n#define SCREEN_HEIGHT 64\nAdafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);\n\nvoid setup() {\n    Serial.begin(115200);\n    if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {\n        Serial.println("SSD1306 allocation failed");\n        for(;;);\n    }\n    display.clearDisplay();\n    display.setTextSize(1);\n    display.setTextColor(WHITE);\n    display.setCursor(0, 10);\n    display.println("I2C OLED ACTIVE!");\n    display.display();\n}\nvoid loop() {}`;
      topics[3].note = "Standard I2C address for SSD1306 display is 0x3C.";
    } else if (week === 4) {
      topics[1].text = `### Wireless Connectivity: Web Servers on ESP32\nESP32 can launch a Wi-Fi Access Point (AP) or connect to a local network to serve web pages to client devices.\n\n**Hinglish Notes (सरल भाषा में):**\nESP32 Wi-Fi module local router ya AP se connect hokar network packets exchange karta hai. Local web server write karke client browser commands (LED turn ON/OFF) ko process kiya jata hai.\n\n**Real-World Industry Case:**\nWiFi Remote Relay Controller in agricultural greenhouses to adjust irrigation pumps via local networks.`;
      topics[3].text = `### Lab Task: Remote Relay Control Web Server\nSet up a local web server to toggle output pins when requested via URL endpoints.\n\n**Wokwi Simulator (बिना हार्डवेयर सीखें):**\nSimulate it here:\n- [Wokwi ESP32 Web Server](https://wokwi.com/projects/307409279769346578)\n\n**Hinglish Lab Instructions:**\n1. Router SSID config set karein.\n2. Server port client requests listen hook implement karein.`;
      topics[3].code = `// Simple Wi-Fi Server\n#include <WiFi.h>\nconst char* ssid = "Wokwi-GUEST";\nconst char* password = "";\nWiFiServer server(80);\n\nvoid setup() {\n    Serial.begin(115200);\n    WiFi.begin(ssid, password);\n    while (WiFi.status() != WL_CONNECTED) { delay(500); }\n    server.begin();\n    Serial.println(WiFi.localIP());\n}\nvoid loop() {\n    WiFiClient client = server.available();\n    if (client) {\n        client.println("HTTP/1.1 200 OK\\nContent-type:text/html\\n");\n        client.println("<h1>ESP32 Remote Controller</h1>");\n        client.stop();\n    }\n}`;
      topics[3].note = "Connect your laptop browser to the displayed local IP address.";
    } else if (week === 5) {
      topics[1].text = `### MQTT & Cloud Integrations: Telemetry System\nMQTT (Message Queuing Telemetry Transport) is a lightweight publish-subscribe protocol design for resource-constrained network clients.\n\n**Hinglish Notes (सरल भाषा में):**\nMQTT publish-subscribe model par work karta hai. Clients broker (jaise HiveMQ ya Adafruit IO) se connect hote hain. Sensor measurements discrete topics par publish hoti hain, aur controls subscribe parameters se pull hoti hain.\n\n**Real-World Industry Case:**\nIoT Agriculture Soil Moisture cloud logger system that transmits values to remote dashboards.`;
      topics[3].text = `### Lab Task: Publish Data to HiveMQ Broker\nWrite an MQTT client task that connects to a public broker and publishes sample data telemetry to a topic.\n\n**Wokwi Simulator (बिना हार्डवेयर सीखें):**\nSimulate MQTT client live here:\n- [Wokwi ESP32 MQTT Client](https://wokwi.com/projects/321528659103646290)\n\n**Hinglish Lab Instructions:**\n1. MQTT client initialize config parameters set karein.\n2. Broker connections loop keep-alive maintain configure check.`;
      topics[3].code = `// Simulated MQTT publisher\n#include <WiFi.h>\n#include <PubSubClient.h>\nWiFiClient espClient;\nPubSubClient client(espClient);\n\nvoid setup() {\n    Serial.begin(115200);\n    client.setServer("broker.hivemq.com", 1883);\n}\nvoid loop() {\n    if (!client.connected()) {\n        client.connect("ESP32_Client_Demo");\n    }\n    client.publish("home/sensors/temp", "24.5 C");\n    delay(5000);\n}`;
      topics[3].note = "Port 1883 is the standard port for unencrypted MQTT traffic.";
    } else {
      topics[1].text = `### IoT Interfacing & Smart Protocols for **${moduleTitle}**\nConnecting hardware nodes to cloud brokers requires stable network configurations, low-power interrupts, and robust JSON serializations. We utilize MQTT publish-subscribe messaging over TCP/IP ports to transmit sensor data reliably.\n\n**Hinglish Hardware Explanation (सरल भाषा में):**\nInternet of Things (IoT) me sensors ka data physical device (jaise ESP32) se remote server tak transmission ke liye protocols (jaise MQTT ya HTTP) use hote hain. Physical boards local variables ko electrical signals me convert karte hain, aur Wi-Fi module ke throw hum broker par telemetry push karte hain.\n\n**Real-World Industry Case:**\nSmart Home Automation: Light levels control sensors publish parameters dynamically to dashboard feeds. If ambient light changes, status registers update instantly.`;
      topics[3].text = `### Lab Task: ESP32 Telemetry & LED Toggles\nImplement an automated light monitor using an LDR sensor connected to ESP32 Analog Input Pin 34, publishing state shifts via Wi-Fi.\n\n**Wokwi Simulator (बिना हार्डवेयर सीखें):**\nNo physical ESP32 board? Run the simulation online on Wokwi simulator:\n- [Interactive Wokwi ESP32 LED/LDR Board Setup](https://wokwi.com/projects/arduino-esp32-blink)\n\n**Hinglish Lab Instructions:**\n1. ADC Pin 34 use karke variable voltage read karein.\n2. Agar value threshold (jaise 2000) se drop ho, to GPIO Pin 2 (Built-in LED) ko HIGH karein.\n3. Wokwi link par ja kar code simulate karein aur telemetry observe karein.`;
      topics[3].code = `// ESP32 Interfacing with LDR & LED Simulation\n#define LDR_PIN 34\n#define LED_PIN 2\n\nvoid setup() {\n    pinMode(LED_PIN, OUTPUT);\n    Serial.begin(115200);\n}\n\nvoid loop() {\n    int ldrValue = analogRead(LDR_PIN);\n    Serial.print("LDR Intensity: ");\n    Serial.println(ldrValue);\n    if (ldrValue < 2000) {\n        digitalWrite(LED_PIN, HIGH); // Turn LED on\n    } else {\n        digitalWrite(LED_PIN, LOW); // Turn LED off\n    }\n    delay(1000);\n}`;
      topics[3].note = "Always call Serial.begin() before printing to verify execution frequencies on external UART consoles.";
    }
  } else if (courseId === "Embedded") {
    if (week === 1) {
      topics[1].text = `### Bare-Metal Boot Sequences & Flash Layouts\nMicrocontrollers start running code by loading the Stack Pointer (SP) and jump directly to the Reset Vector handler configured in the Linker memory region.\n\n**Hinglish Notes (सरल भाषा में):**\nMicrocontroller boot hone par Reset Handler execute hota hai. Linker script stack pointer start (.stack), initialization vectors, variables segment (.data), aur constant values (.rodata) ko flash memory layout me link karta hai.\n\n**Real-World Industry Case:**\nCustom bootloaders for automotive ECU flash updates over CAN bus. Safety vectors verify checksum before launching app.`;
      topics[3].text = `### Lab Task: Defining Linker Script Regions\nDesign a simple linker script specifying memory flash and SRAM regions for a Cortex-M4 microcontroller.\n\n**Tinkercad Circuits Online Simulator:**\nSimulate microcontroller circuits online:\n- [Tinkercad Circuits Simulator](https://www.tinkercad.com/circuits)\n\n**Hinglish Lab Instructions:**\n1. FLASH bounds size set bounds specify parameters config registers.`;
      topics[3].code = `/* Linker Script Regions */\nMEMORY {\n    FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 512K\n    SRAM (rwx) : ORIGIN = 0x20000000, LENGTH = 128K\n}`;
      topics[3].note = "Linker files map input object sections (.text, .data, .bss) to targeted memory spaces.";
    } else if (week === 2) {
      topics[1].text = `### Register-Level Direct Peripheral Drive\nInstead of abstract functions (HALs), developers read/write directly to Memory-Mapped Input/Output (MMIO) registers to configure digital pins.\n\n**Hinglish Notes (सरल भाषा में):**\nGPIO pin parameters modify karne ke liye configuration registers ke bits ko mask and shift kiya jata hai. Clock gating (RCC register) enable karna mandatory hai taaki CPU peripheral hardware controller state toggle karein.\n\n**Real-World Industry Case:**\nDirect register level motor driver interface to toggle output states at megahertz frequencies without software delay overhead.`;
      topics[3].text = `### Lab Task: Bare-metal Registers Toggle\nWrite a bare-metal script to set pins as output and toggle them using direct port register directives DDR and PORT.\n\n**Tinkercad Circuits Online Simulator:**\nSimulate AVR register blinks here:\n- [Tinkercad Arduino Registers Blink](https://www.tinkercad.com/things/5uRpyP2pCPl)\n\n**Hinglish Lab Instructions:**\n1. DDRB output direction configure code set karein.\n2. PORTB bits mask logic shift test run execute.`;
      topics[3].code = `// Bare-metal AVR registers LED toggle\n#include <avr/io.h>\n#include <util/delay.h>\n\nint main() {\n    DDRB |= (1 << PB5); // PB5 (Digital 13) Output\n    while(1) {\n        PORTB |= (1 << PB5);  // High\n        _delay_ms(500);\n        PORTB &= ~(1 << PB5); // Low\n        _delay_ms(500);\n    }\n}`;
      topics[3].note = "DDRB stands for Data Direction Register Port B.";
    } else if (week === 3) {
      topics[1].text = `### Interrupt Service Routines (ISRs) & NVIC Priorities\nNested Vectored Interrupt Controller (NVIC) prioritizes incoming hardware interrupts (like external pin shifts or timer thresholds) for real-time responsiveness.\n\n**Hinglish Notes (सरल भाषा में):**\nInterrupt trigger hone par hardware normal code execution stop karke ISR vector block par transition karta hai. Variables state capture ke liye compile time registers lock bypass volatile keywords call karna primary criteria hai.\n\n**Real-World Industry Case:**\nIndustrial emergency boiler shutdown interrupts. Exceeding limit temperatures triggers high priority ISR which closes main fuel valve instantly.`;
      topics[3].text = `### Lab Task: External Interrupt INT0 Setup\nWrite a bare-metal C routine to toggle output state immediately when button triggers INT0 interrupt on falling edge.\n\n**Tinkercad Circuits Online Simulator:**\nSimulate interrupts online:\n- [Tinkercad External Interrupt](https://www.tinkercad.com/things/h7aZfRylrO6)\n\n**Hinglish Lab Instructions:**\n1. Enable external interrupts registers INT0.\n2. Configure ISR macro block.`;
      topics[3].code = `// INT0 Interrupt Service Routine\n#include <avr/io.h>\n#include <avr/interrupt.h>\n\nvoid init_interrupt() {\n    DDRB |= (1 << PB5); // LED Output\n    PORTD |= (1 << PD2); // Pull-up Pin 2\n    EICRA |= (1 << ISC01); // Falling edge\n    EIMSK |= (1 << INT0); // Enable INT0\n    sei(); // Global interrupts\n}\nISR(INT0_vect) {\n    PORTB ^= (1 << PB5); // Toggle LED\n}`;
      topics[3].note = "sei() executes asm command enabling interrupt registers flag.";
    } else if (week === 4) {
      topics[1].text = `### Timers & Pulse Width Modulation (PWM)\nMicrocontroller timers operate independently of main CPU instruction pipelines to measure intervals or generate variable duty-cycle square waves (PWM).\n\n**Hinglish Notes (सरल भाषा में):**\nHardware timers clock cycles count karte hain completely independent of CPU logic. PWM (Pulse Width Modulation) duty cycle configure karke variable voltage (jaise motor speed control ya LED dimming) output compile kiya jata hai.\n\n**Real-World Industry Case:**\nPrecision robotic joint servo controllers that translate duty cycles to angular position.`;
      topics[3].text = `### Lab Task: Fast PWM Duty Cycle Control\nInitialize Timer 1 in Fast PWM mode to control output duty cycle parameters via comparison register.\n\n**Tinkercad Circuits Online Simulator:**\nSimulate PWM control online:\n- [Tinkercad Arduino PWM Control](https://www.tinkercad.com/things/5F2o3m3D6Kx)\n\n**Hinglish Lab Instructions:**\n1. Fast PWM mode configuration registers write check.\n2. OCR1A values scale set speed changes map.`;
      topics[3].code = `// AVR Timer1 Fast PWM\n#include <avr/io.h>\n\nvoid setup_pwm() {\n    DDRB |= (1 << PB1); // OC1A as output\n    TCCR1A |= (1 << COM1A1) | (1 << WGM11); // Fast PWM 10-bit\n    TCCR1B |= (1 << WGM12) | (1 << CS11);  // Prescaler 8\n    OCR1A = 512; // 50% Duty cycle\n}`;
      topics[3].note = "Timer OCR values determine the threshold width duty cycles.";
    } else if (week === 5) {
      topics[1].text = `### Real-Time Operating Systems (FreeRTOS) & Multitasking\nFreeRTOS allows executing multiple independent software loops (tasks) on a single CPU core using pre-emptive context-switching scheduling.\n\n**Hinglish Notes (सरल भाषा में):**\nFreeRTOS Scheduler context switching configure karta hai. Tasks pre-emptive scheduling se control rules follow karte hain. Threads safe communications ke liye semaphores aur thread queues use kiye jate hain.\n\n**Real-World Industry Case:**\nFlight navigation compute tasks running alongside telemetry reporting buffers. Mutexes prevent logging tasks from corrupting active coordinates databases.`;
      topics[3].text = `### Lab Task: Multitasking with FreeRTOS Tasks\nCreate two distinct preemptive tasks to toggle separate pins at different frequencies.\n\n**Wokwi Simulator (बिना हार्डवेयर सीखें):**\nSimulate FreeRTOS online on Wokwi:\n- [Wokwi ESP32 FreeRTOS Setup](https://wokwi.com/projects/305886616428773954)\n\n**Hinglish Lab Instructions:**\n1. Setup Arduino FreeRTOS header references.\n2. Create two scheduler tasks with customized delay intervals.`;
      topics[3].code = `// FreeRTOS Task Creation\n#include <Arduino_FreeRTOS.h>\nvoid Task1(void *p);\nvoid Task2(void *p);\n\nvoid setup() {\n    Serial.begin(9600);\n    xTaskCreate(Task1, "BlinkPin", 128, NULL, 1, NULL);\n    xTaskCreate(Task2, "PrintLog", 128, NULL, 1, NULL);\n}\nvoid loop() {}\nvoid Task1(void *p) {\n    pinMode(13, OUTPUT);\n    for(;;) {\n        digitalWrite(13, HIGH); vTaskDelay(500 / portTICK_PERIOD_MS);\n        digitalWrite(13, LOW);  vTaskDelay(500 / portTICK_PERIOD_MS);\n    }\n}\nvoid Task2(void *p) {\n    for(;;) {\n        Serial.println("Task2 Running...");\n        vTaskDelay(1000 / portTICK_PERIOD_MS);\n    }\n}`;
      topics[3].note = "vTaskDelay yields processing execution slots to lower priority threads.";
    } else {
      topics[1].text = `### Microcontrollers & RTOS Core for **${moduleTitle}**\nBare-metal microcontroller registers require careful mapping of CPU ticks. In pre-emptive multitasking, scheduling tasks use semaphores and mutexes to share resource control safely.\n\n**Hinglish Systems Explanation (सरल भाषा में):**\nEmbedded Systems me registers direct microcontroller pins ke functional parameters (input/output/clock) ko change karte hain. Jab system multiple calculations parallelly chalata hai tab memory corruption aur priority inversion se bachne ke liye FreeRTOS queues aur critical sections optimize kiye jate hain.\n\n**Real-World Industry Case:**\nIndustrial Telemetry & Alerting: High-precision thermal sensors monitor industrial boilers. If heat spikes, interrupt routines stop boilers instantly, bypassing task priorities.`;
      topics[3].text = `### Lab Task: Interrupt Service Routine & GPIO Masking\nWrite a bare-metal C script that registers a hardware interrupt on GPIO Pin 12 (push-button) to toggle Pin 13 (alarm buzzer) instantly.\n\n**Tinkercad Simulator Link (बिना हार्डवेयर सीखें):**\nNo physical microcontrollers? Test online on Tinkercad:\n- [Tinkercad Circuits Online Simulator](https://www.tinkercad.com/circuits)\n\n**Hinglish Lab Instructions:**\n1. GPIO Pin 12 input settings ko input pull-up configurations registers me check karein.\n2. Fall edge trigger configurations (interrupt register) toggle karein.\n3. Tinkercad setup open karke external interrupts wire karein.`;
      topics[3].code = `// Bare-metal AVR Interrupt Configuration\n#include <avr/io.h>\n#include <avr/interrupt.h>\n\nvoid init_hardware() {\n    DDRB |= (1 << PB5); // Configure Pin 13 (PB5) as Output\n    PORTD |= (1 << PD2); // Enable Pull-up resistor on Pin 2 (PD2)\n    EICRA |= (1 << ISC01); // Trigger INT0 on Falling Edge\n    EIMSK |= (1 << INT0); // Enable external interrupt INT0\n    sei(); // Enable global interrupts\n}\n\nISR(INT0_vect) {\n    PORTB ^= (1 << PB5); // Toggle Alarm Buzzer\n}`;
      topics[3].note = "Using volatile variables inside ISR blocks prevents compilers from optimizing out variable state changes.";
    }
  } else if (courseId === "C") {
    if (week === 1) {
      topics[1].text = `### C Compiler & Program Structure\nEvery C program goes through a multi-stage compilation process: preprocessing, compilation, assembly, and linking. The entry point is the \`main\` function.\n\n**Hinglish Notes (सरल भाषा में):**\nC programming compiler basic setup compile-time rules follow karta hai. Source code sequence link output processor executable format me translate hota hai. Coding standard main execution flow start standard parameters return variable integers checks set.\n\n**Real-World Industry Case:**\nEmbedded boot firmware start routines that load application code execution vectors directly from standard sectors.`;
      topics[3].text = `### Lab Task: Simple C Compilation & Execution\nCreate a basic hello world code, check main functions argument parameters, compile using gcc compiler.\n\n**Wokwi C Sandbox (ऑनलाइन अभ्यास):**\nSimulate C code online directly:\n- [Wokwi Online C Playground](https://wokwi.com/projects/new/c)\n\n**Hinglish Lab Instructions:**\n1. standard IO library refer template load check.\n2. main return values integers define.`;
      topics[3].code = `#include <stdio.h>\n\nint main() {\n    printf("Standard C Program Loaded!\\n");\n    return 0;\n}`;
      topics[3].note = "Return 0 denotes success execution status parameters.";
    } else if (week === 2) {
      topics[1].text = `### Memory Mapping & Bare-Metal Hardware Interaction\nC allows direct manipulation of hardware addresses. Pointers map directly to virtual or physical memory addresses without abstraction overhead.\n\n**Hinglish Notes (सरल भाषा में):**\nC programming pointers variable configurations raw memory bytes coordinates load rules support karte hain. Registers speed efficiency direct addresses manipulation speed rules compile options optimizations direct output mapping.\n\n**Real-World Industry Case:**\nAutomotive transmission controller modules checking heat levels directly on hardware temperature maps.`;
      topics[3].text = `### Lab Task: Read Direct Memory Registers simulation\nMap variables to simulated memory space boundaries, trace values access logic.\n\n**Wokwi C Sandbox (ऑनलाइन अभ्यास):**\nSimulate pointer actions online:\n- [Wokwi Online C Playground](https://wokwi.com/projects/new/c)\n\n**Hinglish Lab Instructions:**\n1. Pointer references address output check.\n2. dereferencing variables update operations.`;
      topics[3].code = `#include <stdio.h>\n#include <stdint.h>\n\nint main() {\n    uint32_t simulated_reg = 0x55;\n    volatile uint32_t* reg_ptr = &simulated_reg;\n    printf("Simulated Register initial value: 0x%X\\n", *reg_ptr);\n    *reg_ptr = 0xAA;\n    printf("Simulated Register updated value: 0x%X\\n", *reg_ptr);\n    return 0;\n}`;
      topics[3].note = "Volatile variables prevent optimization changes out parameters.";
    } else if (week === 3) {
      topics[1].text = `### Build System: GCC Flags & Compiling Options\nFor production quality codes, compiling with flags like \`-Wall\`, \`-Wextra\`, and \`-O3\` ensures safety checks and speed optimizations.\n\n**Hinglish Notes (सरल भाषा में):**\nGCC compilation build options specify warning levels standard checks. Warning reports fix dynamic safety runtime crashes prevent variables config layout verification.\n\n**Real-World Industry Case:**\nAerospace flight controls require 100% warning-free compilation profiles for critical flight modules.`;
      topics[3].text = `### Lab Task: Verify Warning Options Compilation\nBuild configurations check variable unused warnings logic.\n\n**Wokwi C Sandbox (ऑनलाइन अभ्यास):**\nSimulate compiler warning checks:\n- [Wokwi Online C Playground](https://wokwi.com/projects/new/c)\n\n**Hinglish Lab Instructions:**\n1. Unused local variables declarations compile checks.\n2. Fix warnings to achieve success compile parameters.`;
      topics[3].code = `#include <stdio.h>\n\nint main() {\n    int unused_val = 10; // Warning test variable\n    printf("Compiling warnings profile test\\n");\n    return 0;\n}`;
      topics[3].note = "Always fix compile-time warnings before building binary release files.";
    } else if (week === 4) {
      topics[1].text = `### Core Datatypes Boundaries & Overflow Handling\nComputer registers store fixed widths. Exceeding limits of signed or unsigned variables causes unexpected wrap-arounds (overflows).\n\n**Hinglish Notes (सरल भाषा में):**\nVariables storage size ranges (char, int, float) fixed boundary limits follow karte hain. Upper range bounds cross limits wrap around variables crash output parameters logic checks.\n\n**Real-World Industry Case:**\nAriane 5 rocket launch crash happened due to 64-bit float variable overflow conversion errors.`;
      topics[3].text = `### Lab Task: Unsigned Boundary Limit Overflows\nObserve standard variable values wrap around constraints checks.\n\n**Wokwi C Sandbox (ऑनलाइन अभ्यास):**\nSimulate variable limit overflows:\n- [Wokwi Online C Playground](https://wokwi.com/projects/new/c)\n\n**Hinglish Lab Instructions:**\n1. Unsigned integer max value set loop increment check.\n2. Observe values wrap around zeros.`;
      topics[3].code = `#include <stdio.h>\n#include <limits.h>\n\nint main() {\n    unsigned int val = UINT_MAX;\n    printf("Max Unsigned Value: %u\\n", val);\n    val = val + 1;\n    printf("Overflowed Value: %u\\n", val);\n    return 0;\n}`;
      topics[3].note = "Verify data sizes constraints to select appropriate integers widths.";
    } else if (week === 5) {
      topics[1].text = `### Bitwise Arithmetic & Register Masking\nEmbedded developers perform bitwise OR, AND, and XOR operations to change state flags of individual hardware processor control bits.\n\n**Hinglish Notes (सरल भाषा में):**\nRegister configuration changes single bit states change logic parameters. Bit shift operators masks define variables specific settings set compile check values.\n\n**Real-World Industry Case:**\nTelecommunication routing cards packing 8 separate port connection check flags inside single byte arrays.`;
      topics[3].text = `### Lab Task: Bitwise Flag Manipulation\nImplement set, clear, and toggle macros to manipulate specific bits inside a byte state.\n\n**Wokwi C Sandbox (ऑनलाइन अभ्यास):**\nPractice bitwise operations here:\n- [Wokwi Online C Playground](https://wokwi.com/projects/new/c)\n\n**Hinglish Lab Instructions:**\n1. Define macros for bit set configurations checks.\n2. Verify state outputs parameters.`;
      topics[3].code = `#include <stdio.h>\n#define SET_BIT(reg, bit) (reg |= (1 << bit))\n#define CLEAR_BIT(reg, bit) (reg &= ~(1 << bit))\n\nint main() {\n    unsigned char test_reg = 0b00000000;\n    SET_BIT(test_reg, 3);\n    printf("Reg after setting bit 3: 0x%X\\n", test_reg);\n    CLEAR_BIT(test_reg, 3);\n    printf("Reg after clearing bit 3: 0x%X\\n", test_reg);\n    return 0;\n}`;
      topics[3].note = "Using shifts simplifies direct hardware register flag settings.";
    } else {
      topics[1].text = `### Low-Level Memory & Compilation for **${moduleTitle}**\nMastering C programming requires understanding pointers, heap allocations, and binary bitwise registers manipulation.\n\n**Hinglish Explanation (आसान शब्दों में):**\nC programming me **Pointers** physical memory address storage arrays ki tarah hote hain. Compilers variable levels ko processor CPU registers me change kar dete hain speed improve karne ke liye. memory leak se bachne ke liye standard malloc references ko verify aur delete kiya jata hai.`;
      topics[3].text = `### Lab Task: Memory Mapping & Direct Pointer Manipulation\nCreate an array of integers and access it using pointer arithmetic. Implement direct memory masking to modify a virtual hardware register byte.\n\n**Wokwi C Sandbox (ऑनलाइन अभ्यास):**\nPractice writing C online without installing compilers:\n- [Wokwi Online C Playground](https://wokwi.com/projects/new/c)\n\n**Hinglish Lab Instructions:**\n1. Integer array elements ko simple pointers offset index variables increment karke access karein.\n2. Volatile pointers reference se register simulation coordinates edit karein.`;
      topics[3].code = `// Pointer Arithmetic & Virtual Register Masking\n#include <stdio.h>\n#include <stdint.h>\n\nint main() {\n    uint32_t virtual_reg = 0x00000000;\n    volatile uint32_t* reg_ptr = &virtual_reg;\n    \n    // Enable bit 3 and bit 7\n    *reg_ptr |= (1 << 3) | (1 << 7);\n    \n    printf("Virtual Register State: 0x%08X\\n", *reg_ptr);\n    return 0;\n}`;
      topics[3].note = "Compile-time safety requires specifying pointer variables with correct data types to restrict memory boundary leaks.";
    }
  } else if (courseId === "C++") {
    if (week === 1) {
      topics[1].text = `### C++ Evolution & Standard Namespaces\nC++ adds object-oriented paradigms, generic templates, and stricter type checking over C. The standard namespace \`std\` isolates standard libraries.\n\n**Hinglish Notes (सरल भाषा में):**\nC++ standard template namespaces organization standard functions scope resolution check simple output prints compile options. \`std::cout\` streams dynamically handle data output.\n\n**Real-World Industry Case:**\nModern avionics dashboards that map real-time flight vectors using C++ objects.`;
      topics[3].text = `### Lab Task: Custom Namespace Initialization\nWrite a C++ template defining unique scopes using namespace keywords.\n\n**Wokwi C++ Playground (ऑनलाइन अभ्यास):**\nPractice writing C++ code online:\n- [Wokwi Online C++ Playground](https://wokwi.com/projects/new/cpp)\n\n**Hinglish Lab Instructions:**\n1. Define custom namespace scope boundaries.\n2. Print variables using scope resolution.`;
      topics[3].code = `#include <iostream>\nnamespace CustomUnit {\n    int unitID = 101;\n}\nint main() {\n    std::cout << "Unit ID: " << CustomUnit::unitID << std::endl;\n    return 0;\n}`;
      topics[3].note = "Namespaces help prevent variable naming conflicts in large projects.";
    } else if (week === 2) {
      topics[1].text = `### OOP Core: Encapsulation & Resource Safety\nObject-Oriented Programming (OOP) combines data variables and functions into classes. Private qualifiers restrict direct outside memory access.\n\n**Hinglish Notes (सरल भाषा में):**\nClass parameters coordinates system variables structures control check encapsulation rules follow. Private variables direct access parameters restrict values set configurations.\n\n**Real-World Industry Case:**\nMedical device heart rate monitors ensuring vital tracking properties are only updated via vetted hardware functions.`;
      topics[3].text = `### Lab Task: Class Access Protection\nDesign a simple class managing sensitive state variables with public methods.\n\n**Wokwi C++ Playground (ऑनलाइन अभ्यास):**\nSimulate classes here:\n- [Wokwi Online C++ Playground](https://wokwi.com/projects/new/cpp)\n\n**Hinglish Lab Instructions:**\n1. Private attributes define getter setter setup checks.\n2. Instantiation verification loop checks.`;
      topics[3].code = `#include <iostream>\nclass Controller {\nprivate:\n    int voltageValue;\npublic:\n    void setVoltage(int v) { if(v <= 5) voltageValue = v; }\n    int getVoltage() { return voltageValue; }\n};\nint main() {\n    Controller c;\n    c.setVoltage(4);\n    std::cout << "Voltage: " << c.getVoltage() << "V" << std::endl;\n    return 0;\n}`;
      topics[3].note = "Encapsulation prevents dynamic runtime memory corruptions.";
    } else if (week === 3) {
      topics[1].text = `### Pointers vs References: Parameter Performance\nC++ references provide safe, immutable aliases to variables. Passing by reference avoids allocating large copy buffers in function call frames.\n\n**Hinglish Notes (सरल भाषा में):**\nReferences variable aliases direct point values mapping. Pointers storage address change rules allow direct memory maps values check.\n\n**Real-World Industry Case:**\nDatabase management algorithms passing telemetry data buffers by reference to prevent high duplication speed limits.`;
      topics[3].text = `### Lab Task: Swapping variables using references\nImplement variables swap function comparing raw pointer methods vs reference arguments.\n\n**Wokwi C++ Playground (ऑनलाइन अभ्यास):**\nPractice references here:\n- [Wokwi Online C++ Playground](https://wokwi.com/projects/new/cpp)\n\n**Hinglish Lab Instructions:**\n1. Reference arguments passing functions definitions set.\n2. Compare output values.`;
      topics[3].code = `#include <iostream>\nvoid swapRef(int &a, int &b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\nint main() {\n    int x = 5, y = 10;\n    swapRef(x, y);\n    std::cout << "x: " << x << ", y: " << y << std::endl;\n    return 0;\n}`;
      topics[3].note = "References are safer as they cannot be null or rebound.";
    } else if (week === 4) {
      topics[1].text = `### Operator Overloading: Algebraic Code Semantics\nC++ allows assigning custom behaviors to standard operators (like \`+\` or \`<<\`) when applied to custom class instances.\n\n**Hinglish Notes (सरल भाषा में):**\nCustom classes instances mathematical addition operations operator functions overload support options check simplifies class logic calculations.\n\n**Real-World Industry Case:**\nVideo game graphics pipelines manipulating coordinate matrices using basic operators.`;
      topics[3].text = `### Lab Task: Add Custom Vector instances\nOverload the addition operator to combine custom coordinates.\n\n**Wokwi C++ Playground (ऑनलाइन अभ्यास):**\nPractice operator overloading:\n- [Wokwi Online C++ Playground](https://wokwi.com/projects/new/cpp)\n\n**Hinglish Lab Instructions:**\n1. Define vector class overload operator implementation.\n2. Verify summed objects properties.`;
      topics[3].code = `#include <iostream>\nclass Point {\npublic:\n    int x, y;\n    Point(int x=0, int y=0): x(x), y(y) {}\n    Point operator+(const Point& p) {\n        return Point(x + p.x, y + p.y);\n    }\n};\nint main() {\n    Point p1(1, 2), p2(3, 4);\n    Point p3 = p1 + p2;\n    std::cout << "Result: " << p3.x << ", " << p3.y << std::endl;\n    return 0;\n}`;
      topics[3].note = "Overloaded operators should preserve intuitive arithmetic workflows.";
    } else if (week === 5) {
      topics[1].text = `### Stream-Based File I/O & SD Card Logs\nStandard stream libraries (\`fstream\`) manage block-based reads and writes to physical media safely with system exception handling.\n\n**Hinglish Notes (सरल भाषा में):**\nFiles systems records manage write updates streams standard streams error parameters parameters checks checks check setups.\n\n**Real-World Industry Case:**\nLogging system telemetry errors on black-box flash systems in commercial aviation setups.`;
      topics[3].text = `### Lab Task: Read/Write Simulated Logs\nUse output file stream template to construct local tracking arrays.\n\n**Wokwi C++ Playground (ऑनलाइन अभ्यास):**\nSimulate logging streams:\n- [Wokwi Online C++ Playground](https://wokwi.com/projects/new/cpp)\n\n**Hinglish Lab Instructions:**\n1. Stream buffer inputs verify standard methods.\n2. Observe streams close safety settings.`;
      topics[3].code = `#include <iostream>\n#include <sstream>\nint main() {\n    std::stringstream logStream;\n    logStream << "System OK - Battery level: 85%";\n    std::cout << "Logged: " << logStream.str() << std::endl;\n    return 0;\n}`;
      topics[3].note = "Stringstreams provide convenient in-memory string formatting buffers.";
    } else {
      topics[1].text = `### OOP Architectures & Memory Safety for **${moduleTitle}**\nManaging complex systems requires understanding virtual method dispatch, copy construct semantics, and templates parameter constraints.\n\n**Hinglish Notes (सरल भाषा में):**\nObject Oriented program systems memory allocation management compile validation pointers references check layouts standard libraries optimization memory management routines.\n\n**Real-World Industry Case:**\nRobot navigation control classes instantiating modular hardware drivers at boot time dynamically.`;
      topics[3].text = `### Lab Task: Safe Allocations with RAII Smart Pointers\nManage class object lifecycles using standard unique pointer types.\n\n**Wokwi C++ Playground (ऑनलाइन अभ्यास):**\nPractice smart pointers online:\n- [Wokwi Online C++ Playground](https://wokwi.com/projects/new/cpp)\n\n**Hinglish Lab Instructions:**\n1. Instantiation smart pointer parameters configurations setup.\n2. Observe object destruct calls on function bounds exit.`;
      topics[3].code = `#include <iostream>\n#include <memory>\nclass Device {\npublic:\n    Device() { std::cout << "Device active\\n"; }\n    ~Device() { std::cout << "Device shut down\\n"; }\n};\nint main() {\n    std::unique_ptr<Device> dev = std::make_unique<Device>();\n    return 0;\n}`;
      topics[3].note = "Unique pointer scopes automatic variable deletes avoid heap leak errors.";
    }
  } else if (courseId === "CADDED_Mech") {
    const CADDED_MECH_TOPICS: Record<number, string[]> = {
      1: [
        "Introduction to AutoCAD & Mechanical Drafting",
        "AutoCAD Interface, Navigation & Drawing Tools",
        "Basic Mechanical Drafting Fundamentals",
        "Dimensioning, Annotation & Drawing Standards",
        "Mechanical Drawing Examples",
        "Practical Exercises & Assignments"
      ],
      2: [
        "Introduction to SolidWorks & Parametric Modeling",
        "SolidWorks Interface & Sketching Tools",
        "Part Modeling Fundamentals",
        "Feature-Based Modeling Concepts",
        "Part Modeling Examples",
        "Practical Exercises & Assignments"
      ],
      3: [
        "Introduction to CATIA & Surface Design",
        "CATIA Interface & Surface Design Tools",
        "Surface Modeling Fundamentals",
        "Generative Shape Design Concepts",
        "Surface Modeling Examples",
        "Practical Exercises & Assignments"
      ],
      4: [
        "Introduction to CNC Machines & Programming",
        "CNC Coordinate System & Machine Setup",
        "G-Code Programming Fundamentals",
        "M-Code & CNC Machining Operations",
        "CNC Programming Examples",
        "Practical Exercises & Assignments"
      ],
      5: [
        "Introduction to Assembly Modeling & Drafting",
        "Assembly Constraints & Components",
        "Assembly Drawing Fundamentals",
        "Drafting Documentation & BOM",
        "Integrated Mechanical Project Examples",
        "Practical Exercises & Assignments"
      ]
    };

    const getMechCode = (w: number) => {
      if (w === 1) return `LINE 0,0 100,0\nCIRCLE 50,50 25\nDIMLINEAR 0,0 100,0`;
      if (w === 2) return `// SolidWorks API Macro\nPart.FeatureManager.FeatureExtrude2(True, False, False, 0, 0, 0.05, 0.05, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False)`;
      if (w === 3) return `// CATIA Scripting sweep surface\nSet hybridShapeSweepCircle = hybridShapeFactory.AddNewSweepCircle(hybridShapeCircle)\nhybridBody.AppendHybridShape hybridShapeSweepCircle`;
      if (w === 4) return `G90 G21 G17 (Absolute Coordinates, Metric)\nG00 Z5.0 (Safety Retract)\nM03 S1200\nG00 X10.0 Y10.0\nG01 Z-2.0 F100\nG01 X40.0 Y10.0 F300\nM30`;
      return `// Assembly Constraint Definition\nComponent1.Mate(Component2, Coincident, Axis1, Axis2)`;
    };

    const list = CADDED_MECH_TOPICS[week] || [];
    for (let i = 0; i < 6; i++) {
      if (list[i]) {
        topics[i].title = list[i];
        topics[i].text = `### Mechanical Engineering: ${list[i]}\nThis topic focuses on core components, design rules, and industry pipelines for **${list[i]}**.\n\n**Hinglish Study Notes (सरल भाषा में):**\nIs module section me hum ${list[i]} ke structural rules aur system designs ke parameters verify karna seekhenge. Mechanical parts modeling check dimensions aur bounds guidelines dynamic execution.`;
        topics[i].code = i === 3 ? getMechCode(week) : null;
        topics[i].note = `Verify modeling boundaries and clearances while drafting ${list[i]}.`;
      }
    }
  } else if (courseId === "CADDED_Civil") {
    const CADDED_CIVIL_TOPICS: Record<number, string[]> = {
      1: [
        "Introduction to AutoCAD Civil & Site Drafting",
        "AutoCAD Interface & Basic Drafting Tools",
        "Residential Planning Fundamentals",
        "Civil Drafting Standards & Documentation",
        "Residential Plan Examples",
        "Practical Exercises & Assignments"
      ],
      2: [
        "Introduction to 3ds Max & Architectural Visualization",
        "3ds Max Interface & Modeling Tools",
        "Architectural Modeling Fundamentals",
        "Materials, Texturing & Lighting",
        "Architectural Visualization Examples",
        "Practical Exercises & Assignments"
      ],
      3: [
        "Introduction to SketchUp & Rapid 3D Prototyping",
        "SketchUp Interface, Navigation & Basic Modeling Tools",
        "Rapid 3D Modeling Fundamentals",
        "Layout Design & Documentation Fundamentals",
        "SketchUp Modeling & Layout Examples",
        "Practical Exercises & Assignments"
      ],
      4: [
        "Introduction to Autodesk Revit & Structural BIM",
        "Revit Interface, Structural Templates & Basic Modeling Tools",
        "Structural Modeling Fundamentals",
        "Structural Detailing & Analysis Fundamentals",
        "Structural Modeling & Analysis Examples",
        "Practical Exercises & Assignments"
      ],
      5: [
        "Introduction to Revit Architecture & Architectural BIM",
        "Revit Architecture Interface, Project Setup & Basic Modeling Tools",
        "Architectural BIM Modeling Fundamentals",
        "Architectural Documentation & Schedule Fundamentals",
        "Architectural BIM Modeling & Schedule Examples",
        "Practical Exercises & Assignments"
      ]
    };

    const getCivilCode = (w: number) => {
      if (w === 1) return `OFFSET 230 (Wall thickness)\nLINE 0,0 3500,0 (Bedroom Width)\nRECTANG 0,0 4200,3600 (Living Room)`;
      if (w === 2) return `// 3ds Max MaxScript helper\nvray = VRayMtl()\nvray.diffuse = color 128 128 128\n$.material = vray`;
      if (w === 3) return `// Ruby API SketchUp snippet\nmodel = Sketchup.active_model\nentities = model.active_entities\nface = entities.add_face [0,0,0], [10,0,0], [10,10,0], [0,10,0]\nface.pushpull -5`;
      if (w === 4) return `// Revit C# API Structural Member Creation\nFamilyInstance beam = doc.Create.NewFamilyInstance(point, beamType, structuralLevel, StructuralType.Beam);`;
      return `// Revit C# API Wall Creation\nWall wall = Wall.Create(document, curve, levelId, false);`;
    };

    const list = CADDED_CIVIL_TOPICS[week] || [];
    for (let i = 0; i < 6; i++) {
      if (list[i]) {
        topics[i].title = list[i];
        topics[i].text = `### Civil Engineering & Architecture: ${list[i]}\nThis topic focuses on building layouts, structural detailing, and BIM documentation for **${list[i]}**.\n\n**Hinglish Study Notes (सरल भाषा में):**\nIs segment me hum ${list[i]} ke structural alignments aur drafting constraints study karenge. Residential and commercial plans elevations coordinates parameters validation checks rules coordinate lines.`;
        topics[i].code = i === 3 ? getCivilCode(week) : null;
        topics[i].note = `Adhere to local municipal rules and building safety laws while modeling ${list[i]}.`;
      }
    }
  }

  return topics;
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
          price: 699,
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
          price: 699
        }
      });
      console.log(`Updated Course: ${course.id}`);
    }

    // Clean up any extra modules that are not in the seed array to prevent trailing weeks
    const seedWeeks = courseData.modules.map((_, idx) => idx + 1);
    await prisma.module.deleteMany({
      where: {
        courseId: course.id,
        week: { notIn: seedWeeks }
      }
    });

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

      // Safe clean up of existing leaf nodes for this module to prevent duplicate seeding
      const existingTopicsCount = await prisma.topic.count({ where: { moduleId: modRecord.id } });
      if ((course.id === 'CADDED_Mech' || course.id === 'CADDED_Civil') && existingTopicsCount > 0) {
        console.log(`Skipping topic/quiz seeding for ${course.id} module W${moduleOrder} to preserve manual admin edits.`);
        continue;
      }

      await prisma.topic.deleteMany({ where: { moduleId: modRecord.id } });
      await prisma.quizQuestion.deleteMany({ where: { moduleId: modRecord.id } });

      // Seed exactly 6 topics matching module content requirements
      const topicsData = getDynamicTopicsForModule(course.id, moduleOrder, moduleTitle);

      const topicsCreated = [];
      for (let t = 0; t < topicsData.length; t++) {
        const top = topicsData[t];
        const topicRecord = await prisma.topic.create({
          data: {
            moduleId: modRecord.id,
            title: top.title,
            text: top.text,
            code: top.code,
            note: top.note,
            order: t
          }
        });
        topicsCreated.push(topicRecord);
      }

      if (course.id === 'CADDED_Mech' || course.id === 'CADDED_Civil') {
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
      } else {
        // Seed 10 Quiz Questions for EACH topic of this module
        for (let t = 0; t < topicsCreated.length; t++) {
          const topic = topicsCreated[t];
          const questionsData = generateTopicQuizzes(course.id, moduleOrder, topic.title, t);
          for (const qData of questionsData) {
            await prisma.quizQuestion.create({
              data: {
                moduleId: modRecord.id,
                topicId: topic.id,
                text: qData.text,
                options: qData.options,
                correctAnswer: qData.correctAnswer
              }
            });
          }
        }
      }
    }

    // Safe clean up of existing final exam questions for this course
    await prisma.finalExamQuestion.deleteMany({ where: { courseId: course.id } });

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

    console.log(`Seeded ${courseData.modules.length} Modules, ${courseData.modules.length * 6} Topics, ${courseData.modules.length * 10} Quiz Questions, and 50 Final Exam Questions for ${course.id}`);
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

  // Seed Default System Settings
  console.log('Seeding Default System Settings...');
  const defaultSettings = [
    { key: 'COMPANY_NAME', value: 'EduNexus Pro' },
    { key: 'WEBSITE_URL', value: 'https://edunexus.kibm.in' },
    { key: 'CONTACT_EMAIL', value: 'edunexuspro@gmail.com' },
    { key: 'CONTACT_PHONE', value: '+91 99999 99999' },
    { key: 'CONTACT_HOURS', value: 'Monday to Saturday | 10:00 AM – 6:00 PM (IST)' }
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value
      }
    });
  }
  console.log('System Settings Seeded successfully!');

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
