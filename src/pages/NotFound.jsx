import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <motion.img
        src="/logo-musime.png"
        alt="MUSIME"
        className="w-40 mx-auto mb-6 opacity-40"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <p
        className="font-['Bangers'] text-8xl tracking-widest mb-2"
        style={{ color: '#b7002b', textShadow: '0 0 20px #b7002b60' }}
      >
        404
      </p>
      <p className="font-['Bangers'] text-2xl text-white tracking-widest mb-2">PÁGINA NO ENCONTRADA</p>
      <p className="font-['Nunito'] text-gray-500 text-sm mb-8">この页は存在しません</p>

      <motion.button
        onClick={() => navigate('/')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#fcbe00] text-black font-['Bangers'] text-xl tracking-widest px-8 py-3 rounded-2xl shadow-lg"
      >
        ← VOLVER AL INICIO
      </motion.button>
    </div>
  )
}
