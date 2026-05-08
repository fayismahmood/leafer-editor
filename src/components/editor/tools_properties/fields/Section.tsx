import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="px-5 pt-5 pb-6">
      {/* Title row with a visible rule */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-widest whitespace-nowrap">
          {title}
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
