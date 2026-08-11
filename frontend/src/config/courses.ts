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
    desc: 'Master C from first principles — syntax, memory management, pointers, data structures, file I/O, and systems-level thinking — with 20 deep sections and hands-on quizzes.',
    descShort: 'Learn C from the ground up: pointers, memory, structures, and algorithms.',
    icon: Code,
    syllabus: [
      { order: 1, title: 'C Foundations & Environment Setup', details: 'Why C matters, the compile pipeline, tools, and the anatomy of a C program.' },
      { order: 2, title: 'Types, Operators & Control Flow', details: 'Data types, variables, operators, printf/scanf I/O, conditionals, loops, and functions.' },
      { order: 3, title: 'Pointers & Memory Management', details: 'Addresses, dereferencing, pointer arithmetic, arrays & strings, and the heap with malloc/free.' },
      { order: 4, title: 'Structures, Unions & File I/O', details: 'Grouping data with structs, typedef and unions, plus formatted and binary file handling.' },
      { order: 5, title: 'Preprocessor & Data Structures', details: 'Macros, header guards, linked lists, stacks, queues, and sorting/searching algorithms.' },
      { order: 6, title: 'Capstone & Certification Prep', details: 'Design a complete C project, test it like a professional, and revise for the final exam.' }
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
    desc: 'Master C++ & OOP for embedded systems — classes, RAII, templates, STL, and modern C++ — with 20 deep sections and hands-on quizzes.',
    descShort: 'Master modern C++ from first principles: OOP, RAII, templates, STL, and embedded patterns.',
    icon: Box,
    syllabus: [
      { order: 1, title: 'C++ Foundations & Compilation Model', details: 'Why C++ still powers the world, the compile pipeline, C++ vs C, namespaces, and basic syntax.' },
      { order: 2, title: 'Variables, Types & Operators', details: 'Primitive types, const/constexpr, type conversions, operators, and expression evaluation.' },
      { order: 3, title: 'Control Flow & I/O', details: 'iostream input/output, formatting, conditional statements, switch, and for/while/do-while loops.' },
      { order: 4, title: 'Functions & Containers', details: 'Functions, default & overloaded args, arrays, std::array, and std::string vs C-strings.' },
      { order: 5, title: 'Object-Oriented Programming', details: 'Classes & objects, access specifiers, constructors, destructors, and RAII.' },
      { order: 6, title: 'Inheritance, Polymorphism & Advanced OOP', details: 'Inheritance & composition, virtual functions, operator overloading, and friends.' },
      { order: 7, title: 'Templates & The Standard Library', details: 'Function/class templates, STL containers, iterators, algorithms, and smart pointers.' },
      { order: 8, title: 'Modern C++ & Embedded Project', details: 'Move semantics and C++11/14/17/20 features, culminating in a complete embedded C++ project.' }
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
    desc: 'Connect physical systems with ESP microcontrollers, ADCs, custom serial buses, MQTT client protocols, and remote cloud metrics — with 20 deep sections and hands-on quizzes.',
    descShort: 'Connect physical systems with ESP microcontrollers, MQTT protocols, and cloud services.',
    icon: Wifi,
    syllabus: [
      { order: 1, title: 'IoT Foundations & Architecture', details: 'What IoT means, the four-layer stack, edge/fog/cloud, and designing a system architecture.' },
      { order: 2, title: 'Sensors, Signals & Actuators', details: 'Sensors and transducers, signal conditioning, ADCs/DACs, and driving motors, relays, and servos.' },
      { order: 3, title: 'Microcontrollers & ESP32', details: 'MCU vs microprocessor, Arduino programming, and the ESP32 deep dive: cores, WiFi, BLE, ADC, timers, and low-power.' },
      { order: 4, title: 'Serial Communication Protocols', details: 'UART, I2C, and SPI in depth — wiring, addressing, parsing protocols, and debugging with a logic analyzer.' },
      { order: 5, title: 'Networking & Web Protocols', details: 'IP/TCP/UDP on an MCU, reliable WiFi, mDNS, HTTP/REST/JSON, and WebSockets.' },
      { order: 6, title: 'MQTT & Cloud Platforms', details: 'Publish/subscribe, topics and wildcards, QoS, retained + Last Will, and ThingsBoard/AWS IoT dashboards and RPC.' },
      { order: 7, title: 'Data, Security & Applications', details: 'On-device storage, time-series databases, telemetry reliability, IoT security (TLS, secure boot, OTA), and smart home + IIoT.' },
      { order: 8, title: 'Capstone Project & Certification', details: 'Requirements, hardware and wiring, firmware architecture, testing, documentation, and the final exam.' }
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
      { order: 1, title: 'Embedded Foundations & Real-Time Concepts', details: 'What embedded systems really are, real-time deadlines, the development environment, and reading datasheets and schematics.' },
      { order: 2, title: 'Embedded Hardware: Memory, Clocks & Power', details: 'Memory maps (flash, SRAM, registers), oscillators/PLLs and clock trees, power rails and brownouts, and reset/boot/startup code.' },
      { order: 3, title: 'Embedded Software & Processor Architectures', details: 'C for microcontrollers, toolchains and GDB, microprocessors, RISC vs CISC, von Neumann vs Harvard, and the stack/heap runtime.' },
      { order: 4, title: 'Microcontrollers: AVR & ARM', details: 'The system-on-a-chip and its peripherals, memory-mapped I/O, AVR registers/timers/interrupts/UART, and Cortex-M, NVIC, Thumb-2, and CMSIS.' },
      { order: 5, title: 'Peripherals in Depth: GPIO, Timers & Interrupts', details: 'GPIO modes and debounce, timers/prescalers/PWM/input capture, SysTick, interrupt latency, race conditions, and ISR discipline.' },
      { order: 6, title: 'Serial Buses: UART, SPI & I2C', details: 'UART wiring/baud and DMA, framing protocols and printf instrumentation, SPI four-wire bus and modes, and I2C addressing, open-drain, and failure modes.' },
      { order: 7, title: 'Analog, RTOS & Concurrency', details: 'ADC sampling, aliasing and the Nyquist rule, DMA-streamed sampling, DAC, RTOS tasks/queues/semaphores/mutexes, and the classic RTOS bugs.' },
      { order: 8, title: 'Project Lifecycle & Certification', details: 'Requirements, architecture, real-time scheduling, power budgeting, coding standards, static analysis, testing/CI, documentation, and the final demo + exam.' }
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
    desc: 'Build production-ready websites from scratch — HTML, CSS, JavaScript, and a deployed portfolio — with 20 deep sections and hands-on quizzes.',
    descShort: 'Build production-ready websites with HTML, CSS, JavaScript, and a deployed portfolio.',
    icon: Globe,
    syllabus: [
      { order: 1, title: 'HTML5 & Web Fundamentals', details: 'How the web works, page anatomy, headings, lists, links, media, forms, and semantic tags.' },
      { order: 2, title: 'CSS3 & Modern Layouts', details: 'Selectors, the box model, units, flexbox, grid, transitions, and animations.' },
      { order: 3, title: 'Responsive Design & Tailwind', details: 'Media queries, mobile-first thinking, and utility-first Tailwind CSS.' },
      { order: 4, title: 'JavaScript Fundamentals', details: 'Variables, types, operators, control flow, functions, and array methods.' },
      { order: 5, title: 'DOM, Events & Async JS', details: 'Manipulating the DOM, event handlers, promises, and fetching real APIs.' },
      { order: 6, title: 'Portfolio Project Build', details: 'Plan, build, style, and add interactivity to a real deployed portfolio.' },
      { order: 7, title: 'Git, Deployment & Certification', details: 'Version control, static hosting, custom domains, and the final performance/accessibility audit.' }
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
    desc: 'Master Python from first principles to a shipped CLI tool — syntax, data structures, OOP, pandas & Matplotlib, automation, and a tested, packaged project — with 20 deep sections and hands-on quizzes.',
    descShort: 'Master Python from syntax to a shipped CLI tool: data, automation, and real projects.',
    icon: Terminal,
    syllabus: [
      { order: 1, title: 'Python Foundations & Setup', details: 'Why Python, interpreted execution and the REPL, installing Python, IDEs, and your first script.' },
      { order: 2, title: 'Variables, Operators & Conditionals', details: 'Dynamic typing, numbers and strings, operators, type conversion, and if/elif/else logic.' },
      { order: 3, title: 'Loops, Functions & Data Structures', details: 'for/while loops and comprehensions, functions with defaults and *args, lists and tuples.' },
      { order: 4, title: 'Dictionaries, Strings & Files', details: 'Key-value storage, sets and counters, string methods and f-strings, reading and writing files.' },
      { order: 5, title: 'Errors, OOP & Modules', details: 'Exception handling, classes and inheritance, modules/packages/pip, and decorators.' },
      { order: 6, title: 'Data Analysis & Visualization', details: 'Pandas DataFrames, grouping and aggregation, and charts with Matplotlib.' },
      { order: 7, title: 'Automation & Web Data', details: 'pathlib and file automation, CSV/JSON handling, HTTP requests, and scraping with BeautifulSoup.' },
      { order: 8, title: 'Project: A Real CLI Tool', details: 'Planning and design, argparse, user-friendly errors, pytest testing, packaging, and final review.' }
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
    desc: 'Learn relational databases end-to-end — queries, joins, normalization, transactions, security, and real projects — with 20 deep sections and hands-on quizzes.',
    descShort: 'Learn relational databases end-to-end: queries, joins, design, and real projects.',
    icon: Database,
    syllabus: [
      { order: 1, title: 'Database Foundations & Relational Concepts', details: 'What databases are, spreadsheets vs databases, tables/rows/columns, keys, and relationships.' },
      { order: 2, title: 'SELECT, WHERE & Sorting', details: 'SELECT anatomy, WHERE filtering, NULLs, aliases, IN/BETWEEN/LIKE, AND/OR/NOT, ORDER BY, and pagination.' },
      { order: 3, title: 'Aggregates, GROUP BY & HAVING', details: 'COUNT/SUM/AVG/MIN/MAX, DISTINCT, scalar functions, GROUP BY, HAVING, and multi-column grouping.' },
      { order: 4, title: 'Joins & Subqueries', details: 'INNER/LEFT/FULL joins, self-joins, scalar subqueries, IN, correlated subqueries, and EXISTS.' },
      { order: 5, title: 'Schema Design & Normalization', details: 'Entity design, 1NF/2NF/3NF, CREATE TABLE, constraints, ALTER TABLE, and DROP/TRUNCATE.' },
      { order: 6, title: 'Data Manipulation, Indexes & Performance', details: 'INSERT/UPDATE/DELETE, ON CONFLICT upserts, indexes, composite indexes, and EXPLAIN plans.' },
      { order: 7, title: 'Views, Transactions & Security', details: 'Views, materialized views, stored procedures, triggers, ACID in depth, SQL injection, privileges, and backups.' },
      { order: 8, title: 'Real Projects & Query Optimization', details: 'Library mini-project, schema polish, migrations, optimizing queries, caching, and the capstone booking system.' }
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
      { order: 1, title: 'AutoCAD Workspace & Drawing Foundations', details: 'Model space, drawing units and coordinate entry, layers and properties, and precision input (grid, snap, ortho).' },
      { order: 2, title: 'AutoCAD 2D Drafting, Annotating & Plotting', details: 'Draw and edit commands, object snaps and fillets, dimensions and styles, leaders, tolerances, layouts, and plotting to scale.' },
      { order: 3, title: 'AutoCAD Blocks & Drafting Productivity', details: 'Blocks, attributes, dynamic blocks, tool palettes, design center, templates, and drafting standards.' },
      { order: 4, title: 'SolidWorks Part Modeling & Features', details: 'Sketching and geometric constraints, fully-defined sketches, extrude/revolve/loft features, and design intent.' },
      { order: 5, title: 'SolidWorks Assemblies & Configurations', details: 'Standard and advanced mates, assembly motion and interference, configurations, and design tables.' },
      { order: 6, title: 'CATIA Part Design & Generative Surfacing', details: 'Sketcher and part design workbench, wireframe geometry, surface creation and editing, and the GSD studio.' },
      { order: 7, title: 'CNC Programming: G-Code & M-Code', details: 'Axis systems and coordinates, G-code motion and canned cycles, M-code control, and toolpath planning and simulation.' },
      { order: 8, title: 'Integrated Project, GD&T & Certification', details: 'Multi-part assembly project, production drawings and GD&T, BOM and documentation, and the final submission + exam.' }
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
      { order: 1, title: 'AutoCAD Civil Setup & Site Plans', details: 'Civil drawing units and layers, coordinate and survey point entry, drafting the site boundary, utilities and setbacks, spot elevations and contours, and dimensioning site plans.' },
      { order: 2, title: 'Residential Plans, Sections & Plotting', details: 'Wall layouts and room planning, doors/windows/openings, furniture and appliance layout, sections and elevations, hatching and annotations, title blocks, and municipal plotting.' },
      { order: 3, title: '3ds Max Architectural Modeling', details: 'The 3ds Max interface and viewport navigation, primitives/splines/editable polys, building shells, modeling details, materials and texturing, UVW mapping and PBR materials.' },
      { order: 4, title: '3ds Max Lighting, Rendering & Post', details: 'Daylight/sun/sky and photometric lights, three-point lighting, camera composition, render settings and quality, V-Ray/Mental Ray workflows, and Photoshop post-production.' },
      { order: 5, title: 'SketchUp Modeling & Components', details: 'Core modeling tools (push/pull, offset, follow me), groups vs components, the component library and dynamic components, the outliner and layers, and sandbox terrain.' },
      { order: 6, title: 'SketchUp Extensions & Layout Presentation', details: 'The extension warehouse and key extensions, Ruby console and macros, DWG/OBJ/3DS import-export, Layout viewports and scaled drawings, annotations and callouts, and PDF presentation.' },
      { order: 7, title: 'Revit Structural Detailing & Analysis', details: 'Revit Structure templates and grids, structural columns and load-bearing walls, foundations and structural framing, slabs and openings, rebar placement and cover, structural schedules, and sheet documentation.' },
      { order: 8, title: 'Revit Architecture BIM, Schedules & Delivery', details: 'Levels/grids/project north, wall types and curtain walls, doors/windows and the family editor, floors/roofs/stairs, schedules and material takeoffs, view/sheet coordination, clash checks, and final BIM delivery.' }
    ]
  }
];