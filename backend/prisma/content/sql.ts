// ============================================================================
// Database Management & SQL — Deep GfG-Style Curriculum (issue #90)
// ----------------------------------------------------------------------------
// 20 sections, each with 4 deep teaching topics (~250-300 words, original),
// a working SQL example, a real-world note, and 8 distinct chapter quizzes
// (4 options, exactly 1 correct). Plus a distinct final exam.
//
// Per-topic quizzes live in sql_topic_quizzes.ts (keyed by EXACT topic title)
// and satisfy the frontend topic-lock flow.
//
// NOTE: content strings use double quotes so SQL single-quote literals
// (WHERE name = 'Alice') do not need escaping.
// ============================================================================

export interface SqlTopic {
  title: string;
  text: string;
  code: string;
  note: string;
}

export interface SqlQuiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface SqlSection {
  week: number;
  title: string;
  description: string;
  topics: SqlTopic[];
  quizzes: SqlQuiz[];
}

export interface SqlFinalExamQuestion {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const sqlSections: SqlSection[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 1 — Introduction to Databases
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 1,
    title: "Introduction to Databases",
    description: "What a database is, why we store data in one, and how it compares to a spreadsheet.",
    topics: [
      {
        title: "What Is a Database & Why We Need One",
        text: "A database is an organized collection of data that can be stored, queried, updated, and protected as one unit. Before databases, programs kept data in plain text files: read everything, filter in memory, write everything back. That works for a handful of records but collapses at scale — it is slow, error-prone, and every program must re-invent the same searching and saving logic.\n\nA real database gives you four huge wins. **Concurrency**: thousands of users can read and write at the same time without corrupting each other. **Querying**: you ask a declarative question (\"how many orders came from Mumbai last month?\") and the engine answers fast, using indexes, instead of you hand-looping over data. **Consistency**: constraints and transactions guarantee that money is not created or lost mid-transfer. **Durability**: committed data survives crashes and power loss.\n\nIn this course we use PostgreSQL — a free, battle-tested relational database — but the ideas transfer to MySQL, SQLite, and every SQL engine. You write the same SELECT today and it runs against a local install or a cloud RDS instance with zero changes.",
        code: "-- A query asks the database a question; the engine does the work.\nSELECT name, city FROM customers WHERE city = 'Pune';",
        note: "Every social media feed, banking app, and e-commerce cart you have used reads and writes from databases — usually many of them, working behind one API.",
      },
      {
        title: "Databases vs Spreadsheets",
        text: "People often ask: why not just use Excel? A spreadsheet is a great single-user tool for calculations and one-off analysis. A database is a system for shared, correct, concurrent data. The differences matter the moment a second person, or a second device, joins in.\n\n**Multi-user writes**: two people editing the same spreadsheet cell overwrite each other; a database serializes writes with row locks so the last update never silently destroys the first. **Data volume**: spreadsheets slow down past tens of thousands of rows; databases handle billions. **Integrity**: a spreadsheet cell can hold anything — \"jan 5\", 5, or the word five — a database column has a strict type and rejects garbage. **Querying**: Excel forces manual filtering; SQL answers complex joins and aggregations in one statement.\n\nSpreadsheets are not useless. For quick budgets and one-time datasets they are ideal. The moment data becomes the source of truth for an app, has multiple users, or must not be corrupted, move it into a database.",
        code: "-- A database rejects a wrong type instead of silently storing it.\nCREATE TABLE grades (student text, score int);\n-- INSERT INTO grades VALUES ('Aisha', 'ninety');  -- ERROR: invalid input",
        note: "Companies migrate from 'Excel databases' to real databases exactly because of the three Cs: concurrency, consistency, and correct types.",
      },
      {
        title: "DBMS vs RDBMS",
        text: "A **DBMS (Database Management System)** is any software that manages a collection of data — this includes file-based, key-value, document, and graph engines. An **RDBMS (Relational DBMS)** is a specific kind: it stores data in **tables** with **rows** and **columns**, links tables through **keys**, and speaks **SQL**. PostgreSQL, MySQL, and Oracle are RDBMSes. MongoDB and Redis are DBMSes but not relational.\n\nThe relational model, invented by E. F. Codd in 1970, splits your data into small, normalized tables and joins them when you need a combined view. Customers live in one table, orders in another, and the order row carries the customer's ID — not a copy of the whole customer. This removes duplication: a customer's address changes in exactly one place and every order automatically sees the new value.\n\nWhy does this matter? Because real apps have relationships everywhere — a user has many orders, an order has many items. The relational model lets you store the facts once and recombine them freely.",
        code: "-- Customers and orders are separate tables, linked by a key.\nCREATE TABLE customers (id serial primary key, name text);\nCREATE TABLE orders (id serial primary key, customer_id int REFERENCES customers(id));",
        note: "When interviewers ask 'SQL or NoSQL?', the honest answer is 'it depends on the shape of your data and queries' — but relational thinking underlies most systems you will touch.",
      },
      {
        title: "The ACID Preview: Why Databases Don't Lose Money",
        text: "ACID is the acronym for the four guarantees a transactional relational database gives you. We study each in depth in week 14, but meet them now because they explain *why* databases exist.\n\n**A — Atomicity**: a transaction is all-or-nothing. Transferring ₹500 from A to B is two operations (debit, credit). If the credit fails, the debit must roll back too — the database never leaves A debited and B unchanged. **C — Consistency**: every transaction moves the database from one valid state to another; constraints (a balance can never go negative) are enforced. **I — Isolation**: two transactions running at once behave as if they ran one after another — A reading mid-update garbage is prevented. **D — Durability**: once you COMMIT, the change survives a power cut, because it is written to durable storage before the commit returns.\n\nMost bugs in badly-written apps come from violating these guarantees by hand. Databases give them to you for free if you use transactions.",
        code: "-- A transfer is one atomic transaction.\nBEGIN;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;",
        note: "Your bank doesn't 'hope' the transfer works — the ACID guarantees are what make a double-entry ledger safe to trust with real money.",
      },
    ],
    quizzes: [
      { text: "Which is the BIGGEST advantage of a database over a plain text file?", options: ["It takes less disk space", "It supports concurrent users, fast querying, and data integrity", "It is easier to open in a text editor", "It can be printed directly"], correctAnswer: "It supports concurrent users, fast querying, and data integrity" },
      { text: "A database column declared `int` that receives the string 'ninety' will…", options: ["store it as 90", "store it as text anyway", "reject the insert with an error", "ignore it silently"], correctAnswer: "reject the insert with an error" },
      { text: "Which statement about spreadsheets vs databases is TRUE?", options: ["Spreadsheets handle multi-user writes better than databases", "Spreadsheets stay fast with billions of rows", "Databases are better when data is the shared source of truth for an app", "Databases have no way to enforce data types"], correctAnswer: "Databases are better when data is the shared source of truth for an app" },
      { text: "An RDBMS is a DBMS that specifically…", options: ["only stores JSON documents", "stores data in tables, links them with keys, and speaks SQL", "runs only on mobile devices", "cannot enforce any constraints"], correctAnswer: "stores data in tables, links them with keys, and speaks SQL" },
      { text: "In Codd's relational model, an order row references a customer using…", options: ["a copy of the entire customer row", "the customer's ID (a key), not a duplicate", "the customer's name only", "a random number"], correctAnswer: "the customer's ID (a key), not a duplicate" },
      { text: "The 'A' in ACID (Atomicity) means…", options: ["a transaction is all-or-nothing", "data can be partially written", "the database is always available", "records are sorted alphabetically"], correctAnswer: "a transaction is all-or-nothing" },
      { text: "The ACID guarantee that a COMMITted change survives a power cut is…", options: ["Atomicity", "Isolation", "Durability", "Concurrency"], correctAnswer: "Durability" },
      { text: "In the transfer example, what happens if the second UPDATE fails?", options: ["The first debit stays, so money is lost", "The whole transaction rolls back — both changes are undone", "The transaction continues anyway", "The database shuts down"], correctAnswer: "The whole transaction rolls back — both changes are undone" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 2 — Relational Database Concepts
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 2,
    title: "Relational Database Concepts",
    description: "Tables, rows, columns, keys, and the relationships that tie data together.",
    topics: [
      {
        title: "Tables, Rows & Columns",
        text: "The relational model stores everything in **tables**. Think of a table as a grid: **columns** define the kind of data stored (name text, age int), **rows** hold one record each. A column is also called an **attribute**; a row is a **record** or **tuple**. The table name is usually a plural noun describing what it holds — `students`, `orders`, `payments`.\n\nEvery column has a **type** that the engine enforces: TEXT, INTEGER, NUMERIC, DATE, BOOLEAN, JSONB, and more. Types are your first line of defense — the database refuses to compare an age with 'abc'. A table also has **columns that can be empty** (NULL means unknown, not zero) and **columns that must have a value** (NOT NULL).\n\nReading a table is intuitive: each row is one fact about one thing. `SELECT * FROM students;` shows every student. `SELECT name FROM students;` shows only the name column. That is the entire mental model — SQL is just a precise language for slicing these grids.",
        code: "-- A tiny table: two columns, two rows.\nCREATE TABLE students (id serial, name text, age int);\nINSERT INTO students (name, age) VALUES ('Aisha', 20), ('Rahul', 21);\nSELECT name FROM students;",
        note: "When a UI shows a list of users, a table, or a chart, behind it is almost always a SELECT over one or more tables.",
      },
      {
        title: "Primary Keys: The Identity of a Row",
        text: "A **primary key (PK)** is the column (or combination of columns) that uniquely identifies each row. No two rows may share the same PK value, and the PK can never be NULL. Most tables use an auto-incrementing integer `id` as the PK — `id serial primary key` in PostgreSQL.\n\nThe primary key is what makes relationships possible. When another table wants to point at a student, it stores the student's *id*, not the student's *name* (names repeat; ids don't). This single decision — store the ID, not the data — is the foundation of the whole relational model.\n\nYou can also have **composite primary keys** (two columns together form the identity), for example `(course_id, student_id)` in an enrollment table — one student can enroll in many courses, and one course has many students, but the same pair appears only once.",
        code: "-- An auto id is the simplest primary key.\nCREATE TABLE students (id serial primary key, name text);\n-- The same pair is unique in a junction table:\nCREATE TABLE enrollments (course_id int, student_id int, primary key (course_id, student_id));",
        note: "Pick a stable, meaningless PK (an auto id) over a 'natural' one like email or Aadhaar — emails change and personal data should not be a key.",
      },
      {
        title: "Foreign Keys & Referential Integrity",
        text: "A **foreign key (FK)** is a column in one table that references the primary key of another table. It is the glue of the relational model. In `orders.customer_id REFERENCES customers(id)`, the engine guarantees **referential integrity**: you cannot insert an order pointing to a customer that does not exist, and you cannot delete a customer who still has orders (unless you tell the engine what to do).\n\nThis is the difference between a database and a loose pile of files — the database *enforces* the relationship, so dangling references are impossible. You decide what happens on delete:\n- `ON DELETE CASCADE` — delete the customer's orders too.\n- `ON DELETE SET NULL` — keep the orders but blank the customer_id.\n- `ON DELETE RESTRICT` (default) — refuse to delete the customer while orders exist.\n\nChoosing the right rule is a design decision: a shopping cart should cascade; an audit log should restrict or set null.",
        code: "-- FK with a delete rule.\nCREATE TABLE orders (\n  id serial primary key,\n  customer_id int REFERENCES customers(id) ON DELETE CASCADE\n);",
        note: "The 'cannot delete a customer with orders' error every junior dev hits is referential integrity doing its job — it is protecting you from corrupt data.",
      },
      {
        title: "Relationships: One-to-One, One-to-Many, Many-to-Many",
        text: "Real data is connected. The three relationship shapes you must recognize:\n\n**One-to-many (1:M)** — the most common. One customer has many orders; each order belongs to one customer. Implemented with a foreign key on the 'many' side (orders.customer_id).\n\n**One-to-one (1:1)** — each user has at most one profile. Rare; implement it when a table gets wide and you want to split rarely-used columns, or when two systems own different halves. A FK with a UNIQUE constraint models it.\n\n**Many-to-many (M:N)** — students and courses: one student takes many courses, one course has many students. Implemented with a **junction table** (also called join table) that holds two foreign keys: `enrollments(course_id, student_id)`. The junction's two FKs point at both sides and together are its primary key.\n\nBeing able to look at a problem and draw these three shapes is half of database design. Everything else — keys, joins, normalization — follows from getting the shapes right.",
        code: "-- M:N needs a junction table.\nCREATE TABLE courses (id serial primary key, title text);\nCREATE TABLE students (id serial primary key, name text);\nCREATE TABLE enrollments (\n  course_id int REFERENCES courses(id),\n  student_id int REFERENCES students(id),\n  primary key (course_id, student_id)\n);",
        note: "When your boss says 'design the database for this app', the first thing you do is list the entities and draw the relationship lines between them.",
      },
    ],
    quizzes: [
      { text: "A primary key must always be…", options: ["unique and non-NULL", "an integer", "the first column", "a text value"], correctAnswer: "unique and non-NULL" },
      { text: "Why do we reference a student by ID instead of by name?", options: ["Names are shorter", "IDs are unique and stable; names repeat and change", "The database only understands numbers", "Names are case-sensitive"], correctAnswer: "IDs are unique and stable; names repeat and change" },
      { text: "A foreign key in orders referencing customers(id) prevents…", options: ["two customers with the same name", "an order that points to a non-existent customer", "duplicate order ids", "NULL values in the order"], correctAnswer: "an order that points to a non-existent customer" },
      { text: "`ON DELETE CASCADE` means…", options: ["deleting the parent deletes its related rows too", "the delete is refused", "the child rows are set to NULL", "the parent cannot be deleted ever"], correctAnswer: "deleting the parent deletes its related rows too" },
      { text: "A many-to-many relationship is implemented with…", options: ["a duplicate column on both tables", "a junction table holding two foreign keys", "a single foreign key on either side", "three primary keys"], correctAnswer: "a junction table holding two foreign keys" },
      { text: "The most common relationship shape in real apps is…", options: ["one-to-one", "many-to-many", "one-to-many", "zero-to-one"], correctAnswer: "one-to-many" },
      { text: "A column declared NOT NULL…", options: ["may store NULL", "rejects NULL values", "is automatically the primary key", "cannot be indexed"], correctAnswer: "rejects NULL values" },
      { text: "In an enrollments junction table, the primary key is…", options: ["the course_id alone", "the student_id alone", "the pair (course_id, student_id)", "an auto-increment id"], correctAnswer: "the pair (course_id, student_id)" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 3 — SQL Basics (SELECT, WHERE)
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 3,
    title: "SQL Basics (SELECT, WHERE)",
    description: "Read data with SELECT, filter it with WHERE, and handle NULLs and aliases.",
    topics: [
      {
        title: "Anatomy of a SELECT Statement",
        text: "SELECT is the command you will use most. Its shape is: `SELECT <columns> FROM <table> [WHERE ...] [ORDER BY ...] [LIMIT n];`. SQL is **declarative** — you say *what* you want, not *how* to get it. The engine figures out the steps.\n\n`SELECT *` returns every column; naming columns returns only those. You can compute on the fly: `SELECT price, price * 0.05 AS tax FROM products;` — the `AS` gives the computed column a name (alias). You can also pick distinct values with `SELECT DISTINCT city FROM customers;`.\n\nThree habits save you pain later. (1) Always end statements with a semicolon. (2) Use `AS` for computed columns so your result is readable. (3) In production code, name the columns explicitly instead of `SELECT *` — it keeps the query stable when the table grows. The result of a SELECT is itself a table — a fact that powers views and subqueries later.",
        code: "SELECT name, price, price * 0.05 AS tax\nFROM products\nWHERE price > 100;",
        note: "Every dashboard, report, and admin page you have seen is some SELECT statement rendered into a grid.",
      },
      {
        title: "Filtering with WHERE",
        text: "WHERE filters rows **before** they are returned. The condition is evaluated per row; only rows where it is true survive. Comparison operators: `=`, `<>` (not equal), `>`, `<`, `>=`, `<=`. Combine conditions with `AND` (both must hold) and `OR` (either may hold).\n\nWatch the classic traps:\n- `WHERE score = 5` is equality — single `=` in SQL, not `==`.\n- Text comparisons are case-sensitive in many engines; `WHERE name = 'alice'` won't match 'Alice' — use ILIKE or LOWER() when needed.\n- `NULL` is not a value — `WHERE city = NULL` matches nothing. Test with `WHERE city IS NULL`.\n- Operator precedence: AND binds tighter than OR, so `a OR b AND c` means `a OR (b AND c)`. Add parentheses when mixing.\n\nFiltering happens at the database, not in your app — that is the point: only the rows you need cross the network.",
        code: "SELECT name, age FROM students\nWHERE city = 'Pune' AND age >= 18;",
        note: "A well-filtered WHERE is also a performance move — the engine can use indexes to skip rows instead of reading them all.",
      },
      {
        title: "NULLs: The Third State",
        text: "NULL means 'unknown / no value' — it is not 0, not an empty string, not FALSE. It is a third state that infects every operation it touches. `5 + NULL` is NULL. `'a' = NULL` is NULL (unknown), not TRUE or FALSE. This is why `WHERE x = NULL` always fails — you must use `IS NULL` / `IS NOT NULL`.\n\nNULL appears when a column was never filled in (a phone number not yet provided), when an outer join has no match, or when you deliberately store 'not applicable'. Real apps must decide: does an empty text box mean NULL (unknown) or '' (explicitly empty)? The distinction matters for counting and reporting.\n\nAggregates treat NULL specially — COUNT(*) counts rows, but COUNT(column) counts only non-NULL values; SUM/AVG ignore NULLs entirely. Get comfortable with NULL and you avoid the most common 'my query returns wrong numbers' bug in SQL.",
        code: "-- Comparing to NULL with = never works.\nSELECT name FROM students WHERE phone IS NULL;",
        note: "Bugs from NULL are so common they have a name: 'the NULL problem'. Almost every wrong aggregate in a report is NULL sneaking in.",
      },
      {
        title: "Aliases & Computed Columns",
        text: "An **alias** renames a column or table for the duration of a query, using `AS`. `SELECT price * 0.18 AS gst FROM products;` produces a column literally named `gst`. Aliases also clean up joins: `FROM orders AS o JOIN customers AS c ON o.customer_id = c.id` lets you write `o.total` instead of the full table names.\n\nComputed columns let the database do math, string work, and dates while you query: `ROUND(price, 2)`, `LOWER(email)`, `DATE_TRUNC('month', created_at)`. The golden rule: compute in SQL where the engine is fast at it, but keep presentation (formatting currency, decimals) in your app layer.\n\nAliases do NOT rename the table in the database — they only exist for that one query. If you write a column alias and use it in WHERE, some engines reject it (`WHERE gst > 10` may fail; use the full expression or a subquery).",
        code: "SELECT name, ROUND(price * 0.18, 2) AS gst\nFROM products\nWHERE price > 50;",
        note: "In a big join, aliases are what keep your query readable instead of a wall of table.column names.",
      },
    ],
    quizzes: [
      { text: "`SELECT *` returns…", options: ["only the primary key", "every column of the table", "only numeric columns", "a random subset"], correctAnswer: "every column of the table" },
      { text: "Which correctly filters rows older than 18?", options: ["WHERE age > 18", "WHERE age == 18", "WHERE age = '18'", "WHERE age IS 18"], correctAnswer: "WHERE age > 18" },
      { text: "`WHERE city = NULL` matches…", options: ["rows where city is empty", "rows where city is the text 'NULL'", "nothing — you must use IS NULL", "rows where city is 0"], correctAnswer: "nothing — you must use IS NULL" },
      { text: "`5 + NULL` evaluates to…", options: ["5", "0", "NULL", "an error"], correctAnswer: "NULL" },
      { text: "The purpose of `AS` in `SELECT price * 0.18 AS gst` is to…", options: ["permanently rename the column", "name the computed column for this query", "make the column the primary key", "delete the column"], correctAnswer: "name the computed column for this query" },
      { text: "In SQL, text comparison with = is…", options: ["case-insensitive by default", "often case-sensitive (use LOWER or ILIKE when needed)", "always converts to numbers", "not allowed"], correctAnswer: "often case-sensitive (use LOWER or ILIKE when needed)" },
      { text: "COUNT(column) counts…", options: ["all rows including NULLs", "only non-NULL values of that column", "only distinct values", "only NULL values"], correctAnswer: "only non-NULL values of that column" },
      { text: "Which expression is valid to select the city once per distinct value?", options: ["SELECT UNIQUE city", "SELECT DISTINCT city", "SELECT ONLY city", "SELECT CITY ONCE"], correctAnswer: "SELECT DISTINCT city" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 4 — Data Filtering & Sorting
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 4,
    title: "Data Filtering & Sorting",
    description: "Rich filtering with IN, BETWEEN, LIKE and boolean logic, plus ORDER BY and LIMIT.",
    topics: [
      {
        title: "IN, BETWEEN & LIKE",
        text: "Three operators make WHERE far more expressive:\n\n**IN** matches any of a list: `WHERE city IN ('Pune', 'Mumbai', 'Delhi')` — cleaner than three ORs. **BETWEEN** is inclusive on both ends: `WHERE age BETWEEN 18 AND 25` means `age >= 18 AND age <= 25`. **LIKE** does pattern matching on text: `%` matches any run of characters, `_` matches exactly one. `WHERE name LIKE 'A%'` finds names starting with A; `'%sh'` finds names ending in 'sh'; `'_an%'` finds names with any character then 'an'.\n\nLIKE is case-sensitive in standard SQL — PostgreSQL gives you **ILIKE** for case-insensitive matching. The `%` wildcard cannot match NULL. And a LIKE pattern starting with `%` (e.g. `'%xyz'`) cannot use a normal index efficiently — it forces a full scan, which is why 'starts-with' searches are fast and 'ends-with' searches are slow on big tables.",
        code: "SELECT name FROM customers\nWHERE city IN ('Pune', 'Mumbai')\n  AND name ILIKE 'a%';",
        note: "Search boxes you see in apps usually translate to ILIKE '%typed%' under the hood — simple and forgiving.",
      },
      {
        title: "Boolean Logic: AND, OR, NOT",
        text: "Filtering is Boolean logic over each row. **AND** — both sides true. **OR** — at least one side true. **NOT** — inverts. SQL evaluates AND before OR, so `A OR B AND C` parses as `A OR (B AND C)`. When in doubt, parenthesize — it is free and removes ambiguity for readers.\n\nA common real filter: 'premium customers in Pune, or any customer who spent over ₹50k'. That is `(premium = true AND city = 'Pune') OR total_spent > 50000`. Note the parentheses — without them the semantics change.\n\nYou can also use `NOT IN` and `NOT LIKE`, but beware: `NOT IN` with a NULL in the list yields no rows (because NULL comparisons yield unknown). A surprisingly common production bug. When a subquery might return NULLs, prefer `NOT EXISTS`.",
        code: "SELECT name FROM customers\nWHERE (premium = true AND city = 'Pune')\n   OR total_spent > 50000;",
        note: "Marketing 'segments' are just WHERE clauses with careful AND/OR grouping — the parentheses are what make the segment mean what the marketer thinks it means.",
      },
      {
        title: "ORDER BY: Sorting Results",
        text: "Without ORDER BY, a database returns rows in whatever order it finds them — typically insertion or index order, but never rely on it. To sort, add `ORDER BY column [ASC | DESC]`. Default is ascending; text sorts alphabetically, numbers numerically, dates chronologically. Tie-breakers: `ORDER BY score DESC, name ASC` sorts by score, and within equal scores, alphabetically by name.\n\nNULLs sort last in ascending order in PostgreSQL (and first in DESC). Sorting is done on the server, so it works on columns even when they are not in the SELECT list: `SELECT name FROM students ORDER BY age DESC;` is valid.\n\nSorting a huge result is expensive — the engine may sort a whole temporary file. If your query sorts a filtered-down result (via WHERE and LIMIT) it is cheap; sorting before filtering is where performance dies. In production, add an index that matches the sort column.",
        code: "SELECT name, score FROM students\nORDER BY score DESC, name ASC\nLIMIT 10;",
        note: "Leaderboards are just `ORDER BY score DESC LIMIT 10` — every ranking feature you have used is this line with a WHERE for the season.",
      },
      {
        title: "LIMIT, OFFSET & Pagination",
        text: "**LIMIT** caps how many rows a query returns; **OFFSET** skips that many first. `LIMIT 10 OFFSET 20` returns rows 21–30 — the classic way to build pages 1, 2, 3… of results. LIMIT without OFFSET is how you get 'top 5' reports.\n\nTwo practical warnings. (1) **OFFSET grows slow**: to show page 10,000 the database must compute and discard the first 99,990 rows. For deep pagination use keyset pagination instead — `WHERE id > last_seen_id ORDER BY id LIMIT 20` — which jumps straight to the right place using the index. (2) Always pair LIMIT with ORDER BY, otherwise 'the first 10 rows' are arbitrary.\n\nLIMIT also does something subtle: applied without ORDER BY it still returns *some* 10 rows, so a 'random sample' that forgets `ORDER BY random()` is just the first 10 — not random at all.",
        code: "-- Page 3 of 10-per-page results:\nSELECT * FROM orders\nORDER BY created_at DESC\nLIMIT 10 OFFSET 20;",
        note: "Infinite-scroll feeds use keyset pagination (WHERE id < last_id) because OFFSET would make each scroll slower than the last.",
      },
    ],
    quizzes: [
      { text: "`WHERE city IN ('Pune', 'Mumbai')` is equivalent to…", options: ["city = 'Pune' AND city = 'Mumbai'", "city = 'Pune' OR city = 'Mumbai'", "city BETWEEN 'Pune' AND 'Mumbai'", "city LIKE 'Pune,Mumbai'"], correctAnswer: "city = 'Pune' OR city = 'Mumbai'" },
      { text: "`WHERE age BETWEEN 18 AND 25` includes…", options: ["only 19 to 24", "18 and 25 inclusive", "18 and 25 exclusive", "only 18"], correctAnswer: "18 and 25 inclusive" },
      { text: "`name LIKE 'A%'` matches…", options: ["names containing the letter A", "names starting with A", "names exactly 'A'", "names with A in position 2"], correctAnswer: "names starting with A" },
      { text: "In SQL, `A OR B AND C` is evaluated as…", options: ["(A OR B) AND C", "A OR (B AND C)", "(A AND B) OR C", "A AND B AND C"], correctAnswer: "A OR (B AND C)" },
      { text: "Why is `NOT IN` with a NULL in the list dangerous?", options: ["It errors", "It returns no rows at all", "It returns all rows", "It ignores the NULL"], correctAnswer: "It returns no rows at all" },
      { text: "Which ORDER BY sorts best scores first?", options: ["ORDER BY score ASC", "ORDER BY score DESC", "ORDER BY score", "ORDER BY score ASC NULLS LAST"], correctAnswer: "ORDER BY score DESC" },
      { text: "`LIMIT 10 OFFSET 20` returns…", options: ["rows 1 to 10", "rows 11 to 20", "rows 21 to 30", "rows 20 to 29"], correctAnswer: "rows 21 to 30" },
      { text: "Why is OFFSET slow for deep pagination?", options: ["It locks the table", "The engine must compute and discard all earlier rows each time", "It cannot use ORDER BY", "It returns JSON"], correctAnswer: "The engine must compute and discard all earlier rows each time" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 5 — SQL Functions (Aggregate)
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 5,
    title: "SQL Functions (Aggregate)",
    description: "COUNT, SUM, AVG, MIN, MAX, DISTINCT, and scalar string/number functions.",
    topics: [
      {
        title: "Aggregates: COUNT, SUM, AVG, MIN, MAX",
        text: "Aggregate functions collapse many rows into one number. They answer questions like 'how many?', 'how much total?', 'what's the average?' — in one query instead of a download-and-loop.\n\n- **COUNT(*)** — number of rows (including NULL-heavy rows). `COUNT(column)` counts non-NULL values only. `COUNT(DISTINCT column)` counts unique values.\n- **SUM(column)** — total, ignoring NULLs.\n- **AVG(column)** — arithmetic mean, ignoring NULLs.\n- **MIN / MAX** — smallest/largest, works on numbers, dates, and text.\n\nAll aggregates ignore NULL inputs (except COUNT(*)). The result is a single row with one value per aggregate. You can mix aggregates in one SELECT: `SELECT COUNT(*) AS orders, SUM(total) AS revenue, AVG(total) AS avg_order FROM orders;`. Aggregates combine beautifully with GROUP BY (next section) — without it they summarize the whole table at once.",
        code: "SELECT\n  COUNT(*) AS total_orders,\n  SUM(total) AS revenue,\n  AVG(total) AS avg_order,\n  MAX(total) AS biggest_order\nFROM orders;",
        note: "When a CFO asks 'what's our revenue?', the answer is one SUM(query). Aggregates are the most business-critical lines in any codebase.",
      },
      {
        title: "DISTINCT: Unique Values",
        text: "`SELECT DISTINCT column` returns one row per unique value — it deduplicates. `SELECT DISTINCT city FROM customers;` lists the cities your customers live in. `COUNT(DISTINCT city)` counts them.\n\nTwo subtleties. (1) DISTINCT applies to the whole row of the SELECT list: `SELECT DISTINCT city, state` treats ('Pune','MH') and ('Pune','UP') as different because the pair differs. If you want unique cities across the pair, select city alone. (2) DISTINCT and NULL: in standard SQL, NULLs are considered equal to each other for DISTINCT purposes, so one NULL appears.\n\nDISTINCT is not free — the engine must sort or hash the values to find duplicates. On huge tables, prefer GROUP BY or EXISTS/subquery patterns when you need 'which customers have at least one order' — a JOIN + DISTINCT can be replaced by EXISTS for much better speed.",
        code: "-- How many different cities, and which are they?\nSELECT COUNT(DISTINCT city) AS city_count FROM customers;\nSELECT DISTINCT city FROM customers ORDER BY city;",
        note: "'How many unique users visited today?' is COUNT(DISTINCT user_id) — the standard metric behind every analytics dashboard.",
      },
      {
        title: "Scalar Functions: Strings & Numbers",
        text: "Scalar functions transform one value at a time (unlike aggregates, which collapse many). String helpers: `UPPER(x)`, `LOWER(x)`, `LENGTH(x)`, `TRIM(x)`, `SUBSTRING(x FROM 1 FOR 3)`, `REPLACE(x, a, b)`. Number helpers: `ROUND(x, n)`, `CEIL(x)`, `FLOOR(x)`, `ABS(x)`. Date helpers: `CURRENT_DATE`, `NOW()`, `EXTRACT(YEAR FROM created_at)`, `AGE(born_at)`.\n\nChaining works: `LOWER(TRIM(email))` normalizes an email before comparison. This is how you deduplicate on clean values: store canonical lowercase, compare lowercase.\n\nA key habit: do string/number cleanup **in the database** when it is part of filtering or grouping, and keep currency/date **formatting** (₹1,23,456.78) in your app layer — the database should return raw values, not pre-formatted display strings.",
        code: "SELECT name, UPPER(city) AS city_upper, EXTRACT(YEAR FROM joined_at) AS join_year\nFROM students;",
        note: "`WHERE LOWER(email) = LOWER($1)` is how login systems stop 'Rahul@gmail.com' vs 'rahul@gmail.com' mismatches.",
      },
      {
        title: "Aggregates + NULLs: The Silent Skew",
        text: "Aggregates silently ignore NULLs, and that can skew your numbers without any error. `AVG(score)` over five students where one has a NULL score divides by four, not five — the NULL student is dropped, so the average looks better than reality.\n\nThe fix is to decide explicitly what NULL means. If a missing score should count as 0, use `COALESCE(score, 0)` before aggregating. If a student with no score should be excluded, let the aggregate ignore it. Both are defensible — the sin is not knowing which one you are getting.\n\n`COALESCE(a, b, ...)` returns the first non-NULL argument — your universal NULL-buster. Use it in SELECTs, in WHERE (`WHERE COALESCE(discount, 0) > 0`), and in joins. Another tool: `NULLIF(a, b)` returns NULL when a = b — handy for 'divide by zero' guards: `AVG(price * NULLIF(quantity, 0))`.",
        code: "-- Missing scores become 0 so the average is honest.\nSELECT AVG(COALESCE(score, 0)) AS avg_score FROM students;",
        note: "A dashboard that says 'average rating 4.8' while 2,000 unrated orders were silently dropped is this exact NULL-skew bug in production.",
      },
    ],
    quizzes: [
      { text: "Which aggregate returns the number of rows?", options: ["SUM(*)", "COUNT(*)", "MAX(*)", "AVG(*)"], correctAnswer: "COUNT(*)" },
      { text: "`COUNT(column)` differs from `COUNT(*)` because it…", options: ["counts only non-NULL values", "counts only NULL values", "is faster always", "returns text"], correctAnswer: "counts only non-NULL values" },
      { text: "AVG over rows where one value is NULL will…", options: ["return NULL always", "ignore the NULL row and divide by the non-NULL count", "treat the NULL as 0", "throw an error"], correctAnswer: "ignore the NULL row and divide by the non-NULL count" },
      { text: "`SELECT DISTINCT city, state` treats ('Pune','MH') and ('Pune','UP') as…", options: ["the same row", "different rows because the pair differs", "an error", "NULLs"], correctAnswer: "different rows because the pair differs" },
      { text: "Which function makes a missing value act like 0?", options: ["NULLIF(x, 0)", "COALESCE(x, 0)", "ZERO(x)", "FILL(x)"], correctAnswer: "COALESCE(x, 0)" },
      { text: "To count how many different cities appear, use…", options: ["COUNT(city)", "COUNT(DISTINCT city)", "SUM(DISTINCT city)", "MAX(city)"], correctAnswer: "COUNT(DISTINCT city)" },
      { text: "Which returns the largest value in a column?", options: ["MAX(column)", "TOP(column)", "LARGE(column)", "BIGGEST(column)"], correctAnswer: "MAX(column)" },
      { text: "`NULLIF(a, b)` returns NULL when…", options: ["a and b are different", "a equals b", "a is 0", "b is NULL"], correctAnswer: "a equals b" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 6 — Group By & Having Clauses
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 6,
    title: "Group By & Having Clauses",
    description: "Split rows into groups, aggregate per group, and filter groups with HAVING.",
    topics: [
      {
        title: "GROUP BY: Aggregates per Bucket",
        text: "GROUP BY splits rows into buckets and runs the aggregate once per bucket. `SELECT city, COUNT(*) FROM customers GROUP BY city;` gives one row per city with the count. Without GROUP BY, an aggregate summarizes the whole table; with it, every aggregate in the SELECT applies *within* each group.\n\nRule that trips everyone: every column in the SELECT list that is not an aggregate **must** appear in GROUP BY. `SELECT city, COUNT(*) FROM customers` without GROUP BY fails in most engines — which column's city should it show when there are ten cities? The engine refuses to guess.\n\nGrouping is the heart of reporting — 'sales per month', 'errors per endpoint', 'students per college' are all `GROUP BY`. You can group by multiple columns (`GROUP BY city, state`) to get nested buckets.",
        code: "SELECT city, COUNT(*) AS customers, SUM(spent) AS revenue\nFROM customers\nGROUP BY city;",
        note: "Every 'per X' number in a business — per region, per product, per day — is GROUP BY under the hood.",
      },
      {
        title: "HAVING vs WHERE",
        text: "WHERE filters **rows before** grouping; HAVING filters **groups after** grouping. The classic error is `WHERE COUNT(*) > 5` — aggregate functions are not allowed in WHERE (the rows don't exist yet as groups). You must write `HAVING COUNT(*) > 5`.\n\nThink of the pipeline: raw rows → WHERE removes rows → GROUP BY buckets them → aggregates compute per bucket → HAVING removes whole buckets → ORDER BY sorts → LIMIT caps. WHERE and HAVING operate at different stages, so you can use both: `WHERE active = true GROUP BY city HAVING COUNT(*) > 5` — filter to active customers, group, then keep only cities with more than five.\n\nPerformance note: because HAVING filters after aggregation, it must compute every group first. Pushing the same condition into WHERE (when possible) lets indexes skip rows earlier.",
        code: "SELECT city, COUNT(*) AS n\nFROM customers\nWHERE active = true\nGROUP BY city\nHAVING COUNT(*) > 5;",
        note: "Newcomers write WHERE COUNT(*) and get an error; the error message is the database politely explaining that filtering order matters.",
      },
      {
        title: "Grouping by Multiple Columns",
        text: "Grouping by several columns creates nested buckets. `GROUP BY state, city` groups by state, and within each state, by city. Your aggregates then report per (state, city) pair. The SELECT list can show any subset as long as every non-aggregate column is in the GROUP BY — `SELECT state, COUNT(*) ... GROUP BY state, city` is invalid (city isn't selected but is in GROUP BY — actually that's allowed: you can GROUP BY more than you select).\n\nReal pattern: `GROUP BY state, city` then `ORDER BY state, count DESC` gives a nicely ordered per-state city leaderboard. You can also roll up: `GROUP BY ROLLUP(state, city)` adds a subtotal row per state — a one-line feature that takes a whole app page otherwise.\n\nWatch cardinality: grouping by a high-cardinality column (like an order id) yields one row per value — effectively no aggregation. Only group by columns with few distinct values.",
        code: "SELECT state, city, COUNT(*) AS n\nFROM customers\nGROUP BY state, city\nORDER BY state, n DESC;",
        note: "Analytics tools' 'group by two dimensions' dropdowns are literally this SQL statement generated behind the scenes.",
      },
      {
        title: "Real-World: Monthly Revenue Report",
        text: "Put it together: a revenue-by-month report. `DATE_TRUNC('month', created_at)` rounds each order's timestamp down to its month, so grouping by it buckets orders by month. Then SUM(total) per bucket, ORDER BY month.\n\n```sql\nSELECT\n  DATE_TRUNC('month', created_at) AS month,\n  COUNT(*) AS orders,\n  SUM(total) AS revenue\nFROM orders\nWHERE created_at >= NOW() - INTERVAL '12 months'\nGROUP BY month\nORDER BY month;\n```\n\nNotice the pipeline: WHERE trims to the last year first (cheap, indexable), grouping buckets by month, aggregates count and sum per month, ORDER BY sorts chronologically. The same skeleton — change the bucket to week or city or product — produces an infinite variety of reports.\n\nA trick for 'top N per group': use `ROW_NUMBER() OVER (PARTITION BY month ORDER BY total DESC)` to rank rows within each group, then filter to rank <= 3 in an outer query — giving 'top 3 products each month' in one statement.",
        code: "SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue\nFROM orders\nGROUP BY month\nORDER BY month;",
        note: "The 'monthly revenue trend' chart on a startup's dashboard is this exact query, cached and refreshed hourly.",
      },
    ],
    quizzes: [
      { text: "GROUP BY lets aggregates run…", options: ["once for the whole table only", "once per group of rows", "on the SELECT list only", "on WHERE conditions"], correctAnswer: "once per group of rows" },
      { text: "Every non-aggregate column in the SELECT list must…", options: ["be in the WHERE clause", "appear in GROUP BY", "be an integer", "have an alias"], correctAnswer: "appear in GROUP BY" },
      { text: "Why is `WHERE COUNT(*) > 5` invalid?", options: ["COUNT is not a function", "Aggregates run after WHERE filters rows, so groups do not exist yet", "WHERE cannot use numbers", "COUNT only works in SELECT"], correctAnswer: "Aggregates run after WHERE filters rows, so groups do not exist yet" },
      { text: "HAVING filters…", options: ["rows before grouping", "whole groups after aggregation", "the SELECT list", "the ORDER BY"], correctAnswer: "whole groups after aggregation" },
      { text: "To keep only cities with more than 5 customers, use…", options: ["WHERE COUNT(*) > 5", "HAVING COUNT(*) > 5", "GROUP BY COUNT(*)", "LIMIT COUNT(*)"], correctAnswer: "HAVING COUNT(*) > 5" },
      { text: "`GROUP BY state, city` creates…", options: ["two separate result sets", "nested buckets: state, then city within each", "one bucket per row", "an error"], correctAnswer: "nested buckets: state, then city within each" },
      { text: "Grouping by a high-cardinality column like an order id is…", options: ["ideal for reports", "effectively no aggregation — one row per value", "an error", "the same as DISTINCT"], correctAnswer: "effectively no aggregation — one row per value" },
      { text: "To find the top 3 products per month, use…", options: ["LIMIT 3", "ROW_NUMBER() OVER (PARTITION BY month ORDER BY total DESC)", "GROUP BY products LIMIT 3", "DISTINCT TOP 3"], correctAnswer: "ROW_NUMBER() OVER (PARTITION BY month ORDER BY total DESC)" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 7 — SQL Joins (Inner, Left, Right)
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 7,
    title: "SQL Joins (Inner, Left, Right)",
    description: "Combine tables with INNER, LEFT, RIGHT and FULL joins, plus self-joins.",
    topics: [
      {
        title: "INNER JOIN: Only the Matches",
        text: "A join combines rows from two tables on a condition, usually matching a foreign key to a primary key. **INNER JOIN** keeps only rows where the condition matches on both sides — an order and its customer; unmatched orders and customers disappear.\n\nSyntax: `FROM orders INNER JOIN customers ON orders.customer_id = customers.id`. The `ON` is the join condition; it is a regular boolean, so you can join on more than equality. If the condition is equality on a column name both tables share, `USING (customer_id)` is a shorthand.\n\nThink of an inner join as an intersection: rows present in both. It answers 'things with a match' — 'all orders that have a customer', 'all students enrolled in at least one course'. If a row matches several rows on the other side, it is duplicated once per match — a join can *multiply* rows; forgetting that is a classic bug (an order with 3 items joined to the items table appears 3 times).",
        code: "SELECT o.id, c.name\nFROM orders o\nINNER JOIN customers c ON o.customer_id = c.id;",
        note: "Every 'show me orders with the customer name' screen is an inner join — the most-used join in production SQL.",
      },
      {
        title: "LEFT JOIN: Keep Everything from One Side",
        text: "**LEFT JOIN** keeps every row from the left (first) table, and fills in matching columns from the right table, or NULLs when there is no match. It answers 'everything from A, plus whatever B has for it'.\n\nThe canonical use: 'every customer, and their orders if any'. `FROM customers LEFT JOIN orders ON ...` — customers with zero orders still appear, with NULL order columns. That is exactly how you find them: `WHERE o.id IS NULL`.\n\nThe `RIGHT JOIN` is the mirror — keep all right rows. Because you can always flip the tables and use LEFT, RIGHT is rarer; teams standardize on LEFT for readability. A **FULL OUTER JOIN** keeps everything from both sides (rows matched, plus unmatched from left with NULL right, and unmatched right with NULL left) — used in reconciliation: 'which ids are in table A but not B, and vice versa'.",
        code: "-- Customers with no orders show with NULL order columns.\nSELECT c.name, o.id AS order_id\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id;",
        note: "The 'users who signed up but never ordered' report that drives onboarding emails is a LEFT JOIN with a `WHERE o.id IS NULL`.",
      },
      {
        title: "Self-Joins: A Table Joining Itself",
        text: "A **self-join** joins a table to itself, using two different aliases. It is needed whenever a row relates to another row in the same table. Classic example: employees with a manager_id pointing at another employee's id.\n\n```sql\nSELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n```\n\nThe aliases `e` and `m` let you treat the same physical table as two logical ones. Self-joins power hierarchies (org charts, categories-with-parent, threads with replies, friends/followers graphs). Because the join can go either way, a 'friends' table often stores both directions, or you join twice for symmetric pairs.\n\nSelf-joins are where SQL beginners get lost, but the shape is always the same: alias the table twice and join on the self-referencing column.",
        code: "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;",
        note: "The 'reporting structure' page in HR systems — who reports to whom — is one self-join. Folders-in-folders, too.",
      },
      {
        title: "Choosing the Right Join",
        text: "Pick the join by what you want to keep:\n- **INNER** — only matched rows on both sides. Use when a row without its counterpart is irrelevant.\n- **LEFT** — all left rows, matches-or-NULL. Use for 'A with optional B', or to find A's without B.\n- **RIGHT** — the mirror; flip tables and use LEFT.\n- **FULL OUTER** — everything from both sides. Reconciliation of two systems.\n- **CROSS** — every combination of left×right rows (rare; use deliberately).\n\nThe mental test: 'should a customer with zero orders appear in the output?' If yes → LEFT. If no → INNER. That one question decides 90% of join choices. Also decide the join condition carefully — joining on the wrong column silently produces duplicated or missing rows, and it never errors. Verify by spot-counting after you write a join.",
        code: "-- Employees without a team still show (LEFT); only paired show (INNER).\nSELECT e.name, t.name AS team\nFROM employees e\nLEFT JOIN teams t ON e.team_id = t.id;",
        note: "Interview question 'INNER vs LEFT join' is really testing whether you think about which rows must survive — not the syntax.",
      },
    ],
    quizzes: [
      { text: "INNER JOIN keeps…", options: ["all rows from the left table", "only rows that match on both sides", "all rows from both tables", "only the left table"], correctAnswer: "only rows that match on both sides" },
      { text: "A customer with zero orders appears in…", options: ["INNER JOIN only", "LEFT JOIN (with NULL order columns), not INNER", "neither join", "CROSS JOIN only"], correctAnswer: "LEFT JOIN (with NULL order columns), not INNER" },
      { text: "To find customers who have no orders, use LEFT JOIN and check…", options: ["c.name IS NULL", "o.id IS NULL", "o.id = 0", "COUNT(o.id) = 1"], correctAnswer: "o.id IS NULL" },
      { text: "A self-join requires…", options: ["three tables", "aliasing the same table twice", "a junction table", "a subquery"], correctAnswer: "aliasing the same table twice" },
      { text: "FULL OUTER JOIN returns…", options: ["only matched rows", "all rows from both sides, matched or not", "only unmatched rows", "a single row"], correctAnswer: "all rows from both sides, matched or not" },
      { text: "The mental test for INNER vs LEFT is…", options: ["should a row with no counterpart still appear?", "which table is bigger?", "does the query sort?", "is the column indexed?"], correctAnswer: "should a row with no counterpart still appear?" },
      { text: "An order joined to its 3 items appears…", options: ["once", "3 times (rows multiply per match)", "never", "as NULLs"], correctAnswer: "3 times (rows multiply per match)" },
      { text: "Why is RIGHT JOIN rare in practice?", options: ["It is slower", "You can always flip the tables and use LEFT", "It is invalid SQL", "It only works with text"], correctAnswer: "You can always flip the tables and use LEFT" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 8 — Subqueries & Nested Queries
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 8,
    title: "Subqueries & Nested Queries",
    description: "Queries inside queries: scalar, IN-list, correlated, and EXISTS.",
    topics: [
      {
        title: "Scalar Subqueries: One Value In",
        text: "A subquery is a SELECT inside another query's parentheses. When it returns exactly one row and one column — a scalar — you can use it like a value in comparisons, arithmetic, or the SELECT list.\n\nClassic: 'employees who earn more than the average salary'. You need the average first — that's the scalar subquery.\n\n```sql\nSELECT name FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);\n```\n\nThe inner query runs (conceptually) once, its single value is plugged into the outer WHERE, and rows are filtered. Subqueries make 'needs a computed comparison value' questions one statement instead of two round-trips from your app.\n\nSafety: if the scalar subquery returns zero rows, the value becomes NULL (and `salary > NULL` is never true). If it returns more than one row, the engine errors — that's a query-design bug. Ensure the inner query is guaranteed to return at most one value.",
        code: "SELECT name FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);",
        note: "'Above average' dashboards use this exact pattern — compute the benchmark once, compare every row against it.",
      },
      {
        title: "IN Subqueries: Membership Tests",
        text: "`WHERE x IN (subquery)` tests whether x is present among the subquery's values — the membership test. It is the cleaner cousin of a JOIN for 'show me things that have a related row somewhere'.\n\n```sql\nSELECT name FROM customers\nWHERE id IN (SELECT customer_id FROM orders WHERE total > 10000);\n```\n\nSemantics: the subquery returns a list of customer ids; the outer WHERE keeps customers whose id is in that list. Because the subquery lists are usually small, this is often faster and clearer than a JOIN + DISTINCT. Use `NOT IN` for the inverse — but only when the subquery can never return NULL (NULL in a NOT IN list silently returns nothing). For safety, prefer `NOT EXISTS` when NULLs are possible.\n\nIN subqueries are the tool behind 'filter by another table's condition' — every 'show items in my wishlist' feature is an IN subquery or its JOIN twin.",
        code: "SELECT name FROM customers\nWHERE id IN (\n  SELECT customer_id FROM orders WHERE total > 10000\n);",
        note: "'Customers who ordered more than ₹10k' for a loyalty campaign is an IN subquery — one statement, no app-side looping.",
      },
      {
        title: "Correlated Subqueries: Per-Row Evaluation",
        text: "A **correlated subquery** references the outer query's row, so it is re-evaluated for every outer row. Where a plain subquery runs once, a correlated one runs once *per row* — powerful, and a performance warning sign on big tables.\n\nClassic: 'latest order per customer'. For each customer row, find the max order date, then compare:\n\n```sql\nSELECT o.id FROM orders o\nWHERE o.created_at = (\n  SELECT MAX(created_at) FROM orders WHERE customer_id = o.customer_id\n);\n```\n\nThe inner query depends on `o.customer_id` — that's the correlation. It answers 'compare each row against something about its own group'. RANK/ROW_NUMBER window functions solve the same problems faster and are usually the better tool. Use correlated subqueries when they read clearly; switch to window functions or lateral joins when tables grow.",
        code: "SELECT name FROM products p\nWHERE price = (\n  SELECT MAX(price) FROM products WHERE category_id = p.category_id\n);",
        note: "'Most expensive product in each category' is the interview classic for correlated subqueries — and window functions answer it faster.",
      },
      {
        title: "EXISTS: 'Is There Any?'",
        text: "`EXISTS (subquery)` returns TRUE if the subquery produces at least one row. It is a pure yes/no test, ideal for 'does a related row exist?' questions, and it stops scanning the moment it finds one match — often the fastest filter there is.\n\n```sql\nSELECT name FROM customers c\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.id\n);\n```\n\nNote `SELECT 1` — the columns don't matter, only row existence. Correlated EXISTS (referencing `c.id`) is the idiomatic 'has at least one' pattern and avoids the NOT IN + NULL trap entirely: use `NOT EXISTS` and you're safe from the NULL bug that bites NOT IN. In practice, EXISTS and IN often produce the same results; the database may even rewrite one into the other. Choose EXISTS when the inner query can be large or NULL-ridden, and when you want the early-exit behavior.",
        code: "SELECT name FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.customer_id = c.id\n);",
        note: "Cleanup jobs like 'delete users with no orders in 90 days' are NOT EXISTS statements — early-exit keeps them fast.",
      },
    ],
    quizzes: [
      { text: "A scalar subquery must return…", options: ["one row and one column", "many rows", "a table name", "an integer only"], correctAnswer: "one row and one column" },
      { text: "'Employees earning above average' needs…", options: ["a scalar subquery for the average", "a JOIN with DISTINCT", "a self-join", "a window function only"], correctAnswer: "a scalar subquery for the average" },
      { text: "`WHERE id IN (subquery)` is a…", options: ["membership test", "sorting rule", "join condition", "type cast"], correctAnswer: "membership test" },
      { text: "NOT IN returns nothing if the subquery list contains…", options: ["duplicates", "a NULL", "negative numbers", "text values"], correctAnswer: "a NULL" },
      { text: "A correlated subquery is re-evaluated…", options: ["once per query", "once per outer row", "once per database", "never"], correctAnswer: "once per outer row" },
      { text: "EXISTS(subquery) returns TRUE when…", options: ["the subquery returns a number", "the subquery produces at least one row", "the subquery is sorted", "the subquery is large"], correctAnswer: "the subquery produces at least one row" },
      { text: "Which is safest when the subquery may return NULLs?", options: ["NOT IN", "NOT EXISTS", "NOT LIKE", "NOT BETWEEN"], correctAnswer: "NOT EXISTS" },
      { text: "The 'has at least one order' question is best written as…", options: ["SELECT 1 FROM customers", "a correlated EXISTS", "SELECT DISTINCT FROM orders", "an ORDER BY"], correctAnswer: "a correlated EXISTS" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 9 — Database Design & Normalization
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 9,
    title: "Database Design & Normalization",
    description: "Design clean schemas with first, second, and third normal form.",
    topics: [
      {
        title: "Why Design the Schema Before Writing Queries",
        text: "A schema is the blueprint of tables, columns, keys, and relationships. Get it right and every query and feature is easy; get it wrong and you patch around it forever (migrations, duplicate columns, joins that never work).\n\nThe design process: (1) list the **entities** — real-world things to store (customers, orders, products). (2) Give each entity a table with a primary key. (3) Draw the **relationships** between entities (1:M, M:N) and add the foreign keys or junction tables. (4) Apply **normalization** rules to remove duplication. (5) Add constraints that mirror real-world rules.\n\nTwo heuristics from experience. One: model facts once — if the same value lives in two columns/tables, you have duplication that will drift. Two: ask 'what questions will we ask?' — a schema tuned to the real queries (and their indexes) beats a theoretically perfect one nobody can use.",
        code: "-- Sketch first, CREATE later.\n-- customers(1) ---< orders(1) ---< order_items >--- products",
        note: "A five-minute schema sketch before coding saves a week of migrations after launch — schema debt is the slowest-moving debt there is.",
      },
      {
        title: "First Normal Form (1NF): Atomic Values",
        text: "1NF requires: every column holds a **single atomic value** — no lists, no comma-separated strings, no repeated groups — and every row is unique (has a primary key).\n\nThe classic violation is a `phone` column storing '98765, 91234' or a `subjects` column storing 'math,physics'. Queries against such a column are painful — 'does this student take physics?' needs string parsing, not `WHERE subjects = 'physics'`. The fix is a child table: `student_phones(student_id, phone)` with one row per phone, or a junction table for subjects.\n\nAtomicity makes data filterable, joinable, and aggregateable. A column that hides a list is a column you can never index or count correctly. When you catch yourself writing 'we'll split the string in code', that is 1NF screaming at you to add a child table instead.",
        code: "-- Bad: subjects 'math,physics' (a list in one cell).\n-- Good: a junction table with one row per (student, subject).\nCREATE TABLE student_subjects (\n  student_id int REFERENCES students(id),\n  subject text,\n  primary key (student_id, subject)\n);",
        note: "Every 'split() in the application' on a stored column is a 1NF violation you will pay for in queries forever after.",
      },
      {
        title: "Second Normal Form (2NF): No Partial Dependencies",
        text: "2NF applies when a table has a **composite primary key** (two or more columns). It requires every non-key column to depend on the **whole** key, not just part of it.\n\nExample: `enrollments(student_id, course_id, course_name, grade)`. The key is (student_id, course_id). `grade` depends on the full pair (a specific student in a specific course). But `course_name` depends only on `course_id` — part of the key. That's a partial dependency, a 2NF violation.\n\nWhy it's bad: the course's name is repeated in every enrollment row. Rename the course and you must update hundreds of rows — and they can drift. Fix: split `course_name` into a `courses` table keyed by `course_id`; enrollments keep `course_id` as a foreign key.\n\nThe rule in one line: **every non-key column must describe the whole row's identity, not one piece of it.** This is what normalization buys you — change a fact once, in one place.",
        code: "-- Violates 2NF: course_name depends only on part of the key.\nCREATE TABLE enrollments (\n  student_id int, course_id int,\n  course_name text,      -- should live in courses\n  grade text,\n  primary key (student_id, course_id)\n);",
        note: "Rename the course and 2NF is what stops 500 rows from needing the same UPDATE — the fix is one row in courses.",
      },
      {
        title: "Third Normal Form (3NF): No Transitive Dependencies",
        text: "3NF handles single-column primary keys. It requires non-key columns to depend **only on the key** — nothing that depends on *another non-key column* (a transitive dependency).\n\nExample: `employees(id, dept_id, dept_location)`. `id` is the key. `dept_id` depends on the employee. But `dept_location` depends on `dept_id`, not on the employee — a transitive dependency through dept_id. Move it to a `departments(dept_id, location)` table and keep `dept_id` in employees as a foreign key.\n\nViolations cause update anomalies: relocate the department and every employee row's `dept_location` must change — miss one and the data lies. Third normal form (plus 1NF and 2NF) is 'normalized enough' for 95% of real systems. Everything above 3NF (Boyce-Codd, 4NF, 5NF) is usually over-engineering. Your practical target: **atomic values (1NF), whole-key dependencies (2NF), nothing depending on non-key columns (3NF)**.",
        code: "-- Violates 3NF: dept_location depends on dept_id, not on id.\nCREATE TABLE departments (dept_id serial primary key, location text);\nCREATE TABLE employees (id serial primary key, dept_id int REFERENCES departments(dept_id));",
        note: "The 'department moved but some rows still say the old office' bug is a 3NF violation — the location simply doesn't belong in the employee table.",
      },
    ],
    quizzes: [
      { text: "1NF forbids…", options: ["primary keys", "foreign keys", "lists and repeated groups in a single cell", "text columns"], correctAnswer: "lists and repeated groups in a single cell" },
      { text: "The classic 1NF fix for a comma-separated column is…", options: ["a wider column", "a child or junction table with one row per value", "deleting the data", "an index"], correctAnswer: "a child or junction table with one row per value" },
      { text: "2NF requires every non-key column to depend on…", options: ["part of a composite key", "the whole primary key", "the foreign key", "nothing"], correctAnswer: "the whole primary key" },
      { text: "In enrollments(student_id, course_id, course_name, grade), course_name is a…", options: ["full dependency", "partial dependency (violates 2NF)", "transitive dependency", "primary key"], correctAnswer: "partial dependency (violates 2NF)" },
      { text: "3NF removes…", options: ["duplicate primary keys", "transitive dependencies (a column depending on another non-key column)", "all foreign keys", "composite keys"], correctAnswer: "transitive dependencies (a column depending on another non-key column)" },
      { text: "employees(id, dept_id, dept_location) violates 3NF because…", options: ["dept_location depends on dept_id, not on the employee id", "there is no primary key", "it has too many columns", "it uses integers"], correctAnswer: "dept_location depends on dept_id, not on the employee id" },
      { text: "The practical target for most real systems is…", options: ["5NF always", "1NF, 2NF and 3NF", "no normalization", "only 1NF"], correctAnswer: "1NF, 2NF and 3NF" },
      { text: "The first step of schema design is…", options: ["writing all the queries", "listing the entities and drawing relationships", "creating indexes", "inserting sample data"], correctAnswer: "listing the entities and drawing relationships" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 10 — Table Creation & Altering
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 10,
    title: "Table Creation & Altering",
    description: "CREATE TABLE with types and constraints, ALTER TABLE, and DROP/TRUNCATE.",
    topics: [
      {
        title: "CREATE TABLE & Choosing Data Types",
        text: "CREATE TABLE defines columns and their types. PostgreSQL's common types: TEXT (unlimited string), VARCHAR(n) (string up to n), INTEGER (whole numbers), NUMERIC(p,s) (exact decimal — money!), DATE / TIMESTAMP (with or without timezone), BOOLEAN, UUID, JSONB.\n\nChoose types deliberately. Money must be NUMERIC or integer-cents — never FLOAT (floating point can't represent 0.10 exactly, and rounding drift on currency is unacceptable). Phone numbers and PINs are NOT numbers — store as TEXT (leading zeros, no arithmetic). Store timestamps in TIMESTAMPTZ and always in UTC; convert to local time in the app. JSONB is a wonderful escape hatch for flexible data, but don't put the whole app in one JSON column — it kills the relational benefits.\n\nAdd constraints inline: PRIMARY KEY, NOT NULL, UNIQUE, CHECK, DEFAULT. `CHECK (age >= 0)` lets the database enforce sanity you'd otherwise hand-check in code.",
        code: "CREATE TABLE products (\n  id serial primary key,\n  sku text unique not null,\n  name text not null,\n  price numeric(10,2) check (price >= 0),\n  stock int default 0\n);",
        note: "'Use float for money' is a classic disaster; NUMERIC exists precisely so currency math is exact.",
      },
      {
        title: "Column Constraints: NOT NULL, UNIQUE, CHECK, DEFAULT",
        text: "Constraints are the database's own validation rules — declare them once and every future insert is protected.\n\n- **NOT NULL** — the column must have a value.\n- **UNIQUE** — no two rows share a value (emails, SKUs). NULLs are allowed and multiple NULLs are fine (each unknown is distinct).\n- **CHECK** — an arbitrary boolean per row: `CHECK (age BETWEEN 0 AND 130)`, `CHECK (quantity > 0)`. The row is rejected if false.\n- **DEFAULT** — the value used when an INSERT omits the column: `created_at timestamptz default now()`.\n- **PRIMARY KEY** = UNIQUE + NOT NULL, and tables have exactly one.\n\nWhy prefer constraints over app-side checks? Apps have bugs, get bypassed, and have many entry points (admin scripts, backfills). A CHECK in the database holds the line at the last gate before data is written. When a CHECK fails, the error tells you the rule — `CHECK (price >= 0)` turning away a -5 price is the database saving you from a corrupted ledger.",
        code: "CREATE TABLE orders (\n  id serial primary key,\n  total numeric(10,2) not null check (total >= 0),\n  status text default 'pending',\n  created_at timestamptz default now()\n);",
        note: "A CHECK constraint is a written-down business rule the database enforces — 'no negative prices' stays true even when a rushed developer forgets it.",
      },
      {
        title: "ALTER TABLE: Evolving the Schema",
        text: "Schema is never final — features add columns, columns get renamed. ALTER TABLE is how you evolve without dropping data.\n\nCommon operations: add a column (`ADD COLUMN`), drop one (`DROP COLUMN`), change a type (`ALTER COLUMN ... TYPE`), add a constraint (`ADD CONSTRAINT`), rename (`RENAME TO` / `RENAME COLUMN`). Adding a column with a DEFAULT is instant in PostgreSQL (metadata only); adding a NOT NULL column to a big table needs care — backfill first or use a DEFAULT so old rows comply.\n\nChanging a column type rewrites the table and can lock it; on large tables do it in a maintenance window. Every ALTER is a **migration** — record it. In the real world you don't hand-run ALTERs; a migration tool (Prisma Migrate, Flyway) versions them so every environment — dev, staging, prod — applies the same changes in order. A schema that evolves through tracked migrations is reproducible; one edited by hand is not.",
        code: "ALTER TABLE products ADD COLUMN category text DEFAULT 'general';\nALTER TABLE products RENAME COLUMN stock TO quantity_on_hand;",
        note: "The migration files in your repo are the history of every ALTER — 'when did we add this column?' is answered by git, not guesswork.",
      },
      {
        title: "DROP, TRUNCATE & DELETE: Removing Data",
        text: "Three ways to remove data, very different in effect:\n\n- **DROP TABLE** — destroys the table and its definition entirely. Reversible only from a backup. Use with extreme care.\n- **TRUNCATE** — deletes ALL rows instantly, resets counters, cannot filter, cannot be part of a plain rollback in some engines. It is fast because it skips row-by-row logging.\n- **DELETE FROM** — removes rows one at a time, can filter with WHERE, fires triggers, and is transactional (rollback-able). Slower, but the safe choice.\n\nOrder of destruction: `DELETE` for selective removal in transactions; `TRUNCATE` for clearing a table in bulk during test resets; `DROP` when the table's life is over. Always run a `SELECT COUNT(*)` and (ideally) a quick backup before any bulk removal. In development, a test database you can blow away is your superpower — but in production, DROP and TRUNCATE demand a maintenance window and a verified backup.",
        code: "-- Remove one customer's orders (safe, transactional).\nDELETE FROM orders WHERE customer_id = 42;\n-- Clear a scratch table instantly.\nTRUNCATE TABLE staging_data;",
        note: "Every horror story about 'the database got wiped' is a DROP or TRUNCATE run without a backup — count, back up, then remove.",
      },
    ],
    quizzes: [
      { text: "Which type should store money?", options: ["FLOAT", "NUMERIC(p,s)", "TEXT", "BOOLEAN"], correctAnswer: "NUMERIC(p,s)" },
      { text: "A phone number like '+91 98765 43210' should be stored as…", options: ["INTEGER", "NUMERIC", "TEXT", "BIGINT"], correctAnswer: "TEXT" },
      { text: "UNIQUE allows…", options: ["duplicate values", "multiple NULLs", "no NULLs ever", "only integers"], correctAnswer: "multiple NULLs" },
      { text: "Which constraint rejects a negative price at the database?", options: ["NOT NULL", "UNIQUE", "CHECK (price >= 0)", "DEFAULT 0"], correctAnswer: "CHECK (price >= 0)" },
      { text: "ALTER TABLE is used to…", options: ["query data", "evolve the schema without dropping data", "insert rows", "start the server"], correctAnswer: "evolve the schema without dropping data" },
      { text: "Which operation deletes ALL rows instantly and cannot filter?", options: ["DELETE FROM … WHERE", "TRUNCATE", "DROP TABLE", "ALTER TABLE"], correctAnswer: "TRUNCATE" },
      { text: "Which removal is transactional and rollback-able?", options: ["TRUNCATE", "DROP TABLE", "DELETE FROM … WHERE", "VACUUM"], correctAnswer: "DELETE FROM … WHERE" },
      { text: "Dropping a table with DROP TABLE…", options: ["deletes only some rows", "destroys the table and its definition", "renames the table", "adds a column"], correctAnswer: "destroys the table and its definition" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 11 — Inserting & Updating Data
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 11,
    title: "Inserting & Updating Data",
    description: "INSERT, UPDATE, DELETE, and upsert patterns like ON CONFLICT.",
    topics: [
      {
        title: "INSERT: Adding Rows",
        text: "INSERT adds rows. Two shapes: `INSERT INTO t (cols) VALUES (...)` for one or a few rows (you can list several value tuples, separated by commas), and `INSERT INTO t (cols) SELECT ...` to insert the result of a query — the data-loading workhorse.\n\nColumns omitted from the column list get their DEFAULT (NULL if none). The serial primary key is usually omitted so the sequence fills it. Return what you inserted: `... RETURNING id` — essential when you need the new id for a child row (order → its items) without a second query.\n\nInserting is a single transaction by default, so a multi-row insert either fully succeeds or fully fails — a mid-way failure rolls back the whole statement. For bulk loads (CSV import), batching and using `COPY` (or Prisma's createMany) is dramatically faster than one-by-one inserts, which round-trip to the server per row.",
        code: "INSERT INTO orders (customer_id, total) VALUES (42, 2500)\nRETURNING id;",
        note: "The RETURNING clause is how a shopping-cart flow creates an order, gets its id, and inserts the items — no guessing ids.",
      },
      {
        title: "UPDATE: Changing Rows",
        text: "UPDATE changes existing rows. Always filter: `UPDATE products SET price = price * 1.05 WHERE category = 'electronics';`. Without WHERE, UPDATE hits **every row** — the 'oh no, I updated the whole table' moment.\n\nSet expressions can reference the old value, which is how you do increments and percentages: `SET stock = stock - 5`. Assignments are evaluated from the row's current values, so `SET a = b, b = a` swaps correctly. A `WHERE ... RETURNING` returns the changed rows — handy for audit trails.\n\nUPDATEs lock the rows they touch until the transaction commits — a long transaction holding locks is how two admins deadlock. Do updates in short transactions. And remember the safety habit: `SELECT` the target rows first (`SELECT COUNT(*) ... WHERE ...`), then run the UPDATE with the same WHERE, then check the row count the engine reports.",
        code: "UPDATE products\nSET price = price * 1.10, updated_at = now()\nWHERE category = 'electronics'\nRETURNING id, price;",
        note: "Price-change, salary-bump, and stock-adjust features are all UPDATE ... WHERE — the WHERE is what makes them safe.",
      },
      {
        title: "DELETE: Removing Rows",
        text: "DELETE removes rows that match a WHERE clause. Like UPDATE, an unfiltered `DELETE FROM t;` clears the whole table (TRUNCATE does it faster, but DELETE is transactional).\n\nReferential integrity fights careless deletes: deleting a customer with orders fails under ON DELETE RESTRICT — the error is the database refusing to orphan data. Your choices: CASCADE (delete children too), SET NULL (blank the reference), or RESTRICT (refuse). Pick per relationship at design time.\n\nDeleting from a table with many child rows can be slow and lock-heavy — a massive 'delete 1M old rows' can block writes. Batched deletes (`DELETE ... WHERE id IN (SELECT id ... LIMIT 5000)` in a loop) keep locks small. Also consider whether you need a hard delete at all: many systems use a soft delete (an `is_deleted` or `deleted_at` flag) so data is recoverable and analytics keep history — the rows just stop showing in normal queries.",
        code: "DELETE FROM orders WHERE status = 'cancelled'\n  AND created_at < now() - interval '2 years';",
        note: "The 'undo' feature on an invoice app exists because those rows were soft-deleted, not destroyed — hard deletes are irreversible.",
      },
      {
        title: "Upsert: ON CONFLICT",
        text: "An **upsert** inserts a row, or updates it if a unique key already exists — 'insert or update' in one statement. PostgreSQL does this with `ON CONFLICT`:\n\n```sql\nINSERT INTO users (email, name, visits)\nVALUES ('a@b.com', 'A', 1)\nON CONFLICT (email)\nDO UPDATE SET visits = users.visits + 1;\n```\n\nThe conflict target is a UNIQUE or PRIMARY KEY column. `DO UPDATE` gives you the merge logic (reference the existing row as `excluded` — `users.visits` is the old value, `excluded.visits` is the incoming one). `DO NOTHING` silently skips rows that already exist — perfect for idempotent seeding scripts.\n\nWhy it matters: the naive alternative is SELECT-then-INSERT-then-UPDATE in app code — three round-trips and a race window where two requests both insert. ON CONFLICT is atomic: the check and the insert/update happen in one statement. Idempotent imports, daily analytics rollups, and 'count this visit' counters all lean on it.",
        code: "INSERT INTO counters (name, value) VALUES ('logins', 1)\nON CONFLICT (name)\nDO UPDATE SET value = counters.value + 1;",
        note: "A 'unique key already exists, just bump the counter' loop that never double-counts is exactly what ON CONFLICT guarantees in one atomic statement.",
      },
    ],
    quizzes: [
      { text: "To get the id of a row you just inserted, use…", options: ["SELECT MAX(id)", "RETURNING id", "LAST_VALUE(id)", "COUNT(id)"], correctAnswer: "RETURNING id" },
      { text: "An UPDATE without a WHERE clause…", options: ["fails", "updates every row in the table", "updates only the first row", "creates new rows"], correctAnswer: "updates every row in the table" },
      { text: "`SET stock = stock - 5`…", options: ["sets stock to -5", "decrements the existing stock value by 5", "errors", "resets stock to 5"], correctAnswer: "decrements the existing stock value by 5" },
      { text: "Deleting a customer with orders fails under…", options: ["ON DELETE CASCADE", "ON DELETE RESTRICT", "ON DELETE SET NULL", "UNIQUE"], correctAnswer: "ON DELETE RESTRICT" },
      { text: "A soft delete typically means…", options: ["the row is removed physically", "an is_deleted/deleted_at flag hides the row from normal queries", "the row is copied to another table", "the table is dropped"], correctAnswer: "an is_deleted/deleted_at flag hides the row from normal queries" },
      { text: "PostgreSQL's upsert uses…", options: ["MERGE ONLY", "ON CONFLICT", "REPLACE INTO", "INSERT IF"], correctAnswer: "ON CONFLICT" },
      { text: "In `ON CONFLICT ... DO UPDATE`, the incoming value is referenced as…", options: ["existing", "excluded", "incoming", "new"], correctAnswer: "excluded" },
      { text: "Why prefer ON CONFLICT over SELECT-then-INSERT?", options: ["It is atomic — no race between the check and the write", "It is more readable", "It works without a primary key", "It is faster at reading"], correctAnswer: "It is atomic — no race between the check and the write" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 12 — Indexes & Performance
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 12,
    title: "Indexes & Performance",
    description: "What indexes are, how B-trees work, composite indexes, and reading query plans.",
    topics: [
      {
        title: "What Is an Index & How It Works",
        text: "An index is a sorted structure the database maintains alongside a table so it can find rows without scanning everything. Think of a book's index: to find every page mentioning 'transaction', you don't read the whole book — you look up the word and jump to the pages.\n\nA B-tree index on `email` lets `WHERE email = 'x'` jump straight to the matching row(s) in logarithmic time instead of a linear full scan. Inserts, updates, and deletes pay a small cost — the index must be maintained — but reads become dramatically faster.\n\nRules of thumb: index columns you **filter** on (WHERE), **join** on (FK columns), and **sort** by (ORDER BY). A `PRIMARY KEY` and a `UNIQUE` constraint create indexes automatically. Don't index everything — each index slows writes and eats disk. Index selective columns: a `status` column with only 3 distinct values gets little benefit from an index; an `email` column (mostly unique) gets enormous benefit.",
        code: "CREATE INDEX idx_orders_customer ON orders (customer_id);\nCREATE INDEX idx_users_email ON users (email);",
        note: "The 'why is my query slow?' answer is almost always 'no index on the WHERE column' — check that before rewriting anything.",
      },
      {
        title: "Composite Indexes: Column Order Matters",
        text: "A **composite index** spans multiple columns: `CREATE INDEX ON orders (customer_id, created_at)`. It is useful when queries filter on several columns together — 'all orders of this customer after this date'.\n\nThe crucial rule: the index helps queries that use columns from the **left, in order**. An index on (customer_id, created_at) serves `WHERE customer_id = 5 AND created_at > ...` and `WHERE customer_id = 5` — but NOT `WHERE created_at > ...` alone (created_at isn't the leading column).\n\nOrder columns by selectivity (most selective first) and by how they're combined in queries. A common mistake: building several single-column indexes where one composite would do — the planner may only use one per query anyway.\n\nFor `ORDER BY`, a composite index can serve the sort directly (no separate sort step). This is why 'my ORDER BY is slow' often gets fixed by an index, not by faster sorting.",
        code: "CREATE INDEX idx_orders_cust_created\nON orders (customer_id, created_at);",
        note: "'Show me customer 5's orders after January' uses the (customer_id, created_at) composite index — the planner walks the tree and stops early.",
      },
      {
        title: "Index Pitfalls: Functions, Leading Wildcards, Low Selectivity",
        text: "Indexes stop working in predictable ways — recognizing these saves hours of debugging.\n\n**Function wrapping defeats a normal index**: `WHERE LOWER(email) = 'x'` cannot use an index on `email` because the stored values are raw, not lowercased. Fix: an **expression index** `CREATE INDEX ON users (LOWER(email))`, or store the canonical lowercase column.\n\n**Leading wildcards**: `LIKE '%abc'` can't use a normal B-tree index (it must know the prefix to navigate). `LIKE 'abc%'` can. If you need 'ends-with' search, consider trigram indexes (pg_trgm).\n\n**Low selectivity**: indexing a column where 99% of rows share one value rarely helps — the planner may ignore it and scan anyway (which is correct!). `sex` or `status` with 3 values are low-value index targets; combine them into a composite with a selective column instead.\n\nAlso remember **NULLs**: a normal index in PostgreSQL does not speed `WHERE col IS NULL` unless it's a partial index `WHERE col IS NULL`. And an index you create but never use still costs writes.",
        code: "-- Expression index for case-insensitive lookups.\nCREATE INDEX idx_users_lower_email ON users (LOWER(email));",
        note: "'I added an index but the query is still slow' — check whether a function is hiding the column from the index, the #1 surprise.",
      },
      {
        title: "EXPLAIN & Reading Query Plans",
        text: "EXPLAIN shows the database's execution plan — the actual steps (scan vs index, join method, sort) it chose for your query. It answers 'why slow?' with facts instead of guesses. `EXPLAIN ANALYZE` actually runs the query and reports real timings and row counts.\n\nThe plan reads bottom-up. Look for three warning signs: a **Seq Scan** on a big table where an index scan is expected (missing/wrong index), **rows=1 but actual rows=N** (the planner guessed wrong — often stale statistics), and a huge **Sort** step (a missing ORDER BY index). The 'actual rows' column exposes the truth — planners estimate, ANALYZE measures.\n\nUsing it: run `EXPLAIN ANALYZE SELECT ...`, read the node that costs the most, and fix that. Usually the fix is an index or a rewritten WHERE. `ANALYZE` (the command) refreshes the planner's statistics — run it after big data loads, because stale stats make the planner pick bad plans.",
        code: "EXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 5;",
        note: "A 'Seq Scan' on 10M rows staring back at you from EXPLAIN is the database telling you, in one word, what to fix.",
      },
    ],
    quizzes: [
      { text: "An index speeds up…", options: ["all queries equally", "queries that filter, join, or sort on indexed columns", "INSERT statements", "DROP TABLE"], correctAnswer: "queries that filter, join, or sort on indexed columns" },
      { text: "Indexes slow down…", options: ["SELECT", "writes (INSERT/UPDATE/DELETE maintain the index)", "CREATE TABLE", "EXPLAIN"], correctAnswer: "writes (INSERT/UPDATE/DELETE maintain the index)" },
      { text: "A composite index (customer_id, created_at) helps…", options: ["WHERE created_at > … alone", "WHERE customer_id = 5 AND created_at > …", "WHERE name LIKE '%x'", "any query on the table"], correctAnswer: "WHERE customer_id = 5 AND created_at > …" },
      { text: "A normal index on email is NOT used by `WHERE LOWER(email) = …` because…", options: ["the function hides the column from the index", "LOWER is forbidden", "email is too short", "indexes only work on integers"], correctAnswer: "the function hides the column from the index" },
      { text: "Which LIKE pattern can use a normal B-tree index?", options: ["LIKE '%abc'", "LIKE 'abc%'", "LIKE '%abc%'", "none ever"], correctAnswer: "LIKE 'abc%'" },
      { text: "Indexing a column where 99% of rows share one value is…", options: ["the best thing to do", "low value — the planner may ignore it", "impossible", "required for PRIMARY KEY"], correctAnswer: "low value — the planner may ignore it" },
      { text: "EXPLAIN ANALYZE differs from EXPLAIN because it…", options: ["does not run the query", "actually runs the query and reports real timings and row counts", "creates an index", "is much faster"], correctAnswer: "actually runs the query and reports real timings and row counts" },
      { text: "A Seq Scan on a huge table usually means…", options: ["an index is missing or unused", "the query is perfectly optimized", "the table is empty", "a syntax error"], correctAnswer: "an index is missing or unused" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 13 — Views & Stored Procedures
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 13,
    title: "Views & Stored Procedures",
    description: "Encapsulate queries in views and logic in stored procedures and triggers.",
    topics: [
      {
        title: "Views: Saved Queries as Tables",
        text: "A **view** is a saved SELECT that you can query like a table. `CREATE VIEW active_customers AS SELECT * FROM customers WHERE active = true;` — then `SELECT * FROM active_customers;` runs the underlying query. It stores the *definition*, not a copy of the data; every query through the view sees current rows.\n\nThe wins: **reuse** — the same join written once, queried in ten places; **security** — grant SELECT on a view that exposes only safe columns, never the raw table; **decoupling** — you can change the underlying tables and keep the view's shape stable so apps don't break.\n\nBecause a view is just a query, chaining works — views over views — but keep them shallow; deep view chains are hard to debug. Views are also a great way to give non-developers a clean reporting surface. They don't change performance by themselves: the optimizer unfolds them into the underlying query, so an index fix helps a view too.",
        code: "CREATE VIEW order_summary AS\nSELECT c.name, o.id AS order_id, o.total\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;\n\nSELECT * FROM order_summary WHERE total > 10000;",
        note: "The report the CFO reads weekly is often a view — stable shape, current data, no ad-hoc SQL in their face.",
      },
      {
        title: "Materialized Views: Snapshots",
        text: "A **materialized view** stores the query's **result** on disk — a snapshot, not a live query. Querying it reads the saved data instantly, bypassing the expensive join/aggregate. The catch: it can go stale; you must **refresh** it (`REFRESH MATERIALIZED VIEW`) — on a schedule, after a batch job, or via a trigger.\n\nUse materialized views when the underlying query is too slow to run live and the data can be slightly stale: nightly sales rollups, dashboards, top-N lists. They are a compromise — speed at the cost of freshness.\n\n`CONCURRENTLY` refreshes without locking reads (`REFRESH MATERIALIZED VIEW CONCURRENTLY v`) but needs a UNIQUE index on the view. The pattern for a dashboard: materialized view + a cron refresh + the UI reading from the view. When 'the dashboard feels slow' and freshness of 10 minutes is fine, this is the move before you reach for caching layers.",
        code: "CREATE MATERIALIZED VIEW daily_sales AS\nSELECT DATE_TRUNC('day', created_at) AS day, SUM(total) AS revenue\nFROM orders GROUP BY day;\n\nREFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales;",
        note: "A startup's 'revenue today' widget that refreshes every 15 minutes is almost always a materialized view — fast reads, acceptably stale.",
      },
      {
        title: "Stored Procedures & Functions",
        text: "A **stored procedure** or **SQL function** is logic you save inside the database and call by name — `CREATE FUNCTION total_for(customer_id int) RETURNS numeric AS ...`. This puts business rules next to the data, callable from any client.\n\nWhat belongs in the database: multi-step operations that must be atomic (debit + credit + audit log), complex calculations reused everywhere (tax on an order), and batch jobs (archive old rows). Pros: one copy of the logic, no client duplication, runs close to the data (no round-trips). Cons: harder to version-control and test than app code, and a performance trap if you loop over rows one by one — set-based SQL beats procedural loops every time.\n\nModern practice: keep heavy business logic in the app (Prisma/Node) where it's testable; use stored functions for genuinely data-centric rules and for performance-critical paths where round-trips hurt. A trigger (next topic) often calls a function.",
        code: "CREATE FUNCTION order_tax(total numeric) RETURNS numeric AS $$\n  SELECT ROUND(total * 0.18, 2);\n$$ LANGUAGE sql;\n\nSELECT order_tax(1000);",
        note: "A tax rule that must be identical for the website, mobile app, and reports is a classic 'one function, three clients' use of a stored function.",
      },
      {
        title: "Triggers: Reactions to Changes",
        text: "A **trigger** fires automatically when an INSERT, UPDATE, or DELETE happens on a table. `CREATE TRIGGER ... BEFORE/AFTER INSERT ON orders ...` runs a function on each affected row. Triggers are the database's way of 'doing something when data changes' without the app remembering to.\n\nClassic uses: **audit logging** (record who changed what in an audit table), **auto-updating** a counter (bump `order_count` on the customer when an order inserts), **validating** cross-table rules (a trigger prevents deleting a product still in a draft order), and **cascading cleanup** that business logic forgot.\n\nTriggers run inside the transaction of the triggering statement — if the trigger errors, the whole statement rolls back. That makes them powerful but also dangerous: a runaway trigger makes every write slow or fail mysteriously. Keep trigger functions small, set-based, and well-tested. Debugging 'why is this insert failing?' when a trigger is the cause is a rite of passage — `DROP TRIGGER` and the mystery vanishes.",
        code: "CREATE FUNCTION audit_order() RETURNS trigger AS $$\nBEGIN\n  INSERT INTO order_audit(order_id, action, at)\n  VALUES (NEW.id, TG_OP, now());\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER order_audit_trigger\nAFTER INSERT ON orders FOR EACH ROW\nEXECUTE FUNCTION audit_order();",
        note: "Compliance teams love triggers: 'every change to a payment row is recorded, whether the app remembered or not.'",
      },
    ],
    quizzes: [
      { text: "A view stores…", options: ["a copy of the data", "the query definition, run live on every access", "an index", "a backup"], correctAnswer: "the query definition, run live on every access" },
      { text: "A view's result always reflects…", options: ["data as of creation", "the current rows of the underlying tables", "only cached data", "only NULLs"], correctAnswer: "the current rows of the underlying tables" },
      { text: "A materialized view differs from a view because it…", options: ["stores the result on disk and can go stale until refreshed", "cannot be queried", "is always slower", "has no columns"], correctAnswer: "stores the result on disk and can go stale until refreshed" },
      { text: "`REFRESH MATERIALIZED VIEW CONCURRENTLY` is used to…", options: ["delete the view", "refresh without locking reads", "rename the view", "create an index"], correctAnswer: "refresh without locking reads" },
      { text: "A stored procedure is…", options: ["logic saved inside the database, callable by name", "a client-side function", "a special table", "an index type"], correctAnswer: "logic saved inside the database, callable by name" },
      { text: "The recommended place for most business logic in modern apps is…", options: ["inside the database as triggers", "in the application where it is testable, reserving DB functions for data-centric rules", "in the frontend", "nowhere"], correctAnswer: "in the application where it is testable, reserving DB functions for data-centric rules" },
      { text: "A trigger fires…", options: ["when you run EXPLAIN", "automatically on INSERT/UPDATE/DELETE of a table", "every second", "only after a restart"], correctAnswer: "automatically on INSERT/UPDATE/DELETE of a table" },
      { text: "If a trigger function errors, the triggering statement…", options: ["continues anyway", "rolls back as part of the same transaction", "is retried", "is logged only"], correctAnswer: "rolls back as part of the same transaction" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 14 — Transactions & ACID Properties
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 14,
    title: "Transactions & ACID Properties",
    description: "BEGIN/COMMIT/ROLLBACK, isolation levels, and the ACID guarantees in depth.",
    topics: [
      {
        title: "BEGIN, COMMIT & ROLLBACK",
        text: "A **transaction** groups statements so they all succeed or all roll back. PostgreSQL syntax: `BEGIN;` … statements … `COMMIT;` (or `ROLLBACK;` on error). Every single SQL statement is already its own transaction — BEGIN just lets you span several statements as one atomic unit.\n\nThe money transfer again: `BEGIN; UPDATE a SET balance -= 500; UPDATE b SET balance += 500; COMMIT;`. If the second UPDATE fails, ROLLBACK undoes the first — no half-state ever visible to anyone. While a transaction is open, other connections see the old state (isolation), and only the COMMIT makes the changes permanent (durability).\n\nPractical rules: keep transactions **short** — a transaction holding locks while waiting on a user's input is a deadlock generator. Never put a network call or `await` inside a transaction's span. And always have error handling that ROLLBACKs on failure — an abandoned open transaction holds locks until it times out or is aborted.",
        code: "BEGIN;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;",
        note: "Every banking transfer, booking, and cart checkout in the world runs inside a transaction exactly like this.",
      },
      {
        title: "Atomicity & Consistency",
        text: "**Atomicity** means the transaction is all-or-nothing — it either commits fully or rolls back fully, and partial states are never visible. The engine guarantees this with a **write-ahead log**: changes are first recorded to a durable log, then applied. If the server crashes mid-transaction, recovery replays or undoes from the log. You don't manually implement atomicity — you get it by putting statements inside a transaction.\n\n**Consistency** means the database only moves from one valid state to another — every constraint (NOT NULL, UNIQUE, CHECK, FK) is enforced at commit. A transaction that would violate a CHECK or leave a dangling FK is rejected. Consistency is the constraint layer + the atomic unit working together.\n\nTogether they mean: 'bad data cannot enter through a crash or a half-finished operation.' If a rule can be stated as a constraint, the database enforces it for every transaction, on every path — the strongest guarantee you can buy.",
        code: "-- A CHECK is a consistency rule the engine enforces at commit.\nCREATE TABLE accounts (id serial primary key, balance numeric(12,2) check (balance >= 0));",
        note: "'My app never creates a negative balance' — the CHECK constraint is what actually keeps that promise, for every code path.",
      },
      {
        title: "Isolation Levels & the Dirty-Read Problem",
        text: "**Isolation** answers: what does one transaction see of another's uncommitted work? The weakest problem is the **dirty read** — reading a row another transaction has modified but not committed. PostgreSQL's default isolation, **READ COMMITTED**, prevents dirty reads: each statement sees only committed data. A statement's snapshot is taken at statement start.\n\nStronger levels add guarantees at a cost. **REPEATABLE READ** gives a consistent snapshot for the whole transaction — two reads in the same transaction return the same rows, even if other transactions commit in between. PostgreSQL's repeatable read even prevents the phantom-read anomaly at the cost of retry-on-conflict. **SERIALIZABLE** is the strongest — transactions behave as if run one after another; conflicts cause one to fail with a 'could not serialize' error and the app must retry.\n\nThe trade-off is concurrency: stronger isolation means more blocking or more aborts. In practice, READ COMMITTED (the default) is right for most apps; reach for REPEATABLE READ or SERIALIZABLE only when a financial consistency check demands it.",
        code: "-- Each statement sees only committed data (default READ COMMITTED).\nBEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT SUM(balance) FROM accounts;\n-- …other transactions may commit, but this snapshot is fixed…\nCOMMIT;",
        note: "A dashboard that shows a stable total while you click through it is often a REPEATABLE READ transaction keeping one snapshot alive.",
      },
      {
        title: "Durability & Locks",
        text: "**Durability** means once you COMMIT, the change survives crashes and power loss. The engine achieves it with the write-ahead log: commit completes only after the transaction's records are safely on disk. That is why COMMIT can be slower than a plain UPDATE — it's paying for the guarantee.\n\n**Locks** are how isolation and consistency are enforced against concurrency. A row being updated is locked until the transaction ends; a concurrent UPDATE on the same row **blocks** (waits) until the first commits. Blocking isn't an error — it's serialization. But two transactions each waiting on a lock the other holds is a **deadlock**; PostgreSQL detects it and aborts one with `ERROR: deadlock detected`, and your app should retry.\n\nPractical lock hygiene: acquire locks in a consistent order across the codebase; keep transactions short; index the columns your UPDATEs filter on (a scan locks many rows; an index locks few). Short transactions + indexed updates = happy concurrency.",
        code: "-- Transaction 2 blocks on this row until transaction 1 commits.\nUPDATE accounts SET balance = balance - 100 WHERE id = 3;",
        note: "'The update just hangs' in a busy app is usually a lock wait — the row is being held by a longer transaction somewhere.",
      },
    ],
    quizzes: [
      { text: "A transaction groups statements so they…", options: ["run twice", "all succeed or all roll back", "run in parallel", "skip failures"], correctAnswer: "all succeed or all roll back" },
      { text: "Which pair correctly opens and finishes a transaction?", options: ["START/STOP", "BEGIN/COMMIT", "OPEN/CLOSE", "LOCK/UNLOCK"], correctAnswer: "BEGIN/COMMIT" },
      { text: "A dirty read is…", options: ["reading uncommitted changes from another transaction", "reading a NULL", "an error in the log", "a duplicate row"], correctAnswer: "reading uncommitted changes from another transaction" },
      { text: "PostgreSQL's default isolation level is…", options: ["SERIALIZABLE", "REPEATABLE READ", "READ COMMITTED", "READ UNCOMMITTED"], correctAnswer: "READ COMMITTED" },
      { text: "Durability guarantees…", options: ["a commit survives crashes via the write-ahead log", "queries run fast", "rows are sorted", "indexes rebuild"], correctAnswer: "a commit survives crashes via the write-ahead log" },
      { text: "A concurrent UPDATE on the same row will…", options: ["fail immediately", "block until the first transaction commits", "overwrite silently", "create a new row"], correctAnswer: "block until the first transaction commits" },
      { text: "A deadlock is resolved by…", options: ["restarting the database", "the engine aborting one transaction so the app can retry", "removing the primary key", "disabling indexes"], correctAnswer: "the engine aborting one transaction so the app can retry" },
      { text: "The best way to reduce lock contention is…", options: ["longer transactions", "short transactions and indexed WHERE columns", "more indexes on every column", "READ UNCOMMITTED"], correctAnswer: "short transactions and indexed WHERE columns" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 15 — Database Security Basics
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 15,
    title: "Database Security Basics",
    description: "SQL injection, parameterized queries, privileges, and backups.",
    topics: [
      {
        title: "SQL Injection: The #1 Database Attack",
        text: "**SQL injection** happens when user input is concatenated into a SQL string and the input *changes the meaning* of the query. The classic:\n\n```python\nquery = \"SELECT * FROM users WHERE email = '\" + email + \"' AND password = '\" + pw + \"'\"\n```\n\nIf a user enters `email = 'x' OR 1=1 --`, the query becomes `WHERE email = 'x' OR 1=1 -- ...` — the `OR 1=1` matches every row and the `--` comments out the password check. Login bypassed. With `UNION SELECT` or stacked statements, an attacker can read other tables, write rows, or even drop the database.\n\nInjection is preventable with one habit: **never build SQL by string concatenation with untrusted input**. Every modern driver offers parameterized queries (placeholders like `$1` or `?`) that send the data separately from the query text — the database treats it as a literal, not as SQL. This is not an optional best practice; it is the single most important security rule in this course.",
        code: "-- SAFE (Node + pg): the value is a parameter, not SQL.\nconst res = await db.query(\n  'SELECT * FROM users WHERE email = $1',\n  [email]\n);",
        note: "SQL injection has broken real banks and governments. The fix is not clever escaping — it is parameters, full stop.",
      },
      {
        title: "Parameterized Queries & Prepared Statements",
        text: "**Parameterized queries** separate the SQL structure from the values: the query text has placeholders, and values are bound separately. The driver sends both to the server, where the engine parses the query once and substitutes values as **literals** — so input can never become syntax. `WHERE email = $1` treats whatever you pass as data, even if it contains quotes or `OR 1=1`.\n\nIn practice: node-postgres `$1, $2`, Python's `%s`/`?`, Prisma's `$queryRaw` template literals (`Prisma.sql`) all parameterize. Frameworks (Prisma, Knex, Sequelize) parameterize by default when you use their builders — yet another reason to use an ORM's query builder over hand-built strings.\n\nA prepared statement is the server-side version — parse once, reuse many times with different values — which also gives a small performance win for repeated queries. The rule remains the same: **values go in as parameters, never as text**.",
        code: "// SAFE: Prisma parameterizes template values automatically.\nawait prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;",
        note: "When an audit asks 'how do we know we're injection-safe?', the answer is 'we never concatenate user input into SQL' — grep-able, provable, true.",
      },
      {
        title: "Privileges: Least Privilege & GRANT/REVOKE",
        text: "Databases are multi-tenant too — the principle of **least privilege** says each application and user gets only the rights they need. PostgreSQL roles have `GRANT`/`REVOKE` for SELECT, INSERT, UPDATE, DELETE, and more, on tables, views, schemas.\n\nDesign: the app's DB role should get CRUD on the app's tables and nothing else — no DROP, no access to other schemas, no superuser. A read-only reporting role gets SELECT only. Backups run as a role that can read everything but write nothing. Never run your application as the `postgres` superuser — a single injection bug then becomes a full database takeover.\n\nSeparate concerns: a migration role (schema changes) is different from a runtime role (data only). Revoking is the flip side — when a service is decommissioned, its role loses access. Least privilege shrinks the blast radius of any single compromise, which is the entire point of defense in depth.",
        code: "-- A reporting app gets read-only access.\nCREATE ROLE reporter;\nGRANT SELECT ON orders, customers TO reporter;\nREVOKE ALL ON products FROM reporter;",
        note: "'Our app runs as superuser' is the security smell that turns any SQL bug into a catastrophe — least privilege is the fix.",
      },
      {
        title: "Backups, Encryption & Sensitive Data",
        text: "A database you cannot restore is not a database — it's a liability. **Backups**: PostgreSQL `pg_dump` for logical backups (portable, single files), or continuous archiving (WAL shipping) for point-in-time recovery. Test restores regularly — an untested backup is a guess, and the first restore you do should not be during an emergency.\n\n**Encryption at rest**: disk-level encryption (LUKS/cloud EBS) protects against stolen hardware. **Encryption in transit**: TLS between app and DB so credentials and data aren't readable on the wire. **Sensitive columns**: passwords are hashed (bcrypt) before storage — never stored in plaintext, ever; payment details belong to a compliant provider (Stripe/Razorpay), not your database.\n\nDefense in depth: backups + restores + TLS + hashing + least privilege + injection-safe queries. No single layer is enough; the layers are what make a breach survivable. And log access — knowing *who* touched sensitive tables is what turns 'we were hacked' into an investigation.",
        code: "# Logical backup of the whole database.\npg_dump nexus > nexus_2026-08-11.sql\n# Restore on another machine.\npsql nexus < nexus_2026-08-11.sql",
        note: "The 3-2-1 rule applies to databases too: three copies, two media types, one offsite. Your data is worth it.",
      },
    ],
    quizzes: [
      { text: "SQL injection works because…", options: ["the database is broken", "user input is concatenated into SQL and changes the query's meaning", "passwords are hashed", "indexes are missing"], correctAnswer: "user input is concatenated into SQL and changes the query's meaning" },
      { text: "The single most important SQL security habit is…", options: ["escaping quotes manually", "never building SQL by string concatenation with untrusted input — use parameters", "renaming columns", "using uppercase keywords"], correctAnswer: "never building SQL by string concatenation with untrusted input — use parameters" },
      { text: "A parameterized query sends values as…", options: ["part of the SQL text", "separate literals the engine substitutes after parsing", "base64", "JSON"], correctAnswer: "separate literals the engine substitutes after parsing" },
      { text: "Input of `' OR 1=1 --` defeats `WHERE email = '...'` because…", options: ["it is a valid email", "the OR matches every row and -- comments out the rest", "the database crashes", "it has quotes"], correctAnswer: "the OR matches every row and -- comments out the rest" },
      { text: "The principle of least privilege means…", options: ["everyone gets SELECT", "each role gets only the rights it needs, nothing more", "the app runs as superuser", "no one can write"], correctAnswer: "each role gets only the rights it needs, nothing more" },
      { text: "Your application should connect to the database as…", options: ["the postgres superuser", "a role with only the privileges the app needs", "the OS root user", "a read-only reporter role always"], correctAnswer: "a role with only the privileges the app needs" },
      { text: "Passwords must be stored…", options: ["in plaintext", "hashed (e.g. bcrypt), never plaintext", "base64-encoded", "in the app source"], correctAnswer: "hashed (e.g. bcrypt), never plaintext" },
      { text: "An untested backup is…", options: ["better than none", "a guess — test restores regularly", "never needed", "the same as no backup"], correctAnswer: "a guess — test restores regularly" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 16 — Connecting SQL to Python/Node
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 16,
    title: "Connecting SQL to Python/Node",
    description: "Talk to PostgreSQL from real applications: drivers, pooling, and ORMs.",
    topics: [
      {
        title: "Connecting from Node with node-postgres",
        text: "Real apps don't run SQL in a console — they connect from code. In Node, `pg` (node-postgres) is the standard driver:\n\n```js\nconst { Pool } = require('pg');\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\nconst { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);\n```\n\nThe key ideas: the **Pool** manages many connections so your app doesn't open a fresh TCP connection per request (opening a Postgres connection is expensive — pool keeps a warm set). Queries are **parameterized with $1 placeholders** (always — injection-safe). `rows` is an array of plain objects; `rowCount` tells you how many rows a write touched.\n\nAlways read the connection string from an **environment variable**, never hardcode credentials into source code — and keep the connection string out of git. On serverless, use a connection limit that fits the environment and keep sessions short.",
        code: "const { Pool } = require('pg');\nconst pool = new Pool({ connectionString: process.env.DATABASE_URL });\n\nasync function getUser(id) {\n  const { rows } = await pool.query(\n    'SELECT name, email FROM users WHERE id = $1', [id]\n  );\n  return rows[0];\n}",
        note: "A Node/Express app with a `pg` pool is how most small-to-mid apps talk to Postgres — the pattern behind countless backends.",
      },
      {
        title: "Connecting from Python with psycopg2",
        text: "In Python, `psycopg2` (or its modern sibling `psycopg`) is the Postgres driver:\n\n```python\nimport psycopg2\nconn = psycopg2.connect(os.environ['DATABASE_URL'])\ncur = conn.cursor()\ncur.execute('SELECT name FROM users WHERE id = %s', (uid,))\nrow = cur.fetchone()\n```\n\nNotable: `%s` placeholders in psycopg (even for integers — the driver adapts types), and **you must commit** after writes: `conn.commit()`. psycopg starts a transaction implicitly; forgetting commit means your INSERT silently vanishes on close. Use `conn.rollback()` in the except path.\n\nPython's data science stack (pandas) reads databases directly: `pd.read_sql('SELECT * FROM orders', conn)` turns a table into a DataFrame in one line — the fastest route from SQL to analysis. For long-running scripts, use a connection pool (`psycopg2.pool`) so you don't rebuild connections.",
        code: "import psycopg2, os\nconn = psycopg2.connect(os.environ['DATABASE_URL'])\ncur = conn.cursor()\ncur.execute('UPDATE users SET last_seen = now() WHERE id = %s', (uid,))\nconn.commit()",
        note: "The 'my Python script inserts nothing' bug is 90% of the time a missing conn.commit() — Python doesn't auto-commit.",
      },
      {
        title: "Connection Pooling: Don't Open a Connection per Request",
        text: "Opening a Postgres connection involves a TCP handshake and auth — milliseconds each. At web scale, doing that per request saturates the database. **Connection pooling** keeps a handful of warm connections that requests borrow and return.\n\nIn Node, `pg.Pool` does this in-process. In Postgres terms, **PgBouncer** is a dedicated pooler: many app connections funnel into few database connections. The two dials: `max` (pool size — roughly the max concurrent queries your DB can serve; too high and Postgres wastes memory on idle backends) and idle timeout (return idle connections to the OS).\n\nWhere it bites: leaks. A query that throws without the pool releasing its connection eventually exhausts the pool and the app hangs on 'waiting for connection'. Always use try/finally or the driver's query wrapper that guarantees release. Also set a statement timeout so one runaway query can't hold a pooled connection forever.",
        code: "const pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  max: 10,             // warm connections the app can borrow\n  idleTimeoutMillis: 30000\n});\n\n// try/finally guarantees the connection returns to the pool.",
        note: "The mysterious 'connection pool exhausted' outage is almost always a leaked connection — one missing release in an error path.",
      },
      {
        title: "ORMs & Prisma: SQL Without Hand-Written Strings",
        text: "An **ORM** (Object-Relational Mapper) turns tables into typed objects and writes SQL for you. **Prisma** (used by this project) is a modern TypeScript ORM: you declare the schema in `schema.prisma`, run migrations, and query with a type-safe client.\n\n```ts\nconst user = await prisma.user.findUnique({\n  where: { email },\n  include: { orders: true },\n});\n```\n\nThe wins: **type safety** (mistyped columns fail at compile time, not runtime), **injection safety** (the client parameterizes everything), **migrations** (schema changes are versioned files), and **readability**. The costs: ORMs abstract SQL, so you can lose touch with what runs; for complex analytics they produce awkward queries — which is why Prisma offers `$queryRaw` for raw SQL when you need it.\n\nThe mature approach: use the ORM for 90% of CRUD, and write raw SQL (parameterized!) for the 10% that needs it. Know both — the ORM for productivity, SQL for power.",
        code: "const recent = await prisma.order.findMany({\n  where: { userId, status: 'paid' },\n  orderBy: { createdAt: 'desc' },\n  take: 5,\n});",
        note: "This whole EduNexus platform's backend is Prisma — the schema you've seen and the queries you've tested are exactly this pattern.",
      },
    ],
    quizzes: [
      { text: "The main reason to use a connection pool is…", options: ["to run faster SQL", "to avoid the cost of opening a fresh connection per request", "to bypass authentication", "to cache query results"], correctAnswer: "to avoid the cost of opening a fresh connection per request" },
      { text: "node-postgres parameter placeholders look like…", options: ["? and ?", "$1, $2", "%s, %s", "{0}, {1}"], correctAnswer: "$1, $2" },
      { text: "In psycopg2, a write is not visible until you…", options: ["close the cursor", "call conn.commit()", "restart Python", "run SELECT"], correctAnswer: "call conn.commit()" },
      { text: "The connection string should come from…", options: ["hardcoded source", "an environment variable, kept out of git", "a public config file", "the frontend"], correctAnswer: "an environment variable, kept out of git" },
      { text: "A leaked connection (missing release) eventually causes…", options: ["faster queries", "pool exhaustion and app hangs", "data loss", "a syntax error"], correctAnswer: "pool exhaustion and app hangs" },
      { text: "An ORM like Prisma gives…", options: ["type safety, parameterized queries, and versioned migrations", "slower development", "SQL injection", "no way to write raw SQL"], correctAnswer: "type safety, parameterized queries, and versioned migrations" },
      { text: "For the 10% of complex analytics, the mature approach is…", options: ["to always use the ORM", "to write raw parameterized SQL", "to avoid the database", "to duplicate tables"], correctAnswer: "to write raw parameterized SQL" },
      { text: "`pd.read_sql('SELECT * FROM orders', conn)` in pandas…", options: ["fails", "turns a SQL result into a DataFrame", "writes to the database", "creates an index"], correctAnswer: "turns a SQL result into a DataFrame" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 17 — Mini-Project: Library System Database
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 17,
    title: "Mini-Project: Library System Database",
    description: "Design and build a complete library database: schema, relationships, and real queries.",
    topics: [
      {
        title: "Requirements & Entities for a Library",
        text: "Build a library database the way real projects start — from requirements. The system must: track **books** (title, author, ISBN), **members** (who can borrow), **loans** (which member borrowed which copy, when), and **authors** (a book can have many authors; an author many books).\n\nThe entities and their relationships:\n- **authors(id, name, birth_year)**\n- **books(id, title, isbn unique, published_year)** — and because a book can have several authors, a junction **book_authors(book_id, author_id)** (M:N).\n- **members(id, name, email unique, joined_at)**\n- **loans(id, book_id FK, member_id FK, borrowed_on, due_on, returned_on NULL)** — one member borrows many copies over time; each loan belongs to one member and one book (1:M on both sides).\n\nThe rule that shapes the design: **a book's identity is the title + author, not the physical copy**. Some libraries loan the same book many times — that's a `copies` table problem. For this project, keep one row per book title and let loans repeat, or model copies if you want real stock tracking. Writing the requirements down before SQL is what separates a design from a scramble.",
        code: "-- Entities, first pass.\nCREATE TABLE authors (id serial primary key, name text not null);\nCREATE TABLE books (id serial primary key, title text not null, isbn text unique);\nCREATE TABLE book_authors (book_id int references books(id), author_id int references authors(id), primary key (book_id, author_id));\nCREATE TABLE members (id serial primary key, name text not null, email text unique);\nCREATE TABLE loans (id serial primary key, book_id int references books(id), member_id int references members(id), borrowed_on date default current_date, returned_on date);",
        note: "Real library/rental/booking apps all share this shape — items, customers, and a many-to-many 'who has what, when' table.",
      },
      {
        title: "Building Tables with Correct Constraints",
        text: "With the design sketched, write the DDL with constraints that make the rules unbreakable:\n\n- `isbn text unique` — no two books share an ISBN.\n- `email text unique` — one membership per email.\n- FKs on loans → books and members — a loan can't point at a phantom book or member.\n- `due_on` should default to `borrowed_on + interval '14 days'` so nobody forgets to set it.\n- CHECK: `returned_on >= borrowed_on` when set.\n\nIndexes follow the queries: `loans(book_id)`, `loans(member_id)`, `loans(returned_on)` (for 'currently borrowed' reports). The PRIMARY KEYs and UNIQUEs already created indexes automatically.\n\nWrite the DDL as a **migration** (Prisma Migrate or a .sql file) from day one — that gives you versioned schema history and makes the test database reproducible. This is exactly how a professional project's schema arrives in code review: readable, constrained, and self-documenting.",
        code: "CREATE TABLE loans (\n  id serial primary key,\n  book_id int not null references books(id),\n  member_id int not null references members(id),\n  borrowed_on date not null default current_date,\n  due_on date not null default (current_date + 14),\n  returned_on date check (returned_on IS NULL OR returned_on >= borrowed_on)\n);\nCREATE INDEX idx_loans_returned ON loans (returned_on);",
        note: "The `due_on default +14 days` line is the whole overdue-notice feature: librarians query `WHERE due_on < today AND returned_on IS NULL`.",
      },
      {
        title: "Seeding Data & the Queries That Run the Library",
        text: "A schema without data is untestable — **seed** realistic rows: 3–4 authors, 5–6 books with authors, 4 members, and a mix of open and returned loans. Seed with explicit INSERTs in a script so it's repeatable.\n\nThen write the queries the library actually needs:\n- **All books by author**: `SELECT b.title FROM books b JOIN book_authors ba ON ba.book_id = b.id JOIN authors a ON a.id = ba.author_id WHERE a.name = 'X';`\n- **Currently borrowed**: `SELECT m.name, b.title, l.due_on FROM loans l JOIN members m ON m.id = l.member_id JOIN books b ON b.id = l.book_id WHERE l.returned_on IS NULL;`\n- **Overdue**: same, plus `AND l.due_on < CURRENT_DATE`.\n- **Most borrowed books**: `SELECT b.title, COUNT(*) FROM loans l JOIN books b ON b.id = l.book_id GROUP BY b.title ORDER BY COUNT(*) DESC LIMIT 5;`\n\nEach query is a real feature — a catalog page, a dashboard widget, an email reminder. Working through this list is the moment SQL stops being syntax and becomes a tool.",
        code: "SELECT m.name, b.title, l.due_on\nFROM loans l\nJOIN members m ON m.id = l.member_id\nJOIN books b ON b.id = l.book_id\nWHERE l.returned_on IS NULL AND l.due_on < CURRENT_DATE;",
        note: "The 'overdue books' report that generates library reminder emails is this exact query, scheduled every morning.",
      },
      {
        title: "Testing Your Schema with Real Queries",
        text: "A schema is proven by the queries it can answer — and by the ones it can't. Test both directions:\n\n**Positive tests** — each intended query returns correct rows (verify counts by hand). **Negative tests** — the database refuses bad data: inserting a loan with a non-existent member_id fails (FK), a duplicate email fails (UNIQUE), a returned_on before borrowed_on fails (CHECK). Each refusal is a designed-in guarantee.\n\nAlso test the **delete rules**: delete an author — `ON DELETE RESTRICT` on book_authors blocks it while books reference them (good). Delete a book with active loans — decide your rule and make it consistent.\n\nFinally, question your design: 'find books never borrowed' needs `LEFT JOIN ... WHERE loan_id IS NULL` — does your schema support it? 'Monthly borrow counts' needs GROUP BY on DATE_TRUNC. If a needed query is painful, the schema, not the query, is usually at fault. This cycle — design, seed, query, question — is how professional schemas mature.",
        code: "-- Books never borrowed:\nSELECT b.title\nFROM books b\nLEFT JOIN loans l ON l.book_id = b.id\nWHERE l.id IS NULL;",
        note: "A librarian's 'why is this book gathering dust?' report is a LEFT JOIN with IS NULL — spotting the unborrowed books.",
      },
    ],
    quizzes: [
      { text: "A book written by several authors is modeled with…", options: ["a copy of the author inside the book row", "a book_authors junction table (M:N)", "a single foreign key", "a JSON column"], correctAnswer: "a book_authors junction table (M:N)" },
      { text: "A loan belongs to one member and one book — that is…", options: ["M:N on both sides", "two one-to-many relationships from loans", "a one-to-one only", "no relationship"], correctAnswer: "two one-to-many relationships from loans" },
      { text: "`due_on date not null default (current_date + 14)` gives…", options: ["a hard-coded due date", "an automatic 14-day due date on every loan", "no due date", "an error"], correctAnswer: "an automatic 14-day due date on every loan" },
      { text: "The overdue-books report filters on…", options: ["returned_on IS NOT NULL", "due_on < CURRENT_DATE AND returned_on IS NULL", "borrowed_on = today", "book_id = 0"], correctAnswer: "due_on < CURRENT_DATE AND returned_on IS NULL" },
      { text: "Books never borrowed is found with…", options: ["INNER JOIN", "LEFT JOIN … WHERE loan.id IS NULL", "RIGHT JOIN only", "DISTINCT"], correctAnswer: "LEFT JOIN … WHERE loan.id IS NULL" },
      { text: "A CHECK (returned_on >= borrowed_on) proves itself when…", options: ["a bad insert is refused", "a query runs", "an index is created", "a backup runs"], correctAnswer: "a bad insert is refused" },
      { text: "The most-borrowed-books query needs…", options: ["GROUP BY + COUNT + ORDER BY DESC LIMIT", "only SELECT *", "a self join", "a trigger"], correctAnswer: "GROUP BY + COUNT + ORDER BY DESC LIMIT" },
      { text: "If an intended query is painful to write, the likely culprit is…", options: ["the database server", "the schema design, not the query", "the index", "the backup"], correctAnswer: "the schema design, not the query" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 18 — Schema Design Polish
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 18,
    title: "Schema Design Polish",
    description: "Constraints, design review, and versioned migrations that keep a schema healthy.",
    topics: [
      {
        title: "Design Review: Reading a Schema Like a Reviewer",
        text: "A good reviewer scans a schema for six things: (1) **keys** — every table has a PK, FKs are consistent types (an int FK pointing at a bigint PK is a join-time disaster). (2) **duplication** — the same fact stored twice anywhere. (3) **naming** — plural table names, snake_case columns, `id` for PKs, `table_id` for FKs; inconsistent naming is a tax on every future join. (4) **types** — money is NUMERIC, booleans are BOOLEAN (not 0/1 ints or 'Y'/'N' text). (5) **constraints** — the real-world rules are actually CHECKed and UNIQUE'd. (6) **nullability** — every nullable column is a decision; a column that's usually required but marked nullable invites NULL-skew bugs.\n\nThe strongest review test: read the schema aloud like a story — 'orders belong to customers; each order has many items; an item references a product.' If the story is smooth and every fact lives in exactly one place, the schema is healthy. Review the schema **before** building features on it; the cost of change grows with every layer built on top.",
        code: "-- Consistent types matter: an int FK to a bigint PK breaks joins.\nCREATE TABLE orders (id bigserial primary key, customer_id bigint references customers(id));",
        note: "Schema review is like code review — cheap to do early, expensive to skip — and the comments live in the migration files.",
      },
      {
        title: "UNIQUE, CHECK & Exclusion Constraints",
        text: "The three constraint families that finish a schema:\n\n**UNIQUE** — no duplicates in a column/group of columns: an email, a SKU, or `(owner_id, name)` where each owner's items have unique names. UNIQUE auto-creates an index and is how you detect accidental duplicates at insert time instead of in reports.\n\n**CHECK** — row-level boolean rules: `CHECK (quantity >= 0)`, `CHECK (total > 0)`, `CHECK (status IN ('draft','paid','cancelled'))`. The last one turns an app enum into a database-enforced contract — a stray 'complete' status becomes impossible.\n\n**EXCLUSION** (advanced) — overlapping ranges or constraints across rows: a booking table where `EXCLUDE USING gist (room_id WITH =, during WITH &&)` prevents double-booking a room in a time range. It's the machinery behind calendar and inventory conflict rules. Rare, but when you need it, nothing else is a substitute. Together: UNIQUE for identity, CHECK for validity, EXCLUSION for non-overlap.",
        code: "CREATE TABLE bookings (\n  room_id int not null,\n  during tsrange not null,\n  EXCLUDE USING gist (room_id WITH =, during WITH &&)\n);",
        note: "The 'this room got double-booked' bug that app logic tried and failed to prevent is what an EXCLUDE constraint stops at the database.",
      },
      {
        title: "Migrations: Versioned Schema Change",
        text: "A **migration** is a versioned, ordered change to the schema — a numbered file that runs once per environment, in order. Prisma Migrate (`prisma migrate dev`) generates these from your `schema.prisma`; Flyway and raw SQL files do the same for non-Prisma stacks.\n\nWhy versioning matters: your local DB, the staging DB, and production must converge on the same shape. A migration run in the wrong order, or a schema edited by hand, silently diverges — and then a feature works locally but fails in prod with 'column does not exist'. Migration files make the schema a **code-reviewed, history-tracked artifact**: `git log` tells you when a column was added and why.\n\nThe workflow: change the schema → generate a migration → review it → apply it (`prisma migrate dev`) → test → commit. Never edit a migration that already ran; write a new one. Down migrations are for rollback; most teams keep them for the tricky ones. A schema with clean migrations is boring and reproducible — which is exactly what you want.",
        code: "# A migration, versioned and applied once per environment.\n# 202608111000_add_member_phone/migration.sql\nALTER TABLE members ADD COLUMN phone text;",
        note: "'Works on my machine, fails in prod' is most often a schema drift — the exact disease versioned migrations cure.",
      },
      {
        title: "Handling Schema Changes Safely",
        text: "Schema changes to a live, busy table need care — the naive ALTER can lock writes for minutes. The safe-playbook:\n\n1. **Additive first**: adding a column or index rarely breaks anything; do it in its own migration.\n2. **Big tables**: `ADD COLUMN` with a DEFAULT is instant in Postgres (metadata only). Setting NOT NULL on a big table needs a backfill: add nullable → backfill rows → add NOT NULL.\n3. **Indexes**: `CREATE INDEX CONCURRENTLY` avoids blocking writes; build the index before you rely on it.\n4. **Renames** break running code that references the old name — rename in two steps (add new, deploy code, drop old) or keep an alias during transition.\n5. **Dropping a column**: first confirm nothing reads it — grep the codebase, then `DROP COLUMN`, and remember views/procedures can hide the reference.\n\nEverything is reversible **until it isn't** — the safest DDL is small, additive, and backed by a backup. Production schema surgery is boring, incremental, and tested on staging first. Boring is the goal.",
        code: "-- Non-blocking: build the index while writes continue.\nCREATE INDEX CONCURRENTLY idx_members_email ON members (email);",
        note: "The 2 a.m. horror of 'ALTER TABLE locked the payments table for 20 minutes' is avoided by additive, incremental DDL.",
      },
    ],
    quizzes: [
      { text: "An int foreign key pointing at a bigint primary key…", options: ["is fine", "breaks the join with a type mismatch", "is faster", "creates an index"], correctAnswer: "breaks the join with a type mismatch" },
      { text: "A standard for FKs is to name them…", options: ["anything", "table_id (e.g. member_id)", "the PK name only", "x1, x2"], correctAnswer: "table_id (e.g. member_id)" },
      { text: "A `CHECK (status IN (...))` turns an app enum into…", options: ["a suggestion", "a database-enforced contract", "a JSON column", "an index"], correctAnswer: "a database-enforced contract" },
      { text: "Preventing double-booking of a room in overlapping time ranges needs…", options: ["UNIQUE", "EXCLUDE … WITH &&", "CHECK", "NOT NULL"], correctAnswer: "EXCLUDE … WITH &&" },
      { text: "A migration is…", options: ["a random SQL change", "a versioned, ordered schema change applied once per environment", "a backup file", "an index"], correctAnswer: "a versioned, ordered schema change applied once per environment" },
      { text: "You should never…", options: ["add a column", "edit a migration that already ran — write a new one instead", "backfill data", "review migrations"], correctAnswer: "edit a migration that already ran — write a new one instead" },
      { text: "To add NOT NULL to a big populated column, first…", options: ["drop the column", "add it nullable, backfill rows, then add NOT NULL", "ignore old rows", "rename the table"], correctAnswer: "add it nullable, backfill rows, then add NOT NULL" },
      { text: "CREATE INDEX CONCURRENTLY exists to…", options: ["run faster", "build the index without blocking writes", "drop indexes", "skip statistics"], correctAnswer: "build the index without blocking writes" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 19 — Query Optimizations
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 19,
    title: "Query Optimizations",
    description: "Find slow queries, add the right indexes, and rewrite for speed.",
    topics: [
      {
        title: "Finding Slow Queries First",
        text: "Optimize what actually hurts. Start with the database's own log: PostgreSQL's `pg_stat_statements` tracks cumulative time per query — the top rows are your real hot spots, not the ones you guess. `EXPLAIN ANALYZE` on a candidate shows the plan with real timings.\n\nThe 90/10 rule applies brutally: a handful of queries cause almost all the latency. Find them, fix them, and the database feels fast without touching 99% of the code. Common culprits: a query with no WHERE (full scan), a missing join index, a function hiding a column from an index, and **N+1** — an ORM loop that runs one query per row (1000 rows = 1000 queries); fix with `include`/preloading or a JOIN.\n\nMeasure before and after: record the query time, apply the fix, re-run. If you can't measure the improvement, you're guessing — and 'it feels faster' doesn't survive code review.",
        code: "-- Postgres tracks cumulative query times:\nSELECT query, calls, total_exec_time\nFROM pg_stat_statements\nORDER BY total_exec_time DESC LIMIT 10;",
        note: "A 1-second admin query nobody notices is fine; the 50-ms query the API calls 10,000 times a minute is the emergency.",
      },
      {
        title: "Index Strategy: Index What You Actually Query",
        text: "Indexes are a budget — each one costs write speed and disk. Spend where queries filter, join, and sort. The disciplined approach:\n\n1. Start with the hot queries from pg_stat_statements.\n2. For each, index the WHERE and JOIN columns, matching the composite index's leading column order.\n3. Drop indexes nobody uses (Postgres can tell you — check `pg_stat_user_indexes` for low `idx_scan` counts).\n4. Watch for the silent killers: functions on indexed columns (`LOWER(email)`), leading wildcards, and low-selectivity columns the planner rightly ignores.\n\nComposite indexes pay for multi-column filters but must lead with the column that's always in the query. A good test: `EXPLAIN` before, create the index, `EXPLAIN` again — the Seq Scan should become an Index Scan and the cost line should drop. Index tuning is iterative; the plan is the feedback loop.",
        code: "-- After finding the hot query, index its join + filter columns:\nCREATE INDEX idx_orders_customer_created\nON orders (customer_id, created_at DESC);",
        note: "Index strategy is negotiation, not decoration: every index you add makes writes slightly slower, so make each one earn its keep.",
      },
      {
        title: "Rewriting Queries: Less Data, Fewer Round-Trips",
        text: "Before adding hardware, make the query leaner. Three high-yield rewrites:\n\n1. **Select fewer columns** — `SELECT *` on a wide table ships megabytes that get discarded; name the columns. On huge rows, that alone can halve query time.\n2. **Filter before you join** — a WHERE on the driving table lets the planner shrink the join input; pushing conditions into the ON or a subquery can help even more.\n3. **Replace the N+1 loop with a set query** — 1000 tiny queries become one IN (...) query; the ORM's `include`/`whereIn` exists for exactly this.\n\nAlso: use `LIMIT` for 'first N' instead of loading everything; aggregate in SQL instead of fetching rows and summing in code; and avoid functions in WHERE on indexed columns. Set-based thinking — do it to all rows at once, not row by row — is the biggest single mindset shift in SQL performance. The database is fastest when you ask it to do the whole job, not when you nibble around the edges.",
        code: "-- Before: fetch all orders, filter in the app. After:\nSELECT id, customer_id, total\nFROM orders\nWHERE status = 'paid' AND created_at > '2026-01-01'\nORDER BY created_at DESC LIMIT 20;",
        note: "'SELECT *' through a JOIN that throws away half the columns is shipping megabytes to drop them — set-based thinking trims it.",
      },
      {
        title: "Caching & When to Give Up on a Query",
        text: "Some questions don't need a live query at all. **Caching** layers: a Redis/memcached key for data that changes rarely and is read often (product details, config). A **materialized view** for heavy aggregates that tolerate staleness (nightly rollups). An application-level memoized value for per-request constants.\n\nInvalidation is the hard part — a cache with no invalidation serves stale data forever. Patterns: cache-aside (read cache, miss → query → write cache → set TTL), write-through (update cache on write), and TTLs as a safety net. Start with short TTLs and measure.\n\nAnd the mature move: **know when a query is not the problem**. A 100-ms query is irrelevant if your app makes 50 of them per page. Fix the count before the speed. Profiling the app (not just the DB) shows whether the bottleneck is SQL, the network, or the code itself. 'The database is slow' is rarely the whole truth — measure first.",
        code: "// Cache-aside in Node:\nconst cached = await redis.get(key);\nif (cached) return JSON.parse(cached);\nconst rows = await pool.query(query);\nawait redis.set(key, JSON.stringify(rows), 'EX', 300);\nreturn rows;",
        note: "The product-catalog page that does 1 DB query but 60 Redis hits is fine; the one doing 60 DB queries is the real emergency.",
      },
    ],
    quizzes: [
      { text: "The first step of query optimization is…", options: ["rewriting everything", "finding the actual slow queries (pg_stat_statements)", "adding indexes to every column", "buying faster hardware"], correctAnswer: "finding the actual slow queries (pg_stat_statements)" },
      { text: "The N+1 problem is…", options: ["a syntax error", "an ORM loop running one query per row", "too many indexes", "a slow disk"], correctAnswer: "an ORM loop running one query per row" },
      { text: "An index nobody uses…", options: ["is free", "still costs write speed and disk — drop it", "speeds writes", "cannot exist"], correctAnswer: "still costs write speed and disk — drop it" },
      { text: "A composite index's columns must be ordered so that…", options: ["any order works", "the leading column is the one always present in queries", "the last column is always filtered", "all columns are text"], correctAnswer: "the leading column is the one always present in queries" },
      { text: "`SELECT *` on a wide table is a problem because…", options: ["it is invalid", "it ships columns the query never uses", "it cannot be indexed", "it is slow to type"], correctAnswer: "it ships columns the query never uses" },
      { text: "The biggest mindset shift in SQL performance is…", options: ["using more loops", "set-based thinking — do work on all rows at once", "avoiding JOINs entirely", "using VARCHAR(1)"], correctAnswer: "set-based thinking — do work on all rows at once" },
      { text: "A cache with no invalidation…", options: ["is always correct", "serves stale data forever", "speeds up writes", "is impossible"], correctAnswer: "serves stale data forever" },
      { text: "A 100-ms query is irrelevant if…", options: ["it runs once a day", "the app makes 50 of them per page — fix the count first", "the table is small", "it has an index"], correctAnswer: "the app makes 50 of them per page — fix the count first" },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────────
  // SECTION 20 — Final Project Submission
  // ──────────────────────────────────────────────────────────────────────────
  {
    week: 20,
    title: "Final Project Submission",
    description: "An end-to-end database project: design, build, query, document, and review.",
    topics: [
      {
        title: "The Project Brief: Design a Booking System",
        text: "Your final project: a **booking system** — restaurants, clinics, or a gym; you choose the domain. The requirements mirror a real spec: people must book a resource (a table, a slot, a room) for a time range; the same resource can't be double-booked; staff must see today's bookings; management must see utilization per resource per week.\n\nDeliverables in order:\n1. **ER sketch** — entities and relationship lines, on paper first.\n2. **Schema** — tables, keys, types, and constraints (including the EXCLUDE range guard against double-booking).\n3. **Seed data** — enough to make reports meaningful (10+ resources, 40+ bookings across weeks).\n4. **The queries** — today's bookings, free slots for a resource on a date, utilization per resource per week, cancellations per day.\n5. **Migration files** — versioned, so the whole project is reproducible.\n\nThe evaluation is not 'did it run' — it's whether a stranger with your migration files can recreate the database and answer the business questions. Documentation is part of the grade.",
        code: "-- A booking is a resource occupied for a time range.\nCREATE TABLE bookings (\n  id serial primary key,\n  resource_id int not null references resources(id),\n  customer_name text not null,\n  starts_at timestamptz not null,\n  ends_at timestamptz not null check (ends_at > starts_at),\n  status text default 'confirmed' check (status IN ('confirmed','cancelled','done')),\n  EXCLUDE USING gist (resource_id WITH =, tsrange(starts_at, ends_at) WITH &&)\n);",
        note: "The double-booking EXCLUDE you met in week 18 is now the centerpiece of the capstone — real conflict protection, in the schema.",
      },
      {
        title: "Advanced Queries the Booking System Needs",
        text: "The booking project demands queries beyond basic CRUD — the advanced set:\n\n**Today's bookings** — filter on `DATE(starts_at) = CURRENT_DATE` or a range over `[today, tomorrow)` so the index works.\n\n**Free slots** — hard part. Given a resource's working hours and its existing bookings, find gaps. A robust way: generate the possible slot starts with `generate_series`, then `LEFT JOIN` to bookings and keep non-overlapping slots. It's the query where subqueries and date math genuinely meet.\n\n**Utilization per resource per week** — group bookings by `DATE_TRUNC('week', starts_at)` and resource; utilization = sum(ends_at - starts_at) / (open hours × 7). Postgres `date_trunc` + interval arithmetic does the math.\n\n**Cancellation trend** — `GROUP BY DATE_TRUNC('day', cancelled_at)` for cancelled rows.\n\nEach one reuses the week's tools: date functions, GROUP BY, EXCLUDE, and LEFT JOIN. If you can write these four, you can query any business database.",
        code: "SELECT r.name, DATE_TRUNC('week', b.starts_at) AS week,\n       SUM(EXTRACT(EPOCH FROM (b.ends_at - b.starts_at)) / 3600) AS booked_hours\nFROM bookings b\nJOIN resources r ON r.id = b.resource_id\nWHERE b.status = 'confirmed'\nGROUP BY r.name, week\nORDER BY r.name, week;",
        note: "'How busy are our tables on Friday nights?' is this GROUP BY + date_trunc pattern — utilization questions are always time-bucketed.",
      },
      {
        title: "Reviewing Your Own Work Like a Senior Engineer",
        text: "Before submitting, review your project the way a senior would. Run through the checklist: **Is the schema normalized?** (no duplicated facts, keys on every table). **Are the rules enforced in the database?** (UNIQUE on emails, CHECK on statuses, the EXCLUDE on bookings — not just in app code). **Are types right?** (TIMESTAMPTZ for times, NUMERIC for money). **Are the hot queries indexed?** (EXPLAIN the free-slots query — it's the one that will scan). **Is it reproducible?** (fresh DB → run migrations → seed → queries work, with zero hand steps).\n\nThen the brutal tests: **delete a resource with bookings** — what happens? **Insert an overlapping booking** — is it refused? **Backdate a booking** — is it valid? Each 'what happens if…?' you can't answer is a gap. Finally, read the queries for elegance: could any be shorter, any SELECT * trimmed? Senior engineers are not faster — they've just asked themselves 'what happens if' earlier.",
        code: "-- Does an overlapping booking get refused? Try it.\nINSERT INTO bookings (resource_id, customer_name, starts_at, ends_at)\nVALUES (1, 'Latecomer', '2026-08-12 14:00+05:30', '2026-08-12 15:00+05:30');\n-- Already booked 14:00-15:00? The EXCLUDE rejects it.",
        note: "'What happens if I delete this?' is the question that separates a submission from a system. Every schema has an answer; good ones already thought about it.",
      },
      {
        title: "Final Exam Prep & Certification Review",
        text: "The final exam covers the whole arc: concepts (ACID, normalization, relationships), syntax (SELECT, WHERE, GROUP BY, HAVING, JOIN, subqueries), design (keys, constraints, indexes), and practice (reading query plans, injection-safe code, migrations).\n\nA strong revision path, not a cram: (1) re-read each week's topics — the 'why' beats the 'how'. (2) Rebuild the mini-project from memory — schema, seed, queries — that's the truest test. (3) Explain each concept aloud in one sentence (if you can't, you don't own it yet). (4) Drill the pitfalls that cost marks: WHERE vs HAVING, INNER vs LEFT, `= NULL` vs `IS NULL`, COUNT(*) vs COUNT(col), float-for-money.\n\nThe exam questions are hand-written and distinct — no memorized templates will help; understanding will. After the exam, the certification is earned by demonstrating you can design and query a real database, which is exactly what the capstone proves. Good luck — you've built a database and made it answer real questions.",
        code: "-- The one-line pitfall drill:\n-- WHERE filters rows; HAVING filters groups.\n-- IS NULL, not = NULL. COUNT(*), not guessing.\nSELECT city, COUNT(*) AS n\nFROM customers\nWHERE active\nGROUP BY city\nHAVING COUNT(*) > 5;",
        note: "The certification isn't a reward for finishing — it's evidence you can design, build, and query a database someone else can actually run.",
      },
    ],
    quizzes: [
      { text: "The centerpiece constraint that prevents double-booking is…", options: ["UNIQUE", "the EXCLUDE range constraint", "NOT NULL", "a trigger"], correctAnswer: "the EXCLUDE range constraint" },
      { text: "Free slots on a date are best found by…", options: ["a SELECT *", "generate_series over possible slots LEFT JOINed to bookings", "a DELETE", "an INSERT"], correctAnswer: "generate_series over possible slots LEFT JOINed to bookings" },
      { text: "Utilization per week groups bookings by…", options: ["book_id", "DATE_TRUNC('week', starts_at) and resource", "customer_name", "status"], correctAnswer: "DATE_TRUNC('week', starts_at) and resource" },
      { text: "The senior-engineer review asks…", options: ["is it fast enough", "'what happens if…?' for deletes, overlaps, and bad data", "is it pretty", "how many lines"], correctAnswer: "'what happens if…?' for deletes, overlaps, and bad data" },
      { text: "Reproducibility means…", options: ["the schema is documented", "a fresh DB → migrations → seed → queries work with no hand steps", "a backup exists", "the queries are short"], correctAnswer: "a fresh DB → migrations → seed → queries work with no hand steps" },
      { text: "The strongest revision test is…", options: ["re-reading slides", "rebuilding the project from memory — schema, seed, and queries", "doing one quiz", "watching videos"], correctAnswer: "rebuilding the project from memory — schema, seed, and queries" },
      { text: "Which pair is the classic pitfall to drill?", options: ["WHERE vs HAVING and INNER vs LEFT", "SELECT vs UPDATE", "index vs table", "NULL vs empty table"], correctAnswer: "WHERE vs HAVING and INNER vs LEFT" },
      { text: "The certification proves…", options: ["you watched the course", "you can design and query a real database someone else can run", "you can memorize queries", "you finished in time"], correctAnswer: "you can design and query a real database someone else can run" },
    ],
  },
];

export const sqlFinalExam: SqlFinalExamQuestion[] = [
  { text: "Which set of guarantees makes databases safe for money transfers?", options: ["CRUD", "ACID (Atomicity, Consistency, Isolation, Durability)", "SQL", "DDL"], correctAnswer: "ACID (Atomicity, Consistency, Isolation, Durability)" },
  { text: "A table that stores a comma-separated list in one column violates…", options: ["3NF", "1NF (no atomic values)", "ACID", "the primary key rule"], correctAnswer: "1NF (no atomic values)" },
  { text: "Which operator tests whether a value is present in a list?", options: ["IN", "IS", "LIKE", "AS"], correctAnswer: "IN" },
  { text: "WHERE filters rows before grouping; HAVING filters…", options: ["rows after ORDER BY", "whole groups after aggregation", "columns in SELECT", "the primary key"], correctAnswer: "whole groups after aggregation" },
  { text: "Which join keeps every row from the left table with NULLs for missing matches?", options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "FULL SELF JOIN"], correctAnswer: "LEFT JOIN" },
  { text: "Why does a correlated subquery tend to slow down as the outer table grows?", options: ["It sorts the whole table", "It re-runs the inner query once per outer row", "It creates new indexes", "It locks every row"], correctAnswer: "It re-runs the inner query once per outer row" },
  { text: "To find customers with no orders, use LEFT JOIN and check…", options: ["customer.name IS NULL", "order.id IS NULL", "COUNT(*) = 0", "order.total = 0"], correctAnswer: "order.id IS NULL" },
  { text: "Money should be stored as…", options: ["FLOAT", "NUMERIC or integer cents", "TEXT", "BOOLEAN"], correctAnswer: "NUMERIC or integer cents" },
  { text: "A partial dependency (a column depending on part of a composite key) violates…", options: ["1NF", "2NF", "3NF", "BCNF"], correctAnswer: "2NF" },
  { text: "Which command removes all rows instantly and cannot filter?", options: ["DELETE FROM … WHERE", "TRUNCATE", "DROP COLUMN", "ALTER"], correctAnswer: "TRUNCATE" },
  { text: "PostgreSQL's upsert is written with…", options: ["REPLACE INTO", "ON CONFLICT", "INSERT OR IGNORE", "MERGE ALL"], correctAnswer: "ON CONFLICT" },
  { text: "A normal index is not used by `WHERE LOWER(email) = …` because…", options: ["the function hides the column from the index", "emails are too short", "LOWER is banned", "indexes only work on integers"], correctAnswer: "the function hides the column from the index" },
  { text: "A daily revenue dashboard reads a precomputed aggregate. What is that pattern called?", options: ["a live view", "a materialized view (refreshed on a schedule)", "an index", "a trigger"], correctAnswer: "a materialized view (refreshed on a schedule)" },
  { text: "The single most important SQL injection defense is…", options: ["escaping quotes", "parameterized queries — never concatenating user input into SQL", "renaming tables", "using OR instead of AND"], correctAnswer: "parameterized queries — never concatenating user input into SQL" },
  { text: "Audit logging 'who changed what' automatically on writes is best done with…", options: ["a view", "a trigger that writes to an audit table", "an index", "a CHECK constraint"], correctAnswer: "a trigger that writes to an audit table" },
  { text: "`BEGIN; … COMMIT;` groups statements so they…", options: ["run in parallel", "all succeed or all roll back", "skip failures", "run twice"], correctAnswer: "all succeed or all roll back" },
  { text: "Before adding an index, you should…", options: ["index every column", "find the queries that actually take the most time (pg_stat_statements)", "buy faster hardware", "rewrite all queries"], correctAnswer: "find the queries that actually take the most time (pg_stat_statements)" },
  { text: "A fresh DB → migrations → seed → queries that just work means the schema is…", options: ["complex", "reproducible", "cached", "denormalized"], correctAnswer: "reproducible" },
];

