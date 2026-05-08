import type { App } from 'leafer-ui'
import { EditorEvent } from '@leafer-in/editor'
import { parseLeaferFill } from '#/components/editor/tools_properties/fields/ColorPicker'
import {
  editorStore,
  setSelectedElements,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setStrokeAlign,
  setStrokeCap,
  setStrokeJoin,
  setOpacity,
  setBlendMode,
  setFontSize,
  setFontFamily,
  setFontWeight,
  setItalic,
  setTextAlign,
  setCornerRadius,
  setStarPoints,
  type StrokeAlign,
  type StrokeCap,
  type StrokeJoin,
  type BlendMode,
  type TextAlign,
} from '#/store/editor'

export function forceSelectModeInSelectTool(app: App) {
  editorStore.subscribe((state) => {
    if (state.activeTool === 'select') {
      app.editor.config.multipleSelect = true
    } else {
      app.editor.config.multipleSelect = false
    }
  })
}

export function trackEditorSelection(app: App) {
  app.editor.on(EditorEvent.SELECT, (e: InstanceType<typeof EditorEvent>) => {
    const list = e.list
    setSelectedElements(list)

    const el = list[0] as any
    if (!el) return

    if (el.fill != null) setFillColor(parseLeaferFill(el.fill))
    if (el.stroke != null) setStrokeColor(parseLeaferFill(el.stroke))
    if (typeof el.strokeWidth === 'number') setStrokeWidth(el.strokeWidth)
    if (typeof el.strokeAlign === 'string') setStrokeAlign(el.strokeAlign as StrokeAlign)
    if (typeof el.strokeCap === 'string') setStrokeCap(el.strokeCap as StrokeCap)
    if (typeof el.strokeJoin === 'string') setStrokeJoin(el.strokeJoin as StrokeJoin)
    if (typeof el.opacity === 'number') setOpacity(el.opacity)
    if (typeof el.blendMode === 'string') setBlendMode(el.blendMode as BlendMode)
    if (typeof el.cornerRadius === 'number') setCornerRadius(el.cornerRadius)
    if (typeof el.corners === 'number') setStarPoints(el.corners)
    if (typeof el.fontSize === 'number') setFontSize(el.fontSize)
    if (typeof el.fontFamily === 'string') setFontFamily(el.fontFamily)
    if (typeof el.fontWeight === 'number') setFontWeight(el.fontWeight)
    if (typeof el.italic === 'boolean') setItalic(el.italic)
    if (typeof el.textAlign === 'string') setTextAlign(el.textAlign as TextAlign)
  })
}
