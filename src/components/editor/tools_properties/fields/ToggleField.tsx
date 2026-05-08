interface ToggleFieldProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export function ToggleField({ label, value, onChange }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-gray-500 font-medium leading-none">{label}</label>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
          value ? 'bg-blue-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            value ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
