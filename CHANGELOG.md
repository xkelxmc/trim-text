# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-03-10

### Added

- Scroll sync between input and output panels via line mapping
- Line number gutters in both input and output panels
- Box-drawing compression in Claude Code mode — repeated decorative chars (─═━) collapsed to 3, cell padding trimmed
- Unit tests with vitest v4 for box-drawing compression

### Changed

- `trimText()` now compresses box-drawing characters before dedent in Claude Code mode
- `trimTextWithMap()` builds full `LineMap` (inputToOutput + outputToInput) for scroll sync
- Removed diff output view — trimmed output shown directly without deleted-line markers

## [1.1.1] - 2026-03-02

### Fixed

- Leading whitespace removed by Claude Code mode (dedent) is now highlighted in red in the input panel

## [1.1.0] - 2026-03-02

### Added

- Light/dark theme toggle (persisted in localStorage)
- "Star Us" GitHub link with logo in header
- Light mode support for token visualization colors

## [1.0.0] - 2026-03-02

### Added

- Two-panel text trimmer: paste left, get cleaned output right
- Trailing whitespace removal (trimEnd on every line)
- Empty line collapse (3+ consecutive blank lines become 2)
- Claude Code mode — dedents common leading whitespace from terminal copies
- Mode switch (Default / Claude Code) persisted in localStorage
- Trailing space highlighting with red overlay in input panel
- Token counter using gpt-tokenizer (o200k_base, fully local)
- Token visualization with color-coded boundaries
- Trim stats bar: chars, lines, and tokens removed
- Copy button with confirmation feedback
- Clear button
- Dark theme with JetBrains Mono and warm amber accent
- Responsive layout (side-by-side on desktop, stacked on mobile)

[1.2.0]: https://github.com/xkelxmc/trim-text/releases/tag/v1.2.0
[1.1.1]: https://github.com/xkelxmc/trim-text/releases/tag/v1.1.1
[1.1.0]: https://github.com/xkelxmc/trim-text/releases/tag/v1.1.0
[1.0.0]: https://github.com/xkelxmc/trim-text/releases/tag/v1.0.0
