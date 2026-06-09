'use client'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-[#F0EDE6]/40 uppercase tracking-widest">
          OBRA
        </span>
        <span className="text-xs text-[#F0EDE6]/40">
          {current} / {total}
        </span>
      </div>
      <div className="h-[2px] w-full bg-[#F0EDE6]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#E83322] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
