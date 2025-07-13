"""
Prueba final con token de autenticación correcto y debugging completo
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

def get_access_token_from_browser(driver):
    """
    Extrae el access_token del localStorage del navegador
    """
    try:
        # Obtener el access_token correcto
        token = driver.execute_script("return localStorage.getItem('access_token');")
        if token:
            print(f"🔑 Access token encontrado: {token[:50]}...")
            return token
        else:
            print("⚠️ No se encontró access_token en localStorage")
            return None
    except Exception as e:
        print(f"❌ Error obteniendo access_token: {e}")
        return None

def debug_network_traffic(driver):
    """
    Intentar capturar información de red del navegador
    """
    try:
        # Verificar si hay errores en la consola
        logs = driver.get_log('browser')
        if logs:
            print(f"📋 Logs del navegador:")
            for log in logs[-5:]:  # Últimos 5 logs
                print(f"   {log['level']}: {log['message'][:100]}")
    except Exception as e:
        print(f"⚠️ No se pudieron obtener logs: {e}")

def verify_form_submission_response(driver):
    """
    Analizar la respuesta después del envío del formulario
    """
    try:
        # Esperar y analizar la página después del envío
        time.sleep(3)
        
        # Verificar la URL actual
        current_url = driver.current_url
        print(f"🌐 URL después del envío: {current_url}")
        
        # Buscar mensajes de éxito o error en la página
        try:
            page_source = driver.page_source
            
            # Palabras clave que podrían indicar éxito
            success_indicators = [
                'exitosa', 'exitoso', 'creada', 'guardada', 'success', 
                'successfully', 'created', 'saved', 'registrada'
            ]
            
            # Palabras clave que podrían indicar error
            error_indicators = [
                'error', 'failed', 'falló', 'problema', 'invalid', 
                'inválido', 'rechazada', 'denied'
            ]
            
            page_text_lower = page_source.lower()
            
            success_found = [word for word in success_indicators if word in page_text_lower]
            error_found = [word for word in error_indicators if word in page_text_lower]
            
            if success_found:
                print(f"✅ Indicadores de éxito encontrados: {success_found}")
            if error_found:
                print(f"❌ Indicadores de error encontrados: {error_found}")
                
            return success_found, error_found
            
        except Exception as e:
            print(f"⚠️ Error analizando página: {e}")
            return [], []
            
    except Exception as e:
        print(f"❌ Error en verificación de respuesta: {e}")
        return [], []

def test_final_debug_convocatoria_creation(driver):
    """
    Prueba final con debugging completo y token correcto
    """
    print("\n" + "="*80)
    print("🔬 PRUEBA FINAL: DEBUGGING COMPLETO DE CREACIÓN")
    print("="*80)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_institution = f"Universidad Final Debug {timestamp}"
    
    print(f"🏢 Institución de prueba: {test_institution}")
    
    try:
        # === LOGIN Y EXTRACCIÓN DE TOKEN CORRECTO ===
        print(f"\n🔐 Login con extracción de access_token...")
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
        
        # Extraer access_token correcto
        access_token = get_access_token_from_browser(driver)
        
        # Cerrar popups
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        except:
            pass
        
        print(f"✅ Login exitoso - Token: {'✅' if access_token else '❌'}")
        
        # === VERIFICACIÓN INICIAL ===
        print(f"\n📊 Estado inicial del backend...")
        initial_count = 0
        try:
            # Probar con y sin autenticación
            headers = {}
            if access_token:
                headers['Authorization'] = f'Bearer {access_token}'
            
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, headers=headers, timeout=10)
            print(f"📡 Estado inicial - Status: {response.status_code}")
            
            if response.status_code == 200:
                initial_convocatorias = response.json()
                initial_count = len(initial_convocatorias)
                print(f"📈 Convocatorias iniciales: {initial_count}")
            else:
                print(f"⚠️ Error inicial: {response.text[:200]}")
                
        except Exception as e:
            print(f"⚠️ Error consultando estado inicial: {e}")
        
        # === ABRIR Y LLENAR FORMULARIO ===
        print(f"\n📝 Abriendo y llenando formulario...")
        
        # Abrir formulario
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", create_button)
        time.sleep(1)
        create_button.click()
        time.sleep(4)
        
        print(f"✅ Formulario abierto")
        
        # Llenar campos mínimos necesarios
        driver.find_element(By.ID, 'institution').send_keys(test_institution)
        
        agreement_select = Select(driver.find_element(By.ID, 'agreementType'))
        agreement_select.select_by_visible_text('Intercambio')
        
        state_select = Select(driver.find_element(By.ID, 'state'))
        state_select.select_by_visible_text('Vigente')
        
        driver.find_element(By.ID, 'validity').send_keys('December - 2024')
        driver.find_element(By.ID, 'subscriptionLevel').send_keys('Universidad Nacional de Colombia')
        driver.find_element(By.ID, 'Props').send_keys(f'Debug test - {timestamp}')
        
        print(f"✅ Campos básicos llenados")
        
        # === CAPTURAR ESTADO ANTES DEL ENVÍO ===
        debug_network_traffic(driver)
        driver.save_screenshot("reports/screenshots/debug_01_before_submit.png")
        
        # === ENVIAR FORMULARIO ===
        print(f"\n📤 Enviando formulario...")
        
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", submit_button)
        time.sleep(2)
        
        print(f"🔘 Haciendo click en: '{submit_button.text}'")
        submit_button.click()
        
        # === ANÁLISIS INMEDIATO POST-ENVÍO ===
        print(f"\n🔍 Análisis post-envío...")
        
        success_indicators, error_indicators = verify_form_submission_response(driver)
        debug_network_traffic(driver)
        
        driver.save_screenshot("reports/screenshots/debug_02_after_submit.png")
        
        # === VERIFICACIONES MÚLTIPLES CON AUTENTICACIÓN ===
        print(f"\n⏳ Verificaciones con autenticación...")
        
        verification_times = [2, 5, 10, 20]
        
        for wait_time in verification_times:
            if wait_time > 2:
                time.sleep(wait_time - verification_times[verification_times.index(wait_time) - 1])
            else:
                time.sleep(wait_time)
                
            print(f"\n🔍 Verificación a los {wait_time} segundos...")
            
            # Verificar con access_token
            headers = {'Authorization': f'Bearer {access_token}'} if access_token else {}
            
            try:
                response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, headers=headers, timeout=10)
                print(f"📡 Status: {response.status_code}")
                
                if response.status_code == 200:
                    convocatorias = response.json()
                    current_count = len(convocatorias)
                    print(f"📊 Convocatorias actuales: {current_count}")
                    print(f"📈 Incremento: +{current_count - initial_count}")
                    
                    # Buscar nuestra convocatoria
                    found = False
                    for conv in convocatorias:
                        if conv.get('institution') == test_institution:
                            print(f"🎉 ¡CONVOCATORIA ENCONTRADA A LOS {wait_time}s!")
                            print(f"   ID: {conv.get('id')}")
                            print(f"   Institución: {conv.get('institution')}")
                            print(f"   País: {conv.get('country')}")
                            print(f"   Estado: {conv.get('state')}")
                            found = True
                            break
                    
                    if found:
                        # === ÉXITO TOTAL ===
                        print(f"\n" + "="*80)
                        print("🎉 ¡ÉXITO TOTAL! CONVOCATORIA CREADA Y VERIFICADA")
                        print(f"⏱️ Tiempo de persistencia: {wait_time} segundos")
                        print(f"🔑 Con access_token: ✅")
                        print(f"📊 Total convocatorias: {current_count}")
                        print("="*80)
                        
                        driver.save_screenshot(f"reports/screenshots/debug_03_success_{wait_time}s.png")
                        return True
                    
                    if current_count > initial_count:
                        print(f"✅ Se agregaron {current_count - initial_count} convocatorias nuevas")
                        print(f"📋 Últimas convocatorias:")
                        for conv in convocatorias[-3:]:
                            print(f"   - {conv.get('institution', 'Sin nombre')}")
                    else:
                        print(f"⚠️ No hay incremento en convocatorias")
                        
                elif response.status_code == 401:
                    print(f"🔐 Error de autenticación (401)")
                elif response.status_code == 403:
                    print(f"🚫 Error de autorización (403)")
                else:
                    print(f"❌ Error: {response.status_code}")
                    print(f"📄 Response: {response.text[:200]}")
                    
            except Exception as e:
                print(f"❌ Error en verificación: {e}")
        
        # === RESULTADO FINAL ===
        print(f"\n" + "="*80)
        print("❌ CONVOCATORIA NO PERSISTIDA EN BACKEND")
        print(f"📊 Diagnóstico:")
        print(f"   • Login: ✅")
        print(f"   • Access token: {'✅' if access_token else '❌'}")
        print(f"   • Formulario llenado: ✅")
        print(f"   • Formulario enviado: ✅")
        print(f"   • Respuesta exitosa: {'✅' if success_indicators else '❌'}")
        print(f"   • Errores detectados: {'❌' if error_indicators else '✅'}")
        print(f"   • Persistencia backend: ❌")
        
        if error_indicators:
            print(f"🔍 Errores encontrados: {error_indicators}")
        
        print(f"\n💡 Posibles causas:")
        print(f"   • Validación de campos en el backend")
        print(f"   • Problema con el token de autenticación")
        print(f"   • Error en la serialización de datos")
        print(f"   • Problema en el endpoint de creación")
        print("="*80)
        
        driver.save_screenshot("reports/screenshots/debug_04_final_analysis.png")
        return False
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        import traceback
        traceback.print_exc()
        driver.save_screenshot("reports/screenshots/debug_99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
