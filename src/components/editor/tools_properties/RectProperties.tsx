import { useSelector } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import { applyCornerRadius } from './selectionActions'
import { BaseShapeProperties } from './BaseShapeProperties'
import { Section, NumberField } from './fields'

export function RectProperties() {
  const cornerRadius = useSelector(editorStore, (s) => s.cornerRadius)

  return (
    <BaseShapeProperties>
      <Section title="Shape">
        <div className="col-span-full">
          <NumberField
            label="Radius"
            value={cornerRadius}
            onChange={applyCornerRadius}
            min={0}
            max={500}
            unit="px"
          />
        </div>
      </Section>
    </BaseShapeProperties>
  )
}
