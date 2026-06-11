import type { Answers, ObraResult, Message, AgentId } from '@/lib/types'
import type { Provider } from '@/lib/ai'

const KEYS = {
  provider: 'obra_provider',
  apiKey: 'obra_api_key',
  answers: 'obra_answers',
  result: 'obra_result',
  error: 'obra_error',
  chatRadar: 'obra_chat_radar',
  chatVoz: 'obra_chat_voz',
  chatBriefing: 'obra_chat_briefing',
} as const

export function saveProvider(provider: Provider): void {
  localStorage.setItem(KEYS.provider, provider)
}

export function loadProvider(): Provider {
  const stored = localStorage.getItem(KEYS.provider) as Provider | null
  if (!stored || stored === ('groq' as string)) return 'gemini'
  return stored
}

export function saveApiKey(key: string): void {
  localStorage.setItem(KEYS.apiKey, key)
}

export function loadApiKey(): string {
  return localStorage.getItem(KEYS.apiKey) ?? ''
}

export function saveAnswers(answers: Answers): void {
  localStorage.setItem(KEYS.answers, JSON.stringify(answers))
}

export function loadAnswers(): Answers | null {
  const raw = localStorage.getItem(KEYS.answers)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Answers
  } catch {
    return null
  }
}

export function saveResult(result: ObraResult): void {
  localStorage.setItem(KEYS.result, JSON.stringify(result))
}

export function loadResult(): ObraResult | null {
  const raw = localStorage.getItem(KEYS.result)
  if (!raw) return null
  try {
    return JSON.parse(raw) as ObraResult
  } catch {
    return null
  }
}

export function saveError(message: string): void {
  localStorage.setItem(KEYS.error, message)
}

export function loadError(): string | null {
  return localStorage.getItem(KEYS.error)
}

export function clearError(): void {
  localStorage.removeItem(KEYS.error)
}

function chatKey(agentId: AgentId): string {
  if (agentId === 'radar') return KEYS.chatRadar
  if (agentId === 'voz') return KEYS.chatVoz
  return KEYS.chatBriefing
}

export function loadChatHistory(agentId: AgentId): Message[] {
  const raw = localStorage.getItem(chatKey(agentId))
  if (!raw) return []
  try {
    return JSON.parse(raw) as Message[]
  } catch {
    return []
  }
}

export function saveChatHistory(agentId: AgentId, messages: Message[]): void {
  localStorage.setItem(chatKey(agentId), JSON.stringify(messages))
}

export function clearChatHistory(agentId: AgentId): void {
  localStorage.removeItem(chatKey(agentId))
}

export function clearAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}
