import { useCallback, useRef, type RefObject } from "react"
import type { LineMap } from "@/lib/trim-text"

const LINE_HEIGHT = 21.125 // 13px * 1.625 (leading-relaxed)
const PADDING_TOP = 12 // py-3 = 0.75rem

function scrollTopToLine(scrollTop: number) {
  return Math.max(0, Math.floor((scrollTop - PADDING_TOP) / LINE_HEIGHT))
}

function lineToScrollTop(line: number) {
  return PADDING_TOP + line * LINE_HEIGHT
}

export function useScrollSync(
  lineMap: LineMap | null,
  inputRef: RefObject<HTMLTextAreaElement | null>,
  outputRef: RefObject<HTMLTextAreaElement | null>,
) {
  const scrollSourceRef = useRef<"input" | "output" | null>(null)

  const handleInputScroll = useCallback(
    (scrollTop: number) => {
      if (scrollSourceRef.current === "output") return
      scrollSourceRef.current = "input"

      if (outputRef.current && lineMap) {
        const topLine = scrollTopToLine(scrollTop)
        const clamped = Math.min(topLine, lineMap.inputToOutput.length - 1)
        const outputLine = lineMap.inputToOutput[Math.max(0, clamped)]
        outputRef.current.scrollTop = lineToScrollTop(outputLine)
      }

      requestAnimationFrame(() => {
        scrollSourceRef.current = null
      })
    },
    [lineMap, outputRef],
  )

  const handleOutputScroll = useCallback(
    (scrollTop: number) => {
      if (scrollSourceRef.current === "input") return
      scrollSourceRef.current = "output"

      if (inputRef.current && lineMap) {
        const topLine = scrollTopToLine(scrollTop)
        const clamped = Math.min(topLine, lineMap.outputToInput.length - 1)
        const inputLine = lineMap.outputToInput[Math.max(0, clamped)]
        inputRef.current.scrollTop = lineToScrollTop(inputLine)
      }

      requestAnimationFrame(() => {
        scrollSourceRef.current = null
      })
    },
    [lineMap, inputRef],
  )

  return { handleInputScroll, handleOutputScroll }
}
