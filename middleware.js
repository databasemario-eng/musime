import { next } from '@vercel/functions'

// Puerta de acceso temporal para la beta de MUSIME.
// El codigo real vive en la variable de entorno BETA_ACCESS_CODE (Vercel > Settings > Environment Variables),
// nunca en el codigo fuente.
//
// La beta solo esta abierta entre BETA_STARTS_AT y BETA_EXPIRES_AT, incluso para quien
// ya tenga el codigo o la cookie guardada. Para cambiar las fechas, edita estas dos lineas.

const COOKIE_NAME = 'musime_beta'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 60 // 60 dias (cubre todo agosto de sobra)

const BETA_STARTS_AT = new Date('2026-07-31T00:00:00Z').getTime()
const BETA_EXPIRES_AT = new Date('2026-09-01T00:00:00Z').getTime() // fin del 31 de agosto

export default function middleware(request) {
  const url = new URL(request.url)
  const validCode = process.env.BETA_ACCESS_CODE

  // Si no hay codigo configurado en Vercel, no bloqueamos nada (evita dejar la web
  // inaccesible por error de configuracion).
  if (!validCode) {
    return next()
  }

  const now = Date.now()

  if (now < BETA_STARTS_AT) {
    return new Response(notStartedHtml(), {
      status: 403,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }

  if (now >= BETA_EXPIRES_AT) {
    return new Response(expiredHtml(), {
      status: 403,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
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

function pageShell(title, body) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
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
    ${body}
  </div>
</body>
</html>`
}

function gateHtml() {
  return pageShell(
    'MUSIME - Acceso anticipado',
    `<p>Acceso anticipado a la beta.<br/>Introduce tu codigo de invitacion.</p>
    <form id="f">
      <input id="k" type="text" placeholder="Codigo de acceso" autocomplete="off" autocapitalize="off" />
      <button type="submit">Entrar</button>
    </form>
    <script>
      document.getElementById('f').addEventListener('submit', function (e) {
        e.preventDefault();
        var k = document.getElementById('k').value.trim();
        if (!k) return;
        var url = new URL(window.location.href);
        url.searchParams.set('key', k);
        window.location.href = url.toString();
      });
    </script>`,
  )
}

function notStartedHtml() {
  return pageShell(
    'MUSIME - Muy pronto',
    `<p>La beta de acceso anticipado todavia no ha empezado.<br/>Abre el 1 de agosto. ¡Vuelve entonces!</p>`,
  )
}

function expiredHtml() {
  return pageShell(
    'MUSIME - Beta finalizada',
    `<p>La beta de acceso anticipado ha terminado.<br/>Gracias por probar MUSIME.<br/>Muy pronto tendremos novedades.</p>`,
  )
}
