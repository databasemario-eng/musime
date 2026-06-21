export default function Timeline({ timeline, insertIdx, onSlotClick, activeCard }) {
  return (
    <div className="w-full overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-700">
      <div className="flex items-end min-w-max px-4 gap-1 py-2">
        {timeline.map((card, i) => (
          <div key={card.id} className="flex items-end gap-1">
            <Slot idx={i} selected={insertIdx === i} onClick={onSlotClick} activeCard={activeCard} />
            <TimelineCard card={card} />
          </div>
        ))}
        <Slot
          idx={timeline.length}
          selected={insertIdx === timeline.length}
          onClick={onSlotClick}
          activeCard={activeCard}
        />
      </div>
    </div>
  )
}

function Slot({ idx, selected, onClick, activeCard }) {
  return (
    <div className="relative flex flex-col items-center">
      {selected && activeCard && (
        <div className="absolute bottom-full mb-2 w-16 z-10">
          <div className="rounded-lg overflow-hidden border-2 border-[#fcbe00] shadow-lg shadow-[#fcbe00]/30">
            <img
              src={activeCard.img}
              alt={activeCard.anime}
              className="w-full h-12 object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
          <div className="w-0 h-0 mx-auto border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#fcbe00]" />
        </div>
      )}
      <button
        onClick={() => onClick(idx)}
        className={`h-16 w-7 rounded-lg border-2 flex items-center justify-center transition-all text-sm font-black
          ${selected
            ? 'border-[#fcbe00] bg-[#fcbe00]/20 scale-110 text-[#fcbe00] shadow-md shadow-[#fcbe00]/30'
            : 'border-[#b7002b]/60 bg-[#b7002b]/10 hover:border-[#b7002b] hover:bg-[#b7002b]/20 text-[#b7002b]/60 hover:text-[#b7002b]'
          }`}
      >
        +
      </button>
    </div>
  )
}

function TimelineCard({ card }) {
  return (
    <div className="flex flex-col items-center rounded-xl overflow-hidden w-20 shrink-0 border border-gray-700 bg-gray-800">
      <div className="w-full h-14 overflow-hidden bg-gray-900">
        <img
          src={card.img}
          alt={card.anime}
          className="w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>
      <div className="p-1.5 text-center w-full">
        <p className="text-white text-xs font-semibold font-['Nunito'] leading-tight line-clamp-2">{card.anime}</p>
        <p className="text-[#fcbe00] text-xs font-black mt-0.5">{card.year}</p>
      </div>
    </div>
  )
}
