import { useEffect, useState } from 'react'
import { useSelector } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import { applyToSelection } from './selectionActions'
import { BaseShapeProperties } from './BaseShapeProperties'
import { Section, SliderField, ToggleField } from './fields'

export function LineProperties() {
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)
  const el = selectedElements[0] as any

  const rawCurve = el?.curve
  const [curve, setCurve] = useState<number>(
    typeof rawCurve === 'number' ? rawCurve : rawCurve ? 0.5 : 0,
  )
  const [closed, setClosed] = useState<boolean>(el?.closed ?? false)

  useEffect(() => {
    const rc = el?.curve
    setCurve(typeof rc === 'number' ? rc : rc ? 0.5 : 0)
    setClosed(el?.closed ?? false)
  }, [selectedElements]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BaseShapeProperties showFill={false}>
      <Section title="Line">
        <SliderField
          label="Curve"
          value={curve}
          min={0}
          max={1}
          step={0.01}
          displayValue={curve.toFixed(2)}
          onChange={(v) => {
            setCurve(v)
            applyToSelection({ curve: v > 0 ? v : false })
          }}
        />
        <ToggleField
          label="Closed"
          value={closed}
          onChange={(v) => {
            setClosed(v)
            applyToSelection({ closed: v })
          }}
        />
      </Section>
    </BaseShapeProperties>
  )
}
