// ============================================================================
// C & Systems Programming — Per-Topic Quiz Map (issue #92)
// ----------------------------------------------------------------------------
// The frontend topic-lock flow requires EVERY topic to have its own attached
// QuizQuestions: "Start Topic Quiz" hits /quiz/questions/topic/:topicId and
// returns null (→ 404 → topic locked forever) if a topic has zero questions.
// These are the topic-level gates; section-level chapter quizzes live in c.ts.
// Keyed by the EXACT topic title from cSections (titles are course-unique).
// ============================================================================

export interface CTopicQuiz {
  text: string;
  options: string[]; // exactly 4
  correctAnswer: string; // one of options
}

export const cTopicQuizzes: Record<string, CTopicQuiz[]> = {
  // ── WEEK 1 — Introduction to C & Environment Setup ────────────────────────
  'Why C Still Matters in 2026': [
    { text: 'Who created C and where was it developed?', options: ['Bjarne Stroustrup, AT&T Bell Labs', 'Dennis Ritchie, AT&T Bell Labs', 'Linus Torvalds, University of Helsinki', 'James Gosling, Sun Microsystems'], correctAnswer: 'Dennis Ritchie, AT&T Bell Labs' },
    { text: 'Which of the following was the first major system written in C?', options: ['UNIX', 'Windows 95', 'Linux', 'MS-DOS'], correctAnswer: 'UNIX' },
    { text: 'Why does C give lower-level control than languages like Python?', options: ['It has more libraries', 'It lets you manage memory directly', 'It runs on a virtual machine', 'It is interpreted'], correctAnswer: 'It lets you manage memory directly' },
    { text: 'The current widely-used C standard ratified recently is…?', options: ['C89', 'C99', 'C23', 'C11'], correctAnswer: 'C23' },
  ],
  'The Compilation Pipeline: Source to Binary': [
    { text: 'Which stage expands #include and #define directives?', options: ['Compilation', 'Assembly', 'Preprocessing', 'Linking'], correctAnswer: 'Preprocessing' },
    { text: 'The compiler translates preprocessed C into…?', options: ['Machine code', 'Assembly code', 'Bytecode', 'Object files directly'], correctAnswer: 'Assembly code' },
    { text: 'What does the LINKER do?', options: ['Checks syntax', 'Combines object files with libraries into the executable', 'Expands macros', 'Optimises assembly'], correctAnswer: 'Combines object files with libraries into the executable' },
    { text: '`undefined reference to printf` is an error from which stage?', options: ['Preprocessor', 'Compiler', 'Linker', 'Assembler'], correctAnswer: 'Linker' },
  ],
  'Setting Up: Compiler, Editor, and Terminal': [
    { text: 'Which command checks that GCC is installed?', options: ['gcc run', 'gcc --version', 'gcc install', 'version gcc'], correctAnswer: 'gcc --version' },
    { text: 'Which compiler flag set enables warnings in GCC?', options: ['-O2', '-Wall -Wextra', '-g -O3', '-o -e'], correctAnswer: '-Wall -Wextra' },
    { text: 'What does `gcc -Wall -Wextra first.c -o first` produce?', options: ['An object file first.o', 'An executable named first', 'Assembly file first.s', 'A preprocessed file'], correctAnswer: 'An executable named first' },
    { text: 'When a C file fails to compile, which error should you read FIRST?', options: ['The last one', 'The first one — later errors often cascade from it', 'The longest one', 'Any of them'], correctAnswer: 'The first one — later errors often cascade from it' },
  ],
  'Anatomy of a C Program': [
    { text: 'Which is the entry point every C program must have?', options: ['start()', 'begin()', 'main()', 'run()'], correctAnswer: 'main()' },
    { text: '`int main(void) { return 0; }` returning 0 signals what to the OS?', options: ['An error occurred', 'Success', 'A warning', 'Nothing'], correctAnswer: 'Success' },
    { text: 'Forgetting a semicolon at the end of a statement causes a…?', options: ['Linker error', 'Runtime crash', 'Compile error', 'Warning only'], correctAnswer: 'Compile error' },
    { text: 'Variables declared inside a block `{ }` are visible…?', options: ['Everywhere in the file', 'Only inside that block', 'In the whole function', 'Nowhere'], correctAnswer: 'Only inside that block' },
  ],

  // ── WEEK 2 — C Basics: Tokens, Keywords, Identifiers, Comments ───────────
  'Tokens: The Smallest Meaningful Units': [
    { text: 'Which is NOT a category of C token?', options: ['Keywords', 'Operators', 'Punctuators', 'Functions'], correctAnswer: 'Functions' },
    { text: '`int x = 5;` — how many distinct tokens does the statement contain?', options: ['3', '4', '5', '6'], correctAnswer: '5' },
    { text: 'Whitespace in C is used to…?', options: ['End statements', 'Separate tokens', 'Create strings', 'Declare variables'], correctAnswer: 'Separate tokens' },
    { text: 'A literal like `3.14` is a token of which kind?', options: ['Keyword', 'Identifier', 'Constant', 'Punctuator'], correctAnswer: 'Constant' },
  ],
  'Keywords: The Reserved Words': [
    { text: 'Which of these is a C keyword?', options: ['main', 'printf', 'return', 'screen'], correctAnswer: 'return' },
    { text: 'Can you use a keyword as a variable name?', options: ['Yes, always', 'No — they are reserved', 'Only with a prefix', 'Only in C23'], correctAnswer: 'No — they are reserved' },
    { text: 'Which is a valid C keyword?', options: ['foreach', 'switch', 'print', 'var'], correctAnswer: 'switch' },
    { text: 'How many keywords does standard C roughly have?', options: ['12', '32', '64', '100'], correctAnswer: '32' },
  ],
  'Identifiers: Naming Your Variables and Functions': [
    { text: 'Which identifier is VALID in C?', options: ['1stPlace', 'my-Var', '_temp', 'class'], correctAnswer: '_temp' },
    { text: '`int Class;` vs `int class;` — is this valid?', options: ['No, both are keywords', 'Yes — C is case-sensitive, so they are different identifiers', 'Only one is valid', 'Neither is valid'], correctAnswer: 'Yes — C is case-sensitive, so they are different identifiers' },
    { text: 'Identifiers must NOT begin with…?', options: ['An underscore', 'A letter', 'A digit', 'A dollar sign'], correctAnswer: 'A digit' },
    { text: 'Which identifier is reserved by the standard library convention (avoid it)?', options: ['total_marks', 'num2', '_store', 'avgScore'], correctAnswer: '_store' },
  ],
  'Comments: Documenting Code for Humans': [
    { text: 'Which is a valid single-line comment?', options: ['// this is a comment', '# this is a comment', '/* this is a comment', "' this is a comment"], correctAnswer: '// this is a comment' },
    { text: 'What does the compiler do with comments?', options: ['Executes them', 'Ignores them', 'Prints them', 'Converts them to variables'], correctAnswer: 'Ignores them' },
    { text: '`/* outer /* inner */ still here */` — how does the compiler treat this?', options: ['Valid — comments nest', 'Comment ends at the first */', 'Syntax error', 'Depends on the compiler'], correctAnswer: 'Comment ends at the first */' },
    { text: 'The purpose of comments is to…?', options: ['Speed up execution', 'Document intent for humans', 'Reduce memory', 'Prevent errors'], correctAnswer: 'Document intent for humans' },
  ],

  // ── WEEK 3 — Variables, Data Types & Operators ────────────────────────────
  'Primitive Data Types and Their Sizes': [
    { text: '`char` typically occupies how many bytes?', options: ['1', '2', '4', '8'], correctAnswer: '1' },
    { text: 'Which type is most appropriate for storing a person\'s age?', options: ['int', 'float', 'double', 'char'], correctAnswer: 'int' },
    { text: '`sizeof(int)` in C is…?', options: ['Always 4', 'Always 2', 'Implementation-defined (usually 4 on modern systems)', 'Always 8'], correctAnswer: 'Implementation-defined (usually 4 on modern systems)' },
    { text: 'Which type can store a wider range of decimal values?', options: ['float', 'double', 'int', 'char'], correctAnswer: 'double' },
  ],
  'Declaring and Initialising Variables': [
    { text: 'Which declares and initialises in one line?', options: ['int x;', 'x = 5;', 'int x = 5;', 'int 5 = x;'], correctAnswer: 'int x = 5;' },
    { text: 'What is the value of an uninitialised local int?', options: ['0', '1', 'Garbage/indeterminate', 'NULL'], correctAnswer: 'Garbage/indeterminate' },
    { text: '`const int LIMIT = 100;` — what happens if you later write `LIMIT = 200;`?', options: ['Works fine', 'Compile error', 'Runtime crash', 'Warning only'], correctAnswer: 'Compile error' },
    { text: 'Which is a valid declaration?', options: ['int 2a;', 'int a2;', 'int a b;', 'double 2.5;'], correctAnswer: 'int a2;' },
  ],
  'Arithmetic, Relational & Logical Operators': [
    { text: '`int a = 5; int b = 2; a / b` evaluates to?', options: ['2.5', '2', '3', '2.0'], correctAnswer: '2' },
    { text: 'What does `7 % 3` evaluate to?', options: ['2', '1', '3', '2.33'], correctAnswer: '1' },
    { text: '`(5 > 3) && (2 > 4)` evaluates to…?', options: ['true', 'false', '1', 'compile error'], correctAnswer: 'false' },
    { text: 'Which operator checks equality in C?', options: ['=', '==', '===', '!='], correctAnswer: '==' },
  ],
  'Bitwise Operators and Operator Precedence': [
    { text: '`5 & 3` evaluates to…?', options: ['1', '7', '6', '0'], correctAnswer: '1' },
    { text: '`1 << 4` evaluates to…?', options: ['4', '8', '16', '32'], correctAnswer: '16' },
    { text: 'Which operator toggles (flips) the bits it is applied to?', options: ['&', '|', '^', '~'], correctAnswer: '~' },
    { text: 'What does `~0` evaluate to (on a normal 32-bit int)?', options: ['0', '1', '-1', '2147483647'], correctAnswer: '-1' },
  ],

  // ── WEEK 4 — I/O & Format Specifiers ──────────────────────────────────────
  'printf: Formatted Output': [
    { text: '`printf("%d", 42);` — what does %d print?', options: ['A float', 'A signed integer', 'A character', 'A string'], correctAnswer: 'A signed integer' },
    { text: '`printf("%.2f", 3.14159);` prints…?', options: ['3.14', '3.14159', '3.142', '3.14f'], correctAnswer: '3.14' },
    { text: '`printf("%c", 65);` prints…?', options: ['65', 'A', 'a', 'It crashes'], correctAnswer: 'A' },
    { text: '`printf("%s", name);` expects name to be…?', options: ['A char', 'An int', 'A pointer to a char array (string)', 'A float'], correctAnswer: 'A pointer to a char array (string)' },
  ],
  'scanf: Reading Formatted Input': [
    { text: '`scanf("%d", &x);` — why does x need &?', options: ['It is optional', 'scanf needs the address to store the value', 'It speeds up scanf', 'It is a syntax requirement'], correctAnswer: 'scanf needs the address to store the value' },
    { text: '`scanf("%d", x);` (no &) — what happens?', options: ['Works fine', 'Compile error', 'Undefined behaviour — likely crash', 'Reads nothing'], correctAnswer: 'Undefined behaviour — likely crash' },
    { text: 'Which format specifier reads a string with NO spaces in scanf?', options: ['%s', '%c', '%d', '%f'], correctAnswer: '%s' },
    { text: 'After reading an int with scanf, the newline from Enter is…?', options: ['Automatically discarded', 'Left in the buffer — it can break the next getchar/scanf', 'Converted to a space', 'Always ignored'], correctAnswer: 'Left in the buffer — it can break the next getchar/scanf' },
  ],
  'Character & String Input: getchar, gets vs fgets': [
    { text: 'Which function is the SAFE replacement for gets()?', options: ['gets() itself is fine', 'fgets()', 'scanf("%s")', 'getchar()'], correctAnswer: 'fgets()' },
    { text: 'Why is gets() dangerous?', options: ['It is slow', 'It has no size limit — it can overflow the buffer', 'It cannot read strings', 'It only reads one char'], correctAnswer: 'It has no size limit — it can overflow the buffer' },
    { text: '`fgets(buf, 100, stdin)` can read how many characters max?', options: ['100', '99', '101', 'Unlimited'], correctAnswer: '99' },
    { text: '`getchar()` returns…?', options: ['A string', 'The next character as an int (EOF at end)', 'A float', 'The whole line'], correctAnswer: 'The next character as an int (EOF at end)' },
  ],

  // ── WEEK 5 — Decision Making ──────────────────────────────────────────────
  'if, else and the else-if Ladder': [
    { text: 'What does `if (0)` do?', options: ['Runs the block', 'Skips the block (0 is false)', 'Compile error', 'Runs forever'], correctAnswer: 'Skips the block (0 is false)' },
    { text: '`if (x = 5)` instead of `if (x == 5)`…?', options: ['Works exactly the same', 'Assigns 5 to x and is always true — classic bug', 'Compile error', 'Crashes'], correctAnswer: 'Assigns 5 to x and is always true — classic bug' },
    { text: 'In an else-if ladder, how many branches can execute?', options: ['All of them', 'Exactly one', 'At most two', 'None'], correctAnswer: 'Exactly one' },
    { text: '`int x = 10; if (x > 5) if (x > 8) printf("A"); else printf("B");` — which prints?', options: ['B', 'A', 'Nothing', 'Both'], correctAnswer: 'A' },
  ],
  'The Ternary Operator (?:)': [
    { text: '`int max = (a > b) ? a : b;` — what does max become when a > b?', options: ['b', 'a', '0', 'Depends on memory'], correctAnswer: 'a' },
    { text: 'The ternary operator is a shorthand for…?', options: ['A loop', 'An if-else expression', 'A switch', 'A function call'], correctAnswer: 'An if-else expression' },
    { text: '`printf("%s", (x % 2 == 0) ? "even" : "odd");` with x=7 prints…?', options: ['even', 'odd', '7', 'error'], correctAnswer: 'odd' },
    { text: 'Which of these is valid ternary syntax?', options: ['condition ? a : b', 'condition ? a ? b', 'condition : a ? b', 'a ? b : condition'], correctAnswer: 'condition ? a : b' },
  ],
  'switch-case: Multi-way Branching': [
    { text: 'What must each case label be?', options: ['A float', 'A constant integer/character expression', 'A string', 'Any variable'], correctAnswer: 'A constant integer/character expression' },
    { text: 'Forgetting `break` at the end of a case causes…?', options: ['A compile error', 'Fall-through into the next case', 'A runtime crash', 'Nothing'], correctAnswer: 'Fall-through into the next case' },
    { text: '`switch (x) { case 1: ... default: ... }` — when does default run?', options: ['Always', 'When no case matches', 'When x is 0', 'Never'], correctAnswer: 'When no case matches' },
    { text: 'Can two cases have the same value in one switch?', options: ['Yes', 'No — duplicate case values are an error', 'Only with a flag', 'Only in C23'], correctAnswer: 'No — duplicate case values are an error' },
  ],

  // ── WEEK 6 — Loops ────────────────────────────────────────────────────────
  'The while Loop': [
    { text: '`while (condition)` — when does the body run?', options: ['Always', 'Only while the condition is true', 'Once, then never', 'Until the user stops it'], correctAnswer: 'Only while the condition is true' },
    { text: 'A while loop that never becomes false creates a…?', options: ['Segfault', 'Infinite loop', 'Stack overflow', 'Compile error'], correctAnswer: 'Infinite loop' },
    { text: '`int i = 0; while (i < 3) { i++; }` — how many iterations?', options: ['2', '3', '4', '0'], correctAnswer: '3' },
    { text: 'In `while`, where is the condition checked?', options: ['After the body', 'Before each iteration', 'Only once', 'Never'], correctAnswer: 'Before each iteration' },
  ],
  'The do-while Loop: Always Runs Once': [
    { text: 'The key difference of do-while is that it…?', options: ['Checks condition before running', 'Runs the body at least once', 'Can only count up', 'Cannot be nested'], correctAnswer: 'Runs the body at least once' },
    { text: '`do { x++; } while (x < 0);` with x=5 — how many times does the body run?', options: ['0', '1', '5', 'Infinite'], correctAnswer: '1' },
    { text: 'Which loop is best when you must validate an input at least once?', options: ['while', 'for', 'do-while', 'goto loop'], correctAnswer: 'do-while' },
    { text: 'What is the correct do-while syntax?', options: ['do { } while (cond);', 'while (cond) do { };', 'do while (cond) { };', 'while (do cond);'], correctAnswer: 'do { } while (cond);' },
  ],
  'The for Loop: Init, Condition, Update': [
    { text: '`for (int i = 0; i < 3; i++)` — what is the value of i inside the last iteration?', options: ['2', '3', '4', '1'], correctAnswer: '2' },
    { text: 'Which part of the for header runs FIRST?', options: ['Condition', 'Update', 'Initialization', 'All together'], correctAnswer: 'Initialization' },
    { text: '`for (;;)` is…?', options: ['A compile error', 'An infinite loop', 'A loop that never runs', 'A syntax warning'], correctAnswer: 'An infinite loop' },
    { text: '`for (int i = 0; i < 10; i += 2)` prints how many times?', options: ['4', '5', '10', '9'], correctAnswer: '5' },
  ],
  'break, continue, and Nested Loops': [
    { text: '`break` inside a loop does what?', options: ['Skips one iteration', 'Exits the current loop entirely', 'Restarts the loop', 'Ends the program'], correctAnswer: 'Exits the current loop entirely' },
    { text: '`continue` inside a loop does what?', options: ['Exits the loop', 'Skips the rest of the current iteration and moves to the next', 'Restarts from the top', 'Halts the program'], correctAnswer: 'Skips the rest of the current iteration and moves to the next' },
    { text: 'In a nested loop, `break` exits…?', options: ['All loops', 'Only the innermost loop', 'The outermost loop', 'The program'], correctAnswer: 'Only the innermost loop' },
    { text: '`for (i=0;i<5;i++){ if(i==2) continue; printf("%d",i); }` prints…?', options: ['01234', '0134', '012', '134'], correctAnswer: '0134' },
  ],

  // ── WEEK 7 — Functions ────────────────────────────────────────────────────
  'Why Functions? Reusable, Testable Code': [
    { text: 'Which is a benefit of using functions?', options: ['The program runs faster always', 'Code is reusable and testable in isolation', 'It removes the need for variables', 'It prevents all bugs'], correctAnswer: 'Code is reusable and testable in isolation' },
    { text: 'A function prototype is…?', options: ['The full function body', 'A declaration of the function signature before main', 'The return value', 'The main function'], correctAnswer: 'A declaration of the function signature before main' },
    { text: 'Why can calling a function defined later fail to compile without a prototype?', options: ['The compiler needs the signature to check types', 'It is a linker rule', 'Functions cannot be defined later', 'It is just a warning'], correctAnswer: 'The compiler needs the signature to check types' },
    { text: 'Dividing a program into functions primarily improves…?', options: ['Binary size', 'Maintainability and clarity', 'Compiler speed', 'RAM usage always'], correctAnswer: 'Maintainability and clarity' },
  ],
  'Parameters, Arguments & Pass-by-Value': [
    { text: 'In `void f(int x)` called as `f(y);`, changing x inside f…?', options: ['Changes y', 'Does NOT change y — x is a copy', 'Crashes', 'Depends on the compiler'], correctAnswer: 'Does NOT change y — x is a copy' },
    { text: 'C passes arguments by…?', options: ['Reference', 'Value', 'Pointer by default', 'Alias'], correctAnswer: 'Value' },
    { text: 'The parameters listed in the function definition are called…?', options: ['Arguments', 'Formal parameters', 'Globals', 'Literals'], correctAnswer: 'Formal parameters' },
    { text: '`void f(int a, int b) { ... }` — how many arguments does a call need?', options: ['1', '2', '0', 'Any number'], correctAnswer: '2' },
  ],
  'Return Values and void': [
    { text: 'Which keyword means "returns nothing"?', options: ['null', 'void', 'nil', 'empty'], correctAnswer: 'void' },
    { text: '`int square(int x) { return x * x; }` — calling square(4) gives…?', options: ['4', '8', '16', 'undefined'], correctAnswer: '16' },
    { text: 'A function declared `int f(void)` must…?', options: ['Take no arguments and return an int', 'Return void', 'Take int arguments', 'Never be called'], correctAnswer: 'Take no arguments and return an int' },
    { text: 'What does a `void` function return at its end?', options: ['0', 'Nothing — control just returns', 'NULL', 'Garbage'], correctAnswer: 'Nothing — control just returns' },
  ],
  'The Call Stack: How Calls Really Work': [
    { text: 'The call stack stores…?', options: ['The heap', 'Function call frames with local variables and return addresses', 'Global variables only', 'Source code'], correctAnswer: 'Function call frames with local variables and return addresses' },
    { text: 'Deep, uncontrolled recursion causes…?', options: ['Segmentation fault', 'Stack overflow', 'Compile error', 'Memory leak only'], correctAnswer: 'Stack overflow' },
    { text: 'After a function returns, its stack frame is…?', options: ['Kept forever', 'Popped/freed', 'Copied to heap', 'Locked'], correctAnswer: 'Popped/freed' },
    { text: 'Local variables live where?', options: ['Heap', 'Stack frame of their function', 'Registers only', 'Global segment always'], correctAnswer: 'Stack frame of their function' },
  ],

  // ── WEEK 8 — Scope, Storage Classes & Recursion ───────────────────────────
  'Local vs Global Scope': [
    { text: 'A variable declared inside main is…?', options: ['Global', 'Local to main', 'Static', 'Heap allocated'], correctAnswer: 'Local to main' },
    { text: 'Global variables are declared…?', options: ['Inside any function', 'Outside all functions', 'In main only', 'In the linker'], correctAnswer: 'Outside all functions' },
    { text: 'A local variable shadows a global of the same name — inside the function, the name refers to…?', options: ['The global', 'The local', 'Both', 'A compile error'], correctAnswer: 'The local' },
    { text: 'Excessive use of globals is discouraged because…?', options: ['They are slow', 'They make state hard to track and test', 'They cannot be ints', 'They use no memory'], correctAnswer: 'They make state hard to track and test' },
  ],
  'Storage Classes: auto, register, static, extern': [
    { text: 'By default, a local variable has which storage class?', options: ['static', 'register', 'auto', 'extern'], correctAnswer: 'auto' },
    { text: 'A `static` local variable…?', options: ['Is destroyed each call', 'Retains its value across function calls', 'Cannot be an int', 'Is always zero'], correctAnswer: 'Retains its value across function calls' },
    { text: '`extern` is used to…?', options: ['Allocate new memory', 'Declare a variable defined in another file', 'Make a variable constant', 'Free memory'], correctAnswer: 'Declare a variable defined in another file' },
    { text: '`register` is a hint to…?', options: ['Free the variable', 'Store the variable in a CPU register for speed', 'Make it global', 'Make it static'], correctAnswer: 'Store the variable in a CPU register for speed' },
  ],
  'Recursion: Functions Calling Themselves': [
    { text: 'Every recursive function must have…?', options: ['A global variable', 'A base case that stops recursion', 'A loop', 'A pointer argument'], correctAnswer: 'A base case that stops recursion' },
    { text: '`int fact(int n){ return (n<=1)?1:n*fact(n-1); }` — fact(3) is…?', options: ['3', '6', '9', '24'], correctAnswer: '6' },
    { text: 'Recursion uses which structure implicitly?', options: ['Queue', 'Stack (the call stack)', 'Tree only', 'Array'], correctAnswer: 'Stack (the call stack)' },
    { text: 'The main risk of recursion is…?', options: ['Slower compile', 'Stack overflow with deep or infinite recursion', 'Memory leaks only', 'Syntax errors'], correctAnswer: 'Stack overflow with deep or infinite recursion' },
  ],

  // ── WEEK 9 — Arrays ───────────────────────────────────────────────────────
  'One-Dimensional Arrays': [
    { text: '`int a[5];` — valid indices are…?', options: ['1..5', '0..4', '0..5', '1..4'], correctAnswer: '0..4' },
    { text: '`int a[] = {10, 20, 30};` — a[1] is…?', options: ['10', '20', '30', 'Garbage'], correctAnswer: '20' },
    { text: 'Array elements in memory are…?', options: ['Scattered randomly', 'Contiguous (one after another)', 'On the heap always', 'In files'], correctAnswer: 'Contiguous (one after another)' },
    { text: 'Accessing `a[10]` of an `int a[5]` is…?', options: ['Valid', 'Out of bounds — undefined behaviour', 'A warning only', 'Always 0'], correctAnswer: 'Out of bounds — undefined behaviour' },
  ],
  'Two-Dimensional Arrays (Matrices)': [
    { text: '`int m[3][4];` — how many elements total?', options: ['7', '12', '34', '4'], correctAnswer: '12' },
    { text: 'In `int m[3][4]`, m[2][3] refers to…?', options: ['The first element', 'The last element', 'Out of bounds', 'The third row'], correctAnswer: 'The last element' },
    { text: 'A 2D array is stored in memory…?', options: ['Row-major by default (rows contiguous)', 'Column-major by default', 'Randomly', 'On the heap always'], correctAnswer: 'Row-major by default (rows contiguous)' },
    { text: 'In `int m[2][3] = {{1,2,3},{4,5,6}};` m[1][0] is…?', options: ['1', '4', '3', '6'], correctAnswer: '4' },
  ],
  'Passing Arrays to Functions & Array Bounds': [
    { text: 'When passed to a function, an array name decays to…?', options: ['Its first element by value', 'A pointer to its first element', 'Its size', 'A copy'], correctAnswer: 'A pointer to its first element' },
    { text: 'Why must you pass the array size to a function?', options: ['It is optional', 'The function cannot derive it from the decayed pointer', 'To allocate memory', 'It is only for style'], correctAnswer: 'The function cannot derive it from the decayed pointer' },
    { text: 'C does NOT automatically check array bounds because…?', options: ['It is lazy', 'Bounds checking would cost runtime performance; safety is the programmer\'s job', 'It is impossible', 'Compilers refuse'], correctAnswer: 'Bounds checking would cost runtime performance; safety is the programmer\'s job' },
    { text: '`void f(int arr[10])` — inside f, `sizeof(arr)` gives…?', options: ['40', '10', 'The pointer size (8 on 64-bit)', '0'], correctAnswer: 'The pointer size (8 on 64-bit)' },
  ],

  // ── WEEK 10 — Strings ─────────────────────────────────────────────────────
  'What a C String Really Is': [
    { text: 'A C string is…?', options: ['A built-in string type', 'An array of chars ending in \\0', 'A linked list of chars', 'An int array'], correctAnswer: 'An array of chars ending in \\0' },
    { text: '`char s[] = "Hi";` — how many bytes does s occupy?', options: ['2', '3', '4', '8'], correctAnswer: '3' },
    { text: 'The \\0 null terminator marks…?', options: ['A newline', 'The end of the string', 'A tab', 'The start'], correctAnswer: 'The end of the string' },
    { text: '`strlen("hello")` returns…?', options: ['6', '5', '4', '8'], correctAnswer: '5' },
  ],
  'String Library Functions: strcpy, strcat, strcmp, strlen': [
    { text: '`strcpy(dest, src)` copies…?', options: ['The length', 'src into dest including the null terminator', 'The address of dest', 'Only the first char'], correctAnswer: 'src into dest including the null terminator' },
    { text: '`strcat(dest, src)`…?', options: ['Copies dest into src', 'Appends src to the end of dest', 'Compares dest and src', 'Returns their length'], correctAnswer: 'Appends src to the end of dest' },
    { text: '`strcmp("abc", "abd")` returns…?', options: ['0', 'A negative value', 'A positive value', 'undefined'], correctAnswer: 'A negative value' },
    { text: '`strcmp("abc", "abc")` returns…?', options: ['1', '0', '-1', '3'], correctAnswer: '0' },
  ],
  'Reading Strings Safely: fgets, and Common Bugs': [
    { text: 'The safest way to read a string of unknown length is…?', options: ['gets()', 'fgets() with a buffer size', 'scanf("%s") alone', 'getchar() in a loop always'], correctAnswer: 'fgets() with a buffer size' },
    { text: '`scanf("%s", buf)` stops at…?', options: ['The newline', 'The first whitespace', 'The null char', 'Never'], correctAnswer: 'The first whitespace' },
    { text: 'If fgets fills the whole buffer without a newline, the input line…?', options: ['Was perfectly read', 'Was truncated — remaining chars stay in stdin', 'Crashes', 'Is ignored'], correctAnswer: 'Was truncated — remaining chars stay in stdin' },
    { text: 'A common string bug is…?', options: ['Using too large a buffer', 'Forgetting the null terminator / overflowing the buffer', 'Using fgets', 'Comparing with strcmp'], correctAnswer: 'Forgetting the null terminator / overflowing the buffer' },
  ],

  // ── WEEK 11 — Pointers & Pointer Arithmetic ───────────────────────────────
  'Addresses and the Address-of Operator &': [
    { text: '`&x` gives…?', options: ['The value of x', 'The address of x in memory', 'The size of x', 'A copy of x'], correctAnswer: 'The address of x in memory' },
    { text: '`printf("%p", &x);` prints…?', options: ['The value of x', 'The memory address of x', 'The size of x', 'The type of x'], correctAnswer: 'The memory address of x' },
    { text: 'Pointers are used to store…?', options: ['Large integers', 'Memory addresses', 'Strings only', 'Floats'], correctAnswer: 'Memory addresses' },
    { text: 'The address-of operator `&` requires…?', options: ['A constant', 'An lvalue (a variable/location)', 'A pointer', 'A literal'], correctAnswer: 'An lvalue (a variable/location)' },
  ],
  'Dereferencing: *ptr and the Null Pointer': [
    { text: '`*ptr` where ptr is a pointer…?', options: ['Gives the address', 'Accesses the value the pointer points to', 'Creates a new pointer', 'Returns NULL'], correctAnswer: 'Accesses the value the pointer points to' },
    { text: 'NULL is a pointer value meaning…?', options: ['The first address in RAM', 'Points to nothing — do not dereference', 'The end of memory', 'A zero integer'], correctAnswer: 'Points to nothing — do not dereference' },
    { text: 'Dereferencing a NULL pointer causes…?', options: ['A warning', 'Undefined behaviour — typically a segfault/crash', 'It returns 0 safely', 'A memory leak'], correctAnswer: 'Undefined behaviour — typically a segfault/crash' },
    { text: '`int x = 5; int *p = &x;` — `*p = 10;` sets…?', options: ['The pointer address to 10', 'x to 10', 'p to 10', 'Nothing'], correctAnswer: 'x to 10' },
  ],
  'Pointer Arithmetic: ptr + 1 Skips sizeof(type)': [
    { text: '`int *p; p + 1` advances by…?', options: ['1 byte', 'sizeof(int) bytes', 'sizeof(int*) bytes', '0 bytes'], correctAnswer: 'sizeof(int) bytes' },
    { text: '`char *p = "abc"; *(p + 2)` is…?', options: ['a', 'b', 'c', '\\0'], correctAnswer: 'c' },
    { text: '`int a[] = {10,20,30}; int *p = a; p++;` — `*p` is…?', options: ['10', '20', '30', 'Garbage'], correctAnswer: '20' },
    { text: 'Pointer arithmetic is only well-defined within…?', options: ['The same array or one-past-its-end', 'Any allocated block regardless of type', 'The stack', 'Global memory'], correctAnswer: 'The same array or one-past-its-end' },
  ],
  'Pointers as Function Arguments: The Swap Pattern': [
    { text: 'To change a variable inside a function, you must pass…?', options: ['Its value', 'Its address (pointer)', 'A copy', 'Its name as a string'], correctAnswer: 'Its address (pointer)' },
    { text: '`void swap(int *a, int *b)` — to swap x and y you call…?', options: ['swap(x, y)', 'swap(&x, &y)', 'swap(*x, *y)', 'swap(x, &y)'], correctAnswer: 'swap(&x, &y)' },
    { text: 'Inside swap, `int temp = *a; *a = *b; *b = temp;` correctly…?', options: ['Swaps the pointers', 'Swaps the values x and y', 'Crashes', 'Does nothing'], correctAnswer: 'Swaps the values x and y' },
    { text: 'Passing `&x` to a function parameter `int *p` means…?', options: ['p copies the value of x', 'p points to x, so writes via *p affect x', 'p becomes a new int', 'It is invalid'], correctAnswer: 'p points to x, so writes via *p affect x' },
  ],

  // ── WEEK 12 — Pointers & Arrays/Strings ───────────────────────────────────
  'Array Names Are Pointers to the First Element': [
    { text: '`int a[5];` — the name `a` alone evaluates to…?', options: ['The size of the array', 'A pointer to the first element', 'The last element', 'The type'], correctAnswer: 'A pointer to the first element' },
    { text: '`a[i]` is equivalent to…?', options: ['*(a + i)', '&a[i]', 'a + i', '*(i - a)'], correctAnswer: '*(a + i)' },
    { text: '`int a[] = {5,6};` — `*a` is…?', options: ['5', '6', 'The address', 'Garbage'], correctAnswer: '5' },
    { text: '`a` (array name) and `p` (pointer) differ because…?', options: ['They are identical always', 'a cannot be reassigned to point elsewhere; p can', 'p cannot be incremented', 'a is a copy'], correctAnswer: 'a cannot be reassigned to point elsewhere; p can' },
  ],
  'Pointer to Array vs Array of Pointers': [
    { text: '`int *arr[5]` declares…?', options: ['A pointer to an array of 5 ints', 'An array of 5 pointers to int', 'A 2D array', 'An invalid declaration'], correctAnswer: 'An array of 5 pointers to int' },
    { text: '`int (*ptr)[5]` declares…?', options: ['An array of 5 pointers', 'A pointer to an array of 5 ints', 'A function pointer', 'Invalid'], correctAnswer: 'A pointer to an array of 5 ints' },
    { text: 'An array of pointers is commonly used for…?', options: ['A list of strings', 'A single integer', 'A float value', 'A null byte'], correctAnswer: 'A list of strings' },
    { text: '`char *words[] = {"hi", "bye"};` — words[1] is…?', options: ['"hi"', '"bye"', 'A char', 'NULL'], correctAnswer: '"bye"' },
  ],
  'Pointer Strings vs Character Arrays': [
    { text: '`char *s = "abc";` — the string literal lives in…?', options: ['Writable stack memory', 'Read-only memory (usually)', 'The heap', 'Registers'], correctAnswer: 'Read-only memory (usually)' },
    { text: 'Modifying `s[0]` of a `char *s = "abc";` literal is…?', options: ['Safe', 'Undefined behaviour', 'Always allowed', 'Just a warning'], correctAnswer: 'Undefined behaviour' },
    { text: '`char s[] = "abc";` copies the literal into…?', options: ['A read-only area', 'A writable stack/array buffer', 'The heap always', 'Nowhere'], correctAnswer: 'A writable stack/array buffer' },
    { text: 'Which can you safely modify character by character?', options: ['char *p = "abc";', 'char arr[] = "abc";', 'Both', 'Neither'], correctAnswer: 'char arr[] = "abc";' },
  ],

  // ── WEEK 13 — Dynamic Memory Allocation ───────────────────────────────────
  'The Heap vs the Stack': [
    { text: 'Memory allocated with malloc lives on…?', options: ['The stack', 'The heap', 'Global segment', 'Registers'], correctAnswer: 'The heap' },
    { text: 'The stack is used for…?', options: ['Dynamic long-lived data', 'Function call frames and locals', 'Files', 'Networks'], correctAnswer: 'Function call frames and locals' },
    { text: 'Heap allocations must be…?', options: ['Automatically freed', 'Manually freed with free()', 'Never freed', 'Copied to stack'], correctAnswer: 'Manually freed with free()' },
    { text: 'The stack size is typically…?', options: ['Unlimited', 'Fixed and much smaller than the heap', 'The same as the heap', 'Dynamic'], correctAnswer: 'Fixed and much smaller than the heap' },
  ],
  'malloc, calloc, realloc — and sizeof': [
    { text: '`malloc(n)` allocates…?', options: ['n elements', 'n bytes of uninitialized memory', 'n ints always', 'n pointers'], correctAnswer: 'n bytes of uninitialized memory' },
    { text: '`calloc(n, size)` differs from malloc because it…?', options: ['Is faster', 'Zero-initialises the memory', 'Never fails', 'Frees memory'], correctAnswer: 'Zero-initialises the memory' },
    { text: '`int *p = malloc(sizeof(int));` — correct and why?', options: ['Size must be a literal', 'sizeof(int) ensures enough bytes for the platform', 'malloc returns int', 'This leaks'], correctAnswer: 'sizeof(int) ensures enough bytes for the platform' },
    { text: '`realloc(ptr, newSize)`…?', options: ['Frees ptr', 'Resizes the allocation, preserving contents', 'Always crashes', 'Duplicates ptr'], correctAnswer: 'Resizes the allocation, preserving contents' },
  ],
  'Memory Leaks and Dangling Pointers': [
    { text: 'A memory leak happens when…?', options: ['You free twice', 'Allocated memory is never freed', 'You use a stack variable', 'You return a literal'], correctAnswer: 'Allocated memory is never freed' },
    { text: 'A dangling pointer points to…?', options: ['A fresh allocation', 'Memory that was already freed', 'A literal', 'The stack always'], correctAnswer: 'Memory that was already freed' },
    { text: 'Using a dangling pointer causes…?', options: ['Nothing', 'Undefined behaviour', 'A warning only', 'A slower program'], correctAnswer: 'Undefined behaviour' },
    { text: 'After `free(p)`, the safe practice is to…?', options: ['Use p immediately', 'Set p = NULL to avoid a dangling pointer', 'Call free again', 'Ignore it'], correctAnswer: 'Set p = NULL to avoid a dangling pointer' },
  ],

  // ── WEEK 14 — Structures & Unions ─────────────────────────────────────────
  'Structures: Grouping Related Data': [
    { text: 'A struct…?', options: ['Stores only one type', 'Groups related variables of possibly different types', 'Is a function', 'Is a pointer'], correctAnswer: 'Groups related variables of possibly different types' },
    { text: '`struct Student { int roll; float cgpa; };` declares…?', options: ['A variable', 'A new data type (blueprint)', 'A function', 'A macro'], correctAnswer: 'A new data type (blueprint)' },
    { text: 'Memory of struct fields is…?', options: ['Always tightly packed', 'Padded/aligned per the ABI', 'On the heap always', 'Shared'], correctAnswer: 'Padded/aligned per the ABI' },
    { text: '`sizeof(struct)` may be larger than the sum of its fields because of…?', options: ['Magic', 'Padding and alignment', 'The compiler', 'The linker'], correctAnswer: 'Padding and alignment' },
  ],
  'Member Access: dot (.) vs arrow (->)': [
    { text: 'With a struct VARIABLE s, you access a member using…?', options: ['s->member', 's.member', '&s.member', '*s.member'], correctAnswer: 's.member' },
    { text: 'With a struct POINTER p, you access a member using…?', options: ['p.member', 'p->member', 'p::member', '*p.member'], correctAnswer: 'p->member' },
    { text: '`p->member` is equivalent to…?', options: ['(*p).member', 'p.member', '&p.member', '*p.member'], correctAnswer: '(*p).member' },
    { text: 'A struct can contain…?', options: ['Only ints', 'Members of any type, including other structs and pointers', 'Only chars', 'Only pointers'], correctAnswer: 'Members of any type, including other structs and pointers' },
  ],
  'typedef and Unions': [
    { text: '`typedef int Distance;` creates…?', options: ['A new integer', 'An alias so Distance can be used as a type name', 'A macro', 'A variable'], correctAnswer: 'An alias so Distance can be used as a type name' },
    { text: 'A union stores…?', options: ['All members at once', 'Only ONE member at a time (members share memory)', 'No members', 'Only ints'], correctAnswer: 'Only ONE member at a time (members share memory)' },
    { text: 'The size of a union is…?', options: ['The sum of all members', 'The size of its largest member', 'Always 1', 'Always 4'], correctAnswer: 'The size of its largest member' },
    { text: 'Unions are useful for…?', options: ['Storing all records', 'Type punning / interpreting the same bytes differently', 'Sorting', 'Files'], correctAnswer: 'Type punning / interpreting the same bytes differently' },
  ],

  // ── WEEK 15 — File Handling ───────────────────────────────────────────────
  'Opening and Closing Files: fopen and fclose': [
    { text: '`fopen("data.txt", "r")` opens for…?', options: ['Writing', 'Reading', 'Appending', 'Binary read'], correctAnswer: 'Reading' },
    { text: '`fopen` returns…?', options: ['A file descriptor int', 'A FILE* pointer, or NULL on failure', 'A string', 'Always non-null'], correctAnswer: 'A FILE* pointer, or NULL on failure' },
    { text: 'The mode "w" does what if the file exists?', options: ['Keeps it', 'Truncates it to zero length for writing', 'Appends', 'Renames it'], correctAnswer: 'Truncates it to zero length for writing' },
    { text: 'Every fopen should be paired with…?', options: ['fprintf', 'fclose', 'fflush only', 'Nothing'], correctAnswer: 'fclose' },
  ],
  'Writing and Reading Formatted Data': [
    { text: '`fprintf(fp, "%d", x)` writes…?', options: ['To stdout', 'To the file pointed by fp', 'To a buffer', 'To a string'], correctAnswer: 'To the file pointed by fp' },
    { text: '`fgets(buf, n, fp)` reads…?', options: ['A single char', 'Up to n-1 chars or until newline/EOF from fp', 'The whole file at once', 'A number'], correctAnswer: 'Up to n-1 chars or until newline/EOF from fp' },
    { text: '`fscanf(fp, "%d", &x)`…?', options: ['Reads formatted data from the file into x', 'Writes x to the file', 'Prints to screen', 'Closes the file'], correctAnswer: 'Reads formatted data from the file into x' },
    { text: 'A text file opened in "r" on Windows treats…?', options: ['Everything as binary', 'CRLF vs LF translation (text mode)', 'UTF-8 only', 'Nothing specially'], correctAnswer: 'CRLF vs LF translation (text mode)' },
  ],
  'Binary Files: fread and fwrite': [
    { text: '`fwrite(ptr, size, count, fp)` writes…?', options: ['count chars only', 'count blocks of size bytes from ptr to fp', 'size bytes always', 'A string'], correctAnswer: 'count blocks of size bytes from ptr to fp' },
    { text: '`fread(buf, sizeof(int), 10, fp)` reads…?', options: ['10 bytes', '10 ints into buf', '10 chars', 'The whole file'], correctAnswer: '10 ints into buf' },
    { text: 'To write a whole struct to a file, use…?', options: ['fprintf', 'fwrite(&s, sizeof(s), 1, fp)', 'fputs', 'scanf'], correctAnswer: 'fwrite(&s, sizeof(s), 1, fp)' },
    { text: 'fread/fwrite return…?', options: ['Always 1', 'The number of items read/written', 'A FILE*', 'A char'], correctAnswer: 'The number of items read/written' },
  ],

  // ── WEEK 16 — Preprocessor & Macros ───────────────────────────────────────
  'The Preprocessor: #include and #define': [
    { text: '`#include <stdio.h>` searches…?', options: ['The current directory first', 'The system include path', 'The internet', 'Memory'], correctAnswer: 'The system include path' },
    { text: '`#include "myheader.h"` searches…?', options: ['The current directory first, then the system path', 'Only the system path', 'Only /usr/include', 'Nothing'], correctAnswer: 'The current directory first, then the system path' },
    { text: '`#define PI 3.14` makes the preprocessor…?', options: ['Create a variable', 'Replace every PI with 3.14 (text substitution)', 'Compile faster', 'Ignore PI'], correctAnswer: 'Replace every PI with 3.14 (text substitution)' },
    { text: 'By convention, macros are written in…?', options: ['lowercase', 'UPPERCASE', 'CamelCase', 'Any case'], correctAnswer: 'UPPERCASE' },
  ],
  'Function-Like Macros and Their Dangers': [
    { text: '`#define SQ(x) x * x` — `SQ(2+3)` expands to…?', options: ['25', '11', '13', '5'], correctAnswer: '11' },
    { text: 'The fix is to write the macro as…?', options: ['#define SQ(x) x*x', '#define SQ(x) ((x) * (x))', '#define SQ x*x', '#define (x) SQ x*x'], correctAnswer: '#define SQ(x) ((x) * (x))' },
    { text: 'Why is `SQ(x++)` dangerous?', options: ['It is slow', 'x++ is evaluated twice', 'It cannot compile', 'It returns a float'], correctAnswer: 'x++ is evaluated twice' },
    { text: 'Macros differ from functions because macros…?', options: ['Are typed and safe', 'Are pure text substitution with no type checking', 'Return values always', 'Are slower to call'], correctAnswer: 'Are pure text substitution with no type checking' },
  ],
  'Header Guards and Conditional Compilation': [
    { text: 'A header guard prevents…?', options: ['Slow compilation', 'Double inclusion of the header', 'Macro conflicts always', 'Memory leaks'], correctAnswer: 'Double inclusion of the header' },
    { text: '`#ifdef DEBUG ... #endif` compiles the block only if…?', options: ['DEBUG is 0', 'DEBUG is defined', 'DEBUG is a string', 'DEBUG is in a file'], correctAnswer: 'DEBUG is defined' },
    { text: '`gcc -DDEBUG main.c`…?', options: ['Deletes debug symbols', 'Defines DEBUG for the preprocessor', 'Runs the program', 'Optimises it'], correctAnswer: 'Defines DEBUG for the preprocessor' },
    { text: 'A typical header guard starts with…?', options: ['#include', '#ifndef HEADER_H / #define HEADER_H', '#pragma pack', '#error'], correctAnswer: '#ifndef HEADER_H / #define HEADER_H' },
  ],

  // ── WEEK 17 — Linked Lists ────────────────────────────────────────────────
  'Why Linked Lists Exist': [
    { text: 'A linked list stores elements in…?', options: ['Contiguous memory', 'Scattered nodes linked by pointers', 'Fixed-size blocks', 'A table'], correctAnswer: 'Scattered nodes linked by pointers' },
    { text: 'The node struct contains…?', options: ['Only data', 'Data and a pointer to the next node', 'An index', 'Two data values'], correctAnswer: 'Data and a pointer to the next node' },
    { text: 'A key ADVANTAGE over arrays is…?', options: ['O(1) random access', 'Dynamic size and O(1) head insertion', 'Cache locality', 'No pointer overhead'], correctAnswer: 'Dynamic size and O(1) head insertion' },
    { text: 'A key DISADVANTAGE is…?', options: ['Fixed size', 'No random access — traversal is O(n)', 'Cannot store ints', 'Too much memory always'], correctAnswer: 'No random access — traversal is O(n)' },
  ],
  'Inserting at the Head: The O(1) Win': [
    { text: 'Inserting at the head of a linked list is…?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctAnswer: 'O(1)' },
    { text: 'The steps are…?', options: ['Walk to the end, then link', 'Allocate node, point it at old head, return as new head', 'Sort the list first', 'Free the head'], correctAnswer: 'Allocate node, point it at old head, return as new head' },
    { text: 'Why must you point the new node at the old head BEFORE changing head?', options: ['To save memory', 'Otherwise you lose the list', 'It is faster', 'It is a style rule'], correctAnswer: 'Otherwise you lose the list' },
    { text: 'The function returns the new head because…?', options: ['It is required by C', 'The head can change — the caller must update its variable', 'It is decorative', 'To count nodes'], correctAnswer: 'The head can change — the caller must update its variable' },
  ],
  'Traversal, Search, and Deletion': [
    { text: 'Traversal of a singly linked list stops when…?', options: ['p->data == 0', 'p == NULL', 'p == head', 'p->next == p'], correctAnswer: 'p == NULL' },
    { text: 'To delete a middle node you need…?', options: ['Only the node', 'The previous node to relink around it', 'The head only', 'The tail'], correctAnswer: 'The previous node to relink around it' },
    { text: 'After unlinking a deleted node you must…?', options: ['Free it', 'Set it to head', 'Print it', 'Leave it'], correctAnswer: 'Free it' },
    { text: 'When freeing a whole list, save p->next BEFORE free(p) because…?', options: ['It is faster', 'Dereferencing freed memory is undefined behaviour', 'It is required by the compiler', 'To count nodes'], correctAnswer: 'Dereferencing freed memory is undefined behaviour' },
  ],

  // ── WEEK 18 — Stacks & Queues ─────────────────────────────────────────────
  'The Stack: LIFO': [
    { text: 'A stack follows…?', options: ['FIFO', 'LIFO', 'Random order', 'Priority'], correctAnswer: 'LIFO' },
    { text: 'Pushing onto a full stack is…?', options: ['Underflow', 'Overflow', 'Normal', 'Ignored'], correctAnswer: 'Overflow' },
    { text: 'Popping from an empty stack is…?', options: ['Overflow', 'Underflow', 'Normal', 'A warning'], correctAnswer: 'Underflow' },
    { text: 'A real application of a stack is…?', options: ['Print spooling', 'Undo/redo in editors', 'CPU scheduling', 'Message queues'], correctAnswer: 'Undo/redo in editors' },
  ],
  'The Queue: FIFO': [
    { text: 'A queue follows…?', options: ['FIFO', 'LIFO', 'Random', 'Sorted'], correctAnswer: 'FIFO' },
    { text: 'enqueue adds at the…?', options: ['Front', 'Rear', 'Middle', 'Anywhere'], correctAnswer: 'Rear' },
    { text: 'dequeue removes from the…?', options: ['Rear', 'Front', 'Middle', 'Anywhere'], correctAnswer: 'Front' },
    { text: 'A real application of a queue is…?', options: ['Function calls', 'Print spooling / job scheduling', 'Undo history', 'Expression evaluation'], correctAnswer: 'Print spooling / job scheduling' },
  ],

  // ── WEEK 19 — Sorting & Searching Algorithms ──────────────────────────────
  'Linear Search and Binary Search': [
    { text: 'Linear search worst-case complexity is…?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 'O(n)' },
    { text: 'Binary search requires…?', options: ['A small array', 'A sorted array', 'A linked list', 'No precondition'], correctAnswer: 'A sorted array' },
    { text: 'Binary search complexity is…?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 'O(log n)' },
    { text: '`mid = lo + (hi - lo) / 2` is used to…?', options: ['Round to even', 'Avoid integer overflow of (lo + hi)', 'Always pick right half', 'Make it faster'], correctAnswer: 'Avoid integer overflow of (lo + hi)' },
  ],
  'The Simple Sorts: Bubble, Selection, Insertion': [
    { text: 'Bubble sort worst-case complexity is…?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 'O(n²)' },
    { text: 'Selection sort finds the minimum and…?', options: ['Shifts everything', 'Swaps it to the front', 'Recurses', 'Merges'], correctAnswer: 'Swaps it to the front' },
    { text: 'Which sort shines on nearly-sorted data?', options: ['Selection', 'Insertion', 'Quick with bad pivot', 'Bubble always'], correctAnswer: 'Insertion' },
    { text: 'Which of these is O(n²) in ALL cases?', options: ['Insertion sort', 'Selection sort', 'Merge sort', 'Quick sort'], correctAnswer: 'Selection sort' },
  ],
  'Merge Sort and Quick Sort: O(n log n)': [
    { text: 'Merge sort complexity is…?', options: ['O(n²) worst', 'O(n log n) always', 'O(n) always', 'O(log n)'], correctAnswer: 'O(n log n) always' },
    { text: 'Merge sort needs…?', options: ['No extra memory', 'O(n) extra memory for merging', 'A stack always', 'A GPU'], correctAnswer: 'O(n) extra memory for merging' },
    { text: 'Quick sort worst case is…?', options: ['O(n log n) always', 'O(n²) with bad pivot choice', 'O(n) always', 'O(n³)'], correctAnswer: 'O(n²) with bad pivot choice' },
    { text: 'Merge sort is preferred for…?', options: ['Small arrays', 'Linked lists and guaranteed bounds', 'Already-sorted arrays', 'Nothing'], correctAnswer: 'Linked lists and guaranteed bounds' },
  ],

  // ── WEEK 20 — Capstone + Certification Prep ───────────────────────────────
  'Designing a Complete C Project': [
    { text: 'A good FIRST design step is…?', options: ['Writing all the code', 'Defining requirements and choosing data structures', 'Skipping planning', 'Picking a random language'], correctAnswer: 'Defining requirements and choosing data structures' },
    { text: 'Which project exercises structs + files + sorting + searching?', options: ['Hello world', 'A student marks management system', 'A macro', 'A switch demo'], correctAnswer: 'A student marks management system' },
    { text: 'Functions should have…?', options: ['Many responsibilities', 'One responsibility each', 'No parameters', 'Only globals'], correctAnswer: 'One responsibility each' },
    { text: 'Scope ruthlessly means…?', options: ['Add every feature', 'Keep the project small and working', 'Use more globals', 'Never test'], correctAnswer: 'Keep the project small and working' },
  ],
  'Debugging and Testing Like a Professional': [
    { text: 'The quickest first tool for most bugs is…?', options: ['Rewriting the code', 'Printing variable values at key points', 'Rebooting', 'Reinstalling GCC'], correctAnswer: 'Printing variable values at key points' },
    { text: 'Edge cases you MUST test include…?', options: ['Only happy path', 'Empty input and boundary values', 'Compile-only', 'Nothing'], correctAnswer: 'Empty input and boundary values' },
    { text: '`gcc -fsanitize=address` catches…?', options: ['Syntax errors', 'Memory bugs like buffer overflows', 'Logic bugs only', 'All bugs'], correctAnswer: 'Memory bugs like buffer overflows' },
    { text: '`gdb` lets you…?', options: ['Compile faster', 'Set breakpoints and step through code', 'Format code', 'Deploy apps'], correctAnswer: 'Set breakpoints and step through code' },
  ],
  'Final Revision Checklist for the Exam': [
    { text: '`int a[] = {1,2,3,4}; int *p = a; *(p + 3)` is…?', options: ['1', '2', '3', '4'], correctAnswer: '4' },
    { text: '`sizeof(a) / sizeof(a[0])` for `int a[4]` is…?', options: ['4', '16', '8', '2'], correctAnswer: '4' },
    { text: 'The most important exam skill for code-trace questions is…?', options: ['Memorising syntax', 'Hand-tracing line by line', 'Using a debugger in the exam', 'Guessing'], correctAnswer: 'Hand-tracing line by line' },
    { text: 'Before the exam you should be able to…?', options: ['Only read code', 'Write, trace, and explain each concept', 'Only write code', 'Only explain'], correctAnswer: 'Write, trace, and explain each concept' },
  ],
};
