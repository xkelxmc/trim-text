# Trim Text

[![GitHub stars](https://img.shields.io/github/stars/xkelxmc/trim-text)](https://github.com/xkelxmc/trim-text/stargazers)
[![GitHub last commit](https://img.shields.io/github/last-commit/xkelxmc/trim-text)](https://github.com/xkelxmc/trim-text/commits/main)
[![License: MIT](https://img.shields.io/github/license/xkelxmc/trim-text)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)

A web tool that cleans up text copied from terminals. Paste on the left — get cleaned output on the right, instantly.

Text from Claude Code terminal often contains trailing spaces, whitespace-only lines, and extra leading indentation. These waste tokens and pollute prompts. Trim Text fixes that in one paste.

## Features

- **Trailing whitespace removal** — strips spaces/tabs from end of every line
- **Empty line collapse** — 3+ consecutive blank lines become 2
- **Claude Code mode** — dedents common leading whitespace (persisted in localStorage)
- **Trailing space highlighting** — red overlay shows exactly what gets trimmed
- **Token counter** — shows token count (GPT o200k_base) and how many tokens you save
- **Token visualization** — color-coded token boundaries for both input and output
- **Copy button** — one-click copy of cleaned text
- **Dark theme** — designed for developers

## Tech Stack

- React 19 + TypeScript
- Vite 7
- TanStack Router
- Tailwind CSS v4 + shadcn/ui (base-nova)
- JetBrains Mono
- gpt-tokenizer (local, no API calls)

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
bun run preview
```

## License

MIT
