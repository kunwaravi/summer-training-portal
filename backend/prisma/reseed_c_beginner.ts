import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const cCourseBeginnerContent = [
  {
    week: 1,
    title: "The Foundation: Your First Interaction with Code",
    description: "Learn what programming is, how to set up your environment, and write your first 'Hello World' program while understanding memory storage boxes (Variables).",
    topics: [
      {
        title: "Introduction to Computers & Compilers",
        text: "Computers don't speak English; they speak binary (0s and 1s). A **Compiler** acts as a translator that converts your C code into binary that the CPU can execute. We use tools like **GCC** or IDEs like **Code::Blocks** to manage this translation process.",
        code: "// No code yet, just understanding the translation!\n// High-level C -> Compiler -> Machine Code (0101)",
        note: "Think of a Compiler as a language translator in a foreign country."
      },
      {
        title: "Hello World: Breaking the Silence",
        text: "The first step in any language is to say hello. In C, we use `printf()` to output text to the screen. Every C program starts with a `main()` function—this is the 'Entry Point' where the computer begins execution.",
        code: "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, Future Programmer!\\n\");\n    return 0;\n}",
        note: "#include <stdio.h> is a library that gives us the printf tool."
      },
      {
        title: "Variables: Your Digital Storage Boxes",
        text: "A **Variable** is a named location in memory where you store data. Imagine a kitchen jar labeled 'Sugar'. In C, we label a box `int age = 25;`. Here, `int` tells C the box only holds integers (whole numbers).",
        code: "int apples = 5;\nfloat price = 2.50;\nchar grade = 'A';",
        note: "Always name your variables clearly (e.g., 'studentAge' instead of 'x')."
      }
    ],
    quizzes: [
      { text: "What is the primary role of a Compiler in C programming?", options: ["To design graphics", "To translate C code into Machine Binary", "To connect to the internet", "To act as a hard drive"], correctAnswer: "To translate C code into Machine Binary" },
      { text: "Which function serves as the mandatory starting point (Entry Point) for every C program?", options: ["start()", "begin()", "main()", "execute()"], correctAnswer: "main()" },
      { text: "Which keyword is used to store whole numbers (integers) in C?", options: ["float", "char", "int", "double"], correctAnswer: "int" },
      { text: "What does '#include <stdio.h>' do?", options: ["It turns off the computer", "It imports the standard input-output library", "It creates a new variable", "It clears the screen"], correctAnswer: "It imports the standard input-output library" },
      { text: "How do you end a statement in C?", options: ["With a period (.)", "With a colon (:)", "With a semicolon (;)", "With an exclamation mark (!)"], correctAnswer: "With a semicolon (;)" }
    ]
  },
  {
    week: 2,
    title: "Decision Making: Teaching the Computer to Think",
    description: "Move beyond linear code. Learn how to use 'if-else' logic and 'Switch' cases to make programs that respond differently to different inputs.",
    topics: [
      {
        title: "Logical Operators: The Rules of Truth",
        text: "To make decisions, we use operators like `>` (greater than), `<` (less than), and `==` (equal to). These result in either **True (1)** or **False (0)**.",
        code: "int x = 10;\nint y = 5;\n// (x > y) is True\n// (x == y) is False",
        note: "The '==' sign is for comparison, while '=' is for assignment."
      },
      {
        title: "The If-Else Structure",
        text: "The `if` statement checks a condition. If it's true, the code inside the curly braces `{}` runs. If not, the `else` block runs. It's like saying: 'If it rains, take an umbrella; else, wear sunglasses.'",
        code: "int temperature = 30;\nif (temperature > 25) {\n    printf(\"It is hot!\");\n} else {\n    printf(\"It is pleasant.\");\n}",
        note: "Curly braces define the 'scope' or boundary of your decision."
      }
    ],
    quizzes: [
      { text: "Which operator is used to compare if two values are exactly equal?", options: ["=", "==", "===", "!="], correctAnswer: "==" },
      { text: "What happens if the condition in an 'if' statement is False and there is no 'else' block?", options: ["The program crashes", "The code inside the 'if' is skipped", "The program restarts", "The computer reboots"], correctAnswer: "The code inside the 'if' is skipped" },
      { text: "In C logic, what value typically represents 'True'?", options: ["-1", "0", "1", "None of these"], correctAnswer: "1" }
    ]
  },
  {
    week: 3,
    title: "Automation: Harnessing the Power of Loops",
    description: "Computers are best at repetitive tasks. Master 'For' and 'While' loops to execute code hundreds of times with just a few lines.",
    topics: [
      {
        title: "The 'While' Loop",
        text: "A `while` loop repeats as long as a condition remains true. You must ensure the condition eventually becomes false, or you'll create an **Infinite Loop** that freezes the program.",
        code: "int count = 1;\nwhile (count <= 5) {\n    printf(\"Count is %d\\n\", count);\n    count++; // Important: increment to stop eventually\n}",
        note: "Always check your 'exit condition' in loops."
      },
      {
        title: "The 'For' Loop",
        text: "The `for` loop is a compact way to write loops. It combines initialization, condition, and increment in one line. It is ideal when you know exactly how many times to repeat.",
        code: "for (int i = 0; i < 10; i++) {\n    printf(\"Iteration %d\\n\", i);\n}",
        note: "Programmers almost always start counting from 0, not 1."
      }
    ],
    quizzes: [
      { text: "What is a major danger of a 'while' loop?", options: ["It only runs once", "It can run forever (Infinite Loop) if the condition never fails", "It deletes your code", "It can only handle numbers"], correctAnswer: "It can run forever (Infinite Loop) if the condition never fails" },
      { text: "Which part of a 'for' loop header happens after every iteration?", options: ["Initialization", "Condition", "Increment/Decrement", "None"], correctAnswer: "Increment/Decrement" },
      { text: "How many times will 'for(int i=0; i<3; i++)' run?", options: ["2", "3", "4", "0"], correctAnswer: "3" }
    ]
  },
  {
    week: 4,
    title: "Data Collections: Organizing with Arrays",
    description: "Store multiple values in a single variable. Learn how to manage lists of data like student scores or names (Strings).",
    topics: [
      {
        title: "Introduction to Arrays",
        text: "An **Array** is a collection of variables of the same type stored in contiguous memory. Instead of `score1, score2, score3`, you use `scores[3]`. You access them using an **Index** starting at 0.",
        code: "int marks[5] = {90, 85, 95, 70, 88};\nprintf(\"First mark: %d\", marks[0]); // Output: 90",
        note: "Memory for arrays is fixed. You cannot change the size after declaring it."
      },
      {
        title: "Strings: Arrays of Characters",
        text: "A **String** is simply an array of characters ending with a special null character `\\0`. It's how we store names and messages in C.",
        code: "char name[] = \"NEXUS\";\nprintf(\"Welcome, %s\", name);",
        note: "The null character '\\0' tells C where the string ends."
      }
    ],
    quizzes: [
      { text: "What is the index of the very first element in a C array?", options: ["1", "-1", "0", "None"], correctAnswer: "0" },
      { text: "If you declare 'int arr[10]', what is the index of the last element?", options: ["10", "9", "11", "0"], correctAnswer: "9" },
      { text: "What character marks the end of a String in C?", options: ["\\n", "\\t", "\\0", "\\s"], correctAnswer: "\\0" }
    ]
  }
];

async function main() {
  console.log('--- RE-SEEDING C TRACK WITH BEGINNER-FRIENDLY CONTENT ---');

  // Ensure Course exists without overwriting existing data
  const courseId = "C";
  let course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    course = await prisma.course.create({
      data: {
        id: courseId,
        title: "C Programming: The Absolute Beginner's Masterclass",
        description: "Master the foundations of logic and systems programming from scratch. No prior experience required.",
        price: 699
      }
    });
    console.log(`Created Course: ${courseId}`);
  } else {
    console.log(`Course ${courseId} already exists. Skipping update to preserve admin edits.`);
    if (course.price !== 699) {
      await prisma.course.update({
        where: { id: courseId },
        data: { price: 699 }
      });
      console.log(`Updated course ${courseId} price to 699.`);
    }
  }

  // Seed the new high-quality content
  for (const weekData of cCourseBeginnerContent) {
    let module = await prisma.module.findUnique({
      where: {
        courseId_week: {
          courseId,
          week: weekData.week
        }
      }
    });

    if (!module) {
      module = await prisma.module.create({
        data: {
          courseId,
          week: weekData.week,
          title: weekData.title,
          description: weekData.description
        }
      });
      console.log(`  Created Module: W${weekData.week} - ${weekData.title}`);
    } else {
      console.log(`  Module W${weekData.week} already exists. Skipping update to preserve admin edits.`);
    }

    // Safe check of topics/quizzes for this specific module
    const existingTopicsCount = await prisma.topic.count({ where: { moduleId: module.id } });
    const existingQuizCount = await prisma.quizQuestion.count({ where: { moduleId: module.id } });
    if (existingTopicsCount > 0 || existingQuizCount > 0) {
      console.log(`  Skipping topic/quiz seeding for module W${weekData.week} to preserve manual admin edits.`);
      continue;
    }

    await prisma.topic.deleteMany({ where: { moduleId: module.id } });
    await prisma.quizQuestion.deleteMany({ where: { moduleId: module.id } });

    // Seed Topics
    for (let i = 0; i < weekData.topics.length; i++) {
      const t = weekData.topics[i];
      await prisma.topic.create({
        data: {
          moduleId: module.id,
          title: t.title,
          text: t.text,
          code: t.code,
          note: t.note,
          order: i
        }
      });
    }

    // Seed Quizzes
    for (const q of weekData.quizzes) {
      await prisma.quizQuestion.create({
        data: {
          moduleId: module.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer
        }
      });
    }
    
    console.log(`✅ Seeded Week ${weekData.week}: ${weekData.title}`);
  }

  // Seed the remaining 16 modules as "Intermediate/Advanced placeholders" to maintain the 20-week structure
  const placeholderModules = [
    "Functions & Stack Frames", "Pointers: Memory Mastery", "Structures & Unions", "File I/O Systems",
    "Preprocessor & Build Pipelines", "Dynamic Memory: Malloc & Free", "Linked Lists: Dynamic Data", "Binary Trees & Recursion",
    "Sorting & Searching Algorithms", "Bitwise Operations & Masking", "Concurrency & Multithreading", "Network Socket Programming",
    "Systems Security & Buffer Overflows", "Project Architecture", "Final Capstone Development", "Certification Preparation"
  ];

  for (let i = 0; i < placeholderModules.length; i++) {
    const weekNum = i + 5;
    let module = await prisma.module.findUnique({
      where: {
        courseId_week: {
          courseId,
          week: weekNum
        }
      }
    });

    if (module) {
      console.log(`- Placeholder module for Week ${weekNum} already exists. Skipping update.`);
    } else {
      module = await prisma.module.create({
        data: {
          courseId,
          week: weekNum,
          title: placeholderModules[i],
          description: `Expand your C knowledge into ${placeholderModules[i].toLowerCase()}. This module covers industrial-standard implementation patterns.`
        }
      });
      console.log(`- Created placeholder for Week ${weekNum}`);
    }
  }

  console.log('--- C TRACK CONTENT UPGRADE COMPLETED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
