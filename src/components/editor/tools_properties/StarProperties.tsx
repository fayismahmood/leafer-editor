import { useEffect, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import { applyStarPoints, applyToSelection } from './selectionActions'
import { BaseShapeProperties } from './BaseShapeProperties'
import { Section, NumberField, SliderField } from './fields'

export function StarProperties() {
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)
  const starPoints = useSelector(editorStore, (s) => s.starPoints)
  const el = selectedElements[0] as any

  const [innerRadius, setInnerRadius] = useState<number>(el?.innerRadius ?? 0.382)
  const [startAngle, setStartAngle] = useState<number>(el?.startAngle ?? 0)
  const [cornerRadius, setCornerRadius] = useState<number>(el?.cornerRadius ?? 0)

  useEffect(() => {
    setInnerRadius(el?.innerRadius ?? 0.382)
    setStartAngle(el?.startAngle ?? 0)
    setCornerRadius(el?.cornerRadius ?? 0)
  }, [selectedElements]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BaseShapeProperties>
      <Section title="Shape">
        <NumberField
          label="Points"
          value={starPoints}
          onChange={applyStarPoints}
          min={3}
          max={20}
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
        <NumberField
          label="Rotation"
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
          label="Smooth"
          value={cornerRadius}
          min={0}
          max={100}
          unit="px"
          onChange={(v) => {
            setCornerRadius(v)
            applyToSelection({ cornerRadius: v })
          }}
        />
      </Section>
    </BaseShapeProperties>
  )
}
