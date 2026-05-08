import { toLeaferPaint } from './fields/ColorPicker'
import { loadGoogleFontAndWait } from './fields/FontPicker/loader'
import {
  editorStore,
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
  type PaintValue,
  type StrokeAlign,
  type StrokeCap,
  type StrokeJoin,
  type BlendMode,
  type TextAlign,
} from '#/store/editor'

export function selected() {
  return editorStore.state.selectedElements
}

export function applyToSelection(changes: Record<string, unknown>) {
  selected().forEach((el) => el.set(changes))
}

// Fill
export function applyFill(color: PaintValue) {
  setFillColor(color)
  applyToSelection({ fill: toLeaferPaint(color) })
}

// Stroke appearance
export function applyStroke(color: PaintValue) {
  setStrokeColor(color)
  applyToSelection({ stroke: toLeaferPaint(color) })
}

export function applyStrokeWidth(width: number) {
  setStrokeWidth(width)
  applyToSelection({ strokeWidth: width })
}

export function applyStrokeAlign(value: StrokeAlign) {
  setStrokeAlign(value)
  applyToSelection({ strokeAlign: value })
}

export function applyStrokeCap(value: StrokeCap) {
  setStrokeCap(value)
  applyToSelection({ strokeCap: value })
}

export function applyStrokeJoin(value: StrokeJoin) {
  setStrokeJoin(value)
  applyToSelection({ strokeJoin: value })
}

// Appearance
export function applyOpacity(opacity: number) {
  setOpacity(opacity)
  applyToSelection({ opacity })
}

export function applyBlendMode(mode: BlendMode) {
  setBlendMode(mode)
  applyToSelection({ blendMode: mode })
}

// Shape
export function applyCornerRadius(radius: number) {
  setCornerRadius(radius)
  applyToSelection({ cornerRadius: radius })
}

export function applyStarPoints(points: number) {
  setStarPoints(points)
  applyToSelection({ corners: points })
}

// Text
export function applyFontSize(size: number) {
  setFontSize(size)
  applyToSelection({ fontSize: size })
}

export function applyFontFamily(family: string) {
  setFontFamily(family)
  const els = selected()
  // Apply immediately so UI feels instant (canvas may briefly use fallback)
  els.forEach((el) => el.set({ fontFamily: family }))
  // Re-apply once the font file is actually parsed — forces Leafer canvas repaint
  loadGoogleFontAndWait(family).then(() => {
    els.forEach((el) => el.set({ fontFamily: family }))
  })
}

export function applyFontWeight(weight: number) {
  setFontWeight(weight)
  applyToSelection({ fontWeight: weight })
}

export function applyItalic(value: boolean) {
  setItalic(value)
  applyToSelection({ italic: value })
}

export function applyTextAlign(value: TextAlign) {
  setTextAlign(value)
  applyToSelection({ textAlign: value })
}
