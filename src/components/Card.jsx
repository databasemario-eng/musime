export default function Card({ card, showDetails = false }) {
  if (!card) return null
  return (
    <div className="relative bg-gray-900 border-2 border-red-600 rounded-2xl shadow-xl shadow-red-900/40 overflow-hidden w-52 shrink-0">
      {showDetails && (
        <div className="relative h-56 overflow-hidden">
          <img
            src={card.img}
            alt={card.anime}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>
      )}
      {!showDetails && (
        <div className="h-32 flex items-center justify-center bg-gradient-to-br from-red-900/40 to-gray-900">
          <span className="text-5xl">🎵</span>
        </div>
      )}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-white font-bold text-sm leading-tight">{card.anime}</p>
        {showDetails && (
          <p className="text-red-400 text-xs italic">♪ {card.song}</p>
        )}
      </div>
    </div>
  )
}
