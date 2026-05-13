import { editorStore, setActiveTool } from '#/store/editor'
import type { ToolType } from '#/store/editor'
import { useSelector } from '@tanstack/react-store'
import { toolGroups } from './editor/tools'
import { ToolbarGroup } from './ToolbarGroup'
import { FramePopover } from './FramePopover'
import { openImagePicker, loadImageSize, getPendingImageUrl, clearPendingImageUrl } from '#/utils/imagePicker'
import { getCanvasApp } from '#/utils/appInstance'
import { Rect, PointerEvent } from 'leafer-ui'

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

  setActiveTool('image')

  function onClick(e: any) {
    if (!getPendingImageUrl()) {
      app.off(PointerEvent.CLICK, onClick)
      return
    }

    const target = e.target
    if (target && target !== (app as any).tree && typeof (target as any).fill !== 'undefined') {
      target.set({ fill: { type: 'image', url, mode: 'cover' as any } })
      app.editor?.select(target)
    } else {
      const pagePoint = e.getPagePoint()
      const el = new Rect({
        x: pagePoint.x - w / 2,
        y: pagePoint.y - h / 2,
        width: w,
        height: h,
        editable: true,
        fill: { type: 'image', url, mode: 'cover' as any },
      } as any)
      app.tree.add(el)
      app.editor?.select(el)
    }

    clearPendingImageUrl()
    app.off(PointerEvent.CLICK, onClick)
    setActiveTool('select')
  }

  app.on(PointerEvent.CLICK, onClick)
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
