import { useStore } from '@tanstack/react-store'
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  Star,
  Type,
  ImageIcon,
  Frame,
} from 'lucide-react'
import { editorStore, setActiveTool, type ToolType } from '#/store/editor'

interface ToolButton {
  tool: ToolType
  label: string
  icon: React.ReactNode
  shortcut?: string
}

const tools: ToolButton[] = [
  { tool: 'select', label: 'Select', icon: <MousePointer2 size={20} />, shortcut: 'V' },
  { tool: 'rect', label: 'Rectangle', icon: <Square size={20} />, shortcut: 'R' },
  { tool: 'ellipse', label: 'Ellipse', icon: <Circle size={20} />, shortcut: 'O' },
  { tool: 'line', label: 'Line', icon: <Minus size={20} />, shortcut: 'L' },
  { tool: 'star', label: 'Star', icon: <Star size={20} />, shortcut: 'S' },
  { tool: 'text', label: 'Text', icon: <Type size={20} />, shortcut: 'T' },
  { tool: 'image', label: 'Image', icon: <ImageIcon size={20} />, shortcut: 'I' },
  { tool: 'frame', label: 'Frame', icon: <Frame size={20} />, shortcut: 'F' },
]

export function Toolbar() {
  const activeTool = useStore(editorStore, (s) => s.activeTool)

  return (
    <div className="flex flex-col gap-1 p-2 bg-white border-r border-gray-200 w-12 shrink-0">
      {tools.map(({ tool, label, icon }) => (
        <button
          key={tool}
          type="button"
          title={`${label}${tool === 'select' ? ' (V)' : ` (${tool.charAt(0).toUpperCase()})`}`}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            activeTool === tool
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTool(tool)}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
