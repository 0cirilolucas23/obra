'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PROVIDERS, type Provider } from '@/lib/ai'
import { saveApiKey, loadApiKey, saveProvider, loadProvider } from '@/store/answers'

const TUTORIAL_STEPS = [
  {
    title: 'Escolha sua IA',
    description:
      'Selecione qual inteligência artificial você prefere usar. O Groq é gratuito para começar — basta criar uma conta.',
  },
  {
    title: 'Obtenha sua API Key',
    description:
      'Com a IA selecionada, clique no botão "Gerar →" ao lado do campo de chave. Você será direcionado à página da IA para criar sua API Key gratuitamente.',
  },
]

export default function LandingPage() {
  const router = useRouter()
  const [provider, setProvider] = useState<Provider>('gemini')
  const [apiKey, setApiKey] = useState('')
  const [mounted, setMounted] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(0)

  useEffect(() => {
    setMounted(true)
    setProvider(loadProvider())
    setApiKey(loadApiKey())
    if (!localStorage.getItem('obra_tutorial_seen')) {
      setShowTutorial(true)
    }
  }, [])

  function closeTutorial() {
    setShowTutorial(false)
    localStorage.setItem('obra_tutorial_seen', '1')
  }

  function nextStep() {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1)
    } else {
      closeTutorial()
    }
  }

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
    <>
      {/* ── Animated background ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* pixel dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(232,51,34,0.07) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            animation: 'dots-breathe 9s ease-in-out infinite',
          }}
        />
        {/* mesh orb 1 — top-left */}
        <div
          className="absolute rounded-full"
          style={{
            width: '45vw',
            height: '45vw',
            background: 'rgba(232,51,34,0.045)',
            filter: 'blur(110px)',
            top: '-12%',
            left: '-8%',
            animation: 'mesh-drift-1 22s ease-in-out infinite',
          }}
        />
        {/* mesh orb 2 — bottom-right */}
        <div
          className="absolute rounded-full"
          style={{
            width: '38vw',
            height: '38vw',
            background: 'rgba(232,51,34,0.035)',
            filter: 'blur(90px)',
            bottom: '-6%',
            right: '2%',
            animation: 'mesh-drift-2 28s ease-in-out infinite',
          }}
        />
        {/* mesh orb 3 — mid-right */}
        <div
          className="absolute rounded-full"
          style={{
            width: '28vw',
            height: '28vw',
            background: 'rgba(232,51,34,0.03)',
            filter: 'blur(70px)',
            top: '38%',
            right: '-4%',
            animation: 'mesh-drift-3 19s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Tutorial popup ── */}
      {showTutorial && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            style={{ backdropFilter: 'blur(6px)' }}
            onClick={closeTutorial}
          />
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-[#130606] border border-[#F0EDE6]/10 rounded-2xl p-6 shadow-2xl">
            {/* close */}
            <button
              onClick={closeTutorial}
              className="absolute top-3.5 right-3.5 text-[#F0EDE6]/25 hover:text-[#F0EDE6]/55 transition-colors text-base leading-none"
              aria-label="Fechar"
            >
              ✕
            </button>

            {/* step indicator */}
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#E83322]/60">
              Passo {tutorialStep + 1} de {TUTORIAL_STEPS.length}
            </span>

            <h3 className="mt-1.5 text-[#F0EDE6] font-semibold text-base">
              {TUTORIAL_STEPS[tutorialStep].title}
            </h3>
            <p className="mt-2 text-[#F0EDE6]/50 text-sm leading-relaxed">
              {TUTORIAL_STEPS[tutorialStep].description}
            </p>

            {/* dots + actions */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-1 items-center">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === tutorialStep ? 16 : 6,
                      background:
                        i === tutorialStep
                          ? '#E83322'
                          : 'rgba(240,237,230,0.18)',
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {tutorialStep < TUTORIAL_STEPS.length - 1 && (
                  <button
                    onClick={closeTutorial}
                    className="text-xs text-[#F0EDE6]/25 hover:text-[#F0EDE6]/45 transition-colors underline underline-offset-2"
                  >
                    Pular
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="text-xs bg-[#E83322] text-white px-5 py-2 rounded-lg hover:bg-[#E83322]/85 transition-colors font-semibold shadow-md shadow-[#E83322]/20"
                >
                  {tutorialStep < TUTORIAL_STEPS.length - 1 ? 'Seguinte' : 'Entendido'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Main content ── */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16">
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
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={`flex flex-col items-start px-3 py-2.5 rounded-lg border text-left transition-all duration-200 ${
                    provider === p.id
                      ? 'border-[#E83322] bg-[#E83322]/10'
                      : 'border-[#F0EDE6]/10 bg-[#1A0A0A] hover:border-[#F0EDE6]/20'
                  }`}
                >
                  <span
                    className={`text-sm font-medium leading-tight ${
                      provider === p.id ? 'text-[#F0EDE6]' : 'text-[#F0EDE6]/60'
                    }`}
                  >
                    {p.name}
                  </span>
                  {p.free && (
                    <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded mt-1">
                      GRÁTIS
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-[#F0EDE6]/30 leading-relaxed">
              Para o agente RADAR funcionar com pesquisa real, use Gemini Flash — único com Google Search integrado.
            </p>
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
            <p className="mt-4 text-xs text-[#6EE7B7]/40 leading-relaxed">
              Salva só no seu navegador — nunca sai do dispositivo.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={!apiKey.trim()}
            className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              apiKey.trim()
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
              Em parceria com{' '}
              <a
                href="https://www.growfy.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E83322]/70 hover:text-[#E83322] transition-colors"
              >
                Growfy
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
