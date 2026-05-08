const injected = new Set<string>()

/** Inject a Google Fonts stylesheet for the given family (idempotent). */
export function loadGoogleFont(family: string): void {
  if (injected.has(family)) return
  injected.add(family)

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}` +
    `:ital,wght@0,400;0,700;1,400&display=swap`
  document.head.appendChild(link)
}

/**
 * Load a Google Font and wait until it is actually available to paint.
 * Resolves immediately if the font is already cached.
 */
export async function loadGoogleFontAndWait(family: string): Promise<void> {
  loadGoogleFont(family)
  try {
    await document.fonts.load(`16px "${family}"`)
  } catch {
    // Swallow — canvas will use fallback if load fails
  }
}
