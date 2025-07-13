"""
Page Object para el formulario de creación de convocatorias
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.keys import Keys
from config import config

class ConvocatoriaFormPage:
    """Page Object para el formulario de creación de convocatorias"""
    
    # Locators del formulario
    FORM_TITLE = (By.XPATH, "//h2[contains(text(), 'Crear Nueva Convocatoria')]")
    
    # Campos del formulario
    SUBSCRIPTION_YEAR = (By.ID, "subscriptionYear")
    COUNTRY = (By.ID, "country")
    INSTITUTION = (By.ID, "institution")
    AGREEMENT_TYPE = (By.ID, "agreementType")
    VALIDITY = (By.ID, "validity")
    STATE = (By.ID, "state")
    SUBSCRIPTION_LEVEL = (By.ID, "subscriptionLevel")
    DRE_LINK = (By.ID, "dreLink")
    AGREEMENT_LINK = (By.ID, "agreementLink")
    INTERNATIONAL_LINK = (By.ID, "internationalLink")
    PROPS = (By.ID, "Props")
    
    # Idiomas (checkboxes)
    LANGUAGE_CHECKBOXES = (By.XPATH, "//input[@type='checkbox']")
    LANGUAGE_SPANISH = (By.XPATH, "//input[@type='checkbox']/following-sibling::span[text()='Español']/../input")
    LANGUAGE_GERMAN = (By.XPATH, "//input[@type='checkbox']/following-sibling::span[text()='Alemán']/../input")
    
    # Botones
    SUBMIT_BUTTON = (By.XPATH, "//button[@type='submit' or contains(text(), 'Crear Convocatoria')]")
    CANCEL_BUTTON = (By.XPATH, "//button[contains(text(), 'Cancelar')]")
    
    # Mensajes
    SUCCESS_MESSAGE = (By.CLASS_NAME, "success-message")
    ERROR_MESSAGE = (By.CLASS_NAME, "error-message")
    LOADING_INDICATOR = (By.XPATH, "//button[contains(text(), 'Creando')]")
    
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, config.EXPLICIT_WAIT)
    
    def wait_for_form_load(self):
        """Esperar a que el formulario cargue"""
        try:
            self.wait.until(EC.presence_of_element_located(self.FORM_TITLE))
            self.wait.until(EC.presence_of_element_located(self.SUBSCRIPTION_YEAR))
            return True
        except TimeoutException:
            return False
    
    def is_form_visible(self):
        """Verificar si el formulario está visible"""
        try:
            form_title = self.driver.find_element(*self.FORM_TITLE)
            return form_title.is_displayed()
        except:
            return False
    
    def fill_subscription_year(self, year: str):
        """Llenar año de suscripción"""
        field = self.wait.until(EC.element_to_be_clickable(self.SUBSCRIPTION_YEAR))
        field.clear()
        field.send_keys(year)
    
    def fill_country(self, country: str):
        """Llenar país"""
        field = self.wait.until(EC.element_to_be_clickable(self.COUNTRY))
        field.clear()
        field.send_keys(country)
    
    def fill_institution(self, institution: str):
        """Llenar institución"""
        field = self.wait.until(EC.element_to_be_clickable(self.INSTITUTION))
        field.clear()
        field.send_keys(institution)
    
    def select_agreement_type(self, agreement_type: str):
        """Seleccionar tipo de acuerdo"""
        select_element = self.wait.until(EC.element_to_be_clickable(self.AGREEMENT_TYPE))
        select = Select(select_element)
        select.select_by_visible_text(agreement_type)
    
    def fill_validity(self, validity: str):
        """Llenar vigencia"""
        field = self.wait.until(EC.element_to_be_clickable(self.VALIDITY))
        field.clear()
        field.send_keys(validity)
    
    def select_state(self, state: str):
        """Seleccionar estado"""
        select_element = self.wait.until(EC.element_to_be_clickable(self.STATE))
        select = Select(select_element)
        select.select_by_visible_text(state)
    
    def fill_subscription_level(self, level: str):
        """Llenar nivel de suscripción"""
        field = self.wait.until(EC.element_to_be_clickable(self.SUBSCRIPTION_LEVEL))
        field.clear()
        field.send_keys(level)
    
    def select_languages(self, languages: list):
        """Seleccionar idiomas"""
        for language in languages:
            try:
                # Buscar checkbox por el texto del idioma
                checkbox_xpath = f"//input[@type='checkbox']/following-sibling::span[text()='{language}']/../input"
                checkbox = self.driver.find_element(By.XPATH, checkbox_xpath)
                if not checkbox.is_selected():
                    checkbox.click()
            except:
                print(f"No se pudo seleccionar el idioma: {language}")
    
    def fill_dre_link(self, link: str):
        """Llenar enlace DRE"""
        field = self.wait.until(EC.element_to_be_clickable(self.DRE_LINK))
        field.clear()
        field.send_keys(link)
    
    def fill_agreement_link(self, link: str):
        """Llenar enlace del acuerdo"""
        field = self.wait.until(EC.element_to_be_clickable(self.AGREEMENT_LINK))
        field.clear()
        field.send_keys(link)
    
    def fill_international_link(self, link: str):
        """Llenar enlace internacional"""
        field = self.wait.until(EC.element_to_be_clickable(self.INTERNATIONAL_LINK))
        field.clear()
        field.send_keys(link)
    
    def fill_properties(self, props: str):
        """Llenar propiedades"""
        field = self.wait.until(EC.element_to_be_clickable(self.PROPS))
        field.clear()
        field.send_keys(props)
    
    def submit_form(self):
        """Enviar el formulario"""
        submit_btn = self.wait.until(EC.element_to_be_clickable(self.SUBMIT_BUTTON))
        submit_btn.click()
    
    def cancel_form(self):
        """Cancelar el formulario"""
        cancel_btn = self.wait.until(EC.element_to_be_clickable(self.CANCEL_BUTTON))
        cancel_btn.click()
    
    def wait_for_submission(self):
        """Esperar a que termine el envío del formulario"""
        try:
            # Esperar a que aparezca el loading
            self.wait.until(EC.presence_of_element_located(self.LOADING_INDICATOR))
            # Esperar a que desaparezca el loading
            self.wait.until_not(EC.presence_of_element_located(self.LOADING_INDICATOR))
            return True
        except TimeoutException:
            # Puede que no aparezca loading o sea muy rápido
            return True
    
    def get_success_message(self):
        """Obtener mensaje de éxito"""
        try:
            success_element = self.wait.until(EC.presence_of_element_located(self.SUCCESS_MESSAGE))
            return success_element.text
        except TimeoutException:
            return None
    
    def get_error_message(self):
        """Obtener mensaje de error"""
        try:
            error_element = self.driver.find_element(*self.ERROR_MESSAGE)
            return error_element.text
        except:
            return None
    
    def fill_complete_form(self, data: dict):
        """Llenar el formulario completo con un diccionario de datos"""
        self.fill_subscription_year(data['subscriptionYear'])
        self.fill_country(data['country'])
        self.fill_institution(data['institution'])
        self.select_agreement_type(data['agreementType'])
        self.fill_validity(data['validity'])
        self.select_state(data['state'])
        self.fill_subscription_level(data['subscriptionLevel'])
        self.select_languages(data['languages'])
        
        if data.get('dreLink'):
            self.fill_dre_link(data['dreLink'])
        if data.get('agreementLink'):
            self.fill_agreement_link(data['agreementLink'])
        if data.get('internationalLink'):
            self.fill_international_link(data['internationalLink'])
        if data.get('Props'):
            self.fill_properties(data['Props'])
    
    def is_form_submitted_successfully(self):
        """Verificar si el formulario se envió exitosamente"""
        return self.get_success_message() is not None
