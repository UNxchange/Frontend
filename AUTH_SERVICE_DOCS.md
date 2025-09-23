# Servicio de Autenticación - Integración con API

Este documento describe la integración del frontend con la API de autenticación y registro.

## Configuración

### URL de la API
La aplicación está configurada para usar la API en:
```
http://localhost:8080
```

> **Nota**: La URL se configura automáticamente desde las variables de entorno usando `VITE_AUTH_BASE_URL`

### Endpoints disponibles

1. **POST** `/api/v1/auth/login` - Inicio de sesión
2. **POST** `/api/v1/auth/register` - Registro de usuario  
3. **GET** `/api/v1/auth/users` - Obtener todos los usuarios
4. **GET** `/api/v1/auth/user?email=<email>` - Obtener usuario por email

## Uso del Servicio

### AuthService

El servicio `AuthService` proporciona métodos para interactuar con la API:

```typescript
import { AuthService } from '../services/authService'

// Login
const response = await AuthService.login(username, password)
AuthService.saveToken(response.access_token)

// Registro
const userData = {
  name: 'Juan Pérez',
  email: 'juan@example.com',
  role: 'estudiante',
  password: 'password123'
}
const user = await AuthService.register(userData)

// Obtener todos los usuarios
const users = await AuthService.getAllUsers()

// Obtener usuario por email
const user = await AuthService.getUserByEmail('juan@example.com')

// Verificar autenticación
const isAuthenticated = AuthService.isAuthenticated()

// Logout
AuthService.logout()
```

### Tipos de Datos

#### LoginRequest
```typescript
interface LoginRequest {
  username: string
  password: string
  scope?: string
  client_id?: string
  client_secret?: string
}
```

#### RegisterRequest
```typescript
interface RegisterRequest {
  name: string
  email: string
  role: string
  password: string
}
```

#### User
```typescript
interface User {
  id: string
  name: string
  email: string
  role: string
}
```

#### LoginResponse
```typescript
interface LoginResponse {
  access_token: string
  token_type: string
}
```

### Roles Disponibles

- `estudiante` - Para estudiantes
- `profesional` - Para profesionales (antes era "profesor")
- `administrador` - Para personal administrativo (antes era "administrativo")

## Componentes React

### Login Component
Ubicado en `src/pages/Login.tsx`, maneja el inicio de sesión con:
- Validación de campos
- Manejo de errores
- Estados de carga
- Redirección automática

### SignupModal Component
Ubicado en `src/components/SignupModal.tsx`, proporciona:
- Modal para registro de nuevos usuarios
- Validación de formulario
- Manejo de errores específicos de la API
- Mensajes de éxito/error

## Archivos HTML (para versión no-React)

### Login.html
Ubicado en `src/pages/Login.html` con script `src/scripts/login-form.ts`

### Signup modal
Script en `src/scripts/signup-modal.ts` que crea un modal dinámicamente

## Manejo de Errores

La API puede devolver diferentes códigos de error:

- **422** - Datos de validación inválidos
- **401** - Credenciales incorrectas (login)
- **400** - Email ya registrado o datos incorrectos

Los servicios manejan estos errores automáticamente y proporcionan mensajes apropiados.

## Estructura de Archivos

```
src/
├── services/
│   └── authService.ts          # Servicio principal de autenticación
├── config/
│   └── api.ts                  # Configuración de endpoints
├── utils/
│   └── httpClient.ts           # Cliente HTTP con manejo de tokens
├── components/
│   └── SignupModal.tsx         # Modal de registro React
├── pages/
│   ├── Login.tsx               # Página de login React
│   └── Login.html              # Página de login HTML
├── scripts/
│   ├── login-form.ts           # Script para login HTML
│   └── signup-modal.ts         # Script para modal de registro HTML
└── atoms/
    └── login-atoms.css         # Estilos base
```

## Instalación y Uso

1. Los servicios están listos para usar en el proyecto
2. Para React: importa y usa los componentes `Login` y `SignupModal`
3. Para HTML: incluye los scripts correspondientes

### Ejemplo en React:
```tsx
import Login from './pages/Login'
import SignupModal from './components/SignupModal'

// En tu router o componente principal
<Route path="/login" component={Login} />
```

### Ejemplo en HTML:
```html
<script src="./scripts/login-form.js"></script>
<script src="./scripts/signup-modal.js"></script>
```

## Autenticación Persistente

- Los tokens se guardan en `localStorage`
- Se agregan automáticamente a las requests HTTP
- Redirección automática al login cuando el token expira
- Método `isAuthenticated()` para verificar estado

## Notas Importantes

1. La API usa OAuth2 con `grant_type=password` para el login
2. El registro no requiere autenticación previa
3. Los tokens se incluyen automáticamente en requests subsecuentes
4. El HttpClient maneja automáticamente las respuestas 401 (token expirado)
