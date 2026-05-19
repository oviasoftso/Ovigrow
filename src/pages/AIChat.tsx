import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { streamChatCompletion, AI_MODELS, type ChatMessage, type AIModelKey } from '@/lib/openrouter'
import { useStore } from '@/lib/store'
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Copy,
  CheckCheck,
  Sparkles,
} from 'lucide-react'

interface DisplayMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SYSTEM_PROMPT = `You are OviGrow AI, an expert agricultural assistant specializing in Zimbabwean farming. You have deep knowledge of:

- Zimbabwe's agro-ecological regions (Natural Regions I-V)
- Common crops: maize, wheat, soybeans, tobacco, cotton, sugar beans, groundnuts, sorghum, millet
- Livestock management: cattle, goats, poultry, pigs
- Soil types and management in Zimbabwe
- Pest and disease management for local crops
- Climate patterns and seasonal farming calendars (Pfumvudza/Conservation Agriculture)
- Zimbabwean agricultural markets and pricing
- Government programs like Pfumvudza, Command Agriculture
- Irrigation methods suitable for Zimbabwe
- Organic and sustainable farming practices

Provide practical, actionable advice. Reference Zimbabwean conditions, seasons (rainy season Nov-Mar, dry season Apr-Oct), and local resources when relevant. Be concise but thorough.`

const quickPrompts = [
  { icon: '🌽', label: 'Best maize varieties for Region II?', prompt: 'What are the best maize varieties to plant in Natural Region II of Zimbabwe for the upcoming season?' },
  { icon: '🐛', label: 'Fall armyworm control', prompt: 'How do I control fall armyworm in my maize field using both chemical and organic methods available in Zimbabwe?' },
  { icon: '🌱', label: 'Pfumvudza technique', prompt: 'Explain the Pfumvudza conservation agriculture technique and how to implement it on my farm.' },
  { icon: '💧', label: 'Irrigation scheduling', prompt: 'How should I schedule irrigation for my wheat crop during the dry season in Zimbabwe?' },
  { icon: '📊', label: 'Market timing for crops', prompt: 'When is the best time to sell maize and soybeans to get the highest prices in Zimbabwe?' },
  { icon: '🐄', label: 'Cattle feed supplements', prompt: 'What are affordable supplementary feed options for cattle during the dry season in Zimbabwe?' },
]

export default function AIChat() {
  const { selectedModel, setSelectedModel } = useStore()
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || isLoading) return

    const userMessage: DisplayMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const assistantMessage: DisplayMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: text },
    ]

    try {
      await streamChatCompletion(
        {
          model: selectedModel,
          messages: chatMessages,
          temperature: 0.7,
          max_tokens: 2048,
        },
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: m.content + chunk }
                : m
            )
          )
        },
        () => {
          setIsLoading(false)
        },
        (error) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: `Error: ${error.message}. Please check your API key and try again.` }
                : m
            )
          )
          setIsLoading(false)
        }
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: 'Failed to connect to AI service. Please try again.' }
            : m
        )
      )
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const modelOptions: { key: AIModelKey; label: string }[] = [
    { key: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
    { key: 'gpt-4o', label: 'GPT-4o' },
    { key: 'gemini-pro', label: 'Gemini Pro' },
    { key: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { key: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    { key: 'gemini-flash', label: 'Gemini Flash' },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">AI Farm Assistant</h1>
          <p className="text-muted-foreground">
            Ask anything about farming in Zimbabwe
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((model) => (
                <SelectItem key={model.key} value={AI_MODELS[model.key]}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={clearChat} title="Clear chat">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">OviGrow AI Assistant</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Your intelligent farming companion for Zimbabwean agriculture.
                Ask about crops, pests, soil, markets, or any farming topic.
              </p>
              <div className="grid gap-2 md:grid-cols-2 max-w-xl w-full">
                {quickPrompts.map((qp) => (
                  <button
                    key={qp.label}
                    onClick={() => handleSend(qp.prompt)}
                    className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent transition-colors"
                  >
                    <span className="text-xl">{qp.icon}</span>
                    <span className="text-sm font-medium">{qp.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="rounded-full bg-primary/10 p-2 h-fit">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.content && message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                    <button
                      onClick={() => copyMessage(message.content, message.id)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {copiedId === message.id ? (
                        <><CheckCheck className="h-3 w-3" /> Copied</>
                      ) : (
                        <><Copy className="h-3 w-3" /> Copy</>
                      )}
                    </button>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="rounded-full bg-primary p-2 h-fit">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.content === '' && (
            <div className="flex gap-3 justify-start">
              <div className="rounded-full bg-primary/10 p-2 h-fit">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Ask about crops, pests, soil, markets..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="min-h-[44px] resize-none"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by OviGrow AI. Model: {modelOptions.find((m) => AI_MODELS[m.key] === selectedModel)?.label || 'Custom'}
          </p>
        </div>
      </Card>
    </div>
  )
}
