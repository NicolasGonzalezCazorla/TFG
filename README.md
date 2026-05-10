# Estética Alicia - Sistema de Gestión

Un proyecto full-stack moderno para la gestión integral de un salón de estética. Incluye sistema de reservas de citas, gestión de productos, inventario y perfiles de administrador.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Tecnologías](#tecnologías)
- [API Endpoints](#api-endpoints)
- [Configuración](#configuración)
- [Estructura de Base de Datos](#estructura-de-base-de-datos)
- [Autenticación](#autenticación)
- [Contribución](#contribución)

---

## Características

### Backend (Next.js)
- API REST con autenticación segura
- Gestión de usuarios y perfiles
- Sistema de citas y reservas
- Gestión de productos y servicios
- Control de disponibilidad
- Integración con Supabase
- CORS habilitado para múltiples clientes

### Frontend (React Native con Expo)
- Interfaz responsive para móvil y web
- Autenticación de usuarios
- Sistema de reservas de citas
- Catálogo de productos
- Historial de reservas
- Perfil de usuario
- Tema personalizado (Burgundy, Gold, Cream)
- Panel de administrador
- Gestión de productos (admin)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18+ ([descargar](https://nodejs.org))
- **npm** o **yarn** como gestor de paquetes
- **Git** para control de versiones
- **Expo CLI** (para el frontend móvil)

```bash
npm install -g expo-cli
```

### Variables de Entorno Requeridas

Necesitarás crear archivos `.env.local` en ambas carpetas:

**Backend (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

**Frontend (.env.local):**
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

## Estructura del Proyecto

```
TFG/
├── back/                           # Backend (Next.js)
│   ├── public/                     # Archivos estáticos
│   ├── src/
│   │   └── app/
│   │       ├── api/               # Rutas API
│   │       │   ├── auth/          # Autenticación
│   │       │   │   ├── login/
│   │       │   │   ├── register/
│   │       │   │   ├── refresh/
│   │       │   │   └── me/
│   │       │   ├── citas/         # Gestión de citas
│   │       │   ├── productos/     # Catálogo de productos
│   │       │   ├── reservas/      # Sistema de reservas
│   │       │   └── servicios/     # Servicios disponibles
│   │       ├── layout.js
│   │       ├── page.js
│   │       └── globals.css
│   │   └── lib/
│   │       └── supabase.js        # Configuración Supabase
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package.json
│   └── postcss.config.mjs
│
├── front/                          # Frontend (React Native + Expo)
│   ├── app/                        # Pantallas y rutas
│   │   ├── _layout.tsx            # Layout principal
│   │   ├── index.tsx              # Inicio
│   │   ├── login.tsx              # Login
│   │   ├── registro.tsx           # Registro
│   │   ├── Perfil.tsx             # Perfil de usuario
│   │   ├── productos.tsx          # Catálogo de productos
│   │   ├── servicio.tsx           # Servicios disponibles
│   │   ├── reserva.tsx            # Reserva de citas
│   │   ├── contacto.tsx           # Contacto
│   │   ├── producto/[id].tsx      # Detalle de producto
│   │   ├── experiencia/[id].tsx   # Detalle de experiencia
│   │   └── admin/                 # Panel administrativo
│   │       ├── index.tsx
│   │       └── editar-producto.tsx
│   ├── components/                # Componentes reutilizables
│   │   ├── NavBar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ExperienceCard.tsx
│   │   ├── Button.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   ├── AlertModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.tsx        # Contexto de autenticación
│   ├── hooks/                     # Custom hooks
│   │   ├── use-color-scheme.ts
│   │   └── use-theme-color.ts
│   ├── constants/
│   │   ├── theme.ts               # Colores y estilos
│   │   └── constants.ts
│   ├── assets/
│   │   └── images/
│   │       └── Logo.png
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   └── eslint.config.js
│
└── README.md                       # Este archivo
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd TFG
```

### 2. Instalar dependencias del Backend

```bash
cd back
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../front
npm install
```

### 4. Configurar variables de entorno

Crea archivos `.env.local` en ambas carpetas con las variables necesarias (ver Requisitos Previos).

---

## Ejecución

### Opción 1: Ejecutar en paralelo (recomendado)

**Terminal 1 - Backend:**
```bash
cd back
npm run dev
```
El backend estará disponible en `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd front
npm start
```

### Opción 2: Ejecutar solo el Backend

```bash
cd back
npm run dev
```

### Opción 3: Ejecutar solo el Frontend

```bash
cd front
npm start
```

### Ejecutar en diferentes plataformas (Frontend)

**iOS (requiere macOS):**
```bash
cd front
npm run ios
```

**Android:**
```bash
cd front
npm run android
```

**Web:**
```bash
cd front
npm run web
```

---

## Tecnologías

### Backend
- **Next.js 16** - Framework React para producción
- **Supabase** - Base de datos PostgreSQL + Auth
- **Tailwind CSS** - Utilidades CSS
- **Node.js** - Runtime JavaScript

### Frontend
- **React Native 0.81** - Framework multiplataforma
- **Expo 54** - Plataforma para React Native
- **TypeScript 5.9** - Tipado estático
- **Expo Router 6** - Enrutamiento basado en archivos
- **React Navigation 7** - Navegación nativa
- **Axios** - Cliente HTTP

### Base de Datos
- **PostgreSQL** (via Supabase)
- **Supabase Auth** - Autenticación

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/refresh` | Refrescar token |
| GET | `/api/auth/me` | Obtener usuario actual |

### Citas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/citas` | Listar citas del usuario |
| POST | `/api/citas` | Crear nueva cita |
| POST | `/api/citas/cancelar` | Cancelar cita |
| GET | `/api/citas/disponibilidad` | Obtener horarios disponibles |

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| POST | `/api/productos` | Crear nuevo producto (admin) |
| GET | `/api/productos/:id` | Obtener detalles del producto |
| PUT | `/api/productos/:id` | Actualizar producto (admin) |
| DELETE | `/api/productos/:id` | Eliminar producto (admin) |

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reservas` | Listar reservas del usuario |
| POST | `/api/reservas` | Crear nueva reserva |
| POST | `/api/reservas/cancelar` | Cancelar reserva |

### Servicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/servicios` | Listar todos los servicios |
| POST | `/api/servicios` | Crear nuevo servicio (admin) |

---

## Configuración

### Variables de Tema (Frontend)

El archivo `front/constants/theme.ts` contiene la paleta de colores:

```typescript
export const COLORS = {
  BURGUNDY: '#63202C',  // Color principal
  GOLD: '#C6A75E',      // Color secundario
  CREAM: '#F5F0E8',     // Fondo
  BORDER: '#C4B89A',    // Bordes
};
```

### Configuración de Supabase

El archivo `back/src/lib/supabase.js` contiene la inicialización:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

---

## Estructura de Base de Datos

### Tabla: `usuarios`
```sql
- id (UUID, PK)
- email (VARCHAR)
- nombre (VARCHAR)
- apellidos (VARCHAR)
- rol (VARCHAR) - 'user' | 'admin'
- fecha_creacion (TIMESTAMP)
```

### Tabla: `citas`
```sql
- id (UUID, PK)
- usuario_id (UUID, FK)
- servicio_id (UUID, FK)
- fecha (DATE)
- hora (TIME)
- estado (VARCHAR) - 'pendiente' | 'confirmada' | 'cancelada'
```

### Tabla: `reservas`
```sql
- id (UUID, PK)
- usuario_id (UUID, FK)
- producto_id (UUID, FK)
- dia_recogida (DATE)
- hora_recogida (TIME)
- estado (VARCHAR) - 'pendiente' | 'recogida' | 'cancelada'
```

### Tabla: `productos`
```sql
- id (UUID, PK)
- nombre (VARCHAR)
- descripcion (TEXT)
- precio (DECIMAL)
- imagen_url (VARCHAR)
- stock (INTEGER)
```

### Tabla: `servicios`
```sql
- id (UUID, PK)
- nombre (VARCHAR)
- descripcion (TEXT)
- precio (DECIMAL)
- duracion (INTEGER)
```

---

## Autenticación

### Flujo de Login

1. Usuario ingresa email y contraseña
2. Backend valida credenciales en Supabase
3. Se retorna token JWT y datos del usuario
4. Frontend almacena token en AsyncStorage
5. Todas las peticiones posteriores incluyen el token en headers

### Flujo de Registro

1. Usuario completa formulario de registro
2. Backend crea usuario en Supabase Auth
3. Se crea perfil en tabla `usuarios`
4. Email de confirmación se envía a usuario
5. Usuario puede iniciar sesión

### Token Refresh

- Tokens expiran cada 1 hora
- Endpoint `/api/auth/refresh` renueva el token
- Frontend maneja automáticamente la renovación

---

## Scripts Disponibles

### Backend

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm start        # Ejecutar servidor compilado
```

### Frontend

```bash
npm start              # Iniciar Expo
npm run android        # Ejecutar en Android
npm run ios            # Ejecutar en iOS
npm run web            # Ejecutar en web
npm run lint           # Ejecutar linter
npm run reset-project  # Resetear proyecto a estado inicial
```

---

## Troubleshooting

### El frontend no se conecta al backend

- Verifica que el backend está corriendo en `http://localhost:3000`
- Revisa la variable `EXPO_PUBLIC_API_URL` en el frontend
- Asegúrate que CORS está habilitado en el backend

### Error de autenticación

- Verifica que las variables de Supabase son correctas
- Comprueba que el token no ha expirado
- Intenta cerrar sesión y volver a iniciar

### Errores en expo start

- Ejecuta `npm install` nuevamente
- Borra `node_modules` y `package-lock.json`
- Ejecuta `npm install` de nuevo

---

## Contacto y Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

**Información de la Empresa:**
- Estética Alicia
- Email: contacto@esteticaalicia.com
- Teléfono: +34 XXX XXX XXX

---

## Licencia

Este proyecto es privado y está desarrollado como Trabajo de Fin de Grado.

---

## Equipo de Desarrollo

Desarrollado por el equipo de Estética Alicia

---

## Roadmap Futuro

- [ ] Integración con sistema de pagos
- [ ] Notificaciones push
- [ ] Sistema de valoraciones y comentarios
- [ ] Historial completo de transacciones
- [ ] Reportes y estadísticas (admin)
- [ ] Multi-idioma
- [ ] Modo oscuro

---

**Última actualización:** Mayo 2026
