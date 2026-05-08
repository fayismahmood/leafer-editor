import type { ComponentType } from 'react'
import { useSelector } from '@tanstack/react-store'
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

export function ToolPropertiesPanel() {
  const activeTool = useSelector(editorStore, (s) => s.activeTool)
  const Component  = toolPropertiesMap[activeTool]

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 bg-gray-50 border-b-2 border-gray-200 shrink-0">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none mb-1">
          Properties
        </p>
        <h2 className="text-base font-semibold text-gray-900 leading-snug">
          {TOOL_LABELS[activeTool]}
        </h2>
      </div>

      {/* ── Sections — divide-y injects a border between every direct child ── */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
        <Component />
      </div>
    </div>
  )
}
