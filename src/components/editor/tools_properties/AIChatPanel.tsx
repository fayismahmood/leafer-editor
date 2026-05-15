import { useState, useRef, useEffect } from "react"
import { Send, Settings, Trash2, Loader2, RefreshCw } from "lucide-react"
import { getCanvasApp } from "#/utils/appInstance"
import { aiSettingsStorage } from "#/utils/aiConfig"
import { AIChatSettings } from "./AIChatSettings"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function AIChatPanel() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [provider, setProvider] = useState("openai")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-4o")
  const [endpoint, setEndpoint] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const config = aiSettingsStorage.getConfig()
    setProvider(config.provider)
    setApiKey(aiSettingsStorage.getApiKey(config.provider))
    setModel(config.model)
    setEndpoint(config.endpoint)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const savedMessages = localStorage.getItem("ai_chat_history")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages))
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    if (!endpoint) {
      alert("Please configure your Rust server endpoint in settings first.")
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          provider,
          model,
          apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Request failed: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: typeof data === string ? data : data.content || JSON.stringify(data, null, 2),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : "Failed to get response"}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleApplyToCanvas = (jsonStr: string) => {
    try {
      const json = JSON.parse(jsonStr)
      const app = getCanvasApp()
      if (app) {
        app.tree.clear()
        loadLeaferJson(app.tree, json)
      }
    } catch (err) {
      console.error("Failed to apply JSON:", err)
    }
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
      const { Rect, Ellipse, Line, Star, Text, Frame, Group, Path } = window as any
      const tagMap: Record<string, any> = { Rect, Ellipse, Line, Star, Text, Frame, Group, Path }

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

  const handleClearChat = () => {
    setMessages([])
    localStorage.removeItem("ai_chat_history")
  }

  const lastAssistantMessage = messages.length > 0
    ? messages.filter((m) => m.role === "assistant").pop()
    : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">AI Assistant</span>
          <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
            {model.split("-").pop() || model}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Clear chat"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700"
            title="Settings"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <span className="text-xl">✨</span>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">AI Design Assistant</p>
            <p className="text-xs text-gray-400 max-w-[200px]">
              Describe what you want to create and I'll generate Leafer JSON for you.
            </p>
            <div className="mt-4 space-y-2 w-full max-w-[240px]">
              <button
                onClick={() => {
                  setInput("Create a blue rectangle with rounded corners")
                  inputRef.current?.focus()
                }}
                className="w-full h-8 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 text-left px-3"
              >
                Create a blue rectangle with rounded corners
              </button>
              <button
                onClick={() => {
                  setInput("Add a star with yellow fill")
                  inputRef.current?.focus()
                }}
                className="w-full h-8 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 text-left px-3"
              >
                Add a star with yellow fill
              </button>
              <button
                onClick={() => {
                  setInput("Draw a gradient circle in the center")
                  inputRef.current?.focus()
                }}
                className="w-full h-8 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 text-left px-3"
              >
                Draw a gradient circle in the center
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans overflow-x-auto">{msg.content}</pre>
              {msg.role === "assistant" && lastAssistantMessage?.id === msg.id && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleApplyToCanvas(msg.content)}
                    className="h-7 px-3 text-[10px] bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Apply to Canvas
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {settingsOpen && (
        <div className="absolute inset-0 bg-white z-50">
          <AIChatSettings
            onClose={() => setSettingsOpen(false)}
            provider={provider}
            onProviderChange={(p) => {
              setProvider(p)
              setApiKey(aiSettingsStorage.getApiKey(p))
            }}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            model={model}
            onModelChange={setModel}
            endpoint={endpoint}
            onEndpointChange={setEndpoint}
          />
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to create..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none text-xs bg-gray-50 border border-gray-200 
              rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            rows={2}
          />
          <div className="flex flex-col gap-1">
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center 
                hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
            </button>
            {isLoading && (
              <button
                onClick={() => {}}
                className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center 
                  hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={14} />
              </button>
            )}
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}