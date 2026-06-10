'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'
import { callAgentAI } from '@/lib/ai'
import { buildAgentSystemPrompt } from '@/lib/prompts'
import type { AgentId, Message, ObraResult, Answers } from '@/lib/types'
import {
  loadApiKey,
  loadProvider,
  loadResult,
  loadAnswers,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
} from '@/store/answers'

const AGENTS: {
  id: AgentId
  name: string
  description: string
  placeholder: string
}[] = [
  {
    id: 'radar',
    name: 'RADAR',
    description: 'Tendências e temas do nicho',
    placeholder: 'Quais temas estão em alta no meu nicho agora?',
  },
  {
    id: 'voz',
    name: 'VOZ',
    description: 'Copy calibrada no seu tom',
    placeholder: 'Escreva um carrossel de 7 slides sobre [tema]',
  },
  {
    id: 'briefing',
    name: 'BRIEFING',
    description: 'Formatação para Figma',
    placeholder: 'Cole aqui a copy aprovada para formatar',
  },
]

const EMPTY_HISTORIES: Record<AgentId, Message[]> = {
  radar: [],
  voz: [],
  briefing: [],
}

export default function StudioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeAgent, setActiveAgent] = useState<AgentId>('radar')
  const [histories, setHistories] = useState<Record<AgentId, Message[]>>(EMPTY_HISTORIES)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ObraResult | null>(null)
  const [answers, setAnswers] = useState<Answers | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const apiKey = loadApiKey()
    const res = loadResult()
    const ans = loadAnswers()

    if (!apiKey || !res) {
      router.replace('/result')
      return
    }

    setResult(res)
    setAnswers(ans)
    setHistories({
      radar: loadChatHistory('radar'),
      voz: loadChatHistory('voz'),
      briefing: loadChatHistory('briefing'),
    })
  }, [mounted, router])

  const handleSend = useCallback(async (text: string) => {
    if (!result || !answers) return

    const apiKey = loadApiKey()
    const provider = loadProvider()
    if (!apiKey) return

    const systemPrompt = buildAgentSystemPrompt(activeAgent, result, answers)
    const currentHistory = histories[activeAgent]
    const newHistory: Message[] = [...currentHistory, { role: 'user', content: text }]

    setHistories((h) => ({ ...h, [activeAgent]: newHistory }))
    setLoading(true)

    try {
      const reply = await callAgentAI(provider, apiKey, systemPrompt, currentHistory, text)
      const updated: Message[] = [...newHistory, { role: 'assistant', content: reply }]
      setHistories((h) => ({ ...h, [activeAgent]: updated }))
      saveChatHistory(activeAgent, updated)
    } catch (err) {
      const msg = (err as Error).message || 'Erro ao conectar com a IA.'
      const updated: Message[] = [...newHistory, { role: 'assistant', content: `Erro: ${msg}` }]
      setHistories((h) => ({ ...h, [activeAgent]: updated }))
    } finally {
      setLoading(false)
    }
  }, [activeAgent, histories, result, answers])

  function handleClear() {
    clearChatHistory(activeAgent)
    setHistories((h) => ({ ...h, [activeAgent]: [] }))
  }

  if (!mounted) return null

  const activeInfo = AGENTS.find((a) => a.id === activeAgent)!

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar */}
      <aside className="flex-shrink-0 md:w-56 border-b md:border-b-0 md:border-r border-[#F0EDE6]/8 flex flex-row md:flex-col">

        {/* Desktop header */}
        <div className="hidden md:flex px-5 py-4 items-center justify-between border-b border-[#F0EDE6]/8">
          <button
            onClick={() => router.push('/result')}
            className="text-xs text-[#F0EDE6]/30 hover:text-[#F0EDE6]/60 transition-colors"
          >
            ← Resultado
          </button>
          <span className="text-xs font-bold text-[#E83322] tracking-widest">OBRA</span>
        </div>

        {/* Agent tabs */}
        <nav className="flex flex-row md:flex-col flex-1 md:flex-none md:py-3 overflow-x-auto md:overflow-visible">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(agent.id)}
              className={`flex-shrink-0 flex flex-col items-start px-5 py-3 md:py-3.5 text-left transition-all duration-200 border-b-2 md:border-b-0 md:border-l-2 ${
                activeAgent === agent.id
                  ? 'border-[#E83322] bg-[#E83322]/5'
                  : 'border-transparent hover:bg-[#F0EDE6]/3'
              }`}
            >
              <span className={`text-sm font-bold tracking-wide ${activeAgent === agent.id ? 'text-[#F0EDE6]' : 'text-[#F0EDE6]/40'}`}>
                {agent.name}
              </span>
              <span className="text-xs text-[#F0EDE6]/25 mt-0.5 hidden md:block leading-tight">
                {agent.description}
              </span>
            </button>
          ))}
        </nav>

        {/* Mobile: back to result */}
        <div className="md:hidden flex items-center px-3 border-l border-[#F0EDE6]/8">
          <button
            onClick={() => router.push('/result')}
            className="text-xs text-[#F0EDE6]/30 hover:text-[#F0EDE6]/60 transition-colors px-2 py-3 whitespace-nowrap"
          >
            ← Resultado
          </button>
        </div>

        {/* Arquétipo (desktop footer) */}
        {result && (
          <div className="hidden md:block mt-auto px-5 py-4 border-t border-[#F0EDE6]/8">
            <p className="text-xs text-[#F0EDE6]/25 uppercase tracking-widest mb-1">Arquétipo</p>
            <p className="text-xs text-[#F0EDE6]/50 leading-snug">{result.arquetipo.nome}</p>
          </div>
        )}
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-[#F0EDE6]/8 flex-shrink-0">
          <h2 className="text-sm font-semibold text-[#F0EDE6]">{activeInfo.name}</h2>
          <p className="text-xs text-[#F0EDE6]/40 mt-0.5">{activeInfo.description}</p>
        </div>

        {/* Chat window */}
        <div className="flex-1 min-h-0">
          <ChatWindow
            messages={histories[activeAgent]}
            loading={loading}
            onSend={handleSend}
            onClear={handleClear}
            placeholder={activeInfo.placeholder}
          />
        </div>
      </main>

    </div>
  )
}
