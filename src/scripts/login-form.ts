// Script para el formulario de login
import { AuthService, ValidationErrorResponse } from '../services/authService';

interface LoginFormElements extends HTMLFormElement {
  username?: HTMLInputElement;
  password?: HTMLInputElement;
}

document.addEventListener('DOMContentLoaded', (): void => {
    const loginForm = document.getElementById('loginForm') as LoginFormElements | null;
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e: Event): Promise<void> => {
            e.preventDefault();
            
            const usernameInput = loginForm.querySelector('input[placeholder="Username"]') as HTMLInputElement;
            const passwordInput = loginForm.querySelector('input[placeholder="Password"]') as HTMLInputElement;
            const submitButton = loginForm.querySelector('button[type="submit"]') as HTMLButtonElement;
            
            const username = usernameInput?.value;
            const password = passwordInput?.value;
            
            if (!username || !password) {
                showError('Por favor, ingresa usuario y contraseña');
                return;
            }
            
            // Deshabilitar el botón durante la petición
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Iniciando sesión...';
            }
            
            try {
                const response = await AuthService.login(username, password);
                
                // Guardar token
                AuthService.saveToken(response.access_token);
                
                // Redirigir al dashboard
                window.location.href = './Dashboard.tsx';
                
            } catch (error) {
                console.error('Error de login:', error);
                
                if (error instanceof Error) {
                    if (error.message.includes('422')) {
                        showError('Credenciales inválidas. Verifica tu usuario y contraseña.');
                    } else if (error.message.includes('401')) {
                        showError('Usuario o contraseña incorrectos.');
                    } else {
                        showError('Error de conexión. Intenta nuevamente.');
                    }
                } else {
                    showError('Error inesperado. Intenta nuevamente.');
                }
            } finally {
                // Rehabilitar el botón
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Log In';
                }
            }
        });
    }
});

function showError(message: string): void {
    // Remover error anterior si existe
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Crear elemento de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #fee;
        color: #c33;
        padding: 10px;
        margin: 10px 0;
        border-radius: 4px;
        border: 1px solid #fcc;
        font-size: 14px;
    `;
    errorDiv.textContent = message;
    
    // Insertar antes del formulario
    const form = document.getElementById('loginForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(errorDiv, form);
    }
    
    // Remover después de 5 segundos
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
