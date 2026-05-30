export interface Topic {
  title: string;
  text: string;
  code?: string;
  note?: string;
}

export interface ModuleCurriculum {
  order: number;
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

export interface CourseQuiz {
  questions: Question[];
}

export const curriculum: Record<string, ModuleCurriculum[]> = {
  "C": [
    {
      order: 1,
      title: "Procedural Fundamentals & Memory Layouts",
      description: "Deep dive into C execution models, compilation pipelines, memory segments, and hardware representations.",
      topics: [
        {
          title: "The Compilation Pipeline",
          text: "The C compilation pipeline is a multi-stage process that transforms human-readable source code into machine-executable binary. It consists of four distinct phases:\n1. Preprocessing: The preprocessor (`cpp`) processes directives starting with `#`. It resolves macros (`#define`), includes header contents (`#include`), and handles conditional compilation (`#ifdef`). It produces expanded source files (`.i`).\n2. Compilation: The compiler (e.g., `gcc`, `clang`) translates the preprocessed C source into assembly instructions tailored to the target CPU architecture (e.g., x86_64, ARM Cortex-M). This phase validates syntax and performs semantic analysis, outputting assembly code (`.s`).\n3. Assembly: The assembler (`as`) translates assembly language instructions into raw machine code (object code), generating binary object files (`.o` or `.obj`) containing machine instructions and symbol tables.\n4. Linking: The linker (`ld`) merges multiple object files and static/dynamic libraries into a single cohesive executable or binary image. It resolves symbols (function names, global variables) and maps them to absolute or relative memory locations.",
          code: `// Preprocess only:
gcc -E main.c -o main.i

// Compile to assembly:
gcc -S main.i -o main.s

// Assemble to object code:
gcc -c main.s -o main.o

// Link to executable:
gcc main.o -o program`,
          note: "Compiler warnings during compilation target syntax and types, whereas unresolved symbol errors occur in the linking phase."
        },
        {
          title: "Memory Segments & Layout",
          text: "When a C program runs, the operating system or system loader allocates a virtual memory space divided into structured segments:\n- Text Segment (Code): A read-only, fixed-size segment containing the raw compiled machine instructions. It is marked read-only to prevent self-modifying code vulnerabilities.\n- Data Segment (Initialized): Contains global and static variables that have been explicitly initialized with non-zero values in the source code. These are allocated when the program starts and persist throughout its execution.\n- BSS (Block Started by Symbol): Houses uninitialized global and static variables. The runtime environment clears this memory, initializing all variables inside to zero or NULL before `main()` is executed.\n- Stack Segment: A dynamic, LIFO (Last-In-First-Out) memory structure that grows downwards. Each function call allocates a 'stack frame' containing local variables, parameters, and return addresses. When a function completes, its frame is popped, reclaiming the space.\n- Heap Segment: A pool of dynamic memory that grows upwards. It is manually managed by the programmer using `malloc()`, `calloc()`, and `free()`. Memory allocation here remains active until explicitly deallocated or the program terminates.",
          code: `#include <stdio.h>
#include <stdlib.h>

int global_init = 42;          // Data Segment
int global_uninit;             // BSS Segment

int main() {
    static int local_static = 10; // Data Segment
    int local_stack = 5;          // Stack Segment
    int *heap_ptr = malloc(sizeof(int)); // Heap Segment
    free(heap_ptr);
    return 0;
}`,
          note: "A Stack Overflow happens when stack memory limits are exceeded (e.g., deep recursive functions), whereas Heap Fragmentation is caused by poor allocation patterns."
        },
        {
          title: "Type Sizes, Representation & Endianness",
          text: "In C, variable types map directly to hardware registers. Size depends on target architecture (16-bit, 32-bit, or 64-bit):\n- Integral Types: `char` (8-bit), `short` (16-bit), `int` (typically 32-bit), `long` (32/64-bit).\n- Endianness: Dictates how multi-byte values are arranged in memory. Little-Endian systems (like x86 and ARM Cortex-M) store the Least Significant Byte (LSB) at the lowest memory address. Big-Endian systems store the Most Significant Byte (MSB) first.\n- Floating-Point: Structured under the IEEE 754 standard, dividing floats (32-bit) and doubles (64-bit) into Sign, Exponent, and Mantissa bits.",
          code: `#include <stdio.h>

void check_endianness() {
    unsigned int x = 0x76543210;
    char *c = (char*)&x;
    if (*c == 0x10) {
        printf("Little-Endian System\\n");
    } else {
        printf("Big-Endian System\\n");
    }
}`,
          note: "Ensure correct endianness mapping when sending raw byte structures over networks or hardware buses (SPI, I2C)."
        }
      ]
    },
    {
      order: 2,
      title: "Control Structures & State Machines",
      description: "Advanced control flow, optimizing branching conditions, and building robust Finite State Machines (FSM).",
      topics: [
        {
          title: "Optimized Branching & Conditional Evaluation",
          text: "Conditional execution affects CPU instruction pipelines. Modern processors use Branch Predictors to speculate which path a branch will take. If a prediction is wrong, the CPU must flush its pipeline (branch misprediction penalty). To write high-performance C:\n- Arrange conditional paths from highest to lowest probability to optimize prediction.\n- Leverage Short-Circuit Evaluation: In expressions like `if (A && B)`, if A evaluates to false, B is not evaluated. Put the cheapest check first.",
          code: `// Unoptimized search check:
if (expensive_lookup() && is_valid == 1) { ... }

// Optimized: Put cheap condition first
if (is_valid == 1 && expensive_lookup()) { ... }`,
          note: "Compiler flags like `-O2` or `-O3` optimize branching, but clean short-circuit logic remains the programmer's job."
        },
        {
          title: "Finite State Machines (FSM) in Embedded C",
          text: "Finite State Machines are the backbone of control logic in firmware and driver development. An FSM consists of a defined set of states, transitions triggered by inputs, and actions. In C, FSMs are implemented cleanly using:\n1. State Enums: Defines the list of active states.\n2. Switch-Case Structure: Evaluates the current state, processes active tasks, checks for transition triggers, and handles updates.",
          code: `typedef enum {
    STATE_IDLE,
    STATE_HEATING,
    STATE_CRITICAL_FAULT
} SystemState;

SystemState currentState = STATE_IDLE;
int currentTemp = 25;

void process_state_machine() {
    switch (currentState) {
        case STATE_IDLE:
            if (currentTemp < 40) {
                currentState = STATE_HEATING;
            }
            break;
        case STATE_HEATING:
            if (currentTemp >= 80) {
                currentState = STATE_CRITICAL_FAULT;
            }
            break;
        case STATE_CRITICAL_FAULT:
            // Disable relays
            break;
    }
}`,
          note: "Using explicit state transitions via enums prevents invalid states and simplifies debugging."
        },
        {
          title: "Goto & Unstructured Jumps",
          text: "While unstructured jumping via `goto` is generally discouraged in high-level applications, it has a standard, highly accepted idiom in systems programming: unified cleanup and error handling.\nInstead of duplicating free/close operations inside multiple nested conditional error blocks, systems code jumps to a singular label at the bottom of the function to clean up resources in reverse order of allocation.",
          code: `int process_device() {
    int *buffer = malloc(1024);
    if (!buffer) return -1;

    if (init_hardware() != 0) {
        goto cleanup_buffer;
    }

    if (read_data(buffer) != 0) {
        goto cleanup_hardware;
    }

    return 0; // Success

cleanup_hardware:
    deinit_hardware();
cleanup_buffer:
    free(buffer);
    return -1; // Failure
}`,
          note: "Only use goto for forward jumps to a unified error handling block at the end of a function."
        }
      ]
    },
    {
      order: 3,
      title: "Pointers & Dynamic Memory Architecture",
      description: "Thorough analysis of memory referencing, pointer arithmetic, dynamic allocations, and dynamic data structures.",
      topics: [
        {
          title: "Pointer Arithmetic & Array Decay",
          text: "Pointers store absolute memory addresses. Pointer arithmetic is scaled by the size of the target data type. When you add `1` to an `int*`, the address changes by `sizeof(int)` (typically 4 bytes).\nArray Decay refers to the automatic conversion of an array name to a pointer targeting its first element when passed into functions, which strips away the array's boundary/size information.",
          code: `int arr[5] = {10, 20, 30, 40, 50};
int *ptr = arr; // Decay

printf("Value: %d\\n", *ptr);       // 10
printf("Value: %d\\n", *(ptr + 2)); // 30 (Offset by 2 * 4 bytes)
printf("Size inside: %lu\\n", sizeof(arr)); // 20 bytes (5 * 4)`,
          note: "Never use 'sizeof(parameter_pointer)' to get the size of an array passed into a function."
        },
        {
          title: "Dynamic Allocation, Memory Leaks & Fragmentation",
          text: "Dynamic memory is allocated on the heap during runtime using `malloc(size)`, `calloc(num, size)` (which clears memory to zero), and resized via `realloc(ptr, size)`.\n- Memory Leak: Happens when dynamically allocated memory is never released via `free()`, slowly exhausting available system RAM.\n- Heap Fragmentation: Occurs when heap blocks are allocated and freed in alternating sequences, leaving tiny free gaps that cannot satisfy large contiguous allocations, even if total free memory is sufficient.",
          code: `void leaky_function() {
    int *temp = malloc(100 * sizeof(int));
    // Missing free(temp); -> Causes a memory leak every time it is called.
}

void corrected_allocation() {
    int *temp = malloc(100 * sizeof(int));
    if (temp != NULL) {
        // Perform processing
        free(temp); // Released!
    }
}`,
          note: "Always check if malloc returns NULL before dereferencing, and set freed pointers to NULL."
        },
        {
          title: "Volatile Keyword in Systems Code",
          text: "In C, the `volatile` qualifier tells the compiler that the value of a variable may change at any time without action from the surrounding code. This prevents the compiler's optimizer from caching the variable in CPU registers, forcing it to reload the raw value from RAM on every access. Critical for:\n1. Memory-Mapped I/O Registers.\n2. Global variables modified inside Interrupt Service Routines (ISRs).\n3. Variables shared across multiple concurrent threads.",
          code: `// Without volatile, this loop might optimize to while(1):
volatile int hardware_status_register = 0;

void wait_for_ready() {
    while (hardware_status_register == 0) {
        // Must read from actual memory address every loop iteration
    }
}`,
          note: "Volatile does not guarantee atomicity or thread safety; it only prevents optimization caches."
        }
      ]
    },
    {
      order: 4,
      title: "Composite Types & Data Structures",
      description: "Analyzing struct alignments, padding rules, unions for register manipulation, and building embedded lists.",
      topics: [
        {
          title: "Struct Padding, Memory Alignment & Packed Structs",
          text: "CPUs access memory in standard alignment blocks (e.g., 32-bit or 64-bit chunks). To maximize access speed, compilers insert invisible padding bytes into structs so variables line up with boundary structures. This increases the struct's physical footprint.\n- Packed Structs: We can override this behavior using compiler attributes (like `__attribute__((__packed__))`) to strip all padding bytes. This is vital when matching a struct layout to byte-precise hardware registers or network packets.",
          code: `struct NormalStruct {
    char a;    // 1 byte (+ 3 padding bytes)
    int b;     // 4 bytes
}; // Total Size: 8 bytes

struct __attribute__((__packed__)) PackedStruct {
    char a;    // 1 byte
    int b;     // 4 bytes
}; // Total Size: 5 bytes`,
          note: "Packing structures increases CPU overhead due to unaligned memory access, so only use it when matching rigid hardware structures."
        },
        {
          title: "Unions for Hardware Register Mapping",
          text: "A `union` stores all its members at the exact same physical memory address. Writing to one member overwrites the others. This is an incredibly powerful tool in systems programming for overlaying overlapping views onto the same binary buffer (e.g., accessing an entire 8-bit register as a single byte or as individual configuration bits).",
          code: `typedef union {
    struct {
        unsigned char bit0 : 1;
        unsigned char bit1 : 1;
        unsigned char bit2 : 1;
        unsigned char reserved : 5;
    } bits;
    unsigned char raw_byte;
} StatusRegister;

void configure_register() {
    StatusRegister reg;
    reg.raw_byte = 0x00;
    reg.bits.bit2 = 1; // Sets bit 2 (0x04)
    printf("Raw: 0x%02X\\n", reg.raw_byte); // 0x04
}`,
          note: "Unions are perfect for converting serialized arrays into structured data templates without copying."
        },
        {
          title: "Self-Referential Structs & Circular Ring Buffers",
          text: "A struct is self-referential if it contains a pointer targeting another instance of itself. This forms the foundation of dynamic data structures like Linked Lists.\nIn firmware development, circular ring buffers (FIFO) are implemented using fixed arrays and pointers/indexes to store data streamed from hardware interrupts without dynamic memory allocation.",
          code: `#define BUFFER_SIZE 8
typedef struct {
    int data[BUFFER_SIZE];
    int head;
    int tail;
} RingBuffer;

void enqueue(RingBuffer *cb, int val) {
    cb->data[cb->head] = val;
    cb->head = (cb->head + 1) % BUFFER_SIZE;
}`,
          note: "Ring buffers require no memory relocation, making them extremely fast and predictable for real-time interrupt handling."
        }
      ]
    },
    {
      order: 5,
      title: "Hardware I/O & Advanced Execution",
      description: "Direct memory masking, registers, interrupts, function pointers, and designing callback mechanisms.",
      topics: [
        {
          title: "Bitwise Register Masking & Manipulation",
          text: "Hardware registers control peripheral states. Programming them requires manipulating specific bits without altering surrounding configurations. We use bitwise operators for this:\n- Set Bits: Use bitwise OR (`|=`).\n- Clear Bits: Use bitwise AND with a negated mask (`&= ~`).\n- Toggle Bits: Use bitwise XOR (`^=`).",
          code: `#define LED_PIN 3 // Pin 3 (0x08)
volatile unsigned char PORTA = 0x00;

void set_led() {
    PORTA |= (1 << LED_PIN); // Set Pin 3 to high
}

void clear_led() {
    PORTA &= ~(1 << LED_PIN); // Clear Pin 3 to low
}

void toggle_led() {
    PORTA ^= (1 << LED_PIN); // Toggle Pin 3 status
}`,
          note: "Always use logical shifts like '1 << pin' rather than decimal numbers to make your code clear and self-documenting."
        },
        {
          title: "Function Pointers & Dynamic Execution",
          text: "A function pointer stores the memory address of a compiled block of code. This allows C code to execute dynamically, enabling advanced architectures like object-oriented polymorph structures, state handler tables, and event-driven Callback systems.",
          code: `#include <stdio.h>

void execute_task(int code) {
    printf("Executing task code %d\\n", code);
}

int main() {
    // Declare function pointer
    void (*task_runner)(int);
    
    // Assign address
    task_runner = &execute_task;
    
    // Execute dynamically
    task_runner(105);
    return 0;
}`,
          note: "Function pointers are critical for writing clean drivers where hardware callbacks are assigned at runtime."
        },
        {
          title: "Interrupt Service Routines (ISRs) in Systems Programming",
          text: "An Interrupt Service Routine (ISR) is an asynchronous callback executed by the CPU hardware when a physical interrupt event occurs (such as an external button press or a hardware timer tick). Writing C inside ISRs requires strict rules:\n- Keep it short: Never perform blocking operations or I/O.\n- Use `volatile` for all shared variables.\n- Never allocate memory inside an ISR.",
          code: `volatile int isr_flag = 0;

// Hardware ISR handler representation
void External_Interrupt_Handler() {
    isr_flag = 1; // Signal main loop to process
}`,
          note: "If an ISR is blocked or slow, it can lead to watchdog resets or system hangs."
        }
      ]
    }
  ],
  "C++": [
    {
      order: 1,
      title: "Object-Oriented Encapsulation & RAII",
      description: "Transitioning from procedural C to modern C++ objects, lifetime mechanics, and deterministic resources.",
      topics: [
        {
          title: "Classes, Encapsulation & Constructor Mechanics",
          text: "C++ extends the concept of structures into Classes, bundling variables (fields) together with their corresponding routines (methods). Encapsulation is enforced using Access Specifiers:\n- `private`: Accessible only within the class itself.\n- `public`: Open to external interactions.\n- Constructor Initializer Lists: Direct initialization of member fields, which avoids the overhead of default constructor calls followed by assignments.",
          code: `class Motor {
private:
    int speed;
public:
    // Using initializer lists
    Motor(int s) : speed(s) {}
    
    void setSpeed(int s) {
        if (s >= 0 && s <= 100) speed = s;
    }
};`,
          note: "Use constructor initializer lists whenever possible to optimize memory initialization."
        },
        {
          title: "RAII (Resource Acquisition Is Initialization)",
          text: "RAII is C++'s core idiom for deterministic resource management. It links the life cycle of system resources (allocated heap, mutex locks, file handlers, sockets) to the lifetime of local stack objects. The constructor acquires the resource, and the destructor automatically releases it when the object goes out of scope.",
          code: `#include <iostream>

class HardwareRelay {
public:
    HardwareRelay() { std::cout << "Relay Power On\\n"; }
    ~HardwareRelay() { std::cout << "Relay Power Off (Auto Clean)\\n"; }
};

void run_process() {
    HardwareRelay relay; // Allocated on Stack
    // Process details...
} // Destructor runs automatically here, reclaiming resource`,
          note: "RAII guarantees resource safety, even if an exception or early return occurs inside the function."
        },
        {
          title: "Embedded Smart Pointers & Memory Safety",
          text: "C++11 introduced Smart Pointers to eliminate manual allocations and leaks:\n- `std::unique_ptr<T>`: Represents exclusive ownership. Automatically deallocates the heap object when it goes out of scope. Has zero overhead.\n- `std::shared_ptr<T>`: Uses atomic reference counting. The resource is destroyed when the last reference is released.",
          code: `#include <memory>

void process_device() {
    std::unique_ptr<int> ptr = std::make_unique<int>(100);
    // Automatically freed - no leak possible!
}`,
          note: "Avoid shared_ptr in real-time embedded systems due to the non-deterministic overhead of atomic reference counting."
        }
      ]
    },
    {
      order: 2,
      title: "Inheritance & Polymorphism",
      description: "Class relationships, virtual execution, performance costs of vtables, and compile-time optimizations.",
      topics: [
        {
          title: "Inheritance Models & Virtual Destructors",
          text: "Inheritance allows a derived class to inherit fields and methods from a base class. When managing polymorphic objects via base pointers, the base class **must** declare a `virtual` destructor. Otherwise, deleting a derived object via a base pointer causes undefined behavior, leaking derived members.",
          code: `class Base {
public:
    virtual ~Base() { // Must be virtual!
        // Base cleanup
    }
};

class Derived : public Base {
    int* buffer;
public:
    Derived() { buffer = new int[10]; }
    ~Derived() override { delete[] buffer; }
};`,
          note: "Always mark your base class destructors virtual if the class contains virtual functions."
        },
        {
          title: "Virtual Functions & The VTable Mechanism",
          text: "Dynamic polymorphism allows calling the correct derived method at runtime via a base pointer. This is driven by virtual functions. Behind the scenes, the compiler inserts:\n1. Virtual Table (VTable): A static array of function pointers created for each class that has virtual functions.\n2. Virtual Pointer (vptr): A hidden pointer added to every object instance, pointing to the class's VTable.",
          code: `class Sensor {
public:
    virtual int read() = 0; // Pure virtual
};

class TemperatureSensor : public Sensor {
public:
    int read() override { return 25; }
};`,
          note: "Dynamic dispatch adds a small pointer-dereference overhead. For real-time loops, consider static polymorphism (templates)."
        },
        {
          title: "Static vs Dynamic Polymorphism",
          text: "Polymorphism can be handled at runtime (dynamic) or compile-time (static):\n- Dynamic Polymorphism: Flexible but has vtable dereference overhead and prevents inlining.\n- Static Polymorphism: Achieved using Templates and the CRTP (Curiously Recurring Template Pattern). It resolves calls at compile time, eliminating vtable overhead and enabling compiler optimizations (inlining).",
          code: `template <typename Derived>
class BaseSensor {
public:
    void read() {
        static_cast<Derived*>(this)->readImpl();
    }
};

class GpsSensor : public BaseSensor<GpsSensor> {
public:
    void readImpl() { /* Read hardware */ }
};`,
          note: "Static polymorphism is highly favored in resource-constrained embedded systems where execution speed is critical."
        }
      ]
    },
    {
      order: 3,
      title: "Templates & Generic Programming",
      description: "Building flexible, reusable, and type-safe systems using template patterns and static assertions.",
      topics: [
        {
          title: "Function & Class Templates",
          text: "C++ Templates enable generic programming, allowing you to write a single blueprint that works with any data type. The compiler generates specialized classes or functions for each type used. This provides type safety without the performance cost of runtime type checks.",
          code: `// Generic array wrapper
template <typename T, size_t Size>
class StaticArray {
private:
    T data[Size];
public:
    size_t getSize() const { return Size; }
    T& operator[](size_t index) { return data[index]; }
};

StaticArray<int, 10> intBuffer;
StaticArray<float, 5> floatBuffer;`,
          note: "Templates shift the performance cost to compile time, although extensive use can increase executable size (code bloat)."
        },
        {
          title: "Type Traits & Static Assertions",
          text: "Type traits (`<type_traits>`) let your code query type properties at compile time.\nCombined with `static_assert`, they allow you to enforce compile-time constraints on template arguments, failing the build immediately with a custom message if invalid types are passed.",
          code: `#include <type_traits>

template <typename T>
void send_packet(T data) {
    // Enforce that T must be a simple, plain-old-data type
    static_assert(std::is_trivially_copyable<T>::value, 
                  "Error: send_packet only supports trivially copyable types!");
}`,
          note: "Use static_assert to catch logical or configuration errors at compile time rather than during runtime debugging."
        },
        {
          title: "Template Metaprogramming & Optimization",
          text: "Template Metaprogramming (TMP) performs computations at compile time rather than runtime. This allows you to generate look-up tables, configure register constants, or validate mathematical formulas at compile-time, saving valuable CPU cycles in the final binary.",
          code: `template <int N>
struct Factorial {
    static constexpr int value = N * Factorial<N - 1>::value;
};

template <>
struct Factorial<0> {
    static constexpr int value = 1;
};

int main() {
    int x = Factorial<5>::value; // Evaluates to 120 at compile time!
    return 0;
}`,
          note: "Modern C++ heavily prefers constexpr functions over complex TMP templates for better readability."
        }
      ]
    },
    {
      order: 4,
      title: "Embedded Memory Control",
      description: "Managing memory allocation deterministically, placement new, and building resource pools.",
      topics: [
        {
          title: "Custom Placement New",
          text: "In standard C++, `new` allocates memory from the dynamic heap and initializes the object. In embedded systems, the dynamic heap is often banned due to fragmentation and non-deterministic allocation times.\nPlacement New overrides this behavior, allowing you to construct an object in a pre-allocated, specific memory address (such as a memory-mapped hardware register or a pre-allocated stack buffer).",
          code: `#include <new>

char custom_buffer[100]; // Pre-allocated stack buffer

class Controller {
public:
    Controller() {}
};

void run() {
    // Construct Controller directly inside custom_buffer:
    Controller* c = new (custom_buffer) Controller();
    
    // Explicit destructor call required when using placement new
    c->~Controller();
}`,
          note: "Always call the destructor explicitly when using placement new, as 'delete' cannot be used."
        },
        {
          title: "Fixed-Size Memory Pools",
          text: "Memory Pools offer a deterministic alternative to the dynamic heap. They allocate a fixed block of memory and divide it into a set number of uniform slots. Allocation and deallocation operate in O(1) constant time, eliminating the risk of memory leaks and heap fragmentation.",
          code: `template <typename T, size_t Capacity>
class MemoryPool {
private:
    union Slot {
        T element;
        Slot* nextFree;
    };
    Slot pool[Capacity];
    Slot* head;
public:
    MemoryPool() {
        for (size_t i = 0; i < Capacity - 1; ++i) {
            pool[i].nextFree = &pool[i + 1];
        }
        pool[Capacity - 1].nextFree = nullptr;
        head = &pool[0];
    }
};`,
          note: "Memory pools are ideal for handling high-frequency packet structures in real-time communication systems."
        },
        {
          title: "Stack vs Heap Allocations in Safety-Critical C++",
          text: "In mission-critical firmware (like automotive or aerospace), dynamic heap allocation (`new`, `malloc`) is strictly banned after system initialization. This ensures that the system's execution is deterministic and memory allocation cannot fail at runtime. Instead, objects are allocated on the Stack or as global/static variables.",
          code: `// Safety-critical class allocation
class Autopilot {
public:
    void update() {}
};

// Global allocation - resolved at load time
Autopilot mainAutopilot; 

int main() {
    // Stack allocation - safe and deterministic
    Autopilot localAutopilot;
    localAutopilot.update();
    return 0;
}`,
          note: "Always pre-allocate resources during boot-up to ensure deterministic performance during active runs."
        }
      ]
    },
    {
      order: 5,
      title: "Modern C++ for Hardware",
      description: "Using C++17/20 features for compile-time execution, safe memory views, and register access.",
      topics: [
        {
          title: "Constexpr & Consteval Execution",
          text: "The `constexpr` keyword specifies that a function or variable can be evaluated at compile time. This allows the compiler to pre-compute math tables, hash keys, or constant values, embedding the results directly in the read-only flash memory and saving CPU cycles at runtime.\n- `consteval` (C++20): Enforces that the function **must** be evaluated at compile time, throwing a compiler error if it cannot be.",
          code: `constexpr int calculate_baud_rate(int clock, int baud) {
    return (clock / (16 * baud)) - 1;
}

// Pre-computed at compile-time:
constexpr int register_setting = calculate_baud_rate(16000000, 9600000);`,
          note: "Use constexpr functions to write readable, flexible code that has zero performance cost at runtime."
        },
        {
          title: "std::span & std::string_view for Zero-Overhead Memory Views",
          text: "C++17 introduced `std::string_view` and C++20 introduced `std::span`:\n- `std::string_view`: Represents a non-owning read-only view of a contiguous character sequence (like a string literal or char array). It prevents copying and memory allocations.\n- `std::span`: A non-owning view over a contiguous sequence of elements (like an array or vector). It bundles a pointer and a size, offering safe, bounds-checked access with zero overhead.",
          code: `#include <span>
#include <iostream>

void process_raw_bytes(std::span<const uint8_t> buffer) {
    for (uint8_t byte : buffer) {
        // Read safely without copying
    }
}

int main() {
    uint8_t data[5] = {0x01, 0x02, 0x03, 0x04, 0x05};
    process_raw_bytes(data); // Automatic span creation
    return 0;
}`,
          note: "Use std::span to pass buffers safely in systems programming without passing raw pointers and size arguments separately."
        },
        {
          title: "Direct Register Access via std::byte & Structured Bindings",
          text: "Modern C++ replaces raw character pointers for binary data with `std::byte`, which provides type-safe access to raw memory without arithmetic conversion. Structured bindings (C++17) allow you to unpack tuples, arrays, or structures directly into individual variables, making systems code clean and readable.",
          code: `#include <cstddef>

struct SensorData {
    float x;
    float y;
};

void process_readings(SensorData data) {
    // Unpack fields immediately:
    auto [posX, posY] = data;
}`,
          note: "Structured bindings allow you to decompose registers or sensor packets into clean local variables instantly."
        }
      ]
    }
  ],
  "IoT": [
    {
      order: 1,
      title: "IoT Microcontroller Baselines & ESP32",
      description: "ESP32 dual-core Xtensa architecture, pin maps, and hardware registers.",
      topics: [
        {
          title: "ESP32 Core Architecture & Memory Maps",
          text: "The ESP32 is a low-cost, low-power system-on-a-chip (SoC) designed for IoT. It features a dual-core 32-bit Tensilica Xtensa LX6 microprocessor running up to 240MHz. It has 520KB of internal SRAM and connects to external flash memory via QSPI. It integrates Wi-Fi (802.11 b/g/n) and Bluetooth (v4.2 BR/EDR and BLE) basebands, making it a powerful platform for connected devices.",
          code: `// Check clock speed on ESP32 (ESP-IDF)
#include "esp_system.h"
#include "esp_log.h"

void app_main() {
    rtc_cpu_freq_config_t config;
    rtc_clk_cpu_freq_get_config(&config);
    printf("CPU Speed: %d MHz\\n", config.freq_mhz);
}`,
          note: "The ESP32 features two cores: Protocol CPU (PRO_CPU) handles Wi-Fi/BT, while Application CPU (APP_CPU) runs user code."
        },
        {
          title: "GPIO Port Interfacing & Internal Resistors",
          text: "GPIO (General Purpose Input/Output) pins interface the microcontroller with physical hardware. To prevent floating states (where the pin reads random noise when not connected), we use pull-up or pull-down resistors:\n- Pull-up: Connects the pin to VCC (Logic High) by default.\n- Pull-down: Connects the pin to Ground (Logic Low) by default.",
          code: `#include "driver/gpio.h"

#define BUTTON_GPIO GPIO_NUM_4

void configure_button() {
    gpio_config_t io_conf;
    io_conf.intr_type = GPIO_INTR_NEGEDGE; // Trigger on press
    io_conf.mode = GPIO_MODE_INPUT;
    io_conf.pin_bit_mask = (1ULL << BUTTON_GPIO);
    io_conf.pull_down_en = GPIO_PULLDOWN_DISABLE;
    io_conf.pull_up_en = GPIO_PULLUP_ENABLE; // Pull up to VCC
    gpio_config(&io_conf);
}`,
          note: "Enable internal pull-up/pull-down resistors on input pins to avoid needing external resistors on your breadboard."
        },
        {
          title: "Hardware Timer Scheduling vs Delay Blocks",
          text: "In real-time systems, using blocking delays (like `delay()` or `vTaskDelay()`) is inefficient as it stalls CPU execution. Instead, we configure hardware timers or software alarms (like ESP32 High-Resolution Timers) to schedule code execution asynchronously at precise intervals.",
          code: `#include "esp_timer.h"

void timer_callback(void* arg) {
    // Non-blocking task executed periodically
}

void setup_timer() {
    const esp_timer_create_args_t timer_args = {
        .callback = &timer_callback,
        .name = "periodic_timer"
    };
    esp_timer_handle_t periodic_timer;
    esp_timer_create(&timer_args, &periodic_timer);
    esp_timer_start_periodic(periodic_timer, 1000000); // 1 Second (in microseconds)
}`,
          note: "Never use delay blocks inside mission-critical loops or asynchronous systems."
        }
      ]
    },
    {
      order: 2,
      title: "Sensory Interfacing & ADC/DAC Signals",
      description: "Interfacing with analog signals, digital sensors, and converting raw hardware data.",
      topics: [
        {
          title: "Analog vs Digital Signals & ADC Resolutions",
          text: "Analog signals are continuous and represent real-world values like temperature or light level. An ADC (Analog-to-Digital Converter) converts this continuous voltage into a digital number. Resolution determines precision:\n- 10-bit ADC: Converts input voltage (e.g., 0-3.3V) into a range of 0 to 1023.\n- 12-bit ADC (ESP32): Converts voltage into a range of 0 to 4095. This higher resolution allows you to detect much smaller changes in voltage.",
          code: `#include "esp_adc_cal.h"
#include "driver/adc.h"

void read_analog_sensor() {
    adc1_config_width(ADC_WIDTH_BIT_12); // 12-bit resolution
    adc1_config_channel_atten(ADC1_CHANNEL_0, ADC_ATTEN_DB_11);
    int raw_val = adc1_get_raw(ADC1_CHANNEL_0); // Read raw 0-4095 value
}`,
          note: "The ESP32 ADC is non-linear at very low (<0.1V) and high (>3.1V) voltages, requiring calibration for high-precision sensor measurements."
        },
        {
          title: "Interfacing DHT11/22 Temperature & Humidity Sensors",
          text: "The DHT22 is a common digital environmental sensor. It uses a proprietary 1-wire serial protocol to stream 40 bits of data (16 bits relative humidity, 16 bits temperature, 8 bits checksum) down to the microcontroller over a single wire. It requires precise timing logic to read correctly.",
          code: `// Conceptual bit parsing for DHT 1-Wire Protocol
int read_dht_bit() {
    // Wait for pin transition
    while(gpio_get_level(DHT_GPIO) == 0);
    // Measure pulse length to determine if it is a '0' or a '1'
    // If pulse is > 50us, it's a 1, otherwise it is a 0.
    return (pulse_length > 50) ? 1 : 0;
}`,
          note: "DHT sensors require a pull-up resistor on the data line to maintain signal integrity."
        },
        {
          title: "Ultrasonic Sensor Ranging and Pulse Width Processing",
          text: "The HC-SR04 ultrasonic sensor measures distance by sending a high-frequency sound wave and measuring the time it takes to bounce back. The microcontroller sends a 10-microsecond trigger pulse to the transmitter pin, and then measures the duration of the high pulse on the Echo pin using input capture.",
          code: `#define TRIGGER_GPIO GPIO_NUM_5
#define ECHO_GPIO GPIO_NUM_18

float get_distance_cm() {
    // Send 10us trigger pulse
    gpio_set_level(TRIGGER_GPIO, 1);
    esp_rom_delay_us(10);
    gpio_set_level(TRIGGER_GPIO, 0);

    // Measure echo pulse duration (simplified)
    while(gpio_get_level(ECHO_GPIO) == 0);
    int64_t start = esp_timer_get_time();
    while(gpio_get_level(ECHO_GPIO) == 1);
    int64_t end = esp_timer_get_time();

    int64_t duration = end - start; // in microseconds
    return (duration * 0.0343) / 2.0; // speed of sound calculation
}`,
          note: "Ensure correct voltage dividers are used if interfacing 5V ultrasonic sensors with 3.3V GPIOs."
        }
      ]
    },
    {
      order: 3,
      title: "Serial Communication Protocols",
      description: "Inter-chip communication protocols: I2C, SPI, and UART architecture and configuration.",
      topics: [
        {
          title: "I2C Protocol (Inter-Integrated Circuit)",
          text: "I2C is a synchronous, multi-master, multi-slave, packet-switched serial bus. It uses only two bidirectional lines:\n- SDA (Serial Data Line)\n- SCL (Serial Clock Line)\nDevices are addressed using unique 7-bit or 10-bit identifiers, allowing up to 127 devices on the same two wires. Pull-up resistors are required on both lines.",
          code: `#include "driver/i2c.h"

void init_i2c_master() {
    i2c_config_t conf;
    conf.mode = I2C_MODE_MASTER;
    conf.sda_io_num = GPIO_NUM_21;
    conf.scl_io_num = GPIO_NUM_22;
    conf.sda_pullup_en = GPIO_PULLUP_ENABLE;
    conf.scl_pullup_en = GPIO_PULLUP_ENABLE;
    conf.master.clk_speed = 100000; // 100kHz standard mode
    i2c_param_config(I2C_NUM_0, &conf);
    i2c_driver_install(I2C_NUM_0, conf.mode, 0, 0, 0);
}`,
          note: "I2C is perfect for low-speed peripherals (like OLED screens or RTC clocks) over short distances."
        },
        {
          title: "SPI Protocol (Serial Peripheral Interface)",
          text: "SPI is a high-speed, synchronous, full-duplex serial bus. It uses a master-slave architecture with four dedicated lines:\n- MOSI (Master Out Slave In): Transmits data from Master to Slave.\n- MISO (Master In Slave Out): Transmits data from Slave to Master.\n- SCLK (Serial Clock): Generated by the Master to synchronize data transfer.\n- CS / SS (Chip Select): Decides which slave device is currently active. SPI can achieve data rates exceeding 50MHz.",
          code: `#include "driver/spi_master.h"

void init_spi_device() {
    spi_bus_config_t buscfg = {
        .mosi_io_num = GPIO_NUM_23,
        .miso_io_num = GPIO_NUM_19,
        .sclk_io_num = GPIO_NUM_18,
        .quadwp_io_num = -1,
        .quadhd_io_num = -1
    };
    spi_bus_initialize(VSPI_HOST, &buscfg, 1);
}`,
          note: "SPI is the preferred protocol for high-bandwidth applications, such as SD cards and LCD displays."
        },
        {
          title: "UART Protocol (Universal Asynchronous Receiver-Transmitter)",
          text: "UART is a dedicated asynchronous serial protocol. It does not use a clock signal to synchronize data. Instead, it relies on pre-configured baud rates (transmission speeds, e.g., 9600 or 115200) and start/stop bits packaged around each byte of data. It uses two lines: RX (Receive) and TX (Transmit).",
          code: `#include "driver/uart.h"

void init_uart() {
    uart_config_t uart_config = {
        .baud_rate = 115200,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE
    };
    uart_param_config(UART_NUM_1, &uart_config);
    uart_driver_install(UART_NUM_1, 2048, 0, 0, nullptr, 0);
}`,
          note: "Always verify that both connecting devices share the exact same baud rate and parity settings."
        }
      ]
    },
    {
      order: 4,
      title: "Wireless Networks & BLE Connectivity",
      description: "Connecting to Wi-Fi networks, Bluetooth Low Energy (BLE) architecture, and GATT databases.",
      topics: [
        {
          title: "Wi-Fi Modes: Station (STA) vs Access Point (AP)",
          text: "Microcontrollers with built-in Wi-Fi can operate in two primary modes:\n- Station (STA) Mode: The microcontroller acts as a client, connecting to an existing wireless network (like a home router) to access the internet.\n- Access Point (AP) Mode: The microcontroller acts as a hotspot, hosting its own wireless network so other devices (like smartphones) can connect directly to it.",
          code: `#include "esp_wifi.h"

void init_wifi_station() {
    esp_netif_init();
    esp_event_loop_create_default();
    esp_netif_create_default_wifi_sta();
    
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    esp_wifi_init(&cfg);
    
    wifi_config_t wifi_config = {
        .sta = {
            .ssid = "MY_HOME_WIFI",
            .password = "SECRET_PASSWORD"
        },
    };
    esp_wifi_set_mode(WIFI_MODE_STA);
    esp_wifi_set_config(WIFI_IF_STA, &wifi_config);
    esp_wifi_start();
}`,
          note: "Use AP mode for initial setup and device configuration, then transition to STA mode for normal operation."
        },
        {
          title: "Bluetooth Low Energy (BLE) GATT Architecture",
          text: "BLE is designed for ultra-low power consumption. It uses a structured hierarchy called GATT (Generic Attribute Profile):\n- Profile: Defines the overall device type.\n- Service: A collection of related data points (e.g., Environmental Sensor Service).\n- Characteristic: A single data value with properties (Read, Write, Notify) and a unique 128-bit UUID.",
          code: `// Conceptual BLE Characteristic Declaration
#include "esp_gatts_api.h"

#define HEART_RATE_SERVICE_UUID 0x180D
#define HEART_RATE_MEASUREMENT_UUID 0x2A37

// GATT database configurations
esp_gatts_attr_db_t gatt_db[10];`,
          note: "BLE is perfect for battery-powered devices that only need to send small updates occasionally."
        },
        {
          title: "BLE Advertising and Beacon Modes",
          text: "Before a connection is established, BLE devices operate in Advertising Mode. The peripheral broadcasts short packets containing its name, capabilities, and services to any listening devices. Beacon systems (like iBeacon) utilize this advertising payload to broadcast static location data without establishing an active connection.",
          code: `#include "esp_gap_ble_api.h"

void start_ble_advertising() {
    esp_ble_adv_params_t adv_params = {
        .adv_int_min = 0x20, // 20ms interval
        .adv_int_max = 0x40, // 40ms interval
        .adv_type = ADV_TYPE_IND,
        .own_addr_type = BLE_ADDR_TYPE_PUBLIC,
        .channel_map = ADV_CHNL_ALL,
        .adv_filter_policy = ADV_FILTER_ALLOW_SCAN_ANY_CON_ANY
    };
    esp_ble_gap_start_advertising(&adv_params);
}`,
          note: "Optimize advertising intervals to balance fast connection discovery against standby battery life."
        }
      ]
    },
    {
      order: 5,
      title: "IoT Application Protocols",
      description: "MQTT publish/subscribe, REST APIs, JSON serialization, and building local web servers.",
      topics: [
        {
          title: "MQTT Protocol (Message Queuing Telemetry Transport)",
          text: "MQTT is a lightweight, publish-subscribe network protocol designed for resource-constrained devices and high-latency networks. It relies on a central Broker to distribute messages. Devices publish messages to specific 'Topics' (e.g., `home/livingroom/temp`), and other devices subscribe to those topics to receive updates. It features three Quality of Service (QoS) levels to ensure delivery.",
          code: `#include "mqtt_client.h"

void start_mqtt_client() {
    esp_mqtt_client_config_t mqtt_cfg = {
        .broker.address.uri = "mqtt://broker.hivemq.com"
    };
    esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_start(client);
    
    // Publish message
    esp_mqtt_client_publish(client, "home/temp", "24.5", 0, 1, 0);
}`,
          note: "MQTT's low overhead and asynchronous publish/subscribe architecture make it the standard for IoT telemetry."
        },
        {
          title: "HTTP REST API Communications & JSON Serialization",
          text: "IoT devices often communicate with web servers using standard HTTP REST APIs. Data is typically serialized into JSON format for easy parsing. We use client libraries to send GET and POST requests, and serialization engines (like `cJSON`) to format raw sensor data.",
          code: `#include "esp_http_client.h"
#include "cJSON.h"

void post_sensor_data(float temp) {
    cJSON *root = cJSON_CreateObject();
    cJSON_AddNumberToObject(root, "temperature", temp);
    char *post_data = cJSON_Print(root);

    esp_http_client_config_t config = {
        .url = "https://api.myiotportal.com/data",
        .method = HTTP_METHOD_POST
    };
    esp_http_client_handle_t client = esp_http_client_init(&config);
    esp_http_client_set_post_field(client, post_data, strlen(post_data));
    esp_http_client_perform(client);
    
    cJSON_Delete(root);
    free(post_data);
}`,
          note: "Always free cJSON printed strings to avoid severe memory leaks on microcontrollers."
        },
        {
          title: "Hosting a Local Web Server on ESP32",
          text: "The ESP32 is powerful enough to run its own web server directly. This allows users to configure the device, toggle pins, or view sensor readings in real-time by loading its IP address in a web browser.",
          code: `#include "esp_http_server.h"

esp_err_t get_handler(httpd_req_t *req) {
    const char* resp_str = "<h1>ESP32 Control Dashboard</h1>";
    httpd_resp_send(req, resp_str, HTTPD_RESP_USE_SIZEOF);
    return ESP_OK;
}

void start_web_server() {
    httpd_handle_t server = NULL;
    httpd_config_t config = HTTPD_DEFAULT_CONFIG();
    
    if (httpd_start(&server, &config) == ESP_OK) {
        httpd_uri_t get_uri = {
            .uri = "/",
            .method = HTTP_GET,
            .handler = get_handler
        };
        httpd_register_uri_handler(server, &get_uri);
    }
}`,
          note: "Secure local web servers by requiring authentication credentials for administrative routes."
        }
      ]
    }
  ],
  "Embedded": [
    {
      order: 1,
      title: "Bare-Metal Microcontroller Architecture",
      description: "ARM Cortex-M core details, system buses, startup routines, and linker maps.",
      topics: [
        {
          title: "ARM Cortex-M System Architecture",
          text: "The ARM Cortex-M is a 32-bit RISC processor core designed for energy-efficient, real-time embedded applications. It uses a Harvard architecture (separate instruction and data buses) and features a 3-stage pipeline. Key components include the NVIC (Nested Vectored Interrupt Controller), SysTick timer, and memory-mapped I/O, allowing registers and RAM to share the same 4GB address space.",
          code: `// Directly accessing register using memory-mapped I/O
#define PERIPHERAL_BASE  0x40000000
#define GPIOPORTA_DATA   *(volatile unsigned int *)(PERIPHERAL_BASE + 0x12000)

void set_porta_high() {
    GPIOPORTA_DATA = 0xFF; // Write directly to memory address
}`,
          note: "ARM Cortex-M microcontrollers support unaligned memory access but experience execution penalties when doing so."
        },
        {
          title: "Startup Assembly Codes, Boot Vector & Reset Handler",
          text: "When power is applied to the microcontroller, the CPU performs a hardware boot sequence. It reads the Vector Table located at memory address `0x00000000`:\n1. It loads the Initial Stack Pointer (MSP) value from the first entry.\n2. It loads the Reset Vector from the second entry, which points to the `Reset_Handler`.\nThe Reset Handler is an assembly function that initializes variables, clears BSS memory, sets up the system clock, and then jumps to the `main()` function.",
          code: `/* Conceptual Assembly Startup Code */
.section .isr_vector
.word _estack          /* Top of Stack */
.word Reset_Handler    /* Reset Handler address */

.text
Reset_Handler:
    ldr r0, =_estack
    mov sp, r0         /* Load stack pointer */
    bl SystemInit      /* Setup hardware clocks */
    bl main            /* Jump to main function */
    b .`,
          note: "The startup file handles the transition from hardware assembly initialization to execution in C."
        },
        {
          title: "Understanding Linker Scripts & Memory Sections",
          text: "A Linker Script (`.ld`) is a configuration file that guides the linker on how to arrange compile-time object sections (like `.text`, `.data`, `.bss`) within the target device's physical memories (Flash and SRAM). It defines the start address and size of memory blocks, ensuring variables and code are mapped to correct physical locations.",
          code: `/* Simple Linker Script Section Definition */
MEMORY {
    FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 512K
    RAM   (rwx): ORIGIN = 0x20000000, LENGTH = 128K
}

SECTIONS {
    .text : {
        KEEP(*(.isr_vector))
        *(.text*)
    } > FLASH
}`,
          note: "Incorrect linker scripts can place variables in non-existent memory addresses, causing immediate hard faults."
        }
      ]
    },
    {
      order: 2,
      title: "Interrupts & Exception Handling",
      description: "Analyzing Nested Vectored Interrupt Controller (NVIC), prioritizing routines, and context recovery.",
      topics: [
        {
          title: "NVIC Architecture & Priority Rules",
          text: "The Nested Vectored Interrupt Controller (NVIC) manages all hardware interrupts and system exceptions in ARM Cortex-M processors. It supports extremely low-latency interrupt handling using: \n- Prioritization: Each interrupt has an assignable priority value. Lower numbers represent higher priority.\n- Preemption: A higher priority interrupt will preempt (interrupt) a lower priority ISR currently executing, nesting the executions.",
          code: `#include "core_cm4.h"

void configure_ext_interrupt() {
    NVIC_SetPriority(EXTI0_IRQn, 2); // Set priority level 2
    NVIC_EnableIRQ(EXTI0_IRQn);     // Enable EXTI0 interrupt
}`,
          note: "Preemption allows time-sensitive tasks to interrupt general processing, ensuring real-time responsiveness."
        },
        {
          title: "Writing Low-Latency ISRs & Context Saving",
          text: "When a hardware interrupt occurs, the CPU automatically saves key registers (R0-R3, R12, LR, PC, xPSR) onto the active stack (Hardware Context Saving). The CPU then jumps to the ISR address. To write high-performance ISRs:\n- Keep processing minimal: Perform quick register flags updates or queue writes and exit.\n- Never call blocking or slow functions (such as `printf` or dynamic allocations) inside an ISR.",
          code: `volatile int button_pressed_flag = 0;

void EXTI0_IRQHandler() {
    if (EXTI->PR & (1 << 0)) { // Check flag
        EXTI->PR |= (1 << 0);  // Clear pending flag
        button_pressed_flag = 1; // Signal background thread
    }
}`,
          note: "Failing to clear the interrupt flag inside the ISR causes the CPU to enter an infinite interrupt loop."
        },
        {
          title: "Understanding HardFault Exceptions & Debugging",
          text: "A HardFault is a severe system exception triggered by the CPU when an unrecoverable fault occurs. Common causes include:\n1. Dereferencing a NULL or invalid pointer.\n2. Attempting to execute undefined assembly instructions.\n3. Dividing by zero or accessing unaligned memory structures (when configured to trap).\nDebugging requires inspecting stack registers to find the instruction address (`PC`) where the crash occurred.",
          code: `void crash_test() {
    int *ptr = NULL;
    *ptr = 123; // Causes an immediate HardFault Exception!
}`,
          note: "Implement custom HardFault handlers to log system registers to flash for field diagnosis."
        }
      ]
    },
    {
      order: 3,
      title: "Timer Peripherals & PWM Signals",
      description: "Configuring hardware timers, SysTick, input capture, and pulse width modulations.",
      topics: [
        {
          title: "Hardware Timer Configurations & SysTick",
          text: "Hardware Timers are peripheral counters that increment at a frequency scaled down from the system clock using a Prescaler. When the counter reaches its target Auto-Reload Value, it triggers an overflow interrupt. The System Tick (SysTick) is a simple 24-bit down counter built directly into the ARM core, widely used for driving OS time slices or generating millisecond delays.",
          code: `volatile uint32_t ms_ticks = 0;

void SysTick_Handler() {
    ms_ticks++; // Increment tick counter every millisecond
}

void delay_ms(uint32_t delay) {
    uint32_t start = ms_ticks;
    while ((ms_ticks - start) < delay);
}`,
          note: "Always structure delay metrics around hardware timers or SysTick rather than empty CPU loops, which drift under compiler optimizations."
        },
        {
          title: "Pulse Width Modulation (PWM) Generation",
          text: "PWM (Pulse Width Modulation) is a technique for simulating analog voltages using digital outputs. By toggling a pin high and low at a high frequency, we generate a square wave. The Ratio of the high-time to the total period is called the Duty Cycle, which controls the average power delivered to devices like LEDs or DC motors.",
          code: `// Setting PWM Duty Cycle on STM32 Timer Registers
void set_pwm_duty(uint16_t duty) {
    TIM1->CCR1 = duty; // Update compare register to adjust high pulse length
}`,
          note: "Higher PWM frequencies reduce audible coil noise in connected motors and eliminate flickering in LEDs."
        },
        {
          title: "Timer Input Capture for Pulse-Width Measurement",
          text: "Input Capture mode allows a hardware timer to latch its current counter value into a capture register the instant a transition (rising or falling edge) is detected on a GPIO pin. This provides highly precise, microsecond-accurate measurements of external pulse widths and frequencies.",
          code: `// Interrupt triggered on signal transition
void TIM2_IRQHandler() {
    if (TIM2->SR & TIM_SR_CC1IF) {
        uint32_t timestamp = TIM2->CCR1; // Read captured timer counter
        // Process elapsed time between edges
    }
}`,
          note: "Input capture is ideal for reading high-frequency remote control signals or encoder inputs."
        }
      ]
    },
    {
      order: 4,
      title: "Real-Time Operating Systems (RTOS) Core",
      description: "Comparing super-loops to multithreaded RTOS schedulers, task priority mechanics, and FreeRTOS control.",
      topics: [
        {
          title: "RTOS vs Super-Loop Architectures",
          text: "Simple microcontrollers run on a 'Super-loop' architecture—an infinite `while(1)` loop executing tasks sequentially. If one task blocks, the entire system freezes. A Real-Time Operating System (RTOS) introduces multithreading. It uses a Scheduler to swap active execution threads (Tasks) dynamically based on priority, ensuring time-critical operations meet their deadlines.",
          code: `// Super-loop (Blocking):
while(1) {
    read_sensors(); // Blocks other tasks
    update_leds();
}

// RTOS Task (Non-blocking):
void SensorTask(void* pvParameters) {
    while(1) {
        read_sensors();
        vTaskDelay(pdMS_TO_TICKS(100)); // Relinquishes CPU control
    }
}`,
          note: "Use an RTOS for complex applications where multiple systems must operate concurrently with deterministic response times."
        },
        {
          title: "FreeRTOS Scheduler & Task Priorities",
          text: "FreeRTOS is a popular, open-source real-time kernel. Its preemptive scheduler runs the highest priority task currently in the 'Ready' state. If a lower priority task is executing and a higher priority task becomes ready, the scheduler immediately performs a Context Switch, pausing the active task and running the high-priority one.",
          code: `#include "FreeRTOS.h"
#include "task.h"

void Task1(void *param) {
    while(1) { /* Low priority work */ }
}

void Task2(void *param) {
    while(1) { /* High priority work */ }
}

void init_scheduler() {
    xTaskCreate(Task1, "Task1", 128, nullptr, 1, nullptr); // Priority 1
    xTaskCreate(Task2, "Task2", 128, nullptr, 3, nullptr); // Priority 3 (Higher)
    vTaskStartScheduler();
}`,
          note: "Tasks with identical priorities share CPU time dynamically using Round-Robin time slicing."
        },
        {
          title: "Task Control Blocks & Memory Allocation",
          text: "Every task in FreeRTOS has an associated Task Control Block (TCB) that stores its execution state, including its stack pointer, priority, and task ID. When a task is created, FreeRTOS allocates a dedicated stack from its heap to store the task's local variables during context switches.",
          code: `// Get current stack watermark to check for overflows:
UBaseType_t stackWatermark = uxTaskGetStackHighWaterMark(nullptr);`,
          note: "Set task stack sizes carefully; under-allocating stack space leads to silent, hard-to-debug memory corruptions."
        }
      ]
    },
    {
      order: 5,
      title: "RTOS Inter-Task Communication",
      description: "Managing shared resources using semaphores, mutexes, event queues, and resolving priority inversions.",
      topics: [
        {
          title: "Mutexes & Semaphores for Synchronization",
          text: "Multiple tasks accessing the same hardware peripheral or shared variable can cause data corruption. We use synchronization primitives to protect these critical sections:\n- Binary Semaphore: A simple flag used to signal events between tasks.\n- Mutex (Mutual Exclusion): A lock used to protect shared resources. Unlike semaphores, a mutex features Priority Inheritance, preventing priority inversion.",
          code: `#include "semphr.h"

SemaphoreHandle_t xMutex;

void access_shared_resource() {
    if (xSemaphoreTake(xMutex, portMAX_DELAY) == pdTRUE) {
        // Safe to read/write to peripheral
        xSemaphoreGive(xMutex); // Unlock
    }
}`,
          note: "Always release mutexes as quickly as possible to avoid blocking other time-sensitive tasks."
        },
        {
          title: "RTOS Priority Inversion & Inheritance",
          text: "Priority Inversion is a hazardous scenario where a high-priority task is blocked waiting for a resource held by a low-priority task, while a medium-priority task preempts the low-priority task, keeping the high-priority task blocked indefinitely. FreeRTOS solves this using Priority Inheritance, where the low-priority task's priority is temporarily boosted to match the high-priority task's level until it releases the resource.",
          code: `// Use Mutexes instead of raw Binary Semaphores for resource protection
// to automatically enable FreeRTOS priority inheritance protocols.
xMutex = xSemaphoreCreateMutex();`,
          note: "Unresolved priority inversions can cause system lockups or watchdogs to trip in production."
        },
        {
          title: "Message Queues for Inter-Task Data Pipelines",
          text: "Message Queues allow tasks to pass structured data packets to each other safely without sharing memory space directly. The queue handles thread safety internally, blocking the receiving task automatically when the queue is empty, and waking it when new data is posted.",
          code: `QueueHandle_t xDataQueue;

void TxTask(void *param) {
    int value = 42;
    xQueueSend(xDataQueue, &value, portMAX_DELAY); // Post value
}

void RxTask(void *param) {
    int received_val;
    if (xQueueReceive(xDataQueue, &received_val, portMAX_DELAY) == pdTRUE) {
        // Process received value safely
    }
}`,
          note: "Queues are thread-safe and provide clean, modular data pathways between hardware handlers and user applications."
        }
      ]
    }
  ]
};

export const quizzes: Record<string, CourseQuiz> = {
  "C": {
    questions: [
      {
        id: 1,
        text: "Which phase of the C compilation pipeline expands macros and processes #include directives?",
        options: ["Compilation", "Linking", "Preprocessing", "Assembly"],
        correctAnswer: "Preprocessing"
      },
      {
        id: 2,
        text: "What memory segment is primarily used for uninitialized global and static variables, cleared to zero before execution starts?",
        options: ["BSS", "Text", "Stack", "Data"],
        correctAnswer: "BSS"
      },
      {
        id: 3,
        text: "In a Little-Endian system, if an unsigned integer 0xABCDEF01 is stored in memory, what byte is located at the lowest memory address?",
        options: ["0xAB", "0xCD", "0xEF", "0x01"],
        correctAnswer: "0x01"
      },
      {
        id: 4,
        text: "What is the primary benefit of 'Short-Circuit Evaluation' in conditional statements?",
        options: ["It accelerates compilation speed", "It skips evaluation of subsequent expressions once the outcome is determined", "It reduces binary footprint", "It automatically handles pointer conversions"],
        correctAnswer: "It skips evaluation of subsequent expressions once the outcome is determined"
      },
      {
        id: 5,
        text: "Which of the following structures is highly recommended for implementing control logic inside embedded firmware?",
        options: ["Nested Recursive Functions", "Finite State Machines via Enums and Switch-Case", "Spaghetti Jump Labels", "Dynamic Thread Pools"],
        correctAnswer: "Finite State Machines via Enums and Switch-Case"
      },
      {
        id: 6,
        text: "What is a safe and accepted systems programming idiom for utilizing 'goto' statements?",
        options: ["Creating infinite main loops", "Unified error handling and resource cleanup at the bottom of a function", "Simulating dynamic exceptions in inner functions", "Bypassing recursive function stack frames"],
        correctAnswer: "Unified error handling and resource cleanup at the bottom of a function"
      },
      {
        id: 7,
        text: "If 'int *ptr' points to an address 0x1000 on a 32-bit machine (where sizeof(int) is 4), what address does 'ptr + 2' point to?",
        options: ["0x1002", "0x1004", "0x1008", "0x1016"],
        correctAnswer: "0x1008"
      },
      {
        id: 8,
        text: "What does 'Array Decay' mean when passing an array into a function?",
        options: ["The array's data is copied to the heap", "The array degrades into a pointer targeting its first element, losing size boundaries", "The array is cleared to zero", "The compiler issues an optimization warning"],
        correctAnswer: "The array degrades into a pointer targeting its first element, losing size boundaries"
      },
      {
        id: 9,
        text: "Which keyword forces the compiler to reload a variable's value from RAM every time, preventing caching optimization?",
        options: ["static", "extern", "volatile", "register"],
        correctAnswer: "volatile"
      },
      {
        id: 10,
        text: "What is the primary purpose of applying '__attribute__((__packed__))' to a structure in C?",
        options: ["To speed up CPU read cycles", "To prevent the compiler from inserting padding bytes between members", "To allocate the structure directly on the heap", "To encrypt structural field contents"],
        correctAnswer: "To prevent the compiler from inserting padding bytes between members"
      },
      {
        id: 11,
        text: "Which bitwise expression correctly toggle bit 4 of a register 'PORTA' without altering other bits?",
        options: ["PORTA |= (1 << 4)", "PORTA &= ~(1 << 4)", "PORTA ^= (1 << 4)", "PORTA = (1 << 4)"],
        correctAnswer: "PORTA ^= (1 << 4)"
      },
      {
        id: 12,
        text: "What is the physical size of a union containing a char (1 byte), a short (2 bytes), and an int (4 bytes)?",
        options: ["7 bytes", "4 bytes", "2 bytes", "1 byte"],
        correctAnswer: "4 bytes"
      },
      {
        id: 13,
        text: "Which dynamic data structure is highly optimized for streaming hardware interrupts without requiring heap allocations?",
        options: ["Dynamic Linked Lists", "Vector Arrays", "Circular Ring Buffers", "Binary Search Trees"],
        correctAnswer: "Circular Ring Buffers"
      },
      {
        id: 14,
        text: "What does a 'function pointer' store?",
        options: ["The return value of a function", "The entry address of the compiled function in memory", "The stack pointer of the active function frame", "The parameter list metadata"],
        correctAnswer: "The entry address of the compiled function in memory"
      },
      {
        id: 15,
        text: "Why should blocking routines (like delays or heavy I/O) never be placed inside an Interrupt Service Routine (ISR)?",
        options: ["They consume stack memory", "They trigger compiler syntax errors", "They can lead to watchdog timeouts and halt other system operations", "They alter variables in BSS segment"],
        correctAnswer: "They can lead to watchdog timeouts and halt other system operations"
      },
      {
        id: 16,
        text: "What happens if a dynamic memory allocation via 'malloc()' fails?",
        options: ["The program restarts automatically", "The CPU enters a HardFault loop", "It returns NULL", "The memory size defaults to 1 byte"],
        correctAnswer: "It returns NULL"
      },
      {
        id: 17,
        text: "Which memory segment is dedicated to storing local variables and return addresses for active function frames?",
        options: ["Heap", "BSS", "Text", "Stack"],
        correctAnswer: "Stack"
      },
      {
        id: 18,
        text: "What does the expression 'PORTA &= ~(1 << 2)' do?",
        options: ["Sets bit 2 to high", "Clears bit 2 to low", "Toggles bit 2", "Reads bit 2 value"],
        correctAnswer: "Clears bit 2 to low"
      },
      {
        id: 19,
        text: "Which header is required for using standard dynamic memory allocation functions like malloc() and free()?",
        options: ["<stdio.h>", "<stdlib.h>", "<string.h>", "<stdint.h>"],
        correctAnswer: "<stdlib.h>"
      },
      {
        id: 20,
        text: "Which of the following is true about static global variables in C?",
        options: ["They are accessible from any file in the project", "Their scope is restricted to the file they are declared in", "They are stored in the Stack segment", "They are re-allocated every time a function completes"],
        correctAnswer: "Their scope is restricted to the file they are declared in"
      }
    ]
  },
  "C++": {
    questions: [
      {
        id: 21,
        text: "What is the key benefit of utilizing constructor initializer lists over standard field assignments?",
        options: ["It enforces private accessibility", "It directly initializes members, avoiding redundant default construction", "It allocates objects on the heap", "It disables exceptions"],
        correctAnswer: "It directly initializes members, avoiding redundant default construction"
      },
      {
        id: 22,
        text: "How does the Resource Acquisition Is Initialization (RAII) pattern manage resources deterministically?",
        options: ["By running garbage collection at intervals", "By binding resource lifetime to local object lifetimes, auto-clearing in the destructor", "By moving all allocations to global BSS", "By compiling pointers to static addresses"],
        correctAnswer: "By binding resource lifetime to local object lifetimes, auto-clearing in the destructor"
      },
      {
        id: 23,
        text: "Which smart pointer enforces single, exclusive ownership of a heap resource with zero runtime overhead?",
        options: ["std::shared_ptr", "std::weak_ptr", "std::unique_ptr", "std::auto_ptr"],
        correctAnswer: "std::unique_ptr"
      },
      {
        id: 24,
        text: "Why must a base class destructor be declared virtual when using dynamic polymorphism?",
        options: ["To prevent derived methods from accessing private fields", "To ensure the derived class destructor is called when deleting via a base pointer", "To force compile-time template specializing", "To allocate vpointers in read-only flash"],
        correctAnswer: "To ensure the derived class destructor is called when deleting via a base pointer"
      },
      {
        id: 25,
        text: "What hidden variable does the compiler add to each object instance to drive dynamic virtual dispatch?",
        options: ["vtable", "vptr", "constexpr", "std::span"],
        correctAnswer: "vptr"
      },
      {
        id: 26,
        text: "What pattern is commonly used to implement static polymorphism at compile time, avoiding vtable overhead?",
        options: ["RAII Pattern", "Builder Pattern", "Curiously Recurring Template Pattern (CRTP)", "Observer Pattern"],
        correctAnswer: "Curiously Recurring Template Pattern (CRTP)"
      },
      {
        id: 27,
        text: "When are templates evaluated and generated in C++?",
        options: ["At runtime, dynamically", "During preprocessing", "At compile-time, by generating specialized classes/functions", "By the linker script"],
        correctAnswer: "At compile-time, by generating specialized classes/functions"
      },
      {
        id: 28,
        text: "Which compile-time feature allows you to validate type properties and halt compilation with custom error messages if preconditions fail?",
        options: ["dynamic_cast", "static_assert and Type Traits", "reinterpret_cast", "volatile bounds"],
        correctAnswer: "static_assert and Type Traits"
      },
      {
        id: 29,
        text: "What is the primary advantage of utilizing 'constexpr' functions?",
        options: ["They bypass object alignment rules", "They enable dynamic memory garbage collection", "They allow pre-computing constant values at compile time, saving CPU runtime cycles", "They compile code directly to assembly files"],
        correctAnswer: "They allow pre-computing constant values at compile time, saving CPU runtime cycles"
      },
      {
        id: 30,
        text: "Which C++20 feature provides a non-owning, bounds-checked view of a contiguous memory sequence with zero overhead?",
        options: ["std::span", "std::string_view", "std::vector", "std::unique_ptr"],
        correctAnswer: "std::span"
      },
      {
        id: 31,
        text: "What C++ mechanism allows you to construct an object at a specific, pre-allocated memory address?",
        options: ["Dynamic new", "Placement new", "Malloc allocation", "Static declaration"],
        correctAnswer: "Placement new"
      },
      {
        id: 32,
        text: "Which of the following is true about Fixed-Size Memory Pools in embedded C++?",
        options: ["They operate in linear O(N) allocation time", "They guarantee O(1) allocation/deallocation and eliminate heap fragmentation", "They require active garbage collection", "They can only be used with primitive data types"],
        correctAnswer: "They guarantee O(1) allocation/deallocation and eliminate heap fragmentation"
      },
      {
        id: 33,
        text: "Why is standard dynamic heap allocation ('new') often banned in safety-critical embedded systems?",
        options: ["Because it has a larger binary size", "Because allocation times are non-deterministic and it risks heap fragmentation", "Because it does not support structures", "Because it forces little-endian conversions"],
        correctAnswer: "Because allocation times are non-deterministic and it risks heap fragmentation"
      },
      {
        id: 34,
        text: "Which modern C++ type represents raw memory bytes without performing implicit arithmetic conversions?",
        options: ["unsigned char", "std::byte", "uint8_t", "char"],
        correctAnswer: "std::byte"
      },
      {
        id: 35,
        text: "What C++17 feature allows you to unpack structures or tuples directly into individual local variables?",
        options: ["Structured Bindings", "Lambda Expressions", "Template specialization", "Move Semantics"],
        correctAnswer: "Structured Bindings"
      },
      {
        id: 36,
        text: "What does the C++20 'consteval' keyword enforce?",
        options: ["The function must be evaluated at compile-time", "The variable cannot be changed after initialization", "The function executes in a separate thread", "The function has a static scope"],
        correctAnswer: "The function must be evaluated at compile-time"
      },
      {
        id: 37,
        text: "How do you explicitly invoke the destructor of an object constructed via placement new?",
        options: ["delete obj", "obj->~ClassName()", "free(obj)", "delete[] obj"],
        correctAnswer: "obj->~ClassName()"
      },
      {
        id: 38,
        text: "What C++17 feature provides a non-owning read-only view of a contiguous string sequence, avoiding copy allocations?",
        options: ["std::string", "std::string_view", "const char*", "std::span"],
        correctAnswer: "std::string_view"
      },
      {
        id: 39,
        text: "In C++, which keyword is used to explicitly override a base virtual function, letting the compiler verify the signature matches?",
        options: ["virtual", "override", "final", "explicit"],
        correctAnswer: "override"
      },
      {
        id: 40,
        text: "Which class access specifier restricts access exclusively to members of the class and derived classes?",
        options: ["private", "public", "protected", "friend"],
        correctAnswer: "protected"
      }
    ]
  },
  "IoT": {
    questions: [
      {
        id: 41,
        text: "What microcontroller core architecture does the ESP32 utilize?",
        options: ["ARM Cortex-M4", "Xtensa 32-bit Dual-Core LX6", "AVR 8-bit RISC", "MIPS microAptiv"],
        correctAnswer: "Xtensa 32-bit Dual-Core LX6"
      },
      {
        id: 42,
        text: "Which hardware mechanism is used to keep an input GPIO pin in a stable logic HIGH state when no signal is applied?",
        options: ["Internal Pull-Down Resistor", "Internal Pull-Up Resistor", "Decoupling Capacitor", "Schottky Diode"],
        correctAnswer: "Internal Pull-Up Resistor"
      },
      {
        id: 43,
        text: "Why are non-blocking hardware timers preferred over delay functions in real-time IoT firmware?",
        options: ["They consume less flash space", "They keep the CPU from stalling, allowing other tasks to run during intervals", "They force 12-bit ADC calibrations", "They establish Wi-Fi STA connections"],
        correctAnswer: "They keep the CPU from stalling, allowing other tasks to run during intervals"
      },
      {
        id: 44,
        text: "What is the digital conversion range of a 12-bit Analog-to-Digital Converter (ADC) like the one in the ESP32?",
        options: ["0 to 255", "0 to 1023", "0 to 4095", "0 to 65535"],
        correctAnswer: "0 to 4095"
      },
      {
        id: 45,
        text: "How does a DHT22 environmental sensor transmit relative humidity and temperature data to a microcontroller?",
        options: ["Over I2C bus addressing", "Through a proprietary 1-wire serial pulse-width protocol", "Via analog voltage scaling", "Using full-duplex SPI channels"],
        correctAnswer: "Through a proprietary 1-wire serial pulse-width protocol"
      },
      {
        id: 46,
        text: "In distance measurements using an ultrasonic sensor (HC-SR04), what does the sensor measure directly?",
        options: ["The change in frequency of sound waves", "The amplitude of returned sound", "The time-of-flight of sound waves from trigger to echo return", "The absolute resistance of air"],
        correctAnswer: "The time-of-flight of sound waves from trigger to echo return"
      },
      {
        id: 47,
        text: "Which lines are used by the I2C serial communication protocol?",
        options: ["MOSI, MISO, SCLK, CS", "SDA and SCL", "RX and TX", "VCC and GND"],
        correctAnswer: "SDA and SCL"
      },
      {
        id: 48,
        text: "What does the Chip Select (CS) line do in an SPI communication network?",
        options: ["Synchronizes data transmission speed", "Selects the active slave device for communication", "Monitors the voltage of the master", "Transmits serial data packets"],
        correctAnswer: "Selects the active slave device for communication"
      },
      {
        id: 49,
        text: "What type of serial protocol is UART?",
        options: ["Synchronous full-duplex", "Asynchronous serial with pre-configured baud rates", "Multi-master synchronous", "Synchronous half-duplex"],
        correctAnswer: "Asynchronous serial with pre-configured baud rates"
      },
      {
        id: 50,
        text: "What is the main difference between Wi-Fi Station (STA) and Access Point (AP) modes?",
        options: ["STA mode acts as a client to a router; AP mode hosts its own network for clients", "AP mode consumes 90% less power", "STA mode is only used for local databases", "AP mode disables TCP/IP protocols"],
        correctAnswer: "STA mode acts as a client to a router; AP mode hosts its own network for clients"
      },
      {
        id: 51,
        text: "What are the primary structural building blocks of the Bluetooth Low Energy (BLE) GATT database?",
        options: ["Topics and Payloads", "Services and Characteristics", "Master and Slave addressing", "Baud Rates and Parity"],
        correctAnswer: "Services and Characteristics"
      },
      {
        id: 52,
        text: "What BLE mode is used to broadcast packets to any listening devices without establishing an active connection?",
        options: ["GATT Client Mode", "Advertising Mode", "SPP Connection Mode", "SPI slave selection"],
        correctAnswer: "Advertising Mode"
      },
      {
        id: 53,
        text: "Which structural design pattern does the MQTT protocol use to distribute messages?",
        options: ["Client-Server", "Publish-Subscribe", "Peer-to-Peer", "Master-Slave"],
        correctAnswer: "Publish-Subscribe"
      },
      {
        id: 54,
        text: "What is the role of a Broker in an MQTT IoT network?",
        options: ["It measures the temperature sensor readings", "It acts as a central hub, receiving published messages and routing them to subscribers", "It programs the ESP32 registers", "It hosts local web files in flash memory"],
        correctAnswer: "It acts as a central hub, receiving published messages and routing them to subscribers"
      },
      {
        id: 55,
        text: "Which serialization format is most commonly used in HTTP REST API payloads for IoT communications?",
        options: ["Raw binary strings", "XML markup", "JSON", "Hexadecimal arrays"],
        correctAnswer: "JSON"
      },
      {
        id: 56,
        text: "Why is cJSON_Delete() called after finishing with a cJSON object in C?",
        options: ["To save the changes to the flash memory", "To release allocated heap memory and prevent memory leaks", "To restart the ESP32 wifi driver", "To clear the ESP32 NVIC registers"],
        correctAnswer: "To release allocated heap memory and prevent memory leaks"
      },
      {
        id: 57,
        text: "What does hosting a local Web Server on an ESP32 allow you to do?",
        options: ["It expands the flash memory of the device", "It allows users to configure the device and view sensor readings via a web browser", "It speeds up CPU execution cycles", "It establishes the Bluetooth beacon"],
        correctAnswer: "It allows users to configure the device and view sensor readings via a web browser"
      },
      {
        id: 58,
        text: "Which of the following describes I2C pull-up resistor requirements?",
        options: ["Pull-up resistors are optional for I2C", "Both SDA and SCL lines require pull-up resistors to maintain signal integrity", "Only the master device requires internal pull-downs", "Only the SDA line requires a pull-down resistor"],
        correctAnswer: "Both SDA and SCL lines require pull-up resistors to maintain signal integrity"
      },
      {
        id: 59,
        text: "What is the standard data rate of I2C in Standard-mode?",
        options: ["9600 bps", "100 kbps", "400 kbps", "10 Mbps"],
        correctAnswer: "100 kbps"
      },
      {
        id: 60,
        text: "What does the MQTT 'QoS' level represent?",
        options: ["Quality of Signal strength", "Quality of Service, defining the reliability of message delivery", "Queue of Storage space", "Quantity of Sensors connected"],
        correctAnswer: "Quality of Service, defining the reliability of message delivery"
      }
    ]
  },
  "Embedded": {
    questions: [
      {
        id: 61,
        text: "Which architecture separates instruction and data buses, allowing the CPU to read instructions and data concurrently?",
        options: ["Von Neumann Architecture", "Harvard Architecture", "Accumulator-based Architecture", "Stack-based Machine"],
        correctAnswer: "Harvard Architecture"
      },
      {
        id: 62,
        text: "In an ARM Cortex-M system, what is loaded from address 0x00000000 during the hardware boot sequence?",
        options: ["The Reset Vector address", "The Initial Stack Pointer (MSP) value", "The main() entry instruction", "The vector table length configuration"],
        correctAnswer: "The Initial Stack Pointer (MSP) value"
      },
      {
        id: 63,
        text: "Which compiler-generated object sections are allocated directly to read-only Flash memory?",
        options: [".data and .bss", ".text and .rodata", ".stack and .heap", ".isr_vector only"],
        correctAnswer: ".text and .rodata"
      },
      {
        id: 64,
        text: "What is the primary function of the Nested Vectored Interrupt Controller (NVIC) in ARM Cortex-M microcontrollers?",
        options: ["To manage heap block allocations", "To configure GPIO pin states", "To manage and prioritize all system interrupts and exceptions", "To drive the PWM counter compare rates"],
        correctAnswer: "To manage and prioritize all system interrupts and exceptions"
      },
      {
        id: 65,
        text: "What is 'Interrupt Preemption'?",
        options: ["A low-priority interrupt halts EXTI operations", "A higher priority interrupt preempts and pauses an actively running lower priority ISR", "The compiler removes unused ISR functions", "The NVIC maps peripheral addresses"],
        correctAnswer: "A higher priority interrupt preempts and pauses an actively running lower priority ISR"
      },
      {
        id: 66,
        text: "What does the CPU automatically do during Hardware Context Saving when an interrupt is triggered?",
        options: ["It clears all BSS segment variables", "It pushes core registers R0-R3, R12, LR, PC, and xPSR onto the active stack", "It resets the watchdog timer", "It switches the memory maps to SRAM"],
        correctAnswer: "It pushes core registers R0-R3, R12, LR, PC, and xPSR onto the active stack"
      },
      {
        id: 67,
        text: "What is a common cause of a 'HardFault Exception' on ARM Cortex-M platforms?",
        options: ["Accessing static variables in a function", "Setting a GPIO pin to HIGH", "Dereferencing a NULL or invalid memory pointer", "Configuring the SysTick timer interrupt"],
        correctAnswer: "Dereferencing a NULL or invalid memory pointer"
      },
      {
        id: 68,
        text: "What is the SysTick timer?",
        options: ["An external high-frequency oscillator", "A simple 24-bit down counter built directly into the ARM core, widely used for OS time slices", "A motor control PWM generator peripheral", "An analog conversion comparator pin"],
        correctAnswer: "A simple 24-bit down counter built directly into the ARM core, widely used for OS time slices"
      },
      {
        id: 69,
        text: "How does a microcontroller change the average power delivered by a PWM signal?",
        options: ["By increasing the input voltage of the chip", "By adjusting the Duty Cycle (the ratio of high-time to period)", "By disabling the hardware counter overflow", "By routing the signal through the NVIC"],
        correctAnswer: "By adjusting the Duty Cycle (the ratio of high-time to period)"
      },
      {
        id: 70,
        text: "Which timer mode latches the timer's counter value into a register the instant a signal transition is detected on a GPIO?",
        options: ["Input Capture Mode", "Output Compare Mode", "PWM Generation Mode", "One-Pulse Mode"],
        correctAnswer: "Input Capture Mode"
      },
      {
        id: 71,
        text: "What is the key advantage of a preemptive RTOS scheduler over a standard Super-loop architecture?",
        options: ["It eliminates the need for flash memory", "It ensures high-priority tasks run immediately, providing deterministic real-time execution", "It automatically handles floating-point math on any core", "It prevents BSS variables from initializing to zero"],
        correctAnswer: "It ensures high-priority tasks run immediately, providing deterministic real-time execution"
      },
      {
        id: 72,
        text: "In FreeRTOS, how do tasks yield CPU control to other tasks of equal or lower priority?",
        options: ["By calling a blocking delay (like vTaskDelay)", "By entering an infinite empty while loop", "By raising an interrupt preemption flag", "By deleting the Task Control Block (TCB)"],
        correctAnswer: "By calling a blocking delay (like vTaskDelay)"
      },
      {
        id: 73,
        text: "What happens if a FreeRTOS task's stack size is under-allocated?",
        options: ["The task executes at twice the speed", "It causes a Stack Overflow, which corrupts neighboring memory and crashes the system", "It automatically borrows memory from the Text segment", "The compiler throws a syntax error"],
        correctAnswer: "It causes a Stack Overflow, which corrupts neighboring memory and crashes the system"
      },
      {
        id: 74,
        text: "What synchronization primitive features Priority Inheritance to prevent priority inversion?",
        options: ["Binary Semaphore", "Counting Semaphore", "Mutex", "Event Group"],
        correctAnswer: "Mutex"
      },
      {
        id: 75,
        text: "What is 'Priority Inversion'?",
        options: ["When a low-priority task is boosted permanently to admin privileges", "When a medium-priority task preempts a low-priority task holding a resource needed by a high-priority task, blocking the high-priority task indefinitely", "When the scheduler executes tasks in alphabetical order", "When interrupts are disabled globally"],
        correctAnswer: "When a medium-priority task preempts a low-priority task holding a resource needed by a high-priority task, blocking the high-priority task indefinitely"
      },
      {
        id: 76,
        text: "Which FreeRTOS primitive is ideal for passing structured data packets between tasks in a thread-safe manner?",
        options: ["Binary Semaphores", "Message Queues", "Global volatile structures", "Event flags"],
        correctAnswer: "Message Queues"
      },
      {
        id: 77,
        text: "What does the 'Auto-Reload Value' in a hardware timer determine?",
        options: ["The prescaler division factor", "The counter value at which the timer overflows and resets", "The duty cycle of the PWM output", "The address of the vector table entry"],
        correctAnswer: "The counter value at which the timer overflows and resets"
      },
      {
        id: 78,
        text: "In a Linker Script, what does 'ORIGIN' represent for a memory region?",
        options: ["The date the script was created", "The starting physical address of that memory block", "The length of the memory segment in kilobytes", "The priority level in the NVIC controller"],
        correctAnswer: "The starting physical address of that memory block"
      },
      {
        id: 79,
        text: "Which register stores the instruction address currently being executed by the CPU?",
        options: ["Link Register (LR)", "Program Counter (PC)", "Stack Pointer (SP)", "Status Register (xPSR)"],
        correctAnswer: "Program Counter (PC)"
      },
      {
        id: 80,
        text: "In FreeRTOS, what does a Task Control Block (TCB) store?",
        options: ["The compiled machine instructions of the task", "The task's context, state, priority, and stack pointer during context switches", "The peripheral memory maps", "The interrupt handler vector address"],
        correctAnswer: "The task's context, state, priority, and stack pointer during context switches"
      }
    ]
  }
};