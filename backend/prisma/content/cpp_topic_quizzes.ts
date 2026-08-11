/**
 * C++ course — per-topic quizzes.
 *
 * Keyed by the EXACT topic titles used in `cpp.ts`. Each topic has 4
 * questions (4 options, exactly 1 correct). These back the frontend
 * topic-lock flow: a topic is only unlockable once the previous topic's
 * quiz is passed, and the topic quiz is fetched by topic id.
 *
 * IMPORTANT: question texts must NOT duplicate the chapter-quiz texts in
 * cpp.ts, because the week quiz endpoint returns every question in a
 * module (topic + chapter) together.
 */

export interface CppTopicQuiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const cppTopicQuizzes: Record<string, CppTopicQuiz[]> = {
  // ── W1 · Introduction to C++ & Compilation Model ─────────────────────────
  "Why C++ Still Powers the World": [
    { text: "C++ is described as giving 'near-zero runtime overhead'. What does that mean for a tight loop over a std::vector?", options: ["It runs in a virtual machine", "It compiles to machine code as efficient as a hand-written C loop", "It always copies the vector", "It requires a garbage collector"], correctAnswer: "It compiles to machine code as efficient as a hand-written C loop" },
    { text: "Why does C++ suit both cloud servers and 8-bit microcontrollers?", options: ["It is the only language both support", "It offers hardware-level control AND high-level abstractions in one language", "It is interpreted on both", "It runs only on Linux"], correctAnswer: "It offers hardware-level control AND high-level abstractions in one language" },
    { text: "The 'layered' nature of C++ means…", options: ["you must learn everything before writing any code", "a beginner can start with C-style code and add classes/templates/modern features as they grow", "there is only one style of code", "C++11 removed all old features"], correctAnswer: "a beginner can start with C-style code and add classes/templates/modern features as they grow" },
    { text: "Modern C++ (C++11 onward) added which of these?", options: ["gotos and macros", "auto, smart pointers, lambdas, and move semantics", "only syntax colouring", "a mandatory GUI"], correctAnswer: "auto, smart pointers, lambdas, and move semantics" },
  ],
  "The Compilation Pipeline": [
    { text: "Which command stops after producing assembly from a translation unit?", options: ["g++ -E", "g++ -S", "g++ -c", "g++ -o"], correctAnswer: "g++ -S" },
    { text: "Why can a single #include expand into thousands of lines?", options: ["Headers contain the whole standard library binary", "The preprocessor pastes the entire header file text into the translation unit", "The linker duplicates code", "The compiler decompresses it"], correctAnswer: "The preprocessor pastes the entire header file text into the translation unit" },
    { text: "Where does an 'undefined reference to main' error originate?", options: ["Preprocessing", "Compilation", "Assembly", "Linking"], correctAnswer: "Linking" },
    { text: "Which flag set would you use to enable common warnings AND select a C++ standard?", options: ["-O2 -pipe", "-Wall -Wextra -std=c++17", "-g -ggdb", "-fPIC -shared"], correctAnswer: "-Wall -Wextra -std=c++17" },
  ],
  "Your First C++ Program & main()": [
    { text: "What does the operating system receive when main() returns 3?", options: ["The number 3 as a success indicator", "A non-zero exit status signalling an error", "Nothing at all", "A crash"], correctAnswer: "A non-zero exit status signalling an error" },
    { text: "Why is `void main()` wrong?", options: ["It is only wrong on Windows", "Standard C++ requires main to return int", "It is deprecated but legal", "It needs a parameter"], correctAnswer: "Standard C++ requires main to return int" },
    { text: "When you see a compile error pointing one line BELOW the real mistake, it is usually…", options: ["a linker error", "a missing semicolon on the line above", "a warning", "an OS error"], correctAnswer: "a missing semicolon on the line above" },
    { text: "The form `int main(int argc, char* argv[])` exists to…", options: ["receive command-line arguments", "make main virtual", "enable graphics", "return two values"], correctAnswer: "receive command-line arguments" },
  ],
  "Setting Up a C++ Toolchain": [
    { text: "Why use CMake instead of typing g++ commands for a real project?", options: ["CMake compiles faster than g++", "It tracks which files changed and rebuilds only what is needed", "It is required by the compiler", "It writes the code for you"], correctAnswer: "It tracks which files changed and rebuilds only what is needed" },
    { text: "Which command builds a project configured with CMake?", options: ["cmake --build build", "g++ -build", "make install", "cmake --run"], correctAnswer: "cmake --build build" },
    { text: "When a compiler prints a wall of errors, the professional move is…", options: ["fix the last error first", "start at the FIRST error — it is usually the root cause", "ignore all of them", "reinstall the compiler"], correctAnswer: "start at the FIRST error — it is usually the root cause" },
    { text: "Why enable warnings (-Wall -Wextra) always?", options: ["They make code run faster", "They are free bug reports from the compiler", "They are required by the standard", "They silence errors"], correctAnswer: "They are free bug reports from the compiler" },
  ],

  // ── W2 · C++ vs C, Namespaces, Basic Syntax ──────────────────────────────
  "C++ vs C — What Changed": [
    { text: "Which C++ feature directly replaces the manual FILE* fopen/fclose dance?", options: ["std::ifstream whose destructor closes the file", "malloc and free", "the goto statement", "#include <stdio.h>"], correctAnswer: "std::ifstream whose destructor closes the file" },
    { text: "Function overloading lets you…", options: ["have several functions with the same name chosen by argument types", "return multiple values", "use C code in C++", "skip the return statement"], correctAnswer: "have several functions with the same name chosen by argument types" },
    { text: "A reference differs from a pointer because…", options: ["it cannot be null and must be bound at creation", "it uses more memory", "it can be rebound", "it is always const"], correctAnswer: "it cannot be null and must be bound at creation" },
    { text: "The mental shift from C to C++ is…", options: ["thinking in procedures and structs", "thinking in objects that manage their own state and cleanup", "writing only macros", "using global variables"], correctAnswer: "thinking in objects that manage their own state and cleanup" },
  ],
  "Namespaces & the std Namespace": [
    { text: "Two libraries both define a class Logger. Namespaces solve the collision by…", options: ["renaming both", "grouping them as network::Logger and console::Logger", "deleting one", "making them virtual"], correctAnswer: "grouping them as network::Logger and console::Logger" },
    { text: "`namespace fs = std::filesystem;` creates…", options: ["a nested namespace", "a namespace alias", "a class", "a macro"], correctAnswer: "a namespace alias" },
    { text: "Why is `using namespace std;` dangerous in a header?", options: ["It slows compilation", "It leaks std names into every file that includes the header, causing ambiguity", "It is illegal", "It adds a semicolon"], correctAnswer: "It leaks std names into every file that includes the header, causing ambiguity" },
    { text: "`namespace a::b { }` is…", options: ["C++98 syntax", "nested namespace declaration available since C++17", "a compile error in all standards", "a namespace alias"], correctAnswer: "nested namespace declaration available since C++17" },
  ],
  "Variables, Declarations & Initialization Styles": [
    { text: "What does `double d{3}; int i{d};` produce?", options: ["i = 3", "A compile error — brace init refuses the narrowing from double to int", "i = 3.0", "Undefined behaviour"], correctAnswer: "A compile error — brace init refuses the narrowing from double to int" },
    { text: "A declaration versus a definition: `extern int counter;` is…", options: ["a definition that allocates storage", "a declaration that introduces the name without storage", "an error", "a macro"], correctAnswer: "a declaration that introduces the name without storage" },
    { text: "Name shadowing is dangerous because…", options: ["it is illegal", "an inner variable can hide an outer one, producing confusing 'why is this 0?' bugs", "it doubles memory", "it only affects macros"], correctAnswer: "an inner variable can hide an outer one, producing confusing 'why is this 0?' bugs" },
    { text: "Which flag turns shadowing into a visible warning?", options: ["-O2", "-Wshadow", "-std=c++20", "-lshadow"], correctAnswer: "-Wshadow" },
  ],
  "Comments, Formatting & Basic Syntax Rules": [
    { text: "Which is a documentation comment that Doxygen can render?", options: ["// TODO", "/** computes the checksum */", "/* TODO */", "# comment"], correctAnswer: "/** computes the checksum */" },
    { text: "Why must braces follow every if even for one statement?", options: ["They are required by the grammar", "An unbraced else can silently bind to the wrong if", "They speed up the compiler", "They are deprecated"], correctAnswer: "An unbraced else can silently bind to the wrong if" },
    { text: "Which statement about `#define` is correct?", options: ["It ends with a semicolon", "It is a preprocessor directive that does not end with a semicolon", "It is a runtime instruction", "It is C++17 syntax"], correctAnswer: "It is a preprocessor directive that does not end with a semicolon" },
    { text: "An uninitialised local variable…", options: ["holds whatever garbage is on the stack, a classic heisenbug source", "is always zero", "crashes instantly", "cannot be read"], correctAnswer: "holds whatever garbage is on the stack, a classic heisenbug source" },
  ],

  // ── W3 · Variables, Data Types, Const/Constexpr ──────────────────────────
  "Fundamental Data Types & Sizes": [
    { text: "Why is `sizeof(char) <= sizeof(int)` guaranteed by the standard?", options: ["The standard mandates exact sizes", "It defines minimum sizes: char ≤ short ≤ int ≤ long ≤ long long", "Compilers enforce it", "It is not guaranteed"], correctAnswer: "It defines minimum sizes: char ≤ short ≤ int ≤ long ≤ long long" },
    { text: "What is the danger of `size_t` and `int` meeting in one expression?", options: ["Both are always 64-bit", "The int may be implicitly converted to a huge unsigned value", "The expression cannot compile", "size_t becomes signed"], correctAnswer: "The int may be implicitly converted to a huge unsigned value" },
    { text: "Why prefer uint8_t over char for raw byte values?", options: ["It is smaller", "It guarantees exactly 8 bits and unsigned semantics", "It is a string", "It is faster"], correctAnswer: "It guarantees exactly 8 bits and unsigned semantics" },
    { text: "The signedness of plain `char` is…", options: ["always signed", "always unsigned", "implementation-defined — use signed char/unsigned char when it matters", "always 16-bit"], correctAnswer: "implementation-defined — use signed char/unsigned char when it matters" },
  ],
  "Integer & Floating-Point Types": [
    { text: "Signed overflow like INT_MAX + 1 is…", options: ["guaranteed to wrap to INT_MIN", "undefined behaviour the compiler may optimise assuming never happens", "always caught at runtime", "a warning only"], correctAnswer: "undefined behaviour the compiler may optimise assuming never happens" },
    { text: "`-7 % 2` evaluates to…", options: ["1", "-1", "0", "3"], correctAnswer: "-1" },
    { text: "Why compare floats with an epsilon rather than ==?", options: ["== is undefined for floats", "Accumulated rounding means 0.1 + 0.2 is not exactly 0.3", "It is faster", "Floats cannot be compared"], correctAnswer: "Accumulated rounding means 0.1 + 0.2 is not exactly 0.3" },
    { text: "On many microcontrollers float is common but double is avoided because…", options: ["double is slower to type", "many MCUs lack a hardware FPU for doubles", "double is not a C++ type", "float is more precise"], correctAnswer: "many MCUs lack a hardware FPU for doubles" },
  ],
  "const, constexpr & Compile-Time Values": [
    { text: "`constexpr int k = square(9);` computes k…", options: ["at runtime on every call", "at compile time — zero runtime cost", "lazily on first use", "never"], correctAnswer: "at compile time — zero runtime cost" },
    { text: "Which can a compile-time constant NOT be used for?", options: ["Array sizes", "Template arguments", "A value read from a file", "switch case labels"], correctAnswer: "A value read from a file" },
    { text: "`const int t = read_config();` is valid because…", options: ["const means runtime-immutable after init, and the value may come from a runtime source", "read_config returns constexpr", "it is a macro", "const forces compile-time"], correctAnswer: "const means runtime-immutable after init, and the value may come from a runtime source" },
    { text: "Why prefer constexpr over #define for constants?", options: ["#define is slower", "A constexpr has a type, scopes properly, and is debuggable — a #define is untyped text substitution", "They are identical", "#define cannot be used in C++"], correctAnswer: "A constexpr has a type, scopes properly, and is debuggable — a #define is untyped text substitution" },
  ],
  "auto & Type Deduction": [
    { text: "`auto v[0]` in `std::vector<int> v; auto x = v[0];` produces…", options: ["int&", "int (a copy)", "const int&", "auto cannot index"], correctAnswer: "int (a copy)" },
    { text: "To iterate a vector of large objects without copying or mutating, use…", options: ["for (auto x : v)", "for (const auto& x : v)", "for (auto* x : v)", "for (auto&&& x : v)"], correctAnswer: "for (const auto& x : v)" },
    { text: "`decltype(x)`…", options: ["computes x", "gives the exact declared type of x without evaluating it", "is a runtime check", "casts x"], correctAnswer: "gives the exact declared type of x without evaluating it" },
    { text: "`auto it = myVector.begin();` is valuable because…", options: ["it makes the iterator a copy", "it hides the long, ugly iterator type while keeping the type fixed at compile time", "it makes the iterator dynamic", "it converts to int"], correctAnswer: "it hides the long, ugly iterator type while keeping the type fixed at compile time" },
  ],

  // ── W4 · Operators & Expressions ─────────────────────────────────────────
  "Arithmetic & Assignment Operators": [
    { text: "`10 / 3.0` evaluates to…", options: ["3", "3.333... because the double operand forces floating-point division", "3.0", "A compile error"], correctAnswer: "3.333... because the double operand forces floating-point division" },
    { text: "Why is `x += 5;` preferable to `x = x + 5;` in some code?", options: ["It evaluates x once, which matters when x is arr[i++]", "It is always faster", "It is deprecated", "It cannot overflow"], correctAnswer: "It evaluates x once, which matters when x is arr[i++]" },
    { text: "`char c = 65; c = c + 1;` — the addition `c + 1` happens in…", options: ["char precision", "int precision after promotion, then narrows back to char", "double precision", "never happens"], correctAnswer: "int precision after promotion, then narrows back to char" },
    { text: "Integer division by zero is…", options: ["a runtime exception you can catch", "undefined behaviour — crash or garbage", "always 0", "a compile error"], correctAnswer: "undefined behaviour — crash or garbage" },
  ],
  "Relational, Logical & Bitwise Operators": [
    { text: "Which expression correctly tests whether bit 4 of `reg` is set?", options: ["reg && 16", "(reg >> 4) & 1u", "reg == 16", "reg & 4"], correctAnswer: "(reg >> 4) & 1u" },
    { text: "`true || (side_effect())` — what happens?", options: ["side_effect always runs", "side_effect never runs — || short-circuits on true", "A compile error", "Both sides run in parallel"], correctAnswer: "side_effect never runs — || short-circuits on true" },
    { text: "The practical difference between `x & y` and `x && y` is…", options: ["they are synonyms", "& is bitwise AND of integers; && is logical AND of booleans", "&& only works on floats", "& only works on pointers"], correctAnswer: "& is bitwise AND of integers; && is logical AND of booleans" },
    { text: "`~` (bitwise NOT) applied to unsigned 8-bit 0b00001111 gives…", options: ["0b11110000", "0b00000000", "0b00001111", "0b11111111"], correctAnswer: "0b11110000" },
  ],
  "Increment/Decrement & Compound Pitfalls": [
    { text: "`int b = x++;` when x is 5 gives…", options: ["b = 6, x = 6", "b = 5, x = 6", "b = 6, x = 5", "b = 5, x = 5"], correctAnswer: "b = 5, x = 6" },
    { text: "Why is `arr[i++] + arr[i++]` undefined behaviour?", options: ["It is just slow", "It modifies i twice within one unsequenced expression", "It reads a const array", "It overflows the stack"], correctAnswer: "It modifies i twice within one unsequenced expression" },
    { text: "The safe way to sum the old value of i and advance is…", options: ["arr[i++] + arr[i++]", "sum += i++; as a single standalone statement", "i = i++;", "arr[++i] + arr[i]"], correctAnswer: "sum += i++; as a single standalone statement" },
    { text: "Why prefer `++it` over `it++` for class iterators?", options: ["++it is deprecated", "it++ constructs a temporary copy of the old state", "it++ is undefined", "They are identical"], correctAnswer: "it++ constructs a temporary copy of the old state" },
  ],
  "Operator Precedence & Common Traps": [
    { text: "`x & 1 == 0` parses as…", options: ["(x & 1) == 0", "x & (1 == 0)", "x == (1 & 0)", "A compile error"], correctAnswer: "x & (1 == 0)" },
    { text: "Because assignment has very low precedence, `x = a & b;` means…", options: ["(x = a) & b", "x = (a & b)", "x = a, then compare", "compile error"], correctAnswer: "x = (a & b)" },
    { text: "The practical rule for mixing bitwise with comparison is…", options: ["never use bitwise", "parenthesise — (x & 1) == 0 documents intent and avoids the trap", "always shift first", "use macros"], correctAnswer: "parenthesise — (x & 1) == 0 documents intent and avoids the trap" },
    { text: "`a = b = c = 1;` works because…", options: ["the comma operator", "assignment is right-associative, assigning 1 to all three", "it is a compile error", "b and c are references"], correctAnswer: "assignment is right-associative, assigning 1 to all three" },
  ],

  // ── W5 · Input/Output (iostream, formatting) ─────────────────────────────
  "cout, cin & the Stream Model": [
    { text: "Why is std::cerr unbuffered?", options: ["It is faster", "Error output must appear immediately even on crash", "It is deprecated", "It cannot be redirected"], correctAnswer: "Error output must appear immediately even on crash" },
    { text: "After `std::cin >> name;` where the user typed 'Avi Kumar', what does name hold?", options: ["Avi Kumar", "Avi", "Kumar", "an error flag"], correctAnswer: "Avi" },
    { text: "The expression `if (std::cin >> value)` works because…", options: ["cin is always true", "operator>> returns the stream, whose boolean conversion is true only when no error is set", "it compares to 0", "it is a macro"], correctAnswer: "operator>> returns the stream, whose boolean conversion is true only when no error is set" },
    { text: "What does `std::cin.clear()` do?", options: ["Empties the input buffer", "Resets the stream's error flags so reads work again", "Flushes output", "Closes stdin"], correctAnswer: "Resets the stream's error flags so reads work again" },
  ],
  "Formatting Output": [
    { text: "`std::setw(8)` applies to…", options: ["all following outputs", "the next output only", "integers only", "nothing"], correctAnswer: "the next output only" },
    { text: "Without `std::fixed`, `std::setprecision(4)` counts…", options: ["decimal places", "significant digits", "bytes", "exponent digits"], correctAnswer: "significant digits" },
    { text: "`std::boolalpha` makes `true` print as…", options: ["1", "true", "TRUE", "yes"], correctAnswer: "true" },
    { text: "`std::hex << std::showbase << 255` prints…", options: ["255", "0xff", "ff", "FF"], correctAnswer: "0xff" },
  ],
  "Reading Input Safely (getline & Fail States)": [
    { text: "The classic bug of mixing `>>` and getline is solved by…", options: ["calling cin.sync()", "consuming the leftover newline with ignore(..., '\\n') after the >>", "using two getlines", "flushing cout"], correctAnswer: "consuming the leftover newline with ignore(..., '\\n') after the >>" },
    { text: "`while (std::getline(std::cin, line))` loops until…", options: ["a line is empty", "end of file is reached", "100 lines are read", "an error occurs only"], correctAnswer: "end of file is reached" },
    { text: "Why range-check numeric input after a successful read?", options: ["It is optional", "A user can type 99999999 for an age — validation is part of robust input handling", "It speeds things up", "The stream does it"], correctAnswer: "A user can type 99999999 for an age — validation is part of robust input handling" },
    { text: "`std::cin.ignore(max, '\\n')` discards…", options: ["all input", "up to max characters or until a newline", "only the first character", "the fail flag"], correctAnswer: "up to max characters or until a newline" },
  ],
  "File Streams Basics (ifstream/ofstream)": [
    { text: "Constructing an ifstream for a missing file…", options: ["throws an exception", "silently opens nothing — you must check `if (!in)`", "creates the file", "returns nullptr"], correctAnswer: "silently opens nothing — you must check `if (!in)`" },
    { text: "Where do disk-full write errors surface for an ofstream?", options: ["They are silent forever", "At .close() or when the stream is destroyed and flushes", "Never", "At the constructor"], correctAnswer: "At .close() or when the stream is destroyed and flushes" },
    { text: "Reading binary data from a file requires…", options: ["text mode always", "std::ios::binary so bytes are read untouched", "getline", "a cast to int"], correctAnswer: "std::ios::binary so bytes are read untouched" },
    { text: "The RAII benefit of fstream is…", options: ["files open faster", "the destructor closes the file even on early return or exception", "no disk writes", "automatic deletion"], correctAnswer: "the destructor closes the file even on early return or exception" },
  ],

  // ── W6 · Conditional Statements & Switch ─────────────────────────────────
  "if / else if / else": [
    { text: "In a temperature guard, why must `temp > 80` be checked before `temp > 50`?", options: ["Order is arbitrary", "Only the first matching branch runs — the more specific condition must come first", "The compiler requires it", "else-if is deprecated"], correctAnswer: "Only the first matching branch runs — the more specific condition must come first" },
    { text: "`if (x = 5)` is…", options: ["a comparison", "an assignment that is always true — a classic bug", "a compile error", "only a warning in all compilers"], correctAnswer: "an assignment that is always true — a classic bug" },
    { text: "The dangling-else problem disappears when…", options: ["you use no else", "every if/else body is wrapped in braces", "you use ternaries", "you add a default"], correctAnswer: "every if/else body is wrapped in braces" },
    { text: "`if (flag); { do_work(); }` — the stray semicolon means…", options: ["do_work runs always", "do_work never runs", "a compile error", "flag is cleared"], correctAnswer: "do_work runs always" },
  ],
  "Ternary Operator & Short-Circuit": [
    { text: "Only ONE side of `cond ? a : b` is evaluated, so…", options: ["both a and b always run", "the un-chosen side is never evaluated — safe for dereferencing guarded pointers", "a runs always", "it is undefined"], correctAnswer: "the un-chosen side is never evaluated — safe for dereferencing guarded pointers" },
    { text: "`int v = p ? *p : 0;` when p is null…", options: ["crashes", "v = 0 and *p is never evaluated", "v = *p", "is undefined"], correctAnswer: "v = 0 and *p is never evaluated" },
    { text: "Why should ternaries be kept to one line?", options: ["They are faster then", "Nested ternaries become unreadable — an if/else is clearer for complex logic", "They cannot be longer", "The compiler rejects them"], correctAnswer: "Nested ternaries become unreadable — an if/else is clearer for complex logic" },
    { text: "`cond ? \"s\" : 42` is…", options: ["always a string", "ill-formed — no common type between const char* and int", "always an int", "fine"], correctAnswer: "ill-formed — no common type between const char* and int" },
  ],
  "switch Statements & Fall-Through": [
    { text: "To declare a variable inside a case body, you must…", options: ["use a global", "wrap the case body in braces {}", "declare it at the top of main", "make it static"], correctAnswer: "wrap the case body in braces {}" },
    { text: "Intentional fall-through is marked with…", options: ["continue", "[[fallthrough]];", "break", "default"], correctAnswer: "[[fallthrough]];" },
    { text: "A switch on an enum state machine is preferred over else-if chains because…", options: ["it can compile to a jump table with constant-time dispatch", "enums are faster", "else-if cannot test enums", "it uses less RAM"], correctAnswer: "it can compile to a jump table with constant-time dispatch" },
    { text: "case labels must be…", options: ["runtime variables", "compile-time constants", "strings", "function calls"], correctAnswer: "compile-time constants" },
  ],
  "Common Conditional Bugs": [
    { text: "Comparing `i < v.size()` with i a signed int is risky because…", options: ["it is always correct", "negative i converts to a huge unsigned size_t", "v.size() is signed", "the loop never runs"], correctAnswer: "negative i converts to a huge unsigned size_t" },
    { text: "Which is the epsilon-comparison idiom for floats?", options: ["if (x == 0.1)", "if (std::abs(x - 0.1) < 1e-9)", "if (x - 0.1)", "if (x & 0.1)"], correctAnswer: "if (std::abs(x - 0.1) < 1e-9)" },
    { text: "`if (a & b)` when you meant 'a and b' is a bug because…", options: ["it tests the bitwise AND, which is true for many pairs where the logical AND is false", "it is slower", "it is undefined", "it only works on booleans"], correctAnswer: "it tests the bitwise AND, which is true for many pairs where the logical AND is false" },
    { text: "The uninitialised-read bug pattern is…", options: ["int x; if (cond) x = 5; use(x); — x may be garbage when cond is false", "always zero", "a crash", "impossible to write"], correctAnswer: "int x; if (cond) x = 5; use(x); — x may be garbage when cond is false" },
  ],

  // ── W7 · Loops (for, while, do-while) ────────────────────────────────────
  "for Loops": [
    { text: "`for (int i = 0; i <= n; ++i)` runs how many times for n = 3?", options: ["3", "4", "2", "infinite"], correctAnswer: "4" },
    { text: "A countdown that must reach 0 uses…", options: ["for (int i = n; i > 0; --i)", "for (int i = n; i >= 0; --i) with care about signed underflow", "while (n--) only", "do { --n; } while (n)"], correctAnswer: "for (int i = n; i >= 0; --i) with care about signed underflow" },
    { text: "Prefer a for loop over a while loop when…", options: ["you never know the count", "there is an init/condition/step that belong together — the header documents the loop contract", "the body is empty", "you need break"], correctAnswer: "there is an init/condition/step that belong together — the header documents the loop contract" },
    { text: "The modern way to iterate all elements of a vector without an index is…", options: ["for (const auto& x : v)", "a while loop", "a do-while", "a goto"], correctAnswer: "for (const auto& x : v)" },
  ],
  "while Loops": [
    { text: "A while loop that halts by halving is a good fit because…", options: ["the trip count is unknown up front and driven by the data", "while is faster", "for loops cannot divide", "do-while is required"], correctAnswer: "the trip count is unknown up front and driven by the data" },
    { text: "The infinite-loop discipline for while is…", options: ["add a sleep", "verify the body actually changes the condition", "use break every iteration", "disable optimisations"], correctAnswer: "verify the body actually changes the condition" },
    { text: "`while (i < size && arr[i] != target)` is safe because…", options: ["&& always evaluates both sides", "short-circuit prevents arr[i] when i is out of range", "arr is bounds-checked", "size is a constant"], correctAnswer: "short-circuit prevents arr[i] when i is out of range" },
    { text: "A while loop can run…", options: ["at least once", "zero or more times, depending on the first condition test", "exactly once", "forever only"], correctAnswer: "zero or more times, depending on the first condition test" },
  ],
  "do-while Loops": [
    { text: "The ideal use for a do-while is…", options: ["processing an empty table", "menu prompts and retry loops where the first attempt must always run", "counting down from a known n", "sorting"], correctAnswer: "menu prompts and retry loops where the first attempt must always run" },
    { text: "Which do-while quirk surprises beginners?", options: ["It needs a trailing semicolon after while(cond);", "It has no condition", "It cannot use break", "It is C-only"], correctAnswer: "It needs a trailing semicolon after while(cond);" },
    { text: "A variable declared inside the do-while body…", options: ["is visible in the condition", "is out of scope in the condition — declare it before the loop", "is static", "crashes"], correctAnswer: "is out of scope in the condition — declare it before the loop" },
    { text: "The macro idiom `do { ... } while (0)` exists so that…", options: ["the macro runs forever", "the macro behaves like a statement and does not swallow an else", "it is faster", "it avoids semicolons"], correctAnswer: "the macro behaves like a statement and does not swallow an else" },
  ],
  "break, continue & Loop Design": [
    { text: "In a for loop, `continue` skips to…", options: ["the start of the body", "the step expression, then the condition test", "the end of the program", "the next statement after the loop"], correctAnswer: "the step expression, then the condition test" },
    { text: "Why can continue cause an infinite loop in a while?", options: ["It resets the condition", "It can skip the increment at the bottom of the body", "It exits the loop", "It has no effect"], correctAnswer: "It can skip the increment at the bottom of the body" },
    { text: "The clearest way to express early-exit on success is…", options: ["a break deep in nested loops", "return from a helper function as soon as the match is found", "a goto", "an exception"], correctAnswer: "return from a helper function as soon as the match is found" },
    { text: "The design rule for loop exits is…", options: ["always use break", "prefer expressing the exit in the loop condition so the contract is visible up front", "never exit early", "use continue instead"], correctAnswer: "prefer expressing the exit in the loop condition so the contract is visible up front" },
  ],

  // ── W8 · Functions, Default/Overloaded Args ──────────────────────────────
  "Function Declaration & Definition": [
    { text: "The purpose of the one-definition rule (ODR) is…", options: ["to allow two implementations", "to guarantee exactly one definition of a function across the whole program", "to require definitions in headers", "to forbid prototypes"], correctAnswer: "to guarantee exactly one definition of a function across the whole program" },
    { text: "What identifies a function's signature (for overloading)?", options: ["Return type only", "Name + parameter types", "Name only", "Body length"], correctAnswer: "Name + parameter types" },
    { text: "Falling off the end of a non-void function is…", options: ["a warning and returns 0", "undefined behaviour", "impossible", "always a crash"], correctAnswer: "undefined behaviour" },
    { text: "Header files exist primarily to…", options: ["store macros", "share function declarations so calls compile correctly everywhere", "hide implementations", "reduce file count"], correctAnswer: "share function declarations so calls compile correctly everywhere" },
  ],
  "Parameters by Value vs Reference": [
    { text: "Which call passes a 10 MB string WITHOUT copying?", options: ["f(std::string s)", "f(const std::string& s)", "f(std::string&& s) only", "f(s) by value"], correctAnswer: "f(const std::string& s)" },
    { text: "A reference parameter that the function mutates lets the caller…", options: ["never see the change", "see the change — the function modifies the caller's variable", "copy the value", "free the variable"], correctAnswer: "see the change — the function modifies the caller's variable" },
    { text: "Prefer a reference over a pointer when…", options: ["null is a valid input", "the argument is required and must never be null", "you want to re-seat it", "you need pointer arithmetic"], correctAnswer: "the argument is required and must never be null" },
    { text: "`const` correctness on parameters enables…", options: ["runtime checks", "compiler optimisations and catches accidental mutation", "faster I/O", "smaller code only"], correctAnswer: "compiler optimisations and catches accidental mutation" },
  ],
  "Default Arguments & Function Overloading": [
    { text: "Declaring `int f(int a, int b = 0);` and then `int f(int a, int b) { }` with a default too is…", options: ["fine", "an error — the default must appear only once (in the declaration)", "a linker error", "only a warning"], correctAnswer: "an error — the default must appear only once (in the declaration)" },
    { text: "Defaults must be…", options: ["first in the parameter list", "trailing — after all non-defaulted parameters", "in every overload", "const"], correctAnswer: "trailing — after all non-defaulted parameters" },
    { text: "Overload resolution prefers…", options: ["any template", "exact match > promotion > standard conversion > user-defined conversion", "the shortest name", "the first declared"], correctAnswer: "exact match > promotion > standard conversion > user-defined conversion" },
    { text: "An ambiguous overload call (two equally good matches) produces…", options: ["a runtime pick", "a compile error asking you to disambiguate", "the first one silently", "undefined behaviour"], correctAnswer: "a compile error asking you to disambiguate" },
  ],
  "Return Values, const & Scope": [
    { text: "Why is `int& bad() { int x = 5; return x; }` wrong?", options: ["It is slow", "x is destroyed when the function returns — the reference dangles", "int& cannot be returned", "It is a syntax error"], correctAnswer: "x is destroyed when the function returns — the reference dangles" },
    { text: "A safe pattern for read-only access to internal data is…", options: ["returning a copy always", "returning const& to a member that outlives the function", "returning a local reference", "returning nullptr"], correctAnswer: "returning const& to a member that outlives the function" },
    { text: "`[[nodiscard]]` on a function makes the compiler…", options: ["delete it", "warn when its return value is ignored", "inline it", "make it static"], correctAnswer: "warn when its return value is ignored" },
    { text: "A static local variable is…", options: ["re-initialised every call", "initialised once and lives for the program", "thread-local only", "a global"], correctAnswer: "initialised once and lives for the program" },
  ],

  // ── W9 · Arrays & std::array ─────────────────────────────────────────────
  "C-Style Arrays & Bounds": [
    { text: "What is the last valid index of `int a[5];`?", options: ["5", "4", "6", "3"], correctAnswer: "4" },
    { text: "An off-by-one write past an array can…", options: ["be caught by the compiler", "silently corrupt a neighbouring variable or return address — undefined behaviour", "never happen", "always throw"], correctAnswer: "silently corrupt a neighbouring variable or return address — undefined behaviour" },
    { text: "Passing a raw array to a function decays it to…", options: ["a reference", "a pointer, losing the size", "an std::array", "a vector"], correctAnswer: "a pointer, losing the size" },
    { text: "`sizeof(arr) / sizeof(arr[0])` gives the element count only…", options: ["inside the callee", "where the array is in scope, before decay", "after decay", "never"], correctAnswer: "where the array is in scope, before decay" },
  ],
  "Multidimensional Arrays": [
    { text: "`int grid[3][4];` declares…", options: ["4 rows of 3", "3 rows of 4 ints", "a 1D array", "12 rows"], correctAnswer: "3 rows of 4 ints" },
    { text: "Row-major storage means…", options: ["columns are contiguous", "each row is stored contiguously, so row-first iteration is cache-friendly", "rows are scattered", "memory is column-ordered"], correctAnswer: "each row is stored contiguously, so row-first iteration is cache-friendly" },
    { text: "Passing a 2D array `void f(int g[][4], int rows)` requires…", options: ["the first dimension fixed", "the inner dimension (4) in the type so strides can be computed", "no dimensions", "pointers only"], correctAnswer: "the inner dimension (4) in the type so strides can be computed" },
    { text: "Flat indexing `pixel[row * WIDTH + col]` is common in embedded because…", options: ["it wastes memory", "one contiguous buffer with simple pointer math suits framebuffers and GPUs", "it is slower", "it cannot be indexed"], correctAnswer: "one contiguous buffer with simple pointer math suits framebuffers and GPUs" },
  ],
  "std::array & Why Prefer It": [
    { text: "The key advantage of `std::array<int,5> a;` over `int a[5];` is…", options: ["it is smaller", "it knows its size (a.size()) and offers .at() bounds checking", "it grows dynamically", "it uses the heap"], correctAnswer: "it knows its size (a.size()) and offers .at() bounds checking" },
    { text: "`std::array` with STL algorithms works because…", options: ["it is a pointer", "it is a proper container with begin()/end() iterators", "it inherits vector", "algorithms only take pointers"], correctAnswer: "it is a proper container with begin()/end() iterators" },
    { text: "A signature like `void f(std::array<int,5>& a)` is a feature because…", options: ["it rejects a 6-element array at compile time", "it is faster", "it allocates", "it hides size"], correctAnswer: "it rejects a 6-element array at compile time" },
    { text: "When the size is known only at runtime, use…", options: ["std::array", "std::vector", "a raw array with VLA", "a macro"], correctAnswer: "std::vector" },
  ],
  "Iterating & Passing Arrays": [
    { text: "Why does `for (int x : arr)` break after arr is passed to a function?", options: ["Range-for is deprecated", "The array has decayed to a pointer, so the size is unavailable", "Functions cannot loop", "It only breaks at -O0"], correctAnswer: "The array has decayed to a pointer, so the size is unavailable" },
    { text: "The universal STL range convention is…", options: ["[begin, end) half-open — end points one past the last", "(begin, end] inclusive end", "[0, size]", "begin only"], correctAnswer: "[begin, end) half-open — end points one past the last" },
    { text: "Passing `std::vector<int>` by value to a read-only function…", options: ["is free", "copies the entire heap buffer — an O(n) surprise", "is a compile error", "shares memory"], correctAnswer: "copies the entire heap buffer — an O(n) surprise" },
    { text: "Prefer range-for or algorithms over index loops when…", options: ["you need the position", "the position is irrelevant — they remove whole classes of index bugs", "the container is a map", "the loop is empty"], correctAnswer: "the position is irrelevant — they remove whole classes of index bugs" },
  ],

  // ── W10 · Strings (std::string) & C-Strings ──────────────────────────────
  "C-Strings vs std::string": [
    { text: "`const char* s = \"hello\";` occupies how many bytes including the terminator?", options: ["5", "6", "7", "4"], correctAnswer: "6" },
    { text: "The C-string overflow bug comes from…", options: ["std::string", "strcpy copying until a null with no knowledge of the destination size", "the null terminator", "std::strlen"], correctAnswer: "strcpy copying until a null with no knowledge of the destination size" },
    { text: "`strncpy` is a dangerous mitigation because…", options: ["it is slow", "it can silently NOT null-terminate when the source fills the buffer", "it always fails", "it is C++-only"], correctAnswer: "it can silently NOT null-terminate when the source fills the buffer" },
    { text: "`s.c_str()` returns…", options: ["a mutable char*", "a read-only const char* for interop with C APIs", "a std::string", "an iterator"], correctAnswer: "a read-only const char* for interop with C APIs" },
  ],
  "std::string Operations": [
    { text: "The sentinel meaning 'not found' for find() is…", options: ["-1", "std::string::npos", "0", "nullptr"], correctAnswer: "std::string::npos" },
    { text: "`s.substr(6)` on \"hello world\" gives…", options: ["hello", "world", "ld", "hello world"], correctAnswer: "world" },
    { text: "To find the first space, comma, or semicolon, use…", options: ["find", "find_first_of(\" ,;\")", "substr", "at"], correctAnswer: "find_first_of(\" ,;\")" },
    { text: "Why is repeatedly prepending (`s = \"x\" + s`) O(n²)?", options: ["It allocates a new string each time", "Each prepend shifts the entire buffer", "Strings are immutable", "It is not O(n²)"], correctAnswer: "Each prepend shifts the entire buffer" },
  ],
  "String Conversion (stoi, to_string)": [
    { text: "`std::stoi(\"abc\")` throws…", options: ["std::out_of_range", "std::invalid_argument", "nothing — returns 0", "std::bad_alloc"], correctAnswer: "std::invalid_argument" },
    { text: "`std::stoi(\"123abc\", &pos)` parses 123 and sets pos to…", options: ["0", "3", "6", "npos"], correctAnswer: "3" },
    { text: "Why would you reject \"123abc\" with a pos check?", options: ["It is faster", "A whole-number parse should not silently accept trailing garbage", "stoi requires it", "pos is always 0"], correctAnswer: "A whole-number parse should not silently accept trailing garbage" },
    { text: "`std::from_chars` (C++17) is preferred for hot parsing because…", options: ["it throws on error", "it is exception-free, locale-independent, and fastest", "it is simpler to read", "it returns npos"], correctAnswer: "it is exception-free, locale-independent, and fastest" },
  ],
  "String Performance & Best Practices": [
    { text: "A read-only string parameter that should not copy is…", options: ["std::string by value", "std::string_view or const std::string&", "const char* always", "a raw buffer"], correctAnswer: "std::string_view or const std::string&" },
    { text: "The critical rule for std::string_view is…", options: ["never use it", "the viewed string must outlive the view — never return a view to a local string", "it always owns", "it copies"], correctAnswer: "the viewed string must outlive the view — never return a view to a local string" },
    { text: "`s.reserve(n)` before a known-size build…", options: ["wastes memory", "avoids repeated reallocations during appends", "is deprecated", "resizes the string"], correctAnswer: "avoids repeated reallocations during appends" },
    { text: "A pointer from `c_str()` is valid only until…", options: ["the program ends", "the string is modified or destroyed", "the next cout", "the heap is full"], correctAnswer: "the string is modified or destroyed" },
  ],

  // ── W11 · Classes & Objects, Access Specifiers ───────────────────────────
  "Defining Classes & Structs": [
    { text: "The only functional difference between class and struct is…", options: ["struct cannot have methods", "default access: private for class, public for struct", "struct is C-only", "class cannot be a member"], correctAnswer: "default access: private for class, public for struct" },
    { text: "Encapsulation means…", options: ["hiding all code", "state is private behind a stable interface so callers never depend on internals", "no public methods", "global variables"], correctAnswer: "state is private behind a stable interface so callers never depend on internals" },
    { text: "The convention for choosing struct vs class is…", options: ["struct for plain data, class when behaviour + invariants matter", "always class", "always struct", "never both"], correctAnswer: "struct for plain data, class when behaviour + invariants matter" },
    { text: "`this->pin_` is needed when…", options: ["always", "a parameter shares the member's name", "the method is const", "the class is empty"], correctAnswer: "a parameter shares the member's name" },
  ],
  "Access Specifiers (public/private/protected)": [
    { text: "Making `balance_` private forces all changes through `deposit()` which validates…", options: ["the account owner", "the invariant 'balance never negative'", "the bank name", "nothing"], correctAnswer: "the invariant 'balance never negative'" },
    { text: "A const member function can be called on…", options: ["only non-const objects", "const objects (and promises not to modify the object)", "only static objects", "no objects"], correctAnswer: "const objects (and promises not to modify the object)" },
    { text: "protected access means…", options: ["public to everyone", "private to the world, visible to derived classes", "public to derived only", "hidden from everything"], correctAnswer: "private to the world, visible to derived classes" },
    { text: "The m_ / trailing-underscore naming convention exists to…", options: ["obfuscate", "make member access unmistakable in code", "speed compilation", "satisfy the linker"], correctAnswer: "make member access unmistakable in code" },
  ],
  "Member Functions & this": [
    { text: "What is the value of `this` inside a member function?", options: ["a reference", "a pointer to the calling object", "a copy", "the class"], correctAnswer: "a pointer to the calling object" },
    { text: "Fluent/chained calls work because each mutator…", options: ["returns void", "returns *this", "returns bool", "is static"], correctAnswer: "returns *this" },
    { text: "In a const member function, `this` is implicitly…", options: ["mutable", "const — you cannot modify members through it", "a shared_ptr", "a reference"], correctAnswer: "const — you cannot modify members through it" },
    { text: "The self-check `if (this == &other)` guards…", options: ["chaining", "self-assignment", "null dereference", "copy elision"], correctAnswer: "self-assignment" },
  ],
  "Constructors Basics & Object Lifetime": [
    { text: "Adding ANY constructor to a class makes the implicit default constructor…", options: ["remain available", "disappear — Vec2 v; may stop compiling", "become protected", "virtual"], correctAnswer: "disappear — Vec2 v; may stop compiling" },
    { text: "The initialiser list `: pin_(pin)` runs…", options: ["after the body", "before the body — members constructed directly with values", "at link time", "never"], correctAnswer: "before the body — members constructed directly with values" },
    { text: "A member without a default constructor…", options: ["cannot exist", "must be initialised in the initialiser list", "is always zero", "needs a pointer"], correctAnswer: "must be initialised in the initialiser list" },
    { text: "A stack object's lifetime ends…", options: ["never", "when it goes out of scope — destructor runs deterministically", "at program exit only", "when the heap grows"], correctAnswer: "when it goes out of scope — destructor runs deterministically" },
  ],

  // ── W12 · Constructors, Destructors & RAII ───────────────────────────────
  "Constructors & Initialisation Lists": [
    { text: "Assigning a member inside the body vs the list: the list is faster because…", options: ["it skips default-construction then assignment", "it uses memcpy", "the body is forbidden", "it is a macro"], correctAnswer: "it skips default-construction then assignment" },
    { text: "`class Bad { int a_; int b_; Bad() : b_(5), a_(b_) {} };` — a_ is initialised…", options: ["from 5", "from uninitialised b_, because members init in DECLARATION order", "from 0", "never"], correctAnswer: "from uninitialised b_, because members init in DECLARATION order" },
    { text: "A delegating constructor `Vec() : Vec(0, 0) {}`…", options: ["is illegal", "lets one constructor call another", "creates two objects", "is C++98"], correctAnswer: "lets one constructor call another" },
    { text: "A default member initialiser `int x_ = 0;` applies…", options: ["always, overriding the list", "when a constructor does not mention x_ in its list", "only to const members", "never"], correctAnswer: "when a constructor does not mention x_ in its list" },
  ],
  "Destructors & Resource Cleanup": [
    { text: "When a FileWriter is destroyed on an early return…", options: ["the file leaks", "the destructor still runs and closes the file", "the program crashes", "nothing happens"], correctAnswer: "the destructor still runs and closes the file" },
    { text: "Members are destroyed…", options: ["in declaration order", "in reverse declaration order", "alphabetically", "in a random order"], correctAnswer: "in reverse declaration order" },
    { text: "A throw from a destructor during stack unwinding causes…", options: ["a catch in main", "std::terminate — the program dies", "a warning", "a retry"], correctAnswer: "std::terminate — the program dies" },
    { text: "Why must a polymorphic base's destructor be virtual?", options: ["to add a vtable", "deleting through a base pointer must run the derived destructor", "to speed up destruction", "it is optional"], correctAnswer: "deleting through a base pointer must run the derived destructor" },
  ],
  "RAII — The Core C++ Pattern": [
    { text: "RAII stands for…", options: ["Random Access Instant Initialisation", "Resource Acquisition Is Initialisation", "Rapid Algorithmic Interface Index", "Reference And Inherited Items"], correctAnswer: "Resource Acquisition Is Initialisation" },
    { text: "The RAII guarantee comes from…", options: ["the garbage collector", "destructors running automatically on every exit path", "the OS", "manual close() calls"], correctAnswer: "destructors running automatically on every exit path" },
    { text: "During an exception's stack unwinding…", options: ["locals are leaked", "every local object's destructor runs, releasing resources automatically", "the program restarts", "only globals are cleaned"], correctAnswer: "every local object's destructor runs, releasing resources automatically" },
    { text: "The design question RAII asks of every class is…", options: ["how big is it", "what does this object own, and where does it get released", "is it virtual", "what is its vtable"], correctAnswer: "what does this object own, and where does it get released" },
  ],
  "Copy Constructors & Rule of Three/Five": [
    { text: "A class with a raw `new` buffer and a destructor, copied by default, suffers…", options: ["nothing", "double free — both objects share one pointer", "a leak", "a compile error"], correctAnswer: "double free — both objects share one pointer" },
    { text: "The Rule of Three names…", options: ["destructor, copy ctor, copy assignment", "constructor, destructor, virtual", "new, delete, malloc", "move, copy, swap"], correctAnswer: "destructor, copy ctor, copy assignment" },
    { text: "The modern fix that makes default copies correct is…", options: ["raw new/delete everywhere", "storing resources in RAII members like std::string/std::vector", "deleting the destructor", "using malloc"], correctAnswer: "storing resources in RAII members like std::string/std::vector" },
    { text: "`T(const T&) = delete;` makes the type…", options: ["deep-copying", "uncopyable", "move-only automatically", "virtual"], correctAnswer: "uncopyable" },
  ],

  // ── W13 · Inheritance & Composition ──────────────────────────────────────
  "Basic Inheritance (is-a)": [
    { text: "When a Dog is created, the Animal constructor runs…", options: ["after the Dog constructor", "first — the base must be fully built before the derived part", "only if virtual", "never"], correctAnswer: "first — the base must be fully built before the derived part" },
    { text: "Which of these does a derived class NOT inherit?", options: ["public methods", "private members of the base", "the base's interface", "protected members"], correctAnswer: "private members of the base" },
    { text: "Constructors are…", options: ["inherited", "not inherited — but the derived can call them in its initialiser list", "always virtual", "private"], correctAnswer: "not inherited — but the derived can call them in its initialiser list" },
    { text: "A warning sign that inheritance is misused is…", options: ["using it for code reuse without a true is-a relationship", "having virtuals", "having two classes", "using protected"], correctAnswer: "using it for code reuse without a true is-a relationship" },
  ],
  "Access & Inheritance Modes": [
    { text: "`class C : private A` turns A's public members into…", options: ["public in C", "private in C — the relationship is implemented-in-terms-of, not is-a", "protected in C", "static"], correctAnswer: "private in C — the relationship is implemented-in-terms-of, not is-a" },
    { text: "Only `public` inheritance enables…", options: ["composition", "using a Derived as a Base (upcasting)", "templates", "friends"], correctAnswer: "using a Derived as a Base (upcasting)" },
    { text: "A protected base member is…", options: ["visible to everyone", "hidden from the world, visible to derived classes", "private to the base only", "public to derived"], correctAnswer: "hidden from the world, visible to derived classes" },
    { text: "The fragile-base problem is…", options: ["a linker error", "changes in a base silently rippling through every descendant", "a memory leak", "a virtual bug"], correctAnswer: "changes in a base silently rippling through every descendant" },
  ],
  "Composition (has-a) vs Inheritance": [
    { text: "`class Car { Engine engine_; };` models…", options: ["is-a", "has-a (composition)", "like-a", "abstract-a"], correctAnswer: "has-a (composition)" },
    { text: "Composition is often preferred because…", options: ["it inherits everything", "it avoids brittle coupling — changing a member only affects the owning class", "it is faster to write", "it requires virtuals"], correctAnswer: "it avoids brittle coupling — changing a member only affects the owning class" },
    { text: "The deciding question between inheritance and composition is…", options: ["is it a type of X, or does it use an X", "which is shorter", "does it compile", "is X virtual"], correctAnswer: "is it a type of X, or does it use an X" },
    { text: "Inheritance is the right call when…", options: ["you only want to reuse code", "many derived types must be handled uniformly through a base interface with virtual dispatch", "you want to hide the base", "you need friend access"], correctAnswer: "many derived types must be handled uniformly through a base interface with virtual dispatch" },
  ],
  "Virtual Inheritance & the Diamond Problem": [
    { text: "The diamond problem produces…", options: ["a crash", "two copies of the common base's state", "a template error", "a vtable"], correctAnswer: "two copies of the common base's state" },
    { text: "Virtual inheritance makes B and C share…", options: ["nothing", "a single copy of the common base A", "their vtables", "their constructors"], correctAnswer: "a single copy of the common base A" },
    { text: "With virtual inheritance, the common base is initialised by…", options: ["the first derived", "the most-derived class", "the compiler", "no one"], correctAnswer: "the most-derived class" },
    { text: "The safest use of multiple inheritance is…", options: ["two stateful bases", "inheriting pure interfaces (no state)", "a diamond of classes", "two structs"], correctAnswer: "inheriting pure interfaces (no state)" },
  ],

  // ── W14 · Polymorphism & Virtual Functions ───────────────────────────────
  "Virtual Functions & Dynamic Dispatch": [
    { text: "Calling `s->area()` where s is a Shape* pointing at a Circle calls…", options: ["Shape::area always", "Circle::area — resolved at runtime via the vtable", "a compile error", "the linker"], correctAnswer: "Circle::area — resolved at runtime via the vtable" },
    { text: "The `override` keyword…", options: ["is optional sugar", "errors if the base is not virtual or the signature differs", "adds a vptr", "is deprecated"], correctAnswer: "errors if the base is not virtual or the signature differs" },
    { text: "Calling a virtual from a constructor dispatches to…", options: ["the derived override", "the base version — the vptr still points at the base table during construction", "undefined behaviour", "the most-derived"], correctAnswer: "the base version — the vptr still points at the base table during construction" },
    { text: "The per-call cost of virtual dispatch is…", options: ["a context switch", "an extra pointer load plus an indirect jump", "nothing", "a syscall"], correctAnswer: "an extra pointer load plus an indirect jump" },
  ],
  "Virtual Destructors": [
    { text: "Without a virtual destructor, `delete` on a base pointer to a Circle…", options: ["still calls ~Circle", "calls only ~Shape — derived resources leak", "crashes", "is a warning"], correctAnswer: "calls only ~Shape — derived resources leak" },
    { text: "The rule is…", options: ["every class needs a virtual destructor", "polymorphic base classes intended for delete-through-base need one; non-polymorphic classes should not pay the vptr cost", "only final classes", "only templates"], correctAnswer: "polymorphic base classes intended for delete-through-base need one; non-polymorphic classes should not pay the vptr cost" },
    { text: "`virtual ~Base() = default;`…", options: ["is a syntax error", "declares a virtual destructor with an empty default body", "deletes the class", "adds a vptr"], correctAnswer: "declares a virtual destructor with an empty default body" },
    { text: "std::unique_ptr<Shape> deleting a Circle relies on…", options: ["the derived's deleted destructor", "the virtual destructor being invoked through the base", "the compiler", "a custom deleter always"], correctAnswer: "the virtual destructor being invoked through the base" },
  ],
  "Abstract Classes & Pure Virtual Functions": [
    { text: "A pure virtual function is declared with…", options: ["= 0 and no implementation in the base", "virtual void f() {}", "void f() = default", "= delete"], correctAnswer: "= 0 and no implementation in the base" },
    { text: "An abstract class cannot…", options: ["be inherited", "be instantiated — Shape s; is a compile error", "have virtuals", "be used as a pointer"], correctAnswer: "be instantiated — Shape s; is a compile error" },
    { text: "A derived class becomes concrete when…", options: ["it declares any virtual", "it implements every pure virtual", "it is final", "it has a destructor"], correctAnswer: "it implements every pure virtual" },
    { text: "The interface idiom (ILogger) lets callers…", options: ["depend on a concrete class", "depend on an abstraction so implementations can be swapped at runtime", "skip the destructor", "use only globals"], correctAnswer: "depend on an abstraction so implementations can be swapped at runtime" },
  ],
  "Vtables Under the Hood": [
    { text: "The vptr lives…", options: ["in the vtable", "in every object of a polymorphic class (usually first member)", "in the linker", "in the stack"], correctAnswer: "in every object of a polymorphic class (usually first member)" },
    { text: "The vtable is shared by…", options: ["each object", "all instances of one class", "the whole program", "the CPU"], correctAnswer: "all instances of one class" },
    { text: "Space cost of virtuals on a 32-bit MCU is…", options: ["nothing", "one extra pointer per object plus one small table per class", "kilobytes per object", "a syscall"], correctAnswer: "one extra pointer per object plus one small table per class" },
    { text: "The embedded alternative to virtuals in hot paths is…", options: ["macros", "templates — compile-time dispatch that inlines", "goto", "global functions"], correctAnswer: "templates — compile-time dispatch that inlines" },
  ],

  // ── W15 · Operator Overloading & Friend ──────────────────────────────────
  "Operator Overloading Basics": [
    { text: "`c = a + b;` with a member operator+ invokes…", options: ["operator+(a, b)", "a.operator+(b)", "b.operator+(a)", "a.add(b)"], correctAnswer: "a.operator+(b)" },
    { text: "The golden rule of operator overloading is…", options: ["be clever", "don't surprise — overloaded operators should mean what they mean for built-ins", "overload everything", "avoid return types"], correctAnswer: "don't surprise — overloaded operators should mean what they mean for built-ins" },
    { text: "Why prefer free-function operators?", options: ["They are required", "They preserve symmetry — a + b and b + a both work for mixed types", "They are faster", "They cannot be const"], correctAnswer: "They preserve symmetry — a + b and b + a both work for mixed types" },
    { text: "Which operators should NOT be overloaded?", options: ["== and <", "&& and || — short-circuit semantics cannot be preserved", "+ and -", "[] and ()"], correctAnswer: "&& and || — short-circuit semantics cannot be preserved" },
  ],
  "Overloading << and >> (stream I/O)": [
    { text: "The critical detail of a stream operator is…", options: ["const correctness only", "returning the stream by reference so output chains", "declaring it inline", "using a stringstream"], correctAnswer: "returning the stream by reference so output chains" },
    { text: "operator<< must be a free function because…", options: ["members are banned", "the left operand is std::ostream, not your type", "it is faster", "it cannot be virtual"], correctAnswer: "the left operand is std::ostream, not your type" },
    { text: "To print private members from a free operator, the clean options are…", options: ["make them global", "public getters or a friend declaration", "a macro", "copy the object"], correctAnswer: "public getters or a friend declaration" },
    { text: "The symmetric operator>> for input…", options: ["returns void", "returns the istream by reference so reads chain", "must not read", "is virtual"], correctAnswer: "returns the istream by reference so reads chain" },
  ],
  "friend Functions & Classes": [
    { text: "Which statement about friendship is TRUE?", options: ["taken, not granted", "granted by the class — you cannot force it", "inherited", "transitive"], correctAnswer: "granted by the class — you cannot force it" },
    { text: "Friendship is NOT…", options: ["inherited or transitive", "restricted to functions", "possible", "legal"], correctAnswer: "inherited or transitive" },
    { text: "The legitimate uses of friend are…", options: ["operator<< and tightly coupled helpers", "performance hacks", "avoiding const", "hiding data"], correctAnswer: "operator<< and tightly coupled helpers" },
    { text: "A class with many friends is a smell because…", options: ["friends are slow", "private data is 'public with extra steps' — prefer a real interface", "friends crash", "it cannot compile"], correctAnswer: "private data is 'public with extra steps' — prefer a real interface" },
  ],
  "Overloading ==, < and Other Operators": [
    { text: "`operator<` for sorting must provide…", options: ["any ordering", "a strict weak ordering", "a total order only", "lexicographic only"], correctAnswer: "a strict weak ordering" },
    { text: "The clean idiom for a lexicographic operator< is…", options: ["return std::tie(a_, b_) < std::tie(o.a_, o.b_)", "return a_ < o.b_", "return a_ + b_", "return true"], correctAnswer: "return std::tie(a_, b_) < std::tie(o.a_, o.b_)" },
    { text: "In C++20, declaring `operator<=> = default` generates…", options: ["only == and !=", "all six comparison operators", "just <", "operator+ too"], correctAnswer: "all six comparison operators" },
    { text: "operator[] should return…", options: ["a value always", "a reference so v[0] = 5 works", "a pointer", "a bool"], correctAnswer: "a reference so v[0] = 5 works" },
  ],

  // ── W16 · Templates & Generic Programming ────────────────────────────────
  "Function Templates": [
    { text: "`max_of(3, 7.5)` with `template <typename T> T max_of(T a, T b)`…", options: ["deduces T = double", "fails deduction — a single T cannot match both int and double", "deduces T = int", "is a warning"], correctAnswer: "fails deduction — a single T cannot match both int and double" },
    { text: "The template's contract (e.g. 'T must have operator>') is…", options: ["declared with concepts always", "implicit in the body — a compile error appears on misuse", "runtime-checked", "optional"], correctAnswer: "implicit in the body — a compile error appears on misuse" },
    { text: "Why can't a template be defined in a .cpp and linked from elsewhere?", options: ["It is too big", "It must be instantiated at the point of use, so the definition must be visible there", "The linker forbids it", "It is interpreted"], correctAnswer: "It must be instantiated at the point of use, so the definition must be visible there" },
    { text: "Templates implement…", options: ["runtime polymorphism", "compile-time polymorphism — no vtable, fully inlinable", "dynamic dispatch", "virtual calls"], correctAnswer: "compile-time polymorphism — no vtable, fully inlinable" },
  ],
  "Class Templates": [
    { text: "`RingBuffer<int>` and `RingBuffer<double>` are…", options: ["the same type", "separate, unrelated classes with independent code", "interchangeable", "a diamond"], correctAnswer: "separate, unrelated classes with independent code" },
    { text: "A non-type template parameter like `size_t N` is…", options: ["a runtime variable", "a compile-time constant baked into the type", "a pointer", "a bool"], correctAnswer: "a compile-time constant baked into the type" },
    { text: "The embedded trade-off of templates is…", options: ["runtime cost", "code bloat — each instantiation emits separate code", "no optimisation", "heap use"], correctAnswer: "code bloat — each instantiation emits separate code" },
    { text: "Inside a template, a dependent type needs…", options: ["typename to disambiguate it from a value", "a cast", "decltype", "nothing"], correctAnswer: "typename to disambiguate it from a value" },
  ],
  "Template Specialization": [
    { text: "The compiler picks…", options: ["any match randomly", "the most specialised matching version", "the primary template always", "the first declared"], correctAnswer: "the most specialised matching version" },
    { text: "Partial specialisation is only legal for…", options: ["function templates", "class templates", "lambdas", "macros"], correctAnswer: "class templates" },
    { text: "`if constexpr (std::is_integral_v<T>)`…", options: ["runs both branches at runtime", "discards the un-taken branch at compile time — zero runtime cost", "throws", "is C++98"], correctAnswer: "discards the un-taken branch at compile time — zero runtime cost" },
    { text: "Type traits like std::is_pointer are implemented using…", options: ["macros", "specialisation patterns", "virtuals", "exceptions"], correctAnswer: "specialisation patterns" },
  ],
  "Variadic Templates & Concepts (C++20)": [
    { text: "A fold expression `(args + ...)`…", options: ["adds the types", "applies the operator across the parameter pack", "is invalid", "throws"], correctAnswer: "applies the operator across the parameter pack" },
    { text: "Concepts give templates…", options: ["runtime checks", "checkable compile-time contracts with clear errors at the call site", "virtuals", "faster code"], correctAnswer: "checkable compile-time contracts with clear errors at the call site" },
    { text: "`template <std::integral T>` requires T to be…", options: ["floating point", "an integer type", "a pointer", "a class"], correctAnswer: "an integer type" },
    { text: "Perfect forwarding uses which pair?", options: ["move and swap", "T&& and std::forward<T>", "copy and assign", "begin and end"], correctAnswer: "T&& and std::forward<T>" },
  ],

  // ── W17 · STL Containers & Iterators ─────────────────────────────────────
  "vector, list, deque": [
    { text: "Why does vector beat list for most workloads despite list's O(1) mid-inserts?", options: ["vector is always smaller", "vector's contiguous storage is cache-friendly and index access is O(1)", "list cannot store ints", "list needs a comparator"], correctAnswer: "vector's contiguous storage is cache-friendly and index access is O(1)" },
    { text: "`v.reserve(n)` before appends prevents…", options: ["memory leaks", "reallocations that copy the whole buffer", "overflows", "deadlocks"], correctAnswer: "reallocations that copy the whole buffer" },
    { text: "A FIFO growing at both ends is best served by…", options: ["std::vector", "std::deque", "std::map", "std::array"], correctAnswer: "std::deque" },
    { text: "`emplace_back(args)` beats `push_back(T(args))` because…", options: ["it is a macro", "it constructs the element in place, avoiding an extra copy/move", "it is deprecated", "it returns a bool"], correctAnswer: "it constructs the element in place, avoiding an extra copy/move" },
  ],
  "map, set & unordered Variants": [
    { text: "The requirement for using a std::map key type is…", options: ["a hash function", "operator< (a strict weak ordering)", "pointer identity", "a vtable"], correctAnswer: "operator< (a strict weak ordering)" },
    { text: "std::unordered_map requires…", options: ["operator<", "std::hash<K>", "a virtual destructor", "a friend"], correctAnswer: "std::hash<K>" },
    { text: "`counts[\"new\"]` on a std::map…", options: ["throws if absent", "inserts a default-constructed entry if absent", "returns 0 without inserting", "is deprecated"], correctAnswer: "inserts a default-constructed entry if absent" },
    { text: "To look up a key that MUST exist, use…", options: ["operator[]", ".at() which throws std::out_of_range on missing", ".find() always", ".contains()"], correctAnswer: ".at() which throws std::out_of_range on missing" },
  ],
  "Iterators (begin/end, categories)": [
    { text: "`it = v.erase(it);` (C++11+) exists because…", options: ["erase always returns begin()", "erase invalidates the erased iterator and returns the next one", "it is faster", "it is required"], correctAnswer: "erase invalidates the erased iterator and returns the next one" },
    { text: "std::sort works on vector but not list because…", options: ["list is const", "sort needs random-access iterators; list gives bidirectional only", "list has no iterators", "sort is not in <algorithm>"], correctAnswer: "sort needs random-access iterators; list gives bidirectional only" },
    { text: "`auto it = v.cbegin();` gives…", options: ["a mutable iterator", "a read-only (const) iterator", "a pointer", "an index"], correctAnswer: "a read-only (const) iterator" },
    { text: "After a vector reallocation…", options: ["iterators survive", "all iterators are invalidated", "only end() survives", "the data is lost"], correctAnswer: "all iterators are invalidated" },
  ],
  "Choosing the Right Container": [
    { text: "For a static dataset needing O(log n) lookups, the fastest choice is often…", options: ["a map with nodes", "a vector sorted once + std::binary_search", "an unordered_set", "a deque"], correctAnswer: "a vector sorted once + std::binary_search" },
    { text: "The default first choice for 'append + iterate + index' is…", options: ["std::list", "std::vector", "std::set", "std::map"], correctAnswer: "std::vector" },
    { text: "Small integer keys 0..63 map best to…", options: ["a map", "an array/vector indexed by the key — a perfect O(1) hash", "a list", "a multimap"], correctAnswer: "an array/vector indexed by the key — a perfect O(1) hash" },
    { text: "map/set/list share a memory cost:…", options: ["contiguous buffers", "a node allocated per element", "hash buckets", "nothing"], correctAnswer: "a node allocated per element" },
  ],

  // ── W18 · STL Algorithms & Smart Pointers ────────────────────────────────
  "The <algorithm> Toolbox": [
    { text: "`std::find_if(v.begin(), v.end(), pred)` returns…", options: ["a bool", "an iterator to the first element satisfying pred, or end()", "the count", "the index"], correctAnswer: "an iterator to the first element satisfying pred, or end()" },
    { text: "`std::nth_element` is valuable because…", options: ["it sorts everything", "it finds the k-th element in O(n) without a full sort", "it is stable", "it reverses"], correctAnswer: "it finds the k-th element in O(n) without a full sort" },
    { text: "std::stable_sort differs from std::sort by…", options: ["being slower always", "preserving the relative order of equal elements", "using more memory only", "requiring random access"], correctAnswer: "preserving the relative order of equal elements" },
    { text: "Hand-written loops usually lose to algorithms because…", options: ["loops are deprecated", "library implementations are carefully optimised and correct-by-construction", "algorithms are macros", "loops are slower syntax"], correctAnswer: "library implementations are carefully optimised and correct-by-construction" },
  ],
  "Lambda Expressions": [
    { text: "`[threshold](int x) { return x > threshold; }` captures threshold…", options: ["by reference", "by value", "by pointer", "not at all"], correctAnswer: "by value" },
    { text: "The risk of default `[&]` capture is…", options: ["it is slow", "the lambda can dangle if it outlives the captured scope", "it cannot compile", "it copies everything"], correctAnswer: "the lambda can dangle if it outlives the captured scope" },
    { text: "A lambda stored in auto…", options: ["is type-erased", "keeps its exact type and inlines", "uses a vtable", "is dynamic"], correctAnswer: "keeps its exact type and inlines" },
    { text: "std::function is appropriate when…", options: ["the hot path needs speed", "you must store heterogeneous callbacks (e.g. a handler table)", "you never store", "you use lambdas"], correctAnswer: "you must store heterogeneous callbacks (e.g. a handler table)" },
  ],
  "unique_ptr, shared_ptr, weak_ptr": [
    { text: "std::shared_ptr destroys its object when…", options: ["it goes out of scope", "the last shared_ptr referencing it is destroyed", "the program ends", "the heap is full"], correctAnswer: "the last shared_ptr referencing it is destroyed" },
    { text: "The purpose of std::weak_ptr is to…", options: ["own a resource", "break reference cycles and observe without keeping alive", "count refs", "allocate"], correctAnswer: "break reference cycles and observe without keeping alive" },
    { text: "The ownership default is…", options: ["shared_ptr", "unique_ptr — one clear owner is simpler and has no refcount", "weak_ptr", "raw new/delete"], correctAnswer: "unique_ptr — one clear owner is simpler and has no refcount" },
    { text: "Why always use make_unique/make_shared?", options: ["They are shorter", "They are exception-safe and avoid new/delete pairing bugs", "They are faster to compile", "They are required by the standard"], correctAnswer: "They are exception-safe and avoid new/delete pairing bugs" },
  ],
  "No-Overhead Loops with Algorithms": [
    { text: "Why do STL algorithms compile to the same code as hand-written loops?", options: ["they use macros", "they are templates inlined at the call site", "the runtime JITs them", "they call loops"], correctAnswer: "they are templates inlined at the call site" },
    { text: "The biggest way to lose that zero-cost property is…", options: ["using a lambda", "storing a lambda in std::function (type erasure + indirect call)", "using auto", "passing iterators"], correctAnswer: "storing a lambda in std::function (type erasure + indirect call)" },
    { text: "A hand loop genuinely wins over an algorithm when…", options: ["you prefer it", "the operation is bespoke with early exits that read awkwardly as a predicate", "the container is empty", "the loop is short"], correctAnswer: "the operation is bespoke with early exits that read awkwardly as a predicate" },
    { text: "`std::execution::par` on an algorithm…", options: ["breaks it", "enables vectorised/threaded execution", "is a syntax error", "disables templates"], correctAnswer: "enables vectorised/threaded execution" },
  ],

  // ── W19 · Move Semantics & Modern C++ ────────────────────────────────────
  "Lvalues, Rvalues & std::move": [
    { text: "Which of these is an rvalue?", options: ["x in `int x = 5;`", "`arr[0]`", "the temporary from `build_string()`", "`*p`"], correctAnswer: "the temporary from `build_string()`" },
    { text: "`std::string t = std::move(s);` transfers s's buffer in…", options: ["O(n) bytes copied", "O(1) — a pointer handover, leaving s empty-but-valid", "no time", "two steps"], correctAnswer: "O(1) — a pointer handover, leaving s empty-but-valid" },
    { text: "After a move, the source is…", options: ["destroyed", "valid but unspecified — safe to destroy or reassign, not to read meaningfully", "unchanged", "a copy"], correctAnswer: "valid but unspecified — safe to destroy or reassign, not to read meaningfully" },
    { text: "`std::move` is really…", options: ["a copy", "a cast that marks the operand as disposable", "a delete", "a template"], correctAnswer: "a cast that marks the operand as disposable" },
  ],
  "Move Constructors & Move Assignment": [
    { text: "The move constructor must, beyond stealing, …", options: ["copy the source", "disarm the source (e.g. null its pointer) so its destructor does not free the stolen buffer", "throw", "call delete"], correctAnswer: "disarm the source (e.g. null its pointer) so its destructor does not free the stolen buffer" },
    { text: "Marking move operations noexcept lets std::vector…", options: ["copy instead", "move elements on reallocation instead of copying them", "throw safely", "free memory"], correctAnswer: "move elements on reallocation instead of copying them" },
    { text: "Self-move assignment `x = std::move(x);` must be…", options: ["a compile error", "safe (guard with if (this != &o) or copy-and-swap)", "undefined", "forbidden"], correctAnswer: "safe (guard with if (this != &o) or copy-and-swap)" },
    { text: "With all-RAII members, correct move operations come from…", options: ["hand-written code", "= default", "macros", "virtuals"], correctAnswer: "= default" },
  ],
  "Perfect Forwarding (std::forward)": [
    { text: "In `template <typename T> void w(T&& x)`, T&& is…", options: ["an rvalue reference", "a forwarding reference that becomes T& for lvalues and T&& for rvalues", "a const reference", "a universal macro"], correctAnswer: "a forwarding reference that becomes T& for lvalues and T&& for rvalues" },
    { text: "Without forwarding, a wrapper that takes std::string by value…", options: ["preserves categories", "forces every argument through one copy/move, losing the caller's value category", "is faster", "is deleted"], correctAnswer: "forces every argument through one copy/move, losing the caller's value category" },
    { text: "std::move versus std::forward: move always casts to rvalue, forward…", options: ["always copies", "casts to rvalue only when T was deduced as an rvalue reference", "never casts", "casts to const"], correctAnswer: "casts to rvalue only when T was deduced as an rvalue reference" },
    { text: "A forwarded argument must be forwarded…", options: ["twice", "exactly once, at the final call", "never", "in a loop"], correctAnswer: "exactly once, at the final call" },
  ],
  "Modern C++ Features to Use Daily": [
    { text: "Structured bindings `auto [k, v] = *it;`…", options: ["copy the pair", "unpack a pair/tuple into named variables", "create a reference only", "are C++98"], correctAnswer: "unpack a pair/tuple into named variables" },
    { text: "`if (auto it = m.find(k); it != m.end())`…", options: ["is invalid syntax", "scopes the iterator to the if branch", "duplicates the lookup", "throws"], correctAnswer: "scopes the iterator to the if branch" },
    { text: "std::span (C++20) is…", options: ["an owning container", "a non-owning view of a contiguous buffer — an embedded favourite", "a smart pointer", "a string"], correctAnswer: "a non-owning view of a contiguous buffer — an embedded favourite" },
    { text: "On embedded toolchains, modern features like auto/range-for/if-constexpr…", options: ["cost flash and RAM", "compile away to zero runtime cost", "require an OS", "are banned"], correctAnswer: "compile away to zero runtime cost" },
  ],

  // ── W20 · Embedded C++ Project + Final Review ────────────────────────────
  "Bare-Metal C++ on a Microcontroller": [
    { text: "The startup path to main()…", options: ["is generated by the OS", "copies .data to RAM, zeroes .bss, sets the stack, then calls main()", "calls a bootloader", "runs a VM"], correctAnswer: "copies .data to RAM, zeroes .bss, sets the stack, then calls main()" },
    { text: "The typical bare-metal C++ flags are…", options: ["-fexceptions -frtti", "-std=c++17 -fno-exceptions -fno-rtti", "-fPIC -shared", "-O0 -g3 only"], correctAnswer: "-std=c++17 -fno-exceptions -fno-rtti" },
    { text: "Why C++ over C on a microcontroller?", options: ["C++ is slower", "classes wrap registers in tested interfaces and templates give zero-cost compile-time configuration", "C is banned", "C++ uses less flash always"], correctAnswer: "classes wrap registers in tested interfaces and templates give zero-cost compile-time configuration" },
    { text: "A bare-metal main() conventionally…", options: ["returns and exits", "loops forever driving the hardware", "calls the OS", "sleeps"], correctAnswer: "loops forever driving the hardware" },
  ],
  "Memory-Mapped I/O & volatile": [
    { text: "A memory-mapped register is accessed by…", options: ["a system call", "reading/writing its fixed address like a variable — via a volatile reference", "a driver file", "DMA only"], correctAnswer: "reading/writing its fixed address like a variable — via a volatile reference" },
    { text: "Without volatile, a register-poll loop at -O2 can…", options: ["run faster correctly", "have the read hoisted out of the loop — the hardware change is never seen", "overflow", "deadlock"], correctAnswer: "have the read hoisted out of the loop — the hardware change is never seen" },
    { text: "The classic heisenbug signature of missing volatile is…", options: ["works at -O0, breaks at -O2", "crashes always", "linker errors", "type errors"], correctAnswer: "works at -O0, breaks at -O2" },
    { text: "volatile is NOT…", options: ["needed for registers", "a concurrency lock", "a compiler barrier for that variable", "about hardware"], correctAnswer: "a concurrency lock" },
  ],
  "Placing Objects at Fixed Addresses (placement new)": [
    { text: "Placement new differs from regular new because it…", options: ["allocates twice", "runs the constructor at a given address without allocating", "never runs constructors", "is faster to type"], correctAnswer: "runs the constructor at a given address without allocating" },
    { text: "The lifetime responsibility with placement new is…", options: ["automatic via delete", "you call the destructor manually", "never cleaned", "handled by the GC"], correctAnswer: "you call the destructor manually" },
    { text: "The placement buffer must satisfy…", options: ["any size", "the object's alignment — use alignas(alignof(T))", "the heap alignment", "nothing"], correctAnswer: "the object's alignment — use alignas(alignof(T))" },
    { text: "For most 'construct in place without heap' needs, prefer…", options: ["placement new everywhere", "std::optional/std::variant which already do it safely", "malloc", "raw arrays"], correctAnswer: "std::optional/std::variant which already do it safely" },
  ],
  "Final Project & Certification Review": [
    { text: "The certification rubric checks that register writes…", options: ["are fast", "are hidden behind class methods (encapsulation)", "use macros", "are global"], correctAnswer: "are hidden behind class methods (encapsulation)" },
    { text: "Testing at both -O0 and -O2 in embedded…", options: ["is optional", "exposes missing volatile — the classic intermittent bug", "never helps", "is slower only"], correctAnswer: "exposes missing volatile — the classic intermittent bug" },
    { text: "The capstone architecture uses…", options: ["inheritance for everything", "RAII drivers, constexpr pin maps, volatile, and composition over inheritance", "global variables only", "no classes"], correctAnswer: "RAII drivers, constexpr pin maps, volatile, and composition over inheritance" },
    { text: "A good build discipline for the project is…", options: ["one big file", "module-by-module: each module compiles and passes a host test before the next", "compile only at the end", "disable warnings"], correctAnswer: "module-by-module: each module compiles and passes a host test before the next" },
  ],
};
