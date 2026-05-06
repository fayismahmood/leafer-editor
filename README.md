# Leafer Editor

A browser-based vector design editor built on [Leafer UI](https://www.leaferjs.com/), with a Figma-like feel. Draw shapes and frames on an infinite canvas, select and style them, all from a clean React interface.

## Features

- **8 drawing tools** — Select, Rectangle, Ellipse, Line, Star, Text, Image, Frame
- **Keyboard shortcuts** — `V` select · `R` rect · `O` ellipse · `L` line · `S` star · `T` text · `I` image · `F` frame
- **Frames** — drag to create named frames; draw child shapes inside them
- **Properties panel** — live fill color, stroke color & width, opacity, font size
- **Selection-aware interactions** — drawing inside a frame is blocked when an element is already selected

## Tech Stack

| Layer | Library |
|---|---|
| Canvas engine | [Leafer UI](https://www.leaferjs.com/) + `@leafer-in/editor` |
| UI | React 19 |
| Routing | TanStack Router (file-based) |
| State | TanStack Store |
| Styling | Tailwind CSS v4 |
| Build | Vite |
| Lint / Format | Biome |
| Tests | Vitest |

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Or with Bun:

```bash
bun install
bun run dev
```

## Scripts

```bash
pnpm dev        # development server
pnpm build      # production build
pnpm preview    # preview the production build
pnpm test       # run tests with Vitest
pnpm lint       # Biome lint
pnpm format     # Biome format
pnpm check      # Biome lint + format check
```

## Project Structure

```
src/
├── components/
│   ├── editorCanvas.ts     # Leafer App setup, drag-to-draw logic
│   ├── LeaferCanvas.tsx    # React mount point for the canvas
│   ├── Toolbar.tsx         # Tool selection sidebar
│   └── PropertiesPanel.tsx # Fill, stroke, opacity, font controls
├── store/
│   └── editor.ts           # TanStack Store — activeTool, selection, style state
└── routes/
    ├── __root.tsx           # Root layout
    └── index.tsx            # Editor page
```

## How It Works

`editorCanvas.ts` creates a Leafer `App` with an embedded `Editor` instance. Drag events on the canvas root draw frames (only when `activeTool === 'frame'`). Each frame listens for its own drag events to draw child rectangles, skipping creation if `app.editor.leafList.length > 0` (i.e. something is already selected).

State shared between the canvas and React UI lives in `editorStore` (TanStack Store). The `Toolbar` writes `activeTool`; `PropertiesPanel` reads and writes fill/stroke/opacity/fontSize.
