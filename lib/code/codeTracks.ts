export type CodeTopic = {
  name: string;
  summary: string;
};

export type CodeTrack = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  /** Tailwind gradient / border accent (from-… to-…) */
  accent: string;
  borderAccent: string;
  topics: CodeTopic[];
  sample: { filename: string; code: string };
  prerequisites: string[];
  /** Other track slugs to explore next */
  related: string[];
};

export const CODE_TRACKS: CodeTrack[] = [
  {
    slug: 'javascript',
    title: 'JavaScript',
    tagline: 'Language of the web & beyond',
    description:
      'Learn JavaScript from fundamentals to modern ES modules, async/await, and how it powers browsers, servers (Node.js), and tooling.',
    icon: 'integration_instructions',
    accent: 'from-amber-500/20 to-yellow-600/10',
    borderAccent: 'border-amber-500/40',
    topics: [
      { name: 'Syntax & types', summary: 'Variables, primitives, objects, arrays, functions, scope, hoisting.' },
      { name: 'DOM & events', summary: 'Selecting elements, listeners, forms, and dynamic UI updates.' },
      { name: 'Async JavaScript', summary: 'Promises, async/await, fetch API, error handling.' },
      { name: 'Modules & tooling', summary: 'ES modules, npm basics, bundlers at a high level.' },
      { name: 'Best practices', summary: 'Strict mode, linting mindset, readable code patterns.' },
    ],
    sample: {
      filename: 'hello.js',
      code: `// Modern JavaScript (ES modules style)
export function greet(name = "JioCoder") {
  return \`Hello, \${name}! Ready to build.\`;
}

const message = greet();
console.log(message);

// Async example
async function loadData() {
  try {
    const res = await fetch("/api/example");
    return await res.json();
  } catch (e) {
    console.error("Request failed", e);
  }
}`,
    },
    prerequisites: ['Basic computer literacy', 'Optional: HTML/CSS familiarity'],
    related: ['web', 'python', 'java'],
  },
  {
    slug: 'web',
    title: 'HTML, CSS & JavaScript',
    tagline: 'Build real pages in the browser',
    description:
      'A front-end path: structure with HTML, style with CSS (including responsive layouts), then add interactivity with JavaScript.',
    icon: 'web',
    accent: 'from-orange-500/20 to-rose-500/10',
    borderAccent: 'border-orange-500/40',
    topics: [
      { name: 'HTML5 semantics', summary: 'Document structure, headings, lists, links, media, forms, accessibility basics.' },
      { name: 'CSS fundamentals', summary: 'Selectors, box model, typography, colors, Flexbox, Grid.' },
      { name: 'Responsive design', summary: 'Viewport meta, media queries, mobile-first patterns.' },
      { name: 'JavaScript on the page', summary: 'Inline vs modules, DOM scripting, small UI behaviors.' },
      { name: 'Putting it together', summary: 'Layout a landing page, navbar, cards, and a simple interactive component.' },
    ],
    sample: {
      filename: 'index.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>My first page</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; }
    .card { padding: 1rem; border-radius: 12px; background: #f1f5f9; }
  </style>
</head>
<body>
  <h1>Hello, JioCoder</h1>
  <div class="card" id="box">Click me</div>
  <script>
    document.getElementById("box").onclick = () => {
      alert("HTML + CSS + JS = web!");
    };
  </script>
</body>
</html>`,
    },
    prerequisites: ['No prior coding required'],
    related: ['javascript', 'python', 'csharp'],
  },
  {
    slug: 'python',
    title: 'Python',
    tagline: 'Readable, versatile, everywhere',
    description:
      'Start with Python syntax and data structures, then scripts, files, virtual environments, and paths toward APIs or data tasks.',
    icon: 'code',
    accent: 'from-blue-500/20 to-cyan-500/10',
    borderAccent: 'border-blue-500/40',
    topics: [
      { name: 'Basics', summary: 'Indentation, variables, strings, numbers, booleans, input/output.' },
      { name: 'Collections & control flow', summary: 'Lists, tuples, dicts, sets, loops, conditionals, functions.' },
      { name: 'Modules & packages', summary: 'import, pip, venv, requirements mindset.' },
      { name: 'Files & errors', summary: 'Reading/writing files, try/except, logging basics.' },
      { name: 'Next steps', summary: 'HTTP with requests, scripting automation, or intro to a web framework conceptually.' },
    ],
    sample: {
      filename: 'app.py',
      code: `#!/usr/bin/env python3
"""Small Python example — readable by design."""

def total(items: list[float]) -> float:
    return sum(items)

if __name__ == "__main__":
    prices = [499.0, 799.0, 1299.0]
    print(f"Cart total: ₹{total(prices):,.2f}")`,
    },
    prerequisites: ['Basic computer literacy'],
    related: ['javascript', 'java', 'c'],
  },
  {
    slug: 'java',
    title: 'Java',
    tagline: 'Strong typing & large ecosystems',
    description:
      'Object-oriented programming with Java: classes, interfaces, collections, and how JVM apps are structured.',
    icon: 'local_cafe',
    accent: 'from-red-500/15 to-orange-600/10',
    borderAccent: 'border-red-500/40',
    topics: [
      { name: 'Java fundamentals', summary: 'JDK, JRE, classes, objects, methods, packages.' },
      { name: 'OOP core', summary: 'Encapsulation, inheritance, polymorphism, interfaces.' },
      { name: 'Collections & generics', summary: 'List, Map, Set, iterators, type parameters.' },
      { name: 'Exceptions & I/O', summary: 'Checked/unchecked exceptions, try-with-resources.' },
      { name: 'Build & run', summary: 'javac/java, JAR basics, intro to Maven/Gradle concepts.' },
    ],
    sample: {
      filename: 'Main.java',
      code: `import java.util.ArrayList;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    ShoppingCart cart = new ShoppingCart();
    cart.add(new Item("Keyboard", 4999));
    cart.add(new Item("Mouse", 2499));
    System.out.println("Total: ₹" + cart.total());
  }
}

class Item {
  final String name;
  final int priceInPaise;
  Item(String name, int priceInPaise) {
    this.name = name;
    this.priceInPaise = priceInPaise;
  }
}

class ShoppingCart {
  private final List<Item> items = new ArrayList<>();

  void add(Item item) { items.add(item); }

  int total() {
    int sum = 0;
    for (Item i : items) sum += i.priceInPaise;
    return sum;
  }
}`,
    },
    prerequisites: ['Basic programming concepts help', 'Comfort installing JDK'],
    related: ['csharp', 'cpp', 'javascript'],
  },
  {
    slug: 'c',
    title: 'C',
    tagline: 'Close to the machine',
    description:
      'Learn memory-aware programming: pointers, structs, the standard library, and how C underpins operating systems and embedded software.',
    icon: 'memory',
    accent: 'from-slate-500/25 to-slate-700/15',
    borderAccent: 'border-slate-500/50',
    topics: [
      { name: 'C basics', summary: 'main, printf/scanf, types, operators, control flow.' },
      { name: 'Functions & headers', summary: 'Prototypes, .h files, compilation steps, make intro.' },
      { name: 'Pointers & arrays', summary: 'Address-of, dereference, strings as char[], pointer arithmetic caution.' },
      { name: 'Structs & memory', summary: 'struct, malloc/free, stack vs heap mindset.' },
      { name: 'Standard library', summary: 'string.h, stdlib.h, file I/O with FILE*.' },
    ],
    sample: {
      filename: 'main.c',
      code: `#include <stdio.h>

typedef struct {
  const char *name;
  int price;
} Product;

int main(void) {
  Product p = { "Desk mat", 799 };
  printf("%s — ₹%d\\n", p.name, p.price);
  return 0;
}`,
    },
    prerequisites: ['Comfort with a terminal', 'Basic logic/math'],
    related: ['cpp', 'python', 'java'],
  },
  {
    slug: 'cpp',
    title: 'C++',
    tagline: 'C with classes & modern features',
    description:
      'From C foundations to classes, RAII, the STL, and modern C++ features used in games, systems, and performance-critical apps.',
    icon: 'precision_manufacturing',
    accent: 'from-indigo-500/20 to-blue-700/10',
    borderAccent: 'border-indigo-500/40',
    topics: [
      { name: 'C++ over C', summary: 'References, function overloading, namespaces, iostreams.' },
      { name: 'Classes & OOP', summary: 'Constructors, destructors, inheritance, virtual methods.' },
      { name: 'STL essentials', summary: 'vector, string, map, iterators, algorithms.' },
      { name: 'Memory in C++', summary: 'new/delete vs smart pointers (conceptual), RAII.' },
      { name: 'Modern C++', summary: 'auto, range-for, lambdas at intro level; where to go next.' },
    ],
    sample: {
      filename: 'main.cpp',
      code: `#include <iostream>
#include <vector>
#include <string>

int main() {
  std::vector<std::string> languages = {"C", "C++", "Python"};
  for (const auto& lang : languages) {
    std::cout << "Love " << lang << "\\n";
  }
  return 0;
}`,
    },
    prerequisites: ['C basics strongly recommended'],
    related: ['c', 'java', 'csharp'],
  },
  {
    slug: 'csharp',
    title: 'C#',
    tagline: '.NET, games, and enterprise apps',
    description:
      'C# on .NET: object-oriented programming, LINQ, async/await, and how it fits Windows, web (ASP.NET), Unity, and cloud tooling.',
    icon: 'terminal',
    accent: 'from-violet-500/20 to-fuchsia-600/10',
    borderAccent: 'border-violet-500/40',
    topics: [
      { name: 'C# syntax', summary: 'Types, classes, properties, methods, namespaces.' },
      { name: 'OOP in C#', summary: 'Inheritance, interfaces, abstract classes, records.' },
      { name: 'Collections & LINQ', summary: 'List, Dictionary, IEnumerable, query-style operations.' },
      { name: 'Async C#', summary: 'async/await, Task, exception handling in asynchronous code.' },
      { name: '.NET landscape', summary: 'CLI, SDK, project files, where ASP.NET Core and Unity connect.' },
    ],
    sample: {
      filename: 'Program.cs',
      code: `using System;
using System.Collections.Generic;
using System.Linq;

var cart = new List<(string Name, decimal Price)> {
  ("Keycaps", 2499m),
  ("Cable", 899m),
};

decimal total = cart.Sum(x => x.Price);
Console.WriteLine($"Total: ₹{total:N0}");`,
    },
    prerequisites: ['Basic programming concepts help', '.NET SDK installed for hands-on'],
    related: ['java', 'javascript', 'cpp'],
  },
];

const bySlug = new Map(CODE_TRACKS.map((t) => [t.slug, t]));

export function getCodeTrack(slug: string): CodeTrack | undefined {
  return bySlug.get(slug);
}

export function getAllCodeSlugs(): string[] {
  return CODE_TRACKS.map((t) => t.slug);
}
