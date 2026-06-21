export default function Card({ card, revealed = false }) {
  if (!card) return null

  return (
    <div
      className="w-40 shrink-0 rounded-2xl overflow-hidden shadow-xl"
      style={{ border: '2px solid #b7002b', boxShadow: '0 0 20px rgba(183,0,43,0.3)' }}
    >
      {revealed ? (
        <>
          <div className="h-44 overflow-hidden bg-gray-900">
            <img
              src={card.img}
              alt={card.anime}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
          <div className="bg-gray-900 p-3 text-center">
            <p className="text-white text-xs font-bold font-['Nunito'] leading-tight line-clamp-2">{card.anime}</p>
            <p className="text-[#fcbe00] font-black text-xl mt-1">{card.year}</p>
          </div>
        </>
      ) : (
        <div className="h-56 flex flex-col items-center justify-center bg-gray-900 gap-3">
          <img src="/logo-musime.png" alt="MUSIME" className="h-16 object-contain opacity-50" />
          <p className="text-gray-600 text-xs font-['Nunito'] tracking-widest uppercase">¿Qué anime es?</p>
        </div>
      )}
    </div>
  )
}
