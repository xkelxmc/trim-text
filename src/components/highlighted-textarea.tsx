import { useRef, useCallback } from "react"

interface HighlightedTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  dedentAmounts?: number[]
  onSyncScroll?: (scrollTop: number) => void
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
}

function highlightLines(text: string, dedentAmounts?: number[]) {
  if (!text) return null
  const lines = text.split("\n")
  return lines.map((line, i) => {
    const trimmed = line.trimEnd()
    const trailing = line.slice(trimmed.length)
    const dedent = dedentAmounts?.[i] ?? 0
    const leading = dedent > 0 ? trimmed.slice(0, dedent) : ""
    const middle = dedent > 0 ? trimmed.slice(dedent) : trimmed
    return (
      <span key={i}>
        {leading && (
          <span className="bg-red-500/30 rounded-sm">{leading}</span>
        )}
        {middle}
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
  dedentAmounts,
  onSyncScroll,
  textareaRef,
}: HighlightedTextareaProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      ;(internalRef as { current: HTMLTextAreaElement | null }).current = el
      if (textareaRef) (textareaRef as { current: HTMLTextAreaElement | null }).current = el
    },
    [textareaRef],
  )

  const handleScroll = useCallback(() => {
    if (internalRef.current && preRef.current) {
      preRef.current.scrollTop = internalRef.current.scrollTop
      preRef.current.scrollLeft = internalRef.current.scrollLeft
      if (gutterRef.current) {
        gutterRef.current.scrollTop = internalRef.current.scrollTop
      }
      onSyncScroll?.(internalRef.current.scrollTop)
    }
  }, [onSyncScroll])

  const lineCount = value ? value.split("\n").length : 1

  return (
    <div className="flex flex-1 min-h-0">
      {/* Line number gutter */}
      <div
        ref={gutterRef}
        aria-hidden
        className="overflow-hidden select-none border-r border-border/50 bg-muted/30 py-3 pr-2 pl-2 font-mono text-[13px] leading-relaxed text-muted-foreground/40 text-right"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Text area with highlight overlay */}
      <div className="relative flex-1 min-h-0">
        <pre
          ref={preRef}
          aria-hidden
          className="absolute inset-0 overflow-hidden px-4 py-3 font-mono text-[13px] leading-relaxed tracking-tight text-foreground whitespace-pre-wrap break-words pointer-events-none"
        >
          {highlightLines(value, dedentAmounts) || (
            <span className="text-muted-foreground/50">{placeholder}</span>
          )}
        </pre>

        <textarea
          ref={setRefs}
          className="absolute inset-0 w-full h-full resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed tracking-tight text-transparent caret-foreground outline-none border-none selection:bg-primary/20 whitespace-pre-wrap break-words"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          spellCheck={false}
          autoFocus
        />
      </div>
    </div>
  )
}
