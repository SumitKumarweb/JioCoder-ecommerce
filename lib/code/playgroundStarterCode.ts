/**
 * Runnable starter snippets (no `export` where a plain script runner can't load ES modules without bundler config).
 */
export const PLAYGROUND_STARTERS: Record<string, string> = {
  javascript: `// Run with ▶ Run — output appears in the terminal below
function greet(name = "JioCoder") {
  return \`Hello, \${name}!\`;
}

console.log(greet());
console.log("2 + 2 =", 2 + 2);
`,

  web: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Preview</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: linear-gradient(145deg, #052e16, #0f172a);
      color: #ecfdf5;
    }
    .card {
      padding: 1.5rem 2rem;
      border-radius: 1rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(52, 211, 153, 0.35);
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>JioCoder</h1>
    <p>Edit this HTML and click <strong>Run</strong> to refresh the preview.</p>
    <button type="button" onclick="alert('Hello from JS!')">Click me</button>
  </div>
</body>
</html>`,

  python: `# Run with ▶ Run — output in terminal
def greet(name: str = "JioCoder") -> str:
    return f"Hello, {name}!"

print(greet())
print("Sum:", sum(range(5)))
`,

  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        int sum = 0;
        for (int i = 0; i < 5; i++) sum += i;
        System.out.println("Sum 0..4 = " + sum);
    }
}
`,

  c: `#include <stdio.h>

int main(void) {
    printf("Hello from C!\\n");
    int sum = 0;
    for (int i = 0; i < 5; i++) sum += i;
    printf("Sum 0..4 = %d\\n", sum);
    return 0;
}
`,

  cpp: `#include <iostream>

int main() {
    std::cout << "Hello from C++!\\n";
    int sum = 0;
    for (int i = 0; i < 5; i++) sum += i;
    std::cout << "Sum 0..4 = " << sum << "\\n";
    return 0;
}
`,

  csharp: `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello from C#!");
        int sum = 0;
        for (int i = 0; i < 5; i++) sum += i;
        Console.WriteLine($"Sum 0..4 = {sum}");
    }
}
`,
};

export function getStarterCode(slug: string): string {
  return PLAYGROUND_STARTERS[slug] ?? '// Paste your code here\n';
}
