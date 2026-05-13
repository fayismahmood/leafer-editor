import { editorStore, setActiveTool } from '#/store/editor'
import type { ToolType } from '#/store/editor'
import { useSelector } from '@tanstack/react-store'
import { toolGroups } from './editor/tools'
import { ToolbarGroup } from './ToolbarGroup'
import { FramePopover } from './FramePopover'
import { openImagePicker, loadImageSize } from '#/utils/imagePicker'
import { getCanvasApp } from '#/utils/appInstance'
import { Rect } from 'leafer-ui'

async function handleImageTool() {
  const url = await openImagePicker()
  if (!url) return

  const app = getCanvasApp()
  if (!app) return

  const { w: nw, h: nh } = await loadImageSize(url)

  const MAX = 400
  const scale = Math.min(1, MAX / Math.max(nw, nh))
  const w = Math.round(nw * scale)
  const h = Math.round(nh * scale)

  // Place near top-left of the canvas with a small offset so it's immediately visible
  const el = new Rect({
    x: 60,
    y: 60,
    width:  w,
    height: h,
    editable: true,
    fill: { type: 'image', url, mode: 'cover' },
  } as any)

  app.tree.add(el)
  app.editor?.select(el)
  setActiveTool('select')
}

export function Toolbar() {
  const activeTool = useSelector(editorStore, (s) => s.activeTool)

  function handleSelect(tool: ToolType) {
    if (tool === 'image') {
      handleImageTool()   // async — non-blocking
    } else {
      setActiveTool(tool)
    }
  }

  return (
    <div className="flex items-center gap-1 p-2 bg-white border border-gray-200 shadow-lg rounded-xl fixed left-1/2 -translate-x-1/2 bottom-4 z-10">
      {toolGroups.map((group, i) => (
        <div key={group.label} className="flex items-center gap-1">
          {i > 0 && <div className="w-px h-5 bg-gray-200 mx-0.5" />}
          {group.label === 'Layout' ? (
            <FramePopover shortcut={group.tools[0].shortcut} />
          ) : (
            <ToolbarGroup
              label={group.label}
              tools={group.tools}
              activeTool={activeTool}
              onSelect={handleSelect}
            />
          )}
        </div>
      ))}
    </div>
  )
}
