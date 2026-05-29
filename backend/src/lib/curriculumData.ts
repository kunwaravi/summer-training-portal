export interface Topic {
  title: string;
  text: string;
  code?: string;
  note?: string;
}

export interface WeekCurriculum {
  week: number;
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

export interface WeekQuiz {
  week: number;
  questions: Question[];
}

export const curriculum: Record<string, WeekCurriculum[]> = {
  "C": [
    {
      week: 1,
      title: "Basics of C & Structural Design",
      description: "Learn the core foundation of C programming, compilation stages, data types, and operators.",
      topics: [
        {
          title: "Introduction & Structure of a C Program",
          text: "C is a procedural programming language developed in 1972 by Dennis Ritchie. A standard C program consists of preprocessor directives, the main() function, variable declarations, statements, and comments.",
          code: `#include <stdio.h>\n\nint main() {\n    // Print a hello message\n    printf("Welcome to C Training!\\n");\n    return 0;\n}`,
          note: "Every C program begins execution from the main() function. Preprocessor directives (like #include) are processed before compilation."
        },
        {
          title: "Data Types & Variables",
          text: "Variables are named memory locations. C supports primary data types: int (integer), float (single-precision floating point), double (double-precision), char (character), and void (empty set of values). Sizes vary by system (e.g., int is usually 4 bytes).",
          code: `int age = 21;\nfloat accuracy = 98.6f;\nchar grade = 'A';\ndouble precisionPi = 3.1415926535;`,
          note: "Always specify the format specifier correctly: %d for int, %f for float, %lf for double, and %c for char."
        },
        {
          title: "Basic Input / Output operations",
          text: "C uses standard functions from stdio.h to handle input and output. printf() writes formatted text to stdout, while scanf() reads formatted input from stdin using address-of operator (&).",
          code: `int rollNo;\nprintf("Enter your Roll Number: ");\nscanf("%d", &rollNo);\nprintf("Student Registered: ID %d\\n", rollNo);`,
          note: "Forgetting the '&' symbol in scanf() is a common bug that leads to runtime crashes (segmentation faults) because it attempts to write to an uninitialized pointer address."
        },
        {
          title: "Operators & Precedence",
          text: "C contains a rich set of operators: Arithmetic (+, -, *, /, %), Relational (<, >, ==, !=), Logical (&&, ||, !), Bitwise (&, |, ^, ~), and Assignment. Precedence dictates how expressions evaluate.",
          code: `int a = 10, b = 20;\nint result = a + b * 2; // b * 2 evaluated first: result is 50\nint logicalResult = (a < b) && (b > 15); // True (1)`,
          note: "Use parentheses () to explicitly declare order of execution and make your expressions clear."
        }
      ]
    },
    {
      week: 2,
      title: "Control Flow & Decision Making",
      description: "Understand decision-making branches (if-else, switch) and loop control systems to drive execution logic.",
      topics: [
        {
          title: "Conditional Statements (If-Else & Nested)",
          text: "If-else statements allow programs to make branching paths based on boolean evaluations. Nested conditionals allow checking multiple hierarchies.",
          code: `int score = 75;\nif (score >= 90) {\n    printf("Grade A\\n");\n} else if (score >= 60) {\n    printf("Grade B\\n");\n} else {\n    printf("Needs Improvement\\n");\n}`,
          note: "An 'else' block will always attach itself to the nearest preceding 'if' statement that does not have an else, unless grouped by braces {}."
        },
        {
          title: "Switch Case Block",
          text: "A switch-case statement is a multi-way branch selection. It evaluates an expression against integral constants. The 'break' keyword halts execution inside the block, preventing fall-through.",
          code: `char choice = 'B';\nswitch(choice) {\n    case 'A':\n        printf("Excellent\\n");\n        break;\n    case 'B':\n        printf("Good Job\\n");\n        break;\n    default:\n        printf("Keep Learning\\n");\n}`,
          note: "If you omit the 'break' statement, C will execute subsequent case blocks (fall-through) until a break is encountered or the switch terminates."
        },
        {
          title: "Loops (While, Do-While & For)",
          text: "Loops repeat execution of a block of code. 'for' loops are ideal when iterations are predetermined. 'while' checks condition first. 'do-while' guarantees at least one execution because the condition checks at the bottom.",
          code: `// For loop\nfor(int i = 0; i < 5; i++) {\n    printf("Iteration: %d\\n", i);\n}\n\n// While loop\nint j = 0;\nwhile(j < 5) {\n    j++;\n}`
        },
        {
          title: "Jump Controls: Break, Continue & Goto",
          text: "'break' exits the loop immediately. 'continue' skips the current iteration and goes directly to the next condition evaluation.",
          code: `for(int i = 1; i <= 10; i++) {\n    if (i == 5) continue; // Skip 5\n    if (i == 8) break;    // Stop at 8\n    printf("%d ", i);\n}`
        }
      ]
    },
    {
      week: 3,
      title: "Arrays, Strings & Modular Functions",
      description: "Master sequential memory systems using arrays, character processing using strings, and reusable functional modules.",
      topics: [
        {
          title: "One & Two-Dimensional Arrays",
          text: "An array is a collection of variables of the same data type stored in contiguous memory locations. Indexing starts at 0. Multi-dimensional arrays (like 2D) represent tables or matrices.",
          code: `int numbers[5] = {10, 20, 30, 40, 50};\nint matrix[2][3] = {\n    {1, 2, 3},\n    {4, 5, 6}\n};\nprintf("First item: %d, Matrix item: %d\\n", numbers[0], matrix[1][2]);`,
          note: "C does not perform array boundary checking at runtime. Accessing index out-of-bounds leads to undefined behavior or segmentation faults."
        },
        {
          title: "String Manipulation in C",
          text: "Strings in C are character arrays terminated by a null character '\\0'. The 'string.h' library provides standard utility functions such as strlen(), strcpy(), and strcmp().",
          code: `#include <string.h>\n\nchar welcome[20] = "Hello";\nstrcat(welcome, " World"); // welcome is now "Hello World"\nint len = strlen(welcome);\nprintf("Length: %d\\n", len);`,
          note: "Always ensure the destination character array has sufficient memory allocated to prevent buffer overflow attacks or memory corruption."
        },
        {
          title: "Function Architecture & Reusability",
          text: "Functions divide a large program into modular blocks. They take input arguments and return values. Variables declared inside a function are local to it.",
          code: `int addNumbers(int a, int b) {\n    return a + b;\n}\n\nint main() {\n    int sum = addNumbers(5, 7);\n    return 0;\n}`
        },
        {
          title: "Call by Value vs Call by Reference",
          text: "In Call by Value, a copy of the argument is passed; modifications inside do not affect the original. In Call by Reference, addresses of variables are passed, allowing original variables to be edited.",
          code: `void swap(int *x, int *y) {\n    int temp = *x;\n    *x = *y;\n    *y = temp;\n}\n\n// Usage in main(): swap(&a, &b);`,
          note: "Recursion is when a function calls itself. It must have a solid base case to prevent stack overflows."
        }
      ]
    },
    {
      week: 4,
      title: "Pointers, Data Structs & File Operations",
      description: "Unlock core advanced topics: dynamic memory references, compound variables (structs), and file storage access.",
      topics: [
        {
          title: "Understanding Pointers & Memory Addresses",
          text: "Pointers are variables that store the memory address of another variable. The address-of operator (&) fetches an address, while the dereference operator (*) accesses the value stored at that address.",
          code: `int score = 100;\nint *ptr = &score;\nprintf("Address: %p, Value: %d\\n", (void*)ptr, *ptr);\n*ptr = 150; // Alters score to 150`,
          note: "Always initialize pointers. Uninitialized pointers (wild pointers) can corrupt random system memory blocks."
        },
        {
          title: "Structures & Unions",
          text: "Structures (struct) group multiple variables of different types under one name. Unions are similar, but all members share the same memory space, holding only one value at a time.",
          code: `struct Student {\n    int id;\n    char name[50];\n    float grade;\n};\n\nstruct Student s1 = {101, "Amit", 9.2f};\nprintf("Name: %s, Grade: %.1f\\n", s1.name, s1.grade);`,
          note: "Use the member access operator '.' for structure variables, and the arrow operator '->' for pointers to structures."
        },
        {
          title: "Dynamic Memory Allocation",
          text: "C offers functions in <stdlib.h> to allocate memory dynamically at runtime. malloc() allocates raw memory, calloc() allocates and clears memory to zero, and free() deallocates memory.",
          code: `int *arr = (int*) malloc(5 * sizeof(int));\nif (arr == NULL) {\n    printf("Allocation failed!\\n");\n}\nfree(arr);`,
          note: "Always call free() on dynamically allocated memory to avoid memory leaks that consume the device's RAM."
        },
        {
          title: "File Operations (File Handling)",
          text: "Files permit persistent data storage on disk. C uses a FILE pointer along with fopen(), fscanf(), fprintf(), and fclose() to create, read, and write files.",
          code: `FILE *file = fopen("data.txt", "w");\nif (file != NULL) {\n    fprintf(file, "Summer Training Completed successfully!\\n");\n    fclose(file);\n}`,
          note: "Always check if your FILE pointer is NULL after calling fopen() to verify that the file was successfully opened without disk permissions blockages."
        }
      ]
    }
  ],
  "C++": [
    {
      week: 1,
      title: "Introduction to C++ & OOP Principles",
      description: "Migrate from C to C++, understand standard streams, and discover Object-Oriented paradigm basics.",
      topics: [
        {
          title: "Transitioning from C to C++",
          text: "C++ is an extension of C, supporting OOP alongside procedural code. It replaces standard IO with object streams like std::cout and std::cin from the <iostream> library.",
          code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int num;\n    cout << "Enter a number: ";\n    cin >> num;\n    cout << "You entered: " << num << endl;\n    return 0;\n}`,
          note: "You don't need to specify format indicators like %d or %f in C++ because streams are type-safe."
        },
        {
          title: "Object-Oriented Programming (OOP) Core Concepts",
          text: "OOP organizes programs around data objects rather than actions. The 4 main pillars of OOP are: Encapsulation (hiding data), Abstraction (hiding implementation details), Inheritance (reusing characteristics), and Polymorphism (multi-form functions).",
          code: `// Structure of standard OOP design\n// Class represents a blueprint; Object represents an instance.`
        },
        {
          title: "Classes, Objects and Member Functions",
          text: "A Class is a user-defined blueprint. It holds its own data members and member functions which are accessed using an object instance of that class.",
          code: `class Car {\npublic:\n    string model;\n    void honk() {\n        cout << "Beep Beep! " << model << endl;\n    }\n};\n\nint main() {\n    Car myCar;\n    myCar.model = "Mustang";\n    myCar.honk();\n}`
        },
        {
          title: "Namespaces & Scope Resolution",
          text: "Namespaces group entities like classes and functions under a name to avoid naming collisions. The scope resolution operator (::) accesses contents of a namespace or static class member.",
          code: `#include <iostream>\n\nnamespace Academy {\n    void print() { std::cout << "Specialized Class\\n"; }\n}\n\nint main() {\n    Academy::print();\n}`
        }
      ]
    },
    {
      week: 2,
      title: "Encapsulation, Access Specifiers & Constructors",
      description: "Implement strict data protection using encapsulation, and manage object lifecycles with constructors.",
      topics: [
        {
          title: "Access Specifiers (Public, Private, Protected)",
          text: "C++ classes use specifiers to dictate who can access variables. 'private' members are accessible only inside the class; 'public' is accessible from outside; 'protected' is accessible by derived classes.",
          code: `class Student {\nprivate:\n    int rollNo; // Encapsulated\npublic:\n    void setRoll(int r) { rollNo = r; } // Getter/Setter\n    int getRoll() { return rollNo; }\n};`,
          note: "By default, all members of a C++ class are 'private', whereas members of a 'struct' are 'public'."
        },
        {
          title: "Constructors & Destructors",
          text: "A Constructor is a special member function triggered automatically when an object is created. A Destructor is triggered when the object goes out of scope, used for cleaning up memory resources.",
          code: `class Database {\npublic:\n    Database() {\n        cout << "Connection Established\\n";\n    }\n    ~Database() {\n        cout << "Connection Closed\\n";\n    }\n};`
        },
        {
          title: "Constructor Overloading & Initialization Lists",
          text: "Classes can contain multiple constructors with different parameter signatures. Member initializer lists initialize class variables before the constructor body runs, which is highly efficient.",
          code: `class Point {\nprivate:\n    int x, y;\npublic:\n    Point() : x(0), y(0) {} // Initializer list\n    Point(int xVal, int yVal) : x(xVal), y(yVal) {}\n};`
        },
        {
          title: "The 'this' Pointer & Static Members",
          text: "The 'this' pointer is an implicit pointer to the invoking object. Static data members and static member functions belong to the class itself, not individual objects.",
          code: `class Counter {\npublic:\n    static int totalCount;\n    Counter() { totalCount++; }\n};\nint Counter::totalCount = 0; // Static initialization`
        }
      ]
    },
    {
      week: 3,
      title: "Inheritance & Polymorphism",
      description: "Re-use code through class hierarchies (inheritance) and execute dynamic actions using polymorphism.",
      topics: [
        {
          title: "Class Inheritance Types",
          text: "Inheritance permits a derived class to inherit variables and functions from a base class. C++ supports Single, Multiple, Hierarchical, Multilevel, and Hybrid inheritance.",
          code: `class Animal {\npublic:\n    void eat() { cout << "Eating...\\n"; }\n};\n\nclass Dog : public Animal {\npublic:\n    void bark() { cout << "Woof!\\n"; }\n};`,
          note: "Avoid the 'Diamond Problem' in multiple inheritance by declaring base classes as 'virtual' during inheritance."
        },
        {
          title: "Polymorphism: Compile-Time (Overloading)",
          text: "Compile-time polymorphism is resolved during compilation. C++ supports Function Overloading (same name, different arguments) and Operator Overloading (defining actions for operators).",
          code: `class Calculator {\npublic:\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; } // Overloading\n};`
        },
        {
          title: "Polymorphism: Run-Time (Overriding & Virtual Functions)",
          text: "Run-time polymorphism occurs at runtime. A base class virtual function is overridden by a derived class. Triggered using pointers or references to base class.",
          code: `class Shape {\npublic:\n    virtual void draw() { cout << "Drawing shape\\n"; }\n};\n\nclass Circle : public Shape {\npublic:\n    void draw() override { cout << "Drawing circle\\n"; }\n};`,
          note: "A class containing at least one pure virtual function (e.g. virtual void draw() = 0;) is called an Abstract Class and cannot be instantiated."
        }
      ]
    },
    {
      week: 4,
      title: "Templates, STL & Exception Handling",
      description: "Write generic code using templates, manipulate collections with STL, and handle runtime errors gracefully.",
      topics: [
        {
          title: "Templates (Generic Programming)",
          text: "Templates permit writing generic functions or classes that work with any data type, avoiding code duplication.",
          code: `template <typename T>\nT getMax(T a, T b) {\n    return (a > b) ? a : b;\n}\n// Usage: getMax<int>(5, 10); getMax<double>(4.5, 2.3);`
        },
        {
          title: "Standard Template Library (STL) Containers",
          text: "The STL is a powerful suite of template classes providing containers (vectors, lists, maps, sets) and algorithms.",
          code: `#include <vector>\n#include <map>\n\nstd::vector<int> numbers = {1, 2, 3};\nnumbers.push_back(4);\nstd::map<string, int> grades;\ngrades["Rahul"] = 95;`,
          note: "Vector allocates contiguous memory like standard arrays, but resizes dynamically as items are inserted."
        },
        {
          title: "Exception Handling (Try, Catch & Throw)",
          text: "Exception handling isolates synchronous runtime errors from normal code execution using try, throw, and catch blocks.",
          code: `try {\n    int age = 15;\n    if (age < 18) throw string("Not eligible");\n} catch (string msg) {\n    cout << "Error: " << msg << endl;\n}`
        }
      ]
    }
  ],
  "IoT": [
    {
      week: 1,
      title: "IoT Foundations & Smart Sensors",
      description: "Discover Internet of Things basics, sensory inputs, analog-digital conversions, and IoT layering.",
      topics: [
        {
          title: "Introduction to IoT Architecture",
          text: "Internet of Things connects everyday physical devices to the internet. Standard architecture includes 3 layers: Perception Layer (Sensors/Actuators), Network Layer (Wi-Fi, Bluetooth, Gateways), and Application Layer (Cloud, Analytics, Dashboards)."
        },
        {
          title: "Sensors & Actuators",
          text: "Sensors read environmental conditions (temperature, light, moisture). Actuators perform physical actions (turn motors, switch relays, emit sounds) based on system command.",
          code: `// Example: DHT11 sensor measures humidity and temperature\n// LDR (Light Dependent Resistor) reads ambient lux intensity.`
        },
        {
          title: "Analog vs Digital Signals & ADC",
          text: "Physical parameters are continuous (analog) like temperature. Microcontrollers are digital and process 0s and 1s. Analog-to-Digital Converters (ADC) convert continuous signals into digital values.",
          code: `int sensorPin = A0; // Analog input pin\nint rawVal = analogRead(sensorPin); // Reads 0 to 1023 (10-bit ADC)\nfloat voltage = rawVal * (5.0 / 1023.0);`,
          note: "ESP8266 contains only 1 ADC channel (A0), whereas ESP32 contains 18 ADC channels."
        }
      ]
    },
    {
      week: 2,
      title: "Microcontrollers & Hardware Interfacing",
      description: "Interface with core IoT boards like ESP8266 and ESP32 using PWM and GPIO control.",
      topics: [
        {
          title: "IoT Dev Boards: ESP8266 & ESP32",
          text: "ESP8266 and ESP32 are cheap microcontrollers with built-in Wi-Fi and dual-mode Bluetooth (on ESP32). They run C++ sketches via the Arduino IDE ecosystem.",
          code: `#include <ESP8266WiFi.h>\n\nvoid setup() {\n    Serial.begin(115200);\n    WiFi.begin("SSID", "PASSWORD");\n}`,
          note: "Always verify your board is powered by a stable 3.3V or 5V source. Inadequate current leads to boot loop issues."
        },
        {
          title: "GPIO & Pulse Width Modulation (PWM)",
          text: "General Purpose Input Output (GPIO) pins send digital HIGH/LOW states. PWM simulates analog outputs (for LED brightness or motor speed) by toggling digital signals very fast.",
          code: `int ledPin = D2;\nvoid setup() {\n    pinMode(ledPin, OUTPUT);\n}\nvoid loop() {\n    analogWrite(ledPin, 128); // 50% duty cycle brightness\n    delay(1000);\n}`
        }
      ]
    },
    {
      week: 3,
      title: "Connectivity Protocols & Cloud Dashboards",
      description: "Transmit sensor payloads using MQTT/HTTP, and build real-time monitoring cloud panels.",
      topics: [
        {
          title: "HTTP vs MQTT Protocols",
          text: "HTTP uses standard request-response (heavyweight). MQTT (Message Queuing Telemetry Transport) is a lightweight publish-subscribe protocol ideal for low-bandwidth constrained IoT sensors.",
          code: `// MQTT Publish sample\nclient.publish("home/room/temp", "24.5");\n// Subscribing clients receive updates instantly.`
        },
        {
          title: "Cloud Services: Blynk & ThingSpeak",
          text: "ThingSpeak is an open-source IoT analytics platform to store and visualize data using channels. Blynk provides custom mobile widgets (buttons, gauges, graphs) linked to microcontrollers.",
          code: `#define BLYNK_TEMPLATE_ID "TMPL_XXX"\n#include <BlynkSimpleEsp8266.h>\n\nvoid loop() {\n    Blynk.run();\n}`
        }
      ]
    },
    {
      week: 4,
      title: "IoT Security, OTA & Practical Projects",
      description: "Secure smart setups, update software wirelessly (OTA), and deploy comprehensive smart solutions.",
      topics: [
        {
          title: "IoT Security Vulnerabilities",
          text: "IoT devices are highly prone to hacking. Mitigation strategies include avoiding default credentials, encrypting data using SSL/TLS, and setting up isolated network segments."
        },
        {
          title: "Over-The-Air (OTA) Firmware Updates",
          text: "OTA lets developers upload new firmware program code wirelessly to deployed microcontrollers, saving manual physical maintenance.",
          code: `#include <ArduinoOTA.h>\n\nvoid setup() {\n    ArduinoOTA.begin();\n}\nvoid loop() {\n    ArduinoOTA.handle();\n}`
        }
      ]
    }
  ],
  "Embedded": [
    {
      week: 1,
      title: "Embedded Systems & Core Architectures",
      description: "Examine embedded structures, Harvard vs. Von Neumann concepts, and the historic 8051 AVR chips.",
      topics: [
        {
          title: "What is an Embedded System?",
          text: "An Embedded System is a specialized, computer-based system integrated into a larger device to execute dedicated operations. Features real-time constraints, high reliability, and low power constraints."
        },
        {
          title: "Processor Architectures",
          text: "Harvard Architecture uses separate memory buses for instruction and data storage (permitting parallel fetching). Von Neumann shares a single memory bus for both, leading to processing bottlenecks.",
          note: "RISC (Reduced Instruction Set Computer) processors focus on single-cycle execution, whereas CISC (Complex Instruction Set Computer) handles multi-cycle commands."
        },
        {
          title: "8051 & AVR Microcontrollers",
          text: "The classic 8051 is an 8-bit microcontroller with 4KB ROM and 128 bytes RAM. AVR (powering Arduino Uno) is an advanced RISC chip featuring internal flash memory, EEPROM, and higher speed."
        }
      ]
    },
    {
      week: 2,
      title: "Hardware Interfacing & System Interrupts",
      description: "Program physical components like LCD 16x2, keypads, timers, and manage dynamic system interrupts.",
      topics: [
        {
          title: "Interfacing LCD 16x2 & Matrix Keypad",
          text: "A 16x2 liquid crystal display uses a 4-bit or 8-bit parallel interface. A matrix keypad uses row scanning algorithms to register keypresses dynamically with low pin counts.",
          code: `#include <LiquidCrystal.h>\nLiquidCrystal lcd(12, 11, 5, 4, 3, 2);\n\nvoid setup() {\n    lcd.begin(16, 2);\n    lcd.print("System Active");\n}`
        },
        {
          title: "Timers & Counters",
          text: "Microcontrollers contain internal hardware timers that run independently of the main program loop, useful for generating highly accurate time delays, PWM signals, or counting external pulses."
        },
        {
          title: "Interrupts vs Polling",
          text: "Polling is continuously checking status (highly CPU wasting). Interrupts are hardware-triggered events that temporarily halt the main program, jumping to an Interrupt Service Routine (ISR) instantly.",
          code: `const int interruptPin = 2;\nvoid setup() {\n    pinMode(interruptPin, INPUT_PULLUP);\n    attachInterrupt(digitalPinToInterrupt(interruptPin), handlePress, FALLING);\n}\n\nvoid handlePress() {\n    // ISR: Must be extremely fast and short\n}`,
          note: "Do not use delay() or Serial.print() inside an Interrupt Service Routine as they rely on interrupts themselves and can freeze the microcontroller."
        }
      ]
    },
    {
      week: 3,
      title: "Serial Communication Protocols",
      description: "Master essential hardware wire communications: UART, SPI, and the 2-wire I2C protocol.",
      topics: [
        {
          title: "UART (Universal Asynchronous Receiver-Transmitter)",
          text: "UART is a peer-to-peer serial communication using two wires (TX, RX). It does not share a clock signal (asynchronous), requiring identical preset baud rates to sample incoming bits.",
          code: `void setup() {\n    Serial.begin(9600); // 9600 bits per second\n}\nvoid loop() {\n    Serial.println("Telemetry Packet");\n}`
        },
        {
          title: "SPI (Serial Peripheral Interface)",
          text: "SPI is a synchronous, high-speed, full-duplex 4-wire serial bus. Uses Master-Out-Slave-In (MOSI), Master-In-Slave-Out (MISO), Serial Clock (SCK), and Slave Select (SS) lines.",
          note: "SPI is ideal for high-speed devices like SD Card modules or TFT display screens."
        },
        {
          title: "I2C (Inter-Integrated Circuit)",
          text: "I2C is a synchronous, multi-master, multi-slave 2-wire bus using Serial Data (SDA) and Serial Clock (SCL) lines. Every slave has a unique 7-bit address, conserving physical pins.",
          code: `#include <Wire.h>\n\nvoid setup() {\n    Wire.begin(); // Join I2C Bus\n    Wire.beginTransmission(0x3C); // OLED Address\n    Wire.write(0x00);\n    Wire.endTransmission();\n}`
        }
      ]
    },
    {
      week: 4,
      title: "RTOS Basics & Embedded System Design",
      description: "Implement Real-Time Operating Systems, handle multithreading, and resolve deadlocks.",
      topics: [
        {
          title: "Introduction to RTOS",
          text: "A Real-Time Operating System guarantees tasks execute within strict timing parameters. Standard OS focuses on throughput; RTOS focuses on high determinism."
        },
        {
          title: "Task Scheduling, Semaphores & Mutexes",
          text: "RTOS schedules threads by priority. A Semaphore is a signaling flag for resource access. A Mutex is a locking mechanism that guarantees mutual exclusion, allowing only one thread to access a resource.",
          note: "Priority Inversion is when a low-priority task holds a mutex needed by a high-priority task. RTOS fixes this using priority inheritance."
        },
        {
          title: "Deadlocks & Thread Synchronization",
          text: "A deadlock occurs when two tasks are permanently blocked, each waiting for a resource held by the other. Design routines carefully to fetch locks in identical order to avoid deadlocks."
        }
      ]
    }
  ]
};

export const quizzes: Record<string, WeekQuiz[]> = {
  "C": [
    {
      week: 1,
      questions: [
        {
          id: 1,
          text: "Who is known as the father of C language?",
          options: ["Dennis Ritchie", "Bjarne Stroustrup", "James Gosling", "Guido van Rossum"],
          correctAnswer: "Dennis Ritchie"
        },
        {
          id: 2,
          text: "Which of the following is NOT a primary data type in C?",
          options: ["int", "char", "string", "float"],
          correctAnswer: "string"
        },
        {
          id: 3,
          text: "What is the correct format specifier to print a double value in printf?",
          options: ["%f", "%d", "%lf", "%s"],
          correctAnswer: "%lf"
        },
        {
          id: 4,
          text: "What is the size of an int data type on most modern 32-bit/64-bit systems?",
          options: ["1 Byte", "2 Bytes", "4 Bytes", "8 Bytes"],
          correctAnswer: "4 Bytes"
        },
        {
          id: 5,
          text: "Which operator is used to fetch the memory address of a variable in scanf?",
          options: ["*", "&", "%", "->"],
          correctAnswer: "&"
        }
      ]
    },
    {
      week: 2,
      questions: [
        {
          id: 1,
          text: "What happens if a break statement is omitted in a switch-case block?",
          options: ["Compiler throws error", "Execution falls through to next case", "Program terminates immediately", "The switch block repeats forever"],
          correctAnswer: "Execution falls through to next case"
        },
        {
          id: 2,
          text: "Which loop is guaranteed to execute at least once?",
          options: ["for loop", "while loop", "do-while loop", "None of the options"],
          correctAnswer: "do-while loop"
        },
        {
          id: 3,
          text: "What does the 'continue' statement do inside a loop?",
          options: ["Terminates the loop", "Skips the rest of the current iteration", "Restarts the entire loop block", "Does nothing"],
          correctAnswer: "Skips the rest of the current iteration"
        },
        {
          id: 4,
          text: "Which of the following represents a logical AND operator in C?",
          options: ["&", "&&", "|", "||"],
          correctAnswer: "&&"
        },
        {
          id: 5,
          text: "What is the value of result in: int result = 5 + 3 * 2; ?",
          options: ["16", "11", "13", "10"],
          correctAnswer: "11"
        }
      ]
    },
    {
      week: 3,
      questions: [
        {
          id: 1,
          text: "What is the starting index of an array in C?",
          options: ["-1", "0", "1", "Custom value"],
          correctAnswer: "0"
        },
        {
          id: 2,
          text: "Which character is used to terminate a string in C?",
          options: ["\\n", "\\0", "\\t", ";"],
          correctAnswer: "\\0"
        },
        {
          id: 3,
          text: "Which header library contains function declarations like strlen() and strcpy()?",
          options: ["<stdio.h>", "<stdlib.h>", "<string.h>", "<conio.h>"],
          correctAnswer: "<string.h>"
        },
        {
          id: 4,
          text: "In Call by Reference, what do we pass to the function parameters?",
          options: ["Values of variables", "Copies of variables", "Memory addresses of variables", "Header files"],
          correctAnswer: "Memory addresses of variables"
        },
        {
          id: 5,
          text: "What is a recursive function?",
          options: ["A function that executes loops", "A function that calls itself", "A function that has no return type", "A function containing pointers"],
          correctAnswer: "A function that calls itself"
        }
      ]
    },
    {
      week: 4,
      questions: [
        {
          id: 1,
          text: "What does a pointer variable store in C?",
          options: ["An integer constant", "A character character", "Memory address of another variable", "Name of the function"],
          correctAnswer: "Memory address of another variable"
        },
        {
          id: 2,
          text: "Which operator is used to access structure members using a structure pointer?",
          options: [".", "->", "*", "&"],
          correctAnswer: "->"
        },
        {
          id: 3,
          text: "Which function is used to free dynamically allocated heap memory?",
          options: ["malloc()", "calloc()", "delete()", "free()"],
          correctAnswer: "free()"
        },
        {
          id: 4,
          text: "What is the return value of fopen() if file opening fails?",
          options: ["0", "-1", "NULL", "EOF"],
          correctAnswer: "NULL"
        },
        {
          id: 5,
          text: "In which allocation memory block does malloc() allocate memory?",
          options: ["Stack memory", "Register memory", "Heap memory", "ROM"],
          correctAnswer: "Heap memory"
        }
      ]
    }
  ],
  "C++": [
    {
      week: 1,
      questions: [
        {
          id: 1,
          text: "Which OOP concept represents hiding implementation details and showing essential features?",
          options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
          correctAnswer: "Abstraction"
        },
        {
          id: 2,
          text: "Which operator is used for input stream operations in std::cin?",
          options: ["<<", ">>", "::", "->"],
          correctAnswer: ">>"
        },
        {
          id: 3,
          text: "What is a class in C++?",
          options: ["An instance of object", "A user-defined blueprint data type", "A standard library header", "An array database"],
          correctAnswer: "A user-defined blueprint data type"
        },
        {
          id: 4,
          text: "Which operator is the Scope Resolution Operator in C++?",
          options: [".", "->", "::", "?:"],
          correctAnswer: "::"
        },
        {
          id: 5,
          text: "C++ was developed by whom?",
          options: ["Dennis Ritchie", "Bjarne Stroustrup", "Guido van Rossum", "Rasmus Lerdorf"],
          correctAnswer: "Bjarne Stroustrup"
        }
      ]
    },
    {
      week: 2,
      questions: [
        {
          id: 1,
          text: "What is the default access specifier for class members in C++?",
          options: ["public", "protected", "private", "global"],
          correctAnswer: "private"
        },
        {
          id: 2,
          text: "Which special member function is called automatically when an object goes out of scope?",
          options: ["Constructor", "Destructor", "Virtual function", "Friend function"],
          correctAnswer: "Destructor"
        },
        {
          id: 3,
          text: "Can a constructor be overloaded in C++?",
          options: ["Yes", "No", "Only if it is static", "Only if it has no parameters"],
          correctAnswer: "Yes"
        },
        {
          id: 4,
          text: "Which keyword represents an implicit pointer to the invoking object inside class functions?",
          options: ["super", "self", "this", "base"],
          correctAnswer: "this"
        },
        {
          id: 5,
          text: "A static member function can access which type of variables?",
          options: ["Only static members", "Only non-static members", "Both static and non-static members", "None"],
          correctAnswer: "Only static members"
        }
      ]
    },
    {
      week: 3,
      questions: [
        {
          id: 1,
          text: "Which keyword is used to allow derived classes to override a base class function for run-time polymorphism?",
          options: ["override", "virtual", "polymorph", "friend"],
          correctAnswer: "virtual"
        },
        {
          id: 2,
          text: "What is a class containing at least one pure virtual function called?",
          options: ["Friend class", "Concrete class", "Abstract class", "Static class"],
          correctAnswer: "Abstract class"
        },
        {
          id: 3,
          text: "Which inheritance anomaly occurs due to duplicate paths in multiple inheritance, resolved by virtual base classes?",
          options: ["The Diamond Problem", "Stack overflow", "Memory leak", "Circular reference"],
          correctAnswer: "The Diamond Problem"
        },
        {
          id: 4,
          text: "Defining multiple functions with same name but different signatures in same scope is called:",
          options: ["Function overriding", "Function overloading", "Dynamic binding", "Template programming"],
          correctAnswer: "Function overloading"
        },
        {
          id: 5,
          text: "In public inheritance, public members of the base class become what in the derived class?",
          options: ["private", "protected", "public", "inaccessible"],
          correctAnswer: "public"
        }
      ]
    },
    {
      week: 4,
      questions: [
        {
          id: 1,
          text: "Which C++ keyword is used to raise an exception?",
          options: ["try", "throw", "catch", "raise"],
          correctAnswer: "throw"
        },
        {
          id: 2,
          text: "What feature in C++ supports writing code independent of any specific data type?",
          options: ["Polymorphism", "Templates", "Namespaces", "Inheritance"],
          correctAnswer: "Templates"
        },
        {
          id: 3,
          text: "Which STL container stores contiguous elements and resizes dynamically?",
          options: ["std::map", "std::vector", "std::list", "std::stack"],
          correctAnswer: "std::vector"
        },
        {
          id: 4,
          text: "Which STL component acts as a bridge between containers and algorithms?",
          options: ["Pointers", "Iterators", "Allocators", "Functors"],
          correctAnswer: "Iterators"
        },
        {
          id: 5,
          text: "What happens if a thrown exception is not caught by any catch block?",
          options: ["Compiler ignores it", "Program terminates abnormally", "Throws compiler warning", "Repeats execution"],
          correctAnswer: "Program terminates abnormally"
        }
      ]
    }
  ],
  "IoT": [
    {
      week: 1,
      questions: [
        {
          id: 1,
          text: "Which of the following layers is responsible for sensor readings in standard IoT architecture?",
          options: ["Network Layer", "Perception Layer", "Application Layer", "Transport Layer"],
          correctAnswer: "Perception Layer"
        },
        {
          id: 2,
          text: "What component is used to convert continuous physical inputs into computer-readable digital numbers?",
          options: ["DAC", "ADC", "PWM", "GPIO"],
          correctAnswer: "ADC"
        },
        {
          id: 3,
          text: "Which component is an example of an actuator in an IoT system?",
          options: ["DHT11 sensor", "LDR light sensor", "Electric Relay Switch", "Ultrasonic sensor"],
          correctAnswer: "Electric Relay Switch"
        },
        {
          id: 4,
          text: "What physical parameter is measured by an LDR sensor?",
          options: ["Soil Moisture", "Temperature", "Light Intensity", "Gas leakage"],
          correctAnswer: "Light Intensity"
        },
        {
          id: 5,
          text: "What is the standard resolution of raw analogRead() values on Arduino Uno?",
          options: ["8-bit (0-255)", "10-bit (0-1023)", "12-bit (0-4095)", "16-bit"],
          correctAnswer: "10-bit (0-1023)"
        }
      ]
    },
    {
      week: 2,
      questions: [
        {
          id: 1,
          text: "Which IoT dev board features integrated Wi-Fi and Bluetooth standard dual-mode chips?",
          options: ["ESP8266", "ESP32", "Arduino Uno", "Atmega8"],
          correctAnswer: "ESP32"
        },
        {
          id: 2,
          text: "What does GPIO stand for in microcontroller systems?",
          options: ["General Protocol Interface Operations", "General Purpose Input Output", "Global Peripheral Input Operations", "Gate Pin Input Output"],
          correctAnswer: "General Purpose Input Output"
        },
        {
          id: 3,
          text: "Which technique toggles digital output pins extremely fast to simulate variable analog voltage?",
          options: ["ADC", "PWM", "UART", "SPI"],
          correctAnswer: "PWM"
        },
        {
          id: 4,
          text: "What voltage logic levels do ESP8266 and ESP32 GPIO pins use?",
          options: ["5.0V", "1.2V", "3.3V", "12V"],
          correctAnswer: "3.3V"
        },
        {
          id: 5,
          text: "Which function is used in Arduino scripts to configure a GPIO pin's direction (input or output)?",
          options: ["pinMode()", "digitalWrite()", "analogRead()", "setupPin()"],
          correctAnswer: "pinMode()"
        }
      ]
    },
    {
      week: 3,
      questions: [
        {
          id: 1,
          text: "Which protocol operates on a publish-subscribe model, optimized for low bandwidth IoT nodes?",
          options: ["HTTP", "FTP", "MQTT", "SMTP"],
          correctAnswer: "MQTT"
        },
        {
          id: 2,
          text: "What is an MQTT Broker responsible for?",
          options: ["Writing firmware code", "Routing and filtering message topics", "Reading sensor inputs", "Displaying graphs"],
          correctAnswer: "Routing and filtering message topics"
        },
        {
          id: 3,
          text: "Which cloud service provides custom user dashboards containing drag-and-drop widgets?",
          options: ["ThingSpeak", "Blynk", "Gitlab", "Docker Hub"],
          correctAnswer: "Blynk"
        },
        {
          id: 4,
          text: "ThingSpeak is primarily known for which feature?",
          options: ["Compiling C++ files", "Visualizing and logging channel data streams", "Mobile call triggers", "Encrypting database keys"],
          correctAnswer: "Visualizing and logging channel data streams"
        },
        {
          id: 5,
          text: "Which HTTP request method is typically used by an IoT client to send new sensor data to a Web API?",
          options: ["GET", "POST", "DELETE", "OPTIONS"],
          correctAnswer: "POST"
        }
      ]
    },
    {
      week: 4,
      questions: [
        {
          id: 1,
          text: "What does OTA stand for in the context of IoT deployment updates?",
          options: ["Over-The-Air", "Outer-Threshold-Algorithm", "Optical-Telemetric-Access", "On-Trip-Alert"],
          correctAnswer: "Over-The-Air"
        },
        {
          id: 2,
          text: "Which protocol is typically used to secure MQTT telemetry streams?",
          options: ["MQTTS (using TLS/SSL)", "WPA2", "HTTP", "Telnet"],
          correctAnswer: "MQTTS (using TLS/SSL)"
        },
        {
          id: 3,
          text: "Which is a common security vulnerability of IoT setups?",
          options: ["Dual core processors", "Using default unedited factory login credentials", "Low power consumption", "Contiguous RAM"],
          correctAnswer: "Using default unedited factory login credentials"
        },
        {
          id: 4,
          text: "How does OTA benefit remote IoT installations?",
          options: ["Powers the board wirelessly", "Permits updating firmware program code over Wi-Fi", "Reduces ADC noise", "Creates graphic icons"],
          correctAnswer: "Permits updating firmware program code over Wi-Fi"
        },
        {
          id: 5,
          text: "Which encryption standard is highly recommended for securing local IoT Wi-Fi networks?",
          options: ["WEP", "WPA/WPA2/WPA3", "NFC", "None"],
          correctAnswer: "WPA/WPA2/WPA3"
        }
      ]
    }
  ],
  "Embedded": [
    {
      week: 1,
      questions: [
        {
          id: 1,
          text: "Which microcontroller architecture features separate buses and memory spaces for instructions and data?",
          options: ["Von Neumann Architecture", "Harvard Architecture", "x86 Architecture", "None"],
          correctAnswer: "Harvard Architecture"
        },
        {
          id: 2,
          text: "The classic 8051 is a processor of how many bits?",
          options: ["4-bit", "8-bit", "16-bit", "32-bit"],
          correctAnswer: "8-bit"
        },
        {
          id: 3,
          text: "What does RISC stand for?",
          options: ["Reduced Instruction Set Computer", "Reduced Integrated Silicon Controller", "Realtime Integrated System Processor", "Random Instruction Signal Core"],
          correctAnswer: "Reduced Instruction Set Computer"
        },
        {
          id: 4,
          text: "Which of the following is a primary characteristic of an Embedded System?",
          options: ["Infinite hard drive space", "Execution of general purpose software", "High determinism and real-time execution constraint", "Must have high cooling fans"],
          correctAnswer: "High determinism and real-time execution constraint"
        },
        {
          id: 5,
          text: "What is the typical speed of an 8051 instruction cycle at 12MHz crystal?",
          options: ["1 Microsecond", "1 Millisecond", "1 Nanosecond", "1 Second"],
          correctAnswer: "1 Microsecond"
        }
      ]
    },
    {
      week: 2,
      questions: [
        {
          id: 1,
          text: "What pin count does a standard character LCD 16x2 module utilize?",
          options: ["8 pins", "16 pins", "20 pins", "4 pins"],
          correctAnswer: "16 pins"
        },
        {
          id: 2,
          text: "Which technique is highly CPU-efficient compared to polling for responding to hardware inputs?",
          options: ["Forced loops", "Interrupt routines (ISRs)", "Analog reads", "Delay timers"],
          correctAnswer: "Interrupt routines (ISRs)"
        },
        {
          id: 3,
          text: "What is a major constraint of variables manipulated inside an Interrupt Service Routine (ISR)?",
          options: ["Must be double precision", "Should be marked as global or volatile, and execution must be fast", "Must require delay() blocks", "Must be character array"],
          correctAnswer: "Should be marked as global or volatile, and execution must be fast"
        },
        {
          id: 4,
          text: "Hardware timers inside a microcontroller can run independently of what?",
          options: ["The clock crystal", "The power source", "The main CPU program execution loops", "The ground pin"],
          correctAnswer: "The main CPU program execution loops"
        },
        {
          id: 5,
          text: "In a standard matrix keypad scan, what are rows and columns set to?",
          options: ["Both inputs", "Both outputs", "One set as inputs with pullups, other set as scanning outputs", "All analog pins"],
          correctAnswer: "One set as inputs with pullups, other set as scanning outputs"
        }
      ]
    },
    {
      week: 3,
      questions: [
        {
          id: 1,
          text: "Which protocol is asynchronous and uses two independent signal wires (TX, RX)?",
          options: ["SPI", "I2C", "UART", "CAN"],
          correctAnswer: "UART"
        },
        {
          id: 2,
          text: "How many active signal lines does the SPI communication bus typically require?",
          options: ["2 lines", "3 lines", "4 lines (MISO, MOSI, SCK, SS)", "8 lines"],
          correctAnswer: "4 lines (MISO, MOSI, SCK, SS)"
        },
        {
          id: 3,
          text: "Which wire lines does I2C communication use?",
          options: ["TX, RX", "SDA, SCL", "MISO, MOSI", "VCC, GND"],
          correctAnswer: "SDA, SCL"
        },
        {
          id: 4,
          text: "What is baud rate in serial communications?",
          options: ["Number of bytes sent per minute", "Frequency of clock signal in MHz", "Data transmission rate in bits per second", "Resistance of wires"],
          correctAnswer: "Data transmission rate in bits per second"
        },
        {
          id: 5,
          text: "How are slave nodes identified in the I2C communication bus?",
          options: ["By using dedicated slave select (SS) wire pins", "By broadcasting their names", "By unique 7-bit or 10-bit address headers in data frames", "By order of connection"],
          correctAnswer: "By unique 7-bit or 10-bit address headers in data frames"
        }
      ]
    },
    {
      week: 4,
      questions: [
        {
          id: 1,
          text: "What is the primary objective of a Real-Time Operating System (RTOS)?",
          options: ["High graphic throughput", "Guaranteed, highly deterministic task completion within strict deadlines", "Auto-update of windows", "Compile code files fast"],
          correctAnswer: "Guaranteed, highly deterministic task completion within strict deadlines"
        },
        {
          id: 2,
          text: "Which RTOS mechanism acts as a locking variable to guarantee mutual exclusion of shared resources?",
          options: ["Semaphore", "Mutex", "Task Queue", "Interrupt Switch"],
          correctAnswer: "Mutex"
        },
        {
          id: 3,
          text: "What occurs in a deadlock scenario inside a multithreaded RTOS?",
          options: ["CPU speeds up", "Threads are blocked permanently, each waiting for resources held by the other", "All memory is cleared", "Tasks execute in parallel"],
          correctAnswer: "Threads are blocked permanently, each waiting for resources held by the other"
        },
        {
          id: 4,
          text: "Priority Inversion in RTOS scheduling can be resolved using which method?",
          options: ["Interrupt blocking", "Priority Inheritance", "Reducing task counts", "Using larger stacks"],
          correctAnswer: "Priority Inheritance"
        },
        {
          id: 5,
          text: "What does the RTOS Kernel Scheduler determine?",
          options: ["Baud rate of UART", "Which active task executes on the CPU next based on priority", "ADC accuracy levels", "LCD printing speed"],
          correctAnswer: "Which active task executes on the CPU next based on priority"
        }
      ]
    }
  ]
};
