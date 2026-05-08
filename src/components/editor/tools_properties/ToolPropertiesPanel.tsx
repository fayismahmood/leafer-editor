import { useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { useSelector } from '@tanstack/react-store'
import { Layers, SlidersHorizontal } from 'lucide-react'
import { editorStore } from '#/store/editor'
import type { ToolType } from '#/store/editor'
import { SelectProperties } from './SelectProperties'
import { RectProperties } from './RectProperties'
import { EllipseProperties } from './EllipseProperties'
import { LineProperties } from './LineProperties'
import { StarProperties } from './StarProperties'
import { TextProperties } from './TextProperties'
import { PenProperties } from './PenProperties'
import { FrameProperties } from './FrameProperties'
import { BaseShapeProperties } from './BaseShapeProperties'
import { LayersPanel } from './LayersPanel'

// ── Maps ──────────────────────────────────────────────────────────────────────

const toolPropertiesMap: Record<ToolType, ComponentType> = {
  select:  SelectProperties,
  rect:    RectProperties,
  ellipse: EllipseProperties,
  line:    LineProperties,
  pen:     PenProperties,
  text:    TextProperties,
  frame:   FrameProperties,
  star:    StarProperties,
  image:   BaseShapeProperties,
}

const elementPropertiesMap: Record<string, ComponentType> = {
  Rect:    RectProperties,
  Ellipse: EllipseProperties,
  Line:    LineProperties,
  Star:    StarProperties,
  Text:    TextProperties,
  Path:    PenProperties,
  Frame:   FrameProperties,
}

const TOOL_LABELS: Record<ToolType, string> = {
  select:  'Selection',
  rect:    'Rectangle',
  ellipse: 'Ellipse',
  line:    'Line',
  pen:     'Pen',
  text:    'Text',
  frame:   'Frame',
  star:    'Star',
  image:   'Image',
}

const ELEMENT_LABELS: Record<string, string> = {
  Rect:    'Rectangle',
  Ellipse: 'Ellipse',
  Line:    'Line',
  Star:    'Star',
  Text:    'Text',
  Path:    'Path',
  Frame:   'Frame',
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TAB_WIDTH     = 36
const MIN_WIDTH     = 360
const MAX_WIDTH     = 900
const DEFAULT_WIDTH = 520

type PanelTab = 'properties' | 'layers'

// ── Tab definition ────────────────────────────────────────────────────────────

const TABS: { id: PanelTab; icon: React.ReactNode; title: string }[] = [
  { id: 'properties', icon: <SlidersHorizontal size={14} />, title: 'Properties' },
  { id: 'layers',     icon: <Layers size={14} />,            title: 'Layers'     },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function ToolPropertiesPanel() {
  const [width, setWidth]     = useState(DEFAULT_WIDTH)
  const [activeTab, setActiveTab] = useState<PanelTab>('properties')
  const [collapsed, setCollapsed] = useState(false)
  const dragState = useRef<{ startX: number; startW: number } | null>(null)

  const activeTool       = useSelector(editorStore, (s) => s.activeTool)
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)

  const firstEl  = selectedElements[0] as any
  const elTag    = firstEl?.__tag as string | undefined
  const elementKey = firstEl?.innerId ?? 'none'

  const PropertiesComponent: ComponentType =
    (elTag ? elementPropertiesMap[elTag] : undefined) ?? toolPropertiesMap[activeTool]

  const propertiesLabel =
    (elTag ? ELEMENT_LABELS[elTag] : undefined) ?? TOOL_LABELS[activeTool]

  const headerLabel = activeTab === 'layers' ? 'Layers' : propertiesLabel
  const headerSub   = activeTab === 'layers' ? 'Canvas tree' : 'Properties'

  // ── resize ─────────────────────────────────────────────────────────────────

  function onResizeMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    dragState.current = { startX: e.clientX, startW: width }
    document.body.style.cursor     = 'col-resize'
    document.body.style.userSelect = 'none'

    function onMove(me: MouseEvent) {
      if (!dragState.current) return
      setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH,
        dragState.current.startW - (me.clientX - dragState.current.startX),
      )))
    }
    function onUp() {
      dragState.current = null
      document.body.style.cursor = document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  // ── tab click ──────────────────────────────────────────────────────────────

  function handleTabClick(tab: PanelTab) {
    if (collapsed) {
      setActiveTab(tab)
      setCollapsed(false)
    } else if (activeTab === tab) {
      setCollapsed(true)
    } else {
      setActiveTab(tab)
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{ width: collapsed ? TAB_WIDTH : width }}
      className="bg-white border-l border-gray-200 flex shrink-0 overflow-hidden relative"
    >
      {/* Resize handle */}
      {!collapsed && (
        <div
          onMouseDown={onResizeMouseDown}
          className="absolute left-0 top-0 bottom-0 w-2 z-30 cursor-col-resize group select-none"
        >
          <div className="absolute inset-y-0 left-0 w-0.5 group-hover:w-[3px]
            bg-transparent group-hover:bg-blue-400 group-active:bg-blue-500
            transition-all rounded-r-full" />
        </div>
      )}

      {/* Panel content */}
      {!collapsed && (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <div className="px-4 py-4 bg-gray-50 border-b-2 border-gray-200 shrink-0">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none mb-1">
              {headerSub}
            </p>
            <h2 className="text-base font-semibold text-gray-900 leading-snug truncate">
              {headerLabel}
            </h2>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
            {activeTab === 'properties'
              ? <PropertiesComponent key={elementKey} />
              : <LayersPanel />
            }
          </div>
        </div>
      )}

      {/* Tab strip — always visible, pinned to the right */}
      <div
        style={{ width: TAB_WIDTH }}
        className="shrink-0 bg-gray-50 border-l border-gray-100 flex flex-col items-center py-3 gap-1"
      >
        {TABS.map((tab) => {
          const isActive = !collapsed && activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              title={tab.title}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {tab.icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}
