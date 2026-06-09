import type { QuestionDef } from './types'

export const QUESTIONS: QuestionDef[] = [
  {
    id: 'q1',
    field: 'nicho',
    title: 'O que você faz ou quer ser conhecido por fazer?',
    type: 'text',
  },
  {
    id: 'q2',
    field: 'publico',
    title: 'Quem você quer que te contrate ou te siga?',
    type: 'text',
  },
  {
    id: 'q3',
    field: 'problema',
    title: 'Qual problema real você resolve para esse público?',
    type: 'text',
  },
  {
    id: 'q4',
    field: 'papel',
    title: 'Quando você está no seu melhor, qual papel você assume?',
    type: 'single',
    options: [
      { value: 'O arquiteto', label: 'O arquiteto', description: 'estruturo o problema antes de qualquer coisa' },
      { value: 'O provocador', label: 'O provocador', description: 'questiono e proponho o que ninguém pediu' },
      { value: 'O parceiro', label: 'O parceiro', description: 'construo junto, processo colaborativo' },
      { value: 'O executor', label: 'O executor', description: 'entro resolvendo com qualidade e velocidade' },
    ],
  },
  {
    id: 'q5',
    field: 'sentimento',
    title: 'Como você quer que as pessoas se sintam ao ver seu trabalho?',
    type: 'single',
    options: [
      { value: 'Impressionadas', label: 'Impressionadas', description: 'isso é nível diferente' },
      { value: 'Confiantes', label: 'Confiantes', description: 'esse cara sabe o que está fazendo' },
      { value: 'Provocadas', label: 'Provocadas', description: 'nunca tinha pensado nisso assim' },
      { value: 'Inspiradas', label: 'Inspiradas', description: 'quero fazer algo assim também' },
    ],
  },
  {
    id: 'q6',
    field: 'palavra',
    title: 'Qual palavra define melhor sua entrega?',
    type: 'single',
    options: [
      { value: 'Precisão', label: 'Precisão', description: 'cada decisão tem razão de ser' },
      { value: 'Impacto', label: 'Impacto', description: 'o trabalho muda algo real' },
      { value: 'Consistência', label: 'Consistência', description: 'funciona sempre' },
      { value: 'Inovação', label: 'Inovação', description: 'trago algo que não existia' },
    ],
  },
  {
    id: 'q7',
    field: 'energia',
    title: 'Se seu trabalho fosse uma força, qual seria?',
    type: 'single',
    options: [
      { value: 'Construção', label: 'Construção', description: 'cada peça tem função no sistema' },
      { value: 'Movimento', label: 'Movimento', description: 'tem direção, vai para algum lugar' },
      { value: 'Tensão', label: 'Tensão', description: 'o melhor design vive entre dois opostos' },
      { value: 'Clareza', label: 'Clareza', description: 'o complexo ficando simples' },
    ],
  },
  {
    id: 'q8',
    field: 'formatos',
    title: 'Como você prefere ou quer se comunicar?',
    type: 'multi',
    options: [
      { value: 'Carrossel', label: 'Carrossel', description: 'visual, retenção na leitura' },
      { value: 'Reels', label: 'Reels', description: 'processo ao vivo, tela gravada' },
      { value: 'Texto longo', label: 'Texto longo', description: 'LinkedIn, threads' },
      { value: 'Foto + legenda curta', label: 'Foto + legenda curta', description: 'imagem forte, copy direta' },
    ],
  },
]
