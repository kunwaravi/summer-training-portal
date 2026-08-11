import { runCode } from './sandboxService';
import { DatabaseSync } from 'node:sqlite';

/**
 * Challenge test runner (issue #72).
 *
 * Executes the WIP Challenge model's `testCode` (JS assertions) against a
 * student's submitted code, producing per-assertion pass/fail results.
 *
 * Runner context per challenge type:
 *  - HTML       → `document` (minimal DOM shim), `__userSource`
 *  - JavaScript → `console` captured into `stdout`, `__userSource`
 *  - Python     → `stdout`, `pyEval(expr)`, `__userSource`
 *  - SQL        → `result` = { columns, values } after seedCode + user query
 *
 * Security: the entire run (user code + assertions) executes inside a separate
 * child Node process via sandboxService — ulimit'd, wall-clock + CPU capped,
 * process-group killed, best-effort network isolation. It deliberately does
 * NOT use Node's `vm` module: vm contexts share the Express process heap and
 * are a documented escape hatch (constructor traversal reaches the host), so
 * they must never evaluate untrusted student code. All output is length-capped.
 */

export interface ChallengeTestResult {
  name: string;
  pass: boolean;
  message?: string;
}

export interface RunTestOutcome {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  tests: ChallengeTestResult[];
  stdout: string;
}

const MAX_TEST_LINES = 30;
const MAX_SINGLE_LINE_CHARS = 200;

const RESULTS_MARKER = '__EDUNEXUS_RESULTS__';

/** Extract the DOM elements record from HTML — serializable, built in the parent. */
function buildDomData(html: string): Record<string, { textContent: string }[]> {
  const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g;
  const elements: Record<string, { textContent: string }[]> = {};
  let m: RegExpExecArray | null;
  while ((m = tagRegex.exec(html))) {
    const tag = m[1].toLowerCase();
    const inner = m[2];
    const textContent = inner.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    (elements[tag] = elements[tag] || []).push({ textContent });
  }
  return elements;
}

/** Split the assertion source into individual lines (one assertion per line in seed data). */
function splitAssertions(testCode: string): string[] {
  return testCode
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('//'))
    .slice(0, MAX_TEST_LINES);
}

/** Evaluate a single Python expression against the user's code (returns coerced literal). */
async function evalPythonExpr(userCode: string, expr: string): Promise<unknown> {
  const combined = `${userCode}\n\nprint("__EDUNEXUS_EVAL__", repr(${expr}))`;
  const res = await runCode('python', combined);
  const line = (res.stdout || '').split('\n').find((l) => l.includes('__EDUNEXUS_EVAL__'));
  if (!line) return undefined;
  const val = line.split('__EDUNEXUS_EVAL__')[1]?.trim();
  if (/^-?\d+$/.test(val || '')) return parseInt(val!, 10);
  if (/^-?\d+\.\d+$/.test(val || '')) return parseFloat(val!);
  return val;
}

/** Extract the argument of every pyEval('...') call in a testCode string. */
function extractPyEvalExprs(testCode: string): string[] {
  const regex = /pyEval\(\s*(['"])(.*?)\1\s*\)/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(testCode))) out.push(m[2]);
  return out;
}

function runSqlChallenge(bootstrapSql: string, userQuery: string) {
  const db = new DatabaseSync(':memory:');
  try {
    db.exec(bootstrapSql);
    const stmt = db.prepare(userQuery.replace(/;\s*$/, ''));
    const rows = stmt.all() as Record<string, unknown>[];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const values = rows.map((r) => Object.values(r));
    return { columns, values };
  } finally {
    db.close();
  }
}

interface RunnerPayload {
  userCode: string;
  assertions: string[];
  domData?: Record<string, { textContent: string }[]>;
  pyEvalCache?: Record<string, unknown>;
  sqlResult?: { columns: string[]; values: unknown[][] };
  preStdout?: string;
  runUserCode: boolean;
}

/**
 * Build a self-contained Node runner script. Payloads are injected via
 * JSON.stringify (never raw code interpolation), and the user's code is only
 * ever eval'd at runtime inside the sandboxed child process.
 */
function buildJsRunnerScript(payload: RunnerPayload): string {
  const injected = JSON.stringify(payload);
  return `
const assert = require('node:assert');
const __payload = ${injected};
const captured = [];
global.console = {
  log: (...a) => captured.push(a.map(String).join(' ')),
  error: (...a) => captured.push('[error] ' + a.map(String).join(' ')),
  warn: (...a) => captured.push('[warn] ' + a.map(String).join(' '))
};
global.assert = assert;
global.__userSource = __payload.userCode;
global.stdout = __payload.preStdout || '';
if (__payload.domData) {
  global.document = {
    querySelectorAll: (sel) => __payload.domData[sel.toLowerCase().replace(/^[.#]/, '')] || [],
    querySelector: (sel) => (__payload.domData[sel.toLowerCase().replace(/^[.#]/, '')] || [])[0] || null
  };
}
if (__payload.pyEvalCache) {
  global.pyEval = (expr) => __payload.pyEvalCache[expr];
}
if (__payload.sqlResult) {
  global.result = __payload.sqlResult;
}
let userCodeError = null;
if (__payload.runUserCode) {
  try { (0, eval)(__payload.userCode); }
  catch (err) { userCodeError = (err && err.message) ? String(err.message) : String(err); }
}
const tests = [];
for (const line of __payload.assertions) {
  try {
    (0, eval)(line);
    tests.push({ name: String(line).slice(0, 200), pass: true });
  } catch (err) {
    tests.push({ name: String(line).slice(0, 200), pass: false, message: String((err && err.message) || err).slice(0, 300) });
  }
}
process.stdout.write('${RESULTS_MARKER}' + JSON.stringify({ captured, tests, userCodeError }));
`;
}

function failAll(assertionLines: string[], message: string, stdout: string): RunTestOutcome {
  return {
    passed: false,
    passedCount: 0,
    totalCount: assertionLines.length,
    tests: assertionLines.map((line) => ({
      name: line.slice(0, MAX_SINGLE_LINE_CHARS),
      pass: false,
      message
    })),
    stdout
  };
}

export async function runChallengeTests(
  challenge: { challengeType: string; seedCode: string; testCode: string },
  userCode: string
): Promise<RunTestOutcome> {
  const type = (challenge.challengeType || '').trim().toUpperCase();
  const assertionLines = splitAssertions(challenge.testCode);

  // Build the serializable run payload in the parent process.
  let domData: Record<string, { textContent: string }[]> | undefined;
  let pyEvalCache: Record<string, unknown> | undefined;
  let sqlResult: { columns: string[]; values: unknown[][] } | undefined;
  let preStdout = '';
  let runUserCode = false;

  try {
    if (type === 'SQL') {
      sqlResult = runSqlChallenge(challenge.seedCode, userCode);
    } else if (type === 'PYTHON') {
      // Run the user's code once to capture stdout (cached).
      const py = await runCode('python', userCode);
      preStdout = (py.stdout || '') + (py.stderr || '');
      // Pre-compute every pyEval('expr') from the testCode synchronously.
      // The child's pyEval returns this cache (it cannot await async work).
      const cache: Record<string, unknown> = {};
      for (const expr of extractPyEvalExprs(challenge.testCode)) {
        cache[expr] = await evalPythonExpr(userCode, expr);
      }
      pyEvalCache = cache;
    } else if (type === 'HTML' || type === 'CSS') {
      domData = buildDomData(userCode);
    } else {
      runUserCode = true; // JAVASCRIPT (and any execute-in-place type)
    }
  } catch (err: any) {
    return failAll(assertionLines, 'Runner failed to build context: ' + (err?.message || String(err)).slice(0, 200), '');
  }

  const res = await runCode('javascript', buildJsRunnerScript({
    userCode,
    assertions: assertionLines,
    domData,
    pyEvalCache,
    sqlResult,
    preStdout,
    runUserCode
  }));

  const markerLine = (res.stdout || '').split('\n').find((l) => l.startsWith(RESULTS_MARKER));
  if (!markerLine) {
    const reason = res.timedOut
      ? 'Timed out running tests (3s limit).'
      : (res.stderr || 'Runner crashed before producing results.').slice(0, 200);
    return failAll(assertionLines, reason, '');
  }

  let parsed: { captured: string[]; tests: ChallengeTestResult[]; userCodeError?: string };
  try {
    parsed = JSON.parse(markerLine.slice(RESULTS_MARKER.length));
  } catch {
    return failAll(assertionLines, 'Runner produced unparseable output.', '');
  }

  // Python surfaces its interpreter stdout; the other types surface the
  // captured console output from the JS child.
  const userStdout = (type === 'PYTHON' ? preStdout : (parsed.captured || []).join('\n')).slice(0, 4096);

  if (parsed.userCodeError) {
    return failAll(assertionLines, 'User code error: ' + String(parsed.userCodeError).slice(0, 200), userStdout);
  }

  const tests = (parsed.tests || []).slice(0, assertionLines.length);
  const passedCount = tests.filter((t) => t.pass).length;

  return {
    passed: passedCount === assertionLines.length,
    passedCount,
    totalCount: assertionLines.length,
    tests,
    stdout: userStdout
  };
}
