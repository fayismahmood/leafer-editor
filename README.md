# Leafer Editor

> **A free, open-source vector design editor that runs entirely in your browser.**
> No installs. No accounts. No cost. Just open and start designing.

<p align="center">
  <img src=".github/preview.png" alt="Leafer Editor screenshot" width="800" />
</p>

> **Status:** Public Beta — actively developed. [Try it live →](https://leafer-editor.vercel.app)

---

## Features

### Drawing Tools
- **Select** (`V`) — Click, drag-select, move, resize, rotate
- **Rectangle** (`R`) — Shapes with configurable corner radius
- **Ellipse** (`O`) — Circles, ellipses, arcs, and pie slices
- **Line** (`L`) — Lines with stroke width, cap style, dash patterns
- **Star** (`S`) — 3–20 point stars with adjustable inner radius
- **Pen** (`P`) — Custom paths and bezier curves
- **Text** (`T`) — Inline canvas text editing with rich typography
- **Image** (`I`) — Import PNG, JPG, WebP, GIF from your machine
- **Frame** (`F`) — Artboards with presets for paper, screens, and social media

### Styling
- **Fill** — Solid colors or linear/radial gradients with multi-stop gradient bar
- **Stroke** — Color, width, alignment (inside/center/outside), cap/join styles
- **Opacity** — 0–100% per-element transparency
- **Blend Modes** — 16 modes (multiply, screen, overlay, difference, etc.)
- **Shadows** — Drop shadow and inner shadow with offset, blur, spread, color
- **Rich Typography** — ~40 Google Fonts (lazy-loaded), weight, italic, alignment, line height, letter spacing

### Workflow
- **Layers Panel** — Tree view with drag-to-reorder, rename, lock, visibility toggle
- **Action Bar** — Group, mask, bring to front, send to back, lock, delete
- **Smart Snap Guides** — Automatic alignment lines when dragging elements
- **Export Panel** — PNG, JPG, WebP, BMP at configurable resolution, plus JSON and Canvas export
- **Keyboard Shortcuts** — Every tool has a single-key shortcut; Space+drag to pan; scroll to zoom

---

## Quick Start

```bash
git clone https://github.com/fayismahmood/leafer-editor.git
cd leafer-editor
pnpm install
pnpm dev        # → http://localhost:3000
```

Or with Bun:

```bash
bun install
bun run dev
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run tests with Vitest |
| `pnpm lint` | Biome lint |
| `pnpm format` | Biome format |
| `pnpm check` | Biome lint + format check |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Canvas Engine | [Leafer UI](https://www.leaferjs.com/) + `@leafer-in/editor`, `@leafer-in/animate`, `@leafer-in/corner`, `@leafer-in/state`, `@leafer-in/text-editor` |
| UI Framework | React 19 |
| Routing | TanStack Router (file-based, code-splitting) |
| State | TanStack React Store |
| Styling | Tailwind CSS v4 + `tw-animate-css` |
| Components | shadcn/ui + Radix primitives |
| Icons | Remixicon + Lucide |
| Build | Vite 8 |
| Language | TypeScript (strict mode) |
| Lint/Format | Biome |
| Testing | Vitest + Testing Library |

---

## Project Structure

```
src/
├── components/
│   ├── editor/
│   │   ├── canvas/           # Leafer app setup, drag-to-draw, selection logic
│   │   ├── tools/            # Shape tools (rect, ellipse, line, star, pen, text, image, frame)
│   │   ├── tools_properties/ # Per-tool property panels (fill, stroke, shadow, typography, etc.)
│   │   ├── editorCanvas.ts   # Editor class: tool registration, event wiring, snap config
│   │   └── configs.ts        # Editor configs (snap, move, rotate, select options)
│   ├── ActionBar.tsx         # Group, mask, z-order, lock, delete actions
│   ├── FramePopover.tsx      # Frame preset picker (paper, screen, social sizes)
│   ├── LeaferCanvas.tsx      # React mount point for the Leafer canvas
│   ├── PropertiesPanel.tsx   # Right panel: context-aware property controls
│   ├── Toolbar.tsx           # Bottom toolbar with tool selection
│   └── ui/                   # shadcn/ui primitives (button, popover, dialog, etc.)
├── store/
│   └── editor.ts             # TanStack Store: activeTool, selection, fill, stroke, opacity, shadows, text
├── routes/
│   ├── __root.tsx            # Root layout (nav, theme provider, toaster)
│   ├── index.tsx             # Landing / marketing page
│   └── edit.tsx              # Editor workspace
└── lib/
    └── utils.ts              # Shared utility functions
```

---

## How It Works

**Canvas layer** (`editorCanvas.ts`) creates a Leafer `App` with an embedded `Editor` instance. Drawing tools are registered as custom tool classes that handle pointer events (drag-to-draw shapes on the canvas). Selection, move, resize, and rotate are handled by `@leafer-in/editor` with snap guides via `leafer-x-easy-snap`.

**React layer** manages UI panels (toolbar, properties, layers, export) and communicates with the canvas through `editorStore` (TanStack Store). When a tool is selected in the toolbar, the store dispatches the change and the editor canvas switches the active tool. When an element is selected on the canvas, the store is updated and the Properties panel re-renders with context-aware controls.

**State flow:** `Toolbar ↔ editorStore ↔ EditorCanvas ↔ PropertiesPanel / LayersPanel / ActionBar`

---

## Roadmap

- [ ] Undo / Redo — full history stack
- [ ] SVG import / export
- [ ] Multi-page support
- [ ] Collaborative editing (real-time multi-user canvas)
- [ ] Pen tool enhancements (more bezier controls)
- [ ] Desktop app (Tauri)

---

## Contributing

Contributions are welcome! This project is in active development.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please run `pnpm check` before submitting to ensure lint and format pass.

---

## License

MIT
