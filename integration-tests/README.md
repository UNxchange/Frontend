# 🧪 Sistema de Pruebas de Integración

Este sistema de pruebas automatizadas verifica la integración completa entre el frontend React y el backend FastAPI para la funcionalidad de creación de convocatorias.

## 📋 Características

- **Pruebas End-to-End**: Prueba el flujo completo desde login hasta verificación en backend
- **Selenium WebDriver**: Automatización del navegador para interacciones reales
- **Page Object Model**: Estructura mantenible y reutilizable
- **Reportes Detallados**: HTML y PDF con capturas de pantalla
- **Validación de Backend**: Verificación directa de datos en la API
- **Manejo de Errores**: Detección y reporte de problemas de autenticación

## 🏗️ Estructura del Proyecto

```
integration-tests/
├── requirements.txt              # Dependencias de Python
├── config.py                    # Configuración de pruebas
├── conftest.py                  # Fixtures de pytest y reportes
├── run_tests.py                 # Script principal de ejecución
├── setup.bat                    # Script de instalación (Windows)
├── test_convocatorias_integration.py  # Pruebas principales
├── page_objects/                # Patrón Page Object Model
│   ├── __init__.py
│   ├── login_page.py           # Interacciones con login
│   ├── dashboard_page.py       # Interacciones con dashboard
│   └── convocatoria_form_page.py  # Interacciones con formulario
├── reports/                     # Reportes generados
│   ├── report.html             # Reporte HTML detallado
│   ├── test_report.pdf         # Reporte PDF con capturas
│   └── screenshots/            # Capturas de pantalla
└── README.md                   # Este archivo
```

## 🔧 Configuración Inicial

### Prerequisitos

1. **Python 3.8+**
2. **Google Chrome** (última versión)
3. **Frontend ejecutándose** en `http://localhost:5173`
4. **Backend ejecutándose** en `http://localhost:8000`

### Instalación Automática (Windows)

```bash
# Ejecutar script de instalación
.\setup.bat
```

### Instalación Manual

```bash
# 1. Crear entorno virtual (recomendado)
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Verificar instalación
python run_tests.py --skip-checks --skip-deps
```

## 🚀 Ejecución de Pruebas

### Ejecución Completa

```bash
# Ejecutar todas las pruebas con verificaciones
python run_tests.py

# Ejecutar en modo silencioso (headless)
python run_tests.py --headless

# Ejecutar con salida detallada
python run_tests.py --verbose
```

### Ejecución Específica

```bash
# Ejecutar prueba específica
python run_tests.py --test test_convocatorias_integration.py::TestConvocatoriaIntegration::test_complete_convocatoria_creation_flow

# Saltar verificaciones de servicios
python run_tests.py --skip-checks

# Saltar instalación de dependencias
python run_tests.py --skip-deps
```

### Ejecución Directa con pytest

```bash
# Ejecutar directamente con pytest
pytest test_convocatorias_integration.py -v --html=reports/report.html
```

## 📊 Reportes y Resultados

### Tipos de Reportes

1. **Reporte HTML**: `reports/report.html`
   - Vista interactiva con detalles de cada prueba
   - Capturas de pantalla integradas
   - Logs detallados de errores

2. **Reporte PDF**: `reports/test_report.pdf`
   - Documento profesional con ReportLab
   - Resumen ejecutivo de resultados
   - Capturas de pantalla de pasos críticos

3. **Capturas de Pantalla**: `reports/screenshots/`
   - Screenshots automáticos en cada paso
   - Capturas de errores para debugging

### Interpretación de Resultados

- ✅ **PASSED**: Prueba exitosa
- ❌ **FAILED**: Prueba falló (revisar logs)
- ⚠️ **SKIPPED**: Prueba omitida

## 🧪 Casos de Prueba

### 1. Flujo Completo de Creación (`test_complete_convocatoria_creation_flow`)

**Objetivo**: Verificar el flujo completo desde login hasta verificación en backend

**Pasos**:
1. Login como profesional
2. Navegación al dashboard profesional
3. Apertura del formulario de convocatoria
4. Llenado completo del formulario
5. Envío y verificación de éxito
6. Verificación en backend vía API

**Validaciones**:
- Autenticación exitosa
- Redirección correcta
- Formulario funcional
- Datos guardados en backend

### 2. Validaciones del Formulario (`test_form_validation`)

**Objetivo**: Probar las validaciones del lado del cliente

**Pasos**:
1. Acceso al formulario
2. Intento de envío con campos vacíos
3. Verificación de mensajes de error

### 3. Seguridad de Autenticación (`test_authentication_required`)

**Objetivo**: Verificar que se requiere autenticación

**Pasos**:
1. Acceso directo sin login
2. Verificación de redirección al login

## 🔧 Configuración

### Variables de Entorno

Las configuraciones se encuentran en `config.py`:

```python
class TestConfig:
    # URLs de servicios
    FRONTEND_URL = "http://localhost:5173"
    BACKEND_URL = "http://localhost:8000"
    CONVOCATORIAS_ENDPOINT = "http://localhost:8000/convocatorias/"
    
    # Credenciales de prueba
    TEST_USER_EMAIL = "profesional@test.com"
    TEST_USER_PASSWORD = "test123"
    
    # Datos de prueba
    TEST_CONVOCATORIA_DATA = {...}
```

### Personalización

Para personalizar las pruebas:

1. **Credenciales**: Modificar `TEST_USER_EMAIL` y `TEST_USER_PASSWORD` en `config.py`
2. **URLs**: Ajustar `FRONTEND_URL` y `BACKEND_URL` según tu configuración
3. **Datos de Prueba**: Modificar `TEST_CONVOCATORIA_DATA` con datos relevantes
4. **Timeouts**: Ajustar `TIMEOUT` para conexiones lentas

## 🐛 Solución de Problemas

### Problemas Comunes

#### 1. ChromeDriver No Encontrado
```
❌ Error configurando ChromeDriver
```
**Solución**: 
- Verificar que Google Chrome esté instalado
- El script descarga automáticamente el driver compatible

#### 2. Servicios No Disponibles
```
❌ No se puede conectar al backend/frontend
```
**Solución**:
- Verificar que el backend esté ejecutándose: `http://localhost:8000`
- Verificar que el frontend esté ejecutándose: `http://localhost:5173`
- Usar `--skip-checks` para omitir verificaciones

#### 3. Errores de Autenticación
```
❌ Error al crear convocatoria: No autenticado
```
**Solución**:
- Verificar credenciales en `config.py`
- Asegurar que el usuario existe en el backend
- Revisar que el backend acepte las credenciales

#### 4. Timeouts
```
❌ Timeout esperando elemento
```
**Solución**:
- Aumentar `TIMEOUT` en `config.py`
- Verificar que los selectores sean correctos
- Usar `--verbose` para más detalles

### Debugging

#### Capturas de Pantalla
Las capturas se guardan automáticamente en cada paso crítico en `reports/screenshots/`

#### Logs Detallados
```bash
# Ejecutar con logs detallados
python run_tests.py --verbose

# Ejecutar pytest directamente con logs
pytest -v -s test_convocatorias_integration.py
```

#### Modo No-Headless
```bash
# Ver el navegador durante la ejecución
python run_tests.py  # (headless=False por defecto)
```

## 🔄 Integración Continua

### Para GitHub Actions

```yaml
name: Integration Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: |
          cd integration-tests
          pip install -r requirements.txt
          python run_tests.py --headless
```

### Para Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Integration Tests') {
            steps {
                sh '''
                    cd integration-tests
                    pip install -r requirements.txt
                    python run_tests.py --headless
                '''
            }
        }
    }
    post {
        always {
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'integration-tests/reports',
                reportFiles: 'report.html',
                reportName: 'Integration Test Report'
            ])
        }
    }
}
```

## 📝 Mantenimiento

### Actualización de Dependencias

```bash
# Verificar versiones actuales
pip list --outdated

# Actualizar requirements.txt
pip-review --auto
```

### Actualización de Selectores

Si la UI cambia, actualizar los selectores en los archivos de `page_objects/`:

1. **login_page.py**: Selectores de login y dashboard
2. **dashboard_page.py**: Selectores del dashboard profesional
3. **convocatoria_form_page.py**: Selectores del formulario

### Adición de Nuevas Pruebas

1. Crear nuevos métodos en `TestConvocatoriaIntegration`
2. Seguir la convención `test_*`
3. Usar page objects para interacciones
4. Agregar screenshots con `take_screenshot()`

## 📞 Soporte

Para problemas o preguntas:

1. **Revisar logs**: `reports/report.html`
2. **Verificar configuración**: `config.py`
3. **Ejecutar con verbose**: `--verbose`
4. **Revisar capturas**: `reports/screenshots/`

---

**Versión**: 1.0.0  
**Última actualización**: Diciembre 2024  
**Compatibilidad**: Python 3.8+, Chrome 90+, Selenium 4.15+
