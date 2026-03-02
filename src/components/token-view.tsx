const TOKEN_COLORS = [
  "bg-sky-400/20 text-sky-300",
  "bg-amber-400/20 text-amber-300",
  "bg-emerald-400/20 text-emerald-300",
  "bg-violet-400/20 text-violet-300",
  "bg-rose-400/20 text-rose-300",
  "bg-cyan-400/20 text-cyan-300",
  "bg-orange-400/20 text-orange-300",
  "bg-teal-400/20 text-teal-300",
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
