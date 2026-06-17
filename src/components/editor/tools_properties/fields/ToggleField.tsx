import { Switch } from '@/components/ui/switch'

interface ToggleFieldProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export function ToggleField({ label, value, onChange }: ToggleFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium leading-none">{label}</label>
      <Switch checked={value} onCheckedChange={(v) => onChange(v)} />
    </div>
  )
}
