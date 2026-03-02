interface StatsBarProps {
  charsRemoved: number
  linesRemoved: number
  tokensSaved: number
  outputTokens: number
  outputLines: number
  inputTokens: number
  inputChars: number
  hasInput: boolean
}

export function StatsBar({
  charsRemoved,
  linesRemoved,
  tokensSaved,
  outputTokens,
  outputLines,
  inputTokens,
  inputChars,
  hasInput,
}: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 border-b px-5 py-1.5 text-[11px]">
      {charsRemoved > 0 ? (
        <>
          <span className="font-mono font-medium text-primary">
            -{charsRemoved} chars
          </span>
          {linesRemoved > 0 && (
            <span className="font-mono font-medium text-primary">
              -{linesRemoved} lines
            </span>
          )}
          {tokensSaved > 0 && (
            <span className="font-mono font-medium text-primary">
              -{tokensSaved} tokens
            </span>
          )}
          <span className="text-muted-foreground">
            {outputTokens} tokens / {outputLines} lines remaining
          </span>
        </>
      ) : hasInput ? (
        <span className="font-mono text-muted-foreground">
          {inputTokens} tokens / {inputChars} chars
        </span>
      ) : (
        <span className="invisible">placeholder</span>
      )}
    </div>
  )
}
