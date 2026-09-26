# PromoHub — Descuentos y promociones en Chile 🇨🇱

Sitio web estático (HTML + CSS + JS, sin frameworks ni dependencias externas) que reúne las promociones y descuentos de tiendas presentes en Chile. Reemplaza al proyecto v0 original (`v0-html-code-review`), que estaba en francés, tenía enlaces muertos (`#`) y sin `favicon`, `robots.txt` ni `sitemap.xml`.

## Qué se arregló respecto al sitio anterior

| Problema anterior | Estado |
|---|---|
| Todo el sitio en francés | ✅ Reescrito en español de Chile (`lang="es-CL"`) |
| Navegación con enlaces muertos (`href="#"`) | ✅ Rutas reales: `/promociones`, `/tiendas`, `/iniciar-sesion` |
| Sin favicon (un 404 por cada visita) | ✅ `favicon.svg` |
| Sin `robots.txt` (Google recibía 404) | ✅ Creado, con sitemap |
| Sin `sitemap.xml` | ✅ Creado |
| Next.js pesado (6+ archivos JS para una landing) | ✅ Sitio estático, 0 dependencias, carga instantánea |
| Sin meta Open Graph / SEO | ✅ OG, Twitter Cards, JSON-LD, geo meta CL |
| Sin página de error amigable | ✅ `404.html` personalizada |
| Rutas viejas en francés | ✅ Redirects 301 en `vercel.json` (`/promotions`, `/connexion`, `/accueil`…) |

## Estructura

```
├── index.html              # Inicio: hero, categorías, promos destacadas, newsletter
├── promociones/            # Ofertas vigentes por categoría
├── tiendas/                # Tiendas con descuentos activos
├── iniciar-sesion/         # Acceso (UI lista; backend pendiente)
├── 404.html                # Página de error amigable
├── assets/
│   ├── css/styles.css
│   ├── js/main.js          # Menú móvil, newsletter, año dinámico
│   └── img/og-image.jpg    # Imagen para compartir en redes
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── vercel.json             # Headers de caché, redirects, región Santiago (scl1)
```

## Desplegar en Vercel

1. En Vercel: **Add New → Project → Import Git Repository** → `traviscomber/promohub`.
2. Framework: **Other** (es estático; Vercel lo detecta solo). Deploy.
3. Para reemplazar el proyecto viejo: en **Settings → Domains** de `v0-html-code-review`, quita el dominio y asígnalo al nuevo proyecto (o redirige).

### Antes de producción

- **Cambiar el dominio** `https://www.promohub.cl` en `canonical`, `og:url`, `sitemap.xml` y `robots.txt` si usarás otro dominio.
- El formulario de newsletter y de acceso son front-end solamente: conectar a un backend (ej. Resend, Supabase, Neon) cuando se necesite.

## Checklist Cloudflare (del reporte de tráfico)

### ✅ Aplicado (26-09-2026)

- **Reglas de caché** "Cache static assets 30 days" creada en las 5 zonas que no la tenían:
  `chileflota.app`, `kumplio.app`, `motil.app`, `ppartnersgroup.app`, `videntia.app`.
  (Las otras 5 ya la tenían.) Las ratios de caché estaban entre 0,1 % y 6 %.
- **Diagnóstico de 4xx**: el grueso de los 4xx en las zonas son **403** (bloqueos WAF/managed rules), no 404. Revisar *Security → Events* para confirmar qué regla dispara.

### ⏳ Pendiente (requiere acción manual o confirmación)

1. **Bot Fight Mode**: activarlo en cada zona desde el dashboard
   (*Security → Bots*). La API token no tenía permiso de escritura para activarlo.
2. **Regla WAF anti-bots por país** (bloquear/challengear tráfico de DE/FI/KR/AD
   con 0 page views) — propuesta, confirmar antes de aplicar en producción:
   ```
   (ip.geoip.country in {"DE" "FI" "KR" "AD"} and not cf.bot_management.verified_bot)
   → action: challenge (o block)
   ```
3. **cort3x.app devuelve 526** (certificado de origen inválido; 8.800+ requests
   afectadas en 48 h). Revisar modo SSL y certificado de origen en *SSL/TLS*.
4. **PromoHub no está detrás de Cloudflare**: ninguna zona apunta a
   `v0-html-code-review.vercel.app`. Al conectar un dominio propio, proxearlo
   en Cloudflare y replicar la regla de caché de estáticos.

---
Hecho para ahorrar en Chile 🌶️
