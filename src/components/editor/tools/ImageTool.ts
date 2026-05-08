import { Rect } from 'leafer-ui'
import type { IUI } from 'leafer-ui'
import type { App } from 'leafer-ui'
import { ShapeTool } from './ShapeTool'
import type { ToolCreateOptions } from './types'
import { getPendingImageUrl, clearPendingImageUrl } from '#/utils/imagePicker'
import { setActiveTool } from '#/store/editor'

/**
 * Secondary drag-to-place flow (primary flow is click → picker in Toolbar).
 * Reads the pending image URL set by the picker and creates a Rect with
 * an image fill at the dragged bounds.
 */
export class ImageTool extends ShapeTool {
  constructor() {
    super('image')
  }

  create(options: ToolCreateOptions): IUI {
    const { x, y, width = 0, height = 0 } = options
    const url = getPendingImageUrl()

    return new Rect({
      x, y, width, height,
      editable: true,
      fill: url
        ? { type: 'image', url, mode: 'cover' }
        : { r: 180, g: 180, b: 180 },
    } as any)
  }

  protected override onCreated(_element: IUI, _app: InstanceType<typeof App>): void {
    clearPendingImageUrl()
    setActiveTool('select')
  }
}
