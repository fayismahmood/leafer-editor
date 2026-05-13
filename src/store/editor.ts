import { Store } from '@tanstack/react-store'
import type { IUI, ILeafer } from 'leafer-ui'
import "@leafer-in/editor";
import type { PaintValue } from '#/components/editor/tools_properties/fields/ColorPicker'
export type { PaintValue }

export type ToolType =
  | 'select'
  | 'rect'
  | 'ellipse'
  | 'line'
  | 'pen'
  | 'text'
  | 'frame'
  | 'star'
  | 'image'

export type StrokeAlign = 'inside' | 'center' | 'outside'
export type StrokeCap = 'none' | 'square' | 'round'
export type StrokeJoin = 'miter' | 'round' | 'bevel'
export type TextAlign = 'left' | 'center' | 'right' | 'justify'
export type BlendMode =
  | 'normal' | 'multiply' | 'screen' | 'overlay'
  | 'darken' | 'lighten' | 'color-dodge' | 'color-burn'
  | 'hard-light' | 'soft-light' | 'difference' | 'exclusion'
  | 'hue' | 'saturation' | 'color' | 'luminosity'

export interface ShadowEffect {
  type: 'drop' | 'inner'
  x: number
  y: number
  blur: number
  spread: number
  color: string
  visible: boolean
}

export interface EditorState {
  activeTool: ToolType
  leafer: ILeafer | null
  selectedElements: IUI[]

  // Fill
  fillColor: PaintValue

  // Stroke
  strokeColor: PaintValue
  strokeWidth: number
  strokeAlign: StrokeAlign
  strokeCap: StrokeCap
  strokeJoin: StrokeJoin

  // Appearance
  opacity: number
  blendMode: BlendMode

  // Shadow
  shadows: ShadowEffect[]

  // Shape
  cornerRadius: number
  starPoints: number

  // Text
  fontSize: number
  fontFamily: string
  fontWeight: number
  italic: boolean
  textAlign: TextAlign
  scaleOnResize: boolean
}

const initialState: EditorState = {
  activeTool: 'select',
  leafer: null,
  selectedElements: [],

  fillColor: '#4A90D9',

  strokeColor: '#333333',
  strokeWidth: 2,
  strokeAlign: 'center',
  strokeCap: 'none',
  strokeJoin: 'miter',

  opacity: 1,
  blendMode: 'normal',

  shadows: [],

  cornerRadius: 0,
  starPoints: 5,

  fontSize: 24,
  fontFamily: 'sans-serif',
  fontWeight: 400,
  italic: false,
  textAlign: 'left',
  scaleOnResize: false
}

export const editorStore = new Store<EditorState>(initialState)

export function setActiveTool(tool: ToolType) {
  editorStore.setState((state) => ({ ...state, activeTool: tool }))
}

export function setLeafer(leafer: ILeafer | null) {
  editorStore.setState((state) => ({ ...state, leafer }))
}

export function setSelectedElements(elements: IUI[]) {
  editorStore.setState((state) => ({ ...state, selectedElements: [...elements] }))
}

export function setFillColor(color: PaintValue) {
  editorStore.setState((state) => ({ ...state, fillColor: color }))
}

export function setStrokeColor(color: PaintValue) {
  editorStore.setState((state) => ({ ...state, strokeColor: color }))
}

export function setStrokeWidth(width: number) {
  editorStore.setState((state) => ({ ...state, strokeWidth: width }))
}

export function setStrokeAlign(value: StrokeAlign) {
  editorStore.setState((state) => ({ ...state, strokeAlign: value }))
}

export function setStrokeCap(value: StrokeCap) {
  editorStore.setState((state) => ({ ...state, strokeCap: value }))
}

export function setStrokeJoin(value: StrokeJoin) {
  editorStore.setState((state) => ({ ...state, strokeJoin: value }))
}

export function setOpacity(opacity: number) {
  editorStore.setState((state) => ({ ...state, opacity }))
}

export function setBlendMode(mode: BlendMode) {
  editorStore.setState((state) => ({ ...state, blendMode: mode }))
}

export function setShadows(shadows: ShadowEffect[]) {
  editorStore.setState((state) => ({ ...state, shadows }))
}

export function setCornerRadius(radius: number) {
  editorStore.setState((state) => ({ ...state, cornerRadius: radius }))
}

export function setStarPoints(points: number) {
  editorStore.setState((state) => ({ ...state, starPoints: points }))
}

export function setFontSize(size: number) {
  editorStore.setState((state) => ({ ...state, fontSize: size }))
}

export function setFontFamily(family: string) {
  editorStore.setState((state) => ({ ...state, fontFamily: family }))
}

export function setFontWeight(weight: number) {
  editorStore.setState((state) => ({ ...state, fontWeight: weight }))
}

export function setItalic(value: boolean) {
  editorStore.setState((state) => ({ ...state, italic: value }))
}

export function setTextAlign(value: TextAlign) {
  editorStore.setState((state) => ({ ...state, textAlign: value }))
}
