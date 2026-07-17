import { next } from '@vercel/functions'

// Puerta de acceso para la beta de MUSIME.
// Un solo codigo de invitacion compartido con los testers.
// El codigo real vive en la variable de entorno BETA_ACCESS_CODE (Vercel > Settings > Environment Variables),
// nunca en el codigo fuente.

const COOKIE_NAME = 'musime_beta'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90 // 90 dias

export default function middleware(request) {
  const url = new URL(request.url)
  const validCode = process.env.BETA_ACCESS_CODE

  // Si no hay codigo configurado en Vercel, no bloqueamos nada (evita dejar la web
  // inaccesible por error de configuracion).
  if (!validCode) {
    return next()
  }

  const cookieHeader = request.headers.get('cookie') || ''
  const hasAccess = cookieHeader
    .split(';')
    .some((c) => c.trim() === `${COOKIE_NAME}=granted`)

  if (hasAccess) {
    return next()
  }

  const keyParam = url.searchParams.get('key')

  if (keyParam === validCode) {
    return next({
      headers: {
        'Set-Cookie': `${COOKIE_NAME}=granted; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`,
      },
    })
  }

  return new Response(gateHtml(), {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

function gateHtml() {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MUSIME - Acceso anticipado</title>
<style>
  body { background:#000; color:#fff; font-family: -apple-system, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:0 16px; }
  .box { text-align:center; max-width:340px; width:100%; }
  h1 { color:#fcbe00; letter-spacing:3px; font-size:2.2rem; margin-bottom:4px; }
  p { color:#999; font-size:14px; line-height:1.4; }
  input { width:100%; padding:12px; border-radius:10px; border:1px solid #333; background:#111; color:#fff; margin-top:18px; box-sizing:border-box; font-size:16px; text-align:center; }
  input:focus { outline:none; border-color:#b7002b; }
  button { width:100%; padding:12px; border-radius:10px; border:none; background:#b7002b; color:#fff; font-weight:bold; margin-top:10px; cursor:pointer; font-size:16px; }
  button:active { transform:scale(0.98); }
</style>
</head>
<body>
  <div class="box">
    <h1>MUSIME</h1>
    <p>Acceso anticipado a la beta.<br/>Introduce tu codigo de invitacion.</p>
    <form id="f">
      <input id="k" type="text" placeholder="Codigo de acceso" autocomplete="off" autocapitalize="off" />
      <button type="submit">Entrar</button>
    </form>
  </div>
  <script>
    document.getElementById('f').addEventListener('submit', function (e) {
      e.preventDefault();
      var k = document.getElementById('k').value.trim();
      if (!k) return;
      var url = new URL(window.location.href);
      url.searchParams.set('key', k);
      window.location.href = url.toString();
    });
  </script>
</body>
</html>`
}
