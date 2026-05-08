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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-500 font-medium leading-none">{label}</label>
        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md tabular-nums leading-none">
          {displayValue ?? value}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 accent-blue-500 cursor-pointer rounded-full"
      />
    </div>
  )
}
