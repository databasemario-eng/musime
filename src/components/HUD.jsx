export default function HUD({ score, chrono, timeLimit, mode, totalFails }) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const ratio = Math.max(0, chrono / timeLimit)
  const dashOffset = circumference * (1 - ratio)

  const timerColor = ratio > 0.6 ? '#22c55e' : ratio > 0.3 ? '#fcbe00' : '#ef4444'

  const maxFails = 2
  const remainingFails = Math.max(0, maxFails - totalFails)

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800 sticky top-0 z-20">

      {/* Timer */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="#1f2937" strokeWidth="8" fill="none" />
          <circle
            cx="50" cy="50" r={radius}
            stroke={timerColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-xl leading-none">{chrono}</span>
        </div>
      </div>

      {/* Score */}
      <div className="text-center">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-['Nunito']">Puntos</p>
        <p className="text-[#fcbe00] font-black text-4xl font-['Bangers'] tracking-wider leading-none">{score}</p>
      </div>

      {/* Mode + Lives */}
      <div className="text-right">
        <p
          className="font-black text-xs tracking-widest font-['Bangers'] mb-1"
          style={{ color: mode === 'yamete' ? '#b7002b' : '#ffffff' }}
        >
          {mode === 'yamete' ? 'YAMETE' : 'NORMAL'}
        </p>
        {mode === 'normal' && (
          <div className="flex gap-1 justify-end">
            {Array.from({ length: maxFails }).map((_, i) => (
              <span
                key={i}
                className="text-xl transition-all"
                style={{ color: i < remainingFails ? '#ef4444' : '#374151' }}
              >
                ♥
              </span>
            ))}
          </div>
        )}
        {mode === 'yamete' && (
          <span className="text-[#b7002b] text-lg">☠</span>
        )}
      </div>
    </div>
  )
}
