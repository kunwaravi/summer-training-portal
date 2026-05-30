import { Code, Box, Wifi, Cpu } from 'lucide-react';

export interface SyllabusItem {
  week: number;
  title: string;
  details: string;
}

export interface CourseConfigItem {
  id: string;
  title: string;
  titleShort: string;
  difficulty: string;
  tags: string[];
  colorLight: string;
  colorDark: string;
  iconColor: string;
  textColor: string;
  barColor: string;
  desc: string;
  descShort: string;
  icon: React.ComponentType<any>;
  syllabus: SyllabusItem[];
}

export const coursesConfig: CourseConfigItem[] = [
  {
    id: 'C',
    title: 'C & Systems Programming',
    titleShort: 'C Language',
    difficulty: 'Beginner to Intermediate',
    tags: ['Core Electronics', 'Hardware Mapping'],
    colorLight: 'from-blue-500/10 to-blue-600/5',
    colorDark: 'from-blue-500 to-blue-700',
    iconColor: 'text-blue-600 bg-blue-100',
    textColor: 'text-blue-400',
    barColor: 'bg-blue-500',
    desc: 'Master procedural programming, binary systems, hardware mapping, memory allocations, and register compilations.',
    descShort: 'Master procedural programming, memory maps, and hardware structure compilations.',
    icon: Code,
    syllabus: [
      { week: 1, title: 'Procedural Fundamentals', details: 'Variables, Data Types, Control Flows, and Memory Layouts' },
      { week: 2, title: 'Modular Architecture', details: 'Functions, Scopes, Arrays, and Pointer Arithmetic' },
      { week: 3, title: 'Structures & I/O Systems', details: 'Dynamic Memory Allocation, Structs, and Hardware File I/O' },
      { week: 4, title: 'Low-Level Register Macros', details: 'Compilation pipelines, Register keywords, and direct hardware macros' }
    ]
  },
  {
    id: 'C++',
    title: 'C++ & OOP for Embedded Systems',
    titleShort: 'C++ Language',
    difficulty: 'Intermediate',
    tags: ['Object-Oriented', 'High Performance'],
    colorLight: 'from-indigo-500/10 to-indigo-600/5',
    colorDark: 'from-purple-500 to-purple-700',
    iconColor: 'text-indigo-600 bg-indigo-100',
    textColor: 'text-purple-400',
    barColor: 'bg-purple-500',
    desc: 'Architect high-performance OOP software structures, customized template classes, and embedded-optimized collections.',
    descShort: 'Implement high-performance object-oriented software design, templates, and STL.',
    icon: Box,
    syllabus: [
      { week: 1, title: 'Object-Oriented Encapsulation', details: 'Classes, Objects, Members, and Access Specifiers' },
      { week: 2, title: 'Inheritance & Polymorphism', details: 'Base/Derived classes, Virtual Functions, and VTables' },
      { week: 3, title: 'Generic Programming', details: 'Function/Class templates, and Standard Template Library (STL) overrides' },
      { week: 4, title: 'Embedded Space Optimization', details: 'No-overhead allocations, inline functions, and lightweight classes' }
    ]
  },
  {
    id: 'IoT',
    title: 'IoT & Smart Interfacing Solutions',
    titleShort: 'IoT (Internet of Things)',
    difficulty: 'Intermediate to Advanced',
    tags: ['Microcontrollers', 'Cloud Services'],
    colorLight: 'from-emerald-500/10 to-emerald-600/5',
    colorDark: 'from-green-500 to-green-700',
    iconColor: 'text-emerald-600 bg-emerald-100',
    textColor: 'text-green-400',
    barColor: 'bg-green-500',
    desc: 'Connect physical systems with ESP microcontrollers, ADCs, custom serial buses, MQTT client protocols, and remote cloud metrics.',
    descShort: 'Connect physical systems with ESP microcontrollers, MQTT protocols, and cloud services.',
    icon: Wifi,
    syllabus: [
      { week: 1, title: 'IoT Microcontroller Baselines', details: 'ESP Core architecture, pinouts, and hardware development setups' },
      { week: 2, title: 'Hardware Interfacing', details: 'ADCs, DACs, I2C, SPI, and UART serial communication' },
      { week: 3, title: 'Connectivity Protocols', details: 'WiFi configurations, MQTT Clients, publish/subscribe payloads' },
      { week: 4, title: 'Cloud Dashboards & Alerts', details: 'Real-time telemetry, remote actuator control, and cloud hooks' }
    ]
  },
  {
    id: 'Embedded',
    title: 'Embedded Systems & Real-Time OS',
    titleShort: 'Embedded Systems',
    difficulty: 'Advanced',
    tags: ['RTOS Kernels', 'Hardware Interrupts'],
    colorLight: 'from-orange-500/10 to-orange-600/5',
    colorDark: 'from-orange-500 to-orange-750',
    iconColor: 'text-orange-600 bg-orange-100',
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500',
    desc: 'Implement low-level peripheral drivers, nested vectored interrupts, RTOS task scheduling, semaphores, and power configurations.',
    descShort: 'Architect microcontroller interfaces, serial communication buses, and RTOS kernels.',
    icon: Cpu,
    syllabus: [
      { week: 1, title: 'Peripheral Driver Baselines', details: 'GPIO register manipulation, clock gating, and abstract HALs' },
      { week: 2, title: 'Interrupt Handlers & PWM', details: 'Timer hardware interrupts, nested interrupt priorities, and PWM control' },
      { week: 3, title: 'RTOS Task Management', details: 'Preemptive scheduler, task priorities, queues, and mutexes' },
      { week: 4, title: 'System Diagnostics & Safety', details: 'Watchdog timers, brown-out detectors, and ultra-low power modes' }
    ]
  }
];
