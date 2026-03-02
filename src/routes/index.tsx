import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Copy, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
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

function HomePage() {
  const [input, setInput] = useState("")
  const [copied, setCopied] = useState(false)

  const output = trimText(input)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex h-dvh flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Trim Text</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!output}
        >
          {copied ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 gap-4 max-md:flex-col">
        <Textarea
          className="flex-1 resize-none font-mono text-sm"
          placeholder="Paste text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Textarea
          className="flex-1 resize-none font-mono text-sm"
          placeholder="Cleaned output will appear here..."
          value={output}
          readOnly
        />
      </div>
    </div>
  )
}
