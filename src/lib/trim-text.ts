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
  const lines = text.split("\n").map((line) => line.trimEnd())
  const processed = options?.claudeCodeMode ? dedent(lines) : lines
  return processed.join("\n").replace(/\n{3,}/g, "\n\n")
}
