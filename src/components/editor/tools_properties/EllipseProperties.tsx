import { useEffect, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import { applyToSelection } from './selectionActions'
import { BaseShapeProperties } from './BaseShapeProperties'
import { Section, NumberField, SliderField } from './fields'

export function EllipseProperties() {
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)
  const el = selectedElements[0] as any

  const [startAngle, setStartAngle] = useState<number>(el?.startAngle ?? 0)
  const [endAngle, setEndAngle] = useState<number>(el?.endAngle ?? 0)
  const [innerRadius, setInnerRadius] = useState<number>(el?.innerRadius ?? 0)

  useEffect(() => {
    setStartAngle(el?.startAngle ?? 0)
    setEndAngle(el?.endAngle ?? 0)
    setInnerRadius(el?.innerRadius ?? 0)
  }, [selectedElements]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BaseShapeProperties>
      <Section title="Arc">
        <NumberField
          label="Start"
          value={startAngle}
          min={-180}
          max={180}
          unit="°"
          onChange={(v) => {
            setStartAngle(v)
            applyToSelection({ startAngle: v })
          }}
        />
        <NumberField
          label="End"
          value={endAngle}
          min={-180}
          max={180}
          unit="°"
          onChange={(v) => {
            setEndAngle(v)
            applyToSelection({ endAngle: v })
          }}
        />
        <SliderField
          label="Inner R"
          value={innerRadius}
          min={0}
          max={1}
          step={0.01}
          displayValue={innerRadius.toFixed(2)}
          onChange={(v) => {
            setInnerRadius(v)
            applyToSelection({ innerRadius: v })
          }}
        />
      </Section>
    </BaseShapeProperties>
  )
}
