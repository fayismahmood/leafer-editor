interface TextFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}

export function TextField({ label, value, onChange, placeholder, type = 'text' }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-7 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 min-w-0
          focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
      />
    </div>
  )
}