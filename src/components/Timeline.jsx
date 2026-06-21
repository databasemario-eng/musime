export default function Timeline({ timeline, insertIdx, onSlotClick, finished }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-max px-4 gap-1">
        {timeline.map((card, i) => (
          <div key={card.id} className="flex items-center gap-1">
            <Slot
              idx={i}
              selected={insertIdx === i}
              onClick={onSlotClick}
              disabled={finished}
            />
            <TimelineCard card={card} />
          </div>
        ))}
        <Slot
          idx={timeline.length}
          selected={insertIdx === timeline.length}
          onClick={onSlotClick}
          disabled={finished}
        />
      </div>
    </div>
  )
}

function Slot({ idx, selected, onClick, disabled }) {
  return (
    <button
      disabled={disabled}
      onClick={() => !disabled && onClick(idx)}
      className={`
        h-20 w-8 rounded-lg border-2 flex items-center justify-center transition-all shrink-0
        ${disabled ? 'opacity-30 cursor-default border-gray-700' :
          selected
            ? 'border-yellow-400 bg-yellow-400/20 scale-110 shadow-lg shadow-yellow-400/30'
            : 'border-red-800 bg-red-900/20 hover:border-red-500 hover:bg-red-900/40 cursor-pointer'
        }
      `}
    >
      <span className={`text-xl ${selected ? 'text-yellow-400' : 'text-red-700'}`}>↓</span>
    </button>
  )
}

function TimelineCard({ card }) {
  const failed = card.failed === true
  return (
    <div
      className={`flex flex-col items-center rounded-xl overflow-hidden w-24 shrink-0 transition-all
        ${failed
          ? 'bg-gray-900 border border-gray-600 opacity-60'
          : 'bg-gray-800 border border-gray-500'
        }`}
    >
      <div className="w-full h-14 overflow-hidden relative">
        <img
          src={card.img}
          alt={card.anime}
          className={`w-full h-full object-cover ${failed ? 'grayscale' : ''}`}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-lg">❌</span>
          </div>
        )}
      </div>
      <div className="p-1 text-center">
        <p className={`text-xs font-semibold leading-tight line-clamp-2 ${failed ? 'text-gray-400' : 'text-white'}`}>
          {card.anime}
        </p>
        <p className={`text-xs font-bold mt-0.5 ${failed ? 'text-gray-500' : 'text-yellow-400'}`}>
          {card.year}
        </p>
      </div>
    </div>
  )
}
