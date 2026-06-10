import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Answers, ObraResult, Message } from './types'
import { buildPrompt } from './prompts'

export type Provider = 'groq' | 'gemini' | 'openai' | 'anthropic'

export interface ProviderInfo {
  id: Provider
  name: string
  model: string
  free: boolean
  placeholder: string
  hint: string
  keyUrl: string
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'groq',
    name: 'Groq',
    model: 'llama-3.3-70b-versatile',
    free: true,
    placeholder: 'gsk_...',
    hint: 'Gratuito — gere sua key em console.groq.com',
    keyUrl: 'https://console.groq.com/keys',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'gemini-2.0-flash-lite',
    free: false,
    placeholder: 'AIza...',
    hint: 'Requer faturamento — aistudio.google.com/app/apikey',
    keyUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'gpt-4o-mini',
    free: false,
    placeholder: 'sk-...',
    hint: 'platform.openai.com/api-keys',
    keyUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    model: 'claude-haiku-4-5-20251001',
    free: false,
    placeholder: 'sk-ant-...',
    hint: 'console.anthropic.com/settings/keys',
    keyUrl: 'https://console.anthropic.com/settings/keys',
  },
]

// ── One-shot (STEP 4 result generation) ──────────────────────────────────────

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } }).error?.message ?? res.statusText
    throw new Error(`[${res.status}] ${msg}`)
  }

  const data = await res.json() as { choices: { message: { content: string } }[] }
  return data.choices[0].message.content
}

async function callAnthropic(apiKey: string, model: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } }).error?.message ?? res.statusText
    throw new Error(`[${res.status}] ${msg}`)
  }

  const data = await res.json() as { content: { type: string; text: string }[] }
  return data.content[0].text
}

async function callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({ model })
  const result = await geminiModel.generateContent(prompt)
  return result.response.text()
}

function parseResult(text: string): ObraResult {
  const clean = text.trim()
  const match = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  const raw = (match ? match[1] : clean).trim()
  try {
    return JSON.parse(raw) as ObraResult
  } catch {
    throw new Error('Resposta inválida da API. Verifique sua key e tente novamente.')
  }
}

function friendlyError(err: Error): Error {
  const msg = err.message ?? ''
  if (msg.includes('429')) {
    return new Error('Quota excedida. Aguarde 1 minuto e tente novamente.')
  }
  if (msg.includes('401') || msg.includes('403') || msg.includes('invalid_api_key')) {
    return new Error('API key inválida ou sem permissão. Verifique e tente novamente.')
  }
  return err
}

export async function generateObraResult(
  provider: Provider,
  apiKey: string,
  answers: Answers
): Promise<ObraResult> {
  const info = PROVIDERS.find((p) => p.id === provider)!
  const prompt = buildPrompt(answers)

  try {
    let text: string
    switch (provider) {
      case 'groq':
        text = await callOpenAICompatible('https://api.groq.com/openai/v1', apiKey, info.model, prompt)
        break
      case 'openai':
        text = await callOpenAICompatible('https://api.openai.com/v1', apiKey, info.model, prompt)
        break
      case 'anthropic':
        text = await callAnthropic(apiKey, info.model, prompt)
        break
      case 'gemini':
        text = await callGemini(apiKey, info.model, prompt)
        break
    }
    return parseResult(text)
  } catch (err) {
    throw friendlyError(err as Error)
  }
}

// ── Chat with history (STEP 5 agents) ────────────────────────────────────────

async function callAgentOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  history: Message[],
  userMessage: string
): Promise<string> {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, max_tokens: 2048 }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } }).error?.message ?? res.statusText
    throw new Error(`[${res.status}] ${msg}`)
  }

  const data = await res.json() as { choices: { message: { content: string } }[] }
  return data.choices[0].message.content
}

async function callAgentAnthropic(
  apiKey: string,
  model: string,
  systemPrompt: string,
  history: Message[],
  userMessage: string
): Promise<string> {
  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: 2048, system: systemPrompt, messages }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } }).error?.message ?? res.statusText
    throw new Error(`[${res.status}] ${msg}`)
  }

  const data = await res.json() as { content: { type: string; text: string }[] }
  return data.content[0].text
}

async function callAgentGemini(
  apiKey: string,
  model: string,
  systemPrompt: string,
  history: Message[],
  userMessage: string
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
  })

  const chat = geminiModel.startChat({
    history: history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  })

  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}

export async function callAgentAI(
  provider: Provider,
  apiKey: string,
  systemPrompt: string,
  history: Message[],
  userMessage: string
): Promise<string> {
  const info = PROVIDERS.find((p) => p.id === provider)!

  try {
    switch (provider) {
      case 'groq':
        return await callAgentOpenAICompatible('https://api.groq.com/openai/v1', apiKey, info.model, systemPrompt, history, userMessage)
      case 'openai':
        return await callAgentOpenAICompatible('https://api.openai.com/v1', apiKey, info.model, systemPrompt, history, userMessage)
      case 'anthropic':
        return await callAgentAnthropic(apiKey, info.model, systemPrompt, history, userMessage)
      case 'gemini':
        return await callAgentGemini(apiKey, info.model, systemPrompt, history, userMessage)
    }
  } catch (err) {
    throw friendlyError(err as Error)
  }
}
