"""
Page Object para la página de Login
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from config import config

class LoginPage:
    """Page Object para la página de login"""
    
    # Locators basados en la exploración real de la aplicación
    USERNAME_INPUT = (By.CSS_SELECTOR, "input[placeholder='Username']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[placeholder='Password']")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "button.login-button")
    
    # Locators alternativos
    USERNAME_INPUT_ALT = (By.CSS_SELECTOR, "input[type='text']")
    PASSWORD_INPUT_ALT = (By.CSS_SELECTOR, "input[type='password']")
    LOGIN_BUTTON_ALT = (By.CSS_SELECTOR, "button[type='submit']")
    
    ERROR_MESSAGE = (By.CSS_SELECTOR, ".error-message, .alert-danger, [class*='error']")
    LOADING_INDICATOR = (By.XPATH, "//button[contains(text(), 'Loading') or contains(text(), 'Cargando')]")
    
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, config.EXPLICIT_WAIT)
    
    def navigate_to_login(self):
        """Navegar a la página de login"""
        self.driver.get(f"{config.FRONTEND_URL}/login")
        self.wait_for_page_load()
    
    def wait_for_page_load(self):
        """Esperar a que la página cargue completamente"""
        try:
            # Intentar con el selector principal
            self.wait.until(EC.presence_of_element_located(self.USERNAME_INPUT))
            return True
        except TimeoutException:
            try:
                # Intentar con selector alternativo
                self.wait.until(EC.presence_of_element_located(self.USERNAME_INPUT_ALT))
                return True
            except TimeoutException:
                print("❌ No se pudo encontrar el campo de usuario en la página de login")
                return False
    
    def enter_username(self, username: str):
        """Introducir username (email)"""
        try:
            username_field = self.wait.until(EC.element_to_be_clickable(self.USERNAME_INPUT))
        except TimeoutException:
            username_field = self.wait.until(EC.element_to_be_clickable(self.USERNAME_INPUT_ALT))
        
        username_field.clear()
        username_field.send_keys(username)
        print(f"📧 Username ingresado: {username}")
    
    def enter_password(self, password: str):
        """Introducir contraseña"""
        try:
            password_field = self.wait.until(EC.element_to_be_clickable(self.PASSWORD_INPUT))
        except TimeoutException:
            password_field = self.wait.until(EC.element_to_be_clickable(self.PASSWORD_INPUT_ALT))
            
        password_field.clear()
        password_field.send_keys(password)
        print(f"🔒 Password ingresado: {'*' * len(password)}")
    
    def click_login_button(self):
        """Hacer clic en el botón de login"""
        try:
            login_button = self.wait.until(EC.element_to_be_clickable(self.LOGIN_BUTTON))
        except TimeoutException:
            login_button = self.wait.until(EC.element_to_be_clickable(self.LOGIN_BUTTON_ALT))
            
        login_button.click()
        print("🖱️ Click en botón de login")
    
    def login(self, username: str, password: str):
        """Realizar login completo"""
        print(f"🔐 Iniciando login con usuario: {username}")
        self.enter_username(username)
        self.enter_password(password)
        self.click_login_button()
        
        # Esperar un momento para que procese el login
        import time
        time.sleep(3)
        
        return True
    
    def get_error_message(self):
        """Obtener mensaje de error si existe"""
        try:
            error_element = self.driver.find_element(*self.ERROR_MESSAGE)
            return error_element.text
        except:
            return None
    
    def is_login_successful(self):
        """Verificar si el login fue exitoso (no estamos en login page)"""
        try:
            # Si ya no estamos en la página de login, el login fue exitoso
            self.wait.until(lambda driver: "/login" not in driver.current_url)
            return True
        except TimeoutException:
            return False
    
    def wait_for_redirect(self, expected_path: str = None):
        """Esperar redirección después del login"""
        try:
            if expected_path:
                self.wait.until(lambda driver: expected_path in driver.current_url)
            else:
                self.wait.until(lambda driver: "/login" not in driver.current_url)
            return True
        except TimeoutException:
            return False
