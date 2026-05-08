import { useStore } from '@tanstack/react-store'
import { editorStore, setStarPoints } from '#/store/editor'
import { BaseShapeProperties } from './BaseShapeProperties'
import { Section, NumberField } from './fields'

export function StarProperties() {
  const starPoints = useStore(editorStore, (s) => s.starPoints)

  return (
    <BaseShapeProperties>
      <Section title="Shape">
        <NumberField
          label="Points"
          value={starPoints}
          onChange={setStarPoints}
          min={3}
          max={20}
        />
      </Section>
    </BaseShapeProperties>
  )
}
