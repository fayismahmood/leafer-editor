import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { TextField } from "./fields"

interface FigmaImportConfigProps {
  apiKey: string
  onApiKeyChange: (key: string) => void
  onSave: () => void
  onFetch: () => void
  loading: boolean
  saved: boolean
}

export function FigmaImportConfig({
  apiKey,
  onApiKeyChange,
  onSave,
  onFetch,
  loading,
  saved,
}: FigmaImportConfigProps) {
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 leading-relaxed">
        To import from Figma, you need a personal access token. You can generate one in your{" "}
        <a
          href="https://www.figma.com/developers/api#access-tokens"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Figma account settings
        </a>
        .
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Personal Access Token</label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="Enter your Figma access token"
            className="w-full h-7 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 pr-8 min-w-0
              focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={!apiKey.trim()}
          className="flex-1 h-9 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Token
        </button>
        <button
          type="button"
          onClick={onFetch}
          disabled={!apiKey.trim() || loading}
          className="flex-1 h-9 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Fetching..." : "Fetch from Figma"}
        </button>
      </div>

      {saved && (
        <p className="text-xs text-green-600">Token saved successfully</p>
      )}
    </div>
  )
}