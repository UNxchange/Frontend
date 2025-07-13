"""
Configuración para las pruebas de integración
"""
import os
from typing import Dict, Any

class TestConfig:
    """Configuración centralizada para las pruebas"""
    
    # URLs de los servicios
    FRONTEND_URL: str = "http://localhost:3001"  # Puerto del frontend principal
    BACKEND_URL: str = "http://localhost:8000"
    CONVOCATORIAS_ENDPOINT: str = f"{BACKEND_URL}/convocatorias/"
    
    # Credenciales de prueba
    TEST_USER_EMAIL: str = "profesional@gmail.com"
    TEST_USER_PASSWORD: str = "1234"
    TEST_USER_ROLE: str = "profesional"
    
    # Configuración de Selenium
    IMPLICIT_WAIT: int = 10
    EXPLICIT_WAIT: int = 20
    PAGE_LOAD_TIMEOUT: int = 30
    
    # Configuración específica de Chrome con CORS deshabilitado
    CHROME_EXECUTABLE: str = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    CHROME_USER_DATA_DIR: str = r"C:\Users\ABC PRODUCCIONES\AppData\Local\Google\Chrome\User Data\TestProfile"
    DISABLE_CORS: bool = True
    CHROME_DEBUG_PORT: int = 9222
    
    # Paths para archivos
    SCREENSHOTS_DIR: str = os.path.join(os.path.dirname(__file__), "screenshots")
    REPORTS_DIR: str = os.path.join(os.path.dirname(__file__), "reports")
    
    # Configuración del navegador
    BROWSER: str = "chrome"  # chrome, firefox, edge
    HEADLESS: bool = False
    WINDOW_SIZE: tuple = (1920, 1080)
    
    # Datos de prueba para convocatoria
    TEST_CONVOCATORIA_DATA: Dict[str, Any] = {
        "subscriptionYear": "2024",
        "country": "Alemania",
        "institution": "Universidad de Prueba",
        "agreementType": "Intercambio",
        "validity": "December - 2024",
        "state": "Vigente",
        "subscriptionLevel": "Universidad Nacional de Colombia",
        "languages": ["Español", "Alemán"],
        "dreLink": "https://www.example.com/dre",
        "agreementLink": "https://www.example.com/agreement",
        "Props": "Prueba de integración automatizada",
        "internationalLink": "https://www.example.com/international"
    }

# Instancia global de configuración
config = TestConfig()
