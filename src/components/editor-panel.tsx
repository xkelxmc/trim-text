import { TokenView } from "@/components/token-view"

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
      ) : (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          spellCheck={false}
          autoFocus={!readOnly}
        />
      )}
    </div>
  )
}
