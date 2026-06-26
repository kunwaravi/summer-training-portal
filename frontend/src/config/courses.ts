import { Code, Box, Wifi, Cpu, Globe, Terminal, Database, Wrench, Building2 } from 'lucide-react';

export interface SyllabusItem {
  order: number;
  title: string;
  details: string;
}

export interface CourseConfigItem {
  id: string;
  title: string;
  titleShort: string;
  category: 'Programming' | 'Electronics' | 'Mechanical' | 'Civil';
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

  // 2. Electronics Category
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
    id: 'WebDesign',
    title: 'Web Design & Frontend Development',
    titleShort: 'Web Design',
    category: 'Programming',
    difficulty: 'Beginner',
    tags: ['HTML/CSS', 'Responsive'],
    colorLight: 'from-pink-500/10 to-pink-600/5',
    colorDark: 'from-pink-500 to-pink-700',
    iconColor: 'text-pink-500 bg-pink-500/10',
    textColor: 'text-pink-400',
    barColor: 'bg-pink-500',
    desc: 'Learn HTML, CSS, JavaScript, and modern responsive design patterns in Hinglish.',
    descShort: 'Learn HTML, CSS, JavaScript, and modern responsive design patterns in Hinglish.',
    icon: Globe,
    syllabus: [
      { order: 1, title: 'HTML5 & Semantic Structure', details: 'Learn the building blocks of web pages, headings, lists, tables, and HTML5 semantic tags.' },
      { order: 2, title: 'CSS3, Layouts & Flexbox', details: 'Style web pages with colors, margins, fonts, and build layouts using CSS Flexbox.' },
      { order: 3, title: 'Responsive Design & Tailwind CSS', details: 'Create mobile-friendly web designs using Media Queries and utility-first Tailwind CSS.' },
      { order: 4, title: 'JavaScript Programming Essentials', details: 'Introduction to JS variables, data types, control flow, functions, and arrays.' },
      { order: 5, title: 'DOM Manipulation & Web Hosting', details: 'Select and modify page elements dynamically using JS, handle events, and deploy to live hosting.' }
    ]
  },
  {
    id: 'Python',
    title: 'Python Programming & Scripting',
    titleShort: 'Python',
    category: 'Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['Data Analysis', 'Automation'],
    colorLight: 'from-amber-500/10 to-amber-600/5',
    colorDark: 'from-amber-500 to-amber-700',
    iconColor: 'text-amber-500 bg-amber-500/10',
    textColor: 'text-amber-400',
    barColor: 'bg-amber-500',
    desc: 'Master Python syntax, data analysis, automation scripts, and file structures in Hinglish.',
    descShort: 'Master Python syntax, data analysis, automation scripts, and file structures in Hinglish.',
    icon: Terminal,
    syllabus: [
      { order: 1, title: 'Python Basics & Control Flows', details: 'Variables, primitive data types, input/output, conditional statements (if-else), and loops.' },
      { order: 2, title: 'Data Structures & Functions', details: 'Lists, Tuples, Dictionaries, Sets, and writing modular reusable functions.' },
      { order: 3, title: 'File Operations & Exception Handling', details: 'Reading/writing files, handling exceptions safely, and debugging scripting errors.' },
      { order: 4, title: 'Object-Oriented Programming (OOP)', details: 'Classes, objects, constructor methods, single/multiple inheritance, and method overriding.' },
      { order: 5, title: 'Data Analysis & Automation Basics', details: 'Introduction to Pandas DataFrames, plotting with Matplotlib, and web scraping with BeautifulSoup.' }
    ]
  },
  {
    id: 'SQL',
    title: 'Database Management & SQL',
    titleShort: 'SQL Database',
    category: 'Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['Relational DB', 'Querying'],
    colorLight: 'from-emerald-500/10 to-emerald-600/5',
    colorDark: 'from-emerald-500 to-emerald-700',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
    textColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    desc: 'Learn relational databases, SQL queries, joins, indexes, and schema design in Hinglish.',
    descShort: 'Learn relational databases, SQL queries, joins, indexes, and schema design in Hinglish.',
    icon: Database,
    syllabus: [
      { order: 1, title: 'Relational DB & SQL Basics', details: 'Database fundamentals, SELECT, WHERE, data sorting, and aggregate functions.' },
      { order: 2, title: 'Group By & Relational Joins', details: 'Grouping data, Inner Joins, Left/Right Joins, and executing subqueries.' },
      { order: 3, title: 'Data Definition & Manipulation (DDL/DML)', details: 'Creating/altering tables, primary/foreign key constraints, and inserting/updating/deleting rows.' },
      { order: 4, title: 'Indexes, Transactions & Views', details: 'Optimizing queries with indexes, ACID properties, commit/rollback, and database views.' },
      { order: 5, title: 'SQL in Applications & Project', details: 'Connecting databases to backend services, schema design, and query optimizations.' }
    ]
  },
  {
    id: 'CADDED_Mech',
    title: 'CADDED Software (Mechanical)',
    titleShort: 'CADDED Mech',
    category: 'Mechanical',
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD', 'SolidWorks', 'CATIA', 'CNC'],
    colorLight: 'from-orange-500/10 to-orange-600/5',
    colorDark: 'from-orange-500 to-orange-700',
    iconColor: 'text-orange-500 bg-orange-500/10',
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500',
    desc: 'Master mechanical systems engineering with hands-on AutoCAD 2D drafts, SolidWorks parts, CATIA shape designs, and CNC G-code programming.',
    descShort: 'Master AutoCAD 2D, SolidWorks modeling, CATIA surfacing, and CNC G-code programs.',
    icon: Wrench,
    syllabus: [
      { order: 1, title: 'AutoCAD 2D Drafting & Interface', details: 'AutoCAD interface, coordinate systems, 2D drafting tools, layers, and dimensions.' },
      { order: 2, title: 'SolidWorks Part Modeling & Features', details: 'Parametric modeling, sketches, relations, extrude, revolve, and reference geometry.' },
      { order: 3, title: 'CATIA Surface Design & Shape Design', details: 'Wireframe, surfaces workbench, sweeps, lofts, joins, and splines.' },
      { order: 4, title: 'CNC Code Architectures & Operations', details: 'CNC G-code & M-code programming, toolpaths, and machining dry runs.' },
      { order: 5, title: 'Integrated Assembly Project', details: 'Assemblies design, mates constraints, BOM creation, and mechanical blueprinting.' }
    ]
  },
  {
    id: 'CADDED_Civil',
    title: 'CADDED Software (Civil/Architecture)',
    titleShort: 'CADDED Civil',
    category: 'Civil',
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD Civil', '3DS Max', 'Google SketchUp', 'Revit'],
    colorLight: 'from-emerald-500/10 to-emerald-600/5',
    colorDark: 'from-emerald-500 to-emerald-700',
    iconColor: 'text-emerald-500 bg-emerald-500/10',
    textColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    desc: 'Master civil site drafting plans in AutoCAD Civil, 3DS Max architectural visualizations, Google SketchUp dynamic components, and Revit BIM structural analytical grids.',
    descShort: 'Master AutoCAD Civil site plans, 3DS Max render visuals, SketchUp models, and Revit BIM structural grid designs.',
    icon: Building2,
    syllabus: [
      { order: 1, title: 'AutoCAD Civil Drafting & Residential Plans', details: 'Civil layouts, drawing standard guidelines, floor plans, sections, and elevations.' },
      { order: 2, title: '3DS Max Architectural Rendering & Visuals', details: 'Poly modeling, materials mapping, textures, V-Ray/Arnold setup, and camera views.' },
      { order: 3, title: 'Google SketchUp Rapid 3D Prototyping', details: 'Push/pull, components, landscape design, and rapid retail space prototyping.' },
      { order: 4, title: 'Revit Structural Detailing & Analysis', details: 'Slabs, foundations, columns, beams, reinforcement detailing, and grid loads.' },
      { order: 5, title: 'Revit Architecture BIM Modeling & schedules', details: 'Walls, roofs, doors/windows placement, custom families, schedules, and sheets.' },
      { order: 6, title: 'Integrated Architectural Blueprint Project', details: 'G+3 building design, structural load linkage, viewports sheet compilation.' }
    ]
  }
];