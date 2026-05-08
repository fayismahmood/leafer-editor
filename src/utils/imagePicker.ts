let _pendingUrl: string | null = null

export function getPendingImageUrl(): string | null { return _pendingUrl }
export function clearPendingImageUrl(): void { _pendingUrl = null }

/** Open a native file picker and resolve with a data-URL, or null if cancelled. */
export function openImagePicker(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      const reader = new FileReader()
      reader.onload  = (e) => { _pendingUrl = e.target?.result as string; resolve(_pendingUrl) }
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    })

    // Firefox doesn't fire 'cancel', so we fall back to a focus/blur trick
    input.addEventListener('cancel', () => resolve(null))
    input.click()
  })
}

/** Load an img element and return its natural dimensions. */
export function loadImageSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.onload  = () => resolve({ w: img.naturalWidth  || 200, h: img.naturalHeight || 200 })
    img.onerror = () => resolve({ w: 200, h: 200 })
    img.src = src
  })
}
