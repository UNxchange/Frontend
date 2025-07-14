"""
Utilidades para el llenado seguro de campos de formulario
Maneja casos de autocompletado y duplicación de texto
"""
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def clear_and_type_safe(driver, element, text, max_retries=3):
    """
    Llena un campo de forma segura, manejando casos de autocompletado
    
    Args:
        driver: WebDriver instance
        element: Elemento del campo a llenar
        text: Texto a escribir
        max_retries: Número máximo de reintentos
    """
    for attempt in range(max_retries):
        try:
            # Estrategia 1: Limpiar completamente el campo
            element.click()
            time.sleep(0.5)
            
            # Seleccionar todo el contenido existente
            element.send_keys(Keys.CONTROL + "a")
            time.sleep(0.2)
            
            # Eliminar contenido existente
            element.send_keys(Keys.DELETE)
            time.sleep(0.2)
            
            # Verificar que el campo esté vacío
            current_value = element.get_attribute('value') or ''
            if current_value.strip():
                # Si todavía hay contenido, usar backspace múltiple
                for _ in range(len(current_value) + 5):
                    element.send_keys(Keys.BACKSPACE)
                time.sleep(0.2)
            
            # Escribir el nuevo texto
            element.send_keys(text)
            time.sleep(0.3)
            
            # Verificar que el texto se escribió correctamente
            final_value = element.get_attribute('value') or ''
            if final_value.strip() == text.strip():
                print(f"✅ Campo llenado correctamente: '{text}'")
                return True
            else:
                print(f"⚠️ Intento {attempt + 1}: Esperado '{text}', obtenido '{final_value}'")
                
        except Exception as e:
            print(f"❌ Error en intento {attempt + 1}: {e}")
            time.sleep(1)
    
    print(f"❌ No se pudo llenar el campo después de {max_retries} intentos")
    return False

def safe_login(driver, email, password):
    """
    Realiza login de forma segura manejando autocompletado
    
    Args:
        driver: WebDriver instance
        email: Email para login
        password: Contraseña para login
    """
    try:
        print(f"🔐 Iniciando proceso de login seguro...")
        
        # Cerrar cualquier popup de autocompletado
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            time.sleep(0.5)
        except:
            pass
        
        # Buscar campos de login
        print(f"🔍 Buscando campos de login...")
        email_field = driver.find_element(By.CSS_SELECTOR, "input[type='text'], input[type='email']")
        password_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        
        print(f"📧 Llenando campo de email...")
        if not clear_and_type_safe(driver, email_field, email):
            raise Exception("No se pudo llenar el campo de email")
        
        print(f"🔑 Llenando campo de contraseña...")
        if not clear_and_type_safe(driver, password_field, password):
            raise Exception("No se pudo llenar el campo de contraseña")
        
        # Cerrar cualquier popup de autocompletado antes de enviar
        try:
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            time.sleep(0.5)
        except:
            pass
        
        # Buscar y hacer clic en el botón de login
        print(f"🚀 Haciendo clic en botón de login...")
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit'], button")
        login_button.click()
        
        print(f"✅ Login enviado, esperando redirección...")
        return True
        
    except Exception as e:
        print(f"❌ Error en login seguro: {e}")
        return False

def wait_for_navigation(driver, expected_url_part, timeout=10):
    """
    Espera a que la navegación se complete
    
    Args:
        driver: WebDriver instance
        expected_url_part: Parte de la URL esperada
        timeout: Tiempo de espera en segundos
    """
    try:
        WebDriverWait(driver, timeout).until(
            lambda driver: expected_url_part in driver.current_url
        )
        return True
    except:
        return False
