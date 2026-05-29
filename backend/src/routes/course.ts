import { Router } from 'express';

const router = Router();

const curriculum = {
  "C": [
    { week: 1, title: "Basics", content: "Introduction to C, Data Types, Variables, and Operators." },
    { week: 2, title: "Control", content: "Control Statements (If-Else, Loops) and Switch Case." },
    { week: 3, title: "Advanced", content: "Arrays, Strings, and Functions." },
    { week: 4, title: "Hardware", content: "Pointers, Structures, and Basic File Handling." }
  ],
  "C++": [
    { week: 1, title: "OOPs Intro", content: "Introduction to C++ and OOPs concepts." },
    { week: 2, title: "Classes", content: "Classes, Objects, and Constructors/Destructors." },
    { week: 3, title: "Advanced OOPs", content: "Inheritance and Polymorphism." },
    { week: 4, title: "STL", content: "Templates, Exception Handling, and STL." }
  ],
  "IoT": [
    { week: 1, title: "IoT Intro", content: "Introduction to IoT, Architecture, and Sensors." },
    { week: 2, title: "Controllers", content: "Microcontrollers for IoT (ESP8266, ESP32)." },
    { week: 3, title: "Connectivity", content: "Communication Protocols (MQTT, HTTP) and Cloud." },
    { week: 4, title: "Security", content: "IoT Security and Real-time projects." }
  ],
  "Embedded": [
    { week: 1, title: "Embedded Intro", content: "Introduction to Embedded Systems and 8051/AVR." },
    { week: 2, title: "Interfacing", content: "Interfacing (LEDs, Switches, LCDs) and Timers." },
    { week: 3, title: "Communication", content: "Serial Communication (UART, SPI, I2C)." },
    { week: 4, title: "RTOS", content: "RTOS basics and Mini Project." }
  ]
};

router.get('/', (req, res) => {
  res.json(curriculum);
});

export default router;
