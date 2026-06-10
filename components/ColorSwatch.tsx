'use client'

import { useState } from 'react'
import type { PaletaColor } from '@/lib/types'

interface ColorSwatchProps {
  color: PaletaColor
}

export default function ColorSwatch({ color }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(color.hex).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleCopy}
        title={`Copiar ${color.hex}`}
        className="w-full h-20 rounded-lg border border-[#F0EDE6]/10 transition-opacity hover:opacity-80 active:scale-[0.97] duration-150"
        style={{ backgroundColor: color.hex }}
      />
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-[#F0EDE6]">{color.nome}</span>
          <button
            onClick={handleCopy}
            className="text-xs text-[#F0EDE6]/40 font-mono hover:text-[#E83322] transition-colors"
          >
            {copied ? '✓' : color.hex}
          </button>
        </div>
        <p className="text-xs text-[#F0EDE6]/50 mt-1">{color.uso}</p>
        <p className="text-xs text-[#F0EDE6]/35 mt-1 italic">{color.justificativa}</p>
      </div>
    </div>
  )
}
