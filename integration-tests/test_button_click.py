"""
Prueba específica para el clic en el botón "Crear Nueva Convocatoria"
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def test_find_and_click_create_button(driver):
    """
    Prueba específica para encontrar y hacer clic en el botón de crear convocatoria
    """
    print("\n" + "="*60)
    print("🔘 PRUEBA ESPECÍFICA: CLIC EN BOTÓN CREAR CONVOCATORIA")
    print("="*60)
    
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
        
        # Esperar redirección
        time.sleep(5)
        
        # Cerrar popups de Chrome
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            time.sleep(1)
        except:
            pass
        
        current_url = driver.current_url
        print(f"🌐 URL después del login: {current_url}")
        
        if "/dashboard" not in current_url:
            raise AssertionError(f"Login falló - URL: {current_url}")
        
        driver.save_screenshot("reports/screenshots/dashboard_loaded.png")
        print("✅ Dashboard cargado")
        
        # === BUSCAR BOTÓN CON ESTRUCTURA ESPECÍFICA ===
        print("\n🔍 Buscando botón con estructura específica...")
        print("Estructura objetivo: <button class='action-button primary'><i class='fas fa-plus'></i><span>Crear Nueva Convocatoria</span>...")
        
        # Esperar un poco más para que todo se cargue
        time.sleep(3)
        
        # Métodos de búsqueda específicos
        search_methods = [
            {
                "name": "Por clase exacta",
                "method": lambda: driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
            },
            {
                "name": "Por clases separadas", 
                "method": lambda: driver.find_element(By.CSS_SELECTOR, "button[class*='action-button'][class*='primary']")
            },
            {
                "name": "Por ícono fa-plus",
                "method": lambda: driver.find_element(By.XPATH, "//button//i[contains(@class, 'fas') and contains(@class, 'fa-plus')]/ancestor::button")
            },
            {
                "name": "Por texto en span",
                "method": lambda: driver.find_element(By.XPATH, "//button//span[contains(text(), 'Crear Nueva Convocatoria')]/ancestor::button")
            },
            {
                "name": "Por combinación",
                "method": lambda: driver.find_element(By.XPATH, "//button[contains(@class, 'action-button') and .//span[contains(text(), 'Crear Nueva Convocatoria')]]")
            }
        ]
        
        found_button = None
        
        for method in search_methods:
            try:
                print(f"🔍 Probando: {method['name']}")
                button = method['method']()
                if button and button.is_displayed():
                    found_button = button
                    print(f"✅ ¡Encontrado con {method['name']}!")
                    print(f"   Texto: '{button.text}'")
                    print(f"   Class: '{button.get_attribute('class')}'")
                    print(f"   HTML: {button.get_attribute('outerHTML')[:150]}...")
                    break
            except Exception as e:
                print(f"❌ {method['name']} falló: {e}")
        
        if not found_button:
            print("\n📋 LISTANDO TODOS LOS BOTONES PARA DEBUGGING:")
            buttons = driver.find_elements(By.TAG_NAME, "button")
            for i, btn in enumerate(buttons):
                if btn.is_displayed():
                    print(f"\n{i+1}. BOTÓN:")
                    print(f"   Texto: '{btn.text}'")
                    print(f"   Class: '{btn.get_attribute('class')}'")
                    print(f"   ID: '{btn.get_attribute('id')}'")
                    print(f"   HTML: {btn.get_attribute('outerHTML')[:200]}...")
                    
                    # Si es parecido al que buscamos, marcarlo
                    if ('action-button' in btn.get_attribute('class') or 
                        'crear' in btn.text.lower() or 
                        'convocatoria' in btn.text.lower()):
                        print(f"   ⭐ CANDIDATO: Este podría ser el botón objetivo")
            
            driver.save_screenshot("reports/screenshots/buttons_debug.png")
            raise AssertionError("No se encontró el botón específico")
        
        # === HACER CLIC EN EL BOTÓN ===
        print(f"\n🖱️ Haciendo clic en el botón encontrado...")
        
        # Scroll al botón
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", found_button)
        time.sleep(1)
        
        # Múltiples métodos de clic
        click_success = False
        
        # Método 1: Clic directo
        try:
            found_button.click()
            print("✅ Clic directo exitoso")
            click_success = True
        except Exception as e:
            print(f"❌ Clic directo falló: {e}")
        
        # Método 2: JavaScript click
        if not click_success:
            try:
                driver.execute_script("arguments[0].click();", found_button)
                print("✅ Clic con JavaScript exitoso")
                click_success = True
            except Exception as e:
                print(f"❌ Clic con JavaScript falló: {e}")
        
        # Método 3: Clic en el span
        if not click_success:
            try:
                span = found_button.find_element(By.TAG_NAME, "span")
                span.click()
                print("✅ Clic en span exitoso")
                click_success = True
            except Exception as e:
                print(f"❌ Clic en span falló: {e}")
        
        if not click_success:
            raise AssertionError("Todos los métodos de clic fallaron")
        
        # === VERIFICAR RESULTADO ===
        print(f"\n⏳ Esperando resultado del clic...")
        time.sleep(4)
        
        # Verificar cambios
        new_url = driver.current_url
        print(f"🌐 URL después del clic: {new_url}")
        
        # Buscar evidencia de formulario
        form_indicators = [
            "form",
            "input[type='text']",
            "select",
            "textarea",
            ".form",
            "[class*='form']"
        ]
        
        form_found = False
        for indicator in form_indicators:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, indicator)
                if elements:
                    visible_elements = [e for e in elements if e.is_displayed()]
                    if visible_elements:
                        print(f"✅ Formulario detectado: {len(visible_elements)} elementos '{indicator}' visibles")
                        form_found = True
                        break
            except:
                continue
        
        driver.save_screenshot("reports/screenshots/after_button_click.png")
        
        if form_found:
            print("🎉 ¡ÉXITO! El formulario apareció después del clic")
        else:
            print("⚠️ No se detectó formulario, pero el clic se ejecutó")
            
            # Mostrar contenido actual para debugging
            print("📄 Contenido actual de la página:")
            page_text = driver.find_element(By.TAG_NAME, "body").text[:500]
            print(page_text + "..." if len(page_text) >= 500 else page_text)
        
        return form_found
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        driver.save_screenshot("reports/screenshots/error_button_test.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
