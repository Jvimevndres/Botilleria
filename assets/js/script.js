/**
 * Botillería Lector Jean – script.js
 * Carrito · Checkout · WhatsApp · Admin CRUD · Supabase + LocalStorage fallback
 */

// ─── CONFIG ───────────────────────────────────────────────────────────
const CONFIG = {
  whatsappNumber: '56900000000',
  adminPassword: 'admin2026',
  deliveryFee: 1500,
  minOrder: 5000,
  storeName: 'Botillería Lector Jean',
  transferencia: {
    banco: 'Banco Estado',
    tipo: 'Cuenta RUT',
    numero: '12.345.678-9',
    rut: '12.345.678-9',
    titular: 'Jean Pérez López',
    email: 'lectorjean@gmail.com',
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
  // Destilados
  'pisco': 'Pisco',
  'ron': 'Ron',
  'vodka': 'Vodka',
  'whisky': 'Whisky',
  'gin': 'Gin',
  'tequila': 'Tequila',
  // Vinos
  'tintos': 'Tintos',
  'blancos': 'Blancos',
  'rose': 'Rosé / Dulces',
  'caja': 'En Caja',
  // Espumantes
  'brut': 'Brut / Extra Brut',
  'demi-sec': 'Demi Sec',
  'moscato': 'Moscato',
  // Cócteles RTD
  'sour': 'Sour',
  'frutas': 'Cócteles de Fruta',
  'spritz': 'Spritz y Aperitivos',
  // Licores
  'cremas': 'Cremas',
  'hierbas': 'Hierbas y Amargos',
  'dulces': 'Licores Dulces',
  // Bebidas
  'gaseosas': 'Gaseosas',
  'energetica': 'Energéticas',
  'jugos': 'Jugos',
  'aguas': 'Aguas y Tónicas',
  // Snacks
  'hielo': 'Hielo',
  'snacks-salados': 'Snacks Salados',
  'extras': 'Extras',
};

// ─── MAPA CATEGORÍA → SUBCATEGORÍAS DISPONIBLES ───────────────────────
const CAT_SUBFILTROS = {
  cervezas: ['latones', 'latas-sueltas', 'pack-latas', 'botellines', 'botellas'],
  destilados: ['pisco', 'ron', 'vodka', 'whisky', 'gin', 'tequila'],
  vinos: ['tintos', 'blancos', 'rose', 'caja'],
  espumantes: ['brut', 'demi-sec', 'moscato'],
  cocteles: ['sour', 'frutas', 'spritz'],
  licores: ['cremas', 'hierbas', 'dulces'],
  bebidas: ['gaseosas', 'energetica', 'jugos', 'aguas'],
  snacks: ['hielo', 'snacks-salados', 'extras'],
  promos: [],
};

// ─── NOMBRES LEGIBLES DE CATEGORÍA (para badges y UI) ────────────────
const CAT_LABELS = {
  cervezas: 'Cerveza',
  destilados: 'Destilado',
  vinos: 'Vino',
  espumantes: 'Espumante',
  cocteles: 'Cóctel RTD',
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

  // VINOS
  { id: 25, nombre: 'Casillero del Diablo Cabernet 750ml', categoria: 'vinos', precio: 5990, descripcion: 'Concha y Toro · Tinto· D.O. Valle Central', imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80', etiqueta: 'Popular', etiquetaColor: 'red', disponible: true },
  { id: 26, nombre: 'Santa Helena Siglo de Oro 750ml', categoria: 'vinos', precio: 3490, descripcion: 'Tinto suave · Fácil de beber', imagen: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 27, nombre: 'Gato Negro Blanco 750ml', categoria: 'vinos', precio: 3290, descripcion: 'Sauvignon Blanc refrescante', imagen: 'https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 28, nombre: 'Frontera Rosé 1.5L', categoria: 'vinos', precio: 5990, descripcion: 'Rosado fresco y afrutado', imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80', etiqueta: 'Promo', etiquetaColor: 'green', disponible: true },
  { id: 29, nombre: 'Cono Sur 20 Barrels Merlot', categoria: 'vinos', precio: 7490, descripcion: 'Tinto premium · Valle de Colchagua', imagen: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=400&q=80', etiqueta: 'Premium', etiquetaColor: 'blue', disponible: true },

  // HIELO & SNACKS
  { id: 30, nombre: 'Hielo Bolsa 3kg', categoria: 'hielo', precio: 1990, descripcion: 'Hielo fabricado · Ideal para cócteles', imagen: 'https://images.unsplash.com/photo-1548504769-900b70ed122e?auto=format&fit=crop&w=400&q=80', etiqueta: 'Esencial', etiquetaColor: 'blue', disponible: true },
  { id: 31, nombre: 'Hielo Bolsa 6kg', categoria: 'hielo', precio: 3490, descripcion: 'Formato grande para fiestas', imagen: 'https://images.unsplash.com/photo-1581393293369-ec7deaec8f3b?auto=format&fit=crop&w=400&q=80', etiqueta: 'Pack', etiquetaColor: 'green', disponible: true },
  { id: 32, nombre: 'Snack Mix Salado 100g', categoria: 'hielo', precio: 990, descripcion: 'Papas, churritos y maní · Mix perfecto', imagen: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
  { id: 33, nombre: 'Jugo DayFresh 1L', categoria: 'hielo', precio: 1290, descripcion: 'Naranja o piña · Mezcla tus trago', imagen: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80', etiqueta: '', etiquetaColor: '', disponible: true },
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
let cart = [];

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
  const now = new Date();
  const day = now.getDay();   // 0=Sun,1=Mon…6=Sat
  const hour = now.getHours();
  const min = now.getMinutes();
  const t = hour * 60 + min;

  let open = false;
  if (day >= 1 && day <= 4) open = t >= 720 && t < 1500;       // Mon-Thu 12-01
  else if (day === 5 || day === 6) open = t >= 720 && t < 1620; // Fri-Sat 12-03
  else if (day === 0) open = t >= 780 && t < 1440;              // Sun 13-24

  const s = document.getElementById('status-badge');
  const c = document.getElementById('closed-badge');
  const f = document.getElementById('footer-status');
  if (open) {
    s?.classList.remove('hidden'); s?.classList.add('flex');
    c?.classList.remove('flex'); c?.classList.add('hidden');
    if (f) f.innerHTML = '<span class="text-green-400"><i class="fa-solid fa-circle mr-1"></i>Estamos abiertos ahora</span>';
  } else {
    c?.classList.remove('hidden'); c?.classList.add('flex');
    s?.classList.remove('flex'); s?.classList.add('hidden');
    if (f) f.innerHTML = '<span class="text-red-400"><i class="fa-solid fa-circle mr-1"></i>Actualmente cerrados</span>';
  }
}

// ─── WHATSAPP LINKS ───────────────────────────────────────────────────
function setWaLinks() {
  const msg = `Hola! Quiero hacer un pedido en ${CONFIG.storeName}.`;
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  document.querySelectorAll('#wa-nav-btn, #wa-float, #footer-wa-cta').forEach(el => el.setAttribute('href', url));
}

// ─── CART ─────────────────────────────────────────────────────────────
function addToCart(id) {
  const prod = getProductos().find(p => p.id === Number(id));
  if (!prod) return;
  const existing = cart.find(i => i.id === prod.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 1 });
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
  if (tot) tot.textContent = formatPeso(total + CONFIG.deliveryFee);

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
    document.body.classList.remove('overflow-hidden');
  } else {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.add('translate-x-full');
  document.getElementById('cart-overlay')?.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
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
  buildCheckoutSummary();
  buildTransferBox();
  const overlay = document.getElementById('checkout-overlay');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

function closeCheckout() {
  const overlay = document.getElementById('checkout-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
  document.getElementById('checkout-error')?.classList.add('hidden');
}

function closeCheckoutOutside(e) {
  if (e.target === document.getElementById('checkout-overlay')) closeCheckout();
}

function buildCheckoutSummary() {
  const box = document.getElementById('checkout-summary');
  if (!box) return;
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
      <span>Subtotal</span><span>${formatPeso(cartTotal())}</span>
    </div>
    <div class="flex justify-between px-4 py-3 text-xs text-slate-500">
      <span>Delivery</span><span class="text-red-400">+ ${formatPeso(CONFIG.deliveryFee)}</span>
    </div>
  `;
  const tot = document.getElementById('checkout-total-display');
  if (tot) tot.textContent = formatPeso(cartTotal() + CONFIG.deliveryFee);
}

function buildTransferBox() {
  const box = document.getElementById('transfer-info-box');
  if (!box) return;
  const t = CONFIG.transferencia;
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
      <span class="text-red-400 font-black text-xl">${formatPeso(cartTotal() + CONFIG.deliveryFee)}</span>
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

function enviarPedidoWhatsApp() {
  const nombre = document.getElementById('f-nombre')?.value.trim();
  const telefono = document.getElementById('f-telefono')?.value.trim();
  const direccion = document.getElementById('f-direccion')?.value.trim();
  const depto = document.getElementById('f-depto')?.value.trim();
  const comuna = document.getElementById('f-comuna')?.value.trim();
  const referencia = document.getElementById('f-referencia')?.value.trim();
  const notas = document.getElementById('f-notas')?.value.trim();
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
  if (!direccion) return showErr('Por favor ingresa la dirección de entrega.');
  if (!comuna) return showErr('Por favor ingresa la comuna.');
  errBox.classList.add('hidden');
  errBox.classList.remove('flex');

  const orderNum = getOrderNum();
  const t = CONFIG.transferencia;
  const total = cartTotal() + CONFIG.deliveryFee;

  const lineasProductos = cart.map(item =>
    `  • ${item.nombre} x${item.qty}  →  ${formatPeso(item.precio * item.qty)}`
  ).join('\n');

  const direccionCompleta = [direccion, depto, comuna].filter(Boolean).join(', ');

  const msg = [
    `🍺 *${CONFIG.storeName}*`,
    `📋 *PEDIDO #${orderNum}*`,
    `📅 ${fechaHora()}`,
    `${'─'.repeat(30)}`,
    ``,
    `👤 *DATOS DEL CLIENTE*`,
    `  Nombre: ${nombre}`,
    `  Teléfono: ${telefono}`,
    ``,
    `📦 *PRODUCTOS SOLICITADOS*`,
    lineasProductos,
    ``,
    `  Subtotal:          ${formatPeso(cartTotal())}`,
    `  Delivery:          + ${formatPeso(CONFIG.deliveryFee)}`,
    `  ─────────────────────`,
    `  *TOTAL A PAGAR:    ${formatPeso(total)}*`,
    ``,
    `🏠 *DIRECCIÓN DE ENTREGA*`,
    `  ${direccionCompleta}`,
    referencia ? `  Referencia: ${referencia}` : null,
    ``,
    `💳 *PAGO – TRANSFERENCIA BANCARIA*`,
    `  Banco:    ${t.banco}`,
    `  Tipo:     ${t.tipo}`,
    `  N° Cta:   ${t.numero}`,
    `  RUT:      ${t.rut}`,
    `  Titular:  ${t.titular}`,
    `  Email:    ${t.email}`,
    `  *Monto:   ${formatPeso(total)}*`,
    ``,
    comp ? `📸 *El cliente SOLICITA comprobante de transferencia*` : `ℹ️ Sin solicitud de comprobante`,
    notas ? `\n📝 *Notas del cliente:*\n  ${notas}` : null,
    ``,
    `${'─'.repeat(30)}`,
    `✅ Por favor confirmar recepción del pedido.`,
    `_Enviado desde botillerialectorjean.cl_`,
  ].filter(l => l !== null).join('\n');

  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');

  closeCheckout();
  cart = [];
  updateCartUI();
  showToast('<i class="fa-brands fa-whatsapp mr-1.5"></i> Pedido enviado con éxito por WhatsApp', 'success');
}

// ─── CATALOG RENDER ────────────────────────────────────────────────────
let activeSubcat = 'todos';
let activeBusqueda = '';

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
  const parts = [
    p.nombre,
    p.descripcion || '',
    p.categoria,
    CAT_LABELS[p.categoria] || '',
    p.subcategoria || '',
    SUBCAT_LABELS[p.subcategoria] || '',
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

function renderProductos(filtro = 'todos', subcat = null) {
  if (subcat !== null) activeSubcat = subcat;
  const grid = document.getElementById('products-grid');
  const noRes = document.getElementById('no-results');
  if (!grid) return;
  let prods = getProductos().filter(p => p.disponible && (filtro === 'todos' || p.categoria === filtro));
  // Aplica subfiltro genérico
  if (filtro !== 'todos' && activeSubcat !== 'todos' && (CAT_SUBFILTROS[filtro] || []).length > 0) {
    prods = prods.filter(p => p.subcategoria === activeSubcat);
  }
  // Aplica búsqueda inteligente
  const rawQuery = activeBusqueda.trim();
  if (rawQuery) {
    const words = expandQuery(rawQuery);
    // Intenta AND (todas las palabras). Si no hay resultados, intenta OR (alguna palabra)
    let andResults = prods.filter(p => matchesSearch(p, words));
    if (andResults.length > 0) {
      prods = andResults;
    } else {
      prods = prods.filter(p => words.some(w => buildSearchIndex(p).includes(w)));
    }
  }
  grid.innerHTML = prods.map(p => buildCard(p)).join('');
  if (noRes) noRes.classList.toggle('hidden', prods.length > 0);
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
        ${(p.subcategoria && SUBCAT_LABELS[p.subcategoria])
      ? `<span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-slate-300 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">${SUBCAT_LABELS[p.subcategoria]}</span>`
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
            ${(p.subcategoria && SUBCAT_LABELS[p.subcategoria]) ? `<i class="fa-solid fa-chevron-right text-[8px]"></i>${SUBCAT_LABELS[p.subcategoria]}` : ''}
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
    subWrap.classList.remove('flex');
    subWrap.innerHTML = '';
    return;
  }
  // Construir botones dinámicamente
  let html = '<button class="sub-cat-btn active" data-sub="todos">Todos</button>';
  subs.forEach(s => {
    html += `<button class="sub-cat-btn" data-sub="${s}">${SUBCAT_LABELS[s] || s}</button>`;
  });
  subWrap.innerHTML = html;
  subWrap.classList.remove('hidden');
  subWrap.classList.add('flex');
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
      const subs = CAT_SUBFILTROS[currentCat] || [];
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
  document.body.classList.add('overflow-hidden');
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
  document.body.classList.remove('overflow-hidden');
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
}

function updateAdminStats() {
  const prods = getProductos();
  const sTotal = document.getElementById('stat-total');
  const sCerv = document.getElementById('stat-cervezas');
  const sDest = document.getElementById('stat-destilados');
  const sVinos = document.getElementById('stat-vinos');
  if (sTotal) sTotal.textContent = prods.length;
  if (sCerv) sCerv.textContent = prods.filter(p => p.categoria === 'cervezas').length;
  if (sDest) sDest.textContent = prods.filter(p => p.categoria === 'destilados').length;
  if (sVinos) sVinos.textContent = prods.filter(p => p.categoria === 'vinos').length;
}

let activeAdminSubcat = 'todos';

function renderAdminProducts(filtro = 'todos', subcat = null) {
  if (subcat !== null) activeAdminSubcat = subcat;
  const grid = document.getElementById('admin-products-grid');
  if (!grid) return;
  let prods = getProductos().filter(p => filtro === 'todos' || p.categoria === filtro);
  // Applica subfiltro genérico para cualquier categoría con subcategorías
  if (filtro !== 'todos' && activeAdminSubcat !== 'todos' && (CAT_SUBFILTROS[filtro] || []).length > 0) {
    prods = prods.filter(p => p.subcategoria === activeAdminSubcat);
  }
  if (!prods.length) {
    grid.innerHTML = '<p class="col-span-full text-slate-500 text-center py-10">No hay productos en esta categoría.</p>';
    return;
  }
  grid.innerHTML = prods.map(p => {
    const catLabel = CAT_LABELS[p.categoria] || p.categoria;
    const subcatLabel = p.subcategoria && SUBCAT_LABELS[p.subcategoria]
      ? SUBCAT_LABELS[p.subcategoria] : null;
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
    if (subcatSel) subcatSel.value = p.subcategoria || '';
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
