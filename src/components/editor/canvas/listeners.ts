import type { App } from 'leafer-ui'
import { EditorEvent } from '@leafer-in/editor'
import { parseLeaferFill } from '#/components/editor/tools_properties/fields/ColorPicker'
import { editorStore } from '#/store/editor'
import type { EditorState, StrokeAlign, StrokeCap, StrokeJoin, BlendMode, TextAlign } from '#/store/editor'

export function forceSelectModeInSelectTool(app: App) {
  editorStore.subscribe((state) => {
    app.editor.config.multipleSelect = state.activeTool === 'select'
  })
}

export function trackEditorSelection(app: App) {
  app.editor.on(EditorEvent.AFTER_SELECT, (_e: InstanceType<typeof EditorEvent>) => {
    // Read directly from the editor's settled list rather than the event payload,
    // which can carry a stale or reused reference in some Leafer versions.
    const list = app.editor.list
    const el   = list[0] as any

    editorStore.setState((state: EditorState) => {
      // Always spread into a new array — guarantees a new reference so every
      // useSelector / useEffect that depends on selectedElements re-evaluates.
      const next: EditorState = { ...state, selectedElements: [...list] }

      if (!el) return next

      // All property syncs in one atomic update → no partial-state renders
      if (el.fill   != null)  next.fillColor   = parseLeaferFill(el.fill)
      if (el.stroke != null)  next.strokeColor = parseLeaferFill(el.stroke)

      if (typeof el.strokeWidth === 'number') next.strokeWidth = el.strokeWidth
      if (typeof el.opacity     === 'number') next.opacity     = el.opacity

      if (el.strokeAlign) next.strokeAlign = el.strokeAlign as StrokeAlign
      if (el.strokeCap)   next.strokeCap   = el.strokeCap   as StrokeCap
      if (el.strokeJoin)  next.strokeJoin  = el.strokeJoin  as StrokeJoin
      if (el.blendMode)   next.blendMode   = el.blendMode   as BlendMode

      if (typeof el.cornerRadius === 'number') next.cornerRadius = el.cornerRadius
      if (typeof el.corners      === 'number') next.starPoints   = el.corners

      if (typeof el.fontSize   === 'number')  next.fontSize   = el.fontSize
      if (typeof el.fontFamily === 'string')  next.fontFamily = el.fontFamily
      if (typeof el.fontWeight === 'number')  next.fontWeight = el.fontWeight
      if (typeof el.italic     === 'boolean') next.italic     = el.italic
      if (el.textAlign) next.textAlign = el.textAlign as TextAlign

      return next
    })
  })
}
