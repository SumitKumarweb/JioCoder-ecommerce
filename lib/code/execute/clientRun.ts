/**
 * Run user code entirely in the browser (no Piston / no remote code APIs).
 */

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
    __jiocoder_pyodide?: PyodideInterface;
  }
}

type PyodideInterface = {
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
};

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.crossOrigin = 'anonymous';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

async function ensurePyodide(): Promise<PyodideInterface> {
  if (typeof window === 'undefined') throw new Error('Pyodide requires a browser');
  if (window.__jiocoder_pyodide) return window.__jiocoder_pyodide;
  if (!window.loadPyodide) {
    await loadScript(`${PYODIDE_BASE}pyodide.js`);
  }
  if (!window.loadPyodide) throw new Error('Pyodide loader not available');
  const pyodide = await window.loadPyodide({ indexURL: PYODIDE_BASE });
  window.__jiocoder_pyodide = pyodide;
  return pyodide;
}

/**
 * Run JS in a sandboxed iframe (no DOM access to parent). console.log captured.
 */
export function runJavaScript(code: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('(server) JavaScript runs in the browser only.');
      return;
    }
    const b64 = btoa(unescape(encodeURIComponent(code)));
    const handler = (e: MessageEvent) => {
      if (e.data?.type !== 'jiocoder-js-result') return;
      window.removeEventListener('message', handler);
      clearTimeout(timeout);
      iframe.remove();
      resolve(typeof e.data.output === 'string' ? e.data.output : '(no output)');
    };
    window.addEventListener('message', handler);
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler);
      iframe.remove();
      resolve('(timeout) Stopped after 15s — check for infinite loops.');
    }, 15_000);
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none';
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('title', 'JavaScript sandbox');
    iframe.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
(function(){
  function send(line){
    try { parent.postMessage({type:'jiocoder-js-result', output: line}, '*'); } catch(e) {}
  }
  var code = decodeURIComponent(escape(atob("${b64}")));
  var logs = [];
  var console = {
    log: function(){ logs.push(Array.prototype.join.call(arguments, ' ')); },
    error: function(){ logs.push('[error] ' + Array.prototype.join.call(arguments, ' ')); },
    warn: function(){ logs.push('[warn] ' + Array.prototype.join.call(arguments, ' ')); },
    info: function(){ logs.push(Array.prototype.join.call(arguments, ' ')); }
  };
  try {
    (new Function('console', code))(console);
    send(logs.length ? logs.join('\\n') : '(no output)');
  } catch (e) {
    send(logs.length ? logs.join('\\n') + '\\n' + String(e) : String(e));
  }
})();
</script></body></html>`;
    document.body.appendChild(iframe);
  });
}

export async function runPython(code: string): Promise<string> {
  const pyodide = await ensurePyodide();
  let out = '';
  let err = '';
  pyodide.setStdout({ batched: (s: string) => {
    out += s;
  } });
  pyodide.setStderr({ batched: (s: string) => {
    err += s;
  } });
  try {
    await pyodide.runPythonAsync(code);
  } catch (e) {
    return (out + err + (out || err ? '\n' : '') + String(e)).trim() || String(e);
  }
  const combined = (out + err).trim();
  return combined || '(no output)';
}

const LOCAL_GUIDE: Record<string, string> = {
  java: `JioCoder can't run Java in the browser (needs a JVM).

What you can do:
• Install JDK 17+ locally → javac Main.java && java Main
• Use any online "Java compiler" / IDE in another tab
• Keep editing here, then copy your file when ready`,
  c: `C can't run in the browser here (needs a native compiler).

What you can do:
• Install GCC/Clang → gcc main.c -o main && ./main (or .exe on Windows)
• Use Godbolt, Replit, or similar online
• Copy main.c from here when ready`,
  cpp: `C++ can't run in the browser here (needs a native compiler).

What you can do:
• Install g++/clang++ → g++ main.cpp -o out && ./out
• Use Godbolt or an online C++ sandbox
• Copy your source from here when ready`,
  csharp: `C# / .NET can't run in the browser here.

What you can do:
• Install .NET SDK → dotnet script or dotnet run
• Use online C# runners or Visual Studio / Rider
• Copy Program.cs from here when ready`,
};

export function runLocalGuide(slug: string): string {
  return LOCAL_GUIDE[slug] ?? `This language isn't executed in the browser. Copy your code and run it with a local toolchain or an online compiler.`;
}
