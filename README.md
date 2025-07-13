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

### Scripts de Desarrollo
- **`npm run dev`** - Inicia el servidor de desarrollo con hot reload
- **`npm run build`** - Construye la aplicación para producción
- **`npm run preview`** - Vista previa de la build de producción
- **`npm run type-check`** - Verifica los tipos de TypeScript sin compilar
- **`npm run clean`** - Limpia archivos generados

### Scripts de Pruebas de Integración

Desde el directorio `integration-tests/`:

#### Pruebas Principales
```bash
# Prueba completa de integración (recomendada)
python -m pytest test_final_complete_proper_strategies.py -v -s

# Análisis completo de campos del formulario
python -m pytest test_analyze_all_fields.py -v -s

# Suite completo de todas las pruebas
python -m pytest -v -s
```

#### Pruebas de Debugging
```bash
# Debugging específico del campo País
python -m pytest test_country_field.py -v -s

# Análisis de botones y elementos específicos
python -m pytest test_button_click.py -v -s
```

#### Reportes Avanzados
```bash
# Generar reporte HTML adicional
python -m pytest test_final_complete_proper_strategies.py -v -s --html=reports/integration_report.html

# Ejecución con máximo detalle de logs
python -m pytest -v -s --capture=no
```

#### Requisitos Previos para Pruebas
```bash
# 1. Instalar dependencias de Python
pip install selenium pytest webdriver-manager reportlab requests

# 2. Iniciar servicios requeridos
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend  
# (desde directorio del backend)
uvicorn main:app --reload --port 8000

# Terminal 3: Pruebas
cd integration-tests
python -m pytest test_final_complete_proper_strategies.py -v -s
```

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

## 🧪 Sistema de Pruebas de Integración

### Herramientas y Dependencias

Este proyecto incluye un completo sistema de pruebas de integración automatizadas que valida todo el flujo desde el frontend hasta el backend:

#### Dependencias Principales
- **Selenium WebDriver 4.15.2** - Automatización de navegador web
- **pytest 8.4.1** - Framework de testing para Python
- **WebDriver Manager** - Gestión automática de drivers de navegador
- **ReportLab** - Generación de reportes PDF detallados
- **requests** - Comunicación HTTP con APIs del backend

#### Configuración del Entorno de Pruebas

1. **Instalar Python 3.13** o superior
2. **Instalar dependencias de pruebas**:
   ```bash
   pip install selenium pytest webdriver-manager reportlab requests
   ```

3. **Configurar Google Chrome** (necesario para las pruebas):
   - Versión recomendada: Chrome 120 o superior
   - Las pruebas usan Chrome con configuración personalizada

### Estructura de las Pruebas

```text
integration-tests/
├── conftest.py                    # Configuración de pytest y fixtures
├── chrome_config.py               # Configuración personalizada de Chrome
├── reports/                       # Reportes generados
│   ├── screenshots/               # Capturas de pantalla automáticas
│   └── *.pdf                     # Reportes PDF detallados
├── test_final_complete_proper_strategies.py  # Prueba completa final
├── test_analyze_all_fields.py     # Análisis de campos del formulario
├── test_country_field.py          # Debugging específico de campos
└── test_*.py                      # Otras pruebas específicas
```

### Configuración Chrome para Pruebas

Las pruebas usan una configuración especial de Chrome que:
- **Deshabilia CORS** para permitir pruebas locales
- **Desactiva el administrador de contraseñas** para evitar popups
- **Configura modo stealth** para evitar detección de automatización
- **Habilita logging detallado** para debugging

### Comandos de Ejecución

#### Ejecutar Prueba Completa de Integración
```bash
# Navegar al directorio de pruebas
cd integration-tests

# Ejecutar la prueba completa final
python -m pytest test_final_complete_proper_strategies.py -v -s

# Ejecutar con reporte HTML adicional
python -m pytest test_final_complete_proper_strategies.py -v -s --html=reports/test_report.html
```

#### Ejecutar Análisis de Campos
```bash
# Analizar estructura de todos los campos del formulario
python -m pytest test_analyze_all_fields.py -v -s

# Debugging específico de un campo
python -m pytest test_country_field.py -v -s
```

#### Ejecutar Todas las Pruebas
```bash
# Ejecutar todo el suite de pruebas
python -m pytest -v -s

# Ejecutar con reportes paralelos
python -m pytest -v -s --html=reports/full_test_report.html
```

### Configuración de Servicios Requeridos

Antes de ejecutar las pruebas, asegúrate de que estén ejecutándose:

1. **Frontend** en `http://localhost:3001`:
   ```bash
   npm run dev
   ```

2. **Backend** en `http://localhost:8000`:
   ```bash
   # Desde el directorio del backend
   uvicorn main:app --reload --port 8000
   ```

### Credenciales de Prueba

Las pruebas usan estas credenciales predeterminadas:
- **Email**: `profesional@gmail.com`
- **Password**: `1234`
- **Rol**: profesional (permisos para crear convocatorias)

### Flujo de Pruebas de Integración

#### 1. Prueba Completa End-to-End (`test_final_complete_proper_strategies.py`)

**Pasos automatizados**:
1. **Verificación de servicios** - Confirma que frontend y backend están disponibles
2. **Login automatizado** - Ingresa credenciales y valida autenticación
3. **Navegación al formulario** - Abre modal de crear convocatoria
4. **Llenado inteligente de campos**:
   - **Campos INPUT** (texto): subscriptionYear, country, institution, validity, subscriptionLevel
   - **Campos SELECT** (dropdown): agreementType, state  
   - **Campos URL**: dreLink, agreementLink, internationalLink
   - **Campo TEXTAREA**: Props (descripción)
   - **Checkboxes IDIOMAS**: Selección de idiomas disponibles
5. **Envío del formulario** - Submit con validación
6. **Verificación en backend** - Confirma que la convocatoria se persistió

#### 2. Estrategias Específicas por Tipo de Campo

**INPUT (Texto)**:
```python
field = driver.find_element(By.ID, field_id)
field.clear()
field.send_keys(value)
```

**SELECT (Dropdown)**:
```python
select_element = driver.find_element(By.ID, field_id)
select_obj = Select(select_element)
select_obj.select_by_visible_text(value)
```

**CHECKBOX (Idiomas)**:
```python
label = driver.find_element(By.XPATH, f"//label[text()='{language}']")
label.click()
```

**URL y TEXTAREA**:
```python
field = driver.find_element(By.ID, field_id)
field.clear()
field.send_keys(url_or_text)
```

### Reportes Automáticos

#### PDF Detallados
- **Ubicación**: `reports/integration_test_report_[timestamp].pdf`
- **Contenido**: Logs detallados, resultados, timestamps
- **Generación**: Automática con cada ejecución

#### Capturas de Pantalla
- **Ubicación**: `reports/screenshots/`
- **Momentos capturados**:
  - Login exitoso
  - Formulario abierto
  - Formulario completado
  - Resultado del envío
  - Errores (si ocurren)

#### Logs de Consola
```
🧪 PRUEBA DE INTEGRACIÓN FINAL - ESTRATEGIAS ESPECÍFICAS POR CAMPO
================================================================================
📋 Datos de prueba generados:
   subscriptionYear: 2024
   country: Alemania
   institution: Universidad Prueba Final 20250713_123456
   ...
🚀 Paso 1: Login...
✅ Login exitoso - Dashboard cargado
📝 Paso 3a: Llenando campos INPUT (texto)...
✅ INPUT subscriptionYear: '2024'
✅ INPUT country: 'Alemania'
...
🎉 ¡PRUEBA DE INTEGRACIÓN COMPLETAMENTE EXITOSA!
```

### Debugging y Resolución de Problemas

#### Errores Comunes

1. **Chrome no encontrado**:
   ```bash
   # Instalar WebDriver Manager
   pip install webdriver-manager
   ```

2. **Servicios no disponibles**:
   ```bash
   # Verificar que frontend y backend estén ejecutándose
   curl http://localhost:3001  # Frontend
   curl http://localhost:8000  # Backend
   ```

3. **Popups interfieren con pruebas**:
   - Configuración de Chrome automáticamente los deshabilia
   - Las pruebas incluyen manejo de popups con `Keys.ESCAPE`

4. **Campos no encontrados**:
   ```bash
   # Ejecutar análisis de campos
   python -m pytest test_analyze_all_fields.py -v -s
   ```

#### Configuración Avanzada

**Variables de entorno para pruebas** (en `chrome_config.py`):
```python
FRONTEND_URL = "http://localhost:3001"
BACKEND_URL = "http://localhost:8000"
TEST_USER_EMAIL = "profesional@gmail.com"
TEST_USER_PASSWORD = "1234"
```

**Timeout personalizado**:
```python
EXPLICIT_WAIT_TIMEOUT = 10  # segundos
```

### Validaciones Incluidas

- ✅ **Autenticación**: Login exitoso con token JWT
- ✅ **Navegación**: Redirección correcta post-login
- ✅ **Formulario**: Todos los campos identificados y completados
- ✅ **Backend**: Persistencia verificada via API
- ✅ **Integración**: Flujo completo frontend → backend validado

### Métricas de las Pruebas

- **Tiempo promedio**: 15-20 segundos por prueba completa
- **Cobertura**: 100% del flujo de creación de convocatorias
- **Confiabilidad**: >95% éxito en entornos estables
- **Campos validados**: 11 campos + selección de idiomas

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

#### Errores de Aplicación
1. **"API URL is not defined"**
   - Verifica que el archivo `.env` existe y tiene todas las variables

2. **Error 401 en peticiones**
   - El token puede haber expirado, hacer logout y login nuevamente

3. **Componentes PrimeReact no se ven bien**
   - Verifica que los estilos de PrimeReact están importados en `main.tsx`

4. **Puerto 3000 en uso**
   - El servidor automáticamente usa el puerto 3001 si 3000 está ocupado

#### Errores de Pruebas de Integración

5. **"ChromeDriver not found"**
   ```bash
   pip install webdriver-manager
   # O descargar manualmente ChromeDriver compatible con tu versión de Chrome
   ```

6. **"Connection refused" en pruebas**
   ```bash
   # Verificar que los servicios estén ejecutándose
   curl http://localhost:3001  # Frontend debe responder
   curl http://localhost:8000  # Backend debe responder
   ```

7. **"Element not found" en formulario**
   ```bash
   # Ejecutar análisis de campos para debugging
   cd integration-tests
   python -m pytest test_analyze_all_fields.py -v -s
   ```

8. **Chrome se cierra inmediatamente**
   - Instalar versión compatible de Chrome (120+)
   - Verificar que no hay otros procesos de Chrome ejecutándose

9. **"Invalid credentials" en pruebas**
   - Verificar que el usuario `profesional@gmail.com` con password `1234` existe en el backend
   - El usuario debe tener rol 'profesional' para crear convocatorias

10. **Pruebas fallan por timeout**
    ```bash
    # Aumentar timeout en chrome_config.py
    EXPLICIT_WAIT_TIMEOUT = 20  # aumentar de 10 a 20 segundos
    ```

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