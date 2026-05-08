import { useStore } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import { BaseShapeProperties } from './BaseShapeProperties'

export function SelectProperties() {
  const selectedElements = useStore(editorStore, (s) => s.selectedElements)
  const count = selectedElements.length

  return (
    <>
      {count > 0 && (
        <p className="text-xs text-gray-400 mb-2">
          {count} element{count > 1 ? 's' : ''} selected
        </p>
      )}
      <BaseShapeProperties />
    </>
  )
}
