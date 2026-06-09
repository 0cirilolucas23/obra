import type { Answers } from './types'

export function buildPrompt(answers: Answers): string {
  return `Você é o OBRA, sistema de posicionamento de marca pessoal.

Com base nas respostas abaixo, gere um sistema completo de posicionamento e conteúdo. Responda APENAS em JSON válido, sem markdown, sem blocos de código, apenas o JSON puro.

RESPOSTAS DO USUÁRIO:
Nicho: ${answers.nicho}
Público: ${answers.publico}
Problema que resolve: ${answers.problema}
Papel natural: ${answers.papel}
Sentimento desejado: ${answers.sentimento}
Palavra que define a entrega: ${answers.palavra}
Energia da marca: ${answers.energia}
Formatos preferidos: ${answers.formatos.join(', ')}

RETORNE EXATAMENTE ESTE JSON:
{
  "arquetipo": {
    "nome": "string — nome do arquétipo (ex: O Estrategista Criativo)",
    "descricao": "string — 3 linhas descrevendo o arquétipo",
    "frase_bio": "string — frase pronta para bio do Instagram (máx 150 chars)"
  },
  "tom_de_voz": {
    "adjetivos": ["string", "string", "string"],
    "falar": ["string", "string", "string"],
    "nunca_falar": ["string", "string", "string"],
    "exemplo_headline": "string"
  },
  "paleta": [
    {
      "nome": "string",
      "hex": "string — ex: #0A0A09",
      "uso": "string — ex: Fundo de página",
      "justificativa": "string — 1 linha"
    }
  ],
  "linha_editorial": {
    "pilares": [
      {
        "nome": "string",
        "descricao": "string",
        "proporcao": "string — ex: 50%"
      }
    ],
    "frequencia": "string — ex: 3 posts por semana"
  },
  "temas": [
    {
      "titulo": "string — headline do post",
      "formato": "string — carrossel | reel | texto | foto",
      "etapa_obra": "string — O | B | R | A"
    }
  ]
}

Gere exatamente 4 cores na paleta e exatamente 8 temas. Retorne apenas o JSON, sem nenhum texto adicional.`
}
