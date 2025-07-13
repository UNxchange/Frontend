"""
Prueba simple para hacer login directamente con los selectores que sabemos que funcionan
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config import config

def take_screenshot_simple(driver, name):
    """Tomar screenshot"""
    import os
    screenshots_dir = "reports/screenshots"
    os.makedirs(screenshots_dir, exist_ok=True)
    filepath = os.path.join(screenshots_dir, f"simple_{name}.png")
    driver.save_screenshot(filepath)
    print(f"📸 Screenshot: {filepath}")

class TestSimpleLogin:
    """Prueba simple de login"""
    
    def test_simple_login_and_create_convocatoria(self, driver):
        """Prueba simple: login y crear convocatoria"""
        print("\n🚀 PRUEBA SIMPLE: Login y Crear Convocatoria")
        print("=" * 60)
        
        wait = WebDriverWait(driver, 10)
        
        # === PASO 1: NAVEGAR AL LOGIN ===
        print("📍 Paso 1: Navegando al login...")
        login_url = f"{config.FRONTEND_URL}/login"
        driver.get(login_url)
        time.sleep(3)
        take_screenshot_simple(driver, "01_login_page")
        print(f"🌐 URL actual: {driver.current_url}")
        
        # === PASO 2: LLENAR FORMULARIO DE LOGIN ===
        print("📝 Paso 2: Llenando formulario de login...")
        
        # Buscar campo de username (sabemos que tiene placeholder='Username')
        try:
            username_field = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Username']")
            print("✅ Campo username encontrado")
        except:
            try:
                username_field = driver.find_element(By.CSS_SELECTOR, "input[type='text']")
                print("✅ Campo username encontrado (alternativo)")
            except:
                print("❌ Campo username NO encontrado")
                raise
        
        # Buscar campo de password
        try:
            password_field = driver.find_element(By.CSS_SELECTOR, "input[placeholder='Password']")
            print("✅ Campo password encontrado")
        except:
            try:
                password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
                print("✅ Campo password encontrado (alternativo)")
            except:
                # Buscar TODOS los inputs para ver qué hay
                all_inputs = driver.find_elements(By.TAG_NAME, "input")
                print(f"❌ Campo password NO encontrado. Total inputs: {len(all_inputs)}")
                for i, inp in enumerate(all_inputs):
                    input_type = inp.get_attribute("type")
                    input_placeholder = inp.get_attribute("placeholder")
                    print(f"   Input {i+1}: type='{input_type}', placeholder='{input_placeholder}'")
                raise
        
        # Buscar botón de login
        try:
            login_button = driver.find_element(By.CSS_SELECTOR, "button.login-button")
            print("✅ Botón login encontrado")
        except:
            try:
                login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
                print("✅ Botón login encontrado (alternativo)")
            except:
                print("❌ Botón login NO encontrado")
                raise
        
        # === PASO 3: REALIZAR LOGIN ===
        print("🔐 Paso 3: Realizando login...")
        username_field.clear()
        username_field.send_keys(config.TEST_USER_EMAIL)
        print(f"📧 Username ingresado: {config.TEST_USER_EMAIL}")
        
        password_field.clear()
        password_field.send_keys(config.TEST_USER_PASSWORD)
        print(f"🔒 Password ingresado: {config.TEST_USER_PASSWORD}")
        
        take_screenshot_simple(driver, "02_before_login")
        
        login_button.click()
        print("🖱️ Click en login")
        
        # Esperar redirección
        time.sleep(5)
        take_screenshot_simple(driver, "03_after_login")
        
        current_url = driver.current_url
        print(f"🌐 URL después del login: {current_url}")
        
        # === PASO 4: VERIFICAR REDIRECCIÓN ===
        if "/dashboard" in current_url:
            print("🎉 ¡Login exitoso! Redirigido al dashboard")
            
            # === PASO 5: BUSCAR BOTÓN CREAR CONVOCATORIA ===
            print("📊 Paso 5: Buscando botón 'Crear Nueva Convocatoria'...")
            
            # Buscar botones con texto relacionado
            buttons = driver.find_elements(By.TAG_NAME, "button")
            print(f"🔘 Total botones encontrados: {len(buttons)}")
            
            create_button = None
            for i, button in enumerate(buttons):
                button_text = button.text.strip()
                print(f"   Botón {i+1}: '{button_text}'")
                if any(word in button_text.lower() for word in ['crear', 'nueva', 'convocatoria', 'new', 'create']):
                    create_button = button
                    print(f"   ✅ Botón encontrado: '{button_text}'")
                    break
            
            if not create_button:
                # Buscar enlaces también
                links = driver.find_elements(By.TAG_NAME, "a")
                print(f"🔗 Total enlaces encontrados: {len(links)}")
                
                for i, link in enumerate(links):
                    link_text = link.text.strip()
                    print(f"   Enlace {i+1}: '{link_text}'")
                    if any(word in link_text.lower() for word in ['crear', 'nueva', 'convocatoria', 'new', 'create']):
                        create_button = link
                        print(f"   ✅ Enlace encontrado: '{link_text}'")
                        break
            
            if create_button:
                print("🖱️ Haciendo click en 'Crear Nueva Convocatoria'...")
                driver.execute_script("arguments[0].scrollIntoView();", create_button)
                time.sleep(1)
                create_button.click()
                time.sleep(3)
                take_screenshot_simple(driver, "04_after_create_click")
                
                current_url = driver.current_url
                print(f"🌐 URL después del click: {current_url}")
                
                # === PASO 6: EXPLORAR FORMULARIO ===
                print("📝 Paso 6: Explorando formulario de creación...")
                
                # Buscar todos los inputs del formulario
                form_inputs = driver.find_elements(By.TAG_NAME, "input")
                print(f"📥 Campos de input en formulario: {len(form_inputs)}")
                
                for i, inp in enumerate(form_inputs):
                    input_name = inp.get_attribute("name")
                    input_type = inp.get_attribute("type")
                    input_placeholder = inp.get_attribute("placeholder")
                    print(f"   Input {i+1}: name='{input_name}', type='{input_type}', placeholder='{input_placeholder}'")
                
                # Buscar selects
                selects = driver.find_elements(By.TAG_NAME, "select")
                print(f"📋 Campos select: {len(selects)}")
                
                for i, sel in enumerate(selects):
                    select_name = sel.get_attribute("name")
                    print(f"   Select {i+1}: name='{select_name}'")
                
                # Buscar textareas
                textareas = driver.find_elements(By.TAG_NAME, "textarea")
                print(f"📝 Campos textarea: {len(textareas)}")
                
                for i, ta in enumerate(textareas):
                    textarea_name = ta.get_attribute("name")
                    print(f"   Textarea {i+1}: name='{textarea_name}'")
                
                # Buscar botón de crear convocatoria
                form_buttons = driver.find_elements(By.TAG_NAME, "button")
                print(f"🔘 Botones en formulario: {len(form_buttons)}")
                
                for i, btn in enumerate(form_buttons):
                    button_text = btn.text.strip()
                    button_type = btn.get_attribute("type")
                    print(f"   Botón {i+1}: text='{button_text}', type='{button_type}'")
                
                print("✅ Exploración del formulario completada")
                
            else:
                print("❌ No se encontró el botón 'Crear Nueva Convocatoria'")
                
        else:
            print("❌ No se detectó redirección al dashboard")
            print("⚠️ Posible error en el login")

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
