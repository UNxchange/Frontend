"""
Prueba de debug específica para verificar login con credenciales exactas
"""
import pytest
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from chrome_config import custom_config

def test_debug_login_with_exact_credentials(driver):
    """
    Prueba específica para verificar login con credenciales exactas:
    Email: profesional@gmail.com
    Password: 1234
    """
    print("\n" + "="*60)
    print("🔍 PRUEBA DE DEBUG - LOGIN CON CREDENCIALES EXACTAS")
    print("="*60)
    
    # Credenciales exactas
    email = "profesional@gmail.com"
    password = "1234"
    
    print(f"📧 Email: {email}")
    print(f"🔐 Password: {password}")
    print(f"🌐 URL Frontend: {custom_config.FRONTEND_URL}")
    
    try:
        # Paso 1: Ir a la página de login
        login_url = f"{custom_config.FRONTEND_URL}/login"
        print(f"\n🚀 Navegando a: {login_url}")
        driver.get(login_url)
        
        # Tomar screenshot inicial
        driver.save_screenshot("reports/screenshots/01_pagina_login.png")
        print("📸 Screenshot guardado: 01_pagina_login.png")
        
        # Esperar a que la página cargue
        print("⏳ Esperando que la página cargue...")
        time.sleep(3)
        
        # Verificar título de la página
        print(f"📄 Título de la página: {driver.title}")
        print(f"🌐 URL actual: {driver.current_url}")
        
        # Paso 2: Buscar campos de login de forma más amplia
        print("\n🔍 Buscando campos de login...")
        
        # Buscar campo de email/username de múltiples formas
        email_field = None
        email_selectors = [
            "input[type='text']",
            "input[type='email']", 
            "input[placeholder*='mail']",
            "input[placeholder*='Mail']",
            "input[placeholder*='Username']",
            "input[placeholder*='username']",
            "input[name='email']",
            "input[name='username']",
            "input[id*='email']",
            "input[id*='username']"
        ]
        
        for selector in email_selectors:
            try:
                email_field = driver.find_element(By.CSS_SELECTOR, selector)
                print(f"✅ Campo email encontrado con selector: {selector}")
                break
            except NoSuchElementException:
                continue
        
        if not email_field:
            print("❌ No se encontró campo de email")
            # Listar todos los inputs disponibles
            inputs = driver.find_elements(By.TAG_NAME, "input")
            print(f"📋 Inputs disponibles ({len(inputs)}):")
            for i, inp in enumerate(inputs):
                print(f"   {i+1}. type='{inp.get_attribute('type')}', placeholder='{inp.get_attribute('placeholder')}', name='{inp.get_attribute('name')}', id='{inp.get_attribute('id')}'")
            assert False, "No se encontró campo de email"
        
        # Buscar campo de password
        password_field = None
        password_selectors = [
            "input[type='password']",
            "input[placeholder*='password']",
            "input[placeholder*='Password']",
            "input[name='password']",
            "input[id*='password']"
        ]
        
        for selector in password_selectors:
            try:
                password_field = driver.find_element(By.CSS_SELECTOR, selector)
                print(f"✅ Campo password encontrado con selector: {selector}")
                break
            except NoSuchElementException:
                continue
        
        if not password_field:
            print("❌ No se encontró campo de password")
            assert False, "No se encontró campo de password"
        
        # Paso 3: Llenar campos con credenciales exactas
        print(f"\n📝 Llenando campos...")
        
        # Limpiar y llenar email
        email_field.clear()
        email_field.send_keys(email)
        print(f"✅ Email ingresado: {email}")
        
        # Limpiar y llenar password
        password_field.clear()
        password_field.send_keys(password)
        print(f"✅ Password ingresado: {password}")
        
        # Verificar que los campos se llenaron correctamente
        email_value = email_field.get_attribute('value')
        password_value = password_field.get_attribute('value')
        print(f"🔍 Verificación - Email en campo: '{email_value}'")
        print(f"🔍 Verificación - Password en campo: {'*' * len(password_value)}")
        
        # Tomar screenshot después de llenar
        driver.save_screenshot("reports/screenshots/02_campos_llenos.png")
        print("📸 Screenshot guardado: 02_campos_llenos.png")
        
        # Paso 4: Buscar y hacer clic en botón de login
        print("\n🔘 Buscando botón de login...")
        
        login_button = None
        button_selectors = [
            "button[type='submit']",
            "button.login-button",
            "input[type='submit']",
            "button",  # Cualquier botón
            "form button",
            "[data-testid*='login']",
            "[data-testid*='submit']"
        ]
        
        for selector in button_selectors:
            try:
                login_button = driver.find_element(By.CSS_SELECTOR, selector)
                print(f"✅ Botón de login encontrado con selector: {selector}")
                break
            except NoSuchElementException:
                continue
        
        if not login_button:
            # Buscar todos los botones
            buttons = driver.find_elements(By.TAG_NAME, "button")
            print(f"📋 Botones disponibles ({len(buttons)}):")
            for i, btn in enumerate(buttons):
                print(f"   {i+1}. text='{btn.text}', type='{btn.get_attribute('type')}', class='{btn.get_attribute('class')}'")
            
            # Intentar con el primer botón encontrado
            if buttons:
                login_button = buttons[0]
                print(f"⚠️ Usando primer botón disponible: '{login_button.text}'")
            else:
                assert False, "No se encontró botón de login"
        
        # Paso 5: Hacer clic en login
        print(f"\n🚀 Haciendo clic en botón: '{login_button.text}'")
        login_button.click()
        
        # Tomar screenshot después del clic
        driver.save_screenshot("reports/screenshots/03_despues_click_login.png")
        print("📸 Screenshot guardado: 03_despues_click_login.png")
        
        # Paso 6: Esperar y verificar redirección
        print("\n⏳ Esperando redirección...")
        
        # Esperar un poco más para procesar
        time.sleep(5)
        
        current_url = driver.current_url
        print(f"🌐 URL después del login: {current_url}")
        
        # Verificar si hubo redirección
        if "/dashboard" in current_url:
            print("✅ ¡Login exitoso! Redirigido al dashboard")
            driver.save_screenshot("reports/screenshots/04_dashboard_exitoso.png")
            print("📸 Screenshot guardado: 04_dashboard_exitoso.png")
            
            # Verificar que estamos en el dashboard profesional
            if "/dashboard/profesional" in current_url:
                print("✅ ¡Estamos en el dashboard profesional!")
                return True
            else:
                print(f"⚠️ Estamos en dashboard pero no es profesional: {current_url}")
        
        elif current_url == login_url or "/login" in current_url:
            print("❌ Seguimos en la página de login")
            
            # Buscar mensajes de error
            error_selectors = [
                ".error",
                ".alert",
                ".warning",
                "[class*='error']",
                "[class*='alert']",
                "[class*='danger']",
                ".text-red",
                ".text-danger"
            ]
            
            for selector in error_selectors:
                try:
                    error_elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for error in error_elements:
                        if error.text.strip():
                            print(f"🚨 Mensaje de error encontrado: '{error.text}'")
                except:
                    continue
            
            # Verificar console logs del navegador
            logs = driver.get_log('browser')
            if logs:
                print("📋 Logs del navegador:")
                for log in logs[-5:]:  # Últimos 5 logs
                    print(f"   {log['level']}: {log['message']}")
            
            driver.save_screenshot("reports/screenshots/05_login_fallido.png")
            print("📸 Screenshot guardado: 05_login_fallido.png")
            
            assert False, f"Login falló - seguimos en {current_url}"
        
        else:
            print(f"🤔 URL inesperada después del login: {current_url}")
            driver.save_screenshot("reports/screenshots/06_url_inesperada.png")
            print("📸 Screenshot guardado: 06_url_inesperada.png")
        
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")
        driver.save_screenshot("reports/screenshots/99_error.png")
        print("📸 Screenshot de error guardado: 99_error.png")
        raise
    
    print("\n" + "="*60)
    print("🏁 FIN DE LA PRUEBA DE DEBUG")
    print("="*60)

if __name__ == "__main__":
    # Ejecutar solo esta prueba
    pytest.main([__file__, "-v", "-s"])
