'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProgressBar from '@/components/ProgressBar'
import Question from '@/components/Question'
import { QUESTIONS } from '@/lib/questions'
import type { Answers } from '@/lib/types'
import { loadApiKey, saveAnswers } from '@/store/answers'

const EMPTY_ANSWERS: Answers = {
  nicho: '',
  publico: '',
  problema: '',
  papel: '',
  sentimento: '',
  palavra: '',
  energia: '',
  formatos: [],
}

export default function QuestionnairePage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!loadApiKey()) {
      router.replace('/')
    }
  }, [router])

  function getAnswer(field: keyof Answers): string | string[] {
    return answers[field]
  }

  function setAnswer(field: keyof Answers, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [field]: value }))
  }

  function handleNext() {
    const question = QUESTIONS[current]
    const val = answers[question.field]
    const hasValue = Array.isArray(val) ? val.length > 0 : (val as string).trim().length > 0
    if (!hasValue) return

    if (current === QUESTIONS.length - 1) {
      saveAnswers(answers)
      router.push('/result')
      return
    }

    setVisible(false)
    setTimeout(() => {
      setCurrent((c) => c + 1)
      setVisible(true)
    }, 200)
  }

  function handleBack() {
    if (current === 0) {
      router.push('/')
      return
    }
    setVisible(false)
    setTimeout(() => {
      setCurrent((c) => c - 1)
      setVisible(true)
    }, 200)
  }

  if (!mounted) return null

  const question = QUESTIONS[current]

  return (
    <main className="min-h-screen flex flex-col px-6 py-8">
      <div className="w-full max-w-lg mx-auto flex flex-col flex-1">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={handleBack}
            className="text-[#F0EDE6]/30 hover:text-[#F0EDE6]/70 transition-colors duration-200 text-sm"
            aria-label="Voltar"
          >
            ←
          </button>
          <div className="flex-1">
            <ProgressBar current={current + 1} total={QUESTIONS.length} />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center">
          <Question
            question={question}
            value={getAnswer(question.field)}
            onChange={(val) => setAnswer(question.field, val)}
            onNext={handleNext}
            isLast={current === QUESTIONS.length - 1}
            visible={visible}
          />
        </div>
      </div>
    </main>
  )
}
