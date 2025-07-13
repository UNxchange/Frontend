@echo off
REM Script para ejecutar pruebas de integración con Chro# Verificar frontend
echo   - Frontend (localhost:3000)...
python -c "
import requests
try:
    response = requests.get('http://localhost:3000', timeout=3)S deshabilitado
REM Este script usa la misma configuración que tu disableCORS.bat

echo.
echo ===============================================
echo 🧪 PRUEBAS DE INTEGRACIÓN - CHROME SIN CORS
echo ===============================================
echo.

REM Verificar que el directorio existe
if not exist "integration-tests" (
    echo ❌ Directorio integration-tests no encontrado
    echo Ejecuta este script desde la raíz del proyecto Frontend
    pause
    exit /b 1
)

REM Cambiar al directorio de pruebas
cd integration-tests

REM Verificar Python
echo 🐍 Verificando Python...
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Python no encontrado
    echo Instala Python desde https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Verificar dependencias
echo 📦 Verificando dependencias...
python -c "import selenium, pytest, requests, reportlab" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️ Dependencias faltantes, instalando...
    pip install -r requirements.txt
    if %ERRORLEVEL% neq 0 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
)

echo ✅ Dependencias verificadas

REM Crear directorios necesarios
if not exist "reports" mkdir reports
if not exist "reports\screenshots" mkdir reports\screenshots

REM Configurar variables de entorno
echo 🔧 Configurando entorno para Chrome sin CORS...
set DISABLE_CORS=true
set CHROME_NO_CORS=true

REM Mostrar información de configuración
echo.
echo 📋 Configuración actual:
echo   Frontend: http://localhost:3000
echo   Backend: http://localhost:8000
echo   Chrome: CORS deshabilitado
echo   Modo: Visible (no headless)
echo.

REM Verificar servicios
echo 🔍 Verificando servicios...

REM Verificar frontend
echo   - Frontend (localhost:5173)...
python -c "
import requests
try:
    response = requests.get('http://localhost:5173', timeout=3)
    print('     ✅ Frontend disponible')
except:
    print('     ❌ Frontend no disponible')
    print('     Ejecuta: npm run dev')
"

REM Verificar backend
echo   - Backend (localhost:8000)...
python -c "
import requests
try:
    response = requests.get('http://localhost:8000/convocatorias/', timeout=3)
    print('     ✅ Backend disponible')
except:
    print('     ❌ Backend no disponible') 
    print('     Asegúrate de que el servidor FastAPI esté ejecutándose')
"

echo.
echo 🚀 Iniciando pruebas de integración...
echo.

REM Ejecutar las pruebas
python -m pytest test_convocatorias_integration.py -v ^
    --html=reports/report.html ^
    --self-contained-html ^
    --tb=short ^
    --capture=no

set TEST_RESULT=%ERRORLEVEL%

echo.
echo ===============================================
if %TEST_RESULT% equ 0 (
    echo 🎉 ¡PRUEBAS COMPLETADAS EXITOSAMENTE!
) else (
    echo ❌ ALGUNAS PRUEBAS FALLARON
)
echo ===============================================
echo.

echo 📊 Reportes generados:
if exist "reports\report.html" (
    echo   📄 reports\report.html
)
if exist "reports\test_report.pdf" (
    echo   📋 reports\test_report.pdf  
)
if exist "reports\screenshots" (
    echo   📸 reports\screenshots\
)

echo.
echo 🌐 Para abrir el reporte HTML:
echo   start reports\report.html
echo.

REM Preguntar si abrir reporte
set /p open_report="¿Abrir reporte HTML automáticamente? (S/n): "
if /i not "%open_report%"=="n" (
    if exist "reports\report.html" (
        echo 🌐 Abriendo reporte...
        start reports\report.html
    )
)

echo.
echo 💡 Para ejecutar pruebas específicas:
echo   python -m pytest test_convocatorias_integration.py::TestConvocatoriaIntegration::test_complete_convocatoria_creation_flow -v
echo.

pause
