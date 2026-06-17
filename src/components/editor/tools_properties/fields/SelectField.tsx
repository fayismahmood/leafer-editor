import type { LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectOption {
  value: string
  label: string
  icon?: LucideIcon
}

interface SelectFieldProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  const selectedOption = options.find((opt) => opt.value === value)
  const SelectedIcon = selectedOption?.icon

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium leading-none">
        {label}
      </label>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="w-full text-xs rounded-lg border-gray-200 bg-gray-50 px-2 py-0 data-[size=default]:h-7 gap-1 [&_svg]:size-3">
          {SelectedIcon && <SelectedIcon />}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => {
            const Icon = opt.icon
            return (
              <SelectItem key={opt.value} value={opt.value}>
                {Icon && <Icon />}
                {opt.label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
