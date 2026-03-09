/**
 * Collapse runs of repeated box-drawing or decorative characters to max 3.
 * Targets: ─ ═ ━ ┄ ┈ ╌ ╍ (horizontal lines).
 */
const REPEATABLE_CHARS = /([─═━┄┈╌╍])\1{3,}/g

/**
 * Compress padding inside table cells: │    content    │ → │ content │
 * Matches sequences of 2+ spaces between vertical bars and content.
 * Empty cells (only spaces between bars) collapse to single space.
 */
const CELL_PADDING = /([│║])\s{2,}(?=[^\s│║])/g
const CELL_TRAILING = /(?<=[^\s│║])\s{2,}(?=[│║])/g
const EMPTY_CELL = /([│║])\s{3,}(?=[│║])/g

function compressLine(line: string) {
  let result = line.replace(REPEATABLE_CHARS, "$1$1$1")
  // Only compress cell padding if line looks like a table data row
  if (/[│║]/.test(result)) {
    result = result
      .replace(EMPTY_CELL, "$1 ")
      .replace(CELL_PADDING, "$1 ")
      .replace(CELL_TRAILING, " ")
  }
  return result
}

/**
 * Compress repeated decorative characters and table cell padding.
 */
export function compressBoxDrawing(text: string) {
  return text.split("\n").map(compressLine).join("\n")
}

/**
 * Same as compressBoxDrawing but also returns a line map.
 * Since this transform doesn't change line count, the map is identity.
 */
export function compressBoxDrawingWithMap(text: string) {
  const lines = text.split("\n")
  const result = lines.map(compressLine)
  const lineMap = lines.map((_, i) => i)
  return { text: result.join("\n"), lineMap }
}
