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
        />
      ) : (
        <textarea
          placeholder={placeholder}
          value={value}
          readOnly
          spellCheck={false}
        />
      )}
    </div>
  )
}
