// ── Colección de datos ──────────────────────────────────────────────────────
const personajes = [
  {
    nombre: "Hacker",
    descripcion: "Experto en ciberseguridad ofensiva y defensiva.",
    emoji: "🧑‍💻",
    rol: "SecurityIterator"
  },
  {
    nombre: "Analista",
    descripcion: "Interpreta datos y modela soluciones de negocio.",
    emoji: "📊",
    rol: "DataIterator"
  },
  {
    nombre: "Programador",
    descripcion: "Crea soluciones de software elegantes y escalables.",
    emoji: "⚙️",
    rol: "CodeIterator"
  }
];

// ── Patrón Iterador ──────────────────────────────────────────────────────────
function crearIterador(coleccion) {
  let indice = 0;
  return {
    hasNext:  () => indice < coleccion.length - 1,
    hasPrev:  () => indice > 0,
    next:     () => coleccion[++indice],
    prev:     () => coleccion[--indice],
    current:  () => coleccion[indice],
    index:    () => indice,
    total:    () => coleccion.length,
  };
}

const iter = crearIterador(personajes);

// ── Renderizado ──────────────────────────────────────────────────────────────
function render() {
  const p     = iter.current();
  const idx   = iter.index();
  const total = iter.total();

  // Avatar con animación
  const av = document.getElementById('avatar');
  av.textContent = p.emoji;
  av.classList.remove('animating');
  void av.offsetWidth; // forzar reflow para reiniciar animación
  av.classList.add('animating');

  // Textos
  document.getElementById('nombre').textContent      = p.nombre;
  document.getElementById('descripcion').textContent = p.descripcion;
  document.getElementById('rol').textContent         = p.rol + '()';
  document.getElementById('counter').textContent     = `${idx + 1} / ${total}`;

  // Indicadores de posición (dots)
  const dotsEl = document.getElementById('dots');
  dotsEl.innerHTML = '';
  for (let d = 0; d < total; d++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (d === idx ? ' active' : '');
    dot.onclick = () => jumpTo(d);
    dotsEl.appendChild(dot);
  }

  // Lista de la colección
  const list = document.getElementById('collection-list');
  list.innerHTML = '';
  personajes.forEach((item, d) => {
    const el = document.createElement('div');
    el.className = 'collection-item' + (d === idx ? ' current' : '');
    el.onclick = () => jumpTo(d);
    el.innerHTML = `
      <span class="item-idx">[${d}]</span>
      <span class="item-emoji">${item.emoji}</span>
      <div class="item-info">
        <div class="item-name">${item.nombre}</div>
        <div class="item-desc">${item.rol}()</div>
      </div>
      <span class="arrow-indicator">◀</span>
    `;
    list.appendChild(el);
  });

  // Estado de botones
  document.getElementById('btnAnterior').disabled  = !iter.hasPrev();
  document.getElementById('btnSiguiente').disabled = !iter.hasNext();
}

// ── Controles públicos ───────────────────────────────────────────────────────
function siguiente() {
  if (iter.hasNext()) { iter.next(); render(); }
}

function anterior() {
  if (iter.hasPrev()) { iter.prev(); render(); }
}

function jumpTo(target) {
  const cur = iter.index();
  if (target === cur) return;
  const delta = target > cur ? 1 : -1;
  while (iter.index() !== target) {
    delta > 0 ? iter.next() : iter.prev();
  }
  render();
}

// ── Inicio ───────────────────────────────────────────────────────────────────
render();
