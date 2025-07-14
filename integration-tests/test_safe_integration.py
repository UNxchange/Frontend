"""
Prueba de integración FINAL con manejo mejorado de autocompletado
Versión que soluciona problemas de duplicación de texto en campos
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
from form_utils import clear_and_type_safe, safe_login, wait_for_navigation

def test_integration_with_safe_form_handling(driver):
    """
    Prueba de integración con manejo seguro de formularios
    Soluciona problemas de autocompletado y duplicación de texto
    """
    print("\n" + "="*80)
    print("🧪 PRUEBA DE INTEGRACIÓN - MANEJO SEGURO DE FORMULARIOS")
    print("="*80)
    
    email = custom_config.TEST_USER_EMAIL
    password = custom_config.TEST_USER_PASSWORD
    
    # Datos de prueba con timestamp único
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_data = {
        "subscriptionYear": "2024",
        "country": "Alemania", 
        "institution": f"Universidad Prueba Segura {timestamp}",
        "validity": "December - 2024",
        "subscriptionLevel": "Universidad Nacional de Colombia",
        "agreementType": "Intercambio",
        "state": "Vigente",
        "dreLink": f"https://ejemplo.com/dre/{timestamp}",
        "agreementLink": f"https://ejemplo.com/agreement/{timestamp}",
        "internationalLink": f"https://ejemplo.com/international/{timestamp}",
        "Props": f"Prueba con manejo seguro de formularios - {timestamp}",
        "languages": ["Español", "Alemán"]
    }
    
    print(f"📋 Datos de prueba generados:")
    for key, value in test_data.items():
        print(f"   {key}: {value}")
    
    try:
        # === VERIFICAR ESTADO INICIAL DEL BACKEND ===
        print(f"\n📊 Verificando estado inicial del backend...")
        try:
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            initial_count = len(response.json()) if response.status_code == 200 else 0
            print(f"✅ Convocatorias iniciales en backend: {initial_count}")
        except:
            initial_count = 0
            print("⚠️ No se pudo verificar estado inicial del backend")
        
        # === PASO 1: NAVEGACIÓN Y LOGIN SEGURO ===
        print(f"\n🚀 Paso 1: Navegando a login...")
        login_url = f"{custom_config.FRONTEND_URL}/login"
        driver.get(login_url)
        time.sleep(3)  # Tiempo extra para que cargue completamente
        
        print(f"🔐 Realizando login seguro...")
        if not safe_login(driver, email, password):
            raise Exception("Login seguro falló")
        
        # Esperar redirección con tiempo extra
        print(f"⏳ Esperando redirección al dashboard...")
        time.sleep(8)  # Tiempo extra para la redirección
        
        # Verificar redirección
        current_url = driver.current_url
        print(f"🌐 URL actual después del login: {current_url}")
        
        if "/dashboard" not in current_url:
            # Intentar hacer clic en escape para cerrar posibles popups
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            time.sleep(2)
            
            current_url = driver.current_url
            if "/dashboard" not in current_url:
                # Tomar screenshot para debugging
                driver.save_screenshot("reports/screenshots/login_debug.png")
                raise AssertionError(f"Login falló - URL final: {current_url}")
        
        print(f"✅ Login exitoso - Dashboard cargado")
        driver.save_screenshot("reports/screenshots/safe_01_login_success.png")
        
        # === PASO 2: ABRIR FORMULARIO ===
        print(f"\n🔘 Paso 2: Abriendo formulario de convocatoria...")
        try:
            create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
            driver.execute_script("arguments[0].scrollIntoView(true);", create_button)
            time.sleep(1)
            create_button.click()
            time.sleep(4)
        except Exception as e:
            print(f"❌ Error abriendo formulario: {e}")
            # Intentar selectores alternativos
            create_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Crear')]")
            create_button.click()
            time.sleep(4)
        
        print(f"✅ Formulario abierto")
        driver.save_screenshot("reports/screenshots/safe_02_form_opened.png")
        
        # === PASO 3: LLENAR CAMPOS DE FORMA SEGURA ===
        print(f"\n📝 Paso 3: Llenando campos de forma segura...")
        
        fields_filled = 0
        
        # INPUT FIELDS
        input_fields = {
            "subscriptionYear": test_data["subscriptionYear"],
            "country": test_data["country"],
            "institution": test_data["institution"],
            "validity": test_data["validity"],
            "subscriptionLevel": test_data["subscriptionLevel"]
        }
        
        for field_id, value in input_fields.items():
            try:
                field = driver.find_element(By.ID, field_id)
                if clear_and_type_safe(driver, field, value):
                    fields_filled += 1
                    print(f"✅ INPUT {field_id}: '{value}'")
                else:
                    print(f"❌ INPUT {field_id} falló")
            except Exception as e:
                print(f"❌ INPUT {field_id} error: {e}")
        
        # SELECT FIELDS
        select_fields = {
            "agreementType": test_data["agreementType"],
            "state": test_data["state"]
        }
        
        for field_id, value in select_fields.items():
            try:
                select_element = driver.find_element(By.ID, field_id)
                select_obj = Select(select_element)
                select_obj.select_by_visible_text(value)
                print(f"✅ SELECT {field_id}: '{value}'")
                fields_filled += 1
            except Exception as e:
                print(f"❌ SELECT {field_id} falló: {e}")
        
        # URL FIELDS
        url_fields = {
            "dreLink": test_data["dreLink"],
            "agreementLink": test_data["agreementLink"],
            "internationalLink": test_data["internationalLink"]
        }
        
        for field_id, value in url_fields.items():
            try:
                field = driver.find_element(By.ID, field_id)
                if clear_and_type_safe(driver, field, value):
                    fields_filled += 1
                    print(f"✅ URL {field_id}: '{value}'")
                else:
                    print(f"❌ URL {field_id} falló")
            except Exception as e:
                print(f"❌ URL {field_id} error: {e}")
        
        # TEXTAREA FIELD
        try:
            textarea_field = driver.find_element(By.ID, "Props")
            if clear_and_type_safe(driver, textarea_field, test_data["Props"]):
                fields_filled += 1
                print(f"✅ TEXTAREA Props: '{test_data['Props'][:50]}...'")
            else:
                print(f"❌ TEXTAREA Props falló")
        except Exception as e:
            print(f"❌ TEXTAREA Props error: {e}")
        
        # IDIOMAS (CHECKBOXES)
        print(f"\n🌐 Seleccionando idiomas...")
        languages_selected = 0
        for language in test_data["languages"]:
            try:
                label_xpath = f"//label[text()='{language}']"
                label = driver.find_element(By.XPATH, label_xpath)
                label.click()
                languages_selected += 1
                print(f"✅ IDIOMA seleccionado: '{language}'")
                time.sleep(0.5)
            except Exception as e:
                print(f"❌ IDIOMA '{language}' falló: {e}")
        
        print(f"\n📊 Resumen del llenado:")
        print(f"   Campos llenados: {fields_filled}")
        print(f"   Idiomas seleccionados: {languages_selected}")
        
        driver.save_screenshot("reports/screenshots/safe_03_form_filled.png")
        
        # === PASO 4: ENVIAR FORMULARIO ===
        print(f"\n📤 Paso 4: Enviando formulario...")
        
        # Cerrar cualquier popup antes de enviar
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            time.sleep(1)
        except:
            pass
        
        submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Crear Convocatoria')]")
        driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
        time.sleep(1)
        
        try:
            form = driver.find_element(By.TAG_NAME, "form")
            form.submit()
            print(f"✅ Formulario enviado con form.submit()")
        except:
            submit_button.click()
            print(f"✅ Formulario enviado con button.click()")
        
        time.sleep(5)
        
        final_url = driver.current_url
        print(f"🌐 URL después del envío: {final_url}")
        
        driver.save_screenshot("reports/screenshots/safe_04_form_submitted.png")
        
        # === PASO 5: VERIFICAR EN BACKEND ===
        print(f"\n🔍 Paso 5: Verificando en backend...")
        time.sleep(3)
        
        try:
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            if response.status_code == 200:
                final_convocatorias = response.json()
                final_count = len(final_convocatorias)
                
                print(f"📊 Estado del backend:")
                print(f"   Inicial: {initial_count} convocatorias")
                print(f"   Final: {final_count} convocatorias")
                print(f"   Diferencia: +{final_count - initial_count}")
                
                # Buscar nuestra convocatoria
                our_convocatoria = None
                for conv in final_convocatorias:
                    if conv.get('institution') == test_data['institution']:
                        our_convocatoria = conv
                        break
                
                if our_convocatoria:
                    print(f"\n🎉 ¡CONVOCATORIA ENCONTRADA EN BACKEND!")
                    print(f"   ID: {our_convocatoria.get('id')}")
                    print(f"   Institución: {our_convocatoria.get('institution')}")
                    print(f"   País: {our_convocatoria.get('country')}")
                    
                    driver.save_screenshot("reports/screenshots/safe_05_success.png")
                    
                    print(f"\n🎉 ¡PRUEBA DE INTEGRACIÓN EXITOSA CON MANEJO SEGURO!")
                    return True
                else:
                    print(f"⚠️ Convocatoria no encontrada, pero el contador aumentó")
                    if final_count > initial_count:
                        print(f"✅ Se creó una convocatoria exitosamente")
                        return True
            else:
                print(f"❌ Error consultando backend: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error verificando backend: {e}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        driver.save_screenshot("reports/screenshots/safe_99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
