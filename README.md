# Bodega Bota Chica

> Web de demostración de una bodega ficticia de vino de Jerez · Demo website for a fictional sherry bodega

[Español](#español) · [English](#english)

---

## Español

### Qué es

Bodega Bota Chica es una marca **inventada**: una bodega pequeña de vino de Jerez que cría fino, amontillado, oloroso y Pedro Ximénez en tres andanas de botas. Esta web es una plantilla de ejemplo del portfolio de [danimefle.com](https://danimefle.com). No hay ninguna bodega real detrás, no se vende nada y los datos de contacto son de ejemplo.

La idea de diseño es «el nombre como monumento»: BOTA CHICA en Anton a todo el ancho, sobre un fondo de tiza de albariza con tinta granate de oloroso y un campo oscuro de madera de bota. La portada tiene una **solera interactiva**: se saca vino de la fila del suelo y se ve cómo se rocía desde las criaderas de arriba, con la edad media y las cosechas que lleva cada copa calculadas saca a saca desde 1931.

### Páginas

| Página | Contenido |
| --- | --- |
| `index.html` | Portada: el nombre, la solera interactiva, los vinos, las visitas y la dirección |
| `vinos.html` | Ficha completa de cada vino: uva, crianza, edad, cata, servicio y precio |
| `visitas.html` | Las cinco visitas y catas, horario semanal y normas |
| `sobre-nosotros.html` | Historia, el lugar, los oficios y lo que no cambia |
| `contacto.html` | Formulario (abre el correo, no envía nada), dirección, horario y plano dibujado |
| `aviso-legal.html`, `privacidad.html`, `cookies.html` | Textos legales de una web de demostración |
| `creditos.html` | Autor y licencia de cada fotografía, fuentes y código |
| `404.html` | Página de error con el estilo de la web |

### Tecnología

- HTML, CSS y JavaScript sin librerías y sin paso de compilación.
- Fuentes locales: Anton 400 y Work Sans variable (Google Fonts, subconjunto latino, versiones v27 y v24), con licencia SIL OFL 1.1.
- Analítica: Plausible desde `analytics.danimefle.com`; no usa cookies ni guarda la IP (la usa solo para contar visitas únicas del día).
- Cabeceras de seguridad (CSP, HSTS, etc.) en `_headers` para Cloudflare Pages.
- Accesibilidad: enlace para saltar al contenido, navegación con teclado, menú del móvil con foco controlado y Escape, formularios con errores asociados, `prefers-reduced-motion`.
- Todas las páginas llevan `noindex`, porque es una marca ficticia.

### Verla en local

Hace falta Node 18 o superior. El servidor solo usa módulos nativos y envía las mismas cabeceras que `_headers`:

```bash
node server.js          # http://localhost:8080
node server.js 3000     # otro puerto
```

También se puede abrir `index.html` directamente en el navegador; en ese caso no se aplican las cabeceras.

### Desplegar en Cloudflare Pages

1. Sube la carpeta a un repositorio (el `.gitignore` deja fuera capturas y ficheros de trabajo).
2. En Cloudflare Pages, crea un proyecto desde el repositorio **sin comando de compilación** y con `/` como carpeta de salida.
3. Asigna el dominio (por defecto se ha previsto `botachica.danimefle.com`).
4. Comprueba que `_headers` se aplica (pestaña de red del navegador) y que Plausible recibe visitas.

### Adaptarla

- **Dominio:** la URL base `https://botachica.danimefle.com` aparece solo en etiquetas (`canonical`, `og:url`, `og:image`, `sitemap.xml`, `robots.txt`, JSON-LD de `index.html`) y en `data-domain` del script de Plausible. Cámbiala con un buscar y reemplazar.
- **Textos:** cada página es un HTML normal; edita directamente el texto.
- **Colores:** están como variables al principio de `assets/css/bota-chica.css` (`--bg`, `--ink`, `--wood`…).
- **Imágenes:** en `assets/img/` en WebP con varios anchos. Si cambias una, mantén `width`/`height` y actualiza los créditos.
- **Solera interactiva:** en `assets/js/bota-chica.js`, sección 5 (`WINES` fija la parte que se saca cada año).
- **Publicar como negocio real:** quita `<meta name="robots" content="noindex, follow">` de cada página y la línea `X-Robots-Tag` de `_headers`, cambia los textos legales y pon datos de contacto reales.

### Créditos y licencias

- Código: MIT (ver `LICENSE`).
- Fotografías: Wikimedia Commons, con licencias CC BY 2.0, CC BY-SA 3.0, CC BY-SA 4.0 y dominio público. Lista completa en `creditos.html` y `CREDITOS.md`. Ninguna foto es de esta bodega.
- Fuentes: Anton (Vernon Adams) y Work Sans (Wei Huang), SIL Open Font License 1.1. Licencia completa y avisos de copyright en `assets/fonts/OFL.txt`.

---

## English

### What it is

Bodega Bota Chica is a **made-up** brand: a small sherry bodega that ages fino, amontillado, oloroso and Pedro Ximénez in three tiers (*andanas*) of casks. This site is a sample template from the [danimefle.com](https://danimefle.com) portfolio. There is no real bodega behind it, nothing is sold and the contact details are placeholders.

The design idea is "the name as a monument": BOTA CHICA set in Anton across the full width, on an albariza-chalk ground with oloroso-garnet ink and a dark cask-wood field. The home page has an **interactive solera**: you draw wine from the bottom row and watch it being refilled from the criaderas above, with the average age and the vintages in each glass computed draw by draw since 1931.

### Pages

| Page | Content |
| --- | --- |
| `index.html` | Home: the name, the interactive solera, the wines, the visits and the address |
| `vinos.html` | Full sheet for each wine: grape, ageing, age, tasting notes, serving and price |
| `visitas.html` | The five visits and tastings, weekly timetable and rules |
| `sobre-nosotros.html` | History, the place, the trades and what never changes |
| `contacto.html` | Form (opens the mail client, sends nothing), address, hours and a drawn map |
| `aviso-legal.html`, `privacidad.html`, `cookies.html` | Legal pages for a demo site |
| `creditos.html` | Author and licence of every photo, fonts and code |
| `404.html` | Error page in the site's style |

### Technology

- HTML, CSS and JavaScript with no libraries and no build step.
- Local fonts: Anton 400 and Work Sans variable (Google Fonts, latin subset, versions v27 and v24), SIL OFL 1.1.
- Analytics: Plausible served from `analytics.danimefle.com`; no cookies and the IP is not stored (it is only used to count the day's unique visits).
- Security headers (CSP, HSTS, etc.) in `_headers` for Cloudflare Pages.
- Accessibility: skip link, keyboard navigation, phone menu with managed focus and Escape, forms with linked errors, `prefers-reduced-motion`.
- Every page carries `noindex`, because the brand is fictional.

### Run it locally

Node 18 or later. The server uses built-in modules only and sends the same headers as `_headers`:

```bash
node server.js          # http://localhost:8080
node server.js 3000     # another port
```

You can also open `index.html` straight in the browser; the headers are not applied then.

### Deploy to Cloudflare Pages

1. Push the folder to a repository (`.gitignore` leaves screenshots and working files out).
2. In Cloudflare Pages, create a project from the repository with **no build command** and `/` as the output folder.
3. Attach the domain (`botachica.danimefle.com` is the planned one).
4. Check that `_headers` is applied (browser network tab) and that Plausible receives visits.

### Adapt it

- **Domain:** the base URL `https://botachica.danimefle.com` only appears in tags (`canonical`, `og:url`, `og:image`, `sitemap.xml`, `robots.txt`, the JSON-LD in `index.html`) and in the Plausible script's `data-domain`. Change it with a find and replace.
- **Copy:** each page is plain HTML; edit the text directly.
- **Colours:** they are variables at the top of `assets/css/bota-chica.css` (`--bg`, `--ink`, `--wood`…).
- **Images:** in `assets/img/` as WebP in several widths. If you replace one, keep `width`/`height` and update the credits.
- **Interactive solera:** in `assets/js/bota-chica.js`, section 5 (`WINES` sets the share drawn each year).
- **Going live as a real business:** remove `<meta name="robots" content="noindex, follow">` from every page and the `X-Robots-Tag` line from `_headers`, rewrite the legal pages and add real contact details.

### Credits and licences

- Code: MIT (see `LICENSE`).
- Photographs: Wikimedia Commons, under CC BY 2.0, CC BY-SA 3.0, CC BY-SA 4.0 and public domain. Full list in `creditos.html` and `CREDITOS.md`. None of the photos shows this bodega.
- Fonts: Anton (Vernon Adams) and Work Sans (Wei Huang), SIL Open Font License 1.1. Full licence and copyright notices in `assets/fonts/OFL.txt`.
