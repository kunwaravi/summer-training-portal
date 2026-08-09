// fCC-style challenge seed data for EduNexus Pro (Phase 1).
// Only module/week 1 of WebDesign, Python and SQL get interactive challenges.
// Challenge types: "HTML" | "CSS" | "JavaScript" | "Python" | "SQL"

export interface ChallengeSeed {
  courseId: string;
  moduleWeek: number;
  title: string;
  dashedName: string;
  challengeType: 'HTML' | 'CSS' | 'JavaScript' | 'Python' | 'SQL';
  description: string;   // markdown (--description--)
  instructions: string;  // markdown (--instructions--)
  seedCode: string;      // starter code; for SQL = DB bootstrap SQL executed by the runner
  solutionCode?: string;
  testCode: string;      // JS assertions evaluated in the runner context
  order: number;
}

// ---------------------------------------------------------------------------
// WebDesign — HTML elements basics (module week 1)
// Runner context: `document`, `__userSource`, `assert`, `expect`, `__record`
// ---------------------------------------------------------------------------
export const webDesignHtmlBasics: ChallengeSeed[] = [
  {
    courseId: 'WebDesign',
    moduleWeek: 1,
    title: 'Say Hello to HTML Elements',
    dashedName: 'say-hello-to-html-elements',
    challengeType: 'HTML',
    description:
      'HTML elements are written with a start tag, an end tag, and the content in between. The `<h1>` element is a heading, and the `<p>` element is a paragraph.\n\n```html\n<h1>Hello World</h1>\n```\n\nA `p` element looks like this:\n\n```html\n<p>Hello Paragraph</p>\n```',
    instructions:
      'Add a `p` element with the text `Hello Paragraph` below the existing `h1` element.',
    seedCode: '<h1>Hello World</h1>',
    solutionCode: '<h1>Hello World</h1>\n<p>Hello Paragraph</p>',
    testCode:
      "assert.equal(document.querySelectorAll('h1').length, 1, 'You should have an h1 element');\n" +
      "assert.equal(document.querySelector('h1').textContent.trim(), 'Hello World', 'Your h1 element should contain the text \"Hello World\"');\n" +
      "assert.equal(document.querySelectorAll('p').length, 1, 'You should have a p element');\n" +
      "assert.equal(document.querySelector('p').textContent.trim(), 'Hello Paragraph', 'Your p element should contain the text \"Hello Paragraph\"');",
    order: 0
  },
  {
    courseId: 'WebDesign',
    moduleWeek: 1,
    title: 'Headline with the h2 Element',
    dashedName: 'headline-with-the-h2-element',
    challengeType: 'HTML',
    description:
      'The `h2` element is another heading element. It is a step smaller than `h1` and is great for section titles.\n\n```html\n<h2>CatPhotoApp</h2>\n```',
    instructions: 'Add an `h2` element with the text `CatPhotoApp`.',
    seedCode: '<h1>Hello World</h1>',
    solutionCode: '<h1>Hello World</h1>\n<h2>CatPhotoApp</h2>',
    testCode:
      "assert.equal(document.querySelectorAll('h2').length, 1, 'You should have an h2 element');\n" +
      "assert.equal(document.querySelector('h2').textContent.trim(), 'CatPhotoApp', 'Your h2 element should contain the text \"CatPhotoApp\"');",
    order: 1
  },
  {
    courseId: 'WebDesign',
    moduleWeek: 1,
    title: 'Comment out HTML',
    dashedName: 'comment-out-html',
    challengeType: 'HTML',
    description:
      'HTML comments are useful to leave notes in your code without the browser rendering them. Anything between `<!--` and `-->` is ignored by the browser.\n\n```html\n<!-- <p>This will not show</p> -->\n```',
    instructions: 'Comment out the `p` element so it does not display.',
    seedCode: '<h1>Hello World</h1>\n<p>This is a paragraph</p>',
    solutionCode: '<h1>Hello World</h1>\n<!-- <p>This is a paragraph</p> -->',
    testCode:
      'assert.match(__userSource, /<!--[\\s\\S]*-->/, \'You should have an HTML comment\');\n' +
      "assert.equal(document.querySelectorAll('p').length, 0, 'The p element should be commented out');",
    order: 2
  },
  {
    courseId: 'WebDesign',
    moduleWeek: 1,
    title: 'Fill in the Blank with Placeholder Text',
    dashedName: 'fill-in-the-blank-with-placeholder-text',
    challengeType: 'HTML',
    description:
      'A paragraph can hold any amount of text. You can replace the text inside a `p` element by editing the content between its tags.',
    instructions:
      'Change the text inside the `p` element so it says `Hello Paragraph`.',
    seedCode: '<h1>Hello World</h1>\n<p>Kitty ipsum dolor sit amet</p>',
    solutionCode: '<h1>Hello World</h1>\n<p>Hello Paragraph</p>',
    testCode:
      "assert.equal(document.querySelector('p').textContent.trim(), 'Hello Paragraph', 'Your p element should say \"Hello Paragraph\"');",
    order: 3
  },
  {
    courseId: 'WebDesign',
    moduleWeek: 1,
    title: 'Uncomment HTML',
    dashedName: 'uncomment-html',
    challengeType: 'HTML',
    description:
      'Commenting out code is also a great way to temporarily disable code. To uncomment, simply remove the `<!--` and `-->` markers.',
    instructions:
      'Uncomment the `h1` and `p` elements so they are visible again.',
    seedCode:
      '<!--\n<h1>Hello World</h1>\n<p>Hello Paragraph</p>\n-->',
    solutionCode: '<h1>Hello World</h1>\n<p>Hello Paragraph</p>',
    testCode:
      'assert.notMatch(__userSource, /<!--/, \'You should have removed the HTML comment\');\n' +
      "assert.equal(document.querySelectorAll('h1').length, 1, 'You should have an h1 element');\n" +
      "assert.equal(document.querySelectorAll('p').length, 1, 'You should have a p element');",
    order: 4
  },
  {
    courseId: 'WebDesign',
    moduleWeek: 1,
    title: 'Introduction to HTML5 Elements',
    dashedName: 'introduction-to-html5-elements',
    challengeType: 'HTML',
    description:
      'HTML5 introduces more descriptive tags such as `main`, `header`, `footer`, `nav` and `section`. The `main` element should wrap the central content of your page, making it easier for search engines and other developers to find the main content.\n\n```html\n<main>\n  <p>Hello Paragraph</p>\n</main>\n```',
    instructions:
      'Create a `main` element and nest the two `p` elements inside it.',
    seedCode:
      '<h1>Hello World</h1>\n<p>Paragraph one</p>\n<p>Paragraph two</p>',
    solutionCode:
      '<h1>Hello World</h1>\n<main>\n  <p>Paragraph one</p>\n  <p>Paragraph two</p>\n</main>',
    testCode:
      "assert.equal(document.querySelectorAll('main').length, 1, 'You should have a main element');\n" +
      "const main = document.querySelector('main');\n" +
      "assert.equal(main.querySelectorAll('p').length, 2, 'Your main element should contain two p children');",
    order: 5
  }
];

// ---------------------------------------------------------------------------
// Python — basics (module week 1)
// Runner context: `stdout`, `pyEval(expr)`, `assert`, `expect`, `__record`
// ---------------------------------------------------------------------------
export const pythonBasics: ChallengeSeed[] = [
  {
    courseId: 'Python',
    moduleWeek: 1,
    title: 'Print "Hello, World!"',
    dashedName: 'print-hello-world',
    challengeType: 'Python',
    description:
      'The `print()` function sends text to the console. The text you want to output goes inside the parentheses, wrapped in quotes.\n\n```python\nprint("Hello, World!")\n```',
    instructions:
      'Write a line of Python code that prints the text `Hello, World!`.',
    seedCode: '# Write a line of code that prints: Hello, World!\n',
    solutionCode: 'print("Hello, World!")\n',
    testCode:
      "assert.match(stdout.trim(), /Hello, World!/, 'Your code should print \"Hello, World!\"');",
    order: 0
  },
  {
    courseId: 'Python',
    moduleWeek: 1,
    title: 'Create a Variable',
    dashedName: 'create-a-variable',
    challengeType: 'Python',
    description:
      'Variables store values under a name. To create one, write the name, then `=`, then the value.\n\n```python\nanswer = 42\n```',
    instructions: 'Create a variable named `answer` and assign it the number `42`.',
    seedCode: '# Assign the number 42 to a variable named answer\n',
    solutionCode: 'answer = 42\n',
    testCode:
      "assert.equal(pyEval('answer'), 42, 'The variable \"answer\" should equal 42');",
    order: 1
  },
  {
    courseId: 'Python',
    moduleWeek: 1,
    title: 'Use print() with Variables',
    dashedName: 'use-print-with-variables',
    challengeType: 'Python',
    description:
      'You can combine `print()` with variables to output their value.\n\n```python\nname = \"Riya\"\nprint(name)\n```',
    instructions:
      'Using the existing `name` variable, add a `print(name)` call to output its value.',
    seedCode: 'name = "Riya"\n# Use print() to output the value of name\n',
    solutionCode: 'name = "Riya"\nprint(name)\n',
    testCode:
      "assert.match(stdout, /Riya/, 'Your code should print the value of the name variable');",
    order: 2
  }
];

// ---------------------------------------------------------------------------
// SQL — basics (module week 1)
// Runner context: `result` = { columns: string[], values: (string|number)[][] }
// `seedCode` = DB bootstrap SQL executed by the runner before the user query.
// ---------------------------------------------------------------------------
export const sqlBasics: ChallengeSeed[] = [
  {
    courseId: 'SQL',
    moduleWeek: 1,
    title: 'SELECT All Columns',
    dashedName: 'select-all-columns',
    challengeType: 'SQL',
    description:
      'The `SELECT` statement fetches data from a table. Use `SELECT *` to return every column of a table.\n\n```sql\nSELECT * FROM students;\n```\n\nThis table is named `students` and has the columns `id`, `name` and `grade`.',
    instructions:
      'Write a query that selects **all columns** from the `students` table.',
    seedCode:
      "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER);\n" +
      "INSERT INTO students VALUES (1, 'Riya', 85);\n" +
      "INSERT INTO students VALUES (2, 'Arjun', 92);",
    solutionCode: 'SELECT * FROM students;',
    testCode:
      "assert.deepEqual([...result.columns].sort(), ['grade', 'id', 'name'], 'You should select all 3 columns');\n" +
      "assert.equal(result.values.length, 2, 'You should return 2 rows');",
    order: 0
  },
  {
    courseId: 'SQL',
    moduleWeek: 1,
    title: 'Filter with WHERE',
    dashedName: 'filter-with-where',
    challengeType: 'SQL',
    description:
      'The `WHERE` clause filters rows that match a condition.\n\n```sql\nSELECT * FROM students WHERE grade > 90;\n```',
    instructions:
      'Write a query that returns only the row where the student\'s `name` is `Arjun`.',
    seedCode:
      "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER);\n" +
      "INSERT INTO students VALUES (1, 'Riya', 85);\n" +
      "INSERT INTO students VALUES (2, 'Arjun', 92);",
    solutionCode: "SELECT * FROM students WHERE name = 'Arjun';",
    testCode:
      "assert.equal(result.values.length, 1, 'You should return exactly 1 row');\n" +
      "assert.equal(String(result.values[0][1]).toLowerCase(), 'arjun', 'The returned student should be Arjun');",
    order: 1
  }
];

export const allChallengeSeedBlocks: ChallengeSeed[] = [
  ...webDesignHtmlBasics,
  ...pythonBasics,
  ...sqlBasics
];
