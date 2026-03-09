import { compressBoxDrawing, compressBoxDrawingWithMap } from "./table-to-csv"

function getIndent(line: string) {
  return line.search(/\S/)
}

function dedent(lines: string[]) {
  const nonEmpty = lines
    .map((line, i) => ({ line, i }))
    .filter(({ line }) => line.length > 0)

  if (nonEmpty.length === 0) return lines

  const minAll = Math.min(...nonEmpty.map(({ line }) => getIndent(line)))

  // standard case: all lines share a common indent
  if (minAll > 0) {
    return lines.map((line) =>
      line.length > 0 ? line.slice(minAll) : line,
    )
  }

  // first non-empty line has 0 indent — check if the rest has common indent
  const firstIdx = nonEmpty[0].i
  const rest = nonEmpty.filter(({ i }) => i !== firstIdx)
  if (rest.length === 0) return lines

  const minRest = Math.min(...rest.map(({ line }) => getIndent(line)))
  if (minRest <= 0) return lines

  return lines.map((line, i) => {
    if (i === firstIdx || line.length === 0) return line
    return line.slice(minRest)
  })
}

interface TrimOptions {
  claudeCodeMode?: boolean
}

export function trimText(text: string, options?: TrimOptions) {
  const compressed = options?.claudeCodeMode ? compressBoxDrawing(text) : text
  const lines = compressed.split("\n").map((line) => line.trimEnd())
  const processed = options?.claudeCodeMode ? dedent(lines) : lines
  return processed.join("\n").replace(/\n{3,}/g, "\n\n")
}

export interface LineMap {
  inputToOutput: number[]
  outputToInput: number[]
}

export function trimTextWithMap(text: string, options?: TrimOptions) {
  // Phase 1: table conversion with mapping
  let postTableLines: string[]
  let tableMap: number[] | null = null

  if (options?.claudeCodeMode) {
    const { text: compressedText, lineMap } = compressBoxDrawingWithMap(text)
    tableMap = lineMap
    postTableLines = compressedText.split("\n")
  } else {
    postTableLines = text.split("\n")
  }

  // Phase 2: trimEnd + dedent (don't change line count)
  const trimmed = postTableLines.map((line) => line.trimEnd())
  const processed = options?.claudeCodeMode ? dedent(trimmed) : trimmed

  // Phase 3: blank line collapse with mapping
  const outputLines: string[] = []
  const postTableToOutput: number[] = []
  let consecutiveBlanks = 0

  for (let i = 0; i < processed.length; i++) {
    if (processed[i] === "") {
      consecutiveBlanks++
      if (consecutiveBlanks <= 2) {
        postTableToOutput[i] = outputLines.length
        outputLines.push("")
      } else {
        // Collapsed — map to the last kept blank line
        postTableToOutput[i] = outputLines.length - 1
      }
    } else {
      consecutiveBlanks = 0
      postTableToOutput[i] = outputLines.length
      outputLines.push(processed[i])
    }
  }

  // Phase 4: compose mappings → inputToOutput
  const inputLineCount = text.split("\n").length
  const inputToOutput: number[] = new Array(inputLineCount)

  for (let i = 0; i < inputLineCount; i++) {
    const postTableIdx = tableMap ? tableMap[i] : i
    inputToOutput[i] = postTableToOutput[postTableIdx] ?? 0
  }

  // Phase 5: build reverse map
  const outputToInput: number[] = new Array(outputLines.length).fill(-1)
  // First pass: set direct mappings (earliest input line wins)
  for (let i = inputToOutput.length - 1; i >= 0; i--) {
    outputToInput[inputToOutput[i]] = i
  }
  // Second pass: fill gaps via interpolation (e.g. CSV lines from table blocks)
  for (let j = 1; j < outputToInput.length; j++) {
    if (outputToInput[j] === -1) {
      outputToInput[j] = outputToInput[j - 1] + 1
    }
  }
  if (outputToInput.length > 0 && outputToInput[0] === -1) {
    outputToInput[0] = 0
  }

  return {
    text: outputLines.join("\n"),
    lineMap: { inputToOutput, outputToInput } as LineMap,
  }
}

export function getDedentAmounts(text: string) {
  const lines = text.split("\n")
  const nonEmpty = lines
    .map((line, i) => ({ line, i }))
    .filter(({ line }) => line.trimEnd().length > 0)

  if (nonEmpty.length === 0) return lines.map(() => 0)

  const trimmedLines = lines.map((l) => l.trimEnd())
  const minAll = Math.min(
    ...nonEmpty.map(({ line }) => getIndent(line.trimEnd())),
  )

  if (minAll > 0) {
    return trimmedLines.map((line) => (line.length > 0 ? minAll : 0))
  }

  const firstIdx = nonEmpty[0].i
  const rest = nonEmpty.filter(({ i }) => i !== firstIdx)
  if (rest.length === 0) return lines.map(() => 0)

  const minRest = Math.min(
    ...rest.map(({ line }) => getIndent(line.trimEnd())),
  )
  if (minRest <= 0) return lines.map(() => 0)

  return trimmedLines.map((line, i) => {
    if (i === firstIdx || line.length === 0) return 0
    return minRest
  })
}
