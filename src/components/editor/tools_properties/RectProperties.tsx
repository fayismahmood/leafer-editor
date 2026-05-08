import { useStore } from '@tanstack/react-store'
import { editorStore, setCornerRadius } from '#/store/editor'
import { BaseShapeProperties } from './BaseShapeProperties'
import { Section, NumberField } from './fields'

export function RectProperties() {
  const cornerRadius = useStore(editorStore, (s) => s.cornerRadius)

  return (
    <BaseShapeProperties>
      <Section title="Shape">
        <NumberField
          label="Radius"
          value={cornerRadius}
          onChange={setCornerRadius}
          min={0}
          max={500}
          unit="px"
        />
      </Section>
    </BaseShapeProperties>
  )
}
