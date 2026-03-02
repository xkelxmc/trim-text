import { useRef, useCallback } from "react"

interface HighlightedTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
}

function highlightLines(text: string) {
  if (!text) return null
  const lines = text.split("\n")
  return lines.map((line, i) => {
    const trimmed = line.trimEnd()
    const trailing = line.slice(trimmed.length)
    return (
      <span key={i}>
        {trimmed}
        {trailing && (
          <span className="bg-red-500/30 rounded-sm">{trailing}</span>
        )}
        {i < lines.length - 1 ? "\n" : ""}
      </span>
    )
  })
}

export function HighlightedTextarea({
  value,
  onChange,
  placeholder,
}: HighlightedTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop
      preRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  return (
    <div className="relative flex-1 min-h-0">
      {/* Highlight layer */}
      <pre
        ref={preRef}
        aria-hidden
        className="absolute inset-0 overflow-hidden px-4 py-3 font-mono text-[13px] leading-relaxed tracking-tight text-foreground whitespace-pre-wrap break-words pointer-events-none"
      >
        {highlightLines(value) || (
          <span className="text-muted-foreground/50">{placeholder}</span>
        )}
      </pre>

      {/* Editable textarea (transparent text, visible caret) */}
      <textarea
        ref={textareaRef}
        className="absolute inset-0 w-full h-full resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed tracking-tight text-transparent caret-foreground outline-none border-none selection:bg-primary/20 whitespace-pre-wrap break-words"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck={false}
        autoFocus
      />
    </div>
  )
}
