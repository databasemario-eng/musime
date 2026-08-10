// Los assets de public/ (audio, imágenes, vídeos) se referencian en el código
// con rutas absolutas tipo "/audio/1.mp3". Eso funciona en Vercel porque la web
// vive en la raíz del dominio, pero rompe en itch.io, que aloja el juego en una
// subcarpeta (p.ej. /html/12345/). Esta función resuelve la ruta relativa al
// BASE_URL real de la build (Vite lo rellena según vite.config.js).
export function withBase(path) {
  if (!path) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
