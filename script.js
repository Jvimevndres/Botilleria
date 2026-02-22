/* ══════════════════════════════════════════════════════════
   BOTILLERÍA LECTOR JEAN — script.js
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
   2. DATOS DEL CATÁLOGO DE PRODUCTOS
   Para agregar un producto, añade un objeto al array
   siguiendo el mismo esquema.
══════════════════════════════════════════════════════════ */
const productos = [
  /* ── CERVEZAS ─────────────────────────────────────── */
  {
    id: 1,
    categoria: 'cervezas',
    nombre: 'Heineken Botella 330ml',
    precio: '$1.490',
    imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Más vendido',
    etiquetaColor: 'amber',
    descripcion: 'Lager importada, 5° Alc.',
  },
  {
    id: 2,
    categoria: 'cervezas',
    nombre: 'Pack Escudo x6 Lata 350ml',
    precio: '$5.990',
    imagen: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Promo',
    etiquetaColor: 'green',
    descripcion: 'Lager nacional. Pack ahorro.',
  },
  {
    id: 3,
    categoria: 'cervezas',
    nombre: 'Kunstmann Torobayo 500ml',
    precio: '$2.490',
    imagen: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Cerveza artesanal de Valdivia.',
  },

  /* ── DESTILADOS ────────────────────────────────────── */
  {
    id: 4,
    categoria: 'destilados',
    nombre: 'Pisco Alto del Carmen 40° 1L',
    precio: '$8.990',
    imagen: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Más vendido',
    etiquetaColor: 'amber',
    descripcion: 'Pisco doble destilado, 40°.',
  },
  {
    id: 5,
    categoria: 'destilados',
    nombre: 'Johnnie Walker Red Label 750ml',
    precio: '$19.990',
    imagen: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Premium',
    etiquetaColor: 'amber',
    descripcion: 'Blended Scotch Whisky, 40°.',
  },
  {
    id: 6,
    categoria: 'destilados',
    nombre: 'Ron Bacardí Blanco 750ml',
    precio: '$11.490',
    imagen: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Ron blanco de Cuba, 40°.',
  },
  {
    id: 7,
    categoria: 'destilados',
    nombre: 'Vodka Absolut Original 750ml',
    precio: '$13.990',
    imagen: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Promo',
    etiquetaColor: 'green',
    descripcion: 'Vodka sueco premium, 40°.',
  },

  /* ── VINOS ─────────────────────────────────────────── */
  {
    id: 8,
    categoria: 'vinos',
    nombre: 'Casillero del Diablo Cab. Sauv. 750ml',
    precio: '$5.490',
    imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Más vendido',
    etiquetaColor: 'amber',
    descripcion: 'Tinto, Valle del Maipo.',
  },
  {
    id: 9,
    categoria: 'vinos',
    nombre: 'Concha y Toro Rosé 750ml',
    precio: '$4.990',
    imagen: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Rosé frutal y fresco.',
  },

  /* ── HIELO & SNACKS ────────────────────────────────── */
  {
    id: 10,
    categoria: 'hielo',
    nombre: 'Hielo Bolsa 3 Kg',
    precio: '$1.990',
    imagen: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Esencial',
    etiquetaColor: 'blue',
    descripcion: 'Cubos perfectos para tus bebestibles.',
  },
  {
    id: 11,
    categoria: 'hielo',
    nombre: 'Mix Snacks Fiesta (6 pack)',
    precio: '$3.490',
    imagen: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Promo',
    etiquetaColor: 'green',
    descripcion: 'Papas fritas, maní y más.',
  },
  {
    id: 12,
    categoria: 'hielo',
    nombre: 'Coca-Cola 1.5L + Soda',
    precio: '$2.490',
    imagen: 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Pack mezcladores para cócteles.',
  },
];


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
 * Renderiza el grid de productos según el filtro de categoría.
 * @param {string} [filtro='todos'] - Categoría a mostrar
 */
function renderProductos(filtro) {
  filtro = filtro || 'todos';
  const grid      = document.getElementById('products-grid');
  const noResults = document.getElementById('no-results');

  const filtered = filtro === 'todos'
    ? productos
    : productos.filter(function(p) { return p.categoria === filtro; });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  grid.innerHTML = filtered.map(buildCard).join('');
}


/* ══════════════════════════════════════════════════════════
   5. LÓGICA DE FILTROS DE CATEGORÍA
══════════════════════════════════════════════════════════ */
function initFiltros() {
  var filtrosEl = document.getElementById('filtros');
  if (!filtrosEl) return;

  filtrosEl.addEventListener('click', function(e) {
    var btn = e.target.closest('.cat-btn');
    if (!btn) return;

    /* Actualizar botón activo */
    document.querySelectorAll('.cat-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    /* Filtrar y renderizar */
    renderProductos(btn.dataset.cat);
  });
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
