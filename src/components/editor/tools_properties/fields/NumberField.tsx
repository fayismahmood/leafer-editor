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
      <div className="flex items-center h-7 bg-gray-50 border border-gray-200 rounded-lg px-2 focus-within:border-blue-400 focus-within:bg-white transition-colors">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-full text-xs bg-transparent border-none outline-none min-w-0 p-0"
        />
        {unit && (
          <span className="text-xs text-gray-400 shrink-0 font-medium leading-none ml-0.5">{unit}</span>
        )}
      </div>
    </div>
  )
}
