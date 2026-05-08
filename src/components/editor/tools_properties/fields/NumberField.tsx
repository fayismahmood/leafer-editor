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
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-12 shrink-0">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 h-6 text-xs border border-gray-300 rounded px-1"
        />
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>
    </div>
  )
}
