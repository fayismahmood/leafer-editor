import { useRef, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { GripVertical } from 'lucide-react'
import { editorStore, setActiveTool } from '#/store/editor'
import { getCanvasApp } from '#/utils/appInstance'
import type { IUI } from 'leafer-ui'

// ── types ─────────────────────────────────────────────────────────────────────

interface LayerRow { el: IUI; depth: number }

type DropPos = 'before' | 'after'

// ── constants ─────────────────────────────────────────────────────────────────

const TAG_COLOR: Record<string, string> = {
  Rect:    '#4A90D9',
  Ellipse: '#E85D75',
  Line:    '#555555',
  Star:    '#F5A623',
  Text:    '#7B68EE',
  Path:    '#50C878',
  Frame:   '#94a3b8',
}

// ── tree helper ───────────────────────────────────────────────────────────────

function collectRows(node: any, depth = 0, out: LayerRow[] = []): LayerRow[] {
  const children: any[] = node?.children
  if (!Array.isArray(children)) return out

  // Reverse so the topmost visual element appears first in the list
  for (const child of [...children].reverse()) {
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
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)
  const selectedSet      = new Set<IUI>(selectedElements)

  // ── rename state ──────────────────────────────────────────────────────────
  const [renamingId,  setRenamingId]  = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // ── drag state ────────────────────────────────────────────────────────────
  const [draggingId,  setDraggingId]  = useState<number | null>(null)
  const [dropTarget,  setDropTarget]  = useState<{ id: number; pos: DropPos } | null>(null)

  // Row DOM refs for bounding-rect calculation during DnD
  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const app  = getCanvasApp()
  const rows = app ? collectRows(app.tree) : []

  // ── rename ────────────────────────────────────────────────────────────────

  function startRename(el: any, e: React.MouseEvent) {
    e.stopPropagation()
    setRenamingId(el.innerId)
    setRenameValue(el.name ?? '')
  }

  function commitRename(el: any) {
    el.name = renameValue.trim() || (el.__tag as string)
    setRenamingId(null)
  }

  function cancelRename() {
    setRenamingId(null)
  }

  // ── drag ──────────────────────────────────────────────────────────────────

  function onDragStart(e: React.DragEvent, innerId: number) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(innerId))
    setDraggingId(innerId)
  }

  function onDragOver(e: React.DragEvent, innerId: number) {
    e.preventDefault()
    if (innerId === draggingId) return

    const rowEl = rowRefs.current.get(innerId)
    const rect  = rowEl?.getBoundingClientRect()
    const pos: DropPos = rect && e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'

    setDropTarget((prev) =>
      prev?.id === innerId && prev.pos === pos ? prev : { id: innerId, pos },
    )
  }

  function onDragLeave() {
    setDropTarget(null)
  }

  function onDrop(e: React.DragEvent, targetEl: any) {
    e.preventDefault()
    if (!draggingId || !dropTarget) return

    const allRows = collectRows(app!.tree)
    const dragEl  = allRows.find((r) => (r.el as any).innerId === draggingId)?.el as any
    if (!dragEl || dragEl === targetEl) return

    const dragParent   = dragEl.parent   as any
    const targetParent = targetEl.parent as any

    // Only same-parent reorder for now
    if (dragParent !== targetParent) return

    dragEl.remove()

    // The UI list is reversed relative to the Leafer children array:
    //   "before in UI" = visually above target = higher array index → addAfter
    //   "after in UI"  = visually below target = lower array index  → addBefore
    if (dropTarget.pos === 'before') {
      dragParent.addAfter(dragEl, targetEl)
    } else {
      dragParent.addBefore(dragEl, targetEl)
    }

    setDraggingId(null)
    setDropTarget(null)
  }

  function onDragEnd() {
    setDraggingId(null)
    setDropTarget(null)
  }

  // ── select ────────────────────────────────────────────────────────────────

  function handleClick(el: IUI) {
    const a = getCanvasApp()
    if (!a) return
    a.editor?.select(el)
    setActiveTool('select')
  }

  // ── render ────────────────────────────────────────────────────────────────

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-xs text-gray-300 select-none">Canvas is empty</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col py-1" onDragEnd={onDragEnd}>
      {rows.map(({ el, depth }) => {
        const tag      = (el as any).__tag as string ?? 'Element'
        const name     = (el as any).name   || tag
        const color    = TAG_COLOR[tag]      ?? '#aaa'
        const innerId  = (el as any).innerId as number

        const isSelected   = selectedSet.has(el)
        const isDragging   = draggingId === innerId
        const isRenaming   = renamingId === innerId
        const dropBefore   = dropTarget?.id === innerId && dropTarget.pos === 'before'
        const dropAfter    = dropTarget?.id === innerId && dropTarget.pos === 'after'

        return (
          <div key={innerId}>
            {/* ── drop-before indicator ── */}
            {dropBefore && (
              <div className="h-[2px] bg-blue-400 rounded-full mx-3 pointer-events-none" />
            )}

            <div
              ref={(node) => {
                if (node) rowRefs.current.set(innerId, node)
                else rowRefs.current.delete(innerId)
              }}
              draggable={!isRenaming}
              onDragStart={(e) => onDragStart(e, innerId)}
              onDragOver={(e) => onDragOver(e, innerId)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, el)}
              onClick={() => handleClick(el)}
              style={{ paddingLeft: 6 + depth * 14 }}
              className={`group flex items-center gap-1.5 pr-3 py-1.5 cursor-pointer
                select-none text-xs transition-colors ${
                  isDragging ? 'opacity-40' : ''
                } ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              {/* Drag handle */}
              <span className="shrink-0 text-gray-300 group-hover:text-gray-400 cursor-grab">
                <GripVertical size={12} />
              </span>

              {/* Type colour dot */}
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />

              {/* Name / rename input */}
              {isRenaming ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => commitRename(el)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter')  { e.preventDefault(); commitRename(el) }
                    if (e.key === 'Escape') { e.preventDefault(); cancelRename() }
                    e.stopPropagation()
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 min-w-0 bg-transparent border-b border-blue-400
                    outline-none text-xs text-gray-900 px-0"
                />
              ) : (
                <span
                  className="flex-1 min-w-0 truncate"
                  onDoubleClick={(e) => startRename(el, e)}
                >
                  {name}
                </span>
              )}
            </div>

            {/* ── drop-after indicator ── */}
            {dropAfter && (
              <div className="h-[2px] bg-blue-400 rounded-full mx-3 pointer-events-none" />
            )}
          </div>
        )
      })}
    </div>
  )
}
