export interface ColorStop {
  id: string
  offset: number  // 0–1
  color: string   // hex or rgba string
}

export interface LinearGradient {
  type: 'linear'
  angle: number   // 0–360 degrees
  stops: ColorStop[]
}

export interface RadialGradient {
  type: 'radial'
  stops: ColorStop[]
}

export type PaintValue = string | LinearGradient | RadialGradient
