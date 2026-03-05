# 🗄️ Guía de Configuración Supabase – Botillería Lector Jean

Sigue estos pasos **una sola vez** para conectar tu sitio a Supabase.  
Después de esto, **todos los cambios de productos se guardan en la nube** y ningún `git push` los borrará.

---

## Paso 1 – Crear cuenta y proyecto en Supabase

1. Ve a **[supabase.com](https://supabase.com)** → *Start your project* → regístrate gratis
2. Clic en **New project**
3. Ponle un nombre, ej: `botilleria-lector-jean`
4. Elige una región (São Paulo es la más cercana a Chile)
5. Define una contraseña de base de datos → guárdala
6. Clic en **Create new project** y espera ~1 minuto

---

## Paso 2 – Crear la tabla de productos

1. En tu proyecto Supabase, ve al menú lateral → **SQL Editor**
2. Clic en **New query**
3. Copia y pega el contenido completo del archivo `supabase-setup.sql` (está en tu carpeta del proyecto)
4. Clic en **Run** ▶️
5. Deberías ver: `Success. No rows returned`

---

## Paso 3 – Obtener tus claves de API

1. En el menú lateral → **Project Settings** → **API**
2. Copia los dos valores que necesitas:

| Valor | Dónde encontrarlo |
|---|---|
| **Project URL** | Sección "Project URL", empieza con `https://...supabase.co` |
| **anon public key** | Sección "Project API keys" → `anon` `public` |

---

## Paso 4 – Pegar las claves en el código

Abre `script.js` y busca estas líneas cerca del inicio (líneas ~22-23):

```javascript
const SUPABASE_URL      = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Reemplázalas con tus valores reales:

```javascript
const SUPABASE_URL      = 'https://xxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...';
```

---

## Paso 5 – Hacer git push

```bash
git add .
git commit -m "feat: integración Supabase"
git push
```

Netlify desplegará automáticamente con los nuevos valores.

---

## Paso 6 – Primera vez: migrar tus datos existentes (opcional)

Si ya editaste productos en el Panel Admin (están guardados en el navegador), puedes migrarlos a Supabase:

1. Ve a `https://lectorjean.netlify.app/#admin`
2. Ingresa tu contraseña
3. Clic en el botón **☁️ Migrar a Supabase**
4. Confirma → tus productos se subirán a la nube

> Si no tienes cambios previos, no pasa nada: los productos base se cargarán automáticamente desde el código la primera vez.

---

## ✅ ¿Cómo sé que funcionó?

En el **Panel Admin**, junto al título "Gestión de Productos" verás:

- 🟢 **Supabase conectado** → Todo OK, los cambios se guardan en la nube
- 🟡 **Modo local (sin Supabase)** → Las claves no están configuradas aún

---

## ❓ Preguntas frecuentes

**¿Es gratis?**  
Sí. El plan Free de Supabase incluye 500MB de base de datos y 50.000 requests/mes, más que suficiente para una botillería.

**¿Qué pasa si pierdo internet?**  
La aplicación no cargará productos sin conexión. Si quieres soporte offline, avísame y lo implementamos.

**¿Es seguro poner la `anon key` en el código?**  
La `anon key` es pública por diseño — solo puede hacer lo que las políticas RLS permiten. El código ya tiene las políticas configuradas. Para mayor seguridad en el futuro, puedes agregar autenticación Supabase.
