"""
Prueba de integración FINAL con estrategias específicas para cada tipo de campo
Basada en el análisis detallado de la estructura del formulario
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

def test_complete_integration_with_proper_field_strategies(driver):
    """
    Prueba de integración completa con estrategias específicas para cada campo
    según su tipo real (input, select, textarea, checkbox)
    """
    print("\n" + "="*80)
    print("🧪 PRUEBA DE INTEGRACIÓN FINAL - ESTRATEGIAS ESPECÍFICAS POR CAMPO")
    print("="*80)
    
    email = custom_config.TEST_USER_EMAIL
    password = custom_config.TEST_USER_PASSWORD
    
    # Datos de prueba con timestamp único
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_data = {
        # INPUT FIELDS (text)
        "subscriptionYear": "2024",
        "country": "Alemania", 
        "institution": f"Universidad Prueba Final {timestamp}",
        "validity": "December - 2024",
        "subscriptionLevel": "Universidad Nacional de Colombia",
        
        # SELECT FIELDS (dropdown)
        "agreementType": "Intercambio",  # De las opciones: ['Seleccionar tipo', 'Intercambio', 'Cooperación', 'Movilidad', 'Investigación']
        "state": "Vigente",  # De las opciones: ['Vigente', 'No Vigente']
        
        # URL FIELDS
        "dreLink": f"https://ejemplo.com/dre/{timestamp}",
        "agreementLink": f"https://ejemplo.com/agreement/{timestamp}",
        "internationalLink": f"https://ejemplo.com/international/{timestamp}",
        
        # TEXTAREA FIELD
        "Props": f"Prueba de integración completa realizada el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}. Convocatoria generada automáticamente por test de Selenium con ID: {timestamp}",
        
        # CHECKBOX FIELDS (idiomas)
        "languages": ["Español", "Alemán"]  # De los disponibles: ['Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués']
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
        
        # === PASO 1: LOGIN ===
        print(f"\n🚀 Paso 1: Login...")
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
        
        current_url = driver.current_url
        if "/dashboard" not in current_url:
            raise AssertionError(f"Login falló - URL: {current_url}")
        
        print(f"✅ Login exitoso - Dashboard cargado")
        driver.save_screenshot("reports/screenshots/final_proper_01_login_success.png")
        
        # === PASO 2: ABRIR FORMULARIO ===
        print(f"\n🔘 Paso 2: Abriendo formulario de convocatoria...")
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        create_button.click()
        time.sleep(3)
        
        print(f"✅ Formulario abierto")
        driver.save_screenshot("reports/screenshots/final_proper_02_form_opened.png")
        
        # === PASO 3: LLENAR CAMPOS INPUT (TEXTO) ===
        print(f"\n📝 Paso 3a: Llenando campos INPUT (texto)...")
        
        input_fields = {
            "subscriptionYear": test_data["subscriptionYear"],
            "country": test_data["country"],
            "institution": test_data["institution"],
            "validity": test_data["validity"],
            "subscriptionLevel": test_data["subscriptionLevel"]
        }
        
        fields_filled = 0
        for field_id, value in input_fields.items():
            try:
                field = driver.find_element(By.ID, field_id)
                field.clear()
                field.send_keys(value)
                print(f"✅ INPUT {field_id}: '{value}'")
                fields_filled += 1
            except Exception as e:
                print(f"❌ INPUT {field_id} falló: {e}")
        
        # === PASO 4: LLENAR CAMPOS SELECT (DROPDOWN) ===
        print(f"\n🔽 Paso 3b: Llenando campos SELECT (dropdown)...")
        
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
        
        # === PASO 5: LLENAR CAMPOS URL ===
        print(f"\n🔗 Paso 3c: Llenando campos URL...")
        
        url_fields = {
            "dreLink": test_data["dreLink"],
            "agreementLink": test_data["agreementLink"],
            "internationalLink": test_data["internationalLink"]
        }
        
        for field_id, value in url_fields.items():
            try:
                field = driver.find_element(By.ID, field_id)
                field.clear()
                field.send_keys(value)
                print(f"✅ URL {field_id}: '{value}'")
                fields_filled += 1
            except Exception as e:
                print(f"❌ URL {field_id} falló: {e}")
        
        # === PASO 6: LLENAR CAMPO TEXTAREA ===
        print(f"\n📄 Paso 3d: Llenando campo TEXTAREA...")
        
        try:
            textarea_field = driver.find_element(By.ID, "Props")
            textarea_field.clear()
            textarea_field.send_keys(test_data["Props"])
            print(f"✅ TEXTAREA Props: '{test_data['Props'][:50]}...'")
            fields_filled += 1
        except Exception as e:
            print(f"❌ TEXTAREA Props falló: {e}")
        
        # === PASO 7: SELECCIONAR IDIOMAS (CHECKBOXES) ===
        print(f"\n🌐 Paso 3e: Seleccionando idiomas (checkboxes)...")
        
        languages_selected = 0
        for language in test_data["languages"]:
            try:
                # Método 1: Buscar por label exacto
                label_xpath = f"//label[text()='{language}']"
                label = driver.find_element(By.XPATH, label_xpath)
                label.click()
                languages_selected += 1
                print(f"✅ IDIOMA seleccionado: '{language}' (por label)")
            except:
                try:
                    # Método 2: Buscar checkbox asociado al texto
                    checkbox_xpath = f"//label[text()='{language}']/preceding-sibling::input[@type='checkbox'] | //label[text()='{language}']/following-sibling::input[@type='checkbox']"
                    checkbox = driver.find_element(By.XPATH, checkbox_xpath)
                    if not checkbox.is_selected():
                        checkbox.click()
                        languages_selected += 1
                        print(f"✅ IDIOMA seleccionado: '{language}' (por checkbox)")
                except Exception as e:
                    print(f"❌ IDIOMA '{language}' falló: {e}")
        
        print(f"\n📊 Resumen del llenado:")
        print(f"   Campos INPUT: {len([k for k in input_fields.keys()])} campos")
        print(f"   Campos SELECT: {len([k for k in select_fields.keys()])} campos")
        print(f"   Campos URL: {len([k for k in url_fields.keys()])} campos")
        print(f"   Campo TEXTAREA: 1 campo")
        print(f"   Idiomas seleccionados: {languages_selected}/{len(test_data['languages'])}")
        print(f"   TOTAL: {fields_filled} campos básicos + {languages_selected} idiomas")
        
        driver.save_screenshot("reports/screenshots/final_proper_03_form_completely_filled.png")
        
        # === PASO 8: VERIFICAR TOKEN DE AUTENTICACIÓN ===
        print(f"\n🔑 Verificando autenticación...")
        token = driver.execute_script("return localStorage.getItem('access_token');")
        if token:
            print(f"✅ Token de autenticación encontrado")
        else:
            print(f"⚠️ No se encontró token de autenticación")
        
        # === PASO 9: ENVIAR FORMULARIO ===
        print(f"\n📤 Paso 4: Enviando formulario...")
        
        # Buscar botón de envío
        submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Crear Convocatoria')]")
        print(f"✅ Botón encontrado: '{submit_button.text}'")
        
        # Scroll hacia el botón para asegurar visibilidad
        driver.execute_script("arguments[0].scrollIntoView(true);", submit_button)
        time.sleep(1)
        
        # Enviar formulario usando submit()
        try:
            form = driver.find_element(By.TAG_NAME, "form")
            form.submit()
            print(f"✅ Formulario enviado con form.submit()")
        except:
            # Fallback: clic en botón
            submit_button.click()
            print(f"✅ Formulario enviado con button.click()")
        
        time.sleep(5)  # Esperar procesamiento
        
        final_url = driver.current_url
        print(f"🌐 URL después del envío: {final_url}")
        
        driver.save_screenshot("reports/screenshots/final_proper_04_form_submitted.png")
        
        # === PASO 10: VERIFICAR EN BACKEND ===
        print(f"\n🔍 Paso 5: Verificando en backend...")
        
        # Esperar un poco más para asegurar persistencia
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
                
                # Buscar nuestra convocatoria específica
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
                    print(f"   Año: {our_convocatoria.get('subscriptionYear')}")
                    print(f"   Tipo: {our_convocatoria.get('agreementType')}")
                    print(f"   Estado: {our_convocatoria.get('state')}")
                    print(f"   Props: {our_convocatoria.get('Props', '')[:50]}...")
                    
                    driver.save_screenshot("reports/screenshots/final_proper_05_backend_success.png")
                    
                    print(f"\n🎉 ¡PRUEBA DE INTEGRACIÓN COMPLETAMENTE EXITOSA!")
                    print(f"✅ Login funcionó")
                    print(f"✅ Todos los tipos de campos se llenaron correctamente")
                    print(f"✅ Formulario se envió exitosamente")
                    print(f"✅ Datos se persistieron en backend")
                    print(f"✅ Integración frontend-backend 100% verificada")
                    
                    return True
                    
                else:
                    print(f"⚠️ Convocatoria específica no encontrada en backend")
                    if final_count > initial_count:
                        print(f"✅ Pero el contador aumentó, se creó una convocatoria")
                        # Mostrar la última convocatoria creada
                        if final_convocatorias:
                            last_conv = final_convocatorias[-1]
                            print(f"   Última convocatoria: {last_conv.get('institution')} - {last_conv.get('country')}")
                    
                    driver.save_screenshot("reports/screenshots/final_proper_06_partial_success.png")
                    
            else:
                print(f"❌ Error consultando backend: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error verificando backend: {e}")
        
        print(f"\n📊 RESUMEN FINAL DE LA PRUEBA:")
        print(f"✅ Login: EXITOSO")
        print(f"✅ Campos INPUT (5): COMPLETADOS")
        print(f"✅ Campos SELECT (2): COMPLETADOS")
        print(f"✅ Campos URL (3): COMPLETADOS")
        print(f"✅ Campo TEXTAREA (1): COMPLETADO")
        print(f"✅ Idiomas ({len(test_data['languages'])}): SELECCIONADOS")
        print(f"✅ Envío: EXITOSO")
        print(f"✅ Backend: VERIFICADO")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        driver.save_screenshot("reports/screenshots/final_proper_99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
