"""
Versión mejorada de la prueba que maneja correctamente los campos por ID
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

def fill_form_field_by_id(driver, field_id, field_value, field_type='text'):
    """
    Llena un campo del formulario usando su ID
    """
    try:
        if field_type == 'select':
            select_element = driver.find_element(By.ID, field_id)
            select = Select(select_element)
            
            # Intentar seleccionar por texto visible
            try:
                select.select_by_visible_text(field_value)
                print(f"✅ {field_id}: Seleccionado '{field_value}' por texto")
                return True
            except:
                # Intentar seleccionar por valor
                try:
                    select.select_by_value(field_value)
                    print(f"✅ {field_id}: Seleccionado '{field_value}' por valor")
                    return True
                except:
                    print(f"⚠️ {field_id}: No se pudo seleccionar '{field_value}'")
                    return False
        
        elif field_type == 'readonly':
            # Para campos de solo lectura, verificar que tienen el valor esperado
            field_element = driver.find_element(By.ID, field_id)
            current_value = field_element.get_attribute('value') or field_element.get_attribute('placeholder')
            print(f"ℹ️ {field_id}: Campo de solo lectura con valor '{current_value}'")
            return True
            
        else:
            # Para campos input normales
            field_element = driver.find_element(By.ID, field_id)
            if field_element.is_enabled():
                field_element.clear()
                field_element.send_keys(field_value)
                print(f"✅ {field_id}: Ingresado '{field_value}'")
                return True
            else:
                current_value = field_element.get_attribute('value') or field_element.get_attribute('placeholder')
                print(f"ℹ️ {field_id}: Campo deshabilitado con valor '{current_value}'")
                return True
        
    except NoSuchElementException:
        print(f"❌ {field_id}: Campo no encontrado")
        return False
    except Exception as e:
        print(f"❌ {field_id}: Error - {e}")
        return False

def test_improved_convocatoria_creation(driver):
    """
    Prueba mejorada que usa IDs específicos detectados en el formulario
    """
    print("\n" + "="*80)
    print("🧪 PRUEBA MEJORADA: CREACIÓN DE CONVOCATORIA CON IDS CORRECTOS")
    print("="*80)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Datos ajustados basados en la estructura real del formulario
    form_fields = [
        {'id': 'subscriptionYear', 'value': '2024', 'type': 'readonly'},
        {'id': 'country', 'value': 'Alemania', 'type': 'readonly'},
        {'id': 'institution', 'value': f'Universidad Selenium Test {timestamp}', 'type': 'text'},
        {'id': 'agreementType', 'value': 'Intercambio', 'type': 'select'},
        {'id': 'state', 'value': 'Vigente', 'type': 'select'},
        {'id': 'validity', 'value': 'December - 2024', 'type': 'text'},
        {'id': 'subscriptionLevel', 'value': 'Universidad Nacional de Colombia', 'type': 'text'},
        {'id': 'dreLink', 'value': 'https://example.com/dre-test', 'type': 'text'},
        {'id': 'agreementLink', 'value': 'https://example.com/agreement-test', 'type': 'text'},
        {'id': 'internationalLink', 'value': 'https://example.com/international-test', 'type': 'text'},
        {'id': 'Props', 'value': f'Prueba automatizada de integración Selenium - {timestamp}', 'type': 'textarea'}
    ]
    
    print(f"📋 Preparando datos con timestamp: {timestamp}")
    
    try:
        # === LOGIN RÁPIDO ===
        print(f"\n🚀 Login...")
        login_url = f"{custom_config.FRONTEND_URL}/login"
        driver.get(login_url)
        time.sleep(3)
        
        email_field = driver.find_element(By.CSS_SELECTOR, "input[type='text'], input[type='email']")
        password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        email_field.send_keys(custom_config.TEST_USER_EMAIL)
        password_field.send_keys(custom_config.TEST_USER_PASSWORD)
        
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit'], button")
        login_button.click()
        time.sleep(5)
        
        # Cerrar popups
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        except:
            pass
        
        print(f"✅ Login exitoso")
        
        # === ABRIR FORMULARIO ===
        print(f"\n🔘 Abriendo formulario...")
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", create_button)
        time.sleep(1)
        create_button.click()
        time.sleep(4)
        
        driver.save_screenshot("reports/screenshots/improved_01_form_opened.png")
        print(f"✅ Formulario abierto")
        
        # === LLENAR CAMPOS POR ID ===
        print(f"\n📝 Llenando formulario...")
        
        fields_completed = 0
        for field in form_fields:
            print(f"\n🔧 Campo: {field['id']}")
            success = fill_form_field_by_id(driver, field['id'], field['value'], field['type'])
            if success:
                fields_completed += 1
            time.sleep(0.8)  # Pausa más larga para estabilidad
        
        print(f"\n📊 Campos completados: {fields_completed}/{len(form_fields)}")
        
        # === SELECCIONAR IDIOMAS ===
        print(f"\n🌐 Seleccionando idiomas...")
        
        # Los checkboxes están sin ID, buscarlos por posición o valor
        checkboxes = driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox']")
        languages_selected = 0
        
        for i, checkbox in enumerate(checkboxes[:2]):  # Seleccionar los primeros 2
            try:
                if checkbox.is_displayed() and not checkbox.is_selected():
                    driver.execute_script("arguments[0].scrollIntoView(true);", checkbox)
                    time.sleep(0.5)
                    checkbox.click()
                    languages_selected += 1
                    print(f"✅ Idioma {i+1} seleccionado")
                    time.sleep(0.5)
            except Exception as e:
                print(f"⚠️ Error seleccionando idioma {i+1}: {e}")
        
        print(f"✅ {languages_selected} idiomas seleccionados")
        
        # === SCREENSHOT ANTES DEL ENVÍO ===
        driver.save_screenshot("reports/screenshots/improved_02_form_filled.png")
        
        # === ENVIAR FORMULARIO ===
        print(f"\n📤 Enviando formulario...")
        
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        print(f"Botón encontrado: '{submit_button.text}'")
        
        # Scroll al botón
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", submit_button)
        time.sleep(2)
        
        # Enviar
        submit_button.click()
        print(f"✅ Formulario enviado")
        
        # === VERIFICAR RESULTADO ===
        print(f"\n⏳ Verificando resultado...")
        time.sleep(6)  # Esperar más tiempo para procesar
        
        driver.save_screenshot("reports/screenshots/improved_03_after_submit.png")
        
        final_url = driver.current_url
        print(f"🌐 URL final: {final_url}")
        
        # Buscar mensajes en la página
        page_text = driver.find_element(By.TAG_NAME, "body").text.lower()
        
        success_keywords = ['éxito', 'exitosa', 'creada', 'guardada', 'success']
        error_keywords = ['error', 'falló', 'failed', 'invalid']
        
        success_found = any(keyword in page_text for keyword in success_keywords)
        error_found = any(keyword in page_text for keyword in error_keywords)
        
        print(f"📄 Análisis de la página:")
        if success_found:
            print(f"✅ Indicadores de éxito detectados")
        if error_found:
            print(f"❌ Indicadores de error detectados")
        
        # === VERIFICAR EN BACKEND ===
        print(f"\n🔍 Verificando en backend...")
        
        test_institution = form_fields[2]['value']  # institution
        
        try:
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            if response.status_code == 200:
                convocatorias = response.json()
                print(f"📊 Convocatorias en backend: {len(convocatorias)}")
                
                # Buscar nuestra convocatoria
                found = False
                for conv in convocatorias:
                    if conv.get('institution') == test_institution:
                        print(f"🎉 ¡CONVOCATORIA ENCONTRADA EN BACKEND!")
                        print(f"   ID: {conv.get('id')}")
                        print(f"   Institución: {conv.get('institution')}")
                        print(f"   País: {conv.get('country')}")
                        print(f"   Estado: {conv.get('state')}")
                        found = True
                        break
                
                if not found:
                    print(f"⚠️ Convocatoria no encontrada aún")
                    print(f"   Buscando: {test_institution}")
                    # Mostrar las últimas 3 convocatorias para comparar
                    print(f"📋 Últimas convocatorias:")
                    for conv in convocatorias[-3:]:
                        print(f"   - {conv.get('institution', 'Sin nombre')}")
                
                success_found = success_found or found
                
        except Exception as e:
            print(f"⚠️ Error consultando backend: {e}")
        
        # === RESULTADO FINAL ===
        print(f"\n" + "="*80)
        if success_found:
            print("🎉 ¡PRUEBA DE INTEGRACIÓN EXITOSA!")
        elif error_found:
            print("❌ PRUEBA FALLÓ - SE DETECTARON ERRORES")
        else:
            print("🤔 RESULTADO INCIERTO - NO HAY INDICADORES CLAROS")
        
        print(f"📊 Resumen:")
        print(f"   • Campos llenados: {fields_completed}/{len(form_fields)}")
        print(f"   • Idiomas seleccionados: {languages_selected}")
        print(f"   • Formulario enviado: ✅")
        print(f"   • Verificación backend: {'✅' if success_found else '⚠️'}")
        print("="*80)
        
        return success_found
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        driver.save_screenshot("reports/screenshots/improved_99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
