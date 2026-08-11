/**
 * Python course — per-topic quizzes.
 *
 * Keyed by the EXACT topic titles used in `python.ts`. Each topic has 4
 * questions (4 options, exactly 1 correct). These back the frontend
 * topic-lock flow: a topic is only unlockable once the previous topic's
 * quiz is passed, and the topic quiz is fetched by topic id.
 *
 * IMPORTANT: question texts must NOT duplicate the chapter-quiz texts in
 * python.ts, because the week quiz endpoint returns every question in a
 * module (topic + chapter) together.
 */

export interface PythonTopicQuiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const pythonTopicQuizzes: Record<string, PythonTopicQuiz[]> = {
  // ───────────────────────────── W1 ─────────────────────────────
  'Why Python: Readable, Fast to Build & Everywhere': [
    {
      text: 'Which feature is a core reason Python is called READABLE?',
      options: ['It uses no punctuation at all', 'Indentation replaces braces — code reads like sentences', 'It is written in English', 'It has no variables'],
      correctAnswer: 'Indentation replaces braces — code reads like sentences',
    },
    {
      text: 'Python is described as "fast to build" mainly because…',
      options: ['it runs faster than C', 'you write less code — built-ins and libraries do the work', 'it compiles instantly', 'it has no syntax'],
      correctAnswer: 'you write less code — built-ins and libraries do the work',
    },
    {
      text: 'Which is a major real-world domain for Python?',
      options: ['Data analysis and automation', 'Only website styling', 'Only operating systems', 'Only hardware design'],
      correctAnswer: 'Data analysis and automation',
    },
    {
      text: 'The Python motto about the standard library is…',
      options: ['"less is more"', '"batteries included"', '"one size fits all"', '"by the people for the people"'],
      correctAnswer: '"batteries included"',
    },
  ],
  'Interpreted Execution: The REPL & .py Files': [
    {
      text: 'Python is an INTERPRETED language, which means…',
      options: ['code runs line by line through an interpreter, not compiled to machine code first', 'it never runs on the CPU', 'it needs a browser', 'it is written in binary'],
      correctAnswer: 'code runs line by line through an interpreter, not compiled to machine code first',
    },
    {
      text: 'REPL stands for…',
      options: ['Read-Eval-Print Loop', 'Run-Execute-Print-Line', 'Random-Evaluate-Parse-Loop', 'Read-Execute-Print-Logic'],
      correctAnswer: 'Read-Eval-Print Loop',
    },
    {
      text: 'To start the interactive Python REPL from the terminal, type…',
      options: ['run python', 'python', 'py', 'comp'],
      correctAnswer: 'python',
    },
    {
      text: 'A `.py` file contains…',
      options: ['Python source code that the interpreter executes', 'compiled bytecode only', 'images', 'HTML'],
      correctAnswer: 'Python source code that the interpreter executes',
    },
  ],
  'The Zen of Python & "Batteries Included"': [
    {
      text: 'The Zen of Python is…',
      options: ['a set of guiding principles (19 aphorisms) printed by `import this`', 'a coding style compiler', 'a test framework', 'a GUI library'],
      correctAnswer: 'a set of guiding principles (19 aphorisms) printed by `import this`',
    },
    {
      text: '`import this` in the REPL…',
      options: ['prints the Zen of Python', 'installs a package', 'imports a web framework', 'is an error'],
      correctAnswer: 'prints the Zen of Python',
    },
    {
      text: '"Explicit is better than implicit" encourages…',
      options: ['code that states its intent clearly rather than relying on hidden behaviour', 'shorter variable names always', 'more magic methods', 'globals'],
      correctAnswer: 'code that states its intent clearly rather than relying on hidden behaviour',
    },
    {
      text: 'The phrase "batteries included" refers to…',
      options: ['the large standard library that ships with Python', 'hardware adapters', 'IDE plugins', 'the power supply'],
      correctAnswer: 'the large standard library that ships with Python',
    },
  ],
  'Python in the Real World: Web, Data & Automation': [
    {
      text: 'Popular Python WEB frameworks are…',
      options: ['Flask and Django', 'React and Vue', 'Angular and Svelte', 'Spring and Rails'],
      correctAnswer: 'Flask and Django',
    },
    {
      text: 'In DATA analysis, the ecosystem "NumPy + Pandas + Matplotlib" is used to…',
      options: ['process and visualize tabular data', 'build web pages', 'write device drivers', 'compile C code'],
      correctAnswer: 'process and visualize tabular data',
    },
    {
      text: 'Automation in Python typically means…',
      options: ['scripts that repeat file/data tasks without manual work', 'only game graphics', 'only mobile apps', 'only OS kernels'],
      correctAnswer: 'scripts that repeat file/data tasks without manual work',
    },
    {
      text: 'Beyond data/web, Python is heavily used for…',
      options: ['machine learning and AI', 'only CSS', 'only SQL databases', 'only networking hardware'],
      correctAnswer: 'machine learning and AI',
    },
  ],

  // ───────────────────────────── W2 ─────────────────────────────
  'Installing Python & Checking Your Setup': [
    {
      text: 'To check whether Python is installed, you type…',
      options: ['python --version', 'version python', 'python install', 'check py'],
      correctAnswer: 'python --version',
    },
    {
      text: 'The official, safest way to install Python on most systems is…',
      options: ['from python.org (or your package manager)', 'by renaming a file', 'through a text editor', 'it cannot be installed'],
      correctAnswer: 'from python.org (or your package manager)',
    },
    {
      text: '`python` and `python3` differ because…',
      options: ['python3 explicitly runs Python 3 on systems where `python` might point elsewhere', 'they are different languages', 'python3 is for servers only', 'there is no difference'],
      correctAnswer: 'python3 explicitly runs Python 3 on systems where `python` might point elsewhere',
    },
    {
      text: 'A minimal way to verify the interpreter works is…',
      options: ['running `python -c "print(1+1)"` and seeing 2', 'installing a browser', 'rebooting', 'checking the RAM'],
      correctAnswer: 'running `python -c "print(1+1)"` and seeing 2',
    },
  ],
  'Choosing an Editor or IDE (VS Code, PyCharm, Jupyter)': [
    {
      text: 'Which is a code EDITOR (lightweight, extensible)?',
      options: ['VS Code', 'A web browser', 'Excel', 'Photoshop'],
      correctAnswer: 'VS Code',
    },
    {
      text: 'PyCharm is best described as…',
      options: ['a full-featured Python IDE by JetBrains', 'a game engine', 'a database', 'a font'],
      correctAnswer: 'a full-featured Python IDE by JetBrains',
    },
    {
      text: 'Jupyter Notebooks are ideal for…',
      options: ['exploratory, cell-by-cell analysis with inline charts', 'writing device drivers', 'compiling binaries', 'designing logos'],
      correctAnswer: 'exploratory, cell-by-cell analysis with inline charts',
    },
    {
      text: 'The most important editor feature for beginners is…',
      options: ['syntax highlighting and autocomplete to catch typos', 'themes', 'a music player', 'social media integration'],
      correctAnswer: 'syntax highlighting and autocomplete to catch typos',
    },
  ],
  'Your First Script: print() and Comments': [
    {
      text: 'What does `print("Hi")` do?',
      options: ['Displays Hi on the screen', 'Saves Hi to a file', 'Defines a variable', 'Returns a number'],
      correctAnswer: 'Displays Hi on the screen',
    },
    {
      text: 'Which line is a valid Python comment?',
      options: ['# this is a comment', '// this is a comment', '<!-- comment -->', '/* comment */'],
      correctAnswer: '# this is a comment',
    },
    {
      text: '`print("a", "b")` outputs…',
      options: ['a b', 'ab', 'a,b', '"a" "b"'],
      correctAnswer: 'a b',
    },
    {
      text: 'Comments are used to…',
      options: ['explain code to humans — Python ignores them', 'make code faster', 'define variables', 'start the program'],
      correctAnswer: 'explain code to humans — Python ignores them',
    },
  ],
  'Errors, Tracebacks & the Debugging Mindset': [
    {
      text: 'When your code fails, Python shows a…',
      options: ['traceback listing the error type and the failing line', 'black screen', 'JPG image', 'silent result'],
      correctAnswer: 'traceback listing the error type and the failing line',
    },
    {
      text: 'A `SyntaxError` means…',
      options: ['the code is not valid Python and cannot run', 'the logic is wrong', 'the file is missing', 'the computer is slow'],
      correctAnswer: 'the code is not valid Python and cannot run',
    },
    {
      text: 'The FIRST place to look when reading a traceback is…',
      options: ['the bottom-most "your file" line where the error occurred', 'the top of the screen', 'the OS logs', 'the RAM'],
      correctAnswer: 'the bottom-most "your file" line where the error occurred',
    },
    {
      text: 'The debugging mindset means…',
      options: ['reading the error message carefully and changing ONE thing at a time', 'randomly rewriting the file', 'deleting the project', 'giving up'],
      correctAnswer: 'reading the error message carefully and changing ONE thing at a time',
    },
  ],

  // ───────────────────────────── W3 ─────────────────────────────
  'Variables & Dynamic Typing': [
    {
      text: 'Which creates a variable in Python?',
      options: ['age = 21', 'var age', 'let age', 'age := 21 is invalid; int age'],
      correctAnswer: 'age = 21',
    },
    {
      text: 'Python is DYNAMICALLY typed, which means…',
      options: ['a variable can hold different types over time without redeclaring', 'types are fixed forever', 'numbers only', 'you must compile types'],
      correctAnswer: 'a variable can hold different types over time without redeclaring',
    },
    {
      text: 'A valid variable name is…',
      options: ['user_name', '2name', 'user-name', 'class'],
      correctAnswer: 'user_name',
    },
    {
      text: 'To see the type of a value you use…',
      options: ['type(x)', 'typeof(x)', 'kind(x)', 'class(x)'],
      correctAnswer: 'type(x)',
    },
  ],
  'Numbers: int, float & Their Quirks': [
    {
      text: '`type(3)` is…',
      options: ['int', 'float', 'str', 'bool'],
      correctAnswer: 'int',
    },
    {
      text: '`type(3.14)` is…',
      options: ['float', 'int', 'decimal', 'number'],
      correctAnswer: 'float',
    },
    {
      text: 'The classic float quirk `0.1 + 0.2` gives…',
      options: ['0.30000000000000004 due to binary floating point', '0.3 exactly', 'an error', '0'],
      correctAnswer: '0.30000000000000004 due to binary floating point',
    },
    {
      text: 'To force `3 / 2` to behave as integer division you write…',
      options: ['3 // 2 — but that is floor division, giving 1', 'int(3) / int(2)', '3 DIV 2', 'floor(3/2) gives 1 but it is not "3 / 2"'],
      correctAnswer: '3 // 2 — but that is floor division, giving 1',
    },
  ],
  'Strings & f-Strings': [
    {
      text: 'Which are valid string delimiters?',
      options: ['Both "double" and \'single\' quotes', 'Only double quotes', 'Only backticks', 'Only angle brackets'],
      correctAnswer: 'Both "double" and \'single\' quotes',
    },
    {
      text: '`len("hello")` returns…',
      options: ['5', '6', 'hello', 'an error'],
      correctAnswer: '5',
    },
    {
      text: 'The f-string that puts a 21 into "Avi is 21" is…',
      options: ['f"Avi is {age}"', '"Avi is {age}"', 'f"Avi is $age"', '"Avi is %age"'],
      correctAnswer: 'f"Avi is {age}"',
    },
    {
      text: 'String concatenation "a" + "b" yields…',
      options: ['"ab"', '"a b"', '["a", "b"]', '"a+b"'],
      correctAnswer: '"ab"',
    },
  ],
  'Booleans & None': [
    {
      text: 'The two boolean values are…',
      options: ['True and False (capitalized)', 'true and false', '1 and 2', 'yes and no'],
      correctAnswer: 'True and False (capitalized)',
    },
    {
      text: '`type(None)` is…',
      options: ['NoneType', 'str', 'bool', 'null'],
      correctAnswer: 'NoneType',
    },
    {
      text: '`None` represents…',
      options: ['the absence of a value', 'the number zero', 'an empty string', 'a false boolean'],
      correctAnswer: 'the absence of a value',
    },
    {
      text: '`bool(0)` evaluates to…',
      options: ['False — zero is falsy', 'True', 'an error', 'None'],
      correctAnswer: 'False — zero is falsy',
    },
  ],

  // ───────────────────────────── W4 ─────────────────────────────
  'Arithmetic, Floor Division & Modulo': [
    {
      text: '`7 % 3` (modulo) returns…',
      options: ['1', '2', '2.33', '0'],
      correctAnswer: '1',
    },
    {
      text: '`7 // 2` (floor division) returns…',
      options: ['3', '3.5', '4', '1'],
      correctAnswer: '3',
    },
    {
      text: '`2 ** 3` evaluates to…',
      options: ['8', '6', '9', '23'],
      correctAnswer: '8',
    },
    {
      text: 'Modulo `x % 2 == 0` is the idiomatic test for…',
      options: ['even numbers', 'odd numbers only', 'large numbers', 'floats'],
      correctAnswer: 'even numbers',
    },
  ],
  'Comparison & Logical Operators': [
    {
      text: '`10 >= 10` is…',
      options: ['True', 'False', 'an error', '10'],
      correctAnswer: 'True',
    },
    {
      text: 'The logical AND in Python is written…',
      options: ['and', '&&', '&', 'AND()'],
      correctAnswer: 'and',
    },
    {
      text: '`not True` evaluates to…',
      options: ['False', 'True', 'an error', '0'],
      correctAnswer: 'False',
    },
    {
      text: '`"a" != "b"` is…',
      options: ['True', 'False', 'an error', 'ab'],
      correctAnswer: 'True',
    },
  ],
  'Type Conversion & Input Parsing': [
    {
      text: '`int("42")` returns…',
      options: ['42 (an int)', '"42" (a string)', '42.0', 'an error'],
      correctAnswer: '42 (an int)',
    },
    {
      text: 'If the user types 42, `input()` returns…',
      options: ['the string "42"', 'the int 42', 'None', 'a float'],
      correctAnswer: 'the string "42"',
    },
    {
      text: '`str(21)` converts the number to…',
      options: ['"21"', '21', 'None', 'an error'],
      correctAnswer: '"21"',
    },
    {
      text: 'To read a whole number from input safely you write…',
      options: ['int(input(...)) — wrapped in try/except for bad input', 'input(int(...))', 'number(input())', 'read.int()'],
      correctAnswer: 'int(input(...)) — wrapped in try/except for bad input',
    },
  ],
  'Expression Evaluation & Operator Precedence': [
    {
      text: '`(2 + 3) * 4` evaluates to…',
      options: ['20', '14', '24', '9'],
      correctAnswer: '20',
    },
    {
      text: 'To force addition before multiplication you use…',
      options: ['parentheses — (2 + 3) * 4', 'square brackets', 'a comment', 'a comma'],
      correctAnswer: 'parentheses — (2 + 3) * 4',
    },
    {
      text: 'The operator precedence rule says…',
      options: ['** then * / // % then + - then comparisons then logicals', 'left to right always', 'logicals first', 'there is no order'],
      correctAnswer: '** then * / // % then + - then comparisons then logicals',
    },
    {
      text: '`10 % 4 * 2` evaluates to…',
      options: ['4 — % and * share precedence, left to right', '1', '10', '8'],
      correctAnswer: '4 — % and * share precedence, left to right',
    },
  ],

  // ───────────────────────────── W5 ─────────────────────────────
  'if / elif / else Chains': [
    {
      text: 'An `if` with multiple branches uses which keywords?',
      options: ['if, elif, else', 'if, else if, else', 'when, then', 'choose, otherwise'],
      correctAnswer: 'if, elif, else',
    },
    {
      text: 'In `if score >= 50: print("pass") else: print("fail")` the else runs when…',
      options: ['score < 50', 'score == 50', 'score > 50', 'always'],
      correctAnswer: 'score < 50',
    },
    {
      text: 'Which is correct syntax?',
      options: ['if x > 0:\n    print("pos")', 'if x > 0 then print', 'if (x > 0) { print }', 'if x > 0 -> print'],
      correctAnswer: 'if x > 0:\n    print("pos")',
    },
    {
      text: 'At most, how many `elif` clauses can one chain have?',
      options: ['Any number', 'One', 'Two', 'None'],
      correctAnswer: 'Any number',
    },
  ],
  'Truthiness: What Counts as False': [
    {
      text: 'Which values are FALSY in Python?',
      options: ['0, "", [], {}, None, False', 'Only False', 'Only 0', 'Empty lists are truthy'],
      correctAnswer: '0, "", [], {}, None, False',
    },
    {
      text: '`bool([])` is…',
      options: ['False — empty containers are falsy', 'True', 'an error', 'None'],
      correctAnswer: 'False — empty containers are falsy',
    },
    {
      text: '`bool("0")` (the string "0") is…',
      options: ['True — a non-empty string is truthy even if it looks like zero', 'False', 'an error', '0'],
      correctAnswer: 'True — a non-empty string is truthy even if it looks like zero',
    },
    {
      text: '`if my_list:` is true when…',
      options: ['the list has at least one element', 'the list is empty', 'the list is None', 'never'],
      correctAnswer: 'the list has at least one element',
    },
  ],
  'Nested Conditionals & Early Returns': [
    {
      text: 'Nested ifs are…',
      options: ['if blocks inside other if blocks', 'illegal in Python', 'only for loops', 'a type of loop'],
      correctAnswer: 'if blocks inside other if blocks',
    },
    {
      text: 'An early return / guard clause…',
      options: ['exits the function early on failure, flattening nested ifs', 'adds more nesting', 'is a syntax error', 'deletes a variable'],
      correctAnswer: 'exits the function early on failure, flattening nested ifs',
    },
    {
      text: 'Deeply nested ifs should be refactored to…',
      options: ['guard clauses / early returns', 'more nesting', 'global variables', 'semicolons'],
      correctAnswer: 'guard clauses / early returns',
    },
    {
      text: 'A "guard" typically checks…',
      options: ['a failure/edge case first and returns early', 'the happy path first', 'only strings', 'performance'],
      correctAnswer: 'a failure/edge case first and returns early',
    },
  ],
  'Ternary Expressions & Simple Guards': [
    {
      text: '`"adult" if age >= 18 else "minor"` is a…',
      options: ['ternary (conditional) expression', 'list comprehension', 'while loop', 'decorator'],
      correctAnswer: 'ternary (conditional) expression',
    },
    {
      text: 'Ternary expressions are best used for…',
      options: ['simple one-line value choices', 'multi-step logic', 'loops', 'imports'],
      correctAnswer: 'simple one-line value choices',
    },
    {
      text: '`x or default` idiom returns…',
      options: ['x if truthy, otherwise default', 'x always', 'default always', 'an error'],
      correctAnswer: 'x if truthy, otherwise default',
    },
    {
      text: 'The walrus operator `:=`…',
      options: ['assigns a value and tests it in the same expression', 'compares two values', 'is a comment', 'deletes variables'],
      correctAnswer: 'assigns a value and tests it in the same expression',
    },
  ],

  // ───────────────────────────── W6 ─────────────────────────────
  'The for Loop & range()': [
    {
      text: '`for c in "abc":` iterates…',
      options: ['a, then b, then c', 'abc once', 'an index', 'nothing'],
      correctAnswer: 'a, then b, then c',
    },
    {
      text: '`range(3)` yields…',
      options: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '3'],
      correctAnswer: '0, 1, 2',
    },
    {
      text: '`range(2, 5)` yields…',
      options: ['2, 3, 4', '2, 3, 4, 5', '1, 2, 3, 4', '5'],
      correctAnswer: '2, 3, 4',
    },
    {
      text: 'The name of the loop that hands you each item of a list is…',
      options: ['for (a "for each" loop)', 'while', 'repeat', 'map'],
      correctAnswer: 'for (a "for each" loop)',
    },
  ],
  'while Loops & Loop Control (break/continue)': [
    {
      text: '`while n < 3:` repeats while…',
      options: ['the condition is truthy', 'the condition is False', 'n equals 3', 'always'],
      correctAnswer: 'the condition is truthy',
    },
    {
      text: '`break` inside a loop…',
      options: ['exits the loop immediately', 'skips one iteration', 'restarts the loop', 'errors'],
      correctAnswer: 'exits the loop immediately',
    },
    {
      text: 'What does this code print?\n```python\nfor n in range(5):\n    if n == 2:\n        continue\n    print(n)\n```',
      options: ['0 1 3 4', '0 1 2 3 4', '2', 'nothing'],
      correctAnswer: '0 1 3 4',
    },
    {
      text: '`while True:` with a `break` inside is used to…',
      options: ['loop until an explicit exit condition is met', 'run forever with no exit', 'cause an error', 'sleep'],
      correctAnswer: 'loop until an explicit exit condition is met',
    },
  ],
  'List Comprehensions': [
    {
      text: '`[x * 2 for x in range(3)]` produces…',
      options: ['[0, 2, 4]', '[2, 4, 6]', '[1, 2, 3]', '[0, 1, 4]'],
      correctAnswer: '[0, 2, 4]',
    },
    {
      text: 'The filter part of a comprehension comes…',
      options: ['after the for clause, as `if`', 'before the expression', 'in parentheses', 'comprehensions cannot filter'],
      correctAnswer: 'after the for clause, as `if`',
    },
    {
      text: '`[n for n in range(10) if n % 2 == 0]` gives…',
      options: ['the even numbers 0..8', 'the odd numbers', 'all numbers', 'a tuple'],
      correctAnswer: 'the even numbers 0..8',
    },
    {
      text: 'Comprehensions should be avoided when…',
      options: ['the body needs several statements or side effects — use a loop', 'the list is short', 'using ints', 'always'],
      correctAnswer: 'the body needs several statements or side effects — use a loop',
    },
  ],
  'Looping with enumerate() & zip()': [
    {
      text: '`enumerate(fruits)` yields…',
      options: ['(index, item) pairs', 'just indexes', 'just items', 'a dict'],
      correctAnswer: '(index, item) pairs',
    },
    {
      text: '`zip(a, b)` pairs up…',
      options: ['element i of a with element i of b', 'all of a with all of b', 'a and b concatenated', 'a reversed with b'],
      correctAnswer: 'element i of a with element i of b',
    },
    {
      text: '`for i, x in enumerate(data):` — here `i` is…',
      options: ['the index, x the item', 'the item', 'the length', 'an error'],
      correctAnswer: 'the index, x the item',
    },
    {
      text: '`dict(zip(keys, values))` builds…',
      options: ['a dict mapping each key to the paired value', 'a list of pairs', 'a set', 'a string'],
      correctAnswer: 'a dict mapping each key to the paired value',
    },
  ],

  // ───────────────────────────── W7 ─────────────────────────────
  'Defining & Calling Functions': [
    {
      text: 'The keyword to define a function is…',
      options: ['def', 'function', 'fun', 'func'],
      correctAnswer: 'def',
    },
    {
      text: '`greet("Avi")` is an example of a…',
      options: ['function call', 'function definition', 'variable', 'import'],
      correctAnswer: 'function call',
    },
    {
      text: 'Arguments passed by name, like `describe(name="Avi")`, are called…',
      options: ['keyword arguments', 'positional arguments', 'defaults', 'lists'],
      correctAnswer: 'keyword arguments',
    },
    {
      text: 'A function should…',
      options: ['do ONE clear job', 'do many unrelated jobs', 'always print', 'never return'],
      correctAnswer: 'do ONE clear job',
    },
  ],
  'Parameters: Defaults, *args & **kwargs': [
    {
      text: '`def f(a, b=1):` — calling `f(5)` gives…',
      options: ['a=5, b=1 (default used)', 'an error', 'a=5, b=5', 'a=1, b=5'],
      correctAnswer: 'a=5, b=1 (default used)',
    },
    {
      text: '`*args` collects…',
      options: ['any number of positional arguments into a tuple', 'keyword arguments', 'a single arg', 'none'],
      correctAnswer: 'any number of positional arguments into a tuple',
    },
    {
      text: '`**kwargs` collects…',
      options: ['keyword arguments into a dict', 'positional arguments', 'a list', 'nothing'],
      correctAnswer: 'keyword arguments into a dict',
    },
    {
      text: 'The correct way to make a default list parameter is…',
      options: ['def f(items=None):\n    items = items or []', 'def f(items=[]):', 'def f(items=new()):', 'def f(items=list):'],
      correctAnswer: 'def f(items=None):\n    items = items or []',
    },
  ],
  'Return Values & Multiple Returns': [
    {
      text: '`return` inside a function…',
      options: ['ends the function and gives back the value', 'only prints', 'continues the loop', 'is optional but required before print'],
      correctAnswer: 'ends the function and gives back the value',
    },
    {
      text: 'A function without a return statement returns…',
      options: ['None', '0', 'False', 'the last print'],
      correctAnswer: 'None',
    },
    {
      text: '`return min(a), max(a)` followed by `lo, hi = f(...)` uses…',
      options: ['tuple unpacking', 'slicing', 'a class', 'a loop'],
      correctAnswer: 'tuple unpacking',
    },
    {
      text: 'To return several related values, the idiomatic style is…',
      options: ['a tuple that callers unpack', 'a global variable', 'print them', 'a comment'],
      correctAnswer: 'a tuple that callers unpack',
    },
  ],
  'Scope: Local vs Global & the LEGB Rule': [
    {
      text: 'The LEGB order for name resolution is…',
      options: ['Local, Enclosing, Global, Built-in', 'Built-in first', 'Global first', 'Local last'],
      correctAnswer: 'Local, Enclosing, Global, Built-in',
    },
    {
      text: 'Assigning `x = 5` inside a function when a global `x` exists…',
      options: ['creates a local x, global untouched', 'overwrites the global', 'errors', 'deletes the global'],
      correctAnswer: 'creates a local x, global untouched',
    },
    {
      text: 'A function that only READS a global…',
      options: ['works fine without any declaration', 'errors', 'needs global keyword', 'copies it'],
      correctAnswer: 'works fine without any declaration',
    },
    {
      text: 'To modify a global from inside a function you must…',
      options: ['declare `global x` first — a design smell best avoided', 'use a loop', 'restart Python', 'rename it'],
      correctAnswer: 'declare `global x` first — a design smell best avoided',
    },
  ],

  // ───────────────────────────── W8 ─────────────────────────────
  'Lists: Creation, Indexing & Slicing': [
    {
      text: '`mylist[0]` gives…',
      options: ['the first element', 'the last element', 'an error', 'the length'],
      correctAnswer: 'the first element',
    },
    {
      text: '`data[-1]` gives…',
      options: ['the last element', 'the first element', 'an error', 'None'],
      correctAnswer: 'the last element',
    },
    {
      text: '`data[::2]` returns…',
      options: ['every second element', 'the whole list', 'the first two', 'a reversed copy'],
      correctAnswer: 'every second element',
    },
    {
      text: '`b = a` in Python…',
      options: ['does NOT copy the list — b is the same list', 'deep-copies it', 'slices it', 'errors'],
      correctAnswer: 'does NOT copy the list — b is the same list',
    },
  ],
  'List Methods: append, extend, sort & remove': [
    {
      text: '`my_list.append(5)`…',
      options: ['adds 5 as a single new element at the end', 'adds 5 to every element', 'removes 5', 'sorts'],
      correctAnswer: 'adds 5 as a single new element at the end',
    },
    {
      text: '`a.extend(b)`…',
      options: ['adds every element of b to a', 'nests b inside a', 'compares a and b', 'errors'],
      correctAnswer: 'adds every element of b to a',
    },
    {
      text: '`x = my_list.sort()` leaves `x` as…',
      options: ['None — sort() mutates in place and returns None', 'the sorted list', 'a copy', 'an error'],
      correctAnswer: 'None — sort() mutates in place and returns None',
    },
    {
      text: '`my_list.pop()`…',
      options: ['removes and returns the last element', 'removes the first', 'clears the list', 'sorts'],
      correctAnswer: 'removes and returns the last element',
    },
  ],
  'Tuples: Immutability & Unpacking': [
    {
      text: 'Which creates a one-element tuple?',
      options: ['(5,)', '(5)', '5', 'tuple(5,) is also fine but (5,) is the common form'],
      correctAnswer: '(5,)',
    },
    {
      text: 'Tuples differ from lists because they are…',
      options: ['immutable', 'slower', 'unhashable', 'unlimited'],
      correctAnswer: 'immutable',
    },
    {
      text: '`x, y = (3, 4)` assigns…',
      options: ['x=3, y=4 (unpacking)', 'x=(3,4)', 'an error', 'x=y=3'],
      correctAnswer: 'x=3, y=4 (unpacking)',
    },
    {
      text: '`first, *rest, last = [1, 2, 3, 4]` gives…',
      options: ['first=1, rest=[2,3], last=4', 'first=[1], rest=[2,3,4]', 'an error', 'last=1'],
      correctAnswer: 'first=1, rest=[2,3], last=4',
    },
  ],
  'When to Choose a List vs a Tuple': [
    {
      text: 'Use a LIST when…',
      options: ['the collection will grow/shrink/reorder', 'the shape is fixed forever', 'you need a dict key', 'you want immutability'],
      correctAnswer: 'the collection will grow/shrink/reorder',
    },
    {
      text: 'Use a TUPLE when…',
      options: ['the shape is a fixed record that must not change', 'you will append often', 'you need sort()', 'the data is huge'],
      correctAnswer: 'the shape is a fixed record that must not change',
    },
    {
      text: 'Tuples can be dictionary keys because they are…',
      options: ['hashable (immutable)', 'smaller', 'faster', 'strings'],
      correctAnswer: 'hashable (immutable)',
    },
    {
      text: 'The mental shortcut: a tuple is…',
      options: ['ONE thing with parts; a list is many things', 'always better', 'a type of dict', 'obsolete'],
      correctAnswer: 'ONE thing with parts; a list is many things',
    },
  ],

  // ───────────────────────────── W9 ─────────────────────────────
  'Dictionaries: Key-Value Storage': [
    {
      text: 'A dictionary maps…',
      options: ['keys to values', 'values to keys only', 'lists to sets', 'nothing'],
      correctAnswer: 'keys to values',
    },
    {
      text: '`student["name"]` when the key is missing raises…',
      options: ['KeyError', 'ValueError', 'IndexError', 'None'],
      correctAnswer: 'KeyError',
    },
    {
      text: '`student.get("grade", "N/A")` returns…',
      options: ['the grade or "N/A" if missing', 'always N/A', 'an error', 'the whole dict'],
      correctAnswer: 'the grade or "N/A" if missing',
    },
    {
      text: 'Which can be a dict key?',
      options: ['a tuple', 'a list', 'a dict', 'a set'],
      correctAnswer: 'a tuple',
    },
  ],
  'Dictionary Methods & Iteration': [
    {
      text: '`for k, v in d.items():` iterates…',
      options: ['key-value pairs', 'just keys', 'just values', 'the length'],
      correctAnswer: 'key-value pairs',
    },
    {
      text: '`d.update({"x": 1})`…',
      options: ['merges x:1 into d (overwriting if present)', 'errors', 'empties d', 'creates a copy'],
      correctAnswer: 'merges x:1 into d (overwriting if present)',
    },
    {
      text: '`d.pop("k", "fallback")`…',
      options: ['removes k and returns its value, or fallback if absent', 'only reads', 'adds k', 'errors'],
      correctAnswer: 'removes k and returns its value, or fallback if absent',
    },
    {
      text: 'The modern dict merge operator (3.9+) is…',
      options: ['|', '+', '&', '>>'],
      correctAnswer: '|',
    },
  ],
  'Sets: Unique Values & Set Operations': [
    {
      text: '`set(["a", "b", "a"])` produces…',
      options: ['{"a", "b"} — duplicates removed', '{"a", "b", "a"}', '["a", "b", "a"]', 'an error'],
      correctAnswer: '{"a", "b"} — duplicates removed',
    },
    {
      text: 'The intersection of {1, 2} and {2, 3} is…',
      options: ['{2}', '{1, 2, 3}', '{1, 3}', '{}'],
      correctAnswer: '{2}',
    },
    {
      text: '`x in a_set` is fast because sets…',
      options: ['are hash-based (O(1) lookup)', 'are sorted', 'are small', 'cache results'],
      correctAnswer: 'are hash-based (O(1) lookup)',
    },
    {
      text: 'Sets are unordered — to get sorted output you…',
      options: ['use sorted(my_set)', 'use my_set[0]', 'reverse it', 'can\'t'],
      correctAnswer: 'use sorted(my_set)',
    },
  ],
  'Counting & Grouping with Dictionaries': [
    {
      text: 'The standard tool for counting occurrences is…',
      options: ['collections.Counter', 'sum()', 'len()', 'random'],
      correctAnswer: 'collections.Counter',
    },
    {
      text: '`Counter(words).most_common(1)`…',
      options: ['returns the most common item with its count', 'returns the least common', 'sorts the words', 'errors'],
      correctAnswer: 'returns the most common item with its count',
    },
    {
      text: '`defaultdict(list)`…',
      options: ['auto-creates an empty list when a new key is touched', 'errors on new keys', 'only holds ints', 'is a tuple'],
      correctAnswer: 'auto-creates an empty list when a new key is touched',
    },
    {
      text: '`groups.setdefault(batch, []).append(name)` does…',
      options: ['the same as defaultdict: bucket by key', 'nothing useful', 'deletes buckets', 'sorts buckets'],
      correctAnswer: 'the same as defaultdict: bucket by key',
    },
  ],

  // ───────────────────────────── W10 ─────────────────────────────
  'String Methods: split, join, strip & replace': [
    {
      text: '`"  hi  ".strip()` yields…',
      options: ['"hi"', '"  hi  "', '"hi  "', '"  hi"'],
      correctAnswer: '"hi"',
    },
    {
      text: '`"a-b-c".replace("b", "x")` yields…',
      options: ['"a-x-c"', '"a-b-c"', '"x-x-x"', '"a-bx-c"'],
      correctAnswer: '"a-x-c"',
    },
    {
      text: '`"Avi,21".split(",")` yields…',
      options: ['["Avi", "21"]', '["Avi,21"]', '"Avi 21"', '("Avi", "21")'],
      correctAnswer: '["Avi", "21"]',
    },
    {
      text: '`"-".join(["a", "b"])` yields…',
      options: ['"a-b"', '"a, b"', '["a-b"]', '"ab"'],
      correctAnswer: '"a-b"',
    },
  ],
  'Formatting Strings: f-Strings & .format()': [
    {
      text: '`f"{price:.2f}"` formats a number with…',
      options: ['exactly 2 decimal places', '2 digits total', 'no decimals', 'a percent sign'],
      correctAnswer: 'exactly 2 decimal places',
    },
    {
      text: '`f"{name:>10}"`…',
      options: ['pads right to width 10', 'truncates to 10 chars', 'adds 10 spaces after', 'errors'],
      correctAnswer: 'pads right to width 10',
    },
    {
      text: 'The debug shortcut `f"{score = }"` prints…',
      options: ['score = 92', '92', 'score', 'a syntax error'],
      correctAnswer: 'score = 92',
    },
    {
      text: '`.format()` is preferred over f-strings when…',
      options: ['the template is stored/reused separately', 'always', 'never', 'the values are ints'],
      correctAnswer: 'the template is stored/reused separately',
    },
  ],
  'Reading Files: open, read & with Blocks': [
    {
      text: '`open("f.txt")` defaults to mode…',
      options: ['"r" (read)', '"w" (write)', '"a" (append)', '"x" (create)'],
      correctAnswer: '"r" (read)',
    },
    {
      text: '`f.read()` returns…',
      options: ['the whole file as one string', 'a list of lines', 'bytes only', 'an int'],
      correctAnswer: 'the whole file as one string',
    },
    {
      text: 'The memory-safe way to read a huge file is…',
      options: ['iterate line by line: `for line in f:`', 'f.read()', 'f.readlines()', 'copy the file'],
      correctAnswer: 'iterate line by line: `for line in f:`',
    },
    {
      text: 'Opening a missing file raises…',
      options: ['FileNotFoundError', 'ValueError', 'KeyError', 'Nothing'],
      correctAnswer: 'FileNotFoundError',
    },
  ],
  'Writing Files & Appending': [
    {
      text: 'Mode "w"…',
      options: ['overwrites/truncates the file', 'appends', 'only reads', 'errors if exists'],
      correctAnswer: 'overwrites/truncates the file',
    },
    {
      text: 'Mode "a"…',
      options: ['appends to the existing content', 'overwrites', 'reads', 'errors'],
      correctAnswer: 'appends to the existing content',
    },
    {
      text: '`f.write(...)` does NOT add a newline — you must…',
      options: ['include "\\n" yourself', 'call newline()', 'use print', 'write twice'],
      correctAnswer: 'include "\\n" yourself',
    },
    {
      text: 'Mode "x"…',
      options: ['creates a new file and errors if it already exists', 'overwrites', 'appends', 'reads'],
      correctAnswer: 'creates a new file and errors if it already exists',
    },
  ],

  // ───────────────────────────── W11 ─────────────────────────────
  'try / except / finally': [
    {
      text: 'The block structure for handling errors is…',
      options: ['try / except / else / finally', 'if / catch', 'begin / rescue', 'try / throw'],
      correctAnswer: 'try / except / else / finally',
    },
    {
      text: 'The `else` block runs…',
      options: ['only if the try block succeeded with no error', 'only on errors', 'always', 'never'],
      correctAnswer: 'only if the try block succeeded with no error',
    },
    {
      text: 'The `finally` block…',
      options: ['always runs, error or not — great for cleanup', 'runs only on success', 'runs only on error', 'is optional and rarely used'],
      correctAnswer: 'always runs, error or not — great for cleanup',
    },
    {
      text: 'Catching bare `except:` is discouraged because it…',
      options: ['catches everything, even KeyboardInterrupt and internal errors', 'is slower', 'only catches strings', 'does nothing'],
      correctAnswer: 'catches everything, even KeyboardInterrupt and internal errors',
    },
  ],
  'Exception Types & except Blocks': [
    {
      text: '`ZeroDivisionError` is a subclass of…',
      options: ['ArithmeticError', 'LookupError', 'ValueError', 'OSError'],
      correctAnswer: 'ArithmeticError',
    },
    {
      text: 'Multiple except clauses are tried…',
      options: ['top to bottom, first match wins', 'bottom to top', 'randomly', 'all at once'],
      correctAnswer: 'top to bottom, first match wins',
    },
    {
      text: '`except (ValueError, TypeError) as e:`…',
      options: ['catches either type and binds the error object to e', 'only catches ValueError', 'is a syntax error', 'ignores errors'],
      correctAnswer: 'catches either type and binds the error object to e',
    },
    {
      text: 'General handlers should be listed…',
      options: ['last, after specific ones', 'first', 'anywhere', 'never used'],
      correctAnswer: 'last, after specific ones',
    },
  ],
  'Raising Exceptions & Creating Your Own': [
    {
      text: 'To make a function refuse invalid input, you…',
      options: ['raise an exception', 'print a warning', 'return None silently', 'ignore it'],
      correctAnswer: 'raise an exception',
    },
    {
      text: '`raise ValueError("negative")` is used when…',
      options: ['an argument value is invalid', 'the file is missing', 'a key is absent', 'anything fails'],
      correctAnswer: 'an argument value is invalid',
    },
    {
      text: 'A custom exception is created by…',
      options: ['subclassing Exception: class MyError(Exception): pass', 'raising a string', 'defining a function', 'importing it'],
      correctAnswer: 'subclassing Exception: class MyError(Exception): pass',
    },
    {
      text: 'Bare `raise` inside an except block…',
      options: ['re-raises the current exception, preserving the traceback', 'creates a new error', 'ignores the error', 'stops the program'],
      correctAnswer: 're-raises the current exception, preserving the traceback',
    },
  ],
  'Robust Input Parsing & Error Strategy': [
    {
      text: 'The robust way to read an integer from the user is…',
      options: ['loop-until-valid with try/except around int(input())', 'int(input()) with no handling', 'input(int())', 'parse(input())'],
      correctAnswer: 'loop-until-valid with try/except around int(input())',
    },
    {
      text: 'EAFP means…',
      options: ['try the operation and catch failure', 'check everything before acting', 'always return early', 'never use exceptions'],
      correctAnswer: 'try the operation and catch failure',
    },
    {
      text: 'LBYL ("look before you leap") is worse than EAFP because…',
      options: ['the state can change between the check and the action (a race)', 'it is longer', 'it is slower', 'it errors always'],
      correctAnswer: 'the state can change between the check and the action (a race)',
    },
    {
      text: 'At the top level of an app, you should…',
      options: ['catch broadly, log, and show a friendly message', 'let every error crash', 'never catch', 'print tracebacks to users'],
      correctAnswer: 'catch broadly, log, and show a friendly message',
    },
  ],

  // ───────────────────────────── W12 ─────────────────────────────
  'Classes, Objects & __init__': [
    {
      text: 'A class is…',
      options: ['a blueprint; an object is an instance built from it', 'the same as an object', 'a function', 'a module'],
      correctAnswer: 'a blueprint; an object is an instance built from it',
    },
    {
      text: '`__init__` runs…',
      options: ['automatically when an object is created', 'only when called manually', 'on import', 'never'],
      correctAnswer: 'automatically when an object is created',
    },
    {
      text: '`self` refers to…',
      options: ['the current instance', 'the class itself', 'the parent', 'a global'],
      correctAnswer: 'the current instance',
    },
    {
      text: '`Student("Avi", 21)` — the arguments map to…',
      options: ['__init__ parameters (minus self)', 'the class name', 'the methods', 'nothing'],
      correctAnswer: '__init__ parameters (minus self)',
    },
  ],
  'Attributes, Methods & @property': [
    {
      text: 'An instance attribute is…',
      options: ['per-object data like self.name', 'shared by all objects', 'a module', 'a function'],
      correctAnswer: 'per-object data like self.name',
    },
    {
      text: 'A class attribute…',
      options: ['is shared by all instances', 'exists per instance', 'can\'t be read', 'is private'],
      correctAnswer: 'is shared by all instances',
    },
    {
      text: '`@property` exposes a method as…',
      options: ['an attribute (no call parentheses)', 'a private name', 'a class', 'an import'],
      correctAnswer: 'an attribute (no call parentheses)',
    },
    {
      text: 'The property setter is used to…',
      options: ['validate values at assignment', 'delete the attribute', 'speed up code', 'create methods'],
      correctAnswer: 'validate values at assignment',
    },
  ],
  'Inheritance & Method Overriding': [
    {
      text: '`class Dog(Animal):` creates…',
      options: ['a subclass that inherits Animal\'s behaviour', 'an unrelated class', 'a copy', 'an error'],
      correctAnswer: 'a subclass that inherits Animal\'s behaviour',
    },
    {
      text: 'Method overriding means…',
      options: ['a subclass redefines a method with its own version', 'deleting a method', 'calling it twice', 'renaming it'],
      correctAnswer: 'a subclass redefines a method with its own version',
    },
    {
      text: '`super().__init__(...)` in a child…',
      options: ['runs the parent constructor first', 'creates a new parent', 'is optional always', 'errors'],
      correctAnswer: 'runs the parent constructor first',
    },
    {
      text: '`isinstance(d, Animal)` returns True when…',
      options: ['d is an Animal or subclass instance', 'd is None', 'd is a module', 'always'],
      correctAnswer: 'd is an Animal or subclass instance',
    },
  ],
  'Encapsulation & OOP Design Principles': [
    {
      text: 'The underscore convention `_name` signals…',
      options: ['"internal by convention — treat as private"', 'a property', 'a class attribute', 'a keyword'],
      correctAnswer: '"internal by convention — treat as private"',
    },
    {
      text: 'Single Responsibility means…',
      options: ['one class, one job', 'one class per file always', 'no classes', 'many jobs per class'],
      correctAnswer: 'one class, one job',
    },
    {
      text: 'For "has-a" relationships (a Car HAS an Engine), prefer…',
      options: ['composition', 'deep inheritance', 'global state', 'copy-paste'],
      correctAnswer: 'composition',
    },
    {
      text: 'The four pillars of OOP are…',
      options: ['encapsulation, abstraction, inheritance, polymorphism', 'loops, ifs, functions, classes', 'inputs, outputs, memory, speed', 'none of these'],
      correctAnswer: 'encapsulation, abstraction, inheritance, polymorphism',
    },
  ],

  // ───────────────────────────── W13 ─────────────────────────────
  'Modules & the import Statement': [
    {
      text: '`import utils` lets you call functions as…',
      options: ['utils.function_name()', 'function_name() directly', 'import.utils()', 'utils:function()'],
      correctAnswer: 'utils.function_name()',
    },
    {
      text: '`from utils import add_tax`…',
      options: ['brings add_tax into the current namespace', 'renames the module', 'deletes utils', 'copies the file'],
      correctAnswer: 'brings add_tax into the current namespace',
    },
    {
      text: '`import pandas as pd` creates…',
      options: ['an alias (pd) for the module', 'a new module', 'an error', 'a function'],
      correctAnswer: 'an alias (pd) for the module',
    },
    {
      text: 'The guard that lets a file run as a script OR import cleanly is…',
      options: ['if __name__ == "__main__":', 'if main():', 'def main() only', 'import guard()'],
      correctAnswer: 'if __name__ == "__main__":',
    },
  ],
  'Packages & the Standard Library': [
    {
      text: 'The file that marks a folder as a Python package is…',
      options: ['__init__.py', 'package.json', 'main.py', 'setup.py'],
      correctAnswer: '__init__.py',
    },
    {
      text: 'The stdlib module for reading/writing JSON is…',
      options: ['json', 'pandas', 'requests', 'csv only'],
      correctAnswer: 'json',
    },
    {
      text: '`from pkg.sub.mod import Name` — the dots represent…',
      options: ['nesting levels in the package', 'versions', 'file types', 'nothing'],
      correctAnswer: 'nesting levels in the package',
    },
    {
      text: 'Before pip-installing a library you should…',
      options: ['check whether the standard library already covers it', 'install anyway', 'never use stdlib', 'write your own'],
      correctAnswer: 'check whether the standard library already covers it',
    },
  ],
  'pip: Installing Third-Party Packages': [
    {
      text: '`pip install requests`…',
      options: ['installs the latest requests from PyPI', 'uninstalls it', 'lists packages', 'creates a venv'],
      correctAnswer: 'installs the latest requests from PyPI',
    },
    {
      text: 'The dependency list file is…',
      options: ['requirements.txt', 'package.json', 'config.ini', 'deps.py'],
      correctAnswer: 'requirements.txt',
    },
    {
      text: 'A virtual environment is created with…',
      options: ['python -m venv venv', 'pip new env', 'virtual(env)', 'conda init'],
      correctAnswer: 'python -m venv venv',
    },
    {
      text: 'Pinning exact versions in requirements.txt ensures…',
      options: ['identical packages across environments', 'faster installs', 'fewer files', 'nothing'],
      correctAnswer: 'identical packages across environments',
    },
  ],
  'Decorators: @staticmethod, @classmethod & Custom': [
    {
      text: '`@decorator` above a function…',
      options: ['wraps it to add behaviour', 'deletes it', 'renames it', 'imports it'],
      correctAnswer: 'wraps it to add behaviour',
    },
    {
      text: 'A decorator that times functions needs…',
      options: ['a wrapper function using *args/**kwargs', 'a loop', 'a class', 'global state'],
      correctAnswer: 'a wrapper function using *args/**kwargs',
    },
    {
      text: '`@staticmethod` creates a method that…',
      options: ['needs neither self nor cls — a plain function in the class', 'always needs self', 'is a property', 'runs on import'],
      correctAnswer: 'needs neither self nor cls — a plain function in the class',
    },
    {
      text: '`@classmethod` receives…',
      options: ['the class (cls) instead of an instance', 'an instance', 'nothing', 'a module'],
      correctAnswer: 'the class (cls) instead of an instance',
    },
  ],

  // ───────────────────────────── W14 ─────────────────────────────
  'What is Pandas & the DataFrame': [
    {
      text: 'The pandas one-liner to load a CSV is…',
      options: ['pd.read_csv("f.csv")', 'open("f.csv")', 'csv.load("f.csv")', 'pd.open("f.csv")'],
      correctAnswer: 'pd.read_csv("f.csv")',
    },
    {
      text: 'A DataFrame is…',
      options: ['a labelled 2D table of rows and columns', 'a single column', 'a JSON string', 'a function'],
      correctAnswer: 'a labelled 2D table of rows and columns',
    },
    {
      text: 'A Series is…',
      options: ['one labelled column of data', 'the whole table', 'a CSV file', 'a chart'],
      correctAnswer: 'one labelled column of data',
    },
    {
      text: '`df["score"]` returns…',
      options: ['a Series (one column)', 'a DataFrame', 'a list', 'an int'],
      correctAnswer: 'a Series (one column)',
    },
  ],
  'Inspecting Data: head, info & describe': [
    {
      text: '`df.head()` shows…',
      options: ['the first 5 rows', 'the last 5 rows', 'summary stats', 'column names'],
      correctAnswer: 'the first 5 rows',
    },
    {
      text: '`df.info()` reveals…',
      options: ['columns, types, and non-null counts', 'a scatter plot', 'sorted data', 'nothing'],
      correctAnswer: 'columns, types, and non-null counts',
    },
    {
      text: '`df.describe()` computes…',
      options: ['count, mean, std, min, quartiles, max', 'a bar chart', 'missing values only', 'row order'],
      correctAnswer: 'count, mean, std, min, quartiles, max',
    },
    {
      text: 'To count missing values per column you use…',
      options: ['df.isnull().sum()', 'df.head()', 'df.sort_values()', 'df.fillna(0)'],
      correctAnswer: 'df.isnull().sum()',
    },
  ],
  'Selecting, Filtering & Sorting': [
    {
      text: '`df[["name", "score"]]` returns…',
      options: ['a DataFrame with those two columns', 'a Series', 'a list', 'an error'],
      correctAnswer: 'a DataFrame with those two columns',
    },
    {
      text: '`df[df["score"] > 80]`…',
      options: ['keeps rows where score > 80', 'sorts by score', 'drops the column', 'errors'],
      correctAnswer: 'keeps rows where score > 80',
    },
    {
      text: 'Combining conditions with AND uses…',
      options: ['& (each condition in parentheses)', 'and', '&&', '|'],
      correctAnswer: '& (each condition in parentheses)',
    },
    {
      text: '`df.sort_values("score", ascending=False)`…',
      options: ['sorts rows by score, highest first', 'sorts columns', 'filters', 'errors'],
      correctAnswer: 'sorts rows by score, highest first',
    },
  ],
  'Grouping & Aggregating with groupby': [
    {
      text: '`df.groupby("city")["amount"].sum()`…',
      options: ['sums amount per city group', 'sorts cities', 'counts rows', 'merges cities'],
      correctAnswer: 'sums amount per city group',
    },
    {
      text: '`.agg(["sum", "mean"])` computes…',
      options: ['multiple aggregates at once', 'a single value', 'a chart', 'an error'],
      correctAnswer: 'multiple aggregates at once',
    },
    {
      text: '`pd.pivot_table(..., index="region", columns="product", aggfunc="sum")` makes…',
      options: ['a 2D summary table', 'a line chart', 'a new column', 'a dict'],
      correctAnswer: 'a 2D summary table',
    },
    {
      text: 'After groupby, the result is…',
      options: ['a DataFrame indexed by the group keys', 'a tuple', 'a string', 'a set'],
      correctAnswer: 'a DataFrame indexed by the group keys',
    },
  ],

  // ───────────────────────────── W15 ─────────────────────────────
  'Plotting Basics: plt.plot & plt.show': [
    {
      text: '`plt.plot(x, y)` draws…',
      options: ['a line connecting the points', 'a bar chart', 'a histogram', 'a pie chart'],
      correctAnswer: 'a line connecting the points',
    },
    {
      text: 'To display the plot you call…',
      options: ['plt.show()', 'plt.print()', 'plt.render()', 'plt.export()'],
      correctAnswer: 'plt.show()',
    },
    {
      text: '`plt.savefig("p.png")` must run…',
      options: ['before plt.show()', 'after plt.show()', 'twice', 'in another file'],
      correctAnswer: 'before plt.show()',
    },
    {
      text: '`plt.xlabel("X")` labels…',
      options: ['the x-axis', 'the title', 'the legend', 'the data'],
      correctAnswer: 'the x-axis',
    },
  ],
  'Bar Charts & Histograms': [
    {
      text: '`plt.bar(cities, values)` is for…',
      options: ['comparing values across categories', 'distribution of one column', 'relationships', 'time series'],
      correctAnswer: 'comparing values across categories',
    },
    {
      text: 'A histogram shows…',
      options: ['the distribution of a numeric column', 'category totals', 'a single point', 'text'],
      correctAnswer: 'the distribution of a numeric column',
    },
    {
      text: 'The `bins` argument in `plt.hist(data, bins=15)` controls…',
      options: ['the number of buckets/ranges', 'the bar width only', 'the colors', 'the font'],
      correctAnswer: 'the number of buckets/ranges',
    },
    {
      text: 'The pandas shortcut for a bar chart is…',
      options: ['df.plot(kind="bar")', 'df.bar()', 'plt.bar(df)', 'df.plt()'],
      correctAnswer: 'df.plot(kind="bar")',
    },
  ],
  'Scatter Plots & Correlations': [
    {
      text: 'To compare TWO numeric columns visually, the right chart is…',
      options: ['plt.scatter(x, y)', 'plt.bar(cat, val)', 'plt.hist(values)', 'plt.pie(data)'],
      correctAnswer: 'plt.scatter(x, y)',
    },
    {
      text: '`df.corr()` returns…',
      options: ['correlation coefficients from -1 to +1', 'a scatter plot', 'missing counts', 'a sorted list'],
      correctAnswer: 'correlation coefficients from -1 to +1',
    },
    {
      text: 'An upward trend in a scatter plot suggests…',
      options: ['a positive relationship', 'a negative relationship', 'no relationship', 'broken data'],
      correctAnswer: 'a positive relationship',
    },
    {
      text: '`alpha=0.5` in scatter helps with…',
      options: ['overlapping points (overplotting)', 'bigger dots', 'colors', 'titles'],
      correctAnswer: 'overlapping points (overplotting)',
    },
  ],
  'Subplots & Figure Customization': [
    {
      text: '`plt.subplots(1, 2)` creates…',
      options: ['one figure with two side-by-side axes', 'two separate windows', 'a 2x2 grid', 'an error'],
      correctAnswer: 'one figure with two side-by-side axes',
    },
    {
      text: 'With subplots, you plot on a specific chart using…',
      options: ['axes[0].plot(...)', 'plt.plot(...) always', 'fig.plot(...)', 'subplot.plot()'],
      correctAnswer: 'axes[0].plot(...)',
    },
    {
      text: '`figsize=(10, 4)` controls…',
      options: ['the figure dimensions in inches', 'the line width', 'the font size', 'the colors'],
      correctAnswer: 'the figure dimensions in inches',
    },
    {
      text: '`plt.style.use("seaborn-v0_8")`…',
      options: ['applies a professional style to following charts', 'deletes the plot', 'installs a package', 'errors'],
      correctAnswer: 'applies a professional style to following charts',
    },
  ],

  // ───────────────────────────── W16 ─────────────────────────────
  'pathlib: Modern Path Handling': [
    {
      text: '`Path("a/b.txt").name` is…',
      options: ['b.txt', 'a', '.txt', 'a/b'],
      correctAnswer: 'b.txt',
    },
    {
      text: '`Path("a/b.txt").suffix` is…',
      options: ['.txt', 'b', 'a', 'b.txt'],
      correctAnswer: '.txt',
    },
    {
      text: 'Path parts are joined with…',
      options: ['the / operator', 'the + operator', 'commas', 'a dot'],
      correctAnswer: 'the / operator',
    },
    {
      text: '`Path(".").rglob("*.py")`…',
      options: ['finds .py files in all subfolders recursively', 'finds only this folder', 'errors', 'creates files'],
      correctAnswer: 'finds .py files in all subfolders recursively',
    },
  ],
  'os Module & Environment Variables': [
    {
      text: '`os.getenv("KEY", "default")` returns…',
      options: ['the env value or default if unset', 'always default', 'None always', 'an error'],
      correctAnswer: 'the env value or default if unset',
    },
    {
      text: '`os.makedirs("a/b", exist_ok=True)`…',
      options: ['creates folders without error if they already exist', 'errors if they exist', 'only makes one level', 'deletes folders'],
      correctAnswer: 'creates folders without error if they already exist',
    },
    {
      text: '`subprocess.run([...])`…',
      options: ['runs an external program and can capture its output', 'only opens files', 'is a comment', 'imports modules'],
      correctAnswer: 'runs an external program and can capture its output',
    },
    {
      text: '`sys.argv[1]` gives…',
      options: ['the first command-line argument after the script name', 'the script name', 'the last argument', 'an env var'],
      correctAnswer: 'the first command-line argument after the script name',
    },
  ],
  'CSV, JSON & Structured Files': [
    {
      text: '`json.dumps(obj)` converts…',
      options: ['a Python object into a JSON string', 'JSON into Python', 'a file into a list', 'a string into an int'],
      correctAnswer: 'a Python object into a JSON string',
    },
    {
      text: '`json.dump(obj, f, indent=2)`…',
      options: ['writes obj as pretty-printed JSON to the file', 'reads the file', 'converts to CSV', 'errors'],
      correctAnswer: 'writes obj as pretty-printed JSON to the file',
    },
    {
      text: 'Which csv object WRITES a row at a time?',
      options: ['csv.writer', 'csv.DictReader', 'csv.load', 'csv.import'],
      correctAnswer: 'csv.writer',
    },
    {
      text: 'The difference between `json.load` and `json.loads` is…',
      options: ['load reads from a file; loads parses a string', 'loads is faster', 'they are identical', 'loads reads a file'],
      correctAnswer: 'load reads from a file; loads parses a string',
    },
  ],
  'Building a File-Organizer Automation Script': [
    {
      text: '`Path.iterdir()`…',
      options: ['lists the entries in a directory (one level)', 'recurses everything', 'creates a folder', 'deletes files'],
      correctAnswer: 'lists the entries in a directory (one level)',
    },
    {
      text: '`shutil.move(src, dst)`…',
      options: ['moves a file or folder', 'copies only files', 'deletes a file', 'reads a file'],
      correctAnswer: 'moves a file or folder',
    },
    {
      text: 'The safest habit when building automation is…',
      options: ['a dry-run: print instead of act, then test on a copy', 'delete immediately', 'skip validation', 'no guards'],
      correctAnswer: 'a dry-run: print instead of act, then test on a copy',
    },
    {
      text: 'A destructive automation action should be guarded by…',
      options: ['checking conditions (e.g. skip hidden files) before acting', 'no checks', 'randomness', 'a longer sleep'],
      correctAnswer: 'checking conditions (e.g. skip hidden files) before acting',
    },
  ],

  // ───────────────────────────── W17 ─────────────────────────────
  'How the Web Works: HTTP for Scrapers': [
    {
      text: 'An HTTP status of 200 means…',
      options: ['OK — the request succeeded', 'not found', 'forbidden', 'server error'],
      correctAnswer: 'OK — the request succeeded',
    },
    {
      text: 'Status 403 means…',
      options: ['forbidden — access refused', 'success', 'redirect', 'rate limited'],
      correctAnswer: 'forbidden — access refused',
    },
    {
      text: 'Status 429 means…',
      options: ['too many requests — slow down', 'not found', 'success', 'moved'],
      correctAnswer: 'too many requests — slow down',
    },
    {
      text: '`requests.get(url, params=...)`…',
      options: ['adds query parameters to the request', 'sends a POST body', 'is an error', 'only works in browsers'],
      correctAnswer: 'adds query parameters to the request',
    },
  ],
  'Parsing HTML with BeautifulSoup': [
    {
      text: '`soup.find("h1").text` returns…',
      options: ['the text inside the first h1', 'the whole page', 'a list of h1s', 'the h1 tag name'],
      correctAnswer: 'the text inside the first h1',
    },
    {
      text: '`soup.select("div.price")`…',
      options: ['finds all divs with class "price"', 'finds the first price', 'errors', 'finds nothing'],
      correctAnswer: 'finds all divs with class "price"',
    },
    {
      text: 'To read an attribute like href you use…',
      options: ['element["href"]', 'element.text', 'element.href()', 'element.attr'],
      correctAnswer: 'element["href"]',
    },
    {
      text: '`soup.select_one("h2")`…',
      options: ['returns the first matching element only', 'returns all matches', 'returns text only', 'errors'],
      correctAnswer: 'returns the first matching element only',
    },
  ],
  'A Complete Scrape: Price Monitor': [
    {
      text: 'The correct scraper skeleton is…',
      options: ['fetch → parse → clean → handle → be polite', 'parse → fetch → delete', 'clean → fetch', 'print → fetch'],
      correctAnswer: 'fetch → parse → clean → handle → be polite',
    },
    {
      text: '`r.raise_for_status()`…',
      options: ['raises an exception for 4xx/5xx responses', 'always raises', 'never raises', 'returns JSON'],
      correctAnswer: 'raises an exception for 4xx/5xx responses',
    },
    {
      text: '"Rs 1,299".replace(",", "") then int() is an example of…',
      options: ['cleaning scraped text into a number', 'parsing HTML', 'rate limiting', 'a request'],
      correctAnswer: 'cleaning scraped text into a number',
    },
    {
      text: '`time.sleep(2)` between requests is for…',
      options: ['politeness — not hammering the server', 'making the script slower', 'parsing', 'avoiding errors'],
      correctAnswer: 'politeness — not hammering the server',
    },
  ],
  'APIs & Responsible Scraping': [
    {
      text: 'The FIRST choice for getting data from a site is…',
      options: ['its official API', 'scraping its HTML', 'guessing URLs', 'asking a friend'],
      correctAnswer: 'its official API',
    },
    {
      text: '`r.json()` on a requests response…',
      options: ['parses the JSON body into Python objects', 'returns raw HTML', 'errors always', 'returns a string'],
      correctAnswer: 'parses the JSON body into Python objects',
    },
    {
      text: 'Before scraping a site you should check…',
      options: ['robots.txt and the terms of service', 'the server IP', 'the RAM', 'nothing'],
      correctAnswer: 'robots.txt and the terms of service',
    },
    {
      text: 'Bypassing login walls or CAPTCHAs when scraping is…',
      options: ['off-limits — it evades the site\'s protections', 'fine if quick', 'required', 'good practice'],
      correctAnswer: 'off-limits — it evades the site\'s protections',
    },
  ],

  // ───────────────────────────── W18 ─────────────────────────────
  'From Idea to Requirements': [
    {
      text: 'A requirement states…',
      options: ['precisely what the software must do', 'a vague wish', 'a code file', 'a budget'],
      correctAnswer: 'precisely what the software must do',
    },
    {
      text: 'Which is a valid user story?',
      options: ['"As a student, I want a weekly total, so I can budget"', '"The code must be fast"', '"Fix the bugs"', '"Version 2.0"'],
      correctAnswer: '"As a student, I want a weekly total, so I can budget"',
    },
    {
      text: 'MoSCoW prioritizes items as…',
      options: ['Must, Should, Could, Won\'t', 'First, Second, Third', 'High, Medium, Low only', 'A, B, C'],
      correctAnswer: 'Must, Should, Could, Won\'t',
    },
    {
      text: 'The "definition of done"…',
      options: ['tells you exactly when the project is finished', 'is optional', 'is a code comment', 'means the deadline'],
      correctAnswer: 'tells you exactly when the project is finished',
    },
  ],
  'Designing the Structure: Functions & Modules': [
    {
      text: 'In the expenses design, which module is responsible for reading the CSV?',
      options: ['loader', 'analysis', 'report', 'cli'],
      correctAnswer: 'loader',
    },
    {
      text: 'The analysis module should…',
      options: ['do pure computation with no printing or file I/O', 'print everything', 'read the network', 'do UI'],
      correctAnswer: 'do pure computation with no printing or file I/O',
    },
    {
      text: 'A function signature like `total_by_category(rows: list[dict]) -> dict[str, float]`…',
      options: ['documents the contract via types', 'is a comment', 'runs faster', 'is required'],
      correctAnswer: 'documents the contract via types',
    },
    {
      text: 'Designing before coding…',
      options: ['turns "where do I start?" into a task list', 'wastes time', 'is impossible', 'replaces testing'],
      correctAnswer: 'turns "where do I start?" into a task list',
    },
  ],
  'Task Breakdown & Estimation': [
    {
      text: 'Tasks should be…',
      options: ['small, with a concrete "done" check each', 'as big as possible', 'unverifiable', 'random'],
      correctAnswer: 'small, with a concrete "done" check each',
    },
    {
      text: 'Beginner estimates are typically…',
      options: ['2× too small', 'accurate', '2× too big', 'irrelevant'],
      correctAnswer: '2× too small',
    },
    {
      text: 'Dependent tasks should be…',
      options: ['ordered so earlier tasks come first', 'done in reverse', 'combined always', 'skipped'],
      correctAnswer: 'ordered so earlier tasks come first',
    },
    {
      text: 'The planning-to-code ratio for a one-day project is…',
      options: ['roughly 30-60 minutes of planning', 'hours of planning', 'no planning', 'planning after coding'],
      correctAnswer: 'roughly 30-60 minutes of planning',
    },
  ],
  'Designing for Testability': [
    {
      text: 'Which of these is a PURE function?',
      options: ['def add(a, b): return a + b', 'def show(): print("hi")', 'def read(): return open("f").read()', 'def pick(): return random.random()'],
      correctAnswer: 'def add(a, b): return a + b',
    },
    {
      text: 'Injecting dependencies means…',
      options: ['passing resources in as parameters', 'using globals', 'hardcoding paths', 'never testing'],
      correctAnswer: 'passing resources in as parameters',
    },
    {
      text: 'Deterministic inputs help tests because…',
      options: ['results are reproducible and reliable', 'they are faster', 'they are random', 'they avoid files'],
      correctAnswer: 'results are reproducible and reliable',
    },
    {
      text: 'A testable-by-design core means…',
      options: ['tests are fast, reliable, and name the failing function', 'testing is impossible', 'no tests needed', 'slower tests'],
      correctAnswer: 'tests are fast, reliable, and name the failing function',
    },
  ],

  // ───────────────────────────── W19 ─────────────────────────────
  'argparse: Professional CLI Arguments': [
    {
      text: '`add_argument("--csv", required=True)`…',
      options: ['makes the tool error early without the flag', 'is optional', 'creates a boolean', 'is for subcommands'],
      correctAnswer: 'makes the tool error early without the flag',
    },
    {
      text: '`type=float` in add_argument…',
      options: ['converts and validates the argument as a float', 'forces integers', 'is ignored', 'errors'],
      correctAnswer: 'converts and validates the argument as a float',
    },
    {
      text: '`action="store_true"`…',
      options: ['makes a boolean flag: True if present', 'stores a string', 'errors', 'requires a value'],
      correctAnswer: 'makes a boolean flag: True if present',
    },
    {
      text: 'argparse\'s `--help` is…',
      options: ['generated automatically from your arguments', 'hand-written only', 'disabled', 'a plugin'],
      correctAnswer: 'generated automatically from your arguments',
    },
  ],
  'Orchestrating the Pipeline (Main Flow)': [
    {
      text: 'In a CLI, `main()` should…',
      options: ['orchestrate: load → analyze → report, with no error clutter', 'do everything inline', 'only print', 'never call modules'],
      correctAnswer: 'orchestrate: load → analyze → report, with no error clutter',
    },
    {
      text: 'The single error boundary that catches and translates failures is…',
      options: ['run()', 'each module', 'argparse', 'the OS'],
      correctAnswer: 'run()',
    },
    {
      text: 'Errors printed to `sys.stderr` with `sys.exit(1)`…',
      options: ['let callers distinguish success (0) from failure (non-zero)', 'hide the error', 'are slower', 'are required for help'],
      correctAnswer: 'let callers distinguish success (0) from failure (non-zero)',
    },
    {
      text: 'The `if __name__ == "__main__":` guard keeps the CLI…',
      options: ['importable and testable', 'unrunnable', 'faster', 'private'],
      correctAnswer: 'importable and testable',
    },
  ],
  'Error Handling & User-Friendly Messages': [
    {
      text: 'A good error message…',
      options: ['says what happened AND how to fix it', 'is a raw traceback', 'is the word "error"', 'is empty'],
      correctAnswer: 'says what happened AND how to fix it',
    },
    {
      text: 'Errors should be written…',
      options: ['to stderr', 'to stdout', 'to a file silently', 'nowhere'],
      correctAnswer: 'to stderr',
    },
    {
      text: 'A tool returning exit code 0 on failure is…',
      options: ['the worst bug — everything downstream trusts it', 'fine', 'faster', 'good practice'],
      correctAnswer: 'the worst bug — everything downstream trusts it',
    },
    {
      text: 'Validating early with row numbers means…',
      options: ['errors say which row is bad', 'errors are vague', 'no validation', 'slower code'],
      correctAnswer: 'errors say which row is bad',
    },
  ],
  'Testing the Tool: Sample Data & Edge Cases': [
    {
      text: 'After the happy path, you should test…',
      options: ['edge cases: empty, missing, malformed, duplicates', 'nothing', 'only the GUI', 'only the title'],
      correctAnswer: 'edge cases: empty, missing, malformed, duplicates',
    },
    {
      text: 'A missing file should…',
      options: ['print a friendly error and exit non-zero', 'crash with a traceback', 'silently continue', 'create the file'],
      correctAnswer: 'print a friendly error and exit non-zero',
    },
    {
      text: 'Testing argparse\'s `--budget abc` confirms…',
      options: ['type errors are handled cleanly', 'the budget is a string', 'no errors', 'nothing'],
      correctAnswer: 'type errors are handled cleanly',
    },
    {
      text: 'After manual tests pass, the next step is…',
      options: ['automating them with pytest so they never regress', 'deleting the tests', 'committing untested code', 'stopping'],
      correctAnswer: 'automating them with pytest so they never regress',
    },
  ],

  // ───────────────────────────── W20 ─────────────────────────────
  'Unit Testing with pytest': [
    {
      text: 'pytest discovers tests because files/functions are named…',
      options: ['test_*.py / test_*()', 'check_*()', 'run_*()', 'any name'],
      correctAnswer: 'test_*.py / test_*()',
    },
    {
      text: '`assert total_by_category(rows) == expected`…',
      options: ['passes if the values match, fails otherwise', 'always passes', 'is ignored', 'is a comment'],
      correctAnswer: 'passes if the values match, fails otherwise',
    },
    {
      text: '`@pytest.mark.parametrize("x", [1, 2, 3])`…',
      options: ['runs one test function with several inputs', 'skips tests', 'only runs once', 'is a comment'],
      correctAnswer: 'runs one test function with several inputs',
    },
    {
      text: 'The red-green loop means…',
      options: ['write a failing test, then fix code until it passes', 'only green tests', 'never fail', 'delete tests'],
      correctAnswer: 'write a failing test, then fix code until it passes',
    },
  ],
  'Type Hints & Quality Tooling': [
    {
      text: 'Which annotation says a function returns a list of strings?',
      options: ['def f() -> list[str]:', 'def f() -> str:', 'def f():', 'list f()'],
      correctAnswer: 'def f() -> list[str]:',
    },
    {
      text: '`mypy` is…',
      options: ['a static type checker', 'a formatter', 'a test runner', 'a linter only'],
      correctAnswer: 'a static type checker',
    },
    {
      text: '`black`…',
      options: ['reformats code to a canonical style', 'catches type errors', 'runs tests', 'installs packages'],
      correctAnswer: 'reformats code to a canonical style',
    },
    {
      text: 'Docstrings (`"""..."""`) are used to…',
      options: ['document functions and classes for tools and IDEs', 'make code faster', 'hide code', 'import modules'],
      correctAnswer: 'document functions and classes for tools and IDEs',
    },
  ],
  'Packaging: From Script to Installable Tool': [
    {
      text: 'The file that defines a modern package is…',
      options: ['pyproject.toml', 'setup.py only', 'package.json', 'requirements.txt'],
      correctAnswer: 'pyproject.toml',
    },
    {
      text: 'The `[project.scripts]` section…',
      options: ['maps a command name to a function to expose', 'lists dependencies', 'sets the version', 'is a comment'],
      correctAnswer: 'maps a command name to a function to expose',
    },
    {
      text: '`pip install -e .`…',
      options: ['installs in editable mode so edits apply immediately', 'installs read-only', 'only checks syntax', 'uninstalls'],
      correctAnswer: 'installs in editable mode so edits apply immediately',
    },
    {
      text: 'A proper package repo should also have…',
      options: ['a README, a .gitignore, a LICENSE, and a version', 'only code', 'no docs', 'only tests'],
      correctAnswer: 'a README, a .gitignore, a LICENSE, and a version',
    },
  ],
  'Full Course Review & Next Steps': [
    {
      text: 'The course\'s learning arc was…',
      options: ['syntax → tools → data & automation → real projects', 'projects → syntax', 'only syntax', 'only data'],
      correctAnswer: 'syntax → tools → data & automation → real projects',
    },
    {
      text: 'A natural next step from here is…',
      options: ['Flask/FastAPI web backends', 'only Excel', 'only game mods', 'nothing'],
      correctAnswer: 'Flask/FastAPI web backends',
    },
    {
      text: 'The habit that turns a course into a career skill is…',
      options: ['keeping tooling on (lint/type/test) and building small projects', 'memorizing syntax', 'copy-pasting', 'skipping tests'],
      correctAnswer: 'keeping tooling on (lint/type/test) and building small projects',
    },
    {
      text: 'Python rewards…',
      options: ['readable, simple code over clever code', 'the cleverest one-liner always', 'longest code', 'fewest functions'],
      correctAnswer: 'readable, simple code over clever code',
    },
  ],
};
