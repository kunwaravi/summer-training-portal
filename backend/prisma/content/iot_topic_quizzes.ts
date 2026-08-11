/**
 * IoT course — per-topic quizzes.
 *
 * Keyed by the EXACT topic titles used in `iot.ts`. Each topic has 4
 * questions (4 options, exactly 1 correct). These back the frontend
 * topic-lock flow: a topic is only unlockable once the previous topic's
 * quiz is passed, and the topic quiz is fetched by topic id.
 *
 * IMPORTANT: question texts must NOT duplicate the chapter-quiz texts in
 * iot.ts, because the week quiz endpoint returns every question in a
 * module (topic + chapter) together.
 */

export interface IotTopicQuiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const iotTopicQuizzes: Record<string, IotTopicQuiz[]> = {
  // ── W1 · Introduction to IoT & Smart Systems ───────────────────────────────
  "What the Internet of Things Really Means": [
    { text: "The 'Internet of Things' is best described as…", options: ["a brand of smartwatch", "physical objects that sense, compute, and communicate over a network", "a faster WiFi standard", "a database of sensor readings"], correctAnswer: "physical objects that sense, compute, and communicate over a network" },
    { text: "An IoT device needs a network connection mainly to…", options: ["look bigger", "share its data and receive commands remotely", "charge its battery", "run its operating system"], correctAnswer: "share its data and receive commands remotely" },
    { text: "Which of these is NOT a typical IoT device?", options: ["a smart thermostat", "a connected soil-moisture sensor", "a networked security camera", "a standalone calculator"], correctAnswer: "a standalone calculator" },
    { text: "The value of IoT data grows most when…", options: ["it stays on one device", "many devices share it and the combined data enables decisions", "it is encrypted twice", "devices are switched off"], correctAnswer: "many devices share it and the combined data enables decisions" },
  ],
  "Smart Systems: Perception to Action": [
    { text: "The 'perception' step of a smart system is performed by…", options: ["sensors", "actuators", "the power supply", "the enclosure"], correctAnswer: "sensors" },
    { text: "In the sense→process→connect→act loop, 'act' is carried out by…", options: ["the sensor", "the actuator", "the cloud", "the router"], correctAnswer: "the actuator" },
    { text: "A smart irrigation system decides to water a plant because…", options: ["it is Tuesday", "a soil sensor reading crossed a threshold and firmware acted on it", "a human remembered to", "the pump is connected"], correctAnswer: "a soil sensor reading crossed a threshold and firmware acted on it" },
    { text: "The word 'smart' in a smart system usually means…", options: ["it has a touchscreen", "it makes a decision automatically from sensed data", "it is expensive", "it speaks"], correctAnswer: "it makes a decision automatically from sensed data" },
  ],
  "IoT vs Traditional Embedded Systems": [
    { text: "The key addition that turns an embedded system into an IoT device is…", options: ["a larger PCB", "connectivity to a network", "a colour screen", "more RAM"], correctAnswer: "connectivity to a network" },
    { text: "A washing machine running firmware with no network port is best called…", options: ["an IoT device", "a traditional embedded system", "a cloud platform", "a server"], correctAnswer: "a traditional embedded system" },
    { text: "Unlike a desktop program, an embedded system usually…", options: ["runs one dedicated task on limited hardware", "needs a full OS with a browser", "reboots hourly", "only works online"], correctAnswer: "runs one dedicated task on limited hardware" },
    { text: "IoT devices must be updateable in the field because…", options: ["they are pretty", "bugs and security holes need patching after deployment", "it is required by law", "batteries drain"], correctAnswer: "bugs and security holes need patching after deployment" },
  ],
  "Real-World IoT Use Cases": [
    { text: "Predictive maintenance uses sensors to…", options: ["sell more parts", "predict equipment failure before it happens", "slow machinery down", "replace humans"], correctAnswer: "predict equipment failure before it happens" },
    { text: "A smart city traffic system might use IoT to…", options: ["paint roads", "time lights based on live vehicle flow", "charge cars", "cut trees"], correctAnswer: "time lights based on live vehicle flow" },
    { text: "In agriculture, a soil-moisture sensor grid helps farmers…", options: ["grow crops indoors", "irrigate only when and where water is needed", "sell seeds", "map weather"], correctAnswer: "irrigate only when and where water is needed" },
    { text: "Which constraint most shapes a wearable health tracker's design?", options: ["screen size only", "low power and small size over months of battery life", "the price of the app", "its weight limit"], correctAnswer: "low power and small size over months of battery life" },
  ],

  // ── W2 · IoT Architecture & Reference Model ────────────────────────────────
  "The Four-Layer IoT Stack": [
    { text: "Which layer of the IoT stack physically measures the world?", options: ["perception/sensing", "network", "processing", "application"], correctAnswer: "perception/sensing" },
    { text: "The network layer's job is to…", options: ["read the sensor", "carry data between devices and the cloud", "store data", "drive the actuator"], correctAnswer: "carry data between devices and the cloud" },
    { text: "In a four-layer stack, analytics and decision-making live mostly in…", options: ["the sensing layer", "the network layer", "the processing/application layer", "the power layer"], correctAnswer: "the processing/application layer" },
    { text: "The application layer is what the…", options: ["sensor sees", "end user interacts with", "router routes", "battery powers"], correctAnswer: "end user interacts with" },
  ],
  "Edge vs Fog vs Cloud Computing": [
    { text: "Edge computing processes data…", options: ["in a distant data centre", "near the device on local hardware", "on a satellite", "never"], correctAnswer: "near the device on local hardware" },
    { text: "Why process at the edge instead of the cloud?", options: ["cloud is too cheap", "low latency, offline resilience, and less bandwidth", "edge has more CPU", "cloud cannot store data"], correctAnswer: "low latency, offline resilience, and less bandwidth" },
    { text: "Fog computing sits between…", options: ["sensors and the actuator", "edge devices and the cloud, as an intermediate tier", "two routers", "two databases"], correctAnswer: "edge devices and the cloud, as an intermediate tier" },
    { text: "For a safety-critical valve that must react in milliseconds, you should decide…", options: ["in the cloud after a round trip", "at the edge, locally and immediately", "at the dashboard", "in a spreadsheet"], correctAnswer: "at the edge, locally and immediately" },
  ],
  "IoT Protocols by Layer": [
    { text: "MQTT is primarily a…", options: ["physical radio standard", "publish/subscribe messaging protocol", "display driver", "power standard"], correctAnswer: "publish/subscribe messaging protocol" },
    { text: "Which protocol is lightweight and designed for constrained devices?", options: ["MQTT", "HTTP/2 streaming video", "SMTP", "DNS"], correctAnswer: "MQTT" },
    { text: "HTTP over REST is best for…", options: ["request/response web APIs", "streaming sensor feeds to many subscribers", "low-power mesh", "radio ranging"], correctAnswer: "request/response web APIs" },
    { text: "WiFi operates at which layer of the OSI model?", options: ["application", "data-link/physical", "presentation", "session"], correctAnswer: "data-link/physical" },
  ],
  "Designing a Simple IoT Architecture": [
    { text: "The first thing to fix when designing an IoT architecture is…", options: ["the dashboard colours", "the requirements — what must the system do, where, and how reliably", "the PCB shape", "the font"], correctAnswer: "the requirements — what must the system do, where, and how reliably" },
    { text: "A device that must work during an internet outage needs…", options: ["faster WiFi", "local/edge processing with buffering", "a bigger antenna", "a second router"], correctAnswer: "local/edge processing with buffering" },
    { text: "Choosing MQTT vs HTTP depends mainly on…", options: ["brand preference", "whether you need push/pub-sub to many subscribers or simple request/response", "the OSI layer", "the antenna type"], correctAnswer: "whether you need push/pub-sub to many subscribers or simple request/response" },
    { text: "The 'edge vs cloud' split is decided by…", options: ["latency, reliability, and cost requirements", "the colour of the LED", "the length of the USB cable", "the version of Arduino IDE"], correctAnswer: "latency, reliability, and cost requirements" },
  ],

  // ── W3 · Sensors & Transducers ─────────────────────────────────────────────
  "Sensors: From Physics to Electrical Signal": [
    { text: "A sensor's role is to…", options: ["turn a physical quantity into an electrical signal", "turn electricity into motion", "store data", "boost WiFi"], correctAnswer: "turn a physical quantity into an electrical signal" },
    { text: "Which is an analog temperature sensor?", options: ["DHT22", "LM35", "DS18B20", "MPU6050"], correctAnswer: "LM35" },
    { text: "A temperature-dependent resistor whose resistance changes with heat is a…", options: ["thermistor", "photodiode", "hall sensor", "accelerometer"], correctAnswer: "thermistor" },
    { text: "Sensitivity of a sensor refers to…", options: ["how big it is", "how much the output changes per unit of the measured quantity", "how fast it boots", "its price"], correctAnswer: "how much the output changes per unit of the measured quantity" },
  ],
  "Digital Sensors & Communication Interfaces": [
    { text: "Which of these sensors communicates over I2C?", options: ["MPU6050 accelerometer/gyroscope", "a plain potentiometer", "a thermistor", "a push button"], correctAnswer: "MPU6050 accelerometer/gyroscope" },
    { text: "A sensor reporting via 1-Wire protocol must be handled by…", options: ["the ADC", "a one-wire library and a specific data pin", "the PWM output", "the USB port"], correctAnswer: "a one-wire library and a specific data pin" },
    { text: "The main advantage of a digital sensor over a raw analog one is…", options: ["it is always cheaper", "calibrated readings with noise immunity over the wire", "it needs no power", "it is smaller"], correctAnswer: "calibrated readings with noise immunity over the wire" },
    { text: "DHT11/DHT22 communicate using…", options: ["a single-wire proprietary protocol", "SPI", "UART only", "I2S"], correctAnswer: "a single-wire proprietary protocol" },
  ],
  "Analog Sensors, ADCs & Voltage Dividers": [
    { text: "To read an analog sensor the microcontroller needs…", options: ["an ADC", "a DAC", "a radio", "an ethernet port"], correctAnswer: "an ADC" },
    { text: "A light-dependent resistor (LDR) is usually wired with a fixed resistor to form a…", options: ["transformer", "voltage divider", "rectifier", "oscillator"], correctAnswer: "voltage divider" },
    { text: "If the sensor output can reach 12V and the ADC only accepts 3.3V, you must…", options: ["connect directly anyway", "level-shift/scale the signal down first", "raise the ADC reference", "ignore it"], correctAnswer: "level-shift/scale the signal down first" },
    { text: "A voltage divider output is affected if…", options: ["the ADC input impedance is too low and loads it", "the code is in C", "the sensor is digital", "the LED is too bright"], correctAnswer: "the ADC input impedance is too low and loads it" },
  ],
  "Choosing, Wiring & Calibrating Sensors": [
    { text: "The first check before wiring a sensor is…", options: ["its datasheet: pinout, supply voltage, and interface", "its color", "its price", "the firmware version"], correctAnswer: "its datasheet: pinout, supply voltage, and interface" },
    { text: "A sensor requiring 5V connected to a 3.3V only board needs…", options: ["a direct connection", "a level shifter or regulator for the sensor supply", "a resistor only", "nothing"], correctAnswer: "a level shifter or regulator for the sensor supply" },
    { text: "Calibration means…", options: ["colouring the sensor", "mapping raw readings to true physical units using known references", "reducing the sample rate", "rebooting the board"], correctAnswer: "mapping raw readings to true physical units using known references" },
    { text: "If readings swing wildly, the most likely fix is…", options: ["averaging/filtering and a stable supply with proper grounding", "changing the board color", "raising the baud rate", "unplugging the actuator"], correctAnswer: "averaging/filtering and a stable supply with proper grounding" },
  ],

  // ── W4 · Signal Conditioning, ADC & DAC ────────────────────────────────────
  "Signal Conditioning: Amplify, Level-Shift, Filter": [
    { text: "Signal conditioning is the stage that…", options: ["amplifies, shifts, and filters the raw sensor signal", "replaces the sensor", "uploads data", "charges the battery"], correctAnswer: "amplifies, shifts, and filters the raw sensor signal" },
    { text: "A wheatstone bridge + instrumentation amplifier is used when…", options: ["the sensor change is tiny (strain gauges)", "the sensor is digital", "the cable is short", "the power is high"], correctAnswer: "the sensor change is tiny (strain gauges)" },
    { text: "A level-shifter is needed when…", options: ["the sensor output is negative or outside the ADC range", "the sensor is too expensive", "the code is too long", "WiFi is slow"], correctAnswer: "the sensor output is negative or outside the ADC range" },
    { text: "A low-pass filter on a sensor line removes…", options: ["the DC level", "high-frequency noise", "the sensor itself", "all signal"], correctAnswer: "high-frequency noise" },
  ],
  "ADC in Depth: Sampling, Resolution & Accuracy": [
    { text: "A 10-bit ADC can represent…", options: ["1024 discrete levels", "10 levels", "65536 levels", "256 levels"], correctAnswer: "1024 discrete levels" },
    { text: "With a 3.3V reference, one LSB of a 10-bit ADC is roughly…", options: ["3.3 mV", "33 mV", "0.3 mV", "330 mV"], correctAnswer: "3.3 mV" },
    { text: "The Nyquist theorem says you must sample…", options: ["once per minute", "at least twice the highest signal frequency", "as slowly as possible", "never"], correctAnswer: "at least twice the highest signal frequency" },
    { text: "A reading of 2048 on a 12-bit ADC with a 3.3V reference means…", options: ["3.3V", "about 1.65V", "0V", "5V"], correctAnswer: "about 1.65V" },
  ],
  "Analog Output: PWM, DAC & Servo Control": [
    { text: "PWM produces an analog-like output by…", options: ["rapidly switching a digital pin between high and low", "changing the supply voltage", "using a radio", "turning the pin off"], correctAnswer: "rapidly switching a digital pin between high and low" },
    { text: "Increasing a PWM duty cycle makes an LED…", options: ["blink faster", "appear brighter (more on-time)", "change colour", "turn off"], correctAnswer: "appear brighter (more on-time)" },
    { text: "A 50 Hz PWM signal with a 1.5 ms pulse centres a standard servo because…", options: ["the pulse width maps to a position", "servos ignore PWM", "50 Hz is the mains frequency", "1.5 ms is the shortest pulse"], correctAnswer: "the pulse width maps to a position" },
    { text: "A true analog voltage output (not PWM) needs a…", options: ["DAC", "digital pin", "thermistor", "relay"], correctAnswer: "DAC" },
  ],
  "Noise, Grounding & Robust Readings": [
    { text: "The most common cause of noisy analog readings is…", options: ["poor grounding and shared power rails", "too many comments in code", "long function names", "the IDE version"], correctAnswer: "poor grounding and shared power rails" },
    { text: "Twisting signal wires with ground helps by…", options: ["reducing electromagnetic coupling of noise", "making them prettier", "increasing voltage", "reducing resistance"], correctAnswer: "reducing electromagnetic coupling of noise" },
    { text: "Reading a sensor several times and averaging is a form of…", options: ["oversampling/filtering to smooth noise", "calibration", "rounding error", "aliasing"], correctAnswer: "oversampling/filtering to smooth noise" },
    { text: "A separate analog ground plane helps because…", options: ["digital switching currents do not contaminate the analog reference", "it saves PCB space", "it looks professional", "it reduces components"], correctAnswer: "digital switching currents do not contaminate the analog reference" },
  ],

  // ── W5 · Actuators & Output Control ────────────────────────────────────────
  "Actuator Types & Principles": [
    { text: "An actuator converts…", options: ["electrical signals into physical motion/force", "motion into electricity", "light into voltage", "sound into data"], correctAnswer: "electrical signals into physical motion/force" },
    { text: "A DC motor produces…", options: ["continuous rotary motion", "linear push only", "heat only", "sound only"], correctAnswer: "continuous rotary motion" },
    { text: "A solenoid produces…", options: ["a short linear push/pull when energised", "continuous rotation", "a chemical reaction", "light"], correctAnswer: "a short linear push/pull when energised" },
    { text: "A stepper motor's advantage is…", options: ["precise angular positioning in steps", "unlimited torque", "silence", "no electronics"], correctAnswer: "precise angular positioning in steps" },
  ],
  "Driving DC Motors & H-Bridges": [
    { text: "An H-bridge is used to…", options: ["reverse a DC motor's direction", "amplify a servo signal", "convert AC to DC", "store power"], correctAnswer: "reverse a DC motor's direction" },
    { text: "The L298N/L293D motor driver's main job is to…", options: ["supply enough current and provide the H-bridge switching", "read the motor's temperature", "filter WiFi", "charge the battery"], correctAnswer: "supply enough current and provide the H-bridge switching" },
    { text: "A motor directly on a microcontroller pin usually fails because…", options: ["the pin cannot supply the motor's current", "motors are too quiet", "pins are too fast", "motors need 240V"], correctAnswer: "the pin cannot supply the motor's current" },
    { text: "The flyback/freewheel diodes across a motor protect the driver from…", options: ["back-EMF spikes when the motor switches off", "overheating", "dust", "vibration"], correctAnswer: "back-EMF spikes when the motor switches off" },
  ],
  "Relays & Switching AC/Mains Loads": [
    { text: "A relay switches a high-power load using a…", options: ["small control signal driving an electromagnet", "large direct current", "radio wave", "light pulse"], correctAnswer: "small control signal driving an electromagnet" },
    { text: "Always use an optocoupler or a proper relay module with a transistor driver because…", options: ["the MCU cannot source the relay coil current and needs isolation", "it looks cooler", "relays are digital", "the load is small"], correctAnswer: "the MCU cannot source the relay coil current and needs isolation" },
    { text: "Switching mains (230V) requires…", options: ["a mains-rated relay and safe, insulated wiring — never a bare GPIO", "just a GPIO pin", "a thermistor", "a second MCU"], correctAnswer: "a mains-rated relay and safe, insulated wiring — never a bare GPIO" },
    { text: "A relay's 'flyback diode' across the coil prevents…", options: ["the inductive kick damaging the driver", "arc damage to the contacts only", "the MCU rebooting due to low voltage", "radio interference only"], correctAnswer: "the inductive kick damaging the driver" },
  ],
  "PWM Motor Speed & Servo Position Control": [
    { text: "Motor speed is controlled by varying the…", options: ["PWM duty cycle", "supply frequency", "motor size", "gear ratio"], correctAnswer: "PWM duty cycle" },
    { text: "A servo expects a repeating pulse whose…", options: ["width encodes the target position", "frequency is 50 MHz", "amplitude varies", "phase encodes speed"], correctAnswer: "width encodes the target position" },
    { text: "To smoothly ramp a motor you should…", options: ["ramp the duty cycle gradually, not jump instantly", "switch the motor on and off rapidly", "change the code colour", "increase voltage"], correctAnswer: "ramp the duty cycle gradually, not jump instantly" },
    { text: "Which library is the standard for controlling servos on Arduino?", options: ["Servo.h", "WiFi.h", "SD.h", "EEPROM.h"], correctAnswer: "Servo.h" },
  ],

  // ── W6 · Microcontrollers & Development Boards ─────────────────────────────
  "Microcontroller vs Microprocessor": [
    { text: "A microcontroller (MCU) integrates…", options: ["CPU, RAM, flash, and peripherals on one chip", "a full PC motherboard", "a graphics card", "a hard disk"], correctAnswer: "CPU, RAM, flash, and peripherals on one chip" },
    { text: "A microprocessor (like an x86 CPU) typically needs…", options: ["external RAM, storage, and chipset support", "nothing else", "only an antenna", "a touchscreen"], correctAnswer: "external RAM, storage, and chipset support" },
    { text: "Which is more suitable for a battery-powered sensor node?", options: ["an MCU", "a desktop x86 CPU", "a server GPU", "a network switch"], correctAnswer: "an MCU" },
    { text: "MCUs are preferred for embedded control because of…", options: ["low power, low cost, and predictable real-time behaviour", "the fastest possible FLOPS", "the biggest screens", "the most RAM"], correctAnswer: "low power, low cost, and predictable real-time behaviour" },
  ],
  "The Board Landscape: Arduino, ESP8266, ESP32": [
    { text: "Which board family adds native WiFi and is the IoT favourite?", options: ["ESP8266/ESP32", "a pure AVR Arduino Uno", "a calculator", "a Raspberry Pi Pico only"], correctAnswer: "ESP8266/ESP32" },
    { text: "The Arduino Uno's ATmega328P has about…", options: ["2 KB RAM and 32 KB flash", "512 MB RAM", "8 GB flash", "no memory"], correctAnswer: "2 KB RAM and 32 KB flash" },
    { text: "The ESP32 differs from the ESP8266 by adding…", options: ["dual cores, Bluetooth, and more peripherals", "a printer", "an SD slot only", "a camera only"], correctAnswer: "dual cores, Bluetooth, and more peripherals" },
    { text: "For a project that needs both WiFi and Bluetooth, choose…", options: ["an ESP32", "an ESP8266", "an Arduino Uno", "a Raspberry Pi Pico"], correctAnswer: "an ESP32" },
  ],
  "GPIO Architecture: Pins, Pull-ups & Level Shifting": [
    { text: "An input pin with no pull-up or pull-down and a floating wire reads…", options: ["random/unstable values", "always 0", "always 1", "5V"], correctAnswer: "random/unstable values" },
    { text: "Internal pull-up resistors on an ESP32 are used when…", options: ["you want a pin to read high by default and low when the button grounds it", "you need more current", "the pin is analog", "the pin is PWM"], correctAnswer: "you want a pin to read high by default and low when the button grounds it" },
    { text: "Connecting a 5V logic output directly to a 3.3V ESP32 GPIO can…", options: ["damage the GPIO from overvoltage", "do nothing", "increase speed", "improve accuracy"], correctAnswer: "damage the GPIO from overvoltage" },
    { text: "The safest way to connect a 5V device to a 3.3V MCU input is…", options: ["a level shifter or a resistor divider", "a direct jumper", "a longer cable", "a second antenna"], correctAnswer: "a level shifter or a resistor divider" },
  ],
  "Choosing the Right Microcontroller for Your IoT Project": [
    { text: "For a battery-powered sensor that wakes once a minute, prioritise…", options: ["deep-sleep current and wake latency", "screen size", "USB speed", "number of cores"], correctAnswer: "deep-sleep current and wake latency" },
    { text: "A project needing many simultaneous GPIO peripherals should check…", options: ["the pin count and peripheral availability, not just the CPU speed", "only the brand", "the LED color", "the package size"], correctAnswer: "the pin count and peripheral availability, not just the CPU speed" },
    { text: "ESP8266 lacks which feature that matters for bigger IoT projects?", options: ["enough RAM/flash and BLE for complex firmware", "any CPU", "any GPIO", "WiFi"], correctAnswer: "enough RAM/flash and BLE for complex firmware" },
    { text: "The choice between ESP32, Arduino, and a Raspberry Pi hinges mainly on…", options: ["compute, connectivity, power, and peripherals required by the design", "which is cheaper on sale", "brand loyalty", "the case colour"], correctAnswer: "compute, connectivity, power, and peripherals required by the design" },
  ],

  // ── W7 · Arduino Programming Fundamentals ──────────────────────────────────
  "The Arduino Platform & Sketch Structure": [
    { text: "The two mandatory Arduino functions are…", options: ["setup() and loop()", "begin() and end()", "main() and exit()", "init() and run()"], correctAnswer: "setup() and loop()" },
    { text: "setup() runs…", options: ["once at startup", "every loop iteration", "only on button press", "never"], correctAnswer: "once at startup" },
    { text: "A 'sketch' in Arduino terminology is…", options: ["a program written for the Arduino framework", "a wiring diagram", "a type of resistor", "a board version"], correctAnswer: "a program written for the Arduino framework" },
    { text: "The Arduino framework hides the…", options: ["low-level register setup behind simple functions", "need for a power supply", "need for sensors", "compiler entirely"], correctAnswer: "low-level register setup behind simple functions" },
  ],
  "Digital I/O: Buttons, Debouncing & LEDs": [
    { text: "To read a button you configure the pin as…", options: ["INPUT_PULLUP", "OUTPUT", "ANALOG", "PWM"], correctAnswer: "INPUT_PULLUP" },
    { text: "Switch bounce causes…", options: ["multiple rapid on/off transitions that need debouncing", "a permanent short circuit", "slower code", "battery drain"], correctAnswer: "multiple rapid on/off transitions that need debouncing" },
    { text: "The classic software debounce is…", options: ["ignore changes for a short period after a transition", "add a second button", "read the pin faster", "use an analog pin"], correctAnswer: "ignore changes for a short period after a transition" },
    { text: "Driving an LED needs a series resistor to…", options: ["limit the current", "increase brightness", "add delay", "filter WiFi"], correctAnswer: "limit the current" },
  ],
  "Analog Input & PWM Output Patterns": [
    { text: "analogRead() returns a value in the range…", options: ["0-1023 on a 10-bit ADC", "0-255 always", "0-3.3", "0-65535"], correctAnswer: "0-1023 on a 10-bit ADC" },
    { text: "analogWrite() on a digital PWM pin controls…", options: ["the duty cycle (apparent voltage/level)", "the ADC reference", "the sample rate", "the baud rate"], correctAnswer: "the duty cycle (apparent voltage/level)" },
    { text: "Mapping a raw ADC 0-1023 to 0-100% is done with…", options: ["map(raw, 0, 1023, 0, 100)", "analogRead(raw)", "delay(raw)", "digitalWrite(raw)"], correctAnswer: "map(raw, 0, 1023, 0, 100)" },
    { text: "PWM on a digital pin is NOT the same as…", options: ["a true analog voltage from a DAC", "a digital high/low", "a square wave", "a timer output"], correctAnswer: "a true analog voltage from a DAC" },
  ],
  "Serial Debugging & Structured Logging": [
    { text: "Serial.begin(115200) sets…", options: ["the baud rate of the USB/serial debug link", "the WiFi speed", "the ADC resolution", "the PWM frequency"], correctAnswer: "the baud rate of the USB/serial debug link" },
    { text: "If Serial Monitor shows garbage characters, the likely cause is…", options: ["a baud-rate mismatch between firmware and monitor", "a broken LED", "low battery only", "wrong GPIO"], correctAnswer: "a baud-rate mismatch between firmware and monitor" },
    { text: "Structured logging means…", options: ["using consistent, tagged log lines with levels for filtering", "printing everything unlabelled", "using no Serial at all", "blinking LEDs"], correctAnswer: "using consistent, tagged log lines with levels for filtering" },
    { text: "Overuse of Serial.print in a high-speed loop…", options: ["slows the loop and can stall it", "speeds the loop", "frees memory", "fixes debounce"], correctAnswer: "slows the loop and can stall it" },
  ],

  // ── W8 · ESP32 Deep Dive ───────────────────────────────────────────────────
  "ESP32 Architecture: Dual Cores, Memory & Peripherals": [
    { text: "The ESP32 has…", options: ["two Xtensa cores", "no CPU", "an x86 core", "four ARM cores"], correctAnswer: "two Xtensa cores" },
    { text: "FreeRTOS on the ESP32 lets you…", options: ["run tasks on the two cores with priority scheduling", "only run one thread", "skip the scheduler", "use Windows programs"], correctAnswer: "run tasks on the two cores with priority scheduling" },
    { text: "The ESP32 has roughly…", options: ["520 KB SRAM", "8 MB SRAM", "1 KB SRAM", "no RAM"], correctAnswer: "520 KB SRAM" },
    { text: "Which ESP32 peripheral is handy for precise timing?", options: ["hardware timers", "the WiFi antenna", "the USB-C port", "the RGB LED"], correctAnswer: "hardware timers" },
  ],
  "WiFi & Bluetooth on ESP32": [
    { text: "The ESP32 supports both…", options: ["WiFi and Bluetooth", "WiFi and FM radio", "Bluetooth and satellite", "only Ethernet"], correctAnswer: "WiFi and Bluetooth" },
    { text: "To connect to a WiFi network in Arduino you call…", options: ["WiFi.begin(ssid, pass)", "WiFi.listen()", "WiFi.attach()", "WiFi.scan()"], correctAnswer: "WiFi.begin(ssid, pass)" },
    { text: "ESP32 BLE can act as…", options: ["both peripheral and central", "only a GPS receiver", "only a WiFi repeater", "a 4G modem"], correctAnswer: "both peripheral and central" },
    { text: "The ESP32 WiFi supports…", options: ["2.4 GHz (802.11 b/g/n)", "5 GHz only", "60 GHz", "no bands"], correctAnswer: "2.4 GHz (802.11 b/g/n)" },
  ],
  "ADC, DAC & Sensor Interfacing on ESP32": [
    { text: "The ESP32 ADC with default attenuation measures…", options: ["about 0-1V only (use attenuation for 0-3.3V)", "0-240V", "0-5V always", "only digital values"], correctAnswer: "about 0-1V only (use attenuation for 0-3.3V)" },
    { text: "analogReadResolution() lets you set the ESP32 ADC to…", options: ["9, 10, 11, or 12 bits", "only 8 bits", "24 bits", "1 bit"], correctAnswer: "9, 10, 11, or 12 bits" },
    { text: "The ESP32 includes a built-in…", options: ["DAC on two pins", "graphics accelerator", "FM transmitter", "printer"], correctAnswer: "DAC on two pins" },
    { text: "The ESP32 ADC is known to be…", options: ["non-linear near the extremes — calibrate or add attenuation", "perfectly linear everywhere", "digital only", "unusable"], correctAnswer: "non-linear near the extremes — calibrate or add attenuation" },
  ],
  "Timers, RTC & Low-Power Modes": [
    { text: "ESP32 deep sleep draws…", options: ["as little as ~5-10 uA", "as much as a laptop", "the same as active mode", "nothing at all"], correctAnswer: "as little as ~5-10 uA" },
    { text: "To wake from deep sleep you can use…", options: ["a timer, GPIO, or touch sensor", "only a USB cable", "only the reset button", "the WiFi signal"], correctAnswer: "a timer, GPIO, or touch sensor" },
    { text: "During deep sleep, the…", options: ["RTC memory and ULP can keep working while main cores sleep", "entire chip is fully off", "WiFi keeps streaming", "ADC reads forever"], correctAnswer: "RTC memory and ULP can keep working while main cores sleep" },
    { text: "For a battery node reporting once an hour, the correct pattern is…", options: ["deep sleep between reports", "continuous WiFi streaming", "100% CPU usage", "no sleep at all"], correctAnswer: "deep sleep between reports" },
  ],

  // ── W9 · Serial Communication: UART ────────────────────────────────────────
  "UART Protocol Fundamentals": [
    { text: "UART transmits data…", options: ["one bit at a time over two wires (TX/RX)", "in parallel over 8 wires", "over the air", "as packets on a shared bus"], correctAnswer: "one bit at a time over two wires (TX/RX)" },
    { text: "In UART, the correct wiring is…", options: ["TX to RX, RX to TX, shared ground", "TX to TX, RX to RX", "only one wire", "SCL to SCL"], correctAnswer: "TX to RX, RX to TX, shared ground" },
    { text: "Both UART ends must agree on…", options: ["baud rate, data bits, parity, and stop bits", "the wire colour", "the voltage", "the antenna"], correctAnswer: "baud rate, data bits, parity, and stop bits" },
    { text: "UART is…", options: ["asynchronous (no clock line)", "synchronous with a clock line", "always wireless", "a bus with addresses"], correctAnswer: "asynchronous (no clock line)" },
  ],
  "Wiring UART Devices Correctly": [
    { text: "A common UART wiring mistake is…", options: ["connecting TX to TX and RX to RX", "using too long a wire", "using a shared ground", "using the same baud rate"], correctAnswer: "connecting TX to TX and RX to RX" },
    { text: "Crossing TX/RX is called…", options: ["a null-modem/crossover connection", "a loopback test", "a short circuit", "ground bounce"], correctAnswer: "a null-modem/crossover connection" },
    { text: "5V UART devices connected to a 3.3V ESP32 need…", options: ["a level shifter on the signal lines", "nothing", "a second battery", "longer cables"], correctAnswer: "a level shifter on the signal lines" },
    { text: "If UART data is garbled, the first thing to check is…", options: ["the baud rate matches on both sides", "the wire colour", "the firmware version", "the antenna"], correctAnswer: "the baud rate matches on both sides" },
  ],
  "Parsing Serial Protocols: NMEA GPS & AT Commands": [
    { text: "NMEA sentences from a GPS module start with…", options: ["$", "#", "!", "AT"], correctAnswer: "$" },
    { text: "The $GPRMC NMEA sentence contains…", options: ["position, time, and speed", "the baud rate", "WiFi passwords", "battery level"], correctAnswer: "position, time, and speed" },
    { text: "AT commands are used to…", options: ["configure modems/modules like a GSM or ESP8266", "format an SD card", "compile the sketch", "dim LEDs"], correctAnswer: "configure modems/modules like a GSM or ESP8266" },
    { text: "When parsing serial streams, you should…", options: ["read into a buffer until a line terminator, then parse", "read one char and ignore the rest", "flush the buffer every second", "use analogRead"], correctAnswer: "read into a buffer until a line terminator, then parse" },
  ],
  "UART Debugging & Logic Analysis": [
    { text: "A logic analyzer is great for UART debugging because it…", options: ["captures the actual voltage-time waveform to decode bits", "replaces the MCU", "only reads I2C", "charges batteries"], correctAnswer: "captures the actual voltage-time waveform to decode bits" },
    { text: "If you see only the idle line (high) with no activity, likely…", options: ["nothing is being transmitted (wrong pin or no code)", "baud is too high", "the ground is shorted", "the wire is crossed"], correctAnswer: "nothing is being transmitted (wrong pin or no code)" },
    { text: "A wrong baud rate shows up on the analyzer as…", options: ["frames that decode to garbage", "no idle level", "a DC offset", "nothing"], correctAnswer: "frames that decode to garbage" },
    { text: "Before opening a logic-analyzer trace, confirm…", options: ["the baud rate and logic level (3.3V vs 5V)", "the wire color", "the code style", "the antenna"], correctAnswer: "the baud rate and logic level (3.3V vs 5V)" },
  ],

  // ── W10 · Serial Communication: I2C ────────────────────────────────────────
  "I2C Protocol & the Two-Wire Bus": [
    { text: "I2C uses which two wires?", options: ["SCL (clock) and SDA (data)", "TX and RX", "MOSI and MISO", "VCC and GND"], correctAnswer: "SCL (clock) and SDA (data)" },
    { text: "I2C is…", options: ["synchronous (clock-driven) and multi-device on two wires", "asynchronous point-to-point", "wireless", "a single-master-only protocol"], correctAnswer: "synchronous (clock-driven) and multi-device on two wires" },
    { text: "Multiple I2C devices share the bus by…", options: ["unique device addresses", "unique wire colours", "different baud rates", "time slots only"], correctAnswer: "unique device addresses" },
    { text: "The I2C master provides…", options: ["the clock signal", "power to slaves", "the antenna", "the ground"], correctAnswer: "the clock signal" },
  ],
  "I2C Addressing, Conflicts & Bus Sharing": [
    { text: "Two I2C sensors with the SAME address on one bus…", options: ["conflict — you must change an address pin or use another bus", "work fine", "merge their data", "slow down the clock"], correctAnswer: "conflict — you must change an address pin or use another bus" },
    { text: "An I2C scan finds a device at 0x68. That is the…", options: ["7-bit device address", "baud rate", "memory offset", "GPIO number"], correctAnswer: "7-bit device address" },
    { text: "If two devices share an address, you can often…", options: ["change the address via a pin (e.g., AD0) or use an I2C mux", "remove one device", "increase the clock", "add pull-ups"], correctAnswer: "change the address via a pin (e.g., AD0) or use an I2C mux" },
    { text: "An I2C bus with no responding device shows up in a scan as…", options: ["no addresses found", "every address", "a crash", "a short circuit"], correctAnswer: "no addresses found" },
  ],
  "Reading I2C Sensor Registers": [
    { text: "Many I2C sensors expose…", options: ["registers you read/write to get data and config", "a single pin you tap", "an SD card", "a serial port"], correctAnswer: "registers you read/write to get data and config" },
    { text: "Writing the register address before reading is how the master…", options: ["points the device at which register to return", "sets the clock speed", "resets the device", "sends power"], correctAnswer: "points the device at which register to return" },
    { text: "16-bit sensor values usually come back as…", options: ["two bytes you must combine (often big-endian)", "one byte only", "a float", "a string"], correctAnswer: "two bytes you must combine (often big-endian)" },
    { text: "To begin with the MPU6050 you should…", options: ["wake it by clearing its sleep bit in a power register", "press its button", "flash its firmware", "call analogRead"], correctAnswer: "wake it by clearing its sleep bit in a power register" },
  ],
  "I2C Pull-ups, Speed & Real-World Pitfalls": [
    { text: "I2C lines need…", options: ["pull-up resistors to VCC", "pull-down resistors to GND", "no resistors", "a series LED"], correctAnswer: "pull-up resistors to VCC" },
    { text: "An I2C scan finds nothing. The two most likely causes are…", options: ["missing pull-ups and wrong pins", "wrong baud rate and wrong voltage only", "too much flash and too little RAM", "no LCD and no camera"], correctAnswer: "missing pull-ups and wrong pins" },
    { text: "Raising I2C speed beyond the sensor's spec causes…", options: ["unreliable reads", "brighter LEDs", "faster WiFi", "more RAM"], correctAnswer: "unreliable reads" },
    { text: "Long I2C wires cause problems because of…", options: ["capacitance degrading the signal edges", "the color of the wires", "the connector shape", "the baud format"], correctAnswer: "capacitance degrading the signal edges" },
  ],

  // ── W11 · Serial Communication: SPI ────────────────────────────────────────
  "SPI Protocol & the Four-Wire Bus": [
    { text: "SPI uses which wires?", options: ["MOSI, MISO, SCLK, and CS/SS", "SDA and SCL", "TX and RX", "VCC and GND only"], correctAnswer: "MOSI, MISO, SCLK, and CS/SS" },
    { text: "SPI is…", options: ["synchronous and fast, with a separate chip-select per device", "asynchronous and slow", "a two-wire bus", "wireless"], correctAnswer: "synchronous and fast, with a separate chip-select per device" },
    { text: "The CS/SS pin…", options: ["selects which slave the master talks to", "carries the data", "carries the clock", "supplies power"], correctAnswer: "selects which slave the master talks to" },
    { text: "MOSI and MISO stand for…", options: ["master-out/slave-in and master-in/slave-out", "many-out/some-in", "modem-output/serial-input", "motion-signal"], correctAnswer: "master-out/slave-in and master-in/slave-out" },
  ],
  "Chip Select & Sharing the SPI Bus": [
    { text: "To add a second SPI device you…", options: ["wire it to the same MOSI/MISO/SCLK and give it its own CS pin", "need a second MCU", "need a second SDA", "change the baud"], correctAnswer: "wire it to the same MOSI/MISO/SCLK and give it its own CS pin" },
    { text: "Only one SPI slave can be active at a time because…", options: ["they all share the MISO line — only the selected one should drive it", "there is only one power pin", "the clock is shared", "CS is shorted"], correctAnswer: "they all share the MISO line — only the selected one should drive it" },
    { text: "If two SPI devices share a bus, ensure…", options: ["only the selected device's CS is pulled low", "both CS are always low", "no CS at all", "both devices output simultaneously"], correctAnswer: "only the selected device's CS is pulled low" },
    { text: "SD cards and displays commonly use…", options: ["SPI", "UART only", "PWM only", "1-wire"], correctAnswer: "SPI" },
  ],
  "SPI vs I2C: Choosing the Right Bus": [
    { text: "Choose SPI over I2C when you need…", options: ["high data rates (displays, SD cards)", "the lowest pin count", "automatic device discovery", "just two wires"], correctAnswer: "high data rates (displays, SD cards)" },
    { text: "I2C's advantage over SPI is…", options: ["fewer wires and device addressing without extra CS pins", "higher speed", "longer range", "more power"], correctAnswer: "fewer wires and device addressing without extra CS pins" },
    { text: "SPI supports…", options: ["full-duplex data flow (send and receive simultaneously)", "only half-duplex", "no slave devices", "no master"], correctAnswer: "full-duplex data flow (send and receive simultaneously)" },
    { text: "For a slow sensor you read once a second, prefer…", options: ["I2C (fewer pins, fine speed)", "SPI always", "UART", "parallel bus"], correctAnswer: "I2C (fewer pins, fine speed)" },
  ],
  "Debugging SPI: Modes, Wiring & Timing": [
    { text: "SPI mode is defined by…", options: ["clock polarity (CPOL) and phase (CPHA)", "the baud rate", "the wire color", "the number of devices"], correctAnswer: "clock polarity (CPOL) and phase (CPHA)" },
    { text: "A device expecting SPI mode 0 will misbehave if you configure…", options: ["mode 3 (different CPOL/CPHA)", "mode 0", "the same frequency", "the same CS pin"], correctAnswer: "mode 3 (different CPOL/CPHA)" },
    { text: "If SPI returns garbage, check in order…", options: ["wiring/CS, SPI mode, clock frequency, and power", "only the baud rate", "the antenna", "the case colour"], correctAnswer: "wiring/CS, SPI mode, clock frequency, and power" },
    { text: "Clock frequency too high for a device causes…", options: ["data corruption", "faster boot", "more RAM", "lower power"], correctAnswer: "data corruption" },
  ],

  // ── W12 · Networking & WiFi Connectivity ───────────────────────────────────
  "IP, TCP & the Internet Stack on an MCU": [
    { text: "An IP address identifies…", options: ["a host on the network", "a file on disk", "a sensor pin", "a colour"], correctAnswer: "a host on the network" },
    { text: "TCP provides…", options: ["reliable, ordered, connection-oriented delivery", "fire-and-forget delivery", "broadcast only", "no delivery"], correctAnswer: "reliable, ordered, connection-oriented delivery" },
    { text: "UDP is chosen when…", options: ["a dropped sample is acceptable and you want low overhead", "you need guaranteed order", "you need a session", "you need encryption built in"], correctAnswer: "a dropped sample is acceptable and you want low overhead" },
    { text: "On an MCU, the TCP/IP stack is…", options: ["implemented in software on top of WiFi/ethernet", "not possible", "in the cloud", "in the battery"], correctAnswer: "implemented in software on top of WiFi/ethernet" },
  ],
  "WiFi Security: WPA2/WPA3 & SSID Best Practice": [
    { text: "The current recommended WiFi encryption is…", options: ["WPA2 or WPA3", "WEP", "open network", "WPS PIN"], correctAnswer: "WPA2 or WPA3" },
    { text: "WEP should be avoided because…", options: ["it is easily cracked", "it is too fast", "it is hard to type", "it has no password"], correctAnswer: "it is easily cracked" },
    { text: "Which SSID choice is more secure?", options: ["a non-guessable, unique SSID with WPA2/WPA3", "the router model as SSID with WEP", "an open network", "SSID equal to password"], correctAnswer: "a non-guessable, unique SSID with WPA2/WPA3" },
    { text: "Why disable WPS on a router?", options: ["WPS PINs are brute-forceable", "it uses more power", "it is proprietary", "it reduces speed only"], correctAnswer: "WPS PINs are brute-forceable" },
  ],
  "Reliable WiFi: Reconnects, Timeouts & Watchdogs": [
    { text: "WiFi can drop at any time, so firmware must…", options: ["check connection and reconnect with backoff", "never check", "reboot instantly", "ignore it"], correctAnswer: "check connection and reconnect with backoff" },
    { text: "Blocking forever waiting for a connection is bad because…", options: ["the watchdog may reset the device and you stall the loop", "it saves power", "it is required", "it prevents drops"], correctAnswer: "the watchdog may reset the device and you stall the loop" },
    { text: "A watchdog timer recovers a hung device by…", options: ["resetting it if the main loop stops feeding it", "reflashing it", "changing the SSID", "raising the voltage"], correctAnswer: "resetting it if the main loop stops feeding it" },
    { text: "After a reconnect, you should…", options: ["re-establish MQTT and re-subscribe", "do nothing", "change the baud rate", "increase the clock"], correctAnswer: "re-establish MQTT and re-subscribe" },
  ],
  "Hostnames, mDNS & Finding Your Device": [
    { text: "You can reach your ESP32 by name instead of remembering an IP using…", options: ["mDNS hostnames like esp32.local", "its MAC address", "its baud rate", "its GPIO count"], correctAnswer: "mDNS hostnames like esp32.local" },
    { text: "Static IPs vs DHCP for devices — the trade-off is…", options: ["static IPs are stable but conflict-prone; DHCP is automatic but the IP can change", "static is always better", "DHCP is always better", "there is no difference"], correctAnswer: "static IPs are stable but conflict-prone; DHCP is automatic but the IP can change" },
    { text: "After enabling mDNS, the ESP32 responds to…", options: ["esp32.local over the LAN", "only the router IP", "the public internet", "nothing"], correctAnswer: "esp32.local over the LAN" },
    { text: "For a fleet of identical devices, giving each a unique…", options: ["hostname/identifier matters", "voltage is enough", "LED color is enough", "wire length"], correctAnswer: "hostname/identifier matters" },
  ],

  // ── W13 · HTTP, REST & WebSockets ──────────────────────────────────────────
  "HTTP from a Microcontroller": [
    { text: "An HTTP GET request is used to…", options: ["fetch a resource from a server", "send sensor data", "update firmware", "dim an LED"], correctAnswer: "fetch a resource from a server" },
    { text: "HTTP response code 200 means…", options: ["success", "authentication failed", "not found", "server error"], correctAnswer: "success" },
    { text: "HTTP response code 404 means…", options: ["resource not found", "success", "moved", "timeout"], correctAnswer: "resource not found" },
    { text: "HTTP is built on…", options: ["TCP", "UDP", "ICMP", "a parallel bus"], correctAnswer: "TCP" },
  ],
  "REST APIs & JSON Payloads": [
    { text: "REST APIs map actions to HTTP verbs — creating a resource typically uses…", options: ["POST", "GET", "DELETE", "PATCH"], correctAnswer: "POST" },
    { text: "Reading data from a REST endpoint typically uses…", options: ["GET", "POST", "DELETE", "PUT"], correctAnswer: "GET" },
    { text: "JSON is…", options: ["a lightweight text data format with key-value pairs", "a hardware bus", "an encryption method", "a motor"], correctAnswer: "a lightweight text data format with key-value pairs" },
    { text: "To send JSON on an ESP32 you usually use…", options: ["ArduinoJson to build/parse the payload", "the SD library", "the servo library", "analogRead"], correctAnswer: "ArduinoJson to build/parse the payload" },
  ],
  "WebSockets: Real-Time Two-Way Updates": [
    { text: "WebSockets provide…", options: ["persistent two-way communication over a single TCP connection", "one-shot HTTP requests", "file transfer", "broadcast-only radio"], correctAnswer: "persistent two-way communication over a single TCP connection" },
    { text: "WebSockets are the right choice when…", options: ["the server must push updates to the client in real time", "you send one request per hour", "you need the lowest possible overhead", "you use UDP"], correctAnswer: "the server must push updates to the client in real time" },
    { text: "Unlike HTTP polling, WebSockets…", options: ["avoid repeated request overhead and enable instant push", "are slower", "need no server", "only work on LAN"], correctAnswer: "avoid repeated request overhead and enable instant push" },
    { text: "On the ESP32, WebSocket events are handled…", options: ["asynchronously in a callback (onEvent)", "by blocking the loop", "in the battery", "by the SD card"], correctAnswer: "asynchronously in a callback (onEvent)" },
  ],
  "Choosing the API Style for Your Device": [
    { text: "For a one-shot reading fetched by an app, the simplest style is…", options: ["a REST GET endpoint", "a WebSocket", "MQTT with QoS 0", "a radio burst"], correctAnswer: "a REST GET endpoint" },
    { text: "For live push of sensor values to many subscribers, choose…", options: ["MQTT or WebSockets", "HTTP polling", "a print statement", "a file"], correctAnswer: "MQTT or WebSockets" },
    { text: "REST is stateless; WebSockets are…", options: ["stateful and connection-oriented", "stateless", "always encrypted", "read-only"], correctAnswer: "stateful and connection-oriented" },
    { text: "The deciding factor between MQTT and HTTP for your device is…", options: ["how many subscribers, how often, and whether push or pull fits", "the LED colour", "the baud rate", "the cable length"], correctAnswer: "how many subscribers, how often, and whether push or pull fits" },
  ],

  // ── W14 · MQTT Protocol Deep Dive ──────────────────────────────────────────
  "MQTT Publish/Subscribe Fundamentals": [
    { text: "In the MQTT model, messages flow…", options: ["through a central broker", "directly between devices", "via email", "by UDP broadcast"], correctAnswer: "through a central broker" },
    { text: "The main advantage of pub/sub decoupling is…", options: ["publishers and subscribers do not need to know each other", "faster CPU", "no broker needed", "built-in encryption"], correctAnswer: "publishers and subscribers do not need to know each other" },
    { text: "An MQTT client connects to the broker using…", options: ["a unique client ID", "its MAC only", "its IP only", "its GPIO"], correctAnswer: "a unique client ID" },
    { text: "Which library implements MQTT on the ESP32/Arduino?", options: ["PubSubClient", "SD", "Servo", "EEPROM"], correctAnswer: "PubSubClient" },
  ],
  "MQTT Topics, Wildcards & Best Practices": [
    { text: "The topic `factory/+/motor5/temp` matches…", options: ["motor5's temp across all lines (the + matches one level)", "exactly one topic", "everything in the factory", "nothing"], correctAnswer: "motor5's temp across all lines (the + matches one level)" },
    { text: "The topic `home/#` subscribes to…", options: ["everything under home at any depth", "one topic", "nothing", "only the home level"], correctAnswer: "everything under home at any depth" },
    { text: "Best practice is to keep volatile values out of topics and…", options: ["put IDs and timestamps in the JSON payload", "in the topic instead", "never send them", "in the SSID"], correctAnswer: "put IDs and timestamps in the JSON payload" },
    { text: "Topics should be ordered…", options: ["broadest category first (site/zone/device/metric)", "randomly", "shortest first", "alphabetically only"], correctAnswer: "broadest category first (site/zone/device/metric)" },
  ],
  "QoS Levels, Retained Messages & Last Will": [
    { text: "QoS 1 (at-least-once) can deliver a message…", options: ["more than once", "never", "exactly once always", "only offline"], correctAnswer: "more than once" },
    { text: "A retained message is delivered to…", options: ["new subscribers immediately, holding the last state", "nobody", "only the publisher", "only QoS 0 clients"], correctAnswer: "new subscribers immediately, holding the last state" },
    { text: "The Last Will is published by the broker when…", options: ["the device disconnects abnormally", "the device sends a reading", "a new topic is created", "the broker reboots"], correctAnswer: "the device disconnects abnormally" },
    { text: "QoS 2 provides…", options: ["exactly-once delivery with a four-way handshake", "fire-and-forget", "no guarantee", "duplicates"], correctAnswer: "exactly-once delivery with a four-way handshake" },
  ],
  "Building a Full MQTT Device Pipeline": [
    { text: "The first component in the pipeline is…", options: ["a broker (Mosquitto or a cloud platform)", "a dashboard", "an LED", "a battery"], correctAnswer: "a broker (Mosquitto or a cloud platform)" },
    { text: "In a production MQTT setup you should…", options: ["use unique credentials and TLS (port 8883)", "leave the broker open", "use plain UDP", "share one password fleet-wide"], correctAnswer: "use unique credentials and TLS (port 8883)" },
    { text: "The loop that keeps a node alive through router reboots is…", options: ["ensure WiFi, reconnect MQTT, pump, publish", "delay(10000) forever", "no loop", "reset every minute"], correctAnswer: "ensure WiFi, reconnect MQTT, pump, publish" },
    { text: "To make devices show online/offline, combine…", options: ["retained status + Last Will", "QoS 0 only", "long topics", "no subscriptions"], correctAnswer: "retained status + Last Will" },
  ],

  // ── W15 · Cloud Platforms & Dashboards ─────────────────────────────────────
  "What an IoT Cloud Platform Does": [
    { text: "Which is a self-hosted full IoT platform?", options: ["ThingsBoard", "the Arduino IDE", "a calculator", "an FTP server"], correctAnswer: "ThingsBoard" },
    { text: "A managed cloud IoT service (like AWS IoT Core) offers…", options: ["device registry, rules engine, and telemetry storage", "a free phone", "a PCB designer", "a battery"], correctAnswer: "device registry, rules engine, and telemetry storage" },
    { text: "The main reason to use a platform instead of building your own backend is…", options: ["it provides connectivity, storage, rules, and dashboards out of the box", "it is mandatory", "it uses less power", "it has better colours"], correctAnswer: "it provides connectivity, storage, rules, and dashboards out of the box" },
    { text: "Choosing a self-hosted platform vs a managed cloud depends on…", options: ["control/cost vs scale/managed effort", "the LED type", "the baud rate", "the cable colour"], correctAnswer: "control/cost vs scale/managed effort" },
  ],
  "Device Provisioning & Authentication": [
    { text: "The industry-standard device authentication for cloud IoT is…", options: ["per-device X.509 certificates verified during TLS", "one shared password", "the MAC address", "no authentication"], correctAnswer: "per-device X.509 certificates verified during TLS" },
    { text: "Why not share one credential across the fleet?", options: ["one leaked token compromises every device", "it is slower", "credentials expire faster", "the broker rejects it"], correctAnswer: "one leaked token compromises every device" },
    { text: "Bulk provisioning is needed when…", options: ["you deploy hundreds of devices and cannot touch each one", "you have one device", "devices are offline", "you use tokens"], correctAnswer: "you deploy hundreds of devices and cannot touch each one" },
    { text: "Production firmware should…", options: ["store credentials in NVS/secure storage, never in source", "hardcode them in main()", "share them publicly", "skip them"], correctAnswer: "store credentials in NVS/secure storage, never in source" },
  ],
  "Telemetry Ingress: Device to Cloud": [
    { text: "The recommended way to send a reading to a cloud platform is…", options: ["publish small JSON over MQTT (QoS 1)", "email it", "print it", "store it locally forever"], correctAnswer: "publish small JSON over MQTT (QoS 1)" },
    { text: "Batching telemetry before sending…", options: ["cuts radio-on time and extends battery life", "makes data useless", "is required", "increases packet size"], correctAnswer: "cuts radio-on time and extends battery life" },
    { text: "If a publish fails, the device should…", options: ["buffer the reading and retry, never drop silently", "delete it", "ignore it", "reboot"], correctAnswer: "buffer the reading and retry, never drop silently" },
    { text: "Telemetry schemas should be…", options: ["fixed and consistent across the fleet (units and field names)", "different per device", "random", "encrypted only"], correctAnswer: "fixed and consistent across the fleet (units and field names)" },
  ],
  "Dashboards, Alerts & RPC Control": [
    { text: "A platform alert should be…", options: ["actionable and rate-limited with hysteresis", "sent every second", "random", "disabled"], correctAnswer: "actionable and rate-limited with hysteresis" },
    { text: "RPC (remote procedure call) downlink lets the platform…", options: ["send commands the device executes (e.g. relay_on)", "read the sensor", "charge the battery", "rename the SSID"], correctAnswer: "send commands the device executes (e.g. relay_on)" },
    { text: "The complete IoT loop is…", options: ["sense → cloud → decide → act → confirm", "build → deploy → forget", "publish → sleep → repeat", "connect → disconnect"], correctAnswer: "sense → cloud → decide → act → confirm" },
    { text: "A good dashboard…", options: ["answers a question at a glance", "shows every raw number", "flashes constantly", "never updates"], correctAnswer: "answers a question at a glance" },
  ],

  // ── W16 · Data Collection, Storage & Telemetry ─────────────────────────────
  "On-Device Data Storage: NVS, SPIFFS, LittleFS & SD": [
    { text: "Which ESP32 storage should hold WiFi credentials?", options: ["NVS via Preferences", "SD card", "PSRAM", "a file in LittleFS only"], correctAnswer: "NVS via Preferences" },
    { text: "A large telemetry log is best kept on…", options: ["an SD card", "NVS", "a single variable", "the CPU cache"], correctAnswer: "an SD card" },
    { text: "Why write telemetry in batches instead of one write per reading?", options: ["flash cells wear out — batching limits writes", "it looks nicer", "it is required by MQTT", "it makes CSV invalid"], correctAnswer: "flash cells wear out — batching limits writes" },
    { text: "A log line is nearly useless without…", options: ["a timestamp", "an LED", "a colour", "a comment"], correctAnswer: "a timestamp" },
  ],
  "Time-Series Databases & Data Pipelines": [
    { text: "Sensor readings indexed by time belong in…", options: ["a time-series database like InfluxDB", "a spreadsheet", "a JSON file on the device", "the broker only"], correctAnswer: "a time-series database like InfluxDB" },
    { text: "A TSDB is optimised for…", options: ["append-heavy, time-indexed queries with retention", "complex joins", "transactions", "name lookups"], correctAnswer: "append-heavy, time-indexed queries with retention" },
    { text: "The standard pipeline shape is…", options: ["sensors → broker → collector → TSDB → dashboard", "sensor → dashboard directly", "device → spreadsheet", "broker → broker"], correctAnswer: "sensors → broker → collector → TSDB → dashboard" },
    { text: "In InfluxDB, tags are used for…", options: ["indexed metadata like device and room", "the measurement value", "the timestamp", "the CSV header"], correctAnswer: "indexed metadata like device and room" },
  ],
  "End-to-End Data Reliability & Ordering": [
    { text: "Duplicates from a QoS 1 retry are best handled by…", options: ["idempotent writes keyed by time/tagset", "ignoring them", "deleting the broker", "resending"], correctAnswer: "idempotent writes keyed by time/tagset" },
    { text: "Which timestamp should storage trust?", options: ["the server/platform arrival time", "every device's local clock", "no time", "the GPS time"], correctAnswer: "the server/platform arrival time" },
    { text: "To detect silent gaps, devices can…", options: ["attach an incrementing sequence number", "add more LEDs", "sleep longer", "use longer topics"], correctAnswer: "attach an incrementing sequence number" },
    { text: "Monitoring the pipeline itself means tracking…", options: ["messages in, points written, and device last-seen", "only the dashboard color", "the cable length", "the baud rate"], correctAnswer: "messages in, points written, and device last-seen" },
  ],
  "Visualising Data: Graphs, Anomalies & Insights": [
    { text: "A sudden 5°C spike that stays below the absolute alarm value is best flagged by…", options: ["rate-of-change detection", "a fixed threshold alert", "a bigger gauge", "longer topics"], correctAnswer: "rate-of-change detection" },
    { text: "Comparing a reading to a rolling baseline ±3σ detects…", options: ["deviation from normal behaviour", "nothing", "calibration errors only", "battery level"], correctAnswer: "deviation from normal behaviour" },
    { text: "The first step before writing anomaly rules is…", options: ["export a day of data and eyeball the patterns", "buy more sensors", "disable alerts", "switch brokers"], correctAnswer: "export a day of data and eyeball the patterns" },
    { text: "A gauge plus a 24h sparkline shows…", options: ["now and trend together", "only the past", "only now", "nothing"], correctAnswer: "now and trend together" },
  ],

  // ── W17 · IoT Security Fundamentals ────────────────────────────────────────
  "The IoT Threat Model": [
    { text: "Most real-world IoT devices end up compromised as part of…", options: ["botnet recruitment of weak devices", "physical theft", "gamma radiation", "screen burn-in"], correctAnswer: "botnet recruitment of weak devices" },
    { text: "Mirai-style botnets compromise devices by…", options: ["scanning for default passwords and open ports", "breaking antennas", "overheating", "renaming the SSID"], correctAnswer: "scanning for default passwords and open ports" },
    { text: "An internet-exposed IoT device is typically attacked…", options: ["within minutes of exposure", "never", "once a year", "only by insiders"], correctAnswer: "within minutes of exposure" },
    { text: "The practical first priority is defeating…", options: ["automated mass attacks", "a genius adversary", "physics", "cosmetic issues"], correctAnswer: "automated mass attacks" },
  ],
  "Authentication, Authorization & Secrets Management": [
    { text: "The strongest practical authentication for production IoT is…", options: ["per-device X.509 certificates (mutual TLS)", "one shared password", "the MAC address", "no auth"], correctAnswer: "per-device X.509 certificates (mutual TLS)" },
    { text: "Least privilege for a device means…", options: ["it can only publish its own topics and do what it needs", "it can do everything", "it can read all data", "it has no access"], correctAnswer: "it can only publish its own topics and do what it needs" },
    { text: "Why must secrets never be hardcoded in source?", options: ["a public repo leaks them — treat firmware as readable", "they slow compilation", "they use RAM", "the IDE rejects them"], correctAnswer: "a public repo leaks them — treat firmware as readable" },
    { text: "Secrets should be stored…", options: ["in NVS or a secure element, provisioned per device", "in comments", "in the README", "nowhere"], correctAnswer: "in NVS or a secure element, provisioned per device" },
  ],
  "TLS, Certificates & Encrypted Communication": [
    { text: "Calling `setInsecure()` on a WiFiClientSecure is dangerous because…", options: ["it disables server verification, making encryption bypassable", "it speeds up TLS", "it sets a password", "it turns off the radio"], correctAnswer: "it disables server verification, making encryption bypassable" },
    { text: "On the ESP32, TLS over MQTT uses…", options: ["WiFiClientSecure with setCACert on port 8883", "plain WiFiClient", "UDP", "the SD library"], correctAnswer: "WiFiClientSecure with setCACert on port 8883" },
    { text: "Mutual TLS (mTLS) additionally verifies…", options: ["the client/device certificate", "only the server", "the SSID", "the battery"], correctAnswer: "the client/device certificate" },
    { text: "A CA root certificate in firmware…", options: ["can expire and needs tracking/OTA updates", "never changes", "is optional to check", "encrypts the payload"], correctAnswer: "can expire and needs tracking/OTA updates" },
  ],
  "Secure Boot, OTA Updates & Hardening": [
    { text: "With secure boot enabled, a modified firmware image…", options: ["will be rejected because only signed firmware runs", "boots anyway", "is faster", "changes the wifi name"], correctAnswer: "will be rejected because only signed firmware runs" },
    { text: "An unsigned OTA update is dangerous because…", options: ["an attacker could push malware disguised as an update", "it is smaller", "it improves battery", "it satisfies the broker"], correctAnswer: "an attacker could push malware disguised as an update" },
    { text: "Rollback on a failed OTA works by…", options: ["keeping dual slots and booting the last-good image", "overwriting one partition", "using the SD card only", "using no partitions"], correctAnswer: "keeping dual slots and booting the last-good image" },
    { text: "Defence-in-depth means…", options: ["layers — if one defence fails the next still blocks the attacker", "one very strong password", "only physical locks", "no security on LAN"], correctAnswer: "layers — if one defence fails the next still blocks the attacker" },
  ],

  // ── W18 · Smart Home Systems & Integration ─────────────────────────────────
  "Smart Home Architecture & the Hub Pattern": [
    { text: "A hub (like Home Assistant) exists because…", options: ["different devices speak different protocols; a hub translates", "to make devices faster", "to charge batteries", "to extend WiFi only"], correctAnswer: "different devices speak different protocols; a hub translates" },
    { text: "The hub (like Home Assistant)…", options: ["runs automations and exposes devices to apps/voice", "replaces all sensors", "is required by law", "only charges batteries"], correctAnswer: "runs automations and exposes devices to apps/voice" },
    { text: "Your ESP32 device slots into the hub by…", options: ["speaking MQTT with state/cmd topics", "sending email", "blinking", "using a printer"], correctAnswer: "speaking MQTT with state/cmd topics" },
    { text: "Local-first automation keeps working…", options: ["even during an internet outage", "only with the internet", "only at night", "never"], correctAnswer: "even during an internet outage" },
  ],
  "Protocols in the Home: Zigbee, Z-Wave, BLE & WiFi": [
    { text: "A battery-powered sensor that must run for months is best on…", options: ["Zigbee or BLE (low power)", "WiFi polling every second", "Ethernet", "USB power"], correctAnswer: "Zigbee or BLE (low power)" },
    { text: "Zigbee devices form…", options: ["a mesh where devices relay for each other", "a point-to-point link", "a star with no relays", "a USB bus"], correctAnswer: "a mesh where devices relay for each other" },
    { text: "Which band does Zigbee share with WiFi?", options: ["2.4 GHz", "5 GHz", "900 MHz", "60 GHz"], correctAnswer: "2.4 GHz" },
    { text: "For a DIY device that must just join your network, the simplest choice is…", options: ["WiFi + MQTT", "Zigbee with a coordinator", "Z-Wave", "IR only"], correctAnswer: "WiFi + MQTT" },
  ],
  "Voice Assistants, Apps & Ecosystem Integration": [
    { text: "How does a voice assistant control your ESP32 device?", options: ["it goes through the hub, which publishes MQTT", "it talks to the ESP32 directly via IR", "it reflashes the device", "it cannot"], correctAnswer: "it goes through the hub, which publishes MQTT" },
    { text: "With MQTT Discovery, a new ESP32 switch appears in the hub…", options: ["automatically as an entity, with zero config", "only after manual setup", "never", "as a file"], correctAnswer: "automatically as an entity, with zero config" },
    { text: "The most common smart-home support issue is…", options: ["app and reality disagree on switch state", "slow WiFi", "batteries too big", "too many protocols"], correctAnswer: "app and reality disagree on switch state" },
    { text: "After a smart switch acts on a command, publishing the new state matters because…", options: ["it keeps the app/voice/hub in agreement with the real relay position", "it uses more bandwidth", "it is required to log", "it slows the loop"], correctAnswer: "it keeps the app/voice/hub in agreement with the real relay position" },
  ],
  "Building a Home Automation Hub Project": [
    { text: "The free hub software used in the capstone is…", options: ["Home Assistant", "Photoshop", "a text editor", "a spreadsheet"], correctAnswer: "Home Assistant" },
    { text: "The MQTT broker on the hub is typically…", options: ["Mosquitto", "nginx", "a DNS server", "a DHCP server"], correctAnswer: "Mosquitto" },
    { text: "The smart-switch firmware should…", options: ["publish retained state and confirm after commands", "only receive commands", "ignore state", "use no WiFi"], correctAnswer: "publish retained state and confirm after commands" },
    { text: "An automation like 'lamp on at sunset' lives…", options: ["in the hub, not the device", "in the ESP32 firmware", "in the relay", "nowhere"], correctAnswer: "in the hub, not the device" },
  ],

  // ── W19 · Industrial IoT & Real-World Applications ─────────────────────────
  "What Makes IIoT Different from Consumer IoT": [
    { text: "The defining requirement separating IIoT from consumer IoT is…", options: ["reliability, determinism, and safety", "cheaper sensors", "smaller batteries", "more LEDs"], correctAnswer: "reliability, determinism, and safety" },
    { text: "An IIoT control loop typically needs…", options: ["bounded millisecond latency", "as-fast-as-possible, unspecified", "hourly updates", "no timing"], correctAnswer: "bounded millisecond latency" },
    { text: "Industrial functional safety is governed by standards like…", options: ["IEC 61508 / ISO 13849", "the Arduino license", "IEEE 802.11 only", "USB 3.2"], correctAnswer: "IEC 61508 / ISO 13849" },
    { text: "The architecture (sense → connect → analyse → act) in IIoT is…", options: ["the same as consumer IoT, just hardened and certified", "completely different", "unrelated", "non-existent"], correctAnswer: "the same as consumer IoT, just hardened and certified" },
  ],
  "Industrial Protocols: Modbus, OPC-UA & MQTT": [
    { text: "Which is the classic factory-floor workhorse protocol?", options: ["Modbus", "SMTP", "DNS", "WebSocket"], correctAnswer: "Modbus" },
    { text: "The enterprise-grade industrial standard with TLS and certificates built in is…", options: ["OPC-UA", "Modbus RTU", "Plain MQTT", "HTTP"], correctAnswer: "OPC-UA" },
    { text: "An industrial gateway's main job is…", options: ["protocol translation + edge compute", "charging batteries", "running the ERP", "cooling the PLC"], correctAnswer: "protocol translation + edge compute" },
    { text: "MQTT in industry is standardised for telemetry by…", options: ["Sparkplug B", "the USB spec", "the MP3 spec", "no one"], correctAnswer: "Sparkplug B" },
  ],
  "Predictive Maintenance & Edge Analytics": [
    { text: "The industrial use case with the clearest return on investment is…", options: ["predictive maintenance", "remote LED control", "faster WiFi", "prettier dashboards"], correctAnswer: "predictive maintenance" },
    { text: "A bearing wearing out is best predicted by…", options: ["vibration signature drift", "its color", "its serial number", "WiFi RSSI"], correctAnswer: "vibration signature drift" },
    { text: "Why compute features (RMS/FFT) at the edge?", options: ["send small features instead of huge raw data and work offline", "it is required by law", "edge is slower", "cloud cannot compute"], correctAnswer: "send small features instead of huge raw data and work offline" },
    { text: "Without ML, the practical predictive model is…", options: ["baseline the healthy signature, then alert on drift", "random guessing", "waiting for breakdown", "looking at the gauge"], correctAnswer: "baseline the healthy signature, then alert on drift" },
  ],
  "Digital Twins, SCADA & the Industrial Stack": [
    { text: "In industry, a 'digital twin' refers to…", options: ["a living digital model of a physical asset fed by real data", "a second backup device", "a SCADA screen", "a robot arm"], correctAnswer: "a living digital model of a physical asset fed by real data" },
    { text: "SCADA is the…", options: ["real-time plant supervision/control layer", "data entry form", "billing system", "marketing tool"], correctAnswer: "real-time plant supervision/control layer" },
    { text: "Time-critical valve response must run…", options: ["at the edge/PLC, not via a cloud round trip", "in the cloud", "in a spreadsheet", "on the dashboard"], correctAnswer: "at the edge/PLC, not via a cloud round trip" },
    { text: "Your MQTT/telemetry/dashboard skills map to the industrial stack at…", options: ["the gateway → cloud → dashboard data tier", "the ERP only", "the CNC machine", "nowhere"], correctAnswer: "the gateway → cloud → dashboard data tier" },
  ],

  // ── W20 · Building a Complete IoT Project + Certification ──────────────────
  "From Requirements to a Working System": [
    { text: "The recommended build order for a capstone is…", options: ["vertical end-to-end slices that each prove the full path", "all hardware, then all software", "only the dashboard first", "random components"], correctAnswer: "vertical end-to-end slices that each prove the full path" },
    { text: "A requirement like 'alerts within 60s of crossing 8°C' is…", options: ["testable — it becomes part of the verification plan", "too specific", "impossible", "a design constraint only"], correctAnswer: "testable — it becomes part of the verification plan" },
    { text: "The first step before any code is…", options: ["write the requirements and choose the architecture", "buy components", "design the dashboard", "flash the board"], correctAnswer: "write the requirements and choose the architecture" },
    { text: "Building in vertical slices means…", options: ["one sensor → one MQTT message → one dashboard reading first", "all sensing first", "all networking first", "all UI first"], correctAnswer: "one sensor → one MQTT message → one dashboard reading first" },
  ],
  "Hardware Assembly & Wiring Best Practices": [
    { text: "The #1 cause of intermittent 'works on the bench, fails in the field' is…", options: ["power brown-outs from loads sharing the MCU rail", "wrong WiFi password", "too many LEDs", "slow MQTT"], correctAnswer: "power brown-outs from loads sharing the MCU rail" },
    { text: "Why keep loads (motors/relays) on a separate supply?", options: ["a relay click must not dip the MCU voltage", "they need more pins", "it is cheaper", "it is required by MQTT"], correctAnswer: "a relay click must not dip the MCU voltage" },
    { text: "Every node should have a common…", options: ["ground", "colour", "voltage", "antenna"], correctAnswer: "ground" },
    { text: "A heartbeat LED helps you…", options: ["instantly tell power/firmware/network health", "make it prettier", "save power", "increase speed"], correctAnswer: "instantly tell power/firmware/network health" },
  ],
  "Firmware Architecture for a Complete Project": [
    { text: "Using `millis()`-based timing instead of `delay()` keeps the loop…", options: ["non-blocking, so it never freezes or trips the watchdog", "faster to boot", "lower power always", "bigger logs"], correctAnswer: "non-blocking, so it never freezes or trips the watchdog" },
    { text: "Modelling the device with a state machine helps you…", options: ["reason about every lifecycle state (e.g. WiFi drops mid-publish)", "pick the colour scheme", "lay out the PCB", "choose battery chemistry"], correctAnswer: "reason about every lifecycle state (e.g. WiFi drops mid-publish)" },
    { text: "Business logic should NOT live…", options: ["directly in loop() — use modules and functions", "in functions", "in modules", "in the state machine"], correctAnswer: "directly in loop() — use modules and functions" },
    { text: "Runtime-editable settings (interval, thresholds) belong in…", options: ["NVS, so field changes need no reflash", "the source code", "a comment", "the README"], correctAnswer: "NVS, so field changes need no reflash" },
  ],
  "Testing, Documentation & Shipping Your IoT Project": [
    { text: "Leaving a device running for 48 hours surfaces…", options: ["intermittent bugs: leaks, reconnects, missed readings", "syntax errors", "wrong resistor values", "broker pricing"], correctAnswer: "intermittent bugs: leaks, reconnects, missed readings" },
    { text: "Deliberately cutting WiFi, power, and the broker during testing checks…", options: ["recovery after failures", "new features", "dashboard aesthetics", "battery size"], correctAnswer: "recovery after failures" },
    { text: "A project is 'done' when…", options: ["it works reliably, is documented, and someone else can run it", "it works once", "the demo video is posted", "the LED is on"], correctAnswer: "it works reliably, is documented, and someone else can run it" },
    { text: "Documentation should include…", options: ["README, wiring/pinout, topic schema, and how to run it", "only the code", "only photos", "nothing"], correctAnswer: "README, wiring/pinout, topic schema, and how to run it" },
  ],
};
