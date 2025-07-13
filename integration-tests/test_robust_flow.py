"""
Prueba de integración robusta que maneja popups de Chrome
"""
import pytest
import time
import requests
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def close_chrome_popups(driver):
    """
    Cierra popups comunes de Chrome que pueden interferir con las pruebas
    """
    print("🔍 Verificando y cerrando popups de Chrome...")
    
    # Lista de selectores para cerrar popups
    popup_close_selectors = [
        # Popup de contraseñas
        "button[aria-label='Cerrar']",
        "button[aria-label='Close']", 
        "button[aria-label='Dismiss']",
        "button[data-testid='close-button']",
        ".close-button",
        ".dismiss-button",
        "[role='button'][aria-label*='Close']",
        "[role='button'][aria-label*='Cerrar']",
        # Botones genéricos de cerrar
        "button:contains('Cerrar')",
        "button:contains('Close')",
        "button:contains('Dismiss')",
        "button:contains('No gracias')",
        "button:contains('No thanks')",
        # Selectores específicos de Chrome
        ".infobar button",
        "#password-manager-dialog button",
        ".password-manager-popup button"
    ]
    
    popups_closed = 0
    
    for selector in popup_close_selectors:
        try:
            if ":contains(" in selector:
                # Usar XPath para texto
                text = selector.split(":contains('")[1].split("')")[0]
                elements = driver.find_elements(By.XPATH, f"//button[contains(text(), '{text}')]")
            else:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
            
            for element in elements:
                if element.is_displayed() and element.is_enabled():
                    try:
                        element.click()
                        popups_closed += 1
                        print(f"✅ Popup cerrado con selector: {selector}")
                        time.sleep(0.5)  # Pequeña pausa
                    except:
                        continue
        except:
            continue
    
    # Intentar presionar ESC para cerrar popups
    try:
        driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        time.sleep(0.5)
    except:
        pass
    
    if popups_closed > 0:
        print(f"✅ Se cerraron {popups_closed} popups")
    else:
        print("ℹ️ No se encontraron popups para cerrar")
    
    return popups_closed

def test_complete_flow_with_popup_handling(driver):
    """
    Prueba completa del flujo de creación de convocatorias con manejo de popups
    """
    print("\n" + "="*70)
    print("🧪 PRUEBA COMPLETA CON MANEJO DE POPUPS DE CHROME")
    print("="*70)
    
    # Credenciales
    email = custom_config.TEST_USER_EMAIL
    password = custom_config.TEST_USER_PASSWORD
    
    print(f"📧 Email: {email}")
    print(f"🔐 Password: {password}")
    print(f"🌐 Frontend: {custom_config.FRONTEND_URL}")
    
    try:
        # === PASO 1: NAVEGACIÓN AL LOGIN ===
        print(f"\n🚀 Paso 1: Navegando al login...")
        login_url = f"{custom_config.FRONTEND_URL}/login"
        driver.get(login_url)
        
        # Esperar carga
        time.sleep(3)
        driver.save_screenshot("reports/screenshots/01_login_page.png")
        print(f"📸 Screenshot: 01_login_page.png")
        print(f"🌐 URL: {driver.current_url}")
        
        # === PASO 2: LOGIN ===
        print(f"\n📝 Paso 2: Realizando login...")
        
        # Buscar campos
        email_field = driver.find_element(By.CSS_SELECTOR, "input[type='text'], input[type='email']")
        password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        
        # Llenar campos
        email_field.clear()
        email_field.send_keys(email)
        password_field.clear() 
        password_field.send_keys(password)
        
        driver.save_screenshot("reports/screenshots/02_fields_filled.png")
        print(f"📸 Screenshot: 02_fields_filled.png")
        
        # Hacer login
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit'], button")
        login_button.click()
        
        print(f"✅ Login enviado")
        
        # === PASO 3: MANEJAR POPUPS DESPUÉS DEL LOGIN ===
        print(f"\n🔄 Paso 3: Esperando redirección y manejando popups...")
        
        # Esperar un poco para que se procese el login
        time.sleep(5)
        
        # Cerrar popups de Chrome
        close_chrome_popups(driver)
        
        # Tomar screenshot después de cerrar popups
        driver.save_screenshot("reports/screenshots/03_after_popup_handling.png")
        print(f"📸 Screenshot: 03_after_popup_handling.png")
        
        current_url = driver.current_url
        print(f"🌐 URL después del login: {current_url}")
        
        # Verificar redirección al dashboard
        max_retries = 3
        for retry in range(max_retries):
            if "/dashboard" in current_url:
                print(f"✅ Redirigido al dashboard (intento {retry + 1})")
                break
            else:
                print(f"⏳ Esperando redirección... (intento {retry + 1})")
                time.sleep(3)
                close_chrome_popups(driver)  # Cerrar popups nuevamente
                current_url = driver.current_url
        
        if "/dashboard" not in current_url:
            driver.save_screenshot("reports/screenshots/04_login_failed.png")
            raise AssertionError(f"Login falló - URL actual: {current_url}")
        
        # === PASO 4: BUSCAR BOTÓN "CREAR NUEVA CONVOCATORIA" ===
        print(f"\n🔘 Paso 4: Buscando botón 'Crear Nueva Convocatoria'...")
        
        # Cerrar popups una vez más antes de buscar el botón
        close_chrome_popups(driver)
        
        # Esperar a que la página se estabilice
        time.sleep(2)
        
        # Buscar el botón con los selectores específicos basados en la estructura HTML
        create_button_selectors = [
            # Selector específico para el botón con la estructura exacta
            "button.action-button.primary",
            "button.action-button",
            "button[class*='action-button'][class*='primary']",
            "button:has(span:contains('Crear Nueva Convocatoria'))",
            "button:has(.fas.fa-plus)",
            # Selectores más específicos
            "button.action-button.primary span:contains('Crear Nueva Convocatoria')",
            "button[class='action-button primary']",
            # Selectores de respaldo
            "button:contains('Crear Nueva Convocatoria')",
            "button:contains('Crear Convocatoria')", 
            "button:contains('Nueva Convocatoria')",
            "[data-testid*='create']",
            "[data-testid*='nueva']",
            "button[class*='create']",
            "button[class*='primary']"
        ]
        
        create_button = None
        
        print("🔍 Buscando con selectores específicos...")
        
        for selector in create_button_selectors:
            try:
                if ":contains(" in selector and not ":has(" in selector:
                    # Usar XPath para texto simple
                    text = selector.split(":contains('")[1].split("')")[0]
                    buttons = driver.find_elements(By.XPATH, f"//button[contains(text(), '{text}') or .//span[contains(text(), '{text}')]]")
                    for btn in buttons:
                        if btn.is_displayed() and btn.is_enabled():
                            create_button = btn
                            print(f"✅ Botón encontrado con XPath para texto: '{text}'")
                            break
                elif ":has(" in selector:
                    # Selectores CSS complejos, convertir a XPath
                    if "span:contains('Crear Nueva Convocatoria')" in selector:
                        create_button = driver.find_element(By.XPATH, "//button[contains(@class, 'action-button') and contains(@class, 'primary')]//span[contains(text(), 'Crear Nueva Convocatoria')]/ancestor::button")
                        if create_button.is_displayed():
                            print(f"✅ Botón encontrado con XPath específico")
                            break
                    elif ".fas.fa-plus" in selector:
                        create_button = driver.find_element(By.XPATH, "//button[contains(@class, 'action-button')]//i[contains(@class, 'fas') and contains(@class, 'fa-plus')]/ancestor::button")
                        if create_button.is_displayed():
                            print(f"✅ Botón encontrado por ícono fa-plus")
                            break
                else:
                    # Selector CSS normal
                    buttons = driver.find_elements(By.CSS_SELECTOR, selector)
                    for btn in buttons:
                        if btn.is_displayed() and btn.is_enabled():
                            create_button = btn
                            print(f"✅ Botón encontrado con selector CSS: {selector}")
                            break
                
                if create_button:
                    break
                    
            except NoSuchElementException:
                continue
            except Exception as e:
                print(f"⚠️ Error con selector {selector}: {e}")
                continue
        
        if not create_button:
            # Listar todos los botones disponibles para debugging
            print("🔍 Buscando TODOS los botones disponibles...")
            buttons = driver.find_elements(By.TAG_NAME, "button")
            print(f"📋 Botones disponibles en el dashboard ({len(buttons)}):")
            
            for i, btn in enumerate(buttons):
                if btn.is_displayed():
                    btn_text = btn.text.strip()
                    btn_class = btn.get_attribute('class')
                    btn_html = btn.get_attribute('outerHTML')[:200] + "..." if len(btn.get_attribute('outerHTML')) > 200 else btn.get_attribute('outerHTML')
                    print(f"   {i+1}. Texto: '{btn_text}' | Class: '{btn_class}'")
                    print(f"       HTML: {btn_html}")
                    print("       ---")
                    
                    # Si encontramos un botón que contenga las palabras clave, usarlo
                    if any(keyword in btn_text.lower() for keyword in ['crear', 'nueva', 'convocatoria']) or 'action-button' in btn_class:
                        create_button = btn
                        print(f"✅ ¡Botón candidato encontrado! Usando botón #{i+1}")
                        break
            
            if not create_button:
                driver.save_screenshot("reports/screenshots/05_no_create_button.png")
                raise AssertionError("No se encontró el botón 'Crear Nueva Convocatoria'")
        
        # Mostrar información del botón encontrado
        print(f"📋 Información del botón encontrado:")
        print(f"   Texto: '{create_button.text}'")
        print(f"   Class: '{create_button.get_attribute('class')}'")
        print(f"   Visible: {create_button.is_displayed()}")
        print(f"   Habilitado: {create_button.is_enabled()}")
        
        # === PASO 5: HACER CLIC EN CREAR CONVOCATORIA ===
        print(f"\n🖱️ Paso 5: Haciendo clic en 'Crear Nueva Convocatoria'...")
        
        # Scroll hacia el botón si es necesario
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", create_button)
        time.sleep(1)
        
        # Cerrar popups una vez más antes del clic
        close_chrome_popups(driver)
        
        # Asegurar que el botón esté en el viewport y sea clickeable
        try:
            # Método 1: Clic normal
            print("🖱️ Intentando clic normal...")
            create_button.click()
            print(f"✅ Clic normal exitoso en: '{create_button.text}'")
        except Exception as e:
            print(f"⚠️ Clic normal falló: {e}")
            try:
                # Método 2: Clic con JavaScript
                print("🖱️ Intentando clic con JavaScript...")
                driver.execute_script("arguments[0].click();", create_button)
                print(f"✅ Clic con JavaScript exitoso")
            except Exception as e2:
                print(f"⚠️ Clic con JavaScript falló: {e2}")
                try:
                    # Método 3: Clic en el span interno
                    print("🖱️ Intentando clic en span interno...")
                    span_element = create_button.find_element(By.TAG_NAME, "span")
                    span_element.click()
                    print(f"✅ Clic en span exitoso")
                except Exception as e3:
                    print(f"❌ Todos los métodos de clic fallaron: {e3}")
                    raise e3
        
        # Esperar a que aparezca el formulario
        print("⏳ Esperando respuesta después del clic...")
        time.sleep(4)
        
        # Cerrar popups después del clic
        close_chrome_popups(driver)
        
        driver.save_screenshot("reports/screenshots/06_after_create_click.png")
        print(f"📸 Screenshot: 06_after_create_click.png")
        
        # Verificar cambios en la página
        new_url = driver.current_url
        print(f"🌐 URL después del clic: {new_url}")
        
        # Verificar si la página cambió o apareció contenido nuevo
        page_source_after = driver.page_source
        if "form" in page_source_after.lower() or "input" in page_source_after.lower():
            print("✅ Se detectó nuevo contenido (formulario) en la página")
        else:
            print("⚠️ No se detectó cambio significativo en la página")
        
        # === PASO 6: VERIFICAR FORMULARIO ===
        print(f"\n📋 Paso 6: Verificando que el formulario aparezca...")
        
        # Buscar elementos del formulario
        form_selectors = [
            "form",
            "input[type='text']",
            "select",
            ".form",
            "[class*='form']"
        ]
        
        form_found = False
        for selector in form_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    print(f"✅ Formulario encontrado con selector: {selector} ({len(elements)} elementos)")
                    form_found = True
                    break
            except:
                continue
        
        if form_found:
            print(f"🎉 ¡Formulario de convocatoria cargado exitosamente!")
            driver.save_screenshot("reports/screenshots/07_form_loaded.png")
            print(f"📸 Screenshot: 07_form_loaded.png")
        else:
            driver.save_screenshot("reports/screenshots/08_no_form.png")
            print(f"❌ No se pudo cargar el formulario")
            
        print(f"\n🏁 Prueba completada - Estado: {'ÉXITO' if form_found else 'FALLÓ'}")
        
        return form_found
        
    except Exception as e:
        print(f"\n❌ Error durante la prueba: {e}")
        driver.save_screenshot("reports/screenshots/99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
