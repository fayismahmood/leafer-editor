import { useSelector } from '@tanstack/react-store'
import { editorStore, setActiveTool } from '#/store/editor'
import { getCanvasApp } from '#/utils/appInstance'
import type { IUI } from 'leafer-ui'

// ── helpers ──────────────────────────────────────────────────────────────────

const TAG_COLOR: Record<string, string> = {
  Rect:    '#4A90D9',
  Ellipse: '#E85D75',
  Line:    '#555555',
  Star:    '#F5A623',
  Text:    '#7B68EE',
  Path:    '#50C878',
  Frame:   '#94a3b8',
}

interface LayerRow { el: IUI; depth: number }

function collectRows(node: any, depth = 0, out: LayerRow[] = []): LayerRow[] {
  const children: any[] = node?.children
  if (!Array.isArray(children)) return out

  for (const child of children) {
    // Skip Leafer's own internal sky / tree nodes
    if (!child.__tag || child.__tag === 'Leafer' || child.__tag === 'App') continue
    out.push({ el: child as IUI, depth })
    if (Array.isArray(child.children) && child.children.length > 0) {
      collectRows(child, depth + 1, out)
    }
  }
  return out
}

// ── component ─────────────────────────────────────────────────────────────────

export function LayersPanel() {
  // Re-renders whenever selection changes — enough to stay in sync with canvas
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)
  const selectedSet = new Set<IUI>(selectedElements)

  const app  = getCanvasApp()
  const rows = app ? collectRows(app.tree) : []

  function handleClick(el: IUI) {
    const a = getCanvasApp()
    if (!a) return
    a.editor?.select(el)
    setActiveTool('select')
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <span className="text-xs text-gray-300 select-none">Canvas is empty</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col py-1">
      {rows.map(({ el, depth }) => {
        const tag      = (el as any).__tag as string ?? 'Element'
        const name     = (el as any).name || tag
        const color    = TAG_COLOR[tag] ?? '#aaa'
        const selected = selectedSet.has(el)

        return (
          <div
            key={(el as any).innerId}
            onClick={() => handleClick(el)}
            style={{ paddingLeft: 12 + depth * 14 }}
            className={`flex items-center gap-2 pr-3 py-1.5 cursor-pointer select-none
              text-xs truncate transition-colors ${
                selected
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <span
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: color }}
            />
            <span className="truncate">{name}</span>
          </div>
        )
      })}
    </div>
  )
}
