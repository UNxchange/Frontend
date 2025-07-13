"""
Prueba de debugging específica para los campos problemáticos:
1. Año de Suscripción *
2. Botón "Crear Convocatoria"
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def debug_subscription_year_field(driver):
    """Debug específico para el campo Año de Suscripción"""
    print("\n🔍 DEBUGGING: Campo 'Año de Suscripción *'")
    
    # Buscar el campo con múltiples estrategias
    year_selectors = [
        # Por label
        "//label[contains(text(), 'Año de Suscripción')]/..//select",
        "//label[contains(text(), 'Año de Suscripción')]/..//input", 
        "//label[contains(text(), 'Año')]/..//select",
        "//label[contains(text(), 'Año')]/..//input",
        
        # Por name/id
        "select[name*='year']",
        "select[name*='Year']", 
        "select[name*='subscripción']",
        "select[name*='subscription']",
        "input[name*='year']",
        "input[name*='Year']",
        
        # Por id
        "#subscriptionYear",
        "#year",
        "#año",
        
        # Por placeholder
        "select[placeholder*='año']",
        "select[placeholder*='Año']",
        "input[placeholder*='año']",
        "input[placeholder*='Año']",
        
        # Genérico
        "select",
        "input[type='number']"
    ]
    
    year_field = None
    
    for selector in year_selectors:
        try:
            if selector.startswith("//"):
                # XPath
                elements = driver.find_elements(By.XPATH, selector)
            else:
                # CSS
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
            
            for element in elements:
                if element.is_displayed():
                    # Verificar si es el campo correcto
                    label_text = ""
                    try:
                        # Buscar label asociado
                        parent = element.find_element(By.XPATH, "./..")
                        label = parent.find_element(By.TAG_NAME, "label")
                        label_text = label.text
                    except:
                        try:
                            # Buscar por aria-label
                            label_text = element.get_attribute("aria-label") or ""
                        except:
                            pass
                    
                    if ("año" in label_text.lower() or "year" in label_text.lower() or 
                        "suscripción" in label_text.lower() or "subscription" in label_text.lower()):
                        year_field = element
                        print(f"✅ Campo encontrado con selector: {selector}")
                        print(f"   Label asociado: '{label_text}'")
                        print(f"   Tag: {element.tag_name}")
                        print(f"   Type: {element.get_attribute('type')}")
                        print(f"   Name: {element.get_attribute('name')}")
                        print(f"   ID: {element.get_attribute('id')}")
                        print(f"   Value actual: '{element.get_attribute('value')}'")
                        break
            
            if year_field:
                break
                
        except Exception as e:
            continue
    
    if not year_field:
        print("❌ No se encontró el campo 'Año de Suscripción'")
        
        # Mostrar todos los selects e inputs
        print("\n📋 TODOS LOS SELECTS DISPONIBLES:")
        selects = driver.find_elements(By.TAG_NAME, "select")
        for i, select in enumerate(selects):
            if select.is_displayed():
                print(f"   {i+1}. ID: '{select.get_attribute('id')}', Name: '{select.get_attribute('name')}'")
                print(f"       Opciones: {[opt.text for opt in select.find_elements(By.TAG_NAME, 'option')]}")
        
        print("\n📋 TODOS LOS INPUTS NUMÉRICOS:")
        inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='number'], input[type='text']")
        for i, inp in enumerate(inputs):
            if inp.is_displayed():
                print(f"   {i+1}. ID: '{inp.get_attribute('id')}', Name: '{inp.get_attribute('name')}'")
                print(f"       Placeholder: '{inp.get_attribute('placeholder')}'")
        
        return None
    
    return year_field

def debug_create_button(driver):
    """Debug específico para el botón 'Crear Convocatoria'"""
    print("\n🔍 DEBUGGING: Botón 'Crear Convocatoria'")
    
    # Buscar botones que puedan ser el de envío
    submit_selectors = [
        # Por texto específico
        "//button[contains(text(), 'Crear Convocatoria')]",
        "//button[contains(text(), 'Crear')]",
        "//button[contains(text(), 'Enviar')]", 
        "//button[contains(text(), 'Guardar')]",
        "//button[contains(text(), 'Submit')]",
        
        # Por tipo
        "button[type='submit']",
        "input[type='submit']",
        
        # Por clase
        "button[class*='submit']",
        "button[class*='create']",
        "button[class*='primary']",
        "button[class*='btn-primary']",
        
        # Dentro del formulario
        "form button",
        "form input[type='submit']"
    ]
    
    submit_button = None
    
    for selector in submit_selectors:
        try:
            if selector.startswith("//"):
                buttons = driver.find_elements(By.XPATH, selector)
            else:
                buttons = driver.find_elements(By.CSS_SELECTOR, selector)
            
            for button in buttons:
                if button.is_displayed() and button.is_enabled():
                    submit_button = button
                    print(f"✅ Botón encontrado con selector: {selector}")
                    print(f"   Texto: '{button.text}'")
                    print(f"   Type: {button.get_attribute('type')}")
                    print(f"   Class: {button.get_attribute('class')}'")
                    print(f"   Enabled: {button.is_enabled()}")
                    break
            
            if submit_button:
                break
                
        except Exception as e:
            continue
    
    if not submit_button:
        print("❌ No se encontró botón de envío")
        
        # Mostrar todos los botones
        print("\n📋 TODOS LOS BOTONES DISPONIBLES:")
        buttons = driver.find_elements(By.TAG_NAME, "button")
        for i, btn in enumerate(buttons):
            if btn.is_displayed():
                print(f"   {i+1}. Texto: '{btn.text}'")
                print(f"       Type: '{btn.get_attribute('type')}'")
                print(f"       Class: '{btn.get_attribute('class')}'")
                print(f"       Enabled: {btn.is_enabled()}")
                print("       ---")
        
        return None
    
    return submit_button

def test_debug_problematic_fields(driver):
    """
    Prueba específica para debuggear los campos problemáticos
    """
    print("\n" + "="*70)
    print("🐛 DEBUG: CAMPOS PROBLEMÁTICOS")
    print("="*70)
    
    email = custom_config.TEST_USER_EMAIL
    password = custom_config.TEST_USER_PASSWORD
    
    try:
        # === LOGIN RÁPIDO ===
        print("🚀 Login rápido...")
        login_url = f"{custom_config.FRONTEND_URL}/login"
        driver.get(login_url)
        time.sleep(2)
        
        # Login
        email_field = driver.find_element(By.CSS_SELECTOR, "input[type='text'], input[type='email']")
        password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        email_field.send_keys(email)
        password_field.send_keys(password)
        
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit'], button")
        login_button.click()
        time.sleep(5)
        
        # Cerrar popups
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        except:
            pass
        
        print("✅ Login completado")
        
        # === ABRIR FORMULARIO ===
        print("\n📋 Abriendo formulario...")
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        create_button.click()
        time.sleep(3)
        
        driver.save_screenshot("reports/screenshots/debug_form_opened.png")
        print("✅ Formulario abierto")
        
        # === DEBUG CAMPO AÑO ===
        year_field = debug_subscription_year_field(driver)
        
        if year_field:
            print(f"\n🔧 Intentando llenar campo año...")
            
            # Intentar diferentes métodos
            methods = [
                {"name": "Select dropdown", "action": lambda: select_year_dropdown(year_field)},
                {"name": "Clear + SendKeys", "action": lambda: clear_and_type(year_field, "2024")},
                {"name": "JavaScript setValue", "action": lambda: js_set_value(driver, year_field, "2024")},
                {"name": "Click + SendKeys", "action": lambda: click_and_type(year_field, "2024")}
            ]
            
            for method in methods:
                try:
                    print(f"   🔍 Probando: {method['name']}")
                    method['action']()
                    
                    # Verificar si funcionó
                    new_value = year_field.get_attribute('value')
                    if new_value and new_value != "":
                        print(f"   ✅ ¡Éxito con {method['name']}! Valor: '{new_value}'")
                        break
                    else:
                        print(f"   ❌ {method['name']} no funcionó")
                        
                except Exception as e:
                    print(f"   ❌ {method['name']} falló: {e}")
        
        # === DEBUG BOTÓN CREAR ===
        print(f"\n📤 Buscando botón de envío...")
        submit_button = debug_create_button(driver)
        
        if submit_button:
            print(f"\n🖱️ Intentando hacer clic en botón...")
            
            # Scroll al botón
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", submit_button)
            time.sleep(1)
            
            # Intentar clic
            click_methods = [
                {"name": "Clic directo", "action": lambda: submit_button.click()},
                {"name": "JavaScript click", "action": lambda: driver.execute_script("arguments[0].click();", submit_button)},
                {"name": "Submit form", "action": lambda: submit_via_form(driver)}
            ]
            
            for method in click_methods:
                try:
                    print(f"   🔍 Probando: {method['name']}")
                    initial_url = driver.current_url
                    method['action']()
                    time.sleep(2)
                    
                    final_url = driver.current_url
                    if final_url != initial_url:
                        print(f"   ✅ ¡Éxito con {method['name']}! URL cambió a: {final_url}")
                        break
                    else:
                        print(f"   ⚠️ {method['name']} ejecutado pero sin cambio de URL")
                        
                except Exception as e:
                    print(f"   ❌ {method['name']} falló: {e}")
        
        driver.save_screenshot("reports/screenshots/debug_final_state.png")
        print("\n📸 Screenshot final: debug_final_state.png")
        
    except Exception as e:
        print(f"\n❌ Error en debugging: {e}")
        driver.save_screenshot("reports/screenshots/debug_error.png")
        raise

def select_year_dropdown(field):
    """Intentar usar como dropdown"""
    if field.tag_name == "select":
        select = Select(field)
        # Intentar seleccionar 2024
        try:
            select.select_by_value("2024")
        except:
            try:
                select.select_by_visible_text("2024")
            except:
                # Seleccionar primera opción disponible
                options = select.options
                if len(options) > 1:
                    select.select_by_index(1)

def clear_and_type(field, value):
    """Limpiar y escribir"""
    field.clear()
    field.send_keys(value)

def js_set_value(driver, field, value):
    """Usar JavaScript para setear valor"""
    driver.execute_script("arguments[0].value = arguments[1];", field, value)
    driver.execute_script("arguments[0].dispatchEvent(new Event('change'));", field)

def click_and_type(field, value):
    """Hacer clic y escribir"""
    field.click()
    time.sleep(0.5)
    field.send_keys(Keys.CONTROL + "a")  # Seleccionar todo
    field.send_keys(value)

def submit_via_form(driver):
    """Enviar usando el formulario"""
    form = driver.find_element(By.TAG_NAME, "form")
    driver.execute_script("arguments[0].submit();", form)

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
