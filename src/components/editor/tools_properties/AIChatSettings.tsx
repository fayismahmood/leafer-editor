import { useState, useEffect } from "react"
import { Eye, EyeOff, Settings, X } from "lucide-react"
import { TextField } from "./fields"
import {
  SelectField,
} from "./fields"

interface AISettingsProps {
  onClose: () => void
  provider: string
  onProviderChange: (p: string) => void
  apiKey: string
  onApiKeyChange: (k: string) => void
  model: string
  onModelChange: (m: string) => void
  endpoint: string
  onEndpointChange: (e: string) => void
}

const PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "mistral", label: "Mistral" },
  { value: "xai", label: "xAI" },
  { value: "groq", label: "Groq" },
  { value: "perplexity", label: "Perplexity" },
  { value: "opencode-go", label: "OpenCode Go" },
]

const MODELS: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ],
  anthropic: [
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
    { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
  ],
  google: [
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    { value: "gemini-1.5-flash-8b", label: "Gemini 1.5 Flash-8B" },
  ],
  mistral: [
    { value: "mistral-large-latest", label: "Mistral Large" },
    { value: "mistral-small-latest", label: "Mistral Small" },
    { value: "codestral-latest", label: "Codestral" },
  ],
  xai: [
    { value: "grok-2", label: "Grok 2" },
    { value: "grok-2-mini", label: "Grok 2 Mini" },
  ],
  groq: [
    { value: "llama-3.1-70b-versatile", label: "Llama 3.1 70B" },
    { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
  ],
  perplexity: [
    { value: "sonar", label: "Sonar" },
    { value: "sonar-pro", label: "Sonar Pro" },
  ],
  "opencode-go": [
    { value: "opencode-go", label: "OpenCode Go" },
  ],
}

export function AIChatSettings({
  onClose,
  provider,
  onProviderChange,
  apiKey,
  onApiKeyChange,
  model,
  onModelChange,
  endpoint,
  onEndpointChange,
}: AISettingsProps) {
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`ai_api_key_${provider}`)
    if (stored && !apiKey) {
      onApiKeyChange(stored)
    }
  }, [provider])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(`ai_api_key_${provider}`, apiKey.trim())
    }
  }

  const models = MODELS[provider] || MODELS.openai

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-800">AI Settings</span>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-500 font-medium">Provider</label>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.value}
                onClick={() => onProviderChange(p.value)}
                className={`h-8 text-xs rounded-lg border transition-colors ${
                  provider === p.value
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            {provider === "opencode-go" ? "OpenCode Go" : PROVIDERS.find((p) => p.value === provider)?.label} API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder={provider === "opencode-go" ? "No API key needed" : `Enter your ${PROVIDERS.find((p) => p.value === provider)?.label} API key`}
              disabled={provider === "opencode-go"}
              className="w-full h-8 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 pr-8 min-w-0
                focus:outline-none focus:border-blue-400 focus:bg-white transition-colors disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <button
            onClick={handleSaveApiKey}
            disabled={!apiKey.trim()}
            className="mt-1 h-7 text-xs rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Save API Key
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Model</label>
          <div className="grid grid-cols-2 gap-2">
            {models.map((m) => (
              <button
                key={m.value}
                onClick={() => onModelChange(m.value)}
                className={`h-8 text-xs rounded-lg border transition-colors ${
                  model === m.value
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Rust Server Endpoint</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => onEndpointChange(e.target.value)}
            placeholder="https://your-rust-server.lambda.dev/api/ai"
            className="w-full h-8 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 min-w-0
              focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
          <p className="text-[10px] text-gray-400">Your Rust Lambda endpoint for AI requests</p>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <p>Your API key is stored locally and never sent to our servers.</p>
          <p>
            Get your API key from{" "}
            <a
              href={`https://${provider}.com/api`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {provider}.com/api
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}