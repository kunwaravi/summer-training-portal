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
      "AutoCAD 2D Drafting & Interface Baselines",
      "SolidWorks Parametric Part Modeling & Features",
      "CATIA Surface Design & Generative Shapes",
      "CNC Code Architectures (G-Codes & M-Codes)",
      "Integrated Project Work & Assemblies Drafting"
    ]
  },
  {
    id: "CADDED_Civil",
    title: "CADDED Software (Civil/Architecture)",
    description: "Master AutoCAD Civil, 3DS Max rendering, Google SketchUp, and Revit BIM systems.",
    modules: [
      "AutoCAD Civil Site Drafting & Residential Plans",
      "3DS Max Architectural Visualization & Texturing",
      "Google SketchUp Rapid 3D Prototyping Layouts",
      "Revit (Civil) Structural Detailing & Analysis",
      "Revit (Architecture) BIM Modeling & Schedules",
      "Integrated Architectural Project Work & Blueprints"
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

function getDynamicTopicsForModule(courseId: string, week: number, moduleTitle: string) {
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
    if (week === 1) {
      topics[1].text = `### AutoCAD 2D Drafting Baselines: User interface, 2D coordinates, basic drafting tools (lines, circles, arcs), layers, and dimensioning.\n\n**Hinglish Notes (सरल भाषा में):**\nAutoCAD me 2D layout design drafting standard guidelines follow karte hain. Co-ordinate systems coordinates values X aur Y mapping define parameters set variables values checks standard layouts.\n\n**Real-World Industry Case:**\nDrafting precise machine components blueprints mapping exact coordinate axes for manufacturing units.`;
      topics[3].text = `### Lab Task: Create 2D Flange Profile\nCreate a standard flange 2D drawing detailing bolt holes and central bore coordinates.\n\n**CAD Playground Simulator (बिना सॉफ्टवेयर सीखें):**\nNo CAD software installed? Run basic command lines here:\n- [CAD Command Sandbox Simulation](https://www.autodesk.com/products/autocad)\n\n**Hinglish Lab Instructions:**\n1. Flange circle diameters define geometry coordinate points set checks.\n2. Add multi-hole center coordinates layout.`;
      topics[3].code = `LINE 0,0 100,0\nCIRCLE 50,50 25\nDIMLINEAR 0,0 100,0`;
      topics[3].note = "Always verify layer designations for dimensions vs object lines.";
    } else if (week === 2) {
      topics[1].text = `### SolidWorks Parametric Part Modeling\nExtrude, Revolve, sketch relations, dimensions, and building robust reference geometry.\n\n**Hinglish Notes (सरल भाषा में):**\nSolidWorks me sketches dimensions relations parameters check tools configure options select shapes extrude profile design structure shapes mapping.\n\n**Real-World Industry Case:**\nDesigning standardized parametric brackets and casing structures for electric vehicle battery packs.`;
      topics[3].text = `### Lab Task: Extruded Hinge Bracket\nModel a parametric hinge pin bracket with custom reference planes.\n\n**CAD Playground Simulator:**\nOpen parametric modeling design sheets:\n- [SolidWorks Modeling Sandbox](https://my.solidworks.com)\n\n**Hinglish Lab Instructions:**\n1. Front plane sketch profiles specify dimensions values check.\n2. Extrude base geometry and add fillet radius.`;
      topics[3].code = `// SolidWorks API Macro snippet\nPart.Extension.SelectByID2("Front Plane", "PLANE", 0, 0, 0, False, 0, Nothing, 0)\nPart.FeatureManager.FeatureExtrude2(True, False, False, 0, 0, 0.05, 0.05, False, False, False, False, 0, 0, False, False, False, False, True, True, True, 0, 0, False)`;
      topics[3].note = "Ensure sketch is fully defined (turned black) before executing extrude.";
    } else if (week === 3) {
      topics[1].text = `### CATIA Surface Modeling & Generative Shape Design\nWireframe and Surface design workbenches, sweeps, lofts, joins, and splines.\n\n**Hinglish Notes (सरल भाषा में):**\nCATIA Generative Shape Design workbench surface design layouts surface sweeps shape guidelines curves configurations setups trace mapping.\n\n**Real-World Industry Case:**\nAerodynamic surfaces lofting and surfacing profiles design for aircraft wings modeling layout.`;
      topics[3].text = `### Lab Task: Aerofoil Surface Sweep\nDesign a turbine blade surface using CATIA Generative Shape Design.\n\n**CAD Playground Simulator:**\nOpen surface modeling systems references:\n- [CATIA Shape Design Sandbox](https://3ds.com/products-services/catia)\n\n**Hinglish Lab Instructions:**\n1. Define spline coordinates profile contours checks.\n2. Sweep surface profile curves.`;
      topics[3].code = `// CATIA Scripting sweep surface snippet\nSet hybridShapeSweepCircle = hybridShapeFactory.AddNewSweepCircle(hybridShapeCircle)\nhybridBody.AppendHybridShape hybridShapeSweepCircle`;
      topics[3].note = "Verify surface tangency continuity (G1/G2) curves transitions.";
    } else if (week === 4) {
      topics[1].text = `### CNC Code Architectures: G-Codes & M-Codes\nDecoupling tool coordinates. G-codes (G00, G01, G02, G03) and M-codes (M03, M05, M08) for milling.\n\n**Hinglish Notes (सरल भाषा में):**\nCNC milling turning operations coordinates values instructions define code blocks spindle speed direction controls set rules mapping.\n\n**Real-World Industry Case:**\nAutomated machining of custom engine manifold heads from aluminum blocks using precision G-code.`;
      topics[3].text = `### Lab Task: Pocket Milling G-Code\nWrite G-code to mill a 50x50mm pocket with safety retract coordinates.\n\n**CNC Simulator Sandbox:**\nVerify toolpaths simulation online here:\n- [Interactive CNC Simulator Playground](https://ncviewer.com)\n\n**Hinglish Lab Instructions:**\n1. Setup feed rates coordinates absolute values G90.\n2. Write tool path contours coordinates M30 program end.`;
      topics[3].code = `G90 G21 G17 (Absolute Coordinates, Metric)\nG00 Z5.0 (Safety Retract)\nM03 S1200 (Spindle On)\nG00 X10.0 Y10.0\nG01 Z-2.0 F100\nG01 X40.0 Y10.0 F300\nG01 X40.0 Y40.0\nG01 X10.0 Y40.0\nG01 X10.0 Y10.0\nG00 Z5.0\nM30`;
      topics[3].note = "Always simulate toolpaths in virtual dry run viewer before running on live CNC milling systems.";
    } else {
      topics[1].text = `### Integrated Project Work: Mechanical Assembly\nAssemblies design, bill of materials (BOM), assembly constraints, exploded views, and production drafting.\n\n**Hinglish Notes (सरल भाषा में):**\nAssembly design components mates specify constraints check parts alignments design structure verification options.\n\n**Real-World Industry Case:**\nFull assembly design of multi-cylinder internal combustion engines with detailed BOM and stress analysis.`;
      topics[3].text = `### Lab Task: Piston-Cylinder Assembly design\nDraft a complete mechanical assembly layout of a piston-cylinder mechanism.\n\n**CAD Playground Simulator:**\nAssemble components layout templates:\n- [Integrated Assembly Sandbox](https://www.autodesk.com/solutions/cad-cam)\n\n**Hinglish Lab Instructions:**\n1. Insert piston cylinder models references check.\n2. Specify mates constraints concentric axis coincident surfaces.`;
      topics[3].code = `// Assembly Constraint Definition\nComponent1.Mate(Component2, Coincident, Axis1, Axis2)\nComponent1.Mate(Component2, Distance, Plane1, Plane2, 10.0)`;
      topics[3].note = "Check assembly degrees of freedom (DOF) to ensure no loose parts remain.";
    }
  } else if (courseId === "CADDED_Civil") {
    if (week === 1) {
      topics[1].text = `### AutoCAD Civil Drafting & Residential Plans\nCoordinate systems, alignments, parcels, profiles, cross-sections, and building layout drafting.\n\n**Hinglish Notes (सरल भाषा में):**\nCivil layout design plans drawings layers configuration dimensions lines alignments structural maps configure check.\n\n**Real-World Industry Case:**\nStandardized residential building structural plans submission matching municipal drawing guidelines.`;
      topics[3].text = `### Lab Task: 2BHK Plan Drafting\nDraft a standard 2BHK residential building layout layout.\n\n**CAD Playground Simulator:**\nRun basic command lines here:\n- [CAD Command Sandbox Simulation](https://www.autodesk.com/products/autocad)\n\n**Hinglish Lab Instructions:**\n1. Set grid sizes structural layout grids markers set.\n2. Offset walls and place door/window symbols.`;
      topics[3].code = `OFFSET 230 (Wall thickness)\nLINE 0,0 3500,0 (Bedroom Width)\nRECTANG 0,0 4200,3600 (Living Room)`;
      topics[3].note = "Always verify structural dimensions standards before detailing column layouts.";
    } else if (week === 2) {
      topics[1].text = `### 3DS Max Architectural Rendering & Textures\nPoly modeling, material mapping, textures, V-Ray/Arnold rendering setup, and camera placements.\n\n**Hinglish Notes (सरल भाषा में):**\n3DS Max interior exterior photorealistic rendering modeling cameras lighting material textures check tools setup configurations.\n\n**Real-World Industry Case:**\nHigh-end marketing visual materials generation for luxury villa housing developments.`;
      topics[3].text = `### Lab Task: Exterior Camera Lighting Setup\nCreate a photorealistic exterior rendering for a modern villa.\n\n**CAD Playground Simulator:**\nOpen rendering scene blueprints:\n- [3ds Max Modeling Sandbox](https://autodesk.com/products/3ds-max)\n\n**Hinglish Lab Instructions:**\n1. Set sunlight shadows V-Ray Sun parameters.\n2. Map concrete textures Diffuse Bump map files.`;
      topics[3].code = `// 3ds Max MaxScript helper\nvray = VRayMtl()\nvray.diffuse = color 128 128 128\n$.material = vray`;
      topics[3].note = "Adjust ambient occlusion values to get high depth realism in final renderings.";
    } else if (week === 3) {
      topics[1].text = `### Google SketchUp: Rapid 3D Prototyping\nPush/Pull operations, components group, dynamic components, styles, and landscape architecture.\n\n**Hinglish Notes (सरल भाषा में):**\nGoogle SketchUp rapid modeling tool groups component library styles design push pull dimensions trace check.\n\n**Real-World Industry Case:**\nRapid structural modeling of commercial retail space layouts to present design options to stakeholders.`;
      topics[3].text = `### Lab Task: Modular Kitchen modeling\nModel a modular kitchen design layout using custom components.\n\n**CAD Playground Simulator:**\nOpen rapid modeling scenes:\n- [SketchUp Web Sandbox](https://app.sketchup.com)\n\n**Hinglish Lab Instructions:**\n1. Create base rectangular shapes face profiles.\n2. Push-pull vertical heights and import preset components.`;
      topics[3].code = `// Ruby API SketchUp snippet\nmodel = Sketchup.active_model\nentities = model.active_entities\nface = entities.add_face [0,0,0], [10,0,0], [10,10,0], [0,10,0]\nface.pushpull -5`;
      topics[3].note = "Ensure all distinct wall parts are grouped to prevent sticky face issues.";
    } else if (week === 4) {
      topics[1].text = `### Revit (Civil): Structural Detailing & Analytical Modeling\nColumns, beams, structural slabs, foundations, reinforcement detail maps, and structural analytical models.\n\n**Hinglish Notes (सरल भाषा में):**\nRevit Structural tools slab foundation beam columns steel rebar rebar distribution detailing checks modeling configurations.\n\n**Real-World Industry Case:**\nConstructing structural BIM model detailing reinforcement schedules for concrete high-rise foundations.`;
      topics[3].text = `### Lab Task: Beam-Column Junction rebar\nModel a reinforced concrete column-beam junction detailing steel rebar layouts.\n\n**CAD Playground Simulator:**\nOpen structural detail template sheets:\n- [Revit Structural Sandbox](https://autodesk.com/products/revit)\n\n**Hinglish Lab Instructions:**\n1. Place structural grids concrete profiles dimensions.\n2. Run reinforcement detailing paths specify spacing values.`;
      topics[3].code = `// Revit C# API Structural Member Creation\nFamilyInstance beam = doc.Create.NewFamilyInstance(point, beamType, structuralLevel, StructuralType.Beam);`;
      topics[3].note = "Verify grid connections to keep alignment in analytical loads calculations.";
    } else if (week === 5) {
      topics[1].text = `### Revit (Architecture): BIM Modeling & Sheet Layouts\nWalls, windows, doors, stairs, roofs, families customization, scheduling, and building documentation sheets.\n\n**Hinglish Notes (सरल भाषा में):**\nRevit Architecture BIM tools floor plans sections schedules doors windows documentation sheets layout design checks.\n\n**Real-World Industry Case:**\nCreating building permit documentation package containing detailed architectural floor plans, sections, and schedules.`;
      topics[3].text = `### Lab Task: Floor Plan BIM scheduling\nCreate a comprehensive multi-story commercial building sheets layout with door/window schedules.\n\n**CAD Playground Simulator:**\nOpen architectural BIM projects:\n- [Revit Architecture Sandbox](https://autodesk.com/products/revit)\n\n**Hinglish Lab Instructions:**\n1. Place exterior brick walls internal plaster divisions.\n2. Create door schedules sheets verify items count.`;
      topics[3].code = `// Revit C# API Wall Creation\nWall wall = Wall.Create(document, curve, levelId, false);`;
      topics[3].note = "Always align room bounding options for precise floor area calculations.";
    } else {
      topics[1].text = `### Integrated Architectural Project Work\nIntegrated Architectural Project: Design of a multi-story residential building, structural planning, visual rendering, and BIM documentation.\n\n**Hinglish Notes (सरल भाषा में):**\nCivil blueprint creation structural schedules drawings loads layouts reports portfolio design compilation checks.\n\n**Real-World Industry Case:**\nFinal portfolio submission of a complete G+3 commercial building design with full architectural, structural, and BIM documentation.`;
      topics[3].text = `### Lab Task: Comprehensive Building Portfolio\nAssemble the complete architectural blueprint and structural load calculations portfolio.\n\n**CAD Playground Simulator:**\nOpen integrated BIM drawings:\n- [BIM Projects Sandbox](https://autodesk.com/solutions/bim)\n\n**Hinglish Lab Instructions:**\n1. Link structural model architectural coordinates setup.\n2. Generate final sheet layouts drawing viewports.`;
      topics[3].code = `// Documentation Sheet Creation\nViewSheet sheet = ViewSheet.Create(document, titleBlockId);\nViewport.Create(document, sheet.Id, viewId, xyzLocation);`;
      topics[3].note = "Perform interference check checks to resolve collisions between services.";
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
          price: 499,
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
          price: 499
        }
      });
      console.log(`Updated Course: ${course.id}`);
    }

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
      await prisma.topic.deleteMany({ where: { moduleId: modRecord.id } });
      await prisma.quizQuestion.deleteMany({ where: { moduleId: modRecord.id } });

      // Seed exactly 6 topics matching module content requirements
      const topicsData = getDynamicTopicsForModule(course.id, moduleOrder, moduleTitle);

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
