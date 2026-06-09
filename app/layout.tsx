import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'OBRA — Posicionamento de Marca Pessoal',
  description: 'Transforme suas respostas em uma narrativa completa de conteúdo e branding.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full bg-[#0A0A09] text-[#F0EDE6] antialiased">
        {children}
      </body>
    </html>
  )
}
