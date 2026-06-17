import { useEffect, useRef, useState } from 'react'
import { GOOGLE_FONTS, CATEGORIES, SUBSET_LABELS, SUBSET_ORDER } from './fonts'
import type { FontCategory } from './fonts'
import { loadGoogleFont } from './loader'
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

interface FontPickerProps {
  value: string
  onChange: (font: string) => void
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen]                = useState(false)
  const [search, setSearch]            = useState('')
  const [category, setCategory]        = useState<Set<FontCategory>>(new Set())
  const [subset, setSubset]            = useState<Set<string>>(new Set())
  const triggerRef                     = useRef<HTMLButtonElement>(null)
  const dropdownRef                    = useRef<HTMLDivElement>(null)
  const searchRef                      = useRef<HTMLInputElement>(null)

  useEffect(() => { loadGoogleFont(value) }, [value])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 0)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onDown(e: MouseEvent) {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node) &&
        !(e.target as Element)?.closest('[data-filter-popup]')
      ) {
        setOpen(false)
        setSearch('')
        setCategory(new Set())
        setSubset(new Set())
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const filtered = GOOGLE_FONTS.filter((f) => {
    if (search && !f.family.toLowerCase().includes(search.toLowerCase())) return false
    if (category.size > 0 && !category.has(f.category)) return false
    if (subset.size > 0 && !f.subsets.some((s) => subset.has(s))) return false
    return true
  })

  const handleSelect = (font: string) => {
    onChange(font)
    setOpen(false)
    setSearch('')
    setCategory(new Set())
    setSubset(new Set())
  }

  const allSubsets = new Set<string>()
  for (const f of GOOGLE_FONTS) f.subsets.forEach((s) => allSubsets.add(s))
  const sortedSubsets = SUBSET_ORDER.filter((s) => allSubsets.has(s))

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
          style={{ maxHeight: 380 }}
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
                if (e.key === 'Escape') { setOpen(false); setSearch(''); setCategory(new Set()); setSubset(new Set()) }
                if (e.key === 'Enter' && filtered.length) {
                  handleSelect(filtered[0].family)
                }
              }}
              className="w-full h-7 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2
                focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 px-2 py-1.5 border-b border-gray-100 shrink-0">
            <SelectPrimitive.Root<FontCategory, true>
              multiple
              value={[...category]}
              onValueChange={(values) => setCategory(new Set(values))}
            >
              <SelectPrimitive.Trigger className="flex flex-1 items-center justify-between gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] text-gray-600 hover:border-gray-300 focus:outline-none focus:border-blue-400 transition-colors [&_svg]:size-3">
                <span className="truncate">
                  {category.size === 0 ? 'Category: All' : [...category].join(', ')}
                </span>
                <ChevronDownIcon />
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Portal>
                <SelectPrimitive.Positioner className="isolate z-[100]" align="start">
                  <SelectPrimitive.Popup data-filter-popup className="min-w-40 rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden py-1 max-h-60">
                    <SelectPrimitive.List>
                      {CATEGORIES.map((cat) => (
                        <SelectPrimitive.Item
                          key={cat}
                          value={cat}
                          className="group relative flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none data-disabled:opacity-50"
                        >
                          <SelectPrimitive.ItemText className="flex-1">{cat}</SelectPrimitive.ItemText>
                          <SelectPrimitive.ItemIndicator>
                            <CheckIcon className="size-3 text-blue-500" />
                          </SelectPrimitive.ItemIndicator>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.List>
                  </SelectPrimitive.Popup>
                </SelectPrimitive.Positioner>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>

            <SelectPrimitive.Root<string, true>
              multiple
              value={[...subset]}
              onValueChange={(values) => setSubset(new Set(values))}
            >
              <SelectPrimitive.Trigger className="flex flex-1 items-center justify-between gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] text-gray-600 hover:border-gray-300 focus:outline-none focus:border-blue-400 transition-colors [&_svg]:size-3">
                <span className="truncate">
                  {subset.size === 0 ? 'Subset: All' : [...subset].map((s) => SUBSET_LABELS[s] ?? s).join(', ')}
                </span>
                <ChevronDownIcon />
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Portal>
                <SelectPrimitive.Positioner className="isolate z-[100]" align="start">
                  <SelectPrimitive.Popup data-filter-popup className="min-w-40 rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden py-1 max-h-60">
                    <SelectPrimitive.List>
                      {sortedSubsets.map((s) => (
                        <SelectPrimitive.Item
                          key={s}
                          value={s}
                          className="group relative flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none data-disabled:opacity-50"
                        >
                          <SelectPrimitive.ItemText className="flex-1">{SUBSET_LABELS[s] ?? s}</SelectPrimitive.ItemText>
                          <SelectPrimitive.ItemIndicator>
                            <CheckIcon className="size-3 text-blue-500" />
                          </SelectPrimitive.ItemIndicator>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.List>
                  </SelectPrimitive.Popup>
                </SelectPrimitive.Positioner>
              </SelectPrimitive.Portal>
            </SelectPrimitive.Root>
          </div>

          {/* Font list */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-xs text-gray-400 text-center">No fonts found</p>
            ) : (
              filtered.map((f) => (
                <FontItem
                  key={f.family}
                  font={f.family}
                  selected={f.family === value}
                  onSelect={() => handleSelect(f.family)}
                />
              ))
            )}
          </div>

          <div className="px-3 py-1.5 border-t border-gray-100 shrink-0 text-[10px] text-gray-400">
            {filtered.length} / {GOOGLE_FONTS.length} font{GOOGLE_FONTS.length !== 1 ? 's' : ''}
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

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadGoogleFont(font)
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
