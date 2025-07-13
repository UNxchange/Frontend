@echo off
REM Script de instalación para pruebas de integración
REM Configura el entorno Python y las dependencias necesarias

echo.
echo ===============================================
echo 🧪 INSTALADOR DE PRUEBAS DE INTEGRACIÓN
echo ===============================================
echo.

REM Verificar Python
echo 🐍 Verificando Python...
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Python no está instalado o no está en el PATH
    echo.
    echo 📥 Descarga Python desde: https://www.python.org/downloads/
    echo ✅ Asegúrate de marcar "Add to PATH" durante la instalación
    pause
    exit /b 1
)

python --version
echo ✅ Python encontrado

REM Verificar pip
echo.
echo 📦 Verificando pip...
python -m pip --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ pip no está disponible
    echo 🔧 Instalando pip...
    python -m ensurepip --upgrade
)

echo ✅ pip disponible

REM Crear entorno virtual (opcional pero recomendado)
echo.
echo 🏗️ ¿Crear entorno virtual? (Recomendado para aislar dependencias)
set /p create_venv="¿Crear entorno virtual? (S/n): "

if /i "%create_venv%"=="n" (
    echo ⚠️ Instalando en entorno global...
    goto install_deps
)

echo 🔧 Creando entorno virtual...
if exist venv (
    echo ⚠️ El entorno virtual ya existe
    echo 🔄 ¿Recrear entorno virtual?
    set /p recreate="¿Recrear? (S/n): "
    if /i "%recreate%"=="s" (
        echo 🗑️ Eliminando entorno existente...
        rmdir /s /q venv
    ) else (
        goto activate_venv
    )
)

python -m venv venv
if %ERRORLEVEL% neq 0 (
    echo ❌ Error creando entorno virtual
    pause
    exit /b 1
)

echo ✅ Entorno virtual creado

:activate_venv
echo 🔌 Activando entorno virtual...
call venv\Scripts\activate
if %ERRORLEVEL% neq 0 (
    echo ❌ Error activando entorno virtual
    pause
    exit /b 1
)

echo ✅ Entorno virtual activado

:install_deps
echo.
echo 📥 Actualizando pip...
python -m pip install --upgrade pip

echo.
echo 📦 Instalando dependencias...
if not exist requirements.txt (
    echo ❌ No se encontró requirements.txt
    pause
    exit /b 1
)

python -m pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo ❌ Error instalando dependencias
    echo.
    echo 🔧 Intentando instalación individual...
    
    echo   - Instalando selenium...
    python -m pip install selenium==4.15.2
    
    echo   - Instalando pytest...
    python -m pip install pytest==7.4.3
    
    echo   - Instalando pytest-html...
    python -m pip install pytest-html==4.1.1
    
    echo   - Instalando webdriver-manager...
    python -m pip install webdriver-manager==4.0.1
    
    echo   - Instalando reportlab...
    python -m pip install reportlab==4.0.7
    
    echo   - Instalando requests...
    python -m pip install requests==2.31.0
    
    echo   - Instalando pillow...
    python -m pip install pillow==10.1.0
)

echo ✅ Dependencias instaladas

REM Verificar Chrome
echo.
echo 🌐 Verificando Google Chrome...
reg query "HKEY_CURRENT_USER\Software\Google\Chrome\BLBeacon" /v version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\BLBeacon" /v version >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo ⚠️ Google Chrome no detectado
        echo 📥 Descarga Chrome desde: https://www.google.com/chrome/
        echo ℹ️ Chrome es necesario para las pruebas de Selenium
        set /p continue_without_chrome="¿Continuar sin Chrome? (s/N): "
        if /i not "%continue_without_chrome%"=="s" (
            pause
            exit /b 1
        )
    ) else (
        echo ✅ Google Chrome encontrado (HKLM)
    )
) else (
    echo ✅ Google Chrome encontrado (HKCU)
)

REM Crear directorios necesarios
echo.
echo 📁 Creando directorios...
if not exist reports mkdir reports
if not exist reports\screenshots mkdir reports\screenshots
echo ✅ Directorios creados

REM Verificar configuración
echo.
echo 🔧 Verificando configuración...
python -c "import selenium; import pytest; import requests; import reportlab; print('✅ Todas las librerías principales importadas correctamente')" 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Error en la verificación de librerías
    echo 🔍 Ejecutando diagnóstico...
    python -c "
try:
    import selenium
    print('✅ Selenium OK')
except ImportError as e:
    print('❌ Selenium:', e)

try:
    import pytest
    print('✅ Pytest OK') 
except ImportError as e:
    print('❌ Pytest:', e)

try:
    import requests
    print('✅ Requests OK')
except ImportError as e:
    print('❌ Requests:', e)

try:
    import reportlab
    print('✅ ReportLab OK')
except ImportError as e:
    print('❌ ReportLab:', e)
"
    pause
)

REM Verificar servicios (opcional)
echo.
echo 🔍 ¿Verificar que el frontend y backend estén ejecutándose?
set /p check_services="¿Verificar servicios? (S/n): "

if /i not "%check_services%"=="n" (
    echo.
    echo 🌐 Verificando frontend (http://localhost:5173)...
    python -c "
import requests
try:
    response = requests.get('http://localhost:5173', timeout=5)
    print('✅ Frontend responde')
except requests.exceptions.ConnectionError:
    print('❌ Frontend no responde en http://localhost:5173')
    print('   Ejecuta: npm run dev')
except Exception as e:
    print('⚠️ Error verificando frontend:', e)
"

    echo.
    echo 🔧 Verificando backend (http://localhost:8000)...
    python -c "
import requests
try:
    response = requests.get('http://localhost:8000/convocatorias/', timeout=5)
    print('✅ Backend responde')
except requests.exceptions.ConnectionError:
    print('❌ Backend no responde en http://localhost:8000')
    print('   Asegúrate de que el servidor FastAPI esté ejecutándose')
except Exception as e:
    print('⚠️ Error verificando backend:', e)
"
)

REM Prueba rápida
echo.
echo 🧪 ¿Ejecutar prueba rápida de configuración?
set /p run_test="¿Ejecutar prueba? (S/n): "

if /i not "%run_test%"=="n" (
    echo.
    echo 🔧 Ejecutando prueba de configuración...
    python run_tests.py --skip-checks --skip-deps
    echo.
    if %ERRORLEVEL% equ 0 (
        echo ✅ Prueba de configuración exitosa
    ) else (
        echo ⚠️ La prueba de configuración tuvo problemas
        echo 📄 Revisa el archivo reports/report.html para más detalles
    )
)

echo.
echo ===============================================
echo 🎉 ¡INSTALACIÓN COMPLETADA!
echo ===============================================
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Asegúrate de que el frontend esté ejecutándose:
echo    cd .. ^&^& npm run dev
echo.
echo 2. Asegúrate de que el backend esté ejecutándose en:
echo    http://localhost:8000
echo.
echo 3. Ejecutar todas las pruebas:
echo    python run_tests.py
echo.
echo 4. Ver reportes en:
echo    reports/report.html
echo.
echo 📚 Para más información:
echo    README.md
echo.

if exist venv (
    echo 💡 NOTA: Si creaste un entorno virtual, actívalo con:
    echo    venv\Scripts\activate
    echo.
)

echo ¡Presiona cualquier tecla para continuar!
pause >nul
