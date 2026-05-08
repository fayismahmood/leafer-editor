import { useEffect, useRef, useState } from 'react'
import { GOOGLE_FONTS } from './fonts'
import { loadGoogleFont } from './loader'

interface FontPickerProps {
  value: string
  onChange: (font: string) => void
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const triggerRef          = useRef<HTMLButtonElement>(null)
  const dropdownRef         = useRef<HTMLDivElement>(null)
  const searchRef           = useRef<HTMLInputElement>(null)

  // Load the current font so the trigger preview renders correctly
  useEffect(() => { loadGoogleFont(value) }, [value])

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 0)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const filtered = GOOGLE_FONTS.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="relative w-full">
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-7 px-2 bg-gray-50 border border-gray-200 rounded-lg
          flex items-center gap-2 hover:border-gray-300 focus:outline-none
          focus:border-blue-400 transition-colors text-left"
        style={{ fontFamily: `'${value}', sans-serif` }}
      >
        <span className="flex-1 text-xs text-gray-700 truncate">{value}</span>
        <svg
          className="w-3 h-3 text-gray-400 shrink-0"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full mt-1 left-0 right-0 bg-white
            border border-gray-200 rounded-xl shadow-xl overflow-hidden flex flex-col"
          style={{ maxHeight: 300 }}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100 shrink-0">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search fonts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setOpen(false); setSearch('') }
                if (e.key === 'Enter' && filtered.length) {
                  onChange(filtered[0])
                  setOpen(false)
                  setSearch('')
                }
              }}
              className="w-full h-7 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2
                focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Font list */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-xs text-gray-400 text-center">No fonts found</p>
            ) : (
              filtered.map((font) => (
                <FontItem
                  key={font}
                  font={font}
                  selected={font === value}
                  onSelect={() => {
                    onChange(font)
                    setOpen(false)
                    setSearch('')
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Individual font item ──────────────────────────────────────────────────────

interface FontItemProps {
  font: string
  selected: boolean
  onSelect: () => void
}

function FontItem({ font, selected, onSelect }: FontItemProps) {
  const ref       = useRef<HTMLButtonElement>(null)
  const [ready, setReady] = useState(false)

  // Lazy-load the font when this row scrolls into view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadGoogleFont(font)
          // Give the browser a tick to parse the stylesheet
          setTimeout(() => setReady(true), 60)
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [font])

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between
        transition-colors hover:bg-gray-50 ${
          selected ? 'bg-blue-50 text-blue-600' : 'text-gray-800'
        }`}
      style={ready ? { fontFamily: `'${font}', sans-serif` } : {}}
    >
      <span className="truncate">{font}</span>
      {selected && (
        <svg className="w-3.5 h-3.5 shrink-0 text-blue-500" viewBox="0 0 14 14" fill="currentColor">
          <path d="M11.5 3.5L5.5 9.5 2.5 6.5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )}
    </button>
  )
}
