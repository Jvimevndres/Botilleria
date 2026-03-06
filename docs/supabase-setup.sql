-- ============================================================
-- Botillería Lector Jean – Supabase Setup SQL
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Crear tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id            BIGSERIAL PRIMARY KEY,
  nombre        TEXT        NOT NULL,
  categoria     TEXT        NOT NULL,
  subcategoria  TEXT,
  precio        INTEGER     NOT NULL DEFAULT 0,
  descripcion   TEXT,
  imagen        TEXT,
  etiqueta      TEXT,
  etiqueta_color TEXT,
  disponible    BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Índices útiles
CREATE INDEX IF NOT EXISTS idx_productos_categoria   ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_disponible  ON productos(disponible);

-- 3. Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_productos_updated_at ON productos;
CREATE TRIGGER trg_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. Row Level Security (RLS)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública (catálogo visible a todos)
DROP POLICY IF EXISTS "Lectura pública de productos" ON productos;
CREATE POLICY "Lectura pública de productos"
  ON productos FOR SELECT
  USING (true);

-- Política: escritura con anon key (admin desde el navegador)
-- ⚠️ Esto permite que cualquiera con la anon key pueda escribir.
-- Para mayor seguridad, usa autenticación Supabase y restringe aquí.
DROP POLICY IF EXISTS "Escritura con anon key" ON productos;
CREATE POLICY "Escritura con anon key"
  ON productos FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- ✅ ¡Listo! La tabla está creada.
-- Ahora ve al código y reemplaza las claves en script.js.
-- Los productos base se cargarán automáticamente la primera vez.
-- ============================================================
