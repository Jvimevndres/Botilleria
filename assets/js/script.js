/**
 * Botillería Lector Jean – script.js
 * Carrito · Checkout · WhatsApp · Admin CRUD · Supabase + LocalStorage fallback
 */

// ─── CONFIG ───────────────────────────────────────────────────────────
const CONFIG = {
  whatsappNumber: '56927341080',
  adminPassword: 'admin2026',
  deliveryFee: 1500,
  deliveryFeeNight: 3000,  // después de las 22:00
  minOrder: 5000,
  storeName: 'Botillería Lector Jean',
  transferencia: {
    banco: 'Banco Santander',
    tipo: 'Cuenta Corriente',
    numero: '87393534',
    rut: '25.491.864-4',
    titular: 'Lector Jean',
    email: 'lectorjean50@gmail.com',
  },
};

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────
// ⚠️ Reemplaza estos valores con los de tu proyecto en supabase.com
const SUPABASE_URL = 'https://nketwcenopdhlragsuti.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_X8KRlpZuXEliWE8YTEFfhg__JbOn2it';

let _sbClient = null;

function initSupabase() {
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || !window.supabase) return false;
  _sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}

function isSupabaseReady() { return !!_sbClient; }

// ─── LABELS DE SUBCATEGORÍAS (todas las categorías) ──────────────────
const SUBCAT_LABELS = {
  // Cervezas
  'latones': 'Latón',
  'latas-sueltas': 'Lata Suelta',
  'pack-latas': 'Pack Latas',
  'botellines': 'Pack Botellines',
  'botellas': 'Botella Grande',
  'retornables': 'Retornables',
  // Destilados (Tipo + Medida)
  'whisky-petaca': 'Whisky Petaca',
  'whisky-750': 'Whisky 750ml',
  'whisky-1lt': 'Whisky 1Lt',
  'ron-petaca': 'Ron Petaca',
  'ron-750': 'Ron 750ml',
  'ron-1lt': 'Ron 1Lt',
  'pisco-petaca': 'Pisco Petaca',
  'pisco-750': 'Pisco 750ml',
  'pisco-1lt': 'Pisco 1Lt',
  'gin-petaca': 'Gin Petaca',
  'gin-750': 'Gin 750ml',
  'gin-1lt': 'Gin 1Lt',
  'tequila-petaca': 'Tequila Petaca',
  'tequila-750': 'Tequila 750ml',
  'tequila-1lt': 'Tequila 1Lt',
  'vodka-petaca': 'Vodka Petaca',
  'vodka-750': 'Vodka 750ml',
  'vodka-1lt': 'Vodka 1Lt',
  'otros-destilados-petaca': 'Otros Petaca',
  'otros-destilados-750': 'Otros 750ml',
  'otros-destilados-1lt': 'Otros 1Lt',
  // Vinos (Tipo + Volumen)
  'tinto-750': 'Tinto 750ml',
  'tinto-1500': 'Tinto 1.5Lt',
  'blanco-750': 'Blanco 750ml',
  'blanco-1500': 'Blanco 1.5Lt',
  'rosado-750': 'Rosado 750ml',
  'rosado-1500': 'Rosado 1.5Lt',
  'dulce-750': 'Dulce 750ml',
  'dulce-1500': 'Dulce 1.5Lt',
  'vino-caja-500': 'Caja 500ml',
  'vino-caja-1000': 'Caja 1Lt',
  'vino-caja-2000': 'Caja 2Lt',
  // Espumantes
  'brut': 'Brut / Extra Brut',
  'demi-sec': 'Demi Sec',
  'moscato': 'Moscato',
  'espumante-rose': 'Rose',
  // Cocteles (Sabor + Volumen)
  'sour-275': 'Sour 275ml',
  'sour-700': 'Sour 700ml',
  'sour-1lt': 'Sour 1Lt',
  'mango-275': 'Mango 275ml',
  'mango-700': 'Mango 700ml',
  'mango-1lt': 'Mango 1Lt',
  'pina-colada-275': 'Piña Colada 275ml',
  'pina-colada-700': 'Piña Colada 700ml',
  'pina-colada-1lt': 'Piña Colada 1Lt',
  'manquehuito-275': 'Manquehuito 275ml',
  'manquehuito-700': 'Manquehuito 700ml',
  'manquehuito-1lt': 'Manquehuito 1Lt',
  'otros-cockteles-275': 'Otros 275ml',
  'otros-cockteles-700': 'Otros 700ml',
  'otros-cockteles-1lt': 'Otros 1Lt',
  // Licores
  'cremas': 'Cremas',
  'hierbas': 'Hierbas y Amargos',
  'dulces': 'Licores Dulces',
  // Bebidas (Rediseñado)
  'lata': 'Lata',
  'desechable-500': 'Desechable 500ml',
  'desechable-1250': 'Desechable 1.25Lt',
  'desechable-1500': 'Desechable 1.5Lt',
  'desechable-3000': 'Desechable 3Lt',
  'retornable-1250': 'Retornable 1.25Lt',
  'retornable-2000': 'Retornable 2Lt',
  'retornable-3000': 'Retornable 3Lt',
  'jugos-1500': 'Jugos 1.5Lt',
  'energeticas-250': 'Energeticas 250ml',
  'energeticas-350': 'Energeticas 350ml',
  'energeticas-473': 'Energeticas 473ml',
  'aguas-500': 'Aguas 500ml',
  'aguas-1500': 'Aguas 1.5Lt',
  'aguas-2000': 'Aguas 2Lt',
  // Snacks (Rediseñado)
  'hielo': 'Hielo',
  'snacks': 'Snacks',
  'dulces-snack': 'Dulces',
  'chicles': 'Chicles',
  'mentas': 'Mentas',
};

// ─── MAPA CATEGORÍA → SUBCATEGORÍAS DISPONIBLES ───────────────────────
const CAT_SUBFILTROS = {
  cervezas: ['latones', 'latas-sueltas', 'pack-latas', 'botellines', 'botellas', 'retornables'],
  destilados: [
    // Whisky
    'whisky-petaca', 'whisky-750', 'whisky-1lt',
    // Ron
    'ron-petaca', 'ron-750', 'ron-1lt',
    // Pisco
    'pisco-petaca', 'pisco-750', 'pisco-1lt',
    // Gin
    'gin-petaca', 'gin-750', 'gin-1lt',
    // Tequila
    'tequila-petaca', 'tequila-750', 'tequila-1lt',
    // Vodka
    'vodka-petaca', 'vodka-750', 'vodka-1lt',
    // Otros
    'otros-destilados-petaca', 'otros-destilados-750', 'otros-destilados-1lt',
  ],
  vinos: [
    // Tintos
    'tinto-750', 'tinto-1500',
    // Blancos
    'blanco-750', 'blanco-1500',
    // Rosados
    'rosado-750', 'rosado-1500',
    // Dulces
    'dulce-750', 'dulce-1500',
    // Cajas
    'vino-caja-500', 'vino-caja-1000', 'vino-caja-2000',
  ],
  espumantes: ['brut', 'demi-sec', 'moscato', 'espumante-rose'],
  cocteles: [
    // Sour
    'sour-275', 'sour-700', 'sour-1lt',
    // Mango
    'mango-275', 'mango-700', 'mango-1lt',
    // Piña Colada
    'pina-colada-275', 'pina-colada-700', 'pina-colada-1lt',
    // Manquehuito
    'manquehuito-275', 'manquehuito-700', 'manquehuito-1lt',
    // Otros
    'otros-cockteles-275', 'otros-cockteles-700', 'otros-cockteles-1lt',
  ],
  licores: ['cremas', 'hierbas', 'dulces'],
  bebidas: [
    'lata',
    'desechable-500',
    'desechable-1250',
    'desechable-1500',
    'desechable-3000',
    'retornable-1250',
    'retornable-2000',
    'retornable-3000',
    'jugos-1500',
    'energeticas-250',
    'energeticas-350',
    'energeticas-473',
    'aguas-500',
    'aguas-1500',
    'aguas-2000',
  ],
  snacks: ['hielo', 'snacks', 'dulces-snack', 'chicles', 'mentas'],
  promos: [],
};

// ─── NOMBRES LEGIBLES DE CATEGORÍA (para badges y UI) ────────────────
const CAT_LABELS = {
  cervezas: 'Cerveza',
  destilados: 'Destilado',
  vinos: 'Vino',
  espumantes: 'Espumante',
  cocteles: 'Cocteles',
  licores: 'Licor',
  bebidas: 'Bebida',
  snacks: 'Snack',
  promos: 'Promo',
};

// ─── PRODUCTOS BASE ────────────────────────────────────────────────────
const PRODUCTOS_BASE = [

  // ── CERVEZAS · LATONES 710cc (unidad) ─────────────────────────────
  { id: 1, nombre: 'Escudo Latón 710cc', categoria: 'cervezas', subcategoria: 'latones', precio: 990, descripcion: 'Lager nacional clásica · 5°', imagen: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=400&q=80', etiqueta: 'Más pedido', etiquetaColor: 'red', disponible: true },
  { id: 2, nombre: 'Cristal Latón 710cc', categoria: 'cervezas', subcategoria: 'latones', precio: 890, descripcion: 'La favorita de Chile · 4.9°', imagen: 'https://images.unsplash.com/photo-1550950158-d0d960dff596?auto=format&fit=crop&w=400&q=80', etiqueta: 'Oferta', etiquetaColor: 'amber', disponible: true },
  { id: 3, nombre: 'Heineken Latón 710cc', categoria: 'cervezas', subcategoria: 'latones', precio: 1290, descripcion: 'Lager holandesa premium · 5°', imagen: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'green', disponible: true },
  { id: 4, nombre: 'Royal Guard Golden Latón 710cc', categoria: 'cervezas', subcategoria: 'latones', precio: 990, descripcion: 'Golden Lager suave · 4.5°', imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 5, nombre: 'Brahma Latón 710cc', categoria: 'cervezas', subcategoria: 'latones', precio: 890, descripcion: 'Lager brasileña refrescante · 4.8°', imagen: 'https://images.unsplash.com/photo-1574021635408-bc1e06fba23b?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },

  // ── CERVEZAS · PACKS DE LATAS 350ml ───────────────────────────────
  { id: 6, nombre: 'Pack x6 Escudo Lata 350ml', categoria: 'cervezas', subcategoria: 'pack-latas', precio: 4490, descripcion: '6 latas 350ml · Lager 5°', imagen: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=400&q=80', etiqueta: 'Pack 6', etiquetaColor: 'green', disponible: true },
  { id: 7, nombre: 'Pack x6 Cristal Lata 350ml', categoria: 'cervezas', subcategoria: 'pack-latas', precio: 4290, descripcion: '6 latas 350ml · Lager 4.9°', imagen: 'https://images.unsplash.com/photo-1550950158-d0d960dff596?auto=format&fit=crop&w=400&q=80', etiqueta: 'Oferta', etiquetaColor: 'amber', disponible: true },
  { id: 8, nombre: 'Pack x6 Heineken Lata 350ml', categoria: 'cervezas', subcategoria: 'pack-latas', precio: 6490, descripcion: '6 latas 350ml · Lager 5°', imagen: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'green', disponible: true },
  { id: 9, nombre: 'Pack x24 Escudo Lata 350ml', categoria: 'cervezas', subcategoria: 'pack-latas', precio: 15990, descripcion: '24 latas 350ml · Precio caja', imagen: 'https://images.unsplash.com/photo-1574021635408-bc1e06fba23b?auto=format&fit=crop&w=400&q=80', etiqueta: 'Caja x24', etiquetaColor: 'red', disponible: true },

  // ── CERVEZAS · PACKS BOTELLINES 330ml ─────────────────────────────
  { id: 10, nombre: 'Pack x6 Corona Botellín 330ml', categoria: 'cervezas', subcategoria: 'botellines', precio: 6990, descripcion: '6 botellines 330ml · Lager mexicana 4.5°', imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80', etiqueta: 'Pack 6', etiquetaColor: 'amber', disponible: true },
  { id: 11, nombre: 'Pack x6 Heineken Botellín 330ml', categoria: 'cervezas', subcategoria: 'botellines', precio: 6990, descripcion: '6 botellines 330ml · Lager holandesa 5°', imagen: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80', etiqueta: 'Pack 6', etiquetaColor: 'green', disponible: true },
  { id: 12, nombre: 'Pack x12 Escudo Botellín 330ml', categoria: 'cervezas', subcategoria: 'botellines', precio: 8490, descripcion: '12 botellines 330ml · Mejor precio', imagen: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=400&q=80', etiqueta: 'Pack 12', etiquetaColor: 'red', disponible: true },
  { id: 13, nombre: 'Pack x12 Cristal Botellín 330ml', categoria: 'cervezas', subcategoria: 'botellines', precio: 7990, descripcion: '12 botellines 330ml · Lager 4.9°', imagen: 'https://images.unsplash.com/photo-1550950158-d0d960dff596?auto=format&fit=crop&w=400&q=80', etiqueta: 'Pack 12', etiquetaColor: 'amber', disponible: true },

  // ── CERVEZAS · BOTELLAS GRANDES 500-620ml (unidad) ────────────────
  { id: 14, nombre: 'Kunstmann Torobayo 500ml', categoria: 'cervezas', subcategoria: 'botellas', precio: 2190, descripcion: 'Amber ale artesanal · 5.5°', imagen: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=400&q=80', etiqueta: 'Artesanal', etiquetaColor: 'blue', disponible: true },
  { id: 15, nombre: 'Escudo Botella 620ml', categoria: 'cervezas', subcategoria: 'botellas', precio: 1390, descripcion: 'Lager nacional · 620ml · 5°', imagen: 'https://images.unsplash.com/photo-1566633806327-68e152aaf26d?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 16, nombre: 'Heineken Botella 620ml', categoria: 'cervezas', subcategoria: 'botellas', precio: 1890, descripcion: 'Lager holandesa · 620ml · 5°', imagen: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'green', disponible: true },
  { id: 17, nombre: 'Royal Guard Golden 620ml', categoria: 'cervezas', subcategoria: 'botellas', precio: 1490, descripcion: 'Golden Lager · 620ml · 4.5°', imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },

  // DESTILADOS
  { id: 118, nombre: 'Pisco Control 750ml', categoria: 'destilados', precio: 7990, descripcion: '35° · El clásico chileno', imagen: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&w=400&q=80', etiqueta: 'Más pedido', etiquetaColor: 'red', disponible: true },
  { id: 19, nombre: 'Pisco Mistral 750ml', categoria: 'destilados', precio: 8990, descripcion: '35° · Suave y frutado', imagen: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 20, nombre: 'Vodka Absolut 750ml', categoria: 'destilados', precio: 14990, descripcion: '40° · Sueco puro', imagen: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'green', disponible: true },
  { id: 21, nombre: 'Ron Bacardí Blanco 750ml', categoria: 'destilados', precio: 12990, descripcion: '37.5° · Para cócteles', imagen: 'https://images.unsplash.com/photo-1609350393940-c2e0d0e11c0d?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 22, nombre: 'Whisky Old Times 750ml', categoria: 'destilados', precio: 9990, descripcion: 'Blended scotch suave · 40°', imagen: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80', etiqueta: 'Oferta', etiquetaColor: 'amber', disponible: true },
  { id: 23, nombre: 'Gin Beefeater 750ml', categoria: 'destilados', precio: 17990, descripcion: '40° · London dry gin clásico', imagen: 'https://images.unsplash.com/photo-1624365169138-4c9e00a18e43?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 24, nombre: 'Tequila José Cuervo 750ml', categoria: 'destilados', precio: 13990, descripcion: '38° · Silver suave y neutro', imagen: 'https://images.unsplash.com/photo-1565299512474-b3c1d3a3d09d?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 116, nombre: 'Whisky Johnny Walker Black 1Lt', categoria: 'destilados', precio: 18990, descripcion: '40° · Escocés premium', imagen: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'green', disponible: true },
  { id: 117, nombre: 'Ron Zacapa 750ml', categoria: 'destilados', precio: 22990, descripcion: '40° · Gran reserva guatemalteco', imagen: 'https://images.unsplash.com/photo-1609350393940-c2e0d0e11c0d?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'blue', disponible: true },
  { id: 34, nombre: 'Pisco 1942 Petaca 375ml', categoria: 'destilados', precio: 4990, descripcion: '40° · Puro chileno', imagen: 'https://images.unsplash.com/photo-1516535794938-6063878f08cc?auto=format&fit=crop&w=400&q=80', etiqueta: 'Oferta', etiquetaColor: 'amber', disponible: true },

  // VINOS
  { id: 25, nombre: 'Casillero del Diablo Cabernet 750ml', categoria: 'vinos', precio: 5990, descripcion: 'Concha y Toro · Tinto· D.O. Valle Central', imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80', etiqueta: 'Popular', etiquetaColor: 'red', disponible: true },
  { id: 26, nombre: 'Santa Helena Siglo de Oro 750ml', categoria: 'vinos', precio: 3490, descripcion: 'Tinto suave · Fácil de beber', imagen: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 27, nombre: 'Gato Negro Blanco 750ml', categoria: 'vinos', precio: 3290, descripcion: 'Sauvignon Blanc refrescante', imagen: 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 28, nombre: 'Frontera Rosé 1.5L', categoria: 'vinos', precio: 5990, descripcion: 'Rosado fresco y afrutado', imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80', etiqueta: 'Promo', etiquetaColor: 'green', disponible: true },
  { id: 29, nombre: 'Cono Sur 20 Barrels Merlot', categoria: 'vinos', precio: 7490, descripcion: 'Tinto premium · Valle de Colchagua', imagen: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'blue', disponible: true },
  { id: 35, nombre: 'Santa Rita Blanco 1.5Lt', categoria: 'vinos', precio: 6490, descripcion: 'Chardonnay dulce y frutal', imagen: 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 36, nombre: 'Carmenere Dulce 750ml', categoria: 'vinos', precio: 4990, descripcion: 'Varietal chileno suave', imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80', etiqueta: 'Oferta', etiquetaColor: 'amber', disponible: true },

  // COCTELES (RTD - Ready to Drink)
  { id: 37, nombre: 'Coctel Sour Sin Alcohol 275ml', categoria: 'cocteles', precio: 2990, descripcion: 'Refrescante Sour clásico', imagen: 'https://images.unsplash.com/photo-1621895290207-c73fc8cf4628?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 38, nombre: 'Coctel Mango 700ml', categoria: 'cocteles', precio: 5490, descripcion: 'Tropical con sabor a mango', imagen: 'https://images.unsplash.com/photo-1621895290207-c73fc8cf4628?auto=format&fit=crop&w=400&q=80', etiqueta: 'Verano', etiquetaColor: 'amber', disponible: true },
  { id: 39, nombre: 'Coctel Piña Colada 1Lt', categoria: 'cocteles', precio: 8990, descripcion: 'Clásica piña colada helada', imagen: 'https://images.unsplash.com/photo-1621895290207-c73fc8cf4628?auto=format&fit=crop&w=400&q=80', etiqueta: 'Popular', etiquetaColor: 'red', disponible: true },
  { id: 40, nombre: 'Coctel Manquehuito 700ml', categoria: 'cocteles', precio: 5990, descripcion: 'Especial chileno tradicional', imagen: 'https://images.unsplash.com/photo-1621895290207-c73fc8cf4628?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },

  // BEBIDAS
  { id: 41, nombre: 'Fanta Naranja Lata 350ml', categoria: 'bebidas', precio: 1290, descripcion: 'Refrescante bebida gaseosa', imagen: 'https://images.unsplash.com/photo-1600788148184-403a693e8fe1?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 42, nombre: 'Sprite Lata 350ml', categoria: 'bebidas', precio: 1290, descripcion: 'Limón refrescante', imagen: 'https://images.unsplash.com/photo-1600788148184-403a693e8fe1?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 43, nombre: 'Jugo Natural 1.5Lt', categoria: 'bebidas', precio: 3490, descripcion: 'Naranja o piña · 100% natural', imagen: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 44, nombre: 'Coca Cola Desechable 1.5Lt', categoria: 'bebidas', precio: 2990, descripcion: 'Clásica refrescante', imagen: 'https://images.unsplash.com/photo-1554866585-acbb2d17c7ca?auto=format&fit=crop&w=400&q=80', etiqueta: 'Popular', etiquetaColor: 'red', disponible: true },
  { id: 45, nombre: 'Energética Red Bull 250ml', categoria: 'bebidas', precio: 3490, descripcion: 'Te da alas · 250ml', imagen: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 46, nombre: 'Agua Mineral 1.5Lt', categoria: 'bebidas', precio: 1490, descripcion: 'Purificada y refrescante', imagen: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },

  // SNACKS
  { id: 30, nombre: 'Hielo Bolsa 3kg', categoria: 'snacks', precio: 1990, descripcion: 'Hielo fabricado · Ideal para cócteles', imagen: 'https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=400&q=80', etiqueta: 'Esencial', etiquetaColor: 'blue', disponible: true },
  { id: 31, nombre: 'Hielo Bolsa 6kg', categoria: 'snacks', precio: 3490, descripcion: 'Formato grande para fiestas', imagen: 'https://images.unsplash.com/photo-1581393293369-ec7deaec8f3b?auto=format&fit=crop&w=400&q=80', etiqueta: 'Pack', etiquetaColor: 'green', disponible: true },
  { id: 32, nombre: 'Snack Mix Salado 100g', categoria: 'snacks', precio: 990, descripcion: 'Papas, churritos y maní · Mix perfecto', imagen: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 47, nombre: 'Chicles Trident 14g', categoria: 'snacks', precio: 490, descripcion: 'Fresh mint refrescante', imagen: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 48, nombre: 'Mentas Extra Strong 30g', categoria: 'snacks', precio: 790, descripcion: 'Intensas y refrescantes', imagen: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 49, nombre: 'Caramelos Duros Surtidos 200g', categoria: 'snacks', precio: 1290, descripcion: 'Variados sabores dulces', imagen: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
];

// ─── BADGE COLORS ──────────────────────────────────────────────────────
const BADGE_CLASSES = {
  red: 'bg-red-500 text-white',
  green: 'bg-green-500 text-white',
  blue: 'bg-sky-500 text-white',
  amber: 'bg-amber-400 text-slate-900',
};

// ─── STORE ────────────────────────────────────────────────────────────
const LS_PRODUCTS_KEY = 'blj_productos_v1';
const LS_DELETE_KEY = 'pf_delete_id';
const LS_ORDERS_KEY = 'blj_orders_v1';
let cart = [];

const ORDER_STATUS = {
  pending: 'pendiente',
  accepted: 'aceptado',
  rejected: 'rechazado',
};

let _uiLockCount = 0;
let _uiScrollY = 0;

function lockBodyScroll() {
  if (_uiLockCount === 0) {
    _uiScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('overflow-hidden');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_uiScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  _uiLockCount += 1;
}

function unlockBodyScroll() {
  if (_uiLockCount <= 0) return;
  _uiLockCount -= 1;
  if (_uiLockCount === 0) {
    document.body.classList.remove('overflow-hidden');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, _uiScrollY);
  }
}

// Cache global de productos (se llena en init)
let _productosCache = null;

function getProductos() {
  if (_productosCache) return _productosCache;
  try {
    const raw = localStorage.getItem(LS_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return JSON.parse(JSON.stringify(PRODUCTOS_BASE));
}

function saveProductos(arr) {
  _productosCache = arr;
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(arr));
}

// ─── DB: CARGA INICIAL ────────────────────────────────────────────────
async function loadProductosFromDB() {
  if (!isSupabaseReady()) {
    // Fallback: localStorage o base hardcodeada
    try {
      const raw = localStorage.getItem(LS_PRODUCTS_KEY);
      _productosCache = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(PRODUCTOS_BASE));
    } catch (e) {
      _productosCache = JSON.parse(JSON.stringify(PRODUCTOS_BASE));
    }
    return;
  }
  const { data, error } = await _sbClient.from('productos').select('*').order('id');
  if (error || !data) {
    console.warn('Supabase error, usando fallback:', error?.message);
    try {
      const raw = localStorage.getItem(LS_PRODUCTS_KEY);
      _productosCache = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(PRODUCTOS_BASE));
    } catch (e) { _productosCache = JSON.parse(JSON.stringify(PRODUCTOS_BASE)); }
    return;
  }
  if (data.length === 0) {
    // Primera vez: subir PRODUCTOS_BASE a Supabase automáticamente
    await seedSupabase();
    return;
  }
  _productosCache = data.map(row => ({
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    subcategoria: row.subcategoria || '',
    precio: row.precio,
    descripcion: row.descripcion || '',
    imagen: row.imagen || '',
    etiqueta: row.etiqueta || '',
    etiquetaColor: row.etiqueta_color || '',
    disponible: row.disponible !== false,
  }));
}

// ─── DB: SEED PRIMERA VEZ ─────────────────────────────────────────────
async function seedSupabase() {
  if (!isSupabaseReady()) return;
  const rows = PRODUCTOS_BASE.map(p => ({
    id: p.id, nombre: p.nombre, categoria: p.categoria,
    subcategoria: p.subcategoria || null, precio: p.precio,
    descripcion: p.descripcion || null, imagen: p.imagen || null,
    etiqueta: p.etiqueta || null, etiqueta_color: p.etiquetaColor || null,
    disponible: p.disponible !== false,
  }));
  await _sbClient.from('productos').insert(rows);
  _productosCache = JSON.parse(JSON.stringify(PRODUCTOS_BASE));
}

// ─── DB: GUARDAR / ACTUALIZAR ─────────────────────────────────────────
async function saveProductToDB(prod, isNew) {
  if (!isSupabaseReady()) {
    const prods = getProductos();
    if (isNew) {
      prod.id = genId();
      prods.push(prod);
    } else {
      const idx = prods.findIndex(p => p.id === prod.id);
      if (idx !== -1) prods[idx] = prod;
    }
    saveProductos(prods);
    return true;
  }
  const row = {
    nombre: prod.nombre, categoria: prod.categoria,
    subcategoria: prod.subcategoria || null, precio: prod.precio,
    descripcion: prod.descripcion || null, imagen: prod.imagen || null,
    etiqueta: prod.etiqueta || null, etiqueta_color: prod.etiquetaColor || null,
    disponible: prod.disponible !== false,
  };
  if (isNew) {
    prod.id = genId(); // generar ID en JS para evitar conflicto de secuencia
    const { data, error } = await _sbClient.from('productos').insert({ id: prod.id, ...row }).select().single();
    if (error) { console.error(error); return false; }
    prod.id = data.id;
    _productosCache = [...(_productosCache || []), prod];
  } else {
    const { error } = await _sbClient.from('productos').update(row).eq('id', prod.id);
    if (error) { console.error(error); return false; }
    _productosCache = (_productosCache || []).map(p => p.id === prod.id ? prod : p);
  }
  return true;
}

// ─── DB: ELIMINAR ─────────────────────────────────────────────────────
async function deleteProductFromDB(id) {
  if (!isSupabaseReady()) {
    const prods = getProductos().filter(p => p.id !== id);
    saveProductos(prods);
    return true;
  }
  const { error } = await _sbClient.from('productos').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  _productosCache = (_productosCache || []).filter(p => p.id !== id);
  return true;
}

// ─── DB: MIGRAR LOCALSTORAGE → SUPABASE ──────────────────────────────
async function migrateToSupabase() {
  if (!isSupabaseReady()) {
    showToast('<i class="fa-solid fa-circle-exclamation mr-1.5"></i> Supabase no está configurado aún', 'error');
    return;
  }
  const local = localStorage.getItem(LS_PRODUCTS_KEY);
  if (!local) { showToast('No hay datos locales que migrar', 'info'); return; }
  const prods = JSON.parse(local);
  if (!confirm(`¿Migrar ${prods.length} productos del navegador a Supabase? Esto reemplazará los datos actuales en la base de datos.`)) return;
  showToast('<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Migrando...', 'info');
  await _sbClient.from('productos').delete().neq('id', -1);
  const rows = prods.map(p => ({
    id: p.id, nombre: p.nombre, categoria: p.categoria,
    subcategoria: p.subcategoria || null, precio: p.precio,
    descripcion: p.descripcion || null, imagen: p.imagen || null,
    etiqueta: p.etiqueta || null, etiqueta_color: p.etiquetaColor || null,
    disponible: p.disponible !== false,
  }));
  const { error } = await _sbClient.from('productos').insert(rows);
  if (error) { showToast('Error al migrar: ' + error.message, 'error'); return; }
  _productosCache = prods;
  localStorage.removeItem(LS_PRODUCTS_KEY);
  showToast(`<i class="fa-solid fa-check mr-1.5"></i> ${prods.length} productos migrados a Supabase`, 'success');
  updateAdminStats(); renderAdminProducts('todos');
}

// ─── UTILS ────────────────────────────────────────────────────────────
function formatPeso(n) {
  return '$' + Number(n).toLocaleString('es-CL');
}

function parsePrecio(str) {
  return parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;
}

function genId() {
  const prods = getProductos();
  if (!prods.length) return 1;
  return Math.max(...prods.map(p => p.id)) + 1;
}

function getOrderNum() {
  const n = (parseInt(localStorage.getItem('blj_order_counter') || '0') + 1);
  localStorage.setItem('blj_order_counter', String(n));
  return String(n).padStart(4, '0');
}

function fechaHora() {
  return new Date().toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
}

// ─── AGE GATE ─────────────────────────────────────────────────────────
function checkAge(ok) {
  if (ok) {
    sessionStorage.setItem('blj_age', '1');
    const m = document.getElementById('age-modal');
    if (!m) return;
    m.style.transition = 'opacity 0.35s ease';
    m.style.pointerEvents = 'none';
    // Forzar reflow antes de iniciar la transición
    void m.offsetHeight;
    m.style.opacity = '0';
    setTimeout(() => m.remove(), 380);
  } else {
    document.getElementById('age-deny').classList.remove('hidden');
  }
}

// ─── OPEN STATUS ──────────────────────────────────────────────────────
function checkOpenStatus() {
  const now  = new Date();
  const day  = now.getDay();   // 0=Dom, 1=Lun … 6=Sáb
  const t    = now.getHours() * 60 + now.getMinutes();

  let open = false;

  // Lun–Jue (1-4): abre 12:00, cierra 01:00 del día siguiente
  if (day >= 1 && day <= 4 && t >= 720) open = true;   // desde las 12:00
  if (day >= 2 && day <= 5 && t < 60)  open = true;   // 00:00–01:00 (noche anterior)

  // Vie–Sáb (5-6): abre 12:00, cierra 03:00 del día siguiente
  if ((day === 5 || day === 6) && t >= 720) open = true;          // desde las 12:00
  if ((day === 6 || day === 0) && t < 180) open = true;           // 00:00–03:00 (noche anterior)

  // Dom (0): abre 13:00, cierra 00:00
  if (day === 0 && t >= 780) open = true;

  const s = document.getElementById('status-badge');
  const c = document.getElementById('closed-badge');
  const f = document.getElementById('footer-status');

  // Highlight del día activo en la tabla de horarios
  const badgeLJ  = document.getElementById('badge-lunjue');
  const badgeVS  = document.getElementById('badge-viesab');
  const badgeDom = document.getElementById('badge-dom');
  [badgeLJ, badgeVS, badgeDom].forEach(b => b?.classList.remove('footer-time-badge--hot'));
  if (day >= 1 && day <= 4)              badgeLJ?.classList.add('footer-time-badge--hot');
  else if (day === 5 || day === 6)       badgeVS?.classList.add('footer-time-badge--hot');
  else if (day === 0)                    badgeDom?.classList.add('footer-time-badge--hot');

  if (open) {
    s?.classList.remove('hidden'); s?.classList.add('flex');
    c?.classList.remove('flex');   c?.classList.add('hidden');
    if (f) f.innerHTML = '<span class="text-green-400"><i class="fa-solid fa-circle mr-1"></i>Estamos abiertos ahora</span>';
  } else {
    c?.classList.remove('hidden'); c?.classList.add('flex');
    s?.classList.remove('flex');   s?.classList.add('hidden');
    if (f) f.innerHTML = '<span class="text-red-400"><i class="fa-solid fa-circle mr-1"></i>Actualmente cerrados</span>';
  }
}

// ─── WHATSAPP LINKS ───────────────────────────────────────────────────
function setWaLinks() {
  const msg = `Hola! Quiero hacer un pedido en ${CONFIG.storeName}.`;
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  document.querySelectorAll('#wa-nav-btn, #hero-wa-cta, #footer-wa-cta').forEach(el => el.setAttribute('href', url));
}

let _waTooltipTimer = null;
function waFloatClick() {
  // Si el carrito cumple el pedido mínimo, abrir checkout directamente
  if (cartTotal() >= CONFIG.minOrder) {
    openCheckout();
    return;
  }
  // Si hay algo en el carrito pero no llega al mínimo, abrir el drawer
  if (cartTotal() > 0) {
    toggleCart();
    return;
  }
  // Carrito vacío: mostrar burbuja informativa
  const tooltip = document.getElementById('wa-float-tooltip');
  if (!tooltip) return;
  tooltip.classList.remove('hidden');
  clearTimeout(_waTooltipTimer);
  _waTooltipTimer = setTimeout(() => tooltip.classList.add('hidden'), 2800);
}

// ─── CART ─────────────────────────────────────────────────────────────
function addToCart(id) {
  const prod = getProductos().find(p => p.id === Number(id));
  if (!prod) return;
  const existing = cart.find(i => i.id === prod.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, categoria: prod.categoria || null, qty: 1 });
  }
  updateCartUI();
  showToast(`<i class="fa-solid fa-cart-plus mr-1.5"></i> ${prod.nombre} agregado al carrito`, 'success');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== Number(id));
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === Number(id));
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function clearCart() {
  if (!cart.length) return;
  if (!confirm('¿Vaciar el carrito?')) return;
  cart = [];
  updateCartUI();
}

function getDeliveryFee() {
  return new Date().getHours() >= 22 ? CONFIG.deliveryFeeNight : CONFIG.deliveryFee;
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.precio * i.qty, 0);
}

function updateCartUI() {
  const total = cartTotal();
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // Badges
  const badge = document.getElementById('cart-badge');
  const label = document.getElementById('cart-count-label');
  if (badge) { badge.textContent = count; badge.classList.toggle('hidden', count === 0); badge.classList.toggle('flex', count > 0); }
  if (label) label.textContent = count;

  // Totals
  const sub = document.getElementById('cart-subtotal');
  const tot = document.getElementById('cart-total');
  if (sub) sub.textContent = formatPeso(total);
  if (tot) tot.textContent = formatPeso(total + getDeliveryFee());
  // Actualizar costo delivery en el drawer
  const dFeeEl = document.getElementById('cart-delivery-fee');
  if (dFeeEl) dFeeEl.textContent = '+ ' + formatPeso(getDeliveryFee());

  // Hero stat
  const heroStat = document.getElementById('hero-stat-products');
  if (heroStat) heroStat.textContent = '+' + getProductos().filter(p => p.disponible).length;

  // States
  const emptyState = document.getElementById('cart-empty-state');
  const itemsState = document.getElementById('cart-items-state');
  if (emptyState && itemsState) {
    if (cart.length === 0) {
      emptyState.classList.remove('hidden'); emptyState.classList.add('flex');
      itemsState.classList.remove('flex'); itemsState.classList.add('hidden');
    } else {
      emptyState.classList.remove('flex'); emptyState.classList.add('hidden');
      itemsState.classList.remove('hidden'); itemsState.classList.add('flex');
    }
  }
  renderCartItems();
}

function renderCartItems() {
  const list = document.getElementById('cart-items-list');
  if (!list) return;
  list.innerHTML = cart.map(item => `
    <div class="flex items-center gap-3 bg-slate-800/60 border border-white/5 rounded-2xl p-3">
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-white text-sm leading-tight truncate">${item.nombre}</p>
        <p class="text-red-400 text-xs font-bold mt-0.5">${formatPeso(item.precio)} c/u</p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button onclick="changeQty(${item.id},-1)" class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-red-600/40 text-white text-sm font-bold flex items-center justify-center transition-all hover:scale-110 active:scale-90">−</button>
        <span class="w-6 text-center font-bold text-white text-sm">${item.qty}</span>
        <button onclick="changeQty(${item.id},1)"  class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-red-600/40 text-white text-sm font-bold flex items-center justify-center transition-all hover:scale-110 active:scale-90">+</button>
      </div>
      <div class="text-right flex-shrink-0 min-w-[3.5rem]">
        <p class="font-black text-white text-sm">${formatPeso(item.precio * item.qty)}</p>
        <button onclick="removeFromCart(${item.id})" class="text-slate-600 hover:text-red-400 text-[10px] mt-0.5 transition-colors">eliminar</button>
      </div>
    </div>
  `).join('');
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  const open = !drawer.classList.contains('translate-x-full');
  if (open) {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    unlockBodyScroll();
  } else {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    lockBodyScroll();
  }
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.add('translate-x-full');
  document.getElementById('cart-overlay')?.classList.add('hidden');
  unlockBodyScroll();
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────
function openCheckout() {
  if (cart.length === 0) { showToast('El carrito está vacío', 'error'); return; }
  const total = cartTotal();
  if (total < CONFIG.minOrder) {
    showToast(`Pedido mínimo: ${formatPeso(CONFIG.minOrder)}`, 'warning');
    return;
  }
  closeCart();
  document.getElementById('f-entrega').value = 'delivery';
  document.getElementById('f-pago').value = 'transferencia';
  setEntregaMode('delivery');
  buildCheckoutSummary();
  buildTransferBox();
  const overlay = document.getElementById('checkout-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  lockBodyScroll();
}

function closeCheckout() {
  const overlay = document.getElementById('checkout-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  unlockBodyScroll();
  document.getElementById('checkout-error')?.classList.add('hidden');
}

function closeCheckoutOutside(e) {
  if (e.target === document.getElementById('checkout-overlay')) closeCheckout();
}

function getEntregaMode() {
  return document.getElementById('f-entrega')?.value === 'retiro' ? 'retiro' : 'delivery';
}

function getPagoMode() {
  return document.getElementById('f-pago')?.value === 'tarjeta' ? 'tarjeta' : 'transferencia';
}

function getCheckoutDeliveryFee() {
  return getEntregaMode() === 'delivery' ? getDeliveryFee() : 0;
}

function styleChoiceButton(btn, active, tone = 'red') {
  if (!btn) return;
  const activeBg = tone === 'sky' ? 'rgba(14,165,233,0.14)' : 'rgba(239,68,68,0.14)';
  const activeBorder = tone === 'sky' ? 'rgba(14,165,233,0.55)' : 'rgba(239,68,68,0.55)';
  btn.style.backgroundColor = active ? activeBg : '#1e293b';
  btn.style.borderColor = active ? activeBorder : 'rgba(255,255,255,0.08)';
}

function updateCheckoutChoiceStyles() {
  const entrega = getEntregaMode();
  const pago = getPagoMode();
  styleChoiceButton(document.getElementById('entrega-delivery-btn'), entrega === 'delivery', 'red');
  styleChoiceButton(document.getElementById('entrega-retiro-btn'), entrega === 'retiro', 'sky');
  styleChoiceButton(document.getElementById('pago-transferencia-btn'), pago === 'transferencia', 'red');
  styleChoiceButton(document.getElementById('pago-tarjeta-btn'), pago === 'tarjeta', 'sky');
}

function setEntregaMode(mode) {
  const entrega = mode === 'retiro' ? 'retiro' : 'delivery';
  document.getElementById('f-entrega').value = entrega;

  const addressBlock = document.getElementById('checkout-address-block');
  if (addressBlock) addressBlock.classList.toggle('hidden', entrega === 'retiro');

  if (entrega === 'delivery' && getPagoMode() === 'tarjeta') {
    document.getElementById('f-pago').value = 'transferencia';
    showToast('Para delivery solo se permite transferencia bancaria', 'info');
  }
  updateCheckoutChoiceStyles();
  buildCheckoutSummary();
  buildTransferBox();
}

function setPagoMode(mode) {
  const entrega = getEntregaMode();
  const pago = mode === 'tarjeta' ? 'tarjeta' : 'transferencia';
  if (pago === 'tarjeta' && entrega === 'delivery') {
    showToast('Pago con tarjeta solo disponible para retiro en local', 'warning');
    document.getElementById('f-pago').value = 'transferencia';
  } else {
    document.getElementById('f-pago').value = pago;
  }
  updateCheckoutChoiceStyles();
  buildTransferBox();
}

function buildCheckoutSummary() {
  const box = document.getElementById('checkout-summary');
  if (!box) return;
  const entrega = getEntregaMode();
  const deliveryFee = getCheckoutDeliveryFee();
  const subtotal = cartTotal();
  box.innerHTML = cart.map(item => `
    <div class="flex items-center justify-between px-4 py-3 text-sm">
      <div class="flex items-center gap-2.5">
        <span class="w-6 h-6 rounded-lg bg-slate-700 text-xs font-black text-white flex items-center justify-center flex-shrink-0">${item.qty}</span>
        <span class="text-slate-200 font-medium">${item.nombre}</span>
      </div>
      <span class="font-bold text-white">${formatPeso(item.precio * item.qty)}</span>
    </div>
  `).join('') + `
    <div class="flex justify-between px-4 py-3 border-t border-white/5 text-xs text-slate-500">
      <span>Subtotal</span><span>${formatPeso(subtotal)}</span>
    </div>
    <div class="flex justify-between px-4 py-3 text-xs text-slate-500">
      <span>${entrega === 'delivery' ? 'Delivery' : 'Retiro en local'}</span>
      <span class="${entrega === 'delivery' ? 'text-red-400' : 'text-sky-300'}">${entrega === 'delivery' ? `+ ${formatPeso(deliveryFee)}` : 'Sin costo'}</span>
    </div>
  `;
  const tot = document.getElementById('checkout-total-display');
  if (tot) tot.textContent = formatPeso(subtotal + deliveryFee);
  const note = document.getElementById('checkout-delivery-note');
  if (note) {
    note.textContent = entrega === 'delivery'
      ? `Incluye delivery (${formatPeso(deliveryFee)})`
      : 'Retiro en local (sin costo de delivery)';
  }
}

function buildTransferBox() {
  const box = document.getElementById('transfer-info-box');
  const tarjetaBox = document.getElementById('tarjeta-info-box');
  if (!box) return;
  const pago = getPagoMode();

  if (pago === 'tarjeta') {
    box.classList.add('hidden');
    tarjetaBox?.classList.remove('hidden');
    return;
  }

  box.classList.remove('hidden');
  tarjetaBox?.classList.add('hidden');

  const t = CONFIG.transferencia;
  const total = cartTotal() + getCheckoutDeliveryFee();
  box.innerHTML = `
    <div class="grid grid-cols-2 gap-y-2">
      <span class="text-slate-500">Banco</span>      <span class="text-white font-semibold">${t.banco}</span>
      <span class="text-slate-500">Tipo</span>       <span class="text-white font-semibold">${t.tipo}</span>
      <span class="text-slate-500">Número</span>     <span class="text-white font-semibold font-mono">${t.numero}</span>
      <span class="text-slate-500">RUT</span>        <span class="text-white font-semibold font-mono">${t.rut}</span>
      <span class="text-slate-500">Titular</span>    <span class="text-white font-semibold">${t.titular}</span>
      <span class="text-slate-500">Email</span>      <span class="text-white font-semibold text-xs">${t.email}</span>
    </div>
    <div class="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
      <span class="text-slate-500 text-xs">Monto a transferir:</span>
      <span class="text-red-400 font-black text-xl">${formatPeso(total)}</span>
    </div>
    <div class="mt-3 pt-3 border-t border-white/5 flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
      <i class="fa-solid fa-triangle-exclamation text-amber-400 text-sm mt-0.5 flex-shrink-0"></i>
      <p class="text-amber-300 text-xs font-bold leading-snug">¡Importante! Al realizar la transferencia ingresa el correo <span class="text-white">${t.email}</span> para que podamos verificar tu pago.</p>
    </div>
  `;
}

function toggleCheckbox(el) {
  const box = document.getElementById('f-comprobante-box');
  const check = document.getElementById('f-comprobante-check');
  if (el.checked) {
    box.classList.add('bg-red-600', 'border-red-600');
    box.classList.remove('bg-slate-800', 'border-slate-600');
    check.classList.remove('hidden');
  } else {
    box.classList.remove('bg-red-600', 'border-red-600');
    box.classList.add('bg-slate-800', 'border-slate-600');
    check.classList.add('hidden');
  }
}

async function enviarPedidoWhatsApp() {
  const nombre = document.getElementById('f-nombre')?.value.trim();
  const telefono = document.getElementById('f-telefono')?.value.trim();
  const direccion = document.getElementById('f-direccion')?.value.trim();
  const depto = document.getElementById('f-depto')?.value.trim();
  const comuna = document.getElementById('f-comuna')?.value.trim();
  const referencia = document.getElementById('f-referencia')?.value.trim();
  const notas = document.getElementById('f-notas')?.value.trim();
  const entrega = getEntregaMode();
  const pago = getPagoMode();
  const comp = document.getElementById('f-comprobante')?.checked;
  const errBox = document.getElementById('checkout-error');
  const errMsg = document.getElementById('checkout-error-msg');

  function showErr(msg) {
    errMsg.textContent = msg;
    errBox.classList.remove('hidden');
    errBox.classList.add('flex');
    errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (!nombre) return showErr('Por favor ingresa tu nombre completo.');
  if (!telefono) return showErr('Por favor ingresa tu número de WhatsApp o teléfono.');
  if (entrega === 'delivery' && !direccion) return showErr('Por favor ingresa la dirección de entrega.');
  if (entrega === 'delivery' && !comuna) return showErr('Por favor ingresa la comuna.');
  if (entrega === 'delivery' && pago !== 'transferencia') return showErr('Para delivery solo está disponible pago por transferencia.');
  errBox.classList.add('hidden');
  errBox.classList.remove('flex');

  const orderNum = getOrderNum();
  const t = CONFIG.transferencia;
  const subtotal = cartTotal();
  const deliveryFee = getCheckoutDeliveryFee();
  const total = subtotal + deliveryFee;

  const orderItems = cart.map(item => ({
    id: item.id,
    nombre: item.nombre,
    categoria: item.categoria || getProductos().find(p => p.id === item.id)?.categoria || null,
    precio: item.precio,
    qty: item.qty,
  }));

  const lineasProductos = cart.map(item =>
    `  • ${item.nombre} x${item.qty}  →  ${formatPeso(item.precio * item.qty)}`
  ).join('\n');

  const direccionCompleta = entrega === 'delivery'
    ? [direccion, depto, comuna].filter(Boolean).join(', ')
    : 'Retiro en local: Germán Tenderini 1802, Renca';

  const detallePago = pago === 'transferencia'
    ? [
      `*PAGO – TRANSFERENCIA BANCARIA*`,
      `  Banco:    ${t.banco}`,
      `  Tipo:     ${t.tipo}`,
      `  N° Cta:   ${t.numero}`,
      `  RUT:      ${t.rut}`,
      `  Titular:  ${t.titular}`,
      `  Email:    ${t.email}`,
      `  *Monto:   ${formatPeso(total)}*`,
      ``,
      `*ADJUNTAR COMPROBANTE DE TRANSFERENCIA*`,
    ]
    : [
      `*PAGO – TARJETA EN LOCAL*`,
      `  Cliente pagará con tarjeta al retirar en tienda.`,
      `  *Monto estimado: ${formatPeso(total)}*`,
    ];

  const msg = [
    `*${CONFIG.storeName}*`,
    `*PEDIDO #${orderNum}*`,
    `${fechaHora()}`,
    `${'─'.repeat(30)}`,
    ``,
    `*DATOS DEL CLIENTE*`,
    `  Nombre: ${nombre}`,
    `  Teléfono: ${telefono}`,
    ``,
    `*PRODUCTOS SOLICITADOS*`,
    lineasProductos,
    ``,
    `*MODALIDAD*`,
    `  Entrega:           ${entrega === 'delivery' ? 'Delivery' : 'Retiro en local'}`,
    `  Pago:              ${pago === 'transferencia' ? 'Transferencia bancaria' : 'Tarjeta en local'}`,
    ``,
    `  Subtotal:          ${formatPeso(subtotal)}`,
    `  ${entrega === 'delivery' ? 'Delivery' : 'Retiro'}:          ${entrega === 'delivery' ? `+ ${formatPeso(deliveryFee)}` : '$0'}`,
    `  ─────────────────────`,
    `  *TOTAL A PAGAR:    ${formatPeso(total)}*`,
    ``,
    `*${entrega === 'delivery' ? 'DIRECCIÓN DE ENTREGA' : 'RETIRO EN LOCAL'}*`,
    `  ${direccionCompleta}`,
    entrega === 'delivery' && referencia ? `  Referencia: ${referencia}` : null,
    ``,
    ...detallePago,
    notas ? `\n*Notas del cliente:*\n  ${notas}` : null,
    ``,
    `${'─'.repeat(30)}`,
    `Por favor espere confirmación de su pedido.`,
    `_Enviado desde ${window.location.origin}/_`,
  ].filter(l => l !== null).join('\n');

  const orderPayload = {
    pedido_ref: String(orderNum),
    cliente_nombre: nombre,
    cliente_telefono: telefono,
    direccion,
    depto,
    comuna,
    referencia,
    notas,
    comprobante_declarado: !!comp,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    estado: ORDER_STATUS.pending,
    items: orderItems,
  };

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  const waWin = window.open(url, '_blank', 'noopener');
  if (!waWin) {
    window.location.href = url;
  }

  const orderSaved = await guardarPedido(orderPayload);

  closeCheckout();
  cart = [];
  updateCartUI();
  showToast('<i class="fa-brands fa-whatsapp mr-1.5"></i> Pedido enviado con éxito por WhatsApp', 'success');
  if (!orderSaved) {
    showToast('<i class="fa-solid fa-triangle-exclamation mr-1.5"></i> El pedido se envió por WhatsApp, pero no se pudo guardar en historial', 'warning');
  }
}

// ─── CATALOG RENDER ────────────────────────────────────────────────────
let activeSubcat = 'todos';
let activeBusqueda = '';
let currentPage = 1;
const ITEMS_PER_PAGE = 12;

// Normaliza texto: quita tildes, minúsculas y puntuación extra
function normalizeText(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseVolumeMl(text) {
  if (!text) return null;
  const raw = String(text).toLowerCase();
  if (/\b3\s*\/\s*4\b/.test(raw)) return 750;

  const volumeMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*(ml|cc|l|lt|lts|litro|litros)\b/);
  if (!volumeMatch) return null;

  const value = Number(String(volumeMatch[1]).replace(',', '.'));
  if (!Number.isFinite(value)) return null;

  const unit = volumeMatch[2];
  if (unit === 'ml' || unit === 'cc') return Math.round(value);
  return Math.round(value * 1000);
}

function resolveProductSubcat(p) {
  const category = p.categoria;
  const validSubs = CAT_SUBFILTROS[category] || [];
  const currentSub = p.subcategoria || '';
  if (validSubs.includes(currentSub)) return currentSub;

  const rawText = [p.nombre || '', p.descripcion || ''].join(' ');
  const text = normalizeText(rawText);
  const volume = parseVolumeMl(rawText);

  // ─── DESTILADOS: Tipo (whisky/ron/pisco/gin/tequila/vodka) + Medida ───
  if (category === 'destilados') {
    let tipo = 'otros-destilados';
    let medida = 'botella-750';
    
    // Detectar tipo de destilado
    if (/\bwhisky\b/.test(text)) tipo = 'whisky';
    else if (/\bron\b/.test(text)) tipo = 'ron';
    else if (/\bpisco\b/.test(text)) tipo = 'pisco';
    else if (/\bgin\b/.test(text)) tipo = 'gin';
    else if (/\btequila\b/.test(text)) tipo = 'tequila';
    else if (/\bvodka\b/.test(text)) tipo = 'vodka';
    
    // Detectar medida
    if (/\bpetaca\b/.test(text)) medida = 'petaca';
    else if (volume >= 950) medida = '1lt';
    else medida = '750';
    
    return `${tipo}-${medida}`;
  }

  // ─── VINOS: Tipo (tinto/blanco/rosado/dulce) + Volumen ───
  if (category === 'vinos') {
    let tipo = 'tinto';
    let volumen = '750';
    
    // Detectar tipo de vino
    if (/\bblanco\b|\bchardonnay\b|\bsauvignon\b/.test(text)) tipo = 'blanco';
    else if (/\brosado\b|\brose\b|\bros[ée]\b/.test(text)) tipo = 'rosado';
    else if (/\bdulce\b|\rmuscat\b|\bmoscatel\b/.test(text)) tipo = 'dulce';
    else tipo = 'tinto'; // default
    
    // Detectar cajas (tienen su propio flujo)
    if (/\bcaja\b|\bbox\b|\btetra\b/.test(text)) {
      if (volume <= 550) return 'vino-caja-500';
      if (volume <= 1200) return 'vino-caja-1000';
      return 'vino-caja-2000';
    }
    
    // Detectar volumen
    if (/\b1\s*[.,]\s*5\s*(l|lt|lts|litro|litros)\b|\b1500\s*(ml|cc)\b|\bbotellon\b/.test(text) || volume >= 1400) {
      volumen = '1500';
    } else {
      volumen = '750';
    }
    
    return `${tipo}-${volumen}`;
  }

  // ─── ESPUMANTES ───
  if (category === 'espumantes') {
    if (/\brose\b|\bros[ée]\b/.test(text)) return 'espumante-rose';
    if (/\bdemi\s*sec\b/.test(text)) return 'demi-sec';
    if (/\bmoscato\b/.test(text)) return 'moscato';
    return 'brut';
  }

  // ─── COCTELES: Sabor (sour/mango/pina-colada/manquehuito) + Volumen ───
  if (category === 'cocteles') {
    let sabor = 'otros-cockteles';
    let volumen = '700';
    
    // Detectar sabor del coctel
    if (/\bsour\b/.test(text)) sabor = 'sour';
    else if (/\bmango\b/.test(text)) sabor = 'mango';
    else if (/\bpina\b|\bpiña\b|\bpinacola\b|\bpina\s*colada\b|\bpinuela\b/.test(text)) sabor = 'pina-colada';
    else if (/\bmanquehuito\b|\bmanquehue\b/.test(text)) sabor = 'manquehuito';
    else sabor = 'otros-cockteles';
    
    // Detectar volumen
    if (volume >= 950) volumen = '1lt';
    else if (volume >= 600) volumen = '700';
    else volumen = '275';
    
    return `${sabor}-${volumen}`;
  }

  // ─── BEBIDAS ───
  if (category === 'bebidas') {
    // Jugos: solo existen 1.5Lt
    if (/\bjugo\b/.test(text)) {
      return 'jugos-1500';
    }
    
    // Energéticas
    if (/\benergetica\b|\benergy\b/.test(text)) {
      if (volume >= 430) return 'energeticas-473';
      if (volume >= 320) return 'energeticas-350';
      return 'energeticas-250';
    }
    
    // Aguas, Tónicas, Minerales
    if (/\bagua\b|\btonica\b|\bmineral\b/.test(text)) {
      if (volume >= 1800) return 'aguas-2000';
      if (volume >= 1200) return 'aguas-1500';
      return 'aguas-500';
    }

    // Latas (antes "desechable-lata")
    const isCan = /\blata\b|\blaton\b/.test(text);
    if (isCan) return 'lata';
    
    // Retornables vs Desechables
    const isRetornable = /\bretornable\b/.test(text);
    if (isRetornable) {
      if (volume >= 2600) return 'retornable-3000';
      if (volume >= 1700) return 'retornable-2000';
      return 'retornable-1250';
    }
    
    // Desechables (botellas plásticas)
    if (volume >= 2600) return 'desechable-3000';
    if (volume >= 1400) return 'desechable-1500';
    if (volume >= 1150) return 'desechable-1250';
    return 'desechable-500';
  }

  // ─── SNACKS ───
  if (category === 'snacks') {
    if (/\bhielo\b/.test(text)) return 'hielo';
    if (/\bchicle\b/.test(text)) return 'chicles';
    if (/\bmenta\b/.test(text)) return 'mentas';
    if (/\bdulce\b|\bcaramelo\b|\bchocolate\b|\bgolosina\b/.test(text)) return 'dulces-snack';
    if (/\bsnack\b|\bpapas\b|\bchurritos\b|\bmani\b|\bmaani\b|\bfrutos\b/.test(text)) return 'snacks';
    return 'snacks'; // default
  }

  return currentSub || 'todos';
}

function sortBySubcatOrder(prods, categoria) {
  const order = CAT_SUBFILTROS[categoria] || [];
  if (!order.length) return prods;
  const rank = new Map(order.map((sub, idx) => [sub, idx]));
  return [...prods].sort((a, b) => {
    const aRank = rank.get(resolveProductSubcat(a));
    const bRank = rank.get(resolveProductSubcat(b));
    const ra = Number.isInteger(aRank) ? aRank : Number.MAX_SAFE_INTEGER;
    const rb = Number.isInteger(bRank) ? bRank : Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    return a.nombre.localeCompare(b.nombre, 'es');
  });
}

function getAvailableSubfiltros(categoria) {
  const configured = CAT_SUBFILTROS[categoria] || [];
  if (!configured.length) return [];

  const available = new Set();
  getProductos()
    .filter(p => p.disponible && p.categoria === categoria)
    .forEach(p => {
      const resolved = resolveProductSubcat(p);
      if (configured.includes(resolved)) available.add(resolved);
    });

  return configured.filter(sub => available.has(sub));
}

// Mapa de alias: palabras coloquiales → términos que aparecen en el índice
const SEARCH_ALIASES = {
  // Variantes sin acento / en inglés
  'coctel':       'cocteles coctel rtd',
  'cocteles':     'cocteles coctel rtd',
  'cocktail':     'cocteles coctel rtd',
  'cocktails':    'cocteles coctel rtd',
  'champagne':    'espumante espumantes brut demi sec',
  'champana':     'espumante espumantes brut demi sec',
  'champaña':     'espumante espumantes',
  'whiskey':      'whisky',
  'tequilla':     'tequila',
  'ginebra':      'gin',

  // Formas de buscar subcategorías naturalmente
  'en caja':      'caja en caja',
  'caja':         'caja',
  'lata':         'lata laton latas latones',
  'latas':        'lata laton latas latones',
  'laton':        'laton latones',
  'latones':      'laton latones',
  'botella':      'botella botellines botellas',
  'botellas':     'botella botellines botellas',
  'botellín':     'botellines',
  'botellin':     'botellines',
  'pack':         'pack latas botellines',
  'tinto':        'tinto tintos',
  'tintos':       'tinto tintos',
  'blanco':       'blanco blancos',
  'blancos':      'blanco blancos',
  'rose':         'rose rosé dulces',
  'rosé':         'rose rosé dulces',
  'dulce':        'dulce dulces rosé rose',
  'sour':         'sour',
  'spritz':       'spritz aperitivo',
  'aperitivo':    'spritz aperitivo aperitivos',
  'crema':        'crema cremas licor',
  'hierbas':      'hierbas amargos',
  'amargo':       'hierbas amargos',
  'gaseosa':      'gaseosa gaseosas',
  'gaseosas':     'gaseosa gaseosas',
  'refresco':     'gaseosa gaseosas',
  'retornable':   'retornable retornables gaseosas-retornables',
  'retornables':  'retornable retornables gaseosas-retornables',
  'jugo':         'jugo jugos',
  'jugos':        'jugo jugos',
  'agua':         'agua aguas tonicas',
  'tonico':       'aguas tonicas',
  'tonica':       'aguas tonicas',
  'energetica':   'energetica energeticas',
  'energética':   'energetica energeticas',
  'hielo':        'hielo',
  'snack':        'snack snacks salado',
  'combo':        'combo promos promo',
  'oferta':       'promo promos combo',
  'promo':        'promo promos',
  'regalo':       'promo promos combo',
};

// Construye el texto de índice completo para un producto
function buildSearchIndex(p) {
  const resolvedSubcat = resolveProductSubcat(p);
  const parts = [
    p.nombre,
    p.descripcion || '',
    p.categoria,
    CAT_LABELS[p.categoria] || '',
    resolvedSubcat,
    SUBCAT_LABELS[resolvedSubcat] || '',
    p.etiqueta || '',
  ];
  return normalizeText(parts.join(' '));
}

// Expande la query aplicando aliases
function expandQuery(raw) {
  let q = normalizeText(raw);
  // Primero busca frases compuestas (orden: más largo primero)
  const aliasKeys = Object.keys(SEARCH_ALIASES).sort((a, b) => b.length - a.length);
  aliasKeys.forEach(alias => {
    const aliasNorm = normalizeText(alias);
    if (q.includes(aliasNorm)) {
      q = q + ' ' + normalizeText(SEARCH_ALIASES[alias]);
    }
  });
  // Elimina duplicados de palabras
  const words = [...new Set(q.split(' ').filter(Boolean))];
  return words;
}

function matchesSearch(p, words) {
  const index = buildSearchIndex(p);
  // Todas las palabras deben aparecer en el índice (AND)
  return words.every(w => index.includes(w));
}

function renderProductos(filtro = 'todos', subcat = null, resetPage = true) {
  if (subcat !== null) activeSubcat = subcat;
  if (resetPage) currentPage = 1;
  const grid = document.getElementById('products-grid');
  const noRes = document.getElementById('no-results');
  if (!grid) return;
  let prods = getProductos().filter(p => p.disponible && (filtro === 'todos' || p.categoria === filtro));
  // Aplica subfiltro genérico
  if (filtro !== 'todos' && activeSubcat !== 'todos' && (CAT_SUBFILTROS[filtro] || []).length > 0) {
    prods = prods.filter(p => resolveProductSubcat(p) === activeSubcat);
  }
  // Aplica búsqueda inteligente
  const rawQuery = activeBusqueda.trim();
  if (rawQuery) {
    const words = expandQuery(rawQuery);
    let andResults = prods.filter(p => matchesSearch(p, words));
    if (andResults.length > 0) {
      prods = andResults;
    } else {
      prods = prods.filter(p => words.some(w => buildSearchIndex(p).includes(w)));
    }
  }

  if (filtro !== 'todos') {
    prods = sortBySubcatOrder(prods, filtro);
  }

  const totalPages = Math.ceil(prods.length / ITEMS_PER_PAGE);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageProds = prods.slice(start, start + ITEMS_PER_PAGE);
  grid.innerHTML = pageProds.map(p => buildCard(p)).join('');
  if (noRes) noRes.classList.toggle('hidden', prods.length > 0);
  renderPagination(totalPages, prods.length);
}

function renderPagination(totalPages, totalItems) {
  const container = document.getElementById('pagination');
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }
  const prev = currentPage > 1;
  const next = currentPage < totalPages;
  let pages = '';
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages += `<button onclick="goToPage(${i})" class="pagination-btn${i === currentPage ? ' active' : ''}">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages += `<span class="pagination-dots">&hellip;</span>`;
    }
  }
  container.innerHTML = `
    <div class="flex items-center justify-center gap-2 mt-10 flex-wrap">
      <button onclick="goToPage(${currentPage - 1})" ${prev ? '' : 'disabled'} class="pagination-btn pagination-arrow">
        <i class="fa-solid fa-chevron-left text-xs"></i>
      </button>
      ${pages}
      <button onclick="goToPage(${currentPage + 1})" ${next ? '' : 'disabled'} class="pagination-btn pagination-arrow">
        <i class="fa-solid fa-chevron-right text-xs"></i>
      </button>
    </div>
    <p class="text-center text-slate-500 text-xs mt-3">
      Página ${currentPage} de ${totalPages} &middot; ${totalItems} productos
    </p>
  `;
}

function goToPage(page) {
  currentPage = page;
  const cat = document.querySelector('#filtros .cat-btn.active')?.dataset.cat || 'todos';
  renderProductos(cat, null, false);
  document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onCatalogSearch(val) {
  activeBusqueda = val;
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.classList.toggle('hidden', !val.trim());
  const cat = document.querySelector('#filtros .cat-btn.active')?.dataset.cat || 'todos';
  renderProductos(cat);
}

function clearCatalogSearch() {
  activeBusqueda = '';
  const input = document.getElementById('catalog-search');
  if (input) input.value = '';
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) clearBtn.classList.add('hidden');
  const cat = document.querySelector('#filtros .cat-btn.active')?.dataset.cat || 'todos';
  renderProductos(cat);
  input?.focus();
}


function buildCard(p) {
  const resolvedSubcat = resolveProductSubcat(p);
  const inCart = cart.find(i => i.id === p.id);
  const badgeCls = p.etiquetaColor && BADGE_CLASSES[p.etiquetaColor] ? BADGE_CLASSES[p.etiquetaColor] : '';
  const fallback = 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80';
  return `
    <div class="product-card border border-white/6 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-2 hover:border-red-500/35 hover:shadow-2xl hover:shadow-red-950/50">

      <!-- Imagen -->
      <div class="product-img-wrap relative flex-shrink-0">
        <img src="${p.imagen || fallback}"
             alt="${p.nombre}" loading="lazy"
             class="product-img"
             onerror="this.src='${fallback}'" />
        <!-- Badge etiqueta -->
        ${p.etiqueta && badgeCls
      ? `<span class="absolute top-3 left-3 ${badgeCls} text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide shadow-lg">${p.etiqueta}</span>`
      : ''}
        <!-- Subcategoría / categoría badge top-right -->
        ${(resolvedSubcat && SUBCAT_LABELS[resolvedSubcat])
      ? `<span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">${SUBCAT_LABELS[resolvedSubcat]}</span>`
      : `<span class="absolute top-3 right-3 bg-slate-900/75 backdrop-blur-sm text-slate-300 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">${CAT_LABELS[p.categoria] || p.categoria}</span>`
    }
        <!-- Gradient overlay bottom para fusión suave -->
        <div class="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0d1a2e]/80 to-transparent pointer-events-none"></div>
      </div>

      <!-- Info -->
      <div class="p-4 flex flex-col flex-1 gap-3">
        <div class="flex-1">
          <!-- Breadcrumb categoría > subcategoría -->
          <p class="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
            ${CAT_LABELS[p.categoria] || p.categoria}
            ${(resolvedSubcat && SUBCAT_LABELS[resolvedSubcat]) ? `<i class="fa-solid fa-chevron-right text-[8px]"></i>${SUBCAT_LABELS[resolvedSubcat]}` : ''}
          </p>
          <h3 class="font-bold text-white text-sm leading-snug line-clamp-2 mb-1">${p.nombre}</h3>
          ${p.descripcion ? `<p class="text-slate-500 text-xs line-clamp-1">${p.descripcion}</p>` : ''}
        </div>

        <div class="flex items-end justify-between gap-2 pt-2 border-t border-white/5">
          <div>
            <p class="text-[10px] text-slate-600 uppercase tracking-wider font-bold leading-none mb-0.5">Precio</p>
            <span class="font-display text-2xl font-black leading-none gradient-text">${formatPeso(p.precio)}</span>
          </div>
          ${inCart
      ? `<div class="flex items-center gap-1.5 bg-slate-900/60 rounded-xl px-1 py-1 border border-white/5">
                 <button onclick="changeQty(${p.id},-1)" class="w-7 h-7 rounded-lg bg-slate-700 hover:bg-red-600 text-white text-base font-black flex items-center justify-center transition-all active:scale-90 leading-none">−</button>
                 <span class="w-7 text-center font-black text-white text-sm">${inCart.qty}</span>
                 <button onclick="changeQty(${p.id},1)"  class="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 text-white text-base font-black flex items-center justify-center transition-all active:scale-90 leading-none">+</button>
               </div>`
      : ''}
        </div>

        ${!inCart
      ? `<button onclick="addToCart(${p.id})" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-95 text-white text-sm font-black py-2.5 rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-red-900/40">
               <i class="fa-solid fa-cart-plus"></i>Agregar al carrito
             </button>`
      : `<button onclick="addToCart(${p.id})" class="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-white text-xs font-semibold py-2 rounded-xl transition-all border border-white/6 hover:border-red-500/30">
               <i class="fa-solid fa-plus text-[10px]"></i>Agregar otro
             </button>`
    }
      </div>
    </div>
  `;
}

function buildSubfiltrosBtns(subWrap, subs, renderFn, getCat) {
  if (!subWrap) return;
  if (!subs || subs.length === 0) {
    subWrap.classList.add('hidden');
    subWrap.classList.remove('flex', 'sub-filters-grid');
    subWrap.innerHTML = '';
    return;
  }
  // Construir botones dinámicamente con label
  let html = '<span class="sub-filters-label">Tipos disponibles:</span>';
  html += '<button class="sub-cat-btn active" data-sub="todos">Todos</button>';
  subs.forEach(s => {
    html += `<button class="sub-cat-btn" data-sub="${s}">${SUBCAT_LABELS[s] || s}</button>`;
  });
  subWrap.innerHTML = html;
  subWrap.classList.remove('hidden');
  subWrap.classList.add('sub-filters-grid');
  // Asignar listeners a los nuevos botones
  subWrap.querySelectorAll('.sub-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      subWrap.querySelectorAll('.sub-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFn(getCat(), btn.dataset.sub);
    });
  });
}

function initFiltros() {
  const btns = document.querySelectorAll('#filtros .cat-btn');
  const subWrap = document.getElementById('sub-filtros');
  let currentCat = 'todos';

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      activeSubcat = 'todos';
      const subs = getAvailableSubfiltros(currentCat);
      buildSubfiltrosBtns(subWrap, subs, renderProductos, () => currentCat);
      renderProductos(currentCat);
    });
  });

  // Inicialmente sin subfiltros
  if (subWrap) {
    subWrap.classList.add('hidden');
    subWrap.classList.remove('flex');
    subWrap.innerHTML = '';
  }
}

// ─── ADMIN ACCESS ──────────────────────────────────────────────────────
let _clickCount = 0;
let _clickTimer = null;

function initAdminAccess() {
  document.getElementById('footer-copy')?.addEventListener('click', () => {
    _clickCount++;
    clearTimeout(_clickTimer);
    _clickTimer = setTimeout(() => { _clickCount = 0; }, 600);
    if (_clickCount >= 3) { _clickCount = 0; openAdmin(); }
  });
  if (window.location.hash === '#admin') openAdmin();
}

function openAdmin() {
  const overlay = document.getElementById('admin-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  lockBodyScroll();
  const session = sessionStorage.getItem('blj_admin_session');
  if (session === 'true') {
    showAdminPanel();
  } else {
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
    setTimeout(() => document.getElementById('admin-pwd-input')?.focus(), 200);
  }
}

function closeAdmin() {
  document.getElementById('admin-overlay')?.classList.add('hidden');
  document.getElementById('admin-overlay')?.classList.remove('flex');
  unlockBodyScroll();
}

function loginAdmin() {
  const pwd = document.getElementById('admin-pwd-input')?.value;
  const errEl = document.getElementById('admin-login-error');
  if (pwd === CONFIG.adminPassword) {
    sessionStorage.setItem('blj_admin_session', 'true');
    errEl.classList.add('hidden');
    showAdminPanel();
  } else {
    errEl.classList.remove('hidden');
    errEl.classList.add('flex');
    document.getElementById('admin-pwd-input').value = '';
    document.getElementById('admin-pwd-input')?.focus();
  }
}

function showAdminPanel() {
  document.getElementById('admin-login').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');
  // Indicador estado Supabase
  const sbEl = document.getElementById('sb-status');
  if (sbEl) {
    if (isSupabaseReady()) {
      sbEl.className = 'flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-green-900/40 border-green-500/30 text-green-400';
      sbEl.innerHTML = '<i class="fa-solid fa-database"></i> Supabase conectado';
    } else {
      sbEl.className = 'flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-amber-900/40 border-amber-500/30 text-amber-400';
      sbEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Modo local (sin Supabase)';
    }
    sbEl.classList.remove('hidden');
  }
  updateAdminStats();
  renderAdminProducts('todos');
  initAdminFiltros();
  loadPedidosAdmin();
  switchAdminTab('dashboard');
}

function switchAdminTab(tab) {
  ['dashboard', 'gestion', 'pedidos', 'sugerencias'].forEach(t => {
    const el = document.getElementById(`admin-tab-${t}`);
    if (el) el.classList.toggle('hidden', t !== tab);
  });
  document.querySelectorAll('.admin-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  if (tab === 'pedidos') loadPedidosAdmin();
  if (tab === 'sugerencias') loadSugerencias();
  if (tab === 'dashboard') loadDashboard();
}

function getLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem(LS_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalOrders(orders) {
  localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(orders));
}

function getStatusMeta(status) {
  if (status === ORDER_STATUS.accepted) {
    return {
      label: 'Aceptado',
      badgeClass: 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300',
      dotClass: 'bg-emerald-400',
    };
  }
  if (status === ORDER_STATUS.rejected) {
    return {
      label: 'Rechazado',
      badgeClass: 'bg-red-500/20 border border-red-500/30 text-red-300',
      dotClass: 'bg-red-400',
    };
  }
  return {
    label: 'Pendiente',
    badgeClass: 'bg-amber-500/20 border border-amber-500/30 text-amber-200',
    dotClass: 'bg-amber-300',
  };
}

function mergeOrdersByRef(primary, secondary) {
  const map = new Map();
  [...secondary, ...primary].forEach(order => {
    if (!order || !order.pedido_ref) return;
    const prev = map.get(order.pedido_ref);
    if (!prev) {
      map.set(order.pedido_ref, order);
      return;
    }
    const prevAt = Date.parse(prev.updated_at || prev.created_at || 0) || 0;
    const currAt = Date.parse(order.updated_at || order.created_at || 0) || 0;
    map.set(order.pedido_ref, currAt >= prevAt ? order : prev);
  });
  return [...map.values()].sort((a, b) => {
    const aAt = Date.parse(a.created_at || 0) || 0;
    const bAt = Date.parse(b.created_at || 0) || 0;
    return bAt - aAt;
  });
}

function parseHistory(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function fetchOrdersFromItemsTable() {
  if (!isSupabaseReady()) return { ok: false, orders: [] };
  try {
    const { data, error } = await _sbClient
      .from('pedidos_items')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw error;

    const groups = new Map();
    (data || []).forEach(row => {
      const ref = String(row.pedido_ref || '');
      if (!ref) return;
      if (!groups.has(ref)) {
        groups.set(ref, {
          pedido_ref: ref,
          estado: row.estado || ORDER_STATUS.pending,
          cliente_nombre: row.cliente_nombre || '',
          cliente_telefono: row.cliente_telefono || '',
          direccion: row.direccion || '',
          depto: row.depto || '',
          comuna: row.comuna || '',
          referencia: row.referencia || '',
          notas: row.notas || '',
          subtotal: Number(row.subtotal) || 0,
          delivery_fee: Number(row.delivery_fee) || 0,
          total: Number(row.total) || 0,
          items: [],
          status_historial: parseHistory(row.status_historial),
          comprobante_declarado: row.comprobante_declarado === true,
          created_at: row.created_at || null,
          updated_at: row.updated_at || row.created_at || null,
        });
      }

      const order = groups.get(ref);
      if (!order.cliente_nombre && row.cliente_nombre) order.cliente_nombre = row.cliente_nombre;
      if (!order.cliente_telefono && row.cliente_telefono) order.cliente_telefono = row.cliente_telefono;
      if (!order.direccion && row.direccion) order.direccion = row.direccion;
      if (!order.depto && row.depto) order.depto = row.depto;
      if (!order.comuna && row.comuna) order.comuna = row.comuna;
      if (!order.referencia && row.referencia) order.referencia = row.referencia;
      if (!order.notas && row.notas) order.notas = row.notas;
      if (row.estado) order.estado = row.estado;
      if (Number(row.delivery_fee) > 0) order.delivery_fee = Number(row.delivery_fee);
      if (Array.isArray(parseHistory(row.status_historial)) && parseHistory(row.status_historial).length > 0) {
        order.status_historial = parseHistory(row.status_historial);
      }

      const qty = Number(row.qty) || 0;
      const precio = Number(row.precio) || 0;
      order.items.push({
        id: row.producto_id || null,
        nombre: row.producto_nombre || 'Producto',
        categoria: row.categoria || null,
        precio,
        qty,
      });
      order.subtotal += precio * qty;
      if (!order.total || order.total <= 0) {
        order.total = order.subtotal + (Number(order.delivery_fee) || 0);
      }

      const rowTime = Date.parse(row.created_at || 0) || 0;
      const currTime = Date.parse(order.created_at || 0) || 0;
      if (!currTime || (rowTime && rowTime < currTime)) {
        order.created_at = row.created_at || order.created_at;
      }
    });

    const orders = [...groups.values()].sort((a, b) => {
      const aAt = Date.parse(a.created_at || 0) || 0;
      const bAt = Date.parse(b.created_at || 0) || 0;
      return bAt - aAt;
    });
    return { ok: true, orders };
  } catch (err) {
    console.warn('No fue posible leer pedidos desde pedidos_items en Supabase:', err?.message || err);
    return { ok: false, orders: [] };
  }
}

async function fetchOrders() {
  const localOrders = getLocalOrders();
  if (!isSupabaseReady()) return localOrders;

  const { ok, orders } = await fetchOrdersFromItemsTable();
  if (!ok) return localOrders;

  // Supabase is the source of truth when reachable; keep local cache aligned.
  saveLocalOrders(orders);
  return orders;
}

async function saveOrderItemsToSupabase(order) {
  if (!isSupabaseReady()) return true;
  const ref = String(order.pedido_ref);
  const linesDetailed = (order.items || []).map(i => ({
    pedido_ref: ref,
    producto_id: i.id || null,
    producto_nombre: i.nombre,
    categoria: i.categoria || null,
    precio: Number(i.precio) || 0,
    qty: Number(i.qty) || 0,
    cliente_nombre: order.cliente_nombre || null,
    cliente_telefono: order.cliente_telefono || null,
    direccion: order.direccion || null,
    depto: order.depto || null,
    comuna: order.comuna || null,
    referencia: order.referencia || null,
    notas: order.notas || null,
    comprobante_declarado: order.comprobante_declarado === true,
    subtotal: Number(order.subtotal) || 0,
    delivery_fee: Number(order.delivery_fee) || 0,
    total: Number(order.total) || 0,
    estado: order.estado || ORDER_STATUS.pending,
    status_historial: order.status_historial || [],
    updated_at: order.updated_at || order.created_at || new Date().toISOString(),
  }));
  const linesBasic = (order.items || []).map(i => ({
    pedido_ref: ref,
    producto_id: i.id || null,
    producto_nombre: i.nombre,
    categoria: i.categoria || null,
    precio: Number(i.precio) || 0,
    qty: Number(i.qty) || 0,
  }));
  if (!linesDetailed.length) return true;

  try {
    const { data: existing, error: existingErr } = await _sbClient
      .from('pedidos_items')
      .select('pedido_ref')
      .eq('pedido_ref', ref)
      .limit(1);
    if (existingErr) throw existingErr;
    if (!existing || existing.length === 0) {
      const { error: insDetailedErr } = await _sbClient.from('pedidos_items').insert(linesDetailed);
      if (insDetailedErr) {
        const { error: insBasicErr } = await _sbClient.from('pedidos_items').insert(linesBasic);
        if (insBasicErr) throw insBasicErr;
      }
    }
    return true;
  } catch (err) {
    console.warn('No fue posible guardar pedido en pedidos_items de Supabase:', err?.message || err);
    return false;
  }
}

async function guardarPedido(payload) {
  const now = new Date().toISOString();
  const baseHistory = [{
    estado: ORDER_STATUS.pending,
    fecha: now,
    actor: 'cliente',
    nota: 'Pedido enviado por WhatsApp',
  }];

  const order = {
    ...payload,
    estado: payload.estado || ORDER_STATUS.pending,
    created_at: now,
    updated_at: now,
    status_historial: payload.status_historial || baseHistory,
  };

  const localOrders = getLocalOrders();
  localOrders.unshift(order);
  saveLocalOrders(localOrders);
  return saveOrderItemsToSupabase(order);
}

async function loadDashboard() {
  const container = document.getElementById('admin-dashboard');
  if (!container) return;
  container.innerHTML = '<p class="text-slate-500 text-sm text-center py-6">Cargando...</p>';
  let items = [];
  if (isSupabaseReady()) {
    const { data } = await _sbClient.from('pedidos_items').select('*');
    items = data || [];
  } else {
    items = JSON.parse(localStorage.getItem('blj_pedidos_items') || '[]');
  }
  if (!items.length) {
    container.innerHTML = '<p class="text-slate-500 text-sm text-center py-6">Sin pedidos confirmados aún</p>';
    return;
  }
  // Agrupar por nombre de producto
  const agg = {};
  items.forEach(i => {
    if (!agg[i.producto_nombre]) agg[i.producto_nombre] = { nombre: i.producto_nombre, categoria: i.categoria, qty: 0, revenue: 0 };
    agg[i.producto_nombre].qty     += Number(i.qty) || 0;
    agg[i.producto_nombre].revenue += (Number(i.precio) || 0) * (Number(i.qty) || 0);
  });
  const top = Object.values(agg).sort((a, b) => b.qty - a.qty).slice(0, 10);
  const maxQty = top[0]?.qty || 1;
  const catColors = { cervezas:'text-sky-400', destilados:'text-purple-400', vinos:'text-rose-400',
    espumantes:'text-pink-400', cocteles:'text-orange-400', licores:'text-amber-400',
    bebidas:'text-teal-400', snacks:'text-lime-400', promos:'text-yellow-400' };
  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      ${top.map((p, idx) => `
        <div class="flex items-center gap-3 bg-slate-800/70 border border-white/5 rounded-xl px-4 py-3">
          <span class="text-slate-500 font-bold text-sm w-5 shrink-0 text-center">${idx + 1}</span>
          <div class="flex-1 min-w-0">
            <p class="text-white text-sm font-semibold truncate">${escHtml(p.nombre)}</p>
            <div class="flex items-center gap-2 mt-1.5">
              <div class="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-red-500 rounded-full transition-all" style="width:${Math.round(p.qty / maxQty * 100)}%"></div>
              </div>
              <span class="text-slate-500 text-[10px] ${catColors[p.categoria] || 'text-slate-400'}">${CAT_LABELS[p.categoria] || p.categoria || ''}</span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-white font-black text-sm">${p.qty} <span class="text-slate-500 font-normal text-xs">ud.</span></div>
            <div class="text-slate-400 text-xs">${formatPeso(p.revenue)}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <p class="text-slate-600 text-xs text-right mt-2">Basado en ${items.length} líneas de ${new Set(items.map(i=>i.pedido_ref)).size} pedido(s) confirmado(s)</p>
  `;
}

let _pedidosFilter = 'todos';
let _pedidosView = 'detalle';

function setPedidosFilter(filter) {
  _pedidosFilter = filter;
  document.querySelectorAll('#pedidos-filtros .admin-cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.estado === filter);
  });
  loadPedidosAdmin();
}

function setPedidosView(view) {
  _pedidosView = view === 'lista' ? 'lista' : 'detalle';
  document.getElementById('pedidos-view-detalle')?.classList.toggle('active', _pedidosView === 'detalle');
  document.getElementById('pedidos-view-lista')?.classList.toggle('active', _pedidosView === 'lista');
  loadPedidosAdmin();
}

function formatOrderDate(value) {
  if (!value) return '-';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return '-';
  return dt.toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
}

async function updatePedidoEstado(pedidoRef, nuevoEstado, nota = '') {
  const all = await fetchOrders();
  const target = all.find(o => String(o.pedido_ref) === String(pedidoRef));
  if (!target) {
    showToast('No se encontró el pedido en historial', 'error');
    return;
  }
  if (target.estado === nuevoEstado) {
    showToast('Este pedido ya tiene ese estado', 'info');
    return;
  }

  const now = new Date().toISOString();
  const history = Array.isArray(target.status_historial) ? [...target.status_historial] : [];
  history.push({
    estado: nuevoEstado,
    fecha: now,
    actor: 'admin',
    nota: nota || (nuevoEstado === ORDER_STATUS.accepted ? 'Pedido aceptado desde panel admin' : 'Pedido rechazado desde panel admin'),
  });

  const updatedOrder = {
    ...target,
    estado: nuevoEstado,
    status_historial: history,
    updated_at: now,
  };

  if (isSupabaseReady()) {
    try {
      await _sbClient
        .from('pedidos_items')
        .update({
          estado: updatedOrder.estado,
          status_historial: updatedOrder.status_historial,
          updated_at: updatedOrder.updated_at,
        })
        .eq('pedido_ref', String(pedidoRef));
    } catch (err) {
      console.warn('No se pudo actualizar estado en pedidos_items:', err?.message || err);
    }
  }

  const local = getLocalOrders();
  const idx = local.findIndex(o => String(o.pedido_ref) === String(pedidoRef));
  if (idx >= 0) local[idx] = updatedOrder;
  else local.unshift(updatedOrder);
  saveLocalOrders(local);

  await loadPedidosAdmin();
  await loadDashboard();
  showToast(`<i class="fa-solid fa-check mr-1.5"></i> Pedido #${pedidoRef} marcado como ${nuevoEstado}`, 'success');
}

function aceptarPedido(pedidoRef) {
  updatePedidoEstado(String(pedidoRef), ORDER_STATUS.accepted);
}

function rechazarPedido(pedidoRef) {
  const motivo = prompt('Opcional: escribe el motivo del rechazo para historial interno', '') || '';
  updatePedidoEstado(String(pedidoRef), ORDER_STATUS.rejected, motivo.trim());
}

async function modificarPedido(pedidoRef) {
  const ref = String(pedidoRef);
  const all = await fetchOrders();
  const target = all.find(o => String(o.pedido_ref) === ref);

  if (!target) {
    showToast('No se encontró el pedido en historial', 'error');
    return;
  }

  const nombre = prompt('Nombre del cliente', target.cliente_nombre || '');
  if (nombre === null) return;
  const telefono = prompt('Teléfono', target.cliente_telefono || '');
  if (telefono === null) return;
  const direccion = prompt('Dirección', target.direccion || '');
  if (direccion === null) return;
  const depto = prompt('Depto/Casa (opcional)', target.depto || '');
  if (depto === null) return;
  const comuna = prompt('Comuna', target.comuna || '');
  if (comuna === null) return;
  const referencia = prompt('Referencia (opcional)', target.referencia || '');
  if (referencia === null) return;
  const notas = prompt('Notas del pedido (opcional)', target.notas || '');
  if (notas === null) return;

  const now = new Date().toISOString();
  const history = Array.isArray(target.status_historial) ? [...target.status_historial] : [];
  history.push({
    estado: target.estado || ORDER_STATUS.pending,
    fecha: now,
    actor: 'admin',
    nota: 'Pedido modificado desde panel admin',
  });

  const updatedOrder = {
    ...target,
    cliente_nombre: nombre.trim(),
    cliente_telefono: telefono.trim(),
    direccion: direccion.trim(),
    depto: depto.trim(),
    comuna: comuna.trim(),
    referencia: referencia.trim(),
    notas: notas.trim(),
    status_historial: history,
    updated_at: now,
  };

  if (isSupabaseReady()) {
    try {
      await _sbClient
        .from('pedidos_items')
        .update({
          cliente_nombre: updatedOrder.cliente_nombre,
          cliente_telefono: updatedOrder.cliente_telefono,
          direccion: updatedOrder.direccion,
          depto: updatedOrder.depto,
          comuna: updatedOrder.comuna,
          referencia: updatedOrder.referencia,
          notas: updatedOrder.notas,
          status_historial: updatedOrder.status_historial,
          updated_at: updatedOrder.updated_at,
        })
        .eq('pedido_ref', ref);
    } catch (err) {
      console.warn('No se pudo actualizar metadata del pedido en pedidos_items:', err?.message || err);
    }
  }

  const local = getLocalOrders();
  const idx = local.findIndex(o => String(o.pedido_ref) === ref);
  if (idx >= 0) local[idx] = updatedOrder;
  else local.unshift(updatedOrder);
  saveLocalOrders(local);

  await loadPedidosAdmin();
  await loadDashboard();
  showToast(`<i class="fa-solid fa-pen-to-square mr-1.5"></i> Pedido #${ref} modificado`, 'success');
}

async function eliminarPedidoAceptado(pedidoRef) {
  const ref = String(pedidoRef);
  const all = await fetchOrders();
  const target = all.find(o => String(o.pedido_ref) === ref);

  if (!target) {
    showToast('No se encontró el pedido en historial', 'error');
    return;
  }

  if (target.estado !== ORDER_STATUS.accepted) {
    showToast('Solo se pueden eliminar pedidos aceptados', 'warning');
    return;
  }

  const ok = confirm(`¿Eliminar pedido #${ref}? Esta acción quitará también sus productos confirmados del dashboard.`);
  if (!ok) return;

  let supabaseDeleteOk = true;

  if (isSupabaseReady()) {
    try {
      const { error: pedidosItemsError } = await _sbClient.from('pedidos_items').delete().eq('pedido_ref', ref);
      if (pedidosItemsError) throw pedidosItemsError;
    } catch (err) {
      console.warn('No se pudo eliminar pedido en Supabase:', err?.message || err);
      supabaseDeleteOk = false;
    }
  }

  const local = getLocalOrders().filter(o => String(o.pedido_ref) !== ref);
  saveLocalOrders(local);

  const localItems = JSON.parse(localStorage.getItem('blj_pedidos_items') || '[]')
    .filter(i => String(i.pedido_ref) !== ref);
  localStorage.setItem('blj_pedidos_items', JSON.stringify(localItems));

  await loadPedidosAdmin();
  await loadDashboard();

  if (supabaseDeleteOk) {
    showToast(`<i class="fa-solid fa-trash mr-1.5"></i> Pedido #${ref} eliminado`, 'success');
  } else {
    showToast(`<i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Pedido #${ref} eliminado localmente. Error en Supabase.`, 'warning');
  }
}

async function loadPedidosAdmin() {
  const container = document.getElementById('admin-pedidos');
  const badge = document.getElementById('ped-badge');
  if (!container) return;

  container.innerHTML = '<p class="text-slate-500 text-sm text-center py-6">Cargando pedidos...</p>';

  let pedidos = await fetchOrders();
  const pendingCount = pedidos.filter(p => p.estado === ORDER_STATUS.pending).length;
  if (badge) {
    if (pendingCount > 0) {
      badge.textContent = String(pendingCount);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (_pedidosFilter !== 'todos') {
    pedidos = pedidos.filter(p => p.estado === _pedidosFilter);
  }

  if (!pedidos.length) {
    container.innerHTML = '<p class="text-slate-500 text-sm text-center py-6">No hay pedidos para este filtro</p>';
    return;
  }

  if (_pedidosView === 'lista') {
    container.innerHTML = `
      <div class="bg-slate-900/45 border border-white/5 rounded-2xl overflow-hidden">
        ${pedidos.map((order, idx) => {
          const st = getStatusMeta(order.estado);
          const items = Array.isArray(order.items) ? order.items : [];
          const itemsCount = items.reduce((acc, i) => acc + (Number(i.qty) || 0), 0);
          const total = formatPeso(order.total || 0);
          return `
            <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 last:border-b-0">
              <div class="min-w-0">
                <p class="text-white text-sm font-bold truncate">Pedido ${idx + 1} · #${escHtml(order.pedido_ref)}</p>
                <p class="text-slate-500 text-xs truncate">${escHtml(order.cliente_nombre || 'Sin nombre')} · ${itemsCount} item(s) · ${total}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full ${st.badgeClass}">
                  <span class="w-1.5 h-1.5 rounded-full ${st.dotClass}"></span>${st.label}
                </span>
                ${order.estado === ORDER_STATUS.pending
                  ? `<button onclick="aceptarPedido('${escHtml(order.pedido_ref)}')" class="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg">Aceptar</button>
                     <button onclick="rechazarPedido('${escHtml(order.pedido_ref)}')" class="bg-red-700/70 hover:bg-red-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg">Rechazar</button>
                     <button onclick="modificarPedido('${escHtml(order.pedido_ref)}')" class="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg">Modificar</button>`
                  : order.estado === ORDER_STATUS.accepted
                    ? `<button onclick="modificarPedido('${escHtml(order.pedido_ref)}')" class="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg">Modificar</button>
                       <button onclick="eliminarPedidoAceptado('${escHtml(order.pedido_ref)}')" class="bg-red-900/70 hover:bg-red-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg">Eliminar</button>`
                    : `<button onclick="modificarPedido('${escHtml(order.pedido_ref)}')" class="bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg">Modificar</button>`}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    return;
  }

  container.innerHTML = pedidos.map(order => {
    const st = getStatusMeta(order.estado);
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsCount = items.reduce((acc, i) => acc + (Number(i.qty) || 0), 0);
    const lastEvents = (Array.isArray(order.status_historial) ? order.status_historial : []).slice(-4).reverse();
    return `
      <div class="bg-slate-800/70 border border-white/5 rounded-2xl p-4">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p class="text-white font-black text-base">Pedido #${escHtml(order.pedido_ref)}</p>
            <p class="text-slate-500 text-xs mt-0.5">${formatOrderDate(order.created_at)}</p>
          </div>
          <span class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${st.badgeClass}">
            <span class="w-1.5 h-1.5 rounded-full ${st.dotClass}"></span>${st.label}
          </span>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-3 text-xs">
          <div class="bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2">
            <p class="text-slate-500">Cliente</p>
            <p class="text-slate-200 font-semibold mt-0.5">${escHtml(order.cliente_nombre || '-')}</p>
          </div>
          <div class="bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2">
            <p class="text-slate-500">Teléfono</p>
            <p class="text-slate-200 font-semibold mt-0.5">${escHtml(order.cliente_telefono || '-')}</p>
          </div>
          <div class="bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2">
            <p class="text-slate-500">Items</p>
            <p class="text-slate-200 font-semibold mt-0.5">${itemsCount} unidad(es)</p>
          </div>
          <div class="bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2">
            <p class="text-slate-500">Total</p>
            <p class="text-red-400 font-black mt-0.5">${formatPeso(order.total || 0)}</p>
          </div>
        </div>

        <div class="mt-3 bg-slate-900/60 border border-white/5 rounded-xl p-3">
          <p class="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-2">Dirección</p>
          <p class="text-slate-200 text-sm">${escHtml([order.direccion, order.depto, order.comuna].filter(Boolean).join(', ') || '-')}</p>
          ${order.referencia ? `<p class="text-slate-500 text-xs mt-1">Referencia: ${escHtml(order.referencia)}</p>` : ''}
        </div>

        <div class="mt-3 bg-slate-900/60 border border-white/5 rounded-xl p-3">
          <p class="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-2">Productos</p>
          <div class="space-y-1.5">
            ${items.map(i => `
              <div class="flex items-center justify-between text-xs gap-3">
                <span class="text-slate-300">${escHtml(i.nombre)} x${Number(i.qty) || 0}</span>
                <span class="text-white font-semibold">${formatPeso((Number(i.precio) || 0) * (Number(i.qty) || 0))}</span>
              </div>
            `).join('') || '<p class="text-slate-500 text-xs">Sin detalle de productos</p>'}
          </div>
        </div>

        <div class="mt-3 bg-slate-900/40 border border-white/5 rounded-xl p-3">
          <p class="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-2">Historial de estado</p>
          <div class="space-y-1.5">
            ${lastEvents.map(ev => `
              <div class="text-xs text-slate-300">
                <span class="text-slate-500">${formatOrderDate(ev.fecha)}</span>
                <span class="mx-1">·</span>
                <span class="font-semibold">${escHtml(ev.estado || '-')}</span>
                ${ev.nota ? `<span class="text-slate-500"> (${escHtml(ev.nota)})</span>` : ''}
              </div>
            `).join('') || '<p class="text-slate-500 text-xs">Sin historial</p>'}
          </div>
        </div>

        ${order.estado === ORDER_STATUS.pending ? `
          <div class="flex gap-2 mt-3">
            <button onclick="aceptarPedido('${escHtml(order.pedido_ref)}')" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black py-2.5 rounded-xl transition-colors">
              <i class="fa-solid fa-check mr-1.5"></i>Aceptar
            </button>
            <button onclick="rechazarPedido('${escHtml(order.pedido_ref)}')" class="flex-1 bg-red-700/70 hover:bg-red-600 text-white text-sm font-black py-2.5 rounded-xl transition-colors">
              <i class="fa-solid fa-xmark mr-1.5"></i>Rechazar
            </button>
            <button onclick="modificarPedido('${escHtml(order.pedido_ref)}')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm font-black py-2.5 rounded-xl transition-colors">
              <i class="fa-solid fa-pen-to-square mr-1.5"></i>Modificar
            </button>
          </div>
        ` : order.estado === ORDER_STATUS.accepted ? `
          <div class="flex gap-2 mt-3">
            <button onclick="modificarPedido('${escHtml(order.pedido_ref)}')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm font-black py-2.5 rounded-xl transition-colors">
              <i class="fa-solid fa-pen-to-square mr-1.5"></i>Modificar
            </button>
            <button onclick="eliminarPedidoAceptado('${escHtml(order.pedido_ref)}')" class="flex-1 bg-red-900/70 hover:bg-red-700 text-white text-sm font-black py-2.5 rounded-xl transition-colors">
              <i class="fa-solid fa-trash mr-1.5"></i>Eliminar pedido
            </button>
          </div>
        ` : `
          <div class="flex gap-2 mt-3">
            <button onclick="modificarPedido('${escHtml(order.pedido_ref)}')" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm font-black py-2.5 rounded-xl transition-colors">
              <i class="fa-solid fa-pen-to-square mr-1.5"></i>Modificar
            </button>
          </div>
        `}
      </div>
    `;
  }).join('');
}

// ─── SUGERENCIAS ─────────────────────────────────────────────────────────────
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sendSugerencia() {
  const input = document.getElementById('sugerencia-input');
  const okEl  = document.getElementById('sugerencia-ok');
  const msg = input.value.trim();
  if (!msg) return;

  // Siempre guardar en localStorage (nunca se pierde)
  const list = JSON.parse(localStorage.getItem('blj_sugerencias') || '[]');
  const entry = { mensaje: msg, created_at: new Date().toISOString() };
  list.unshift(entry);
  localStorage.setItem('blj_sugerencias', JSON.stringify(list));

  // Además intentar guardar en Supabase (cross-device)
  if (isSupabaseReady()) {
    _sbClient.from('sugerencias').insert({ mensaje: msg }).then(() => {});
  }

  input.value = '';
  okEl.classList.remove('hidden');
  setTimeout(() => okEl.classList.add('hidden'), 3000);
}

async function loadSugerencias() {
  const container = document.getElementById('admin-sugerencias');
  const badge     = document.getElementById('sug-badge');
  if (!container) return;

  // Siempre leer localStorage primero
  let localItems = JSON.parse(localStorage.getItem('blj_sugerencias') || '[]');
  let items = localItems;

  // Si Supabase disponible intentar obtener de ahí
  if (isSupabaseReady()) {
    try {
      const { data, error } = await _sbClient.from('sugerencias')
        .select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        items = data;
        // Sincronizar localStorage con lo que tiene Supabase
        localStorage.setItem('blj_sugerencias', JSON.stringify(data));
      }
    } catch (_) { /* usar localStorage */ }
  }
  if (badge) {
    if (items.length) { badge.textContent = items.length; badge.classList.remove('hidden'); }
    else { badge.classList.add('hidden'); }
  }
  if (!items.length) {
    container.innerHTML = '<p class="text-slate-500 text-sm text-center py-6">Sin mensajes aún</p>';
    return;
  }
  container.innerHTML = items.map(i => `
    <div class="bg-slate-800/70 border border-white/5 rounded-xl px-4 py-3">
      <p class="text-white text-sm">${escHtml(i.mensaje)}</p>
      <p class="text-slate-500 text-xs mt-1">${new Date(i.created_at).toLocaleString('es-CL')}</p>
    </div>
  `).join('');
}

function updateAdminStats() {
  const prods = getProductos();
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-total',      prods.length);
  set('stat-cervezas',   prods.filter(p => p.categoria === 'cervezas').length);
  set('stat-destilados', prods.filter(p => p.categoria === 'destilados').length);
  set('stat-vinos',      prods.filter(p => p.categoria === 'vinos').length);
  set('stat-espumantes', prods.filter(p => p.categoria === 'espumantes').length);
  set('stat-cocteles',   prods.filter(p => p.categoria === 'cocteles').length);
  set('stat-licores',    prods.filter(p => p.categoria === 'licores').length);
  set('stat-bebidas',    prods.filter(p => p.categoria === 'bebidas').length);
  set('stat-snacks',     prods.filter(p => p.categoria === 'snacks').length);
  set('stat-promos',     prods.filter(p => p.categoria === 'promos').length);
}

let adminViewMode = 'grid'; // 'grid' | 'list'
let _currentAdminFiltro = 'todos';

function setAdminView(mode) {
  adminViewMode = mode;
  document.getElementById('view-grid-btn')?.classList.toggle('active', mode === 'grid');
  document.getElementById('view-list-btn')?.classList.toggle('active', mode === 'list');
  const grid = document.getElementById('admin-products-grid');
  if (grid) {
    if (mode === 'grid') {
      grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
    } else {
      grid.className = 'flex flex-col gap-2';
    }
  }
  renderAdminProducts(_currentAdminFiltro);
}

let activeAdminSubcat = 'todos';

const KNOWN_CATS = Object.keys(CAT_LABELS);

function renderAdminProducts(filtro = 'todos', subcat = null) {
  _currentAdminFiltro = filtro;
  if (subcat !== null) activeAdminSubcat = subcat;
  const grid = document.getElementById('admin-products-grid');
  if (!grid) return;
  let prods = getProductos().filter(p => {
    if (filtro === 'todos') return true;
    if (filtro === 'sin-categoria') {
      const missingCat = !p.categoria || !KNOWN_CATS.includes(p.categoria);
      const needsSub = !missingCat && (CAT_SUBFILTROS[p.categoria] || []).length > 0;
      const resolvedSubcat = resolveProductSubcat(p);
      const missingSub = needsSub && (!resolvedSubcat || !(CAT_SUBFILTROS[p.categoria] || []).includes(resolvedSubcat));
      return missingCat || missingSub;
    }
    return p.categoria === filtro;
  });
  // Applica subfiltro genérico para cualquier categoría con subcategorías
  if (filtro !== 'todos' && activeAdminSubcat !== 'todos' && (CAT_SUBFILTROS[filtro] || []).length > 0) {
    prods = prods.filter(p => resolveProductSubcat(p) === activeAdminSubcat);
  }

  // Ordenar
  const sort = document.getElementById('admin-sort')?.value || 'default';
  if (sort === 'az')         prods = [...prods].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else if (sort === 'za')   prods = [...prods].sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
  else if (sort === 'price-asc')  prods = [...prods].sort((a, b) => a.precio - b.precio);
  else if (sort === 'price-desc') prods = [...prods].sort((a, b) => b.precio - a.precio);

  if (!prods.length) {
    grid.innerHTML = '<p class="col-span-full text-slate-500 text-center py-10">No hay productos en esta categoría.</p>';
    return;
  }

  if (adminViewMode === 'list') {
    grid.innerHTML = prods.map(p => {
      const catLabel = CAT_LABELS[p.categoria] || p.categoria;
      const resolvedSubcat = resolveProductSubcat(p);
      const subcatLabel = resolvedSubcat && SUBCAT_LABELS[resolvedSubcat] ? SUBCAT_LABELS[resolvedSubcat] : null;
      return `
      <div class="admin-list-row">
        <img class="alr-img" src="${p.imagen || ''}" alt="${escHtml(p.nombre)}" loading="lazy" onerror="this.style.opacity='.2'" />
        <div class="flex-1 min-w-0">
          <p class="alr-name truncate">${escHtml(p.nombre)}</p>
          <p class="alr-cat mt-0.5">${catLabel}${subcatLabel ? ' · ' + subcatLabel : ''}</p>
        </div>
        ${p.etiqueta ? `<span class="alr-badge hidden sm:inline">${escHtml(p.etiqueta)}</span>` : ''}
        ${!p.disponible ? `<span class="alr-unavail hidden sm:inline">No disponible</span>` : ''}
        <span class="alr-price">${formatPeso(p.precio)}</span>
        <div class="flex gap-2 shrink-0">
          <button onclick="openProductForm(${p.id})" title="Editar"
            class="bg-sky-600/20 hover:bg-sky-600/40 text-sky-400 border border-sky-500/20 text-xs font-bold px-3 py-2 rounded-lg transition-all">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button onclick="openDeleteModal(${p.id})" title="Eliminar"
            class="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/20 text-xs font-bold px-3 py-2 rounded-lg transition-all">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>`;
    }).join('');
    return;
  }

  grid.innerHTML = prods.map(p => {
    const catLabel = CAT_LABELS[p.categoria] || p.categoria;
    const resolvedSubcat = resolveProductSubcat(p);
    const subcatLabel = resolvedSubcat && SUBCAT_LABELS[resolvedSubcat]
      ? SUBCAT_LABELS[resolvedSubcat] : null;
    return `
    <div class="bg-slate-800 border border-white/5 rounded-2xl overflow-hidden flex flex-col ${!p.disponible ? 'opacity-50' : ''} hover:border-red-500/20 transition-colors">
      <div class="relative h-32 bg-gradient-to-b from-slate-700 to-slate-800 flex items-center justify-center p-3">
        <img src="${p.imagen || ''}" alt="${p.nombre}" loading="lazy"
             class="max-h-full max-w-full object-contain drop-shadow-lg"
             onerror="this.style.display='none'" />
        ${!p.disponible ? `<div class="absolute inset-0 bg-slate-900/70 flex items-center justify-center"><span class="bg-red-900/80 text-red-300 text-xs px-3 py-1 rounded-full font-bold">No disponible</span></div>` : ''}
      </div>
      <div class="p-4 flex-1 flex flex-col gap-2">
        <p class="font-bold text-white text-sm line-clamp-2 leading-tight">${p.nombre}</p>
        <!-- Categoría + Subcategoría -->
        <div class="flex flex-wrap gap-1.5">
          <span class="border border-slate-600 bg-slate-700/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">${catLabel}</span>
          ${subcatLabel ? `<span class="border border-red-500/30 bg-red-900/20 text-red-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">${subcatLabel}</span>` : ''}
        </div>
        <div class="flex items-center justify-between gap-2 mt-auto">
          <span class="text-red-400 font-black text-base">${formatPeso(p.precio)}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="openProductForm(${p.id})" class="flex-1 bg-sky-600/20 hover:bg-sky-600/40 text-sky-400 border border-sky-500/20 text-xs font-bold py-2 rounded-lg transition-all">
            <i class="fa-solid fa-pen mr-1"></i>Editar
          </button>
          <button onclick="openDeleteModal(${p.id})" class="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/20 text-xs font-bold py-2 rounded-lg transition-all">
            <i class="fa-solid fa-trash-can mr-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

function initAdminFiltros() {
  const btns = document.querySelectorAll('#admin-filtros .admin-cat-btn');
  const subWrap = document.getElementById('admin-sub-filtros');
  let currentAdminCat = 'todos';

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAdminCat = btn.dataset.cat;
      activeAdminSubcat = 'todos';
      const subs = CAT_SUBFILTROS[currentAdminCat] || [];
      if (!subWrap) { renderAdminProducts(currentAdminCat); return; }
      if (subs.length === 0) {
        subWrap.classList.add('hidden');
        subWrap.classList.remove('flex');
        subWrap.innerHTML = '';
      } else {
        let html = '<span class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mr-1"><i class="fa-solid fa-filter mr-1"></i>Tipo:</span>';
        html += '<button class="admin-sub-btn active" data-sub="todos">Todos</button>';
        subs.forEach(s => {
          html += `<button class="admin-sub-btn" data-sub="${s}">${SUBCAT_LABELS[s] || s}</button>`;
        });
        subWrap.innerHTML = html;
        subWrap.classList.remove('hidden');
        subWrap.classList.add('flex');
        subWrap.querySelectorAll('.admin-sub-btn').forEach(sb => {
          sb.addEventListener('click', () => {
            subWrap.querySelectorAll('.admin-sub-btn').forEach(b => b.classList.remove('active'));
            sb.classList.add('active');
            renderAdminProducts(currentAdminCat, sb.dataset.sub);
          });
        });
      }
      renderAdminProducts(currentAdminCat);
    });
  });

  // Ocultar subfiltros al inicio
  if (subWrap) {
    subWrap.classList.add('hidden');
    subWrap.classList.remove('flex');
    subWrap.innerHTML = '';
  }
}

// ─── PRODUCT FORM ─────────────────────────────────────────────────────
/*
  La superposición (#pf-overlay) NO tiene onclick para cerrar.
  Solo se puede cerrar con el botón X o Cancelar (ambos llaman a closePFConfirm).
  Si hay cambios sin guardar se muestra una confirmación nativa.
*/

let _pfOriginal = null; // snapshot de valores al abrir el form

/* Muestra u oculta el selector de subcategoría según la categoría elegida */
function toggleSubcatField() {
  const cat = document.getElementById('pf-categoria')?.value;
  const wrap = document.getElementById('pf-subcat-wrap');
  const sel = document.getElementById('pf-subcategoria');
  if (!wrap) return;
  const hasSubs = cat && (CAT_SUBFILTROS[cat] || []).length > 0;
  if (hasSubs) {
    wrap.classList.remove('hidden');
    // Actualizar opciones del select según la categoría
    if (sel) {
      const subs = CAT_SUBFILTROS[cat] || [];
      const current = sel.value;
      sel.innerHTML = '<option value="">Selecciona tipo</option>' +
        subs.map(s => `<option value="${s}"${current === s ? ' selected' : ''}>${SUBCAT_LABELS[s] || s}</option>`).join('');
    }
  } else {
    wrap.classList.add('hidden');
    if (sel) sel.value = '';
  }
}

function openProductForm(id) {
  const overlay = document.getElementById('pf-overlay');
  const title = document.getElementById('pf-title');
  const errBox = document.getElementById('pf-error');
  errBox?.classList.add('hidden');

  if (id) {
    const p = getProductos().find(x => x.id === Number(id));
    if (!p) return;
    title.textContent = 'Editar Producto';
    document.getElementById('pf-id').value = p.id;
    document.getElementById('pf-nombre').value = p.nombre;
    document.getElementById('pf-categoria').value = p.categoria;
    document.getElementById('pf-precio').value = formatPeso(p.precio);
    document.getElementById('pf-descripcion').value = p.descripcion || '';
    document.getElementById('pf-imagen').value = p.imagen || '';
    document.getElementById('pf-etiqueta').value = p.etiqueta || '';
    document.getElementById('pf-etiquetacolor').value = p.etiquetaColor || '';
    document.getElementById('pf-disponible').checked = p.disponible !== false;
    // Primero generamos las opciones del select de subcategoría...
    toggleSubcatField();
    // ...y luego asignamos el valor (las opciones ya existen)
    const subcatSel = document.getElementById('pf-subcategoria');
    if (subcatSel) subcatSel.value = resolveProductSubcat(p) || '';
  } else {
    title.textContent = 'Agregar Producto';
    document.getElementById('pf-id').value = '';
    document.getElementById('pf-nombre').value = '';
    document.getElementById('pf-categoria').value = '';
    document.getElementById('pf-precio').value = '';
    document.getElementById('pf-descripcion').value = '';
    document.getElementById('pf-imagen').value = '';
    document.getElementById('pf-etiqueta').value = '';
    document.getElementById('pf-etiquetacolor').value = '';
    document.getElementById('pf-disponible').checked = true;
    document.getElementById('pf-subcategoria').value = '';
  }

  // Mostrar u ocultar subcategoría según la categoría cargada
  // (solo para el caso nuevo; en edición ya se llamó arriba)
  if (!id) toggleSubcatField();

  // Guardar snapshot de valores originales para detectar cambios
  _pfOriginal = getPFValues();

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.getElementById('pf-nombre')?.focus();
}

function getPFValues() {
  return {
    nombre: document.getElementById('pf-nombre')?.value,
    categoria: document.getElementById('pf-categoria')?.value,
    subcategoria: document.getElementById('pf-subcategoria')?.value,
    precio: document.getElementById('pf-precio')?.value,
    descripcion: document.getElementById('pf-descripcion')?.value,
    imagen: document.getElementById('pf-imagen')?.value,
    etiqueta: document.getElementById('pf-etiqueta')?.value,
    etiquetaColor: document.getElementById('pf-etiquetacolor')?.value,
    disponible: document.getElementById('pf-disponible')?.checked,
  };
}

function pfHasChanges() {
  if (!_pfOriginal) return false;
  const current = getPFValues();
  return JSON.stringify(current) !== JSON.stringify(_pfOriginal);
}

function closePFConfirm() {
  if (pfHasChanges()) {
    if (!confirm('¿Descartar los cambios?\n\nTienes cambios sin guardar. Si cierras ahora se perderán.')) {
      return; // El usuario eligió continuar editando
    }
  }
  closePF();
}

function closePF() {
  const overlay = document.getElementById('pf-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  _pfOriginal = null;
}

async function saveProduct() {
  const id = document.getElementById('pf-id')?.value;
  const nombre = document.getElementById('pf-nombre')?.value.trim();
  const categoria = document.getElementById('pf-categoria')?.value;
  const subcategoria = document.getElementById('pf-subcategoria')?.value || '';
  const precioRaw = document.getElementById('pf-precio')?.value;
  const precio = parsePrecio(precioRaw);
  const descripcion = document.getElementById('pf-descripcion')?.value.trim();
  const imagen = document.getElementById('pf-imagen')?.value.trim();
  const etiqueta = document.getElementById('pf-etiqueta')?.value.trim();
  const etiquetaColor = document.getElementById('pf-etiquetacolor')?.value;
  const disponible = document.getElementById('pf-disponible')?.checked;

  const errBox = document.getElementById('pf-error');
  const errMsg = document.getElementById('pf-error-msg');

  function showE(msg) {
    errMsg.textContent = msg;
    errBox.classList.remove('hidden');
    errBox.classList.add('flex');
    errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (!nombre) return showE('El nombre del producto es obligatorio.');
  if (!categoria) return showE('Selecciona una categoría.');
  if (categoria === 'cervezas' && !subcategoria) return showE('Selecciona el tipo de cerveza (subcategoría).');
  if (!precio || precio < 1) return showE('Ingresa un precio válido (ej: $1.490).');
  errBox.classList.add('hidden');
  errBox.classList.remove('flex');

  // Deshabilitar botón mientras guarda
  const saveBtn = document.querySelector('#pf-modal button[onclick="saveProduct()"]');
  if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Guardando...'; }

  const isNew = !id;
  const prod = {
    id: id ? Number(id) : null,
    nombre, categoria, subcategoria, precio, descripcion, imagen, etiqueta, etiquetaColor, disponible,
  };

  const ok = await saveProductToDB(prod, isNew);
  if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-1"></i> Guardar Producto'; }

  if (!ok) { showE('Error al guardar. Revisa la consola.'); return; }
  closePF();
  updateAdminStats();
  renderAdminProducts(document.querySelector('#admin-filtros .admin-cat-btn.active')?.dataset.cat || 'todos');
  renderProductos(document.querySelector('#filtros .cat-btn.active')?.dataset.cat || 'todos');
  updateCartUI();
  showToast(`<i class="fa-solid fa-floppy-disk mr-1.5"></i> Producto ${isNew ? 'creado' : 'actualizado'} correctamente`, 'success');
}

// ─── DELETE ────────────────────────────────────────────────────────────
let _pendingDeleteId = null;

function openDeleteModal(id) {
  const prod = getProductos().find(p => p.id === Number(id));
  if (!prod) return;
  _pendingDeleteId = id;
  document.getElementById('delete-product-name').textContent = `"${prod.nombre}" — esta acción no se puede deshacer.`;
  const overlay = document.getElementById('delete-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
}

function closeDeleteModal() {
  _pendingDeleteId = null;
  const overlay = document.getElementById('delete-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
}

async function confirmDelete() {
  if (!_pendingDeleteId) return;
  const id = Number(_pendingDeleteId);
  const btn = document.querySelector('#delete-overlay button[onclick="confirmDelete()"]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Eliminando...'; }
  const ok = await deleteProductFromDB(id);
  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-trash-can mr-1.5"></i>Eliminar'; }
  if (!ok) { showToast('Error al eliminar. Revisa la consola.', 'error'); return; }
  closeDeleteModal();
  updateAdminStats();
  renderAdminProducts(document.querySelector('#admin-filtros .admin-cat-btn.active')?.dataset.cat || 'todos');
  renderProductos(document.querySelector('#filtros .cat-btn.active')?.dataset.cat || 'todos');
  updateCartUI();
  showToast('<i class="fa-solid fa-trash-can mr-1.5"></i> Producto eliminado', 'warning');
}

async function resetProducts() {
  if (!confirm('¿Restaurar todos los productos originales?\n\nEsto borrará cualquier cambio o producto personalizado.')) return;
  if (isSupabaseReady()) {
    showToast('<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Restaurando en Supabase...', 'info');
    await _sbClient.from('productos').delete().neq('id', -1);
    const rows = PRODUCTOS_BASE.map(p => ({
      id: p.id, nombre: p.nombre, categoria: p.categoria,
      subcategoria: p.subcategoria || null, precio: p.precio,
      descripcion: p.descripcion || null, imagen: p.imagen || null,
      etiqueta: p.etiqueta || null, etiqueta_color: p.etiquetaColor || null,
      disponible: p.disponible !== false,
    }));
    const { error } = await _sbClient.from('productos').insert(rows);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
  } else {
    localStorage.removeItem(LS_PRODUCTS_KEY);
  }
  _productosCache = JSON.parse(JSON.stringify(PRODUCTOS_BASE));
  updateAdminStats();
  renderAdminProducts('todos');
  renderProductos('todos');
  updateCartUI();
  showToast('<i class="fa-solid fa-rotate-left mr-1.5"></i> Productos restaurados a los valores originales', 'success');
}

// ─── TOAST ────────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const colors = {
    success: 'bg-green-900/90 border-green-500/40 text-green-300',
    error: 'bg-red-900/90 border-red-500/40 text-red-300',
    warning: 'bg-amber-900/90 border-amber-500/40 text-amber-300',
    info: 'bg-sky-900/90 border-sky-500/40 text-sky-300',
  };
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto ${colors[type] || colors.info} border backdrop-blur-md shadow-xl rounded-xl px-4 py-3 max-w-xs text-sm font-semibold flex items-center gap-2 translate-y-2 opacity-0 transition-all duration-300`;
  toast.innerHTML = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.classList.remove('translate-y-2', 'opacity-0'); });
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ─── ESC KEY ──────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  // Checkout and cart close on ESC; pf-modal requires explicit action
  if (!document.getElementById('checkout-overlay')?.classList.contains('hidden')) return closeCheckout();
  if (!document.getElementById('cart-drawer')?.classList.contains('translate-x-full')) return closeCart();
  if (!document.getElementById('delete-overlay')?.classList.contains('hidden')) return closeDeleteModal();
  // For pf-overlay, ESC triggers the confirm-before-close flow
  if (!document.getElementById('pf-overlay')?.classList.contains('hidden')) return closePFConfirm();
});

// ─── INIT ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Age gate
  if (sessionStorage.getItem('blj_age') === '1') {
    const m = document.getElementById('age-modal');
    if (m) m.remove();
  }

  // Navbar scroll glass
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const current = window.scrollY;
    if (current > 60) {
      nav.classList.add('navbar-scrolled');
    } else {
      nav.classList.remove('navbar-scrolled');
    }
    lastScroll = current;
  });

  // Inicializar Supabase y cargar productos
  initSupabase();
  await loadProductosFromDB();

  checkOpenStatus();
  setWaLinks();
  updateCartUI();
  renderProductos();
  initFiltros();
  initAdminAccess();

  // Logo link smooth scroll
  document.getElementById('logo-link')?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Hero stat
  const heroStat = document.getElementById('hero-stat-products');
  if (heroStat) heroStat.textContent = '+' + getProductos().filter(p => p.disponible).length;
});
