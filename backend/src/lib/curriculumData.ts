export interface Topic {
  title: string;
  text: string;
  code?: string;
  note?: string;
}

export interface ModuleCurriculum {
  order: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface CourseQuiz {
  questions: Question[];
}

export const curriculum: Record<string, ModuleCurriculum[]> = {
  "C": [
    {
      order: 1,
      title: "Procedural Fundamentals & Memory Layouts",
      description: "Deep dive into C execution models, compilation pipelines, variables, operators, and primitive data types.",
      topics: [
        {
          title: "The Compilation Pipeline",
          text: "C is a compiled language. The process includes Preprocessing (expanding #include and macros), Compilation (converting to assembly), Assembly (converting to machine code), and Linking (combining object files into an executable).",
          code: `gcc -E main.c > main.i\ngcc -S main.i\ngcc -c main.s\ngcc main.o -o program`,
          note: "Understanding this pipeline helps in debugging linking errors versus syntax errors."
        },
        {
          title: "Memory Segments",
          text: "A running C program uses distinct memory segments: Code (Text), Data (Initialized global/static), BSS (Uninitialized global/static), Heap (Dynamic memory), and Stack (Local variables & function calls).",
          note: "Stack overflows occur when recursion goes too deep, while heap fragmentation happens due to poor malloc/free usage."
        }
      ]
    },
    {
      order: 2,
      title: "Control Structures & State Machines",
      description: "Advanced branching, loops, and building basic state machines using switch-case logic.",
      topics: [
        {
          title: "Finite State Machines in C",
          text: "State machines can be implemented cleanly using enums and switch-case statements inside a loop. This is critical for embedded systems control flows.",
          code: `typedef enum { IDLE, RUNNING, FAULT } State;\nState currentState = IDLE;\n\nswitch(currentState) {\n    case IDLE:\n        // Wait for start signal\n        break;\n    case RUNNING:\n        // Execute process\n        break;\n}`
        }
      ]
    },
    {
      order: 3,
      title: "Pointers & Dynamic Memory Architecture",
      description: "Pointer arithmetic, heap vs stack, malloc/free, and resolving segmentation faults.",
      topics: [
        {
          title: "Pointer Arithmetic & Array Decay",
          text: "Arrays in C decay into pointers when passed to functions. Incrementing a pointer adds sizeof(type) to the memory address.",
          code: `int arr[] = {10, 20, 30};\nint *ptr = arr;\nprintf("%d", *(ptr + 1)); // Prints 20`
        }
      ]
    },
    {
      order: 4,
      title: "Composite Types & Data Structures",
      description: "Structs, unions, bit-fields, and linked lists in C.",
      topics: [
        {
          title: "Struct Padding & Alignment",
          text: "Compilers insert padding bytes into structs to align data in memory for faster CPU access, which can increase the struct's overall size.",
          code: `struct __attribute__((__packed__)) PackedStruct {\n    char a;\n    int b;\n};`,
          note: "Use packed structs when interfacing directly with hardware registers or network protocols to prevent padding issues."
        }
      ]
    },
    {
      order: 5,
      title: "Hardware I/O & Bitwise Operations",
      description: "File handling, bitwise masking, shifting, and writing directly to hardware registers.",
      topics: [
        {
          title: "Bitwise Register Masking",
          text: "Hardware control requires manipulating individual bits using AND (&), OR (|), XOR (^), and shifts (<<, >>).",
          code: `// Set bit 3\nPORTA |= (1 << 3);\n// Clear bit 3\nPORTA &= ~(1 << 3);\n// Toggle bit 3\nPORTA ^= (1 << 3);`
        }
      ]
    }
  ],
  "C++": [
    {
      order: 1,
      title: "Object-Oriented Encapsulation",
      description: "Classes, Objects, Constructors/Destructors, RAII, and Access Specifiers.",
      topics: [
        {
          title: "RAII (Resource Acquisition Is Initialization)",
          text: "RAII is a C++ programming technique which binds the life cycle of a resource (memory, thread, socket) to the lifetime of a local object.",
          code: `class FileHandler {\n    FILE* f;\npublic:\n    FileHandler(const char* name) { f = fopen(name, "r"); }\n    ~FileHandler() { if(f) fclose(f); }\n};`
        }
      ]
    }
  ],
  "IoT": [
    {
      order: 1,
      title: "IoT Microcontroller Baselines",
      description: "ESP32/ESP8266 Core architecture, pinouts, and toolchain setups.",
      topics: [
        {
          title: "ESP32 Architecture",
          text: "The ESP32 is a dual-core Xtensa microcontroller with built-in Wi-Fi and Bluetooth, making it ideal for IoT applications."
        }
      ]
    }
  ],
  "Embedded": [
    {
      order: 1,
      title: "Bare-Metal Architecture & Boot sequence",
      description: "Cortex-M architecture, linker scripts, startup code, and memory maps.",
      topics: [
        {
          title: "Vector Tables & Reset Handlers",
          text: "The vector table sits at the start of memory and contains the initial stack pointer and addresses to interrupt service routines (ISRs), starting with the Reset_Handler."
        }
      ]
    }
  ]
};

// Merged final exam questions
export const quizzes: Record<string, CourseQuiz> = {
  "C": {
    questions: [
      {
        id: 1,
        text: "Which memory segment is used for dynamically allocated variables via malloc()?",
        options: ["Stack", "Heap", "BSS", "Text"],
        correctAnswer: "Heap"
      },
      {
        id: 2,
        text: "What does the expression 'PORTA |= (1 << 3)' accomplish?",
        options: ["Clears bit 3", "Toggles bit 3", "Sets bit 3", "Reads bit 3"],
        correctAnswer: "Sets bit 3"
      },
      {
        id: 3,
        text: "What is the primary purpose of the 'break' statement inside a switch-case block?",
        options: ["To restart the loop", "To exit the program", "To prevent fall-through to the next case", "To evaluate the next expression"],
        correctAnswer: "To prevent fall-through to the next case"
      },
      {
        id: 4,
        text: "Which compiler directive prevents struct padding?",
        options: ["#pragma once", "__attribute__((__packed__))", "#define PACKED", "volatile"],
        correctAnswer: "__attribute__((__packed__))"
      },
      {
        id: 5,
        text: "What happens when an array decays into a pointer?",
        options: ["It loses its length information", "It becomes a double pointer", "It causes a segmentation fault", "It moves to the heap"],
        correctAnswer: "It loses its length information"
      }
    ]
  },
  "C++": {
    questions: [
      {
        id: 6,
        text: "What does RAII stand for?",
        options: ["Resource Acquisition Is Initialization", "Runtime Allocation Initialization Interface", "Register Access Interrupt Integration", "Real-Time Application Interaction Interface"],
        correctAnswer: "Resource Acquisition Is Initialization"
      }
    ]
  },
  "IoT": {
    questions: [
      {
        id: 7,
        text: "Which processor core does the ESP32 utilize?",
        options: ["ARM Cortex-M4", "Xtensa Dual-Core", "AVR 8-bit", "RISC-V Single-Core"],
        correctAnswer: "Xtensa Dual-Core"
      }
    ]
  },
  "Embedded": {
    questions: [
      {
        id: 8,
        text: "What is the primary function of the Vector Table in an ARM Cortex-M system?",
        options: ["To store application variables", "To map peripheral memory addresses", "To hold addresses of Interrupt Service Routines (ISRs)", "To manage the heap allocator"],
        correctAnswer: "To hold addresses of Interrupt Service Routines (ISRs)"
      }
    ]
  }
};