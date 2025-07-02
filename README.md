# UN Intercambio - Frontend

Una aplicación React con TypeScript desarrollada con Vite para el sistema de intercambios universitarios.

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

3. **Ejecuta el proyecto en modo desarrollo**:

   ```bash
   npm run dev
   ```

4. **Abre tu navegador** y ve a: `http://localhost:3000`

¡Listo! El proyecto debería estar ejecutándose correctamente.

## 📋 Scripts disponibles

- **`npm run dev`** - Inicia el servidor de desarrollo con hot reload
- **`npm run build`** - Construye la aplicación para producción
- **`npm run preview`** - Vista previa de la build de producción
- **`npm run type-check`** - Verifica los tipos de TypeScript sin compilar
- **`npm run clean`** - Limpia archivos generados

## 🛠️ Tecnologías utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Lenguaje tipado basado en JavaScript
- **Vite** - Herramienta de construcción y desarrollo
- **React Router** - Enrutamiento para aplicaciones React
- **FontAwesome** - Iconos

## 📁 Estructura del proyecto

```text
Frontend/
├── public/                 # Archivos estáticos
├── src/                   # Código fuente principal
│   ├── atoms/            # Componentes atómicos reutilizables
│   ├── molecules/        # Componentes moleculares
│   ├── organisms/        # Componentes complejos
│   ├── pages/           # Páginas de la aplicación
│   ├── hooks/           # Custom hooks de React
│   ├── services/        # Servicios y APIs
│   ├── types/           # Definiciones de tipos TypeScript
│   ├── utils/           # Funciones utilitarias
│   ├── assets/          # Imágenes y recursos estáticos
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Punto de entrada de la aplicación
├── index.html           # Template HTML principal
├── package.json         # Dependencias y scripts del proyecto
├── tsconfig.json        # Configuración de TypeScript
└── vite.config.ts       # Configuración de Vite
```

## 🎯 Funcionalidades principales

- Dashboard de intercambios universitarios
- Sistema de login y autenticación
- Gestión de convenios universitarios
- Filtros y búsqueda de universidades
- Interfaz responsive y moderna

## 🔧 Configuración adicional

El proyecto utiliza alias de rutas configurados en `vite.config.ts`:

- `@` → `src/`
- `@atoms` → `src/atoms/`
- `@molecules` → `src/molecules/`
- `@organisms` → `src/organisms/`
- `@pages` → `src/pages/`
- `@assets` → `src/assets/`

## 📱 Desarrollo

Para desarrollar nuevas funcionalidades:

1. El servidor de desarrollo se recarga automáticamente con los cambios
2. Los errores de TypeScript se muestran en tiempo real
3. Utiliza la estructura atómica (atoms → molecules → organisms → pages)
4. Sigue las convenciones de nomenclatura establecidas

## 🚀 Producción

Para crear una build de producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/` y estarán listos para ser desplegados.