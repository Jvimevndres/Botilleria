ww/* ══════════════════════════════════════════════════════════
   BOTILLERIAA — script.js
   Lógica principal: edad, catálogo, WhatsApp, horarios
══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════
   0. CONFIGURACIÓN CENTRAL
   👉 Cambia SOLO esta variable con tu número real
      Formato: código de país + número, sin + ni espacios
      Ejemplo Chile: 56912345678
══════════════════════════════════════════════════════════ */
const WHATSAPP_NUMBER = '56900000000'; // ← REEMPLAZA con tu número real


/* ══════════════════════════════════════════════════════════
   1. VERIFICACIÓN DE EDAD
══════════════════════════════════════════════════════════ */

/**
 * Maneja la respuesta del modal de verificación de edad.
 * @param {boolean} isAdult - true si el usuario confirma ser mayor de edad
 */
function checkAge(isAdult) {
  if (isAdult) {
    sessionStorage.setItem('ageVerified', 'true');
    const modal = document.getElementById('age-modal');
    modal.classList.add('hide');
    // Remover del DOM una vez finalizada la animación de salida
    setTimeout(() => {
      if (modal && modal.parentNode) modal.remove();
    }, 400);
  } else {
    // Mostrar mensaje de rechazo y bloquear botones
    document.getElementById('age-deny').classList.remove('hidden');
    document.querySelectorAll('#age-box button').forEach(btn => {
      btn.disabled = true;
    });
    document.getElementById('age-box').style.opacity = '0.5';
  }
}


/* ══════════════════════════════════════════════════════════
   2. CONFIGURACIÓN DE TAGS (SUBFILTROS)
   Los productos viven en productos.js — edita ese archivo
   para cambiar precios, agregar o quitar productos.
   Aquí solo están los tags disponibles y sus etiquetas.
══════════════════════════════════════════════════════════ */
const tagConfig = {
  cervezas: [
    { id: 'lata',        label: '<i class="fa-solid fa-prescription-bottle mr-1"></i>Lata' },
    { id: 'botella',     label: '<i class="fa-solid fa-wine-bottle mr-1"></i>Botella' },
    { id: 'retornable',  label: '♻️ Retornable' },
    { id: 'desechable',  label: '🗑 Desechable' },
    { id: 'grande',      label: '🍺 Grande (+500ml)' },
    { id: 'mediana',     label: '🍺 Mediana (473ml)' },
    { id: 'pequeña',     label: '🥤 Pequeña (≤350ml)' },
    { id: 'nacional',    label: '🇨🇱 Nacional' },
    { id: 'importada',   label: '✈️ Importada' },
    { id: 'artesanal',   label: '🍻 Artesanal' },
    { id: 'rubia',       label: 'Rubia' },
    { id: 'negra',       label: 'Negra' },
    { id: 'ipa',         label: 'IPA' },
    { id: 'sin-alcohol', label: 'Sin Alcohol' },
    { id: 'pack',        label: '📦 Pack' },
  ],
  destilados: [
    { id: 'pisco',   label: 'Pisco' },
    { id: 'whisky',  label: 'Whisky' },
    { id: 'ron',     label: 'Ron' },
    { id: 'vodka',   label: 'Vodka' },
    { id: 'gin',     label: 'Gin' },
    { id: 'tequila', label: 'Tequila' },
    { id: 'cognac',  label: 'Cognac' },
    { id: 'licor',   label: 'Licor' },
  ],
  vinos: [
    { id: 'tinto',     label: '🔴 Tinto' },
    { id: 'rose',      label: '🌸 Rosé' },
    { id: 'blanco',    label: '⚪ Blanco' },
    { id: 'espumante', label: '🥂 Espumante' },
  ],
  hielo: [
    { id: 'hielo',       label: '<i class="fa-solid fa-snowflake mr-1"></i>Hielo' },
    { id: 'snacks',      label: '<i class="fa-solid fa-cookie-bite mr-1"></i>Snacks' },
    { id: 'mezcladores', label: '<i class="fa-solid fa-martini-glass mr-1"></i>Mezcladores' },
    { id: 'energetica',  label: '⚡ Energética' },
  ],
};


/* ══════════════════════════════════════════════════════════
   3. FUNCIÓN DE PEDIDO POR WHATSAPP
   Construye la URL de WhatsApp con el texto preformateado
   y la abre en una pestaña nueva.
══════════════════════════════════════════════════════════ */

/**
 * Abre WhatsApp con un mensaje de pedido preformateado.
 * @param {string} nombreProducto - Nombre del producto
 * @param {string} precio - Precio del producto (ej. '$8.990')
 */
function pedirPorWhatsApp(nombreProducto, precio) {
  const texto =
    '¡Hola! Vengo de la página web. Me interesa pedir *' +
    nombreProducto +
    '* (' + precio + '). ¿Tienen disponibilidad y cuánto demora el envío? 🚚';
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);
  window.open(url, '_blank', 'noopener,noreferrer');
}


/* ══════════════════════════════════════════════════════════
   4. RENDERIZADO DE TARJETAS DE PRODUCTO
══════════════════════════════════════════════════════════ */

/** Mapa de clases CSS para etiquetas según color */
const etiquetaClasses = {
  amber: 'bg-amber-500 text-slate-900',
  green: 'bg-green-500 text-white',
  blue:  'bg-sky-500 text-white',
};

/** Mapa de etiquetas legibles por categoría */
const catLabels = {
  cervezas:   '<i class="fa-solid fa-beer-mug-empty mr-1"></i>Cerveza',
  destilados: '<i class="fa-solid fa-fire mr-1"></i>Destilado',
  vinos:      '<i class="fa-solid fa-wine-glass mr-1"></i>Vino',
  hielo:      '<i class="fa-solid fa-snowflake mr-1"></i>Hielo & Snack',
};

/**
 * Devuelve la etiqueta legible de una categoría.
 * @param {string} cat
 * @returns {string}
 */
function getCatLabel(cat) {
  return catLabels[cat] || cat;
}

/**
 * Genera el HTML de una tarjeta de producto.
 * @param {Object} p - Objeto del producto
 * @param {number} i - Índice para la animación escalonada
 * @returns {string} HTML de la tarjeta
 */
function buildCard(p, i) {
  const badgeHtml = p.etiqueta
    ? '<span class="absolute top-3 left-3 ' +
        (etiquetaClasses[p.etiquetaColor] || 'bg-amber-500 text-slate-900') +
        ' text-xs font-black uppercase tracking-wide px-2.5 py-1 rounded-full shadow">' +
        p.etiqueta +
      '</span>'
    : '';

  /* Nombre seguro para inline onclick (escapa comillas simples) */
  const safeNombre = p.nombre.replace(/'/g, "\\'");

  return (
    '<article class="product-card bg-slate-800 border border-white/5 rounded-2xl overflow-hidden ' +
      'flex flex-col" style="animation: slideUp 0.4s ' + (i * 60) + 'ms ease both;" ' +
      'data-categoria="' + p.categoria + '">' +

      /* Imagen */
      '<div class="relative h-48 overflow-hidden bg-slate-700">' +
        '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy" ' +
          'class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" ' +
          'onerror="this.src=\'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80\'" />' +
        '<div class="absolute inset-0 bg-gradient-to-t from-slate-800/60 to-transparent"></div>' +
        badgeHtml +
      '</div>' +

      /* Contenido */
      '<div class="flex flex-col flex-1 p-4 gap-3">' +
        '<div class="flex-1">' +
          '<p class="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">' + getCatLabel(p.categoria) + '</p>' +
          '<h3 class="text-white font-bold text-sm leading-snug mb-1">' + p.nombre + '</h3>' +
          '<p class="text-slate-400 text-xs">' + p.descripcion + '</p>' +
        '</div>' +

        /* Precio + Botón */
        '<div class="flex items-center justify-between gap-2 pt-2 border-t border-white/5">' +
          '<span class="font-display text-2xl font-black text-amber-400">' + p.precio + '</span>' +
          '<button onclick="pedirPorWhatsApp(\'' + safeNombre + '\', \'' + p.precio + '\')" ' +
            'class="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 active:scale-95 ' +
            'text-white text-xs font-bold px-3 py-2 rounded-xl transition-all duration-200 ' +
            'hover:shadow-lg hover:shadow-green-900/40 flex-shrink-0">' +
            /* WhatsApp mini icon */
            '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">' +
              '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
            '</svg>' +
            'Pedir' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

/**
 * Renderiza el grid de productos aplicando filtro de categoría y tag.
 * @param {string} [filtro='todos'] - Categoría principal
 * @param {string} [tag='todos']   - Tag de subfiltro
 */
function renderProductos(filtro, tag) {
  filtro = filtro || 'todos';
  tag    = tag    || 'todos';
  var grid      = document.getElementById('products-grid');
  var noResults = document.getElementById('no-results');

  /* Productos activos de la categoría */
  var filtered = productos.filter(function(p) {
    if (p.disponible === false) return false;
    if (filtro === 'todos') return true;
    return p.categoria === filtro;
  });

  /* Aplicar subfiltro de tag */
  if (tag !== 'todos') {
    filtered = filtered.filter(function(p) {
      return Array.isArray(p.tags) && p.tags.indexOf(tag) !== -1;
    });
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  grid.innerHTML = filtered.map(function(p, i) { return buildCard(p, i); }).join('');
}


/* ══════════════════════════════════════════════════════════
   SUBFILTROS DE TAGS
══════════════════════════════════════════════════════════ */

/**
 * Muestra la barra de subfiltros para una categoría.
 * Solo renderiza los tags que existan en al menos un producto.
 * @param {string} categoria
 */
function renderSubfiltros(categoria) {
  var container = document.getElementById('subfiltros');
  if (!container) return;

  /* Ocultar si es "todos" o categoría sin tags */
  if (!categoria || categoria === 'todos' || !tagConfig[categoria]) {
    container.innerHTML = '';
    container.classList.add('hidden');
    container.classList.remove('flex');
    return;
  }

  /* Tags que realmente tienen productos en esta categoría */
  var productsInCat = productos.filter(function(p) {
    return p.disponible !== false && p.categoria === categoria;
  });
  var existingTags = {};
  productsInCat.forEach(function(p) {
    if (Array.isArray(p.tags)) {
      p.tags.forEach(function(t) { existingTags[t] = true; });
    }
  });

  var availableTags = (tagConfig[categoria] || []).filter(function(t) {
    return existingTags[t.id];
  });

  if (availableTags.length === 0) {
    container.innerHTML = '';
    container.classList.add('hidden');
    container.classList.remove('flex');
    return;
  }

  var html = '<button class="cat-btn sub-btn active" data-tag="todos">Todos</button>';
  availableTags.forEach(function(t) {
    html += '<button class="cat-btn sub-btn" data-tag="' + t.id + '">' + t.label + '</button>';
  });

  container.innerHTML = html;
  container.classList.remove('hidden');
  container.classList.add('flex');
}


/* ══════════════════════════════════════════════════════════
   5. LÓGICA DE FILTROS (CATEGORÍA + SUBFILTROS DE TAGS)
══════════════════════════════════════════════════════════ */
function initFiltros() {
  var filtrosEl    = document.getElementById('filtros');
  var subfiltrosEl = document.getElementById('subfiltros');
  if (!filtrosEl) return;

  var currentCat = 'todos';
  var currentTag = 'todos';

  /* ─ Filtros principales de categoría ─ */
  filtrosEl.addEventListener('click', function(e) {
    var btn = e.target.closest('.cat-btn');
    if (!btn) return;

    document.querySelectorAll('#filtros .cat-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    currentCat = btn.dataset.cat;
    currentTag = 'todos';

    renderSubfiltros(currentCat);
    renderProductos(currentCat, currentTag);
  });

  /* ─ Subfiltros de tags ─ */
  if (subfiltrosEl) {
    subfiltrosEl.addEventListener('click', function(e) {
      var btn = e.target.closest('.sub-btn');
      if (!btn) return;

      document.querySelectorAll('.sub-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      currentTag = btn.dataset.tag;
      renderProductos(currentCat, currentTag);
    });
  }
}


/* ══════════════════════════════════════════════════════════
   6. ESTADO ABIERTO / CERRADO (dinámico por hora local)
   Horarios configurados:
     Lun – Jue : 12:00 – 01:00 (madrugada)
     Vie – Sáb : 12:00 – 03:00 (madrugada)
     Dom       : 13:00 – 00:00
══════════════════════════════════════════════════════════ */
function checkOpenStatus() {
  var now  = new Date();
  var day  = now.getDay();          /* 0=Dom … 6=Sáb */
  var time = now.getHours() * 60 + now.getMinutes(); /* minutos desde 00:00 */

  var isOpen = false;

  if (day === 0) {
    /* Domingo: 13:00 (780) – 24:00 (1440) */
    isOpen = time >= 780;
  } else if (day >= 1 && day <= 4) {
    /* Lun – Jue: abre a las 12:00 (720) y cierra a la 01:00 AM del día siguiente */
    isOpen = time >= 720 || time < 60;
  } else {
    /* Vie – Sáb: abre a las 12:00 (720) y cierra a las 03:00 AM del día siguiente */
    isOpen = time >= 720 || time < 180;
  }

  var openBadge    = document.getElementById('status-badge');
  var closedBadge  = document.getElementById('closed-badge');
  var footerStatus = document.getElementById('footer-status');

  if (isOpen) {
    if (openBadge)   { openBadge.classList.remove('hidden');  openBadge.classList.add('flex');   }
    if (closedBadge) { closedBadge.classList.remove('flex');  closedBadge.classList.add('hidden'); }
    if (footerStatus) {
      footerStatus.innerHTML = '<span style="color:#4ade80">● Abierto ahora · Pedidos disponibles</span>';
    }
  } else {
    if (closedBadge) { closedBadge.classList.remove('hidden'); closedBadge.classList.add('flex');  }
    if (openBadge)   { openBadge.classList.remove('flex');     openBadge.classList.add('hidden');  }
    if (footerStatus) {
      footerStatus.innerHTML = '<span style="color:#f87171">● Cerrado ahora · Reabrimos pronto</span>';
    }
  }
}


/* ══════════════════════════════════════════════════════════
   7. INICIALIZACIÓN
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {

  /* Verificar si la sesión ya validó la edad */
  if (sessionStorage.getItem('ageVerified') === 'true') {
    var modal = document.getElementById('age-modal');
    if (modal) modal.remove();
  }

  /* Renderizar catálogo completo */
  renderProductos('todos');

  /* Activar filtros */
  initFiltros();

  /* Verificar estado de apertura */
  checkOpenStatus();

  /* Actualizar estado de apertura cada minuto */
  setInterval(checkOpenStatus, 60000);
});
