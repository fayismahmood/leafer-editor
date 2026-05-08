import type { App } from 'leafer-ui'

let _app: App | null = null

export function setCanvasApp(app: App) {
  _app = app
}

export function getCanvasApp(): App | null {
  return _app
}
