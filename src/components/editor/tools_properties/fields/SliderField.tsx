interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  displayValue?: string | number
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  displayValue,
}: SliderFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-12 shrink-0">{label}</label>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-1 accent-blue-500"
      />
      <span className="text-xs text-gray-500 w-8 text-right">
        {displayValue ?? value}
      </span>
    </div>
  )
}
