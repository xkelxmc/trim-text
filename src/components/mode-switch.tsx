import { ClaudeLogo } from "@/components/claude-logo"

interface ModeSwitchProps {
  claudeCodeMode: boolean
  onChange: (value: boolean) => void
}

export function ModeSwitch({ claudeCodeMode, onChange }: ModeSwitchProps) {
  return (
    <div className="flex h-7 items-center rounded-lg border bg-muted/50 p-0.5 text-[12px] font-medium">
      <button
        onClick={() => onChange(false)}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-colors ${
          !claudeCodeMode
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Default
      </button>
      <button
        onClick={() => onChange(true)}
        className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition-colors ${
          claudeCodeMode
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ClaudeLogo className="size-3" />
        Claude Code
      </button>
    </div>
  )
}
