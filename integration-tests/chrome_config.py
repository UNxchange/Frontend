"""
Configuración personalizada para usar Chrome con CORS deshabilitado
Este archivo permite configurar la ruta exacta de tu ejecutable Chrome
"""
import os
from config import TestConfig

class CustomChromeConfig(TestConfig):
    """Configuración personalizada para Chrome sin CORS"""
    
    # PERSONALIZA ESTA RUTA SEGÚN TU CONFIGURACIÓN
    # Si tienes un .bat que lanza Chrome, especifica la ruta del ejecutable de Chrome
    CHROME_EXECUTABLE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    
    # Directorio de datos del usuario personalizado para pruebas
    CHROME_USER_DATA_DIR = r"C:\Users\ABC PRODUCCIONES\AppData\Local\Google\Chrome\User Data\TestProfile"
    
    # Puerto para debugging remoto (debe ser único)
    CHROME_DEBUG_PORT = 9222
    
    # Opciones adicionales de Chrome (equivalente a tu disableCORS.bat)
    CHROME_ADDITIONAL_ARGS = [
        "--disable-web-security",           # Deshabilitar seguridad web (CORS)
        "--disable-site-isolation-trials",  # Deshabilitar aislamiento de sitios
        "--allow-running-insecure-content", # Permitir contenido inseguro
        "--disable-blink-features=AutomationControlled", # Evitar detección de automatización
        "--disable-features=VizDisplayCompositor",
        "--ignore-certificate-errors",      # Ignorar errores de certificados
        "--ignore-ssl-errors",             # Ignorar errores SSL
        "--allow-running-insecure-content", # Permitir contenido HTTP en HTTPS
        "--disable-extensions",            # Deshabilitar extensiones
        "--no-first-run",                  # No mostrar pantalla de primer uso
        "--disable-default-apps",          # No instalar apps por defecto
        "--disable-popup-blocking",        # No bloquear popups
        "--disable-translate",             # Deshabilitar traductor
        "--disable-background-timer-throttling", # No limitar timers en background
        "--disable-renderer-backgrounding", # No limitar renderers en background
        "--disable-backgrounding-occluded-windows", # No limitar ventanas ocultas
        "--disable-client-side-phishing-detection", # Deshabilitar detección de phishing
        "--disable-sync",                  # Deshabilitar sincronización
        "--metrics-recording-only",        # Solo grabación de métricas
        "--no-report-upload",              # No subir reportes
        "--disable-dev-shm-usage",         # Para contenedores Docker/CI
        "--no-sandbox",                    # Para contenedores Docker/CI
        # === NUEVAS OPCIONES PARA DESHABILITAR GESTOR DE CONTRASEÑAS ===
        "--disable-password-manager",      # Deshabilitar gestor de contraseñas
        "--disable-save-password-bubble",  # Deshabilitar popup de guardar contraseña
        "--disable-password-manager-reauthentication", # Deshabilitar reautenticación
        "--disable-features=PasswordManager", # Deshabilitar función de contraseñas
        "--disable-features=PasswordManagerOnboarding", # Deshabilitar onboarding
        "--disable-features=InsecurePasswordInput", # Deshabilitar advertencias de contraseñas inseguras
        "--disable-features=PasswordImport", # Deshabilitar importación de contraseñas
        "--disable-features=PasswordExport", # Deshabilitar exportación de contraseñas
        "--disable-infobars",              # Deshabilitar barras de información
        "--disable-notifications",         # Deshabilitar notificaciones
        "--disable-component-extensions-with-background-pages", # Deshabilitar extensiones de componentes
    ]
    
    # Configuración para evitar detección de automatización
    STEALTH_MODE = True
    
    # URLs corregidas para tu configuración
    FRONTEND_URL = "http://localhost:3001"  # Puerto del frontend principal
    
    # Credenciales actualizadas
    TEST_USER_EMAIL = "profesional@gmail.com"
    TEST_USER_PASSWORD = "1234"

def get_chrome_options_like_disable_cors_bat():
    """
    Retorna las opciones de Chrome que replican tu disableCORS.bat
    
    Si tu disableCORS.bat contiene algo como:
    "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\temp\chrome"
    
    Esta función replica esas mismas opciones
    """
    from selenium.webdriver.chrome.options import Options as ChromeOptions
    
    options = ChromeOptions()
    config = CustomChromeConfig()
    
    # Ejecutable específico
    if config.CHROME_EXECUTABLE:
        options.binary_location = config.CHROME_EXECUTABLE
    
    # Directorio de datos del usuario
    options.add_argument(f"--user-data-dir={config.CHROME_USER_DATA_DIR}")
    
    # Puerto de debug
    options.add_argument(f"--remote-debugging-port={config.CHROME_DEBUG_PORT}")
    
    # Todas las opciones adicionales
    for arg in config.CHROME_ADDITIONAL_ARGS:
        options.add_argument(arg)
    
    # Configuración experimental para evitar detección
    if config.STEALTH_MODE:
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        
        # Preferencias del navegador - DESHABILITAR COMPLETAMENTE GESTOR DE CONTRASEÑAS
        prefs = {
            # Deshabilitar notificaciones
            "profile.default_content_setting_values.notifications": 2,
            "profile.default_content_settings.popups": 0,
            "profile.managed_default_content_settings.images": 1,
            
            # === DESHABILITAR GESTOR DE CONTRASEÑAS COMPLETAMENTE ===
            "profile.password_manager_enabled": False,
            "credentials_enable_service": False,
            "password_manager_enabled": False,
            "profile.password_manager_leak_detection": False,
            "safebrowsing.enabled": False,
            "safebrowsing.disable_download_protection": True,
            "profile.default_content_setting_values.automatic_downloads": 1,
            
            # Deshabilitar advertencias de seguridad
            "browser.password_manager.enabled": False,
            "autofill.profile_enabled": False,
            "autofill.credit_card_enabled": False,
            "profile.default_content_setting_values.auto_select_certificate": 1,
            
            # Deshabilitar sync y servicios de Google
            "sync.disabled": True,
            "signin.allowed": False,
            "browser.signin.enabled": False,
            
            # Deshabilitar infobars y popups de advertencia
            "browser.enable_spellchecking": False,
            "spellcheck.dictionaries": [],
            "translate.enabled": False,
            "profile.default_content_setting_values.media_stream": 1,
        }
        options.add_experimental_option("prefs", prefs)
    
    return options

# Instancia de configuración personalizada
custom_config = CustomChromeConfig()

# Función helper para imprimir la configuración actual
def print_chrome_config():
    """Imprime la configuración actual de Chrome"""
    print("🔧 Configuración de Chrome:")
    print(f"   📁 Ejecutable: {custom_config.CHROME_EXECUTABLE}")
    print(f"   📂 User Data: {custom_config.CHROME_USER_DATA_DIR}")
    print(f"   🔌 Debug Port: {custom_config.CHROME_DEBUG_PORT}")
    print(f"   🌐 Frontend: {custom_config.FRONTEND_URL}")
    print(f"   🔐 CORS Deshabilitado: ✅")
    print(f"   🥷 Modo Stealth: {'✅' if custom_config.STEALTH_MODE else '❌'}")

if __name__ == "__main__":
    print_chrome_config()
