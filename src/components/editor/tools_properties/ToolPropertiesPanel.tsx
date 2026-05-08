import type { ComponentType } from 'react'
import { useStore } from '@tanstack/react-store'
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
  select: SelectProperties,
  rect: RectProperties,
  ellipse: EllipseProperties,
  line: LineProperties,
  pen: PenProperties,
  text: TextProperties,
  frame: FrameProperties,
  star: StarProperties,
  image: BaseShapeProperties,
}

export function ToolPropertiesPanel() {
  const activeTool = useStore(editorStore, (s) => s.activeTool)
  const Component = toolPropertiesMap[activeTool]

  return (
    <div className="w-56 bg-white border-l border-gray-200 p-3 flex flex-col gap-4 overflow-y-auto shrink-0">
      <h3 className="text-sm font-semibold text-gray-700">Properties</h3>
      <Component />
    </div>
  )
}
