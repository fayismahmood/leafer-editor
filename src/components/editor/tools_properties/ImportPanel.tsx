import { useState } from "react"
import { Upload } from "lucide-react"
import { Section, TextField } from "./fields"
import { FigmaImportConfig } from "./FigmaImportConfig"
import { figmaToLeafer } from "#/utils/figmaToSceneGraph"
import { getCanvasApp } from "#/utils/appInstance"

type ImportSource = "figma" | null

export function ImportPanel() {
  const [source, setSource] = useState<ImportSource>(null)
  const [figmaToken, setFigmaToken] = useState("")
  const [figmaUrl, setFigmaUrl] = useState("")
  const [figmaSaved, setFigmaSaved] = useState(false)
  const [figmaLoading, setFigmaLoading] = useState(false)
  const [figmaError, setFigmaError] = useState("")

  const handleFigmaSave = () => {
    if (figmaToken.trim()) {
      localStorage.setItem("figma_access_token", figmaToken.trim())
      setFigmaSaved(true)
      setTimeout(() => setFigmaSaved(false), 2000)
    }
  }

  const handleFigmaFetch = async () => {
    const fileKey = extractFigmaFileKey(figmaUrl)
    if (!fileKey) {
      setFigmaError("Invalid Figma URL. Please paste a valid Figma file URL.")
      return
    }

    setFigmaLoading(true)
    setFigmaError("")

    try {
      const nodeId = extractFigmaNodeId(figmaUrl)
      const baseUrl = `https://api.figma.com/v1/files/${fileKey}`
      const url = nodeId ? `${baseUrl}?ids=${nodeId}` : baseUrl

      const response = await fetch(url, {
        headers: {
          "X-Figma-Token": figmaToken.trim(),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch from Figma")
      }

      const figmaJson = await response.json()
      const leaferJson = figmaToLeafer(figmaJson)

      const app = getCanvasApp()
      if (app) {
        app.tree.clear()
        loadLeaferJson(app.tree, leaferJson)
        setFigmaUrl("")
      }
    } catch (err) {
      setFigmaError(err instanceof Error ? err.message : "Failed to fetch from Figma")
    } finally {
      setFigmaLoading(false)
    }
  }

  function extractFigmaFileKey(url: string): string | null {
    const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  function extractFigmaNodeId(url: string): string | null {
    const match = url.match(/node-id=([^&]+)/)
    return match ? decodeURIComponent(match[1]) : null
  }

  function loadLeaferJson(parent: any, data: any) {
    if (!data || data.tag === "Leafer") {
      if (data?.children) {
        for (const child of data.children) {
          loadLeaferJson(parent, child)
        }
      }
      return
    }

    const { tag, children, ...rest } = data
    const elementConfig: any = { tag, ...rest }

    try {
      const { App, Rect, Ellipse, Line, Star, Text, Frame, Group, Path } = window as any
      const tagMap: Record<string, any> = {
        Rect,
        Ellipse,
        Line,
        Star,
        Text,
        Frame,
        Group,
        Path,
      }

      const ElementClass = tagMap[tag]
      if (ElementClass) {
        const el = new ElementClass(elementConfig)
        parent.add(el)

        if (children) {
          for (const child of children) {
            loadLeaferJson(el, child)
          }
        }
      }
    } catch (e) {
      console.error("Failed to create element:", tag, e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Section title="Import Source">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setSource(source === "figma" ? null : "figma")}
            className={`w-full h-9 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              source === "figma"
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 5.5C5 6.88 3.88 8 2.5 8S0 6.88 0 5.5 1.12 3 2.5 3 5 4.12 5 5.5zm0 13.5c0-.28.22-.5.5-.5h8c.28 0 .5.22.5.5s-.22.5-.5.5h-8c-.28 0-.5-.22-.5-.5zm2.5-4c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5zM12 3.5C9.5 3.5 7.5 4.5 7.5 4.5S6 5 5.5 5 3.5 3.5 3.5 3.5 5 3 6.5 3s2 1 2 1-1.5 1-1.5 1 2 .5 2 .5S12 3.5 12 3.5zm7 16.5c0-.28.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5zm1.5-3.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5h-1c-.28 0-.5-.22-.5-.5z"/>
            </svg>
            Figma
          </button>
        </div>
      </Section>

      {source === "figma" && (
        <Section title="Figma Configuration">
          <FigmaImportConfig
            apiKey={figmaToken}
            onApiKeyChange={setFigmaToken}
            onSave={handleFigmaSave}
            onFetch={handleFigmaFetch}
            loading={figmaLoading}
            saved={figmaSaved}
          />
        </Section>
      )}

      {source === "figma" && (
        <Section title="Figma File">
          <TextField
            label="Figma URL"
            value={figmaUrl}
            onChange={setFigmaUrl}
            placeholder="Paste Figma file or frame URL"
          />
          {figmaError && <p className="text-xs text-red-500">{figmaError}</p>}
        </Section>
      )}

      <div className="px-5 pt-2 pb-6">
        <label
          className="w-full h-9 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 text-sm
            font-medium flex items-center justify-center gap-2 cursor-pointer hover:border-gray-400 hover:text-gray-500 transition-colors"
        >
          <Upload size={14} />
          Import JSON
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              try {
                const text = await file.text()
                const json = JSON.parse(text)
                const app = getCanvasApp()
                if (app) {
                  app.tree.clear()
                  loadLeaferJson(app.tree, json)
                }
              } catch (err) {
                console.error("Failed to import JSON:", err)
              }
            }}
          />
        </label>
      </div>
    </div>
  )
}