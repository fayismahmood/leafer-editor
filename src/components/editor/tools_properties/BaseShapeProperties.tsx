import type { ReactNode } from 'react'
import { useSelector } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import {
  applyFill,
  applyStroke,
  applyStrokeWidth,
  applyStrokeAlign,
  applyStrokeCap,
  applyStrokeJoin,
  applyOpacity,
  applyBlendMode,
} from './selectionActions'
import { Section, ColorField, NumberField, SliderField, SelectField, ToggleField } from './fields'
import { ShadowSection } from './ShadowSection'
import type { BlendMode } from '#/store/editor'

export interface BaseShapePropertiesProps {
  showFill?: boolean
  showStroke?: boolean
  showOpacity?: boolean
  children?: ReactNode
}

const STROKE_ALIGN_OPTIONS = [
  { value: 'center',  label: 'Center'  },
  { value: 'inside',  label: 'Inside'  },
  { value: 'outside', label: 'Outside' },
]

const STROKE_CAP_OPTIONS = [
  { value: 'none',   label: 'None'   },
  { value: 'round',  label: 'Round'  },
  { value: 'square', label: 'Square' },
]

const STROKE_JOIN_OPTIONS = [
  { value: 'miter', label: 'Miter' },
  { value: 'round', label: 'Round' },
  { value: 'bevel', label: 'Bevel' },
]

const BLEND_MODE_OPTIONS: { value: BlendMode; label: string }[] = [
  { value: 'normal',      label: 'Normal'      },
  { value: 'multiply',    label: 'Multiply'    },
  { value: 'screen',      label: 'Screen'      },
  { value: 'overlay',     label: 'Overlay'     },
  { value: 'darken',      label: 'Darken'      },
  { value: 'lighten',     label: 'Lighten'     },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn',  label: 'Color Burn'  },
  { value: 'hard-light',  label: 'Hard Light'  },
  { value: 'soft-light',  label: 'Soft Light'  },
  { value: 'difference',  label: 'Difference'  },
  { value: 'exclusion',   label: 'Exclusion'   },
  { value: 'hue',         label: 'Hue'         },
  { value: 'saturation',  label: 'Saturation'  },
  { value: 'color',       label: 'Color'       },
  { value: 'luminosity',  label: 'Luminosity'  },
]

export function BaseShapeProperties({
  showFill = true,
  showStroke = true,
  showOpacity = true,
  children,
}: BaseShapePropertiesProps) {
  const fillColor   = useSelector(editorStore, (s) => s.fillColor)
  const strokeColor = useSelector(editorStore, (s) => s.strokeColor)
  const strokeWidth = useSelector(editorStore, (s) => s.strokeWidth)
  const strokeAlign = useSelector(editorStore, (s) => s.strokeAlign)
  const strokeCap   = useSelector(editorStore, (s) => s.strokeCap)
  const strokeJoin  = useSelector(editorStore, (s) => s.strokeJoin)
  const opacity     = useSelector(editorStore, (s) => s.opacity)
  const blendMode   = useSelector(editorStore, (s) => s.blendMode)
  const scaleOnResize = useSelector(editorStore, (s) => s.scaleOnResize)

  return (
    <>
      {showFill && (
        <Section title="Fill">
          <ColorField label="Color" value={fillColor} onChange={applyFill} />
        </Section>
      )}

      <Section title='layout'>
              <ToggleField
                label="Scale on Resize"
                value={scaleOnResize}
                onChange={(v) => editorStore.setState((state) => ({ ...state, scaleOnResize: v }))}
              />
          </Section>

      {showStroke && (
        <Section title="Stroke">
          <ColorField label="Color" value={strokeColor} onChange={applyStroke} />
          <NumberField
            label="Width"
            value={strokeWidth}
            onChange={applyStrokeWidth}
            min={0}
            max={50}
            step={0.5}
            unit="px"
          />

          {/* Align / Cap / Join in a 3-col grid */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {([
              { label: 'Align', value: strokeAlign, opts: STROKE_ALIGN_OPTIONS, fn: (v: string) => applyStrokeAlign(v as typeof strokeAlign) },
              { label: 'Cap',   value: strokeCap,   opts: STROKE_CAP_OPTIONS,   fn: (v: string) => applyStrokeCap(v as typeof strokeCap)     },
              { label: 'Join',  value: strokeJoin,  opts: STROKE_JOIN_OPTIONS,  fn: (v: string) => applyStrokeJoin(v as typeof strokeJoin)   },
            ] as const).map(({ label, value, opts, fn }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide text-center leading-none">
                  {label}
                </span>
                <select
                  value={value}
                  onChange={(e) => fn(e.target.value)}
                  className="w-full h-7 text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-1.5
                    focus:outline-none focus:border-blue-400 focus:bg-white transition-colors
                    appearance-none cursor-pointer text-center"
                >
                  {opts.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </Section>
      )}

      {showOpacity && (
        <Section title="Appearance">
          <SliderField
            label="Opacity"
            value={Math.round(opacity * 100)}
            min={0}
            max={100}
            onChange={(v) => applyOpacity(v / 100)}
            displayValue={`${Math.round(opacity * 100)}%`}
          />
          <SelectField
            label="Blend"
            value={blendMode}
            options={BLEND_MODE_OPTIONS}
            onChange={(v) => applyBlendMode(v as BlendMode)}
          />
        </Section>
      )}

      <ShadowSection />

      {children}
    </>
  )
}
