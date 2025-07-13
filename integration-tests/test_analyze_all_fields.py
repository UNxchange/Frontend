"""
Análisis detallado de TODOS los campos del formulario de convocatoria
Para asegurar que cada campo se llene correctamente según su tipo
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def test_analyze_all_form_fields(driver):
    """
    Analizar TODOS los campos del formulario para determinar:
    1. Tipo de elemento (input, select, checkbox, etc.)
    2. Atributos (id, name, class, placeholder, etc.)
    3. Opciones disponibles (para selects)
    4. Formato requerido
    """
    print("\n" + "="*80)
    print("🔍 ANÁLISIS DETALLADO DE TODOS LOS CAMPOS DEL FORMULARIO")
    print("="*80)
    
    email = custom_config.TEST_USER_EMAIL
    password = custom_config.TEST_USER_PASSWORD
    
    try:
        # Login primero
        print(f"\n🚀 Realizando login...")
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
        
        # Abrir formulario
        print(f"\n📝 Abriendo formulario...")
        create_button = driver.find_element(By.CSS_SELECTOR, "button.action-button.primary")
        create_button.click()
        time.sleep(3)
        
        print(f"✅ Formulario abierto, analizando campos...")
        
        # Lista de campos a analizar
        campos_analizar = [
            # Campos ya confirmados
            "subscriptionYear",  # Año de Suscripción *
            "country",          # País *
            
            # Campos a analizar
            "institution",      # Institución *
            "agreementType",    # Tipo de Acuerdo *
            "state",           # Estado *
            "validity",        # Vigencia *
            "subscriptionLevel", # Nivel de Suscripción *
            "dreLink",         # Enlace DRE
            "agreementLink",   # Enlace del Acuerdo
            "internationalLink", # Enlace Internacional
            "Props"            # Propiedades
        ]
        
        # Analizar idiomas por separado (checkboxes)
        print(f"\n" + "="*60)
        print(f"📋 ANÁLISIS DETALLADO DE CAMPOS")
        print(f"="*60)
        
        for campo in campos_analizar:
            print(f"\n🔍 Analizando campo: {campo}")
            print(f"-" * 40)
            
            try:
                # Buscar por ID
                element = driver.find_element(By.ID, campo)
                
                print(f"✅ Encontrado por ID: {campo}")
                print(f"   Tag: {element.tag_name}")
                print(f"   Type: {element.get_attribute('type') or 'N/A'}")
                print(f"   Placeholder: {element.get_attribute('placeholder') or 'N/A'}")
                print(f"   Value: {element.get_attribute('value') or 'N/A'}")
                print(f"   Class: {element.get_attribute('class') or 'N/A'}")
                print(f"   Required: {element.get_attribute('required') or 'N/A'}")
                print(f"   Readonly: {element.get_attribute('readonly') or 'N/A'}")
                
                # Si es un select, obtener opciones
                if element.tag_name == "select":
                    try:
                        select_obj = Select(element)
                        options = [opt.text for opt in select_obj.options]
                        print(f"   Opciones disponibles: {options}")
                        print(f"   Opción seleccionada: {select_obj.first_selected_option.text}")
                    except Exception as e:
                        print(f"   Error obteniendo opciones: {e}")
                
                # Si es input, verificar si acepta texto
                if element.tag_name == "input":
                    original_value = element.get_attribute('value')
                    try:
                        element.clear()
                        element.send_keys("TEST_VALUE")
                        test_value = element.get_attribute('value')
                        print(f"   Acepta texto: {'SÍ' if test_value == 'TEST_VALUE' else 'NO'}")
                        # Restaurar valor original
                        element.clear()
                        if original_value:
                            element.send_keys(original_value)
                    except Exception as e:
                        print(f"   Error probando entrada de texto: {e}")
                
            except NoSuchElementException:
                print(f"❌ No encontrado por ID: {campo}")
                
                # Intentar búsquedas alternativas
                alternative_selectors = [
                    f"input[name='{campo}']",
                    f"select[name='{campo}']",
                    f"textarea[name='{campo}']",
                    f"*[data-field='{campo}']",
                    f"*[data-name='{campo}']"
                ]
                
                found_alternative = False
                for selector in alternative_selectors:
                    try:
                        element = driver.find_element(By.CSS_SELECTOR, selector)
                        print(f"✅ Encontrado con selector: {selector}")
                        print(f"   Tag: {element.tag_name}")
                        print(f"   Type: {element.get_attribute('type') or 'N/A'}")
                        found_alternative = True
                        break
                    except:
                        continue
                
                if not found_alternative:
                    print(f"❌ No se encontró con selectores alternativos")
        
        # Análisis especial para IDIOMAS
        print(f"\n" + "="*60)
        print(f"🌐 ANÁLISIS ESPECIAL: IDIOMAS")
        print(f"="*60)
        
        # Buscar checkboxes de idiomas
        idioma_patterns = [
            "input[type='checkbox']",
            "*[data-field='languages']",
            "*[data-field='idiomas']",
            ".language-checkbox",
            ".idioma-checkbox"
        ]
        
        for pattern in idioma_patterns:
            try:
                checkboxes = driver.find_elements(By.CSS_SELECTOR, pattern)
                if checkboxes:
                    print(f"✅ Encontrados {len(checkboxes)} checkboxes con: {pattern}")
                    for i, checkbox in enumerate(checkboxes[:5]):  # Solo mostrar primeros 5
                        value = checkbox.get_attribute('value')
                        name = checkbox.get_attribute('name')
                        id_attr = checkbox.get_attribute('id')
                        is_checked = checkbox.is_selected()
                        print(f"   [{i}] Value: {value}, Name: {name}, ID: {id_attr}, Checked: {is_checked}")
                    break
            except:
                continue
        else:
            print(f"❌ No se encontraron checkboxes de idiomas")
        
        # Buscar labels de idiomas
        try:
            labels = driver.find_elements(By.TAG_NAME, "label")
            idioma_labels = []
            for label in labels:
                text = label.text.strip()
                if any(idioma in text.lower() for idioma in ['español', 'inglés', 'francés', 'alemán', 'portugués', 'italiano']):
                    idioma_labels.append(text)
            
            if idioma_labels:
                print(f"🏷️ Labels de idiomas encontrados: {idioma_labels}")
            else:
                print(f"❌ No se encontraron labels de idiomas")
        except:
            print(f"❌ Error buscando labels")
        
        # Obtener HTML del formulario para análisis manual
        print(f"\n" + "="*60)
        print(f"📄 HTML DEL FORMULARIO (para análisis manual)")
        print(f"="*60)
        
        try:
            form = driver.find_element(By.TAG_NAME, "form")
            form_html = form.get_attribute('outerHTML')
            
            # Guardar HTML completo en archivo
            with open("reports/form_html_analysis.html", "w", encoding="utf-8") as f:
                f.write(form_html)
            
            print(f"✅ HTML del formulario guardado en: reports/form_html_analysis.html")
            
            # Mostrar un resumen del contenido
            lines = form_html.split('\n')
            input_lines = [line.strip() for line in lines if 'input' in line.lower() or 'select' in line.lower()]
            print(f"📊 Resumen: {len(input_lines)} líneas con elementos input/select encontradas")
            
        except Exception as e:
            print(f"❌ Error obteniendo HTML del formulario: {e}")
        
        driver.save_screenshot("reports/screenshots/form_analysis_complete.png")
        
        print(f"\n🎯 CONCLUSIONES DEL ANÁLISIS:")
        print(f"1. Campos confirmados funcionando: subscriptionYear, country")
        print(f"2. Campos por verificar: {len(campos_analizar)-2} campos adicionales")
        print(f"3. Sistema de idiomas: Por determinar estructura exacta")
        print(f"4. HTML completo disponible para análisis detallado")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error en análisis: {e}")
        driver.save_screenshot("reports/screenshots/form_analysis_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
