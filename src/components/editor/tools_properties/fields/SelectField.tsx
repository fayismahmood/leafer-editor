interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-gray-500 w-14 shrink-0 font-medium leading-none">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 h-7 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2
          focus:outline-none focus:border-blue-400 focus:bg-white transition-colors
          appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
