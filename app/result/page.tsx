'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ResultBlock from '@/components/ResultBlock'
import ColorSwatch from '@/components/ColorSwatch'
import ThemeCard from '@/components/ThemeCard'
import type { ObraResult } from '@/lib/types'
import { loadResult, loadError, clearAll, clearError } from '@/store/answers'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<ObraResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [bioCopied, setBioCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const cachedResult = loadResult()
    const cachedError = loadError()

    if (cachedResult) {
      setResult(cachedResult)
      return
    }

    if (cachedError) {
      setError(cachedError)
      return
    }

    router.replace('/')
  }, [mounted, router])

  function handleCopyBio() {
    if (!result) return
    navigator.clipboard.writeText(result.arquetipo.frase_bio).then(() => {
      setBioCopied(true)
      setTimeout(() => setBioCopied(false), 2000)
    }).catch(() => {})
  }

  function handleCopyAll() {
    if (!result) return
    navigator.clipboard.writeText(buildMarkdown(result)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  function handleDownloadPDF() {
    window.print()
  }

  function handleRestart() {
    clearAll()
    router.push('/')
  }

  function handleRetry() {
    clearError()
    router.push('/processing')
  }

  if (!mounted) return null

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <p className="text-[#E83322] font-semibold mb-2">Algo deu errado</p>
          <p className="text-sm text-[#F0EDE6]/50 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-[#E83322] text-white rounded-lg text-sm font-semibold hover:bg-[#E83322]/80 transition-colors mr-3"
          >
            Tentar novamente
          </button>
          <button
            onClick={handleRestart}
            className="px-6 py-3 border border-[#F0EDE6]/10 text-[#F0EDE6]/60 rounded-lg text-sm hover:border-[#F0EDE6]/25 transition-colors"
          >
            Recomeçar
          </button>
        </div>
      </main>
    )
  }

  if (!result) return null

  return (
    <main className="min-h-screen px-4 py-12 print:py-6">
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10 print:mb-6">
          <span className="text-xs font-bold text-[#E83322] tracking-[0.3em] uppercase">OBRA</span>
          <h1 className="mt-2 text-3xl font-semibold text-[#F0EDE6]">Seu sistema de posicionamento</h1>
          <p className="mt-1 text-sm text-[#F0EDE6]/40">Gerado com base nas suas respostas</p>
        </div>

        {/* Blocks */}
        <div className="flex flex-col gap-6">

          {/* Bloco 1 — Arquétipo */}
          <ResultBlock label="01" title={result.arquetipo.nome}>
            <p className="text-sm text-[#F0EDE6]/60 leading-relaxed mb-4 whitespace-pre-line">
              {result.arquetipo.descricao}
            </p>
            <div className="bg-[#0A0A09] border border-[#E83322]/20 rounded-lg px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#E83322] uppercase tracking-widest mb-1">Frase para bio</p>
                  <p className="text-sm text-[#F0EDE6] font-medium">{result.arquetipo.frase_bio}</p>
                </div>
                <button
                  onClick={handleCopyBio}
                  className="flex-shrink-0 text-xs text-[#F0EDE6]/30 hover:text-[#E83322] transition-colors mt-0.5"
                >
                  {bioCopied ? 'copiado!' : 'copiar'}
                </button>
              </div>
            </div>
          </ResultBlock>

          {/* Bloco 2 — Tom de Voz */}
          <ResultBlock label="02" title="Tom de Voz">
            <div className="flex gap-2 flex-wrap mb-5">
              {result.tom_de_voz.adjetivos.map((adj) => (
                <span
                  key={adj}
                  className="px-3 py-1 bg-[#E83322]/10 text-[#E83322] text-xs font-semibold rounded-full border border-[#E83322]/20"
                >
                  {adj}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-[#F0EDE6]/30 uppercase tracking-widest mb-2">Fale sobre</p>
                <ul className="flex flex-col gap-1.5">
                  {result.tom_de_voz.falar.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#F0EDE6]/70">
                      <span className="text-[#10B981] mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-[#F0EDE6]/30 uppercase tracking-widest mb-2">Nunca fale</p>
                <ul className="flex flex-col gap-1.5">
                  {result.tom_de_voz.nunca_falar.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#F0EDE6]/70">
                      <span className="text-[#E83322] mt-0.5 flex-shrink-0">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#0A0A09] border border-[#F0EDE6]/8 rounded-lg px-4 py-3">
              <p className="text-xs text-[#F0EDE6]/30 uppercase tracking-widest mb-1">Exemplo de headline</p>
              <p className="text-sm text-[#F0EDE6] font-medium italic">"{result.tom_de_voz.exemplo_headline}"</p>
            </div>
          </ResultBlock>

          {/* Bloco 3 — Paleta */}
          <ResultBlock label="03" title="Paleta de Cores">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {result.paleta.map((color) => (
                <ColorSwatch key={color.hex} color={color} />
              ))}
            </div>
          </ResultBlock>

          {/* Bloco 4 — Linha Editorial */}
          <ResultBlock label="04" title="Linha Editorial">
            <div className="flex flex-col gap-4 mb-5">
              {result.linha_editorial.pilares.map((pilar) => (
                <div key={pilar.nome} className="flex items-start gap-4">
                  <span className="text-sm font-bold text-[#E83322] w-10 flex-shrink-0 pt-0.5">
                    {pilar.proporcao}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#F0EDE6]">{pilar.nome}</p>
                    <p className="text-xs text-[#F0EDE6]/50 mt-0.5">{pilar.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0A0A09] border border-[#F0EDE6]/8 rounded-lg px-4 py-3">
              <p className="text-xs text-[#F0EDE6]/50 font-medium">{result.linha_editorial.frequencia}</p>
              {result.linha_editorial.justificativa_frequencia && (
                <p className="text-xs text-[#F0EDE6]/35 mt-2 leading-relaxed">
                  {result.linha_editorial.justificativa_frequencia}
                </p>
              )}
            </div>
          </ResultBlock>

          {/* Bloco 5 — Temas */}
          <ResultBlock label="05" title="Primeiros 8 Temas">
            <div className="flex flex-col gap-2">
              {result.temas.slice(0, 8).map((tema, i) => (
                <ThemeCard key={i} tema={tema} index={i} />
              ))}
            </div>
          </ResultBlock>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <button
            onClick={() => router.push('/studio')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E83322] text-white rounded-lg text-sm font-semibold hover:bg-[#E83322]/85 active:scale-[0.98] transition-all duration-200"
          >
            Abrir Estúdio OBRA →
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A0A0A] border border-[#F0EDE6]/10 text-[#F0EDE6]/70 rounded-lg text-sm hover:border-[#F0EDE6]/25 hover:text-[#F0EDE6] transition-all duration-200"
          >
            {copied ? 'Copiado!' : 'Copiar tudo'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A0A0A] border border-[#F0EDE6]/10 text-[#F0EDE6]/70 rounded-lg text-sm hover:border-[#F0EDE6]/25 hover:text-[#F0EDE6] transition-all duration-200"
          >
            Baixar PDF
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E83322]/10 border border-[#E83322]/20 text-[#E83322] rounded-lg text-sm hover:bg-[#E83322]/20 transition-all duration-200"
          >
            Recomeçar
          </button>
        </div>

      </div>
    </main>
  )
}

function buildMarkdown(result: ObraResult): string {
  const { arquetipo, tom_de_voz, paleta, linha_editorial, temas } = result

  return `# OBRA — Seu Sistema de Posicionamento

## Arquétipo: ${arquetipo.nome}

${arquetipo.descricao}

**Frase para bio:** ${arquetipo.frase_bio}

---

## Tom de Voz

**Adjetivos:** ${tom_de_voz.adjetivos.join(', ')}

**Fale sobre:**
${tom_de_voz.falar.map((f) => `- ${f}`).join('\n')}

**Nunca fale:**
${tom_de_voz.nunca_falar.map((f) => `- ${f}`).join('\n')}

**Exemplo de headline:** "${tom_de_voz.exemplo_headline}"

---

## Paleta de Cores

${paleta.map((c) => `- **${c.nome}** (${c.hex}) — ${c.uso}. ${c.justificativa}`).join('\n')}

---

## Linha Editorial

${linha_editorial.pilares.map((p) => `- **${p.nome}** (${p.proporcao}): ${p.descricao}`).join('\n')}

**Frequência:** ${linha_editorial.frequencia}
${linha_editorial.justificativa_frequencia ? `\n${linha_editorial.justificativa_frequencia}` : ''}

---

## Primeiros 8 Temas

${temas.slice(0, 8).map((t, i) => `${i + 1}. **${t.titulo}** — ${t.formato} — Etapa ${t.etapa_obra}${t.estrutura ? `\n   ${t.estrutura}` : ''}`).join('\n')}
`
}
