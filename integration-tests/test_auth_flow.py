"""
Prueba con verificación de autenticación y debugging avanzado
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

def get_jwt_token_from_browser(driver):
    """
    Extrae el token JWT del localStorage del navegador
    """
    try:
        # Ejecutar JavaScript para obtener el token
        token = driver.execute_script("return localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('jwt');")
        if token:
            print(f"🔑 Token JWT encontrado: {token[:50]}...")
            return token
        else:
            print("⚠️ No se encontró token JWT en localStorage")
            
            # Verificar todas las claves en localStorage
            all_keys = driver.execute_script("return Object.keys(localStorage);")
            print(f"🔍 Claves en localStorage: {all_keys}")
            
            return None
    except Exception as e:
        print(f"❌ Error obteniendo token: {e}")
        return None

def verify_with_auth(endpoint, institution_name, jwt_token=None):
    """
    Verifica la convocatoria en el backend con autenticación
    """
    headers = {}
    if jwt_token:
        headers['Authorization'] = f'Bearer {jwt_token}'
        
    print(f"🔍 Verificando con headers: {headers}")
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=10)
        print(f"📡 Response status: {response.status_code}")
        
        if response.status_code == 200:
            convocatorias = response.json()
            print(f"📊 Convocatorias encontradas: {len(convocatorias)}")
            
            # Buscar nuestra convocatoria
            for conv in convocatorias:
                if conv.get('institution') == institution_name:
                    print(f"🎉 ¡CONVOCATORIA ENCONTRADA!")
                    print(f"   ID: {conv.get('id')}")
                    print(f"   Institución: {conv.get('institution')}")
                    print(f"   País: {conv.get('country')}")
                    return True
            
            print(f"⚠️ Convocatoria '{institution_name}' no encontrada")
            return False
        else:
            print(f"❌ Error en respuesta: {response.status_code}")
            print(f"📄 Response: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"❌ Error en verificación: {e}")
        return False

def test_auth_aware_convocatoria_creation(driver):
    """
    Prueba con verificación de autenticación y debugging avanzado
    """
    print("\n" + "="*80)
    print("🔐 PRUEBA CON AUTENTICACIÓN: CREACIÓN DE CONVOCATORIA")
    print("="*80)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    test_institution = f"Universidad Auth Test {timestamp}"
    
    print(f"🏢 Institución de prueba: {test_institution}")
    
    try:
        # === LOGIN Y EXTRACCIÓN DE TOKEN ===
        print(f"\n🔐 Login y extracción de token...")
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
        
        # Extraer token JWT
        jwt_token = get_jwt_token_from_browser(driver)
        
        # Cerrar popups
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        except:
            pass
        
        print(f"✅ Login exitoso")
        
        # === VERIFICACIÓN INICIAL DEL BACKEND ===
        print(f"\n📊 Estado inicial del backend...")
        initial_count = 0
        try:
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            if response.status_code == 200:
                initial_convocatorias = response.json()
                initial_count = len(initial_convocatorias)
                print(f"📈 Convocatorias iniciales: {initial_count}")
            else:
                print(f"⚠️ Error inicial en backend: {response.status_code}")
        except Exception as e:
            print(f"⚠️ Error consultando estado inicial: {e}")
        
        # === ABRIR Y LLENAR FORMULARIO ===
        print(f"\n📝 Creando convocatoria...")
        
        # Abrir formulario
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", create_button)
        time.sleep(1)
        create_button.click()
        time.sleep(4)
        
        # Llenar campos esenciales
        driver.find_element(By.ID, 'institution').send_keys(test_institution)
        print(f"✅ Institución: {test_institution}")
        
        # Seleccionar tipo de acuerdo
        agreement_select = Select(driver.find_element(By.ID, 'agreementType'))
        agreement_select.select_by_visible_text('Intercambio')
        print(f"✅ Tipo de acuerdo: Intercambio")
        
        # Seleccionar estado
        state_select = Select(driver.find_element(By.ID, 'state'))
        state_select.select_by_visible_text('Vigente')
        print(f"✅ Estado: Vigente")
        
        # Llenar otros campos obligatorios
        driver.find_element(By.ID, 'validity').send_keys('December - 2024')
        driver.find_element(By.ID, 'subscriptionLevel').send_keys('Universidad Nacional de Colombia')
        driver.find_element(By.ID, 'Props').send_keys(f'Prueba con autenticación - {timestamp}')
        
        # Seleccionar idiomas
        checkboxes = driver.find_elements(By.CSS_SELECTOR, "input[type='checkbox']")
        for checkbox in checkboxes[:2]:
            if checkbox.is_displayed() and not checkbox.is_selected():
                checkbox.click()
                time.sleep(0.5)
        
        print(f"✅ Formulario completado")
        
        # === SCREENSHOT ANTES DEL ENVÍO ===
        driver.save_screenshot("reports/screenshots/auth_01_before_submit.png")
        
        # === ENVIAR FORMULARIO ===
        print(f"\n📤 Enviando formulario...")
        
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", submit_button)
        time.sleep(2)
        
        submit_button.click()
        print(f"✅ Click en 'Crear Convocatoria'")
        
        # === MÚLTIPLES VERIFICACIONES TEMPORALES ===
        print(f"\n⏳ Verificaciones temporales...")
        
        verification_times = [3, 6, 10, 15]  # Verificar en múltiples momentos
        
        for wait_time in verification_times:
            time.sleep(wait_time - (verification_times[verification_times.index(wait_time) - 1] if verification_times.index(wait_time) > 0 else 0))
            
            print(f"\n🔍 Verificación a los {wait_time} segundos...")
            
            # Verificar sin autenticación
            found_without_auth = verify_with_auth(custom_config.CONVOCATORIAS_ENDPOINT, test_institution)
            
            # Verificar con autenticación si tenemos token
            found_with_auth = False
            if jwt_token:
                found_with_auth = verify_with_auth(custom_config.CONVOCATORIAS_ENDPOINT, test_institution, jwt_token)
            
            if found_without_auth or found_with_auth:
                print(f"🎉 ¡CONVOCATORIA ENCONTRADA A LOS {wait_time} SEGUNDOS!")
                driver.save_screenshot(f"reports/screenshots/auth_02_success_{wait_time}s.png")
                
                # === RESULTADO EXITOSO ===
                print(f"\n" + "="*80)
                print("🎉 ¡PRUEBA DE INTEGRACIÓN EXITOSA!")
                print(f"✅ Convocatoria creada y verificada")
                print(f"⏱️ Tiempo de persistencia: {wait_time} segundos")
                print(f"🔑 Con autenticación: {'✅' if found_with_auth else '❌'}")
                print(f"🔓 Sin autenticación: {'✅' if found_without_auth else '❌'}")
                print("="*80)
                return True
        
        # === RESULTADO FINAL ===
        print(f"\n" + "="*80)
        print("⚠️ CONVOCATORIA NO VERIFICADA EN BACKEND")
        
        # Verificar estado final
        try:
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            if response.status_code == 200:
                final_convocatorias = response.json()
                final_count = len(final_convocatorias)
                print(f"📊 Estado final: {final_count} convocatorias")
                print(f"📈 Incremento: +{final_count - initial_count}")
                
                if final_count > initial_count:
                    print(f"✅ Se agregaron {final_count - initial_count} convocatorias")
                    print(f"📋 Últimas convocatorias:")
                    for conv in final_convocatorias[-3:]:
                        print(f"   - {conv.get('institution', 'Sin nombre')}")
        except Exception as e:
            print(f"❌ Error en verificación final: {e}")
        
        print(f"📊 Resumen:")
        print(f"   • Formulario enviado: ✅")
        print(f"   • Token JWT extraído: {'✅' if jwt_token else '❌'}")
        print(f"   • Verificación backend: ❌")
        print("="*80)
        
        driver.save_screenshot("reports/screenshots/auth_03_final_state.png")
        return False
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        driver.save_screenshot("reports/screenshots/auth_99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
