import { useStore } from '@tanstack/react-store'
import { editorStore, setFontSize } from '#/store/editor'
import { BaseShapeProperties } from './BaseShapeProperties'
import { Section, NumberField } from './fields'

export function TextProperties() {
  const fontSize = useStore(editorStore, (s) => s.fontSize)

  return (
    <BaseShapeProperties>
      <Section title="Text">
        <NumberField
          label="Size"
          value={fontSize}
          onChange={setFontSize}
          min={8}
          max={200}
          unit="px"
        />
      </Section>
    </BaseShapeProperties>
  )
}
