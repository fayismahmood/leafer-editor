import { editorStore, setActiveTool } from '#/store/editor'
import { useStore } from '@tanstack/react-store'
import { tools } from './editor/tools'


export function Toolbar() {
  const activeTool = useStore(editorStore, (s) => s.activeTool)

  return (
    <div className="flex  gap-1 p-2 bg-white border-r border-gray-200  shrink-0 fixed rounded-lg left-1/2 translate-x-[-50%] bottom-4 z-10">
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
