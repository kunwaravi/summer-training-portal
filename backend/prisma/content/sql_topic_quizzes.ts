/**
 * SQL course — per-topic quizzes.
 *
 * Keyed by the EXACT topic titles used in `sql.ts`. Each topic has 4
 * questions (4 options, exactly 1 correct). These back the frontend
 * topic-lock flow: a topic is only unlockable once the previous topic's
 * quiz is passed, and the topic quiz is fetched by topic id.
 *
 * IMPORTANT: question texts must NOT duplicate the chapter-quiz texts in
 * sql.ts, because the week quiz endpoint returns every question in a
 * module (topic + chapter) together.
 */

export interface SqlTopicQuiz {
  text: string;
  options: string[];
  correctAnswer: string;
}

export const sqlTopicQuizzes: Record<string, SqlTopicQuiz[]> = {
  // ── W1 · Introduction to Databases ──────────────────────────────────────
  "What Is a Database & Why We Need One": [
    { text: "Which of these is a database's core advantage over hand-written file handling?", options: ["It uses less RAM", "Concurrency, fast querying, consistency and durability are built in", "It is always faster at arithmetic", "It never needs a server"], correctAnswer: "Concurrency, fast querying, consistency and durability are built in" },
    { text: "A declarative query means you…", options: ["describe the exact loop to run", "state WHAT you want and let the engine decide HOW", "write assembly", "manually read every file"], correctAnswer: "state WHAT you want and let the engine decide HOW" },
    { text: "The durability guarantee protects against…", options: ["typos in queries", "crashes and power loss after a commit", "duplicate rows", "slow networks"], correctAnswer: "crashes and power loss after a commit" },
    { text: "The course uses which database engine?", options: ["MongoDB", "PostgreSQL", "SQLite", "Oracle"], correctAnswer: "PostgreSQL" },
  ],
  "Databases vs Spreadsheets": [
    { text: "Two people editing the same spreadsheet cell is a problem because…", options: ["spreadsheets are offline only", "the last write can silently overwrite the first — a database serializes writes", "cells cannot be edited", "it deletes the file"], correctAnswer: "the last write can silently overwrite the first — a database serializes writes" },
    { text: "A spreadsheet is still a good choice when…", options: ["millions of rows must be joined", "data is a single-user calculation or one-off analysis", "many users write concurrently", "data must never be corrupted"], correctAnswer: "data is a single-user calculation or one-off analysis" },
    { text: "Which is a problem spreadsheets have that databases solve?", options: ["no colors", "weak type enforcement — any cell can hold anything", "no undo", "no printing"], correctAnswer: "weak type enforcement — any cell can hold anything" },
    { text: "The three Cs that push people off Excel are…", options: ["color, charts, calculators", "concurrency, consistency, and correct types", "columns, cells, colors", "copy, cut, paste"], correctAnswer: "concurrency, consistency, and correct types" },
  ],
  "DBMS vs RDBMS": [
    { text: "Which of these is an RDBMS?", options: ["MongoDB", "PostgreSQL", "Redis", "Elasticsearch"], correctAnswer: "PostgreSQL" },
    { text: "The relational model was invented by…", options: ["Bill Gates", "E. F. Codd", "Linus Torvalds", "Alan Turing"], correctAnswer: "E. F. Codd" },
    { text: "The relational model avoids duplication by…", options: ["copying data into every table", "storing facts once and linking with keys", "using fewer tables", "storing everything in JSON"], correctAnswer: "storing facts once and linking with keys" },
    { text: "An order row references its customer with…", options: ["the customer's full name", "the customer's ID", "a photo", "a timestamp"], correctAnswer: "the customer's ID" },
  ],
  "The ACID Preview: Why Databases Don't Lose Money": [
    { text: "Atomicity in a money transfer means…", options: ["the transfer is fast", "debit and credit happen together or not at all", "money can be created", "only the debit matters"], correctAnswer: "debit and credit happen together or not at all" },
    { text: "Isolation protects against…", options: ["one transaction seeing another's half-finished updates", "disk full", "slow queries", "duplicate emails"], correctAnswer: "one transaction seeing another's half-finished updates" },
    { text: "Consistency is enforced partly by…", options: ["more RAM", "constraints like CHECK that reject invalid states", "faster CPUs", "fewer rows"], correctAnswer: "constraints like CHECK that reject invalid states" },
    { text: "Which ACID letter guarantees a commit survives a power cut?", options: ["A", "C", "I", "D"], correctAnswer: "D" },
  ],
  // ── W2 · Relational Database Concepts ───────────────────────────────────
  "Tables, Rows & Columns": [
    { text: "In a table, columns are also called…", options: ["records", "attributes", "indices", "sessions"], correctAnswer: "attributes" },
    { text: "A NULL in a cell means…", options: ["zero", "empty string", "unknown / no value", "an error"], correctAnswer: "unknown / no value" },
    { text: "NOT NULL on a column means…", options: ["the column must be 0", "the column cannot store NULL — it must have a value", "the column is the key", "the column is hidden"], correctAnswer: "the column cannot store NULL — it must have a value" },
    { text: "Table names are usually written as…", options: ["a plural noun like students or orders", "a single letter", "uppercase only", "a date"], correctAnswer: "a plural noun like students or orders" },
  ],
  "Primary Keys: The Identity of a Row": [
    { text: "Two rows may never share the same…", options: ["name", "primary key value", "created date", "color"], correctAnswer: "primary key value" },
    { text: "Most tables use what as a primary key?", options: ["a person's name", "an auto-incrementing integer id", "the email", "a random phrase"], correctAnswer: "an auto-incrementing integer id" },
    { text: "Why store a student's ID in another table instead of their name?", options: ["names are long", "IDs are unique and stable, names repeat and change", "IDs are prettier", "names are private"], correctAnswer: "IDs are unique and stable, names repeat and change" },
    { text: "A composite primary key is…", options: ["two columns together forming the identity", "two tables with one key", "a key that is NULL", "an index on text"], correctAnswer: "two columns together forming the identity" },
  ],
  "Foreign Keys & Referential Integrity": [
    { text: "A foreign key in orders references…", options: ["the orders table's own id", "the primary key of another table (customers)", "a random column", "a view"], correctAnswer: "the primary key of another table (customers)" },
    { text: "Referential integrity means…", options: ["you cannot insert a child pointing at a missing parent", "all rows are sorted", "queries are fast", "names are unique"], correctAnswer: "you cannot insert a child pointing at a missing parent" },
    { text: "ON DELETE SET NULL means…", options: ["the delete is refused", "the child's FK is set to NULL instead of deleting it", "the child is deleted too", "the parent is kept"], correctAnswer: "the child's FK is set to NULL instead of deleting it" },
    { text: "A shopping cart's line items should probably use…", options: ["ON DELETE RESTRICT", "ON DELETE CASCADE", "NO DELETE", "UNIQUE"], correctAnswer: "ON DELETE CASCADE" },
  ],
  "Relationships: One-to-One, One-to-Many, Many-to-Many": [
    { text: "One customer has many orders — that is…", options: ["one-to-one", "one-to-many", "many-to-many", "no relationship"], correctAnswer: "one-to-many" },
    { text: "A one-to-many relationship is implemented with…", options: ["a junction table", "a foreign key on the 'many' side", "two primary keys", "a view"], correctAnswer: "a foreign key on the 'many' side" },
    { text: "Students and courses (many students, many courses) need…", options: ["a junction table", "a single FK", "a 1:1 table", "a duplicate column"], correctAnswer: "a junction table" },
    { text: "A one-to-one relationship is implemented with…", options: ["a FK plus a UNIQUE constraint", "a junction table", "two FKs", "a composite key"], correctAnswer: "a FK plus a UNIQUE constraint" },
  ],
  // ── W3 · SQL Basics (SELECT, WHERE) ─────────────────────────────────────
  "Anatomy of a SELECT Statement": [
    { text: "Which clause comes right after SELECT in a basic statement?", options: ["ORDER BY", "FROM", "LIMIT", "WHERE"], correctAnswer: "FROM" },
    { text: "`SELECT price * 0.05 AS tax` uses AS to…", options: ["rename the table", "name the computed column", "filter rows", "sort results"], correctAnswer: "name the computed column" },
    { text: "The result of a SELECT is…", options: ["a number", "itself a table", "a file", "a function"], correctAnswer: "itself a table" },
    { text: "Why prefer naming columns over SELECT * in production?", options: ["it is shorter", "the query stays stable when the table grows", "it is faster to type", "SELECT * is invalid"], correctAnswer: "the query stays stable when the table grows" },
  ],
  "Filtering with WHERE": [
    { text: "Which operator means 'not equal' in SQL?", options: ["!=", "<>", "=!", "=<"], correctAnswer: "<>" },
    { text: "In SQL, equality is written with…", options: ["==", "=", "===", "->"], correctAnswer: "=" },
    { text: "AND binds tighter than OR, so `a OR b AND c` means…", options: ["(a OR b) AND c", "a OR (b AND c)", "a AND b OR c", "(a AND b) OR (a AND c)"], correctAnswer: "a OR (b AND c)" },
    { text: "Filtering happens where?", options: ["in your app after fetching everything", "at the database before rows cross the network", "in the browser", "on the index file"], correctAnswer: "at the database before rows cross the network" },
  ],
  "NULLs: The Third State": [
    { text: "`'a' = NULL` evaluates to…", options: ["TRUE", "FALSE", "NULL (unknown)", "0"], correctAnswer: "NULL (unknown)" },
    { text: "To find rows where phone is missing, write…", options: ["WHERE phone = NULL", "WHERE phone IS NULL", "WHERE phone = ''", "WHERE phone = 0"], correctAnswer: "WHERE phone IS NULL" },
    { text: "An empty text box in a form usually should map to…", options: ["0", "NULL (unknown) rather than an empty string", "FALSE", "a dash"], correctAnswer: "NULL (unknown) rather than an empty string" },
    { text: "COUNT(*) counts…", options: ["only non-NULL rows", "every row including those with NULLs", "only NULLs", "distinct values"], correctAnswer: "every row including those with NULLs" },
  ],
  "Aliases & Computed Columns": [
    { text: "`FROM orders AS o` lets you…", options: ["write o.total instead of orders.total", "delete the table", "rename the table in the database", "skip the FROM"], correctAnswer: "write o.total instead of orders.total" },
    { text: "An alias created with AS…", options: ["permanently renames the column", "lasts only for that one query", "creates a new table", "is stored on disk"], correctAnswer: "lasts only for that one query" },
    { text: "Which is a computed column?", options: ["SELECT ROUND(price, 2) FROM products", "SELECT price FROM products", "SELECT * FROM products", "FROM products"], correctAnswer: "SELECT ROUND(price, 2) FROM products" },
    { text: "Currency formatting should live…", options: ["in the SQL query", "in the app layer, while SQL returns raw values", "in the database schema", "in the index"], correctAnswer: "in the app layer, while SQL returns raw values" },
  ],
  // ── W4 · Data Filtering & Sorting ───────────────────────────────────────
  "IN, BETWEEN & LIKE": [
    { text: "`WHERE age BETWEEN 18 AND 25` is equivalent to…", options: ["age > 18 AND age < 25", "age >= 18 AND age <= 25", "age IN (18, 25)", "age LIKE 18"], correctAnswer: "age >= 18 AND age <= 25" },
    { text: "In LIKE, the underscore `_` matches…", options: ["any run of characters", "exactly one character", "a space", "nothing"], correctAnswer: "exactly one character" },
    { text: "Which finds names starting with 'sa'?", options: ["name LIKE '%sa'", "name LIKE 'sa%'", "name LIKE '_sa'", "name LIKE 'sa_'"], correctAnswer: "name LIKE 'sa%'" },
    { text: "A LIKE pattern starting with `%` is slow on big tables because…", options: ["it cannot use a normal index efficiently", "it uses too much memory", "it is invalid", "it sorts the data"], correctAnswer: "it cannot use a normal index efficiently" },
  ],
  "Boolean Logic: AND, OR, NOT": [
    { text: "Which filter means 'premium users in Pune, OR anyone who spent over ₹50k'?", options: ["premium = true AND city = 'Pune' OR total > 50000", "(premium = true AND city = 'Pune') OR total > 50000", "premium = true OR city = 'Pune' AND total > 50000", "total > 50000 AND premium = true"], correctAnswer: "(premium = true AND city = 'Pune') OR total > 50000" },
    { text: "NOT inverts…", options: ["the query", "a boolean condition", "the table", "the sort order"], correctAnswer: "a boolean condition" },
    { text: "Why parenthesize mixed AND/OR conditions?", options: ["it is required syntax", "it removes ambiguity for readers and the engine", "it speeds the query", "it avoids errors"], correctAnswer: "it removes ambiguity for readers and the engine" },
    { text: "`NOT IN` with a NULL in the list yields…", options: ["all rows", "no rows", "an error", "a warning"], correctAnswer: "no rows" },
  ],
  "ORDER BY: Sorting Results": [
    { text: "Without ORDER BY, result order is…", options: ["guaranteed by insertion time", "unspecified — never rely on it", "always alphabetical", "by primary key"], correctAnswer: "unspecified — never rely on it" },
    { text: "Default sort order is…", options: ["descending", "ascending", "random", "by size"], correctAnswer: "ascending" },
    { text: "`ORDER BY score DESC, name ASC` sorts…", options: ["name first, then score", "score descending, ties broken alphabetically by name", "score ascending", "randomly"], correctAnswer: "score descending, ties broken alphabetically by name" },
    { text: "Sorting a huge unfiltered result is expensive because…", options: ["the engine may sort a whole temporary file", "it locks the disk", "indexes break", "it is invalid SQL"], correctAnswer: "the engine may sort a whole temporary file" },
  ],
  "LIMIT, OFFSET & Pagination": [
    { text: "`LIMIT 5` returns…", options: ["the last 5 rows", "at most 5 rows", "exactly 5 rows or an error", "5 columns"], correctAnswer: "at most 5 rows" },
    { text: "Keyset pagination uses…", options: ["OFFSET with large numbers", "WHERE id > last_seen ORDER BY id LIMIT n", "random sampling", "SELECT ALL"], correctAnswer: "WHERE id > last_seen ORDER BY id LIMIT n" },
    { text: "Why is OFFSET slow on deep pages?", options: ["it sorts", "the engine computes and discards all previous rows each time", "it locks rows", "it is invalid"], correctAnswer: "the engine computes and discards all previous rows each time" },
    { text: "LIMIT without ORDER BY gives…", options: ["a guaranteed random sample", "some arbitrary 10 rows", "the best 10 rows", "an error"], correctAnswer: "some arbitrary 10 rows" },
  ],
  // ── W5 · SQL Functions (Aggregate) ──────────────────────────────────────
  "Aggregates: COUNT, SUM, AVG, MIN, MAX": [
    { text: "Which aggregate finds the smallest value?", options: ["SUM", "MIN", "COUNT", "AVG"], correctAnswer: "MIN" },
    { text: "Aggregates collapse…", options: ["one row into many", "many rows into one value", "columns into rows", "tables into views"], correctAnswer: "many rows into one value" },
    { text: "SUM ignores…", options: ["negative numbers", "NULLs", "integers", "duplicates"], correctAnswer: "NULLs" },
    { text: "Aggregates without GROUP BY summarize…", options: ["each group", "the whole table at once", "one column", "nothing"], correctAnswer: "the whole table at once" },
  ],
  "DISTINCT: Unique Values": [
    { text: "`SELECT DISTINCT city` returns…", options: ["all cities with duplicates", "one row per unique city", "only the first city", "an error"], correctAnswer: "one row per unique city" },
    { text: "`SELECT DISTINCT city, state` deduplicates on…", options: ["city alone", "the whole pair (city, state)", "state alone", "nothing"], correctAnswer: "the whole pair (city, state)" },
    { text: "DISTINCT is not free because…", options: ["it locks the table", "the engine must sort or hash values to find duplicates", "it downloads data", "it is invalid"], correctAnswer: "the engine must sort or hash values to find duplicates" },
    { text: "For 'customers who have at least one order', prefer…", options: ["JOIN + DISTINCT", "EXISTS (much faster)", "SELECT *", "a scalar subquery"], correctAnswer: "EXISTS (much faster)" },
  ],
  "Scalar Functions: Strings & Numbers": [
    { text: "Which makes text lowercase?", options: ["LOWER(x)", "SMALL(x)", "MIN(x)", "DOWN(x)"], correctAnswer: "LOWER(x)" },
    { text: "ROUND(price, 2) rounds…", options: ["to the nearest integer", "to 2 decimal places", "up only", "down only"], correctAnswer: "to 2 decimal places" },
    { text: "`EXTRACT(YEAR FROM created_at)` pulls…", options: ["the time", "the year part of a date", "the month", "the day of week"], correctAnswer: "the year part of a date" },
    { text: "`LOWER(TRIM(email))` is used to…", options: ["delete emails", "normalize an email before comparison", "hide emails", "sort emails"], correctAnswer: "normalize an email before comparison" },
  ],
  "Aggregates + NULLs: The Silent Skew": [
    { text: "AVG over rows where one score is NULL divides by…", options: ["all rows", "the count of non-NULL scores", "zero", "two"], correctAnswer: "the count of non-NULL scores" },
    { text: "To treat a missing score as 0 before averaging, use…", options: ["AVG(score)", "AVG(COALESCE(score, 0))", "AVG(score, 0)", "AVG(score IS NULL)"], correctAnswer: "AVG(COALESCE(score, 0))" },
    { text: "COALESCE(a, b, c) returns…", options: ["all three values", "the first non-NULL argument", "the last argument", "the average"], correctAnswer: "the first non-NULL argument" },
    { text: "The divide-by-zero guard in `AVG(price * NULLIF(quantity, 0))` works because NULLIF…", options: ["returns 0 when quantity is 0", "returns NULL when quantity is 0", "errors on 0", "ignores price"], correctAnswer: "returns NULL when quantity is 0" },
  ],
  // ── W6 · Group By & Having Clauses ──────────────────────────────────────
  "GROUP BY: Aggregates per Bucket": [
    { text: "`SELECT city, COUNT(*) FROM customers GROUP BY city` gives…", options: ["one row for the whole table", "one row per city with its count", "one row per customer", "an error"], correctAnswer: "one row per city with its count" },
    { text: "What does the engine require of non-aggregate columns you SELECT?", options: ["be in WHERE", "appear in GROUP BY", "be text", "have a default"], correctAnswer: "appear in GROUP BY" },
    { text: "Why does `SELECT city, COUNT(*) FROM customers` without GROUP BY fail?", options: ["COUNT is invalid", "the engine cannot know which city to show with many rows", "city is reserved", "it is too slow"], correctAnswer: "the engine cannot know which city to show with many rows" },
    { text: "'Sales per month' is written as…", options: ["GROUP BY month + aggregates", "SELECT * FROM sales", "ORDER BY month", "DISTINCT month"], correctAnswer: "GROUP BY month + aggregates" },
  ],
  "HAVING vs WHERE": [
    { text: "WHERE filters…", options: ["groups after aggregation", "rows before grouping", "the ORDER BY", "the SELECT list"], correctAnswer: "rows before grouping" },
    { text: "`WHERE COUNT(*) > 5` fails because…", options: ["COUNT is spelled wrong", "aggregates are not allowed in WHERE — use HAVING", "WHERE cannot use numbers", "COUNT only works in SELECT"], correctAnswer: "aggregates are not allowed in WHERE — use HAVING" },
    { text: "The correct order in the pipeline is…", options: ["WHERE → GROUP BY → HAVING → ORDER BY → LIMIT", "HAVING → WHERE → GROUP BY", "ORDER BY → WHERE → GROUP BY", "GROUP BY → WHERE → HAVING"], correctAnswer: "WHERE → GROUP BY → HAVING → ORDER BY → LIMIT" },
    { text: "Pushing a condition into WHERE instead of HAVING is better because…", options: ["it is shorter", "indexes can skip rows before aggregation", "HAVING is invalid", "it is required"], correctAnswer: "indexes can skip rows before aggregation" },
  ],
  "Grouping by Multiple Columns": [
    { text: "Grouping by state then city produces…", options: ["one bucket per city, ignoring state", "nested buckets: state, then city within each", "an error", "a cartesian product"], correctAnswer: "nested buckets: state, then city within each" },
    { text: "You may GROUP BY more columns than you SELECT…", options: ["never", "yes, that is allowed", "only with HAVING", "only for text"], correctAnswer: "yes, that is allowed" },
    { text: "GROUP BY ROLLUP(state, city) adds…", options: ["a random row", "a subtotal row per state", "more cities", "a sort"], correctAnswer: "a subtotal row per state" },
    { text: "Grouping by a high-cardinality column like an order id…", options: ["yields one row per value — effectively no aggregation", "is ideal for reports", "fails", "is the same as a join"], correctAnswer: "yields one row per value — effectively no aggregation" },
  ],
  "Real-World: Monthly Revenue Report": [
    { text: "DATE_TRUNC('month', created_at) does what?", options: ["removes the day part, bucketing each timestamp into its month", "adds a month", "formats as text", "converts timezones"], correctAnswer: "removes the day part, bucketing each timestamp into its month" },
    { text: "In the revenue report, the WHERE clause first trims to the last 12 months so that…", options: ["the query is prettier", "the engine can use an index on created_at", "SUM is faster", "GROUP BY works"], correctAnswer: "the engine can use an index on created_at" },
    { text: "Top 3 products per month is done with…", options: ["LIMIT 3 in the same query", "ROW_NUMBER() OVER (PARTITION BY month ORDER BY total DESC) then filter rank <= 3", "a self join", "DISTINCT"], correctAnswer: "ROW_NUMBER() OVER (PARTITION BY month ORDER BY total DESC) then filter rank <= 3" },
    { text: "The same report skeleton changes into other reports by changing…", options: ["the server", "the bucket column (month → city → product)", "the database", "the index"], correctAnswer: "the bucket column (month → city → product)" },
  ],
  // ── W7 · SQL Joins (Inner, Left, Right) ─────────────────────────────────
  "INNER JOIN: Only the Matches": [
    { text: "INNER JOIN between orders and customers keeps…", options: ["every order even without a customer", "only rows matching on both sides", "every customer only", "the union of both"], correctAnswer: "only rows matching on both sides" },
    { text: "The ON clause in a join is…", options: ["a sorting rule", "a regular boolean join condition", "a LIMIT", "a type"], correctAnswer: "a regular boolean join condition" },
    { text: "An order with 3 items joined to the items table appears…", options: ["once", "3 times — a join can multiply rows", "0 times", "as NULL"], correctAnswer: "3 times — a join can multiply rows" },
    { text: "USING (customer_id) is shorthand when…", options: ["both tables share the same column name", "tables have no keys", "the join is self", "columns differ"], correctAnswer: "both tables share the same column name" },
  ],
  "LEFT JOIN: Keep Everything from One Side": [
    { text: "LEFT JOIN keeps…", options: ["only matched rows", "every left-table row, with NULLs for missing right matches", "every right-table row", "a single row"], correctAnswer: "every left-table row, with NULLs for missing right matches" },
    { text: "Customers with no orders show up in a LEFT JOIN with…", options: ["a zero in order_id", "NULL order columns", "a deleted marker", "an error"], correctAnswer: "NULL order columns" },
    { text: "Which join keeps unmatched rows from BOTH tables?", options: ["only matched rows", "all rows from both sides, matched or not", "only the left side", "only the right side"], correctAnswer: "all rows from both sides, matched or not" },
    { text: "RIGHT JOIN is rare because…", options: ["it is invalid", "you can flip the tables and use LEFT", "it is slow", "it drops data"], correctAnswer: "you can flip the tables and use LEFT" },
  ],
  "Self-Joins: A Table Joining Itself": [
    { text: "A self-join is needed when…", options: ["two tables share a name", "a row relates to another row in the same table", "there is one table only", "data is sorted"], correctAnswer: "a row relates to another row in the same table" },
    { text: "The employee-manager report uses…", options: ["two different aliases of the employees table", "a copy of the table", "three tables", "a view"], correctAnswer: "two different aliases of the employees table" },
    { text: "`LEFT JOIN employees m ON e.manager_id = m.id` — a manager-less employee shows…", options: ["NULL in the manager column", "a default manager", "an error", "a duplicate row"], correctAnswer: "NULL in the manager column" },
    { text: "Self-joins power…", options: ["org charts, categories-with-parent, and threads with replies", "only numeric reports", "no real features", "index creation"], correctAnswer: "org charts, categories-with-parent, and threads with replies" },
  ],
  "Choosing the Right Join": [
    { text: "The deciding question for INNER vs LEFT is…", options: ["which table is bigger", "should a row with no counterpart still appear?", "is the join fast", "how many columns"], correctAnswer: "should a row with no counterpart still appear?" },
    { text: "A CROSS JOIN produces…", options: ["every combination of left × right rows", "only matched rows", "an error", "one row"], correctAnswer: "every combination of left × right rows" },
    { text: "Reconciliation of two systems (what's in A, in B, in both) calls for…", options: ["INNER JOIN", "FULL OUTER JOIN", "CROSS JOIN", "a self join"], correctAnswer: "FULL OUTER JOIN" },
    { text: "Joining on the wrong column silently produces…", options: ["an error", "duplicated or missing rows with no warning", "a new table", "a rollback"], correctAnswer: "duplicated or missing rows with no warning" },
  ],
  // ── W8 · Subqueries & Nested Queries ────────────────────────────────────
  "Scalar Subqueries: One Value In": [
    { text: "A single-value subquery has to return…", options: ["many rows", "one row and one column", "a table", "an integer only"], correctAnswer: "one row and one column" },
    { text: "'Employees earning above average' is written as…", options: ["SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)", "SELECT name FROM employees WHERE salary > AVG(salary)", "a self join", "SELECT DISTINCT"], correctAnswer: "SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)" },
    { text: "If a scalar subquery returns zero rows, its value becomes…", options: ["0", "NULL", "an empty string", "an error"], correctAnswer: "NULL" },
    { text: "A scalar subquery returning more than one row causes…", options: ["the first row to win", "an error", "NULL", "a warning"], correctAnswer: "an error" },
  ],
  "IN Subqueries: Membership Tests": [
    { text: "`WHERE id IN (SELECT customer_id FROM orders …)` tests…", options: ["whether id is a member of the subquery's list", "whether id is the biggest", "whether the subquery is sorted", "the id type"], correctAnswer: "whether id is a member of the subquery's list" },
    { text: "Customers who ordered over ₹10k is an…", options: ["IN subquery or its JOIN twin", "ORDER BY", "INSERT", "a trigger"], correctAnswer: "IN subquery or its JOIN twin" },
    { text: "NOT IN is dangerous when the subquery can return…", options: ["duplicates", "a NULL", "negative numbers", "text"], correctAnswer: "a NULL" },
    { text: "When in doubt about NOT IN NULLs, prefer…", options: ["NOT EXISTS", "NOT LIKE", "NOT BETWEEN", "NOT NULL"], correctAnswer: "NOT EXISTS" },
  ],
  "Correlated Subqueries: Per-Row Evaluation": [
    { text: "A correlated subquery is re-run…", options: ["once per query", "once per outer row", "once per day", "never"], correctAnswer: "once per outer row" },
    { text: "The correlation happens when…", options: ["the inner query references the outer row (o.customer_id)", "the tables are big", "there is a JOIN", "an index exists"], correctAnswer: "the inner query references the outer row (o.customer_id)" },
    { text: "Correlated subqueries slow down as…", options: ["the outer table grows (per-row re-evaluation)", "the index shrinks", "the query is cached", "NULLs appear"], correctAnswer: "the outer table grows (per-row re-evaluation)" },
    { text: "For 'most expensive product per category', a faster sibling is…", options: ["a window function", "a scalar subquery", "a CROSS JOIN", "an INSERT"], correctAnswer: "a window function" },
  ],
  "EXISTS: 'Is There Any?'": [
    { text: "EXISTS(subquery) is TRUE when…", options: ["the subquery returns a number", "the subquery yields at least one row", "the subquery is sorted", "the subquery is large"], correctAnswer: "the subquery yields at least one row" },
    { text: "Why `SELECT 1` inside EXISTS?", options: ["it is required", "columns don't matter — only row existence", "it is faster to type", "it avoids NULLs"], correctAnswer: "columns don't matter — only row existence" },
    { text: "EXISTS stops scanning…", options: ["never", "the moment it finds one match", "after sorting", "when the table ends"], correctAnswer: "the moment it finds one match" },
    { text: "`WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)` finds…", options: ["customers with orders", "customers with no orders", "all customers", "an error"], correctAnswer: "customers with no orders" },
  ],
  // ── W9 · Database Design & Normalization ────────────────────────────────
  "Why Design the Schema Before Writing Queries": [
    { text: "Schema design begins by…", options: ["writing all queries", "listing entities and drawing relationships", "creating indexes", "seeding data"], correctAnswer: "listing entities and drawing relationships" },
    { text: "A fact stored in two places…", options: ["is convenient", "is duplication that will drift", "speeds reads", "is required for 3NF"], correctAnswer: "is duplication that will drift" },
    { text: "The two design heuristics are…", options: ["model facts once and ask what questions we'll ask", "store everything twice and use many tables", "always denormalize", "avoid keys"], correctAnswer: "model facts once and ask what questions we'll ask" },
    { text: "Schema debt is…", options: ["cheap to fix later", "the slowest-moving debt there is", "a myth", "only a testing issue"], correctAnswer: "the slowest-moving debt there is" },
  ],
  "First Normal Form (1NF): Atomic Values": [
    { text: "1NF requires…", options: ["single atomic values per column and a primary key", "no foreign keys", "at least 3 tables", "composite keys only"], correctAnswer: "single atomic values per column and a primary key" },
    { text: "A 'math,physics' cell violates…", options: ["1NF", "ACID", "a primary key", "nothing"], correctAnswer: "1NF" },
    { text: "The 1NF fix for a list-in-one-cell column is…", options: ["a wider cell", "a child or junction table with one row per value", "splitting in app code forever", "deleting the values"], correctAnswer: "a child or junction table with one row per value" },
    { text: "A list hiding in a column makes it impossible to…", options: ["index or count correctly", "store text", "name the table", "insert rows"], correctAnswer: "index or count correctly" },
  ],
  "Second Normal Form (2NF): No Partial Dependencies": [
    { text: "2NF applies when…", options: ["a table has a composite primary key", "a table has one key", "there are no keys", "the table is text-only"], correctAnswer: "a table has a composite primary key" },
    { text: "In enrollments(student_id, course_id, course_name, grade), course_name…", options: ["depends on the whole key", "depends only on course_id — a partial dependency", "is the primary key", "is a foreign key"], correctAnswer: "depends only on course_id — a partial dependency" },
    { text: "The 2NF rule in one line:…", options: ["every non-key column must describe the whole row's identity", "columns must be short", "keys must be integers", "all columns can be NULL"], correctAnswer: "every non-key column must describe the whole row's identity" },
    { text: "The 2NF fix for course_name is…", options: ["delete it", "move it to a courses table keyed by course_id", "copy it everywhere", "make it an index"], correctAnswer: "move it to a courses table keyed by course_id" },
  ],
  "Third Normal Form (3NF): No Transitive Dependencies": [
    { text: "Third normal form gets rid of…", options: ["duplicate keys", "transitive dependencies — a column depending on another non-key column", "all foreign keys", "composite keys"], correctAnswer: "transitive dependencies — a column depending on another non-key column" },
    { text: "employees(id, dept_id, dept_location): dept_location depends on…", options: ["the employee id", "dept_id, not on the employee — a transitive dependency", "nothing", "the primary key"], correctAnswer: "dept_id, not on the employee — a transitive dependency" },
    { text: "The practical target for most systems is…", options: ["1NF, 2NF and 3NF", "5NF always", "no normalization", "only 1NF"], correctAnswer: "1NF, 2NF and 3NF" },
    { text: "Moving a department's location to its own table fixes…", options: ["update anomalies when the department relocates", "slow queries", "the primary key", "nothing"], correctAnswer: "update anomalies when the department relocates" },
  ],
  // ── W10 · Table Creation & Altering ─────────────────────────────────────
  "CREATE TABLE & Choosing Data Types": [
    { text: "Which type is best for an exact decimal like money?", options: ["FLOAT", "NUMERIC(p,s)", "TEXT", "BOOLEAN"], correctAnswer: "NUMERIC(p,s)" },
    { text: "A phone number should be stored as…", options: ["INTEGER", "TEXT", "BIGINT", "NUMERIC"], correctAnswer: "TEXT" },
    { text: "Store timestamps in…", options: ["local time only", "TIMESTAMPTZ, always UTC", "VARCHAR", "INTEGER"], correctAnswer: "TIMESTAMPTZ, always UTC" },
    { text: "CHECK (price >= 0) in the schema means…", options: ["the app checks it", "the database rejects negative prices for every insert", "negative prices are stored as 0", "nothing"], correctAnswer: "the database rejects negative prices for every insert" },
  ],
  "Column Constraints: NOT NULL, UNIQUE, CHECK, DEFAULT": [
    { text: "A UNIQUE column may contain…", options: ["duplicates", "multiple NULLs", "no NULLs", "only integers"], correctAnswer: "multiple NULLs" },
    { text: "DEFAULT now() sets…", options: ["a fixed date", "the current timestamp when the column is omitted on insert", "a random value", "the primary key"], correctAnswer: "the current timestamp when the column is omitted on insert" },
    { text: "PRIMARY KEY is…", options: ["UNIQUE + NOT NULL, one per table", "just an index", "optional everywhere", "a CHECK"], correctAnswer: "UNIQUE + NOT NULL, one per table" },
    { text: "Why prefer DB constraints over app-side checks?", options: ["they are prettier", "they protect the last gate for every entry point, even buggy ones", "they are faster to write", "they replace indexes"], correctAnswer: "they protect the last gate for every entry point, even buggy ones" },
  ],
  "ALTER TABLE: Evolving the Schema": [
    { text: "Which command evolves the schema without dropping data?", options: ["query rows", "evolve the schema without dropping data", "insert rows", "run transactions"], correctAnswer: "evolve the schema without dropping data" },
    { text: "Adding a column with a DEFAULT in Postgres is…", options: ["instant (metadata only)", "always a full rewrite", "impossible", "destructive"], correctAnswer: "instant (metadata only)" },
    { text: "Changing a column type on a big table…", options: ["is always safe", "rewrites the table and can lock it — do it in a maintenance window", "is instant", "is forbidden"], correctAnswer: "rewrites the table and can lock it — do it in a maintenance window" },
    { text: "Versioned schema changes are called…", options: ["migrations", "backups", "triggers", "views"], correctAnswer: "migrations" },
  ],
  "DROP, TRUNCATE & DELETE: Removing Data": [
    { text: "DROP TABLE…", options: ["deletes some rows", "destroys the table and its definition", "renames the table", "adds a column"], correctAnswer: "destroys the table and its definition" },
    { text: "TRUNCATE…", options: ["filters with WHERE", "deletes all rows instantly, can't filter, skips row-by-row logging", "is transactional", "is the same as DELETE"], correctAnswer: "deletes all rows instantly, can't filter, skips row-by-row logging" },
    { text: "The safe choice for selective removal is…", options: ["TRUNCATE", "DELETE FROM … WHERE (transactional)", "DROP TABLE", "VACUUM"], correctAnswer: "DELETE FROM … WHERE (transactional)" },
    { text: "Before bulk removal, always…", options: ["count the rows and verify a backup", "restart the server", "drop an index", "disable the app"], correctAnswer: "count the rows and verify a backup" },
  ],
  // ── W11 · Inserting & Updating Data ─────────────────────────────────────
  "INSERT: Adding Rows": [
    { text: "`INSERT INTO t (cols) VALUES (...), (...)` inserts…", options: ["one row", "multiple rows", "a query result", "a table"], correctAnswer: "multiple rows" },
    { text: "Columns omitted from the INSERT list get…", options: ["an error", "their DEFAULT (NULL if none)", "the first row's value", "a random value"], correctAnswer: "their DEFAULT (NULL if none)" },
    { text: "RETURNING id is used to…", options: ["skip the insert", "get the new id for a child row without a second query", "sort the result", "delete the row"], correctAnswer: "get the new id for a child row without a second query" },
    { text: "For bulk loads, one-by-one inserts are slow because…", options: ["they round-trip to the server per row", "the database is broken", "INSERT is forbidden", "of the index only"], correctAnswer: "they round-trip to the server per row" },
  ],
  "UPDATE: Changing Rows": [
    { text: "An UPDATE without WHERE…", options: ["fails", "updates every row", "updates the first row", "creates rows"], correctAnswer: "updates every row" },
    { text: "The expression `stock = stock - 5` in an UPDATE…", options: ["sets stock to -5", "decrements the existing value", "resets stock to 5", "errors"], correctAnswer: "decrements the existing value" },
    { text: "UPDATEs lock rows…", options: ["forever", "until the transaction commits", "never", "for a millisecond"], correctAnswer: "until the transaction commits" },
    { text: "The safety habit before a bulk UPDATE is…", options: ["SELECT the target rows with the same WHERE first", "restart the DB", "drop the index", "disable triggers"], correctAnswer: "SELECT the target rows with the same WHERE first" },
  ],
  "DELETE: Removing Rows": [
    { text: "DELETE removes…", options: ["all rows always", "rows matching a WHERE clause", "the table definition", "an index"], correctAnswer: "rows matching a WHERE clause" },
    { text: "Which delete rule refuses to delete a parent that still has children?", options: ["ON DELETE CASCADE", "ON DELETE RESTRICT", "ON DELETE SET NULL", "NOT NULL"], correctAnswer: "ON DELETE RESTRICT" },
    { text: "Batched deletes (LIMIT loops) keep…", options: ["the table empty", "locks small on huge tables", "data in memory", "indexes unbuilt"], correctAnswer: "locks small on huge tables" },
    { text: "A soft delete keeps rows for…", options: ["nothing", "recoverability and analytics history", "disk space", "faster queries"], correctAnswer: "recoverability and analytics history" },
  ],
  "Upsert: ON CONFLICT": [
    { text: "An upsert means…", options: ["insert or update in one statement", "delete then insert", "only insert", "only update"], correctAnswer: "insert or update in one statement" },
    { text: "ON CONFLICT (email) needs…", options: ["a CHECK", "a UNIQUE or PRIMARY KEY on email", "a trigger", "an index"], correctAnswer: "a UNIQUE or PRIMARY KEY on email" },
    { text: "In `DO UPDATE`, the incoming value is referenced as…", options: ["existing", "excluded", "new", "incoming"], correctAnswer: "excluded" },
    { text: "ON CONFLICT beats SELECT-then-INSERT because…", options: ["it is atomic — no race window", "it is more readable", "it needs no key", "it is faster to type"], correctAnswer: "it is atomic — no race window" },
  ],
  // ── W12 · Indexes & Performance ─────────────────────────────────────────
  "What Is an Index & How It Works": [
    { text: "An index is like…", options: ["a book's index — jump to matches without reading everything", "a backup", "a second table of duplicates", "a trigger"], correctAnswer: "a book's index — jump to matches without reading everything" },
    { text: "The price of an index is paid on…", options: ["SELECTs", "writes, because the index must be maintained", "nothing", "reads"], correctAnswer: "writes, because the index must be maintained" },
    { text: "Which columns deserve an index?", options: ["every column", "columns you filter, join, and sort on", "no columns", "only text"], correctAnswer: "columns you filter, join, and sort on" },
    { text: "A PRIMARY KEY and UNIQUE constraint…", options: ["cannot exist with an index", "create indexes automatically", "replace all indexes", "slow reads"], correctAnswer: "create indexes automatically" },
  ],
  "Composite Indexes: Column Order Matters": [
    { text: "A composite index on (customer_id, created_at) helps…", options: ["WHERE created_at > … alone", "WHERE customer_id = 5 AND created_at > …", "any WHERE", "ORDER BY total"], correctAnswer: "WHERE customer_id = 5 AND created_at > …" },
    { text: "The index (a, b) does NOT help…", options: ["WHERE a = 1", "WHERE b = 2 alone", "WHERE a = 1 AND b = 2", "ORDER BY a"], correctAnswer: "WHERE b = 2 alone" },
    { text: "Order composite index columns…", options: ["alphabetically", "by how they appear in queries, most-used first", "by length", "randomly"], correctAnswer: "by how they appear in queries, most-used first" },
    { text: "A composite index can also serve…", options: ["an ORDER BY matching its columns (no separate sort)", "only WHERE", "INSERTs", "DROP"], correctAnswer: "an ORDER BY matching its columns (no separate sort)" },
  ],
  "Index Pitfalls: Functions, Leading Wildcards, Low Selectivity": [
    { text: "`WHERE LOWER(email) = 'x'` bypasses a normal index because…", options: ["the function hides the stored value from the index", "LOWER is forbidden", "emails are too long", "it returns NULL"], correctAnswer: "the function hides the stored value from the index" },
    { text: "The fix for case-insensitive indexed lookups is…", options: ["an expression index on LOWER(email)", "more RAM", "a bigger column", "a trigger"], correctAnswer: "an expression index on LOWER(email)" },
    { text: "Which LIKE cannot use a normal B-tree index?", options: ["'abc%'", "'%abc'", "'a%'", "a = 'abc'"], correctAnswer: "'%abc'" },
    { text: "Indexing a column with only 3 distinct values is…", options: ["ideal", "low value — the planner may ignore it", "required", "an error"], correctAnswer: "low value — the planner may ignore it" },
  ],
  "EXPLAIN & Reading Query Plans": [
    { text: "EXPLAIN ANALYZE…", options: ["only estimates", "runs the query and reports real timings and rows", "creates an index", "is faster than EXPLAIN"], correctAnswer: "runs the query and reports real timings and rows" },
    { text: "A Seq Scan on a big table usually means…", options: ["the query is perfect", "an index is missing or unused", "a syntax error", "the table is cached"], correctAnswer: "an index is missing or unused" },
    { text: "'actual rows differ wildly from rows=' means…", options: ["the planner's statistics are stale — run ANALYZE", "a bug in the server", "the query is wrong", "an index is broken"], correctAnswer: "the planner's statistics are stale — run ANALYZE" },
    { text: "Run the ANALYZE command after…", options: ["every query", "big data loads, to refresh planner statistics", "creating a view", "a rollback"], correctAnswer: "big data loads, to refresh planner statistics" },
  ],
  // ── W13 · Views & Stored Procedures ─────────────────────────────────────
  "Views: Saved Queries as Tables": [
    { text: "Underneath a view there is…", options: ["a copy of the rows", "the query definition, run live on access", "an index", "a backup"], correctAnswer: "the query definition, run live on access" },
    { text: "Querying a view always shows…", options: ["stale data", "current rows of the underlying tables", "only NULLs", "a snapshot"], correctAnswer: "current rows of the underlying tables" },
    { text: "A view can improve security by…", options: ["hiding the table", "exposing only safe columns while hiding the raw table", "deleting data", "blocking writes forever"], correctAnswer: "exposing only safe columns while hiding the raw table" },
    { text: "Views don't change performance because…", options: ["they are always slower", "the optimizer unfolds them into the underlying query", "they cache results", "they bypass indexes"], correctAnswer: "the optimizer unfolds them into the underlying query" },
  ],
  "Materialized Views: Snapshots": [
    { text: "A materialized view…", options: ["is a live query", "stores the result on disk and can go stale", "cannot be queried", "is an index"], correctAnswer: "stores the result on disk and can go stale" },
    { text: "Use a materialized view when…", options: ["the query must always be live", "the query is slow and slight staleness is acceptable", "the table is tiny", "you need to write data"], correctAnswer: "the query is slow and slight staleness is acceptable" },
    { text: "To bring a materialized view up to date, you…", options: ["drop it", "REFRESH it", "recreate the table", "restart the DB"], correctAnswer: "REFRESH it" },
    { text: "REFRESH MATERIALIZED VIEW CONCURRENTLY…", options: ["locks all reads", "refreshes without locking reads (needs a unique index)", "is always slower", "is invalid"], correctAnswer: "refreshes without locking reads (needs a unique index)" },
  ],
  "Stored Procedures & Functions": [
    { text: "A stored function is…", options: ["client-side logic", "logic saved inside the database, callable by name", "a special table", "a query plan"], correctAnswer: "logic saved inside the database, callable by name" },
    { text: "A pro of DB-side logic is…", options: ["one copy, runs near the data, no round-trips", "it is unversioned", "it is hard to test", "it duplicates code"], correctAnswer: "one copy, runs near the data, no round-trips" },
    { text: "A con of DB-side logic is…", options: ["it is too fast", "harder versioning/testing, and row-by-row loops are a performance trap", "it is public", "it is broken"], correctAnswer: "harder versioning/testing, and row-by-row loops are a performance trap" },
    { text: "Modern practice puts heavy logic in…", options: ["the app where it is testable, reserving DB functions for data-centric rules", "the frontend", "nowhere", "the schema"], correctAnswer: "the app where it is testable, reserving DB functions for data-centric rules" },
  ],
  "Triggers: Reactions to Changes": [
    { text: "A trigger runs automatically on…", options: ["SELECT", "INSERT/UPDATE/DELETE of a table", "EXPLAIN", "a restart"], correctAnswer: "INSERT/UPDATE/DELETE of a table" },
    { text: "A classic trigger use is…", options: ["audit logging who changed what", "sorting results", "creating indexes", "backing up"], correctAnswer: "audit logging who changed what" },
    { text: "A trigger error causes…", options: ["the statement to continue", "the whole triggering statement to roll back", "a warning only", "a reboot"], correctAnswer: "the whole triggering statement to roll back" },
    { text: "Runaway or broken triggers…", options: ["make writes slow or fail mysteriously", "are harmless", "speed up queries", "are invisible"], correctAnswer: "make writes slow or fail mysteriously" },
  ],
  // ── W14 · Transactions & ACID Properties ────────────────────────────────
  "BEGIN, COMMIT & ROLLBACK": [
    { text: "A single SQL statement…", options: ["is never a transaction", "is already its own transaction", "cannot roll back", "locks the whole DB"], correctAnswer: "is already its own transaction" },
    { text: "During an open transaction, other connections…", options: ["see the new data immediately", "see the old committed state", "are blocked completely", "can't connect"], correctAnswer: "see the old committed state" },
    { text: "An abandoned open transaction…", options: ["closes itself instantly", "holds locks until it times out or aborts", "is harmless", "deletes data"], correctAnswer: "holds locks until it times out or aborts" },
    { text: "Never put inside a transaction's span…", options: ["a quick UPDATE", "a network call or await waiting on user input", "a SELECT", "a WHERE"], correctAnswer: "a network call or await waiting on user input" },
  ],
  "Atomicity & Consistency": [
    { text: "Atomicity is implemented with…", options: ["a write-ahead log that recovery replays or undoes", "more memory", "faster CPUs", "an index"], correctAnswer: "a write-ahead log that recovery replays or undoes" },
    { text: "Consistency means…", options: ["the database only moves between valid states; constraints are enforced at commit", "rows are always sorted", "queries are fast", "the schema never changes"], correctAnswer: "the database only moves between valid states; constraints are enforced at commit" },
    { text: "A transaction that would violate a CHECK is…", options: ["silently accepted", "rejected at commit", "fixed automatically", "logged only"], correctAnswer: "rejected at commit" },
    { text: "A rule stated as a constraint is enforced…", options: ["only by the app", "for every transaction on every path", "never", "weekly"], correctAnswer: "for every transaction on every path" },
  ],
  "Isolation Levels & the Dirty-Read Problem": [
    { text: "Reading a row another transaction modified but hasn't committed is called…", options: ["reading committed data", "reading another transaction's uncommitted changes", "reading NULL", "a duplicate"], correctAnswer: "reading another transaction's uncommitted changes" },
    { text: "Which isolation level does Postgres use by default?", options: ["SERIALIZABLE", "READ COMMITTED", "READ UNCOMMITTED", "REPEATABLE READ"], correctAnswer: "READ COMMITTED" },
    { text: "REPEATABLE READ gives…", options: ["a consistent snapshot for the whole transaction", "no snapshot", "only statement snapshots", "dirty reads"], correctAnswer: "a consistent snapshot for the whole transaction" },
    { text: "Under SERIALIZABLE, a conflict causes…", options: ["a silent wrong answer", "one transaction to fail with 'could not serialize' — retry it", "both to commit", "a deadlock forever"], correctAnswer: "one transaction to fail with 'could not serialize' — retry it" },
  ],
  "Durability & Locks": [
    { text: "Durability is achieved by…", options: ["the write-ahead log written to disk before commit returns", "caching", "indexes", "faster disks"], correctAnswer: "the write-ahead log written to disk before commit returns" },
    { text: "A row being updated is locked…", options: ["forever", "until the transaction ends", "never", "for a nanosecond"], correctAnswer: "until the transaction ends" },
    { text: "A concurrent UPDATE on the same row…", options: ["fails immediately", "blocks until the first transaction commits", "overwrites", "duplicates"], correctAnswer: "blocks until the first transaction commits" },
    { text: "The engine resolves deadlock by…", options: ["restarting", "aborting one transaction so the app can retry", "dropping the table", "ignoring it"], correctAnswer: "aborting one transaction so the app can retry" },
  ],
  // ── W15 · Database Security Basics ──────────────────────────────────────
  "SQL Injection: The #1 Database Attack": [
    { text: "SQL injection exploits…", options: ["user input concatenated into SQL changing the query's meaning", "weak passwords", "missing indexes", "slow disks"], correctAnswer: "user input concatenated into SQL changing the query's meaning" },
    { text: "`' OR 1=1 --` in a login bypasses the password check because…", options: ["OR 1=1 matches every row and -- comments out the rest", "it is a strong password", "the database crashes", "it is uppercase"], correctAnswer: "OR 1=1 matches every row and -- comments out the rest" },
    { text: "The prevention is…", options: ["escaping quotes by hand", "parameterized queries — never concatenating user input into SQL", "renaming columns", "using VARCHAR"], correctAnswer: "parameterized queries — never concatenating user input into SQL" },
    { text: "UNION-based injection can…", options: ["read other tables or add rows", "only crash", "speed the server", "fix indexes"], correctAnswer: "read other tables or add rows" },
  ],
  "Parameterized Queries & Prepared Statements": [
    { text: "With a parameterized query, user input…", options: ["becomes part of the SQL text", "is bound as a literal after parsing, so it can't become syntax", "is base64", "is ignored"], correctAnswer: "is bound as a literal after parsing, so it can't become syntax" },
    { text: "In node-postgres, placeholders look like…", options: ["?", "$1, $2", "%s", "{0}"], correctAnswer: "$1, $2" },
    { text: "Frameworks like Prisma parameterize…", options: ["never", "by default when you use their builders", "only in raw SQL", "only on Mondays"], correctAnswer: "by default when you use their builders" },
    { text: "A prepared statement also gives…", options: ["a small performance win from parse-once reuse", "worse security", "SQL injection", "a new table"], correctAnswer: "a small performance win from parse-once reuse" },
  ],
  "Privileges: Least Privilege & GRANT/REVOKE": [
    { text: "Least privilege means…", options: ["everyone gets SELECT", "each role gets only the rights it needs", "the app runs as superuser", "nobody can write"], correctAnswer: "each role gets only the rights it needs" },
    { text: "A read-only reporting role gets…", options: ["SELECT only", "everything", "DROP", "superuser"], correctAnswer: "SELECT only" },
    { text: "Running the app as the postgres superuser…", options: ["is best practice", "makes any SQL bug a full database takeover", "is required", "is faster"], correctAnswer: "makes any SQL bug a full database takeover" },
    { text: "GRANT and REVOKE control…", options: ["query speed", "who can do what on objects", "indexes", "backups"], correctAnswer: "who can do what on objects" },
  ],
  "Backups, Encryption & Sensitive Data": [
    { text: "The logical backup command in PostgreSQL is…", options: ["pg_dump", "cp", "save", "export"], correctAnswer: "pg_dump" },
    { text: "A backup you have never restored is…", options: ["as good as none", "a guess — test restores regularly", "better than nothing", "the same as no backup"], correctAnswer: "a guess — test restores regularly" },
    { text: "Payment details belong…", options: ["in your database in plaintext", "with a compliant provider like Stripe/Razorpay", "in your source code", "in logs"], correctAnswer: "with a compliant provider like Stripe/Razorpay" },
    { text: "The 3-2-1 rule means…", options: ["three copies, two media types, one offsite", "three backups a day", "two databases", "one copy, one tape"], correctAnswer: "three copies, two media types, one offsite" },
  ],
  // ── W16 · Connecting SQL to Python/Node ─────────────────────────────────
  "Connecting from Node with node-postgres": [
    { text: "In node-postgres, `Pool` is used to…", options: ["run one query", "manage a set of warm connections", "create tables", "back up data"], correctAnswer: "manage a set of warm connections" },
    { text: "The result of pool.query() gives you…", options: ["rows (array of objects) and rowCount", "a JSON string", "a file", "a table"], correctAnswer: "rows (array of objects) and rowCount" },
    { text: "Hardcoding a DB credential in source is bad; instead read it from…", options: ["hardcoded source", "an environment variable, kept out of git", "a public file", "the frontend"], correctAnswer: "an environment variable, kept out of git" },
    { text: "Opening a Postgres connection per request is…", options: ["ideal", "expensive — the pool avoids it", "impossible", "required"], correctAnswer: "expensive — the pool avoids it" },
  ],
  "Connecting from Python with psycopg2": [
    { text: "psycopg2 placeholders look like…", options: ["?", "$1", "%s", "{0}"], correctAnswer: "%s" },
    { text: "In psycopg2, a write is invisible until you…", options: ["call conn.commit()", "close Python", "run a SELECT", "restart"], correctAnswer: "call conn.commit()" },
    { text: "The 'my Python script inserts nothing' bug is usually…", options: ["a missing conn.commit()", "a wrong password", "a full disk", "an index"], correctAnswer: "a missing conn.commit()" },
    { text: "`pd.read_sql(query, conn)` in pandas…", options: ["fails", "loads a SQL result into a DataFrame", "writes rows", "creates an index"], correctAnswer: "loads a SQL result into a DataFrame" },
  ],
  "Connection Pooling: Don't Open a Connection per Request": [
    { text: "Pooling keeps…", options: ["one connection", "a handful of warm connections that requests borrow and return", "no connections", "unlimited connections"], correctAnswer: "a handful of warm connections that requests borrow and return" },
    { text: "PgBouncer is…", options: ["a query language", "a dedicated connection pooler in front of Postgres", "an ORM", "a backup tool"], correctAnswer: "a dedicated connection pooler in front of Postgres" },
    { text: "A leaked connection eventually…", options: ["exhausts the pool and hangs the app", "is harmless", "speeds queries", "creates a new table"], correctAnswer: "exhausts the pool and hangs the app" },
    { text: "To guarantee a connection returns to the pool, use…", options: ["try/finally or the driver's wrapper", "nothing", "a restart", "a longer timeout"], correctAnswer: "try/finally or the driver's wrapper" },
  ],
  "ORMs & Prisma: SQL Without Hand-Written Strings": [
    { text: "An ORM turns…", options: ["tables into typed objects and writes SQL for you", "SQL into assembly", "indexes into tables", "queries into files"], correctAnswer: "tables into typed objects and writes SQL for you" },
    { text: "A Prisma win is…", options: ["type safety and parameterized queries by default", "raw SQL strings everywhere", "no migrations", "SQL injection"], correctAnswer: "type safety and parameterized queries by default" },
    { text: "For complex analytics, Prisma offers…", options: ["nothing", "$queryRaw for raw SQL when needed", "a spreadsheet", "a backup"], correctAnswer: "$queryRaw for raw SQL when needed" },
    { text: "The mature approach is…", options: ["ORM for CRUD, raw parameterized SQL for the hard 10%", "only raw SQL", "only the ORM", "no database"], correctAnswer: "ORM for CRUD, raw parameterized SQL for the hard 10%" },
  ],
  // ── W17 · Mini-Project: Library System Database ─────────────────────────
  "Requirements & Entities for a Library": [
    { text: "A book written by several authors needs…", options: ["a book_authors junction table", "one author per book", "a copy of the author", "a trigger"], correctAnswer: "a book_authors junction table" },
    { text: "A loan's shape is…", options: ["book_id, member_id, borrowed_on, due_on, returned_on", "just a date", "a copy of the book", "a report"], correctAnswer: "book_id, member_id, borrowed_on, due_on, returned_on" },
    { text: "The relationship a loan has to books and members is…", options: ["two one-to-many relationships from loans", "many-to-many on both", "one-to-one", "none"], correctAnswer: "two one-to-many relationships from loans" },
    { text: "Writing requirements before SQL…", options: ["separates design from scrambling", "is optional", "slows everything", "is only for big teams"], correctAnswer: "separates design from scrambling" },
  ],
  "Building Tables with Correct Constraints": [
    { text: "`isbn text unique` guarantees…", options: ["no two books share an ISBN", "ISBNs are numbers", "faster reads", "auto-increment"], correctAnswer: "no two books share an ISBN" },
    { text: "`due_on date default (current_date + 14)` means…", options: ["the due date is always today", "new loans get a 14-day due date automatically", "loans have no due date", "an error"], correctAnswer: "new loans get a 14-day due date automatically" },
    { text: "The FK on loans.member_id prevents…", options: ["duplicate loans", "a loan for a non-existent member", "overdue books", "NULLs in book_id"], correctAnswer: "a loan for a non-existent member" },
    { text: "`CHECK (returned_on IS NULL OR returned_on >= borrowed_on)` rejects…", options: ["loans returned before they were borrowed", "overdue loans", "new loans", "duplicate loans"], correctAnswer: "loans returned before they were borrowed" },
  ],
  "Seeding Data & the Queries That Run the Library": [
    { text: "Seed data is used to…", options: ["make the schema testable with realistic rows", "replace the schema", "drop tables", "create indexes"], correctAnswer: "make the schema testable with realistic rows" },
    { text: "'Books by author' needs…", options: ["a join through book_authors", "a single table", "a trigger", "a backup"], correctAnswer: "a join through book_authors" },
    { text: "The currently-borrowed report filters on…", options: ["returned_on IS NULL", "returned_on IS NOT NULL", "due_on = today", "book_id = 0"], correctAnswer: "returned_on IS NULL" },
    { text: "The most-borrowed-books query is…", options: ["GROUP BY title + COUNT + ORDER BY DESC LIMIT 5", "SELECT *", "a self join", "INSERT"], correctAnswer: "GROUP BY title + COUNT + ORDER BY DESC LIMIT 5" },
  ],
  "Testing Your Schema with Real Queries": [
    { text: "A negative test proves…", options: ["the database refuses bad data (FK, UNIQUE, CHECK)", "queries run", "indexes exist", "backups work"], correctAnswer: "the database refuses bad data (FK, UNIQUE, CHECK)" },
    { text: "Deleting an author referenced by book_authors fails under…", options: ["ON DELETE RESTRICT", "ON DELETE CASCADE", "SET NULL", "NOT NULL"], correctAnswer: "ON DELETE RESTRICT" },
    { text: "'Books never borrowed' uses…", options: ["LEFT JOIN … WHERE loan.id IS NULL", "INNER JOIN", "DISTINCT", "a trigger"], correctAnswer: "LEFT JOIN … WHERE loan.id IS NULL" },
    { text: "If an intended query is painful, the culprit is usually…", options: ["the schema, not the query", "the server", "the index", "the backup"], correctAnswer: "the schema, not the query" },
  ],
  // ── W18 · Schema Design Polish ──────────────────────────────────────────
  "Design Review: Reading a Schema Like a Reviewer": [
    { text: "An int FK pointing at a bigint PK…", options: ["breaks the join with a type mismatch", "is fine", "is faster", "creates an index"], correctAnswer: "breaks the join with a type mismatch" },
    { text: "Conventional naming uses…", options: ["plural tables, snake_case columns, id for PK, table_id for FK", "uppercase everything", "random letters", "numbers only"], correctAnswer: "plural tables, snake_case columns, id for PK, table_id for FK" },
    { text: "Every nullable column is…", options: ["a decision to examine", "an error", "required", "an index"], correctAnswer: "a decision to examine" },
    { text: "Review a schema…", options: ["before building features on it", "after launch only", "never", "in production"], correctAnswer: "before building features on it" },
  ],
  "UNIQUE, CHECK & Exclusion Constraints": [
    { text: "A UNIQUE on (owner_id, name) allows…", options: ["each owner's items to have unique names, but other owners can reuse them", "no names at all", "duplicates", "only one row total"], correctAnswer: "each owner's items to have unique names, but other owners can reuse them" },
    { text: "`CHECK (status IN ('draft','paid','cancelled'))`…", options: ["turns an app enum into a database-enforced contract", "is decorative", "replaces the app", "slows writes"], correctAnswer: "turns an app enum into a database-enforced contract" },
    { text: "Preventing double-booked rooms needs…", options: ["an EXCLUDE constraint on the time range", "a UNIQUE on room_id", "a CHECK", "a trigger"], correctAnswer: "an EXCLUDE constraint on the time range" },
    { text: "UNIQUE auto-creates…", options: ["an index", "a trigger", "a view", "a backup"], correctAnswer: "an index" },
  ],
  "Migrations: Versioned Schema Change": [
    { text: "Versioned, ordered schema changes are called…", options: ["a random SQL edit", "a versioned, ordered schema change applied once per environment", "a backup", "an index"], correctAnswer: "a versioned, ordered schema change applied once per environment" },
    { text: "Prisma Migrate generates migrations from…", options: ["schema.prisma", "raw logs", "the frontend", "a backup"], correctAnswer: "schema.prisma" },
    { text: "Never…", options: ["write a new migration", "edit a migration that already ran", "review migrations", "test migrations"], correctAnswer: "edit a migration that already ran" },
    { text: "'Works on my machine, fails in prod' is often…", options: ["schema drift — cured by versioned migrations", "a network issue", "a hardware issue", "nothing"], correctAnswer: "schema drift — cured by versioned migrations" },
  ],
  "Handling Schema Changes Safely": [
    { text: "The safest DDL is…", options: ["small, additive, and backed by a backup", "a big rewrite", "a drop and recreate", "random"], correctAnswer: "small, additive, and backed by a backup" },
    { text: "Adding NOT NULL to a big populated column requires…", options: ["add nullable → backfill → add NOT NULL", "drop the column", "rename the table", "a new table"], correctAnswer: "add nullable → backfill → add NOT NULL" },
    { text: "CREATE INDEX CONCURRENTLY…", options: ["builds the index without blocking writes", "locks the table", "is invalid", "drops indexes"], correctAnswer: "builds the index without blocking writes" },
    { text: "Before dropping a column…", options: ["confirm nothing reads it (grep, views, procedures)", "just drop it", "restart first", "disable the DB"], correctAnswer: "confirm nothing reads it (grep, views, procedures)" },
  ],
  // ── W19 · Query Optimizations ───────────────────────────────────────────
  "Finding Slow Queries First": [
    { text: "pg_stat_statements tracks…", options: ["cumulative time per query — your real hot spots", "index sizes", "table counts", "backups"], correctAnswer: "cumulative time per query — your real hot spots" },
    { text: "A loop that fires one query per row is the…", options: ["an ORM loop that runs one query per row", "too many indexes", "a syntax error", "a slow disk"], correctAnswer: "an ORM loop that runs one query per row" },
    { text: "The N+1 fix is…", options: ["preloading/include or a JOIN instead of the loop", "more RAM", "a faster CPU", "nothing"], correctAnswer: "preloading/include or a JOIN instead of the loop" },
    { text: "Measure before and after because…", options: ["unmeasured 'it feels faster' doesn't survive review", "it is required", "the DB logs it", "queries need it"], correctAnswer: "unmeasured 'it feels faster' doesn't survive review" },
  ],
  "Index Strategy: Index What You Actually Query": [
    { text: "Index strategy starts from…", options: ["the hot queries in pg_stat_statements", "guessing", "indexing everything", "the frontend"], correctAnswer: "the hot queries in pg_stat_statements" },
    { text: "To find unused indexes, check…", options: ["pg_stat_user_indexes for low idx_scan counts", "the schema file", "the frontend", "the backup log"], correctAnswer: "pg_stat_user_indexes for low idx_scan counts" },
    { text: "The feedback loop for index tuning is…", options: ["EXPLAIN before and after creating the index", "trial and error forever", "the app UI", "a restart"], correctAnswer: "EXPLAIN before and after creating the index" },
    { text: "Every index you add…", options: ["slows writes slightly — make each one earn its keep", "speeds writes", "is free", "is permanent"], correctAnswer: "slows writes slightly — make each one earn its keep" },
  ],
  "Rewriting Queries: Less Data, Fewer Round-Trips": [
    { text: "`SELECT *` on a wide table…", options: ["ships columns the query never uses", "is best practice", "is fastest", "is required"], correctAnswer: "ships columns the query never uses" },
    { text: "Filter before you join lets…", options: ["the planner shrink the join input", "the query fail", "the index break", "nothing"], correctAnswer: "the planner shrink the join input" },
    { text: "The 1000-tiny-queries loop should become…", options: ["one IN (...) query", "a bigger loop", "a cron", "a trigger"], correctAnswer: "one IN (...) query" },
    { text: "Set-based thinking means…", options: ["do the work on all rows at once, not row by row", "use smaller tables", "avoid WHERE", "use loops"], correctAnswer: "do the work on all rows at once, not row by row" },
  ],
  "Caching & When to Give Up on a Query": [
    { text: "Cache data that…", options: ["changes rarely and is read often", "changes every second", "is huge", "is sensitive"], correctAnswer: "changes rarely and is read often" },
    { text: "Without invalidation, a cache will…", options: ["serves stale data forever", "is always correct", "is impossible", "speeds writes"], correctAnswer: "serves stale data forever" },
    { text: "Cache-aside means…", options: ["read cache, miss → query → write cache with a TTL", "only write to cache", "never use the DB", "drop the cache"], correctAnswer: "read cache, miss → query → write cache with a TTL" },
    { text: "When is a single slow query not the real problem?", options: ["the app makes 50 of them per page — fix the count", "it runs once", "the table is small", "it is indexed"], correctAnswer: "the app makes 50 of them per page — fix the count" },
  ],
  // ── W20 · Final Project Submission ──────────────────────────────────────
  "The Project Brief: Design a Booking System": [
    { text: "The capstone project is…", options: ["a booking system where resources can't be double-booked", "a blog", "a spreadsheet", "a chat app"], correctAnswer: "a booking system where resources can't be double-booked" },
    { text: "The first deliverable is…", options: ["an ER sketch of entities and relationships", "the final queries", "a backup", "an index"], correctAnswer: "an ER sketch of entities and relationships" },
    { text: "The double-booking guard lives in…", options: ["the schema as an EXCLUDE constraint", "the frontend only", "a comment", "a backup"], correctAnswer: "the schema as an EXCLUDE constraint" },
    { text: "The project is judged by…", options: ["whether a stranger can recreate the DB from your migrations and answer business questions", "how fast it runs", "the number of tables", "the UI"], correctAnswer: "whether a stranger can recreate the DB from your migrations and answer business questions" },
  ],
  "Advanced Queries the Booking System Needs": [
    { text: "Today's bookings are filtered with…", options: ["a range over [today, tomorrow) so the index works", "DATE = 'today' only", "a LIKE", "a sort"], correctAnswer: "a range over [today, tomorrow) so the index works" },
    { text: "Free slots are found using…", options: ["generate_series over possible slots LEFT JOINed to bookings", "a DELETE", "an INSERT", "a trigger"], correctAnswer: "generate_series over possible slots LEFT JOINed to bookings" },
    { text: "Utilization per week groups by…", options: ["DATE_TRUNC('week', starts_at) and resource", "customer name", "book_id", "status"], correctAnswer: "DATE_TRUNC('week', starts_at) and resource" },
    { text: "Booked hours are summed with…", options: ["EXTRACT(EPOCH FROM (ends_at - starts_at)) / 3600", "COUNT(*)", "AVG(total)", "LENGTH(starts_at)"], correctAnswer: "EXTRACT(EPOCH FROM (ends_at - starts_at)) / 3600" },
  ],
  "Reviewing Your Own Work Like a Senior Engineer": [
    { text: "The senior-review brutal test is…", options: ["'what happens if I delete this?'", "'is it pretty?'", "'how many lines?'", "'is it fast?'"], correctAnswer: "'what happens if I delete this?'" },
    { text: "A reproducible project means…", options: ["fresh DB → migrations → seed → queries work with no hand steps", "a backup exists", "the code is short", "the UI is nice"], correctAnswer: "fresh DB → migrations → seed → queries work with no hand steps" },
    { text: "Types are right when…", options: ["TIMESTAMPTZ is used for times and NUMERIC for money", "everything is TEXT", "everything is INTEGER", "types are mixed"], correctAnswer: "TIMESTAMPTZ is used for times and NUMERIC for money" },
    { text: "Senior engineers are not faster; they…", options: ["ask 'what happens if' earlier", "type faster", "write longer queries", "avoid the database"], correctAnswer: "ask 'what happens if' earlier" },
  ],
  "Final Exam Prep & Certification Review": [
    { text: "The best way to know you've learned the material is…", options: ["rebuilding the project from memory — schema, seed, queries", "re-reading slides", "doing one quiz", "watching videos"], correctAnswer: "rebuilding the project from memory — schema, seed, queries" },
    { text: "Explain each concept aloud because…", options: ["if you can't, you don't own it yet", "it is faster", "the exam is oral", "it is required"], correctAnswer: "if you can't, you don't own it yet" },
    { text: "The pitfall to drill:…", options: ["`WHERE x = NULL` vs `IS NULL` and COUNT(*) vs COUNT(col)", "SELECT vs UPDATE", "index vs table", "ASC vs rows"], correctAnswer: "`WHERE x = NULL` vs `IS NULL` and COUNT(*) vs COUNT(col)" },
    { text: "What does the certification demonstrate?", options: ["you can design and query a real database someone else can run", "you watched everything", "you memorized syntax", "you finished early"], correctAnswer: "you can design and query a real database someone else can run" },
  ],
};
