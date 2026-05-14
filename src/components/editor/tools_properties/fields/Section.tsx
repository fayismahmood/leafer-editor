import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="px-5 pt-4 pb-5 border-b border-gray-100 last:border-b-0">
      {/* Title row with accent */}
      <div className="flex items-center gap-2 mb-3">
         <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          {title}
        </span>
      </div>

      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
