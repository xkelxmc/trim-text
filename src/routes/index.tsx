import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Copy, Check, Eraser, Scissors, Braces } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsBar } from "@/components/stats-bar"
import { EditorPanel } from "@/components/editor-panel"
import { ModeSwitch } from "@/components/mode-switch"
import { GithubStar } from "@/components/github-star"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTokens } from "@/hooks/use-tokens"
import { useStats } from "@/hooks/use-stats"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { trimText, getDedentAmounts } from "@/lib/trim-text"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)
  const [showTokens, setShowTokens] = useState(false)
  const [claudeCodeMode, setClaudeCodeMode] = usePersistedState(
    "claudeCodeMode",
    false,
  )

  const output = trimText(input, { claudeCodeMode })
  const dedentAmounts = claudeCodeMode ? getDedentAmounts(input) : undefined
  const stats = useStats(input, output)
  const inputTokens = useTokens(input)
  const outputTokens = useTokens(output)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Scissors className="size-4 text-primary" />
          <h1 className="text-sm font-semibold tracking-tight">trim text</h1>
          <GithubStar />
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2.5">
          <ModeSwitch
            claudeCodeMode={claudeCodeMode}
            onChange={setClaudeCodeMode}
          />
          {input && (
            <>
              <Button
                variant={showTokens ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowTokens(!showTokens)}
              >
                <Braces className="size-3.5" />
                Tokens
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInput("")}
              >
                <Eraser className="size-3.5" />
                Clear
              </Button>
            </>
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

      <StatsBar
        charsRemoved={stats?.charsRemoved ?? 0}
        linesRemoved={stats?.linesRemoved ?? 0}
        tokensSaved={inputTokens.count - outputTokens.count}
        outputTokens={outputTokens.count}
        outputLines={stats?.outputLines ?? 0}
        inputTokens={inputTokens.count}
        inputChars={input.length}
        hasInput={!!input}
      />

      <div className="flex min-h-0 flex-1 gap-0 max-md:flex-col">
        <EditorPanel
          label="Input"
          charCount={input.length}
          tokenCount={inputTokens.count}
          tokenParts={inputTokens.parts}
          showTokens={showTokens}
          value={input}
          placeholder="Paste text with trailing whitespace..."
          onChange={setInput}
          className="border-r max-md:border-b max-md:border-r-0"
          dedentAmounts={dedentAmounts}
        />
        <EditorPanel
          label="Output"
          charCount={output.length}
          tokenCount={outputTokens.count}
          tokenParts={outputTokens.parts}
          showTokens={showTokens}
          value={output}
          placeholder="Cleaned result appears here..."
          readOnly
        />
      </div>
    </div>
  )
}
