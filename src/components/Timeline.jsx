import { motion, AnimatePresence } from 'framer-motion'

export default function Timeline({ timeline, insertIdx, onSlotClick, activeCard }) {
  return (
    <div className="w-full overflow-x-auto pb-2 snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex items-end min-w-max px-4 gap-1.5 py-2">
        <AnimatePresence initial={false}>
          {timeline.map((card, i) => (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              className="flex items-end gap-1.5 snap-center"
            >
              <Slot idx={i} selected={insertIdx === i} onClick={onSlotClick} activeCard={activeCard} />
              <TimelineCard card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="snap-center">
          <Slot
            idx={timeline.length}
            selected={insertIdx === timeline.length}
            onClick={onSlotClick}
            activeCard={activeCard}
          />
        </div>
      </div>
    </div>
  )
}

function Slot({ idx, selected, onClick, activeCard }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Preview de la carta activa encima del slot seleccionado */}
      <AnimatePresence>
        {selected && activeCard && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full mb-2 w-16 z-10"
          >
            <div className="rounded-lg overflow-hidden border-2 border-[#fcbe00] shadow-lg shadow-[#fcbe00]/40">
              <img
                src={activeCard.img}
                alt={activeCard.anime}
                className="w-full h-12 object-cover"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <div className="w-0 h-0 mx-auto border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#fcbe00]" />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => onClick(idx)}
        className={`h-20 w-9 rounded-xl border-2 flex items-center justify-center transition-all duration-150 text-base font-black select-none
          ${selected
            ? 'border-[#fcbe00] bg-[#fcbe00]/25 scale-110 text-[#fcbe00] shadow-md shadow-[#fcbe00]/40'
            : 'border-[#b7002b]/50 bg-[#b7002b]/10 hover:border-[#b7002b] hover:bg-[#b7002b]/20 text-[#b7002b]/50 hover:text-[#b7002b]'
          }`}
      >
        +
      </button>
    </div>
  )
}

function TimelineCard({ card }) {
  return (
    <div className="flex flex-col items-center rounded-xl overflow-hidden w-[78px] shrink-0 border border-gray-700 bg-gray-800 shadow-md">
      <div className="w-full h-[52px] overflow-hidden bg-gray-900">
        <img
          src={card.img}
          alt={card.anime}
          className="w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>
      <div className="p-1.5 text-center w-full">
        <p className="text-white text-[10px] font-semibold font-['Nunito'] leading-tight line-clamp-2">{card.anime}</p>
        <p className="text-[#fcbe00] text-xs font-black mt-0.5">{card.year}</p>
      </div>
    </div>
  )
}
