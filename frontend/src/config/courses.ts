import { 
  Code, Box, Wifi, Cpu, Terminal, Globe, Binary, 
  Layers, Disc, Zap, Brain, Eye, Bot, Database
} from 'lucide-react';

export interface SyllabusItem {
  order: number;
  title: string;
  details: string;
}

export interface CourseConfigItem {
  id: string;
  title: string;
  titleShort: string;
  category: 'Programming' | 'Electronics' | 'AI & Emerging Technologies';
  difficulty: string;
  tags: string[];
  colorLight: string;
  colorDark: string;
  iconColor: string;
  textColor: string;
  barColor: string;
  desc: string;
  descShort: string;
  icon: any;
  syllabus: SyllabusItem[];
}

export const coursesConfig: CourseConfigItem[] = [
  // 1. Programming Category
  {
    id: 'C',
    title: 'C & Systems Programming',
    titleShort: 'C Language',
    category: 'Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Systems', 'Memory Maps'],
    colorLight: 'from-blue-500/10 to-blue-600/5',
    colorDark: 'from-blue-500 to-blue-700',
    iconColor: 'text-blue-500 bg-blue-500/10',
    textColor: 'text-blue-400',
    barColor: 'bg-blue-500',
    desc: 'Master procedural programming, binary structures, memory allocations, pointer arithmetic, and register masking from the ground up.',
    descShort: 'Master procedural programming, memory maps, and hardware compiler logic.',
    icon: Code,
    syllabus: [
      { order: 1, title: 'Procedural Fundamentals & Memory Layouts', details: 'Deep dive into C execution models, compilation pipelines, variables, operators, and primitive data types.' },
      { order: 2, title: 'Control Structures & State Machines', details: 'Advanced branching, loops, and building basic state machines using switch-case logic.' },
      { order: 3, title: 'Pointers & Dynamic Memory Architecture', details: 'Pointer arithmetic, heap vs stack, malloc/free, and resolving segmentation faults.' },
      { order: 4, title: 'Composite Types & Data Structures', details: 'Structs, unions, bit-fields, and self-referential linked lists in C.' },
      { order: 5, title: 'Hardware I/O & Bitwise Operations', details: 'File handling, bitwise masking, shifting, and writing directly to hardware registers.' }
    ]
  },
  {
    id: 'C++',
    title: 'C++ & OOP for Embedded Systems',
    titleShort: 'C++ Language',
    category: 'Programming',
    difficulty: 'Intermediate',
    tags: ['Object-Oriented', 'High Performance'],
    colorLight: 'from-purple-500/10 to-purple-600/5',
    colorDark: 'from-purple-500 to-purple-700',
    iconColor: 'text-purple-500 bg-purple-500/10',
    textColor: 'text-purple-400',
    barColor: 'bg-purple-500',
    desc: 'Architect high-performance OOP software structures, customized template classes, memory-mapped placement new, and low-overhead collections.',
    descShort: 'Implement high-performance object-oriented software design, templates, and STL.',
    icon: Box,
    syllabus: [
      { order: 1, title: 'Object-Oriented Encapsulation', details: 'Classes, Objects, Constructors/Destructors, RAII, and Access Specifiers.' },
      { order: 2, title: 'Inheritance & Polymorphism', details: 'Virtual Functions, VTables, Abstract classes, and Multiple Inheritance.' },
      { order: 3, title: 'Memory Management in C++', details: 'Smart pointers (unique_ptr, shared_ptr), move semantics, and rvalue references.' },
      { order: 4, title: 'Generic Programming & Templates', details: 'Function/Class templates, variadic templates, and metaprogramming basics.' },
      { order: 5, title: 'Standard Template Library (STL) & Embedded Constraints', details: 'Vectors, maps, iterators, algorithms, and writing no-overhead allocations.' }
    ]
  },
  {
    id: 'Python',
    title: 'Python for Automation & Systems',
    titleShort: 'Python',
    category: 'Programming',
    difficulty: 'Beginner',
    tags: ['Scripting', 'Automation'],
    colorLight: 'from-yellow-500/10 to-yellow-600/5',
    colorDark: 'from-yellow-500 to-yellow-600',
    iconColor: 'text-yellow-500 bg-yellow-500/10',
    textColor: 'text-yellow-400',
    barColor: 'bg-yellow-500',
    desc: 'Learn scripting, text-parsing, file automation, API integration, and machine-interaction logic using Python 3.',
    descShort: 'Write automation scripts, data parsers, and interact with APIs using Python.',
    icon: Terminal,
    syllabus: [
      { order: 1, title: 'Python Syntax & Dynamic Typing', details: 'Data types, lists, dictionaries, tuples, sets, and basic control flows.' },
      { order: 2, title: 'Functional Programming & File Modules', details: 'Writing custom functions, scopes, file I/O operations, and OS module scripting.' },
      { order: 3, title: 'Regex & Serial Communications', details: 'Pattern matching, text parsing, logging, and interfacing with USB/Serial ports.' },
      { order: 4, title: 'Web Scraping & HTTP Clients', details: 'Requests library, JSON APIs parsing, and using Beautiful Soup for data harvesting.' },
      { order: 5, title: 'Automation Tasks & Cron Scheduling', details: 'Automating system tasks, folder cleaner scripts, and scheduling processes.' }
    ]
  },
  {
    id: 'Java',
    title: 'Java Enterprise Foundations & OOP',
    titleShort: 'Java Programming',
    category: 'Programming',
    difficulty: 'Intermediate',
    tags: ['Core Java', 'Memory Management'],
    colorLight: 'from-red-500/10 to-red-600/5',
    colorDark: 'from-red-500 to-red-600',
    iconColor: 'text-red-500 bg-red-500/10',
    textColor: 'text-red-400',
    barColor: 'bg-red-500',
    desc: 'Master the JVM bytecode model, object-oriented encapsulation, interfaces, multithreading, and standard collection hierarchies.',
    descShort: 'Master Java OOP structures, multi-threading, and JVM memory allocation.',
    icon: Disc,
    syllabus: [
      { order: 1, title: 'JVM Architecture & Primitive Syntax', details: 'Understand JRE, JDK, bytecode compilation, execution pipelines, and primitive scopes.' },
      { order: 2, title: 'Java Encapsulation & Inheritance', details: 'Abstract classes, custom interfaces, method overloading, overriding, and garbage collection.' },
      { order: 3, title: 'Java Collections Framework', details: 'ArrayList, HashMap, LinkedList, HashSet, Iterators, and generic class structures.' },
      { order: 4, title: 'Exceptions & File Streams', details: 'Try-catch blocks, custom exception mapping, buffers, reader/writer streams, and logging.' },
      { order: 5, title: 'Multithreading & Concurrency', details: 'Thread class, Runnable interface, synchronization, lock monitors, and thread pooling.' }
    ]
  },
  {
    id: 'WebDev',
    title: 'Modern Full-Stack Web Development',
    titleShort: 'Web Dev',
    category: 'Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['React', 'Node.js', 'Tailwind'],
    colorLight: 'from-cyan-500/10 to-cyan-600/5',
    colorDark: 'from-cyan-500 to-cyan-600',
    iconColor: 'text-cyan-500 bg-cyan-500/10',
    textColor: 'text-cyan-400',
    barColor: 'bg-cyan-500',
    desc: 'Build highly responsive modern user interfaces and high-throughput Express REST APIs using HTML, CSS, JavaScript, React, and Node.',
    descShort: 'Build full-stack web applications using React, Tailwind CSS, Express, and databases.',
    icon: Globe,
    syllabus: [
      { order: 1, title: 'HTML5 Semantic Structures & CSS Grid', details: 'Semantic markup, layouts, responsive media queries, and Tailwind CSS system tokens.' },
      { order: 2, title: 'Modern JS (ES6+) & DOM Engine', details: 'Callbacks, Promises, Async/Await, array mutations, and handling user triggers.' },
      { order: 3, title: 'React UI Engine & Hooks', details: 'State management, props, useEffect hooks, custom handlers, and reusable component lists.' },
      { order: 4, title: 'REST APIs with Express.js', details: 'Creating endpoints, body parsing, routing, request validators, and CORS configurations.' },
      { order: 5, title: 'Databases & Client Integrations', details: 'Connecting frontend to backend using Axios, seeding tables, and basic user auth session mapping.' }
    ]
  },
  {
    id: 'DSA',
    title: 'Data Structures & Algorithms',
    titleShort: 'DSA',
    category: 'Programming',
    difficulty: 'Advanced',
    tags: ['Algorithms', 'Time Complexity'],
    colorLight: 'from-pink-500/10 to-pink-600/5',
    colorDark: 'from-pink-500 to-pink-700',
    iconColor: 'text-pink-500 bg-pink-500/10',
    textColor: 'text-pink-400',
    barColor: 'bg-pink-500',
    desc: 'Deep analytical study of time/space complexities, tree nodes, recursive graphs, searching/sorting paths, and dynamic programming.',
    descShort: 'Analyze time complexities, trees, graphs, sorting paths, and dynamic programming.',
    icon: Database,
    syllabus: [
      { order: 1, title: 'Asymptotic Analysis & Linear lists', details: 'Big O notation, amortized costs, customized stacks, queues, and doubly linked structures.' },
      { order: 2, title: 'Trees & Heap structures', details: 'Binary search trees, AVL self-balancing trees, priority queues, and max/min heaps.' },
      { order: 3, title: 'Graph Traversal & Path Routing', details: 'Representations via matrices/lists, BFS, DFS, and Dijkstra shortest-path solutions.' },
      { order: 4, title: 'Searching, Sorting & Divide and Conquer', details: 'QuickSort, MergeSort, Binary Search, and solving recurrence relations.' },
      { order: 5, title: 'Dynamic Programming & Memoization', details: 'Knapsack algorithms, fibonacci caches, LCS, and matrix chains.' }
    ]
  },

  // 2. Electronics Category
  {
    id: 'Arduino',
    title: 'Arduino Prototyping & C++ Firmware',
    titleShort: 'Arduino Lab',
    category: 'Electronics',
    difficulty: 'Beginner',
    tags: ['Microcontrollers', 'Prototyping'],
    colorLight: 'from-emerald-500/10 to-emerald-600/5',
    colorDark: 'from-emerald-500 to-emerald-600',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
    textColor: 'text-emerald-450',
    barColor: 'bg-emerald-500',
    desc: 'Interface analog sensors, control high-power relays, and compile firmware drivers on the AVR Atmega328P architecture.',
    descShort: 'Interface analog/digital sensors, control relays, and program AVR microcontrollers.',
    icon: Wifi,
    syllabus: [
      { order: 1, title: 'AVR Pinouts & Board Fundamentals', details: 'Understanding power boundaries, digital pins, analog inputs, and Atmega registers.' },
      { order: 2, title: 'Blinking, PWM & Motor Drivers', details: 'Pulse-width modulation, H-Bridge drivers, controlling DC/servo motors.' },
      { order: 3, title: 'Sensors Interfacing (Ultrasonic/DHT)', details: 'Measuring time pulses, parsing 1-wire streaming values, and signal filtering.' },
      { order: 4, title: 'Interrupts & Basic Scheduling', details: 'Pin interrupts, timer triggers, and writing non-blocking asynchronous state loops.' },
      { order: 5, title: 'Serial UART communications', details: 'Streaming debug telemetry to PC terminal and parsing instruction bytes.' }
    ]
  },
  {
    id: 'IoT',
    title: 'IoT & Smart Interfacing Solutions',
    titleShort: 'IoT (Internet of Things)',
    category: 'Electronics',
    difficulty: 'Intermediate to Advanced',
    tags: ['ESP32', 'Cloud Systems'],
    colorLight: 'from-teal-500/10 to-teal-600/5',
    colorDark: 'from-teal-500 to-teal-700',
    iconColor: 'text-teal-500 bg-teal-500/10',
    textColor: 'text-teal-400',
    barColor: 'bg-teal-500',
    desc: 'Connect physical systems with ESP microcontrollers, ADCs, custom serial buses, MQTT client protocols, and remote cloud metrics.',
    descShort: 'Connect physical systems with ESP microcontrollers, MQTT protocols, and cloud services.',
    icon: Wifi,
    syllabus: [
      { order: 1, title: 'IoT Microcontroller Baselines', details: 'ESP32/ESP8266 Core architecture, pinouts, dual-core scopes, and toolchain setups.' },
      { order: 2, title: 'Sensors, Actuators & Signal Processing', details: 'ADCs, DACs, filtering noisy signals, and controlling relays/motors.' },
      { order: 3, title: 'Serial Communication Protocols', details: 'In-depth I2C, SPI, and UART implementations and debugging.' },
      { order: 4, title: 'Networking & Wireless Connectivity', details: 'WiFi configurations, TCP/UDP sockets, HTTP APIs, and WebSockets.' },
      { order: 5, title: 'MQTT & Cloud Integrations', details: 'Publish/subscribe patterns, QoS levels, AWS IoT/ThingsBoard integration, and remote telemetry.' }
    ]
  },
  {
    id: 'Embedded',
    title: 'Embedded Systems & Real-Time OS',
    titleShort: 'Embedded Systems',
    category: 'Electronics',
    difficulty: 'Advanced',
    tags: ['RTOS Kernels', 'Interrupt Priorities'],
    colorLight: 'from-orange-500/10 to-orange-600/5',
    colorDark: 'from-orange-500 to-orange-700',
    iconColor: 'text-orange-500 bg-orange-500/10',
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500',
    desc: 'Implement low-level peripheral drivers, nested vectored interrupts, RTOS task scheduling, semaphores, and power configurations.',
    descShort: 'Architect microcontroller interfaces, serial communication buses, and RTOS kernels.',
    icon: Cpu,
    syllabus: [
      { order: 1, title: 'Bare-Metal Architecture & Boot sequence', details: 'Cortex-M architecture, linker scripts, startup code, and memory maps.' },
      { order: 2, title: 'Peripheral Driver Baselines', details: 'GPIO register manipulation, clock gating, and writing abstract HALs.' },
      { order: 3, title: 'Interrupt Service Routines (ISRs)', details: 'NVIC, nested interrupt priorities, context switching, and avoiding race conditions.' },
      { order: 4, title: 'Timers, Counters & PWM', details: 'Hardware timers, SysTick, generating waveforms, and capturing input signals.' },
      { order: 5, title: 'Real-Time Operating Systems (FreeRTOS)', details: 'Preemptive scheduling, tasks, queues, semaphores, mutexes, and avoiding deadlocks.' }
    ]
  },
  {
    id: 'M8085',
    title: 'Microprocessor 8085 Assembly & Hardware',
    titleShort: '8085 Microprocessor',
    category: 'Electronics',
    difficulty: 'Beginner to Intermediate',
    tags: ['Assembly', 'Hardware Registers'],
    colorLight: 'from-amber-500/10 to-amber-600/5',
    colorDark: 'from-amber-500 to-amber-700',
    iconColor: 'text-amber-500 bg-amber-500/10',
    textColor: 'text-amber-450',
    barColor: 'bg-amber-500',
    desc: 'Study the classic 8-bit architecture, machine cycles, execution timings, RAM/ROM decoding, and write pure 8085 Assembly code.',
    descShort: 'Study 8085 microarchitecture, execution timings, and 8-bit Assembly.',
    icon: Cpu,
    syllabus: [
      { order: 1, title: '8085 Microarchitecture & Register Set', details: 'Accumulator, flags, program counter, stack pointer, and internal data bus.' },
      { order: 2, title: 'Instruction Set & Addressing Modes', details: 'Data transfer, arithmetic, logical operations, branching, and direct/indirect addressing.' },
      { order: 3, title: 'Machine Cycles & Instruction Timing', details: 'Opcode fetch, memory read/write, timing diagrams, and calculating T-states.' },
      { order: 4, title: 'Interrupts & Interfacing RAM/ROM', details: 'Hardware/software interrupts (RST 7.5, TRAP), memory mapping, and addressing gates.' },
      { order: 5, title: 'Assembly Programs & Subroutines', details: 'Writing arithmetic routines, array sorting in assembly, call/return stack hooks.' }
    ]
  },
  {
    id: 'M8051',
    title: 'Microcontroller 8051 Embedded Architecture',
    titleShort: '8051 Microcontroller',
    category: 'Electronics',
    difficulty: 'Intermediate',
    tags: ['8051 Core', 'Assembly & C'],
    colorLight: 'from-lime-500/10 to-lime-600/5',
    colorDark: 'from-lime-500 to-lime-600',
    iconColor: 'text-lime-500 bg-lime-500/10',
    textColor: 'text-lime-400',
    barColor: 'bg-lime-500',
    desc: 'Interface GPIO ports, hardware timers, serial buffers, and program using Keil assembly and Embedded C compiler.',
    descShort: 'Program 8051 microcontrollers,Keil C compilers, and hardware registers.',
    icon: Cpu,
    syllabus: [
      { order: 1, title: '8051 Core & Memory Mapping', details: 'Internal RAM segmentation, special function registers (SFRs), and program memory mapping.' },
      { order: 2, title: 'GPIO Port Structure & Interfacing', details: 'Configuring ports P0-P3, driving LEDs, switches, and handling multiplexed displays.' },
      { order: 3, title: '8051 Timers & Counters', details: 'Configuring TMOD and TCON registers, Mode 1/2 timers, and delay generation.' },
      { order: 4, title: 'Serial Port UART configurations', details: 'SCON and PCON registers, setting baud rates using Timer 1, and transmit/receive loops.' },
      { order: 5, title: 'Embedded C Programming', details: 'Migrating from raw assembly to Keil C, bit addressable variables, and peripheral controls.' }
    ]
  },
  {
    id: 'STM32',
    title: 'STM32 ARM Cortex-M Firmware Development',
    titleShort: 'STM32 ARM',
    category: 'Electronics',
    difficulty: 'Advanced',
    tags: ['ARM Cortex', 'Bare-Metal C'],
    colorLight: 'from-indigo-500/10 to-indigo-650/5',
    colorDark: 'from-indigo-600 to-indigo-800',
    iconColor: 'text-indigo-500 bg-indigo-500/10',
    textColor: 'text-indigo-400',
    barColor: 'bg-indigo-600',
    desc: 'Write bare-metal drivers on STM32 ARM Cortex microcontrollers, direct register configurations, DMA transfers, SPI buses, and ADC buffers.',
    descShort: 'Write STM32 bare-metal drivers, DMA channels, and peripheral configurations.',
    icon: Cpu,
    syllabus: [
      { order: 1, title: 'ARM Cortex-M Architecture & RCC Clocks', details: 'System clocks, APB/AHB buses, phase-locked loops (PLL), and register booting.' },
      { order: 2, title: 'GPIO, Alternate Functions & Registers', details: 'GPIO configuration registers (MODER, OTYPER), alternate functions mapping.' },
      { order: 3, title: 'DMA Channels & Direct Memory Access', details: 'Bypassing CPU for data transfers, circular DMA buffers, SPI and UART integrations.' },
      { order: 4, title: 'Advanced Hardware Timers & PWM', details: 'Prescalers, auto-reload registers, capture/compare registers, and generating PWM.' },
      { order: 5, title: 'Bare-metal Startup Code & Linker scripts', details: 'Writing startup assembly vectors, section mapping, and boot sequences.' }
    ]
  },
  {
    id: 'RaspberryPi',
    title: 'Raspberry Pi Single-Board Computing & Linux',
    titleShort: 'Raspberry Pi',
    category: 'Electronics',
    difficulty: 'Intermediate',
    tags: ['SBC', 'Python & Linux'],
    colorLight: 'from-rose-500/10 to-rose-600/5',
    colorDark: 'from-rose-500 to-rose-700',
    iconColor: 'text-rose-500 bg-rose-500/10',
    textColor: 'text-rose-400',
    barColor: 'bg-rose-500',
    desc: 'Configure Linux operating systems, interact with hardware GPIOs using Python, write custom network threads, and host web servers on single-board computers.',
    descShort: 'Host Linux servers, script hardware GPIOs, and compile systems using Raspberry Pi.',
    icon: Wifi,
    syllabus: [
      { order: 1, title: 'Raspberry Pi Architecture & Linux Booting', details: 'Broadcom CPU core, mounting SD cards, shell utilities, and package installations.' },
      { order: 2, title: 'RPi GPIO Controls using Python', details: 'Using RPi.GPIO and gpiozero libraries, reading buttons, and driving relays.' },
      { order: 3, title: 'Camera Module & Image Processing', details: 'Interfacing CSI cameras, capturing video streams, and installing OpenCV filters.' },
      { order: 4, title: 'Network Sockets & Remote Shells', details: 'SSH setup, TCP/UDP sockets, writing data back and forth to network nodes.' },
      { order: 5, title: 'Embedded Web Servers', details: 'Hosting light servers with Flask, building interactive web buttons to control hardware.' }
    ]
  },
  {
    id: 'DigitalElec',
    title: 'Digital Electronics & Combinational Logic',
    titleShort: 'Digital Electronics',
    category: 'Electronics',
    difficulty: 'Beginner',
    tags: ['Logic Gates', 'Circuit Design'],
    colorLight: 'from-emerald-500/10 to-emerald-650/5',
    colorDark: 'from-emerald-600 to-emerald-800',
    iconColor: 'text-emerald-550 bg-emerald-550/10',
    textColor: 'text-emerald-450',
    barColor: 'bg-emerald-600',
    desc: 'Understand logic gates, design K-maps, multiplexers, latches, flip-flops, synchronous counters, and study basic logic families.',
    descShort: 'Design logic gate circuits, K-maps, multiplexers, and digital counters.',
    icon: Binary,
    syllabus: [
      { order: 1, title: 'Boolean Algebra & Logic Gates', details: 'De Morgan laws, primary logic gates, universal gates (NAND, NOR) layouts.' },
      { order: 2, title: 'Karnaugh Maps & Simplification', details: 'Minimizing boolean equations using 3-variable and 4-variable K-maps.' },
      { order: 3, title: 'Combinational Logic Circuits', details: 'Design adders, subtractors, decoders, encoders, and multiplexers.' },
      { order: 4, title: 'Sequential Logic & Flip-flops', details: 'SR, JK, D, and T flip-flops, latches, and race-around conditions.' },
      { order: 5, title: 'Registers & Synchronous Counters', details: 'Designing shift registers, ripple counters, and state transition equations.' }
    ]
  },
  {
    id: 'AnalogElec',
    title: 'Analog Electronics & Active Circuit Design',
    titleShort: 'Analog Circuits',
    category: 'Electronics',
    difficulty: 'Intermediate',
    tags: ['Circuits', 'Op-Amps', 'Diodes'],
    colorLight: 'from-orange-500/10 to-orange-650/5',
    colorDark: 'from-orange-600 to-orange-850',
    iconColor: 'text-orange-600 bg-orange-600/10',
    textColor: 'text-orange-450',
    barColor: 'bg-orange-600',
    desc: 'Analyze active semiconductor junctions, design BJT/FET amplifiers, operational amplifiers (Op-Amps), filtering networks, and power systems.',
    descShort: 'Analyze active semiconductor circuits, transistor amplifiers, and Op-Amps.',
    icon: Layers,
    syllabus: [
      { order: 1, title: 'Diodes & Rectification Networks', details: 'P-N junction physics, zener regulators, full-wave and half-wave rectifiers.' },
      { order: 2, title: 'Bipolar Junction Transistors (BJTs)', details: 'Biasing configurations (CE, CB, CC), load line analysis, and small-signal amplification.' },
      { order: 3, title: 'Field-Effect Transistors (FETs)', details: 'JFET, MOSFET physical characteristics, switching logic, and CMOS gates.' },
      { order: 4, title: 'Operational Amplifiers (Op-Amps)', details: 'Inverting/non-inverting amplifiers, integrators, differentiators, and comparators.' },
      { order: 5, title: 'Oscillators & Filtering Circuits', details: 'RC phase shift oscillators, crystal clocks, low-pass and high-pass analog filters.' }
    ]
  },
  {
    id: 'PCBDesign',
    title: 'PCB Design & Board Schematics Layout',
    titleShort: 'PCB Design',
    category: 'Electronics',
    difficulty: 'Intermediate',
    tags: ['Board Design', 'Schematics'],
    colorLight: 'from-teal-500/10 to-teal-650/5',
    colorDark: 'from-teal-600 to-teal-800',
    iconColor: 'text-teal-600 bg-teal-600/10',
    textColor: 'text-teal-450',
    barColor: 'bg-teal-600',
    desc: 'Design circuit board schematics, route multi-layer traces, generate manufacturing Gerber packages, and plan component bill-of-materials.',
    descShort: 'Design custom PCB schematics, route trace paths, and export Gerber packages.',
    icon: Zap,
    syllabus: [
      { order: 1, title: 'Schematic Capture & Components Libraries', details: 'Mapping symbols to footprints, searching libraries, and laying out logical connections.' },
      { order: 2, title: 'Board Outlines & Components Placement', details: 'Importing netlists, setting board boundaries, and planning structural layouts.' },
      { order: 3, title: 'Routing Traces & Clearance Rules', details: 'Setting trace widths based on current draw, routing tracks, and maintaining grid clearances.' },
      { order: 4, title: 'Ground Planes & Vias', details: 'Creating solid ground copper pours, adding multi-layer vias, and thermal relief pads.' },
      { order: 5, title: 'Design Rule Checks (DRC) & Gerber Export', details: 'Executing verification rules, generating Gerber layers, drills files, and BOM.' }
    ]
  },

  // 3. AI & Emerging Technologies Category
  {
    id: 'AI',
    title: 'Artificial Intelligence Foundations',
    titleShort: 'AI Basics',
    category: 'AI & Emerging Technologies',
    difficulty: 'Beginner to Intermediate',
    tags: ['Heuristics', 'AI Algorithms'],
    colorLight: 'from-blue-500/10 to-indigo-600/5',
    colorDark: 'from-blue-600 to-indigo-700',
    iconColor: 'text-indigo-400 bg-indigo-500/10',
    textColor: 'text-indigo-350',
    barColor: 'bg-indigo-650',
    desc: 'Study search algorithms, state representation models, game theory minimax, expert rule engines, and probabilistic systems.',
    descShort: 'Explore state searches, heuristic patterns, minimax paths, and AI basics.',
    icon: Brain,
    syllabus: [
      { order: 1, title: 'State-Space representation & Searches', details: 'Graph nodes representation, uninformed searches (DFS, BFS), and uniform cost searches.' },
      { order: 2, title: 'Heuristic Searches & A* Algorithm', details: 'Defining heuristic functions, greedy search, A* pathfinding mathematical constraints.' },
      { order: 3, title: 'Game Theory & Minimax Engine', details: 'Adversarial searching, evaluation functions, alpha-beta pruning optimization.' },
      { order: 4, title: 'Constraint Satisfaction Problems', details: 'Backtracking search, forward checking, and arc consistency algorithms.' },
      { order: 5, title: 'Expert Systems & Inference engines', details: 'Forward vs backward chaining, defining logic rules databases.' }
    ]
  },
  {
    id: 'ML',
    title: 'Machine Learning & Statistical Models',
    titleShort: 'Machine Learning',
    category: 'AI & Emerging Technologies',
    difficulty: 'Intermediate',
    tags: ['Regression', 'Clustering', 'Math'],
    colorLight: 'from-purple-500/10 to-pink-600/5',
    colorDark: 'from-purple-600 to-pink-700',
    iconColor: 'text-purple-400 bg-purple-500/10',
    textColor: 'text-purple-350',
    barColor: 'bg-purple-600',
    desc: 'Develop predictive models, perform statistical calculations, code regressions, support vector machines, random forests, and k-means groupings.',
    descShort: 'Build regressions, classification models, decision forests, and k-means clustering.',
    icon: Brain,
    syllabus: [
      { order: 1, title: 'Data Preprocessing & Linear Regression', details: 'Normalizing feature dimensions, scaling data, cost functions, and gradient descent.' },
      { order: 2, title: 'Classification & Logistic Regression', details: 'Sigmoid mathematical mapping, decision boundaries, confusion matrices, and ROC paths.' },
      { order: 3, title: 'Decision Trees & Random Forests', details: 'Calculating entropy and information gain, building trees, and ensemble forests.' },
      { order: 4, title: 'Support Vector Machines (SVMs)', details: 'Hyperplane optimization, margins calculations, and non-linear kernel tricks.' },
      { order: 5, title: 'Unsupervised Clustering (K-Means)', details: 'Elbow methods, distance algorithms, centroid convergence, and segmentation mapping.' }
    ]
  },
  {
    id: 'Robotics',
    title: 'Robotics Kinematics & ROS Kernels',
    titleShort: 'Robotics',
    category: 'AI & Emerging Technologies',
    difficulty: 'Advanced',
    tags: ['ROS', 'Kinematics', 'Controls'],
    colorLight: 'from-blue-500/10 to-teal-600/5',
    colorDark: 'from-blue-600 to-teal-700',
    iconColor: 'text-teal-400 bg-teal-500/10',
    textColor: 'text-teal-350',
    barColor: 'bg-teal-600',
    desc: 'Analyze mechanical arm kinematics, control PID feedback loops, route robot paths, and write ROS publishers/subscribers.',
    descShort: 'Analyze mechanical kinematics, PID control loops, and build ROS nodes.',
    icon: Bot,
    syllabus: [
      { order: 1, title: 'Robot Kinematics & Coordinate Frames', details: 'Homogeneous transformations, Denavit-Hartenberg (D-H) parameters, forward kinematics.' },
      { order: 2, title: 'Inverse Kinematics & Jacobians', details: 'Analytical vs numerical IK solutions, velocities mappings, and singular configurations.' },
      { order: 3, title: 'PID Feedback Control Loops', details: 'Proportional, integral, and derivative gains tuning, filtering overshoot, motor integration.' },
      { order: 4, title: 'Robot Operating System (ROS 2)', details: 'Nodes, topics, publishers, subscribers, custom message models, and workspace compiling.' },
      { order: 5, title: 'Path Planning & Obstacle Mapping', details: 'Configuration spaces, grid maps, A* path planning, and basic collision avoidance.' }
    ]
  },
  {
    id: 'ComputerVision',
    title: 'Computer Vision & OpenCV Processing',
    titleShort: 'Computer Vision',
    category: 'AI & Emerging Technologies',
    difficulty: 'Intermediate to Advanced',
    tags: ['OpenCV', 'Image Processing'],
    colorLight: 'from-pink-500/10 to-red-650/5',
    colorDark: 'from-pink-650 to-red-750',
    iconColor: 'text-pink-550 bg-pink-550/10',
    textColor: 'text-pink-450',
    barColor: 'bg-pink-650',
    desc: 'Apply convolutional matrix filters, detect edge outlines, calibrate cameras, track objects, and process video frames using OpenCV.',
    descShort: 'Apply convolution filters, edge detection, camera calibration, and object trackers.',
    icon: Eye,
    syllabus: [
      { order: 1, title: 'Digital Image Representations & Kernels', details: 'RGB/HSV color channels, spatial matrices, applying box and gaussian blur filters.' },
      { order: 2, title: 'Thresholding & Edge Detection', details: 'Otsu thresholding, Canny edge detection algorithm steps, and image contours parsing.' },
      { order: 3, title: 'Feature Detection & Descriptors', details: 'Harris corner detector, SIFT features, and structural similarity matches.' },
      { order: 4, title: 'Camera Calibration & Homographies', details: 'Pin-hole camera model, intrinsic/extrinsic matrices, warping perspectives.' },
      { order: 5, title: 'Object Tracking & Motion vectors', details: 'Background subtraction algorithms, Kalman filters, and optical flow trackers.' }
    ]
  }
];