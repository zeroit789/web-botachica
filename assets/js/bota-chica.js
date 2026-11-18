/*
  bota-chica.js: Comportamiento de la landing de Bodega Bota Chica, sin librerías.
  bota-chica.js: Behaviour for the Bodega Bota Chica landing page, no libraries.

  Contiene: entradas al hacer scroll, el nombre que escala con el scroll (movimiento de firma),
  el menú del móvil, las pestañas de vinos y la solera interactiva (sacar y rociar).
  Contains: scroll entrances, the name that scales with the scroll (signature move),
  the phone menu, the wine tabs and the interactive solera (draw off and refill).
*/
(() => {
  'use strict';

  // ¿Pide el visitante menos movimiento? / Does the visitor ask for less motion?
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Entradas una sola vez al aparecer ---------- */
  /* ---------- 1. Entrances, once, as things come into view ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal], [data-shutter], .andanas, .intro .lines, .donde');
  if (!('IntersectionObserver' in window) || reduce) {
    revealTargets.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    revealTargets.forEach((el) => io.observe(el));
    // Red de seguridad: lo que esté en pantalla tras la carga se muestra igualmente
    // Safety net: whatever is on screen after load is shown anyway
    window.addEventListener('load', () => setTimeout(() => {
      revealTargets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 2500));
  }

  /* ---------- 2. Movimiento ligado al scroll: el nombre pesa ---------- */
  /* ---------- 2. Scroll-linked motion: the name has weight ---------- */
  const heroMark = document.querySelector('.hero .mark__word');
  const footMark = document.querySelector('.mark--pie .mark__word');
  const hero = document.querySelector('.hero');
  const pie = document.querySelector('.pie');
  const pano = document.querySelector('[data-drift]');
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  // Calcula escalas y deriva en cada fotograma de scroll / Computes scales and drift per scroll frame
  function onScrollFrame() {
    const vh = window.innerHeight;
    if (heroMark && hero) {
      // Al irse la portada, el nombre baja de 1 a 0,94 / As the hero leaves, the name goes from 1 to 0.94
      const p = clamp01(window.scrollY / hero.offsetHeight);
      heroMark.style.setProperty('--mark-scale', (1 - 0.06 * p).toFixed(4));
    }
    if (footMark && pie) {
      // Al llegar el pie, el nombre crece de 0,94 a 1 / As the footer arrives, the name grows from 0.94 to 1
      const top = pie.getBoundingClientRect().top;
      const p = clamp01((vh - top) / vh);
      footMark.style.setProperty('--mark-scale', (0.94 + 0.06 * p).toFixed(4));
    }
    if (pano) {
      // La panorámica se desliza dentro de su marco / The panorama drifts inside its frame
      const r = pano.parentElement.getBoundingClientRect();
      const p = clamp01((vh - r.top) / (vh + r.height));
      pano.style.setProperty('--drift', (-13 + 13 * p).toFixed(2) + '%');
    }
  }
  if (!reduce) {
    let queued = false;
    const request = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; onScrollFrame(); });
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    onScrollFrame();
  }

  /* ---------- 3. Menú del móvil ---------- */
  /* ---------- 3. Phone menu ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    const links = [...nav.querySelectorAll('.nav__link')];
    // Abre o cierra la lista; al abrir, el foco pasa al primer enlace
    // Opens or closes the list; on open, focus moves to the first link
    const setOpen = (open, returnFocus) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open && links[0]) links[0].focus();
      if (!open && returnFocus) toggle.focus();
    };
    const isOpen = () => nav.classList.contains('is-open');
    toggle.addEventListener('click', () => setOpen(!isOpen(), false));
    links.forEach((a) => a.addEventListener('click', () => setOpen(false, false)));
    // Escape cierra y devuelve el foco; Tab no sale del menú abierto
    // Escape closes and returns focus; Tab stays inside the open menu
    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false, true); return; }
      if (e.key !== 'Tab') return;
      const items = [toggle, ...links];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
      else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
    });
    // Un clic fuera del menú lo cierra / A click outside the menu closes it
    document.addEventListener('click', (e) => { if (isOpen() && !nav.contains(e.target)) setOpen(false, false); });
  }

  /* ---------- 3b. Formulario de contacto: valida y abre el correo ---------- */
  /* ---------- 3b. Contact form: validates and opens the mail client ---------- */
  const form = document.getElementById('form-contacto');
  if (form) {
    const estado = document.getElementById('form-estado');
    // Comprueba un campo y muestra o esconde su error / Checks one field and shows or hides its error
    const check = (input) => {
      const error = document.getElementById('e-' + input.id.slice(2));
      let ok = input.checkValidity();
      if (input.type !== 'checkbox' && input.required && !input.value.trim()) ok = false;
      input.setAttribute('aria-invalid', String(!ok));
      if (error) error.hidden = ok;
      return ok;
    };
    const fields = [...form.querySelectorAll('input, textarea')].filter((f) => document.getElementById('e-' + f.id.slice(2)));
    fields.forEach((f) => f.addEventListener('blur', () => { if (f.getAttribute('aria-invalid')) check(f); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = fields.filter((f) => !check(f));
      if (bad.length) {
        estado.textContent = bad.length === 1 ? 'Falta corregir un campo.' : `Faltan por corregir ${bad.length} campos.`;
        bad[0].focus();
        return;
      }
      // Monta el correo con lo escrito / Builds the mail with what was written
      const v = (id) => document.getElementById(id).value.trim();
      const body = [
        `Nombre: ${v('f-nombre')}`,
        `Correo: ${v('f-correo')}`,
        `Motivo: ${v('f-motivo')}`,
        `Día que prefiero: ${v('f-fecha') || 'sin preferencia'}`,
        `Personas: ${v('f-personas')}`,
        '',
        v('f-mensaje'),
      ].join('\n');
      const to = form.getAttribute('action').replace('mailto:', '');
      window.location.href = `mailto:${to}?subject=${encodeURIComponent('Reserva: ' + v('f-motivo'))}&body=${encodeURIComponent(body)}`;
      estado.textContent = 'Listo: se ha abierto tu programa de correo con el mensaje escrito. Recuerda que esta web es una demostración y la dirección es de ejemplo, así que nadie lo recibirá.';
      form.reset();
      fields.forEach((f) => { f.removeAttribute('aria-invalid'); });
    });
  }

  /* ---------- 4. Pestañas de vinos con su marca de tiza ---------- */
  /* ---------- 4. Wine tabs with their chalk mark ---------- */
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.vino-panel')];
  const marks = [...document.querySelectorAll('.tiza__marca')];
  const markText = document.querySelector('[data-marca-texto]');

  // Muestra un vino: pestaña, ficha, marca y pie de foto / Shows one wine: tab, sheet, mark and caption
  function showWine(key, focus) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === key;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => {
      const on = p.dataset.panel === key;
      p.hidden = !on;
      if (on) {
        if (markText) markText.textContent = p.dataset.marcaTexto || '';
        if (!reduce) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
      }
    });
    // La marca se borra y se vuelve a trazar / The mark is wiped and drawn again
    marks.forEach((m) => m.classList.remove('is-on'));
    const mark = marks.find((m) => m.dataset.marca === key);
    if (mark) requestAnimationFrame(() => requestAnimationFrame(() => mark.classList.add('is-on')));
  }
  if (tabs.length) {
    panels.forEach((p) => { p.hidden = p.dataset.panel !== 'fino'; });
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => showWine(t.dataset.tab, false));
      // Flechas para moverse entre pestañas / Arrow keys move between tabs
      t.addEventListener('keydown', (e) => {
        const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        showWine(tabs[(i + step + tabs.length) % tabs.length].dataset.tab, true);
      });
    });
  }

  /* ---------- 5. La solera: sacar de abajo y rociar desde arriba ---------- */
  /* ---------- 5. The solera: draw from the bottom, refill from above ---------- */
  const figure = document.querySelector('.andanas');
  if (!figure) return;

  const FOUNDED = 1931;          // año de la primera saca / year of the first draw
  const TODAY = 2026;            // año de hoy en la página / the page's present year
  const FULL_DROP = 60;          // altura del vino a cinco sextos, en unidades del dibujo / wine height at 5/6, drawing units
  const DROPS_PER_BOTA = 1e7;    // 500 l a 0,05 ml la gota / 500 l at 0.05 ml per drop
  const WINES = { fino: 1 / 3, oloroso: 1 / 5 }; // parte que se saca cada año / share drawn each year

  const state = { wine: 'fino', year: TODAY, rows: [], out: null };
  const levels = [...figure.querySelectorAll('.andana')].reduce((acc, row) => {
    acc[Number(row.dataset.fila)] = row.querySelector('[data-nivel]');
    return acc;
  }, []);
  const chorros = [...figure.querySelectorAll('[data-chorro]')].reduce((acc, c) => { acc[Number(c.dataset.chorro)] = c; return acc; }, []);
  const ageLabels = [...figure.querySelectorAll('[data-edad-fila]')].reduce((acc, el) => { acc[Number(el.dataset.edadFila)] = el; return acc; }, []);
  const sobreYear = figure.querySelector('[data-sobre-anio]');
  const sacaBtn = document.querySelector('[data-saca]');
  const sacaYear = document.querySelector('[data-saca-anio]');
  const resetBtn = document.querySelector('[data-reinicia]');
  const wineBtns = [...document.querySelectorAll('[data-vino-elige]')];
  const strip = document.querySelector('[data-copa]');
  const stripIni = document.querySelector('[data-copa-ini]');
  const stripFin = document.querySelector('[data-copa-fin]');
  const read = (k) => document.querySelector(`[data-lee="${k}"]`);
  const fmt1 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // Mezcla dos composiciones {cosecha: parte} / Mixes two compositions {vintage: share}
  function mix(a, ka, b, kb) {
    const m = new Map();
    for (const [k, v] of a) m.set(k, (m.get(k) || 0) + v * ka);
    for (const [k, v] of b) m.set(k, (m.get(k) || 0) + v * kb);
    return m;
  }
  // Una saca: sale la solera y cada fila se rellena con la de arriba / One draw: the solera goes out, each row refilled from above
  function saca(year) {
    const f = WINES[state.wine];
    state.out = state.rows[0];
    state.rows[0] = mix(state.rows[0], 1 - f, state.rows[1], f);
    state.rows[1] = mix(state.rows[1], 1 - f, state.rows[2], f);
    state.rows[2] = mix(state.rows[2], 1 - f, new Map([[year - 1, 1]]), f);
  }
  // Rehace la historia desde 1931 hasta el año pedido / Replays history from 1931 to the given year
  function replay(toYear) {
    state.rows = [0, 1, 2].map(() => new Map([[FOUNDED - 1, 1]]));
    for (let y = FOUNDED + 1; y <= toYear; y++) saca(y);
    state.year = toYear;
  }
  // Edad media de una composición en un año / Mean age of a composition in a given year
  const meanAge = (m, year) => [...m].reduce((a, [k, v]) => a + v * (year - k), 0);

  // Escribe lecturas, edades por fila y la tira de cosechas / Writes readouts, row ages and the vintage strip
  function render() {
    const y = state.year;
    const out = state.out;
    ageLabels.forEach((el, i) => { el.textContent = `${fmt1.format(meanAge(state.rows[i], y))} años`; });
    if (sobreYear) sobreYear.textContent = String(y);
    if (sacaYear) sacaYear.textContent = String(y + 1);

    const shown = [...out].filter(([, v]) => v >= 0.01).sort((a, b) => a[0] - b[0]);
    const top = [...out].sort((a, b) => b[1] - a[1])[0];
    const founding = out.get(FOUNDED - 1) || 0;
    const drops = founding * DROPS_PER_BOTA;
    read('edad').textContent = `${fmt1.format(meanAge(out, y))} años`;
    read('cosechas').textContent = `${shown.length}, de ${shown[0][0]} a ${shown[shown.length - 1][0]}`;
    read('pesa').textContent = `${top[0]}, un ${Math.round(top[1] * 100)} %`;
    read('fundacion').textContent = drops < 0.5 ? 'ni una gota' : drops < 1.5 ? 'una gota por bota' : `${Math.round(drops)} gotas por bota`;

    // Tira: cada cosecha con su peso / Strip: each vintage with its weight
    if (strip) {
      const total = shown.reduce((a, [, v]) => a + v, 0);
      strip.replaceChildren(...shown.map(([k, v]) => {
        const s = document.createElement('span');
        s.style.width = `${(v / total) * 100}%`;
        s.title = `${k}: ${Math.round(v * 1000) / 10} %`;
        if (k === top[0]) s.classList.add('is-max');
        return s;
      }));
      if (stripIni) stripIni.textContent = String(shown[0][0]);
      if (stripFin) stripFin.textContent = String(shown[shown.length - 1][0]);
    }
  }

  // Lanza un chorro de rocío / Fires one refill stream
  function pour(i) {
    const c = chorros[i];
    if (!c || reduce) return;
    c.classList.remove('is-on'); void c.offsetWidth; c.classList.add('is-on');
  }
  // Baja o sube el vino de una fila / Lowers or raises the wine of one row
  const setLevel = (i, drop) => { if (levels[i]) levels[i].style.transform = `translateY(${drop}px)`; };
  const wait = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));

  let busy = false;
  // Animación completa de una saca, de abajo arriba / Full animation of one draw, bottom to top
  async function playSaca() {
    if (busy) return;
    busy = true;
    sacaBtn.disabled = true;
    const drop = FULL_DROP * WINES[state.wine];
    document.querySelectorAll('.lecturas dd').forEach((d) => d.classList.add('is-changing'));
    pour(0); setLevel(0, drop);
    await wait(800);
    pour(1); setLevel(1, drop); setLevel(0, 0);
    await wait(800);
    pour(2); setLevel(2, drop); setLevel(1, 0);
    await wait(800);
    pour(3); setLevel(2, 0);
    await wait(700);
    saca(state.year + 1);
    state.year += 1;
    render();
    document.querySelectorAll('.lecturas dd').forEach((d) => d.classList.remove('is-changing'));
    sacaBtn.disabled = false;
    busy = false;
  }

  // Cambia de vino o vuelve a hoy / Switches wine or goes back to today
  function restart(wine) {
    if (busy) return;
    state.wine = wine;
    figure.dataset.vino = wine;
    wineBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vinoElige === wine)));
    [0, 1, 2].forEach((i) => setLevel(i, 0));
    replay(TODAY);
    render();
  }

  if (sacaBtn) sacaBtn.addEventListener('click', playSaca);
  if (resetBtn) resetBtn.addEventListener('click', () => restart(state.wine));
  wineBtns.forEach((b) => b.addEventListener('click', () => restart(b.dataset.vinoElige)));
  restart('fino');
})();
