import { createFileRoute } from '@tanstack/react-router'
import { Toolbar } from '#/components/Toolbar'
import { LeaferCanvas } from '#/components/LeaferCanvas'
import { PropertiesPanel } from '#/components/PropertiesPanel'

export const Route = createFileRoute('/')({ component: EditorPage })

function EditorPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Toolbar />
      <LeaferCanvas />
      <PropertiesPanel />
    </div>
  )
}
