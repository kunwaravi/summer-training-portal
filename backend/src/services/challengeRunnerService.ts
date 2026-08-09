import assert from 'node:assert';
import { runCode } from './sandboxService';
import { DatabaseSync } from 'node:sqlite';
import vm from 'node:vm';

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
 * Security: user/test code runs inside a Node `vm` context (no process, no
 * fs/network access) or the process-isolated sandbox for Python. All output is
 * length-capped.
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

/** Minimal DOM shim sufficient for the HTML challenge assertions (tag selectors + textContent). */
function buildDomShim(html: string) {
  const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g;
  const elements: Record<string, { textContent: string }[]> = {};
  let m: RegExpExecArray | null;
  while ((m = tagRegex.exec(html))) {
    const tag = m[1].toLowerCase();
    const inner = m[2];
    const textContent = inner.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    (elements[tag] = elements[tag] || []).push({ textContent });
  }
  const select = (sel: string) => elements[sel.toLowerCase().replace(/^[.#]/, '')] || [];
  return {
    querySelectorAll: (sel: string) => select(sel),
    querySelector: (sel: string) => select(sel)[0] || null
  };
}

/** Execute a single JavaScript assertion snippet in a vm context and report pass/fail. */
function runAssertionLine(line: string, context: Record<string, unknown>): ChallengeTestResult {
  const name = line.trim().slice(0, MAX_SINGLE_LINE_CHARS) || '(empty assertion)';
  try {
    const sandbox: Record<string, unknown> = {
      assert,
      ...context
    };
    vm.createContext(sandbox);
    vm.runInContext(line, sandbox, { timeout: 2000 });
    return { name, pass: true };
  } catch (err: any) {
    return {
      name,
      pass: false,
      message: (err?.message || String(err)).slice(0, 300)
    };
  }
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

/** Build the runner context for a challenge type given the user's code. */
async function buildContext(challengeType: string, userCode: string, testCode = ''): Promise<Record<string, unknown>> {
  const ctx: Record<string, unknown> = { __userSource: userCode };
  const type = challengeType.toUpperCase();

  switch (type) {
    case 'HTML':
    case 'CSS':
      ctx.document = buildDomShim(userCode);
      break;

    case 'JAVASCRIPT':
      {
        const captured: string[] = [];
        const sandbox: Record<string, unknown> = {
          console: {
            log: (...a: unknown[]) => captured.push(a.map(String).join(' ')),
            error: (...a: unknown[]) => captured.push('[error] ' + a.map(String).join(' ')),
            warn: (...a: unknown[]) => captured.push('[warn] ' + a.map(String).join(' '))
          }
        };
        vm.createContext(sandbox);
        vm.runInContext(userCode, sandbox, { timeout: 2000 });
        ctx.stdout = captured.join('\n');
      }
      break;

    case 'PYTHON':
      {
        // Run the user's code once to capture stdout (cached).
        let stdout = '';
        const py = await runCode('python', userCode);
        stdout = (py.stdout || '') + (py.stderr || '');

        ctx.stdout = stdout;
        // Pre-compute every pyEval('expr') from the testCode synchronously.
        // vm assertions can't await an async function, so pyEval returns a cache.
        const cache: Record<string, unknown> = {};
        for (const expr of extractPyEvalExprs(testCode)) {
          cache[expr] = await evalPythonExpr(userCode, expr);
        }
        ctx.pyEval = (expr: string): unknown => cache[expr];
      }
      break;

    // SQL is handled in runChallengeTests (needs seedCode bootstrap + user query).

    default:
      ctx.stdout = '';
  }

  return ctx;
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

export async function runChallengeTests(
  challenge: { challengeType: string; seedCode: string; testCode: string },
  userCode: string
): Promise<RunTestOutcome> {
  const type = (challenge.challengeType || '').trim().toUpperCase();
  const assertionLines = splitAssertions(challenge.testCode);

  let context: Record<string, unknown> = {};
  try {
    // SQL context needs both seedCode (bootstrap) and the user query.
    if (type === 'SQL') {
      context = {
        __userSource: userCode,
        result: runSqlChallenge(challenge.seedCode, userCode)
      };
    } else {
      context = await buildContext(type, userCode, challenge.testCode);
    }
  } catch (err: any) {
    return {
      passed: false,
      passedCount: 0,
      totalCount: assertionLines.length,
      tests: assertionLines.map((line) => ({
        name: line.slice(0, MAX_SINGLE_LINE_CHARS),
        pass: false,
        message: 'Runner failed to build context: ' + (err?.message || String(err)).slice(0, 200)
      })),
      stdout: ''
    };
  }

  const tests = assertionLines.map((line) => runAssertionLine(line, context));
  const passedCount = tests.filter((t) => t.pass).length;

  return {
    passed: passedCount === tests.length,
    passedCount,
    totalCount: tests.length,
    tests,
    stdout: typeof context.stdout === 'string' ? context.stdout.slice(0, 4096) : ''
  };
}
