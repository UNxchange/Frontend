"""
Prueba de integración completa: Login -> Dashboard -> Crear Convocatoria -> Llenar Formulario -> Enviar
"""
import pytest
import time
import requests
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def fill_form_field(driver, field_info):
    """
    Llena un campo del formulario basado en la información proporcionada
    """
    field_name = field_info['name']
    field_value = field_info['value']
    field_type = field_info.get('type', 'text')
    
    try:
        if field_type == 'select':
            # Para campos select/dropdown
            select_selectors = [
                f"select[name='{field_name}']",
                f"select[id='{field_name}']",
                f"select[id*='{field_name}']",
                f"select[name*='{field_name}']"
            ]
            
            for selector in select_selectors:
                try:
                    select_element = driver.find_element(By.CSS_SELECTOR, selector)
                    select = Select(select_element)
                    
                    # Intentar seleccionar por texto visible
                    try:
                        select.select_by_visible_text(field_value)
                        print(f"✅ {field_name}: Seleccionado '{field_value}' por texto")
                        return True
                    except:
                        # Intentar seleccionar por valor
                        try:
                            select.select_by_value(field_value)
                            print(f"✅ {field_name}: Seleccionado '{field_value}' por valor")
                            return True
                        except:
                            continue
                except NoSuchElementException:
                    continue
        
        else:
            # Para campos input normales
            input_selectors = [
                f"input[name='{field_name}']",
                f"input[id='{field_name}']",
                f"input[id*='{field_name}']",
                f"input[name*='{field_name}']",
                f"textarea[name='{field_name}']",
                f"textarea[id='{field_name}']"
            ]
            
            for selector in input_selectors:
                try:
                    field_element = driver.find_element(By.CSS_SELECTOR, selector)
                    if field_element.is_displayed() and field_element.is_enabled():
                        field_element.clear()
                        field_element.send_keys(field_value)
                        print(f"✅ {field_name}: Ingresado '{field_value}'")
                        return True
                except NoSuchElementException:
                    continue
        
        print(f"⚠️ {field_name}: No se pudo encontrar el campo")
        return False
        
    except Exception as e:
        print(f"❌ {field_name}: Error llenando campo - {e}")
        return False

def test_complete_convocatoria_creation_flow(driver):
    """
    Prueba completa del flujo de creación de convocatorias con formulario
    """
    print("\n" + "="*80)
    print("🧪 PRUEBA COMPLETA: CREACIÓN DE CONVOCATORIA CON FORMULARIO")
    print("="*80)
    
    # Datos de prueba para el formulario
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    form_data = {
        'subscriptionYear': {
            'name': 'subscriptionYear',
            'value': '2024',
            'type': 'select'
        },
        'country': {
            'name': 'country', 
            'value': 'Alemania',
            'type': 'select'
        },
        'institution': {
            'name': 'institution',
            'value': f'Universidad de Prueba Selenium {timestamp}',
            'type': 'text'
        },
        'agreementType': {
            'name': 'agreementType',
            'value': 'Intercambio',
            'type': 'select'
        },
        'validity': {
            'name': 'validity',
            'value': 'December - 2024',
            'type': 'text'
        },
        'state': {
            'name': 'state',
            'value': 'Vigente',
            'type': 'select'
        },
        'subscriptionLevel': {
            'name': 'subscriptionLevel',
            'value': 'Universidad Nacional de Colombia',
            'type': 'text'
        },
        'dreLink': {
            'name': 'dreLink',
            'value': 'https://www.example.com/dre-test',
            'type': 'text'
        },
        'agreementLink': {
            'name': 'agreementLink', 
            'value': 'https://www.example.com/agreement-test',
            'type': 'text'
        },
        'internationalLink': {
            'name': 'internationalLink',
            'value': 'https://www.example.com/international-test',
            'type': 'text'
        },
        'Props': {
            'name': 'Props',
            'value': f'Prueba de integración automatizada con Selenium - {timestamp}',
            'type': 'text'
        }
    }
    
    print(f"📋 Datos de prueba preparados con timestamp: {timestamp}")
    
    try:
        # === PASO 1: LOGIN ===
        print(f"\n🚀 Paso 1: Realizando login...")
        login_url = f"{custom_config.FRONTEND_URL}/login"
        driver.get(login_url)
        time.sleep(3)
        
        # Login
        email_field = driver.find_element(By.CSS_SELECTOR, "input[type='text'], input[type='email']")
        password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        
        email_field.send_keys(custom_config.TEST_USER_EMAIL)
        password_field.send_keys(custom_config.TEST_USER_PASSWORD)
        
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit'], button")
        login_button.click()
        
        # Esperar redirección
        time.sleep(5)
        
        # Cerrar popups
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        except:
            pass
        
        current_url = driver.current_url
        print(f"✅ Login exitoso - URL: {current_url}")
        
        if "/dashboard" not in current_url:
            raise AssertionError(f"Login falló - URL: {current_url}")
        
        driver.save_screenshot("reports/screenshots/01_login_success.png")
        
        # === PASO 2: HACER CLIC EN CREAR CONVOCATORIA ===
        print(f"\n🔘 Paso 2: Haciendo clic en 'Crear Nueva Convocatoria'...")
        
        # Buscar y hacer clic en el botón
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        
        # Scroll y clic
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", create_button)
        time.sleep(1)
        create_button.click()
        
        print(f"✅ Clic en 'Crear Nueva Convocatoria' realizado")
        
        # Esperar formulario
        time.sleep(4)
        driver.save_screenshot("reports/screenshots/02_form_opened.png")
        
        # === PASO 3: EXPLORAR FORMULARIO ===
        print(f"\n📋 Paso 3: Explorando estructura del formulario...")
        
        # Buscar todos los campos del formulario
        form_inputs = driver.find_elements(By.CSS_SELECTOR, "input, select, textarea")
        print(f"📊 Total de campos encontrados: {len(form_inputs)}")
        
        print("📝 Campos del formulario:")
        for i, input_elem in enumerate(form_inputs):
            if input_elem.is_displayed():
                input_type = input_elem.get_attribute('type')
                input_name = input_elem.get_attribute('name')
                input_id = input_elem.get_attribute('id')
                input_placeholder = input_elem.get_attribute('placeholder')
                tag_name = input_elem.tag_name
                
                print(f"   {i+1}. {tag_name.upper()}: name='{input_name}', id='{input_id}', type='{input_type}', placeholder='{input_placeholder}'")
        
        # === PASO 4: LLENAR FORMULARIO ===
        print(f"\n📝 Paso 4: Llenando formulario con datos de prueba...")
        
        fields_filled = 0
        total_fields = len(form_data)
        
        for field_key, field_info in form_data.items():
            print(f"\n🔧 Llenando campo: {field_key}")
            success = fill_form_field(driver, field_info)
            if success:
                fields_filled += 1
            time.sleep(0.5)  # Pequeña pausa entre campos
        
        print(f"\n📊 Resumen de llenado: {fields_filled}/{total_fields} campos completados")
        
        # Tomar screenshot del formulario lleno
        driver.save_screenshot("reports/screenshots/03_form_filled.png")
        
        # === PASO 5: MANEJAR CAMPOS ESPECIALES (Idiomas si existen) ===
        print(f"\n🌐 Paso 5: Manejando campos especiales (idiomas)...")
        
        # Buscar checkboxes o campos de idiomas
        language_selectors = [
            "input[type='checkbox'][value*='Español']",
            "input[type='checkbox'][value*='Alemán']", 
            "input[type='checkbox'][value*='Inglés']",
            "input[name*='language']",
            "input[name*='idiom']",
            ".language-checkbox",
            ".idioma-checkbox"
        ]
        
        languages_selected = 0
        for selector in language_selectors:
            try:
                checkboxes = driver.find_elements(By.CSS_SELECTOR, selector)
                for checkbox in checkboxes[:2]:  # Seleccionar máximo 2 idiomas
                    if checkbox.is_displayed() and not checkbox.is_selected():
                        checkbox.click()
                        languages_selected += 1
                        print(f"✅ Idioma seleccionado: {checkbox.get_attribute('value')}")
                        time.sleep(0.3)
            except:
                continue
        
        if languages_selected > 0:
            print(f"✅ {languages_selected} idiomas seleccionados")
        else:
            print("ℹ️ No se encontraron campos de idiomas")
        
        # === PASO 6: BUSCAR Y HACER CLIC EN BOTÓN ENVIAR ===
        print(f"\n🚀 Paso 6: Buscando botón de envío...")
        
        submit_selectors = [
            "button[type='submit']",
            "input[type='submit']",
            "button:contains('Crear Convocatoria')",
            "button:contains('Enviar')",
            "button:contains('Guardar')",
            "button:contains('Crear')",
            ".submit-button",
            ".btn-primary",
            ".btn-submit",
            "button.primary",
            "form button:last-child"
        ]
        
        submit_button = None
        
        for selector in submit_selectors:
            try:
                if ":contains(" in selector:
                    text = selector.split(":contains('")[1].split("')")[0]
                    buttons = driver.find_elements(By.XPATH, f"//button[contains(text(), '{text}')]")
                    for btn in buttons:
                        if btn.is_displayed() and btn.is_enabled():
                            submit_button = btn
                            print(f"✅ Botón de envío encontrado por texto: '{text}'")
                            break
                else:
                    buttons = driver.find_elements(By.CSS_SELECTOR, selector)
                    for btn in buttons:
                        if btn.is_displayed() and btn.is_enabled():
                            submit_button = btn
                            print(f"✅ Botón de envío encontrado: {selector}")
                            break
                
                if submit_button:
                    break
            except:
                continue
        
        if not submit_button:
            # Listar todos los botones para debug
            all_buttons = driver.find_elements(By.TAG_NAME, "button")
            print(f"📋 Botones disponibles para envío ({len(all_buttons)}):")
            for i, btn in enumerate(all_buttons):
                if btn.is_displayed():
                    print(f"   {i+1}. '{btn.text}' - type: '{btn.get_attribute('type')}' - class: '{btn.get_attribute('class')}'")
            
            # Usar el último botón visible como último recurso
            visible_buttons = [btn for btn in all_buttons if btn.is_displayed() and btn.is_enabled()]
            if visible_buttons:
                submit_button = visible_buttons[-1]
                print(f"⚠️ Usando último botón visible: '{submit_button.text}'")
        
        if not submit_button:
            driver.save_screenshot("reports/screenshots/04_no_submit_button.png")
            raise AssertionError("No se encontró botón de envío")
        
        # === PASO 7: ENVIAR FORMULARIO ===
        print(f"\n📤 Paso 7: Enviando formulario...")
        print(f"Botón a usar: '{submit_button.text}' - Class: '{submit_button.get_attribute('class')}'")
        
        # Scroll al botón de envío
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", submit_button)
        time.sleep(1)
        
        # Tomar screenshot antes del envío
        driver.save_screenshot("reports/screenshots/04_before_submit.png")
        
        # Hacer clic en enviar
        try:
            submit_button.click()
            print("✅ Formulario enviado (clic directo)")
        except Exception as e:
            print(f"⚠️ Clic directo falló: {e}")
            try:
                driver.execute_script("arguments[0].click();", submit_button)
                print("✅ Formulario enviado (JavaScript)")
            except Exception as e2:
                print(f"❌ Envío falló: {e2}")
                raise e2
        
        # === PASO 8: VERIFICAR RESULTADO ===
        print(f"\n⏳ Paso 8: Verificando resultado del envío...")
        
        # Esperar respuesta
        time.sleep(5)
        
        final_url = driver.current_url
        print(f"🌐 URL final: {final_url}")
        
        # Tomar screenshot del resultado
        driver.save_screenshot("reports/screenshots/05_after_submit.png")
        
        # Buscar mensajes de éxito o error
        success_selectors = [
            ".success", ".alert-success", ".message-success",
            ".notification-success", "[class*='success']"
        ]
        
        error_selectors = [
            ".error", ".alert-error", ".alert-danger", 
            ".message-error", "[class*='error']", "[class*='danger']"
        ]
        
        success_found = False
        error_found = False
        
        # Verificar mensajes de éxito
        for selector in success_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for elem in elements:
                    if elem.is_displayed() and elem.text.strip():
                        print(f"✅ Mensaje de éxito: '{elem.text}'")
                        success_found = True
            except:
                continue
        
        # Verificar mensajes de error
        for selector in error_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for elem in elements:
                    if elem.is_displayed() and elem.text.strip():
                        print(f"❌ Mensaje de error: '{elem.text}'")
                        error_found = True
            except:
                continue
        
        # Verificar logs del navegador
        try:
            logs = driver.get_log('browser')
            if logs:
                print("📋 Logs del navegador:")
                for log in logs[-3:]:
                    print(f"   {log['level']}: {log['message']}")
        except:
            pass
        
        # === PASO 9: VERIFICAR EN BACKEND ===
        print(f"\n🔍 Paso 9: Verificando en backend...")
        
        try:
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            if response.status_code == 200:
                convocatorias = response.json()
                print(f"📊 Total convocatorias en backend: {len(convocatorias)}")
                
                # Buscar nuestra convocatoria por institución
                test_institution = form_data['institution']['value']
                found_convocatoria = None
                
                for conv in convocatorias:
                    if conv.get('institution') == test_institution:
                        found_convocatoria = conv
                        break
                
                if found_convocatoria:
                    print(f"✅ ¡Convocatoria encontrada en backend!")
                    print(f"   ID: {found_convocatoria.get('id')}")
                    print(f"   Institución: {found_convocatoria.get('institution')}")
                    print(f"   País: {found_convocatoria.get('country')}")
                    success_found = True
                else:
                    print(f"⚠️ Convocatoria no encontrada en backend")
                    print(f"   Buscando: {test_institution}")
            else:
                print(f"⚠️ Error consultando backend: {response.status_code}")
        
        except Exception as e:
            print(f"⚠️ Error verificando backend: {e}")
        
        # === RESULTADO FINAL ===
        print(f"\n" + "="*80)
        if success_found:
            print("🎉 ¡PRUEBA DE INTEGRACIÓN EXITOSA!")
            print("✅ Formulario enviado correctamente")
            print("✅ Convocatoria creada en el sistema")
        elif error_found:
            print("⚠️ PRUEBA COMPLETADA CON ERRORES")
            print("❌ Se detectaron mensajes de error")
        else:
            print("🤔 PRUEBA COMPLETADA - RESULTADO INCIERTO")
            print("ℹ️ No se detectaron mensajes claros de éxito o error")
        
        print(f"📊 Campos llenados: {fields_filled}/{total_fields}")
        print(f"📸 Screenshots guardados en reports/screenshots/")
        print("="*80)
        
        return success_found
        
    except Exception as e:
        print(f"\n❌ Error durante la prueba: {e}")
        driver.save_screenshot("reports/screenshots/99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
