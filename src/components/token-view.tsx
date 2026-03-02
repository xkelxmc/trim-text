const TOKEN_COLORS = [
  "bg-sky-400/20 text-sky-300 dark:text-sky-300 text-sky-700",
  "bg-amber-400/20 text-amber-300 dark:text-amber-300 text-amber-700",
  "bg-emerald-400/20 text-emerald-300 dark:text-emerald-300 text-emerald-700",
  "bg-violet-400/20 text-violet-300 dark:text-violet-300 text-violet-700",
  "bg-rose-400/20 text-rose-300 dark:text-rose-300 text-rose-700",
  "bg-cyan-400/20 text-cyan-300 dark:text-cyan-300 text-cyan-700",
  "bg-orange-400/20 text-orange-300 dark:text-orange-300 text-orange-700",
  "bg-teal-400/20 text-teal-300 dark:text-teal-300 text-teal-700",
]

export function TokenView({ parts }: { parts: string[] }) {
  return (
    <pre className="flex-1 overflow-auto px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-all">
      {parts.map((part, i) => (
        <span
          key={i}
          className={`rounded-sm ${TOKEN_COLORS[i % TOKEN_COLORS.length]}`}
        >
          {part}
        </span>
      ))}
    </pre>
  )
}
