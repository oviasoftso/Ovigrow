const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionRequest {
  model?: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function chatCompletion(
  request: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': import.meta.env.VITE_APP_URL || 'https://ovigrow.app',
      'X-Title': 'OviGrow AI Agricultural Intelligence',
    },
    body: JSON.stringify({
      model: request.model || 'anthropic/claude-sonnet-4',
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2048,
      stream: request.stream ?? false,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  return response.json()
}

export async function streamChatCompletion(
  request: ChatCompletionRequest,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': import.meta.env.VITE_APP_URL || 'https://ovigrow.app',
        'X-Title': 'OviGrow AI Agricultural Intelligence',
      },
      body: JSON.stringify({
        model: request.model || 'anthropic/claude-sonnet-4',
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens ?? 2048,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No reader available')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            onComplete()
            return
          }
          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) onChunk(content)
          } catch {
            // Skip invalid JSON lines
          }
        }
      }
    }

    onComplete()
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Unknown error'))
  }
}

export const AI_MODELS = {
  'claude-sonnet-4': 'anthropic/claude-sonnet-4',
  'claude-haiku': 'anthropic/claude-haiku-latest',
  'gpt-4.1': 'openai/gpt-4.1',
  'gpt-4.1-mini': 'openai/gpt-4.1-mini',
  'gemini-pro': 'google/gemini-pro-latest',
  'gemini-flash': 'google/gemini-flash-latest',
} as const

export type AIModelKey = keyof typeof AI_MODELS
