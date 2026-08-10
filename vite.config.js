import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Vercel sirve la web desde la raíz del dominio, así que ahí necesitamos rutas
  // absolutas (comportamiento por defecto). itch.io aloja el juego en una subcarpeta,
  // así que esa build necesita rutas relativas. Se activa con VITE_TARGET=itch.
  base: process.env.VITE_TARGET === 'itch' ? './' : '/',
  plugins: [react()],
})
