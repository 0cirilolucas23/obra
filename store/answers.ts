import type { Answers, ObraResult } from '@/lib/types'
import type { Provider } from '@/lib/ai'

const KEYS = {
  provider: 'obra_provider',
  apiKey: 'obra_api_key',
  answers: 'obra_answers',
  result: 'obra_result',
} as const

export function saveProvider(provider: Provider): void {
  localStorage.setItem(KEYS.provider, provider)
}

export function loadProvider(): Provider {
  return (localStorage.getItem(KEYS.provider) as Provider) ?? 'groq'
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

export function clearAll(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
}
