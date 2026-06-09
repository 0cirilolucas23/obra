'use client'

interface ResultBlockProps {
  label: string
  title: string
  children: React.ReactNode
}

export default function ResultBlock({ label, title, children }: ResultBlockProps) {
  return (
    <section className="bg-[#1A0A0A] border border-[#F0EDE6]/8 rounded-xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-bold text-[#E83322] uppercase tracking-widest">{label}</span>
        <div className="flex-1 h-px bg-[#F0EDE6]/8" />
      </div>
      <h3 className="text-xl font-semibold text-[#F0EDE6] mb-6">{title}</h3>
      {children}
    </section>
  )
}
