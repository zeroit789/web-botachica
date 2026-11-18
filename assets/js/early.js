/*
  early.js: Marca el documento con la clase «js» antes de pintar la página.
  early.js: Marks the document with the "js" class before the page is painted.

  Bajo html.js solo va la animación de carga del héroe, que acaba siempre visible. Lo que se
  oculta (entradas, menú plegado del móvil) depende de clases que pone bota-chica.js después de
  instalar sus manejadores, así que si ese script falla todo el contenido se ve igualmente.
  Va en un fichero aparte porque la CSP del sitio bloquea los scripts escritos dentro del HTML.
  Only the hero load animation, which always ends visible, sits under html.js. Whatever hides
  (entrances, the folded phone menu) depends on classes bota-chica.js sets after installing its
  handlers, so if that script fails every piece of content is still visible.
  It lives in its own file because the site's CSP blocks inline scripts.
*/
document.documentElement.classList.add('js');
