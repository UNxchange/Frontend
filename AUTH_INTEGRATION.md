# Integración de Autenticación

Este documento describe la implementación de la autenticación con la API `/api/v1/auth/login`.

## Archivos Creados/Modificados

### Servicios
- **`src/services/authService.ts`**: Servicio principal de autenticación
- **`src/utils/httpClient.ts`**: Cliente HTTP con manejo automático de tokens
- **`src/config/api.ts`**: Configuración centralizada de URLs y endpoints

### Hooks
- **`src/hooks/useAuth.ts`**: Hook personalizado para manejar estado de autenticación

### Componentes
- **`src/components/ProtectedRoute.tsx`**: Componente para proteger rutas que requieren autenticación
- **`src/pages/Login.tsx`**: Componente de login actualizado con integración de API

### Configuración
- **`src/App.tsx`**: Actualizado con rutas protegidas

## Uso

### 1. Configuración de la API

La configuración se centraliza en `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      // ... otros endpoints
    }
  }
}
```

### 2. Servicio de Autenticación

El servicio `AuthService` maneja todas las operaciones de autenticación:

```typescript
// Login
const response = await AuthService.login(username, password)

// Guardar token
AuthService.saveToken(response.access_token)

// Verificar autenticación
const isAuth = AuthService.isAuthenticated()

// Logout
AuthService.logout()
```

### 3. Hook de Autenticación

El hook `useAuth` proporciona estado y funciones de autenticación:

```typescript
const { isAuthenticated, isLoading, login, logout } = useAuth()
```

### 4. Rutas Protegidas

Envuelve componentes que requieren autenticación:

```typescript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 5. Cliente HTTP

El `HttpClient` maneja automáticamente:
- Headers de autenticación
- Manejo de errores 401 (token expirado)
- Redirección automática al login

## Formato de la API

### Request (Login)
```
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

grant_type=password
username=string
password=string
scope=
client_id=
client_secret=
```

### Response (Exitoso)
```json
{
  "access_token": "string",
  "token_type": "string"
}
```

### Response (Error de Validación)
```json
{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string"
    }
  ]
}
```

## Características Implementadas

✅ **Login con API**: Integración completa con `/api/v1/auth/login`
✅ **Manejo de Tokens**: Almacenamiento seguro en localStorage
✅ **Rutas Protegidas**: Redirección automática para usuarios no autenticados
✅ **Manejo de Errores**: Manejo robusto de errores de API y red
✅ **Estados de Carga**: Indicadores visuales durante el proceso de login
✅ **Logout**: Funcionalidad completa de cierre de sesión
✅ **Redirección**: Redirección a la página original después del login
✅ **Headers Automáticos**: Inclusión automática de tokens en requests
✅ **Token Expirado**: Manejo automático de tokens expirados

## Próximos Pasos

1. **Refresh Token**: Implementar renovación automática de tokens
2. **Roles y Permisos**: Añadir manejo de roles de usuario
3. **Recordar Usuario**: Opción "Remember me"
4. **Recuperación de Contraseña**: Flujo de reset de password
5. **2FA**: Autenticación de dos factores

## Pruebas

Para probar la integración:

1. Asegúrate de que el backend esté corriendo en `http://127.0.0.1:8000`
2. Navega a `/login` en tu aplicación
3. Introduce credenciales válidas
4. Verifica que se redirija correctamente después del login
5. Prueba el logout desde el header
6. Intenta acceder a rutas protegidas sin estar autenticado
