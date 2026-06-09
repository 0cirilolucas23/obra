'use client'

import type { PaletaColor } from '@/lib/types'

interface ColorSwatchProps {
  color: PaletaColor
}

export default function ColorSwatch({ color }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="w-full h-20 rounded-lg border border-[#F0EDE6]/10"
        style={{ backgroundColor: color.hex }}
      />
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-[#F0EDE6]">{color.nome}</span>
          <code className="text-xs text-[#F0EDE6]/40 font-mono">{color.hex}</code>
        </div>
        <p className="text-xs text-[#F0EDE6]/50 mt-1">{color.uso}</p>
        <p className="text-xs text-[#F0EDE6]/35 mt-1 italic">{color.justificativa}</p>
      </div>
    </div>
  )
}
