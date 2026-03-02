# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**trim-text** — A web tool for cleaning text copied from terminals (especially Claude Code). Strips trailing whitespace, collapses blank lines, optionally dedents common leading indentation.

Live at: deployed via Vercel

## Tech Stack

- React 19 + TypeScript (strict)
- Vite 7 with TanStack Router (file-based routing)
- Tailwind CSS v4 + shadcn/ui (base-nova style)
- gpt-tokenizer for token counting (pure JS, no API)
- Bun as package manager and runtime

## Project Structure

```
src/
├── components/
│   ├── claude-logo.tsx          — Claude spark SVG icon
│   ├── editor-panel.tsx         — Editor panel (label + textarea/tokens)
│   ├── highlighted-textarea.tsx — Textarea with trailing space highlighting
│   ├── mode-switch.tsx          — Default/Claude Code segmented control
│   ├── stats-bar.tsx            — Trim statistics bar
│   ├── token-view.tsx           — Color-coded token visualization
│   └── ui/                      — shadcn/ui components (button, textarea)
├── hooks/
│   ├── use-persisted-state.ts   — localStorage-backed state
│   ├── use-stats.ts             — Chars/lines removed calculation
│   └── use-tokens.ts            — Token encode/decode via gpt-tokenizer
├── lib/
│   ├── trim-text.ts             — Core trimming logic (trimEnd + dedent)
│   └── utils.ts                 — cn() utility
└── routes/
    ├── __root.tsx               — Root layout
    └── index.tsx                — Main page (orchestration only)
```

## Architecture Decisions

- **1 file = 1 component** — no multiple components in a single file
- **Route files are orchestration only** — no business logic, no utilities
- **Highlighted textarea** uses overlay technique: transparent `<textarea>` on top of `<pre>` with highlighted content, synced scroll
- **Claude Code mode** (dedent) is optional and persisted in localStorage — the first non-empty line often lacks the common indent from terminal copy
- **Token counting** uses gpt-tokenizer (o200k_base encoding) — runs entirely in the browser, no API calls

## Commands

```bash
bun run dev      # Start dev server (via portless)
bun run build    # Type-check + production build
bun run preview  # Preview production build
bun run lint     # ESLint
```

## Conventions

- All code, comments, and file names in English
- Avoid explicit return types (rely on inference)
- Use `@/` path alias for imports
- Dark theme by default (`class="dark"` on html)
