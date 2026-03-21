/**
 * How code runs in the playground (no remote Piston — all client-side or guidance).
 */
export type ExecutionKind = 'html-preview' | 'browser-js' | 'pyodide' | 'local-guide';

export type PlaygroundRuntime = {
  execution: ExecutionKind;
  filename: string;
};

export const PLAYGROUND_BY_SLUG: Record<string, PlaygroundRuntime> = {
  javascript: { execution: 'browser-js', filename: 'main.js' },
  web: { execution: 'html-preview', filename: 'index.html' },
  python: { execution: 'pyodide', filename: 'main.py' },
  java: { execution: 'local-guide', filename: 'Main.java' },
  c: { execution: 'local-guide', filename: 'main.c' },
  cpp: { execution: 'local-guide', filename: 'main.cpp' },
  csharp: { execution: 'local-guide', filename: 'Program.cs' },
};

export function getPlaygroundRuntime(slug: string): PlaygroundRuntime | undefined {
  return PLAYGROUND_BY_SLUG[slug];
}
