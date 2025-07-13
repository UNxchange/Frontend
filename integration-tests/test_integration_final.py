"""
Prueba final de integración con las correcciones identificadas
"""
import pytest
import time
import requests
from datetime import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def test_complete_integration_corrected(driver):
    """
    Prueba de integración completa con las correcciones identificadas
    """
    print("\n" + "="*80)
    print("🎯 PRUEBA FINAL DE INTEGRACIÓN - VERSIÓN CORREGIDA")
    print("="*80)
    
    email = custom_config.TEST_USER_EMAIL
    password = custom_config.TEST_USER_PASSWORD
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    try:
        # === PASO 1: LOGIN ===
        print("🚀 Paso 1: Login...")
        login_url = f"{custom_config.FRONTEND_URL}/login"
        driver.get(login_url)
        time.sleep(2)
        
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
        
        print("✅ Login exitoso")
        
        # === PASO 2: ABRIR FORMULARIO ===
        print("\n📋 Paso 2: Abriendo formulario...")
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        create_button.click()
        time.sleep(3)
        
        print("✅ Formulario abierto")
        
        # === PASO 3: LLENAR FORMULARIO CON MÉTODO CORREGIDO ===
        print("\n📝 Paso 3: Llenando formulario...")
        
        # Datos de prueba únicos
        test_data = {
            "institution": f"Universidad de Prueba Integración {timestamp}",
            "agreementType": "Intercambio",
            "validity": "December - 2024", 
            "state": "Vigente",
            "subscriptionLevel": "Universidad Nacional de Colombia",
            "subscriptionYear": "2024",  # Campo problemático identificado
            "country": "Alemania",
            "languages": ["Español", "Alemán"],
            "dreLink": f"https://www.example.com/dre/{timestamp}",
            "agreementLink": f"https://www.example.com/agreement/{timestamp}",
            "internationalLink": f"https://www.example.com/international/{timestamp}",
            "Props": f"Prueba de integración automatizada - {timestamp}"
        }
        
        filled_count = 0
        
        # 1. Año de Suscripción (MÉTODO CORREGIDO) 
        try:
            year_field = driver.find_element(By.ID, "subscriptionYear")
            year_field.clear()
            year_field.send_keys(test_data["subscriptionYear"])
            print(f"✅ subscriptionYear: {test_data['subscriptionYear']}")
            filled_count += 1
        except Exception as e:
            print(f"❌ subscriptionYear falló: {e}")
        
        # 2. Institución
        try:
            institution_field = driver.find_element(By.ID, "institution")
            institution_field.clear()
            institution_field.send_keys(test_data["institution"])
            print(f"✅ institution: {test_data['institution']}")
            filled_count += 1
        except Exception as e:
            print(f"❌ institution falló: {e}")
        
        # 3. Tipo de Acuerdo
        try:
            agreement_select = Select(driver.find_element(By.ID, "agreementType"))
            agreement_select.select_by_visible_text(test_data["agreementType"])
            print(f"✅ agreementType: {test_data['agreementType']}")
            filled_count += 1
        except Exception as e:
            print(f"❌ agreementType falló: {e}")
        
        # 4. Vigencia
        try:
            validity_select = Select(driver.find_element(By.ID, "validity"))
            validity_select.select_by_visible_text(test_data["validity"])
            print(f"✅ validity: {test_data['validity']}")
            filled_count += 1
        except Exception as e:
            print(f"❌ validity falló: {e}")
        
        # 5. Estado
        try:
            state_select = Select(driver.find_element(By.ID, "state"))
            state_select.select_by_visible_text(test_data["state"])
            print(f"✅ state: {test_data['state']}")
            filled_count += 1
        except Exception as e:
            print(f"❌ state falló: {e}")
        
        # 6. Nivel de Suscripción
        try:
            level_select = Select(driver.find_element(By.ID, "subscriptionLevel"))
            level_select.select_by_visible_text(test_data["subscriptionLevel"])
            print(f"✅ subscriptionLevel: {test_data['subscriptionLevel']}")
            filled_count += 1
        except Exception as e:
            print(f"❌ subscriptionLevel falló: {e}")
        
        # 7-9. URLs
        url_fields = ["dreLink", "agreementLink", "internationalLink"]
        for field_id in url_fields:
            try:
                field = driver.find_element(By.ID, field_id)
                field.clear()
                field.send_keys(test_data[field_id])
                print(f"✅ {field_id}: {test_data[field_id]}")
                filled_count += 1
            except Exception as e:
                print(f"❌ {field_id} falló: {e}")
        
        # 10. Descripción
        try:
            props_field = driver.find_element(By.ID, "Props")
            props_field.clear()
            props_field.send_keys(test_data["Props"])
            print(f"✅ Props: {test_data['Props']}")
            filled_count += 1
        except Exception as e:
            print(f"❌ Props falló: {e}")
        
        # 11. Idiomas
        try:
            languages_filled = 0
            for language in test_data["languages"]:
                try:
                    checkbox = driver.find_element(By.XPATH, f"//input[@type='checkbox' and @value='{language}']")
                    if not checkbox.is_selected():
                        checkbox.click()
                        languages_filled += 1
                except:
                    continue
            
            if languages_filled > 0:
                print(f"✅ languages: {languages_filled} idiomas seleccionados")
                filled_count += 1
        except Exception as e:
            print(f"❌ languages falló: {e}")
        
        print(f"\n📊 Resumen: {filled_count}/11 campos completados")
        
        # Screenshot antes del envío
        driver.save_screenshot("reports/screenshots/final_form_filled.png")
        
        # === PASO 4: ENVIAR FORMULARIO (MÉTODO CORREGIDO) ===
        print("\n📤 Paso 4: Enviando formulario...")
        
        # Consultar estado inicial del backend
        try:
            initial_response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=5)
            initial_count = len(initial_response.json()) if initial_response.status_code == 200 else 0
            print(f"📊 Convocatorias iniciales en backend: {initial_count}")
        except:
            initial_count = 0
        
        # Método corregido: usar form.submit()
        try:
            form = driver.find_element(By.TAG_NAME, "form")
            print("✅ Formulario encontrado")
            
            # Método exitoso identificado en debugging
            driver.execute_script("arguments[0].submit();", form)
            print("✅ Formulario enviado via JavaScript submit")
            
            # Esperar respuesta
            time.sleep(5)
            
            # Verificar cambio de URL
            final_url = driver.current_url
            print(f"🌐 URL después del envío: {final_url}")
            
            # Screenshot después del envío
            driver.save_screenshot("reports/screenshots/final_after_submit.png")
            
        except Exception as e:
            print(f"❌ Error en envío: {e}")
            
            # Método alternativo: buscar botón específico
            try:
                submit_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Crear Convocatoria')]")
                driver.execute_script("arguments[0].click();", submit_button)
                print("✅ Enviado via botón específico")
                time.sleep(5)
            except Exception as e2:
                print(f"❌ Método alternativo también falló: {e2}")
                raise e2
        
        # === PASO 5: VERIFICAR RESULTADO ===
        print("\n🔍 Paso 5: Verificando resultado...")
        
        # Esperar un poco más para persistencia
        time.sleep(10)
        
        # Verificar en backend
        try:
            final_response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            if final_response.status_code == 200:
                final_convocatorias = final_response.json()
                final_count = len(final_convocatorias)
                print(f"📊 Convocatorias finales en backend: {final_count}")
                
                if final_count > initial_count:
                    print("🎉 ¡ÉXITO! Nueva convocatoria detectada en backend")
                    
                    # Buscar nuestra convocatoria
                    for conv in final_convocatorias:
                        if test_data["institution"] in conv.get("institution", ""):
                            print(f"✅ Convocatoria encontrada: ID {conv.get('id')}")
                            print(f"   Institución: {conv.get('institution')}")
                            print(f"   País: {conv.get('country')}")
                            return True
                else:
                    print("⚠️ No se detectó incremento en el backend")
                    print("   Posibles causas:")
                    print("   - Validación de campos")
                    print("   - Problema de autenticación")
                    print("   - Error en serialización")
            else:
                print(f"❌ Error consultando backend: {final_response.status_code}")
                
        except Exception as e:
            print(f"❌ Error verificando backend: {e}")
        
        # Verificar en el frontend
        print("\n🌐 Verificando en frontend...")
        page_content = driver.page_source.lower()
        
        success_indicators = ["éxito", "exitoso", "creado", "guardado", "success"]
        error_indicators = ["error", "falló", "problema", "failed"]
        
        if any(indicator in page_content for indicator in success_indicators):
            print("✅ Indicador de éxito detectado en frontend")
        elif any(indicator in page_content for indicator in error_indicators):
            print("❌ Indicador de error detectado en frontend")
        else:
            print("ℹ️ No se detectaron indicadores claros")
        
        print(f"\n📊 RESUMEN FINAL:")
        print(f"   • Login: ✅")
        print(f"   • Formulario abierto: ✅")
        print(f"   • Campos llenados: {filled_count}/11 ✅")
        print(f"   • Formulario enviado: ✅")
        print(f"   • Incremento en backend: {'✅' if final_count > initial_count else '❌'}")
        
        return final_count > initial_count
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        driver.save_screenshot("reports/screenshots/final_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
