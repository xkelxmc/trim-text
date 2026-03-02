import { useMemo } from "react"
import { encode, decode } from "gpt-tokenizer"

export function useTokens(text: string) {
  return useMemo(() => {
    if (!text) return { count: 0, parts: [] }
    const tokens = encode(text)
    const parts = tokens.map((t) => decode([t]))
    return { count: tokens.length, parts }
  }, [text])
}
