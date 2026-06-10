'use client'

import { useState } from 'react'
import type { Tema } from '@/lib/types'

interface ThemeCardProps {
  tema: Tema
  index: number
}

const OBRA_COLORS: Record<string, string> = {
  O: '#E83322',
  B: '#8B5CF6',
  R: '#F59E0B',
  A: '#10B981',
}

const FORMAT_LABELS: Record<string, string> = {
  carrossel: 'Carrossel',
  reel: 'Reel',
  texto: 'Texto',
  foto: 'Foto',
}

export default function ThemeCard({ tema, index }: ThemeCardProps) {
  const [expanded, setExpanded] = useState(false)
  const etapa = tema.etapa_obra?.toUpperCase() ?? 'O'
  const etapaColor = OBRA_COLORS[etapa] ?? '#E83322'
  const formatLabel = FORMAT_LABELS[tema.formato?.toLowerCase()] ?? tema.formato
  const hasEstrutura = Boolean(tema.estrutura)

  return (
    <div
      className={`flex flex-col p-4 bg-[#0A0A09] border rounded-lg transition-colors duration-200 ${
        expanded ? 'border-[#F0EDE6]/20' : 'border-[#F0EDE6]/8 hover:border-[#F0EDE6]/15'
      }`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <span className="text-xs text-[#F0EDE6]/30 font-mono">{String(index + 1).padStart(2, '0')}</span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${etapaColor}20`, color: etapaColor }}
          >
            {etapa}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#F0EDE6] leading-snug">{tema.titulo}</p>
          <p className="text-xs text-[#F0EDE6]/35 mt-1">{formatLabel}</p>
        </div>
        {hasEstrutura && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-shrink-0 text-xs text-[#F0EDE6]/25 hover:text-[#F0EDE6]/50 transition-colors self-start mt-0.5"
            aria-label={expanded ? 'Fechar' : 'Ver estrutura'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>

      {expanded && tema.estrutura && (
        <div className="mt-3 pt-3 border-t border-[#F0EDE6]/8">
          <p className="text-xs text-[#F0EDE6]/50 leading-relaxed">{tema.estrutura}</p>
        </div>
      )}
    </div>
  )
}
