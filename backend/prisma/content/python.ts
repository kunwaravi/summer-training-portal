// ============================================================================
// Python Programming & Scripting — Deep GfG-Style Curriculum (issue #97)
// ----------------------------------------------------------------------------
// 20 sections, each with 4 deep teaching topics (~250-300 words, original),
// a working Python example, a real-world note, and 8 distinct chapter quizzes
// (4 options, exactly 1 correct). Plus a 15-question final exam.
//
// Per-topic quizzes live in python_topic_quizzes.ts (keyed by EXACT topic
// title) and satisfy the frontend topic-lock flow.
// ============================================================================

export interface PythonTopic {
  title: string;
  text: string;
  code: string;
  note: string;
}

export interface PythonQuiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface PythonSection {
  week: number;
  title: string;
  description: string;
  topics: PythonTopic[];
  quizzes: PythonQuiz[];
}

export interface PythonFinalExamQuestion {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const pythonSections: PythonSection[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 1 — Introduction to Python & Philosophy
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 1,
    title: 'Introduction to Python & Philosophy',
    description:
      'Why Python won the scripting world, how its interpreter runs code, the philosophy that shapes the language, and where it is actually used.',
    topics: [
      {
        title: 'Why Python: Readable, Fast to Build & Everywhere',
        text:
          'Python is one of the most widely used programming languages because it optimizes for **human time** over machine time. Code reads almost like English, so you write it faster, read it faster, and — crucially — the next person (or you, six months later) understands it faster.\n\nThree properties explain its dominance:\n\n- **Readability** — indentation is structure. There are no braces to match and no semicolons to forget, so programs have a consistent, clean shape.\n- **Productivity** — the standard library ships with file handling, networking, JSON, and more, and the package ecosystem (Pandas, Requests, Django) means you rarely start from zero.\n- **Portability** — one Python file runs on Windows, macOS, and Linux unchanged (as long as you manage dependencies).\n\nPython is **interpreted and dynamically typed**: you write and run scripts immediately with no separate compile step, and variables do not need declared types. That makes it ideal for experiments, glue code, automation, data work, and teaching.\n\nThe trade-off is performance — a tight numeric loop in Python is slower than the same loop in C. Real-world projects solve this by keeping Python as the readable outer layer and pushing heavy compute into compiled extensions (NumPy, C extensions). "Do the simple thing in Python" is the philosophy that powers whole industries.',
        code: '# Python reads like instructions in plain English.\nname = "Avi"\nage = 21\nprint("Hello, " + name + " — you are", age, "years old.")',
        note: 'Optimize for human time. Python\'s readability is a feature — you spend most of a project\'s life reading code, not writing it.',
      },
      {
        title: 'Interpreted Execution: The REPL & .py Files',
        text:
          'Python is **interpreted**, meaning a program called the *interpreter* reads your source and runs it directly — there is no separate compilation step producing a binary. This changes the workflow in two important ways.\n\nFirst, you get a **REPL** (Read-Evaluate-Print Loop). Type `python3` in a terminal and you land in an interactive session where every line is evaluated immediately:\n\n```\n>>> 2 + 3\n5\n>>> print("hi")\nhi\n```\n\nThe REPL is the fastest way to test a one-line idea. Second, real programs live in **`.py` files** — plain text files with `python3 program.py` running the whole file top-to-bottom.\n\nTwo details to internalise early:\n\n- The **entry point**: code at the top level of a `.py` file runs when the file executes. Later you will protect reusable code with `if __name__ == "__main__":` so importing the file does not run it (Section 13).\n- **Errors are raised at runtime**, not compile time. A typo in a variable name only fails when that line executes — the interpreter does not check ahead. This is why testing matters (Section 20).\n\nSome common phrases: "run the script" means execute the `.py` file; "enter the REPL" means start an interactive session; "script" usually means a small program written to automate something. Understanding the interpreter\'s model — line-by-line, dynamic, immediate — explains most beginner "why did this fail?" surprises.',
        code: '# Run with: python3 hello.py\nprint("Starting the script...")  # runs immediately\n\n# This line is only reached when the program gets here.\nprint("End of the file.")',
        note: 'The REPL is your scratchpad: one-liner experiments go there. Production code goes in .py files you run with python3.',
      },
      {
        title: 'The Zen of Python & "Batteries Included"',
        text:
          'Python has an explicit philosophy, literally written into the language. Open a REPL and type `import this` — you will see "The Zen of Python", a set of aphorisms by Tim Peters that guide how Python code is written. The most quoted lines:\n\n- **"Beautiful is better than ugly."** — code is read far more than written; spend effort on clarity.\n- **"Explicit is better than implicit."** — say what you mean; magic behaviour is a smell.\n- **"Simple is better than complex."** — the smallest design that works usually wins.\n- **"There should be one obvious way to do it."** — a direct jab at Perl\'s "there is more than one way to do it".\n- **"Readability counts."** — indentation is not decoration; it is the language\'s core promise.\n\nThe companion philosophy is **"batteries included"**: the standard library is enormous. Need JSON? `import json`. CSV? `import csv`. Dates, math, hashing, HTTP clients, email, unit testing — all built in. You reach for third-party packages only when the standard library genuinely does not cover the task.\n\nWhy this matters in practice: when you read other people\'s Python (and you will read a lot), knowing the style rules — 4-space indentation, `snake_case` names, meaningful names over cleverness — lets you parse intent instantly. PEP 8 (the style guide) and the Zen together are the "house rules" every Python codebase follows, and interviewers routinely probe whether you know them.',
        code: 'import this  # prints The Zen of Python in the REPL\n\n# Practical expression of the philosophy:\ndef compute_average(numbers):\n    """Return the mean of a list of numbers."""\n    if not numbers:\n        return 0\n    return sum(numbers) / len(numbers)',
        note: '"Batteries included" means the standard library already covers most everyday tasks — check it before installing a package.',
      },
      {
        title: 'Python in the Real World: Web, Data & Automation',
        text:
          'Python is called a "general-purpose" language, but three domains dominate real-world usage:\n\n**1. Web development** — Django and Flask power everything from startups to large services. Django gives structure (ORM, admin, auth) out of the box; Flask is a micro-framework for small, flexible services. Both are Python because the language makes rapid iteration cheap.\n\n**2. Data science & analytics** — the data stack (NumPy, Pandas, Matplotlib, scikit-learn) is almost entirely Python. Analysts and engineers share one language from raw CSV to trained model, which is why Python replaced R as the default entry point.\n\n**3. Automation & scripting** — the original use case. Renaming hundreds of files, scraping a site, watching a directory and processing new uploads, talking to APIs — a 20-line Python script replaces hours of manual work.\n\nPython also leads **AI/ML** (PyTorch, TensorFlow), and appears in **DevOps** (Ansible, tooling), **testing** (pytest), and **education**. When a job says "Python", it almost always means one of these stacks plus solid fundamentals.\n\nFor a learner, the practical takeaway: Python is the language where a working prototype and a production service often look similar. The fundamentals you build in this course — types, control flow, functions, data structures, files, OOP, modules — are the exact skills every one of those domains builds on. There is no "web Python" or "data Python"; there is Python, plus libraries.',
        code: '# The same Python you learn powers many fields.\n# Here: a tiny automation that reads a file of emails and counts domains.\nfrom collections import Counter\n\ndef count_domains(path):\n    domains = Counter()\n    with open(path) as f:\n        for line in f:\n            line = line.strip()\n            if "@" in line:\n                domains[line.split("@")[1]] += 1\n    return domains\n\nprint(count_domains("emails.txt") if False else "Run against a real file!")',
        note: 'Web, data, automation, and AI all sit on the same fundamentals — master the core language and every Python stack opens up.',
      },
    ],
    quizzes: [
      {
        text: 'Which property is Python most famous for?',
        options: ['Compiles to the fastest binaries', 'Readability — code reads almost like English', 'Requires manual memory management', 'Runs only on Linux'],
        correctAnswer: 'Readability — code reads almost like English',
      },
      {
        text: 'What does "interpreted" mean for Python?',
        options: ['Code must be compiled to a binary first', 'An interpreter reads and runs source directly, line by line', 'Code runs only in a browser', 'Errors are caught before any line runs'],
        correctAnswer: 'An interpreter reads and runs source directly, line by line',
      },
      {
        text: 'The REPL is…',
        options: ['a packaging tool', 'an interactive session that evaluates each line immediately', 'a debugger for C', 'a type checker'],
        correctAnswer: 'an interactive session that evaluates each line immediately',
      },
      {
        text: 'Type `import this` in Python to see…',
        options: ['a list of keywords', 'The Zen of Python philosophy', 'the version number', 'the standard library index'],
        correctAnswer: 'The Zen of Python philosophy',
      },
      {
        text: '"Batteries included" means…',
        options: ['Python is battery powered', 'the standard library covers many everyday tasks', 'you must install every tool yourself', 'Python has no standard library'],
        correctAnswer: 'the standard library covers many everyday tasks',
      },
      {
        text: 'Which of these is NOT a dominant real-world Python domain?',
        options: ['Web development', 'Data science & analytics', 'Kernel development in C', 'Automation & scripting'],
        correctAnswer: 'Kernel development in C',
      },
      {
        text: 'Python variables do not need declared types because Python is…',
        options: ['dynamically typed', 'strongly compiled', 'memory-managed by the OS', 'assembly-based'],
        correctAnswer: 'dynamically typed',
      },
      {
        text: 'A runtime error in Python appears when…',
        options: ['the file is saved', 'the faulty line actually executes', 'the program compiles', 'you import the module'],
        correctAnswer: 'the faulty line actually executes',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 2 — Installing Python, IDEs & First Script
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 2,
    title: 'Installing Python, IDEs & First Script',
    description:
      'Getting a working Python environment, picking the right editor, writing your first program, and learning to read the error messages you will live with.',
    topics: [
      {
        title: 'Installing Python & Checking Your Setup',
        text:
          'Before writing any Python you need a working interpreter. Installation differs by OS, but the goal is identical: a `python3` command on your terminal.\n\n- **Windows** — download the installer from python.org. On the first screen, tick **"Add Python to PATH"** — this is the step most people miss, and without it the `python` command does nothing in the terminal. Windows users often type `python` while Linux/macOS users type `python3`; the difference is historical (some systems still ship `python` as version 2).\n- **macOS** — a system Python often exists but is old. Install the current version from python.org or via Homebrew (`brew install python@3`), which keeps it separate from the OS copy.\n- **Linux** — most distributions ship Python, but check the version (`python3 --version`). Use the package manager (`apt install python3`) if missing.\n\n**Verify everything** with three commands:\n\n```\npython3 --version      # which version is active?\nwhich python3          # where does it live? (Windows: where python3)\npython3 -c "print(\'setup works\')"\n```\n\nA common trap: multiple Pythons on one machine (system, Homebrew, Anaconda). The `which`/`where` command tells you exactly which one your shell resolves. When things behave oddly later ("I installed a package but Python cannot find it"), the first question is always: *which Python am I running?* Get that right now and you will save hours of confusion.',
        code: '# Verify your install from the terminal:\n#   python3 --version\n#   which python3\n\n# The tiny program to confirm everything works:\nprint("Hello from Python!")',
        note: 'Always confirm WHICH python your shell runs (which python3). "I installed a package but can\'t import it" is almost always two different Pythons.',
      },
      {
        title: 'Choosing an Editor or IDE (VS Code, PyCharm, Jupyter)',
        text:
          'You do not need a heavyweight IDE to learn Python — you need three things: **syntax highlighting**, **a way to run the file**, and **an integrated terminal**. Pick based on your goal:\n\n- **VS Code** — the best default for most learners. Free, fast, and with the official Python extension you get highlighting, run-on-click, debugging, and inline errors. It is also the tool you will use later for web projects, so the skills transfer.\n- **PyCharm** — a dedicated Python IDE. The Community edition is free and gives best-in-class Python support (refactoring, tests, virtualenv management) but is heavier and more opinionated.\n- **Jupyter notebooks** — cells of code with output below them. Perfect for data exploration and analysis (Section 14), where you experiment iteratively. Not ideal for writing production scripts or applications.\n\nWhatever you choose, learn these three editor skills early:\n\n1. **Run a file with one shortcut** (F5 / the play button) — not by retyping everything in the REPL.\n2. **Read the Problems / diagnostics panel** — the editor will underline errors before you even run.\n3. **Use the integrated terminal** — you need `pip`, `python3`, and git in the same window.\n\nThe editor is a tool, not the point. Do not spend a week "setting up the perfect environment" — install VS Code plus the Python extension and start writing. You can always switch later; the Python itself is identical everywhere.',
        code: '# Whichever editor you choose, this is what you run:\n#   1. Write code in a file (hello.py)\n#   2. Press the run button / F5\n#   3. Read the output in the terminal\nprint("Writing Python in any good editor feels the same.")',
        note: 'VS Code + the official Python extension is the lowest-friction start. Jupyter for data exploration, PyCharm if you want a full IDE.',
      },
      {
        title: 'Your First Script: print() and Comments',
        text:
          'Every Python program you write will call `print()` to send output to the console. Its most useful forms:\n\n```python\nprint("Hello")                    # a string\nprint(42)                         # a number\nprint("Total:", 5 + 3)            # several values, space-separated\nprint("a", "b", sep=", ")         # custom separator\nprint("no newline", end="")       # suppress the newline\n```\n\n`print()` is the window into your program — you will use it constantly to see what your code is doing, both as a beginner and as a professional debugging.\n\n**Comments** are text the interpreter ignores, written with `#`:\n\n```python\n# This line is documentation, not code.\ntotal = 5 + 3   # inline comments explain a single line\n```\n\nUse comments to explain **why**, not **what** — `total = 5 + 3` is self-explanatory, but `# limit to 3 retries because the API rate-limits us` is valuable. Over-commenting the obvious is a beginner habit to unlearn.\n\n**Docstrings** are a special kind of comment for functions and modules — triple-quoted strings right after the definition that describe its purpose (Section 7). Tools and editors display them as you type.\n\nGood first-script habits: name the file with lowercase letters and underscores (`first_script.py`, not `First Script.py`), run it, and expect to see your output appear in the terminal. If nothing prints, the file did not run — check the command and the working directory.',
        code: 'print("Hello, Python!")          # strings\nprint(7 * 6)                      # 42\nprint("Score:", 95, "/ 100")      # several values\nprint("a", "b", sep=" - ")        # a - b\n\n# A comment: explain WHY, not what.\n# e.g. # sleeping because the free API allows 1 request per second',
        note: 'print() is your debugging window — you will use it forever. Comments explain why; the code already says what.',
      },
      {
        title: 'Errors, Tracebacks & the Debugging Mindset',
        text:
          'Your code will error constantly — that is normal and expected. The skill is **reading the traceback**. Here is a typical one:\n\n```\nTraceback (most recent call last):\n  File "hello.py", line 3, in <module>\n    print(unknown_variable)\nNameError: name \'unknown_variable\' is not defined\n```\n\nRead from the **bottom up** — the last line is the actual error type and message. Above it, the traceback shows the call stack: which file, which line, and what was being executed when it broke.\n\nCommon early errors and their meanings:\n\n- **`NameError`** — you used a name that does not exist. Check spelling and whether you defined the variable before use.\n- **`IndentationError`** — inconsistent spaces/tabs. Python is whitespace-sensitive; mix them and it refuses to run.\n- **`SyntaxError`** — the parser could not understand a line (missing `:`, unclosed quote).\n- **`TypeError`** — you combined incompatible types (e.g. `"5" + 3`).\n- **`ValueError`** — the type is right but the value is invalid (`int("abc")`).\n\nThe **debugging mindset** is a loop: reproduce the error, read the full message, form one hypothesis about the cause, test it, repeat. Do not guess-and-retry blindly. When stuck, use the most powerful tool available — `print()` before and after the suspect line to see the state. Professional debugging is mostly careful reading plus targeted `print()` calls; you are already doing the real thing on day one.',
        code: '# A deliberate error — read the traceback bottom-up:\nmessage = "Hello"\nprint(message)      # works\nprint(msage)        # NameError: name "msage" is not defined\n\n# The fix: print() the state around the problem.\nvalue = input("Type a number: ")\nprint("You gave me:", repr(value))   # repr shows exactly what you typed',
        note: 'Read tracebacks bottom-up: the last line names the error and message; the lines above show where the program was.',
      },
    ],
    quizzes: [
      {
        text: 'Why does the Windows installer page ask you to tick "Add Python to PATH"?',
        options: ['It speeds up the download', 'Without it the python command is not available in the terminal', 'It installs the IDE', 'It is required for internet access'],
        correctAnswer: 'Without it the python command is not available in the terminal',
      },
      {
        text: 'The command to check which Python interpreter your shell resolves is…',
        options: ['print(python)', 'which python3 (or where python3)', 'python --list', 'list python'],
        correctAnswer: 'which python3 (or where python3)',
      },
      {
        text: 'Which editor choice is the best default for a beginner learning Python?',
        options: ['VS Code with the Python extension', 'A plain text editor with no highlighting', 'A spreadsheet program', 'A C compiler'],
        correctAnswer: 'VS Code with the Python extension',
      },
      {
        text: '`print("a", "b", sep=" - ")` outputs…',
        options: ['a - b', 'ab', 'a b', 'a\nb'],
        correctAnswer: 'a - b',
      },
      {
        text: 'Comments in Python start with…',
        options: ['//', '#', '<!--', '/*'],
        correctAnswer: '#',
      },
      {
        text: 'Good comments explain…',
        options: ['what every line does', 'why — the reasoning behind a choice', 'the entire file repeatedly', 'nothing ever'],
        correctAnswer: 'why — the reasoning behind a choice',
      },
      {
        text: 'Reading a traceback, the most important line is…',
        options: ['the first line', 'the last line — the error type and message', 'the middle lines', 'the filename'],
        correctAnswer: 'the last line — the error type and message',
      },
      {
        text: '`NameError: name \'x\' is not defined` most likely means…',
        options: ['Python is broken', 'you used a name before defining it, or misspelled it', 'the file is too large', 'you need to compile first'],
        correctAnswer: 'you used a name before defining it, or misspelled it',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 3 — Variables & Basic Types
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 3,
    title: 'Variables & Basic Types',
    description:
      'How Python stores data — variables, dynamic typing, numbers, strings, booleans, and the special value None.',
    topics: [
      {
        title: 'Variables & Dynamic Typing',
        text:
          'A **variable** is a name that refers to a value. Assignment is a single equals sign:\n\n```python\nname = "Avi"\nage = 21\npi = 3.14\n```\n\nRead it right-to-left: "name now refers to the string Avi". The right side is evaluated first, then bound to the name on the left.\n\nPython is **dynamically typed** — a variable has no fixed type. The same name can hold a number, then a string, then a list:\n\n```python\nx = 5        # x is an int\nx = "five"   # now x is a str — perfectly legal\n```\n\nThis is flexible, but it is exactly why Python needs discipline: a variable can change meaning, so **meaningful names matter** more than in statically-typed languages. `total_price` beats `tp`; `user_email` beats `e`.\n\nNaming rules:\n\n- Names are **case-sensitive** (`age` ≠ `Age`).\n- Use letters, digits, and underscores; must not start with a digit.\n- Convention: **`snake_case`** for variables and functions (`first_name`, `total_price`).\n- Reserved words (keywords) cannot be names: `if`, `for`, `class`, `def`, `return`…\n\nThe **`type()`** function tells you a value\'s type at any moment: `type(5)` → `<class \'int\'>`. When you inherit code or debug an unexpected result, `type(x)` and `print(x)` are the first two tools to reach for — they answer "what is this thing and what does it hold?".',
        code: 'name = "Avi"        # str\nage = 21            # int\nheight = 5.9        # float\nis_student = True   # bool\n\nprint(type(name), type(age), type(height), type(is_student))\n\n# Dynamic typing: the same name can be rebound.\nresult = 10\nresult = "ten"\nprint(result, type(result))',
        note: 'Assignment is right-to-left: evaluate the right side, bind the name. Dynamic typing makes good names non-negotiable.',
      },
      {
        title: 'Numbers: int, float & Their Quirks',
        text:
          'Python has three numeric types you will use constantly:\n\n- **`int`** — whole numbers, with **arbitrary precision**. Unlike many languages, Python ints never overflow; `2 ** 1000` works fine.\n- **`float`** — numbers with a decimal point, stored as binary IEEE-754 doubles. This is the source of the famous quirk:\n\n```python\nprint(0.1 + 0.2)   # 0.30000000000000004 — not 0.3!\n```\n\n0.1 cannot be represented exactly in binary, so arithmetic on floats accumulates tiny errors. For money or any calculation needing exactness, use the **`decimal`** module (`Decimal("0.1") + Decimal("0.2")` → exactly `0.3`).\n- **`complex`** — `3 + 4j`, for engineering and scientific work. You will rarely need it outside those fields.\n\nOperations behave differently by type:\n\n```python\n5 / 2      # 2.5   — division ALWAYS returns a float\n5 // 2     # 2     — floor division (integer quotient)\n5 % 2      # 1     — modulo (remainder)\n5 ** 2     # 25    — exponent\n```\n\nNote the classic trap: **`/` always produces a float**, even when the result is whole. Use `//` when you want an integer quotient.\n\n**Converting** between types: `int("42")`, `float("3.5")`, `str(100)`. Converting a string like `int("4.2")` raises `ValueError` because it is not a whole number.',
        code: 'print(2 ** 1000)             # big ints just work\nprint(5 / 2)                # 2.5 — division is float\nprint(5 // 2)               # 2\nprint(7 % 3)                # 1\nprint(0.1 + 0.2)            # 0.30000000000000004\n\nfrom decimal import Decimal\nprint(Decimal("0.1") + Decimal("0.2"))  # 0.3 exactly',
        note: 'Remember: / always gives a float, // floors, % is remainder. And never compare floats for exact equality in money code.',
      },
      {
        title: 'Strings & f-Strings',
        text:
          'A **string** (`str`) is a sequence of characters. Python writes them with single or double quotes — `"hello"` and `\'hello\'` are identical. Use one style consistently (PEP 8 suggests single quotes) and switch to the other when your text contains that quote: `"It\'s done"` or `\'He said "hi"\'`.\n\nThree essential string ideas:\n\n**1. Escape sequences** — `\\n` (newline), `\\t` (tab), `\\\\` (backslash).\n\n**2. Concatenation & repetition** — `"a" + "b"` → `"ab"`, `"ab" * 3` → `"ababab"`. Concatenating a string and a number fails (`TypeError`), so you convert: `"Total: " + str(42)`.\n\n**3. f-strings** — the modern, preferred way to build strings with values:\n\n```python\nname = "Avi"\nscore = 95\nprint(f"Hello {name}, your score is {score}!")   # Hello Avi, your score is 95!\nprint(f"Average: {score / 100:.2%}")             # format specifiers\n```\n\nThe `f` prefix lets you insert expressions inside `{}` directly, and even apply **format specifiers**: `{value:.2f}` rounds to 2 decimals, `{value:>10}` pads to 10 columns. f-strings are faster and clearer than old-style `%` formatting or `.format()` — use them as your default.\n\nStrings are **immutable** — you cannot change a character in place. Methods like `.upper()`, `.lower()`, `.strip()`, `.replace()` return *new* strings; the original is untouched. This surprises beginners, so internalise it early.',
        code: 'name = "Avi"\ncity = "Pune"\n\n# f-strings — the default choice\nprint(f"{name} lives in {city}.")\n\nprice = 49.995\nprint(f"Price: {price:.2f}")      # Price: 50.00\n\n# immutability — methods return NEW strings\ns = "  Hello  "\nprint(s.strip())    # "Hello" — new string\nprint(s)            # "  Hello  " — original unchanged',
        note: 'f-strings (f"{var}") are the idiomatic way to interpolate values. Strings are immutable — methods return new strings.',
      },
      {
        title: 'Booleans & None',
        text:
          '**Booleans** — `True` and `False` — are the only two values of the `bool` type. They are produced by comparisons and used to drive decisions:\n\n```python\nage = 18\nprint(age >= 18)     # True\nprint(age == 21)     # False\n```\n\nThings to know:\n\n- Capital letters matter: it is `True`/`False`, not `true`/`false`.\n- `bool` is a subclass of `int`: `True == 1` and `False == 0` are `True`. This is why `sum([True, False, True])` returns `2` — a neat trick for counting.\n- `not`, `and`, `or` combine booleans (Section 4).\n- **Truthiness**: in `if` statements, values *act* as booleans even if they are not `bool`. `0`, `""`, `[]`, `{}`, `None` are all **falsy**; everything else is **truthy**. This is central to Python style — you will write `if user:` not `if user is not None:`.\n\n**`None`** is Python\'s "no value" — the equivalent of null in other languages. It is its own type (`NoneType`) and there is exactly one instance of it. Use it to mean "nothing here yet":\n\n```python\nresult = None          # will be filled in later\n...\nresult = compute()\n```\n\nCompare against it with `is` (identity), not `==`: `if result is None:`. When a function has no `return` statement, it implicitly returns `None` — a huge source of bugs when people expect a value back.',
        code: 'print(True, False)              # Python booleans\nprint(age := 18, age >= 18)      # True\n\n# Truthiness in action\nname = ""\nif name:\n    print("has a name")\nelse:\n    print("empty name is falsy")   # this runs\n\n# None: "no value" sentinel\nresult = None\nprint(result is None)            # True — use is, not ==',
        note: '0, "", [], {}, None are falsy; everything else is truthy. A function with no return returns None — check with `is None`.',
      },
    ],
    quizzes: [
      {
        text: 'Which is a valid Python variable name?',
        options: ['first-name', '1st_name', 'first_name', 'class'],
        correctAnswer: 'first_name',
      },
      {
        text: 'Python is dynamically typed, which means…',
        options: ['a variable can only hold one type forever', 'the same name can be rebound to different types', 'types must be declared everywhere', 'there are no types'],
        correctAnswer: 'the same name can be rebound to different types',
      },
      {
        text: '`print(0.1 + 0.2)` prints…',
        options: ['0.3', '0.30000000000000004 — binary float rounding', '1', 'an error'],
        correctAnswer: '0.30000000000000004 — binary float rounding',
      },
      {
        text: '`5 / 2` returns…',
        options: ['2', '2.5 — division always returns a float', 'an error', '1'],
        correctAnswer: '2.5 — division always returns a float',
      },
      {
        text: 'The best way to build the string "Hi Avi, score 95" is…',
        options: ['f"Hi {name}, score {score}"', '"Hi" + name', '"Hi %s"', 'print concatenation only'],
        correctAnswer: 'f"Hi {name}, score {score}"',
      },
      {
        text: 'Strings are immutable, which means…',
        options: ['you cannot store them in variables', '.strip() returns a new string; the original is unchanged', 'they cannot be printed', 'they use no memory'],
        correctAnswer: '.strip() returns a new string; the original is unchanged',
      },
      {
        text: 'Which of these values is FALSY in Python?',
        options: ['1', 'True', '"" (empty string)', '"0"'],
        correctAnswer: '"" (empty string)',
      },
      {
        text: 'Which of these values is falsy?',
        options: ['0', '42', 'True', '"hello"'],
        correctAnswer: '0',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 4 — Operators & Expressions
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 4,
    title: 'Operators & Expressions',
    description:
      'The arithmetic, comparison, and logical operators that turn values into new values, plus type conversion and precedence.',
    topics: [
      {
        title: 'Arithmetic, Floor Division & Modulo',
        text:
          'Python\'s arithmetic operators should feel familiar, with three that deserve attention:\n\n```python\n+   -   *   /     # add, subtract, multiply, divide\n//              # floor division — integer quotient\n%               # modulo — remainder\n**              # exponent (power)\n```\n\n**Floor division `//`** rounds DOWN to the nearest integer: `7 // 2` is `3`, but `-7 // 2` is `-4` (it floors toward negative infinity, not toward zero — a common gotcha when mixing signs).\n\n**Modulo `%`** gives the remainder: `7 % 3` is `1`. It is surprisingly useful:\n\n- **Even/odd check**: `n % 2 == 0` means even.\n- **Wrapping**: `(index + 1) % len(items)` cycles through a list.\n- **Extracting digits**: `1234 % 10` gives the last digit `4`; `1234 // 10` drops it.\n- **Time conversion**: seconds → minutes with `//` and `%`.\n\n**Augmented assignment** combines an operator with assignment: `total += 5` means `total = total + 5`. Python has `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=`. There is no `++`/`--` like C — use `n += 1`.\n\nArithmetic **mixes types** sensibly: `int + float` → `float`. But `int / int` → `float` always (Section 3).\n\nA mental model that pays off: `a // b` answers "how many full groups of b fit in a?", and `a % b` answers "what is left over?" Together they solve almost every grouping, pagination, and digit-extraction problem.',
        code: 'print(7 // 2)       # 3 — floor division\nprint(-7 // 2)      # -4 — floors, does NOT round toward zero\nprint(7 % 3)        # 1 — remainder\n\n# Real uses\nn = 17\nprint(n % 2 == 0)           # False → odd\nseconds = 3661\nprint(seconds // 60, seconds % 60)  # 61 minutes, 1 second left\n\ncount = 0\ncount += 1                   # augmented assignment\nprint(count)                 # 1',
        note: '// and % are a pair: `a // b` groups, `a % b` is leftovers. Together they solve pagination, cycles, and digit work.',
      },
      {
        title: 'Comparison & Logical Operators',
        text:
          'Comparisons produce booleans and are the raw material of every decision:\n\n```python\n==   !=    # equal / not equal\n<    <=    # less / less-or-equal\n>    >=    # greater / greater-or-equal\n```\n\nTwo Python-specific notes:\n\n- **`==` compares values**, `is` compares identity (same object). For integers and strings `==` is what you want 99% of the time. Use `is` for `None` (`x is None`) — never `== None`. The classic trap: `x == True` is not the same as `x is True`.\n- **Chained comparisons** are allowed and read naturally: `if 18 <= age < 60:` checks both bounds at once — in many languages you would need `age >= 18 and age < 60`.\n\n**Logical operators** combine booleans:\n\n- **`and`** — true only if both sides are true.\n- **`or`** — true if either side is true.\n- **`not`** — flips a boolean.\n\nThey also **return a value**, not just a boolean: `a and b` returns `a` if `a` is falsy, else `b`; `a or b` returns `a` if `a` is truthy, else `b`. This makes `or` a compact default: `name = user_input or "Guest"`. It is elegant, but use it with care — the same behaviour can be unclear to readers.\n\n**Short-circuit evaluation** is important and powerful: Python evaluates `and`/`or` left-to-right and **stops as soon as the result is known**. `user and user.admin` never even looks at `user.admin` when `user` is falsy — which is why `if user and user.admin:` is safe even when `user` could be `None`.',
        code: 'age = 25\nprint(18 <= age < 60)    # True — chained comparison\n\nuser = None\nprint(user and user.admin)   # None — short-circuits, no error\n\nname = ""\nprint(name or "Guest")       # "Guest" — or as a default\n\nprint(not True)              # False',
        note: 'Chained comparisons (`18 <= age < 60`) are idiomatic. Short-circuiting (`user and user.admin`) prevents errors and is everywhere.',
      },
      {
        title: 'Type Conversion & Input Parsing',
        text:
          '`input()` returns a **string**, always — even if the user types a number. Converting it is the first thing you will do with it:\n\n```python\nraw = input("Enter your age: ")    # "21" — a string\nage = int(raw)                      # 21 — an int\n```\n\nExplicit conversion functions to know:\n\n- `int(value)` — whole number from a string or float. `int("42")` → `42`. Fails with `ValueError` on `int("4.2")` or `int("abc")`.\n- `float(value)` — decimal number. `float("3.14")` → `3.14`.\n- `str(value)` — anything to string. `str(42)` → `"42"`.\n- `bool(value)` — follows truthiness rules (Section 3).\n\n**Converting can lose information**: `int(3.9)` truncates toward zero → `3` (it does not round). For rounding, use `round(3.9)` → `4` or `round(2.5)` → `2` (banker\'s rounding — 2.5 goes to the nearest even).\n\n**Parsing input robustly** is a skill. The naïve `int(input(...))` crashes the moment someone types "abc". The resilient pattern wraps the conversion in a loop that keeps asking until it succeeds:\n\n```python\nwhile True:\n    raw = input("Enter a whole number: ")\n    try:\n        value = int(raw)\n        break\n    except ValueError:\n        print("That is not a whole number. Try again.")\n```\n\nThis `try/except` pattern (fully covered in Section 11) is how real programs survive bad user input — and it appears in every CLI tool you will build.',
        code: 'age = int(input("Enter your age: "))    # converts string → int\nprint("Next year you will be", age + 1)\n\nprint(int("42"), float("3.14"), str(100))\nprint(int(3.9))     # 3 — truncates toward zero, does NOT round\nprint(round(3.9))   # 4\n\n# Robust input: keep asking until valid\nwhile True:\n    raw = input("Enter a whole number: ")\n    try:\n        value = int(raw)\n        print("Got", value)\n        break\n    except ValueError:\n        print("Not a whole number — try again.")',
        note: 'input() always returns a string. Convert explicitly, and wrap conversions in try/except so bad input asks again instead of crashing.',
      },
      {
        title: 'Expression Evaluation & Operator Precedence',
        text:
          'When Python evaluates an expression, it follows **operator precedence** — the same idea as arithmetic order of operations in math:\n\n```python\nprint(2 + 3 * 4)     # 14 — * binds tighter than +\nprint((2 + 3) * 4)   # 20 — parentheses override\n```\n\nFrom tightest to loosest (the ones you will actually use):\n\n1. `**` (exponent) — note it is **right-associative**: `2 ** 3 ** 2` is `2 ** (3 ** 2)` = `512`.\n2. `* / // %`\n3. `+ -`\n4. Comparison: `< <= > >= == !=`\n5. `not`\n6. `and`\n7. `or`\n\nSo `a or b and c` means `a or (b and c)` because `and` binds tighter than `or`. This surprises people constantly — the safe habit is **parenthesize when in doubt**: `(a or b) and c` says exactly what you mean, and the reader does not have to remember the table.\n\n**Associativity** matters for `**` (right) and for `//`/`%` (left): `5 - 3 - 1` evaluates left-to-right → `(5 - 3) - 1` = `1`.\n\nA real-world consequence: mixing `and`/`or` without parentheses is the #1 source of subtle logic bugs. Every linter (Section 20) will warn on `a and b or c` because it reads ambiguously. Write the parentheses, and if the expression gets long, compute pieces into named variables first:\n\n```python\nis_adult = age >= 18\nhas_permission = user and user.role == "admin"\nif is_adult and has_permission: ...\n```\n\nClear steps beat a clever one-liner every time.',
        code: 'print(2 + 3 * 4)       # 14\nprint((2 + 3) * 4)     # 20\nprint(2 ** 3 ** 2)     # 512 — ** is right-associative\n\n# and binds tighter than or\nprint(True or False and False)   # True == True or (False and False)\n\n# Parentheses say what you mean:\nallowed = (age >= 18) and (user is not None)\nprint(allowed)',
        note: '** and/or precedence trips everyone. When mixing and/or, parenthesize — clarity beats memorising the precedence table.',
      },
    ],
    quizzes: [
      {
        text: '`-7 // 2` evaluates to…',
        options: ['-3', '-4 — floor division floors toward negative infinity', '-3.5', 'an error'],
        correctAnswer: '-4 — floor division floors toward negative infinity',
      },
      {
        text: '`1234 % 10` gives…',
        options: ['123', '4 — the last digit', '123.4', '0'],
        correctAnswer: '4 — the last digit',
      },
      {
        text: 'What does `count += 1` do?',
        options: ['Nothing — Python has no +=', 'count = count + 1', 'count becomes 1', 'adds 1 to every variable'],
        correctAnswer: 'count = count + 1',
      },
      {
        text: 'The correct way to test "age is between 18 and 60 inclusive of 18" is…',
        options: ['18 <= age < 60', 'age >= 18 and age < 60 (chained is fine too)', 'age > 18 and age <= 60', 'age between 18 60'],
        correctAnswer: 'age >= 18 and age < 60 (chained is fine too)',
      },
      {
        text: '`None and True` evaluates to…',
        options: ['False', 'None — and short-circuits on falsy left side', 'True', 'an error'],
        correctAnswer: 'None — and short-circuits on falsy left side',
      },
      {
        text: '`input()` always returns…',
        options: ['an int', 'a string', 'a float', 'whatever the user meant'],
        correctAnswer: 'a string',
      },
      {
        text: '`int(3.9)` produces…',
        options: ['4', '3 — truncation toward zero', '3.9', 'an error'],
        correctAnswer: '3 — truncation toward zero',
      },
      {
        text: '`2 + 3 * 4` evaluates to…',
        options: ['20', '14 — * binds tighter than +', '24', '9'],
        correctAnswer: '14 — * binds tighter than +',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 5 — Conditional Statements (if-elif-else)
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 5,
    title: 'Conditional Statements (if-elif-else)',
    description:
      'Making programs decide: if/elif/else chains, Python truthiness, nested conditions, and compact ternary expressions.',
    topics: [
      {
        title: 'if / elif / else Chains',
        text:
          'The `if` statement runs a block when a condition is truthy:\n\n```python\nscore = 85\n\nif score >= 90:\n    grade = "A"\nelif score >= 75:\n    grade = "B"\nelse:\n    grade = "C"\n```\n\nStructure rules that are *required*, not optional:\n\n- The condition ends with a **colon** `:`.\n- The block below is **indented** — consistently (4 spaces is the convention). Python uses indentation to define the block; there are no braces.\n- **`elif`** = "else if" — can appear many times.\n- **`else`** is optional and catches everything not matched.\n\nOrder matters enormously. Conditions are tested **top-to-bottom**, and the **first match wins** — later `elif` branches never run once one is True. So most-specific tests must come first:\n\n```python\nif score >= 90: ...     # check the highest bar FIRST\nelif score >= 75: ...   # then the next\n```\n\nSwap those two and every A-student would land in the B branch.\n\nA decision tree is a useful mental model: each `if`/`elif` is a branch point, and the first true branch is the path taken. The `else` is the default path for everything that matched nothing.\n\nStyle: keep each branch short and readable. If a branch is more than a few lines, extract it into a function (Section 7). And prefer `elif` over nested `else: if:` — it flattens logic and is the idiomatic Python shape.',
        code: 'def grade_for(score):\n    if score >= 90:\n        return "A"\n    elif score >= 75:\n        return "B"\n    elif score >= 60:\n        return "C"\n    else:\n        return "F"\n\nprint(grade_for(95))   # A\nprint(grade_for(70))   # C — order matters, 90 checked first',
        note: 'Conditions run top-to-bottom; first match wins. Put the most specific condition first, always.',
      },
      {
        title: 'Truthiness: What Counts as False',
        text:
          'Python does not require a condition to be a literal `True`/`False` — any value has an implicit **truthiness**, and `if` uses it directly. The complete list of **falsy** values:\n\n- `False`, `None`\n- `0`, `0.0`\n- empty containers: `""`, `[]`, `()`, `{}`, `set()`\n\n**Everything else is truthy** — including `"0"` (a string), `[0]` (a list with one element), and any non-empty object.\n\nThis powers the single most common Python idiom — **"check if a collection is empty"** without calling `len()`:\n\n```python\nresults = []\nif results:              # idiomatic: empty list is falsy\n    print(f"{len(results)} results found")\nelse:\n    print("No results")  # this runs\n\n# compare with the explicit version — same thing, more typing:\nif len(results) > 0:\n    ...\n```\n\nTruthiness also shows up in defaults and guards:\n\n```python\nname = user_input.strip()\nif name:                 # truthy if the user typed something\n    print(f"Hello {name}")\nelse:\n    print("Hello stranger")\n```\n\nTwo cautions:\n\n1. **`0` is falsy but `"0"` is truthy** — converting user input to a number and then testing `if number:` gives different results than you might expect. If "zero is a valid answer", test explicitly: `if number is not None:`.\n2. Avoid comparing to `== True` or `== False`. `if flag:` reads better and is exactly what truthiness is for. Testing against a boolean literal is a smell that usually signals a misunderstanding.',
        code: 'values = []\nif values:\n    print("has items")\nelse:\n    print("empty — falsy")      # this runs\n\nnum = 0\nif num:\n    print("truthy")\nelse:\n    print("0 is falsy")          # this runs\n\nif "0":\n    print("\"0\" is truthy — a non-empty string")  # this runs',
        note: 'Falsy = False, None, 0, and empty containers. `if collection:` is THE idiom for "is it empty?" — prefer it over len().',
      },
      {
        title: 'Nested Conditionals & Early Returns',
        text:
          'When one condition is only relevant inside another, you **nest** them:\n\n```python\nif user:\n    if user.is_admin:\n        print("Admin panel")\n    else:\n        print("Member area")\nelse:\n    print("Please log in")\n```\n\nNesting is sometimes the right shape, but **deep nesting is the enemy of readability** — three levels of `if` inside `if` inside `if` becomes a maze of indentation. Two techniques keep it flat:\n\n**1. Early returns (guard clauses)** — check the failure cases first and return immediately, so the "happy path" stays at the top level:\n\n```python\ndef process(user):\n    if not user:\n        return "please log in"      # guard\n    if not user.is_active:\n        return "account disabled"   # guard\n    # happy path — no indentation maze\n    return perform_work(user)\n```\n\nEach guard eliminates one level of nesting. A function of guards then a happy path reads top-to-bottom like a checklist.\n\n**2. Combine conditions with `and`/`or`** when the checks belong together:\n\n```python\nif user and user.is_admin:   # one level instead of two\n    ...\n```\n\nThis works because `and` short-circuits (Section 4) — `user.admin` is never touched when `user` is falsy, so no error.\n\nThe rule of thumb: if you ever see indentation going 4 or 5 levels deep, stop and refactor — extract the inner block to a function, or flip the logic into guards. Flat code is not just prettier; it is dramatically easier to test and debug.',
        code: 'def access_level(user):\n    if not user:\n        return "anonymous"\n    if not user.get("active"):\n        return "suspended"\n    if user.get("admin"):\n        return "admin"\n    return "member"\n\nprint(access_level(None))                      # anonymous\nprint(access_level({"active": True}))          # member\nprint(access_level({"active": True, "admin": True}))  # admin',
        note: 'Guard clauses (early returns) flatten logic: check failures first, happy path last. 3+ levels of nesting is a refactor signal.',
      },
      {
        title: 'Ternary Expressions & Simple Guards',
        text:
          'A **ternary expression** is a one-line if/else that *picks a value*:\n\n```python\nstatus = "pass" if score >= 50 else "fail"\n```\n\nRead it as: `value_if_true if condition else value_if_false`. The whole thing is an expression — you can assign it, return it, or use it in a larger expression:\n\n```python\ndef sign(n):\n    return "positive" if n > 0 else "negative or zero"\n\nprint("Adult" if age >= 18 else "Minor")\n```\n\nWhen to use it and when not to:\n\n- **Use** it when the entire point is choosing between two values. It replaces a three-line if/else with one clear line.\n- **Avoid** it when you need side effects (multiple statements per branch) or when nesting ternaries — `a if x else b if y else c` is a readability disaster. If you find yourself chaining ternaries, write a normal if/elif.\n- **Avoid** it for long strings or complex logic — readability beats compactness.\n\nThe **walrus operator** (`:=`) is a related modern tool: it assigns a value *and* tests it in one expression:\n\n```python\nif (n := len(items)) > 10:\n    print(f"Large list with {n} items")   # n is usable here\n```\n\nIt saves recomputing `len(items)`, but it is easy to overuse — reserve it for cases where avoiding the duplicate call genuinely clarifies the code.\n\nA simple **guard** with a ternary is a favourite pattern for clean defaults:\n\n```python\nmessage = "Welcome back!" if is_returning else "Welcome!"\n```\n\nIf the branches are long, fall back to a full if/else — the ternary\'s whole value is its brevity.',
        code: 'score = 72\nresult = "pass" if score >= 50 else "fail"\nprint(result)     # pass\n\n# ternary inside a string\nprint(f"Result: {\'high\' if score >= 90 else \'ok\'}")\n\n# walrus operator: assign and test in one line\nif (n := len("hello")) > 3:\n    print(f"length {n} > 3")    # n is in scope here',
        note: 'Ternary = one value, one line: `x if cond else y`. Chain them and you lose readability — use plain if/elif for multi-way choices.',
      },
    ],
    quizzes: [
      {
        text: 'The block under an `if` is defined by…',
        options: ['curly braces', 'indentation', 'a semicolon', 'the word then'],
        correctAnswer: 'indentation',
      },
      {
        text: 'In an if/elif chain, when multiple conditions are true, Python…',
        options: ['runs all of them', 'runs only the FIRST true branch', 'runs the last one', 'crashes'],
        correctAnswer: 'runs only the FIRST true branch',
      },
      {
        text: 'Which value is TRUTHY?',
        options: ['0', '"0" (the string)', '[]', 'None'],
        correctAnswer: '"0" (the string)',
      },
      {
        text: 'The idiomatic way to check if a list is empty is…',
        options: ['if list == 0', 'if my_list:', 'if len(my_list) == 0 (also works, but if my_list: is the idiom)', 'if my_list is None'],
        correctAnswer: 'if len(my_list) == 0 (also works, but if my_list: is the idiom)',
      },
      {
        text: 'An early return / guard clause is used to…',
        options: ['slow the program', 'check failure cases first and flatten nesting', 'replace all if statements', 'force a crash'],
        correctAnswer: 'check failure cases first and flatten nesting',
      },
      {
        text: '`"pass" if score >= 50 else "fail"` is called a…',
        options: ['lambda', 'ternary expression', 'list comprehension', 'decorator'],
        correctAnswer: 'ternary expression',
      },
      {
        text: 'The `:=` walrus operator…',
        options: ['compares two values', 'assigns a value and tests it in the same expression', 'is only for floats', 'deletes a variable'],
        correctAnswer: 'assigns a value and tests it in the same expression',
      },
      {
        text: 'Deeply nested ifs should be refactored using…',
        options: ['more nesting', 'early returns / guard clauses', 'the print function', 'global variables'],
        correctAnswer: 'early returns / guard clauses',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 6 — Loops (for, while) & Comprehensions
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 6,
    title: 'Loops (for, while) & Comprehensions',
    description:
      'Repeating work: the for loop over sequences, while for unknown repetition, break/continue, and the list comprehensions that replace loops.',
    topics: [
      {
        title: 'The for Loop & range()',
        text:
          'The `for` loop in Python iterates **over a sequence** — it is a "for each" loop, not a C-style counting loop:\n\n```python\nfor fruit in ["apple", "mango", "banana"]:\n    print(fruit)\n```\n\nYou never manage an index; Python hands you each item in turn. Anything iterable works: strings (character by character), lists, tuples, dictionaries (keys by default), sets, files (line by line).\n\nWhen you *do* need a count, use **`range()`**:\n\n```python\nfor i in range(5):          # 0,1,2,3,4\nfor i in range(2, 7):       # 2,3,4,5,6\nfor i in range(0, 10, 2):   # 0,2,4,6,8\n```\n\n`range(start, stop, step)` — note `stop` is exclusive. `range(5)` never yields `5`. This off-by-one is the most common beginner loop bug.\n\nLoop variable naming matters: use meaningful singular names (`for student in students:`, `for item in cart:`), not `i` for everything — reserve `i`/`j` for plain index loops over ranges.\n\nThe loop **body** is indented, same as `if`. Anything after the indented block runs once, after the loop finishes.\n\nPractical uses: building a list by appending, summing, searching, transforming — and almost all of those get shorter with comprehensions (topic 3 of this section) or the built-ins `sum`, `min`, `max`, `any`, `all`. Learning which tool replaces which loop is the difference between writing loops and writing Python.',
        code: 'fruits = ["apple", "mango", "banana"]\nfor fruit in fruits:\n    print(fruit.upper())\n\nfor i in range(3):          # 0, 1, 2\n    print("count", i)\n\nfor i in range(1, 10, 2):   # odd numbers 1..9\n    print(i, end=" ")\nprint()',
        note: 'for = "for each item". range() for counts, and remember stop is EXCLUSIVE: range(5) gives 0-4.',
      },
      {
        title: 'while Loops & Loop Control (break/continue)',
        text:
          'The `while` loop repeats **as long as a condition is truthy** — the right tool when you do not know the number of iterations in advance:\n\n```python\nguess = None\nwhile guess != 42:\n    guess = int(input("Guess the number: "))\n```\n\nThe condition is checked before each iteration. If it is false at the start, the body never runs at all.\n\n**Infinite loop danger**: if the condition never becomes false, the loop never ends. `while True:` is actually a deliberate pattern — combined with an explicit exit:\n\n```python\nwhile True:\n    line = input("> ")\n    if line == "quit":\n        break          # exit the loop entirely\n    print(line.upper())\n```\n\nTwo loop-control keywords:\n\n- **`break`** — exit the loop immediately.\n- **`continue`** — skip the rest of THIS iteration and move to the next.\n\n```python\nfor n in range(1, 11):\n    if n % 2 == 0:\n        continue       # skip even numbers\n    print(n)           # 1 3 5 7 9\n```\n\nA `break` inside nested loops only exits the **innermost** loop.\n\nThe classic `while` pattern that pays off forever is **retry-until-success**, often with a bounded number of attempts:\n\n```python\nattempts = 0\nwhile attempts < 3:\n    password = input("Password: ")\n    if password == "secret":\n        print("Welcome")\n        break\n    attempts += 1\nelse:\n    print("Too many attempts.")\n```\n\nPython\'s `while...else` runs the `else` block when the loop ends **without** a `break` — a neat way to answer "did we find what we were looking for?".',
        code: 'n = 0\nwhile n < 5:\n    n += 1\n    if n == 3:\n        continue      # skip 3\n    print(n)          # 1 2 4 5\n\n# while True + break is the standard "retry" pattern\nwhile True:\n    reply = input("Say quit to stop: ")\n    if reply.lower() == "quit":\n        print("bye")\n        break',
        note: 'while = unknown repetition. while True + break is the idiomatic retry pattern; while...else fires when no break happened.',
      },
      {
        title: 'List Comprehensions',
        text:
          'A **list comprehension** builds a new list from a sequence in one readable line — Python\'s replacement for the "create an empty list, loop, append" pattern:\n\n```python\nsquares = [n * n for n in range(10)]     # [0, 1, 4, 9, ... 81]\n\nuppers = [word.upper() for word in words]\n\nodds = [n for n in range(20) if n % 2 == 1]\n```\n\nThe shape is: `[expression for item in iterable if condition]` — read it left-to-right as a sentence: "give me `expression` for each `item` in `iterable` if the `condition` holds".\n\nThe **if** is optional. Both parts can be powerful:\n\n```python\nprices = [299, 499, 199, 899]\nhot = [p for p in prices if p > 300]       # filter\nwith_tax = [round(p * 1.18, 2) for p in prices]   # transform\n```\n\n**When to use vs avoid:**\n\n- **Use** when you are transforming or filtering one sequence into a new list — it is the idiomatic, faster, and more readable choice.\n- **Avoid** when the body has side effects (like `print`) or needs several statements — use a normal `for` loop.\n- **Avoid nesting** comprehensions more than one level. `[[y for y in row] for row in grid]` (2D) is fine; beyond that it becomes unreadable — use loops.\n\nThere are also **dictionary comprehensions** and **set comprehensions** with the same shape:\n\n```python\naa = {k: v * 2 for k, v in {"a": 1, "b": 2}.items()}   # {\'a\': 2, \'b\': 4}\nunique = {len(w) for w in words}                       # a set of lengths\n```\n\nMastering comprehensions is one of the highest-leverage Python skills — experienced Pythonistas write them constantly, and reading them fluently is expected in any real codebase.',
        code: 'words = ["apple", "mango", "fig"]\nprint([w.upper() for w in words])          # transform\n\nprices = [299, 499, 199, 899]\nprint([p for p in prices if p > 300])      # filter\n\nprint([n * n for n in range(6)])           # [0, 1, 4, 9, 16, 25]\n\nscores = [85, 92, 78]\nprint(sum(scores) / len(scores))           # 85.0',
        note: '`[expr for item in iterable if cond]` replaces most "empty list + append + loop". One level of nesting max.',
      },
      {
        title: 'Looping with enumerate() & zip()',
        text:
          'Two functions turn painful loops into clean ones:\n\n**`enumerate()`** gives you the index *and* the item together:\n\n```python\nfruits = ["apple", "mango", "fig"]\nfor i, fruit in enumerate(fruits):\n    print(i, fruit)      # 0 apple / 1 mango / 2 fig\n```\n\nWithout it you would write `for i in range(len(fruits))` and index into the list — noisy and error-prone. You can start the numbering anywhere: `enumerate(fruits, start=1)` makes 1-based numbering trivial (great for displaying "1. First item" lists).\n\n**`zip()`** pairs up two or more sequences element by element:\n\n```python\nnames = ["Avi", "Riya", "Sam"]\nscores = [92, 88, 95]\nfor name, score in zip(names, scores):\n    print(name, score)     # Avi 92 / Riya 88 / Sam 95\n```\n\n`zip` stops at the shortest sequence — handy for pairing headers with values:\n\n```python\nheaders = ["name", "age", "city"]\nrow = ["Avi", 21, "Pune"]\nprint(dict(zip(headers, row)))   # {\'name\': \'Avi\', ...}\n```\n\nThe **parallel-iteration pattern** (`for a, b in zip(A, B)`) replaces the C-style indexed loop entirely. When you catch yourself writing `for i in range(len(x))`, ask: do I need the index (→ `enumerate`) or the paired value (→ `zip`)?\n\nBoth functions are **lazy** — they produce values on demand rather than building full lists, so they work fine on large data.\n\nThese three (comprehensions, enumerate, zip) together are the "modern loop toolkit" — code using them reads like a sentence instead of like a chore.',
        code: 'fruits = ["apple", "mango", "fig"]\nfor i, fruit in enumerate(fruits, start=1):\n    print(f"{i}. {fruit}")\n\nnames = ["Avi", "Riya"]\nscores = [92, 88]\nfor name, score in zip(names, scores):\n    print(name, score)\n\n# zip into a dict — the classic headers/row pattern\ncols = ["name", "age"]\nrow = ["Avi", 21]\nprint(dict(zip(cols, row)))',
        note: 'Need the index → enumerate(). Need paired values → zip(). Both beat `range(len(x))` and indexed access.',
      },
    ],
    quizzes: [
      {
        text: '`for i in range(5)` iterates over…',
        options: ['1,2,3,4,5', '0,1,2,3,4 — range stop is exclusive', '0,1,2,3,4,5', '5 only'],
        correctAnswer: '0,1,2,3,4 — range stop is exclusive',
      },
      {
        text: 'Which loop is correct when you do NOT know how many iterations you need?',
        options: ['for i in range(100)', 'while', 'for x in data', 'for each'],
        correctAnswer: 'while',
      },
      {
        text: '`continue` inside a loop…',
        options: ['exits the loop entirely', 'skips the rest of the current iteration', 'restarts the program', 'is an error'],
        correctAnswer: 'skips the rest of the current iteration',
      },
      {
        text: 'The comprehension `[n * n for n in range(4)]` produces…',
        options: ['[0,1,2,3]', '[0,1,4,9]', '[1,4,9,16]', '[0,4,16]'],
        correctAnswer: '[0,1,4,9]',
      },
      {
        text: '`enumerate(fruits, start=1)` yields…',
        options: ['just the fruits', 'index + fruit pairs, numbering from 1', 'a sorted list', 'only odd indexes'],
        correctAnswer: 'index + fruit pairs, numbering from 1',
      },
      {
        text: '`for a, b in zip(names, scores)` …',
        options: ['pairs each name with each score one-to-one', 'multiplies the lists', 'sorts both lists', 'runs names twice'],
        correctAnswer: 'pairs each name with each score one-to-one',
      },
      {
        text: '`while True:` is a real pattern when paired with…',
        options: ['a break statement', 'a continue statement', 'range()', 'a comprehension'],
        correctAnswer: 'a break statement',
      },
      {
        text: 'The while...else block runs when…',
        options: ['the loop breaks', 'the loop ends WITHOUT a break', 'the loop is infinite', 'the condition is False'],
        correctAnswer: 'the loop ends WITHOUT a break',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 7 — Functions, Args & Scope
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 7,
    title: 'Functions, Args & Scope',
    description:
      'Reusable behaviour: defining functions, parameters with defaults and *args/**kwargs, return values, and Python scoping rules.',
    topics: [
      {
        title: 'Defining & Calling Functions',
        text:
          'A **function** packages a piece of behaviour so you can run it by name, with different inputs each time:\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Avi"))     # Hello, Avi!\nprint(greet("Riya"))    # Hello, Riya!\n```\n\nDefinition syntax: `def` keyword, name, parentheses with parameters, colon, indented body. Calling syntax: `name(arguments)`.\n\nWhy functions are non-negotiable:\n\n- **Reuse** — write once, call many times.\n- **Naming** — `calculate_total_price()` tells a reader what a block does better than 10 lines of math.\n- **Testing** — a function with inputs and a return value is testable in isolation (Section 20).\n- **Abstraction** — callers use the behaviour without caring about the internals.\n\nA function **takes parameters** (the names in the definition) and receives **arguments** (the values you pass). Python supports **positional** and **keyword** calls:\n\n```python\ndef describe(name, age):\n    return f"{name} is {age} years old"\n\nprint(describe("Avi", 21))        # positional\nprint(describe(age=21, name="Avi"))  # keyword — order free\n```\n\nKeyword arguments make calls self-documenting and are worth using whenever a call has more than one or two arguments.\n\nKeep functions **small and single-purpose**: one function, one job. If a function does two unrelated things or needs a comment to explain its flow, split it. A function that fits on a screen and does one thing clearly is the foundation of every maintainable Python codebase.',
        code: 'def square(x):\n    return x * x\n\ndef greet(name="there"):\n    return f"Hello, {name}!"\n\nprint(square(7))            # 49\nprint(greet())              # Hello, there!  (default)\nprint(greet("Avi"))         # Hello, Avi!',
        note: 'One function, one job. Use keyword arguments when calls have multiple args — they read like documentation.',
      },
      {
        title: 'Parameters: Defaults, *args & **kwargs',
        text:
          'Python gives parameters three superpowers:\n\n**1. Default values** — optional parameters:\n\n```python\ndef greet(name="there"):\n    return f"Hello, {name}!"\n```\n\nDefaulted parameters must come AFTER non-defaulted ones: `def f(a, b=1)` yes, `def f(a=1, b)` no. \n\n**CAUTION — the mutable default trap**: never use a mutable default like `def f(items=[]):` — the list is created ONCE and shared across all calls. Use `None` instead:\n\n```python\ndef add_to(items=None):\n    items = items or []      # fresh list each call\n    items.append("x")\n    return items\n```\n\n**2. `*args`** — collect any number of **positional** arguments into a tuple:\n\n```python\ndef total(*args):\n    return sum(args)\n\nprint(total(1, 2, 3))        # 6\n```\n\n**3. `**kwargs`** — collect any number of **keyword** arguments into a dict:\n\n```python\ndef render(**kwargs):\n    for key, value in kwargs.items():\n        print(key, "=", value)\n```\n\n**The `*` and `**` also work in reverse — unpacking at the call site:**\n\n```python\nnums = [1, 2, 3]\nprint(total(*nums))          # spread the list into args\n\nconfig = {"name": "Avi", "age": 21}\ndescribe(**config)           # spread the dict into kwargs\n```\n\nThe same `*` syntax appears in parameter lists (`def f(*, x):` forces keyword-only args) and unpacking (`a, *rest = values` in Section 8). It all means "spread/collect a variable number of things" — once you see the pattern, the whole language clicks.',
        code: 'def log(message, level="INFO"):\n    print(f"[{level}] {message}")\n\ndef total(*args):            # any number of positional args\n    return sum(args)\n\ndef config(**kwargs):        # any number of keyword args\n    return kwargs\n\nprint(total(1, 2, 3, 4))     # 10\nprint(config(name="Avi", age=21))  # {\'name\': \'Avi\', \'age\': 21}',
        note: 'Mutable default args are a classic bug — use `items=None` and create fresh inside. *args/**kwargs = "variable number of args".',
      },
      {
        title: 'Return Values & Multiple Returns',
        text:
          'A function **returns** a value with `return`, and that value becomes the result of the call:\n\n```python\ndef add(a, b):\n    return a + b\n\nresult = add(3, 5)      # result == 8\n```\n\nKey facts:\n\n- `return` **ends the function immediately** — any code after it in the body is skipped. This is what makes early returns (Section 5) work.\n- A function with **no `return`** returns `None`. This is the source of a very common bug:\n\n```python\ndef greet(name):\n    print(f"Hello {name}")   # prints, but returns None\n\nx = greet("Avi")            # x is None!\n```\n\nIf you want a value back, you must `return` it — `print` only shows output.\n- You can `return` **anything**: numbers, strings, lists, dicts, even other functions.\n\n**Multiple values**: return a tuple, and Python unpacking handles it elegantly:\n\n```python\ndef min_max(numbers):\n    return min(numbers), max(numbers)   # returns a tuple\n\nlo, hi = min_max([4, 9, 2, 7])         # unpack into two names\nprint(lo, hi)                          # 2 9\n```\n\nThe `lo, hi = ...` unpacking (Section 8) makes multi-return functions read beautifully. It beats returning a list you then index with `[0]` and `[1]` — named pairs are self-documenting.\n\nA useful pattern is returning a **status + result** pair for functions that can fail softly (the CLI tools in Section 19 will use this): `return True, "saved"` or `return False, "file not found"` — the caller checks the first value and uses the second.',
        code: 'def stats(numbers):\n    return min(numbers), max(numbers), sum(numbers) / len(numbers)\n\nlo, hi, avg = stats([4, 9, 2, 7])\nprint(lo, hi, avg)      # 2 9 5.5\n\ndef greet(name):\n    print(f"Hello {name}")   # prints only\n\nresult = greet("Avi")\nprint(result)            # None — no return statement',
        note: 'return ends the function and gives the value; print shows output but returns nothing. Use tuple returns + unpacking for multiple values.',
      },
      {
        title: 'Scope: Local vs Global & the LEGB Rule',
        text:
          '**Scope** is where a name is visible. Python resolves every name by the **LEGB rule**, searching in this order:\n\n1. **L**ocal — names inside the current function\n2. **E**nclosing — names in enclosing functions (nested functions)\n3. **G**lobal — names at module level\n4. **B**uilt-in — names like `print`, `len`, `sum`\n\nThe critical consequence: **assignment inside a function creates a local name**, it does not touch the global:\n\n```python\ncount = 10\n\ndef change():\n    count = 5          # a NEW local count — global count untouched\n    print(count)       # 5\n\nchange()\nprint(count)           # 10 — global unchanged!\n```\n\nIf a function only *reads* a global, it works fine:\n\n```python\nname = "Avi"\ndef show():\n    print(name)        # reads the global — ok\n```\n\nTo *modify* a global from inside a function you must declare `global` — and that is almost always a design smell:\n\n```python\ncount = 10\ndef bump():\n    global count\n    count += 1\n```\n\nThe rule of thumb: **avoid globals**. Pass values in as parameters and return results out. Functions that depend only on their inputs and return outputs (no hidden global state) are *pure* — easy to test, easy to reason about, impossible to corrupt by accident. This is one of the biggest quality differences between beginner and professional Python.',
        code: 'x = 100                    # global\n\ndef demo():\n    x = 5                    # local — shadows the global\n    print("inside:", x)      # 5\n\ndemo()\nprint("outside:", x)         # 100\n\n# Reading a global works without any declaration:\ndef show():\n    print(x)                 # 100\nshow()',
        note: 'LEGB: Local → Enclosing → Global → Built-in. Assignment inside a function is local unless you say `global` — prefer parameters/returns.',
      },
    ],
    quizzes: [
      {
        text: 'The syntax to define a function named greet taking one parameter is…',
        options: ['function greet(name)', 'def greet(name):', 'func greet(name)', 'define greet(name)'],
        correctAnswer: 'def greet(name):',
      },
      {
        text: '`describe(age=21, name="Avi")` is an example of…',
        options: ['positional arguments', 'keyword arguments', 'default arguments', 'lambda arguments'],
        correctAnswer: 'keyword arguments',
      },
      {
        text: 'The mutable default trap: `def f(items=[]):` …',
        options: ['is fine and efficient', 'shares ONE list across all calls — use None instead', 'crashes Python', 'is required for performance'],
        correctAnswer: 'shares ONE list across all calls — use None instead',
      },
      {
        text: '`def total(*args):` — calling `total(1,2,3)` makes args…',
        options: ['a list', 'a tuple (1,2,3)', 'a dict', 'three separate variables'],
        correctAnswer: 'a tuple (1,2,3)',
      },
      {
        text: 'A function with no return statement returns…',
        options: ['0', 'None', 'False', 'the last printed value'],
        correctAnswer: 'None',
      },
      {
        text: '`return min(n), max(n)` followed by `lo, hi = min_max([...])` uses…',
        options: ['tuple unpacking', 'global variables', 'slicing', 'a class'],
        correctAnswer: 'tuple unpacking',
      },
      {
        text: 'Assigning to a name inside a function…',
        options: ['modifies the global always', 'creates a local name, leaving the global untouched', 'is a syntax error', 'requires a semicolon'],
        correctAnswer: 'creates a local name, leaving the global untouched',
      },
      {
        text: 'The LEGB rule resolves names in the order…',
        options: ['Built-in, Global, Enclosing, Local', 'Local, Enclosing, Global, Built-in', 'Global, Local, Built-in, Enclosing', 'Enclosing, Local, Global, Built-in'],
        correctAnswer: 'Local, Enclosing, Global, Built-in',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 8 — Lists & Tuples
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 8,
    title: 'Lists & Tuples',
    description:
      'Ordered collections: creating, indexing and slicing lists, their methods, immutable tuples, and unpacking.',
    topics: [
      {
        title: 'Lists: Creation, Indexing & Slicing',
        text:
          'A **list** is an ordered, mutable collection of items — the workhorse container of Python:\n\n```python\nfruits = ["apple", "mango", "banana"]\nnumbers = [1, 2, 3]\nmixed = [1, "two", 3.0, [4]]      # lists can hold anything\nempty = []\n```\n\n**Indexing** starts at 0. Negative indexes count from the end:\n\n```python\nprint(fruits[0])     # apple\nprint(fruits[-1])    # banana\nprint(fruits[-2])    # mango\n```\n\n**Slicing** extracts a sublist: `list[start:stop:step]` — `stop` is exclusive:\n\n```python\ndata = [10, 20, 30, 40, 50]\nprint(data[1:3])     # [20, 30] — stop exclusive\nprint(data[:2])      # [10, 20] — from start\nprint(data[::2])     # [10, 30, 50] — every 2nd\nprint(data[::-1])    # [50, 40, 30, 20, 10] — reversed copy\n```\n\nA slice always returns a **new list** — the original is untouched. This is powerful (no accidental mutation) and a common source of bugs when people forget it.\n\nLists are **mutable** — you can change elements in place:\n\n```python\nfruits[1] = "guava"\nfruits.append("kiwi")       # add to the end\n```\n\n**Copying** has a famous trap: `b = a` does NOT copy — both names point at the SAME list. Mutating `b` changes `a`. To copy: `b = a[:]` or `b = list(a)` (shallow). For nested lists use `copy.deepcopy`.\n\n`len()` gives the size; `in` tests membership (`"mango" in fruits`). Lists are the default "ordered bag of things" — use them for sequences, collections, and stacks/queues (with `append`/`pop`).',
        code: 'fruits = ["apple", "mango", "banana"]\nprint(fruits[-1])        # banana\nprint(fruits[0:2])       # [\'apple\', \'mango\']\nprint(fruits[::-1])      # reversed copy\n\nfruits.append("kiwi")\nfruits[1] = "guava"\nprint(fruits)\n\n# The copy trap:\nb = fruits                # NOT a copy — same list\nb.append("X")             # changes fruits too!\nprint(fruits)             # X is there\n\na = fruits[:]             # real (shallow) copy\na.append("Y")\nprint(fruits)             # no Y',
        note: 'Indexing starts at 0; -1 is the last element. Slices return new lists with stop EXCLUSIVE. `b = a` copies the reference, not the list.',
      },
      {
        title: 'List Methods: append, extend, sort & remove',
        text:
          'Lists ship with methods that cover most operations. The essential ones:\n\n**Adding:**\n\n- `append(x)` — add one item at the end.\n- `extend(iterable)` — add ALL items of another sequence.\n- `insert(i, x)` — insert at a position.\n\nThe append-vs-extend distinction trips everyone once:\n\n```python\nitems = [1, 2]\nitems.append([3, 4])     # items -> [1, 2, [3, 4]]   — nested list!\nitems.extend([5, 6])     # items -> [1, 2, [3, 4], 5, 6]\n```\n\n**Removing:**\n\n- `pop(i)` — remove and RETURN the item at index i (default last). Perfect for stack behaviour.\n- `remove(x)` — remove the FIRST matching value (by value, not index).\n- `clear()` — empty the list.\n\n**Ordering & searching:**\n\n- `sort()` — sort in place (mutates!); `sorted(x)` returns a new sorted list without touching the original.\n- `reverse()` — reverse in place.\n- `index(x)` — position of the first match (raises `ValueError` if absent).\n- `count(x)` — how many times x appears.\n\nThe **mutating vs non-mutating** split matters: `sort()`, `reverse()`, `append()`, `extend()`, `pop()` mutate the list and return `None`. `sorted()`, `len()`, `max()`, `min()`, `sum()` leave it alone. Forgetting this leads to the classic bug `x = mylist.sort()` — which sets `x` to `None`.\n\n**Membership** (`in`) is O(n) on a list. If you need fast "is this present?" checks on large data, a set (Section 9) is the right tool — lists are for ordered storage, not membership lookup.',
        code: 'nums = [3, 1, 2]\nprint(sorted(nums))     # [1, 2, 3] — new list\nprint(nums)             # [3, 1, 2] — untouched\n\nnums.sort()             # mutates in place\nprint(nums)             # [1, 2, 3]\n\nstack = []\nstack.append("a")\nstack.append("b")\nprint(stack.pop())      # b\n\nitems = [1, 2]\nitems.extend([3, 4])\nprint(items)            # [1, 2, 3, 4]',
        note: 'append adds one item, extend adds all items. sort() mutates and returns None; sorted() returns a new list. Mutating methods return None.',
      },
      {
        title: 'Tuples: Immutability & Unpacking',
        text:
          'A **tuple** is an ordered collection — like a list — but **immutable**: once created, you cannot add, remove, or change elements.\n\n```python\npoint = (3, 4)\nrgb = (255, 128, 0)\nempty = ()\nsingle = (5,)         # comma makes it a tuple!\n```\n\nThe `single = (5,)` case is a famous trap: parentheses alone are not a tuple — `(5)` is just the number 5. The **comma** is what defines a tuple.\n\n**Why choose an immutable tuple over a list?**\n\n- **Safety** — a tuple guarantees its contents cannot change. Passing a tuple to a function means the function cannot mutate your data.\n- **Hashability** — tuples can be dictionary keys (Section 9); lists cannot.\n- **Performance** — tuples are slightly lighter and faster.\n- **Intent** — a tuple says "this is a fixed record": a coordinate, an RGB color, a (name, age) pair.\n\n**Unpacking** is the killer feature:\n\n```python\npoint = (3, 4)\nx, y = point            # x=3, y=4\n\nname, age = ("Avi", 21)\n\n# swap two variables the Pythonic way:\na, b = b, a\n\n# star unpacking captures the rest:\nfirst, *middle, last = [1, 2, 3, 4, 5]\n# first=1, middle=[2,3,4], last=5\n```\n\nUnpacking works with lists too, and the `*` in the middle collects any number of leftover items. It is how the multi-return functions from Section 7 feel so natural.\n\nRule of thumb: use a **tuple** when the collection is a fixed record that should not change (coordinates, return pairs, config pairs), and a **list** when you will grow, reorder, or modify it. The choice documents intent.',
        code: 'point = (3, 4)\nx, y = point\nprint(x, y)          # 3 4\n\n# star unpacking\nfirst, *rest, last = [1, 2, 3, 4, 5]\nprint(first, rest, last)   # 1 [2, 3, 4] 5\n\n# swapping\nleft, right = 10, 20\nleft, right = right, left\nprint(left, right)   # 20 10\n\n# tuples are immutable\ntry:\n    point[0] = 9\n    print("changed")  # never runs\nexcept TypeError:\n    print("tuples are immutable")',
        note: 'The comma makes a tuple, not the parentheses. Unpacking (x, y = point) and star-unpacking are everyday Python.',
      },
      {
        title: 'When to Choose a List vs a Tuple',
        text:
          'Both are ordered sequences, so which do you pick? The rule is about **intent and mutability**:\n\n**Use a list when:**\n\n- The collection will grow, shrink, or be reordered — `append`, `extend`, `pop`, `sort`.\n- You are building a result incrementally (a loop appending matches).\n- The items are homogeneous ("a list of prices") and the count is variable.\n\n**Use a tuple when:**\n\n- The shape is fixed — a coordinate `(x, y)`, an RGB `(r, g, b)`, a `(name, id)` pair.\n- You want to guarantee nobody mutates it.\n- You need a dictionary key or a set element (tuples are hashable, lists are not).\n- The values have *different* roles — a record, not a collection ("a person" as `(name, age)` vs "a list of people").\n\n**Performance note**: tuples are slightly cheaper to create and use less memory, but for ordinary code the difference is negligible — choose for semantics, not speed.\n\n**Practical conventions in real codebases:**\n\n- Function returns that are a fixed set of values → tuple (`return min_v, max_v`).\n- CSV rows and database rows often arrive as tuples — treat them as read-only records.\n- Anything you will pass to a function that must not change → tuple.\n- Anything you will build up or modify → list.\n\nA mental shortcut used by experienced Pythonistas: a **list is a collection of things**; a **tuple is a single thing with parts**. `prices = [299, 499]` is a collection of prices; `point = (x, y)` is ONE point. When you can answer "is this one thing or many things?", the container choice follows.',
        code: 'scores = [92, 88, 95]          # a collection — will be summed/sorted\nscores.append(97)\nprint(sum(scores))\n\npoint = (3, 4)                  # ONE point with two parts\nx, y = point\nprint(x, y)\n\n# tuples are hashable → usable as dict keys\nlocations = {(3, 4): "home", (10, 2): "office"}\nprint(locations[(3, 4)])        # home',
        note: 'List = a collection of many things. Tuple = one thing with fixed parts (and usable as a dict key). Choose by intent.',
      },
    ],
    quizzes: [
      {
        text: '`data[1:3]` on `[10, 20, 30, 40]` returns…',
        options: ['[20, 30] — stop is exclusive', '[10, 20]', '[20, 30, 40]', '[10, 20, 30]'],
        correctAnswer: '[20, 30] — stop is exclusive',
      },
      {
        text: '`fruits[-1]` gives…',
        options: ['the first element', 'the last element', 'an error', 'None'],
        correctAnswer: 'the last element',
      },
      {
        text: '`b = a` followed by `b.append("X")` — what happens to `a`?',
        options: ['Nothing — lists copy automatically', 'a gets "X" too — b and a point at the SAME list', 'a becomes empty', 'Python errors'],
        correctAnswer: 'a gets "X" too — b and a point at the SAME list',
      },
      {
        text: '`items.append([3, 4])` on `[1, 2]` makes items…',
        options: ['[1, 2, 3, 4]', '[1, 2, [3, 4]] — appends one nested list', '[1, 2]', 'an error'],
        correctAnswer: '[1, 2, [3, 4]] — appends one nested list',
      },
      {
        text: '`x = mylist.sort()` leaves `x` as…',
        options: ['the sorted list', 'None — sort() mutates and returns None', 'a copy', 'an error'],
        correctAnswer: 'None — sort() mutates and returns None',
      },
      {
        text: 'Which makes a tuple containing the single value 5?',
        options: ['(5)', '5,', '(5,)', 'tuple(5)'],
        correctAnswer: '(5,)',
      },
      {
        text: '`first, *middle, last = [1, 2, 3, 4]` gives…',
        options: ['first=1 middle=[2,3] last=4', 'first=1 middle=[2,3,4] last=[]', 'an error', 'first=[1] middle=[] last=[4]'],
        correctAnswer: 'first=1 middle=[2,3] last=4',
      },
      {
        text: 'Tuples can be dict keys but lists cannot because…',
        options: ['lists are slower', 'tuples are immutable and therefore hashable', 'Python bans it arbitrarily', 'tuples are smaller'],
        correctAnswer: 'tuples are immutable and therefore hashable',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 9 — Dictionaries & Sets
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 9,
    title: 'Dictionaries & Sets',
    description:
      'Key-value storage with dictionaries, uniqueness with sets, and the counting/grouping patterns that dominate data work.',
    topics: [
      {
        title: 'Dictionaries: Key-Value Storage',
        text:
          'A **dictionary** (`dict`) maps keys to values — the Python equivalent of a lookup table or map:\n\n```python\nstudent = {\n    "name": "Avi",\n    "age": 21,\n    "course": "Python",\n}\n\nprint(student["name"])     # Avi\nstudent["age"] = 22        # update\nstudent["city"] = "Pune"   # add a new key\n```\n\nKey facts:\n\n- **Keys are unique** — assigning an existing key overwrites its value.\n- **Keys must be hashable** — strings, numbers, tuples work; lists and dicts do not.\n- **Accessing a missing key raises `KeyError`** — the most common dict bug. Three ways to avoid it:\n\n```python\nstudent.get("grade")            # None if missing\nstudent.get("grade", "N/A")     # "N/A" if missing\nstudent.setdefault("grade", "A")  # set only if missing\n```\n\n- `in` tests membership **without** erroring: `if "grade" in student:`.\n- `dict[key] = value` adds or updates; `del dict[key]` removes (KeyError if absent); `dict.pop(key, default)` removes and returns safely.\n\n**Why dicts are everywhere:** they give O(1) lookup — no matter how many keys, finding one is instant. Any time you have "given X, what is Y?" — name→phone, product→price, course→students — a dict is the tool. JSON (Section 17) is literally dict-shaped, so APIs and Python meet naturally through dictionaries.\n\n**Construction shortcuts:** `dict(name="Avi", age=21)` from keywords, or `dict(zip(keys, values))` from two parallel lists — a pattern that shows up constantly when pairing headers with rows.',
        code: 'scores = {"Avi": 92, "Riya": 88}\nprint(scores["Avi"])          # 92\n\n# safe access\nprint(scores.get("Sam", "not found"))   # not found\nscores["Sam"] = 95                      # add\n\nif "Riya" in scores:\n    print("Riya present")\n\n# build from two parallel lists\nnames = ["a", "b"]\nvals = [1, 2]\nprint(dict(zip(names, vals)))  # {\'a\': 1, \'b\': 2}',
        note: 'dict[key] raises KeyError when missing — use .get(key, default) or `in`. Dicts give instant key→value lookup.',
      },
      {
        title: 'Dictionary Methods & Iteration',
        text:
          'Iterating a dict has several modes, and each is useful:\n\n```python\nscores = {"Avi": 92, "Riya": 88}\n\nfor key in scores:            # keys (default)\nfor value in scores.values(): # values\nfor key, value in scores.items():  # BOTH — the one you use most\n```\n\n`items()` is the workhorse — it yields `(key, value)` pairs you unpack directly:\n\n```python\nfor name, score in scores.items():\n    print(f"{name}: {score}")\n```\n\nOrder note: dicts preserve **insertion order** in modern Python — items come back in the order you added them.\n\n**Essential methods:**\n\n- `keys()`, `values()`, `items()` — views you can iterate or turn into lists.\n- `get(key, default)` — safe read.\n- `pop(key, default)` — safe remove.\n- `update(other_dict)` — merge another dict\'s entries in (overwriting).\n- `setdefault(key, default)` — return the value, or set it to default if missing. Great for building nested structures:\n\n```python\nword_count = {}\nfor word in words:\n    word_count.setdefault(word, 0)\n    word_count[word] += 1\n```\n\n**The merge shorthand** (Python 3.9+): `a | b` merges two dicts into a new one, and `a |= b` updates in place — cleaner than `update` for one-liners.\n\n**Merging is common enough to matter**: config defaults + user overrides = `merged = {**defaults, **user}` (spread) or `defaults | user`. Both mean "start with defaults, let user override".\n\nMastering dict iteration and these methods makes data-processing code dramatically shorter — most counting/grouping problems (topic 4) are one loop over `items()` away.',
        code: 'scores = {"Avi": 92, "Riya": 88}\n\nfor name, score in scores.items():\n    print(f"{name}: {score}")\n\n# update / merge\nscores.update({"Sam": 95})\nmerged = {"Avi": 92} | {"Riya": 88}   # 3.9+ merge\nprint(merged)\n\n# safe remove\nprint(scores.pop("Sam", "n/a"))       # 95\n\n# counting with setdefault\nwords = ["a", "b", "a", "c"]\ncounts = {}\nfor w in words:\n    counts.setdefault(w, 0)\n    counts[w] += 1\nprint(counts)                          # {\'a\': 2, \'b\': 1, \'c\': 1}',
        note: 'Loop dicts with .items() to get key+value. Use .get/.pop/.setdefault for safe access. Use | to merge.',
      },
      {
        title: 'Sets: Unique Values & Set Operations',
        text:
          'A **set** is an unordered collection of **unique** values:\n\n```python\nskills = {"python", "sql", "python", "git"}\nprint(skills)      # {\'python\', \'sql\', \'git\'} — duplicates gone\n```\n\nSets are built for three jobs:\n\n**1. De-duplication** — the fastest way to remove duplicates from any collection:\n\n```python\nunique = set(["a", "b", "a", "c"])   # {\'a\', \'b\', \'c\'}\n```\n\n**2. Fast membership** — `x in a_set` is O(1), instant even for millions of items (a list would scan every element):\n\n```python\nif "python" in skills:\n```\n\n**3. Set algebra** — the operations that make sets magical:\n\n```python\na = {1, 2, 3}\nb = {3, 4, 5}\na | b      # union: {1,2,3,4,5}\na & b      # intersection: {3}\na - b      # difference: {1,2} (in a, not b)\na ^ b      # symmetric difference: {1,2,4,5}\n```\n\nReal-world uses: "which tags are shared by both courses?" (`&`), "which users enrolled but never logged in?" (`-`), "merge two lists without duplicates" (`|`).\n\nSet limitations to remember:\n\n- Elements must be **hashable** (like dict keys) — no lists or dicts inside a set; use tuples instead.\n- Sets are **unordered** — no indexing, no slicing, no `set[0]`. If order matters, sort when needed: `sorted(my_set)`.\n- Sets are **mutable** — `add()`, `remove()`, `discard()` (safe), `pop()`. `frozenset` is the immutable variant (usable as a dict key).\n\nWhen a task involves uniqueness, membership, or comparing two collections, ask "should this be a set?" — it is often the right tool and the code becomes one line.',
        code: 'names = ["a", "b", "a", "c", "b"]\nunique_names = set(names)\nprint(unique_names)          # {\'a\', \'b\', \'c\'}\n\neng = {"python", "git"}\ndata = {"python", "sql"}\nprint(eng & data)            # {\'python\'} — both\nprint(eng | data)            # union\nprint(eng - data)            # {\'git\'} — eng only\n\nskills = {"python", "sql"}\nprint("python" in skills)    # True — O(1)',
        note: 'Sets = unique values + instant membership + set algebra (| & - ^). Unordered — use sorted() when order matters.',
      },
      {
        title: 'Counting & Grouping with Dictionaries',
        text:
          'Two patterns dominate real data work, and both are dict one-liners waiting to happen:\n\n**Counting** — how many times does each value appear? The idiomatic tool is `collections.Counter`:\n\n```python\nfrom collections import Counter\n\nwords = ["apple", "mango", "apple", "fig", "mango", "apple"]\ncounts = Counter(words)\nprint(counts)          # Counter({\'apple\': 3, \'mango\': 2, \'fig\': 1})\nprint(counts["apple"]) # 3\nprint(counts.most_common(2))  # [(\'apple\', 3), (\'mango\', 2)]\n```\n\n`Counter` is a dict subclass — everything from Section 9 works on it, plus the counting logic is already there. `most_common()` alone replaces a sort+slice for "top N".\n\n**Grouping** — split items into buckets by a key:\n\n```python\nfrom collections import defaultdict\n\nstudents = [("A", "Riya"), ("B", "Sam"), ("A", "Avi")]\ngroups = defaultdict(list)\nfor batch, name in students:\n    groups[batch].append(name)\n\nprint(groups["A"])     # [\'Riya\', \'Avi\']\n```\n\n`defaultdict(list)` auto-creates an empty list when a new key is first touched — removing the "check if key exists, then append" boilerplate.\n\n**The generic pattern** (without imports): `setdefault` from topic 2 does the same job:\n\n```python\ngroups = {}\nfor batch, name in students:\n    groups.setdefault(batch, []).append(name)\n```\n\nThese patterns power a shocking amount of analytics: counting log levels, grouping sales by month, tallying survey answers, histogram buckets. Learn to reach for `Counter` and `defaultdict` and your data code shrinks by half.',
        code: 'from collections import Counter, defaultdict\n\n# Counting\nsales = ["day", "night", "day", "day"]\nprint(Counter(sales).most_common(1))   # [(\'day\', 3)]\n\n# Grouping\npeople = [("X", "Riya"), ("Y", "Sam"), ("X", "Avi")]\ngroups = defaultdict(list)\nfor team, name in people:\n    groups[team].append(name)\nprint(groups["X"])     # [\'Riya\', \'Avi\']',
        note: 'Counter for counting (with .most_common), defaultdict(list) for grouping — they remove the boilerplate entirely.',
      },
    ],
    quizzes: [
      {
        text: 'Accessing a missing dict key with `d["missing"]` raises…',
        options: ['ValueError', 'KeyError', 'IndexError', 'None'],
        correctAnswer: 'KeyError',
      },
      {
        text: '`d.get("x", 0)` returns…',
        options: ['0 if the key exists', 'the value of x, or 0 if missing', 'always 0', 'an error'],
        correctAnswer: 'the value of x, or 0 if missing',
      },
      {
        text: 'Which of these can be a dictionary key?',
        options: ['a list', 'a tuple', 'a dict', 'a set'],
        correctAnswer: 'a tuple',
      },
      {
        text: 'To iterate a dict getting key AND value, use…',
        options: ['for k in d:', 'for v in d.values():', 'for k, v in d.items():', 'for d in dict:'],
        correctAnswer: 'for k, v in d.items():',
      },
      {
        text: '`set(["a", "b", "a", "c"])` produces…',
        options: ['[a, b, c]', "{\'a\', \'b\', \'c\'} — duplicates removed", 'a list with duplicates', 'an error'],
        correctAnswer: "{'a', 'b', 'c'} — duplicates removed",
      },
      {
        text: '`{1, 2, 3} & {3, 4, 5}` evaluates to…',
        options: ['{1,2,3,4,5}', '{3}', '{1,2,4,5}', '{1,2,3,3,4,5}'],
        correctAnswer: '{3}',
      },
      {
        text: 'The fastest membership test on a large collection uses…',
        options: ['a list', 'a set', 'a tuple', 'a string'],
        correctAnswer: 'a set',
      },
      {
        text: '`Counter(words).most_common(1)` returns…',
        options: ['the least common word', 'the most common word and its count', 'all counts', 'a sorted list of words'],
        correctAnswer: 'the most common word and its count',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 10 — String Handling & File I/O
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 10,
    title: 'String Handling & File I/O',
    description:
      'The string methods that do real work, modern formatting, reading and writing files, and the with statement that keeps them safe.',
    topics: [
      {
        title: 'String Methods: split, join, strip & replace',
        text:
          'Strings in Python come with a toolbox of methods — the ones you will use every single day:\n\n**Cleaning:**\n\n- `strip()` — remove leading/trailing whitespace. `"  hi  ".strip()` → `"hi"`. Variants `lstrip()`/`rstrip()`.\n- `lower()` / `upper()` — case folding (essential for comparisons: `"PYTHON".lower() == "python"`).\n\n**Finding & replacing:**\n\n- `replace(old, new)` — replace every occurrence: `"a-b-a".replace("a", "x")` → `"x-b-x"`.\n- `find(sub)` / `index(sub)` — position of a substring (`find` returns -1 when absent, `index` raises).\n- `startswith(prefix)` / `endswith(suffix)` — the clean "does it begin/end with" test.\n- `count(sub)` — how many times a substring appears.\n\n**The split/join pair — arguably the most valuable two methods in the language:**\n\n```python\ncsv_line = "Avi,21,Pune"\nparts = csv_line.split(",")     # [\'Avi\', \'21\', \'Pune\']\n\n# and the reverse:\nvalues = ["Avi", "21", "Pune"]\nline = ",".join(values)         # \'Avi,21,Pune\'\n```\n\n`split()` with no argument splits on **any whitespace** and collapses runs — perfect for parsing `"a   b  c"`. `join` is the ONLY way to build a string from a list efficiently (string `+` in a loop is slow and ugly).\n\n**Tests:** `isdigit()`, `isalpha()`, `isspace()`, `isupper()` — return booleans. `"42".isdigit()` → True, a handy pre-check before `int()`.\n\nA real parsing example:\n\n```python\nline = "  Price: 499  " \nprice = line.strip().split(": ")[1]   # "499"\n```\n\nChain methods left to right — `strip()` then `split()` then index. Method chaining on strings is idiomatic and reads like a pipeline.',
        code: 'data = "  Avi,21,Pune  "\nclean = data.strip()\nparts = clean.split(",")\nprint(parts)            # [\'Avi\', \'21\', \'Pune\']\n\njoined = " | ".join(parts)\nprint(joined)           # Avi | 21 | Pune\n\ntext = "The cat and the dog"\nprint(text.replace("the", "a"))    # replaces ALL occurrences\nprint("cat" in text)               # True\nprint(text.startswith("The"))      # True\n\nemail = "avi@example.com"\nprint(email.split("@")[1])         # example.com',
        note: 'split() parses into parts, join() builds strings from parts — they are a matched pair. Use lower() before comparing user input.',
      },
      {
        title: 'Formatting Strings: f-Strings & .format()',
        text:
          'There are three ways to put values into strings; modern Python uses exactly one as the default — **f-strings**:\n\n```python\nname = "Avi"\nscore = 92\nprint(f"{name} scored {score}")       # Avi scored 92\n```\n\nThe `f` prefix means every `{...}` is an expression evaluated in place. You can compute inside the braces: `f"{a} + {b} = {a + b}"`.\n\n**Format specifiers** control appearance — after a colon:\n\n```python\nprice = 49.995\nprint(f"Price: {price:.2f}")       # Price: 50.00\nprint(f"{0.8345:.1%}")             # 83.5% — percentage\nprint(f"{42:05d}")                 # 00042 — pad with zeros\nprint(f"{\'hi\':>10}")               # spaces pad right to width 10\nprint(f"{\'hi\':<10}")               # pad left\n```\n\nThe most-used: `:.2f` (two decimals), `:>N` / `:<N` (align for tables), `:.N%` (percent). These turn raw numbers into readable tables with one line.\n\n**f-string debugging shortcut** (3.8+): `print(f"{score = }")` prints `score = 92` — no retyping the name.\n\nThe older alternatives you will still see in other people\'s code:\n\n- `"%s scored %d" % (name, score)` — old %-style; avoid in new code.\n- `"{} scored {}".format(name, score)` — `.format()`, useful when the template is stored separately (e.g. a config string): `template.format(name=name, score=score)`.\n\nWhen you need a **template reused in many places**, `.format()` on a stored template is the right call; for everything else, f-strings. A formatted table from a loop:\n\n```python\nfor name, score in [("Avi", 92), ("Riya", 88)]:\n    print(f"{name:<10}{score:>5}")   # aligned columns',
        code: 'name = "Avi"\nscore = 92\nprint(f"{name} scored {score}")        # f-string — default\nprint(f"{score = }")                   # score = 92 (debug)\n\nprice = 49.995\nprint(f"{price:.2f}")                  # 50.00\nprint(f"{score:>5}")                   # pad/align for tables\n\n# .format() — good when template is stored/reused\ntmpl = "Hello {name}, you scored {score}."\nprint(tmpl.format(name="Riya", score=88))',
        note: 'f-strings are the default: f"{value:.2f}" for decimals, f"{x:>N}" for alignment. .format() when the template is stored separately.',
      },
      {
        title: 'Reading Files: open, read & with Blocks',
        text:
          'Files are everywhere — data, configs, logs. Reading one is a two-line pattern that NEVER changes:\n\n```python\nwith open("data.txt", "r") as f:\n    content = f.read()\n```\n\nThe **`with` block** is Python\'s magic for resource management: it opens the file, runs your code, and **automatically closes the file** when the block ends — even on an error. This is non-negotiable; forgetting `with` and never closing files is a classic leak.\n\nThree read styles, one per job:\n\n```python\nwith open("data.txt") as f:\n    content = f.read()            # whole file as ONE string\n\nwith open("data.txt") as f:\n    lines = f.readlines()         # list of lines (each with \\n)\n\nwith open("data.txt") as f:\n    for line in f:               # iterate line by line — memory-safe for big files\n        print(line.strip())\n```\n\nThe **iterate-line-by-line** form is the one to default to: it streams, so a 2 GB log file never loads fully into memory.\n\n**Encoding** is the silent killer. `open("f.txt")` assumes the platform default (often UTF-8 on Linux, sometimes not on Windows). Be explicit: `open("f.txt", encoding="utf-8")` — this prevents the classic `UnicodeDecodeError` and garbled text.\n\n**Error handling**: opening a missing file raises `FileNotFoundError`. Wrap in `try/except` (Section 11) or check `os.path.exists`/`Path(...).exists()` first — your choice, but crashing on a missing input is rarely what you want.\n\nThe path can be relative (`"data.txt"` = current directory) or absolute. Later you will use `pathlib.Path` (Section 16) for cleaner path handling, but the open/read/with core stays identical.',
        code: 'with open("notes.txt", "r", encoding="utf-8") as f:\n    content = f.read()\nprint(content[:50])\n\n# line-by-line — the streaming default\nwith open("notes.txt", encoding="utf-8") as f:\n    for line in f:\n        print(line.strip())\n\n# safe against missing file\nimport os\nif os.path.exists("notes.txt"):\n    with open("notes.txt") as f:\n        print(len(f.read()), "chars")',
        note: 'Always open files inside `with` — auto-close is guaranteed even on errors. Pass encoding="utf-8" explicitly.',
      },
      {
        title: 'Writing Files & Appending',
        text:
          'Writing to a file follows the same `with` pattern; the difference is the **mode** string:\n\n- `"w"` — **write**: overwrite the file from scratch (creates it if missing, TRUNCATES if it exists).\n- `"a"` — **append**: add to the end, keeping existing content.\n- `"x"` — exclusive create: error if the file already exists (safe overwrite protection).\n\n```python\nwith open("out.txt", "w", encoding="utf-8") as f:\n    f.write("line one\\n")\n    f.write("line two\\n")\n\nwith open("out.txt", "a", encoding="utf-8") as f:\n    f.write("appended line\\n")\n```\n\nKey details:\n\n- `write()` takes a **string** — numbers must be converted (`str(x)` or an f-string). It does NOT add a newline for you; include `\\n`.\n- To write many lines, build a list and use `writelines(lines)` — or `"\n".join(lines)`.\n- **`"w"` is destructive** — opening with `"w"` immediately empties the file. If the file matters, use `"x"` for "create new only" or back it up first.\n\nThe **data round-trip** that powers everything: read in → process → write out:\n\n```python\nwith open("prices.txt", encoding="utf-8") as f:\n    rows = [line.strip().split(",") for line in f]\n\n# process rows...\n\nwith open("prices_new.txt", "w", encoding="utf-8") as f:\n    f.write("\\n".join(",".join(r) for r in rows))\n```\n\nThis read-process-write pipeline is the heart of automation (Section 16). For structured data, you would reach for `csv` or `json` modules instead of hand-parsing — but the file mechanics are exactly this.',
        code: '# write (overwrites!)\nwith open("out.txt", "w", encoding="utf-8") as f:\n    f.write("line one\\n")\n    f.write("line two\\n")\n\n# append\nwith open("out.txt", "a", encoding="utf-8") as f:\n    f.write("line three\\n")\n\n# read it back\nwith open("out.txt", encoding="utf-8") as f:\n    print(f.read())\n# line one\n# line two\n# line three',
        note: '"w" overwrites/truncates, "a" appends, "x" creates-new-only. write() adds no newline — include \\n yourself.',
      },
    ],
    quizzes: [
      {
        text: '`"  hi  ".strip()` returns…',
        options: ['"  hi  "', '"hi"', '"hi  "', '"  hi"'],
        correctAnswer: '"hi"',
      },
      {
        text: '`"a,b,c".split(",")` returns…',
        options: ['"a,b,c"', "[\'a\', \'b\', \'c\']", "(\'a\', \'b\', \'c\')", '["a,b,c]'],
        correctAnswer: "['a', 'b', 'c']",
      },
      {
        text: 'The ONLY efficient way to build a string from a list is…',
        options: ['"+" joining in a loop', '"".join(my_list)', 'str(my_list)', 'my_list.join()'],
        correctAnswer: '"".join(my_list)',
      },
      {
        text: 'The default (best) way to format a string with values is…',
        options: ['f-strings: f"{name} scored {score}"', '%s %d old-style', 'string.concat', 'template literal backticks'],
        correctAnswer: 'f-strings: f"{name} scored {score}"',
      },
      {
        text: '`f"{49.995:.2f}"` produces…',
        options: ['49.99', '50.00', '49.995', '50'],
        correctAnswer: '50.00',
      },
      {
        text: 'Opening a file with `with open(...)` guarantees…',
        options: ['the file is encrypted', 'the file is closed even on errors', 'the file is created', 'faster reads'],
        correctAnswer: 'the file is closed even on errors',
      },
      {
        text: 'The mode that OVERWRITES (truncates) a file is…',
        options: ['"a"', '"w"', '"x"', '"r"'],
        correctAnswer: '"w"',
      },
      {
        text: 'To safely create a NEW file and error if it exists, use…',
        options: ['"w"', '"x"', '"a"', '"r"'],
        correctAnswer: '"x"',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 11 — Exception Handling
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 11,
    title: 'Exception Handling',
    description:
      'Handling errors gracefully: try/except/else/finally, catching specific exceptions, raising your own, and the "Ask forgiveness" philosophy.',
    topics: [
      {
        title: 'try / except / finally',
        text:
          'Python\'s approach to errors is "Ask for forgiveness, not permission" — you attempt an operation and **catch** the failure if it happens:\n\n```python\ntry:\n    num = int(input("Enter a number: "))\n    print(10 / num)\nexcept ValueError:\n    print("That was not a number")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\n```\n\nThe block structure:\n\n- **`try`** — the risky code.\n- **`except`** — runs only if a matching error (exception) occurs. You can have several, each for a different error type.\n- **`else`** — runs only if the try block succeeded with NO error.\n- **`finally`** — ALWAYS runs, error or not. Perfect for cleanup:\n\n```python\ntry:\n    f = open("data.txt")\n    process(f)\nfinally:\n    f.close()       # guaranteed to run\n```\n\n(For files you normally use `with` instead — but `finally` is the general mechanism.)\n\nThe most common exceptions you will meet:\n\n- `ValueError` — right type, wrong value (`int("abc")`)\n- `TypeError` — wrong type (`"a" + 1`)\n- `ZeroDivisionError` — dividing by zero\n- `KeyError` — missing dict key\n- `IndexError` — index out of range\n- `FileNotFoundError` — opening a missing file\n- `AttributeError` — missing method/attribute (`None.x`)\n\nCatching **bare `except:`** catches everything, including `KeyboardInterrupt` and internal errors — almost always wrong. Prefer specific exception types, and if you must be broad, use `except Exception:` at least, and log it.',
        code: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return float("inf")\n    except TypeError:\n        return None\n\nprint(safe_divide(10, 2))     # 5.0\nprint(safe_divide(10, 0))     # inf\nprint(safe_divide("x", 2))    # None\n\n# finally always runs\ntry:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print("caught")\nfinally:\n    print("cleanup done")',
        note: 'try/except to catch, else for the success path, finally for guaranteed cleanup. Catch specific exception types, not bare except:.',
      },
      {
        title: 'Exception Types & except Blocks',
        text:
          'Exceptions form a **hierarchy** — knowing the parent/child relationships lets you catch a family in one line. All exceptions inherit from `BaseException`; the ones you want descend from `Exception`:\n\n```\nBaseException\n└── Exception\n    ├── ArithmeticError\n    │   └── ZeroDivisionError\n    ├── LookupError\n    │   ├── IndexError\n    │   └── KeyError\n    ├── ValueError\n    ├── TypeError\n    └── OSError\n        └── FileNotFoundError\n```\n\nBecause `ZeroDivisionError` is a child of `ArithmeticError`, catching `ArithmeticError` also catches division by zero. Catch the **most specific** type you can:\n\n```python\ntry:\n    value = data["key"]\nexcept KeyError:\n    print("missing key")\nexcept Exception:\n    print("something else went wrong")   # catch-all last\nexcept:\n    print("even KeyboardInterrupt — rarely what you want")\n```\n\nOrder matters: except clauses are tried top-to-bottom, and the FIRST match wins. A general `except Exception` placed before `except KeyError` would swallow the KeyError too — so list specific ones first.\n\n**Catching multiple types** in one clause:\n\n```python\nexcept (ValueError, TypeError) as e:\n    print(f"bad input: {e}")\n```\n\nThe **`as e`** binds the exception object so you can read its message or attributes. This is the standard way to log useful details.\n\n**Getting the exception message**: `str(e)` gives the message. Avoid over-catching: a broad handler that silently ignores errors hides real bugs. The rule — catch what you can handle meaningfully, and let the rest propagate up to a caller that can.',
        code: 'data = {"name": "Avi"}\n\ntry:\n    age = data["age"]\nexcept KeyError as e:\n    print(f"Missing key: {e}")\nexcept (ValueError, TypeError) as e:\n    print(f"Type/value problem: {e}")\nexcept Exception as e:\n    print(f"Unexpected: {e}")',
        note: 'Exceptions are a hierarchy — catch the most specific type first, broad fallbacks last. Use `as e` to inspect the error.',
      },
      {
        title: 'Raising Exceptions & Creating Your Own',
        text:
          'When YOUR code detects a bad state, you **raise** an exception to tell the caller:\n\n```python\ndef withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError("Amount must be positive")\n    if amount > balance:\n        raise ValueError("Insufficient balance")\n    return balance - amount\n```\n\nRaising is how functions say "I cannot do this safely" instead of returning a misleading value. The caller then decides — try/except around it, or let it propagate.\n\n**Create your own exception types** for domain problems — a subclass of `Exception` costs two lines and makes error handling precise:\n\n```python\nclass InsufficientFundsError(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    if amount > balance:\n        raise InsufficientFundsError(f"balance {balance}, asked {amount}")\n    return balance - amount\n\n# caller catches exactly OUR error\nfrom banking import InsufficientFundsError\ntry:\n    withdraw(100, 500)\nexcept InsufficientFundsError as e:\n    print(f"Please deposit: {e}")\n```\n\n**Rules of thumb:**\n\n- Raise `ValueError` for bad argument *values*, `TypeError` for wrong *types*, `KeyError`/`IndexError` for missing data.\n- Use your own exception subclass when the failure has *domain* meaning (payment declined, record locked) — it lets callers catch that specific case without string-matching messages.\n- Don\'t raise exceptions for normal control flow — use them for genuinely exceptional situations.\n- Re-raise with `raise` alone (no argument) inside an except block to preserve the original traceback.\n\nA well-raised exception with a clear message is better documentation than any comment: `raise ValueError("price cannot be negative")` says exactly what is wrong and what to fix.',
        code: 'class NegativePriceError(Exception):\n    pass\n\ndef apply_discount(price, discount_pct):\n    if price < 0:\n        raise NegativePriceError(f"price {price} is negative")\n    return price * (1 - discount_pct / 100)\n\ntry:\n    print(apply_discount(200, 10))    # 180.0\n    print(apply_discount(-5, 10))\nexcept NegativePriceError as e:\n    print("Blocked:", e)',
        note: 'raise lets a function refuse a bad state loudly. Create exception subclasses for your domain so callers can catch precisely.',
      },
      {
        title: 'Robust Input Parsing & Error Strategy',
        text:
          'Real programs parse untrusted input constantly — and the #1 beginner error is crashing on bad input. The robust pattern is **loop-until-valid**:\n\n```python\ndef read_int(prompt="Enter a number: "):\n    while True:\n        try:\n            return int(input(prompt))\n        except ValueError:\n            print("Not a number — try again.")\n\nage = read_int(\"Your age: \")\n```\n\nThe try inside a loop keeps asking until success — no crash, no recursion, clean code.\n\n**A general rule for where to handle errors** — handle them as close to the user as makes sense:\n\n- **Parsing / validation layer** — catch the low-level errors (`ValueError`, `KeyError`) and translate them into friendly messages.\n- **Business logic** — let domain problems raise (your custom exceptions).\n- **Top level (main)** — a broad catch that logs the traceback and shows the user a generic "something went wrong" instead of a raw crash.\n\n```python\ndef main():\n    try:\n        run_app()\n    except Exception as e:\n        print(f"Sorry, something went wrong: {e}")\n        log_error(e)\n```\n\n**The EAFP vs LBYL distinction:** Python prefers EAFP — "Easier to Ask Forgiveness than Permission": try the thing, catch failure. The alternative LBYL — "Look Before You Leap" (`if os.path.exists(...) then open`) — has a race: the file can vanish between the check and the open. EAFP (`try: open` except) is both shorter and race-free.\n\nA solid exception strategy for a CLI tool (which Section 19 builds): validate inputs early with clear errors, use one safe parse helper, wrap the app entry point once, and let custom domain exceptions carry precise messages.',
        code: 'def read_int(prompt):\n    while True:\n        try:\n            return int(input(prompt))\n        except ValueError:\n            print("That is not a number. Try again.")\n\n# EAFP — race-free and shorter than checking first\ntry:\n    with open("config.json") as f:\n        data = f.read()\nexcept FileNotFoundError:\n    print("No config found — using defaults")\n    data = "{}"',
        note: 'Loop-until-valid for input, catch broad at the top level, raise custom exceptions in business logic. Prefer EAFP (try/except) over LBYL (pre-checks).',
      },
    ],
    quizzes: [
      {
        text: 'The correct structure to catch an error in Python is…',
        options: ['try / catch / finally', 'try / except / finally', 'attempt / rescue', 'try / handle'],
        correctAnswer: 'try / except / finally',
      },
      {
        text: '`int("abc")` raises which exception?',
        options: ['TypeError', 'ValueError', 'KeyError', 'ZeroDivisionError'],
        correctAnswer: 'ValueError',
      },
      {
        text: 'The block that ALWAYS runs whether or not an error occurred is…',
        options: ['try', 'except', 'else', 'finally'],
        correctAnswer: 'finally',
      },
      {
        text: 'Catching `Exception` also catches…',
        options: ['only the exact type', 'all its subclasses too', 'nothing else', 'only KeyboardInterrupt'],
        correctAnswer: 'all its subclasses too',
      },
      {
        text: 'Order of except clauses matters because…',
        options: ['the first match wins', 'the last match wins', 'Python picks randomly', 'order never matters'],
        correctAnswer: 'the first match wins',
      },
      {
        text: 'To make a function refuse invalid input loudly, you…',
        options: ['print a warning', 'raise an exception', 'return None', 'ignore it'],
        correctAnswer: 'raise an exception',
      },
      {
        text: 'A custom exception should…',
        options: ['subclass Exception', 'be a string', 'use print()', 'inherit from int'],
        correctAnswer: 'subclass Exception',
      },
      {
        text: 'EAFP stands for…',
        options: ['Everything And Files Processed', 'Easier to Ask Forgiveness than Permission', 'Errors Are Forbidden Principally', 'Except After Finally'],
        correctAnswer: 'Easier to Ask Forgiveness than Permission',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 12 — Introduction to OOP in Python
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 12,
    title: 'Introduction to OOP in Python',
    description:
      'Classes and objects, __init__, self, attributes and methods, and the four pillars that make OOP powerful.',
    topics: [
      {
        title: 'Classes, Objects & __init__',
        text:
          'A **class** is a blueprint; an **object** is a concrete instance built from it:\n\n```python\nclass Student:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def introduce(self):\n        return f"I am {self.name}, {self.age} years old"\n\navi = Student("Avi", 21)      # object — calls __init__\nprint(avi.introduce())\n```\n\nKey ideas:\n\n- **`class`** defines the blueprint. Convention: `CapitalCase` names.\n- **`__init__`** is the constructor — runs automatically when you create an object. Its job: set up the object\'s initial state. The **double underscores** mark it as a special method Python calls for you.\n- **`self`** is the object itself — the first parameter of every method, filled in automatically. Inside the class, `self.name` is "this object\'s name".\n- **Attributes** (`self.name`, `self.age`) are data; **methods** (`introduce`) are behaviour attached to the object.\n- Creating an object is **instantiation**: `Student("Avi", 21)` — the arguments map to `__init__`\'s parameters (minus `self`).\n\nWhy OOP? It **binds data with the behaviour that operates on it**. A `BankAccount` carries its own `balance` and its own `deposit`/`withdraw` methods — instead of scattered functions each needing the account passed in. Related state + related actions live together, which makes large programs far easier to organize and reason about.\n\nThe `__str__` special method makes objects print nicely:\n\n```python\ndef __str__(self):\n    return f"Student({self.name}, {self.age})"\n\nprint(avi)   # Student(Avi, 21) — instead of <__main__.Student object at ...>',
        code: 'class Book:\n    def __init__(self, title, author):\n        self.title = title\n        self.author = author\n\n    def __str__(self):\n        return f"{self.title} by {self.author}"\n\nb = Book("Atomic Habits", "James Clear")\nprint(b)                # uses __str__\nprint(b.title, b.author)',
        note: 'class = blueprint, object = instance. __init__ sets up state, self = the instance, __str__ controls printing.',
      },
      {
        title: 'Attributes, Methods & @property',
        text:
          'Objects carry **attributes** (data) and **methods** (behaviour). Two special method types make classes production-grade:\n\n**Class vs instance attributes:**\n\n```python\nclass Car:\n    wheels = 4          # class attribute — shared by ALL cars\n\n    def __init__(self, color):\n        self.color = color    # instance attribute — per car\n```\n\n`Car.wheels` is the same everywhere (read via `self.wheels`); `self.color` differs per instance. A common bug is mutating a class-level list from an instance — that mutates it for everyone.\n\n**`@property` — computed, protected attributes:**\n\n```python\nclass Rectangle:\n    def __init__(self, w, h):\n        self._w = w\n        self._h = h\n\n    @property\n    def area(self):\n        return self._w * self._h\n```\n\n`rect.area` reads like an attribute but is computed each time — and there is NO setter, so callers cannot corrupt it. The underscore (`_w`) is the Python convention for "private — treat as internal".\n\n**The setter version** adds validation:\n\n```python\nclass Account:\n    def __init__(self):\n        self._balance = 0\n\n    @property\n    def balance(self):\n        return self._balance\n\n    @balance.setter\n    def balance(self, value):\n        if value < 0:\n            raise ValueError("balance cannot be negative")\n        self._balance = value\n```\n\nNow `account.balance = -5` raises instead of silently corrupting state. Setters centralize validation at the one place state changes.\n\nThe `@` marks a **decorator** (Section 13) — here it registers the method with Python\'s property machinery. Property is how Python does "smart attributes": plain attribute syntax, but with computed values, validation, and read-only enforcement.',
        code: 'class BankAccount:\n    def __init__(self, owner):\n        self.owner = owner\n        self._balance = 0\n\n    @property\n    def balance(self):\n        return self._balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("positive only")\n        self._balance += amount\n\nacc = BankAccount("Avi")\nacc.deposit(500)\nprint(acc.balance)          # 500 (read-only property)\n# acc.balance = 100  → AttributeError: no setter',
        note: '@property gives computed/read-only attributes with attribute syntax; the setter adds validation. _name = "private" by convention.',
      },
      {
        title: 'Inheritance & Method Overriding',
        text:
          '**Inheritance** lets a class reuse and extend another: the child ("subclass") gets everything from the parent ("base class"), then adds or changes what it needs:\n\n```python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return f"{self.name} makes a sound"\n\nclass Dog(Animal):\n    def speak(self):            # OVERRIDE the parent version\n        return f"{self.name} barks!"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} meows!"\n\nd = Dog("Rex")\nc = Cat("Whiskers")\nprint(d.speak(), c.speak())\n```\n\nBoth `Dog` and `Cat` inherit `__init__` and `name` from `Animal`, but each **overrides** `speak` with its own behaviour. Same method name, different results per class — that is **polymorphism**: code that calls `.speak()` works on any Animal without knowing which kind.\n\n**The super() hook** — child `__init__` that wants the parent\'s setup:\n\n```python\nclass Vehicle:\n    def __init__(self, wheels):\n        self.wheels = wheels\n\nclass Car(Vehicle):\n    def __init__(self, brand):\n        super().__init__(wheels=4)\n        self.brand = brand\n```\n\n`super().__init__(...)` calls the parent constructor, then the child adds its own fields. Forget `super()` and parent setup silently never runs.\n\n**isinstance / issubclass** check the relationship at runtime: `isinstance(d, Animal)` → True.\n\nInheritance is for **"is-a"** relationships (a Dog IS an Animal). If the relationship is "has-a" (a Car HAS an engine), use composition — an attribute holding another object. Overusing inheritance creates brittle class pyramids; preferring composition is a hallmark of experienced design.',
        code: 'class Shape:\n    def __init__(self, name):\n        self.name = name\n    def area(self):\n        return 0\n\nclass Square(Shape):\n    def __init__(self, side):\n        super().__init__("square")\n        self.side = side\n    def area(self):\n        return self.side ** 2\n\nclass Circle(Shape):\n    def __init__(self, r):\n        super().__init__("circle")\n        self.r = r\n    def area(self):\n        return 3.14159 * self.r ** 2\n\nfor s in [Square(3), Circle(2)]:\n    print(f"{s.name}: {s.area():.2f}")   # polymorphism',
        note: 'Inheritance = "is-a" (Dog IS an Animal). Override methods per subclass; call super().__init__() in child constructors. Prefer composition for "has-a".',
      },
      {
        title: 'Encapsulation & OOP Design Principles',
        text:
          'The four pillars of OOP — and what they mean in Python:\n\n**1. Encapsulation** — bundle data with the methods that operate on it, and keep internal state controlled. Python achieves this by *convention*:\n\n- `name` — public\n- `_name` — "protected": internal, don\'t touch from outside\n- `__name` — name-mangled: still accessible but strongly private\n\nPython does NOT enforce privacy (there is no `private` keyword) — it relies on trust and convention. The underscore tells readers "internal detail".\n\n**2. Abstraction** — expose a clean interface, hide the messy details. A `BankAccount.deposit()` hides whether the balance is stored in a list, a dict, or a file — callers don\'t care.\n\n**3. Inheritance** — reuse and extend (previous topic).\n\n**4. Polymorphism** — the same interface, different implementations (`.speak()` on Dog vs Cat).\n\n**Design principles that make or break OOP code:**\n\n- **Single Responsibility** — one class, one job. A class doing validation + storage + UI is three classes.\n- **Prefer composition over inheritance** — `Car has an Engine` is usually better than `Car IS-A Vehicle` when the relationship is containment.\n- **Program to interfaces** — call methods, not concrete classes. Code that says `for shape in shapes: shape.area()` works for ANY shape now and in the future.\n- **Keep classes small and focused** — same rule as functions. If a class needs a paragraph to describe, split it.\n\nReal codebases are not class-heavy for the sake of it — OOP shines when you have *multiple kinds of the same thing* (shapes, accounts, notifications) with shared behaviour and distinct variations. Use it where it earns its keep, and plain functions where it doesn\'t.',
        code: 'class Notifier:\n    def send(self, message):\n        raise NotImplementedError\n\nclass EmailNotifier(Notifier):\n    def send(self, message):\n        print(f"[email] {message}")\n\nclass SmsNotifier(Notifier):\n    def send(self, message):\n        print(f"[sms] {message}")\n\n# program to the interface — works with any Notifier\nfor n in [EmailNotifier(), SmsNotifier()]:\n    n.send("payment received")',
        note: 'Encapsulation via _ / __ convention, abstraction via clean interfaces, polymorphism via method overriding. One class = one job.',
      },
    ],
    quizzes: [
      {
        text: 'The `__init__` method…',
        options: ['is called automatically when an object is created', 'must be called manually', 'deletes an object', 'only exists in Java'],
        correctAnswer: 'is called automatically when an object is created',
      },
      {
        text: 'In `def introduce(self):`, `self` refers to…',
        options: ['the class', 'the current object instance', 'the parent class', 'a global'],
        correctAnswer: 'the current object instance',
      },
      {
        text: '`@property` lets you…',
        options: ['delete an attribute', 'expose a computed value with attribute syntax and no setter', 'create a class', 'import modules'],
        correctAnswer: 'expose a computed value with attribute syntax and no setter',
      },
      {
        text: '`class Dog(Animal):` means…',
        options: ['Dog contains an Animal', 'Dog inherits from Animal', 'Dog is a copy of Animal', 'Animal inherits from Dog'],
        correctAnswer: 'Dog inherits from Animal',
      },
      {
        text: 'A child __init__ that wants the parent\'s setup should call…',
        options: ['parent.__init__()', 'super().__init__(...)', 'self.parent()', 'nothing'],
        correctAnswer: 'super().__init__(...)',
      },
      {
        text: 'The underscore prefix in `self._balance` means…',
        options: ['it is a secret password', '"internal by convention — don\'t touch from outside"', 'it is deleted', 'it is a property'],
        correctAnswer: '"internal by convention — don\'t touch from outside"',
      },
      {
        text: 'Polymorphism means…',
        options: ['one method name, different implementations per class', 'a class with many methods', 'private attributes', 'classes that never change'],
        correctAnswer: 'one method name, different implementations per class',
      },
      {
        text: 'For a "has-a" relationship (Car HAS an engine), prefer…',
        options: ['deep inheritance', 'composition — an attribute holding the other object', 'global variables', 'copy-paste'],
        correctAnswer: 'composition — an attribute holding the other object',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 13 — Modules, Packages & Pip
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 13,
    title: 'Modules, Packages & Pip',
    description:
      'Organizing code into modules and packages, importing, the standard library, and installing third-party tools with pip.',
    topics: [
      {
        title: 'Modules & the import Statement',
        text:
          'A **module** is just a `.py` file. Its names (functions, classes, variables) become available to other files via `import`:\n\n```python\n# utils.py\ndef add_tax(price, pct=18):\n    return price * (1 + pct / 100)\n```\n\n```python\n# main.py\nimport utils\nprint(utils.add_tax(100))          # 118.0\n\nfrom utils import add_tax\nprint(add_tax(100))                # direct name\n\nfrom utils import add_tax as tax   # renamed\nprint(tax(100))\n```\n\nThree import forms:\n\n- `import utils` — access as `utils.add_tax`. Keeps namespaces clear.\n- `from utils import add_tax` — brings the name in directly. Convenient, but can collide.\n- `import utils as u` — shorter alias, common for big libraries (`import pandas as pd`).\n\nWhen Python runs a module, it executes it **once**, top to bottom, and caches it — subsequent imports are cheap (no re-execution).\n\nThe famous **`if __name__ == "__main__":`** guard:\n\n```python\n# tool.py\ndef main():\n    print("running the tool")\n\nif __name__ == "__main__":\n    main()\n```\n\nWhen you RUN `python tool.py`, `__name__` is `"__main__"` and `main()` runs. When another file does `import tool`, `__name__` is `"tool"` and `main()` does NOT run — the import just defines the function. This guard is what lets a file be both a script and a reusable module — every real Python file should have it.\n\nModules are the first step of "don\'t repeat yourself": shared helpers in one file, imported everywhere.',
        code: '# greeting.py\ndef hello(name):\n    return f"Hello, {name}!"\n\nif __name__ == "__main__":\n    print(hello("world"))\n\n# --- in another file ---\n# import greeting\n# print(greeting.hello("Avi"))\n\nimport greeting\nprint(greeting.hello("Avi"))      # works: module import',
        note: 'A module is a .py file. Use `if __name__ == "__main__":` so a file runs as a script OR imports cleanly.',
      },
      {
        title: 'Packages & the Standard Library',
        text:
          'A **package** is a folder of modules (with an `__init__.py` marking it as a package):\n\n```\nmyapp/\n├── __init__.py      # marks the folder as a package\n├── utils.py\n├── models/\n│   ├── __init__.py\n│   ├── user.py\n│   └── order.py\n```\n\nImport with dots for the path: `from myapp.models.user import User`. The dot separates package levels — `from package.sub.module import name`.\n\nThe **standard library** is the crown jewel of Python — "batteries included". The modules you will reach for constantly:\n\n- **`os` / `pathlib`** — filesystem, paths (Section 16).\n- **`json`** — read/write JSON (Section 17).\n- **`csv`** — read/write CSV files.\n- **`datetime`** — dates and times.\n- **`collections`** — `Counter`, `defaultdict`, `namedtuple` (Section 9).\n- **`random`** — random numbers and shuffles.\n- **`math`** — math functions (`sqrt`, `ceil`, `floor`).\n- **`re`** — regular expressions (Section 16).\n- **`sys`** — command-line arguments (`sys.argv`) and exit codes.\n- **`argparse`** — professional CLI argument parsing (Section 19).\n- **`urllib` / `http`** — network access without third-party libs.\n- **`statistics`** — mean, median, mode.\n\nNothing to install — the stdlib ships with Python. Before you `pip install` anything, ask "does the standard library already do this?" Often it does, and you avoid a dependency.\n\nGood habits: import stdlib modules at the top of the file (PEP 8), group them (stdlib, then third-party, then your own), and never `from module import *` — it pollutes the namespace and hides where names come from.',
        code: 'import json\nfrom collections import Counter\nimport random\nimport math\n\nprint(math.floor(3.7))          # 3\nprint(random.choice(["a", "b"]))  # random pick\nprint(Counter("aabbb"))         # Counter({\'b\': 3, \'a\': 2})\n\ndata = {"name": "Avi", "age": 21}\nprint(json.dumps(data))         # JSON string',
        note: 'Packages = folders of modules with __init__.py. The stdlib covers most needs — check it before pip install.',
      },
      {
        title: 'pip: Installing Third-Party Packages',
        text:
          '**pip** is Python\'s package installer — it fetches packages from PyPI (the Python Package Index) and manages them for you:\n\n```bash\npip install requests          # install the latest\npip install "pandas==2.1.0"   # a specific version\npip install "flask>=2.0"      # a minimum version\npip uninstall requests        # remove\npip list                      # what is installed\n```\n\nThe dependency list lives in **`requirements.txt`**:\n\n```\nrequests==2.31.0\npandas==2.1.0\nflask==2.3.3\n```\n\nPin exact versions so every environment gets identical packages. Install everything with one command: `pip install -r requirements.txt`. Freeze your current environment into a file: `pip freeze > requirements.txt`.\n\n**The virtual environment** is non-negotiable for real projects. `pip` installs packages system-wide by default — dangerous (breaks other projects, needs admin). A **venv** isolates a project\'s packages in a folder:\n\n```bash\npython -m venv venv          # create\nsource venv/bin/activate     # activate (Linux/macOS)\nvenv\\Scripts\\activate        # activate (Windows)\npip install -r requirements.txt   # install INSIDE the venv\n```\n\nWith the venv active, `python` and `pip` refer to the project\'s own isolated copies. Your terminal prompt shows `(venv)` when active.\n\n**Choosing packages responsibly:**\n\n- Prefer well-known, actively maintained libraries (check download counts and last release).\n- Prefer the stdlib first, then a battle-tested library over a trendy one.\n- Understand what a package does before installing — a tiny unmaintained package can be a supply-chain risk.\n\nThe workflow every Python developer runs: create venv → `pip install -r requirements.txt` → code → freeze the updated list when you add a dependency. Get this loop right and environments stop being a source of bugs.',
        code: '# Terminal session:\n#   python -m venv venv\n#   source venv/bin/activate\n#   (venv) $ pip install -r requirements.txt\n#\n# requirements.txt:\n#   requests==2.31.0\n#   pandas==2.1.0\n\nimport requests\nr = requests.get("https://api.github.com")\nprint(r.status_code)          # 200',
        note: 'pip installs from PyPI; pin versions in requirements.txt. Always work inside a virtual environment (venv) to isolate dependencies.',
      },
      {
        title: 'Decorators: @staticmethod, @classmethod & Custom',
        text:
          'A **decorator** is a function that wraps another function, adding behaviour — written with the `@` symbol above the definition:\n\n```python\nimport time\n\ndef timed(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} took {time.time() - start:.3f}s")\n        return result\n    return wrapper\n\n@timed\ndef slow_add(a, b):\n    time.sleep(0.1)\n    return a + b\n\nprint(slow_add(1, 2))    # slow_add took 0.100s  then  3\n```\n\nThe decorator replaces `slow_add` with `wrapper` — every call is now timed. Decorators are "code that runs around other code": logging, timing, auth checks, retries.\n\n**Built-in decorators you use daily in classes:**\n\n- **`@property`** — computed/read-only attributes (Section 12).\n- **`@staticmethod`** — a method that needs neither `self` nor the class; a plain function parked inside the class for organization:\n\n```python\nclass MathUtils:\n    @staticmethod\n    def is_even(n):\n        return n % 2 == 0\n\nMathUtils.is_even(4)     # True — no instance needed\n```\n\n- **`@classmethod`** — a method that receives the CLASS (`cls`) instead of an instance — used for alternative constructors:\n\n```python\nclass Date:\n    def __init__(self, year, month, day):\n        self.year, self.month, self.day = year, month, day\n\n    @classmethod\n    def from_string(cls, text):\n        y, m, d = map(int, text.split("-"))\n        return cls(y, m, d)     # builds a Date\n\nd = Date.from_string("2026-08-11")   # a Date, no instance yet\n```\n\nRead decorator syntax top-down: the decorator is applied at definition time, once, not per-call. Understanding decorators unlocks half of professional Python — Flask\'s routes (`@app.route`), pytest\'s fixtures, and most frameworks are decorator-driven.',
        code: 'def shout(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper() + "!"\n    return wrapper\n\n@shout\ndef greet(name):\n    return f"hello {name}"\n\nprint(greet("avi"))     # HELLO AVI!\n\nclass MathUtils:\n    @staticmethod\n    def is_even(n):\n        return n % 2 == 0\n\nprint(MathUtils.is_even(8))   # True',
        note: '@decorator wraps a function to add behaviour. @staticmethod for class-organized helpers, @classmethod for alternative constructors.',
      },
    ],
    quizzes: [
      {
        text: 'A module is…',
        options: ['a .py file', 'a folder', 'an installed library', 'a package'],
        correctAnswer: 'a .py file',
      },
      {
        text: '`if __name__ == "__main__":` ensures…',
        options: ['the file runs only when executed directly, not when imported', 'the file is encrypted', 'import fails', 'only one import'],
        correctAnswer: 'the file runs only when executed directly, not when imported',
      },
      {
        text: 'A package is…',
        options: ['a folder of modules with __init__.py', 'a single function', 'a requirements file', 'a zip archive'],
        correctAnswer: 'a folder of modules with __init__.py',
      },
      {
        text: '`from myapp.models.user import User` — the dots represent…',
        options: ['file extensions', 'package/module nesting levels', 'versions', 'nothing'],
        correctAnswer: 'package/module nesting levels',
      },
      {
        text: 'Which is part of the STANDARD library?',
        options: ['pandas', 'requests', 'json', 'flask'],
        correctAnswer: 'json',
      },
      {
        text: 'The command to install packages listed in requirements.txt is…',
        options: ['npm install', 'pip install -r requirements.txt', 'python setup.py', 'pip freeze'],
        correctAnswer: 'pip install -r requirements.txt',
      },
      {
        text: 'A virtual environment is used to…',
        options: ['speed up Python', 'isolate a project\'s dependencies', 'compile code', 'encrypt packages'],
        correctAnswer: 'isolate a project\'s dependencies',
      },
      {
        text: 'A decorator (`@timed`)…',
        options: ['wraps a function to add behaviour', 'deletes a function', 'renames a function', 'imports a function'],
        correctAnswer: 'wraps a function to add behaviour',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 14 — Data Analysis with Pandas
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 14,
    title: 'Data Analysis with Pandas',
    description:
      'The DataFrame, loading and inspecting data, selecting, filtering and grouping — the pandas toolkit for real analysis.',
    topics: [
      {
        title: 'What is Pandas & the DataFrame',
        text:
          '**Pandas** is the Python library for tabular data — it turns a spreadsheet-like structure into a blazing-fast, queryable object. Install: `pip install pandas`; import convention: `import pandas as pd`.\n\nThe two core structures:\n\n- **`Series`** — one labelled column of data (like a dict/list hybrid).\n- **`DataFrame`** — a table of labelled rows and columns. Think "Excel sheet in memory".\n\nCreating a DataFrame:\n\n```python\nimport pandas as pd\n\nscores = pd.DataFrame({\n    "name": ["Avi", "Riya", "Sam"],\n    "score": [92, 88, 95],\n    "passed": [True, True, True],\n})\n```\n\nEach dict key becomes a column; values align by row.\n\n**Loading real data** is where pandas shines — one call reads a file into a DataFrame:\n\n```python\ndf = pd.read_csv("students.csv\")\n# also: pd.read_excel(...), pd.read_json(...), pd.read_sql(...)\n```\n\nThe workhorse is **CSV** (Section 16 files), and `read_csv` handles headers, types, and missing values automatically.\n\nKey concepts to meet right away:\n\n- The **index** — row labels (default 0,1,2…).\n- Columns are accessed like dict keys: `df["score"]`.\n- DataFrames are **column-oriented** — operations usually run down columns.\n\nWhy pandas exists: manual loops over rows are slow and verbose. Pandas executes operations in C under the hood, so `df["score"].mean()` on a million rows is instant. Most of the data-analysis skills you need (selecting, filtering, grouping) are one-line pandas calls — Sections 14-15 build exactly that toolkit.',
        code: 'import pandas as pd\n\nscores = pd.DataFrame({\n    "name": ["Avi", "Riya", "Sam"],\n    "score": [92, 88, 95],\n})\n\nprint(scores)\nprint(scores.shape)        # (3, 2) rows, cols\nprint(scores.columns)      # Index([\'name\', \'score\'])\nprint(scores["score"].mean())   # 91.67',
        note: 'import pandas as pd. DataFrame = in-memory Excel sheet. read_csv loads files; operations run down columns.',
      },
      {
        title: 'Inspecting Data: head, info & describe',
        text:
          'Before analyzing, **inspect** — know what you are working with. Pandas gives you one-liners for the full picture:\n\n**`head(n)` / `tail(n)`** — first / last rows (default 5). The first thing you run on any new dataset:\n\n```python\nprint(df.head())\nprint(df.tail(3))\n```\n\n**`info()`** — a summary of structure and types:\n\n```python\ndf.info()\n# <class \'pandas.core.frame.DataFrame\'>\n# RangeIndex: 5 entries\n# Columns: 3, dtypes: int64(2), object(1)\n# memory usage: ~400 bytes\n```\n\nIt reveals columns, non-null counts (→ missing values!), and data types.\n\n**`describe()`** — the instant statistical summary for numeric columns:\n\n```python\ndf.describe()\n#        score\n# count   5.0\n# mean   90.0\n# std     3.0\n# min    85.0\n# 25%    88.0\n# 50%    90.0\n# 75%    92.0\n# max    95.0\n```\n\ncount, mean, std, min, quartiles, max — the shape of every numeric column in one call.\n\n**Missing-value reconnaissance**: `df.isnull().sum()` counts NaNs per column. `df["col"].value_counts()` shows distribution of a categorical column — "how many per category" — endlessly useful.\n\n**`shape` / `dtypes`** round it out: `df.shape` is `(rows, columns)`; `df.dtypes` lists column types.\n\nThe golden habit: every new dataset starts with `df.head()`, `df.info()`, `df.describe()`. These three reveal structure, types, missing data, and ranges before you write a single analysis line — and they catch most data-loading bugs instantly.',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({"city": ["Pune", "Delhi", "Pune"], "temp": [31, 40, 29]})\n\nprint(df.head(2))\nprint(df["city"].value_counts())   # Pune 2, Delhi 1\nprint(df["temp"].mean())           # 33.33\nprint(df.isnull().sum())           # missing per column',
        note: 'head() to see it, info() for structure/types, describe() for stats, isnull().sum() for missing data, value_counts() for distributions.',
      },
      {
        title: 'Selecting, Filtering & Sorting',
        text:
          'Getting the data you need out of a DataFrame — three operations cover 90% of selection work:\n\n**1. Selecting columns:**\n\n```python\nnames = df["name\"]            # one column → Series\nsubset = df[["name", "score"]]  # several → DataFrame\n```\n\n**2. Filtering rows by condition** — a boolean condition selects matching rows:\n\n```python\npassed = df[df["score"] >= 90]\nhigh = df[(df["score"] >= 90) & (df["name"].str.startswith("A"))]\n```\n\nNote the syntax: the condition itself (`df["score"] >= 90`) is a Series of True/False, and `df[condition]` keeps the True rows. Combine conditions with `&` (and), `|` (or), `~` (not) — each in parentheses.\n\nCommon condition helpers:\n\n- `df["score"] >= 90` — numeric comparison\n- `df["city"] == "Pune"` — exact match\n- `df["city"].isin(["Pune", "Delhi"])` — membership in a list\n- `df["name"].str.contains("vi")` — substring\n\n**3. Sorting:**\n\n```python\ntop = df.sort_values("score", ascending=False)\n```\n\n**Chaining** builds the full pipeline:\n\n```python\ntop_students = (df[df["score"] >= 90]\n                  .sort_values("score", ascending=False)\n                  .head(3))\n```\n\nThe mental model: each step takes a DataFrame and returns a DataFrame, so you string them together like a sentence. This "filter → sort → take top N" chain is the single most repeated pattern in data work — it is how every "show me the top..." question gets answered.',
        code: 'import pandas as pd\n\ndf = pd.DataFrame({"name": ["Avi", "Riya", "Sam"], "score": [92, 88, 95]})\n\nprint(df["score"])                      # one column\nprint(df[df["score"] >= 90])            # filter rows\nprint(df[(df["score"] >= 90) & (df["name"].str.startswith("A"))])\nprint(df.sort_values("score", ascending=False).head(2))',
        note: 'df[col] selects, df[condition] filters rows (use & / | for combos), sort_values orders. Chain them for read-process-output.',
      },
      {
        title: 'Grouping & Aggregating with groupby',
        text:
          'The single most powerful pandas operation: **`groupby`** — split data into groups by a column, compute something per group, combine the results:\n\n```python\nsales = pd.DataFrame({\n    "region": ["North", "South", "North", "South", "North"],\n    "amount": [100, 200, 150, 250, 300],\n})\n\nprint(sales.groupby("region")["amount"].sum())\n# region\n# North    550\n# South    450\n```\n\nRead it as a sentence: "group by region, take the amount column, sum it per group."\n\n**Aggregations** you can apply per group: `sum`, `mean`, `count`, `min`, `max`, `median`, `std`.\n\n**Multiple aggregates at once** — `agg` with a list:\n\n```python\nsales.groupby("region")["amount"].agg(["sum", "mean", "count"])\n```\n\n**Multiple columns** — pick several:\n\n```python\ndf.groupby("region")[["amount", "units"]].sum()\n```\n\n**Grouping by multiple keys** — pass a list:\n\n```python\ndf.groupby(["region", "product"])["amount"].sum()\n```\n\nThe result is a DataFrame indexed by the group keys — `reset_index()` turns them back into plain columns if you want.\n\n**The pivot_table** is groupby\'s cousin for cross-tab views:\n\n```python\npd.pivot_table(df, values="amount", index="region", columns="product", aggfunc="sum")\n```\n\n"Total amount per region per product" — a two-dimensional summary table in one line.\n\n**Real-world shape of analysis:** load data → clean → `groupby(...).agg(...)` to answer "how much / how many per category" → filter/sort the results → export. If you can answer "per WHAT, WHAT number, HOW computed", you have just described the groupby call.',
        code: 'import pandas as pd\n\nsales = pd.DataFrame({\n    "region": ["North", "South", "North", "South"],\n    "product": ["A", "A", "B", "B"],\n    "amount": [100, 200, 150, 250],\n})\n\nprint(sales.groupby("region")["amount"].sum())\nprint(sales.groupby("region")["amount"].agg(["sum", "mean"]))\nprint(pd.pivot_table(sales, values="amount", index="region", columns="product", aggfunc="sum"))',
        note: 'groupby(column)[values].agg(functions) = "per X, what Y, how". pivot_table makes 2D cross-tabs. The heart of analysis.',
      },
    ],
    quizzes: [
      {
        text: 'The standard import alias for pandas is…',
        options: ['import pandas as pd', 'import pandas', 'from pandas import *', 'import p as pandas'],
        correctAnswer: 'import pandas as pd',
      },
      {
        text: 'A DataFrame is best described as…',
        options: ['a one-column series', 'a labelled table of rows and columns', 'a JSON file', 'a function'],
        correctAnswer: 'a labelled table of rows and columns',
      },
      {
        text: 'The one-liner that loads a CSV into a DataFrame is…',
        options: ['open("f.csv")', 'pd.read_csv("f.csv")', 'csv.load("f.csv")', 'pd.open("f.csv")'],
        correctAnswer: 'pd.read_csv("f.csv")',
      },
      {
        text: '`df.describe()` returns…',
        options: ['the first 5 rows', 'summary statistics (count, mean, std, quartiles)', 'column names', 'missing values only'],
        correctAnswer: 'summary statistics (count, mean, std, quartiles)',
      },
      {
        text: '`df.info()` tells you…',
        options: ['column names, types, and non-null counts', 'the full data', 'sorted rows', 'nothing'],
        correctAnswer: 'column names, types, and non-null counts',
      },
      {
        text: '`df[df["score"] >= 90]` …',
        options: ['keeps rows where the condition is True', 'drops the score column', 'sorts by score', 'is a syntax error'],
        correctAnswer: 'keeps rows where the condition is True',
      },
      {
        text: 'To combine two filter conditions with "and", use…',
        options: ['and', '&', '+', '&&'],
        correctAnswer: '&',
      },
      {
        text: '`sales.groupby("region")["amount"].sum()` means…',
        options: ['sort by amount', 'sum the amount per region group', 'count rows', 'merge regions'],
        correctAnswer: 'sum the amount per region group',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 15 — Data Visualization with Matplotlib
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 15,
    title: 'Data Visualization with Matplotlib',
    description:
      'Turning data into charts: line, bar and scatter plots, customizing figures, and the pandas shortcut .plot().',
    topics: [
      {
        title: 'Plotting Basics: plt.plot & plt.show',
        text:
          '**Matplotlib** is the foundational plotting library (pandas uses it under the hood). Convention: `import matplotlib.pyplot as plt`.\n\nThe minimal line plot:\n\n```python\nimport matplotlib.pyplot as plt\n\nweeks = [1, 2, 3, 4, 5]\nscores = [60, 75, 82, 90, 95]\n\nplt.plot(weeks, scores)\nplt.xlabel("Week")\nplt.ylabel("Score")\nplt.title("Progress over the course")\nplt.show()\n```\n\nHow it works — the **stateful** model: every `plt.*` call affects the current figure, and `plt.show()` displays it. You build the picture piece by piece, then render.\n\nKey customizations:\n\n- `marker="o"` — dots at data points.\n- `color="red"` / `color="crimson"` — line colour.\n- `linestyle="--"` — dashed line.\n- `label="Python"` + `plt.legend()` — named series (multi-line comparisons).\n\n```python\nplt.plot(weeks, scores, marker="o", linestyle="--", label="Math")\nplt.plot(weeks, [70, 72, 78, 80, 85], marker="s", label="Python")\nplt.legend()\n```\n\n**Saving instead of showing** (crucial in scripts and servers without a screen):\n\n```python\nplt.savefig("progress.png\", dpi=150)\n```\n\nNote: `savefig` must run BEFORE `show()` — `show()` clears the figure. In Jupyter, plots render inline automatically; `plt.show()` is still fine.\n\nThe pattern never varies: build with `plt.*` → label the axes → `show()` or `savefig()`. Matplotlib\'s power is the fine control; the trick is to use 5% of it 95% of the time.',
        code: 'import matplotlib.pyplot as plt\n\nx = [1, 2, 3, 4]\ny = [10, 20, 15, 30]\n\nplt.plot(x, y, marker="o", linestyle="--", color="teal")\nplt.xlabel("X axis")\nplt.ylabel("Y axis")\nplt.title("Simple line plot")\nplt.grid(True)\nplt.show()  # or plt.savefig("plot.png") before show()',
        note: 'import matplotlib.pyplot as plt. Build with plt.* calls, then show() (or savefig BEFORE show — show clears the figure).',
      },
      {
        title: 'Bar Charts & Histograms',
        text:
          'Two chart types answer most categorical questions:\n\n**Bar chart** — compare values across categories. `plt.bar(x, height)`:\n\n```python\ncities = ["Pune", "Delhi", "Mumbai", "Chennai"]\npopulation_m = [3.1, 16.8, 12.4, 4.6]\n\nplt.bar(cities, population_m, color="steelblue")\nplt.ylabel("Population (millions)")\nplt.title("City populations")\nplt.show()\n```\n\nWith a pandas category column:\n\n```python\nimport pandas as pd\nsales = pd.DataFrame({\"city\": [\"Pune\", \"Delhi\", \"Pune\"], \"amount\": [100, 200, 150]})\nsummary = sales.groupby("city")[\"amount\"].sum()\nsummary.plot(kind=\"bar\")\n```\n\n**Histogram** — show the *distribution* of a numeric column; it counts how many values fall in each range bucket. `plt.hist(values, bins)`:\n\n```python\nimport random\nscores = [random.gauss(75, 10) for _ in range(300)]\n\nplt.hist(scores, bins=15, edgecolor="white\")\nplt.xlabel("Score\")\nplt.ylabel(\"Frequency\")\nplt.title(\"Distribution of scores\")\nplt.show()\n```\n\n`bins` controls bucket granularity — too few hides detail, too many looks noisy. Start with `bins=10-20`.\n\n**When to use which:**\n\n- Categories on the x-axis (cities, products, regions) → **bar**. Horizontal `barh` for long category names.\n- "How is a numeric column distributed?" (ages, scores, prices) → **histogram**.\n- Two numeric series against each other → scatter (next topic).\n\nThe `df.plot(kind=...)` shortcut — pandas passes a DataFrame straight to matplotlib with `kind="bar"`, `"hist"`, `"line"`, `"scatter"`, `"pie"` — one line from DataFrame to chart, using the column names as labels automatically.',
        code: 'import matplotlib.pyplot as plt\nimport pandas as pd\n\ncities = ["Pune", "Delhi", "Mumbai"]\npop = [3.1, 16.8, 12.4]\nplt.bar(cities, pop, color="steelblue")\nplt.title("City populations")\nplt.show()\n\n# pandas shortcut\nsales = pd.DataFrame({"city": ["Pune", "Delhi", "Pune"], "amount": [100, 200, 150]})\nsales.groupby("city")["amount"].sum().plot(kind="bar")\nplt.show()',
        note: 'Bar = compare categories. Histogram (plt.hist) = distribution of one numeric column. pandas .plot(kind="bar") is the fast route.',
      },
      {
        title: 'Scatter Plots & Correlations',
        text:
          'A **scatter plot** shows the relationship between TWO numeric variables — one point per row:\n\n```python\nimport matplotlib.pyplot as plt\n\nhours = [2, 3, 4, 5, 6, 7]\nscores = [55, 62, 70, 78, 85, 88]\n\nplt.scatter(hours, scores)\nplt.xlabel("Study hours per day")\nplt.ylabel("Exam score")\nplt.show()\n```\n\nReading scatter patterns:\n\n- **Upward trend** → positive relationship (more hours, higher scores).\n- **Downward trend** → negative relationship.\n- **Cloud with no pattern** → no relationship.\n- **Tight vs spread** → strong vs weak relationship.\n\n**The numeric twin** — correlation coefficient with pandas:\n\n```python\nimport pandas as pd\ndf = pd.DataFrame({"hours": hours, "scores": scores})\nprint(df.corr())   # 0.99 → very strong positive\n```\n\n`corr()` ranges from -1 (perfect negative) to +1 (perfect positive); ~0 means no linear relationship. Plotting + `corr()` together is how you verify "are these two things actually related?"\n\n**Visuals that reveal more:**\n\n- `s=` — point size, optionally tied to a third variable: `plt.scatter(x, y, s=df["weight"] * 10)` (bubble chart).\n- `c=` — point colour by a third variable (scatter with a colour scale).\n- `alpha=0.5` — transparency for overlapping points (overplotting).\n\n**With pandas** directly: `df.plot(kind="scatter", x="hours", y="scores")`.\n\nThe workflow for "are X and Y related?": scatter plot it first (see the shape), then `df.corr()` (measure it). Charts are for humans, numbers are for decisions — but you start with the chart.',
        code: 'import matplotlib.pyplot as plt\nimport pandas as pd\n\ndf = pd.DataFrame({\n    "hours": [2, 3, 4, 5, 6],\n    "scores": [55, 62, 70, 78, 85],\n})\n\nplt.scatter(df["hours"], df["scores"])\nplt.xlabel("Study hours")\nplt.ylabel("Score")\nplt.show()\n\nprint(df.corr())   # ≈ 0.998 — strong positive',
        note: 'Scatter shows the relationship between two numeric columns. df.corr() measures it (-1..+1). Plot first, quantify second.',
      },
      {
        title: 'Subplots & Figure Customization',
        text:
          'One figure, several charts side by side — **subplots** — turns a report into a dashboard:\n\n```python\nimport matplotlib.pyplot as plt\n\nfig, axes = plt.subplots(1, 2, figsize=(10, 4))   # 1 row, 2 columns\n\naxes[0].plot([1, 2, 3], [1, 4, 9])\naxes[0].set_title("Line")\n\naxes[1].bar(["a", "b"], [3, 5])\naxes[1].set_title("Bar")\n\nplt.tight_layout()\nplt.show()\n```\n\n`plt.subplots(nrows, ncols)` returns a **figure** and an array of **axes**. Once you have axes, you call methods on them (`ax.plot`, `ax.set_title`, `ax.set_xlabel`) instead of the global `plt.*` — the object-oriented style. This is the pattern professional notebooks use.\n\n**Grid layouts:** `plt.subplots(2, 2, figsize=(8, 8))` gives 2×2; index them `axes[0][0]`, `axes[0][1]`, etc.\n\n**Figure-level customization:**\n\n- `figsize=(width, height)` — inches, set at creation. Controls how big the whole figure renders.\n- `fig.suptitle("...")` — overall title above all subplots.\n- `plt.tight_layout()` — fixes overlapping labels between subplots.\n- `fig.savefig("dashboard.png", dpi=150)` — high-res export.\n\n**Styles** — instant professional look:\n\n```python\nplt.style.use("ggplot\")\n# or "seaborn-v0_8", "fivethirtyeight", "dark_background"\n```\n\nSet it once at the top of a notebook; every following chart inherits it.\n\nThe rule: one-figure-per-chart with `plt.plot` is fine for quick looks; anything you will **show or report** deserves subplots + figure/axes methods. The axes-methods style (`ax.plot(...)`) is also the only style that scales to dashboards — start practicing it early.',
        code: 'import matplotlib.pyplot as plt\n\nplt.style.use("seaborn-v0_8")\n\nfig, axes = plt.subplots(1, 2, figsize=(9, 4))\n\naxes[0].plot([1, 2, 3], [1, 4, 9], marker="o")\naxes[0].set_title("Quadratic")\n\naxes[1].bar(["A", "B", "C"], [3, 5, 2])\naxes[1].set_title("Counts")\n\nplt.tight_layout()\nfig.suptitle("Two-panel dashboard")\nplt.show()',
        note: 'subplots(nrows, ncols) → fig + axes array. Call methods on axes (ax.plot) for the scalable style. styles & figsize for polish.',
      },
    ],
    quizzes: [
      {
        text: 'The standard import for plotting is…',
        options: ['import matplotlib.pyplot as plt', 'import plot as plt', 'import chartlib', 'import pandas'],
        correctAnswer: 'import matplotlib.pyplot as plt',
      },
      {
        text: 'To display a completed plot, call…',
        options: ['plt.render()', 'plt.show()', 'plt.display()', 'plt.export()'],
        correctAnswer: 'plt.show()',
      },
      {
        text: '`plt.savefig` must be called…',
        options: ['after plt.show()', 'BEFORE plt.show() — show clears the figure', 'anywhere', 'twice'],
        correctAnswer: 'BEFORE plt.show() — show clears the figure',
      },
      {
        text: 'To compare values across CATEGORIES (cities, products), use…',
        options: ['a histogram', 'a bar chart', 'a scatter plot', 'a line plot'],
        correctAnswer: 'a bar chart',
      },
      {
        text: 'To show the DISTRIBUTION of one numeric column, use…',
        options: ['a bar chart', 'a histogram', 'a scatter plot', 'a pie chart'],
        correctAnswer: 'a histogram',
      },
      {
        text: 'A scatter plot shows…',
        options: ['the relationship between two numeric variables', 'one column\'s distribution', 'categories only', 'a table'],
        correctAnswer: 'the relationship between two numeric variables',
      },
      {
        text: 'A correlation of +1.0 means…',
        options: ['no relationship', 'a perfect positive linear relationship', 'a perfect negative relationship', 'broken data'],
        correctAnswer: 'a perfect positive linear relationship',
      },
      {
        text: '`plt.subplots(2, 2)` creates…',
        options: ['a 2×2 grid of four charts', 'two charts', 'a single chart', 'a 2-row table'],
        correctAnswer: 'a 2×2 grid of four charts',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 16 — Automating Files & Scripts
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 16,
    title: 'Automating Files & Scripts',
    description:
      'Working with paths, walking directories, reading structured files, and writing scripts that do real work on their own.',
    topics: [
      {
        title: 'pathlib: Modern Path Handling',
        text:
          '`pathlib` (in the standard library) replaces messy string path handling with proper **Path objects**:\n\n```python\nfrom pathlib import Path\n\np = Path("data/reports/sales.csv\")\nprint(p.name)        # sales.csv\nprint(p.stem)        # sales\nprint(p.suffix)      # .csv\nprint(p.parent)      # data/reports\nprint(p.parts)       # (\'data\', \'reports\', \'sales.csv\') on Linux\n```\n\nThe magic: Path objects behave like strings where it matters but give you these helpers for free.\n\n**Building paths** — the ` / ` operator instead of fragile `+ "/" +`:\n\n```python\nbase = Path("data\")\npath = base / "reports" / "sales.csv\"\n# → data/reports/sales.csv — works on any OS\n```\n\nNo string concatenation, no worrying about forward vs back slashes.\n\n**Common operations:**\n\n```python\nPath("new.txt").exists()          # True/False\nPath("new.txt").is_file()\nPath("data\").is_dir()\nPath("new.txt").read_text()       # whole file as string\nPath("out.txt").write_text("hi\")  # write (with "w" semantics)\nPath("old.txt").rename(\"new.txt\")\nPath("junk.txt\").unlink()          # delete a file\n```\n\n`read_text()` / `write_text()` collapse the open/read/close (Section 10) into one call — perfect for small configs.\n\n**Listing & globbing** — find files by pattern:\n\n```python\nfor p in Path("data\").glob(\"*.csv\"):\n    print(p)\n\nfor p in Path(\".\").rglob(\"*.py\"):   # recursive — all subfolders\n    print(p)\n```\n\n`glob("*.csv")` = files in this folder matching the pattern; `rglob` walks subfolders too. This is the fastest way to "find every X in my project".\n\nThe payoff: scripts that move, rename, and organize files (topic 4) become a handful of clean Path lines instead of fragile string surgery.',
        code: 'from pathlib import Path\n\np = Path("data/reports/sales.csv\")\nprint(p.parent, p.suffix)        # data/reports .csv\n\nbase = Path("data\")\ncsvs = list(base.glob(\"*.csv\"))\nprint(len(csvs), \"csv files\")\n\nPath("hello.txt\").write_text(\"hi\\n\")\nprint(Path("hello.txt\").read_text())   # hi',
        note: 'pathlib Path objects: use / to join, .glob("*.csv") to find, .read_text()/.write_text() to read/write whole files.',
      },
      {
        title: 'os Module & Environment Variables',
        text:
          'The **`os`** module interfaces with the operating system. The pieces you will actually use:\n\n**Environment variables** — config the OS passes in (database URLs, API keys, feature flags):\n\n```python\nimport os\n\nkey = os.getenv(\"API_KEY\")          # None if unset\nsecret = os.getenv(\"SECRET\", \"default\")\n\nif os.getenv(\"DEBUG\") == \"1\":\n    print(\"debug mode\")\n```\n\n`os.getenv` with a default is the standard way to read config — never hardcode credentials (a real-world security rule; see Section 20).\n\n**Filesystem helpers** (overlapping with pathlib):\n\n```python\nos.getcwd()          # current working directory\nos.listdir(\"data\")   # names in a folder\nos.makedirs(\"a/b/c\", exist_ok=True)   # create folders, no error if present\nos.remove(\"file.txt\")\nos.rename(\"old\", \"new\")\n```\n\n`os.makedirs(..., exist_ok=True)` is the safe "create if needed" — the `exist_ok=True` suppresses the error when the folder already exists.\n\n**Running other programs** — the key to automation:\n\n```python\nimport subprocess\n\nresult = subprocess.run([\"ls\", \"-l\"], capture_output=True, text=True)\nprint(result.stdout)\nprint(result.returncode)   # 0 = success\n```\n\n`subprocess.run` launches an external command, captures its output, and returns an object with `stdout`, `stderr`, and `returncode`. Automation scripts glue programs together with exactly this.\n\n**`sys.argv`** gives script arguments:\n\n```python\nimport sys\n# python script.py input.csv output.csv\n# sys.argv = ["script.py", "input.csv", "output.csv"]\nfilename = sys.argv[1]\n```\n\n`sys.argv[0]` is the script name; the rest are the arguments. Handy for quick scripts — Section 19 upgrades to `argparse` for real CLI tools.',
        code: 'import os\nimport subprocess\n\nprint(os.getenv("HOME\"))\nprint(os.getenv("MISSING_KEY\", \"fallback\"))\n\nos.makedirs("output/charts\", exist_ok=True)\n\nresult = subprocess.run([\"echo\", \"hello\"], capture_output=True, text=True)\nprint(result.stdout.strip())     # hello\nprint(result.returncode)         # 0',
        note: 'os.getenv for config, os.makedirs(exist_ok=True) for safe folder creation, subprocess.run to call other programs.',
      },
      {
        title: 'CSV, JSON & Structured Files',
        text:
          'Hand-parsing data files is error-prone — the standard library has proper readers:\n\n**CSV** (comma-separated — what Excel and most tools export):\n\n```python\nimport csv\n\nwith open("data.csv\", newline=\"\") as f:\n    rows = list(csv.reader(f))          # each row = list of strings\n\n# with a header — rows become dicts keyed by column name:\nwith open(\"data.csv\", newline=\"\") as f:\n    for row in csv.DictReader(f):\n        print(row[\"name\"], row[\"score\"])\n\n# writing:\nwith open(\"out.csv\", \"w\", newline=\"\") as f:\n    writer = csv.writer(f)\n    writer.writerow([\"name\", \"score\"])\n    writer.writerow([\"Avi\", 92])\n```\n\n`csv.reader` splits properly (handles quoted fields with commas inside); `csv.DictReader` maps columns by header — far safer than `line.split(",")`.\n\n**JSON** (the API lingua franca):\n\n```python\nimport json\n\nwith open(\"config.json\") as f:\n    config = json.load(f)          # JSON → Python dict/list\n\nconfig[\"retries\"] = 3\nwith open(\"config.json\", \"w\") as f:\n    json.dump(config, f, indent=2)   # Python → JSON, pretty-printed\n```\n\n- `json.load(f)` / `json.dump(obj, f)` — file-based.\n- `json.loads(text)` / `json.dumps(obj)` — string-based (network).\n- `indent=2` makes output readable; `sort_keys=True` for stable diffs.\n\n**The pandas bridge** (Section 14): `pd.read_csv()` / `df.to_csv()` load a whole table into a DataFrame and back — when analysis, not just reading, is the goal, pandas replaces the manual csv module.\n\nThe mental map: **CSV** for tables people open in Excel, **JSON** for anything programs exchange (APIs, configs), pandas when you need to *analyze*. Structured-file reading is the foundation of every real data pipeline.',
        code: 'import json\nimport csv\n\n# JSON round-trip\ncfg = {"retries\": 3, \"debug\": False}\nwith open("cfg.json\", \"w\") as f:\n    json.dump(cfg, f, indent=2)\nwith open(\"cfg.json\") as f:\n    loaded = json.load(f)\nprint(loaded[\"retries\"])            # 3\n\n# CSV write + DictReader\nwith open("t.csv\", \"w\", newline=\"\") as f:\n    w = csv.writer(f)\n    w.writerow([\"name\", \"score\"])\n    w.writerow([\"Avi\", 92])\nwith open(\"t.csv\", newline=\"\") as f:\n    for r in csv.DictReader(f):\n        print(r)                     # {\'name\': \'Avi\', \'score\': \'92\'}',
        note: 'Use csv.DictReader / csv.reader for CSVs, json.load/dump for JSON (indent=2 for readability). They handle quoting properly.',
      },
      {
        title: 'Building a File-Organizer Automation Script',
        text:
          'Let\'s combine everything into the classic first automation: a **file organizer** that sorts a Downloads folder by extension:\n\n```python\nfrom pathlib import Path\nimport shutil\n\nDOWNLOADS = Path.home() / \"Downloads\"\nCATEGORIES = {\n    \"Images\": [\".jpg\", \".png\", \".gif\", \".webp\"],\n    \"Documents\": [\".pdf\", \".docx\", \".txt\"],\n    \"Code\": [\".py\", \".js\", \".ts\"],\n}\n\ndef category_for(filename):\n    suffix = filename.suffix.lower()\n    for folder, exts in CATEGORIES.items():\n        if suffix in exts:\n            return folder\n    return \"Others\"\n\ndef organize():\n    for path in DOWNLOADS.iterdir():\n        if not path.is_file() or path.name.startswith(\".\"):\n            continue\n        folder = category_for(path)\n        dest = DOWNLOADS / folder\n        dest.mkdir(exist_ok=True)\n        if not (dest / path.name).exists():\n            shutil.move(str(path), str(dest))\n            print(f\"moved {path.name} → {folder}\")\n\nif __name__ == \"__main__\":\n    organize()\n```\n\nWhat it teaches — the full automation toolkit:\n\n- **Iterate** with `Path.iterdir()` (one level) — or `rglob(\"*\")` for recursion.\n- **Decide** with a small function mapping extensions to folders.\n- **Create** with `mkdir(exist_ok=True)`.\n- **Move** with `shutil.move` — and `shutil.copy`/`shutil.rmtree` for the rest.\n- **Guard** every destructive action (skip hidden files, skip existing names) — automation that deletes by accident is worse than no automation.\n- **Test on a copy first** — a dry-run mode (`print` instead of `move`) is a professional habit.\n\nWriting "real" scripts is this formula, scaled up: decide what needs doing, iterate over the input, act with a guard, log what happened. The Python you now have (strings, files, paths, exceptions, functions) is enough to automate a surprising amount of daily drudgery.',
        code: 'from pathlib import Path\nimport shutil\n\n# Minimal version — sort files in a folder by extension\nsrc = Path(\"test_files\")\nif src.exists():\n    for path in src.iterdir():\n        if not path.is_file():\n            continue\n        dest = src / path.suffix[1:].upper()   # e.g. .py → PY\n        dest.mkdir(exist_ok=True)\n        shutil.move(str(path), str(dest / path.name))\n        print(f\"moved {path.name} → {dest.name}\")\nelse:\n    print(\"create test_files/ with some files first\")',
        note: 'Automation = iterate (iterdir/rglob) + decide (mapping) + act (shutil.move/copy) + guard (dry-run, skip hidden). Test on a copy.',
      },
    ],
    quizzes: [
      {
        text: '`Path(\"data/reports/sales.csv\").suffix` is…',
        options: ['sales', '.csv', 'reports', 'data'],
        correctAnswer: '.csv',
      },
      {
        text: 'The operator that joins path parts in pathlib is…',
        options: ['+', '/', '>>', '.'],
        correctAnswer: '/',
      },
      {
        text: 'To find every .py file in ALL subfolders, use…',
        options: ['Path(\".\").glob(\"*.py\")', 'Path(\".\").rglob(\"*.py\")', 'Path(\"*.py\")', 'os.find(\"*.py\")'],
        correctAnswer: 'Path(".").rglob("*.py")',
      },
      {
        text: '`os.getenv(\"KEY\", \"fallback\")` returns…',
        options: ['the value of KEY, or \"fallback\" if unset', 'always \"fallback\"', 'None', 'an error'],
        correctAnswer: 'the value of KEY, or "fallback" if unset',
      },
      {
        text: '`os.makedirs(\"a/b\", exist_ok=True)` …',
        options: ['errors if the folder exists', 'creates folders without error if they exist', 'only makes one level', 'is a syntax error'],
        correctAnswer: 'creates folders without error if they exist',
      },
      {
        text: 'To launch an external program and capture its output, use…',
        options: ['os.system', 'subprocess.run', 'exec()', 'Path.run()'],
        correctAnswer: 'subprocess.run',
      },
      {
        text: '`json.load(f)` converts…',
        options: ['Python to JSON', 'JSON text to Python objects', 'CSV to JSON', 'a string to int'],
        correctAnswer: 'JSON text to Python objects',
      },
      {
        text: '`csv.DictReader(f)` gives…',
        options: ['each row as a dict keyed by the header row', 'raw comma strings', 'a DataFrame', 'a JSON object'],
        correctAnswer: 'each row as a dict keyed by the header row',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 17 — Web Scraping Basics
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 17,
    title: 'Web Scraping Basics',
    description:
      'Fetching web pages, parsing HTML, extracting data with requests + BeautifulSoup, and doing it responsibly.',
    topics: [
      {
        title: 'How the Web Works: HTTP for Scrapers',
        text:
          'Before scraping, understand the request/response cycle — you are automating exactly what a browser does:\n\n1. Your client sends an **HTTP request** to a URL — method (GET/POST), headers, optional body.\n2. The server replies with an **HTTP response** — status code, headers, and a body (HTML, JSON, images).\n\nThe **status codes** you must know:\n\n- **200** OK — success.\n- **301/302** — redirects (the server moved it).\n- **403** — forbidden: you are being refused (often anti-scraping).\n- **404** — not found.\n- **429** — too many requests: you are being rate-limited. **Slow down.**\n- **500** — server error (not your fault).\n\n**The requests library** — the standard HTTP client (`pip install requests`):\n\n```python\nimport requests\n\nr = requests.get(\"https://example.com\")\nprint(r.status_code)        # 200\nprint(r.text[:200])         # the HTML\nprint(r.headers.get(\"content-type\"))\n```\n\n**A `User-Agent` header** identifies your client. Servers may block requests with no/minimal UA, so polite scrapers set one:\n\n```python\nheaders = {\"User-Agent\": \"Mozilla/5.0 (MyStudentScraper)\"}\nr = requests.get(url, headers=headers)\n```\n\n**Query parameters** — data sent in the URL: `requests.get(url, params={\"q\": \"python\", \"page\": 2})`.\n\n**The responsibility rules** (non-negotiable):\n- Respect `robots.txt` (the site\'s published scraping policy).\n- Respect rate limits — add delays between requests.\n- Identify yourself with a real UA.\n- Only scrape data you have permission to use.\n- Check whether the site offers an **official API** first — that is always better than scraping (APIs are Section 17\'s sibling topic).\n\nScraping is powerful but it is also borrowing a service — the courteous scraper behaves like a polite guest.',
        code: 'import requests\n\nheaders = {\"User-Agent\": \"Mozilla/5.0 (learning-scraper; edu-project)\"}\nr = requests.get(\"https://httpbin.org/status/200\", headers=headers, timeout=10)\nprint(r.status_code)              # 200\n\n# URL with query params\nr2 = requests.get(\n    \"https://httpbin.org/get\",\n    params={\"q\": \"python\", \"page\": 1},\n    timeout=10,\n)\nprint(r2.url)\nprint(r2.json()[\"args\"])          # {\'q\': \'python\', \'page\': \'1\'}',
        note: 'requests.get(url) → response with .status_code, .text, .json(). Respect robots.txt, rate limits, and set a User-Agent. Prefer official APIs.',
      },
      {
        title: 'Parsing HTML with BeautifulSoup',
        text:
          '**BeautifulSoup** (`pip install beautifulsoup4`) turns raw HTML into a navigable tree you can query — the heart of scraping:\n\n```python\nfrom bs4 import BeautifulSoup\n\nhtml = \"\"\"\n<html><body>\n  <h1 class=\"title\">Python Course</h1>\n  <div class=\"price\">Rs 999</div>\n  <a href=\"/learn\">Start</a>\n</body></html>\n\"\"\"\nsoup = BeautifulSoup(html, \"html.parser\")\n```\n\nThe essential finders:\n\n```python\nsoup.title.text                 # "Python Course"\nsoup.find(\"h1\").text           # first <h1>\nsoup.find(\"a\")[\"href\"]         # attribute: /learn\nsoup.find(\"div\", class_=\"price\").text   # by class (class_ not class!)\nsoup.select(\"div.price\")        # CSS selector\nsoup.select(\"a[href^=\"/\"]\")    # CSS: links starting with /\n```\n\n- **`.find(tag)`** — first match; `.find_all(tag)` — all matches, iterable.\n- **`.select(css)`** — CSS selectors, the most powerful and readable query style (`\"div.price\"`, `\"ul > li\"`, `\"h2#intro\"`).\n- **`.text`** — the visible text inside an element.\n- **`["href"]`** — access an attribute.\n\n**The loop pattern** — scrape a list of things:\n\n```python\nfor card in soup.select(\"div.product\"):\n    name = card.select_one(\"h2\").text\n    price = card.select_one(\".price\").text\n    link = card.select_one(\"a\")[\"href\"]\n    print(name, price, link)\n```\n\n`select_one` = first match inside the current element (always — it scopes to the card, not the whole page).\n\n**Debugging the parse**: if `.text` comes back empty or selects find nothing, print `soup.prettify()` or a slice of the HTML to inspect the real structure — selectors are only as good as your knowledge of the actual markup.',
        code: 'from bs4 import BeautifulSoup\n\nhtml = """<div class="product">\n  <h2>Keyboard</h2><span class="price">Rs 799</span>\n</div>\n<div class="product">\n  <h2>Mouse</h2><span class="price">Rs 399</span>\n</div>"""\n\nsoup = BeautifulSoup(html, "html.parser")\nfor card in soup.select("div.product"):\n    print(card.select_one("h2").text, card.select_one(".price").text)\n# Keyboard Rs 799\n# Mouse Rs 399',
        note: 'BeautifulSoup(html, "html.parser") → soup.select(css) / find() / find_all(). .text for text, [attr] for attributes.',
      },
      {
        title: 'A Complete Scrape: Price Monitor',
        text:
          'Let\'s assemble requests + BeautifulSoup into a real tool — a **price monitor** that checks product prices and reports when they drop:\n\n```python\nimport requests\nimport time\nfrom bs4 import BeautifulSoup\n\nTARGET = 500   # buy when price <= this\n\ndef fetch_price(url):\n    headers = {\"User-Agent\": \"Mozilla/5.0 (price-monitor demo)\"}\n    r = requests.get(url, headers=headers, timeout=10)\n    r.raise_for_status()          # 4xx/5xx → raise\n    soup = BeautifulSoup(r.text, \"html.parser\")\n    price_text = soup.select_one(\".price\").text\n    return int(price_text.replace(\"Rs\", \"\").replace(\",\", \"\").strip())\n\ndef check(url):\n    try:\n        price = fetch_price(url)\n        status = \"BUY NOW!\" if price <= TARGET else \"still high\"\n        print(f\"{price} → {status}\")\n    except Exception as e:\n        print(f\"check failed: {e}\")\n\nif __name__ == \"__main__\":\n    for url in [\"https://example.com/product/1\", \"https://example.com/product/2\"]:\n        check(url)\n        time.sleep(2)      # polite delay between requests\n```\n\nThe pattern — the same skeleton every scraper follows:\n\n1. **Fetch** — `requests.get` with a UA and `timeout`. `raise_for_status()` turns HTTP errors into exceptions.\n2. **Parse** — `BeautifulSoup(r.text)` then `.select_one(...)` for the data.\n3. **Clean** — the price arrives as messy text (`"Rs 1,299"`) → strip symbols and commas, convert to int. Cleaning is half the scraping work.\n4. **Handle** — try/except around the whole thing so one bad page doesn\'t kill the run.\n5. **Be polite** — `time.sleep(2)` between requests.\n\n**Level-ups to make it real:** run it periodically (cron / `schedule` library), save prices to a CSV to track history (Section 16), alert on change (email/telegram). The core stays exactly this: fetch → parse → clean → decide.',
        code: 'import requests\nimport time\nfrom bs4 import BeautifulSoup\n\n# skeleton with a live-friendly example endpoint\nhtml = """<div class="price">Rs 1,299</div>"""\nsoup = BeautifulSoup(html, "html.parser")\nprice_text = soup.select_one(".price").text\nprice = int(price_text.replace("Rs", "").replace(",", "").strip())\nprint(price)              # 1299\nprint(\"BUY NOW!\" if price <= 500 else \"still high\")',
        note: 'Scraper skeleton = fetch (requests+UA+timeout) → parse (soup.select) → clean (strip symbols) → handle (try/except) → be polite (sleep).',
      },
      {
        title: 'APIs & Responsible Scraping',
        text:
          '**The #1 rule of web data: use an official API before ever scraping.**\n\nAPIs (Application Programming Interfaces) are a website\'s official, documented way to give you data — usually as **JSON** (which Python parses with `json`/`.json()`):\n\n```python\nimport requests\n\nr = requests.get(\n    \"https://api.github.com/users/kunwaravi\",\n    headers={\"Accept\": \"application/vnd.github+json\"},\n    timeout=10,\n)\ndata = r.json()           # dict from the API\nprint(data[\"public_repos\"])\n```\n\nWhy prefer APIs:\n\n- **Stable** — structured fields instead of markup that changes weekly.\n- **Efficient** — smaller responses, exactly the data you need.\n- **Legal & ethical** — explicitly offered for this purpose.\n- **Keys & limits** — many require an API key (which also means they can track and throttle you fairly).\n\n**When scraping is still the right call:** no API exists, and the data is small, public, and you have permission. Then the responsible-scraping checklist:\n\n- **Check `robots.txt`** — `https://site.com/robots.txt` — which paths may be crawled.\n- **Identify yourself** — a truthful User-Agent with contact info.\n- **Throttle** — delay between requests (`time.sleep`); never hammer a server.\n- **Cache** — fetch once, save locally, reuse.\n- **Don\'t bypass** login walls, CAPTCHAs, or rate limits — evading protections is off-limits.\n- **Terms of service** — read the site\'s terms; some forbid scraping outright.\n\n**The general pattern for both:**\n\n- APIs → `requests.get(url, params=..., headers=...)` → `r.json()` → iterate the data.\n- Scraping → `requests.get(url)` → `BeautifulSoup(r.text)` → `.select(...)` → extract.\n\nEither way you end with structured Python data you can analyze (pandas), store (CSV/JSON), and automate. Web data skills are the difference between an analyst and an engineer.',
        code: 'import requests\n\n# A real, open API (no key needed) — ISS position\nr = requests.get("https://api.open-notify.org/iss-now.json", timeout=10)\ndata = r.json()\nprint(data["iss_position"])\n\n# API-first pattern: params + .json()\nr2 = requests.get(\n    "https://httpbin.org/json\",\n    headers={\"User-Agent\": \"student-project\"},\n    timeout=10,\n)\nprint(r2.json()[\"slideshow\"][\"title\"])',
        note: 'Prefer official APIs (JSON, documented, allowed) before scraping. When scraping: check robots.txt, identify yourself, throttle, cache, respect ToS.',
      },
    ],
    quizzes: [
      {
        text: 'The HTTP status code for "too many requests / rate limited" is…',
        options: ['403', '429', '500', '404'],
        correctAnswer: '429',
      },
      {
        text: 'The library used to make HTTP requests in Python is…',
        options: ['requests', 'beautifulsoup4', 'urllib3 only', 'os'],
        correctAnswer: 'requests',
      },
      {
        text: '`soup.select("div.price")` finds…',
        options: ['all divs with class price', 'the first price', 'all prices as text', 'nothing'],
        correctAnswer: 'all divs with class price',
      },
      {
        text: '`soup.find("a")["href"]` retrieves…',
        options: ['the link text', 'the href attribute of the first link', 'the whole page', 'a header'],
        correctAnswer: 'the href attribute of the first link',
      },
      {
        text: 'The BeautifulSoup parser argument in `BeautifulSoup(html, \"html.parser\")` is…',
        options: ['optional styling', 'the parser engine', 'an API key', 'a URL'],
        correctAnswer: 'the parser engine',
      },
      {
        text: 'The polite delay between consecutive requests is…',
        options: ['time.sleep()', 'time.wait()', 'requests.pause()', 'os.sleep()'],
        correctAnswer: 'time.sleep()',
      },
      {
        text: 'Before scraping a site, the FIRST thing to check is…',
        options: ['the site\'s official API / robots.txt', 'the server IP', 'the HTML size', 'nothing'],
        correctAnswer: 'the site\'s official API / robots.txt',
      },
      {
        text: 'APIs are preferable to scraping because they…',
        options: ['return stable structured data (JSON) with permission', 'are faster to hack', 'are always free', 'never rate-limit'],
        correctAnswer: 'return stable structured data (JSON) with permission',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 18 — Project Planning (CLI Tool)
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 18,
    title: 'Project Planning (CLI Tool)',
    description:
      'From idea to spec: requirements, user stories, design, and a task plan — then building the foundation of a real CLI tool.',
    topics: [
      {
        title: 'From Idea to Requirements',
        text:
          'Every real project starts before the first line of code — with **requirements**. A requirement is a precise statement of what the software must do: "Given an expenses CSV, the tool must print a monthly total per category."\n\n**Turn a fuzzy idea into requirements:**\n\n1. **State the problem** in one sentence. "I keep losing track of my expenses across months."\n2. **Define the user** — who will use it and what they can do. "A student who wants to see where their money goes."\n3. **List the functions** — what the tool does:\n   - Load expenses from a CSV file.\n   - Show total spending per category.\n   - Show total per month.\n   - Flag spending over a budget.\n4. **Add constraints** — how it must behave: runs from the terminal (`python expenses.py --csv data.csv`), fast on 10,000 rows, clear error messages for bad files.\n5. **Prioritize** — mark each requirement Must / Should / Could (the MoSCoW method). Build Musts first.\n\n**User stories** phrase requirements from the user\'s viewpoint:\n\n- "As a student, I want to see my spending per category, so I can cut the big expenses."\n- "As a student, I want a clear error if my CSV is malformed, so I can fix the file quickly."\n\nThe difference between planning and not planning shows up at the end: a spec gives you a **definition of done** — you know precisely when the project is finished, and you can test each item against the list.\n\n**The anti-pattern** is "start coding and figure it out": scope creeps, the tool grows without direction, and "done" is never clear. Ten minutes of requirements saves ten hours of rewrites.',
        code: '# requirements.md — before any code\n\n# Expenses CLI — Requirements v1\n#\n# Must:\n#   - Load a CSV with columns: date, category, amount\n#   - Print total per category\n#   - Print total per month\n#   - Flag categories over a budget flag\n#   - Exit with a friendly error on a bad file\n# Should:\n#   - Accept --csv path and --budget amount flags\n# Could:\n#   - Export a summary CSV\n#\n# Definition of done: all Must items work from the terminal\n# on a sample file, verified by the tests in Section 20.',
        note: 'Requirements = problem + user + functions + constraints + priorities. User stories = "As a ___, I want ___, so that ___". Definition of done first.',
      },
      {
        title: 'Designing the Structure: Functions & Modules',
        text:
          'With requirements in hand, **design the structure** before coding — decide the modules and functions that will implement each requirement.\n\nFor the expenses tool, a clean split by responsibility:\n\n```\nexpenses/\n├── expenses.py      # entry point (CLI)\n├── loader.py        # read & validate the CSV\n├── analysis.py      # totals per category/month\n└── report.py        # formatting & printing output\n```\n\nOne responsibility per module:\n\n- **`loader`** — file I/O and parsing. Returns clean data or raises a clear error.\n- **`analysis`** — pure computation: input data → totals. No printing, no file access.\n- **`report`** — takes computed totals → formatted text.\n- **`expenses.py`** — orchestrates: call loader, call analysis, call report.\n\n**Designing function signatures** — each function does one thing, named for what it returns:\n\n```python\n# loader.py\ndef load_expenses(path: str) -> list[dict]:\n    ...\n\n# analysis.py\ndef total_by_category(rows: list[dict]) -> dict[str, float]:\n    ...\ndef total_by_month(rows: list[dict]) -> dict[str, float]:\n    ...\n\n# report.py\ndef format_summary(totals: dict[str, float]) -> str:\n    ...\n```\n\n**Why this design matters:**\n\n- **Testable** — `analysis.total_by_category` takes data in, returns data out. No printing to test around — a clean unit test (Section 20).\n- **Reusable** — `report.format_summary` could also feed a web dashboard later.\n- **Debuggable** — when output is wrong, you know which module to look in.\n\nThe habit to build: for any project, sketch the module split and the key function signatures **on paper first**. A design that names its functions is a design halfway done — and it turns "where do I start?" into a task list.',
        code: '# design.md — the plan before code\n\n# Modules and their jobs\n#   loader.load_expenses(path)  → rows: list[{date, category, amount}]\n#   analysis.total_by_category(rows)  → {category: total}\n#   analysis.total_by_month(rows)     → {month: total}\n#   report.format_summary(totals)     → printable string\n#\n# Data flow:\n#   expenses.py --csv data.csv\n#     → loader → analysis → report → print\n#\n# Each module = one responsibility. analysis has no print()\n# and no file I/O → pure and unit-testable.',
        note: 'Split by responsibility (load / analyze / report / orchestrate). Pure functions (data in → data out, no prints) are testable. Design signatures on paper first.',
      },
      {
        title: 'Task Breakdown & Estimation',
        text:
          'Design done → **break the work into tasks** small enough to complete and verify independently. Each requirement becomes one or more tasks:\n\n**Task list for the expenses CLI (in order):**\n\n1. **T1 — CSV loader** (30 min): implement `load_expenses`; handles a valid file; raises on missing file / bad rows.\n2. **T2 — Loader tests** (20 min): test with a tiny sample CSV.\n3. **T3 — Category totals** (20 min): `total_by_category`.\n4. **T4 — Month totals** (20 min): `total_by_month` (parse `date` into `YYYY-MM`).\n5. **T5 — Report formatting** (20 min): aligned table from totals.\n6. **T6 — CLI wiring** (30 min): `argparse` flags, orchestrate the flow, exit codes.\n7. **T7 — Errors** (20 min): friendly messages for missing/bad files.\n8. **T8 — End-to-end test** (20 min): run the full tool on a sample CSV.\n\nNotes on estimation:\n\n- Estimate in **time, not effort** — and double small estimates; beginners routinely under-estimate by 2×.\n- **Order for dependency**: T1 before T3/T4 (they consume its output), T2 right after T1 (test as you go), T8 last (integration).\n- **Verify each task** — each has a concrete "done" check (e.g. "T3 done when running `total_by_category(sample)` returns `{\'Food\': 540}`").\n\n**The planning-to-code ratio:** for a one-day project, 30-60 minutes of planning is right. The plan is not bureaucracy — it is the map. When you finish task 4 of 8, you know exactly where you are and what remains.\n\nWorking this way (small tasks + verify each) is the same discipline professional teams use, scaled to a weekend project. It turns "big scary project" into "eight small, finishable steps".',
        code: '# tasks.md\n# T1  CSV loader ........ 30m  done: load_expenses(sample) works\n# T2  loader tests ...... 20m  done: pytest green\n# T3  category totals ... 20m  done: {Food: 540}\n# T4  month totals ...... 20m  done: {2026-01: ...}\n# T5  report format ..... 20m  done: aligned table prints\n# T6  CLI wiring ........ 30m  done: python expenses.py --csv x\n# T7  error handling .... 20m  done: bad file → friendly msg\n# T8  e2e test .......... 20m  done: full run on sample CSV\n#\n# Total ≈ 3 hours. Each task has a concrete "done" check.',
        note: 'Break into small tasks with a concrete done-check each. Order by dependency, test as you go, double your estimates.',
      },
      {
        title: 'Designing for Testability',
        text:
          'The choices that make software **testable** are design choices made *before* the tests are written. The three rules:\n\n**1. Pure core, thin edges.** Keep computation (parsing, math, formatting) in functions that take inputs and return outputs — no printing, no user input, no network. Those functions are trivially testable:\n\n```python\n# analysis.py — pure\ndef total_by_category(rows):\n    totals = {}\n    for r in rows:\n        totals[r["category"]] = totals.get(r["category"], 0) + r["amount"]\n    return totals\n```\n\nTest it directly:\n\n```python\nassert total_by_category([{"category": "Food", "amount": 100}])\n       == {"Food": 100}\n```\n\n**2. Inject dependencies.** When a function needs a file or a service, pass it in instead of hardcoding:\n\n```python\n# testable — the "file" is passed in, so tests use a StringIO\ndef summarize(csv_text):\n    rows = parse_csv(csv_text)      # parse is also pure\n    return total_by_category(rows)\n\n# in tests:\nassert summarize("date,category,amount\\n2026-01-01,Food,100\\n") \\\n       == {"Food": 100}\n```\n\n**3. Deterministic inputs.** Never let randomness, clocks, or network calls hide inside functions you want to test. If you need "today", pass the date in.\n\n**The payoff:** with a pure core, tests are fast (no files, no network), reliable (no flaky timing), and precise (a failing test names the exact function).\n\n**Types help too** — annotate signatures (`rows: list[dict]`) so the intended contract is visible; `mypy`/editors can then catch whole classes of bugs before tests run.\n\nTestability is not an afterthought — it is a design goal with three levers (pure core, injected dependencies, deterministic inputs) you pull while planning the structure in this section. By the time you write the actual tests (Section 20), the hard part is already done.',
        code: 'from io import StringIO\nimport csv\n\ndef parse_csv(text):\n    return list(csv.DictReader(StringIO(text)))\n\ndef total_by_category(rows):\n    totals = {}\n    for r in rows:\n        totals[r["category"]] = totals.get(r["category"], 0) + float(r["amount"])\n    return totals\n\ndef summarize(text):\n    return total_by_category(parse_csv(text))\n\n# a test — no files, no network, deterministic\nassert summarize("date,category,amount\\n2026-01-01,Food,100\\n2026-01-02,Food,50\\n") \\\n       == {"Food": 150.0}\nprint("tests pass")',
        note: 'Testable = pure core (no prints/I/O in logic), injected dependencies, deterministic inputs. Design these in — tests come free.',
      },
    ],
    quizzes: [
      {
        text: 'A requirement is…',
        options: ['a precise statement of what the software must do', 'a random idea', 'a code comment', 'an error message'],
        correctAnswer: 'a precise statement of what the software must do',
      },
      {
        text: 'The MoSCoW method prioritizes requirements as…',
        options: ['Must, Should, Could, Won\'t', 'Big, Medium, Small', 'First, Second, Third', 'High, Low'],
        correctAnswer: 'Must, Should, Could, Won\'t',
      },
      {
        text: 'The user-story template is…',
        options: ['"As a ___, I want ___, so that ___"', '"The code should ___"', '"If X then Y"', '"Once upon a time"'],
        correctAnswer: '"As a ___, I want ___, so that ___"',
      },
      {
        text: 'A good module split for the expenses tool is…',
        options: ['loader / analysis / report / cli', 'one giant file', 'copy per feature', 'a single function'],
        correctAnswer: 'loader / analysis / report / cli',
      },
      {
        text: 'A pure function…',
        options: ['takes inputs, returns outputs, no side effects', 'prints its result', 'reads files', 'asks the user'],
        correctAnswer: 'takes inputs, returns outputs, no side effects',
      },
      {
        text: 'Injected dependencies mean…',
        options: ['passing needed resources (like a file/reader) in as parameters', 'global variables', 'hardcoding paths', 'using environment only'],
        correctAnswer: 'passing needed resources (like a file/reader) in as parameters',
      },
      {
        text: 'Estimates by beginners are usually…',
        options: ['accurate', 'under-estimated (2× too small)', 'over-estimated', 'irrelevant'],
        correctAnswer: 'under-estimated (2× too small)',
      },
      {
        text: 'The "definition of done" is…',
        options: ['a clear way to know the project is finished and testable', 'the last bug fixed', 'the final commit message', 'the deadline'],
        correctAnswer: 'a clear way to know the project is finished and testable',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 19 — Building a CLI Python Tool
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 19,
    title: 'Building a CLI Python Tool',
    description:
      'Assembling the planned expenses tool for real: argparse, orchestration, exit codes, and clean, helpful error output.',
    topics: [
      {
        title: 'argparse: Professional CLI Arguments',
        text:
          '`argparse` (standard library) turns your script into a proper command-line tool with flags, help text, and validation — replacing manual `sys.argv` parsing:\n\n```python\nimport argparse\n\nparser = argparse.ArgumentParser(\n    description="Summarize expenses from a CSV file"\n)\nparser.add_argument("--csv", required=True, help="path to expenses CSV")\nparser.add_argument("--budget", type=float, default=500, help="category budget flag")\nparser.add_argument("--verbose", action="store_true", help="print extra detail")\n\nargs = parser.parse_args()\n\nprint(args.csv)        # the value\nprint(args.budget)     # 500.0 default\nprint(args.verbose)    # True if --verbose given\n```\n\nThe result — for free — includes:\n\n- **`--help`** — automatically generated usage + descriptions (try `python tool.py --help`).\n- **Type conversion** — `type=float` parses and validates numbers.\n- **Required flags** — `required=True` errors early with a clear message.\n- **Booleans** — `action="store_true"` makes `--verbose` a flag, not a value.\n\nCommon argument patterns:\n\n```python\nparser.add_argument("file\", nargs=\"?\", default=\"data.csv\")  # optional positional\nparser.add_argument(\"--out\", choices=[\"text\", \"json\"], default=\"text\")  # choices\nparser.add_argument(\"--limit\", type=int, default=10)  # numbers\n```\n\n**Exit codes**: `sys.exit(0)` = success, `sys.exit(1)` = error. argparse calls `sys.exit(2)` itself for usage errors — the standard code for "bad arguments".\n\nThe argparse version of a CLI is dramatically better than `sys.argv`: self-documenting (the help IS the documentation), validating, and consistent. If a tool grows to need sub-commands (`expenses add`, `expenses report`), argparse supports subparsers too — but for this project one flat set of flags is right.',
        code: 'import argparse\n\nparser = argparse.ArgumentParser(description="Expense summary tool")\nparser.add_argument("--csv", required=True, help="path to expenses CSV")\nparser.add_argument("--budget", type=float, default=500, help="flag categories over this amount")\nargs = parser.parse_args()\n\nprint("csv:", args.csv)\nprint("budget:", args.budget)\n# run: python tool.py --csv data.csv --budget 300\n# help: python tool.py --help',
        note: 'argparse gives flags, types, required checks, and --help for free. required=True, type=float, action="store_true" are the daily trio.',
      },
      {
        title: 'Orchestrating the Pipeline (Main Flow)',
        text:
          'With modules designed (Section 18) and args parsed, the **main flow** wires everything together. The `main()` function is the conductor — it does no real work itself, it calls the modules in order:\n\n```python\nimport argparse\nimport sys\nfrom loader import load_expenses\nfrom analysis import total_by_category, total_by_month\nfrom report import format_summary\n\ndef main():\n    parser = argparse.ArgumentParser(description="Expense summary")\n    parser.add_argument("--csv", required=True)\n    parser.add_argument("--budget", type=float, default=500)\n    args = parser.parse_args()\n\n    rows = load_expenses(args.csv)                  # 1. load\n    by_category = total_by_category(rows)           # 2. analyze\n    by_month = total_by_month(rows)\n    print(format_summary(by_category, by_month))    # 3. report\n\ndef run():\n    try:\n        main()\n    except FileNotFoundError as e:\n        print(f"Error: {e.filename} not found", file=sys.stderr)\n        sys.exit(1)\n    except ValueError as e:\n        print(f"Error in data: {e}", file=sys.stderr)\n        sys.exit(1)\n\nif __name__ == "__main__":\n    run()\n```\n\nThe structure is deliberate:\n\n- **`main()`** — pure orchestration, no error handling clutter.\n- **`run()`** — the single error boundary: catches the expected failures, prints a **friendly message to stderr**, and exits with a **non-zero code** (so scripts calling this tool know it failed).\n- **`if __name__ == "__main__":`** — still importable and testable.\n\nThe **three-tier error strategy** from Section 11, in practice:\n- Low-level: `loader` raises `FileNotFoundError`/`ValueError` with specific messages.\n- Middle: `run()` catches and translates into user-friendly stderr lines.\n- Top: exit code signals success/failure to the outside world.\n\nNote what is NOT in main(): no raw `input()`, no prints of intermediate steps, no file logic. Every line is either a module call or output of the final result — a flow a reader can follow in ten seconds.',
        code: 'import sys\n\ndef main():\n    data = {"category_totals": {"Food": 540, "Travel": 320}}\n    print(format_summary(data))    # hypothetical clean output\n\ndef run():\n    try:\n        main()\n    except Exception as e:\n        print(f"Error: {e}", file=sys.stderr)\n        sys.exit(1)\n\nif __name__ == "__main__":\n    run()\n# Key patterns: main() orchestrates; run() is the error\n# boundary; stderr for errors; sys.exit(1) on failure.',
        note: 'main() orchestrates only; run() is one error boundary printing to stderr and exiting non-zero; the __main__ guard keeps it importable.',
      },
      {
        title: 'Error Handling & User-Friendly Messages',
        text:
          'The difference between a toy script and a tool users trust is **how it fails**. Rules for professional error output:\n\n**1. Messages go to stderr, not stdout** — `print(..., file=sys.stderr)`. Data/output goes to stdout; errors go to stderr. This lets users pipe the real output and still see errors.\n\n**2. Say what happened AND what to do** — not "error", but:\n\n```python\nexcept FileNotFoundError as e:\n    print(f"Error: file {e.filename} was not found.", file=sys.stderr)\n    print("Check the --csv path and try again.", file=sys.stderr)\n```\n\n**3. Exit non-zero on failure** — `sys.exit(1)`. A tool that returns success (0) while failing silently is the worst kind of bug — everything downstream believes it worked.\n\n**4. Validate early, fail with the exact problem** — a missing file should say *which* file; a bad row should say *which* row:\n\n```python\ndef load_expenses(path):\n    rows = []\n    with open(path, newline="") as f:\n        reader = csv.DictReader(f)\n        for i, row in enumerate(reader, start=2):   # row 1 is header\n            try:\n                row["amount"] = float(row["amount"])\n            except (KeyError, ValueError):\n                raise ValueError(f"row {i}: invalid or missing amount")\n            rows.append(row)\n    return rows\n```\n\n**5. No raw tracebacks for users** — tracebacks are for developers. The tool should catch expected errors and print one clean line. Reserve the traceback for genuinely unexpected bugs (and log it).\n\n**The test for good error handling:** can a user who has never seen your code fix the problem from your error message alone? If yes, your errors are working. This principle alone separates amateur tools from professional ones.',
        code: 'import csv\nimport sys\n\ndef load_expenses(path):\n    rows = []\n    with open(path, newline="") as f:\n        reader = csv.DictReader(f)\n        for i, row in enumerate(reader, start=2):\n            try:\n                row["amount"] = float(row["amount"])\n            except (KeyError, ValueError):\n                raise ValueError(f"row {i}: invalid or missing amount")\n            rows.append(row)\n    return rows\n\ntry:\n    load_expenses("nope.csv")\nexcept FileNotFoundError as e:\n    print(f"Error: {e.filename} not found", file=sys.stderr)\n    print("Pass --csv with the correct path.", file=sys.stderr)\n    sys.exit(1)',
        note: 'Errors → stderr + non-zero exit + say what and how to fix. Validate early with row numbers. No raw tracebacks to users.',
      },
      {
        title: 'Testing the Tool: Sample Data & Edge Cases',
        text:
          'Before calling a tool done, **test it like a user would** — including the cases you did not design for. The checklist:\n\n**Happy path** — a valid file produces the expected summary:\n\n```bash\npython expenses.py --csv sample.csv --budget 400\n```\n\nCheck: totals per category match hand-computed numbers; the budget flag marks the over-budget category.\n\n**Edge cases (the ones that actually break tools):**\n\n- **Empty file** — just a header. Should produce an empty summary, not crash.\n- **Missing file** — friendly error, exit code 1.\n- **Malformed row** — a row with no `amount`: error names the row number.\n- **Missing column** — `DictReader` yields `None`; must be caught.\n- **Weird amounts** — `"1,299"` (commas), negative, huge. Decide and handle.\n- **Extra whitespace** — `"  Food "` category names. `strip()` them.\n- **Empty categories** — a category with zero total should not appear (or appear as 0 — your choice, be deliberate).\n\n**A table of test cases** (make it a real file, `test_cases.csv`):\n\n```\ninput                 → expected output\nsample.csv            → totals match hand-calc\nmissing.csv           → exit 1, "not found" message\nempty.csv             → empty summary, no crash\nbadrow.csv            → "row 3: invalid amount"\ndupes.csv             → categories merged\n```\n\nThe **manual test run is the last step before automation** — you run the tool against these cases now, see the failures, fix them, then Section 20 automates the checks with pytest so they never regress.\n\nAlso test the **argparse layer**: `--csv` missing → usage error + exit 2; `--budget abc` → type error message. argparse handles these, but confirm they look right.\n\nFinishing discipline: a tool is done when it passes its own test table, handles the edge cases deliberately, and its failures are readable. That is the professional bar.',
        code: '# manual test table (run against a built sample.csv)\n# 1. valid file   → correct totals printed\n# 2. missing file → "Error: ... not found" + exit 1\n# 3. empty file   → empty summary, no crash\n# 4. bad row      → "row 3: invalid amount"\n# 5. dupes        → categories merged\n# 6. --budget abc → argparse type error + exit 2\n\n# sample rows to build:\n# date,category,amount\n# 2026-01-05,Food,120\n# 2026-01-12,Travel,320\n# 2026-01-20,Food,420',
        note: 'Test happy path first, then the edge cases: empty/missing/malformed/duplicates/whitespace. Manual table → fix → automate with pytest next.',
      },
    ],
    quizzes: [
      {
        text: '`parser.add_argument("--csv", required=True)` means…',
        options: ['the flag may be omitted', 'the tool errors early without this flag', 'csv is a list', 'it\'s a boolean'],
        correctAnswer: 'the tool errors early without this flag',
      },
      {
        text: '`action="store_true"` makes an argument…',
        options: ['a flag: True if present, False otherwise', 'a number', 'a required string', 'a list'],
        correctAnswer: 'a flag: True if present, False otherwise',
      },
      {
        text: '`--help` with argparse…',
        options: ['is generated automatically from your add_argument calls', 'must be written by hand', 'is not supported', 'deletes the script'],
        correctAnswer: 'is generated automatically from your add_argument calls',
      },
      {
        text: 'Error messages should be printed…',
        options: ['to stderr, with a non-zero exit code', 'to stdout with exit 0', 'to a file', 'nowhere'],
        correctAnswer: 'to stderr, with a non-zero exit code',
      },
      {
        text: 'A tool that fails silently with exit code 0 is…',
        options: ['fine', 'the worst kind of bug — everything downstream trusts it succeeded', 'faster', 'good practice'],
        correctAnswer: 'the worst kind of bug — everything downstream trusts it succeeded',
      },
      {
        text: 'A good error message should…',
        options: ['say what happened AND how to fix it', 'be as short as "error"', 'print a traceback', 'hide details'],
        correctAnswer: 'say what happened AND how to fix it',
      },
      {
        text: '`enumerate(reader, start=2)` in the loader is used to…',
        options: ['report the real CSV row number (row 1 is the header)', 'count rows', 'sort rows', 'deduplicate'],
        correctAnswer: 'report the real CSV row number (row 1 is the header)',
      },
      {
        text: 'The structure of a professional CLI is…',
        options: ['main() orchestrates, run() is the error boundary, __main__ guard', 'everything in sys.argv', 'no functions', 'global state'],
        correctAnswer: 'main() orchestrates, run() is the error boundary, __main__ guard',
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 20 — Packaging, Testing & Final Review
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 20,
    title: 'Packaging, Testing & Final Review',
    description:
      'Automated testing with pytest, type hints and quality tooling, packaging your tool, and the full curriculum review.',
    topics: [
      {
        title: 'Unit Testing with pytest',
        text:
          '**pytest** is the de facto Python test framework (`pip install pytest`). Tests are plain functions whose assertions either pass or fail — no test classes needed:\n\n```python\n# test_analysis.py\nfrom analysis import total_by_category\n\ndef test_totals_by_category():\n    rows = [\n        {"category": "Food", "amount": 100.0},\n        {"category": "Food", "amount": 50.0},\n        {"category": "Travel", "amount": 300.0},\n    ]\n    assert total_by_category(rows) == {"Food": 150.0, "Travel": 300.0}\n\ndef test_empty_input():\n    assert total_by_category([]) == {}\n```\n\nRun with `pytest` (or `python -m pytest`) — it discovers files named `test_*.py`, runs every `test_*` function, and reports:\n\n```\n2 passed in 0.03s\n```\n\n**Why pytest over plain asserts:**\n\n- **Discovery** — naming conventions find your tests automatically.\n- **Readable output** — on failure it shows the exact values side by side.\n- **Fixtures** — shared setup (`@pytest.fixture`), e.g. a sample CSV string used by many tests.\n- **Parametrize** — one test, many cases:\n\n```python\n@pytest.mark.parametrize("text,expected", [\n    ("Food,100", {"Food": 100.0}),\n    ("Food,100\\nFood,50", {"Food": 150.0}),\n])\ndef test_summarize(text, expected):\n    assert summarize("date,category,amount\\n" + text) == expected\n```\n\n**What to test** — the pure functions from Section 18 (category totals, month totals, formatting). The testable-by-design core means tests are fast and deterministic.\n\n**The testing loop:** write a failing test → fix code → test green. This "red-green" loop catches regressions forever: when you refactor in week 6, the tests from week 19 still guard every behaviour.',
        code: '# test_analysis.py\nfrom analysis import total_by_category\n\ndef test_basic_totals():\n    rows = [\n        {"category": "Food", "amount": 100.0},\n        {"category": "Food", "amount": 50.0},\n        {"category": "Travel", "amount": 300.0},\n    ]\n    assert total_by_category(rows) == {"Food": 150.0, "Travel": 300.0}\n\ndef test_empty():\n    assert total_by_category([]) == {}\n\n# run: pytest\ntest_basic_totals()\ntest_empty()',
        note: 'pytest discovers test_*.py, runs test_* functions, asserts behaviors. Test the pure functions; parametrize for many cases.',
      },
      {
        title: 'Type Hints & Quality Tooling',
        text:
          '**Type hints** document your contracts and let tools catch bugs before tests run:\n\n```python\ndef total_by_category(rows: list[dict]) -> dict[str, float]:\n    ...\n\nrate: float = 1.18\ntags: list[str] = ["fast", "safe\"]\n\ndef apply(price: float, pct: float = 18) -> float:\n    return price * (1 + pct / 100)\n```\n\nHints do not change runtime behaviour — but editors and linters use them:\n\n- **`mypy`** — the static type checker: `mypy analysis.py`. Catches calling a function with the wrong type, using a possibly-None value, typos in attribute names, etc.\n- **Editor support** — hover over a call to see its signature; autocomplete knows what you can pass.\n\n**The quality-toolchain checklist** for any real project:\n\n- **`ruff`** (or `flake8`) — linter: style rules, unused imports, undefined names. `ruff check .`\n- **`black`** — formatter: reformats your code to a canonical style. `black .`\n- **`mypy`** — type checker. `mypy .`\n- **`pytest`** — tests. `pytest`\n\nRun them all in a loop — most projects script this as `ruff check . && black . && mypy . && pytest`.\n\n**Docstrings** — one more quality habit:\n\n```python\ndef load_expenses(path: str) -> list[dict]:\n    \"\"\"Load and validate an expenses CSV.\n\n    Returns rows with numeric amounts. Raises FileNotFoundError\n    for a missing file and ValueError for malformed rows.\n    \"\"\"\n```\n\nTools automatically generate documentation from docstrings (`pydoc`), and `--help`/IDEs surface them.\n\nThe professional habit: **write the type hints and run the linter as you code**, not at the end. The feedback loop is instant, and "it passed ruff, black, mypy, and pytest" is the universal signal of clean, correct Python.',
        code: 'def add_tax(price: float, pct: float = 18) -> float:\n    """Return price plus pct percent tax."""\n    return price * (1 + pct / 100)\n\nprint(add_tax(100))          # 118.0\nprint(add_tax(100, pct=28))  # 128.0\n\n# toolchain:\n#   ruff check .    → style / unused imports\n#   black .         → formatting\n#   mypy .          → type checking\n#   pytest          → tests',
        note: 'Type hints + docstrings document contracts. Toolchain: ruff (lint), black (format), mypy (types), pytest (tests). Run as you code.',
      },
      {
        title: 'Packaging: From Script to Installable Tool',
        text:
          'A **script** you run with `python expenses.py` is fine — but a **package** you can `pip install` and run anywhere as `expenses` is professional. The minimal modern packaging setup uses `pyproject.toml`:\n\n```toml\n[build-system]\nrequires = ["setuptools"]\nbuild-backend = "setuptools.build_meta"\n\n[project]\nname = "expenses-cli"\nversion = "1.0.0"\ndescription = "Summarize expenses from CSV"\nrequires-python = ">=3.10"\n\n[project.scripts]\nexpenses = "expenses.expenses:run"\n```\n\nThe key line is `[project.scripts]`: it maps the command `expenses` to the `run` function in your module. After `pip install -e .` (editable install — your edits apply immediately), the command exists:\n\n```bash\npip install -e .\nexpenses --csv data.csv --budget 400\n```\n\n**Structure the package:**\n\n```\nproject/\n├── pyproject.toml\n├── expenses/              # the package folder\n│   ├── __init__.py\n│   ├── expenses.py        # run()\n│   ├── loader.py\n│   ├── analysis.py\n│   └── report.py\n└── tests/\n    └── test_analysis.py\n```\n\nThe tests move under `tests/`, the code under the package name.\n\n**Good packaging hygiene:**\n\n- Add a **README.md** — what it does, how to install, example commands.\n- Add **`.gitignore`** — `__pycache__/`, `.venv/`, `dist/`.\n- Choose a **version number** and bump it deliberately (`1.0.0`).\n- Add a **LICENSE** if you will share it.\n- Publish to PyPI with `python -m build` + `twine upload` when it is truly ready (or just share the repo — publishing is optional).\n\nPackaging turns a personal script into a tool other people can install with one command — the difference between "here is my code" and "here is my product".',
        code: '# pyproject.toml (minimal)\n# [build-system]\n# requires = ["setuptools"]\n# build-backend = "setuptools.build_meta"\n#\n# [project]\n# name = "expenses-cli"\n# version = "1.0.0"\n# description = "Summarize expenses from CSV"\n# requires-python = ">=3.10"\n#\n# [project.scripts]\n# expenses = "expenses.expenses:run"\n#\n# then:  pip install -e .   and run:   expenses --csv data.csv',
        note: 'pyproject.toml + [project.scripts] turns a module into an installable command. Add README, .gitignore, LICENSE, version.',
      },
      {
        title: 'Full Course Review & Next Steps',
        text:
          'You have come a long way — from `print("Hello")` to an installable, tested CLI tool. The full arc of this curriculum:\n\n**The foundations (W1-W6):** Python philosophy and setup, variables and types, operators, conditionals, loops and comprehensions — the syntax that is now automatic.\n\n**The tools (W7-W13):** functions and scope, lists and tuples, dicts and sets, strings and files, exceptions, OOP, and modules/packages/pip — the vocabulary of real programs.\n\n**Data & automation (W14-W17):** pandas and matplotlib for analysis and charts, pathlib and automation scripts, and web data with requests + BeautifulSoup.\n\n**Building real things (W18-W20):** planning, designing, building and testing a CLI tool — the engineering discipline.\n\n**Your project portfolio now** — each week produced something you can show:\n\n- Interactive number-guessing game (W5)\n- Analysis of a real dataset with pandas + charts (W14-15)\n- A file-organizer script (W16)\n- A price-monitor scraper (W17)\n- An installable expenses CLI, tested with pytest (W18-20)\n\n**Where to go next** — the natural paths from here:\n\n- **Web backend**: Flask / FastAPI (which build on the functions, decorators, and modules you know).\n- **Data science**: deepen pandas, then numpy → scikit-learn.\n- **Automation**: scale your scripts with scheduling (cron) and notifications.\n- **Programming practice**: solve problems on LeetCode/HackerRank in Python to sharpen algorithm thinking.\n- **Contribute**: read and patch a small open-source project — the fastest way to learn professional practice.\n\n**The mindset to keep**: Python rewards *readable* code more than clever code; the "Pythonic" way is usually the simplest way that works. Keep building small things, keep the pure-core habit, and keep your toolchain (lint, type, test) running as you go. That combination — fundamentals, real projects, and clean tooling — is what turns a course into a career skill.',
        code: '# your checklist as you finish:\n#\n# 1. Project  ✔ expenses CLI installs and runs\n# 2. Tests    ✔ pytest green\n# 3. Lint     ✔ ruff check clean\n# 4. Types    ✔ mypy clean\n# 5. Docs     ✔ README explains install + usage\n#\n# Next options:\n#   → Flask/FastAPI for web backends\n#   → numpy → scikit-learn for ML\n#   → cron + notifications for automation\n#   → open-source contributions for pro practice',
        note: '20 weeks, one complete skillset: syntax → tools → data → engineering. Ship small projects, keep the toolchain on, keep building.',
      },
    ],
    quizzes: [
      {
        text: 'pytest discovers test functions because they…',
        options: ['are named test_* (or in files test_*.py)', 'are annotated @test', 'return True', 'live in a special folder'],
        correctAnswer: 'are named test_* (or in files test_*.py)',
      },
      {
        text: 'The command to run your tests is…',
        options: ['python run', 'pytest', 'test all', 'npm test'],
        correctAnswer: 'pytest',
      },
      {
        text: 'Type hints in Python…',
        options: ['change runtime behaviour', 'document contracts and let tools (mypy) catch bugs', 'slow Python down', 'are mandatory'],
        correctAnswer: 'document contracts and let tools (mypy) catch bugs',
      },
      {
        text: '`def f(x: float) -> float:` declares…',
        options: ['x is a float and f returns a float', 'x is a string', 'f has no return', 'x is optional'],
        correctAnswer: 'x is a float and f returns a float',
      },
      {
        text: 'In pyproject.toml, the command name is defined in…',
        options: ['[project.scripts]', '[build-system]', '[project.dependencies]', '[tool.black]'],
        correctAnswer: '[project.scripts]',
      },
      {
        text: '`pip install -e .` …',
        options: ['installs the package in editable mode — edits apply immediately', 'installs it read-only', 'only checks syntax', 'deletes the project'],
        correctAnswer: 'installs the package in editable mode — edits apply immediately',
      },
      {
        text: 'The linter that checks style and unused imports is…',
        options: ['ruff', 'pytest', 'pip', 'twine'],
        correctAnswer: 'ruff',
      },
      {
        text: 'A failing test followed by a fix to make it pass is called…',
        options: ['red-green loop', 'blue screen', 'brute force', 'debug print'],
        correctAnswer: 'red-green loop',
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────────────
// PYTHON — Final Exam Question Bank (replaces the 50 near-identical template Qs)
// ──────────────────────────────────────────────────────────────────────────
export const pythonFinalExam: PythonFinalExamQuestion[] = [
  {
    text: 'Which of these correctly prints "Hello, Avi!" with a variable name = "Avi"?',
    options: ['print("Hello, name!")', 'print(f"Hello, {name}!")', 'print("Hello, " + name + "!") is also valid, but f-strings are the modern default', 'print(name, "Hello")'],
    correctAnswer: 'print(f"Hello, {name}!")',
  },
  {
    text: '`data[1:4]` on `data = [10, 20, 30, 40, 50]` returns…',
    options: ['[20, 30, 40] — stop index is exclusive', '[10, 20, 30, 40]', '[20, 30, 40, 50]', '[10, 20, 30]'],
    correctAnswer: '[20, 30, 40] — stop index is exclusive',
  },
  {
    text: 'What does this code print?\n```python\ntotal = 0\nfor i in range(4):\n    total += i\nprint(total)\n```',
    options: ['4', '6', '3', '10'],
    correctAnswer: '6',
  },
  {
    text: 'Which list comprehension produces `[0, 1, 4, 9, 16]`?',
    options: ['[n*n for n in range(4)]', '[n*n for n in range(5)]', '[n**n for n in range(5)]', '[n*2 for n in range(5)]'],
    correctAnswer: '[n*n for n in range(5)]',
  },
  {
    text: 'What is the output?\n```python\ndef greet(name="friend"):\n    return f"Hi {name}"\nprint(greet())\n```',
    options: ['Hi', 'Hi friend', 'Hi name', 'an error'],
    correctAnswer: 'Hi friend',
  },
  {
    text: 'Which is TRUE about a tuple vs a list?',
    options: [
      'tuples are mutable',
      'tuples are immutable and can be dictionary keys; lists can change',
      'lists are immutable',
      'tuples cannot hold strings',
    ],
    correctAnswer: 'tuples are immutable and can be dictionary keys; lists can change',
  },
  {
    text: '`d = {"a": 1}; print(d.get("b", 0))` prints…',
    options: ['KeyError', '0 — get returns the default when the key is missing', 'None', 'b'],
    correctAnswer: '0 — get returns the default when the key is missing',
  },
  {
    text: 'The result of `{1, 2, 3} | {3, 4}` is…',
    options: ['{1, 2, 3, 4}', '{3}', '{1, 2, 3, 3, 4}', '{1, 2, 4}'],
    correctAnswer: '{1, 2, 3, 4}',
  },
  {
    text: '`"  Avi,21  ".strip().split(",")` evaluates to…',
    options: ['["Avi", "21"]', '["  Avi", "21  "]', '["Avi,21"]', '["Avi 21"]'],
    correctAnswer: '["Avi", "21"]',
  },
  {
    text: 'Which block ALWAYS runs whether or not an exception occurred?',
    options: ['try', 'else', 'finally', 'except'],
    correctAnswer: 'finally',
  },
  {
    text: 'What does this print?\n```python\nclass A:\n    def greet(self):\n        return "Hi"\nclass B(A):\n    def greet(self):\n        return "Hello"\nprint(B().greet())\n```',
    options: ['Hi', 'Hello — B overrides greet', 'an error', 'Hi Hello'],
    correctAnswer: 'Hello — B overrides greet',
  },
  {
    text: 'The idiom `if __name__ == "__main__":` allows a file to…',
    options: [
      'run only as a script and import cleanly without side effects',
      'never be imported',
      'run twice',
      'be used only in Jupyter',
    ],
    correctAnswer: 'run only as a script and import cleanly without side effects',
  },
  {
    text: '`df[df["score"] >= 90]` in pandas…',
    options: [
      'keeps only the rows where score is at least 90',
      'deletes the score column',
      'sorts by score',
      'adds 90 to every score',
    ],
    correctAnswer: 'keeps only the rows where score is at least 90',
  },
  {
    text: 'Which HTTP status means the server is rate-limiting you?',
    options: ['403', '429', '500', '404'],
    correctAnswer: '429',
  },
  {
    text: 'The correct, safe way to read a file is…',
    options: [
      'with open("f.txt") as f: content = f.read()',
      'open("f.txt") and never close it',
      'read("f.txt")',
      'file.read("f.txt")',
    ],
    correctAnswer: 'with open("f.txt") as f: content = f.read()',
  },
  {
    text: '`import requests` — to GET a URL and read its JSON you write…',
    options: [
      'requests.get(url).json()',
      'requests.json(url)',
      'get(url).json()',
      'requests.read(url).json()',
    ],
    correctAnswer: 'requests.get(url).json()',
  },
  {
    text: 'What does this print?\n```python\nnums = [3, 1, 2]\nnums.sort()\nprint(nums)\n```',
    options: ['[1, 2, 3] — sort() mutates the list', 'None', '[3, 1, 2]', '[2, 1, 3]'],
    correctAnswer: '[1, 2, 3] — sort() mutates the list',
  },
  {
    text: '`total_by_category` designed to take data in and return a dict (no printing) is called…',
    options: ['a pure function', 'a global function', 'a lambda', 'a decorator'],
    correctAnswer: 'a pure function',
  },
];
