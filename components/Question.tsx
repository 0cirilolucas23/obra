'use client'

import { useState, useEffect, useRef } from 'react'
import type { QuestionDef } from '@/lib/types'

interface QuestionProps {
  question: QuestionDef
  value: string | string[]
  onChange: (value: string | string[]) => void
  onNext: () => void
  isLast: boolean
  visible: boolean
}

export default function Question({ question, value, onChange, onNext, isLast, visible }: QuestionProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (visible && question.type === 'text' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 220)
    }
  }, [visible, question.type])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey && canProceed) {
      e.preventDefault()
      onNext()
    }
  }

  function toggleMulti(v: string) {
    const arr = value as string[]
    if (arr.includes(v)) {
      onChange(arr.filter((x) => x !== v))
    } else {
      onChange([...arr, v])
    }
  }

  const canProceed =
    question.type === 'multi'
      ? (value as string[]).length > 0
      : (value as string).trim().length > 0

  return (
    <div
      className={`transition-all duration-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#F0EDE6] leading-tight mb-8">
        {question.title}
      </h2>

      {question.type === 'text' && (
        <textarea
          ref={inputRef}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva aqui..."
          rows={3}
          className="w-full bg-[#1A0A0A] border border-[#F0EDE6]/10 rounded-lg px-4 py-3 text-[#F0EDE6] placeholder-[#F0EDE6]/25 resize-none focus:outline-none focus:border-[#E83322]/60 transition-colors duration-200 text-base"
        />
      )}

      {(question.type === 'single' || question.type === 'multi') && (
        <div className="flex flex-col gap-3">
          {question.options?.map((opt) => {
            const selected =
              question.type === 'single'
                ? value === opt.value
                : (value as string[]).includes(opt.value)

            return (
              <button
                key={opt.value}
                onClick={() => {
                  if (question.type === 'single') {
                    onChange(opt.value)
                  } else {
                    toggleMulti(opt.value)
                  }
                }}
                className={`flex items-start gap-4 w-full text-left px-4 py-4 rounded-lg border transition-all duration-200 ${
                  selected
                    ? 'border-[#E83322] bg-[#E83322]/10 text-[#F0EDE6]'
                    : 'border-[#F0EDE6]/10 bg-[#1A0A0A] text-[#F0EDE6]/70 hover:border-[#F0EDE6]/25 hover:text-[#F0EDE6]'
                }`}
              >
                <span
                  className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                    selected ? 'border-[#E83322] bg-[#E83322]' : 'border-[#F0EDE6]/30'
                  }`}
                >
                  {selected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                  )}
                </span>
                <div>
                  <span className="font-medium text-sm sm:text-base">{opt.label}</span>
                  {opt.description && (
                    <span className="block text-xs text-[#F0EDE6]/40 mt-0.5">
                      {opt.description}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            canProceed
              ? 'bg-[#E83322] text-white hover:bg-[#E83322]/80 active:scale-95'
              : 'bg-[#F0EDE6]/10 text-[#F0EDE6]/30 cursor-not-allowed'
          }`}
        >
          {isLast ? 'Gerar minha identidade' : 'Continuar'}
        </button>
        {question.type === 'text' && (
          <span className="ml-4 text-xs text-[#F0EDE6]/25">Enter ↵</span>
        )}
      </div>
    </div>
  )
}
