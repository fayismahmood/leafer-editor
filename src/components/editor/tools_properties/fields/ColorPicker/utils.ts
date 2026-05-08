import type { PaintValue, LinearGradient, RadialGradient, ColorStop } from './types'

export function uid() {
  return Math.random().toString(36).slice(2, 8)
}

export function isLinearGradient(v: PaintValue): v is LinearGradient {
  return typeof v === 'object' && v.type === 'linear'
}

export function isRadialGradient(v: PaintValue): v is RadialGradient {
  return typeof v === 'object' && v.type === 'radial'
}

export function isGradient(v: PaintValue): v is LinearGradient | RadialGradient {
  return typeof v === 'object'
}

export function toCssGradient(grad: LinearGradient | RadialGradient): string {
  const stops = [...grad.stops]
    .sort((a, b) => a.offset - b.offset)
    .map((s) => `${s.color} ${(s.offset * 100).toFixed(1)}%`)
    .join(', ')

  return grad.type === 'linear'
    ? `linear-gradient(${grad.angle}deg, ${stops})`
    : `radial-gradient(circle, ${stops})`
}

/**
 * Convert our internal PaintValue to the format Leafer's el.set() expects.
 *
 * Linear angle convention (matches CSS linear-gradient):
 *   0°  = top → bottom
 *   90° = left → right
 *
 * Leafer requires { type: 'percent', x, y } for normalized coordinates.
 * Bare { x, y } without a type is treated as pixel values.
 */
export function toLeaferPaint(paint: PaintValue): unknown {
  if (typeof paint === 'string') return paint

  const stops = [...paint.stops]
    .sort((a, b) => a.offset - b.offset)
    .map((s) => ({ offset: s.offset, color: s.color }))

  if (paint.type === 'linear') {
    const rad = (paint.angle * Math.PI) / 180
    return {
      type: 'linear',
      from: {
        type: 'percent',
        x: +(0.5 - 0.5 * Math.sin(rad)).toFixed(4),
        y: +(0.5 - 0.5 * Math.cos(rad)).toFixed(4),
      },
      to: {
        type: 'percent',
        x: +(0.5 + 0.5 * Math.sin(rad)).toFixed(4),
        y: +(0.5 + 0.5 * Math.cos(rad)).toFixed(4),
      },
      stops,
    }
  }

  // Radial: omit from/to so Leafer uses its defaults (center → bottom)
  return { type: 'radial', stops }
}

// ─── IAlign string → normalised {x, y} ────────────────────────────────────────

const ALIGN_MAP: Record<string, { x: number; y: number }> = {
  'top':          { x: 0.5, y: 0   },
  'bottom':       { x: 0.5, y: 1   },
  'left':         { x: 0,   y: 0.5 },
  'right':        { x: 1,   y: 0.5 },
  'top-left':     { x: 0,   y: 0   },
  'top-right':    { x: 1,   y: 0   },
  'bottom-left':  { x: 0,   y: 1   },
  'bottom-right': { x: 1,   y: 1   },
  'center':       { x: 0.5, y: 0.5 },
}

function resolvePoint(v: unknown): { x: number; y: number } | null {
  if (v == null) return null
  if (typeof v === 'string') return ALIGN_MAP[v] ?? null
  if (typeof v === 'object') {
    const p = v as any
    // Works for both IUnitPointData (percent/px) and raw {x,y}
    if (typeof p.x === 'number' && typeof p.y === 'number') return { x: p.x, y: p.y }
  }
  return null
}

function angleFromFromTo(from: unknown, to: unknown): number {
  const f = resolvePoint(from) ?? { x: 0.5, y: 0 }  // Leafer default 'top'
  const t = resolvePoint(to)   ?? { x: 0.5, y: 1 }  // Leafer default 'bottom'
  const dx = t.x - f.x
  const dy = t.y - f.y
  // atan2(dx, dy): angle measured from the "down" axis, i.e. our 0° = top→bottom
  const deg = (Math.atan2(dx, dy) * 180) / Math.PI
  return Math.round(((deg % 360) + 360) % 360)
}

// ─── colour object → CSS string ───────────────────────────────────────────────

function colorToString(c: unknown): string {
  if (typeof c === 'string') return c
  if (typeof c === 'object' && c !== null) {
    const { r, g, b, a } = c as any
    return a != null && a < 1 ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`
  }
  return '#000000'
}

// ─── Parse Leafer element fill/stroke back to PaintValue ──────────────────────

export function parseLeaferFill(fill: unknown): PaintValue {
  if (typeof fill === 'string') return fill
  if (typeof fill === 'object' && fill !== null) {
    const g = fill as any
    const rawStops: unknown[] = Array.isArray(g.stops) ? g.stops : []

    const stops: ColorStop[] = rawStops.map((s: any, i, arr) => {
      if (typeof s === 'string') {
        // Plain color string — distribute evenly
        return { id: uid(), offset: arr.length > 1 ? i / (arr.length - 1) : 0, color: s }
      }
      return {
        id: uid(),
        offset: typeof s.offset === 'number' ? s.offset : i / (arr.length - 1 || 1),
        color: colorToString(s.color),
      }
    })

    if (g.type === 'linear') {
      return { type: 'linear', angle: angleFromFromTo(g.from, g.to), stops }
    }
    if (g.type === 'radial') {
      return { type: 'radial', stops }
    }
  }
  return '#000000'
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export function interpolateColor(stops: ColorStop[], offset: number): string {
  const sorted = [...stops].sort((a, b) => a.offset - b.offset)
  if (!sorted.length) return '#000000'
  if (offset <= sorted[0].offset) return sorted[0].color
  if (offset >= sorted[sorted.length - 1].offset) return sorted[sorted.length - 1].color
  for (let i = 0; i < sorted.length - 1; i++) {
    if (offset >= sorted[i].offset && offset <= sorted[i + 1].offset) {
      const t = (offset - sorted[i].offset) / (sorted[i + 1].offset - sorted[i].offset)
      return t < 0.5 ? sorted[i].color : sorted[i + 1].color
    }
  }
  return '#000000'
}

export function defaultLinearGradient(baseColor: string): LinearGradient {
  return {
    type: 'linear',
    angle: 0,
    stops: [
      { id: uid(), offset: 0, color: baseColor },
      { id: uid(), offset: 1, color: 'rgba(255,255,255,0)' },
    ],
  }
}

export function defaultRadialGradient(baseColor: string): RadialGradient {
  return {
    type: 'radial',
    stops: [
      { id: uid(), offset: 0, color: baseColor },
      { id: uid(), offset: 1, color: 'rgba(255,255,255,0)' },
    ],
  }
}

export function paintToDisplayString(v: PaintValue): string {
  if (typeof v === 'string') return v
  return v.type === 'linear' ? `${v.angle}°` : 'radial'
}
