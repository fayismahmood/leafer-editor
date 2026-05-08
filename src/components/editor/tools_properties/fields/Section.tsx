import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </p>
      {children}
    </div>
  )
}
