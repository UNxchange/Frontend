"""
Prueba de debugging específica para identificar el problema del login
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from chrome_config import custom_config

def test_debug_login_issue(driver):
    """
    Debugging específico para entender por qué falla el login
    """
    print("\n" + "="*80)
    print("🔍 DEBUG: ANÁLISIS DEL PROBLEMA DE LOGIN")
    print("="*80)
    
    email = custom_config.TEST_USER_EMAIL
    password = custom_config.TEST_USER_PASSWORD
    
    try:
        # Ir a la página de login
        login_url = f"{custom_config.FRONTEND_URL}/login"
        print(f"🌐 Navegando a: {login_url}")
        driver.get(login_url)
        time.sleep(3)
        
        # Tomar screenshot inicial
        driver.save_screenshot("reports/screenshots/debug_01_login_page.png")
        print(f"📸 Screenshot guardado: debug_01_login_page.png")
        
        # Verificar título de la página
        page_title = driver.title
        print(f"📄 Título de la página: '{page_title}'")
        
        # Verificar URL actual
        current_url = driver.current_url
        print(f"🌐 URL actual: {current_url}")
        
        # Buscar campos de email y password
        print(f"\n🔍 Buscando campos del formulario...")
        
        try:
            email_field = driver.find_element(By.CSS_SELECTOR, "input[type='text'], input[type='email']")
            print(f"✅ Campo email encontrado: {email_field.tag_name}")
            print(f"   Atributos: type='{email_field.get_attribute('type')}', name='{email_field.get_attribute('name')}', id='{email_field.get_attribute('id')}'")
        except Exception as e:
            print(f"❌ Campo email NO encontrado: {e}")
            
        try:
            password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            print(f"✅ Campo password encontrado: {password_field.tag_name}")
            print(f"   Atributos: type='{password_field.get_attribute('type')}', name='{password_field.get_attribute('name')}', id='{password_field.get_attribute('id')}'")
        except Exception as e:
            print(f"❌ Campo password NO encontrado: {e}")
            
        try:
            login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit'], button")
            print(f"✅ Botón login encontrado: {login_button.tag_name}")
            print(f"   Texto: '{login_button.text}', type='{login_button.get_attribute('type')}'")
        except Exception as e:
            print(f"❌ Botón login NO encontrado: {e}")
        
        # Intentar el login
        print(f"\n📝 Intentando login con credenciales:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        
        # Llenar campos
        email_field.clear()
        email_field.send_keys(email)
        print(f"✅ Email ingresado")
        
        password_field.clear()
        password_field.send_keys(password)
        print(f"✅ Password ingresado")
        
        # Verificar valores ingresados
        email_value = email_field.get_attribute('value')
        password_value = password_field.get_attribute('value')
        print(f"🔍 Verificación - Email: '{email_value}', Password: {'*' * len(password_value)}")
        
        # Tomar screenshot antes del submit
        driver.save_screenshot("reports/screenshots/debug_02_before_submit.png")
        print(f"📸 Screenshot antes del submit: debug_02_before_submit.png")
        
        # Hacer clic en el botón de login
        print(f"\n🖱️ Haciendo clic en el botón de login...")
        login_button.click()
        
        # Esperar un poco para que se procese
        time.sleep(5)
        
        # Verificar URL después del login
        post_login_url = driver.current_url
        print(f"🌐 URL después del login: {post_login_url}")
        
        # Buscar mensajes de error
        print(f"\n🔍 Buscando mensajes de error...")
        error_selectors = [
            ".error",
            ".alert",
            ".warning",
            ".message",
            "[role='alert']",
            ".toast",
            ".notification"
        ]
        
        found_errors = []
        for selector in error_selectors:
            try:
                error_elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for element in error_elements:
                    if element.is_displayed() and element.text.strip():
                        found_errors.append(f"{selector}: {element.text.strip()}")
            except:
                pass
        
        if found_errors:
            print(f"❌ Errores encontrados:")
            for error in found_errors:
                print(f"   {error}")
        else:
            print(f"ℹ️ No se encontraron mensajes de error visibles")
        
        # Verificar si hay token en localStorage
        print(f"\n🔑 Verificando autenticación...")
        try:
            token = driver.execute_script("return localStorage.getItem('access_token');")
            if token:
                print(f"✅ Token encontrado en localStorage: {token[:20]}...")
            else:
                print(f"❌ No hay token en localStorage")
        except Exception as e:
            print(f"❌ Error accediendo localStorage: {e}")
        
        # Verificar cookies
        try:
            cookies = driver.get_cookies()
            auth_cookies = [cookie for cookie in cookies if 'token' in cookie['name'].lower() or 'auth' in cookie['name'].lower()]
            if auth_cookies:
                print(f"🍪 Cookies de autenticación encontradas: {len(auth_cookies)}")
                for cookie in auth_cookies:
                    print(f"   {cookie['name']}: {cookie['value'][:20]}...")
            else:
                print(f"🍪 No hay cookies de autenticación")
        except Exception as e:
            print(f"❌ Error accediendo cookies: {e}")
        
        # Tomar screenshot final
        driver.save_screenshot("reports/screenshots/debug_03_after_submit.png")
        print(f"📸 Screenshot final: debug_03_after_submit.png")
        
        # Verificar si realmente estamos en dashboard
        if "/dashboard" in post_login_url:
            print(f"🎉 ¡LOGIN EXITOSO! Redirigido al dashboard")
            return True
        else:
            print(f"❌ LOGIN FALLÓ - Permanece en: {post_login_url}")
            
            # Intentar buscar elementos específicos del dashboard
            try:
                dashboard_elements = driver.find_elements(By.CSS_SELECTOR, "[data-testid*='dashboard'], .dashboard, #dashboard")
                if dashboard_elements:
                    print(f"✅ Elementos del dashboard encontrados, posible redirección sin cambio de URL")
                    return True
            except:
                pass
            
            return False
        
    except Exception as e:
        print(f"\n❌ Error durante el debugging: {e}")
        driver.save_screenshot("reports/screenshots/debug_99_error.png")
        raise

if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
