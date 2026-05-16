export interface AIConfig {
  provider: string
  apiKey: string
  model: string
  endpoint: string
}

const DEFAULT_CONFIG: AIConfig = {
  provider: "opencode-go",
  apiKey: "",
  model: "opencode-go",
  endpoint: "http://127.0.0.1:8080",
}

export const aiSettingsStorage = {
  getConfig(): AIConfig {
    try {
      const stored = localStorage.getItem("ai_settings")
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) }
      }
    } catch {}
    return { ...DEFAULT_CONFIG }
  },

  setConfig(config: Partial<AIConfig>) {
    const current = this.getConfig()
    const updated = { ...current, ...config }
    localStorage.setItem("ai_settings", JSON.stringify(updated))
  },

  getApiKey(provider: string): string {
    return localStorage.getItem(`ai_api_key_${provider}`) || ""
  },
}