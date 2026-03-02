import { useMemo } from "react"

export function useStats(input: string, output: string) {
  return useMemo(() => {
    if (!input) return null
    const charsRemoved = input.length - output.length
    const inputLines = input.split("\n").length
    const outputLines = output.split("\n").length
    const linesRemoved = inputLines - outputLines
    return { charsRemoved, linesRemoved, inputLines, outputLines }
  }, [input, output])
}
