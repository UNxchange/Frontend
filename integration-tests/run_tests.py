#!/usr/bin/env python3
"""
Script para ejecutar las pruebas de integración
Maneja la instalación de dependencias, configuración del entorno y ejecución de pruebas
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path

def run_command(command, description):
    """Ejecuta un comando y maneja errores"""
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completado")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en {description}")
        print(f"Código de salida: {e.returncode}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False

def check_python_version():
    """Verifica que Python sea >= 3.8"""
    version = sys.version_info
    print(f"🐍 Python versión: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Se requiere Python 3.8 o superior")
        return False
    
    print("✅ Versión de Python compatible")
    return True

def install_dependencies():
    """Instala las dependencias de Python"""
    requirements_file = Path("requirements.txt")
    
    if not requirements_file.exists():
        print("❌ No se encontró requirements.txt")
        return False
    
    # Actualizar pip primero
    if not run_command(f"{sys.executable} -m pip install --upgrade pip", "Actualizando pip"):
        return False
    
    # Instalar dependencias
    return run_command(f"{sys.executable} -m pip install -r requirements.txt", "Instalando dependencias")

def setup_chrome_driver():
    """Configura el driver de Chrome"""
    print("\n🌐 Configurando ChromeDriver...")
    
    # webdriver-manager se encarga de descargar automáticamente el driver
    try:
        from selenium import webdriver
        from webdriver_manager.chrome import ChromeDriverManager
        from selenium.webdriver.chrome.service import Service
        
        # Probar que Chrome esté instalado
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        service = Service(ChromeDriverManager().install())
        
        driver = webdriver.Chrome(service=service, options=options)
        driver.quit()
        print("✅ ChromeDriver configurado correctamente")
        return True
        
    except Exception as e:
        print(f"❌ Error configurando ChromeDriver: {e}")
        print("Asegúrate de tener Google Chrome instalado")
        return False

def check_backend_status():
    """Verifica que el backend esté ejecutándose"""
    print("\n🔍 Verificando estado del backend...")
    
    try:
        import requests
        response = requests.get("http://localhost:8000/convocatorias/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend está ejecutándose y respondiendo")
            return True
        else:
            print(f"⚠️  Backend responde pero con código: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend en http://localhost:8000")
        print("   Asegúrate de que el backend esté ejecutándose")
        return False
    except Exception as e:
        print(f"❌ Error verificando backend: {e}")
        return False

def check_frontend_status():
    """Verifica que el frontend esté ejecutándose"""
    print("\n🌐 Verificando estado del frontend...")
    
    try:
        import requests
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend está ejecutándose y respondiendo")
            return True
        else:
            print(f"⚠️  Frontend responde pero con código: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al frontend en http://localhost:5173")
        print("   Asegúrate de que el frontend esté ejecutándose con 'npm run dev'")
        return False
    except Exception as e:
        print(f"❌ Error verificando frontend: {e}")
        return False

def run_tests(test_file=None, verbose=False, headless=False):
    """Ejecuta las pruebas de integración"""
    print("\n🧪 Ejecutando pruebas de integración...")
    
    # Crear directorio de reportes si no existe
    reports_dir = Path("reports")
    reports_dir.mkdir(exist_ok=True)
    
    # Construir comando pytest
    cmd_parts = [sys.executable, "-m", "pytest"]
    
    if test_file:
        cmd_parts.append(test_file)
    else:
        cmd_parts.append("test_convocatorias_integration.py")
    
    if verbose:
        cmd_parts.append("-v")
    
    # Reportes
    cmd_parts.extend([
        "--html=reports/report.html",
        "--self-contained-html",
        f"--junitxml=reports/junit.xml"
    ])
    
    # Configurar variables de entorno para las pruebas
    env = os.environ.copy()
    if headless:
        env["HEADLESS"] = "true"
    
    command = " ".join(cmd_parts)
    print(f"Comando: {command}")
    
    try:
        result = subprocess.run(command, shell=True, env=env)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error ejecutando pruebas: {e}")
        return False

def main():
    """Función principal"""
    parser = argparse.ArgumentParser(description="Ejecutar pruebas de integración")
    parser.add_argument("--test", help="Archivo de prueba específico a ejecutar")
    parser.add_argument("--verbose", "-v", action="store_true", help="Salida detallada")
    parser.add_argument("--headless", action="store_true", help="Ejecutar en modo headless")
    parser.add_argument("--skip-deps", action="store_true", help="Saltar instalación de dependencias")
    parser.add_argument("--skip-checks", action="store_true", help="Saltar verificaciones previas")
    
    args = parser.parse_args()
    
    print("🧪 EJECUTOR DE PRUEBAS DE INTEGRACIÓN")
    print("=" * 50)
    
    # Cambiar al directorio de las pruebas
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    print(f"📁 Directorio de trabajo: {os.getcwd()}")
    
    # 1. Verificar Python
    if not check_python_version():
        sys.exit(1)
    
    # 2. Instalar dependencias (si no se especifica skip)
    if not args.skip_deps:
        if not install_dependencies():
            print("❌ Fallo en la instalación de dependencias")
            sys.exit(1)
    
    # 3. Configurar ChromeDriver
    if not setup_chrome_driver():
        print("❌ Fallo en la configuración de ChromeDriver")
        sys.exit(1)
    
    # 4. Verificaciones previas (si no se especifica skip)
    if not args.skip_checks:
        backend_ok = check_backend_status()
        frontend_ok = check_frontend_status()
        
        if not backend_ok or not frontend_ok:
            print("\n⚠️  ADVERTENCIA: Algunos servicios no están disponibles")
            response = input("¿Continuar con las pruebas? (y/N): ")
            if response.lower() != 'y':
                print("❌ Pruebas canceladas por el usuario")
                sys.exit(1)
    
    # 5. Ejecutar pruebas
    success = run_tests(
        test_file=args.test,
        verbose=args.verbose,
        headless=args.headless
    )
    
    # 6. Resultados
    print("\n" + "=" * 50)
    if success:
        print("🎉 ¡TODAS LAS PRUEBAS PASARON!")
        print("📊 Reportes generados en la carpeta 'reports/'")
    else:
        print("❌ ALGUNAS PRUEBAS FALLARON")
        print("📊 Revisar el reporte en 'reports/report.html' para más detalles")
    
    print("\n📁 Archivos generados:")
    reports_dir = Path("reports")
    if reports_dir.exists():
        for report_file in reports_dir.glob("*"):
            print(f"   📄 {report_file}")
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
