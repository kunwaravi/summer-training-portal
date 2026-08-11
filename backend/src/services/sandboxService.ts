import { spawn, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Real code execution sandbox (issue #71).
 *
 * Security model (process-level, no Docker on the target host yet):
 *  - hard wall-clock kill via timer + process-group SIGKILL (run 3s, compile 8s)
 *  - `ulimit -v` → memory cap (1 GB virtual — interpreters need headroom)
 *  - `ulimit -t` → CPU time cap (parallel to the wall-clock kill)
 *  - `ulimit -f` → max file size (~1 MB) to stop disk bombs
 *  - `unshare -n` → new network namespace when the kernel permits it
 *  - user code is ALWAYS written to a temp file, never interpolated into a
 *    shell command → no command injection
 *
 * Notes:
 *  - `ulimit -u` (process count) is intentionally NOT used: lowering it breaks
 *    gcc's vfork/cc1 spawn on multi-threaded hosts. Fork bombs are instead
 *    contained by the CPU-time cap + whole process-group kill.
 *  - Network isolation is best-effort: it is active only where the host allows
 *    `unshare -n` (privileged/container hosts). Deploy in Docker for a hard
 *    network + memory sandbox.
 */

export type SandboxLanguage = 'c' | 'cpp' | 'python' | 'javascript';

interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  compileError?: boolean;
}

const TIMEOUT_MS = 3000;          // runtime wall-clock limit
const COMPILE_TIMEOUT_MS = 8000;  // compile wall-clock limit
const MAX_OUTPUT_CHARS = 4096;    // truncate runaway output
const MAX_CODE_CHARS = 20000;
const MEM_LIMIT_KB = 1024 * 1024; // 1 GB virtual address space
const FILE_LIMIT_BLOCKS = 1024;   // ~1 MB max file a child may write

// Node's V8 reserves a large virtual cage on startup (pointer-compression),
// so 1 GB is too low for it. We grant node more VIRTUAL address space but cap
// its actual heap with --max-old-space-size so a memory bomb is still bounded.
const MEM_LIMIT_KB_NODE = 4 * 1024 * 1024; // 4 GB virtual, heap capped at 256 MB

const resolveBin = (name: string): string => {
  const res = spawnSync('bash', ['-c', `command -v ${name}`], { encoding: 'utf8' });
  const resolved = (res.stdout || '').trim();
  return resolved || name;
};

const GCC = resolveBin('gcc');
const GXX = resolveBin('g++');
const PYTHON = resolveBin('python3');
const NODE = resolveBin('node');

const COMPILE_CMD: Partial<Record<SandboxLanguage, (src: string) => string>> = {
  c: (src) => `"${GCC}" "${src}" -o prog -O0 -lm`,
  cpp: (src) => `"${GXX}" "${src}" -o prog -O0 -lm`,
};

const RUN_CMD: Record<SandboxLanguage, string> = {
  c: './prog',
  cpp: './prog',
  python: `"${PYTHON}" main.py`,
  javascript: `"${NODE}" --max-old-space-size=256 main.js`,
};

// Per-language virtual memory limit (node needs more headroom than the rest).
const MEM_LIMIT: Record<SandboxLanguage, number> = {
  c: MEM_LIMIT_KB,
  cpp: MEM_LIMIT_KB,
  python: MEM_LIMIT_KB,
  javascript: MEM_LIMIT_KB_NODE,
};

const EXT: Record<SandboxLanguage, string> = {
  c: '.c',
  cpp: '.cpp',
  python: '.py',
  javascript: '.js',
};

const SUPPORTED = new Set<SandboxLanguage>(['c', 'cpp', 'python', 'javascript']);

// Detect at startup whether `unshare -n` (network namespace) is usable.
let canIsolateNetwork = false;
try {
  const probe = spawnSync('unshare', ['-n', 'true'], { stdio: 'ignore', timeout: 2000 });
  canIsolateNetwork = probe.status === 0;
} catch {
  canIsolateNetwork = false;
}

/** Wrap a command line with resource limits + optional network isolation. */
const buildWrapper = (commandLine: string, memLimitKb: number): string => {
  const limits = [
    `ulimit -v ${memLimitKb}`,
    `ulimit -t ${Math.ceil(TIMEOUT_MS / 1000)}`,
    `ulimit -f ${FILE_LIMIT_BLOCKS}`,
  ].join('; ');
  if (canIsolateNetwork) {
    return `unshare -n bash -c '${limits}; exec ${commandLine}'`;
  }
  return `bash -c '${limits}; exec ${commandLine}'`;
};

const runLimited = (commandLine: string, cwd: string, timeoutMs: number, memLimitKb: number): Promise<RunResult> => {
  return new Promise((resolve) => {
    // detached:true makes the child a process-group leader, so killing -pid
    // takes down the whole tree (gcc drivers, fork bombs, etc.).
    const child = spawn('bash', ['-c', buildWrapper(commandLine, memLimitKb)], {
      cwd,
      detached: true,
      // SECURITY: never pass the server's env into student code — JWT_SECRET /
      // DATABASE_URL / webhook keys would otherwise be readable via process.env
      // (JS/Python) or /proc/self/environ (C/C++). PATH only.
      env: { PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let killTimerFired = false;

    const killTree = () => {
      killTimerFired = true;
      if (child.pid) {
        try {
          process.kill(-child.pid, 'SIGKILL');
          return;
        } catch {
          // process group already gone — fall through to child.kill
        }
      }
      try { child.kill('SIGKILL'); } catch { /* already dead */ }
    };

    const killTimer = setTimeout(killTree, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
      if (stdout.length > MAX_OUTPUT_CHARS) stdout = stdout.slice(0, MAX_OUTPUT_CHARS);
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
      if (stderr.length > MAX_OUTPUT_CHARS) stderr = stderr.slice(0, MAX_OUTPUT_CHARS);
    });

    child.on('close', (code, signal) => {
      clearTimeout(killTimer);
      const timedOut =
        killTimerFired || signal === 'SIGKILL' || signal === 'SIGXCPU' || signal === 'SIGXFSZ';
      resolve({ stdout, stderr, exitCode: code, timedOut });
    });
    child.on('error', (err) => {
      clearTimeout(killTimer);
      resolve({
        stdout,
        stderr: stderr + '\n' + (err?.message || 'Failed to launch sandboxed process'),
        exitCode: null,
        timedOut: killTimerFired,
      });
    });
  });
};

export const runCode = async (language: string, code: string): Promise<RunResult & { language: string }> => {
  const lang = language.toLowerCase() as SandboxLanguage;
  if (!SUPPORTED.has(lang)) {
    throw new Error(`Unsupported language: ${language}`);
  }
  if (!code || code.length > MAX_CODE_CHARS) {
    throw new Error('Code exceeds the maximum allowed length.');
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'edunexus-sandbox-'));
  try {
    const srcFile = path.join(dir, `main${EXT[lang]}`);
    fs.writeFileSync(srcFile, code);

    const compileCmd = COMPILE_CMD[lang];
    if (compileCmd) {
      const compiled = await runLimited(compileCmd(srcFile), dir, COMPILE_TIMEOUT_MS, MEM_LIMIT_KB);
      if (compiled.exitCode !== 0) {
        return { ...compiled, compileError: true, language: lang };
      }
    }

    const result = await runLimited(RUN_CMD[lang], dir, TIMEOUT_MS, MEM_LIMIT[lang]);
    return { ...result, language: lang };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};
