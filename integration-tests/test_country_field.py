"""
Prueba específica para verificar el llenado del campo País *
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def test_country_field_debugging(driver):
    """
    Prueba específica para verificar el campo País *
    """
    print("\n" + "="*70)
    print("🌍 DEBUGGING ESPECÍFICO: CAMPO PAÍS *")
    print("="*70)
    
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
        time.sleep(5)
        
        # Cerrar popups
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        except:
            pass
        
        # === ABRIR FORMULARIO ===
        print("🔘 Abriendo formulario...")
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        create_button.click()
        time.sleep(3)
        
        driver.save_screenshot("reports/screenshots/form_opened_country_debug.png")
        
        # === ANALIZAR CAMPO PAÍS ===
        print("\n🌍 Analizando campo País *...")
        
        # Buscar el campo País con diferentes estrategias
        country_search_methods = [
            {
                "name": "Por ID 'country'",
                "method": lambda: driver.find_element(By.ID, "country")
            },
            {
                "name": "Por name 'country'", 
                "method": lambda: driver.find_element(By.NAME, "country")
            },
            {
                "name": "Por label text 'País'",
                "method": lambda: driver.find_element(By.XPATH, "//label[contains(text(), 'País')]/..//input | //label[contains(text(), 'País')]/..//select")
            },
            {
                "name": "Por placeholder 'País'",
                "method": lambda: driver.find_element(By.CSS_SELECTOR, "input[placeholder*='País'], select[placeholder*='País']")
            },
            {
                "name": "Cualquier select cerca de 'País'",
                "method": lambda: driver.find_element(By.XPATH, "//label[contains(text(), 'País')]/following-sibling::select | //label[contains(text(), 'País')]/parent::*/select")
            },
            {
                "name": "Input cerca de 'País'",
                "method": lambda: driver.find_element(By.XPATH, "//label[contains(text(), 'País')]/following-sibling::input | //label[contains(text(), 'País')]/parent::*/input")
            }
        ]
        
        country_field = None
        country_field_type = None
        
        for method in country_search_methods:
            try:
                print(f"🔍 Probando: {method['name']}")
                field = method['method']()
                if field and field.is_displayed():
                    country_field = field
                    country_field_type = field.tag_name
                    print(f"✅ ¡Campo País encontrado con {method['name']}!")
                    print(f"   Tipo: {field.tag_name}")
                    print(f"   ID: '{field.get_attribute('id')}'")
                    print(f"   Name: '{field.get_attribute('name')}'")
                    print(f"   Class: '{field.get_attribute('class')}'")
                    print(f"   Placeholder: '{field.get_attribute('placeholder')}'")
                    print(f"   Value actual: '{field.get_attribute('value')}'")
                    
                    if field.tag_name == "select":
                        # Si es select, mostrar opciones
                        select_obj = Select(field)
                        options = [opt.text for opt in select_obj.options]
                        print(f"   Opciones disponibles ({len(options)}): {options[:10]}{'...' if len(options) > 10 else ''}")
                    
                    break
            except Exception as e:
                print(f"❌ {method['name']} falló: {e}")
        
        if not country_field:
            print("\n📋 LISTANDO TODOS LOS CAMPOS PARA ENCONTRAR PAÍS:")
            
            # Buscar todos los inputs y selects
            all_inputs = driver.find_elements(By.CSS_SELECTOR, "input, select")
            print(f"\n🔍 Todos los campos del formulario ({len(all_inputs)}):")
            
            for i, field in enumerate(all_inputs):
                if field.is_displayed():
                    field_id = field.get_attribute('id')
                    field_name = field.get_attribute('name')
                    field_placeholder = field.get_attribute('placeholder')
                    field_value = field.get_attribute('value')
                    field_class = field.get_attribute('class')
                    
                    print(f"\n{i+1}. {field.tag_name.upper()}:")
                    print(f"   ID: '{field_id}'")
                    print(f"   Name: '{field_name}'") 
                    print(f"   Class: '{field_class}'")
                    print(f"   Placeholder: '{field_placeholder}'")
                    print(f"   Value: '{field_value}'")
                    
                    # Buscar label asociado
                    try:
                        if field_id:
                            label = driver.find_element(By.CSS_SELECTOR, f"label[for='{field_id}']")
                            print(f"   Label: '{label.text}'")
                    except:
                        try:
                            # Buscar label padre
                            parent = field.find_element(By.XPATH, "..")
                            label = parent.find_element(By.TAG_NAME, "label")
                            print(f"   Label (parent): '{label.text}'")
                        except:
                            pass
                    
                    # Si contiene "country" o "país" en cualquier atributo
                    if any(keyword in str(attr).lower() for attr in [field_id, field_name, field_placeholder, field_class] 
                           for keyword in ['country', 'país', 'pais']):
                        print(f"   ⭐ CANDIDATO PARA PAÍS: Este podría ser el campo País")
                        country_field = field
                        country_field_type = field.tag_name
            
            if not country_field:
                driver.save_screenshot("reports/screenshots/no_country_field.png")
                raise AssertionError("No se encontró el campo País")
        
        # === LLENAR CAMPO PAÍS ===
        print(f"\n🌍 Llenando campo País ({country_field_type})...")
        
        target_country = "Alemania"
        
        if country_field_type == "select":
            # Es un select dropdown
            try:
                select_obj = Select(country_field)
                
                # Método 1: Por texto visible
                try:
                    select_obj.select_by_visible_text(target_country)
                    print(f"✅ País seleccionado por texto: '{target_country}'")
                except:
                    # Método 2: Por valor
                    try:
                        select_obj.select_by_value(target_country)
                        print(f"✅ País seleccionado por valor: '{target_country}'")
                    except:
                        # Método 3: Buscar opciones que contengan "Alemania"
                        for option in select_obj.options:
                            if "alemania" in option.text.lower() or "germany" in option.text.lower():
                                select_obj.select_by_visible_text(option.text)
                                print(f"✅ País seleccionado (aproximado): '{option.text}'")
                                break
                        else:
                            # Método 4: Seleccionar el primer país disponible
                            if len(select_obj.options) > 1:
                                select_obj.select_by_index(1)  # Skip first (usually empty)
                                selected_option = select_obj.first_selected_option
                                print(f"✅ País seleccionado (primero disponible): '{selected_option.text}'")
                            else:
                                raise Exception("No hay opciones disponibles")
                
            except Exception as e:
                print(f"❌ Error llenando select de país: {e}")
                
        elif country_field_type == "input":
            # Es un input de texto
            try:
                # Limpiar y llenar
                country_field.clear()
                country_field.send_keys(target_country)
                print(f"✅ País ingresado en input: '{target_country}'")
                
                # Verificar que se guardó
                actual_value = country_field.get_attribute('value')
                print(f"🔍 Valor actual después del llenado: '{actual_value}'")
                
                # Si es un campo con autocompletado, puede necesitar Enter o Tab
                country_field.send_keys(Keys.TAB)
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Error llenando input de país: {e}")
        
        # === VERIFICAR RESULTADO ===
        print(f"\n✅ Verificando resultado...")
        
        # Tomar screenshot después del llenado
        driver.save_screenshot("reports/screenshots/country_filled.png")
        
        # Verificar valor final
        if country_field_type == "select":
            select_obj = Select(country_field)
            selected_text = select_obj.first_selected_option.text
            print(f"🔍 País seleccionado final: '{selected_text}'")
        else:
            final_value = country_field.get_attribute('value')
            print(f"🔍 País ingresado final: '{final_value}'")
        
        print(f"\n🎉 ¡Prueba del campo País completada!")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error en la prueba: {e}")
        driver.save_screenshot("reports/screenshots/country_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
