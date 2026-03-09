import { describe, expect, it } from "vitest"
import { compressBoxDrawing } from "./table-to-csv"

describe("compressBoxDrawing", () => {
  describe("horizontal line compression", () => {
    it("collapses long runs of ─ to 3", () => {
      expect(compressBoxDrawing("┌──────────┐")).toBe("┌───┐")
    })

    it("collapses long runs of ═ to 3", () => {
      expect(compressBoxDrawing("╔══════════╗")).toBe("╔═══╗")
    })

    it("keeps runs of 3 or fewer unchanged", () => {
      expect(compressBoxDrawing("┌───┐")).toBe("┌───┐")
      expect(compressBoxDrawing("┌──┐")).toBe("┌──┐")
      expect(compressBoxDrawing("┌─┐")).toBe("┌─┐")
    })

    it("collapses ━ (heavy horizontal)", () => {
      expect(compressBoxDrawing("┏━━━━━━━━┓")).toBe("┏━━━┓")
    })
  })

  describe("preserves structure", () => {
    it("keeps junction characters intact", () => {
      const input = "├──────────┼──────────┤"
      expect(compressBoxDrawing(input)).toBe("├───┼───┤")
    })

    it("keeps vertical bars and content untouched", () => {
      const input = "│ hello world │ foo bar │"
      expect(compressBoxDrawing(input)).toBe("│ hello world │ foo bar │")
    })

    it("does not compress regular text or spaces", () => {
      const input = "some    text    with    spaces"
      expect(compressBoxDrawing(input)).toBe("some    text    with    spaces")
    })

    it("does not compress repeated regular characters", () => {
      const input = "aaaaaaa bbbbbbb"
      expect(compressBoxDrawing(input)).toBe("aaaaaaa bbbbbbb")
    })
  })

  describe("cell padding compression", () => {
    it("compresses leading padding in cells", () => {
      expect(compressBoxDrawing("│    hello │")).toBe("│ hello │")
    })

    it("compresses trailing padding in cells", () => {
      expect(compressBoxDrawing("│ hello    │")).toBe("│ hello │")
    })

    it("compresses both sides", () => {
      expect(compressBoxDrawing("│    hello    │")).toBe("│ hello │")
    })

    it("compresses empty cells to single space", () => {
      expect(compressBoxDrawing("│         │")).toBe("│ │")
    })

    it("compresses multiple cells", () => {
      expect(compressBoxDrawing("│    a    │    b    │    c    │")).toBe("│ a │ b │ c │")
    })

    it("keeps single space padding as is", () => {
      expect(compressBoxDrawing("│ x │ y │")).toBe("│ x │ y │")
    })

    it("works with ║ double vertical bars", () => {
      expect(compressBoxDrawing("║    hello    ║")).toBe("║ hello ║")
    })
  })

  describe("full table examples", () => {
    it("compresses a simple table", () => {
      const input = [
        "┌──────────────┬──────────────┐",
        "│ Name         │ Value        │",
        "├──────────────┼──────────────┤",
        "│ foo          │ 42           │",
        "└──────────────┴──────────────┘",
      ].join("\n")

      const result = compressBoxDrawing(input)
      const lines = result.split("\n")

      expect(lines[0]).toBe("┌───┬───┐")
      expect(lines[1]).toBe("│ Name │ Value │")
      expect(lines[2]).toBe("├───┼───┤")
      expect(lines[3]).toBe("│ foo │ 42 │")
      expect(lines[4]).toBe("└───┴───┘")
    })

    it("compresses double-line box", () => {
      const input = [
        "╔════════════════════════════════════════════════════════════════════════════════╗",
        "║  GET /api/memes/trending?page=1&limit=10&mobile=true                         ║",
        "╚════════════════════════════════════════════════════════════════════════════════╝",
      ].join("\n")

      const result = compressBoxDrawing(input)
      const lines = result.split("\n")

      expect(lines[0]).toBe("╔═══╗")
      expect(lines[1]).toBe("║ GET /api/memes/trending?page=1&limit=10&mobile=true ║")
      expect(lines[2]).toBe("╚═══╝")
    })

    it("compresses section separators inside tables", () => {
      const input = "│ ══ STATIC → SEARCH ═══════════════════════════════════════│"
      expect(compressBoxDrawing(input)).toBe("│ ══ STATIC → SEARCH ═══│")
    })

    it("handles indented tables", () => {
      const input = [
        "  ┌──────────────────┬──────────────────┐",
        "  │ col1             │ col2             │",
        "  └──────────────────┴──────────────────┘",
      ].join("\n")

      const result = compressBoxDrawing(input)
      expect(result.split("\n")[0]).toBe("  ┌───┬───┐")
    })

    it("compresses multiple segments per line", () => {
      const input = "├──────────┼──────────┼──────────┤"
      expect(compressBoxDrawing(input)).toBe("├───┼───┼───┤")
    })
  })

  describe("mixed content", () => {
    it("only compresses border lines, leaves text between tables intact", () => {
      const input = [
        "Some text before.",
        "┌──────────┬──────────┐",
        "│ a        │ b        │",
        "└──────────┴──────────┘",
        "Some text after.",
      ].join("\n")

      const result = compressBoxDrawing(input)
      const lines = result.split("\n")

      expect(lines[0]).toBe("Some text before.")
      expect(lines[1]).toBe("┌───┬───┐")
      expect(lines[2]).toBe("│ a │ b │")
      expect(lines[3]).toBe("└───┴───┘")
      expect(lines[4]).toBe("Some text after.")
    })

    it("compresses padding in diagrams with box chars too", () => {
      const input = [
        "┌─② Step:",
        "│  do something",
        "└─┬─",
        "  │",
      ].join("\n")

      const expected = [
        "┌─② Step:",
        "│ do something",
        "└─┬─",
        "  │",
      ].join("\n")

      expect(compressBoxDrawing(input)).toBe(expected)
    })
  })

  describe("edge cases", () => {
    it("returns empty string for empty input", () => {
      expect(compressBoxDrawing("")).toBe("")
    })

    it("returns plain text unchanged", () => {
      const input = "Just some plain text\nwith multiple lines"
      expect(compressBoxDrawing(input)).toBe(input)
    })

    it("handles line with only box-drawing chars", () => {
      expect(compressBoxDrawing("────────────────────")).toBe("───")
      expect(compressBoxDrawing("════════════════════")).toBe("═══")
    })
  })
})
