/* ══════════════════════════════════════════════════════════
   BOTILLERIAA — productos.js
   ════════════════════════════════════════════════════════
   ✏️  ESTE ES EL ÚNICO ARCHIVO QUE TIENES QUE EDITAR
       para cambiar precios, agregar o quitar productos.

   ─── CÓMO AGREGAR UN PRODUCTO ────────────────────────────
   1. Copia uno de los bloques { ... } que están abajo.
   2. Pégalo ANTES del ]; final (pero después del último , ).
   3. Cambia los valores.
   4. ¡Listo! El catálogo se actualiza sólo.

   ─── CAMPOS DEL PRODUCTO ─────────────────────────────────
   id          → Número único. No repitas un id ya usado.
   categoria   → 'cervezas' | 'destilados' | 'vinos' | 'hielo'
   tags        → Array de etiquetas para el subfiltro.
                 Pon todos los que correspondan (ver listas
                 de tags disponibles más abajo).
   nombre      → Nombre que se muestra en la tarjeta.
   precio      → Precio como texto, ej: '$1.490'
   imagen      → URL de la imagen (Unsplash u otra).
                 Si no tienes imagen, deja la URL de
                 ejemplo que hay en los otros productos.
   etiqueta    → Badge pequeño en la foto: 'Más vendido' |
                 'Promo' | 'Nuevo' | 'Premium' | 'Esencial'
                 o null si no quieres badge.
   etiquetaColor → 'amber' | 'green' | 'blue' | 'red' | null
   descripcion → Descripción corta (1 línea).
   disponible  → true para mostrarlo, false para ocultarlo
                 sin tener que borrar el producto.

   ─── TAGS DISPONIBLES POR CATEGORÍA ─────────────────────

   cervezas:
     Envase:   'lata'  'botella'
     Tipo:     'retornable'  'desechable'
     Tamaño:   'grande'  'mediana'  'pequeña'
     Origen:   'nacional'  'importada'  'artesanal'
     Sabor:    'rubia'  'negra'  'ipa'  'sin-alcohol'
     Pack:     'pack'

   destilados:
     'pisco'  'whisky'  'ron'  'vodka'  'gin'  'tequila'
     'cognac'  'licor'

   vinos:
     'tinto'  'rose'  'blanco'  'espumante'

   hielo:
     'hielo'  'snacks'  'mezcladores'  'energetica'

   ─── PARA OCULTAR UN PRODUCTO SIN BORRARLO ───────────────
   Solo cambia  disponible: true  →  disponible: false
══════════════════════════════════════════════════════════ */

const productos = [

  /* ────────────────────────────────────────────────────────
     CERVEZAS
  ──────────────────────────────────────────────────────── */
  {
    id: 1,
    categoria: 'cervezas',
    tags: ['botella', 'desechable', 'pequeña', 'importada', 'rubia'],
    nombre: 'Heineken Botella 330ml',
    precio: '$1.490',
    imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Más vendido',
    etiquetaColor: 'amber',
    descripcion: 'Lager importada, 5° Alc.',
    disponible: true,
  },
  {
    id: 2,
    categoria: 'cervezas',
    tags: ['lata', 'desechable', 'pequeña', 'nacional', 'rubia', 'pack'],
    nombre: 'Pack Escudo x6 Lata 350ml',
    precio: '$5.990',
    imagen: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Promo',
    etiquetaColor: 'green',
    descripcion: 'Lager nacional. Pack ahorro.',
    disponible: true,
  },
  {
    id: 3,
    categoria: 'cervezas',
    tags: ['botella', 'desechable', 'grande', 'artesanal', 'nacional', 'rubia'],
    nombre: 'Kunstmann Torobayo 500ml',
    precio: '$2.490',
    imagen: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Cerveza artesanal de Valdivia.',
    disponible: true,
  },
  {
    id: 13,
    categoria: 'cervezas',
    tags: ['botella', 'retornable', 'grande', 'nacional', 'rubia'],
    nombre: 'Cristal Retornable 1L',
    precio: '$1.990',
    imagen: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Lager nacional, formato retornable.',
    disponible: true,
  },
  {
    id: 14,
    categoria: 'cervezas',
    tags: ['lata', 'desechable', 'mediana', 'nacional', 'rubia'],
    nombre: 'Escudo Lata 473ml',
    precio: '$1.190',
    imagen: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Formato tall can, bien helada.',
    disponible: true,
  },
  {
    id: 15,
    categoria: 'cervezas',
    tags: ['botella', 'desechable', 'pequeña', 'importada', 'negra'],
    nombre: 'Guinness Botella 330ml',
    precio: '$2.190',
    imagen: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Premium',
    etiquetaColor: 'amber',
    descripcion: 'Stout irlandesa, sabor tostado.',
    disponible: true,
  },
  {
    id: 16,
    categoria: 'cervezas',
    tags: ['lata', 'desechable', 'pequeña', 'importada', 'sin-alcohol'],
    nombre: 'Heineken 0.0 Lata 330ml',
    precio: '$1.290',
    imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Nuevo',
    etiquetaColor: 'green',
    descripcion: 'Sin alcohol, todo el sabor.',
    disponible: true,
  },

  /* ────────────────────────────────────────────────────────
     DESTILADOS
  ──────────────────────────────────────────────────────── */
  {
    id: 4,
    categoria: 'destilados',
    tags: ['pisco'],
    nombre: 'Pisco Alto del Carmen 40° 1L',
    precio: '$8.990',
    imagen: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Más vendido',
    etiquetaColor: 'amber',
    descripcion: 'Pisco doble destilado, 40°.',
    disponible: true,
  },
  {
    id: 5,
    categoria: 'destilados',
    tags: ['whisky'],
    nombre: 'Johnnie Walker Red Label 750ml',
    precio: '$19.990',
    imagen: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Premium',
    etiquetaColor: 'amber',
    descripcion: 'Blended Scotch Whisky, 40°.',
    disponible: true,
  },
  {
    id: 6,
    categoria: 'destilados',
    tags: ['ron'],
    nombre: 'Ron Bacardí Blanco 750ml',
    precio: '$11.490',
    imagen: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Ron blanco de Cuba, 40°.',
    disponible: true,
  },
  {
    id: 7,
    categoria: 'destilados',
    tags: ['vodka'],
    nombre: 'Vodka Absolut Original 750ml',
    precio: '$13.990',
    imagen: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Promo',
    etiquetaColor: 'green',
    descripcion: 'Vodka sueco premium, 40°.',
    disponible: true,
  },
  {
    id: 17,
    categoria: 'destilados',
    tags: ['gin'],
    nombre: 'Beefeater London Dry Gin 750ml',
    precio: '$15.990',
    imagen: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Gin clásico londinense, 40°.',
    disponible: true,
  },
  {
    id: 18,
    categoria: 'destilados',
    tags: ['tequila'],
    nombre: 'José Cuervo Especial 750ml',
    precio: '$14.990',
    imagen: 'https://images.unsplash.com/photo-1620147461831-a97b99ade1d3?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Tequila gold, reposado.',
    disponible: true,
  },

  /* ────────────────────────────────────────────────────────
     VINOS
  ──────────────────────────────────────────────────────── */
  {
    id: 8,
    categoria: 'vinos',
    tags: ['tinto'],
    nombre: 'Casillero del Diablo Cab. Sauv. 750ml',
    precio: '$5.490',
    imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Más vendido',
    etiquetaColor: 'amber',
    descripcion: 'Tinto, Valle del Maipo.',
    disponible: true,
  },
  {
    id: 9,
    categoria: 'vinos',
    tags: ['rose'],
    nombre: 'Concha y Toro Rosé 750ml',
    precio: '$4.990',
    imagen: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Rosé frutal y fresco.',
    disponible: true,
  },
  {
    id: 19,
    categoria: 'vinos',
    tags: ['blanco'],
    nombre: 'Santa Carolina Sauvignon Blanc 750ml',
    precio: '$4.490',
    imagen: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Blanco seco, cítrico y fresco.',
    disponible: true,
  },
  {
    id: 20,
    categoria: 'vinos',
    tags: ['espumante'],
    nombre: 'Valdivieso Extra Brut 750ml',
    precio: '$6.990',
    imagen: 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Promo',
    etiquetaColor: 'green',
    descripcion: 'Espumante chileno, burbujas finas.',
    disponible: true,
  },

  /* ────────────────────────────────────────────────────────
     HIELO & SNACKS
  ──────────────────────────────────────────────────────── */
  {
    id: 10,
    categoria: 'hielo',
    tags: ['hielo'],
    nombre: 'Hielo Bolsa 3 Kg',
    precio: '$1.990',
    imagen: 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Esencial',
    etiquetaColor: 'blue',
    descripcion: 'Cubos perfectos para tus bebestibles.',
    disponible: true,
  },
  {
    id: 11,
    categoria: 'hielo',
    tags: ['snacks'],
    nombre: 'Mix Snacks Fiesta (6 pack)',
    precio: '$3.490',
    imagen: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80',
    etiqueta: 'Promo',
    etiquetaColor: 'green',
    descripcion: 'Papas fritas, maní y más.',
    disponible: true,
  },
  {
    id: 12,
    categoria: 'hielo',
    tags: ['mezcladores'],
    nombre: 'Coca-Cola 1.5L + Soda',
    precio: '$2.490',
    imagen: 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Pack mezcladores para cócteles.',
    disponible: true,
  },
  {
    id: 21,
    categoria: 'hielo',
    tags: ['energetica', 'mezcladores'],
    nombre: 'Red Bull 250ml',
    precio: '$1.990',
    imagen: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=400&q=80',
    etiqueta: null,
    etiquetaColor: null,
    descripcion: 'Energética para tus mezclas.',
    disponible: true,
  },

];
