import { useMemo, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Copy, Check, Eraser, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function trimText(text: string) {
  return text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
}

function useStats(input: string, output: string) {
  return useMemo(() => {
    if (!input) return null
    const charsRemoved = input.length - output.length
    const inputLines = input.split("\n").length
    const outputLines = output.split("\n").length
    const linesRemoved = inputLines - outputLines
    return { charsRemoved, linesRemoved, inputLines, outputLines }
  }, [input, output])
}

function HomePage() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)

  const output = trimText(input)
  const stats = useStats(input, output)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Scissors className="size-4 text-primary" />
          <h1 className="text-sm font-semibold tracking-tight">trim text</h1>
        </div>
        <div className="flex items-center gap-1.5">
          {input && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInput("")}
            >
              <Eraser className="size-3.5" />
              Clear
            </Button>
          )}
          <Button
            variant={copied ? "default" : "outline"}
            size="sm"
            onClick={handleCopy}
            disabled={!output}
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </header>

      {/* Stats bar */}
      {stats && stats.charsRemoved > 0 && (
        <div className="flex items-center gap-4 border-b bg-primary/5 px-5 py-1.5 text-[11px] text-primary">
          <span className="font-mono font-medium">
            -{stats.charsRemoved} chars
          </span>
          {stats.linesRemoved > 0 && (
            <span className="font-mono font-medium">
              -{stats.linesRemoved} lines
            </span>
          )}
          <span className="text-muted-foreground">
            {stats.outputLines} lines remaining
          </span>
        </div>
      )}

      {/* Editor panels */}
      <div className="flex min-h-0 flex-1 gap-0 max-md:flex-col">
        {/* Input */}
        <div className="editor-panel rounded-none border-0 border-r max-md:border-b max-md:border-r-0">
          <div className="editor-label">
            <span>Input</span>
            {input && (
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                {input.length} chars
              </span>
            )}
          </div>
          <textarea
            placeholder="Paste text with trailing whitespace..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoFocus
          />
        </div>

        {/* Output */}
        <div className="editor-panel rounded-none border-0">
          <div className="editor-label">
            <span>Output</span>
            {output && (
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                {output.length} chars
              </span>
            )}
          </div>
          <textarea
            placeholder="Cleaned result appears here..."
            value={output}
            readOnly
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
