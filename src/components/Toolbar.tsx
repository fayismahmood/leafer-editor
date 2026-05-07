import { editorStore, setActiveTool } from '#/store/editor'
import { useStore } from '@tanstack/react-store'
import { toolGroups } from './editor/tools'
import { ToolbarGroup } from './ToolbarGroup'

export function Toolbar() {
  const activeTool = useStore(editorStore, (s) => s.activeTool)

  return (
    <div className="flex items-center gap-1 p-2 bg-white border border-gray-200 shadow-lg rounded-xl fixed left-1/2 -translate-x-1/2 bottom-4 z-10">
      {toolGroups.map((group, i) => (
        <div key={group.label} className="flex items-center gap-1">
          {i > 0 && <div className="w-px h-5 bg-gray-200 mx-0.5" />}
          <ToolbarGroup
            label={group.label}
            tools={group.tools}
            activeTool={activeTool}
            onSelect={setActiveTool}
          />
        </div>
      ))}
    </div>
  )
}
