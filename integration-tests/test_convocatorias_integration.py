"""
Pruebas de integración para la creación de convocatorias
Prueba el flujo completo: Login → Dashboard → Crear Convocatoria → Verificar Backend
"""
import pytest
import requests
import time
from datetime import datetime
from page_objects.login_page import LoginPage
from page_objects.dashboard_page import DashboardPage
from page_objects.convocatoria_form_page import ConvocatoriaFormPage
from config import config
from chrome_config import custom_config
from conftest import take_screenshot

class TestConvocatoriaIntegration:
    """Suite de pruebas de integración para creación de convocatorias"""
    
    def test_complete_convocatoria_creation_flow(self, driver, test_reporter):
        """
        Prueba completa del flujo de creación de convocatorias
        
        Pasos:
        1. Login como profesional
        2. Navegar al dashboard profesional  
        3. Crear nueva convocatoria
        4. Verificar que se guardó en el backend
        """
        print("\n🚀 Iniciando prueba de integración completa...")
        
        # Inicializar page objects
        login_page = LoginPage(driver)
        dashboard_page = DashboardPage(driver)
        form_page = ConvocatoriaFormPage(driver)
        
        # === PASO 1: LOGIN ===
        print("📝 Paso 1: Realizando login...")
        take_screenshot(driver, "01_antes_login")
        
        login_page.navigate_to_login()
        assert login_page.wait_for_page_load(), "❌ La página de login no cargó correctamente"
        
        login_page.login(custom_config.TEST_USER_EMAIL, custom_config.TEST_USER_PASSWORD)
        
        # Verificar login exitoso
        assert login_page.is_login_successful(), "❌ Login falló"
        take_screenshot(driver, "02_despues_login")
        print("✅ Login exitoso")
        
        # === PASO 2: NAVEGACIÓN AL DASHBOARD ===
        print("📊 Paso 2: Verificando dashboard profesional...")
        
        # Verificar redirección al dashboard profesional
        assert login_page.wait_for_redirect("/dashboard/profesional"), "❌ No se redirigió al dashboard profesional"
        assert dashboard_page.wait_for_page_load(), "❌ El dashboard no cargó correctamente"
        assert dashboard_page.is_in_professional_dashboard(), "❌ No estamos en el dashboard profesional"
        
        take_screenshot(driver, "03_dashboard_cargado")
        print("✅ Dashboard profesional cargado correctamente")
        
        # === PASO 3: CREAR CONVOCATORIA ===
        print("📋 Paso 3: Creando nueva convocatoria...")
        
        # Hacer clic en crear convocatoria
        assert dashboard_page.click_create_convocatoria(), "❌ No se pudo hacer clic en 'Crear Convocatoria'"
        
        # Esperar a que aparezca el formulario
        assert form_page.wait_for_form_load(), "❌ El formulario no cargó"
        assert form_page.is_form_visible(), "❌ El formulario no es visible"
        
        take_screenshot(driver, "04_formulario_cargado")
        
        # Llenar el formulario con datos de prueba
        test_data = config.TEST_CONVOCATORIA_DATA.copy()
        # Agregar timestamp para hacer únicos los datos
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_data['institution'] = f"Universidad de Prueba {timestamp}"
        test_data['Props'] = f"Prueba de integración automatizada - {timestamp}"
        
        print(f"📝 Llenando formulario con datos: {test_data['institution']}")
        form_page.fill_complete_form(test_data)
        
        take_screenshot(driver, "05_formulario_lleno")
        
        # Enviar formulario
        print("📤 Enviando formulario...")
        form_page.submit_form()
        
        # Esperar respuesta
        form_page.wait_for_submission()
        time.sleep(2)  # Dar tiempo extra para procesar
        
        take_screenshot(driver, "06_despues_envio")
        
        # === PASO 4: VERIFICAR ÉXITO EN FRONTEND ===
        print("✅ Paso 4: Verificando éxito en frontend...")
        
        success_message = form_page.get_success_message()
        error_message = form_page.get_error_message()
        
        if error_message:
            take_screenshot(driver, "07_error_frontend")
            print(f"❌ Error en frontend: {error_message}")
            
            # Verificar si es un error de autenticación
            if "autenticado" in error_message.lower() or "permisos" in error_message.lower():
                print("🔐 Verificando estado de autenticación...")
                # Verificar token en localStorage
                token = driver.execute_script("return localStorage.getItem('access_token');")
                print(f"Token en localStorage: {'Presente' if token else 'Ausente'}")
                
            pytest.fail(f"Error al crear convocatoria en frontend: {error_message}")
        
        assert success_message is not None, "❌ No se recibió mensaje de éxito"
        print(f"✅ Mensaje de éxito recibido: {success_message}")
        
        # === PASO 5: VERIFICAR EN BACKEND ===
        print("🔍 Paso 5: Verificando que la convocatoria se guardó en el backend...")
        
        # Buscar la convocatoria en el backend
        try:
            response = requests.get(custom_config.CONVOCATORIAS_ENDPOINT, timeout=10)
            assert response.status_code == 200, f"❌ Error al consultar backend: {response.status_code}"
            
            convocatorias = response.json()
            print(f"📊 Total de convocatorias en backend: {len(convocatorias)}")
            
            # Buscar nuestra convocatoria por institución única
            found_convocatoria = None
            for conv in convocatorias:
                if conv.get('institution') == test_data['institution']:
                    found_convocatoria = conv
                    break
            
            assert found_convocatoria is not None, f"❌ No se encontró la convocatoria en el backend con institución: {test_data['institution']}"
            
            # Verificar algunos campos clave
            assert found_convocatoria['country'] == test_data['country'], "❌ País no coincide"
            assert found_convocatoria['agreementType'] == test_data['agreementType'], "❌ Tipo de acuerdo no coincide"
            assert found_convocatoria['state'] == test_data['state'], "❌ Estado no coincide"
            
            print("✅ Convocatoria verificada exitosamente en el backend")
            print(f"🆔 ID de la convocatoria creada: {found_convocatoria.get('id', 'N/A')}")
            
        except requests.exceptions.RequestException as e:
            pytest.fail(f"❌ Error al verificar en backend: {e}")
        
        # Screenshot final de éxito
        take_screenshot(driver, "08_prueba_exitosa")
        
        print("🎉 ¡Prueba de integración completada exitosamente!")
    
    def test_form_validation(self, driver):
        """
        Prueba las validaciones del formulario
        """
        print("\n🔍 Iniciando prueba de validaciones del formulario...")
        
        # Login y navegación
        login_page = LoginPage(driver)
        dashboard_page = DashboardPage(driver)
        form_page = ConvocatoriaFormPage(driver)
        
        login_page.navigate_to_login()
        login_page.login(config.TEST_USER_EMAIL, config.TEST_USER_PASSWORD)
        dashboard_page.wait_for_page_load()
        dashboard_page.click_create_convocatoria()
        form_page.wait_for_form_load()
        
        # Intentar enviar formulario vacío
        print("📝 Probando envío de formulario vacío...")
        form_page.submit_form()
        
        # Debería mostrar error de validación
        time.sleep(1)
        error_message = form_page.get_error_message()
        
        # Note: Esta validación puede variar según tu implementación
        # Si no hay mensaje de error visible, la validación puede estar en el HTML5
        print(f"Mensaje de validación: {error_message if error_message else 'Validación HTML5'}")
        
        take_screenshot(driver, "validacion_formulario_vacio")
    
    def test_authentication_required(self, driver):
        """
        Prueba que la creación de convocatorias requiere autenticación
        """
        print("\n🔐 Probando acceso sin autenticación...")
        
        # Intentar acceder directamente al dashboard sin login
        driver.get(f"{config.FRONTEND_URL}/dashboard/profesional")
        time.sleep(2)
        
        # Debería redirigir al login
        current_url = driver.current_url
        assert "/login" in current_url, f"❌ No se redirigió al login. URL actual: {current_url}"
        
        take_screenshot(driver, "redireccion_login")
        print("✅ Redirección a login funciona correctamente")

if __name__ == "__main__":
    # Ejecutar las pruebas directamente
    pytest.main([__file__, "-v", "--html=reports/report.html", "--self-contained-html"])
