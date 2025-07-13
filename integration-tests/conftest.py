"""
Configuración de pytest y fixtures para las pruebas de integración
"""
import pytest
import os
import requests
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from config import config
from chrome_config import get_chrome_options_like_disable_cors_bat, custom_config

class TestReporter:
    """Generador de reportes en PDF usando ReportLab"""
    
    def __init__(self):
        self.test_results = []
        self.start_time = datetime.now()
        
    def add_test_result(self, test_name: str, status: str, duration: float, 
                       error_msg: str = None, screenshot_path: str = None):
        """Agregar resultado de una prueba"""
        self.test_results.append({
            'test_name': test_name,
            'status': status,
            'duration': duration,
            'error_msg': error_msg,
            'screenshot_path': screenshot_path,
            'timestamp': datetime.now()
        })
    
    def generate_pdf_report(self, filename: str = None):
        """Generar reporte PDF con ReportLab"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"integration_test_report_{timestamp}.pdf"
        
        filepath = os.path.join(config.REPORTS_DIR, filename)
        
        # Crear documento
        doc = SimpleDocTemplate(filepath, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Título
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            textColor=colors.darkblue,
            alignment=1  # Center
        )
        story.append(Paragraph("Reporte de Pruebas de Integración", title_style))
        story.append(Spacer(1, 20))
        
        # Información general
        info_style = ParagraphStyle(
            'InfoStyle',
            parent=styles['Normal'],
            fontSize=12,
            spaceAfter=10
        )
        
        end_time = datetime.now()
        duration = end_time - self.start_time
        
        story.append(Paragraph(f"<b>Fecha de ejecución:</b> {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}", info_style))
        story.append(Paragraph(f"<b>Duración total:</b> {duration.total_seconds():.2f} segundos", info_style))
        story.append(Paragraph(f"<b>Total de pruebas:</b> {len(self.test_results)}", info_style))
        
        # Estadísticas
        passed = len([r for r in self.test_results if r['status'] == 'PASSED'])
        failed = len([r for r in self.test_results if r['status'] == 'FAILED'])
        
        story.append(Paragraph(f"<b>Exitosas:</b> {passed}", info_style))
        story.append(Paragraph(f"<b>Fallidas:</b> {failed}", info_style))
        story.append(Spacer(1, 30))
        
        # Tabla de resultados
        data = [['Prueba', 'Estado', 'Duración (s)', 'Error']]
        
        for result in self.test_results:
            status_color = 'green' if result['status'] == 'PASSED' else 'red'
            error_msg = result['error_msg'][:50] + '...' if result['error_msg'] and len(result['error_msg']) > 50 else result['error_msg'] or ''
            
            data.append([
                result['test_name'],
                result['status'],
                f"{result['duration']:.2f}",
                error_msg
            ])
        
        table = Table(data, colWidths=[3*72, 1*72, 1*72, 3*72])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(table)
        
        # Construir PDF
        doc.build(story)
        print(f"📊 Reporte generado: {filepath}")
        return filepath

# Instancia global del reporter
reporter = TestReporter()

@pytest.fixture(scope="session")
def test_reporter():
    """Fixture del reporter para toda la sesión"""
    return reporter

@pytest.fixture(scope="function")
def driver():
    """Fixture del WebDriver con Chrome configurado exactamente como tu disableCORS.bat"""
    driver_instance = None
    
    try:
        # Usar configuración personalizada de Chrome
        if config.BROWSER.lower() == "chrome":
            print("🌐 Configurando Chrome con configuración personalizada (sin CORS)...")
            
            # Usar las opciones que replican tu disableCORS.bat
            options = get_chrome_options_like_disable_cors_bat()
            
            # Configuración adicional para las pruebas
            if config.HEADLESS:
                options.add_argument("--headless")
                print("👻 Modo headless activado")
            else:
                print("🖥️ Modo visible activado")
                
            options.add_argument(f"--window-size={config.WINDOW_SIZE[0]},{config.WINDOW_SIZE[1]}")
            
            # Crear el driver con ChromeDriverManager
            service = ChromeService(ChromeDriverManager().install())
            driver_instance = webdriver.Chrome(service=service, options=options)
            
            # Scripts para evitar detección de automatización (stealth mode)
            if custom_config.STEALTH_MODE:
                driver_instance.execute_script("""
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined,
                    });
                """)
                driver_instance.execute_script("""
                    Object.defineProperty(navigator, 'languages', {
                        get: () => ['es-ES', 'es', 'en'],
                    });
                """)
                driver_instance.execute_script("""
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5],
                    });
                """)
            
            print("✅ Chrome configurado exitosamente con CORS deshabilitado")
            
        elif config.BROWSER.lower() == "firefox":
            options = FirefoxOptions()
            if config.HEADLESS:
                options.add_argument("--headless")
            
            service = FirefoxService(GeckoDriverManager().install())
            driver_instance = webdriver.Firefox(service=service, options=options)
        
        # Configurar timeouts
        driver_instance.implicitly_wait(config.IMPLICIT_WAIT)
        driver_instance.set_page_load_timeout(config.PAGE_LOAD_TIMEOUT)
        
        # Maximizar ventana si no es headless
        if not config.HEADLESS:
            driver_instance.maximize_window()
        
        print(f"🌐 WebDriver listo. Navegando a: {custom_config.FRONTEND_URL}")
        yield driver_instance
        
    except Exception as e:
        print(f"❌ Error configurando WebDriver: {e}")
        if driver_instance:
            try:
                driver_instance.quit()
            except:
                pass
        raise
        
    finally:
        if driver_instance:
            try:
                driver_instance.quit()
                print("🔚 WebDriver cerrado correctamente")
            except Exception as e:
                print(f"⚠️ Error cerrando WebDriver: {e}")

@pytest.fixture(scope="session", autouse=True)
def setup_directories():
    """Crear directorios necesarios para las pruebas"""
    os.makedirs(config.SCREENSHOTS_DIR, exist_ok=True)
    os.makedirs(config.REPORTS_DIR, exist_ok=True)

@pytest.fixture(scope="session", autouse=True)
def check_services():
    """Verificar que los servicios estén disponibles antes de ejecutar las pruebas"""
    print("\n🔍 Verificando servicios...")
    
    # Verificar frontend
    try:
        response = requests.get(config.FRONTEND_URL, timeout=5)
        print(f"✅ Frontend disponible en {config.FRONTEND_URL}")
    except requests.exceptions.RequestException as e:
        pytest.fail(f"❌ Frontend no disponible en {config.FRONTEND_URL}: {e}")
    
    # Verificar backend
    try:
        response = requests.get(f"{config.BACKEND_URL}/docs", timeout=5)
        print(f"✅ Backend disponible en {config.BACKEND_URL}")
    except requests.exceptions.RequestException as e:
        pytest.fail(f"❌ Backend no disponible en {config.BACKEND_URL}: {e}")

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook para capturar resultados de las pruebas"""
    outcome = yield
    rep = outcome.get_result()
    
    if rep.when == "call":
        test_name = item.name
        status = "PASSED" if rep.passed else "FAILED"
        duration = rep.duration
        error_msg = str(rep.longrepr) if rep.failed else None
        
        reporter.add_test_result(test_name, status, duration, error_msg)

@pytest.fixture(scope="session", autouse=True)
def generate_final_report():
    """Generar reporte final al terminar todas las pruebas"""
    yield
    reporter.generate_pdf_report()

def take_screenshot(driver, name: str):
    """Función auxiliar para tomar screenshots"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{name}_{timestamp}.png"
    filepath = os.path.join(config.SCREENSHOTS_DIR, filename)
    
    try:
        driver.save_screenshot(filepath)
        print(f"📸 Screenshot guardado: {filename}")
        return filepath
    except Exception as e:
        print(f"❌ Error al guardar screenshot: {e}")
        return None
