/*
  early.js: Marca el documento con la clase «js» antes de pintar la página.
  early.js: Marks the document with the "js" class before the page is painted.

  Los estados ocultos de las animaciones solo se aplican bajo html.js, así que si el script
  no carga, todo el contenido se ve igualmente. Va en un fichero aparte porque la CSP
  del sitio bloquea los scripts escritos dentro del HTML.
  Hidden animation states only apply under html.js, so if scripting fails every piece of
  content is still visible. It lives in its own file because the site's CSP blocks inline scripts.
*/
document.documentElement.classList.add('js');
