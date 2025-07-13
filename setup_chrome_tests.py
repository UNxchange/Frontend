"""
Script para verificar y configurar Chrome para las pruebas de integración
Este script ayuda a configurar la ruta exacta de tu Chrome con CORS deshabilitado
"""
import os
import sys
from pathlib import Path

def find_chrome_executable():
    """Buscar el ejecutable de Chrome en ubicaciones comunes"""
    common_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Users\{}\AppData\Local\Google\Chrome\Application\chrome.exe".format(os.getenv('USERNAME')),
    ]
    
    for path in common_paths:
        if os.path.exists(path):
            return path
    
    return None

def setup_chrome_config():
    """Configurar Chrome para las pruebas"""
    print("🔧 CONFIGURADOR DE CHROME PARA PRUEBAS DE INTEGRACIÓN")
    print("=" * 60)
    
    # Buscar Chrome
    chrome_path = find_chrome_executable()
    
    if chrome_path:
        print(f"✅ Chrome encontrado: {chrome_path}")
    else:
        print("❌ Chrome no encontrado en ubicaciones comunes")
        chrome_path = input("Ingresa la ruta completa de chrome.exe: ").strip('"')
    
    # Verificar que el archivo existe
    if not os.path.exists(chrome_path):
        print(f"❌ No se puede acceder a: {chrome_path}")
        return False
    
    # Crear configuración personalizada
    config_content = f'''"""
Configuración personalizada generada automáticamente
"""
import os
from config import TestConfig

class CustomChromeConfig(TestConfig):
    """Configuración personalizada para Chrome sin CORS"""
    
    # Ruta de tu Chrome
    CHROME_EXECUTABLE = r"{chrome_path}"
    
    # Directorio temporal para pruebas (evita conflictos con tu Chrome normal)
    CHROME_USER_DATA_DIR = r"C:\\temp\\chrome_test_profile"
    
    # Puerto para debugging remoto
    CHROME_DEBUG_PORT = 9222
    
    # URLs corregidas
    FRONTEND_URL = "http://localhost:5173"
    BACKEND_URL = "http://localhost:8000"
    CONVOCATORIAS_ENDPOINT = "http://localhost:8000/convocatorias/"
    
    # Credenciales de prueba
    TEST_USER_EMAIL = "profesional@test.com"
    TEST_USER_PASSWORD = "test123"
    
    # Opciones de Chrome (equivalente a tu disableCORS.bat)
    CHROME_ADDITIONAL_ARGS = [
        "--disable-web-security",
        "--disable-site-isolation-trials",
        "--allow-running-insecure-content",
        "--disable-blink-features=AutomationControlled",
        "--disable-features=VizDisplayCompositor",
        "--ignore-certificate-errors",
        "--ignore-ssl-errors",
        "--disable-extensions",
        "--no-first-run",
        "--disable-default-apps",
        "--disable-popup-blocking",
        "--disable-translate",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-backgrounding-occluded-windows",
        "--disable-client-side-phishing-detection",
        "--disable-sync",
        "--metrics-recording-only",
        "--no-report-upload",
        "--disable-dev-shm-usage",
        "--no-sandbox",
    ]
    
    STEALTH_MODE = True

def get_chrome_options_like_disable_cors_bat():
    """Retorna las opciones de Chrome que replican tu disableCORS.bat"""
    from selenium.webdriver.chrome.options import Options as ChromeOptions
    
    options = ChromeOptions()
    config = CustomChromeConfig()
    
    # Ejecutable específico
    options.binary_location = config.CHROME_EXECUTABLE
    
    # Crear directorio temporal si no existe
    os.makedirs(config.CHROME_USER_DATA_DIR, exist_ok=True)
    
    # Directorio de datos del usuario
    options.add_argument(f"--user-data-dir={{config.CHROME_USER_DATA_DIR}}")
    
    # Puerto de debug
    options.add_argument(f"--remote-debugging-port={{config.CHROME_DEBUG_PORT}}")
    
    # Todas las opciones adicionales
    for arg in config.CHROME_ADDITIONAL_ARGS:
        options.add_argument(arg)
    
    # Configuración experimental
    if config.STEALTH_MODE:
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        prefs = {{
            "profile.default_content_setting_values.notifications": 2,
            "profile.default_content_settings.popups": 0,
            "profile.managed_default_content_settings.images": 1
        }}
        options.add_experimental_option("prefs", prefs)
    
    return options

custom_config = CustomChromeConfig()

def print_chrome_config():
    """Imprime la configuración actual de Chrome"""
    print("🔧 Configuración de Chrome:")
    print(f"   📁 Ejecutable: {{custom_config.CHROME_EXECUTABLE}}")
    print(f"   📂 User Data: {{custom_config.CHROME_USER_DATA_DIR}}")
    print(f"   🔌 Debug Port: {{custom_config.CHROME_DEBUG_PORT}}")
    print(f"   🌐 Frontend: {{custom_config.FRONTEND_URL}}")
    print(f"   🔐 CORS Deshabilitado: ✅")
    print(f"   🥷 Modo Stealth: {{'✅' if custom_config.STEALTH_MODE else '❌'}}")

if __name__ == "__main__":
    print_chrome_config()
'''
    
    # Escribir archivo de configuración
    config_file = Path("integration-tests") / "chrome_config.py"
    config_file.parent.mkdir(exist_ok=True)
    
    with open(config_file, 'w', encoding='utf-8') as f:
        f.write(config_content)
    
    print(f"✅ Configuración guardada en: {config_file}")
    
    # Crear directorio temporal para Chrome
    temp_dir = r"C:\temp\chrome_test_profile"
    os.makedirs(temp_dir, exist_ok=True)
    print(f"✅ Directorio temporal creado: {temp_dir}")
    
    return True

def test_chrome_config():
    """Probar la configuración de Chrome"""
    print("\n🧪 Probando configuración de Chrome...")
    
    try:
        # Importar configuración
        sys.path.append('integration-tests')
        from chrome_config import get_chrome_options_like_disable_cors_bat, custom_config
        
        print(f"✅ Configuración cargada correctamente")
        print(f"   Chrome: {custom_config.CHROME_EXECUTABLE}")
        print(f"   Frontend: {custom_config.FRONTEND_URL}")
        
        # Probar opciones de Chrome
        options = get_chrome_options_like_disable_cors_bat()
        print(f"✅ Opciones de Chrome configuradas: {len(options.arguments)} argumentos")
        
        return True
        
    except Exception as e:
        print(f"❌ Error en la configuración: {e}")
        return False

if __name__ == "__main__":
    print("🚀 CONFIGURADOR DE CHROME PARA PRUEBAS")
    print("=" * 50)
    
    if setup_chrome_config():
        if test_chrome_config():
            print("\n🎉 ¡Configuración completada exitosamente!")
            print("\n📋 Próximos pasos:")
            print("1. cd integration-tests")
            print("2. python run_tests.py")
            print("\nO usar el script rápido:")
            print("   .\\run_integration_tests.bat")
        else:
            print("\n❌ Error en la configuración")
    else:
        print("\n❌ No se pudo configurar Chrome")
    
    input("\nPresiona Enter para continuar...")
