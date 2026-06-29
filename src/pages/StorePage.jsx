import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PACKS } from '../data/packs'

export default function StorePage() {
  const navigate = useNavigate()
  const dlcPacks = Object.values(PACKS).filter(p => p.id !== 'base')

  return (
    <div
      className="min-h-screen bg-black px-4 py-8"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-white font-['Nunito'] text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← Volver al inicio
        </button>

        <h1
          className="font-['Bangers'] text-5xl tracking-widest text-center mb-2"
          style={{ color: '#fcbe00', textShadow: '0 0 20px #fcbe0050' }}
        >
          TIENDA
        </h1>
        <p className="text-gray-500 font-['Nunito'] text-sm text-center mb-10">
          Expande tu experiencia con packs temáticos
        </p>

        <div className="flex flex-col gap-5">
          {dlcPacks.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: pack.color + '60', background: `${pack.color}10` }}
            >
              <div className="p-5 flex items-start gap-4">
                <span className="text-4xl">{pack.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-['Bangers'] text-2xl tracking-widest"
                    style={{ color: pack.color }}
                  >
                    {pack.name}
                  </h2>
                  <p className="text-gray-400 font-['Nunito'] text-sm mt-1">{pack.description}</p>
                  <p className="text-gray-600 font-['Nunito'] text-xs mt-1">
                    {pack.cards.length} canciones
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {pack.free ? (
                    <span
                      className="font-['Bangers'] text-lg tracking-wider px-3 py-1 rounded-lg"
                      style={{ color: pack.color, border: `1px solid ${pack.color}60` }}
                    >
                      GRATIS
                    </span>
                  ) : (
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-['Bangers'] text-lg text-white tracking-wider">
                        1,99 €
                      </span>
                      <span className="text-[10px] font-['Nunito'] text-yellow-500 bg-yellow-900/30 px-2 py-0.5 rounded-full">
                        PRÓXIMAMENTE
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Song preview list */}
              <div className="border-t px-5 py-3 flex flex-wrap gap-1" style={{ borderColor: pack.color + '20' }}>
                {pack.cards.slice(0, 8).map(card => (
                  <span
                    key={card.id}
                    className="text-[10px] font-['Nunito'] text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full border border-gray-800"
                  >
                    {card.song}
                  </span>
                ))}
                {pack.cards.length > 8 && (
                  <span className="text-[10px] font-['Nunito'] text-gray-600 px-2 py-0.5">
                    +{pack.cards.length - 8} más...
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-gray-700 font-['Nunito'] text-xs text-center mt-10">
          Los packs se desbloquean desde el menú principal al activar el sistema de pago.
        </p>
      </div>
    </div>
  )
}
