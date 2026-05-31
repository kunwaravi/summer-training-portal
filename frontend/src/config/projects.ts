export interface ProjectItem {
  id: string;
  title: string;
  category: 'Arduino' | 'IoT' | 'Embedded' | 'Robotics';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  schematic: string;
  documentation: string;
  code: string;
}

export const projectsConfig: ProjectItem[] = [
  {
    id: 'led-dimmer',
    title: 'Smart LED Dimmer with Potentiometer',
    category: 'Arduino',
    difficulty: 'Beginner',
    description: 'Interface an analog potentiometer with the AVR Atmega328P to dynamically vary the pulse-width modulation (PWM) duty cycle driving an LED.',
    schematic: `
  [ VCC ] ----- ( Left Pin ) Potentiometer
  [ A0  ] ----- ( Middle Pin ) Potentiometer
  [ GND ] ----- ( Right Pin ) Potentiometer
  
  [ D9  ] ----- [ 220 Ohm Resistor ] ----- ( Anode ) LED ( Cathode ) ----- [ GND ]
    `,
    documentation: `
### Overview
This beginner project demonstrates how to read continuous analog voltages, map them to an 8-bit resolution, and apply Pulse Width Modulation (PWM) to control power delivery.

### Assembly Instructions
1. Mount the potentiometer on the breadboard. Connect its left pin to 5V VCC, the right pin to Ground, and the middle wiper pin to Analog Pin A0.
2. Place the LED on the breadboard. Connect a 220-ohm current-limiting resistor to its positive anode (longer leg).
3. Connect the other end of the resistor to Digital PWM Pin D9. Connect the negative cathode (shorter leg) of the LED to Ground.
4. Connect the Arduino Uno to your PC and upload the program.
    `,
    code: `
// Smart LED Dimmer
const int potPin = A0; // Potentiometer connected to analog pin A0
const int ledPin = 9;  // LED connected to PWM digital pin 9

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int potValue = analogRead(potPin); // Read 10-bit analog input (0 to 1023)
  int pwmValue = map(potValue, 0, 1023, 0, 255); // Map to 8-bit PWM (0 to 255)
  analogWrite(ledPin, pwmValue); // Drive LED brightness
  delay(10);
}
    `
  },
  {
    id: 'smart-weather',
    title: 'Smart Home Weather Station',
    category: 'IoT',
    difficulty: 'Intermediate',
    description: 'Build an ESP32-based telemetry node that reads DHT22 environmental conditions and broadcasts them using MQTT protocol to a central dashboard.',
    schematic: `
  ESP32 Pinout:
  [ 3V3 ] ----- ( VCC ) DHT22 Sensor
  [ GND ] ----- ( GND ) DHT22 Sensor
  [ GPIO 4 ] --- ( DATA ) DHT22 Sensor
  
  [ Pull-up Resistor 10K ] connected between DATA and VCC.
    `,
    documentation: `
### Overview
An intermediate IoT application illustrating synchronous 1-wire communication protocols, Wi-Fi Station mode connection, and publishing packet data over MQTT.

### Assembly Instructions
1. Connect DHT22 VCC to 3.3V pin on the ESP32. Connect Ground pin to GND.
2. Connect DHT22 Data pin to GPIO 4. Connect a 10K-ohm pull-up resistor between the Data pin and VCC.
3. Configure your local Wi-Fi credentials and the target MQTT Broker Address in the source code.
4. Flash the code to the ESP32 node and monitor telemetry over the serial log.
    `,
    code: `
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "WiFi_SSID";
const char* password = "WiFi_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32_WeatherStation")) {
      client.publish("edunexus/weather/status", "online");
    } else {
      delay(5000);
    }
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  
  // Simulate sensor read and publish
  float temp = 26.5; 
  char payload[50];
  snprintf(payload, 50, "{\\"temp\\": %.2f}", temp);
  client.publish("edunexus/weather/telemetry", payload);
  delay(10000); // Send every 10 seconds
}
    `
  },
  {
    id: 'drone-flight',
    title: 'STM32 Drone Flight Controller',
    category: 'Embedded',
    difficulty: 'Advanced',
    description: 'Architect a high-performance bare-metal STM32 firmware that reads MPU6050 accelerometer/gyro registers over I2C and calculates motor drive outputs using PID feedback.',
    schematic: `
  STM32 Nucleo F401RE Pinout:
  [ 3V3 ] ----- ( VCC ) MPU6050 IMU Sensor
  [ GND ] ----- ( GND ) MPU6050 IMU Sensor
  [ PB8 ] ----- ( Scl ) MPU6050 ( I2C1_SCL )
  [ PB9 ] ----- ( Sda ) MPU6050 ( I2C1_SDA )
  
  [ PA0 ] ----- ( PWM ESC 1 ) Input Brushless Motor
  [ PA1 ] ----- ( PWM ESC 2 ) Input Brushless Motor
    `,
    documentation: `
### Overview
This advanced embedded systems project focuses on low-level peripheral driver implementations, real-time hardware timers scheduling, I2C bus communications, and proportional-integral-derivative (PID) feedback algorithms.

### Assembly Instructions
1. Interface the MPU6050 Accelerometer/Gyroscope module with the STM32 via I2C lines: SCL to PB8, SDA to PB9.
2. Wire the Electronic Speed Controllers (ESCs) of the brushless motors to high-frequency hardware PWM outputs: ESC1 to PA0, ESC2 to PA1.
3. Configure the STM32 System Clock to 84MHz using the RCC registers for high-frequency control loops.
4. Mount the flight controller structure securely on a quadcopter frame, perform calibration steps, and monitor attitude calculations.
    `,
    code: `
#include "stm32f4xx.h"

#define MPU6050_ADDR 0x68

void I2C1_Init(void) {
  RCC->APB1ENR |= RCC_APB1ENR_I2C1EN;  // Enable I2C1 clock
  RCC->AHB1ENR |= RCC_AHB1ENR_GPIOBEN; // Enable GPIOB clock
  
  // Configure PB8, PB9 as Alternate Function open-drain
  GPIOB->MODER |= (2 << 16) | (2 << 18); // AF Mode
  GPIOB->OTYPER |= (1 << 8) | (1 << 9);  // Open-Drain
  GPIOB->AFR[1] |= (4 << 0) | (4 << 4);  // AF4 for PB8, PB9 (I2C1)
  
  I2C1->CR1 |= I2C_CR1_SWRST;
  I2C1->CR1 &= ~I2C_CR1_SWRST;
  I2C1->CR2 = 42; // APB Clock Speed (42 MHz)
  I2C1->CCR = 210; // 100 kHz SCL Standard speed
  I2C1->TRISE = 43; // Max rise time
  I2C1->CR1 |= I2C_CR1_PE; // Enable I2C
}

float pid_calculate(float target, float current, float* prev_err, float* integral) {
  float kp = 1.25, ki = 0.05, kd = 0.45;
  float error = target - current;
  *integral += error * 0.004; // 250Hz frequency
  float derivative = (error - *prev_err) / 0.004;
  *prev_err = error;
  return (kp * error) + (ki * (*integral)) + (kd * derivative);
}

int main(void) {
  I2C1_Init();
  // Core flight control loop running at 250Hz
  while(1) {
    // Read raw IMU data, execute PID calculation, drive ESC timers
  }
}
    `
  }
];
