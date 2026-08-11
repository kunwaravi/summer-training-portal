// ============================================================================
// C & Systems Programming — Deep GfG-Style Curriculum (issue #92)
// ----------------------------------------------------------------------------
// Hand-written, original content. Each section carries 4–5 deep sub-topics
// (substantive teaching text + working code + a real-world note) and a set of
// distinct quizzes: 4 options, exactly one correct, including code-trace
// questions. Replaces the machine-generated template quizzes from seed.ts.
//
// Structure is intentionally plain so a reseed script can iterate it directly.
// ============================================================================

export interface CTopic {
  title: string;
  text: string; // Markdown body (GfG-style explanation)
  code: string; // Working, copyable example
  note: string; // Short real-world / exam-oriented takeaway
}

export interface CQuiz {
  text: string;
  options: string[]; // exactly 4
  correctAnswer: string; // one of options
}

export interface CSection {
  week: number;
  title: string;
  description: string;
  topics: CTopic[];
  quizzes: CQuiz[];
}

export const cSections: CSection[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 1 — Introduction to C & Environment Setup
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 1,
    title: 'Introduction to C & Environment Setup',
    description:
      'What C is, where it fits in computing history, how source becomes a running program, and a first working environment so you can run every later example.',
    topics: [
      {
        title: 'Why C Still Matters in 2026',
        text:
          'C was created by Dennis Ritchie at Bell Labs in 1972 to write the UNIX operating system. Fifty years later it is still the language of **operating systems, embedded firmware, device drivers, and every major language runtime**. Python, Java, Node.js and even Rust’s precursor are implemented in C.\n\nC gives you **direct control over memory** — you decide where data lives, how much space it occupies, and when it is freed. That control is exactly what an OS kernel, a microcontroller, or a networking stack needs. Higher-level languages hide this for safety; C exposes it for performance.\n\nFor hardware engineers this is decisive: a 4 KB RAM microcontroller cannot afford a garbage collector, but it runs C comfortably. The C standard is maintained by ISO/IEC; the modern version is **C17**, with **C23** ratified recently. Learning C is not learning a legacy language — it is learning the foundation underneath almost everything else you use.',
        code: '// Your first C program — every later section builds on this skeleton.\n#include <stdio.h>\n\nint main(void) {\n    printf("Hello from C!\\n");\n    return 0;\n}',
        note: 'Exam point: main() is the one function every program MUST have — the OS calls it first.',
      },
      {
        title: 'The Compilation Pipeline: Source to Binary',
        text:
          'C is a **compiled** language. Unlike Python, which a runtime reads line-by-line, a C file must be translated into machine code before it runs. The translation happens in four stages (all usually driven by one command, `gcc`):\n\n1. **Preprocessing** — `#include` and `#define` directives are expanded. The compiler literally pastes in the header file contents. The result is a bigger, still-textual `.i` file.\n2. **Compilation** — the preprocessed text is translated into **assembly** for your CPU (`.s` file).\n3. **Assembly** — the assembler turns assembly into **object code** (`.o`), raw machine instructions plus symbols.\n4. **Linking** — the linker combines your `.o` files with precompiled libraries (like `printf` from `libc`) into the final **executable**.\n\nYou rarely see these stages — `gcc hello.c -o hello` runs all four. But the pipeline explains common error messages: `undefined reference to \'printf\'` is a **linker** error meaning the function exists but the linker could not find its definition.',
        code: '# These four commands are what "gcc hello.c -o hello" does under the hood.\ngcc -E hello.c -o hello.i        # 1. Preprocess (expand #include / #define)\ngcc -S hello.i -o hello.s        # 2. Compile to assembly\ngcc -c hello.s -o hello.o        # 3. Assemble to object code\ngcc hello.o -o hello             # 4. Link with libc into an executable\n./hello                          # run it',
        note: 'Linked-list interview favourite: "Which stage turns C into assembly?" → the compiler, stage 2.',
      },
      {
        title: 'Setting Up: Compiler, Editor, and Terminal',
        text:
          'You need three tools: a **compiler** (translates C), an **editor** (writes it), and a **terminal** (runs it).\n\n- **Linux/macOS**: GCC ships with the system or via `sudo apt install gcc` / Xcode Command Line Tools. Check with `gcc --version`.\n- **Windows**: MinGW-w64 gives you GCC, or use **WSL** to get a real Linux environment. Many students prefer **Code::Blocks** or **VS Code** with the C/C++ extension.\n- **Online**: compiler explorer (godbolt.org) is excellent for watching assembly output instantly.\n\nA clean workflow is: write `program.c`, compile with warnings on (`gcc -Wall -Wextra program.c -o program`), and fix every warning — warnings are the compiler telling you a bug is likely. Never ship code that compiles with warnings.\n\nFor the exercises in this course, create one folder per section and keep every `.c` file there. When an example refuses to compile, read the **first** error line first: C compilers cascade errors from a single mistake, and only the first is usually real.',
        code: '# Linux quick install + a disciplined build command\nsudo apt update && sudo apt install -y gcc\n\ngcc --version                # confirm the compiler\nnano first.c                 # or any editor; write the Hello World above\n\ngcc -Wall -Wextra first.c -o first   # ALWAYS compile with warnings on\n./first                      # expect: Hello from C!',
        note: '`-Wall -Wextra` catches most "forgot a semicolon" and type mistakes at compile time — cheaper than a debugger later.',
      },
      {
        title: 'Anatomy of a C Program',
        text:
          'Every C program, however complex, is made of a few repeated pieces. Learn to recognise them at a glance:\n\n- **Preprocessor directives** start with `#` and are handled before compilation. `#include <stdio.h>` pulls in the *standard input/output* declarations so `printf` is known.\n- **The `main` function** is the entry point. Its return value is passed back to the OS — `0` (or `EXIT_SUCCESS`) means "everything went fine"; a non-zero value signals an error.\n- **Statements** end with a semicolon `;`. Forgetting it is the single most common beginner compile error.\n- **Blocks** are grouped with `{ }` and define *scope*: variables declared inside a block are invisible outside it.\n- **Comments** (`//` line, `/* */` block) are ignored by the compiler; they exist for humans.\n\nC is **case-sensitive**: `Main` and `main` are different identifiers. It is also a *free-form* language — whitespace is mostly cosmetic — but consistent indentation is non-negotiable for readable code.',
        code: '#include <stdio.h>      // preprocessor: pull in declarations\n\n/* main is where the OS\n   starts our program */\nint main(void) {\n    printf("Anatomy checked!\\n");\n    return 0;             // 0 => success to the shell\n}',
        note: '`int main(void)` (no parameters) is the textbook-safe signature; `void main()` is non-standard.',
      },
    ],
    quizzes: [
      {
        text: 'Who developed the C programming language?',
        options: ['Ken Thompson', 'Dennis Ritchie', 'Bjarne Stroustrup', 'James Gosling'],
        correctAnswer: 'Dennis Ritchie',
      },
      {
        text: 'Which stage of the pipeline expands `#include` and `#define` directives?',
        options: ['Compilation', 'Assembly', 'Preprocessing', 'Linking'],
        correctAnswer: 'Preprocessing',
      },
      {
        text: '`gcc -Wall -Wextra program.c -o program` — what does `-Wall` do?',
        options: [
          'Runs the program immediately',
          'Enables a broad set of compiler warnings',
          'Makes all variables global',
          'Links the math library',
        ],
        correctAnswer: 'Enables a broad set of compiler warnings',
      },
      {
        text: 'What does `return 0;` from `main` signal to the operating system?',
        options: [
          'The program crashed',
          'The program is still running',
          'The program completed successfully',
          'Memory is exhausted',
        ],
        correctAnswer: 'The program completed successfully',
      },
      {
        text: 'Which of the following is the standard, portable way to declare `main`?',
        options: [
          'void main()',
          'int main()',
          'main[]',
          'function main()',
        ],
        correctAnswer: 'int main()',
      },
      {
        text: 'What is the role of the linker (stage 4)?',
        options: [
          'Expands macros in the source',
          'Converts assembly to machine code',
          'Combines object files with libraries into one executable',
          'Runs the compiled binary',
        ],
        correctAnswer: 'Combines object files with libraries into one executable',
      },
      {
        text: 'In `printf("Hello");`, which part is the argument passed to the function?',
        options: [
          'printf',
          '"Hello"',
          ';',
          'int main(void)',
        ],
        correctAnswer: '"Hello"',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 2 — C Basics: Tokens, Keywords, Identifiers, Comments
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 2,
    title: 'C Basics: Tokens, Keywords, Identifiers, Comments',
    description:
      'The smallest building blocks of the language — tokens, reserved keywords, identifier rules — and how to document code with comments.',
    topics: [
      {
        title: 'Tokens: The Smallest Meaningful Units',
        text:
          'A C program, when stripped of whitespace, is a stream of **tokens** — the smallest pieces the compiler can recognise. There are six kinds:\n\n1. **Keywords** — reserved words with fixed meaning (`int`, `if`, `return`).\n2. **Identifiers** — names you invent (`count`, `studentAge`).\n3. **Constants** — literal values (`42`, `3.14`, `\'A\'`, `"text"`).\n4. **String literals** — text in double quotes (`"hello"`).\n5. **Operators** — symbols that perform actions (`+`, `==`, `&`).\n6. **Separators** — punctuation that structures code (`( ) { } , ;`).\n\nThis taxonomy matters for reading errors and for understanding later topics. `3` and `"3"` are different tokens — a number and a string — even though both look like "three". The compiler treats them completely differently: you cannot add a string literal with arithmetic `+`.',
        code: 'int count = 42;          // int, count, =, 42, ;  -> keywords, identifier, operator, constant, separator\nchar letter = \'A\';        // char is a keyword, A is a character constant\nprintf("hi");            // "hi" is a string literal token',
        note: 'Classification questions ("what kind of token is X?") appear in both viva and written exams — memorise the six kinds.',
      },
      {
        title: 'Keywords: The Reserved Words',
        text:
          'C reserves a fixed set of words that the compiler interprets specially. You **cannot** reuse them as variable or function names. There are 32 in classic C, plus a few conditional ones (`inline`, `restrict`, `_Bool`, `_Complex`, `_Imaginary`).\n\nCommon groups:\n- **Types**: `int`, `char`, `float`, `double`, `void`, `long`, `short`, `signed`, `unsigned`\n- **Control flow**: `if`, `else`, `switch`, `case`, `default`, `for`, `while`, `do`, `break`, `continue`, `goto`\n- **Storage/scope**: `auto`, `register`, `static`, `extern`, `const`, `volatile`, `typedef`\n- **Structs**: `struct`, `union`, `enum`\n- **Other**: `return`, `sizeof`, `void`\n\nTrying to write `int if = 5;` is a compile error — `if` is owned by the language. A common beginner mistake is naming a variable `class` or `delete`; those are fine in C (they are C++ keywords, not C keywords), but staying clear of any reserved word is cleaner and safer.',
        code: '// BAD: if, int, return are reserved — you cannot rename them\n// int if = 3;        // error\n\n// GOOD: choose descriptive, non-reserved names\nint studentCount = 3;\nif (studentCount > 0) {\n    printf("%d students\\n", studentCount);\n    return 0;\n}',
        note: 'An identifier colliding with a keyword is a *syntax error*, caught by the compiler before anything runs.',
      },
      {
        title: 'Identifiers: Naming Your Variables and Functions',
        text:
          'An **identifier** is a name you create for variables, functions, structs, and other entities. C has strict rules:\n\n- Must begin with a **letter** (`a`–`z`, `A`–`Z`) or **underscore** `_`.\n- Following characters may be letters, digits, or underscores.\n- **No spaces, no punctuation** (`-`, `.`, `@` are illegal).\n- **Cannot be a keyword**.\n- **Case-sensitive**: `Score`, `score`, and `SCORE` are three different variables.\n- Standard C only *guarantees* the first 63 characters are significant for internal names; identifiers starting with `_` at file scope are reserved for the implementation (avoid them).\n\nBeyond legality, use **meaningful names**: `marks` beats `m`, and `studentRollNumber` beats `s`. C has no built-in Hungarian notation or camelCase rule, but the community overwhelmingly uses `lowerCamelCase` or `snake_case`. Whatever you pick, be consistent — readability is a professional skill, not a style whim.',
        code: 'int total_marks = 92;    // valid (snake_case)\nfloat gpa2 = 8.7;         // valid (digit allowed after first char)\nfloat 2gpa = 8.7;         // INVALID: cannot start with a digit\nint final-marks = 10;     // INVALID: hyphen is not allowed\nint student name = 5;     // INVALID: space is not allowed',
        note: 'Rule to remember: **start with letter or underscore; then letters, digits, underscores only**.',
      },
      {
        title: 'Comments: Documenting Code for Humans',
        text:
          'Comments are ignored by the compiler but invaluable for anyone reading the code — including your future self. C has two forms:\n\n- **Line comment** `// ...` — everything to the end of the line is ignored. Best for short notes next to a line.\n- **Block comment** `/* ... */` — spans many lines. Useful for file headers and longer explanations.\n\nKey pitfalls:\n- Block comments **do not nest** in standard C. `/* outer /* inner */ still here */` ends at the first `*/`, leaving `still here */` as real code — usually a compile error.\n- Comments must say **why**, not restate *what*. `i++; // increment i` adds noise; `i++; // skip the header row` adds information.\n- Never leave commented-out code lying around in a final submission — delete it. Git keeps history; the comment does not need to.\n\nModern compilers and linters also treat `//` comments in the preprocessor and tricky macro code specially — keep macro-heavy code documented line by line.',
        code: '// This is a line comment — ends at the end of the line\n\n/* This is a\n   block comment — spans\n   multiple lines. */\n\nint x = 5;   // short inline note: starts with 5\n// x = 6;    // commented-out code: DELETE in final work',
        note: 'Interview nugget: `/* */` comments do not nest in C (they DO nest in some languages).',
      },
    ],
    quizzes: [
      {
        text: 'Which of the following is a VALID identifier in C?',
        options: ['2ndYear', 'roll-number', '_total', 'int'],
        correctAnswer: '_total',
      },
      {
        text: 'How many classic (core) reserved keywords does standard C define?',
        options: ['16', '32', '48', '64'],
        correctAnswer: '32',
      },
      {
        text: '`int class = 5;` — in standard C, is `class` allowed as an identifier?',
        options: [
          'No, it is a reserved keyword',
          'Yes, because class is not a C keyword (it is a C++ keyword)',
          'No, identifiers cannot be five letters long',
          'Yes, but only inside functions',
        ],
        correctAnswer: 'Yes, because class is not a C keyword (it is a C++ keyword)',
      },
      {
        text: 'Which is TRUE about block comments `/* ... */` in standard C?',
        options: [
          'They can be nested inside other block comments',
          'They cannot span multiple lines',
          'They terminate at the first `*/` — they do NOT nest',
          'They must start with `//`',
        ],
        correctAnswer: 'They terminate at the first `*/` — they do NOT nest',
      },
      {
        text: 'Which token is a SEPARATOR in `printf("x", a, b);`?',
        options: ['printf', '"x"', ',', 'a'],
        correctAnswer: ',',
      },
      {
        text: 'In C, are the identifiers `Score` and `score` the same variable?',
        options: [
          'Yes — C is case-insensitive',
          'No — C is case-sensitive',
          'Only inside the same function',
          'Only in global scope',
        ],
        correctAnswer: 'No — C is case-sensitive',
      },
      {
        text: '`int 2ndYear = 10;` — what happens?',
        options: [
          'It compiles but warns',
          'Compile error: identifiers cannot start with a digit',
          'It runs and stores 10',
          'It shadows the year variable',
        ],
        correctAnswer: 'Compile error: identifiers cannot start with a digit',
      },
      {
        text: '`printf("hello");` — what kind of token is `"hello"`?',
        options: ['Keyword', 'Identifier', 'String literal', 'Operator'],
        correctAnswer: 'String literal',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 3 — Variables, Data Types & Operators
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 3,
    title: 'Variables, Data Types & Operators',
    description:
      'How C stores data — the primitive types and their sizes — plus the full operator set and precedence rules.',
    topics: [
      {
        title: 'Primitive Data Types and Their Sizes',
        text:
          'C is a **statically typed** language: every variable has a type known at compile time, and that type fixes how much memory it occupies and how its bits are interpreted.\n\nThe fundamental types are:\n- `char` — one byte, holds a single character or a small integer.\n- `int` — the workhorse integer, **usually 4 bytes** on modern systems.\n- `float` — single-precision real number, **usually 4 bytes**.\n- `double` — double-precision real number, **usually 8 bytes**.\n- `void` — "no type", used for functions returning nothing and generic pointers.\n\n**Important:** the standard only guarantees minimums (`int` ≥ 2 bytes, `char` = 1). Actual sizes depend on the platform — that is why code that prints `sizeof(int)` gets different answers on an AVR (2) versus a desktop x86 (4). For portable exact-width integers C99 added `int32_t`, `uint8_t` etc. from `<stdint.h>`.\n\nQualifiers modify a type: `long int`, `short int`, `unsigned int`, `const`. `unsigned` changes the value range (0..65535 instead of -32768..32767 on a 2-byte int), doubling the positive range by dropping negatives.',
        code: '#include <stdio.h>\n#include <stdint.h>\n\nint main(void) {\n    printf("char:   %zu bytes\\n", sizeof(char));\n    printf("int:    %zu bytes\\n", sizeof(int));\n    printf("float:  %zu bytes\\n", sizeof(float));\n    printf("double: %zu bytes\\n", sizeof(double));\n    printf("int32_t: %zu bytes\\n", sizeof(int32_t));  // ALWAYS 4\n    return 0;\n}',
        note: '`sizeof` is an operator, not a function — so `sizeof(int)` needs no include and evaluates at compile time.',
      },
      {
        title: 'Declaring and Initialising Variables',
        text:
          'A **declaration** tells the compiler a variable’s name and type. **Initialisation** gives it a first value at the point of declaration. C does **not** zero-initialise local variables — reading an uninitialised local is **undefined behaviour** and commonly produces garbage values.\n\nRules and idioms:\n- Declare one variable per line with a meaningful name.\n- Initialise at declaration wherever you can: `int score = 0;`\n- Global and `static` variables ARE zero-initialised automatically; locals are not.\n- You may declare variables anywhere a statement is allowed (C99 onward) — the old "all declarations at the top" rule is obsolete but still seen.\n- **Casting** lets you convert between types explicitly: `(double)a / b`. Without it, `a / b` on two ints is integer division.\n\nThe classic pitfall is mixing ints and floats: `int a=7, b=2;` then `a/b` is **3** (integer division truncates), while `(double)a/b` is 3.5.',
        code: 'int total = 0;               // declared + initialised\nint sum;                      // declared, UNINITIALISED (garbage!)\n\nint a = 7, b = 2;\nprintf("%d\\n", a / b);        // 3  (integer division truncates)\nprintf("%.1f\\n", (double)a / b);  // 3.5 (cast fixes it)\n\nextern int globalValue;       // declaration only; defined elsewhere',
        note: 'Uninitialised-local bugs are the #1 cause of "random" outputs — always initialise.',
      },
      {
        title: 'Arithmetic, Relational & Logical Operators',
        text:
          'C’s operators fall into families:\n\n**Arithmetic**: `+ - * / %`. Note `/` on integers truncates, and `%` (modulo) works only on integers — `5 % 2` is `1`.\n\n**Relational**: `> < >= <= == !=` — produce `1` (true) or `0` (false). Watch the double-equal: `=` assigns, `==` compares.\n\n**Logical**: `&&` (AND), `||` (OR), `!` (NOT). These are **short-circuit** — in `a && b`, if `a` is false, `b` is never evaluated; in `a || b`, if `a` is true, `b` is skipped. This lets you write `ptr != NULL && *ptr == 5` safely.\n\n**Assignment**: `=`, plus compound `+= -= *= /= %=` (`x += 3` ≡ `x = x + 3`).\n\n**Increment/Decrement**: `++` and `--`. `x++` uses x then increments; `++x` increments then uses — a notorious source of confusion in `printf("%d %d", i++, i++)` (undefined behaviour — never do this).',
        code: 'int a = 10, b = 3;\nprintf("%d\\n", a / b);   // 3\nprintf("%d\\n", a % b);   // 1\nprintf("%d\\n", a > b);   // 1 (true)\nprintf("%d\\n", a == b);  // 0 (false)\n\nint x = 5;\nprintf("%d\\n", x++);    // prints 5, then x becomes 6\nprintf("%d\\n", ++x);    // x becomes 7, prints 7',
        note: 'Short-circuit `&&` / `||` make null-pointer checks before dereferences safe — a professional pattern.',
      },
      {
        title: 'Bitwise Operators and Operator Precedence',
        text:
          '**Bitwise** operators act on the individual bits of an integer — essential for embedded register work:\n- `&` bitwise AND, `|` bitwise OR, `^` bitwise XOR, `~` bitwise NOT\n- `<<` left shift (multiply by 2), `>>` right shift (divide by 2, roughly)\n\nExample: `0b1010 & 0b0110` = `0b0010`. These are the tools you use to set/clear/toggle bits in a hardware register: `REG |= (1 << 3);` sets bit 3 without touching the others.\n\n**Precedence** decides what `2 + 3 * 4` means (17, not 20 — `*` binds tighter). The full table is long, but the survival rules are:\n1. `()` — if unsure, parenthesise. Nobody marks down extra parentheses.\n2. Postfix `++ --` and `. ->` bind tightest, then unary `! ~ ++ -- - * &`, then `* / %`, then `+ -`, then shifts, then relationals, then `== !=`, then `&`, `^`, `|`, then `&&`, then `||`, then assignment.\n3. Assignment is almost the loosest — which is why `a = b = c = 5;` chains right-to-left.',
        code: 'unsigned char reg = 0x0F;\nreg = reg | (1 << 4);     // set bit 4  -> 0x1F\nreg = reg & ~(1 << 0);    // clear bit 0 -> 0x1E\n\nint result = 2 + 3 * 4;   // 14 (multiplication first)\nint safe   = (2 + 3) * 4; // 20 (parentheses win)',
        note: 'Register bit manipulation is THE embedded skill: `|` to set, `&~` to clear, `^` to toggle.',
      },
    ],
    quizzes: [
      {
        text: 'What is the result of `int a = 7, b = 2; a / b`?',
        options: ['3.5', '3', '4', 'Compile error'],
        correctAnswer: '3',
      },
      {
        text: 'What does `5 % 2` evaluate to in C?',
        options: ['2.5', '2', '1', '0'],
        correctAnswer: '1',
      },
      {
        text: '`unsigned int` on a 2-byte int can store values from 0 to …?',
        options: ['-32768..32767', '0..65535', '0..32767', '-65535..65535'],
        correctAnswer: '0..65535',
      },
      {
        text: 'Which operator turns `a` into a double in `(double)a / b`?',
        options: ['`/`', '`::`', 'A cast `(double)`', '`sizeof`'],
        correctAnswer: 'A cast `(double)`',
      },
      {
        text: 'In `a && b`, if `a` is false, what happens to `b`?',
        options: [
          '`b` is still evaluated',
          '`b` is NOT evaluated (short-circuit)',
          'The program crashes',
          '`b` is converted to int',
        ],
        correctAnswer: '`b` is NOT evaluated (short-circuit)',
      },
      {
        text: 'What is `2 + 3 * 4` in C?',
        options: ['20', '14', '24', '9'],
        correctAnswer: '14',
      },
      {
        text: 'Which expression sets bit 3 of `reg` without altering other bits?',
        options: ['reg = 3;', 'reg |= (1 << 3);', 'reg &= 3;', 'reg ^= 8;'],
        correctAnswer: 'reg |= (1 << 3);',
      },
      {
        text: '`int x = 5; printf("%d", x++);` — what is printed?',
        options: ['6', '5', '0', 'Undefined'],
        correctAnswer: '5',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 4 — Input/Output & Format Specifiers
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 4,
    title: 'Input/Output & Format Specifiers',
    description:
      'The `printf` / `scanf` families, format specifiers, width and precision, and the classic buffer pitfalls.',
    topics: [
      {
        title: 'printf: Formatted Output',
        text:
          '`printf` writes formatted text to the standard output. Its first argument is a **format string**; the rest are values that fill in the placeholders (format specifiers), which begin with `%`.\n\nCore specifiers:\n- `%d` / `%i` — signed integer (`int`)\n- `%u` — unsigned integer\n- `%f` — `float` (promoted to double)\n- `%lf` — `double`\n- `%c` — single character\n- `%s` — string (a `char` array)\n- `%x` — hex, `%o` — octal\n- `%zu` — `size_t` (what `sizeof` returns)\n- `%p` — pointer address\n- `%e` / `%g` — scientific / shortest representation\n\n**Width and precision**: `%5d` pads to 5 characters wide; `%-5d` left-aligns; `%.2f` forces 2 decimal places; `%08d` zero-pads. Mixing them gives clean column output.\n\nA critical rule: the **number and type of arguments must match the specifiers**. Passing an `int` where `%lf` expects a `double` is undefined behaviour — often printing garbage. Enable compiler warnings (`-Wall -Wformat`) to catch mismatches.',
        code: 'int age = 20;\nfloat pi = 3.14159;\ndouble g = 9.81;\n\nprintf("Age: %d\\n", age);\nprintf("Pi: %.2f\\n", pi);          // 3.14\nprintf("Grav: %.1lf\\n", g);        // 9.8\nprintf("Left: %-6d|\\n", 42);       // "42    |"\nprintf("Zero-pad: %04d\\n", 7);     // 0007',
        note: '`%f` expects a float-promoted-to-double; `%lf` is for double. Wrong match = garbage output.',
      },
      {
        title: 'scanf: Reading Formatted Input',
        text:
          '`scanf` reads input and stores it into variables. The critical difference from `printf`: **you must pass the address of each variable** using `&` (except for strings/arrays, which already decay to a pointer).\n\n```c\nint n;\nscanf("%d", &n);      // & is mandatory for non-array variables\n```\n\nForgetting the `&` is the single most common scanf bug — `scanf` writes to the address you give it, so passing the *value* (`n`) makes it write to an illegal address and crash.\n\nA whitespace character in the format string (`scanf(" %c", &ch);`) skips any leading whitespace — this is the standard fix for the "scanf left a newline in the buffer" problem: after reading a number, the Enter key remains; the next `%c` or `%s` may consume it unexpectedly.\n\n`scanf` returns the number of items successfully matched. **Always check it**: `if (scanf("%d", &n) != 1) { /* handle bad input */ }` protects against garbage in the stream.',
        code: 'int age;\nchar first;\n\nprintf("Enter age: ");\nif (scanf("%d", &age) != 1) {      // check return!\n    printf("Bad input!\\n");\n    return 1;\n}\n\nprintf("Enter a letter: ");\nscanf(" %c", &first);    // leading space skips leftover newline',
        note: '`scanf("%d", &n)` — the `&` operator gives scanf the memory address to write into.',
      },
      {
        title: 'Character & String Input: getchar, gets vs fgets',
        text:
          'Beyond `scanf`, C offers character-oriented and line-oriented input:\n\n- `int getchar(void)` — reads one character, returns its `int` code (or `EOF`).\n- `int putchar(int c)` — writes one character.\n- `fgets(char *s, int n, FILE *stream)` — reads a **line** up to `n-1` chars, null-terminating it; the safest string reader.\n- `gets(char *s)` — reads a line with **no bounds check**. It is so dangerous (buffer overflow on long input) that it was **removed from C11**. Never use it.\n\n`fgets` keeps the trailing newline in the buffer, which often surprises beginners — you typically strip it: `buf[strcspn(buf, "\\n")] = 0;`.\n\nThe lesson is about **buffer safety**: unbounded input into a fixed-size array is the classic buffer-overflow vulnerability. Bounded functions (`fgets`, `snprintf`, `strncpy`) are the C way to write safe code.',
        code: '#include <stdio.h>\n#include <string.h>\n\nchar line[50];\nprintf("Enter your name: ");\nfgets(line, sizeof(line), stdin);      // SAFE: bounded\nline[strcspn(line, "\\n")] = 0;        // strip the newline\nprintf("Hello, %s!\\n", line);\n\n// NEVER use gets(name); — unbounded, removed in C11',
        note: '`gets()` was removed from the standard — any code using it is a security defect.',
      },
    ],
    quizzes: [
      {
        text: 'Which format specifier correctly prints a `double`?',
        options: ['%d', '%f', '%lf', '%s'],
        correctAnswer: '%lf',
      },
      {
        text: 'What does `scanf("%d", n)` (missing `&`) typically cause?',
        options: [
          'It compiles fine and works',
          'A compile-time syntax error',
          'Writing to an invalid address — crash or undefined behaviour',
          'It silently ignores the input',
        ],
        correctAnswer: 'Writing to an invalid address — crash or undefined behaviour',
      },
      {
        text: 'What does `%.2f` do in `printf`?',
        options: [
          'Prints the number 2 twice',
          'Forces 2 decimal places',
          'Prints 2 characters of the number',
          'Left-aligns to 2 spaces',
        ],
        correctAnswer: 'Forces 2 decimal places',
      },
      {
        text: 'Why is `gets()` dangerous and removed from C11?',
        options: [
          'It is too slow',
          'It has no bounds check — can overflow the buffer',
          'It only reads integers',
          'It returns the wrong type',
        ],
        correctAnswer: 'It has no bounds check — can overflow the buffer',
      },
      {
        text: 'After `scanf("%d", &n);` the leftover Enter key stays in the buffer. How do you safely read the next character?',
        options: [
          'Use `scanf(" %c", &ch);` with a leading space',
          'Use `scanf("%c", &ch);` without any space',
          'Call `gets()` first',
          'Cast the int to char',
        ],
        correctAnswer: 'Use `scanf(" %c", &ch);` with a leading space',
      },
      {
        text: 'What does `%04d` print for the value `7`?',
        options: ['7   ', '0007', '7.000', '0.07'],
        correctAnswer: '0007',
      },
      {
        text: 'What does `fgets(line, 50, stdin)` guarantee?',
        options: [
          'It reads exactly 50 characters',
          'It reads at most 49 characters plus a null terminator',
          'It reads until two newlines',
          'It never stores a newline',
        ],
        correctAnswer: 'It reads at most 49 characters plus a null terminator',
      },
      {
        text: 'What does `scanf` return?',
        options: [
          'The first matched value',
          'The number of items successfully matched',
          'The address of the buffer',
          'Always 0',
        ],
        correctAnswer: 'The number of items successfully matched',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 5 — Decision Making: if-else, switch
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 5,
    title: 'Decision Making: if-else, switch',
    description:
      'Branching logic with if-else ladders, ternary expressions, and switch-case — plus the classic dangling-else and fallthrough pitfalls.',
    topics: [
      {
        title: 'if, else and the else-if Ladder',
        text:
          'The `if` statement executes a block when a condition is true, and `else` runs when it is false. The condition is any expression that evaluates to non-zero (true) or zero (false).\n\n**else-if ladder** chains many mutually-exclusive checks:\n\n```c\nif (score >= 90)      grade = \'A\';\nelse if (score >= 75) grade = \'B\';\nelse if (score >= 60) grade = \'C\';\nelse                  grade = \'D\';\n```\n\nCritical pitfalls:\n1. **`=` vs `==`**: `if (x = 5)` assigns 5 and is always true. The classic guard is `if (5 == x)` — if you typo to `5 = x` it won’t compile.\n2. **Dangling else**: an `else` binds to the **nearest unmatched `if`**. If your braces are missing, `else` may attach to the wrong `if`. Always use braces.\n3. A `;` right after `if (cond);` creates an **empty statement** — the block after it runs unconditionally.',
        code: 'int score = 82;\nchar grade;\n\nif (score >= 90) {\n    grade = \'A\';\n} else if (score >= 75) {\n    grade = \'B\';\n} else {\n    grade = \'C\';\n}\nprintf("Grade: %c\\n", grade);  // B',
        note: '`if (x = 5)` is a silent bug — always prefer `if (5 == x)` for constants.',
      },
      {
        title: 'The Ternary Operator (?:)',
        text:
          'The ternary operator is a compact if-else **expression**: `condition ? value_if_true : value_if_false`. It produces a value, so it can appear inside assignments, returns, and printf arguments.\n\n```c\nint max = (a > b) ? a : b;    // max is the larger of a,b\nprintf("%s", (age >= 18) ? "adult" : "minor");\n```\n\nIt is ideal for single-value choices and reads clearly. But **nested ternaries become unreadable** — `a ? b : c ? d : e` binds right-to-left and confuses everyone. If you need more than one level, use a real if-else.\n\nStyle rule: use ternary for a *choice between two values*, not for statements with side effects. `(ok) ? doA() : doB();` works but is frowned upon — a plain if-else is clearer for actions.',
        code: 'int a = 9, b = 12;\nint max = (a > b) ? a : b;\nprintf("Max: %d\\n", max);            // 12\n\nint n = 7;\nprintf("%s\\n", (n % 2 == 0) ? "even" : "odd");  // odd',
        note: 'Ternary is an *expression* — it returns a value, so it works in printf arguments.',
      },
      {
        title: 'switch-case: Multi-way Branching',
        text:
          '`switch` compares one integer/character expression against several `case` constants. It is cleaner than a long else-if chain when testing a single variable for many exact values.\n\n```c\nswitch (day) {\n    case 1: printf("Monday");    break;\n    case 2: printf("Tuesday");   break;\n    default: printf("Unknown");\n}\n```\n\nRules and pitfalls:\n- Each `case` must be a **constant expression** (integer or character literal); ranges and variables are not allowed.\n- **Fallthrough**: without `break`, execution *falls through* to the next case. Sometimes intentional (grouping cases: `case 1: case 2: ...`), usually a bug.\n- `default` runs when nothing matches; it need not be last.\n- `case` labels can appear in any order.\n- You cannot have duplicate `case` values.\n- No `continue`/variable declarations directly in a case without braces in older standards — keep it simple.',
        code: 'int day = 3;\nswitch (day) {\n    case 1: printf("Monday\\n");    break;\n    case 2: printf("Tuesday\\n");   break;\n    case 3: printf("Wednesday\\n"); break;\n    default: printf("Weekend?\\n");\n}\n// Output: Wednesday',
        note: 'Forgotten `break` = fallthrough: the next case runs too. Grouped cases are the only intentional fallthrough.',
      },
    ],
    quizzes: [
      {
        text: 'What does `if (x = 5)` do in C?',
        options: [
          'Compares x to 5',
          'Assigns 5 to x and is always true',
          'Causes a compile error always',
          'Runs only when x equals 5',
        ],
        correctAnswer: 'Assigns 5 to x and is always true',
      },
      {
        text: 'Which expression returns the larger of `a` and `b`?',
        options: [
          'a > b ? b : a',
          '(a > b) ? a : b',
          '(a > b) : a ? b',
          'a ? b : (a > b)',
        ],
        correctAnswer: '(a > b) ? a : b',
      },
      {
        text: 'In C, an `else` binds to …?',
        options: [
          'The first if in the file',
          'The nearest unmatched if (dangling else)',
          'The last if in the block',
          'Always the outermost if',
        ],
        correctAnswer: 'The nearest unmatched if (dangling else)',
      },
      {
        text: 'What happens in `switch` when a `case` has no `break` and matches?',
        options: [
          'The program exits the switch',
          'Execution falls through to the next case',
          'A compile error occurs',
          'The default case runs only',
        ],
        correctAnswer: 'Execution falls through to the next case',
      },
      {
        text: 'Which values are allowed in a `case` label?',
        options: [
          'Any variable expression',
          'Integer or character constants only',
          'Strings only',
          'Float constants only',
        ],
        correctAnswer: 'Integer or character constants only',
      },
      {
        text: 'What does `if (score >= 90) grade = \'A\'; else if (score >= 75) grade = \'B\';` give for score = 80?',
        options: ["'A'", "'B'", "'C'", "Undefined"],
        correctAnswer: "'B'",
      },
      {
        text: 'What is the value of `(n % 2 == 0) ? "even" : "odd"` when n = 7?',
        options: ['even', 'odd', '0', 'Compile error'],
        correctAnswer: 'odd',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 6 — Loops: for, while, do-while
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 6,
    title: 'Loops: for, while, do-while',
    description:
      'Iteration with while, do-while, and for loops, break/continue, nested loops, and infinite-loop pitfalls.',
    topics: [
      {
        title: 'The while Loop',
        text:
          '`while (condition) { body }` repeats the body **as long as the condition stays true**. The condition is checked *before* each iteration — if it is false at the start, the body never runs.\n\nClassic pattern: a counter or sentinel drives the loop.\n\n```c\nint i = 0;\nwhile (i < 5) {\n    printf("%d ", i);\n    i++;          // crucial: without this, infinite loop\n}\n```\n\nThe #1 while-loop bug is an **infinite loop** — forgetting to change the condition variable means `i < 5` never becomes false. If your program "hangs", the loop is almost always the cause.\n\nA second pattern reads until a sentinel or end-of-input: `while (scanf("%d", &n) == 1)` or `while ((c = getchar()) != EOF)`. These use the value returned by an expression, then check it — idiomatic C.',
        code: '#include <stdio.h>\nint main(void) {\n    int i = 0;\n    while (i < 5) {\n        printf("i = %d\\n", i);\n        i++;\n    }\n    return 0;\n}\n// prints i = 0 .. i = 4',
        note: 'Terminate the loop by changing its condition variable, or you get an infinite loop.',
      },
      {
        title: 'The do-while Loop: Always Runs Once',
        text:
          '`do { body } while (condition);` checks the condition **after** each iteration — so the body executes **at least once**, even if the condition is false from the start. Note the required trailing semicolon.\n\nThis makes do-while perfect for **menus** and **input validation**, where you must show the prompt once before checking whether to continue:\n\n```c\nint choice;\ndo {\n    printf("1. Start\\n2. Exit\\nChoose: ");\n    scanf("%d", &choice);\n} while (choice < 1 || choice > 2);\n```\n\nCompare: the same logic with `while` needs the body duplicated or a pre-initialised flag. The semantic difference — "run first, ask later" — is the entire reason do-while exists. Every quiz on this topic tests whether you know the body runs once before any condition check.',
        code: 'int num;\ndo {\n    printf("Enter a positive number: ");\n    scanf("%d", &num);\n} while (num <= 0);\nprintf("You entered %d\\n", num);',
        note: 'do-while = runs at least once; remember the semicolon after `while(cond);`.',
      },
      {
        title: 'The for Loop: Init, Condition, Update',
        text:
          'The `for` loop packs three jobs into one header: `for (initialisation; condition; update)`. It is the natural choice when you know how many iterations you need.\n\n```c\nfor (int i = 0; i < 10; i++) { ... }\n```\n\n- **Initialisation** runs once before the loop (`int i = 0`).\n- **Condition** is checked before each iteration (`i < 10`).\n- **Update** runs after each body (`i++`).\n\nAny part can be empty: `for (;;)` is an infinite loop (like `while(1)`). `for (; cond; )` works like a while loop.\n\nCount **from 0**: `for (int i = 0; i < n; i++)` is the universal idiom for arrays. Off-by-one errors — writing `<= n` or starting at 1 — are the most common loop bugs in C.\n\nA common interview trap is asking how many times `for (int i = 0; i <= 5; i++)` runs: the answer is **6**, because the condition uses `<=` (0,1,2,3,4,5).',
        code: 'for (int i = 0; i < 5; i++) {\n    printf("%d ", i);\n}\n// prints: 0 1 2 3 4\n\n// same thing as a while loop:\nint j = 0;\nwhile (j < 5) { printf("%d ", j); j++; }',
        note: '`for (i=0; i<n; i++)` runs exactly n times when counting from 0.',
      },
      {
        title: 'break, continue, and Nested Loops',
        text:
          '`break` **exits the innermost loop** immediately; `continue` **skips the rest of the current iteration** and jumps to the update/condition. They give loops finer control.\n\n```c\nfor (int i = 0; i < 10; i++) {\n    if (i == 3) continue;   // skip 3\n    if (i == 7) break;      // stop at 7\n    printf("%d ", i);       // 0 1 2 4 5 6\n}\n```\n\nIn **nested loops**, `break` only exits the innermost one. To break out of an outer loop you need a flag, a `goto`, or to restructure — most coders use a flag (`bool found;`).\n\nA common use of `break` in a search loop: scan an array until you find the target, then exit. A common `continue` use: skip invalid entries in a data-processing loop. Both are cleaner than adding extra boolean conditions everywhere.',
        code: 'for (int i = 0; i < 4; i++) {\n    for (int j = 0; j < 4; j++) {\n        if (j == 2) break;          // breaks INNER loop only\n        printf("(%d,%d) ", i, j);\n    }\n}\n// prints (0,0)(0,1) (1,0)(1,1) (2,0)(2,1) (3,0)(3,1)',
        note: '`break` exits only the innermost loop — outer loops keep running.',
      },
    ],
    quizzes: [
      {
        text: 'Which loop guarantees its body executes at least once?',
        options: ['while', 'do-while', 'for', 'All of these'],
        correctAnswer: 'do-while',
      },
      {
        text: 'How many times does `for (int i = 0; i <= 5; i++)` iterate?',
        options: ['5', '6', '4', 'Infinite'],
        correctAnswer: '6',
      },
      {
        text: 'What is `for (;;)`?',
        options: [
          'A syntax error',
          'An infinite loop',
          'A loop that runs once',
          'A loop that never compiles',
        ],
        correctAnswer: 'An infinite loop',
      },
      {
        text: 'In a nested loop, what does `break` exit?',
        options: [
          'All loops',
          'The outermost loop',
          'Only the innermost loop',
          'The current iteration only',
        ],
        correctAnswer: 'Only the innermost loop',
      },
      {
        text: 'What does `continue` do in a loop body?',
        options: [
          'Exits the loop',
          'Skips the rest of the current iteration and goes to update/condition',
          'Restarts the program',
          'Skips the next iteration only',
        ],
        correctAnswer: 'Skips the rest of the current iteration and goes to update/condition',
      },
      {
        text: 'Which statement correctly describes the condition in `while (i < 5)`?',
        options: [
          'Checked after each iteration',
          'Checked before each iteration',
          'Checked only once',
          'Never checked',
        ],
        correctAnswer: 'Checked before each iteration',
      },
      {
        text: '`int i = 0; while (i < 3) { printf("%d ", i); i++; }` — what prints?',
        options: ['0 1 2', '1 2 3', '0 1 2 3', 'Infinite loop'],
        correctAnswer: '0 1 2',
      },
      {
        text: 'What is missing from `do { printf("x"); } while (x < 3)`?',
        options: [
          'Nothing — it is correct',
          'A semicolon after the while condition',
          'A condition inside the body',
          'A return statement',
        ],
        correctAnswer: 'A semicolon after the while condition',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 7 — Functions
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 7,
    title: 'Functions',
    description:
      'Breaking programs into reusable functions: declaration vs definition, parameters and pass-by-value, return values, and prototypes.',
    topics: [
      {
        title: 'Why Functions? Reusable, Testable Code',
        text:
          'A **function** is a named block of code that performs one task and can be called from anywhere. Functions are how C programs grow beyond a single `main`.\n\nBenefits:\n- **Reusability** — write once, call many times.\n- **Modularity** — each function has one responsibility, making code readable.\n- **Testability** — a small function is easy to verify in isolation.\n- **Abstraction** — callers use the interface, not the internals.\n\nA function is made of three parts:\n1. **Function declaration / prototype** — tells the compiler the signature: `int add(int a, int b);`.\n2. **Function definition** — the actual body: `int add(int a, int b) { return a + b; }`.\n3. **Function call** — using it: `int s = add(2, 3);`.\n\nIn modern C, every function you call *before* defining it needs a prototype earlier in the file — otherwise the compiler assumes it returns `int`, which is a bug source in C99+. Headers exist precisely to share prototypes.',
        code: '#include <stdio.h>\n\n// Prototype (declaration)\nint add(int a, int b);\n\nint main(void) {\n    int s = add(2, 3);\n    printf("Sum = %d\\n", s);\n    return 0;\n}\n\n// Definition\nint add(int a, int b) {\n    return a + b;\n}',
        note: 'Prototypes let you call a function before its definition appears in the file.',
      },
      {
        title: 'Parameters, Arguments & Pass-by-Value',
        text:
          'When you call `add(2, 3)`, the values `2` and `3` are **arguments** (actual parameters). Inside the function, `a` and `b` are **parameters** (formal parameters) — fresh local variables that receive *copies* of the arguments.\n\nC always passes **by value**: the function gets a copy, so modifying a parameter inside the function does **not** change the caller’s variable.\n\n```c\nvoid doubleIt(int x) { x = x * 2; }   // modifies the COPY\n\nint main(void) {\n    int n = 5;\n    doubleIt(n);\n    printf("%d\\n", n);   // still 5!\n}\n```\n\nThis is the single most important fact about C functions, and the reason pointers exist (Section 11): to let a function modify a caller’s variable, you pass its *address*. Pass-by-value is also why passing a large struct copies it wholesale — sometimes you pass a pointer for efficiency instead.',
        code: '#include <stdio.h>\n\nvoid change(int x) {\n    x = 100;                 // only the copy changes\n}\n\nint main(void) {\n    int n = 5;\n    change(n);\n    printf("%d\\n", n);       // 5 — n is unchanged\n    return 0;\n}',
        note: 'C is pass-by-value: functions receive copies; changes never leak back to the caller.',
      },
      {
        title: 'Return Values and void',
        text:
          'A function returns a value with `return expression;`. The return type is declared before the function name. Functions that produce no value declare `void` and may use bare `return;` to exit early.\n\nRules:\n- The return type and every `return` statement must agree. Returning nothing from a non-void function is **undefined behaviour** (only `main` gets a free pass, returning 0 implicitly since C99).\n- `return` also exits the function immediately — useful for early exits on error: `if (!valid) return -1;`.\n- A function can return **only one** value directly. To return several results you pass pointers (out-parameters) or a struct.\n- The caller may ignore the return value, but you lose error information if you do.\n\n`main` returns `int` to the OS: 0 = success, non-zero = error. Many shells check it: a non-zero exit makes `&&` chains stop and CI fail.',
        code: '#include <stdio.h>\n\nint max(int a, int b) {\n    if (a > b) return a;\n    return b;             // no else needed — return exits\n}\n\nvoid greet(const char *name) {\n    if (!name) return;    // early exit\n    printf("Hi, %s!\\n", name);\n}\n\nint main(void) {\n    printf("Max: %d\\n", max(9, 12));\n    greet("Rahul");\n    return 0;\n}',
        note: 'One function, one `return` value — multiple results need pointers or structs.',
      },
      {
        title: 'The Call Stack: How Calls Really Work',
        text:
          'Every call pushes a **stack frame** onto the call stack — a memory region holding the function’s local variables, parameters, and return address. When the function returns, its frame is popped.\n\nImplications:\n- Each call has **isolated locals** — recursive calls get their own copies (Section 8).\n- Deep recursion can **overflow the stack** (stack overflow) if frames pile up faster than they pop.\n- The **return address** is stored, so `return` knows where to resume in the caller.\n- Stack memory is automatically reclaimed — that is why a local variable’s address is "invalid" after the function returns (returning `&local` is a bug).\n\nUnderstanding the stack demystifies recursion, scoping, and the famous "stack overflow" website name. It is also why calling a function is not free: each call has bookkeeping overhead, though compilers may inline small functions to avoid it.',
        code: 'int inner(void) { return 42; }      // frame pushed, then popped\n\nint outer(void) {\n    int v = inner();                // caller frame + callee frame\n    return v + 1;                   // 43\n}\n\nint main(void) {\n    printf("%d\\n", outer());\n    return 0;\n}',
        note: 'Recursion works because each call gets its own stack frame with independent locals.',
      },
    ],
    quizzes: [
      {
        text: 'C functions pass arguments …?',
        options: [
          'By reference',
          'By value (a copy)',
          'By address always',
          'By name',
        ],
        correctAnswer: 'By value (a copy)',
      },
      {
        text: 'What is a function prototype?',
        options: [
          'The function body',
          'A declaration of the function signature before its use',
          'A call to the function',
          'A macro definition',
        ],
        correctAnswer: 'A declaration of the function signature before its use',
      },
      {
        text: '`void change(int x){ x = 100; }` then `change(n);` — what is n afterwards?',
        options: ['100', '0', 'Unchanged (the copy changed)', 'Undefined'],
        correctAnswer: 'Unchanged (the copy changed)',
      },
      {
        text: 'How many values can a C function return directly?',
        options: ['Unlimited', 'Two', 'One', 'Depends on the compiler'],
        correctAnswer: 'One',
      },
      {
        text: 'What happens if a non-void function reaches its end without a return?',
        options: [
          'It returns 0 automatically',
          'Undefined behaviour (garbage value returned)',
          'Compile error always',
          'It crashes the program',
        ],
        correctAnswer: 'Undefined behaviour (garbage value returned)',
      },
      {
        text: 'What is stored in a function’s stack frame?',
        options: [
          'Only the return value',
          'Local variables, parameters, and the return address',
          'The entire program code',
          'Global variables',
        ],
        correctAnswer: 'Local variables, parameters, and the return address',
      },
      {
        text: 'Why can recursion work without variables overwriting each other?',
        options: [
          'Recursion copies global memory',
          'Each call gets its own stack frame with independent locals',
          'C forbids recursion',
          'The compiler inlines everything',
        ],
        correctAnswer: 'Each call gets its own stack frame with independent locals',
      },
      {
        text: '`int add(int a, int b) { return a + b; }` — calling `add(2, 3)` returns?',
        options: ['5', '23', '6', 'Undefined'],
        correctAnswer: '5',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 8 — Scope, Storage Classes & Recursion
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 8,
    title: 'Scope, Storage Classes & Recursion',
    description:
      'Where variables live and how long they persist (auto, register, static, extern), plus recursion and its cost.',
    topics: [
      {
        title: 'Local vs Global Scope',
        text:
          '**Scope** defines where an identifier is visible. In C, scope is determined by *blocks* (`{ }`) and files.\n\n- **Local variables** are declared inside a function/block. They are visible only within that block (and nested blocks) and are created each time the block runs.\n- **Global variables** are declared outside any function. They are visible from the declaration point to the end of the file (and, with `extern`, to other files). They are initialised to 0 automatically.\n\nA local variable **shadows** a global of the same name inside its block — the inner declaration wins. Naming a local the same as a global is legal but confusing; linters flag it.\n\nRule of thumb: prefer locals. Globals create hidden coupling — any function can change them, which makes bugs hard to trace. Use globals sparingly (configuration constants are a good use), and make them `const` when they never change.',
        code: 'int global = 10;          // global: visible file-wide\n\nvoid func(void) {\n    int local = 5;         // local: only inside func\n    int global = 99;       // shadows the global inside func!\n    printf("%d %d\\n", local, global);  // 5 99\n}\n\nint main(void) {\n    printf("%d\\n", global);   // 10 — global unchanged\n    return 0;\n}',
        note: 'A local with the same name as a global shadows it — the inner one wins.',
      },
      {
        title: 'Storage Classes: auto, register, static, extern',
        text:
          'A **storage class** controls a variable’s lifetime, scope, and default value.\n\n- **`auto`** — default for locals; created on entry, destroyed on exit. You almost never write it (it is implied).\n- **`register`** — a *hint* to the compiler: "this variable is hot, put it in a CPU register". Compilers today ignore or optimise it; you cannot take its address. Rarely written.\n- **`static`** (local) — the variable lives for the **whole program**, but is visible only in its block. It keeps its value between calls.\n- **`static`** (global) — limits visibility to the current file (internal linkage). Great for "module-private" helpers.\n- **`extern`** — "this is defined elsewhere" — lets one file use a global defined in another. The definition is not `extern`; the reference is.\n\nDefault values: locals (`auto`) are **uninitialised** (garbage); globals and `static` locals are **zero-initialised** automatically.',
        code: '#include <stdio.h>\n\nvoid counter(void) {\n    static int count = 0;   // keeps value between calls\n    count++;\n    printf("called %d time(s)\\n", count);\n}\n\nint main(void) {\n    counter();   // called 1 time(s)\n    counter();   // called 2 time(s)\n    counter();   // called 3 time(s)\n    return 0;\n}',
        note: 'A `static` local initialised to 0 is initialised ONCE — it keeps its value across calls.',
      },
      {
        title: 'Recursion: Functions Calling Themselves',
        text:
          '**Recursion** is when a function calls itself. It works because each call gets its own stack frame. A correct recursive function needs:\n\n1. **A base case** — a condition that stops the recursion.\n2. **A recursive step** — a call that moves toward the base case.\n\nFactorial is the canonical example: `n! = n × (n-1)!` with base case `0! = 1`.\n\n```c\nint factorial(int n) {\n    if (n <= 1) return 1;        // base case\n    return n * factorial(n - 1); // recursive step\n}\n```\n\nEvery recursive function *can* be written with loops (iteration) — recursion is not magic, just a different structure that often mirrors the problem. The costs are stack frames (memory) and call overhead.\n\nMissing base case = **infinite recursion** = stack overflow crash. Always test the base case with a small input (`factorial(0)`, `factorial(1)`).',
        code: '#include <stdio.h>\n\nint factorial(int n) {\n    if (n <= 1) return 1;          // base case stops it\n    return n * factorial(n - 1);   // each call: n, n-1, n-2, ...\n}\n\nint main(void) {\n    printf("%d\\n", factorial(5));  // 120\n    return 0;\n}',
        note: 'Base case + progress toward it. `factorial(5)` = 120 = 5×4×3×2×1.',
      },
    ],
    quizzes: [
      {
        text: 'A `static` local variable is …?',
        options: [
          'Destroyed on function exit',
          'Created once and keeps its value between calls',
          'Visible across all files',
          'Stored in a register',
        ],
        correctAnswer: 'Created once and keeps its value between calls',
      },
      {
        text: 'Which storage class means "defined in another file"?',
        options: ['static', 'register', 'extern', 'auto'],
        correctAnswer: 'extern',
      },
      {
        text: 'What is the default value of an uninitialised global variable?',
        options: ['Garbage', '0', '1', 'Undefined behaviour'],
        correctAnswer: '0',
      },
      {
        text: 'What is the missing piece of every correct recursive function?',
        options: [
          'A global counter',
          'A base case that stops recursion',
          'A for loop',
          'The keyword recursive',
        ],
        correctAnswer: 'A base case that stops recursion',
      },
      {
        text: '`factorial(5)` evaluates to?',
        options: ['25', '15', '120', '5'],
        correctAnswer: '120',
      },
      {
        text: 'What happens without a base case in recursion?',
        options: [
          'The program exits cleanly',
          'Infinite recursion → stack overflow crash',
          'A compile-time error',
          'The result is always 1',
        ],
        correctAnswer: 'Infinite recursion → stack overflow crash',
      },
      {
        text: 'Which is TRUE about `register int x;`?',
        options: [
          'It forces x into a register',
          'It is a hint that the compiler may ignore',
          'It makes x global',
          'It is illegal in C',
        ],
        correctAnswer: 'It is a hint that the compiler may ignore',
      },
      {
        text: 'A local variable inside a block is visible …?',
        options: [
          'Throughout the whole file',
          'Only within that block and nested blocks',
          'To all functions',
          'Only in main',
        ],
        correctAnswer: 'Only within that block and nested blocks',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 9 — Arrays (1D, 2D, Multi-dimensional)
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 9,
    title: 'Arrays (1D, 2D, Multi-dimensional)',
    description:
      'Storing collections of data: 1D arrays, 2D matrices, multi-dimensional arrays, bounds safety, and passing arrays to functions.',
    topics: [
      {
        title: 'One-Dimensional Arrays',
        text:
          'An **array** is a contiguous block of elements of the **same type**, accessed by index. Declare it with a size: `int marks[5];` — five `int`s in adjacent memory.\n\nAccess with the **subscript operator** `[]`:\n```c\nmarks[0] = 90;   // first element\nmarks[4] = 88;   // last element\n```\n\nCritical facts:\n- Indexing starts at **0**; `marks[5]` has valid indices `0..4`.\n- **No automatic bounds checking** — `marks[5]` or `marks[99]` compiles and runs, writing into whatever memory follows (or precedes) the array. This is undefined behaviour and the classic source of corrupted data and security exploits. **You** are the bounds checker.\n- You can initialise at declaration: `int marks[5] = {90, 85, 95, 70, 88};` or partially `int a[5] = {1, 2};` (rest become 0).\n- `sizeof(marks)` gives the **total bytes**; `sizeof(marks)/sizeof(marks[0])` gives the number of elements.',
        code: '#include <stdio.h>\nint main(void) {\n    int marks[5] = {90, 85, 95, 70, 88};\n    int n = sizeof(marks) / sizeof(marks[0]);  // 5\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        sum += marks[i];\n    }\n    printf("Avg: %.1f\\n", (double)sum / n);    // 85.6\n    return 0;\n}',
        note: 'C does not check array bounds — going past the end silently corrupts memory.',
      },
      {
        title: 'Two-Dimensional Arrays (Matrices)',
        text:
          'A 2D array is an array of arrays — like a grid with **rows** and **columns**: `int matrix[3][4];` declares 3 rows × 4 columns.\n\nAccess with two subscripts: `matrix[row][col]`.\n\nMemory layout is **row-major**: the entire first row occupies contiguous memory, then the second, etc. So `matrix[0][0]`, `matrix[0][1]`, … `matrix[0][3]`, then `matrix[1][0]` are consecutive addresses.\n\nInitialisation nests braces:\n```c\nint m[2][3] = { {1,2,3}, {4,5,6} };\n```\n\nWhen passing a 2D array to a function, **all dimensions except the first must be specified**: `void printMat(int m[][3], int rows)`. The compiler needs the row length to compute addresses.',
        code: '#include <stdio.h>\nint main(void) {\n    int m[2][3] = {{1,2,3},{4,5,6}};\n    for (int r = 0; r < 2; r++) {\n        for (int c = 0; c < 3; c++) {\n            printf("%d ", m[r][c]);\n        }\n        printf("\\n");\n    }\n    // 1 2 3\n    // 4 5 6\n    return 0;\n}',
        note: '2D arrays are stored row-by-row in memory (row-major) — useful for cache and pointer tricks.',
      },
      {
        title: 'Passing Arrays to Functions & Array Bounds',
        text:
          'When you pass an array to a function, what is passed is a **pointer to its first element** — the array "decays" to a pointer. The function does **not** know the size, which is why you always pass the size separately:\n\n```c\nint sumArray(int arr[], int n);   // arr[] ≡ int *arr\n```\n\nInside the function, `sizeof(arr)` now returns the size of the *pointer*, not the array — a classic bug.\n\nBecause arrays decay to pointers, modifications inside the function **do affect the caller** (unlike pass-by-value scalars). This is the exception that makes "passing by value" feel inconsistent — the array itself is not copied.\n\n**Bounds safety** is entirely your responsibility: always track the size, check indices before use, and never trust input lengths. A loop `for (i = 0; i < n; i++)` guarded by a verified `n` is the foundation of array-safe C.',
        code: '#include <stdio.h>\n\nint sumArray(int arr[], int n) {   // arr[] decays to int*\n    int s = 0;\n    for (int i = 0; i < n; i++) s += arr[i];\n    return s;\n}\n\nint main(void) {\n    int a[] = {10, 20, 30, 40};\n    printf("%d\\n", sumArray(a, 4));   // 100\n    return 0;\n}',
        note: 'Arrays decay to pointers when passed — so functions modify the original, not a copy.',
      },
    ],
    quizzes: [
      {
        text: 'What are the valid indices of `int a[6]`?',
        options: ['1 to 6', '0 to 5', '0 to 6', '1 to 5'],
        correctAnswer: '0 to 5',
      },
      {
        text: 'What happens when you write past the end of a C array?',
        options: [
          'A runtime error is always raised',
          'Undefined behaviour — it corrupts adjacent memory',
          'The program prints a warning',
          'The array automatically grows',
        ],
        correctAnswer: 'Undefined behaviour — it corrupts adjacent memory',
      },
      {
        text: '`int a[5] = {1, 2};` — what are the remaining elements?',
        options: ['Garbage', '0', '1', 'Uninitialised'],
        correctAnswer: '0',
      },
      {
        text: 'In memory, a 2D array `int m[2][3]` is stored …?',
        options: [
          'Column by column',
          'Row by row (row-major)',
          'In random order',
          'With one pointer per element',
        ],
        correctAnswer: 'Row by row (row-major)',
      },
      {
        text: 'When passed to a function, what does an array name decay to?',
        options: [
          'Its size',
          'A pointer to its first element',
          'A copy of all elements',
          'Its address only in main',
        ],
        correctAnswer: 'A pointer to its first element',
      },
      {
        text: '`int sum(int arr[], int n)` — inside the function, what does `sizeof(arr)` return?',
        options: [
          'The array size in bytes',
          'The pointer size in bytes',
          'The number of elements',
          'It is a compile error',
        ],
        correctAnswer: 'The pointer size in bytes',
      },
      {
        text: '`int m[2][3] = {{1,2,3},{4,5,6}};` — what is `m[1][0]`?',
        options: ['1', '4', '3', '6'],
        correctAnswer: '4',
      },
      {
        text: 'What does `sizeof(marks) / sizeof(marks[0])` give?',
        options: [
          'The number of elements in the array',
          'The first element',
          'The last element',
          'The array length in bytes',
        ],
        correctAnswer: 'The number of elements in the array',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 10 — Strings & String Library Functions
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 10,
    title: 'Strings & String Library Functions',
    description:
      'How strings really work in C — char arrays with a null terminator — and the safe use of string.h functions.',
    topics: [
      {
        title: 'What a C String Really Is',
        text:
          'C has **no string type**. A string is just a `char` array whose contents end with a **null terminator** — the character `\\0` (ASCII 0). The terminator is what lets `printf("%s", ...)` and library functions know where the string stops.\n\n```c\nchar name[] = "Rahul";  // 6 bytes: R a h u l \\0\n```\n\nTwo ways to declare:\n- `char s[] = "hi";` — an **array** of 3 bytes (`h`,`i`,`\\0`), mutable.\n- `char *p = "hi";` — a **pointer** to a *string literal* stored in read-only memory; modifying through `p` is undefined behaviour.\n\nCrucial facts:\n- `strlen(s)` counts characters **excluding** `\\0` — `strlen("Rahul")` is 5.\n- A buffer must be **one byte larger** than the text to hold the terminator.\n- `\'A\'` is a single character (a char); `"A"` is a string (two bytes: `A\\0`). They are completely different things.',
        code: '#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char name[] = "Rahul";\n    printf("Length: %zu\\n", strlen(name));  // 5\n    printf("Bytes:  %zu\\n", sizeof(name));  // 6 (incl. \\0)\n    printf("%s\\n", name);                    // Rahul\n    return 0;\n}',
        note: 'The `\\0` terminator is invisible but essential — every string buffer needs room for it.',
      },
      {
        title: 'String Library Functions: strcpy, strcat, strcmp, strlen',
        text:
          '`<string.h>` provides the string workhorses:\n\n- **`strlen(s)`** — returns the length (excluding `\\0`).\n- **`strcpy(dest, src)`** — copies `src` into `dest` **including** the terminator. **Unsafe** if `dest` is too small — it will overflow. Use `strncpy`/`strlcpy` (platform) or check sizes.\n- **`strcat(dest, src)`** — appends `src` to `dest`. Also unsafe if `dest` lacks room. Both `strcpy`/`strcat` are classic buffer-overflow vectors.\n- **`strcmp(a, b)`** — returns 0 if equal, negative if `a < b`, positive if `a > b` (lexicographic). It compares **bytes/characters**, not `==` (which would compare pointers).\n\nCompare strings with `strcmp`, never `==`. `==` on two char arrays compares the *addresses*, which are always different — a silent, very common bug.\n\nSafe practice: for user input prefer bounded functions (`strncpy(dest, src, n)`, `snprintf`), always pass the destination size, and never trust string lengths you did not compute.',
        code: '#include <stdio.h>\n#include <string.h>\n\nchar dest[20];\nstrcpy(dest, "Hello");      // dest = "Hello"\nstrcat(dest, " World");     // dest = "Hello World"\n\nchar a[] = "cat", b[] = "dog";\nprintf("%d\\n", strcmp(a, b));   // <0 (cat < dog)\nprintf("%d\\n", strcmp(a, a));   // 0 (equal)\n\n// if (a == b) is WRONG — compares addresses, always false',
        note: '`==` compares addresses for strings — always use `strcmp` for value equality.',
      },
      {
        title: 'Reading Strings Safely: fgets, and Common Bugs',
        text:
          'Reading user text into a fixed buffer is where string bugs live. The rules:\n\n- Use `fgets(buf, size, stdin)` — it reads at most `size-1` chars and always null-terminates. `gets()` is banned (no bound).\n- `fgets` keeps the newline if it fits; strip it: `buf[strcspn(buf, "\\n")] = 0;`.\n- `scanf("%s", buf)` stops at the first whitespace, so it cannot read "Rahul Kumar" — and without a width (`%19s`) it overflows on long input. Prefer `fgets` for general input.\n\nCommon string bugs:\n1. **Off-by-one** — forgetting the `\\0` byte when sizing buffers.\n2. **Overflow** — `strcpy`/`strcat`/`gets` into a small buffer.\n3. **`==` instead of `strcmp`**.\n4. **Modifying a string literal** — `char *p = "hi"; p[0] = \'x\';` is undefined behaviour.\n5. **Reading past the end** — loops that assume a terminator exists.\n\nThe mindset: every string operation must know the buffer size. If a function does not take a size, treat it with suspicion.',
        code: '#include <stdio.h>\n#include <string.h>\n\nchar line[50];\nprintf("Enter full name: ");\nfgets(line, sizeof(line), stdin);      // safe\nline[strcspn(line, "\\n")] = 0;        // strip newline\nprintf("Hello, %s!\\n", line);\n\n// scanf("%s", line) would only read the first word',
        note: '`fgets(buf, size, stdin)` is the safe line reader — it respects the buffer size.',
      },
    ],
    quizzes: [
      {
        text: 'What terminates a C string?',
        options: ['A newline', 'The null character `\\0`', 'A space', 'The letter N'],
        correctAnswer: 'The null character `\\0`',
      },
      {
        text: '`strlen("Rahul")` returns?',
        options: ['6', '5', '4', '0'],
        correctAnswer: '5',
      },
      {
        text: 'Which is the CORRECT way to compare two C strings for equality?',
        options: [
          '`if (a == b)`',
          '`if (strcmp(a, b) == 0)`',
          '`if (a = b)`',
          '`if (strlen(a) == strlen(b))`',
        ],
        correctAnswer: '`if (strcmp(a, b) == 0)`',
      },
      {
        text: 'Why is `strcpy(dest, src)` dangerous?',
        options: [
          'It is too slow',
          'It copies without checking that dest has enough space',
          'It deletes src',
          'It only works on integers',
        ],
        correctAnswer: 'It copies without checking that dest has enough space',
      },
      {
        text: '`char name[] = "Rahul";` — how many bytes does `sizeof(name)` give?',
        options: ['5', '6', '4', '8'],
        correctAnswer: '6',
      },
      {
        text: 'What is the difference between `\'A\'` and `"A"` in C?',
        options: [
          'They are identical',
          '`\'A\'` is a char, `"A"` is a string (two bytes: A\\0)',
          '`"A"` is a char, `\'A\'` is a string',
          'Both are strings',
        ],
        correctAnswer: '`\'A\'` is a char, `"A"` is a string (two bytes: A\\0)',
      },
      {
        text: 'Which function safely reads a line including spaces?',
        options: ['gets', 'scanf("%s", b)', 'fgets(b, size, stdin)', 'strcpy'],
        correctAnswer: 'fgets(b, size, stdin)',
      },
      {
        text: '`char *p = "hi"; p[0] = \'x\';` — what is the problem?',
        options: [
          'It is perfectly fine',
          'It modifies a string literal — undefined behaviour',
          'It creates a compile error always',
          'It deletes the string',
        ],
        correctAnswer: 'It modifies a string literal — undefined behaviour',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 11 — Pointers & Pointer Arithmetic
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 11,
    title: 'Pointers & Pointer Arithmetic',
    description:
      'The heart of C: address-of, dereference, pointer arithmetic, null pointers, and pointers as function arguments.',
    topics: [
      {
        title: 'Addresses and the Address-of Operator &',
        text:
          'Every variable lives at a memory address. The **address-of** operator `&` gives you that address. A **pointer** is simply a variable that *stores an address*.\n\n```c\nint x = 10;\nint *ptr = &x;   // ptr holds the address of x\n```\n\nDeclare a pointer by writing `type *name` — "pointer to type". `int *ptr` means `ptr` can hold the address of an `int`. The `*` in the declaration is part of the type, not multiplication.\n\nThe address itself is just a number (a memory location). Its actual value depends on the OS/ASLR and changes between runs — never hardcode or assume addresses. Print one with `%p`.\n\nWhy do you need this? Pass-by-value (Section 7) means functions cannot change caller variables — unless you pass their *addresses*. Pointers are also how arrays, strings, dynamic memory, and data structures (linked lists, trees) work.',
        code: '#include <stdio.h>\nint main(void) {\n    int x = 10;\n    int *ptr = &x;\n    printf("Value: %d\\n", x);\n    printf("Address of x: %p\\n", (void*)&x);\n    printf("ptr holds: %p\\n", (void*)ptr);   // same as &x\n    return 0;\n}',
        note: '`&var` = address of var; a pointer stores such an address.',
      },
      {
        title: 'Dereferencing: *ptr and the Null Pointer',
        text:
          '**Dereferencing** a pointer — `*ptr` — goes to the address it holds and accesses the value stored there. It is the inverse of `&`.\n\n```c\nint x = 10, *ptr = &x;\n*ptr = 20;      // write 20 into x through the pointer\nprintf("%d", x); // 20\n```\n\nCritical rules:\n- Dereference only a pointer that points at valid memory. Dereferencing a **null pointer** (`int *p = NULL; *p = 5;`) crashes with a segmentation fault — the classic C crash.\n- **NULL** (from `<stddef.h>`, also `0`) is the "points at nothing" sentinel. Always initialise pointers to NULL and **check for NULL before dereferencing**: `if (ptr != NULL) { ... *ptr ... }`.\n- A pointer must be dereferenced with the correct type. `int *` reads 4 bytes as an int; `char *` reads 1 byte as a char. Type matters for arithmetic AND for dereference size.',
        code: '#include <stdio.h>\nint main(void) {\n    int x = 10;\n    int *ptr = &x;\n    *ptr = 25;                  // change x via the pointer\n    printf("%d\\n", x);          // 25\n\n    int *bad = NULL;\n    if (bad != NULL) {\n        *bad = 5;               // safe check\n    } else {\n        printf("bad is NULL — not dereferenced\\n");\n    }\n    return 0;\n}',
        note: 'NULL-check before dereference — dereferencing NULL is a segmentation fault.',
      },
      {
        title: 'Pointer Arithmetic: ptr + 1 Skips sizeof(type)',
        text:
          'Pointer arithmetic is **type-aware**. `ptr + 1` does NOT add 1 byte — it adds `sizeof(*ptr)` bytes, moving to the *next element* of the pointed-to type.\n\n```c\nint a[3] = {10, 20, 30};\nint *p = a;          // p points to a[0]\nprintf("%d", *p);    // 10\np++;                 // now points to a[1]\nprintf("%d", *p);    // 20\n```\n\nSupported operations:\n- `ptr + n`, `ptr - n` — move n elements forward/backward.\n- `ptr1 - ptr2` — number of elements *between* two pointers into the same array.\n- `++`/`--` — step one element.\n- **NO multiplication/division** of pointers.\n\nBecause `int` is usually 4 bytes, `p + 1` advances the raw address by 4. That is why an `int*` and a `char*` walking the same array produce different raw-address jumps. Walking an array with a pointer is exactly what the compiler turns `a[i]` into: `*(a + i)`.',
        code: '#include <stdio.h>\nint main(void) {\n    int a[3] = {10, 20, 30};\n    int *p = a;\n    printf("%d\\n", *(p + 2));   // 30 — two ints forward\n    printf("%zu\\n", sizeof(int));  // 4 (typical) — p+2 = +8 bytes\n    return 0;\n}',
        note: '`p + n` advances by n × sizeof(*p) bytes — type-aware, not byte arithmetic.',
      },
      {
        title: 'Pointers as Function Arguments: The Swap Pattern',
        text:
          'Because C is pass-by-value, a function cannot change a caller’s variable directly — it only has a copy. The solution is to pass the **address**, and let the function dereference it to modify the original.\n\nThe classic **swap**:\n\n```c\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n// call: swap(&x, &y);\n```\n\n- `swap(&x, &y)` passes addresses of x and y.\n- Inside, `*a` reads/writes the *original* x.\n\nThis "output parameter" pattern is everywhere: a function that must return multiple values (say, quotient *and* remainder) uses pointers for the extra outputs. It is also why you pass `&n` to `scanf`.\n\nMnemonic: if a function should change a variable, pass `&var`; the parameter type gains a `*`, and every use inside gains a `*` dereference.',
        code: '#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main(void) {\n    int x = 5, y = 9;\n    swap(&x, &y);\n    printf("x=%d y=%d\\n", x, y);   // x=9 y=5\n    return 0;\n}',
        note: 'Swap via pointers is THE canonical "pointers let functions modify caller data" example.',
      },
    ],
    quizzes: [
      {
        text: '`int x = 10; int *p = &x;` — what does `p` store?',
        options: [
          'The value 10',
          'The address of x',
          'A copy of x',
          'The address of p itself',
        ],
        correctAnswer: 'The address of x',
      },
      {
        text: 'What happens when you dereference a NULL pointer?',
        options: [
          'It returns 0',
          'Segmentation fault / crash',
          'It auto-initialises',
          'It is ignored silently',
        ],
        correctAnswer: 'Segmentation fault / crash',
      },
      {
        text: 'If `int` is 4 bytes, how many raw bytes does `p + 1` advance an `int *p`?',
        options: ['1 byte', '2 bytes', '4 bytes', '8 bytes'],
        correctAnswer: '4 bytes',
      },
      {
        text: 'Which correctly swaps x and y from main?',
        options: [
          '`swap(x, y);` with `void swap(int a, int b)`',
          '`swap(&x, &y);` with `void swap(int *a, int *b)`',
          '`swap(x, y);` with `void swap(int *a, int *b)`',
          '`swap(&x, &y);` with `void swap(int a, int b)`',
        ],
        correctAnswer: '`swap(&x, &y);` with `void swap(int *a, int *b)`',
      },
      {
        text: '`int a[3] = {10,20,30}; int *p = a; printf("%d", *(p + 2));` — what prints?',
        options: ['10', '20', '30', 'Undefined'],
        correctAnswer: '30',
      },
      {
        text: 'Which operation is NOT valid on pointers?',
        options: [
          '`p + 3`',
          '`p - 2`',
          '`p1 - p2`',
          '`p * 2`',
        ],
        correctAnswer: '`p * 2`',
      },
      {
        text: 'What does `*ptr = 20;` do when `ptr = &x`?',
        options: [
          'Makes ptr point to 20',
          'Writes 20 into x through the pointer',
          'Increments x by 20',
          'Creates a new variable',
        ],
        correctAnswer: 'Writes 20 into x through the pointer',
      },
      {
        text: 'Why does `scanf("%d", &n)` need `&n`?',
        options: [
          'To pass the value of n',
          'To pass the address where the input should be stored',
          'It is optional syntax',
          'To avoid a warning',
        ],
        correctAnswer: 'To pass the address where the input should be stored',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 12 — Pointers & Arrays / Strings
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 12,
    title: 'Pointers & Arrays / Strings',
    description:
      'The deep link between arrays and pointers: array names, `a[i]` ≡ `*(a+i)`, pointer-to-array vs array-of-pointers, and pointer strings.',
    topics: [
      {
        title: 'Array Names Are Pointers to the First Element',
        text:
          'In C, an array name *decays* to a pointer to its first element in most contexts. `a` and `&a[0]` are the same address.\n\n```c\nint a[4] = {1,2,3,4};\nint *p = a;      // p points to a[0]\n```\n\nThis equivalence is captured by the rule **`a[i]` is exactly `*(a + i)`**. The subscript operator is syntactic sugar for pointer arithmetic:\n- `a[2]` ≡ `*(a + 2)`\n- `a` is `&a[0]`\n\nBecause `a[i]` ≡ `*(a+i)`, you can even write `i[a]` — it means `*(i + a)`, same thing. It compiles; it is terrible style, but it is a classic C trivia question.\n\n**Subtle difference:** `sizeof(a)` on a real array gives the array size in bytes; once `a` has decayed to a pointer (e.g. a function parameter), `sizeof` gives the pointer size. Also, an array name is NOT an lvalue — you cannot do `a = p;` to reassign the array itself (it is a constant address).',
        code: '#include <stdio.h>\nint main(void) {\n    int a[4] = {1,2,3,4};\n    int *p = a;                       // p = &a[0]\n    printf("%d\\n", a[2]);             // 3\n    printf("%d\\n", *(a + 2));         // 3 — identical\n    printf("%d\\n", *(p + 2));         // 3\n    printf("%d\\n", 2[a]);             // 3 — weird but legal\n    return 0;\n}',
        note: '`a[i]` is defined as `*(a + i)` — the compiler treats subscripts as pointer arithmetic.',
      },
      {
        title: 'Pointer to Array vs Array of Pointers',
        text:
          'These two declarations look alike but mean very different things:\n\n- **`int *arr[5]`** — *array of 5 pointers to int*. Each element is a pointer.\n- **`int (*ptr)[5]`** — *pointer to an array of 5 ints*. `ptr` points to a whole 5-int array.\n\nRead declarations inside-out: start at the name, go right on `[]`/`()`, then left on `*`.\n- `arr` → `[5]` (array of 5) → `int *` (pointers to int). So: array of 5 int-pointers.\n- `ptr` → `*` (pointer) → `[5]` (to array of 5) → `int`. So: pointer to array of 5 ints.\n\n`array of pointers` is common for arrays of strings: `char *names[] = {"Rahul", "Sita"};` — two pointers into string literals.\n\nA `pointer to array` is used with 2D arrays passed to functions: `void f(int (*m)[3], int rows);`.',
        code: '#include <stdio.h>\nint main(void) {\n    // Array of pointers to int\n    int x = 1, y = 2;\n    int *arr[2];\n    arr[0] = &x;\n    arr[1] = &y;\n    printf("%d\\n", *arr[1]);        // 2\n\n    // Pointer to an array of 3 ints\n    int m[2][3] = {{1,2,3},{4,5,6}};\n    int (*ptr)[3] = m;              // points to row 0\n    printf("%d\\n", (*ptr)[1]);      // 2\n    return 0;\n}',
        note: '`int *a[5]` (array of pointers) ≠ `int (*a)[5]` (pointer to array) — read declarations inside-out.',
      },
      {
        title: 'Pointer Strings vs Character Arrays',
        text:
          'Strings can be held two ways, and they are NOT the same:\n\n```c\nchar s[] = "hello";   // array of 6 bytes, MUTABLE copy\nchar *p = "hello";    // pointer to a literal, READ-ONLY\n```\n\n- `char s[]` copies the literal into a writable array. You can change `s[1]` to `\'a\'`.\n- `char *p` points directly at the string literal, which lives in read-only memory. Modifying `p[1]` is **undefined behaviour** (usually a segfault on modern systems).\n\nWhich to use?\n- Need to modify the text → `char s[]`.\n- Just reading a constant → `char *p` (also lets you reassign `p` to another literal, which an array name cannot).\n\nAnother classic trap: `p = s;` makes the pointer point to the array (fine), but `s = p;` is illegal — you cannot reassign an array name. Arrays are not assignable; pointers are.',
        code: '#include <stdio.h>\nint main(void) {\n    char s[] = "hello";   // mutable\n    s[0] = \'H\';\n    printf("%s\\n", s);    // Hello\n\n    char *p = "fixed";    // points to a literal\n    // p[0] = \'F\';       // UNDEFINED — read-only memory\n    printf("%s\\n", p);\n\n    p = s;                // OK — reassign the POINTER\n    printf("%s\\n", p);    // Hello\n    return 0;\n}',
        note: '`char s[]` = writable copy; `char *p` = read-only pointer to the literal.',
      },
    ],
    quizzes: [
      {
        text: '`a[i]` in C is equivalent to which expression?',
        options: ['`*(a + i)`', '`a + i`', '`&a[i]`', '`*(i - a)`'],
        correctAnswer: '`*(a + i)`',
      },
      {
        text: '`int *arr[5]` declares …?',
        options: [
          'A pointer to an array of 5 ints',
          'An array of 5 pointers to int',
          'An array of 5 ints',
          'A pointer to a pointer',
        ],
        correctAnswer: 'An array of 5 pointers to int',
      },
      {
        text: '`int (*ptr)[5]` declares …?',
        options: [
          'An array of 5 pointers',
          'A pointer to an array of 5 ints',
          'A pointer to 5 ints',
          'A 2D array',
        ],
        correctAnswer: 'A pointer to an array of 5 ints',
      },
      {
        text: '`char *p = "hello"; p[0] = \'H\';` — what is the problem?',
        options: [
          'It works fine',
          'It modifies a string literal — undefined behaviour',
          'It changes the pointer',
          'It is only a warning',
        ],
        correctAnswer: 'It modifies a string literal — undefined behaviour',
      },
      {
        text: 'What is `sizeof(a)` for a real array `int a[10]` inside main?',
        options: [
          'Size of a pointer',
          '10 × sizeof(int) bytes',
          '10 bytes',
          '1 byte',
        ],
        correctAnswer: '10 × sizeof(int) bytes',
      },
      {
        text: 'Which is a VALID operation?',
        options: [
          '`s = p;` for `char s[]` and `char *p`',
          '`p = s;` for `char s[]` and `char *p`',
          'Both are valid',
          'Neither is valid',
        ],
        correctAnswer: '`p = s;` for `char s[]` and `char *p`',
      },
      {
        text: '`int a[3] = {7,8,9};` — what does `0[a]` evaluate to?',
        options: ['7', '8', '9', 'Compile error'],
        correctAnswer: '7',
      },
      {
        text: '`char *names[] = {"Rahul", "Sita"};` — this is an …?',
        options: [
          'Array of char arrays',
          'Array of pointers to char',
          'Pointer to an array',
          '2D char array',
        ],
        correctAnswer: 'Array of pointers to char',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 13 — Dynamic Memory Allocation
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 13,
    title: 'Dynamic Memory Allocation (malloc, calloc, realloc, free)',
    description:
      'Memory you request at runtime: the heap, malloc/calloc/realloc/free, sizeof, leaks, and dangling pointers.',
    topics: [
      {
        title: 'The Heap vs the Stack',
        text:
          'So far your variables lived on the **stack** — allocated automatically, freed when the function returns, fixed size at compile time.\n\n**Dynamic memory** lives on the **heap** — a pool of memory you request at runtime and must free yourself. You need it when:\n- The size is unknown until runtime (user types a number, then you allocate that many elements).\n- Data must outlive the function that created it.\n- You are building linked structures (linked lists, trees) whose nodes are created on demand.\n\nKey contrast:\n\n| | Stack | Heap |\n|---|---|---|\n| Allocation | Automatic | Manual (`malloc`/`calloc`/`realloc`) |\n| Freeing | Automatic on return | Manual (`free`) |\n| Size | Compile-time | Runtime |\n| Speed | Very fast | Slower (system call) |\n| Size limit | Small | Large (RAM-bound) |\n\nThe heap is a finite resource. Every byte you allocate must eventually be freed — or the program slowly consumes memory until it dies.',
        code: '// Ask the user for a size, allocate exactly that many ints\n#include <stdio.h>\n#include <stdlib.h>\n\nint n;\nprintf("How many scores? ");\nscanf("%d", &n);\n\nint *scores = malloc(n * sizeof(int));   // heap array\nif (scores == NULL) {                    // ALWAYS check!\n    fprintf(stderr, "Allocation failed\\n");\n    return 1;\n}\n// ... use scores[0]..scores[n-1] ...\nfree(scores);                            // give it back',
        note: 'Stack = automatic + fixed; heap = manual + runtime-sized. Check every malloc.',
      },
      {
        title: 'malloc, calloc, realloc — and sizeof',
        text:
          'Four allocation functions in `<stdlib.h>`:\n\n- **`malloc(size)`** — allocates `size` raw bytes, returns a `void*`. Content is **uninitialised** (garbage). Usage: `malloc(n * sizeof(int))`.\n- **`calloc(n, size)`** — allocates `n` elements of `size` bytes each and **zero-initialises** them. Returns `void*`.\n- **`realloc(ptr, newSize)`** — resizes a previously allocated block, copying old contents to the new location if needed. Returns the (possibly new) pointer.\n- **`free(ptr)`** — releases the block back to the heap.\n\nAlways use `sizeof` when sizing: `malloc(n * sizeof(int))` not `malloc(n * 4)` — the int size is platform-dependent.\n\nAlways check the return: `malloc` returns `NULL` on failure. Treat a NULL result as a fatal error, not a surprise.\n\n`realloc` gotcha: if it fails it returns NULL and **leaves the original block untouched** — so `ptr = realloc(ptr, ...)` leaks the original if realloc returns NULL. Use a temporary pointer.',
        code: '#include <stdlib.h>\n\nint *a = malloc(10 * sizeof(int));   // uninitialised\nint *b = calloc(10, sizeof(int));    // zero-initialised\n\n// Resize safely\nint *tmp = realloc(a, 20 * sizeof(int));\nif (tmp != NULL) {\n    a = tmp;\n} else {\n    // a is still valid — handle the failure\n}\n\nfree(a); free(b);',
        note: 'malloc = uninitialised, calloc = zeroed, realloc = resize (via temp pointer), free = release.',
      },
      {
        title: 'Memory Leaks and Dangling Pointers',
        text:
          'Two failure modes define heap discipline:\n\n**Memory leak** — you allocate and never `free`. The block stays reserved until the program exits. In a long-running program (a server, an embedded loop), leaks accumulate until memory is exhausted. You cannot "see" a leak while debugging — it is a silent withdrawal.\n\n**Dangling pointer** — you `free` a block but still hold the pointer, then dereference it. The memory may be reused by the allocator, so reading/writing is undefined behaviour (garbage values or crashes).\n\nRules that eliminate both:\n- For every `malloc`/`calloc`/`realloc` there must be a matching `free` on every path.\n- After `free(p)`, set `p = NULL` immediately — then a later `free(p)` is harmless and a dereference is caught by a NULL check.\n- Never free memory twice (double free = undefined behaviour).\n- Free in the reverse order of allocation when blocks depend on each other.',
        code: '#include <stdlib.h>\n\nvoid demo(void) {\n    int *p = malloc(sizeof(int));\n    *p = 7;\n    printf("%d\\n", *p);\n    free(p);      // matching free — no leak\n    p = NULL;     // no dangling pointer\n}\n\nint main(void) {\n    demo();\n    return 0;\n}',
        note: 'Every malloc needs a free; free then NULL the pointer to prevent dangling access.',
      },
    ],
    quizzes: [
      {
        text: 'Which allocator zero-initialises the allocated memory?',
        options: ['malloc', 'calloc', 'realloc', 'free'],
        correctAnswer: 'calloc',
      },
      {
        text: '`malloc` returns `void*` and leaves contents …?',
        options: ['Zeroed', 'Uninitialised (garbage)', 'Random but safe', 'Copied from the stack'],
        correctAnswer: 'Uninitialised (garbage)',
      },
      {
        text: 'Why use `malloc(n * sizeof(int))` instead of `malloc(n * 4)`?',
        options: [
          '`sizeof` is faster',
          'int size is platform-dependent; sizeof keeps it portable',
          'malloc requires sizeof',
          'n * 4 always overflows',
        ],
        correctAnswer: 'int size is platform-dependent; sizeof keeps it portable',
      },
      {
        text: 'What does `malloc` return when it cannot allocate?',
        options: ['0', 'NULL', 'A valid empty pointer', 'A crash'],
        correctAnswer: 'NULL',
      },
      {
        text: 'A memory leak is …?',
        options: [
          'Freeing memory twice',
          'Allocated memory never freed, consumed until exit',
          'Reading past an array',
          'A NULL dereference',
        ],
        correctAnswer: 'Allocated memory never freed, consumed until exit',
      },
      {
        text: 'After `free(p)`, the safe habit is to …?',
        options: [
          'Call free again to be sure',
          'Set `p = NULL` immediately',
          'Use `p` to read the freed value',
          'Do nothing special',
        ],
        correctAnswer: 'Set `p = NULL` immediately',
      },
      {
        text: 'If `realloc` fails, what happens to the original pointer?',
        options: [
          'It is freed',
          'It is left valid and untouched',
          'It becomes NULL',
          'It is truncated',
        ],
        correctAnswer: 'It is left valid and untouched',
      },
      {
        text: 'Which needs a matching `free`?',
        options: [
          'A local variable',
          'A heap block from malloc/calloc/realloc',
          'A static variable',
          'A string literal',
        ],
        correctAnswer: 'A heap block from malloc/calloc/realloc',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 14 — Structures & Unions
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 14,
    title: 'Structures & Unions',
    description:
      'Grouping related data into one type: structs, member access, arrays of structs, typedef, and unions.',
    topics: [
      {
        title: 'Structures: Grouping Related Data',
        text:
          'A **structure** groups several variables of possibly different types under one name. It is how C models a "record".\n\n```c\nstruct Student {\n    char name[50];\n    int roll;\n    float cgpa;\n};\n```\n\nDeclare a variable of that type and access members with `.`:\n```c\nstruct Student s;\ns.roll = 12;\nstrcpy(s.name, "Rahul");\ns.cgpa = 8.6;\n```\n\nYou can initialise at declaration: `struct Student s = {"Sita", 7, 9.1};` (order matters).\n\nStructures bring **abstraction**: instead of three parallel arrays (`name[50][]`, `roll[]`, `cgpa[]`), you keep one array of students — `struct Student class[60];` — where each element bundles all the fields. This is the foundation for records, database rows, and every data structure.',
        code: '#include <stdio.h>\n#include <string.h>\n\nstruct Student {\n    char name[50];\n    int roll;\n    float cgpa;\n};\n\nint main(void) {\n    struct Student s;\n    strcpy(s.name, "Rahul");\n    s.roll = 12;\n    s.cgpa = 8.6;\n    printf("%s (roll %d) cgpa %.1f\\n", s.name, s.roll, s.cgpa);\n    return 0;\n}',
        note: 'A struct bundles fields of different types into one record; access with `.`.',
      },
      {
        title: 'Member Access: dot (.) vs arrow (->)',
        text:
          'You access struct members through a struct variable with **`.`**, and through a **pointer to a struct** with **`->`**.\n\n```c\nstruct Student s, *sp = &s;\ns.roll = 5;        // direct access\nsp->roll = 7;      // via pointer — same as (*sp).roll\n```\n\n`sp->roll` is pure sugar for `(*sp).roll` — dereference the pointer, then access the member. The parentheses are mandatory in the long form because `*sp.roll` would mean `*(sp.roll)`.\n\nThe arrow appears everywhere because structs are usually passed around by pointer (copying a whole struct is expensive):\n\n```c\nvoid printStudent(const struct Student *sp) {\n    printf("%s\\n", sp->name);   // arrow\n}\n```\n\nWhen you call `printStudent(&s);`, the function receives the address and uses `->`. Passing a pointer also lets the function modify the original struct (pass-by-value would copy it).',
        code: '#include <stdio.h>\n#include <string.h>\n\nstruct Student { char name[50]; int roll; };\n\nvoid printStudent(const struct Student *sp) {\n    printf("roll %d: %s\\n", sp->roll, sp->name);\n}\n\nint main(void) {\n    struct Student s;\n    strcpy(s.name, "Sita");\n    s.roll = 7;\n    printStudent(&s);\n    return 0;\n}',
        note: '`.` on a struct, `->` on a pointer to a struct — `sp->m` ≡ `(*sp).m`.',
      },
      {
        title: 'typedef and Unions',
        text:
          '**`typedef`** gives a type a new, shorter name — you stop typing `struct Student` everywhere:\n\n```c\ntypedef struct Student Student;\nStudent s;            // same as struct Student s;\n```\n\nor in one step: `typedef struct { ... } Student;` (anonymous struct + typedef). This is the modern idiom.\n\n**`union`** lets several members **share the same memory**. All members start at the same address; the union is as large as its largest member. Writing one member overwrites the others.\n\n```c\nunion Number { int i; float f; };  // size = max(int,float)\n```\n\nKey contrast with struct:\n| | struct | union |\n|---|---|---|\n| Memory | Sum of all members | Size of largest member |\n| Members | All alive at once | Only one alive at a time |\n\nUnions are used for type punning, variant records (one field says which "kind", the union holds the value), and low-level register overlays in embedded code.',
        code: '#include <stdio.h>\n\ntypedef struct {\n    char name[50];\n    int roll;\n} Student;\n\nunion Number {\n    int i;\n    float f;\n};\n\nint main(void) {\n    Student s = {"Rahul", 1};\n    union Number n;\n    n.i = 5;\n    printf("%d\\n", n.i);     // 5\n    n.f = 2.5;               // overwrites the int bytes\n    printf("%f\\n", n.f);     // 2.500000\n    printf("%s\\n", s.name);\n    return 0;\n}',
        note: 'struct = all members live together; union = members share one block of memory.',
      },
    ],
    quizzes: [
      {
        text: 'How do you access a member through a POINTER to a struct?',
        options: ['`.member`', '`->member`', '`::member`', '`*member`'],
        correctAnswer: '`->member`',
      },
      {
        text: '`sp->roll` is equivalent to …?',
        options: ['`sp.roll`', '`(*sp).roll`', '`*(sp.roll)`', '`&sp.roll`'],
        correctAnswer: '`(*sp).roll`',
      },
      {
        text: 'How much memory does a union occupy?',
        options: [
          'The sum of all members',
          'The size of its largest member',
          'The size of its smallest member',
          'Unlimited',
        ],
        correctAnswer: 'The size of its largest member',
      },
      {
        text: 'What does `typedef struct { ... } Student;` achieve?',
        options: [
          'Creates a new variable',
          'Lets you use `Student` instead of `struct {...}`',
          'Allocates memory',
          'Creates a union',
        ],
        correctAnswer: 'Lets you use `Student` instead of `struct {...}`',
      },
      {
        text: 'Writing one member of a union does what to the others?',
        options: [
          'Nothing',
          'Overwrites their shared memory',
          'Doubles the union size',
          'Creates a copy',
        ],
        correctAnswer: 'Overwrites their shared memory',
      },
      {
        text: 'In `struct Student class[60];` — what is class?',
        options: [
          'A single student',
          'An array of 60 Student structs',
          'A pointer to a Student',
          'A 2D array',
        ],
        correctAnswer: 'An array of 60 Student structs',
      },
      {
        text: 'Which is a typical use of a union?',
        options: [
          'Storing fixed-size records',
          'Variant records / type punning where one value is active',
          'String comparison',
          'Counting loop iterations',
        ],
        correctAnswer: 'Variant records / type punning where one value is active',
      },
      {
        text: '`struct Student s = {"Sita", 7, 9.1};` — what does this do?',
        options: [
          'Creates a pointer',
          'Initialises the struct members in order',
          'Copies a struct into s',
          'Declares a function',
        ],
        correctAnswer: 'Initialises the struct members in order',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 15 — File Handling
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 15,
    title: 'File Handling',
    description:
      'Reading and writing files with fopen modes, fprintf/fscanf, fgets, and fread/fwrite for structured data.',
    topics: [
      {
        title: 'Opening and Closing Files: fopen and fclose',
        text:
          'File I/O in C flows through a `FILE *` handle. You **open** the file, do your work, then **close** it.\n\n```c\nFILE *fp = fopen("data.txt", "r");\nif (fp == NULL) { /* handle error */ }\n// ... read/write ...\nfclose(fp);\n```\n\nOpening modes (second argument):\n- `"r"` — read (file must exist).\n- `"w"` — write (creates/truncates the file).\n- `"a"` — append (creates if missing; writes at the end).\n- `"r+"` — read + write.\n- `"w+"` — read + write, truncating.\n- `"a+"` — read + append.\n- Append `b` for binary: `"rb"`, `"wb"`.\n\n**`fopen` returns NULL on any failure** — missing file, no permission, full disk. Always check it; dereferencing a NULL FILE* crashes.\n\n**`fclose` is not optional.** It flushes buffered output and releases the handle. Not closing leaks file descriptors — especially serious in long-running programs.',
        code: '#include <stdio.h>\n\nint main(void) {\n    FILE *fp = fopen("notes.txt", "w");\n    if (fp == NULL) {\n        fprintf(stderr, "Cannot open file\\n");\n        return 1;\n    }\n    fprintf(fp, "Hello, file!\\n");\n    fclose(fp);\n    return 0;\n}',
        note: '`"w"` truncates, `"a"` appends, `"r"` requires existence; always NULL-check fopen.',
      },
      {
        title: 'Writing and Reading Formatted Data',
        text:
          'Once a file is open, formatted I/O mirrors the console:\n\n- `fprintf(fp, "format", args)` — write formatted text to fp.\n- `fscanf(fp, "format", &args)` — read formatted values from fp (needs `&` like scanf).\n- `fputs(str, fp)` — write a string.\n- `fgets(buf, size, fp)` — read a line safely (returns NULL at EOF).\n- `fgetc(fp)` / `fputc(c, fp)` — single characters.\n\nReading a file line by line is the standard idiom:\n\n```c\nchar line[256];\nwhile (fgets(line, sizeof(line), fp) != NULL) {\n    printf("%s", line);\n}\n```\n\n**End-of-file** detection: after a read function returns `EOF` (or NULL), you can check `feof(fp)` to confirm it was EOF and not an error. But the clean pattern above — check the *return value* of the read call — is what professionals use; it handles both EOF and errors in one condition.',
        code: '#include <stdio.h>\n\nint main(void) {\n    FILE *fp = fopen("scores.txt", "r");\n    if (!fp) return 1;\n\n    char line[256];\n    while (fgets(line, sizeof(line), fp) != NULL) {\n        printf("Read: %s", line);\n    }\n    fclose(fp);\n    return 0;\n}',
        note: 'Loop on the read-call return value (`fgets(...) != NULL`) — it catches EOF and errors together.',
      },
      {
        title: 'Binary Files: fread and fwrite',
        text:
          'Text files store human-readable characters. **Binary files** store raw bytes — ideal for saving whole structs or arrays, faster and lossless.\n\n```c\nfwrite(&data, sizeof(data), count, fp);\nfread(&data, sizeof(data), count, fp);\n```\n\nSignature: `fread(ptr, size, nmemb, stream)` — reads `nmemb` items, each `size` bytes, into `ptr`; returns the number of items read.\n\nExample — write a struct array to disk:\n\n```c\nstruct Student { char name[50]; int roll; };\nStudent class[60];\nfwrite(class, sizeof(Student), 60, fp);\nfread(class, sizeof(Student), 60, fp);\n```\n\nOne `fwrite` call persists the whole array — much simpler than formatting text. The catch: binary files are **not portable** across systems with different struct padding, endianness, or pointer sizes. Text format is portable; binary is fast but tied to its layout.\n\n`fseek(fp, offset, SEEK_SET)` and `ftell(fp)` give random access — jump to a position or learn the current one. Useful for databases and records.',
        code: '#include <stdio.h>\n\ntypedef struct { int id; float score; } Record;\n\nint main(void) {\n    Record r = {7, 9.5};\n    FILE *fp = fopen("rec.bin", "wb");\n    if (!fp) return 1;\n    fwrite(&r, sizeof(Record), 1, fp);\n    fclose(fp);\n\n    Record back;\n    fp = fopen("rec.bin", "rb");\n    if (!fp) return 1;\n    fread(&back, sizeof(Record), 1, fp);\n    fclose(fp);\n    printf("id=%d score=%.1f\\n", back.id, back.score);\n    return 0;\n}',
        note: '`fread`/`fwrite` persist raw struct bytes — fast, but tied to the machine layout.',
      },
    ],
    quizzes: [
      {
        text: 'Which fopen mode CREATES the file and TRUNCATES existing content?',
        options: ['"r"', '"a"', '"w"', '"r+"'],
        correctAnswer: '"w"',
      },
      {
        text: 'What does `fopen` return if the file cannot be opened?',
        options: ['0', 'NULL', 'EOF', 'An empty FILE*'],
        correctAnswer: 'NULL',
      },
      {
        text: '`fscanf(fp, "%d", &n)` needs `&n` because …?',
        options: [
          'It is optional',
          'fscanf stores the value at the given address',
          'It avoids warnings',
          'n is a global',
        ],
        correctAnswer: 'fscanf stores the value at the given address',
      },
      {
        text: 'What is the correct way to read a file line by line?',
        options: [
          '`while (fgets(line, sizeof(line), fp) != NULL)`',
          '`while (!feof(fp))` alone',
          '`for (;;) scanf("%s", line)`',
          '`gets(line)` in a loop',
        ],
        correctAnswer: '`while (fgets(line, sizeof(line), fp) != NULL)`',
      },
      {
        text: '`fread(&data, sizeof(data), 1, fp)` reads …?',
        options: [
          '1 byte',
          '1 item of size sizeof(data)',
          'sizeof(data) items of 1 byte',
          'The whole file',
        ],
        correctAnswer: '1 item of size sizeof(data)',
      },
      {
        text: 'Why is skipping `fclose` a problem?',
        options: [
          'The file locks forever',
          'Buffered data may not be flushed; file descriptors leak',
          'It crashes the program',
          'It deletes the file',
        ],
        correctAnswer: 'Buffered data may not be flushed; file descriptors leak',
      },
      {
        text: '`fseek(fp, 0, SEEK_END)` moves the file position to …?',
        options: [
          'The start',
          'The end of the file',
          'The middle',
          'The current position',
        ],
        correctAnswer: 'The end of the file',
      },
      {
        text: 'A binary file is …?',
        options: [
          'Human-readable text',
          'Raw bytes — fast but tied to the machine layout',
          'Always smaller than text',
          'Automatically encrypted',
        ],
        correctAnswer: 'Raw bytes — fast but tied to the machine layout',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 16 — Preprocessor & Macros
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 16,
    title: 'Preprocessor & Macros',
    description:
      'What happens before compilation: #include, #define, macro arguments, header guards, and conditional compilation.',
    topics: [
      {
        title: 'The Preprocessor: #include and #define',
        text:
          'Before the compiler sees your C code, the **preprocessor** runs. Every line starting with `#` is a preprocessor directive — handled at this stage, before syntax checking.\n\n**`#include <header>`** — pastes the contents of a header into your file.\n- `<...>` searches the system include path (`stdio.h`, `stdlib.h`).\n- `"..."` searches the current directory first, then the system path — use it for your own headers.\n\n**`#define NAME value`** — defines a **macro**: the preprocessor replaces every occurrence of `NAME` with `value` (text substitution, nothing smarter).\n\n```c\n#define PI 3.14159\n#define LIMIT 100\n```\n\nConventions: macros are UPPERCASE, defined near the top of the file, and do **not** end with a semicolon. Because substitution is pure text, `#define PI 3.14159;` would make every use `3.14159;` — likely a syntax error.\n\nMacros have no type and no scope rules (they last until `#undef` or end of file) — modern C prefers `const` for values and functions for logic. Macros survive mainly for constants that need to be visible to the preprocessor (e.g. in `#if`).',
        code: '#include <stdio.h>    // system header\n#include "myheader.h" // your header\n\n#define PI 3.14159\n\nint main(void) {\n    printf("%.2f\\n", PI);   // PI replaced by 3.14159\n    return 0;\n}',
        note: '`#include <...>` = system, `#include "..."` = your directory; #define is pure text substitution.',
      },
      {
        title: 'Function-Like Macros and Their Dangers',
        text:
          'Macros can take arguments — but they are **not functions**. They are text substitution with the arguments pasted in.\n\n```c\n#define SQUARE(x) ((x) * (x))\n```\n\nNote the double parentheses — they exist for a reason:\n```c\nSQUARE(3 + 2)  // without parens: 3 + 2 * 3 + 2 = 11 (WRONG!)\nSQUARE(3 + 2)  // with parens:    ((3+2) * (3+2)) = 25 (right)\n```\n\nWhy it happens: without the outer parens, the preprocessor produces `3 + 2 * 3 + 2`, and operator precedence makes it 11.\n\nOther macro dangers:\n- **Side effects evaluated multiple times**: `SQUARE(x++)` expands to `((x++) * (x++))` — x incremented twice!\n- **Arguments not type-checked**: no compiler errors for mismatched types.\n- Multi-statement macros are brittle: `#define SWAP(a,b) { ... }` breaks in `if/else` without a `do { ... } while(0)` wrapper.\n\nRule: prefer **inline functions** (which are typed and evaluate arguments once). Use macros only for small, parenthesis-heavy value substitutions or compile-time configuration.',
        code: '#include <stdio.h>\n\n#define BAD_SQUARE(x) x * x        // dangerous\n#define SQUARE(x) ((x) * (x))      // correct\n\nint main(void) {\n    printf("%d\\n", BAD_SQUARE(3 + 2));  // 11 (wrong)\n    printf("%d\\n", SQUARE(3 + 2));      // 25 (right)\n    return 0;\n}',
        note: 'Parenthesise every macro parameter and the whole macro body — or precedence will bite.',
      },
      {
        title: 'Header Guards and Conditional Compilation',
        text:
          '**Header guards** stop a header from being included twice (which would redefine types and error out). Every custom header should use one:\n\n```c\n// myheader.h\n#ifndef MYHEADER_H\n#define MYHEADER_H\n\nstruct Point { int x, y; };\n\n#endif\n```\n\nIf the file is included a second time, `MYHEADER_H` is already defined, so the body is skipped. (C11 offers `#pragma once` as a simpler alternative; both work.)\n\n**Conditional compilation** — `#if`, `#ifdef`, `#ifndef`, `#else`, `#endif` — lets the preprocessor include/exclude code at compile time:\n\n```c\n#ifdef DEBUG\n    printf("debug info\\n");\n#endif\n```\n\nIf `DEBUG` is defined (via `#define DEBUG` or `gcc -DDEBUG`), the block compiles; otherwise it vanishes. This is how production and debug builds differ without editing source. `#if defined(...)` and `#ifdef` work together with `#undef` to manage feature flags.\n\n`gcc -DNAME` defines a macro from the command line — cleanly toggling features per build.',
        code: '// main.c\n#include <stdio.h>\n// #define DEBUG      // uncomment or pass -DDEBUG to enable\n\nint main(void) {\n    int x = 10;\n#ifdef DEBUG\n    printf("x = %d\\n", x);\n#endif\n    printf("x + 1 = %d\\n", x + 1);\n    return 0;\n}\n// compile with: gcc -DDEBUG main.c -o main',
        note: 'Header guards (#ifndef) prevent double-inclusion; #ifdef lets you toggle code per build.',
      },
    ],
    quizzes: [
      {
        text: 'What does the preprocessor do FIRST in the compilation pipeline?',
        options: [
          'Checks syntax',
          'Expands #include and #define directives',
          'Creates machine code',
          'Links libraries',
        ],
        correctAnswer: 'Expands #include and #define directives',
      },
      {
        text: '`#define SQUARE(x) x * x` — what does `SQUARE(3 + 2)` expand to?',
        options: ['25', '11', '9', 'Compile error'],
        correctAnswer: '11',
      },
      {
        text: 'Why does the correct macro use `((x) * (x))`?',
        options: [
          'To make it faster',
          'To respect operator precedence when the argument is an expression',
          'It is cosmetic',
          'To avoid warnings',
        ],
        correctAnswer: 'To respect operator precedence when the argument is an expression',
      },
      {
        text: 'What is the purpose of a header guard `#ifndef X / #define X / #endif`?',
        options: [
          'To encrypt the header',
          'To prevent double inclusion of the header',
          'To make the header run faster',
          'To hide private functions',
        ],
        correctAnswer: 'To prevent double inclusion of the header',
      },
      {
        text: '`gcc -DDEBUG main.c` does what?',
        options: [
          'Runs the program',
          'Defines the DEBUG macro for the preprocessor',
          'Deletes debug symbols',
          'Optimises the binary',
        ],
        correctAnswer: 'Defines the DEBUG macro for the preprocessor',
      },
      {
        text: '`#include "myfile.h"` searches …?',
        options: [
          'Only the system directory',
          'The current directory first, then the system path',
          'The internet',
          'Only memory',
        ],
        correctAnswer: 'The current directory first, then the system path',
      },
      {
        text: 'Why are macros like `SQUARE(x++)` dangerous?',
        options: [
          'They are too slow',
          'The argument is substituted multiple times — x++ runs twice',
          'They cause stack overflow',
          'They cannot take arguments',
        ],
        correctAnswer: 'The argument is substituted multiple times — x++ runs twice',
      },
      {
        text: 'What is the modern preferred alternative to a small value macro?',
        options: [
          'A global variable',
          'A const variable',
          'A comment',
          'Nothing',
        ],
        correctAnswer: 'A const variable',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 17 — Linked Lists
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 17,
    title: 'Linked Lists',
    description:
      'Dynamic data structures: the node struct, singly linked lists, insertion, deletion, traversal, and why lists beat arrays for some jobs.',
    topics: [
      {
        title: 'Why Linked Lists Exist',
        text:
          'An array stores elements in contiguous memory with a fixed size. A **linked list** stores elements in scattered **nodes**, each holding data plus a pointer to the next node. The list "links" nodes together by address.\n\n```c\nstruct Node {\n    int data;\n    struct Node *next;\n};\n```\n\nAdvantages over arrays:\n- **Dynamic size** — grows and shrinks at runtime with no reallocation.\n- **O(1) insertion/deletion** *at the head* (or once you hold the node) — arrays must shift elements.\n- No wasted space for a fixed maximum.\n\nDisadvantages:\n- **No random access** — reaching element n requires walking n links (O(n)).\n- **No cache locality** — nodes are scattered, so iteration is slower than arrays in practice.\n- **Extra memory per element** — each node carries a pointer.\n- Manual allocation — every node must be malloc’d and eventually freed.\n\nThe node struct is the first **self-referential structure** you meet: a struct that contains a pointer to its own type. That is legal because the pointer has a known size even while the struct is incomplete.',
        code: '#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node *next;   // self-referential pointer\n};\n\nint main(void) {\n    struct Node *head = malloc(sizeof(struct Node));\n    head->data = 10;\n    head->next = malloc(sizeof(struct Node));\n    head->next->data = 20;\n    head->next->next = NULL;          // end of list\n\n    for (struct Node *p = head; p != NULL; p = p->next) {\n        printf("%d -> ", p->data);\n    }\n    printf("NULL\\n");\n\n    free(head->next);\n    free(head);\n    return 0;\n}',
        note: 'A node = data + pointer to next. Lists trade random access for dynamic size and O(1) head inserts.',
      },
      {
        title: 'Inserting at the Head: The O(1) Win',
        text:
          'Inserting a node at the front of a linked list is the signature fast operation — O(1), regardless of list length.\n\n```c\nstruct Node *insertHead(struct Node *head, int val) {\n    struct Node *n = malloc(sizeof(struct Node));\n    n->data = val;\n    n->next = head;   // new node points to old head\n    return n;         // new head\n}\n```\n\nSteps:\n1. Allocate the new node.\n2. Set its `next` to the current `head`.\n3. Return it as the new `head`.\n\nThe order matters: you must point the new node at the old head *before* changing head — otherwise you lose the list.\n\nInserting at the **end** is O(n) because you must walk to the last node first (unless you keep a tail pointer). Inserting at the **middle** is O(n) to find the spot, then O(1) to splice.\n\nThe head-pointer-updating pattern — `head = insertHead(head, x);` — is why list functions return the possibly-changed head rather than `void`.\n\nAll this assumes `malloc` succeeded; check the return value and handle NULL.',
        code: 'struct Node *insertHead(struct Node *head, int val) {\n    struct Node *n = malloc(sizeof(struct Node));\n    if (n == NULL) return head;      // allocation failed\n    n->data = val;\n    n->next = head;                  // link to old head\n    return n;                        // new head\n}\n\n// usage in main:\n// head = insertHead(head, 5);',
        note: 'Insert-at-head is O(1): allocate, point at old head, return as new head.',
      },
      {
        title: 'Traversal, Search, and Deletion',
        text:
          '**Traversal** walks the list node by node until the NULL terminator:\n\n```c\nfor (struct Node *p = head; p != NULL; p = p->next) {\n    // process p->data\n}\n```\n\n**Search** is the same walk, stopping when data matches (or the list ends — returning NULL if not found).\n\n**Deletion** is where linked-list bugs live, because you must keep a pointer to the *previous* node to relink:\n\n```c\nstruct Node *deleteNode(struct Node *head, int val) {\n    struct Node *prev = NULL, *cur = head;\n    while (cur && cur->data != val) {\n        prev = cur;\n        cur = cur->next;\n    }\n    if (cur == NULL) return head;     // not found\n    if (prev == NULL) head = cur->next;   // deleting the head\n    else prev->next = cur->next;          // splice around cur\n    free(cur);                        // free the removed node\n    return head;\n}\n```\n\nThree cases: delete the **head** (update head), delete the **middle** (prev->next jumps over it), delete the **tail** (prev->next = NULL). Always free the removed node, and always return the (possibly new) head.\n\nMemory rule: to free a whole list, save `next` BEFORE freeing the current node — otherwise you dereference freed memory.',
        code: 'void freeList(struct Node *head) {\n    struct Node *p = head;\n    while (p != NULL) {\n        struct Node *next = p->next;   // save before free\n        free(p);\n        p = next;\n    }\n}',
        note: 'Deletion needs the previous node to relink; save next before freeing during cleanup.',
      },
    ],
    quizzes: [
      {
        text: 'What does the node struct of a singly linked list contain?',
        options: [
          'Only data',
          'Data and a pointer to the next node',
          'Data and its index',
          'Two pointers only',
        ],
        correctAnswer: 'Data and a pointer to the next node',
      },
      {
        text: 'Inserting a node at the HEAD of a linked list is …?',
        options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
        correctAnswer: 'O(1)',
      },
      {
        text: 'Random access to element n of a linked list is …?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'Impossible'],
        correctAnswer: 'O(n)',
      },
      {
        text: 'To delete a middle node, you need …?',
        options: [
          'Only the target node',
          'The previous node to relink around it',
          'The head only',
          'An index',
        ],
        correctAnswer: 'The previous node to relink around it',
      },
      {
        text: 'Which is an ADVANTAGE of a linked list over an array?',
        options: [
          'Constant-time random access',
          'Dynamic size with O(1) head insertion',
          'Better cache locality',
          'No memory overhead',
        ],
        correctAnswer: 'Dynamic size with O(1) head insertion',
      },
      {
        text: 'How does traversal of a singly linked list terminate?',
        options: [
          'When a counter reaches n',
          'When `p == NULL`',
          'When `p->next == p`',
          'Never',
        ],
        correctAnswer: 'When `p == NULL`',
      },
      {
        text: 'When freeing a linked list, why save `p->next` before `free(p)`?',
        options: [
          'To avoid losing the head',
          'Dereferencing freed memory is undefined behaviour',
          'It is required by the compiler',
          'To count nodes',
        ],
        correctAnswer: 'Dereferencing freed memory is undefined behaviour',
      },
      {
        text: 'A struct containing a pointer to its own type is called …?',
        options: [
          'Recursive by value',
          'Self-referential structure',
          'A circular pointer',
          'An array of pointers',
        ],
        correctAnswer: 'Self-referential structure',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 18 — Stacks & Queues
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 18,
    title: 'Stacks & Queues',
    description:
      'Two classic abstract data types: LIFO stacks and FIFO queues, array implementations, and their real-world applications.',
    topics: [
      {
        title: 'The Stack: LIFO',
        text:
          'A **stack** is a collection with **LIFO** discipline — Last In, First Out. Like a stack of plates: you take the one on top, and you put new ones on top.\n\nCore operations (all expected O(1)):\n- **`push(x)`** — add x to the top.\n- **`pop()`** — remove and return the top.\n- **`peek()` / `top()`** — look at the top without removing.\n- `isEmpty()` — check emptiness.\n\nAn array-based stack is simple: a `data[]` array plus a `top` index. `push` writes at `top` and increments; `pop` decrements and returns `data[top]`.\n\nBoundary conditions (exam favourites):\n- **Overflow** — pushing onto a full stack (fixed array).\n- **Underflow** — popping an empty stack.\n\nReal applications: function-call frames (Section 7), expression evaluation, undo/redo in editors, backtracking (maze solvers), and browser back buttons.\n\nRecursion itself is implemented with the call stack — each recursive call pushes a frame; unwinding pops them.',
        code: '#include <stdio.h>\n#define MAX 100\n\nint stack[MAX];\nint top = -1;                 // empty stack\n\nvoid push(int x) {\n    if (top == MAX - 1) { printf("Overflow!\\n"); return; }\n    stack[++top] = x;          // increment then store\n}\n\nint pop(void) {\n    if (top == -1) { printf("Underflow!\\n"); return -1; }\n    return stack[top--];       // return then decrement\n}\n\nint main(void) {\n    push(1); push(2); push(3);\n    printf("%d\\n", pop());    // 3 — LIFO\n    printf("%d\\n", pop());    // 2\n    return 0;\n}',
        note: 'Stack = LIFO; `push` to top, `pop` from top; watch overflow and underflow.',
      },
      {
        title: 'The Queue: FIFO',
        text:
          'A **queue** follows **FIFO** — First In, First Out. Like a ticket line: the first person in is served first.\n\nCore operations (expected O(1)):\n- **`enqueue(x)`** — add x at the rear.\n- **`dequeue()`** — remove and return the front.\n- **`front()`** — look at the front.\n\nAn array-based queue uses two indices: `front` (where we remove) and `rear` (where we add). Simple arrays waste space as both advance — hence the **circular queue**, where the indices wrap around (`(rear + 1) % MAX`).\n\nIn a circular queue:\n- `enqueue` writes at `rear`, then `rear = (rear + 1) % MAX`.\n- `dequeue` reads at `front`, then `front = (front + 1) % MAX`.\n- The queue is full when `(rear + 1) % MAX == front`.\n\nReal applications: CPU/job scheduling, print spoolers, breadth-first search, keyboard buffers, and message queues between processes/threads.',
        code: '#include <stdio.h>\n#define MAX 5\n\nint q[MAX];\nint front = 0, rear = 0, count = 0;\n\nvoid enqueue(int x) {\n    if (count == MAX) { printf("Full!\\n"); return; }\n    q[rear] = x;\n    rear = (rear + 1) % MAX;   // circular wrap\n    count++;\n}\n\nint dequeue(void) {\n    if (count == 0) { printf("Empty!\\n"); return -1; }\n    int v = q[front];\n    front = (front + 1) % MAX;\n    count--;\n    return v;\n}\n\nint main(void) {\n    enqueue(1); enqueue(2); enqueue(3);\n    printf("%d\\n", dequeue());  // 1 — FIFO\n    return 0;\n}',
        note: 'Queue = FIFO; enqueue at rear, dequeue from front; circular array avoids wasted space.',
      },
    ],
    quizzes: [
      {
        text: 'A stack follows which discipline?',
        options: ['FIFO', 'LIFO', 'Random', 'Priority'],
        correctAnswer: 'LIFO',
      },
      {
        text: 'A queue follows which discipline?',
        options: ['FIFO', 'LIFO', 'Random', 'Sorted'],
        correctAnswer: 'FIFO',
      },
      {
        text: 'Pushing onto a full array-based stack is called …?',
        options: ['Underflow', 'Overflow', 'Segfault', 'Deadlock'],
        correctAnswer: 'Overflow',
      },
      {
        text: 'Which is a real application of a STACK?',
        options: [
          'Print spooling',
          'Undo/redo in an editor',
          'CPU scheduling',
          'Message queues',
        ],
        correctAnswer: 'Undo/redo in an editor',
      },
      {
        text: 'Why is a circular queue used?',
        options: [
          'It is the only valid queue',
          'To reuse freed slots instead of wasting array space',
          'To make enqueue faster',
          'To sort elements',
        ],
        correctAnswer: 'To reuse freed slots instead of wasting array space',
      },
      {
        text: 'Popping from an empty stack is called …?',
        options: ['Overflow', 'Underflow', 'Spill', 'Collision'],
        correctAnswer: 'Underflow',
      },
      {
        text: '`push(1); push(2); pop();` — what does pop return?',
        options: ['1', '2', '0', 'Undefined'],
        correctAnswer: '2',
      },
      {
        text: 'Which is a real application of a QUEUE?',
        options: [
          'Function call frames',
          'Print spooling / job scheduling',
          'Undo history',
          'Expression evaluation',
        ],
        correctAnswer: 'Print spooling / job scheduling',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 19 — Sorting & Searching Algorithms
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 19,
    title: 'Sorting & Searching Algorithms',
    description:
      'Linear vs binary search, and the classic sorts — bubble, selection, insertion, merge, quick — with their complexities.',
    topics: [
      {
        title: 'Linear Search and Binary Search',
        text:
          '**Linear search** scans every element until it finds the target. Simple, works on **any** array, O(n) worst case.\n\n```c\nfor (int i = 0; i < n; i++)\n    if (arr[i] == target) return i;\nreturn -1;\n```\n\n**Binary search** is dramatically faster — O(log n) — but requires a **sorted** array. It repeatedly halves the search range:\n\n1. Compare the middle element with the target.\n2. If equal — found.\n3. If target < middle, search the left half; else the right half.\n4. Repeat until the range is empty.\n\n```c\nint binarySearch(int a[], int n, int t) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == t) return mid;\n        else if (a[mid] < t) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n```\n\n`mid = lo + (hi - lo) / 2` avoids the overflow bug of `(lo + hi) / 2`.\n\nBinary search on an **unsorted** array is meaningless — the halving assumption breaks and it returns wrong results. This is the classic exam trap.',
        code: '#include <stdio.h>\n\nint binarySearch(int a[], int n, int t) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == t) return mid;\n        else if (a[mid] < t) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n\nint main(void) {\n    int a[] = {2, 5, 8, 12, 16, 23, 38};\n    printf("%d\\n", binarySearch(a, 7, 23));  // 5\n    printf("%d\\n", binarySearch(a, 7, 99));  // -1\n    return 0;\n}',
        note: 'Binary search: sorted input only, O(log n) — half the range each step.',
      },
      {
        title: 'The Simple Sorts: Bubble, Selection, Insertion',
        text:
          'Three elementary sorts are O(n²) worst-case but tiny and stable to code:\n\n**Bubble sort** — repeatedly compares adjacent elements and swaps them if out of order. Each pass pushes the largest remaining element to the end. Early exit flag when a pass makes no swaps.\n\n**Selection sort** — finds the *minimum* of the unsorted part and swaps it to the front. Always exactly n(n−1)/2 comparisons.\n\n**Insertion sort** — builds the sorted part one element at a time, inserting each new element into its correct place (like sorting playing cards). Excellent on nearly-sorted data; O(n) best case.\n\nComplexities:\n| Sort | Best | Average | Worst |\n|---|---|---|---|\n| Bubble | O(n) | O(n²) | O(n²) |\n| Selection | O(n²) | O(n²) | O(n²) |\n| Insertion | O(n) | O(n²) | O(n²) |\n\nBubble and insertion are **stable** (equal elements keep relative order); selection is typically unstable.',
        code: '// Bubble sort — one pass pushes the max to the end\nvoid bubbleSort(int a[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (a[j] > a[j + 1]) {\n                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;\n            }\n        }\n    }\n}',
        note: 'All three simple sorts are O(n²); insertion shines on nearly-sorted data.',
      },
      {
        title: 'Merge Sort and Quick Sort: O(n log n)',
        text:
          'The divide-and-conquer sorts reach **O(n log n)**, the practical best for comparison sorting.\n\n**Merge sort** — divide the array in half, sort each half recursively, then **merge** the two sorted halves:\n- Always O(n log n) regardless of input.\n- **Stable**.\n- Needs O(n) extra memory for merging.\n- Recursion-friendly; ideal for sorting linked lists.\n\n**Quick sort** — pick a **pivot**, partition the array so smaller elements go left and larger right, then recurse on both sides:\n- Average O(n log n), **worst case O(n²)** when the pivot is consistently the smallest/largest (e.g., already-sorted input with a naive pivot).\n- **In-place** (O(log n) stack for recursion) — no big extra buffer.\n- Pivot choice (first, last, middle, random) determines behaviour; random/middle pivots tame the worst case.\n\nIn practice quicksort is usually fastest for arrays; merge sort for linked lists and guaranteed bounds.',
        code: '// Partition step of quicksort (Lomuto) — returns pivot index\nint partition(int a[], int lo, int hi) {\n    int pivot = a[hi];\n    int i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (a[j] < pivot) {\n            i++;\n            int t = a[i]; a[i] = a[j]; a[j] = t;\n        }\n    }\n    int t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;\n    return i + 1;\n}\n// then quicksort recurses on [lo..p-1] and [p+1..hi]',
        note: 'Merge = stable, always O(n log n), extra memory; Quick = in-place, O(n²) worst case.',
      },
    ],
    quizzes: [
      {
        text: 'What precondition does binary search require?',
        options: [
          'The array is small',
          'The array is sorted',
          'The array has no duplicates',
          'The array is in memory',
        ],
        correctAnswer: 'The array is sorted',
      },
      {
        text: 'Worst-case time complexity of linear search in an array of size n?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 'O(n)',
      },
      {
        text: 'Time complexity of binary search?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 'O(log n)',
      },
      {
        text: 'Worst-case complexity of bubble sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 'O(n²)',
      },
      {
        text: 'Which sort ALWAYS runs in O(n log n) regardless of input?',
        options: ['Bubble sort', 'Quick sort', 'Merge sort', 'Selection sort'],
        correctAnswer: 'Merge sort',
      },
      {
        text: 'What is the worst-case complexity of quick sort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(n³)'],
        correctAnswer: 'O(n²)',
      },
      {
        text: 'Which sort achieves its best case of O(n) on already-sorted data?',
        options: ['Selection sort', 'Insertion sort', 'Merge sort', 'Quick sort with a middle pivot'],
        correctAnswer: 'Insertion sort',
      },
      {
        text: '`mid = lo + (hi - lo) / 2` is preferred over `(lo + hi) / 2` because …?',
        options: [
          'It is faster',
          'It avoids integer overflow for large lo and hi',
          'It always rounds down',
          'It is easier to read',
        ],
        correctAnswer: 'It avoids integer overflow for large lo and hi',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 20 — Capstone Project + Certification Prep
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 20,
    title: 'Capstone Project + Certification Prep',
    description:
      'Putting it all together: designing a complete C program, project ideas, testing, and a final revision checklist for the exam.',
    topics: [
      {
        title: 'Designing a Complete C Project',
        text:
          'The capstone is where every section meets. A good project plan has stages:\n\n1. **Requirement**: write one paragraph — what does the program do, who uses it, what data flows in/out.\n2. **Design**: choose your data structures (structs for records, arrays/lists for collections) and functions (one responsibility each).\n3. **Layout**: header files for declarations, `.c` files for implementations, `main.c` for the entry point.\n4. **Implementation**: build bottom-up — implement and test each function before moving on.\n5. **Testing**: try normal, edge, and invalid inputs (see below).\n6. **Documentation**: comments, a README, and a user guide.\n\nClassic capstone ideas that exercise every section:\n- **Student Marks Management** — structs for students, arrays/linked lists, files to save/load, sorting to rank, searching to find.\n- **Library / Inventory System** — records, file persistence, menu loop (do-while), string handling.\n- **Mini Calculator / Expression Evaluator** — stacks for evaluation.\n- **Grade Report with Stats** — file input, arrays, sorting, formatted output.\n\nRule: a working, tested small program beats a sprawling broken one. Scope ruthlessly.',
        code: '// Project skeleton — student record manager\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\ntypedef struct {\n    int roll;\n    char name[50];\n    float cgpa;\n} Student;\n\nvoid addStudent(Student class[], int *n);\nvoid saveFile(Student class[], int n);\nvoid loadFile(Student class[], int *n);\n\nint main(void) {\n    Student class[100];\n    int count = 0;\n    loadFile(class, &count);\n    // menu loop with do-while + switch\n    return 0;\n}',
        note: 'Plan data structures FIRST — the struct/function split makes or breaks a project.',
      },
      {
        title: 'Debugging and Testing Like a Professional',
        text:
          'Bugs are inevitable; a method finds them fast.\n\n**Print debugging** — the first tool: printf variable values at key points. Cheap and effective for most bugs.\n\n**A debugger** (`gdb` on Linux) lets you set breakpoints, step line by line, and inspect variables — far faster than print-and-recompile for subtle issues.\n\n**Testing matrix** — always test:\n- **Normal cases**: typical valid input.\n- **Edge cases**: empty input, single element, max values, boundary indexes.\n- **Invalid input**: non-numeric where numbers expected, out-of-range values, NULL pointers.\n- **Repeated runs**: does it behave the same? (catches uninitialised variables)\n\nCommon C bugs to look for by name: uninitialised variable, off-by-one, out-of-bounds array access, missing `&` in scanf, `=` vs `==`, forgetting `\\0`, not freeing memory, NULL dereference.\n\nCompile with `-Wall -Wextra -g` during development — warnings + debug symbols are free static analysis. Run your code under a **sanitiser** (`gcc -fsanitize=address`) to catch memory bugs automatically.',
        code: '# Build with warnings and ASan during development — it catches\n# buffer overflows and use-after-free automatically.\ngcc -Wall -Wextra -g -fsanitize=address program.c -o program\n./program',
        note: 'Edge cases + invalid input + `-Wall -Wextra -g` + ASan catch almost every C bug early.',
      },
      {
        title: 'Final Revision Checklist for the Exam',
        text:
          'Before the exam, be able to *write, trace, and explain* these — fluency matters more than memorisation:\n\n1. **Basics**: compile pipeline, tokens, keywords, identifiers, comments.\n2. **Types & operators**: sizeof, integer division, precedence, bitwise ops.\n3. **I/O**: printf/scanf specifiers, fgets vs gets, buffer pitfalls.\n4. **Control flow**: if-else/ternary/switch, loops + break/continue, infinite loops.\n5. **Functions**: pass-by-value, prototypes, call stack, recursion + base case.\n6. **Arrays & strings**: bounds, decay to pointers, null terminator, strcmp.\n7. **Pointers**: & and *, pointer arithmetic, NULL, swap pattern.\n8. **Memory**: malloc/calloc/realloc/free, leaks, dangling pointers.\n9. **Structs/unions**: `.` vs `->`, typedef, union memory sharing.\n10. **Files**: fopen modes, fgets/fprintf/fscanf, fread/fwrite, fclose.\n11. **Preprocessor**: #define, macro pitfalls, header guards, #ifdef.\n12. **Data structures**: linked list ops, stack (LIFO), queue (FIFO).\n13. **Algorithms**: binary search precondition, sorting complexities.\n\nTrace questions are guaranteed: "what does this code print?" — practice by hand-tracing every code block in this course.\n\nTime management: write the skeleton first, then fill details; leave 10 minutes to recheck each answer.',
        code: '// One last hand-trace before the exam — predict the output, then run:\n#include <stdio.h>\nint main(void) {\n    int a[] = {1, 2, 3, 4};\n    int *p = a;\n    printf("%d %d\\n", *p, *(p + 3));   // ? ?\n    printf("%zu\\n\", sizeof(a) / sizeof(a[0]));  // ?\n    return 0;\n}\n// Answers: 1 4  |  4',
        note: 'Hand-trace = the #1 exam skill. If you can trace it, you understand it.',
      },
    ],
    quizzes: [
      {
        text: 'Which is a reasonable FIRST step in designing a C project?',
        options: [
          'Write all the code at once',
          'Define requirements and choose data structures',
          'Skip testing',
          'Use only global variables',
        ],
        correctAnswer: 'Define requirements and choose data structures',
      },
      {
        text: 'Which project naturally exercises structs + files + sorting + searching?',
        options: [
          'A hello-world program',
          'A student marks management system',
          'A single if-else demo',
          'A macro expansion',
        ],
        correctAnswer: 'A student marks management system',
      },
      {
        text: '`gcc -fsanitize=address` catches …?',
        options: [
          'Syntax errors',
          'Memory bugs like buffer overflows and use-after-free',
          'Logic errors only',
          'All runtime bugs automatically',
        ],
        correctAnswer: 'Memory bugs like buffer overflows and use-after-free',
      },
      {
        text: 'Which is an EDGE case you must test?',
        options: [
          'Typical valid input only',
          'Empty input and boundary values',
          'Only the happy path',
          'Compile-only',
        ],
        correctAnswer: 'Empty input and boundary values',
      },
      {
        text: '`int a[] = {1,2,3,4}; int *p = a;` — `*(p + 3)` is …?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '4',
      },
      {
        text: 'Which skill is most important for C exam code-trace questions?',
        options: [
          'Memorising syntax',
          'Hand-tracing code line by line',
          'Using a debugger in the exam',
          'Copying past programs',
        ],
        correctAnswer: 'Hand-tracing code line by line',
      },
      {
        text: 'A good project uses functions so that …?',
        options: [
          'The file is longer',
          'Each function has one responsibility and is testable',
          'Global variables are avoided at all costs',
          'The program never needs headers',
        ],
        correctAnswer: 'Each function has one responsibility and is testable',
      },
      {
        text: '`printf("%zu", sizeof(a) / sizeof(a[0]))` for `int a[4]` prints?',
        options: ['4', '16', '2', '8'],
        correctAnswer: '4',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Final Exam — 15 original, distinct questions replacing the 50 near-identical
// template questions. Covers all 20 sections.
// ---------------------------------------------------------------------------
export interface CFinalExamQuestion {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const cFinalExam: CFinalExamQuestion[] = [
  {
    text: 'A student writes `int x = 7 / 2; printf("%d", x);`. What prints?',
    options: ['3.5', '3', '4', 'Compile error'],
    correctAnswer: '3',
  },
  {
    text: 'Which sequence correctly describes the C build pipeline?',
    options: [
      'Link → Compile → Preprocess → Assemble',
      'Preprocess → Compile → Assemble → Link',
      'Compile → Preprocess → Link → Assemble',
      'Assemble → Preprocess → Compile → Link',
    ],
    correctAnswer: 'Preprocess → Compile → Assemble → Link',
  },
  {
    text: '`int a[10];` — what are the valid indices?',
    options: ['1..10', '0..9', '0..10', '1..9'],
    correctAnswer: '0..9',
  },
  {
    text: 'Which correctly swaps two integers from main?',
    options: [
      '`swap(x, y)` with `void swap(int a, int b)`',
      '`swap(&x, &y)` with `void swap(int *a, int *b)`',
      '`swap(x, y)` with `void swap(int *a, int *b)`',
      '`swap(&x, &y)` with `void swap(int a, int b)`',
    ],
    correctAnswer: '`swap(&x, &y)` with `void swap(int *a, int *b)`',
  },
  {
    text: 'Which is TRUE about `strcmp("abc", "abd")`?',
    options: [
      'It returns 0',
      'It returns a negative value (abc < abd)',
      'It returns a positive value',
      'It crashes',
    ],
    correctAnswer: 'It returns a negative value (abc < abd)',
  },
  {
    text: '`char *s = "abc"; s[0] = \'z\';` — why is this undefined behaviour?',
    options: [
      's is not initialised',
      's points to a string literal in read-only memory',
      's is too small',
      'It is perfectly safe',
    ],
    correctAnswer: 's points to a string literal in read-only memory',
  },
  {
    text: 'What does `malloc(0)` with no failure check most dangerously hide?',
    options: [
      'It always returns NULL',
      'It returns a valid pointer to zero bytes — a NULL check may not catch logic issues',
      'It crashes immediately',
      'It frees all memory',
    ],
    correctAnswer: 'It returns a valid pointer to zero bytes — a NULL check may not catch logic issues',
  },
  {
    text: '`struct A { int x; }; union B { int y; char z; };` — which is typically larger?',
    options: [
      'struct A',
      'union B',
      'They are always equal',
      'Impossible to say',
    ],
    correctAnswer: 'struct A',
  },
  {
    text: 'Which fopen mode both reads AND writes, truncating the file to zero length?',
    options: ['"r+"', '"w+"', '"a"', '"a+"'],
    correctAnswer: '"w+"',
  },
  {
    text: '`#define SQ(x) x*x` — what is `SQ(2 + 3)`?',
    options: ['25', '11', '13', '10'],
    correctAnswer: '11',
  },
  {
    text: 'In a singly linked list, how do you delete the HEAD node safely?',
    options: [
      'Free it, then dereference it',
      'Save `head->next`, free head, return the saved node as new head',
      'Set head to NULL and free nothing',
      'You cannot delete the head',
    ],
    correctAnswer: 'Save `head->next`, free head, return the saved node as new head',
  },
  {
    text: 'Which structure naturally pairs with LIFO (Last In, First Out) semantics?',
    options: ['Queue', 'Stack', 'Linked list head', 'Hash table'],
    correctAnswer: 'Stack',
  },
  {
    text: 'Binary search is applied to which input safely?',
    options: [
      'Any unsorted array',
      'Only a sorted array',
      'Only a linked list',
      'Only strings',
    ],
    correctAnswer: 'Only a sorted array',
  },
  {
    text: 'Which sort has the same O(n²) worst case but O(n) best case on nearly-sorted data?',
    options: ['Selection sort', 'Insertion sort', 'Merge sort', 'Quick sort'],
    correctAnswer: 'Insertion sort',
  },
  {
    text: 'What is the purpose of a header guard in a `.h` file?',
    options: [
      'Speed up compilation',
      'Prevent double inclusion of the header',
      'Hide function implementations',
      'Make macros global',
    ],
    correctAnswer: 'Prevent double inclusion of the header',
  },
];

