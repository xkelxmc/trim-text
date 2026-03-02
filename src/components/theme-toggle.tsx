import { Sun, Moon } from "lucide-react"
import { usePersistedState } from "@/hooks/use-persisted-state"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [dark, setDark] = usePersistedState("theme-dark", true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setDark((v) => !v)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
    </Button>
  )
}
