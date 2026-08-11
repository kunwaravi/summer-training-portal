import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { 
  LogIn, UserPlus, Mail, Lock, User, GraduationCap, 
  ShieldCheck, CheckCircle2, Send, MessageSquare, BookOpen, 
  Cpu, Code2, Server, Wifi, Terminal, Database, 
  Trophy, ArrowRight, Zap, Sparkles,
  ChevronDown, ChevronUp, Wrench, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/atoms/Button';
import FormField from '../components/molecules/FormField';
import Card from '../components/atoms/Card';

const courseDetails = [
  {
    id: 'C',
    title: 'C & Systems Programming',
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Programming', 'Memory & Pointers'],
    color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30',
    icon: Code2,
    colSpan: 'md:col-span-3',
    desc: 'Master C from first principles — syntax, memory management, pointers, data structures, file I/O, and systems-level thinking.',
    syllabus: [
      { week: 1, title: 'C Foundations', details: 'Why C matters, the compile pipeline, environment setup, and program anatomy', milestone: 'Run your first compiled program' },
      { week: 2, title: 'Basics & Control Flow', details: 'Tokens, data types, operators, I/O, conditionals, loops, and functions', milestone: 'Write a temperature-converter' },
      { week: 3, title: 'Pointers & Memory', details: 'Addresses, dereferencing, pointer arithmetic, arrays, strings, and malloc/free', milestone: 'Build a dynamic string library' },
      { week: 4, title: 'Structures & File I/O', details: 'Structs, unions, typedef, plus formatted and binary file handling', milestone: 'Student records with file save/load' },
      { week: 5, title: 'Preprocessor & DSA', details: 'Macros, header guards, linked lists, stacks, queues, sorting & searching', milestone: 'Implement a linked list stack' },
      { week: 6, title: 'Capstone & Certification', details: 'Design a full C project, test like a professional, and revise for the exam', milestone: 'Ship a complete C application' }
    ]
  },
  {
    id: 'C++',
    title: 'C++ & OOP for Embedded Systems',
    difficulty: 'Intermediate',
    tags: ['Object-Oriented', 'High Performance'],
    color: 'from-purple-500/20 via-purple-600/10 to-transparent border-purple-500/30',
    icon: Cpu,
    colSpan: 'md:col-span-3',
    desc: 'Master C++ & OOP for embedded systems — classes, RAII, templates, STL, and modern C++ — with 20 deep sections and hands-on quizzes.',
    syllabus: [
      { week: 1, title: 'C++ Foundations & Compilation Model', details: 'Why C++ still powers the world, the compile pipeline, C++ vs C, namespaces, and basic syntax', milestone: 'A compiled hello-world with a Makefile' },
      { week: 2, title: 'Variables, Types & Operators', details: 'Primitive types, const/constexpr, type conversions, operators, and expression evaluation', milestone: 'A const/constexpr type lab' },
      { week: 3, title: 'Control Flow & I/O', details: 'iostream input/output, formatting, conditional statements, switch, and for/while/do-while loops', milestone: 'A formatted iostream report' },
      { week: 4, title: 'Functions & Containers', details: 'Functions, default & overloaded args, arrays, std::array, and std::string vs C-strings', milestone: 'A std::string text processor' },
      { week: 5, title: 'Object-Oriented Programming', details: 'Classes & objects, access specifiers, constructors, destructors, and RAII', milestone: 'An RAII resource guard' },
      { week: 6, title: 'Inheritance, Polymorphism & Advanced OOP', details: 'Inheritance & composition, virtual functions, operator overloading, and friends', milestone: 'A virtual-dispatch shape library' },
      { week: 7, title: 'Templates & The Standard Library', details: 'Function/class templates, STL containers, iterators, algorithms, and smart pointers', milestone: 'An STL container + smart-pointer demo' },
      { week: 8, title: 'Modern C++ & Embedded Project', details: 'Move semantics and C++11/14/17/20 features, culminating in a complete embedded C++ project', milestone: 'A complete embedded C++ project + certification' }
    ]
  },
  {
    id: 'IoT',
    title: 'IoT & Smart Interfacing Solutions',
    difficulty: 'Intermediate to Advanced',
    tags: ['Microcontrollers', 'Cloud Services'],
    color: 'from-teal-500/20 via-teal-600/10 to-transparent border-teal-500/30',
    icon: Wifi,
    colSpan: 'md:col-span-2',
    desc: 'Connect physical systems with ESP microcontrollers, ADCs, custom serial buses, MQTT client protocols, and remote cloud metrics — with 20 deep sections and hands-on quizzes.',
    syllabus: [
      { week: 1, title: 'Introduction to IoT & Smart Systems', details: 'What IoT means, smart-system loops, and real-world use cases', milestone: 'Define an IoT use case end to end' },
      { week: 2, title: 'IoT Architecture & Reference Model', details: 'Four-layer stack, edge/fog/cloud, and designing a system architecture', milestone: 'Draw and justify a system architecture' },
      { week: 3, title: 'Sensors & Transducers', details: 'Analog/digital sensors, ADCs, voltage dividers, wiring, and calibration', milestone: 'Read and calibrate a real sensor' },
      { week: 4, title: 'Signal Conditioning, ADC & DAC', details: 'Amplify, level-shift, filter; sampling theory; PWM/DAC output; noise grounding', milestone: 'Build a clean signal chain' },
      { week: 5, title: 'Actuators & Output Control', details: 'DC motors and H-bridges, relays for AC loads, PWM speed, and servo position', milestone: 'Drive a motor and a servo safely' },
      { week: 6, title: 'Microcontrollers & Development Boards', details: 'MCU vs microprocessor, board landscape, GPIO architecture, board selection', milestone: 'Pick the right board for a project' },
      { week: 7, title: 'Arduino Programming Fundamentals', details: 'Sketch structure, buttons and debounce, analog input, PWM output, serial logging', milestone: 'Build a button + LED + serial sketch' },
      { week: 8, title: 'ESP32 Deep Dive', details: 'Dual cores, WiFi/BLE, ADC/DAC interfacing, timers, RTC, and low-power modes', milestone: 'Run a deep-sleep battery node' },
      { week: 9, title: 'Serial Communication: UART', details: 'UART wiring, baud/parity, NMEA & AT parsing, and logic-analyzer debugging', milestone: 'Decode a GPS NMEA stream' },
      { week: 10, title: 'Serial Communication: I2C', details: 'Two-wire bus, addressing, register reads, pull-ups, and bus troubleshooting', milestone: 'Scan and read an I2C sensor' },
      { week: 11, title: 'Serial Communication: SPI', details: 'Four-wire bus, chip select, SPI vs I2C, modes, and timing debugging', milestone: 'Drive an SPI display or SD card' },
      { week: 12, title: 'Networking & WiFi Connectivity', details: 'IP/TCP/UDP on an MCU, WPA2/WPA3, reconnects and watchdogs, mDNS hostnames', milestone: 'Build a self-healing WiFi node' },
      { week: 13, title: 'HTTP, REST & WebSockets', details: 'HTTP from a microcontroller, REST + JSON, WebSockets, choosing the API style', milestone: 'Serve and consume a REST API' },
      { week: 14, title: 'MQTT Protocol Deep Dive', details: 'Pub/sub, topics and wildcards, QoS, retained + Last Will, full device pipeline', milestone: 'Publish telemetry through a broker' },
      { week: 15, title: 'Cloud Platforms & Dashboards', details: 'ThingsBoard/AWS IoT, provisioning, telemetry ingress, dashboards, alerts, RPC', milestone: 'Live telemetry on a dashboard' },
      { week: 16, title: 'Data Collection, Storage & Telemetry', details: 'NVS/LittleFS/SD, time-series databases, reliability, and anomaly visualisation', milestone: 'Build a trustworthy data pipeline' },
      { week: 17, title: 'IoT Security Fundamentals', details: 'Threat model, auth and secrets, TLS/certificates, secure boot, OTA, hardening', milestone: 'Harden a device end to end' },
      { week: 18, title: 'Smart Home Systems & Integration', details: 'Hub pattern, Zigbee/Z-Wave/BLE/WiFi, voice assistants, hub project build', milestone: 'Bridge a device into a smart home' },
      { week: 19, title: 'Industrial IoT & Real-World Applications', details: 'IIoT differences, Modbus/OPC-UA/MQTT, predictive maintenance, SCADA/digital twins', milestone: 'Translate a factory protocol' },
      { week: 20, title: 'Building a Complete IoT Project + Certification', details: 'Requirements, hardware, firmware architecture, testing, documentation, exam', milestone: 'Ship a documented, tested project' }
    ]
  },
  {
    id: 'Embedded',
    title: 'Embedded Systems & Real-Time OS',
    difficulty: 'Advanced',
    tags: ['RTOS Kernels', 'Hardware Interrupts'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Server,
    colSpan: 'md:col-span-4',
    desc: 'Implement low-level peripheral drivers, nested vectored interrupts, RTOS task scheduling, semaphores, and power configurations.',
    syllabus: [
      { week: 1, title: 'Introduction to Embedded Systems', details: 'What embedded systems really are, real-time deadlines, the development environment, datasheets and schematics', milestone: 'Define a real-time deadline in ms' },
      { week: 2, title: 'Embedded Hardware', details: 'Memory maps (flash, SRAM, registers), clocks and PLLs, power rails and brownouts, reset and boot/startup', milestone: 'Trace a boot from reset to main()' },
      { week: 3, title: 'Embedded Software', details: 'C for microcontrollers, toolchains and Makefiles, GDB/SWD debugging, firmware design patterns', milestone: 'Build a flashable firmware from a Makefile' },
      { week: 4, title: 'Microprocessors', details: 'Fetch-decode-execute, RISC vs CISC, von Neumann vs Harvard, the stack and the heap', milestone: 'Walk the fetch-decode-execute cycle' },
      { week: 5, title: 'Microcontrollers', details: 'The system-on-a-chip, the peripheral bus, the peripheral zoo, memory-mapped I/O', milestone: 'Map the MCU peripherals and buses' },
      { week: 6, title: 'AVR Basics', details: 'Register file, timers and PWM, interrupts and the SREG I-flag, building a UART driver', milestone: 'Write a register-level AVR UART driver' },
      { week: 7, title: 'ARM Basics', details: 'Cortex-M registers, the NVIC, Thumb and Thumb-2, CMSIS', milestone: 'Configure an NVIC interrupt with CMSIS' },
      { week: 8, title: 'GPIO Programming', details: 'GPIO modes and electricals, read-modify-write atomicity, debounce, a simple GPIO HAL', milestone: 'Build a clean GPIO HAL' },
      { week: 9, title: 'Timers', details: 'Counters and prescalers, PWM, input capture, SysTick', milestone: 'Generate exact PWM with a compare unit' },
      { week: 10, title: 'Interrupts', details: 'Interrupt latency, race conditions, priorities and inversion, ISR discipline', milestone: 'Write a race-free ISR with a flag' },
      { week: 11, title: 'UART Communication', details: 'Wiring, framing and baud rate, polling vs interrupt vs DMA, framing protocols, printf over UART', milestone: 'Decode a framed UART packet' },
      { week: 12, title: 'SPI Communication', details: 'Four wires and many slaves, master-slave and CS timing, real devices, debugging SPI', milestone: 'Talk to an SPI flash device' },
      { week: 13, title: 'I2C Communication', details: 'Two wires, addresses and open-drain, register-mapped sensors, failure modes, I2C vs SPI', milestone: 'Read an I2C sensor register map' },
      { week: 14, title: 'ADC and DAC', details: 'From voltage to a number, sampling and aliasing, DMA-streamed ADC, the DAC', milestone: 'Sample a signal without aliasing' },
      { week: 15, title: 'RTOS Basics', details: 'Tasks and the scheduler, queues, semaphores and mutexes, classic RTOS bugs', milestone: 'Build a two-task RTOS app with a queue' },
      { week: 16, title: 'Embedded Project Design', details: 'Requirements, architecture, real-time scheduling and WCET, power budgeting', milestone: 'Write requirements plus an architecture diagram' },
      { week: 17, title: 'Development', details: 'Coding standards and review, static analysis, testing layers, heisenbugs', milestone: 'Run static analysis on firmware' },
      { week: 18, title: 'Testing', details: 'The testing pyramid, the seam pattern, CI, coverage', milestone: 'Add host-side unit tests to firmware' },
      { week: 19, title: 'Documentation', details: 'The design documents that matter, reading datasheets, readable docs, the decision log', milestone: 'Write a decision record for a design choice' },
      { week: 20, title: 'Final Submission', details: 'Project planning, the live demo, the release review, the engineers mindset and certification', milestone: 'Deliver a documented, tested project plus the exam' }
    ]
  },
  {
    id: 'WebDesign',
    title: 'Web Design & Frontend Development',
    difficulty: 'Beginner',
    tags: ['HTML/CSS', 'Responsive Layouts'],
    color: 'from-pink-500/20 via-pink-600/10 to-transparent border-pink-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    desc: 'Build production-ready websites from scratch — HTML, CSS, JavaScript, and a deployed portfolio.',
    syllabus: [
      { week: 1, title: 'HTML5 & Web Fundamentals', details: 'How the web works, page anatomy, headings, links, media, forms, and semantic tags', milestone: 'Your first HTML page in the browser' },
      { week: 2, title: 'CSS3 & Modern Layouts', details: 'Selectors, the box model, units, flexbox, grid, transitions, and animations', milestone: 'A flexbox navigation + card layout' },
      { week: 3, title: 'Responsive Design & Tailwind', details: 'Media queries, mobile-first thinking, and utility-first Tailwind CSS', milestone: 'A fully responsive single page' },
      { week: 4, title: 'JavaScript Fundamentals', details: 'Variables, types, operators, control flow, functions, and array methods', milestone: 'A functions & array-methods toolkit' },
      { week: 5, title: 'DOM, Events & Async JS', details: 'Manipulating the DOM, event handlers, promises, and fetching real APIs', milestone: 'A fetch-driven live data view' },
      { week: 6, title: 'Portfolio Project Build', details: 'Plan, build, style, and add interactivity to a real deployed portfolio', milestone: 'A polished, responsive portfolio' },
      { week: 7, title: 'Git, Deployment & Certification', details: 'Version control, static hosting, custom domains, and the final audit', milestone: 'A deployed live portfolio URL' }
    ]
  },
  {
    id: 'Python',
    title: 'Python Programming & Scripting',
    difficulty: 'Beginner to Intermediate',
    tags: ['Data Analysis', 'Automation Scripting'],
    color: 'from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    desc: 'Master Python from first principles to a shipped CLI tool — syntax, data structures, OOP, files & automation, pandas & Matplotlib, web data, and a tested, packaged project — with 20 deep sections and hands-on quizzes.',
    syllabus: [
      { week: 1, title: 'Python Foundations & Setup', details: 'Why Python, interpreted execution and the REPL, installing Python, IDEs, and your first script', milestone: 'Your first Python script in the REPL' },
      { week: 2, title: 'Variables, Operators & Conditionals', details: 'Dynamic typing, numbers and strings, operators, type conversion, and if/elif/else logic', milestone: 'A number-guessing conditionals game' },
      { week: 3, title: 'Loops, Functions & Data Structures', details: 'for/while loops and comprehensions, functions with defaults and *args, lists and tuples', milestone: 'A list-processing stats toolkit' },
      { week: 4, title: 'Dictionaries, Strings & Files', details: 'Key-value storage, sets and counters, string methods and f-strings, reading and writing files', milestone: 'A word-counter that reads a file' },
      { week: 5, title: 'Errors, OOP & Modules', details: 'Exception handling, classes and inheritance, modules/packages/pip, and decorators', milestone: 'A small class-based library app' },
      { week: 6, title: 'Data Analysis & Visualization', details: 'Pandas DataFrames, grouping and aggregation, and charts with Matplotlib', milestone: 'A pandas analysis + Matplotlib chart' },
      { week: 7, title: 'Automation & Web Data', details: 'pathlib and file automation, CSV/JSON handling, HTTP requests, and scraping with BeautifulSoup', milestone: 'An automated CSV/JSON pipeline with a scraper' },
      { week: 8, title: 'Project: A Real CLI Tool', details: 'Planning and design, argparse, user-friendly errors, pytest testing, packaging, and final review', milestone: 'A tested, packaged CLI tool' }
    ]
  },
  {
    id: 'SQL',
    title: 'Database Management & SQL',
    difficulty: 'Beginner to Intermediate',
    tags: ['Relational DB', 'Query Optimizations'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Database,
    colSpan: 'md:col-span-2',
    desc: 'Learn relational databases end-to-end — queries, joins, normalization, transactions, security, and real projects — with 20 deep sections and hands-on quizzes.',
    syllabus: [
      { week: 1, title: 'Database Foundations & Relational Concepts', details: 'What databases are, spreadsheets vs databases, tables/rows/columns, keys, and relationships', milestone: 'A keyed, connected ER sketch' },
      { week: 2, title: 'SELECT, WHERE & Sorting', details: 'SELECT anatomy, WHERE filtering, NULLs, aliases, IN/BETWEEN/LIKE, AND/OR/NOT, ORDER BY, and pagination', milestone: 'A filtered + sorted query toolkit' },
      { week: 3, title: 'Aggregates, GROUP BY & HAVING', details: 'COUNT/SUM/AVG/MIN/MAX, DISTINCT, scalar functions, GROUP BY, HAVING, and multi-column grouping', milestone: 'A per-city analytics summary' },
      { week: 4, title: 'Joins & Subqueries', details: 'INNER/LEFT/FULL joins, self-joins, scalar subqueries, IN, correlated subqueries, and EXISTS', milestone: 'A joined customer-orders report' },
      { week: 5, title: 'Schema Design & Normalization', details: 'Entity design, 1NF/2NF/3NF, CREATE TABLE, constraints, ALTER TABLE, and DROP/TRUNCATE', milestone: 'A normalized 3NF schema' },
      { week: 6, title: 'Data Manipulation, Indexes & Performance', details: 'INSERT/UPDATE/DELETE, ON CONFLICT upserts, indexes, composite indexes, and EXPLAIN plans', milestone: 'An EXPLAIN-proven indexed query' },
      { week: 7, title: 'Views, Transactions & Security', details: 'Views, materialized views, stored procedures, triggers, ACID in depth, SQL injection, privileges, and backups', milestone: 'An atomic, injection-safe module' },
      { week: 8, title: 'Real Projects & Query Optimization', details: 'Library mini-project, schema polish, migrations, optimizing queries, caching, and the capstone booking system', milestone: 'A reproducible booking-system DB' }
    ]
  },
  {
    id: 'CADDED_Mech',
    title: 'CADDED Software (Mechanical)',
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD 2D', 'SolidWorks', 'CATIA Surfaces', 'CNC G-Code'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Wrench,
    colSpan: 'md:col-span-3',
    desc: 'Master mechanical systems engineering with AutoCAD 2D drafts, SolidWorks parts modeling, CATIA surfacing, and CNC G-code toolpath programming.',
    syllabus: [
      { week: 1, title: 'AutoCAD Workspace, Units & Layers', details: 'Model space, drawing units, layers, and precision input (grid, snap, ortho)', milestone: 'Set up a layered template drawing' },
      { week: 2, title: '2D Drawing & Editing Commands', details: 'Line/polyline/circle/arc, trim/extend/offset/mirror, fillets, object snaps', milestone: 'Draw and edit a flange profile' },
      { week: 3, title: 'Dimensions, Annotations & Plotting', details: 'Dimension styles, text and leaders, tolerances, layouts and viewports, plotting', milestone: 'Dimension and plot a part to scale' },
      { week: 4, title: 'Blocks, Templates & Productivity', details: 'Blocks, attributes, dynamic blocks, tool palettes, templates and standards', milestone: 'Build a reusable block library' },
      { week: 5, title: 'SolidWorks Sketching & Constraints', details: 'Sketch entities, geometric relations, fully-defined sketches, reference geometry', milestone: 'Make a fully-defined sketch' },
      { week: 6, title: 'Parametric Features: Extrude, Revolve & Loft', details: 'Extrudes, revolves, lofts, sweeps, feature order and design intent', milestone: 'Model a bracket from a sketch' },
      { week: 7, title: 'SolidWorks Assemblies & Mates', details: 'Component insertion, standard and advanced mates, motion and interference', milestone: 'Assemble and test a hinge' },
      { week: 8, title: 'Configurations & Design Tables', details: 'Configurations, design tables in Excel, global variables and equations', milestone: 'Drive a size family via a design table' },
      { week: 9, title: 'CATIA Sketcher & Part Design', details: 'Sketcher constraints, pad/pocket/shaft/groove, holes and threads', milestone: 'Build a CATIA part from constraints' },
      { week: 10, title: 'CATIA Surface Creation & Editing', details: 'Wireframe geometry, extruded/revolved/swept surfaces, trim/split/join, fillets', milestone: 'Create and join a surface body' },
      { week: 11, title: 'Generative Shape Design Studio', details: 'GSD workbench, lofts/fills/blends, control points, surface quality checks', milestone: 'Style a class-A surface' },
      { week: 12, title: 'Draft Analysis & Product Engineering', details: 'Draft analysis and parting lines, draft tool, thickness checks, packaging', milestone: 'Add draft and verify wall thickness' },
      { week: 13, title: 'CNC Axis Systems & Coordinates', details: 'Machine axes, work coordinates, part zero and offsets, workholding', milestone: 'Set up a work coordinate system' },
      { week: 14, title: 'G-Code Commands & Canned Cycles', details: 'Block/word structure, G00/G01/G02/G03 motion, canned cycles, compensation', milestone: 'Write a drilling cycle by hand' },
      { week: 15, title: 'M-Code & Machine Control', details: 'Spindle/coolant codes, safe startup, subprograms and macros, zero return', milestone: 'Build a safe program header' },
      { week: 16, title: 'Toolpath Planning & Simulation', details: 'Tool and feed selection, roughing vs finishing, simulation, post-processing', milestone: 'Simulate and verify a toolpath' },
      { week: 17, title: 'Multi-Part Assembly Project', details: 'Planning, modeling mating parts, assembly fits, motion and adjustability', milestone: 'Design a mating part pair' },
      { week: 18, title: 'Production Drawings & GD&T', details: '2D production drawings, section/detail/break views, GD&T and datums', milestone: 'Detail a part with GD&T' },
      { week: 19, title: 'Bill of Materials & Documentation', details: 'BOM, balloons and linked properties, PDF/DWG/DXF export, drawing sets', milestone: 'Publish a BOM and drawing set' },
      { week: 20, title: 'Final Submission & Design Review', details: 'Complete design workflow, review against requirements, final package, certification', milestone: 'Deliver a reviewed project + exam' }
    ]
  },
  {
    id: 'CADDED_Civil',
    title: 'CADDED Software (Civil/Architecture)',
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD Civil', '3DS Max Render', 'SketchUp', 'Revit BIM'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Building2,
    colSpan: 'md:col-span-3',
    desc: 'Master civil site plans in AutoCAD Civil, 3DS Max architectural renders, Google SketchUp layouts, and Revit BIM structural grid designs.',
    syllabus: [
      { week: 1, title: 'AutoCAD Civil Setup: Units, Layers & Site Data', details: 'Civil units and scales, layers and styles, coordinate and survey point entry, grids and drawing aids', milestone: 'Set up a civil drawing template' },
      { week: 2, title: 'Site Plans: Boundary, Utilities & Dimensions', details: 'Drafting the site boundary, utilities/setbacks/zoning, spot elevations and contours, dimensioning site plans', milestone: 'Draft a dimensioned site plan' },
      { week: 3, title: 'Residential Floor Plans', details: 'Wall layouts and room planning, doors/windows/openings, furniture and appliance layout, plan coordination', milestone: 'Draw a 2BHK floor plan' },
      { week: 4, title: 'Sections, Elevations & Municipal Plotting', details: 'Sections and elevations, hatching and annotations, title blocks, plotting for municipal submission', milestone: 'Plot sections and elevations for submission' },
      { week: 5, title: '3ds Max Modeling for Architecture', details: 'Interface and viewport navigation, primitives/splines/editable polys, building shells, modeling details', milestone: 'Model a building shell' },
      { week: 6, title: 'Materials & Texturing', details: 'Material editor and slots, diffuse/bump/specular maps, UVW mapping and real-world scale, PBR materials', milestone: 'Texture a villa with PBR maps' },
      { week: 7, title: 'Lighting Fundamentals', details: 'Daylight/sun/sky, photometric lights and shadows, three-point lighting, exterior vs interior setups', milestone: 'Light an interior scene' },
      { week: 8, title: 'Rendering & Post-Production', details: 'Camera setup and composition, render settings, V-Ray/Mental Ray workflow, Photoshop post-production', milestone: 'Produce a finished render' },
      { week: 9, title: 'SketchUp Core Modeling Tools', details: 'Interface and axes, push/pull/offset/follow me, groups/components/instances, styles and scenes', milestone: 'Build a rapid furniture mockup' },
      { week: 10, title: 'Components, Groups & Organization', details: 'Groups vs components, component library and dynamic components, outliner and layers, sandbox terrain', milestone: 'Organize a model with components' },
      { week: 11, title: 'Extensions & Workflow', details: 'Extension warehouse and key extensions, Ruby console and macros, DWG/OBJ/3DS exchange, rapid prototyping workflow', milestone: 'Script a modeling macro' },
      { week: 12, title: 'Layout & Presentation', details: 'Layout basics, viewports and scaled drawings, annotations/dimensions/callouts, exporting PDFs', milestone: 'Present a scaled Layout sheet' },
      { week: 13, title: 'Revit Structure Basics', details: 'Structure interface and template, levels/grids/project setup, structural columns and load-bearing walls, views', milestone: 'Set up a structural project' },
      { week: 14, title: 'Structural Elements & Detailing', details: 'Foundations and footings, structural framing beams/joists, slabs and openings, detailing notes/dimensions', milestone: 'Model a foundation grid' },
      { week: 15, title: 'Reinforcement & Schedules', details: 'Rebar placement and cover, rebar sets and bending, structural schedules and quantities, beam-column junctions', milestone: 'Reinforce a beam-column junction' },
      { week: 16, title: 'Documentation & Sheets', details: 'Sheet setup and title blocks, view placement, drafting views and line weights, PDF/DWG/BIM360 publishing', milestone: 'Publish a structural drawing set' },
      { week: 17, title: 'Revit Architecture: Levels, Grids & Walls', details: 'Architecture interface and template, levels/grids/project north, wall types/layers/curtain walls, wall openings', milestone: 'Lay out levels, grids and walls' },
      { week: 18, title: 'Doors, Windows & Families', details: 'Loading and placing doors/windows, system vs loadable families, family editor parameters, door/window schedules', milestone: 'Schedule doors and windows' },
      { week: 19, title: 'Floors, Roofs & Stairs', details: 'Floor types and sketching, footprint/extrusion/sloped roofs, stairs/landings/railings, ramps and openings', milestone: 'Model floors, roof and stairs' },
      { week: 20, title: 'Schedules, Sheets & Coordination', details: 'Material takeoffs and room schedules, views/sheets and drafting setup, links/clash/interference, final BIM delivery', milestone: 'Deliver a coordinated BIM package + exam' }
    ]
  }
];

const courseMetadata: Record<string, any> = {
  'C': {
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Electronics', 'Hardware Mapping'],
    color: 'from-blue-500/20 via-blue-600/10 to-transparent border-blue-500/30',
    icon: Code2,
    colSpan: 'md:col-span-3',
    milestones: {
      1: 'Program execution flow diagram',
      2: 'Function stack visual map',
      3: 'Custom heap allocator simulator',
      4: 'Virtual peripheral registers setup'
    }
  },
  'C++': {
    difficulty: 'Intermediate',
    tags: ['Object-Oriented', 'High Performance'],
    color: 'from-purple-500/20 via-purple-600/10 to-transparent border-purple-500/30',
    icon: Cpu,
    colSpan: 'md:col-span-3',
    milestones: {
      1: 'A compiled hello-world with a Makefile',
      2: 'A namespace-scoped syntax demo',
      3: 'A const/constexpr type lab',
      4: 'An operator-precedence evaluation chain',
      5: 'A formatted iostream report',
      6: 'A switch-driven menu program',
      7: 'A loop-based number-series generator',
      8: 'A default/overloaded-function toolkit',
      9: 'A std::array type-safe collection',
      10: 'A std::string text processor',
      11: 'A class with access-specifier control',
      12: 'An RAII resource guard',
      13: 'A composed + inherited class hierarchy',
      14: 'A virtual-dispatch shape library',
      15: 'An operator-overload + friend demo',
      16: 'A generic template container',
      17: 'An STL container + iterator program',
      18: 'An STL-algorithm + smart-pointer pipeline',
      19: 'A move-semantics performance demo',
      20: 'A complete embedded C++ project + certification'
    }
  },
  'IoT': {
    difficulty: 'Intermediate to Advanced',
    tags: ['Microcontrollers', 'Cloud Services'],
    color: 'from-teal-500/20 via-teal-600/10 to-transparent border-teal-500/30',
    icon: Wifi,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'Define an IoT use case end to end',
      2: 'Draw and justify a system architecture',
      3: 'Read and calibrate a real sensor',
      4: 'Build a clean signal chain',
      5: 'Drive a motor and a servo safely',
      6: 'Pick the right board for a project',
      7: 'Build a button + LED + serial sketch',
      8: 'Run a deep-sleep battery node',
      9: 'Decode a GPS NMEA stream',
      10: 'Scan and read an I2C sensor',
      11: 'Drive an SPI display or SD card',
      12: 'Build a self-healing WiFi node',
      13: 'Serve and consume a REST API',
      14: 'Publish telemetry through a broker',
      15: 'Live telemetry on a dashboard',
      16: 'Build a trustworthy data pipeline',
      17: 'Harden a device end to end',
      18: 'Bridge a device into a smart home',
      19: 'Translate a factory protocol',
      20: 'Ship a documented, tested project'
    }
  },
  'Embedded': {
    difficulty: 'Advanced',
    tags: ['RTOS Kernels', 'Hardware Interrupts'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Server,
    colSpan: 'md:col-span-4',
    milestones: {
      1: 'Define a real-time deadline in ms',
      2: 'Trace a boot from reset to main()',
      3: 'Build a flashable firmware from a Makefile',
      4: 'Walk the fetch-decode-execute cycle',
      5: 'Map the MCU peripherals and buses',
      6: 'Write a register-level AVR UART driver',
      7: 'Configure an NVIC interrupt with CMSIS',
      8: 'Build a clean GPIO HAL',
      9: 'Generate exact PWM with a compare unit',
      10: 'Write a race-free ISR with a flag',
      11: 'Decode a framed UART packet',
      12: 'Talk to an SPI flash device',
      13: 'Read an I2C sensor register map',
      14: 'Sample a signal without aliasing',
      15: 'Build a two-task RTOS app with a queue',
      16: 'Write requirements plus an architecture diagram',
      17: 'Run static analysis on firmware',
      18: 'Add host-side unit tests to firmware',
      19: 'Write a decision record for a design choice',
      20: 'Deliver a documented, tested project plus the exam'
    }
  },
  'WebDesign': {
    difficulty: 'Beginner',
    tags: ['HTML/CSS', 'Responsive Layouts'],
    color: 'from-pink-500/20 via-pink-600/10 to-transparent border-pink-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'Your first HTML page in the browser',
      2: 'A semantic page-structure mockup',
      3: 'A styled, selector-driven component',
      4: 'A box-model pixel-layout demo',
      5: 'A flexbox navigation + card layout',
      6: 'A grid gallery with hover transitions',
      7: 'A fully responsive single page',
      8: 'A Tailwind utility-built component',
      9: 'A JS variables & types lab',
      10: 'A branching/looping logic program',
      11: 'A functions & array-methods toolkit',
      12: 'Live DOM updates from JS',
      13: 'An interactive event-driven widget',
      14: 'A fetch-driven live data view',
      15: 'A wireframe + portfolio build plan',
      16: 'The semantic portfolio skeleton',
      17: 'A polished, responsive portfolio',
      18: 'Validation, modals & dark mode',
      19: 'A deployed live portfolio URL',
      20: 'Audited 90+ scores & certification'
    }
  },
  'Python': {
    difficulty: 'Beginner to Intermediate',
    tags: ['Data Analysis', 'Automation'],
    color: 'from-amber-500/20 via-amber-600/10 to-transparent border-amber-500/30',
    icon: Terminal,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'Python code you can read aloud',
      2: 'A working first script in your IDE',
      3: 'A dynamic typed-variables lab',
      4: 'A calculator-expression demo',
      5: 'A number-guessing conditionals game',
      6: 'A comprehension-based data pipeline',
      7: 'A functions, args & scope toolkit',
      8: 'A list/tuple data-shaping demo',
      9: 'A dictionary/set membership lab',
      10: 'A file-reading word-counter utility',
      11: 'A safe exception-handling module',
      12: 'A small class-based library app',
      13: 'A pip-installed reusable package',
      14: 'A pandas DataFrame analysis',
      15: 'A Matplotlib chart plotter',
      16: 'A batch file-renaming script',
      17: 'A live scraped-data report',
      18: 'A feature-scoped CLI design doc',
      19: 'A working argparse CLI tool',
      20: 'A tested, packaged CLI + certification'
    }
  },
  'SQL': {
    difficulty: 'Beginner to Intermediate',
    tags: ['Relational DB', 'Querying'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Database,
    colSpan: 'md:col-span-2',
    milestones: {
      1: 'A keyed, connected ER sketch',
      2: 'A table/keys/relationships demo',
      3: 'A filtered + sorted SELECT toolkit',
      4: 'A paginated filtered report',
      5: 'An aggregate summary query',
      6: 'A per-city GROUP BY analytics',
      7: 'A joined multi-table report',
      8: 'A subquery/EXISTS filter',
      9: 'A normalized 3NF schema',
      10: 'A constrained CREATE TABLE set',
      11: 'An ON CONFLICT upsert demo',
      12: 'An EXPLAIN-proven indexed query',
      13: 'A reusable view + function',
      14: 'An atomic ACID transfer module',
      15: 'An injection-safe query layer',
      16: 'A pooled Node/Python connection',
      17: 'A seeded library DB + queries',
      18: 'A migration-reviewed schema',
      19: 'An optimized + cached report',
      20: 'A reproducible booking DB + certification'
    }
  },
  'CADDED_Mech': {
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD 2D', 'SolidWorks', 'CATIA Surfaces', 'CNC G-Code'],
    color: 'from-orange-500/20 via-orange-600/10 to-transparent border-orange-500/30',
    icon: Wrench,
    colSpan: 'md:col-span-3',
    milestones: {
      1: 'Set up a layered template drawing',
      2: 'Draw and edit a flange profile',
      3: 'Dimension and plot a part to scale',
      4: 'Build a reusable block library',
      5: 'Make a fully-defined sketch',
      6: 'Model a bracket from a sketch',
      7: 'Assemble and test a hinge',
      8: 'Drive a size family via a design table',
      9: 'Build a CATIA part from constraints',
      10: 'Create and join a surface body',
      11: 'Style a class-A surface',
      12: 'Add draft and verify wall thickness',
      13: 'Set up a work coordinate system',
      14: 'Write a drilling cycle by hand',
      15: 'Build a safe program header',
      16: 'Simulate and verify a toolpath',
      17: 'Design a mating part pair',
      18: 'Detail a part with GD&T',
      19: 'Publish a BOM and drawing set',
      20: 'Deliver a reviewed project + exam'
    }
  },
  'CADDED_Civil': {
    difficulty: 'Beginner to Intermediate',
    tags: ['AutoCAD Civil', '3DS Max Render', 'SketchUp', 'Revit BIM'],
    color: 'from-emerald-500/20 via-emerald-600/10 to-transparent border-emerald-500/30',
    icon: Building2,
    colSpan: 'md:col-span-3',
    milestones: {
      1: 'Set up a civil drawing template',
      2: 'Draft a dimensioned site plan',
      3: 'Draw a 2BHK floor plan',
      4: 'Plot sections and elevations for submission',
      5: 'Model a building shell',
      6: 'Texture a villa with PBR maps',
      7: 'Light an interior scene',
      8: 'Produce a finished render',
      9: 'Build a rapid furniture mockup',
      10: 'Organize a model with components',
      11: 'Script a modeling macro',
      12: 'Present a scaled Layout sheet',
      13: 'Set up a structural project',
      14: 'Model a foundation grid',
      15: 'Reinforce a beam-column junction',
      16: 'Publish a structural drawing set',
      17: 'Lay out levels, grids and walls',
      18: 'Schedule doors and windows',
      19: 'Model floors, roof and stairs',
      20: 'Deliver a coordinated BIM package + exam'
    }
  }
};

const ResistorIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 32h10l4-12 6 24 6-24 6 24 6-24 4 12h18" />
    <rect x="20" y="24" width="24" height="16" rx="2" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="2" />
    <line x1="26" y1="24" x2="26" y2="40" />
    <line x1="32" y1="24" x2="32" y2="40" />
    <line x1="38" y1="24" x2="38" y2="40" />
  </svg>
);

const AndGateIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 16h16c8 0 16 6 16 16s-8 16-16 16H16V16z" />
    <line x1="4" y1="24" x2="16" y2="24" />
    <line x1="4" y1="40" x2="16" y2="40" />
    <line x1="48" y1="32" x2="60" y2="32" />
  </svg>
);

const CapacitorIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="32" y1="4" x2="32" y2="26" />
    <line x1="32" y1="38" x2="32" y2="60" />
    <line x1="16" y1="26" x2="48" y2="26" strokeWidth="3" />
    <line x1="16" y1="38" x2="48" y2="38" strokeWidth="3" />
  </svg>
);

const getGlowStyles = (id: string) => {
  switch (id) {
    case 'C': return 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]';
    case 'C++': return 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]';
    case 'IoT': return 'hover:border-teal-500/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]';
    case 'Embedded': return 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]';
    case 'WebDesign': return 'hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]';
    case 'Python': return 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]';
    case 'SQL': return 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    case 'CADDED_Mech': return 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]';
    case 'CADDED_Civil': return 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]';
    default: return 'hover:border-slate-700/80';
  }
};

// Floating Tech Background Icons
const FloatingTechIcons = () => {
  const icons = [
    { Icon: Cpu, color: 'text-blue-500/20', size: 40, x: '8%', y: '12%', delay: 0 },
    { Icon: ResistorIcon, color: 'text-amber-500/20', size: 44, x: '82%', y: '18%', delay: 1 },
    { Icon: Server, color: 'text-purple-500/20', size: 44, x: '72%', y: '78%', delay: 2 },
    { Icon: AndGateIcon, color: 'text-teal-500/20', size: 40, x: '18%', y: '82%', delay: 1.5 },
    { Icon: CapacitorIcon, color: 'text-pink-500/20', size: 36, x: '5%', y: '48%', delay: 0.5 },
    { Icon: Database, color: 'text-emerald-500/20', size: 42, x: '88%', y: '52%', delay: 2.5 },
    { Icon: Code2, color: 'text-indigo-500/20', size: 36, x: '42%', y: '88%', delay: 3 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {icons.map((item, idx) => {
        const IconComponent = item.Icon;
        return (
          <motion.div
            key={idx}
            style={{ position: 'absolute', left: item.x, top: item.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + idx * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
            className={`${item.color}`}
          >
            <IconComponent size={item.size} />
          </motion.div>
        );
      })}
    </div>
  );
};

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [activeWeekPreview, setActiveWeekPreview] = useState<number>(1);
  const [showAllLeaderboard, setShowAllLeaderboard] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  const { login } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();

  // Fetch courses from backend API
  useEffect(() => {
    api.get('/courses')
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => {
        console.error('Failed to load courses from API:', err);
      });
  }, []);

  const mappedCourses = courses.map((c: any) => {
    const meta = courseMetadata[c.id] || {
      difficulty: 'Beginner to Intermediate',
      tags: ['Specialized Program'],
      color: 'from-slate-700/20 via-slate-800/10 to-transparent border-slate-750/30',
      icon: BookOpen,
      colSpan: 'md:col-span-2',
      milestones: {}
    };
    
    return {
      id: c.id,
      title: c.title,
      difficulty: meta.difficulty,
      tags: meta.tags,
      color: meta.color,
      icon: meta.icon,
      colSpan: meta.colSpan,
      desc: c.description || 'Welcome to this specialized curriculum track.',
      syllabus: (c.modules || []).map((m: any) => ({
        week: m.week,
        title: m.title,
        details: m.description || 'Curriculum details for this week.',
        milestone: meta.milestones?.[m.week] || 'Weekly hands-on lab project'
      }))
    };
  });

  const coursesList = courses.length > 0 ? mappedCourses : courseDetails;

  // Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Public Leaderboard / Hall of Fame
  useEffect(() => {
    api.get('/practice/leaderboard/public')
      .then(res => {
        setTopStudents(res.data.leaderboard || []);
      })
      .catch(err => {
        console.error('Failed to load public leaderboard, using fallback mock data:', err);
        // Fallback mock students if DB is empty or call fails
        setTopStudents([
          { name: 'Rohan Deshmukh', points: 640, badges: ['week_1_master', 'perfect_score'], collegeName: 'COEP Technological University' },
          { name: 'Simran Preet Kaur', points: 520, badges: ['bug_hunter', 'perfect_score'], collegeName: 'Thapar Institute' },
          { name: 'Aditya Narang', points: 490, badges: ['week_1_master'], collegeName: 'BITS Pilani' },
          { name: 'Gauri Shinde', points: 410, badges: ['bug_hunter'], collegeName: 'Vellore Institute of Technology' },
          { name: 'Vivek Joshi', points: 380, badges: ['perfect_score'], collegeName: 'Delhi Technological University' }
        ]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password } 
        : { email, password, name, fatherName, collegeName, branchName };
      
      const response = await api.post(endpoint, data);
      login(response.data.token, response.data.user);
      addToast(isLogin ? 'Successfully logged in!' : 'Successfully registered!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Invalid credentials or connection error';
      setError(errMsg);
      addToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToEnroll = () => {
    const el = document.getElementById('enrollment-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 py-12 px-4 max-w-7xl mx-auto relative">
      
      {/* Sleek Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-amber-500 z-50 origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <motion.div
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 30, -30, 0],
            scale: [1, 1.1, 0.85, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[40%] left-[20%] w-[45%] h-[45%] rounded-full bg-purple-600/8 blur-[110px]"
        />
      </div>

      {/* Floating Background Icons */}
      <FloatingTechIcons />

      {/* Desktop Optimization Notice Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3 text-left backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
        <span className="text-xl">💻</span>
        <div className="text-xs sm:text-sm text-slate-300">
          <strong className="text-blue-400 block sm:inline mr-1">Desktop Recommended:</strong>
          For the best experience, including interactive code sandboxes and high-resolution certificate printing, we recommend using a Desktop or Laptop browser.
        </div>
      </div>
      
      {/* 1. Hero & Branding Introduction Block */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[65vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left space-y-6 z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
            <ShieldCheck size={14} className="animate-pulse" /> Live Verifiable Training Portal
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
            Nexus Academic & <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent drop-shadow-md">
              Embedded Innovation
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            Access specialized industrial training curriculums covering low-level C programming, object-oriented software design, IoT controller networks, and real-time RTOS microkernels.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
            {/* Telegram Group Button */}
            <a
              href="https://t.me/+tCapxtLwxNNlZjY1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/45 hover:border-[#229ED9]/70 text-[#29aae2] font-extrabold text-xs uppercase tracking-widest transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(34,158,217,0.2)] group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-200">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.09 14.4l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.726.186z"/>
              </svg>
              Join Telegram Group
            </a>
            <Button 
              variant="accent"
              onClick={scrollToEnroll}
            >
              Start Learning Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Browse Curriculum
            </Button>
          </div>
        </motion.div>

        {/* Hero Decorative Illustration card with Mesh Gradient and Floating Items */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 w-full max-w-md relative select-none hidden lg:block"
        >
          {/* Animated Mesh Gradient Wrapper */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-amber-500/5 to-purple-500/10 rounded-2xl blur-xl animate-pulse"></div>

          <Card className="p-8 text-center relative overflow-hidden border border-slate-800" variant="glass">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 relative group">
              <Sparkles size={28} className="absolute animate-spin-slow opacity-30 text-amber-300" />
              <GraduationCap size={32} className="relative z-10" />
            </div>
            
            <div className="space-y-1 mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">Industrial Training Registry</h3>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Accredited by Nexus Labs</p>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-[10.5px] text-slate-400 leading-relaxed font-mono uppercase tracking-tight space-y-2 text-left">
              <p className="text-amber-500 font-extrabold flex items-center gap-1.5"><CheckCircle2 size={13} /> 100% Verified Credentials</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Realtime Database Security</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Interactive Circuit Simulators</p>
              <p className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Self-Paced Sandbox Arenas</p>
            </div>
          </Card>
        </motion.div>
      </div>

    {/* Animated Scroll Indicator */}
    <div className="flex justify-center pb-4">
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer flex flex-col items-center gap-1.5"
        onClick={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Explore Catalog</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-amber-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7" />
        </svg>
      </motion.div>
    </div>

      {/* 2. Trust Metrics / Social Proof Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-slate-800/80 py-8 relative">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">1,250+</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Accredited Students</p>
        </div>
        <div className="text-center space-y-1 border-y sm:border-y-0 sm:border-x border-slate-800/80 py-4 sm:py-0">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">9 Tracks</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Specialized Courses</p>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-black text-amber-500 tracking-tight sm:text-4xl">100%</h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Free & Verifiable</p>
        </div>
      </div>

      {/* 3. Interactive Course Catalog Section - Bento Box Layout */}
      <div id="catalog-section" className="space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <Sparkles className="text-amber-500 fill-amber-500/20" size={24} />
            Bento Course Catalog
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Click "Preview Syllabus" on any track to preview what you will learn week-by-week.
          </p>
        </div>

        {/* Bento Grid layout */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
          {coursesList.map((course) => {
            const IconComp = course.icon;
            const glowStyles = getGlowStyles(course.id);
            return (
              <motion.div
                key={course.id}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className={`col-span-1 ${course.colSpan} flex`}
              >
                <Card 
                  className={`w-full p-6 flex flex-col justify-between relative overflow-hidden border border-slate-850 transition-all duration-350 ${glowStyles}`}
                  variant="glass"
                >
                  {/* Subtle decorative glow */}
                  <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${course.color} rounded-full blur-2xl opacity-40 pointer-events-none`}></div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-amber-400">
                        <IconComp size={22} />
                      </div>
                      <span className="text-[11px] font-black text-slate-500 bg-slate-950/80 border border-slate-900 px-2 py-0.5 rounded uppercase tracking-wider">
                        {course.difficulty}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-white tracking-tight">{course.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">{course.desc}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.tags.map((tag: string) => (
                        <span key={tag} className="text-[11px] font-bold text-slate-450 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-850/60 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-850/60 flex items-center justify-between gap-4">
                    <button 
                      onClick={() => { setPreviewCourse(course); setActiveWeekPreview(1); }}
                      className="text-[11px] font-black text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors animate-pulse hover:animate-none"
                    >
                      <BookOpen size={12} /> Preview Syllabus
                    </button>
                    <button 
                      onClick={scrollToEnroll}
                      className="text-[11px] font-black text-amber-450 hover:text-amber-300 uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      Enroll Now <ArrowRight size={12} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 4. Student Hall of Fame Section (Issue #45) */}
      <div className="space-y-8 border-t border-slate-800/80 pt-16">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-white uppercase flex justify-center items-center gap-2">
            <Trophy className="text-yellow-400" size={24} />
            Student Hall of Fame
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Meet our top students who are leading the leaderboard with high XP and quiz scores.
          </p>
        </div>

        {/* Podium Layout */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 pt-4 max-w-4xl mx-auto">
          {topStudents.length > 0 && (() => {
            const podiumStudents = [];
            if (topStudents[1]) podiumStudents.push({ ...topStudents[1], rank: 2, scale: 'scale-100', height: 'h-auto md:h-72', border: 'border-slate-350/40 shadow-slate-350/5', color: 'from-slate-400/5 via-slate-950 to-slate-950', badge: '🥈 Silver' });
            if (topStudents[0]) podiumStudents.push({ ...topStudents[0], rank: 1, scale: 'scale-100 md:scale-105', height: 'h-auto md:h-80 md:-translate-y-2', border: 'border-yellow-500/60 shadow-yellow-500/10', color: 'from-yellow-500/10 via-slate-950 to-slate-950', badge: '👑 Gold' });
            if (topStudents[2]) podiumStudents.push({ ...topStudents[2], rank: 3, scale: 'scale-100', height: 'h-auto md:h-64', border: 'border-amber-700/40 shadow-amber-700/5', color: 'from-amber-750/5 via-slate-950 to-slate-950', badge: '🥉 Bronze' });

            return podiumStudents.map((student) => {
              const orderClass = student.rank === 1 ? 'order-1 md:order-2' : student.rank === 2 ? 'order-2 md:order-1' : 'order-3 md:order-3';
              return (
                <motion.div
                  key={student.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className={`w-full md:w-1/3 ${orderClass} ${student.scale} flex`}
                >
                  <Card className={`w-full p-6 flex flex-col items-center text-center justify-between relative overflow-hidden border ${student.border} bg-gradient-to-b ${student.color} ${student.height}`} variant="glass">
                    <div className="absolute top-4 right-4">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-350">
                        {student.badge}
                      </span>
                    </div>

                    <div className="flex flex-col items-center mt-4">
                      <div className={`w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center font-black text-white text-base shadow-inner border mb-4 relative ${student.rank === 1 ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'border-slate-700'}`}>
                        {student.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        {student.rank === 1 && <span className="absolute -top-2 text-yellow-400 text-lg">👑</span>}
                      </div>

                      <h3 className="text-sm font-extrabold text-white">{student.name}</h3>
                      <p className="text-[11px] text-slate-500 font-semibold truncate max-w-full uppercase mt-0.5">{student.collegeName || 'Technology Institute'}</p>
                    </div>

                    <div className="flex flex-col items-center w-full mt-4 gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 border border-slate-900 rounded-full">
                        <Zap className="text-amber-400 fill-amber-400" size={13} />
                        <span className="text-xs font-black text-white font-mono">{student.points} <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">XP</span></span>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-center max-h-[48px] overflow-hidden">
                        {student.badges && student.badges.length > 0 ? (
                          student.badges.slice(0, 2).map((b: string) => (
                            <span key={b} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-[11px] font-black uppercase text-slate-450 tracking-wider">
                              🏆 {b.replace(/_/g, ' ').replace('week 1 master', 'W1 Master').replace('bug hunter', 'Bug Hunter').replace('perfect score', 'Perfect')}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-650 italic">Consistent Learner</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            });
          })()}
        </div>

        {/* Collapsible View Top 10 Leaderboard Ranks */}
        {topStudents.length > 3 && (
          <div className="flex flex-col items-center pt-4">
            <button
              onClick={() => setShowAllLeaderboard(!showAllLeaderboard)}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/40 text-[11px] font-black uppercase tracking-widest text-slate-450 hover:text-white transition flex items-center gap-2 cursor-pointer"
            >
              {showAllLeaderboard ? (
                <>Hide Ranks <ChevronUp size={12} /></>
              ) : (
                <>View Top 10 Ranks <ChevronDown size={12} /></>
              )}
            </button>

            <AnimatePresence>
              {showAllLeaderboard && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full max-w-2xl mt-4 overflow-hidden"
                >
                  <Card className="p-4 border border-slate-850" variant="glass">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-400">
                        <thead>
                          <tr className="border-b border-slate-900 text-slate-500 font-black uppercase tracking-wider text-[11px]">
                            <th className="py-2.5 px-3">Rank</th>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">College Name</th>
                            <th className="py-2.5 px-3 text-right">XP Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/60">
                          {topStudents.slice(3, 10).map((student, idx) => (
                            <tr key={student.name} className="hover:bg-slate-900/30 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-slate-350">#{idx + 4}</td>
                              <td className="py-3 px-3 font-extrabold text-white">{student.name}</td>
                              <td className="py-3 px-3 text-slate-500 truncate max-w-[200px] uppercase text-[11px] font-semibold">{student.collegeName || 'Technology Institute'}</td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-amber-500 flex items-center justify-end gap-1">
                                <Zap className="text-amber-500 fill-amber-500/20" size={12} />
                                {student.points} XP
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 5. Value Propositions / Credibility Accreditations */}
      <div className="space-y-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-center text-slate-500 border-b border-slate-800/80 pb-4">Accreditation & Quality Standards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Verifiable Registry', desc: 'Secure database verification system with unique tracking IDs.' },
            { title: 'Secure Verification', desc: 'Each student gets a unique scannable QR Code and verifiable Registry ID.' },
            { title: 'Hands-on Labs', desc: 'Learn dynamically with real codes, timing maps, and ESP microcontroller drivers.' },
            { title: '100% Free Access', desc: 'No enrollment fees or payments for learning curriculum.' }
          ].map((val, i) => (
            <Card key={i} className="p-5 space-y-2 border border-slate-850" variant="glass">
              <CheckCircle2 className="text-amber-500" size={24} />
              <h4 className="text-sm font-bold text-white tracking-tight uppercase">{val.title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{val.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. Enrollment Portal (Login/Register Form Section) */}
      <div id="enrollment-section" className="flex justify-center pt-8 border-t border-slate-800/80">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <Card className="p-8 relative overflow-hidden border border-slate-800" variant="glass">
            
            {/* Decorative glowing gradient sphere */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">
              {isLogin ? 'Student Login' : 'Registration'}
            </h2>
            <p className="text-center text-slate-400 text-sm mb-6">
              {isLogin ? 'Sign in to access NEXUS training portal' : 'Enroll in smart electronics programs'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <FormField
                      label="Full Name"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      leftIcon={<User size={18} />}
                      required
                    />
                    <FormField
                      label="Father's Name"
                      placeholder="Father's Name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      leftIcon={<User size={18} />}
                      required
                    />
                    <FormField
                      label="College Name"
                      placeholder="College Name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      leftIcon={<GraduationCap size={18} />}
                      required
                    />
                    <FormField
                      label="Branch"
                      placeholder="Branch (e.g. ECE, EEE, CSE)"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      leftIcon={<GraduationCap size={18} />}
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <FormField
                label="Email Address"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                required
              />
              
              <FormField
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                required
                error={error}
              />
              
              <Button 
                type="submit"
                isLoading={isLoading}
                variant="accent"
                fullWidth
                className="mt-4"
                leftIcon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              >
                {isLogin ? 'Login' : 'Enroll Now'}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-slate-400 text-sm">
              {isLogin ? "New to the portal?" : "Already enrolled?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="ml-2 text-amber-500 hover:underline font-semibold"
              >
                {isLogin ? 'Create Account' : 'Login Here'}
              </button>
            </div>
          </Card>

          {/* Prominent Technical Support Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-center bg-slate-900/40 border border-slate-900/60 rounded-2xl p-4 max-w-md mx-auto backdrop-blur-md"
          >
            <p className="text-xs text-slate-400 font-medium">
              Having trouble? Need help with activation?
            </p>
            <div className="flex justify-center items-center gap-6 mt-3">
              <a 
                href="https://chat.whatsapp.com/Ba4J77LOmzVBrlHjQtm6Ar?s=cl&p=a&mlu=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider transition-colors"
              >
                <MessageSquare size={14} /> WhatsApp Help
              </a>
              <span className="text-slate-800">•</span>
              <a 
                href="https://t.me/+tCapxtLwxNNlZjY1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors"
              >
                <Send size={14} /> Telegram Help
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Syllabus Timelines Preview Modal */}
      <AnimatePresence>
        {previewCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewCourse(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 w-full max-w-2xl relative my-8"
            >
              {/* Close Trigger */}
              <button
                onClick={() => setPreviewCourse(null)}
                aria-label="Close syllabus preview"
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full uppercase tracking-wider">
                    Syllabus Overview
                  </span>
                  <h2 className="text-2xl font-black text-white mt-3 uppercase tracking-tight">{previewCourse.title}</h2>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{previewCourse.desc}</p>
                </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-850 pb-2 mb-4">
                  {previewCourse.syllabus.length}-Week Training Roadmap
                </h4>
                
                <div className="space-y-3">
                  {previewCourse.syllabus.map((weekData: any) => {
                    const isOpen = activeWeekPreview === weekData.week;
                    return (
                      <div 
                        key={weekData.week} 
                        className={`relative border rounded-2xl p-4 transition-all duration-350 ${isOpen ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-slate-850 bg-slate-950/20 hover:border-slate-800'}`}
                      >
                        <button
                          onClick={() => setActiveWeekPreview(isOpen ? 0 : weekData.week)}
                          className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-black text-xs transition-colors duration-300 ${isOpen ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                              0{weekData.week}
                            </div>
                            <div>
                              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest block">Week {weekData.week} Module</span>
                              <h4 className="text-sm font-extrabold text-white tracking-tight">{weekData.title}</h4>
                            </div>
                          </div>
                          <div className={`text-slate-500 hover:text-white transition-transform duration-250 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                            <ChevronDown size={16} />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3.5 pl-11 border-t border-slate-900/60 pt-3.5 space-y-3">
                                <p className="text-slate-450 text-xs leading-relaxed font-medium">{weekData.details}</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 rounded-xl text-[11px] font-black uppercase tracking-wider">
                                  <span>Milestone:</span>
                                  <span className="text-white font-mono">{weekData.milestone}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

                <div className="pt-4 border-t border-slate-850 flex justify-end">
                  <Button 
                    variant="accent"
                    onClick={() => {
                      setPreviewCourse(null);
                      scrollToEnroll();
                    }}
                  >
                    Start Training Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
