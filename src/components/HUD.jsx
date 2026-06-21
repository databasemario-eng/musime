export default function HUD({ chrono, score, currentIdx, total, initialTime }) {
  const pct = (chrono / initialTime) * 100
  const color =
    pct > 60 ? 'text-green-400' :
    pct > 30 ? 'text-yellow-400' :
    'text-red-400'
  const barColor =
    pct > 60 ? 'bg-green-500' :
    pct > 30 ? 'bg-yellow-500' :
    'bg-red-500'

  return (
    <div className="flex items-center gap-4 bg-gray-900/80 border border-gray-700 rounded-2xl px-5 py-3 backdrop-blur">
      {/* timer */}
      <div className="flex flex-col items-center gap-1 min-w-[56px]">
        <span className={`text-3xl font-black tabular-nums ${color}`}>{chrono}</span>
        <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="w-px h-10 bg-gray-700" />

      {/* score */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-400 uppercase tracking-widest">Puntos</span>
        <span className="text-2xl font-black text-white tabular-nums">{score}</span>
      </div>

      <div className="w-px h-10 bg-gray-700" />

      {/* progress */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-400 uppercase tracking-widest">Carta</span>
        <span className="text-2xl font-black text-white tabular-nums">
          {currentIdx}
          <span className="text-sm text-gray-500">/{total}</span>
        </span>
      </div>
    </div>
  )
}
