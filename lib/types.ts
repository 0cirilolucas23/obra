export type QuestionType = 'text' | 'single' | 'multi'

export interface QuestionOption {
  value: string
  label: string
  description?: string
}

export interface QuestionDef {
  id: string
  field: keyof Answers
  title: string
  type: QuestionType
  options?: QuestionOption[]
}

export interface Answers {
  nicho: string
  publico: string
  problema: string
  papel: string
  sentimento: string
  palavra: string
  energia: string
  formatos: string[]
}

export interface Arquetipo {
  nome: string
  descricao: string
  frase_bio: string
}

export interface TomDeVoz {
  adjetivos: string[]
  falar: string[]
  nunca_falar: string[]
  exemplo_headline: string
}

export interface PaletaColor {
  nome: string
  hex: string
  uso: string
  justificativa: string
}

export interface PilarEditorial {
  nome: string
  descricao: string
  proporcao: string
}

export interface LinhaEditorial {
  pilares: PilarEditorial[]
  frequencia: string
  justificativa_frequencia?: string
}

export interface Tema {
  titulo: string
  formato: string
  etapa_obra: string
  estrutura?: string
}

export interface ObraResult {
  arquetipo: Arquetipo
  tom_de_voz: TomDeVoz
  paleta: PaletaColor[]
  linha_editorial: LinhaEditorial
  temas: Tema[]
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export type AgentId = 'radar' | 'voz' | 'briefing'
