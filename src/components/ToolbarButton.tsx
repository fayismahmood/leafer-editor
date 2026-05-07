import type { ToolType } from '#/store/editor'

interface ToolbarButtonProps {
  tool: ToolType
  label: string
  icon: React.ReactNode
  shortcut?: string
  isActive: boolean
  onClick: () => void
  compact?: boolean
}

export function ToolbarButton({
  label,
  icon,
  shortcut,
  isActive,
  onClick,
  compact = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={shortcut ? `${label} (${shortcut})` : label}
      className={`flex items-center justify-center rounded-md transition-colors ${
        compact ? 'w-7 h-7' : 'w-8 h-8'
      } ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
