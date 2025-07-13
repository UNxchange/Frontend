"""
Page Object para el Dashboard Profesional
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from config import config

class DashboardPage:
    """Page Object para el dashboard profesional"""
    
    # Locators
    NAVBAR = (By.CLASS_NAME, "navbar")
    USER_MENU = (By.CLASS_NAME, "user-menu-trigger")
    USER_NAME = (By.CLASS_NAME, "user-name")
    DASHBOARD_TITLE = (By.XPATH, "//h1[contains(text(), 'Creación y Actualización de Convocatorias')]")
    CREATE_CONVOCATORIA_BUTTON = (By.XPATH, "//button[contains(text(), 'Crear Nueva Convocatoria')]")
    ACTION_BUTTONS = (By.CLASS_NAME, "action-buttons")
    WELCOME_SECTION = (By.CLASS_NAME, "welcome-section")
    
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, config.EXPLICIT_WAIT)
    
    def wait_for_page_load(self):
        """Esperar a que el dashboard cargue"""
        try:
            self.wait.until(EC.presence_of_element_located(self.NAVBAR))
            self.wait.until(EC.presence_of_element_located(self.DASHBOARD_TITLE))
            return True
        except TimeoutException:
            return False
    
    def is_dashboard_loaded(self):
        """Verificar si el dashboard está cargado"""
        try:
            dashboard_title = self.driver.find_element(*self.DASHBOARD_TITLE)
            return dashboard_title.is_displayed()
        except:
            return False
    
    def get_user_name(self):
        """Obtener el nombre del usuario logueado"""
        try:
            user_name_element = self.driver.find_element(*self.USER_NAME)
            return user_name_element.text
        except:
            return None
    
    def click_create_convocatoria(self):
        """Hacer clic en el botón de crear convocatoria"""
        try:
            create_btn = self.wait.until(EC.element_to_be_clickable(self.CREATE_CONVOCATORIA_BUTTON))
            create_btn.click()
            return True
        except TimeoutException:
            return False
    
    def is_in_professional_dashboard(self):
        """Verificar que estamos en el dashboard profesional"""
        try:
            # Verificar URL
            if "/dashboard/profesional" not in self.driver.current_url:
                return False
            
            # Verificar título específico
            title_element = self.driver.find_element(*self.DASHBOARD_TITLE)
            return "Creación y Actualización de Convocatorias" in title_element.text
        except:
            return False
    
    def get_current_url(self):
        """Obtener la URL actual"""
        return self.driver.current_url
