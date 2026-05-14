interface NumberFieldProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  unit?: string
}

export function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
}: NumberFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium leading-none">
        {label}
      </label>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-7 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 min-w-0
            focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
        />
        {unit && (
          <span className="text-xs text-gray-400 shrink-0 font-medium">{unit}</span>
        )}
      </div>
    </div>
  )
}
