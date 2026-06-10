'use client'

import { useState, useRef, useEffect } from 'react'
import type { Message } from '@/lib/types'

interface ChatWindowProps {
  messages: Message[]
  loading: boolean
  onSend: (text: string) => void
  onClear: () => void
  placeholder?: string
}

export default function ChatWindow({ messages, loading, onSend, onClear, placeholder }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    onSend(text)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 128) + 'px'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex justify-end px-4 py-2 border-b border-[#F0EDE6]/8 flex-shrink-0">
        <button
          onClick={onClear}
          className="text-xs text-[#F0EDE6]/25 hover:text-[#F0EDE6]/50 transition-colors"
        >
          Limpar conversa
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-0">
        {messages.length === 0 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <p className="text-sm text-[#F0EDE6]/20 max-w-xs leading-relaxed">
              {placeholder ?? 'Como posso ajudar?'}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'bg-[#E83322] text-white rounded-tr-sm'
                  : 'bg-[#1A0A0A] border border-[#F0EDE6]/8 text-[#F0EDE6]/80 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1A0A0A] border border-[#F0EDE6]/8 px-4 py-3 rounded-xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center h-4">
                <span className="w-1.5 h-1.5 bg-[#F0EDE6]/30 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-[#F0EDE6]/30 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-[#F0EDE6]/30 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[#F0EDE6]/8 flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem... (Enter para enviar)"
            rows={1}
            className="flex-1 resize-none bg-[#1A0A0A] border border-[#F0EDE6]/10 rounded-lg px-4 py-3 text-sm text-[#F0EDE6] placeholder-[#F0EDE6]/20 focus:outline-none focus:border-[#E83322]/60 transition-colors overflow-y-auto leading-relaxed"
            style={{ minHeight: '44px', maxHeight: '128px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`flex-shrink-0 w-11 h-11 rounded-lg text-base font-bold transition-all duration-200 ${
              input.trim() && !loading
                ? 'bg-[#E83322] text-white hover:bg-[#E83322]/85 active:scale-[0.95]'
                : 'bg-[#F0EDE6]/5 text-[#F0EDE6]/20 cursor-not-allowed'
            }`}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
