import { useRef, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { GripVertical, Trash2, Lock, LockOpen, Square, Circle, Minus, Star, Type, PenLine, Frame, Group, Layers } from 'lucide-react'
import { editorStore, setActiveTool } from '#/store/editor'
import { getCanvasApp } from '#/utils/appInstance'
import type { IUI } from 'leafer-ui'
import type { ComponentType } from 'react'

interface LayerRow { el: IUI; depth: number }

type DropPos = 'before' | 'after' | 'inside'

const TAG_COLOR: Record<string, string> = {
  Rect:    '#4A90D9',
  Ellipse: '#E85D75',
  Line:    '#555555',
  Star:    '#F5A623',
  Text:    '#7B68EE',
  Path:    '#50C878',
  Frame:   '#94a3b8',
}

const TAG_ICON: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Rect:    Square,
  Ellipse: Circle,
  Line:    Minus,
  Star:    Star,
  Text:    Type,
  Path:    PenLine,
  Frame:   Frame,
  Group:   Group,
}

function collectRows(node: any, depth = 0, out: LayerRow[] = []): LayerRow[] {
  const children: any[] = node?.children
  if (!Array.isArray(children)) return out

  for (const child of [...children].reverse()) {
    if (!child.__tag || child.__tag === 'Leafer' || child.__tag === 'App') continue
    out.push({ el: child as IUI, depth })
    if (Array.isArray(child.children) && child.children.length > 0) {
      collectRows(child, depth + 1, out)
    }
  }
  return out
}

export function LayersPanel() {
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)
  const selectedSet      = new Set<IUI>(selectedElements)

  const [tick, setTick] = useState(0)

  const [renamingId,  setRenamingId]  = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const [draggingId,  setDraggingId]  = useState<number | null>(null)
  const [dropTarget,  setDropTarget]  = useState<{ id: number; pos: DropPos } | null>(null)

  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const app  = getCanvasApp()
  const rows = app ? collectRows(app.tree) : []

  // ── rename ──

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

  // ── actions ──

  function handleDelete(el: any, e: React.MouseEvent) {
    e.stopPropagation()
    el.remove()
    app?.editor?.cancel()
    setTick((t) => t + 1)
  }

  function handleToggleLock(el: any, e: React.MouseEvent) {
    e.stopPropagation()
    el.locked = !el.locked
    app?.editor?.update()
    setTick((t) => t + 1)
  }

  // ── drag ──

  function onDragStart(e: React.DragEvent, innerId: number) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(innerId))
    setDraggingId(innerId)
  }

  function onDragOver(e: React.DragEvent, innerId: number, isBranch: boolean) {
    e.preventDefault()
    if (innerId === draggingId) return

    const rowEl = rowRefs.current.get(innerId)
    const rect  = rowEl?.getBoundingClientRect()
    if (!rect) return

    const ratio = (e.clientY - rect.top) / rect.height
    let pos: DropPos

    if (isBranch && ratio > 0.25 && ratio < 0.75) {
      pos = 'inside'
    } else if (ratio < 0.5) {
      pos = 'before'
    } else {
      pos = 'after'
    }

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

    // Prevent dropping a parent onto its own descendant
    if (isDescendant(dragEl, targetEl)) return

    dragEl.remove()

    if (dropTarget.pos === 'inside') {
      targetEl.add(dragEl)
    } else {
      const targetParent = targetEl.parent
      if (dropTarget.pos === 'before') {
        targetParent.addAfter(dragEl, targetEl)
      } else {
        targetParent.addBefore(dragEl, targetEl)
      }
    }

    setDraggingId(null)
    setDropTarget(null)
    setTick((t) => t + 1)
  }

  function onDragEnd() {
    setDraggingId(null)
    setDropTarget(null)
  }

  function isDescendant(ancestor: any, child: any): boolean {
    let node = child
    while (node) {
      if (node === ancestor) return true
      node = node.parent
    }
    return false
  }

  // ── select ──

  function handleClick(el: IUI) {
    const a = getCanvasApp()
    if (!a) return
    a.editor?.select(el)
    setActiveTool('select')
  }

  // ── render ──

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
        const isBranch = Array.isArray((el as any).children) && (el as any).children.length > 0

        const isSelected   = selectedSet.has(el)
        const isDragging   = draggingId === innerId
        const isRenaming   = renamingId === innerId
        const dropBefore   = dropTarget?.id === innerId && dropTarget.pos === 'before'
        const dropAfter    = dropTarget?.id === innerId && dropTarget.pos === 'after'
        const dropInside   = dropTarget?.id === innerId && dropTarget.pos === 'inside'

        const IconComponent = TAG_ICON[tag] ?? Layers

        return (
          <div key={innerId}>
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
              onDragOver={(e) => onDragOver(e, innerId, isBranch)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, el)}
              onClick={() => handleClick(el)}
              style={{ paddingLeft: 6 + depth * 14 }}
              className={`group flex items-center gap-1.5 pr-1.5 py-1.5 cursor-pointer
                select-none text-xs transition-colors ${
                  isDragging ? 'opacity-40' : ''
                } ${
                  dropInside
                    ? 'bg-blue-100 ring-1 ring-inset ring-blue-300 rounded'
                    : ''
                } ${
                  isSelected
                    ? dropInside ? 'bg-blue-100' : 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="shrink-0 text-gray-300 group-hover:text-gray-400 cursor-grab">
                <GripVertical size={12} />
              </span>

              {IconComponent ? (
                <span className="shrink-0" style={{ color }}>
                  <IconComponent size={13} />
                </span>
              ) : (
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
              )}

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

              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title={(el as any).locked ? 'Unlock' : 'Lock'}
                  className="flex items-center justify-center w-4 h-4 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                  onClick={(e) => handleToggleLock(el, e)}
                >
                  {(el as any).locked ? <Lock size={10} /> : <LockOpen size={10} />}
                </button>
                <button
                  type="button"
                  title="Delete"
                  className="flex items-center justify-center w-4 h-4 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                  onClick={(e) => handleDelete(el, e)}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>

            {dropAfter && (
              <div className="h-[2px] bg-blue-400 rounded-full mx-3 pointer-events-none" />
            )}
          </div>
        )
      })}
    </div>
  )
}
