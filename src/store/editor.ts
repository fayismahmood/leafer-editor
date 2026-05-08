import { Store } from '@tanstack/react-store'
import type { IUI, ILeafer } from 'leafer-ui'
import "@leafer-in/editor";

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

export interface EditorState {
  activeTool: ToolType
  leafer: ILeafer | null
  selectedElements: IUI[]
  fillColor: string
  strokeColor: string
  strokeWidth: number
  opacity: number
  fontSize: number
  cornerRadius: number
  starPoints: number
}

const initialState: EditorState = {
  activeTool: 'select',
  leafer: null,
  selectedElements: [],
  fillColor: '#4A90D9',
  strokeColor: '#333333',
  strokeWidth: 2,
  opacity: 1,
  fontSize: 24,
  cornerRadius: 0,
  starPoints: 5,
}

export const editorStore = new Store<EditorState>(initialState)

export function setActiveTool(tool: ToolType) {
  editorStore.setState((state) => ({ ...state, activeTool: tool }))
}

export function setLeafer(leafer: ILeafer | null) {
  editorStore.setState((state) => ({ ...state, leafer }))
}

export function setSelectedElements(elements: IUI[]) {
  editorStore.setState((state) => ({ ...state, selectedElements: elements }))
}

export function setFillColor(color: string) {
  editorStore.setState((state) => ({ ...state, fillColor: color }))
}

export function setStrokeColor(color: string) {
  editorStore.setState((state) => ({ ...state, strokeColor: color }))
}

export function setStrokeWidth(width: number) {
  editorStore.setState((state) => ({ ...state, strokeWidth: width }))
}

export function setOpacity(opacity: number) {
  editorStore.setState((state) => ({ ...state, opacity: opacity }))
}

export function setFontSize(size: number) {
  editorStore.setState((state) => ({ ...state, fontSize: size }))
}

export function setCornerRadius(radius: number) {
  editorStore.setState((state) => ({ ...state, cornerRadius: radius }))
}

export function setStarPoints(points: number) {
  editorStore.setState((state) => ({ ...state, starPoints: points }))
}
