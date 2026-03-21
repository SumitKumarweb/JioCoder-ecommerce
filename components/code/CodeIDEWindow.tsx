import CodeCopyButton from './CodeCopyButton';

export default function CodeIDEWindow({ filename, code }: { filename: string; code: string }) {
  const lines = code.split('\n');

  return (
    <div className="group relative rounded-2xl overflow-hidden border border-emerald-500/35 bg-[#050f0a] shadow-[0_0_60px_-12px_rgba(74,222,128,0.18),inset_0_1px_0_rgba(74,222,128,0.06)] transition-all duration-500 hover:border-lime-400/45 hover:shadow-[0_0_72px_-8px_rgba(163,230,53,0.2)]">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.07] via-transparent to-lime-500/[0.03] pointer-events-none" />
      <div className="relative flex items-center gap-2 px-4 sm:px-5 py-3 md:py-3.5 border-b border-emerald-500/20 bg-[#041208]/95 backdrop-blur-sm">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-3 rounded-full bg-[#ff5f56] shadow-sm ring-1 ring-black/20" />
          <span className="size-3 rounded-full bg-[#febc2e] shadow-sm ring-1 ring-black/20" />
          <span className="size-3 rounded-full bg-[#28c840] shadow-sm ring-1 ring-black/20" />
        </div>
        <span className="font-mono text-xs text-lime-200/90 truncate flex-1 text-center px-2">{filename}</span>
        <CodeCopyButton text={code} />
      </div>
      <div className="relative overflow-x-auto max-h-[min(420px,55vh)] overflow-y-auto">
        <pre className="p-5 md:p-6 text-xs md:text-sm leading-[1.65] font-mono text-slate-300">
          <code className="block">
            {lines.map((line, i) => (
              <div key={i} className="flex gap-3 md:gap-4 py-0.5 hover:bg-emerald-500/[0.08] rounded px-1 -mx-1 transition-colors">
                <span className="shrink-0 w-9 text-right select-none text-emerald-700/90 text-[11px] md:text-xs pt-0.5">
                  {i + 1}
                </span>
                <span className="whitespace-pre flex-1 min-w-0">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
