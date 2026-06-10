'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateObraResult } from '@/lib/ai'
import { loadApiKey, loadAnswers, loadProvider, saveResult, saveError, clearError } from '@/store/answers'

const MESSAGES = [
  'Mapeando seu arquétipo...',
  'Definindo seu tom de voz...',
  'Construindo sua paleta...',
  'Organizando sua linha editorial...',
  'Criando seus primeiros temas...',
]

function useRotatingMessage(messages: string[], interval = 2000) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), interval)
    return () => clearInterval(id)
  }, [messages, interval])
  return messages[index]
}

export default function ProcessingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const message = useRotatingMessage(MESSAGES)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const apiKey = loadApiKey()
    const answers = loadAnswers()

    if (!apiKey || !answers) {
      router.replace('/')
      return
    }

    clearError()
    const provider = loadProvider()

    generateObraResult(provider, apiKey, answers)
      .then((res) => {
        saveResult(res)
        router.push('/result')
      })
      .catch((err: Error) => {
        saveError(err.message || 'Erro ao gerar resultado. Tente novamente.')
        router.push('/result')
      })
  }, [mounted, router])

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#E83322]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E83322] animate-spin" />
        </div>
        <p className="text-sm text-[#F0EDE6]/50 transition-all duration-500">{message}</p>
        <span className="text-xs text-[#E83322] font-bold tracking-widest uppercase">OBRA</span>
      </div>
    </main>
  )
}
