# UN Intercambio - Frontend

Una aplicación React con TypeScript desarrollada con Vite para el sistema de intercambios universitarios de la Universidad Nacional de Colombia.

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos

Asegúrate de tener instalado:

- **Node.js** versión 18 o superior
- **npm** (incluido con Node.js)

### Instalación y ejecución

1. **Clona el repositorio** (si aún no lo has hecho):

   ```bash
   git clone <url-del-repositorio>
   cd Frontend
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:

   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   # API Endpoints
   VITE_AUTH_BASE_URL=https://unxchange-auth-backend-9208adf2339d.herokuapp.com
   VITE_CONVOCATORIAS_BASE_URL=http://127.0.0.1:8000
   VITE_CONVENIOS_BASE_URL=https://unxchange-auth-backend-9208adf2339d.herokuapp.com

   # API Specific Endpoints
   VITE_CONVOCATORIAS_API_URL=http://localhost:8000/convocatorias/

   # App Configuration
   VITE_TOKEN_KEY=access_token
   VITE_DEFAULT_REDIRECT=/dashboard
   VITE_LOGIN_PATH=/login
   ```

4. **Ejecuta el proyecto en modo desarrollo**:

   ```bash
   npm run dev
   ```

5. **Abre tu navegador** y ve a: `http://localhost:3001`

¡Listo! El proyecto debería estar ejecutándose correctamente.

## 📋 Scripts disponibles

- **`npm run dev`** - Inicia el servidor de desarrollo con hot reload
- **`npm run build`** - Construye la aplicación para producción
- **`npm run preview`** - Vista previa de la build de producción
- **`npm run type-check`** - Verifica los tipos de TypeScript sin compilar
- **`npm run clean`** - Limpia archivos generados

## 🛠️ Tecnologías utilizadas

### Frontend Core
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Lenguaje tipado basado en JavaScript
- **Vite** - Herramienta de construcción y desarrollo
- **React Router DOM** - Enrutamiento para aplicaciones React

### UI Components & Styling
- **PrimeReact** - Biblioteca de componentes UI avanzados
- **PrimeIcons** - Iconos para PrimeReact
- **CSS Custom** - Estilos personalizados con arquitectura atómica

### HTTP & API Management
- **Axios** - Cliente HTTP para peticiones API
- **Custom ApiClient** - Cliente HTTP personalizado con manejo de tokens

### Authentication & State
- **Custom Auth System** - Sistema de autenticación con roles
- **React Hooks** - Manejo de estado con hooks personalizados

## 📁 Estructura del proyecto

```text
Frontend/
├── public/                     # Archivos estáticos
├── src/                       # Código fuente principal
│   ├── atoms/                # Componentes atómicos reutilizables
│   │   ├── Button.tsx        # Botón reutilizable
│   │   ├── Input.tsx         # Input personalizado
│   │   ├── globals.css       # Estilos globales
│   │   └── navbar.css        # Estilos del navbar
│   ├── molecules/            # Componentes moleculares
│   │   ├── SearchBar.tsx     # Barra de búsqueda
│   │   └── FilterDropdown.tsx # Dropdown de filtros
│   ├── organisms/            # Componentes complejos
│   │   ├── NavigationBar.tsx # Barra de navegación principal
│   │   └── UniversityGrid.tsx # Grid de universidades
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Login.tsx        # Página de inicio de sesión
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── DashboardStudent.tsx # Dashboard específico para estudiantes
│   │   └── Convenios.tsx    # Página de convenios
│   ├── components/          # Componentes especiales
│   │   ├── ProtectedRoute.tsx # Rutas protegidas por roles
│   │   ├── RootRedirect.tsx # Redirección inteligente por roles
│   │   └── dashboardStudentTable.tsx # Tabla de convocatorias para estudiantes
│   ├── hooks/               # Custom hooks de React
│   │   ├── useAuth.ts       # Hook de autenticación
│   │   └── usePagination.ts # Hook de paginación
│   ├── services/            # Servicios y APIs
│   │   ├── authService.ts   # Servicios de autenticación
│   │   ├── conveniosService.ts # Servicios de convenios
│   │   ├── convocatoriasService.ts # Servicios de convocatorias
│   │   └── getConvocatorias.ts # Petición específica de convocatorias
│   ├── config/              # Configuraciones
│   │   ├── api.ts           # Configuración de APIs
│   │   └── navigation.ts    # Configuración de navegación por roles
│   ├── types/               # Definiciones de tipos TypeScript
│   │   └── index.ts         # Interfaces y tipos principales
│   ├── utils/               # Funciones utilitarias
│   │   ├── httpClient.ts    # Cliente HTTP base
│   │   └── apiClient.ts     # Cliente API mejorado
│   ├── assets/              # Imágenes y recursos estáticos
│   │   └── flags/           # Banderas de países
│   ├── App.tsx              # Componente principal con rutas
│   └── main.tsx             # Punto de entrada de la aplicación
├── .env                     # Variables de entorno
├── vite-env.d.ts           # Tipos para variables de entorno
├── index.html              # Template HTML principal
├── package.json            # Dependencias y scripts del proyecto
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite
```

## 🎯 Funcionalidades principales

### 🔐 Sistema de Autenticación
- **Login/Logout** con tokens JWT
- **Roles de usuario**: estudiante, profesional, coordinator, administrador
- **Rutas protegidas** según roles
- **Redirección inteligente** después del login

### 📊 Dashboards Personalizados
- **Dashboard General** para profesionales, coordinadores y administradores
- **Dashboard Estudiantes** específico para estudiantes con tabla de convocatorias
- **Navegación dinámica** según el rol del usuario

### 📋 Gestión de Convocatorias
- **Tabla interactiva** con PrimeReact DataTable
- **Filtros avanzados** por institución, país, tipo de acuerdo, estado
- **Búsqueda global** en tiempo real
- **Paginación** y ordenamiento
- **Enlaces directos** a PDFs y sitios internacionales

### 🌐 Gestión de Convenios
- **Visualización** de convenios universitarios
- **Filtros** por países y universidades
- **Información detallada** de cada convenio

### 🧭 Navegación Inteligente
- **Menú adaptativo** según roles de usuario
- **Información del usuario** en el navbar
- **Menú desplegable** con opciones de perfil y logout
- **Responsive design** para móviles

## 🔧 Configuración adicional

### Alias de Rutas (vite.config.ts)
```typescript
'@': resolve(__dirname, 'src'),
'@atoms': resolve(__dirname, 'src/atoms'),
'@molecules': resolve(__dirname, 'src/molecules'),
'@organisms': resolve(__dirname, 'src/organisms'),
'@pages': resolve(__dirname, 'src/pages'),
'@assets': resolve(__dirname, 'src/assets'),
```

### Variables de Entorno Requeridas
- **VITE_AUTH_BASE_URL**: URL base del servicio de autenticación
- **VITE_CONVOCATORIAS_BASE_URL**: URL base del servicio de convocatorias
- **VITE_CONVOCATORIAS_API_URL**: URL específica para obtener convocatorias

## 🔌 APIs y Servicios

### Servicios de Autenticación
- **Login**: `POST /api/v1/auth/login`
- **Registro**: `POST /api/v1/auth/register`
- **Usuario actual**: `GET /api/v1/auth/me`

### Servicios de Convocatorias
- **Listar convocatorias**: `GET /convocatorias/`
- **Detalle**: `GET /convocatorias/{id}`

### Configuración HTTP
- **Manejo automático de tokens** en headers Authorization
- **Acceso a cookies** con `withCredentials: true`
- **Manejo de errores** 401 con redirección automática al login

## 👥 Roles y Permisos

| Rol | Dashboard | Convenios | Analytics | Usuarios | Configuración |
|-----|-----------|-----------|-----------|----------|---------------|
| **estudiante** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **profesional** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **coordinator** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **administrador** | ✅ | ✅ | ✅ | ✅ | ✅ |

## 📱 Desarrollo

### Convenciones de Código
1. **Arquitectura atómica**: atoms → molecules → organisms → pages
2. **Nomenclatura**: PascalCase para componentes, camelCase para funciones
3. **Tipos TypeScript**: Interfaces para todos los datos de API
4. **Servicios**: Un archivo por tipo de servicio API

### Agregar Nuevos Componentes
```bash
# Crear un nuevo átomo
src/atoms/NewAtom.tsx

# Crear una nueva molécula
src/molecules/NewMolecule.tsx

# Crear una nueva página
src/pages/NewPage.tsx
```

### Agregar Nuevas Rutas
1. Crear el componente de página
2. Agregar la ruta en `App.tsx`
3. Configurar permisos en `navigation.ts`
4. Usar `ProtectedRoute` si requiere autenticación

## 🚀 Producción

### Build de Producción
```bash
npm run build
```

### Variables de Entorno para Producción
Actualiza las URLs en `.env` para apuntar a los servidores de producción:

```env
VITE_AUTH_BASE_URL=https://tu-api-auth-produccion.com
VITE_CONVOCATORIAS_BASE_URL=https://tu-api-convocatorias-produccion.com
```

## 🐛 Troubleshooting

### Errores Comunes

1. **"API URL is not defined"**
   - Verifica que el archivo `.env` existe y tiene todas las variables

2. **Error 401 en peticiones**
   - El token puede haber expirado, hacer logout y login nuevamente

3. **Componentes PrimeReact no se ven bien**
   - Verifica que los estilos de PrimeReact están importados en `main.tsx`

4. **Puerto 3000 en uso**
   - El servidor automáticamente usa el puerto 3001 si 3000 está ocupado

### Logs Útiles
- **Console del navegador**: Para errores de JavaScript/React
- **Terminal de Vite**: Para errores de compilación
- **Network tab**: Para errores de API

## 📝 Contribuir

1. **Fork** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** tus cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Abre un Pull Request**

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.