import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { streamChatCompletion, AI_MODELS, type ChatMessage, type AIModelKey } from '@/lib/openrouter'
import { useStore } from '@/lib/store'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Bot,
  User,
  Loader2,
  Trash2,
  Copy,
  CheckCheck,
  Sparkles,
  Leaf,
  RotateCcw,
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

Format your responses using markdown. Use **bold** for emphasis, bullet points for lists, and ### headers for sections when the response is long. Be concise but thorough. Use Zimbabwean-specific examples.`

const quickPrompts = [
  { icon: '🌽', label: 'Best maize varieties for Region II?', prompt: 'What are the best maize varieties to plant in Natural Region II of Zimbabwe for the upcoming season?' },
  { icon: '🐛', label: 'Fall armyworm control', prompt: 'How do I control fall armyworm in my maize field using both chemical and organic methods available in Zimbabwe?' },
  { icon: '🌱', label: 'Pfumvudza technique', prompt: 'Explain the Pfumvudza conservation agriculture technique and how to implement it on my farm.' },
  { icon: '💧', label: 'Irrigation scheduling', prompt: 'How should I schedule irrigation for my wheat crop during the dry season in Zimbabwe?' },
  { icon: '📊', label: 'Market timing for crops', prompt: 'When is the best time to sell maize and soybeans to get the highest prices in Zimbabwe?' },
  { icon: '🐄', label: 'Cattle feed supplements', prompt: 'What are affordable supplementary feed options for cattle during the dry season in Zimbabwe?' },
]

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function MarkdownContent({ content }: { content: string }) {
  try {
    return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-pre:my-2 prose-hr:my-3 prose-strong:text-foreground prose-code:text-primary">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const isInline = !match && !className
          if (isInline) {
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary" {...props}>
                {children}
              </code>
            )
          }
          return (
            <div className="relative group my-2">
              <div className="flex items-center justify-between bg-[#282c34] rounded-t-md px-3 py-1.5">
                <span className="text-xs text-zinc-400 font-mono">{match?.[1] || 'code'}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Copy
                </button>
              </div>
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] || 'text'}
                PreTag="div"
                customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, fontSize: '0.8rem' }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          )
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-2 rounded-md border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          )
        },
        thead({ children }) {
          return <thead className="bg-muted/50">{children}</thead>
        },
        th({ children }) {
          return <th className="px-3 py-2 text-left font-semibold text-xs uppercase tracking-wider">{children}</th>
        },
        td({ children }) {
          return <td className="px-3 py-2 border-t border-border">{children}</td>
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-3 border-primary pl-3 py-1 my-2 bg-primary/5 rounded-r-md text-sm italic">
              {children}
            </blockquote>
          )
        },
        ul({ children }) {
          return <ul className="space-y-1 my-1.5">{children}</ul>
        },
        li({ children }) {
          return <li className="text-sm leading-relaxed">{children}</li>
        },
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
    )
  } catch {
    return <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
  }
}

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
                ? { ...m, content: `**Error:** ${error.message}. Please check your API key and try again.` }
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
            ? { ...m, content: '**Error:** Failed to connect to AI service. Please try again.' }
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
    { key: 'claude-sonnet-4', label: 'Claude Sonnet 4' },
    { key: 'gpt-4.1', label: 'GPT-4.1' },
    { key: 'gemini-pro', label: 'Gemini Pro' },
    { key: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
    { key: 'claude-haiku', label: 'Claude Haiku' },
    { key: 'gemini-flash', label: 'Gemini Flash' },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="gradient-primary rounded-xl p-2.5 shadow-lg shadow-primary/20">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">OviGrow AI</h1>
            <p className="text-xs text-muted-foreground">Zimbabwean agricultural intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px] h-9 text-xs border-border/50 bg-muted/30">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.map((model) => (
                <SelectItem key={model.key} value={AI_MODELS[model.key]} className="text-xs">
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {messages.length > 0 && (
            <Button variant="ghost" size="icon" onClick={clearChat} title="Clear chat" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
          <AnimatePresence mode="wait">
            {messages.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="gradient-primary rounded-2xl p-4 mb-5 shadow-xl shadow-primary/30"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-bold tracking-tight mb-1.5">OviGrow AI Assistant</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm">
                  Your intelligent farming companion for Zimbabwean agriculture
                </p>
                <div className="grid gap-2.5 md:grid-cols-2 max-w-2xl w-full">
                  {quickPrompts.map((qp, i) => (
                    <motion.button
                      key={qp.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleSend(qp.prompt)}
                      className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 p-3.5 text-left hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                    >
                      <span className="text-lg">{qp.icon}</span>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{qp.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="gradient-primary rounded-lg p-2 h-fit mt-1 shadow-sm">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'gradient-primary text-white shadow-md shadow-primary/20'
                        : 'bg-muted/60 border border-border/30'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    ) : message.content ? (
                      <MarkdownContent content={message.content} />
                    ) : (
                      <TypingIndicator />
                    )}
                  </div>
                  <div className={`flex items-center gap-2 mt-1.5 px-1 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    <span className="text-[10px] text-muted-foreground/60">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.role === 'assistant' && message.content && (
                      <button
                        onClick={() => copyMessage(message.content, message.id)}
                        className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors flex items-center gap-0.5"
                      >
                        {copiedId === message.id ? (
                          <><CheckCheck className="h-3 w-3" /> Copied</>
                        ) : (
                          <><Copy className="h-3 w-3" /> Copy</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="bg-muted rounded-lg p-2 h-fit mt-1">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 p-3 bg-card/30 backdrop-blur-sm">
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              placeholder="Ask about crops, pests, soil, markets..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="min-h-[40px] max-h-[120px] resize-none rounded-xl border-border/50 bg-background/50 text-sm focus-visible:ring-primary/30"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-10 w-10 rounded-xl gradient-primary shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-1.5 px-1">
            {modelOptions.find((m) => AI_MODELS[m.key] === selectedModel)?.label || 'Custom'} · Responses may be inaccurate
          </p>
        </div>
      </div>
    </div>
  )
}
