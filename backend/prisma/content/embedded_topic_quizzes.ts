/**
 * Embedded Systems & Real-Time OS — per-topic quizzes (issue #95).
 *
 * Each of the 80 topics in embedded.ts gets 4 distinct original questions here
 * (320 total), keyed by the EXACT topic title so the reseed script can attach
 * them. Texts are distinct from the chapter quizzes (160) and the final exam
 * (18) to keep the whole course question bank collision-free.
 *
 * Strings are double-quoted so apostrophes are safe; any literal double quote
 * inside a string is escaped as \" .
 */

export interface EmbeddedTopicQuiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const embeddedTopicQuizzes: Record<string, EmbeddedTopicQuiz[]> = {
  // ── Week 1 ────────────────────────────────────────────────────────────────
  'What an Embedded System Really Is': [
    { text: 'Which trait is NOT a defining feature of an embedded system?', options: ['runs an app store', 'dedicated function', 'tight resource limits', 'unattended long life'], correctAnswer: 'runs an app store' },
    { text: 'A device that boots in milliseconds and runs for years without an operator is…', options: ['typical of embedded systems', 'impossible', 'a cloud server', 'a desktop app'], correctAnswer: 'typical of embedded systems' },
    { text: 'Compared to an MPU, an MCU typically…', options: ['integrates RAM, flash, and peripherals on one chip', 'needs external RAM', 'runs Linux', 'has no CPU'], correctAnswer: 'integrates RAM, flash, and peripherals on one chip' },
    { text: 'Embedded design starts from…', options: ['the physics and the deadline', 'the UI framework', 'the marketing page', 'the cloud bill'], correctAnswer: 'the physics and the deadline' },
  ],
  'Real-Time Systems & Deadlines': [
    { text: 'A system where missing a deadline is a complete failure is called…', options: ['hard real-time', 'soft real-time', 'best-effort', 'batch'], correctAnswer: 'hard real-time' },
    { text: 'Which example is soft real-time?', options: ['an audio drop-out', 'an airbag deployment', 'ABS braking', 'a pacemaker'], correctAnswer: 'an audio drop-out' },
    { text: 'The response time is the time from…', options: ['event to the required action', 'compile to flash', 'boot to main', 'reset to debug'], correctAnswer: 'event to the required action' },
    { text: 'For real-time design you must know the…', options: ['worst-case response time', 'average response time', 'best case only', 'the demo time'], correctAnswer: 'worst-case response time' },
  ],
  'The Embedded Development Environment': [
    { text: 'A cross-compiler compiles code for…', options: ['a different CPU than the host', 'the same CPU as the host', 'no CPU', 'the GPU'], correctAnswer: 'a different CPU than the host' },
    { text: 'The tool that converts app.elf into a raw binary for flashing is…', options: ['objcopy', 'gdb', 'make', 'ld'], correctAnswer: 'objcopy' },
    { text: 'SWD is…', options: ['a two-wire debugging/programming interface', 'a power rail', 'a sensor bus', 'a file format'], correctAnswer: 'a two-wire debugging/programming interface' },
    { text: 'The modern hardware debugging standard is…', options: ['SWD/JTAG', 'USB-C only', 'Bluetooth', 'UART'], correctAnswer: 'SWD/JTAG' },
  ],
  'Hardware in the Loop: Datasheets & Schematics': [
    { text: 'Where do you find the base addresses of peripherals?', options: ['the datasheet memory map', 'the README', 'the linker script alone', 'a forum post'], correctAnswer: 'the datasheet memory map' },
    { text: 'Exceeding a chip\'s absolute maximum ratings…', options: ['can damage the silicon', 'is fine occasionally', 'just slows it down', 'is recommended'], correctAnswer: 'can damage the silicon' },
    { text: 'A decoupling capacitor near an IC\'s Vcc pin…', options: ['absorbs switching spikes', 'replaces the crystal', 'adds resistance', 'lowers the voltage'], correctAnswer: 'absorbs switching spikes' },
    { text: 'Internal pull-ups on an input pin…', options: ['set the idle level so floating inputs read a known value', 'increase the current draw of the LED', 'disable the pin', 'change the baud'], correctAnswer: 'set the idle level so floating inputs read a known value' },
  ],
  // ── Week 2 ────────────────────────────────────────────────────────────────
  'The Memory Map: Flash, SRAM & Registers': [
    { text: 'Which region holds code and constants on a Cortex-M?', options: ['the 0x00000000-0x1FFFFFFF code region', 'the SRAM region', 'the register region', 'the NVIC region'], correctAnswer: 'the 0x00000000-0x1FFFFFFF code region' },
    { text: 'SRAM is…', options: ['volatile read/write memory for variables and stack', 'non-volatile program memory', 'hardware registers', 'external disk'], correctAnswer: 'volatile read/write memory for variables and stack' },
    { text: 'A memory-mapped peripheral register behaves like memory but…', options: ['has hardware side effects when read or written', 'cannot be written', 'is in flash', 'needs an OS'], correctAnswer: 'has hardware side effects when read or written' },
    { text: 'The linker script assigns…', options: ['which sections land in which memory regions', 'the baud rate', 'the interrupt priorities', 'the power budget'], correctAnswer: 'which sections land in which memory regions' },
  ],
  'Clocks: Oscillators, PLLs & Clock Trees': [
    { text: 'An internal RC oscillator is…', options: ['always available but imprecise', 'precise to ppm', 'only for USB', 'external hardware'], correctAnswer: 'always available but imprecise' },
    { text: 'A PLL is used to…', options: ['multiply a base clock up to the system frequency', 'divide the voltage', 'erase flash', 'reset the CPU'], correctAnswer: 'multiply a base clock up to the system frequency' },
    { text: 'The most common "peripheral does nothing" STM32 bug is…', options: ['a missing clock-gate enable', 'too many comments', 'a slow debugger', 'a long function'], correctAnswer: 'a missing clock-gate enable' },
    { text: 'For accurate UART baud you should clock from…', options: ['an external crystal via PLL', 'the internal RC oscillator', 'the watchdog', 'a pull-up'], correctAnswer: 'an external crystal via PLL' },
  ],
  'Power: Voltage Rails, Current & Brownouts': [
    { text: 'The absolute maximum rating for a supply is…', options: ['a destructive limit you must never exceed', 'a suggestion', 'the recommended operating point', 'the ADC reference'], correctAnswer: 'a destructive limit you must never exceed' },
    { text: 'What happens when the supply voltage sags (a brownout)?', options: ['random resets and undefined behaviour', 'faster execution', 'more flash', 'cleaner logs'], correctAnswer: 'random resets and undefined behaviour' },
    { text: 'Keeping motors on the same rail as the MCU is risky because…', options: ['switching loads can drag the logic rail down', 'motors need data', 'it wastes flash', 'it is fine always'], correctAnswer: 'switching loads can drag the logic rail down' },
    { text: 'A brown-out detector is enabled to…', options: ['reset the chip cleanly instead of running undefined', 'boost the voltage', 'overclock', 'erase the flash'], correctAnswer: 'reset the chip cleanly instead of running undefined' },
  ],
  'Reset, Boot & Startup Code': [
    { text: 'At boot the CPU reads the initial stack pointer from…', options: ['address 0x00000000 of the vector table', 'the linker script', 'the SRAM', 'the UART'], correctAnswer: 'address 0x00000000 of the vector table' },
    { text: 'Startup code does which of these before main()?', options: ['copies .data, zeroes .bss, sets the stack', 'loads the OS', 'flashes the bootloader', 'calibrates the ADC'], correctAnswer: 'copies .data, zeroes .bss, sets the stack' },
    { text: 'A vector table is best described as…', options: ['an array of handler addresses at the start of flash', 'a list of RAM variables', 'the linker script', 'a C header'], correctAnswer: 'an array of handler addresses at the start of flash' },
    { text: 'An ISR that is never invoked because the vector entry is missing means…', options: ['the handler name does not match the vector table symbol', 'the clock is off', 'the LED polarity is wrong', 'flash is full'], correctAnswer: 'the handler name does not match the vector table symbol' },
  ],
  // ── Week 3 ────────────────────────────────────────────────────────────────
  'C for Microcontrollers: Constraints & Conventions': [
    { text: 'Which type is correct for exact-width register work?', options: ['uint32_t', 'int', 'long', 'float'], correctAnswer: 'uint32_t' },
    { text: 'Why avoid malloc in bare-metal firmware?', options: ['fragmentation and non-deterministic timing', 'it is too fast', 'the linker forbids it', 'it wastes flash'], correctAnswer: 'fragmentation and non-deterministic timing' },
    { text: 'Software floating point is avoided on cheap cores because…', options: ['it costs hundreds of cycles', 'it is more accurate', 'it uses less RAM', 'it needs an OS'], correctAnswer: 'it costs hundreds of cycles' },
    { text: 'Without volatile, the optimizer may…', options: ['cache a hardware register read and never re-read it', 'delete the variable', 'crash the debugger', 'change the baud'], correctAnswer: 'cache a hardware register read and never re-read it' },
  ],
  'Toolchains, Builds & Makefiles': [
    { text: 'The purpose of -Wall -Wextra is…', options: ['to enable a rich set of useful warnings', 'to disable all warnings', 'to optimize size', 'to embed symbols'], correctAnswer: 'to enable a rich set of useful warnings' },
    { text: 'Debug symbols are kept in the build via…', options: ['-g', '-O2', '-std=c11', '-mcpu'], correctAnswer: '-g' },
    { text: 'Two build profiles (debug/release) exist because…', options: ['optimized and unoptimized behaviour can differ', 'release is always faster to build', 'the debugger needs both', 'flash is cheaper'], correctAnswer: 'optimized and unoptimized behaviour can differ' },
    { text: 'Embedding a build ID in the firmware helps you…', options: ['identify which binary is on a board', 'speed up boot', 'save flash', 'hide bugs'], correctAnswer: 'identify which binary is on a board' },
  ],
  'Debugging: GDB, SWD & the Art of the Print': [
    { text: 'GDB over SWD lets you…', options: ['set breakpoints and inspect live registers/memory on the target', 'edit the schematic', 'overclock', 'write flash for free'], correctAnswer: 'set breakpoints and inspect live registers/memory on the target' },
    { text: 'Why can a breakpoint make a timing bug disappear?', options: ['halting the CPU changes the timing', 'the bug is imaginary', 'GDB repairs code', 'flash is rewritten'], correctAnswer: 'halting the CPU changes the timing' },
    { text: '"Works in debug, fails in release" most often means…', options: ['a missing volatile or an aliasing assumption', 'release builds are unlucky', 'the board is old', 'the battery is low'], correctAnswer: 'a missing volatile or an aliasing assumption' },
    { text: 'The scope and logic analyzer are preferred for…', options: ['seeing what the hardware pins actually do', 'compiling code', 'writing firmware', 'choosing libraries'], correctAnswer: 'seeing what the hardware pins actually do' },
  ],
  'Design Patterns for Firmware Structure': [
    { text: 'A super-loop is…', options: ['an infinite loop calling each module at its own cadence', 'a recursive function', 'a bootloader', 'an interrupt'], correctAnswer: 'an infinite loop calling each module at its own cadence' },
    { text: 'A finite state machine is the natural structure for…', options: ['protocol parsers and UI flows', 'a float multiply', 'the linker script', 'the clock tree'], correctAnswer: 'protocol parsers and UI flows' },
    { text: 'A HAL (hardware abstraction layer) lets you…', options: ['swap the MCU by changing only the HAL', 'avoid interrupts', 'use less flash', 'skip the linker'], correctAnswer: 'swap the MCU by changing only the HAL' },
    { text: 'The producer-consumer pattern means…', options: ['an ISR enqueues, the background dequeues and processes', 'two ISRs share a variable', 'the CPU polls forever', 'the UART blocks'], correctAnswer: 'an ISR enqueues, the background dequeues and processes' },
  ],
  // ── Week 4 ────────────────────────────────────────────────────────────────
  'The Fetch-Decode-Execute Cycle': [
    { text: 'During fetch, the CPU reads the instruction from…', options: ['the address held in the Program Counter', 'the ALU', 'the stack pointer', 'the status register'], correctAnswer: 'the address held in the Program Counter' },
    { text: 'The pipeline overlaps stages so…', options: ['several instructions are in different phases at once', 'the CPU runs twice as fast per instruction', 'memory is skipped', 'branches are free'], correctAnswer: 'several instructions are in different phases at once' },
    { text: 'A branch can be expensive because…', options: ['it may flush the pipeline', 'it reads memory', 'it changes the clock', 'it uses the ADC'], correctAnswer: 'it may flush the pipeline' },
    { text: 'The status/flags register holds…', options: ['carry, zero, and negative flags from arithmetic', 'the program counter', 'the stack base', 'the clock divider'], correctAnswer: 'carry, zero, and negative flags from arithmetic' },
  ],
  'RISC vs CISC Architectures': [
    { text: 'In a load/store ISA, only which instructions touch memory?', options: ['load and store', 'all arithmetic', 'every instruction', 'branches'], correctAnswer: 'load and store' },
    { text: 'RISC fixed-width instructions give…', options: ['simple fetch/decode and high MHz per watt', 'fewer instructions', 'no pipelines', 'more RAM'], correctAnswer: 'simple fetch/decode and high MHz per watt' },
    { text: 'x86 is an example of…', options: ['CISC', 'RISC', 'a GPU', 'an FPGA'], correctAnswer: 'CISC' },
    { text: 'RISC-V is notable because…', options: ['it is an open, royalty-free RISC ISA', 'it is proprietary', 'it is a desktop OS', 'it runs only GPUs'], correctAnswer: 'it is an open, royalty-free RISC ISA' },
  ],
  'Memory Architectures: von Neumann vs Harvard': [
    { text: 'What limits a von Neumann machine most?', options: ['instructions and data compete for one bus', 'too many cores', 'no cache', 'fast pipelines'], correctAnswer: 'instructions and data compete for one bus' },
    { text: 'A Harvard machine…', options: ['fetches instructions and accesses data in parallel via separate buses', 'shares one bus for everything', 'cannot run C', 'has no memory'], correctAnswer: 'fetches instructions and accesses data in parallel via separate buses' },
    { text: 'On a Harvard machine, code and data…', options: ['can be different widths (e.g. 16-bit instructions, 8-bit data)', 'must be identical', 'share one cache', 'never differ'], correctAnswer: 'can be different widths (e.g. 16-bit instructions, 8-bit data)' },
    { text: 'Most modern MCUs are…', options: ['modified Harvard: separate buses, unified address space', 'pure von Neumann', 'no memory architecture', 'GPUs'], correctAnswer: 'modified Harvard: separate buses, unified address space' },
  ],
  'The Stack, the Heap & the C Runtime': [
    { text: 'The stack holds…', options: ['return addresses, locals, and saved registers', 'the program code', 'the vector table', 'the flash'], correctAnswer: 'return addresses, locals, and saved registers' },
    { text: 'Stack overflow shows up as…', options: ['silent corruption followed by a random crash', 'a compile error', 'a link warning only', 'a faster CPU'], correctAnswer: 'silent corruption followed by a random crash' },
    { text: 'Heap fragmentation means…', options: ['total free space exists but no single big block', 'the heap is empty', 'flash is full', 'the stack grew'], correctAnswer: 'total free space exists but no single big block' },
    { text: 'A stack canary is used to…', options: ['detect stack overflow by checking a filled pattern', 'encrypt the program', 'speed up the clock', 'power the LED'], correctAnswer: 'detect stack overflow by checking a filled pattern' },
  ],
  // ── Week 5 ────────────────────────────────────────────────────────────────
  'The System-on-a-Chip: What is Inside an MCU': [
    { text: 'Which of these is integrated inside a typical MCU?', options: ['CPU, flash, SRAM, peripherals', 'a display', 'a power supply brick', 'an antenna'], correctAnswer: 'CPU, flash, SRAM, peripherals' },
    { text: 'Because an MCU cannot be upgraded, you must…', options: ['choose the chip for the whole project', 'buy a bigger one later', 'solder more RAM', 'use an FPGA'], correctAnswer: 'choose the chip for the whole project' },
    { text: 'Flash write/erase endurance is typically…', options: ['~10k-100k cycles', 'unlimited', '1 cycle', 'one per boot'], correctAnswer: '~10k-100k cycles' },
    { text: 'Pin multiplexing means…', options: ['one pin can be GPIO or UART TX or PWM, but not all at once', 'pins can change voltage', 'pins disappear', 'the MCU has no pins'], correctAnswer: 'one pin can be GPIO or UART TX or PWM, but not all at once' },
  ],
  'Peripherals & How They Connect to the CPU': [
    { text: 'On a Cortex-M, the slower low-power peripheral bus is…', options: ['APB', 'AHB', 'PCIe', 'SATA'], correctAnswer: 'APB' },
    { text: 'With a peripheral\'s clock gated off, the peripheral…', options: ['appears as zeros and does nothing', 'runs faster', 'interrupts constantly', 'draws less flash'], correctAnswer: 'appears as zeros and does nothing' },
    { text: 'DMA transfers data between a peripheral and memory…', options: ['without the CPU doing it byte-by-byte', 'only once ever', 'over the network', 'at lower speed'], correctAnswer: 'without the CPU doing it byte-by-byte' },
    { text: 'The first step to enable a peripheral is…', options: ['enable its clock gate', 'write its data register', 'enable the watchdog', 'reset the NVIC'], correctAnswer: 'enable its clock gate' },
  ],
  'GPIO, UART, Timers & ADC: The Peripheral Zoo': [
    { text: 'The peripheral that counts ticks and can generate PWM is the…', options: ['timer', 'UART', 'GPIO', 'ADC'], correctAnswer: 'timer' },
    { text: 'An ADC converts…', options: ['an analog voltage to a digital number', 'a number to a voltage', 'bytes to frames', 'time to counts'], correctAnswer: 'an analog voltage to a digital number' },
    { text: 'UART sends data…', options: ['one bit at a time over two wires at an agreed baud', 'in parallel over 8 wires', 'without any timing', 'over a shared clock'], correctAnswer: 'one bit at a time over two wires at an agreed baud' },
    { text: 'The SysTick timer on Cortex-M is typically used for…', options: ['the RTOS tick / millisecond heartbeat', 'ADC sampling', 'bit-banging I2C', 'flash writes'], correctAnswer: 'the RTOS tick / millisecond heartbeat' },
  ],
  'Memory-Mapped I/O vs Special Instructions': [
    { text: 'Memory-mapped I/O means peripherals are accessed…', options: ['with ordinary load/store instructions at fixed addresses', 'with special opcodes only', 'over the network', 'by the GPU'], correctAnswer: 'with ordinary load/store instructions at fixed addresses' },
    { text: 'The read-modify-write race occurs when…', options: ['an ISR changes a register between another code path\'s read and write', 'the clock is too slow', 'flash is erased', 'the debugger is attached'], correctAnswer: 'an ISR changes a register between another code path\'s read and write' },
    { text: 'Bit-banding lets you…', options: ['set or clear a single bit atomically with one store', 'double the clock', 'erase the flash', 'change the baud'], correctAnswer: 'set or clear a single bit atomically with one store' },
    { text: 'AVR\'s special IN/OUT instructions are used because…', options: ['its first I/O registers are directly addressable in one cycle', 'it has no memory', 'it is CISC', 'it needs an OS'], correctAnswer: 'its first I/O registers are directly addressable in one cycle' },
  ],
  // ── Week 6 ────────────────────────────────────────────────────────────────
  'The AVR Architecture & Register File': [
    { text: 'The AVR register file has…', options: ['32 general-purpose 8-bit registers', '8 registers', '256 registers', 'a register bank per pin'], correctAnswer: '32 general-purpose 8-bit registers' },
    { text: 'To make a port pin an output on AVR you…', options: ['set the corresponding bit in DDRx', 'write to PINx', 'enable the PLL', 'call a function'], correctAnswer: 'set the corresponding bit in DDRx' },
    { text: 'Reading the actual pin levels on AVR is done via…', options: ['the PINx register', 'the DDRx register', 'the OCRx register', 'the EEPROM'], correctAnswer: 'the PINx register' },
    { text: 'ATmega328P has about…', options: ['2KB SRAM and 32KB flash', '2MB SRAM', 'no flash', '1GB RAM'], correctAnswer: '2KB SRAM and 32KB flash' },
  ],
  'Timers on AVR: TCNT, OCR & PWM': [
    { text: 'The count register of an AVR timer is…', options: ['TCNTx', 'DDRx', 'PORTx', 'SPL'], correctAnswer: 'TCNTx' },
    { text: 'When TCNT matches the output-compare register OCRx, the timer can…', options: ['toggle a pin and/or fire an interrupt', 'erase flash', 'change the clock', 'sleep'], correctAnswer: 'toggle a pin and/or fire an interrupt' },
    { text: 'An 8-bit AVR timer overflows when…', options: ['the count wraps from 255 to 0', 'the clock stops', 'OCR is zero', 'the watchdog fires'], correctAnswer: 'the count wraps from 255 to 0' },
    { text: 'Which AVR timer is the 16-bit one?', options: ['Timer1', 'Timer0', 'the watchdog', 'the EEPROM timer'], correctAnswer: 'Timer1' },
  ],
  'Interrupts & the SREG I-Flag': [
    { text: 'The global interrupt enable bit on AVR is…', options: ['the I flag in SREG', 'the C flag in SREG', 'the Z flag', 'the DDR bit'], correctAnswer: 'the I flag in SREG' },
    { text: 'sei() and cli() respectively…', options: ['enable and disable interrupts globally', 'start and stop the UART', 'set and clear a pin', 'flash and erase'], correctAnswer: 'enable and disable interrupts globally' },
    { text: 'During an AVR ISR, global interrupts are…', options: ['cleared by hardware by default', 'always on', 'double-speed', 'redirected'], correctAnswer: 'cleared by hardware by default' },
    { text: 'Variables shared between an ISR and main must be…', options: ['volatile', 'const', 'static-const', 'double'], correctAnswer: 'volatile' },
  ],
  'UART on AVR: Building a Serial Driver': [
    { text: 'The baud-rate divider register on the ATmega328P USART is…', options: ['UBRR0', 'TCCR0', 'PORTB', 'PINB'], correctAnswer: 'UBRR0' },
    { text: 'Writing a byte to UDR0…', options: ['transmits it when the buffer is empty', 'erases EEPROM', 'reads the ADC', 'resets the CPU'], correctAnswer: 'transmits it when the buffer is empty' },
    { text: 'Besides delivering the byte, reading UDR0 also…', options: ['clears the receive-complete flag', 'increases the baud', 'toasts the pin', 'halts the CPU'], correctAnswer: 'clears the receive-complete flag' },
    { text: 'The interrupt-driven RX pattern uses an ISR to…', options: ['read UDR0 into a ring buffer', 'block the main loop', 'print messages', 'disable the UART'], correctAnswer: 'read UDR0 into a ring buffer' },
  ],
  // ── Week 7 ────────────────────────────────────────────────────────────────
  'The Cortex-M Architecture & Register Bank': [
    { text: 'Which register is the program counter on ARM?', options: ['R15 (PC)', 'R14 (LR)', 'R0', 'R13 (SP)'], correctAnswer: 'R15 (PC)' },
    { text: 'The link register (LR) holds…', options: ['the return address of the current call', 'the stack top', 'the clock speed', 'the interrupt mask'], correctAnswer: 'the return address of the current call' },
    { text: 'Handler mode (ISR) always runs on…', options: ['the MSP', 'the PSP', 'the LR', 'the PC'], correctAnswer: 'the MSP' },
    { text: 'PRIMASK is used to…', options: ['mask (disable) interrupts', 'double the clock', 'reset the stack', 'select the flash bank'], correctAnswer: 'mask (disable) interrupts' },
  ],
  'The NVIC: Interrupts & Priorities': [
    { text: '"Nested" in NVIC means…', options: ['a higher-priority ISR can preempt a lower one', 'ISRs run in a queue', 'no ISR can nest', 'the CPU never interrupts'], correctAnswer: 'a higher-priority ISR can preempt a lower one' },
    { text: '"Vectored" means…', options: ['the CPU jumps straight to the handler via the vector table', 'handlers are polled in software', 'vectors are random', 'no handlers exist'], correctAnswer: 'the CPU jumps straight to the handler via the vector table' },
    { text: 'A lower priority NUMBER in NVIC means…', options: ['higher urgency (preempts others)', 'lower urgency', 'no urgency', 'it is disabled'], correctAnswer: 'higher urgency (preempts others)' },
    { text: 'Enabling an interrupt on Cortex-M requires…', options: ['both the peripheral enable and NVIC_EnableIRQ', 'only the peripheral enable', 'only the NVIC', 'the linker'], correctAnswer: 'both the peripheral enable and NVIC_EnableIRQ' },
  ],
  'Thumb, Thumb-2 & Code Density': [
    { text: 'Cortex-M executes…', options: ['Thumb/Thumb-2 instructions only', 'x86 instructions', 'ARM-state only', 'MIPS instructions'], correctAnswer: 'Thumb/Thumb-2 instructions only' },
    { text: 'The main benefit of 16-bit instructions is…', options: ['higher code density (smaller flash footprint)', 'faster ADC', 'more RAM', 'simpler wiring'], correctAnswer: 'higher code density (smaller flash footprint)' },
    { text: 'A typical Cortex-M function prologue/epilogue is…', options: ['push/pop of a register list including LR/PC', 'a subroutine call to the OS', 'a delay loop', 'a malloc'], correctAnswer: 'push/pop of a register list including LR/PC' },
    { text: 'Thumb-2 adds…', options: ['32-bit instructions for the rare big cases', 'a second CPU', 'an FPU only', 'a GPU'], correctAnswer: '32-bit instructions for the rare big cases' },
  ],
  'CMSIS: The Vendor-Neutral ARM Standard': [
    { text: 'The CMSIS standard covers…', options: ['core access: NVIC, SysTick, intrinsics, SystemInit', 'the display driver', 'the power supply', 'the PCB layout'], correctAnswer: 'core access: NVIC, SysTick, intrinsics, SystemInit' },
    { text: 'SystemCoreClock reports…', options: ['the running core clock in Hz', 'the flash size', 'the RAM size', 'the baud rate'], correctAnswer: 'the running core clock in Hz' },
    { text: 'Vendor HALs (like ST\'s) sit…', options: ['on top of CMSIS', 'inside the linker', 'in the bootloader', 'nowhere'], correctAnswer: 'on top of CMSIS' },
    { text: 'SysTick_Config(SystemCoreClock / 1000) produces…', options: ['a 1ms tick interrupt', 'a 1GHz clock', 'no interrupt', 'a baud divider'], correctAnswer: 'a 1ms tick interrupt' },
  ],
  // ── Week 8 ────────────────────────────────────────────────────────────────
  'GPIO Modes & Electrical Reality': [
    { text: 'Open-drain output is needed for…', options: ['shared buses like I2C', 'driving an LED directly', 'a push-pull line', 'an input button'], correctAnswer: 'shared buses like I2C' },
    { text: 'A floating input reads…', options: ['unpredictable noise', 'always high', 'always low', 'zero volts exactly'], correctAnswer: 'unpredictable noise' },
    { text: 'An ADC input pin must be configured in…', options: ['analog mode (input buffer off)', 'push-pull output', 'open-drain', 'input with pull-up'], correctAnswer: 'analog mode (input buffer off)' },
    { text: 'Driving an LED without a series resistor…', options: ['risks overcurrent and damage', 'makes it brighter safely', 'is required', 'increases lifetime'], correctAnswer: 'risks overcurrent and damage' },
  ],
  'Read-Modify-Write & Atomic Pin Control': [
    { text: 'ODR |= (1<<5) is racy because it…', options: ['reads, modifies, then writes back — an ISR can interleave', 'is too fast', 'uses flash', 'skips the clock'], correctAnswer: 'reads, modifies, then writes back — an ISR can interleave' },
    { text: 'STM32 BSRR lets you…', options: ['set or clear a pin in one atomic store', 'only read pins', 'erase flash', 'change the baud'], correctAnswer: 'set or clear a pin in one atomic store' },
    { text: 'Bit-banding maps…', options: ['each bit of a region to its own word address', 'registers to flash', 'the clock to the ADC', 'RAM to disk'], correctAnswer: 'each bit of a region to its own word address' },
    { text: 'Writing PINx on AVR toggles a pin because…', options: ['it is a hardware toggle feature', 'it is an error', 'it erases the bit', 'it needs DDRx'], correctAnswer: 'it is a hardware toggle feature' },
  ],
  'Reading Inputs Reliably: Debounce & Filtering': [
    { text: 'Mechanical buttons bounce because…', options: ['the contacts physically bounce for a few ms', 'the MCU is too fast', 'the pull-up is missing', 'the ADC is noisy'], correctAnswer: 'the contacts physically bounce for a few ms' },
    { text: 'A non-blocking debounce counts…', options: ['consistent samples on a fixed tick before changing state', 'milliseconds in a delay', 'interrupts forever', 'flash cycles'], correctAnswer: 'consistent samples on a fixed tick before changing state' },
    { text: 'A hardware debounce option is…', options: ['an RC filter plus a Schmitt-trigger input', 'a longer wire', 'a bigger MCU', 'a resistor divider only'], correctAnswer: 'an RC filter plus a Schmitt-trigger input' },
    { text: 'Debouncing inside a blocking delay is bad because…', options: ['it freezes other work and can miss quick presses', 'it uses too little code', 'it doubles the flash', 'it is too accurate'], correctAnswer: 'it freezes other work and can miss quick presses' },
  ],
  'Building a Simple GPIO HAL': [
    { text: 'A HAL abstracts the pins so the application…', options: ['never touches registers directly', 'runs faster', 'uses less flash', 'avoids interrupts'], correctAnswer: 'never touches registers directly' },
    { text: 'A good pin abstraction represents a pin as…', options: ['a struct/enum of port + pin, plus named instances', 'a magic number', 'a string', 'a register address in the app'], correctAnswer: 'a struct/enum of port + pin, plus named instances' },
    { text: 'The HAL should be…', options: ['thin: configuration and single-bit operations only', 'full of business logic', 'a web server', 'an RTOS'], correctAnswer: 'thin: configuration and single-bit operations only' },
    { text: 'If you see ->ODR outside the HAL, the layering is…', options: ['broken — app code should not touch registers', 'fine — that is normal', 'impossible', 'recommended'], correctAnswer: 'broken — app code should not touch registers' },
  ],
  // ── Week 9 ────────────────────────────────────────────────────────────────
  'Counters, Prescalers & the Heartbeat': [
    { text: 'A prescaler divides the clock so…', options: ['the timer counts at a slower, chosen rate', 'the CPU runs faster', 'flash is bigger', 'the ADC samples'], correctAnswer: 'the timer counts at a slower, chosen rate' },
    { text: 'The auto-reload register (ARR) sets…', options: ['the period: when the count wraps', 'the duty cycle', 'the interrupt priority', 'the pin mode'], correctAnswer: 'the period: when the count wraps' },
    { text: 'A 16-bit timer at 1MHz overflows every…', options: ['65.5ms', '1us', '1s', '100s'], correctAnswer: '65.5ms' },
    { text: 'To extend time beyond one overflow you…', options: ['count overflow interrupts in an ISR', 'read the counter more often', 'disable the timer', 'add a pull-up'], correctAnswer: 'count overflow interrupts in an ISR' },
  ],
  'PWM: Shaping Output with Compare Units': [
    { text: 'Duty cycle is defined as…', options: ['high-time divided by the period', 'period divided by high-time', 'the count value', 'the prescaler'], correctAnswer: 'high-time divided by the period' },
    { text: 'In PWM, the output pin is high while…', options: ['the counter is below the compare value', 'the counter is above ARR', 'CS is low', 'the LED is on'], correctAnswer: 'the counter is below the compare value' },
    { text: 'Changing the OCR/CCR value changes…', options: ['the duty cycle next cycle', 'the period', 'the clock', 'the baud'], correctAnswer: 'the duty cycle next cycle' },
    { text: 'Servo position is set by…', options: ['pulse width 1.0-2.0ms in a 20ms period', 'the PWM frequency alone', 'the duty cycle percent', 'the pull-up'], correctAnswer: 'pulse width 1.0-2.0ms in a 20ms period' },
  ],
  'Input Capture: Measuring External Events': [
    { text: 'Input capture records…', options: ['the counter value at the instant a pin edge arrives', 'the average voltage', 'the clock speed', 'the flash usage'], correctAnswer: 'the counter value at the instant a pin edge arrives' },
    { text: 'Pulse width is computed as…', options: ['the falling-edge capture minus the rising-edge capture', 'rising minus falling', '1/period', 'period times two'], correctAnswer: 'the falling-edge capture minus the rising-edge capture' },
    { text: 'Frequency is measured from…', options: ['two consecutive same-edge captures', 'a single capture', 'the counter reset', 'the EEPROM'], correctAnswer: 'two consecutive same-edge captures' },
    { text: 'If a pulse is longer than the timer period…', options: ['captures wrap — handle by counting overflows', 'it is measured fine', 'the timer stops', 'the CPU resets'], correctAnswer: 'captures wrap — handle by counting overflows' },
  ],
  'SysTick: The RTOS & Delay Backbone': [
    { text: 'What exactly is SysTick in a Cortex-M?', options: ['a 24-bit countdown timer in every Cortex-M', 'a vendor UART', 'an ADC channel', 'a GPIO bank'], correctAnswer: 'a 24-bit countdown timer in every Cortex-M' },
    { text: 'The SysTick handler must be named…', options: ['SysTick_Handler', 'main', 'Reset_Handler', 'USART2_IRQHandler'], correctAnswer: 'SysTick_Handler' },
    { text: 'SysTick is limited to…', options: ['24 bits of reload value', '8 bits', 'no limit', '64 bits'], correctAnswer: '24 bits of reload value' },
    { text: 'FreeRTOS commonly uses SysTick for…', options: ['its scheduler tick', 'ADC conversion', 'flash writes', 'the debugger'], correctAnswer: 'its scheduler tick' },
  ],
  // ── Week 10 ───────────────────────────────────────────────────────────────
  'Interrupt Latency & the Critical Path': [
    { text: 'How long does the Cortex-M hardware take to save context?', options: ['12 cycles', '1ms', '1 second', 'no time'], correctAnswer: '12 cycles' },
    { text: 'Interrupt latency is increased by…', options: ['a higher-priority ISR running or a long critical section', 'the LED polarity', 'the linker script', 'the flash size'], correctAnswer: 'a higher-priority ISR running or a long critical section' },
    { text: 'For hard real-time you need the…', options: ['worst-case latency', 'average latency', 'best case', 'the demo latency'], correctAnswer: 'worst-case latency' },
    { text: 'A long critical section delays…', options: ['every ISR for its duration', 'only the UART', 'nothing', 'the linker'], correctAnswer: 'every ISR for its duration' },
  ],
  'Race Conditions: The Shared-Data Minefield': [
    { text: 'Why is a check-then-act sequence unsafe around an ISR?', options: ['an ISR can interleave between the check and the act', 'it is too simple', 'it uses too little memory', 'the compiler fixes it'], correctAnswer: 'an ISR can interleave between the check and the act' },
    { text: 'The correct critical-section restore is…', options: ['__set_PRIMASK(saved)', 'blind sei()', 'leaving interrupts off', 'a reset'], correctAnswer: '__set_PRIMASK(saved)' },
    { text: 'A single-producer single-consumer ring buffer is race-free if…', options: ['each side only writes its own head/tail index', 'both sides share one index', 'no volatile is used', 'it is big'], correctAnswer: 'each side only writes its own head/tail index' },
    { text: 'On an 8-bit MCU, a 16-bit shared read is…', options: ['two accesses — an ISR can interleave between them', 'atomic', 'impossible', 'cached'], correctAnswer: 'two accesses — an ISR can interleave between them' },
  ],
  'Priorities, Nesting & Priority Inversion': [
    { text: 'Priority inversion is the situation where…', options: ['a low-priority holder blocks a high-priority waiter', 'all ISRs run equally', 'no nesting', 'a faster clock'], correctAnswer: 'a low-priority holder blocks a high-priority waiter' },
    { text: 'Between ISRs, priority inversion…', options: ['has no OS fix — design it away', 'is auto-fixed by the NVIC', 'never happens', 'is free'], correctAnswer: 'has no OS fix — design it away' },
    { text: 'Sub-priority orders ISRs…', options: ['at the same preempt level', 'at all levels', 'never', 'by address'], correctAnswer: 'at the same preempt level' },
    { text: 'High-priority ISRs should be…', options: ['few, short, and independent', 'as many as possible', 'long and slow', 'unprioritized'], correctAnswer: 'few, short, and independent' },
  ],
  'ISR Discipline: Do Less, Flag, Defer': [
    { text: 'The ISR contract is…', options: ['service hardware, save essentials, set a flag, return', 'parse everything inside', 'sleep first', 'print a log'], correctAnswer: 'service hardware, save essentials, set a flag, return' },
    { text: 'Forgetting to clear an interrupt flag causes…', options: ['the ISR to re-fire forever', 'a faster system', 'a compile error', 'nothing'], correctAnswer: 'the ISR to re-fire forever' },
    { text: 'Which of these belongs in an ISR?', options: ['reading a data register and storing the value', 'a delay loop', 'malloc', 'a full parser'], correctAnswer: 'reading a data register and storing the value' },
    { text: 'If the RX ring buffer fills while the background is busy, you should…', options: ['flag the overflow and size the buffer for the worst case', 'ignore it silently', 'erase the buffer', 'halt the CPU'], correctAnswer: 'flag the overflow and size the buffer for the worst case' },
  ],
  // ── Week 11 ───────────────────────────────────────────────────────────────
  'UART: Wiring, Framing & Baud Rate': [
    { text: 'UART wiring connects…', options: ['TX of one side to RX of the other, plus a common ground', 'TX to TX', 'RX to VCC', 'nothing'], correctAnswer: 'TX of one side to RX of the other, plus a common ground' },
    { text: 'In 8-N-1, the "1" stands for…', options: ['one stop bit', 'one start bit', 'one parity bit', 'one wire'], correctAnswer: 'one stop bit' },
    { text: 'The idle line level for UART is…', options: ['high (1)', 'low (0)', 'mid-supply', 'floating'], correctAnswer: 'high (1)' },
    { text: 'A start bit is signaled by…', options: ['the line dropping low', 'the line rising high', 'a clock pulse', 'a double stop'], correctAnswer: 'the line dropping low' },
  ],
  'Polling vs Interrupt vs DMA UART': [
    { text: 'Polling UART receive is problematic in real-time systems because…', options: ['the CPU blocks waiting for a byte', 'it uses too much RAM', 'it needs DMA', 'it disables interrupts'], correctAnswer: 'the CPU blocks waiting for a byte' },
    { text: 'The interrupt-driven RX pattern uses…', options: ['an ISR that stores each byte into a ring buffer', 'a busy loop', 'no ISR', 'a delay'], correctAnswer: 'an ISR that stores each byte into a ring buffer' },
    { text: 'DMA-based UART is best for…', options: ['sustained high throughput with zero CPU', 'a single boot message', 'one-off commands', 'nothing'], correctAnswer: 'sustained high throughput with zero CPU' },
    { text: 'Polling UART is fine for…', options: ['boot prints and one-off commands', 'high-speed streaming', 'real-time receive', 'interrupt-driven work'], correctAnswer: 'boot prints and one-off commands' },
  ],
  'Framing Protocols: Newlines to Binary Frames': [
    { text: 'A line-framing parser treats a message as complete at…', options: ['a newline (or carriage return)', 'a stop bit', 'a NACK', 'a CS edge'], correctAnswer: 'a newline (or carriage return)' },
    { text: 'What does a frame with length and CRC fields guard against?', options: ['corruption on noisy links', 'a fast CPU', 'flash wear', 'debugger detach'], correctAnswer: 'corruption on noisy links' },
    { text: 'The SYNC byte lets a receiver…', options: ['find a frame boundary even mid-stream', 'change the baud', 'erase flash', 'sleep'], correctAnswer: 'find a frame boundary even mid-stream' },
    { text: 'The LEN field must be…', options: ['bounded and checked against your buffer', 'unbounded', 'ignored', 'larger than the buffer'], correctAnswer: 'bounded and checked against your buffer' },
  ],
  'printf over UART & Debug Instrumentation': [
    { text: 'Redirecting _write lets printf output go to…', options: ['your uart_putc and thus the UART', 'the display', 'the flash', 'the GPU'], correctAnswer: 'your uart_putc and thus the UART' },
    { text: 'printf from an ISR is a trap because…', options: ['it blocks and can re-enter', 'it is too fast', 'it uses no stack', 'it is atomic'], correctAnswer: 'it blocks and can re-enter' },
    { text: 'A good embedded log line includes…', options: ['level, tag, and a timestamp', 'only the raw value', 'nothing', 'random noise'], correctAnswer: 'level, tag, and a timestamp' },
    { text: 'The boot banner should print…', options: ['the build ID and core clock', 'nothing', 'the schematic', 'a random number'], correctAnswer: 'the build ID and core clock' },
  ],
  // ── Week 12 ───────────────────────────────────────────────────────────────
  'SPI: Four Wires, One Bus, Many Slaves': [
    { text: 'SPI can send and receive at the same time because…', options: ['master and slave shift a byte in both directions per clock', 'it uses two clocks', 'it has an ACK line', 'it is slow'], correctAnswer: 'master and slave shift a byte in both directions per clock' },
    { text: 'Each SPI slave is selected by…', options: ['its own chip-select wire', 'an address byte', 'its baud rate', 'the clock phase'], correctAnswer: 'its own chip-select wire' },
    { text: 'SPI can run at…', options: ['tens of MHz', '100 kHz max', '1 Hz', 'no speed'], correctAnswer: 'tens of MHz' },
    { text: 'CPOL/CPHA mismatch results in…', options: ['shifted or garbage data', 'a NACK', 'a faster link', 'a happy sensor'], correctAnswer: 'shifted or garbage data' },
  ],
  'Master-Slave, CS Timing & Daisy Chains': [
    { text: 'The master talks to one slave at a time by…', options: ['dropping only that slave\'s CS low', 'raising all CS lines', 'using a higher clock', 'sending to all'], correctAnswer: 'dropping only that slave\'s CS low' },
    { text: 'CS must stay low…', options: ['for the whole transaction', 'only during the first byte', 'never', 'after the transaction'], correctAnswer: 'for the whole transaction' },
    { text: 'In a daisy chain, data…', options: ['shifts serially through the connected slaves', 'is broadcast to all', 'uses addressing', 'is not possible'], correctAnswer: 'shifts serially through the connected slaves' },
    { text: 'When a slave is deselected, its MISO…', options: ['goes tri-state (high-Z)', 'stays driving', 'shorts to GND', 'inverts'], correctAnswer: 'goes tri-state (high-Z)' },
  ],
  'Real Devices: Flash, SD Cards & Displays': [
    { text: 'Before writing SPI NOR flash, the target sector must be…', options: ['erased first', 'formatted', 'kept cold', 'read twice'], correctAnswer: 'erased first' },
    { text: 'The WIP status bit indicates…', options: ['a write/erase is in progress', 'the device is off', 'write-protect is on', 'the bus is free'], correctAnswer: 'a write/erase is in progress' },
    { text: 'Flash addresses in commands are…', options: ['big-endian (MSB first)', 'little-endian', 'random', 'not used'], correctAnswer: 'big-endian (MSB first)' },
    { text: 'A TFT display typically needs…', options: ['a D/C line plus SPI data and commands', 'only power', 'no commands', 'a UART'], correctAnswer: 'a D/C line plus SPI data and commands' },
  ],
  'Debugging SPI: Scope Traces & the Mode Trap': [
    { text: 'The best way to see what the SPI wires are doing is…', options: ['a logic-analyzer trace of CS/SCK/MOSI/MISO', 'a breakpoint on main', 'reading the datasheet again', 'a multimeter'], correctAnswer: 'a logic-analyzer trace of CS/SCK/MOSI/MISO' },
    { text: 'Shorting MOSI to MISO and sending a byte is a…', options: ['loopback test of the driver config', 'dangerous short', 'way to erase flash', 'baud check'], correctAnswer: 'loopback test of the driver config' },
    { text: 'All-zeros on MISO usually means…', options: ['device not selected or not powered', 'the clock is too slow', 'the CRC failed', 'a mode mismatch'], correctAnswer: 'device not selected or not powered' },
    { text: 'The ritual that validates a new SPI device is…', options: ['read a fixed register (ID) and compare to the datasheet', 'guess the values', 'skip testing', 'measure current'], correctAnswer: 'read a fixed register (ID) and compare to the datasheet' },
  ],
  // ── Week 13 ───────────────────────────────────────────────────────────────
  'I2C: Two Wires, Addresses & Open-Drain': [
    { text: 'I2C lines are…', options: ['open-drain with pull-up resistors', 'push-pull driven', 'analog inputs', 'power rails'], correctAnswer: 'open-drain with pull-up resistors' },
    { text: 'Slaves on an I2C bus are addressed by…', options: ['a 7-bit address after START', 'their MAC address', 'a CS wire', 'the clock speed'], correctAnswer: 'a 7-bit address after START' },
    { text: 'After every byte, the receiver must send…', options: ['an ACK (or NACK)', 'a stop bit', 'a parity bit', 'nothing'], correctAnswer: 'an ACK (or NACK)' },
    { text: 'How does a slow I2C slave pause the master?', options: ['by holding SCL low', 'by sleeping', 'by removing the pull-up', 'by emptying the bus'], correctAnswer: 'by holding SCL low' },
  ],
  'Register-Mapped Sensors: The I2C Transaction': [
    { text: 'Reading a sensor register requires…', options: ['write the register pointer, then a repeated START, then read', 'a single read byte', 'a stop before every byte', 'no addressing'], correctAnswer: 'write the register pointer, then a repeated START, then read' },
    { text: 'A repeated START is used because…', options: ['the read must follow the pointer write without a STOP', 'STOP is forbidden', 'the bus needs two clocks', 'it doubles the speed'], correctAnswer: 'the read must follow the pointer write without a STOP' },
    { text: 'The last byte of a master read is acknowledged with…', options: ['a NACK', 'an ACK', 'a START', 'a STOP only'], correctAnswer: 'a NACK' },
    { text: '16-bit sensor values usually arrive…', options: ['as two consecutive registers, MSB first', 'as one register', 'over SPI', 'as text'], correctAnswer: 'as two consecutive registers, MSB first' },
  ],
  'I2C Failure Modes: NACK, Stretch & Corruption': [
    { text: 'A NACK right after the address byte suggests…', options: ['wrong address or device not connected/powered', 'the bus is too slow', 'flash is full', 'the CRC is wrong'], correctAnswer: 'wrong address or device not connected/powered' },
    { text: 'The 9-clock unlock recovers…', options: ['a stuck bus where a slave holds a line low', 'a dead battery', 'a full flash', 'a baud error'], correctAnswer: 'a stuck bus where a slave holds a line low' },
    { text: 'Corrupted I2C reads on long wires are usually fixed by…', options: ['slowing the clock and/or adjusting pull-ups', 'raising the clock', 'removing pull-ups', 'a bigger MCU'], correctAnswer: 'slowing the clock and/or adjusting pull-ups' },
    { text: 'Two slaves sharing the same 7-bit address need…', options: ['an I2C mux or a separate bus', 'a software patch', 'higher baud', 'fewer wires'], correctAnswer: 'an I2C mux or a separate bus' },
  ],
  'I2C vs SPI: Choosing the Right Bus': [
    { text: 'Choose I2C when…', options: ['pins are scarce and there are many addressed slow devices', 'you need tens of MHz', 'the device streams blocks', 'you have lots of pins'], correctAnswer: 'pins are scarce and there are many addressed slow devices' },
    { text: 'Choose SPI when…', options: ['speed matters and pins are available', 'you have only two spare pins', 'there are many slow sensors', 'distance is long'], correctAnswer: 'speed matters and pins are available' },
    { text: 'A GPS module is usually connected via…', options: ['UART', 'I2C', 'SPI', 'nothing'], correctAnswer: 'UART' },
    { text: 'The bus for an EEPROM and an RTC alongside many sensors is typically…', options: ['I2C', 'SPI', 'UART', 'CAN'], correctAnswer: 'I2C' },
  ],
  // ── Week 14 ───────────────────────────────────────────────────────────────
  'ADC: From Voltage to a Number': [
    { text: 'A 12-bit ADC at 3.3V reference resolves roughly…', options: ['0.8mV per step', '3.3V per step', '1V per step', '33mV per step'], correctAnswer: '0.8mV per step' },
    { text: 'The reference voltage (Vref) is…', options: ['the ruler the ADC measures against', 'optional', 'the supply to the LED', 'a clock source'], correctAnswer: 'the ruler the ADC measures against' },
    { text: 'The sample-and-hold capacitor needs time to…', options: ['charge before conversion', 'discharge the battery', 'erase flash', 'reset the bus'], correctAnswer: 'charge before conversion' },
    { text: 'A high-impedance source needs…', options: ['a longer sample time', 'a shorter sample time', 'no sample time', 'a higher clock'], correctAnswer: 'a longer sample time' },
  ],
  'Sampling, Aliasing & the Nyquist Rule': [
    { text: 'Nyquist says you must sample at…', options: ['more than twice the highest signal frequency', 'exactly the signal frequency', 'as slowly as possible', 'half the frequency'], correctAnswer: 'more than twice the highest signal frequency' },
    { text: 'Aliasing shows up as…', options: ['a fake slow signal folded from a fast one', 'a clean signal', 'extra resolution', 'a NACK'], correctAnswer: 'a fake slow signal folded from a fast one' },
    { text: 'The anti-alias filter goes…', options: ['between the signal and the ADC pin', 'inside the MCU', 'on the power rail', 'nowhere'], correctAnswer: 'between the signal and the ADC pin' },
    { text: 'Averaging many samples…', options: ['smooths noise but does NOT fix aliasing', 'fixes aliasing', 'is forbidden', 'slows the ADC'], correctAnswer: 'smooths noise but does NOT fix aliasing' },
  ],
  'DMA-Streamed ADC: Continuous Sampling': [
    { text: 'DMA-streamed ADC lets the converter…', options: ['fill a RAM buffer with no CPU involvement', 'erase flash', 'run the RTOS', 'drive the display'], correctAnswer: 'fill a RAM buffer with no CPU involvement' },
    { text: 'The half/full DMA interrupt enables…', options: ['processing one half of the buffer while the other fills', 'sampling twice as fast', 'two ADCs', 'no processing'], correctAnswer: 'processing one half of the buffer while the other fills' },
    { text: 'DMA-sampled data is preferred for frequency analysis because…', options: ['samples are uniformly timed, not jittery', 'it is random', 'it is slower', 'it uses the CPU'], correctAnswer: 'samples are uniformly timed, not jittery' },
    { text: 'If the CPU does not drain the DMA buffer before it wraps…', options: ['data is overwritten — use double buffering', 'nothing happens', 'the ADC stops', 'flash fills'], correctAnswer: 'data is overwritten — use double buffering' },
  ],
  'DAC: Generating Analog & the Traps': [
    { text: 'Which direction does a DAC convert?', options: ['a digital number into a voltage', 'a voltage into a number', 'a byte into a frame', 'time into counts'], correctAnswer: 'a digital number into a voltage' },
    { text: 'What feeds a DAC to output a waveform with no CPU involvement?', options: ['DMA triggered by a timer', 'a busy loop', 'manual register writes', 'the debugger'], correctAnswer: 'DMA triggered by a timer' },
    { text: 'A DAC output range is typically…', options: ['between GND and Vref', 'between -5V and +5V', 'unlimited', 'digital only'], correctAnswer: 'between GND and Vref' },
    { text: 'The cheap substitute when a chip has no DAC is…', options: ['PWM plus an RC filter', 'an extra UART', 'a bigger flash', 'a crystal'], correctAnswer: 'PWM plus an RC filter' },
  ],
  // ── Week 15 ───────────────────────────────────────────────────────────────
  'Why an RTOS: Tasks & the Scheduler': [
    { text: 'A preemptive scheduler…', options: ['can interrupt a running task for a higher-priority one', 'never interrupts tasks', 'runs one task forever', 'needs no tick'], correctAnswer: 'can interrupt a running task for a higher-priority one' },
    { text: 'A blocked task (waiting on a queue)…', options: ['uses no CPU until it is woken', 'busy-waits', 'disables the scheduler', 'runs at full speed'], correctAnswer: 'uses no CPU until it is woken' },
    { text: 'Each RTOS task has…', options: ['its own stack', 'its own CPU', 'its own flash', 'no memory'], correctAnswer: 'its own stack' },
    { text: 'xTaskCreate\'s stack parameter sets…', options: ['how much stack the task owns', 'the stack colour', 'the flash usage', 'the priority only'], correctAnswer: 'how much stack the task owns' },
  ],
  'Queues: The Safe Way to Pass Data': [
    { text: 'A queue is a…', options: ['thread-safe FIFO with blocking and timeouts', 'global variable', 'peripheral', 'lock-free chain'], correctAnswer: 'thread-safe FIFO with blocking and timeouts' },
    { text: 'xQueueSendFromISR is used because…', options: ['queue calls from an ISR must never block', 'ISRs can block', 'it is faster on the bench', 'the queue is bigger'], correctAnswer: 'queue calls from an ISR must never block' },
    { text: 'A consumer waiting on an empty queue…', options: ['sleeps until data arrives', 'spins the CPU', 'erases the queue', 'resets the board'], correctAnswer: 'sleeps until data arrives' },
    { text: 'Queues decouple tasks by…', options: ['letting each stage own its data without shared globals', 'sharing one variable', 'disabling interrupts', 'using DMA'], correctAnswer: 'letting each stage own its data without shared globals' },
  ],
  'Semaphores & Mutexes: Locking Shared Resources': [
    { text: 'A binary semaphore is best for…', options: ['signaling (an ISR wakes a task)', 'exclusive resource access', 'counting slots', 'all equally'], correctAnswer: 'signaling (an ISR wakes a task)' },
    { text: 'A mutex has…', options: ['an owner and priority inheritance', 'no owner', 'a counter', 'no concept of priority'], correctAnswer: 'an owner and priority inheritance' },
    { text: 'A counting semaphore tracks…', options: ['a pool of identical resources', 'a single event', 'the stack size', 'the clock'], correctAnswer: 'a pool of identical resources' },
    { text: 'A leaked mutex (never given back)…', options: ['freezes every future taker', 'is harmless', 'speeds up', 'erases itself'], correctAnswer: 'freezes every future taker' },
  ],
  'RTOS Bugs: Deadlock, Starvation & Priority Inversion': [
    { text: 'The classic deadlock is…', options: ['two tasks each hold one lock and wait for the other\'s', 'a task that delays', 'a big queue', 'a high ISR rate'], correctAnswer: 'two tasks each hold one lock and wait for the other\'s' },
    { text: 'Starvation means…', options: ['a task never gets scheduled because higher priorities hog the CPU', 'the stack is full', 'the queue is empty', 'the clock is slow'], correctAnswer: 'a task never gets scheduled because higher priorities hog the CPU' },
    { text: 'Priority inheritance lets…', options: ['a low task inherit a high task\'s priority while holding a mutex', 'all tasks run at once', 'the scheduler sleep', 'tasks share stacks'], correctAnswer: 'a low task inherit a high task\'s priority while holding a mutex' },
    { text: 'Using timeouts on waits helps because…', options: ['a stuck wait becomes a diagnosable event, not a hang', 'it makes tasks faster', 'it saves RAM', 'it disables the scheduler'], correctAnswer: 'a stuck wait becomes a diagnosable event, not a hang' },
  ],
  // ── Week 16 ───────────────────────────────────────────────────────────────
  'Requirements: What "Works" Really Means': [
    { text: 'A good requirements document describes…', options: ['what the system must do, measurably', 'only the hardware', 'the code structure', 'nothing'], correctAnswer: 'what the system must do, measurably' },
    { text: 'A non-functional requirement covers…', options: ['performance, power, and timing', 'the schematic', 'the compiler', 'the colour of the PCB'], correctAnswer: 'performance, power, and timing' },
    { text: 'An ambiguous requirement ("fast response") should be rewritten as…', options: ['a measurable bound (e.g. respond within 10 ms)', 'a stronger adjective', 'a picture', 'a guess'], correctAnswer: 'a measurable bound (e.g. respond within 10 ms)' },
    { text: 'Acceptance criteria exist to…', options: ['prove the requirement is met at review time', 'fill the document', 'delay the project', 'replace testing'], correctAnswer: 'prove the requirement is met at review time' },
  ],
  'Architecture: The Block Diagram Before Code': [
    { text: 'The block diagram shows…', options: ['subsystems, data flow, and interfaces', 'variable names', 'the sales pitch', 'nothing'], correctAnswer: 'subsystems, data flow, and interfaces' },
    { text: 'Architecture reviews catch problems…', options: ['before code makes them expensive', 'after release', 'during QA', 'never'], correctAnswer: 'before code makes them expensive' },
    { text: 'Decomposing by function (sensing, control, comms) gives…', options: ['cohesive modules that are easy to test', 'one giant file', 'no interfaces', 'slower builds'], correctAnswer: 'cohesive modules that are easy to test' },
    { text: 'The interface contract between modules is…', options: ['the function signatures and the data they exchange', 'optional', 'a comment', 'the PCB layout'], correctAnswer: 'the function signatures and the data they exchange' },
  ],
  'Real-Time Scheduling & Worst-Case Analysis': [
    { text: 'A task is schedulable if…', options: ['its worst-case execution time fits within its period', 'it usually finishes', 'the CPU is fast', 'the queue is empty'], correctAnswer: 'its worst-case execution time fits within its period' },
    { text: 'Rate-monotonic priority assigns…', options: ['the highest priority to the fastest task', 'equal priority', 'no priority', 'priority by name'], correctAnswer: 'the highest priority to the fastest task' },
    { text: 'Worst-case execution time (WCET) matters because…', options: ['a task may take longer than the average case', 'average time is enough', 'it never changes', 'it is free'], correctAnswer: 'a task may take longer than the average case' },
    { text: 'If total CPU utilization exceeds what the deadlines allow…', options: ['the system may miss deadlines — cut or re-prioritize work', 'add a delay', 'raise the clock and hope', 'nothing happens'], correctAnswer: 'the system may miss deadlines — cut or re-prioritize work' },
  ],
  'Power Budgeting & Low-Power Design': [
    { text: 'A power budget sums…', options: ['every load\'s current over its active time', 'only the MCU', 'the resistor count', 'nothing'], correctAnswer: 'every load\'s current over its active time' },
    { text: 'A battery capacity in mAh divided by average current gives…', options: ['the expected runtime', 'the peak power', 'the voltage', 'the weight'], correctAnswer: 'the expected runtime' },
    { text: 'Duty-cycling means…', options: ['sleeping most of the time and waking briefly to work', 'always on', 'raising the clock', 'disabling the battery'], correctAnswer: 'sleeping most of the time and waking briefly to work' },
    { text: 'The biggest low-power win in firmware is often…', options: ['selecting sleep modes instead of busy-waiting', 'a bigger battery', 'more LEDs', 'faster code'], correctAnswer: 'selecting sleep modes instead of busy-waiting' },
  ],
  // ── Week 17 ───────────────────────────────────────────────────────────────
  'Firmware Coding Standards & Review': [
    { text: 'A coding standard exists to…', options: ['make code consistent, reviewable, and less bug-prone', 'slow development', 'satisfy a checkbox', 'hide bugs'], correctAnswer: 'make code consistent, reviewable, and less bug-prone' },
    { text: 'MISRA C targets…', options: ['safety-critical embedded code', 'web apps', 'databases', 'everything'], correctAnswer: 'safety-critical embedded code' },
    { text: 'A code review is most effective when…', options: ['it focuses on logic and resource bugs, not style', 'it approves everything', 'only one person reads it', 'it is skipped for small changes'], correctAnswer: 'it focuses on logic and resource bugs, not style' },
    { text: 'The reviewer should especially check…', options: ['resource ownership and error paths', 'the commit message', 'the logo', 'the build time'], correctAnswer: 'resource ownership and error paths' },
  ],
  'Static Analysis & Compiler Warnings': [
    { text: 'Treating warnings as errors forces…', options: ['the team to fix real defects instead of hiding them', 'slower compiles', 'more warnings', 'no effect'], correctAnswer: 'the team to fix real defects instead of hiding them' },
    { text: 'A static analyzer finds bugs by…', options: ['examining code paths without running the program', 'running the hardware', 'benchmarking', 'guessing'], correctAnswer: 'examining code paths without running the program' },
    { text: '-Wall alone is…', options: ['not enough — enable more warning sets', 'the end of analysis', 'forbidden', 'a runtime check'], correctAnswer: 'not enough — enable more warning sets' },
    { text: 'An uninitialized variable warning is…', options: ['a real defect — initialize before use', 'harmless', 'a style choice', 'always false'], correctAnswer: 'a real defect — initialize before use' },
  ],
  'Testing Firmware: Host-Side & Hardware-in-the-Loop': [
    { text: 'Host-side testing runs…', options: ['the same logic compiled for your PC, with hardware stubbed', 'the real board', 'the RTOS only', 'nothing'], correctAnswer: 'the same logic compiled for your PC, with hardware stubbed' },
    { text: 'Host-side tests are valuable because they…', options: ['run fast in CI with no hardware', 'replace field testing', 'need a target', 'are slow'], correctAnswer: 'run fast in CI with no hardware' },
    { text: 'Hardware-in-the-loop testing checks…', options: ['real timing, real peripherals, real wiring', 'only the logic', 'the datasheet', 'nothing'], correctAnswer: 'real timing, real peripherals, real wiring' },
    { text: 'The best order is…', options: ['host tests first, then hardware tests', 'hardware first', 'only hardware', 'neither'], correctAnswer: 'host tests first, then hardware tests' },
  ],
  'Debugging Nightmares: Heisenbugs & Tooling': [
    { text: 'A heisenbug is a bug that…', options: ['changes behaviour when you observe it', 'never happens', 'is in the compiler', 'is easy to find'], correctAnswer: 'changes behaviour when you observe it' },
    { text: 'Printing from an interrupt-heavy path can mask timing bugs because…', options: ['it adds latency that changes the race', 'it is too fast', 'it uses flash', 'it helps'], correctAnswer: 'it adds latency that changes the race' },
    { text: 'An uninitialized variable is a classic heisenbug because…', options: ['the garbage value depends on what ran before', 'it is deterministic', 'it is fixed', 'it never crashes'], correctAnswer: 'the garbage value depends on what ran before' },
    { text: 'The disciplined approach to a flaky bug is…', options: ['a hypothesis, then a controlled experiment', 'random code changes', 'rebuilding with luck', 'ignoring it'], correctAnswer: 'a hypothesis, then a controlled experiment' },
  ],
  // ── Week 18 ───────────────────────────────────────────────────────────────
  'The Testing Pyramid for Firmware': [
    { text: 'The base of the testing pyramid is…', options: ['many fast unit tests', 'a few manual checks', 'only hardware tests', 'documentation'], correctAnswer: 'many fast unit tests' },
    { text: 'The top of the pyramid has…', options: ['a few slow end-to-end/system tests', 'most of the tests', 'no tests', 'only smoke tests'], correctAnswer: 'a few slow end-to-end/system tests' },
    { text: 'Relying mostly on manual testing means…', options: ['regressions are caught late or never', 'better coverage', 'faster feedback', 'no bugs'], correctAnswer: 'regressions are caught late or never' },
    { text: 'A unit test should be…', options: ['deterministic, isolated, and fast', 'random', 'dependent on other tests', 'slow'], correctAnswer: 'deterministic, isolated, and fast' },
  ],
  'Writing Testable Firmware: The Seam Pattern': [
    { text: 'A seam is…', options: ['a point where you can swap a real dependency for a fake', 'a crack in the PCB', 'a comment', 'a bug'], correctAnswer: 'a point where you can swap a real dependency for a fake' },
    { text: 'Passing a driver as an interface lets tests…', options: ['inject a fake instead of the real hardware', 'run only on hardware', 'skip testing', 'erase flash'], correctAnswer: 'inject a fake instead of the real hardware' },
    { text: 'Injection of the clock lets tests…', options: ['advance time deterministically', 'erase time', 'run faster', 'sleep'], correctAnswer: 'advance time deterministically' },
    { text: 'A pure function (same input, same output, no globals) is…', options: ['the easiest thing to unit test', 'untestable', 'forbidden', 'slow'], correctAnswer: 'the easiest thing to unit test' },
  ],
  'Test Automation: CI for Firmware': [
    { text: 'CI for firmware should run…', options: ['build, static analysis, and host tests on every push', 'nothing', 'only on release', 'manual checks'], correctAnswer: 'build, static analysis, and host tests on every push' },
    { text: 'A build that fails on any warning…', options: ['forces the team to fix issues immediately', 'is annoying', 'is optional', 'slows everyone'], correctAnswer: 'forces the team to fix issues immediately' },
    { text: 'Hardware-in-the-loop can run in CI when…', options: ['boards or emulators are available to the runner', 'never', 'only locally', 'it is skipped'], correctAnswer: 'boards or emulators are available to the runner' },
    { text: 'The value of fast CI feedback is…', options: ['bugs are found minutes after they are written', 'slower releases', 'less testing', 'more documentation'], correctAnswer: 'bugs are found minutes after they are written' },
  ],
  'Coverage: What It Tells You and What It Hides': [
    { text: 'High line coverage means…', options: ['those lines ran — not that they are correct', 'there are no bugs', 'the code is perfect', 'nothing ran'], correctAnswer: 'those lines ran — not that they are correct' },
    { text: 'A missing test for an error path…', options: ['still counts as low coverage and hides a risk', 'is fine', 'is unreachable', 'is required'], correctAnswer: 'still counts as low coverage and hides a risk' },
    { text: 'Branch coverage improves on line coverage by…', options: ['checking both outcomes of conditions', 'counting lines', 'running slower', 'removing tests'], correctAnswer: 'checking both outcomes of conditions' },
    { text: 'Chasing 100% coverage can…', options: ['waste effort on trivial code — target the risky paths', 'eliminate all bugs', 'speed up tests', 'be impossible to avoid'], correctAnswer: 'waste effort on trivial code — target the risky paths' },
  ],
  // ── Week 19 ───────────────────────────────────────────────────────────────
  'The Design Documents that Matter': [
    { text: 'The documents worth writing are…', options: ['requirements, architecture, and a test plan', 'nothing', 'only code', 'the logo'], correctAnswer: 'requirements, architecture, and a test plan' },
    { text: 'A design document written before code serves as…', options: ['a reference for why and how, even years later', 'a formality', 'a delay', 'a deliverable to ignore'], correctAnswer: 'a reference for why and how, even years later' },
    { text: 'Documents rot when…', options: ['they are not updated alongside the code', 'they are too short', 'they are read', 'they are in git'], correctAnswer: 'they are not updated alongside the code' },
    { text: 'Keeping docs next to the code in the repo…', options: ['makes them easy to update in the same review', 'is impossible', 'hides them', 'is forbidden'], correctAnswer: 'makes them easy to update in the same review' },
  ],
  'Reading Datasheets: The Signal in the Noise': [
    { text: 'The datasheet section you check first for a new part is…', options: ['absolute maximum ratings', 'the logo', 'the marketing text', 'the font'], correctAnswer: 'absolute maximum ratings' },
    { text: 'Electrical characteristics tables give…', options: ['limits and typical values over temperature and voltage', 'the price', 'the colour', 'the weight'], correctAnswer: 'limits and typical values over temperature and voltage' },
    { text: 'An errata document lists…', options: ['known silicon bugs and workarounds', 'features', 'pricing', 'obsolete parts'], correctAnswer: 'known silicon bugs and workarounds' },
    { text: 'Timing diagrams in a datasheet are read as…', options: ['setup/hold times relative to the clock edges', 'aesthetic art', 'a joke', 'optional'], correctAnswer: 'setup/hold times relative to the clock edges' },
  ],
  'Writing Documentation That People Read': [
    { text: 'Comments should explain…', options: ['why the code is the way it is, not what it does', 'every line again', 'the syntax', 'nothing'], correctAnswer: 'why the code is the way it is, not what it does' },
    { text: 'A misleading comment is…', options: ['worse than no comment', 'helpful', 'fine', 'required'], correctAnswer: 'worse than no comment' },
    { text: 'A README that people actually read starts with…', options: ['how to build, run, and test', 'the company history', 'a poem', 'nothing'], correctAnswer: 'how to build, run, and test' },
    { text: 'API docs are most useful when they show…', options: ['a real usage example', 'only the signature', 'a copyright', 'the version'], correctAnswer: 'a real usage example' },
  ],
  'The Decision Log & Handoff Notes': [
    { text: 'A decision log records…', options: ['a choice, the options, and why you picked one', 'the whole chat log', 'a diary', 'nothing'], correctAnswer: 'a choice, the options, and why you picked one' },
    { text: 'Future maintainers need decision records because…', options: ['the "why" is otherwise lost and the choice gets undone', 'it is a legal form', 'it is fun', 'it replaces code'], correctAnswer: 'the "why" is otherwise lost and the choice gets undone' },
    { text: 'Good handoff notes include…', options: ['open issues, known quirks, and how to build/test', 'a resignation letter', 'nothing', 'the password'], correctAnswer: 'open issues, known quirks, and how to build/test' },
    { text: 'Known quirks documented now…', options: ['save the next engineer days of re-discovery', 'are admissions of guilt', 'are embarrassing', 'slow the build'], correctAnswer: 'save the next engineer days of re-discovery' },
  ],
  // ── Week 20 ───────────────────────────────────────────────────────────────
  'Planning a Complete Embedded Project': [
    { text: 'A project plan should…', options: ['split the work into phases with clear checkpoints', 'only have a deadline', 'avoid dates', 'skip testing'], correctAnswer: 'split the work into phases with clear checkpoints' },
    { text: 'The risk you plan for first is…', options: ['the longest lead-time or hardest-to-prove item', 'the logo colour', 'the README', 'the meeting room'], correctAnswer: 'the longest lead-time or hardest-to-prove item' },
    { text: 'Breaking the plan into milestones lets you…', options: ['show demonstrable progress and re-plan early', 'hide delays', 'skip reviews', 'ship late'], correctAnswer: 'show demonstrable progress and re-plan early' },
    { text: 'A schedule built only from happy-path estimates…', options: ['ignores the inevitable debugging and rework', 'is accurate', 'is conservative', 'includes testing'], correctAnswer: 'ignores the inevitable debugging and rework' },
  ],
  'The Demo: Proving It Works Live': [
    { text: 'A good demo…', options: ['proves the key requirement live, with a fallback', 'is scripted with no risk', 'shows only slides', 'runs forever'], correctAnswer: 'proves the key requirement live, with a fallback' },
    { text: 'Rehearsing the demo matters because…', options: ['live hardware fails in the moment without practice', 'it is a formality', 'it wastes time', 'slides are enough'], correctAnswer: 'live hardware fails in the moment without practice' },
    { text: 'If a live demo fails, the right move is…', options: ['a prepared fallback and a calm explanation', 'panic', 'restart silently', 'skip the rest'], correctAnswer: 'a prepared fallback and a calm explanation' },
    { text: 'A demo should start with…', options: ['the one requirement the system absolutely must meet', 'the power budget', 'the wiring', 'the name'], correctAnswer: 'the one requirement the system absolutely must meet' },
  ],
  'The Release Review: A Checklist Before You Ship': [
    { text: 'Before shipping, verify…', options: ['requirements met, tests green, and known bugs documented', 'the logo is new', 'the build is unreadable', 'nothing'], correctAnswer: 'requirements met, tests green, and known bugs documented' },
    { text: 'Releasing with known critical bugs…', options: ['is a decision made openly, with a plan to fix', 'is automatic', 'is impossible', 'is fine silently'], correctAnswer: 'is a decision made openly, with a plan to fix' },
    { text: 'A release checklist protects…', options: ['the things that are easy to forget under pressure', 'the firmware', 'the team\'s free time', 'the compiler'], correctAnswer: 'the things that are easy to forget under pressure' },
    { text: 'The version number should be…', options: ['tied to the firmware you actually flashed', 'random', 'the date', 'unused'], correctAnswer: 'tied to the firmware you actually flashed' },
  ],
  "The Engineer's Mindset & Certification": [
    { text: 'An embedded engineer\'s mindset is…', options: ['evidence over belief: measure before you guess', 'guessing first', 'copy-paste fast', 'always the latest chip'], correctAnswer: 'evidence over belief: measure before you guess' },
    { text: 'Before blaming the hardware, you…', options: ['prove the firmware hypothesis first', 'swap the chip', 'return the board', 'give up'], correctAnswer: 'prove the firmware hypothesis first' },
    { text: 'The skill that compounds most over time is…', options: ['reading datasheets and debugging methodically', 'memorizing pinouts', 'knowing one board', 'typing fast'], correctAnswer: 'reading datasheets and debugging methodically' },
    { text: 'A certification or exam in embedded systems tests…', options: ['breadth, then depth under your chosen specialty', 'only one vendor', 'memorized trivia', 'marketing'], correctAnswer: 'breadth, then depth under your chosen specialty' },
  ],
};
