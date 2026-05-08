import type { ReactNode } from 'react'
import { useStore } from '@tanstack/react-store'
import {
  editorStore,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setOpacity,
} from '#/store/editor'
import { Section, ColorField, NumberField, SliderField } from './fields'

export interface BaseShapePropertiesProps {
  showFill?: boolean
  showStroke?: boolean
  showOpacity?: boolean
  children?: ReactNode
}

export function BaseShapeProperties({
  showFill = true,
  showStroke = true,
  showOpacity = true,
  children,
}: BaseShapePropertiesProps) {
  const fillColor = useStore(editorStore, (s) => s.fillColor)
  const strokeColor = useStore(editorStore, (s) => s.strokeColor)
  const strokeWidth = useStore(editorStore, (s) => s.strokeWidth)
  const opacity = useStore(editorStore, (s) => s.opacity)

  return (
    <>
      {showFill && (
        <Section title="Fill">
          <ColorField label="Color" value={fillColor} onChange={setFillColor} />
        </Section>
      )}

      {showStroke && (
        <Section title="Stroke">
          <ColorField label="Color" value={strokeColor} onChange={setStrokeColor} />
          <NumberField
            label="Width"
            value={strokeWidth}
            onChange={setStrokeWidth}
            min={0}
            max={50}
            step={0.5}
          />
        </Section>
      )}

      {showOpacity && (
        <Section title="Opacity">
          <SliderField
            label="Value"
            value={Math.round(opacity * 100)}
            min={0}
            max={100}
            onChange={(v) => setOpacity(v / 100)}
            displayValue={`${Math.round(opacity * 100)}%`}
          />
        </Section>
      )}

      {children}
    </>
  )
}
