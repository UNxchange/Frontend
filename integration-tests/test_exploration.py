"""
Prueba de exploración para identificar los selectores correctos de tu aplicación
Esta prueba captura información detallada sobre la estructura de la página
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import config

def take_screenshot_debug(driver, name):
    """Tomar screenshot para debugging"""
    import os
    screenshots_dir = "reports/screenshots"
    os.makedirs(screenshots_dir, exist_ok=True)
    filepath = os.path.join(screenshots_dir, f"debug_{name}.png")
    driver.save_screenshot(filepath)
    print(f"📸 Screenshot guardado: {filepath}")

def explore_page_elements(driver):
    """Explorar elementos de la página actual"""
    print(f"\n🔍 Explorando página: {driver.current_url}")
    print(f"📄 Título de la página: {driver.title}")
    
    # Buscar formularios de login
    login_forms = driver.find_elements(By.TAG_NAME, "form")
    print(f"📝 Formularios encontrados: {len(login_forms)}")
    
    # Buscar campos de input
    inputs = driver.find_elements(By.TAG_NAME, "input")
    print(f"📥 Campos de input encontrados: {len(inputs)}")
    for i, input_elem in enumerate(inputs):
        input_type = input_elem.get_attribute("type")
        input_name = input_elem.get_attribute("name")
        input_id = input_elem.get_attribute("id")
        input_placeholder = input_elem.get_attribute("placeholder")
        print(f"   Input {i+1}: type='{input_type}', name='{input_name}', id='{input_id}', placeholder='{input_placeholder}'")
    
    # Buscar botones
    buttons = driver.find_elements(By.TAG_NAME, "button")
    print(f"🔘 Botones encontrados: {len(buttons)}")
    for i, button in enumerate(buttons):
        button_text = button.text.strip()
        button_type = button.get_attribute("type")
        button_class = button.get_attribute("class")
        print(f"   Botón {i+1}: text='{button_text}', type='{button_type}', class='{button_class}'")
    
    # Buscar enlaces
    links = driver.find_elements(By.TAG_NAME, "a")
    print(f"🔗 Enlaces encontrados: {len(links)}")
    for i, link in enumerate(links[:5]):  # Solo mostrar primeros 5
        link_text = link.text.strip()
        link_href = link.get_attribute("href")
        print(f"   Enlace {i+1}: text='{link_text}', href='{link_href}'")

class TestExploration:
    """Suite de pruebas para explorar la aplicación"""
    
    def test_explore_login_page(self, driver):
        """Explorar la página de login para identificar selectores"""
        print("\n🚀 EXPLORACIÓN: Página de Login")
        print("=" * 50)
        
        # Navegar a la página de login
        login_url = f"{config.FRONTEND_URL}/login"
        print(f"🌐 Navegando a: {login_url}")
        driver.get(login_url)
        
        # Esperar que la página cargue
        time.sleep(3)
        take_screenshot_debug(driver, "01_login_page")
        
        # Explorar elementos
        explore_page_elements(driver)
        
        # Intentar encontrar campos específicos por diferentes métodos
        print("\n🔍 Buscando campos de email...")
        email_selectors = [
            (By.ID, "email"),
            (By.NAME, "email"),
            (By.CSS_SELECTOR, "input[type='email']"),
            (By.CSS_SELECTOR, "input[placeholder*='email']"),
            (By.CSS_SELECTOR, "input[placeholder*='Email']"),
            (By.CSS_SELECTOR, "input[placeholder*='correo']"),
            (By.XPATH, "//input[contains(@placeholder, 'email') or contains(@placeholder, 'Email') or contains(@placeholder, 'correo')]")
        ]
        
        for method, selector in email_selectors:
            try:
                elements = driver.find_elements(method, selector)
                if elements:
                    elem = elements[0]
                    print(f"   ✅ Email encontrado con {method}: {selector}")
                    print(f"      Atributos: id='{elem.get_attribute('id')}', name='{elem.get_attribute('name')}', placeholder='{elem.get_attribute('placeholder')}'")
                else:
                    print(f"   ❌ Email NO encontrado con {method}: {selector}")
            except Exception as e:
                print(f"   ⚠️ Error con {method}: {selector} -> {e}")
        
        print("\n🔍 Buscando campos de password...")
        password_selectors = [
            (By.ID, "password"),
            (By.NAME, "password"),
            (By.CSS_SELECTOR, "input[type='password']"),
            (By.CSS_SELECTOR, "input[placeholder*='password']"),
            (By.CSS_SELECTOR, "input[placeholder*='Password']"),
            (By.CSS_SELECTOR, "input[placeholder*='contraseña']"),
            (By.XPATH, "//input[@type='password']")
        ]
        
        for method, selector in password_selectors:
            try:
                elements = driver.find_elements(method, selector)
                if elements:
                    elem = elements[0]
                    print(f"   ✅ Password encontrado con {method.value}: {selector}")
                    print(f"      Atributos: id='{elem.get_attribute('id')}', name='{elem.get_attribute('name')}', placeholder='{elem.get_attribute('placeholder')}'")
                else:
                    print(f"   ❌ Password NO encontrado con {method.value}: {selector}")
            except Exception as e:
                print(f"   ⚠️ Error con {method.value}: {selector} -> {e}")
        
        print("\n🔍 Buscando botones de login...")
        login_button_selectors = [
            (By.CSS_SELECTOR, "button[type='submit']"),
            (By.XPATH, "//button[contains(text(), 'Iniciar')]"),
            (By.XPATH, "//button[contains(text(), 'Login')]"),
            (By.XPATH, "//button[contains(text(), 'Entrar')]"),
            (By.XPATH, "//input[@type='submit']"),
            (By.CSS_SELECTOR, "input[type='submit']")
        ]
        
        for method, selector in login_button_selectors:
            try:
                elements = driver.find_elements(method, selector)
                if elements:
                    elem = elements[0]
                    print(f"   ✅ Botón login encontrado con {method.value}: {selector}")
                    print(f"      Texto: '{elem.text}', type='{elem.get_attribute('type')}', class='{elem.get_attribute('class')}'")
                else:
                    print(f"   ❌ Botón login NO encontrado con {method.value}: {selector}")
            except Exception as e:
                print(f"   ⚠️ Error con {method.value}: {selector} -> {e}")
        
        # Obtener HTML de la página para análisis
        page_source = driver.page_source
        print(f"\n📄 HTML de la página guardado en: reports/login_page_source.html")
        with open("reports/login_page_source.html", "w", encoding="utf-8") as f:
            f.write(page_source)
    
    def test_attempt_login(self, driver):
        """Intentar hacer login con diferentes estrategias"""
        print("\n🔐 EXPLORACIÓN: Intentando Login")
        print("=" * 50)
        
        # Navegar a login
        login_url = f"{config.FRONTEND_URL}/login"
        driver.get(login_url)
        time.sleep(3)
        
        # Estrategia 1: Usar selectores más generales
        try:
            print("🔄 Estrategia 1: Selectores generales...")
            
            # Buscar primer input de tipo email o text
            email_field = None
            for selector in ["input[type='email']", "input[type='text']", "input"]:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        email_field = elements[0]
                        print(f"   📧 Campo email encontrado: {selector}")
                        break
                except:
                    continue
            
            # Buscar input de password
            password_field = None
            try:
                password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
                print("   🔒 Campo password encontrado")
            except:
                print("   ❌ Campo password NO encontrado")
            
            # Buscar botón de submit
            submit_button = None
            for selector in ["button[type='submit']", "input[type='submit']", "button"]:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        submit_button = elements[0]
                        print(f"   🔘 Botón submit encontrado: {selector}")
                        break
                except:
                    continue
            
            # Intentar login si encontramos los campos
            if email_field and password_field and submit_button:
                print("✅ Todos los campos encontrados, intentando login...")
                
                email_field.clear()
                email_field.send_keys(config.TEST_USER_EMAIL)
                print(f"   📧 Email ingresado: {config.TEST_USER_EMAIL}")
                
                password_field.clear()
                password_field.send_keys(config.TEST_USER_PASSWORD)
                print(f"   🔒 Password ingresado: {config.TEST_USER_PASSWORD}")
                
                take_screenshot_debug(driver, "02_before_login_submit")
                
                submit_button.click()
                print("   🖱️ Click en submit")
                
                # Esperar redirección
                time.sleep(5)
                take_screenshot_debug(driver, "03_after_login_submit")
                
                current_url = driver.current_url
                print(f"   🌐 URL después del login: {current_url}")
                
                if "/dashboard" in current_url:
                    print("🎉 ¡Login exitoso! Redirigido al dashboard")
                    self.explore_dashboard(driver)
                else:
                    print("⚠️ No se detectó redirección al dashboard")
                    
            else:
                print("❌ No se pudieron encontrar todos los campos necesarios")
                print(f"   Email field: {'✅' if email_field else '❌'}")
                print(f"   Password field: {'✅' if password_field else '❌'}")
                print(f"   Submit button: {'✅' if submit_button else '❌'}")
                
        except Exception as e:
            print(f"❌ Error en estrategia 1: {e}")
    
    def explore_dashboard(self, driver):
        """Explorar el dashboard profesional"""
        print("\n📊 EXPLORACIÓN: Dashboard Profesional")
        print("=" * 40)
        
        time.sleep(3)
        take_screenshot_debug(driver, "04_dashboard")
        
        # Explorar elementos del dashboard
        explore_page_elements(driver)
        
        # Buscar botón "Crear Nueva Convocatoria"
        print("\n🔍 Buscando botón 'Crear Nueva Convocatoria'...")
        create_button_selectors = [
            (By.XPATH, "//button[contains(text(), 'Crear Nueva Convocatoria')]"),
            (By.XPATH, "//button[contains(text(), 'Crear Convocatoria')]"),
            (By.XPATH, "//button[contains(text(), 'Nueva Convocatoria')]"),
            (By.XPATH, "//a[contains(text(), 'Crear Nueva Convocatoria')]"),
            (By.XPATH, "//a[contains(text(), 'Crear Convocatoria')]"),
            (By.CSS_SELECTOR, "button[class*='create']"),
            (By.CSS_SELECTOR, "button[class*='nuevo']"),
            (By.CSS_SELECTOR, "button[class*='new']")
        ]
        
        create_button = None
        for method, selector in create_button_selectors:
            try:
                elements = driver.find_elements(method, selector)
                if elements:
                    create_button = elements[0]
                    print(f"   ✅ Botón crear encontrado con {method.value}: {selector}")
                    print(f"      Texto: '{create_button.text}', class='{create_button.get_attribute('class')}'")
                    break
                else:
                    print(f"   ❌ Botón crear NO encontrado con {method.value}: {selector}")
            except Exception as e:
                print(f"   ⚠️ Error con {method.value}: {selector} -> {e}")
        
        # Intentar hacer click en el botón si lo encontramos
        if create_button:
            try:
                print("🖱️ Haciendo click en 'Crear Nueva Convocatoria'...")
                create_button.click()
                time.sleep(3)
                take_screenshot_debug(driver, "05_after_create_click")
                
                current_url = driver.current_url
                print(f"   🌐 URL después del click: {current_url}")
                
                # Explorar formulario de creación
                self.explore_create_form(driver)
                
            except Exception as e:
                print(f"❌ Error haciendo click: {e}")
        else:
            print("❌ No se encontró el botón 'Crear Nueva Convocatoria'")
    
    def explore_create_form(self, driver):
        """Explorar el formulario de creación de convocatorias"""
        print("\n📝 EXPLORACIÓN: Formulario de Creación")
        print("=" * 40)
        
        take_screenshot_debug(driver, "06_create_form")
        
        # Explorar elementos del formulario
        explore_page_elements(driver)
        
        # Buscar campos específicos del formulario
        form_fields = [
            "institution", "country", "agreementType", "validity", 
            "state", "subscriptionLevel", "languages", "dreLink",
            "agreementLink", "Props", "internationalLink"
        ]
        
        print("\n🔍 Buscando campos del formulario...")
        for field_name in form_fields:
            selectors = [
                (By.ID, field_name),
                (By.NAME, field_name),
                (By.CSS_SELECTOR, f"input[name='{field_name}']"),
                (By.CSS_SELECTOR, f"select[name='{field_name}']"),
                (By.CSS_SELECTOR, f"textarea[name='{field_name}']"),
                (By.XPATH, f"//input[@name='{field_name}']"),
                (By.XPATH, f"//select[@name='{field_name}']"),
                (By.XPATH, f"//textarea[@name='{field_name}']")
            ]
            
            found = False
            for method, selector in selectors:
                try:
                    elements = driver.find_elements(method, selector)
                    if elements:
                        elem = elements[0]
                        print(f"   ✅ {field_name}: {method.value} = {selector}")
                        print(f"      Tag: {elem.tag_name}, Type: {elem.get_attribute('type')}")
                        found = True
                        break
                except:
                    continue
            
            if not found:
                print(f"   ❌ {field_name}: NO encontrado")
        
        # Buscar botón de submit del formulario
        print("\n🔍 Buscando botón 'Crear Convocatoria'...")
        submit_selectors = [
            (By.XPATH, "//button[contains(text(), 'Crear Convocatoria')]"),
            (By.XPATH, "//button[contains(text(), 'Guardar')]"),
            (By.XPATH, "//button[contains(text(), 'Enviar')]"),
            (By.CSS_SELECTOR, "button[type='submit']"),
            (By.CSS_SELECTOR, "input[type='submit']")
        ]
        
        for method, selector in submit_selectors:
            try:
                elements = driver.find_elements(method, selector)
                if elements:
                    elem = elements[0]
                    print(f"   ✅ Botón submit encontrado: {method.value} = {selector}")
                    print(f"      Texto: '{elem.text}', type='{elem.get_attribute('type')}'")
                else:
                    print(f"   ❌ Botón submit NO encontrado: {method.value} = {selector}")
            except Exception as e:
                print(f"   ⚠️ Error: {method.value} = {selector} -> {e}")

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
