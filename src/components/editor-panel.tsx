import { useRef, useCallback } from "react"
import { TokenView } from "@/components/token-view"
import { HighlightedTextarea } from "@/components/highlighted-textarea"

interface EditorPanelProps {
  label: string
  charCount: number
  tokenCount: number
  tokenParts: string[]
  showTokens: boolean
  value: string
  placeholder: string
  readOnly?: boolean
  onChange?: (value: string) => void
  className?: string
  dedentAmounts?: number[]
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  onSyncScroll?: (scrollTop: number) => void
  onScroll?: (scrollTop: number) => void
}

function ReadOnlyWithGutter({
  value,
  placeholder,
  textareaRef,
  onScroll,
}: {
  value: string
  placeholder: string
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
  onScroll?: (scrollTop: number) => void
}) {
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      ;(internalRef as { current: HTMLTextAreaElement | null }).current = el
      if (textareaRef) (textareaRef as { current: HTMLTextAreaElement | null }).current = el
    },
    [textareaRef],
  )

  const handleScroll = useCallback(() => {
    if (internalRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = internalRef.current.scrollTop
      onScroll?.(internalRef.current.scrollTop)
    }
  }, [onScroll])

  const lineCount = value ? value.split("\n").length : 1

  return (
    <div className="flex flex-1 min-h-0">
      <div
        ref={gutterRef}
        aria-hidden
        className="overflow-hidden select-none border-r border-border/50 bg-muted/30 py-3 pr-2 pl-2 font-mono text-[13px] leading-relaxed text-muted-foreground/40 text-right"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative flex-1 min-h-0">
        <textarea
          ref={setRefs}
          className="absolute inset-0 w-full h-full resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed tracking-tight text-foreground outline-none border-none whitespace-pre-wrap break-words"
          placeholder={placeholder}
          value={value}
          readOnly
          spellCheck={false}
          onScroll={handleScroll}
        />
      </div>
    </div>
  )
}

export function EditorPanel({
  label,
  charCount,
  tokenCount,
  tokenParts,
  showTokens,
  value,
  placeholder,
  readOnly,
  onChange,
  className,
  dedentAmounts,
  textareaRef,
  onSyncScroll,
  onScroll,
}: EditorPanelProps) {
  return (
    <div className={`editor-panel rounded-none border-0 ${className ?? ""}`}>
      <div className="editor-label">
        <span>{label}</span>
        {value && (
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
            {charCount} chars / {tokenCount} tokens
          </span>
        )}
      </div>
      {showTokens ? (
        <TokenView parts={tokenParts} />
      ) : !readOnly && onChange ? (
        <HighlightedTextarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dedentAmounts={dedentAmounts}
          textareaRef={textareaRef}
          onSyncScroll={onSyncScroll}
        />
      ) : (
        <ReadOnlyWithGutter
          value={value}
          placeholder={placeholder}
          textareaRef={textareaRef}
          onScroll={onScroll}
        />
      )}
    </div>
  )
}
