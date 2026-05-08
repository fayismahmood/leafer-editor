import { useEffect, useState } from 'react'

interface ColorFieldProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const handleChange = (v: string) => {
    setLocal(v)
    onChange(v)
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500 w-12 shrink-0">{label}</label>
      <div className="flex gap-1 items-center">
        <input
          type="color"
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0"
        />
        <input
          type="text"
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          className="w-20 h-6 text-xs border border-gray-300 rounded px-1"
        />
      </div>
    </div>
  )
}
