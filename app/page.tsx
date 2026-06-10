'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PROVIDERS, type Provider } from '@/lib/ai'
import { saveApiKey, loadApiKey, saveProvider, loadProvider } from '@/store/answers'

export default function LandingPage() {
  const router = useRouter()
  const [provider, setProvider] = useState<Provider>('groq')
  const [apiKey, setApiKey] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProvider(loadProvider())
    setApiKey(loadApiKey())
  }, [])

  // Reset key when provider changes (different key format)
  function handleProviderChange(p: Provider) {
    setProvider(p)
    setApiKey('')
  }

  function handleStart() {
    if (!apiKey.trim()) return
    saveProvider(provider)
    saveApiKey(apiKey.trim())
    router.push('/questionnaire')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && apiKey.trim()) handleStart()
  }

  if (!mounted) return null

  const currentProvider = PROVIDERS.find((p) => p.id === provider)!

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-10">
          <span className="text-xs font-bold text-[#E83322] tracking-[0.3em] uppercase">OBRA</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-semibold text-[#F0EDE6] leading-tight tracking-tight">
            Sua marca.<br />
            Sua narrativa.<br />
            Sua identidade.
          </h1>
          <p className="mt-4 text-base text-[#F0EDE6]/50 leading-relaxed max-w-sm">
            Responda 8 perguntas e receba um sistema completo de branding e conteúdo gerado por IA.
          </p>
        </div>

        {/* Provider selector */}
        <div className="mb-5">
          <p className="text-xs text-[#F0EDE6]/40 uppercase tracking-widest mb-3">
            Escolha sua IA
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProviderChange(p.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all duration-200 ${provider === p.id
                    ? 'border-[#E83322] bg-[#E83322]/10'
                    : 'border-[#F0EDE6]/10 bg-[#1A0A0A] hover:border-[#F0EDE6]/20'
                  }`}
              >
                <span className={`text-sm font-medium ${provider === p.id ? 'text-[#F0EDE6]' : 'text-[#F0EDE6]/60'}`}>
                  {p.name}
                </span>
                {p.free && (
                  <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                    FREE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div className="mb-6">
          <label className="block text-xs text-[#F0EDE6]/40 uppercase tracking-widest mb-2">
            API Key — {currentProvider.name}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentProvider.placeholder}
            className="w-full bg-[#1A0A0A] border border-[#F0EDE6]/10 rounded-lg px-4 py-3 text-[#F0EDE6] placeholder-[#F0EDE6]/20 focus:outline-none focus:border-[#E83322]/60 transition-colors duration-200 text-sm"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xs text-[#F0EDE6]/25 leading-relaxed flex-1">
              {currentProvider.hint}
            </p>
            <a
              href={currentProvider.keyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#E83322]/70 hover:text-[#E83322] transition-colors flex-shrink-0"
            >
              Gerar →
            </a>
          </div>
          <p className="mt-1.5 text-xs text-[#F0EDE6]/20">
            Salva só no seu navegador — nunca sai do dispositivo.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!apiKey.trim()}
          className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 ${apiKey.trim()
              ? 'bg-[#E83322] text-white hover:bg-[#E83322]/85 active:scale-[0.98]'
              : 'bg-[#F0EDE6]/8 text-[#F0EDE6]/25 cursor-not-allowed'
            }`}
        >
          Começar agora
        </button>

        {/* Method */}
        <div className="mt-10 pt-8 border-t border-[#F0EDE6]/8">
          <p className="text-xs text-[#F0EDE6]/25 uppercase tracking-widest mb-4">Método OBRA</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { letter: 'O', word: 'Orientação' },
              { letter: 'B', word: 'Busca' },
              { letter: 'R', word: 'Rascunho' },
              { letter: 'A', word: 'Arte' },
            ].map(({ letter, word }) => (
              <div key={letter} className="text-center">
                <span className="block text-3xl font-bold text-[#E83322]">{letter}</span>
                <span className="block text-xs text-[#F0EDE6]/30 mt-0.5">{word}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex items-center justify-center gap-2">
        <p className="mt-1.5 text-xs text-[#F0EDE6]/20">
          Em parceria com <a href="https://www.growfy.com.br/" target="_blank" rel="noopener noreferrer" className="text-[#E83322]/70 hover:text-[#E83322] transition-colors">Growfy</a>.
        </p>
      </div>

    </div>
    </main >
  )
}
