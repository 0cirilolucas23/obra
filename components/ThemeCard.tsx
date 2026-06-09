'use client'

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
  const etapa = tema.etapa_obra?.toUpperCase() ?? 'O'
  const etapaColor = OBRA_COLORS[etapa] ?? '#E83322'
  const formatLabel = FORMAT_LABELS[tema.formato?.toLowerCase()] ?? tema.formato

  return (
    <div className="flex gap-4 p-4 bg-[#0A0A09] border border-[#F0EDE6]/8 rounded-lg group hover:border-[#F0EDE6]/20 transition-colors duration-200">
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
    </div>
  )
}
