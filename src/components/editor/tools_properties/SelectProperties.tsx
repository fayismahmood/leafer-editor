import { useSelector } from '@tanstack/react-store'
import { editorStore } from '#/store/editor'
import { BaseShapeProperties } from './BaseShapeProperties'

export function SelectProperties() {
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements)
  const count = selectedElements.length

  return (
    <>
      {/* Badge block — sits as first child inside divide-y container */}
      <div className="px-5 pt-5 pb-5">
        {count > 0 ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-blue-50 rounded-xl border border-blue-100">
            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
            <span className="text-xs text-blue-600 font-medium leading-none">
              {count} element{count > 1 ? 's' : ''} selected
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
            <span className="text-xs text-gray-400 font-medium leading-none">
              Nothing selected
            </span>
          </div>
        )}
      </div>

      <BaseShapeProperties />
    </>
  )
}
