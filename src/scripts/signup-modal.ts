// Script para mostrar el modal de registro (signup) con integración a la API
import { AuthService, RegisterRequest } from '../services/authService';

interface ModalManager {
    modal: HTMLElement | null;
    signupLink: HTMLElement | null;
    init(): void;
    loadModal(): Promise<void>;
    showModal(): void;
    addModalListeners(modal: HTMLElement): void;
    handleSignupSubmit(form: HTMLFormElement): Promise<void>;
}

class SignupModalManager implements ModalManager {
    modal: HTMLElement | null = null;
    signupLink: HTMLElement | null = null;

    init(): void {
        this.signupLink = document.querySelector('.signup-link');
        
        if (this.signupLink) {
            this.signupLink.addEventListener('click', async (e: Event): Promise<void> => {
                e.preventDefault();
                
                if (!this.modal) {
                    await this.loadModal();
                }
                
                this.showModal();
            });
        }
    }

    async loadModal(): Promise<void> {
        try {
            // Crear el modal programáticamente para tener mejor control
            this.modal = this.createSignupModal();
            document.body.appendChild(this.modal);
            this.addModalListeners(this.modal);
        } catch (error) {
            console.error('Error loading signup modal:', error);
        }
    }

    createSignupModal(): HTMLElement {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        modalOverlay.innerHTML = `
            <div class="modal-container" style="
                width: 500px;
                max-width: 90%;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                overflow-y: auto;
                max-height: 90vh;
            ">
                <div class="modal-header" style="
                    padding: 20px 24px;
                    border-bottom: 1px solid #e9ecef;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <div>
                        <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">
                            Crear Nueva Cuenta
                        </h2>
                        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
                            Completa la información para registrarte
                        </p>
                    </div>
                    <button class="modal-close" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #6b7280;
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                    ">×</button>
                </div>
                
                <div class="modal-body" style="padding: 24px;">
                    <form id="signupForm">
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="
                                display: block;
                                font-size: 14px;
                                font-weight: 500;
                                color: #374151;
                                margin-bottom: 6px;
                            ">Nombre Completo *</label>
                            <input type="text" name="name" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                color: #111827;
                                box-sizing: border-box;
                            ">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="
                                display: block;
                                font-size: 14px;
                                font-weight: 500;
                                color: #374151;
                                margin-bottom: 6px;
                            ">Email *</label>
                            <input type="email" name="email" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                color: #111827;
                                box-sizing: border-box;
                            ">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 16px;">
                            <label style="
                                display: block;
                                font-size: 14px;
                                font-weight: 500;
                                color: #374151;
                                margin-bottom: 6px;
                            ">Contraseña *</label>
                            <input type="password" name="password" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                color: #111827;
                                box-sizing: border-box;
                            ">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 24px;">
                            <label style="
                                display: block;
                                font-size: 14px;
                                font-weight: 500;
                                color: #374151;
                                margin-bottom: 6px;
                            ">Rol *</label>
                            <select name="role" required style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid #d1d5db;
                                border-radius: 6px;
                                font-size: 14px;
                                color: #111827;
                                box-sizing: border-box;
                            ">
                                <option value="">Selecciona un rol</option>
                                <option value="estudiante">Estudiante</option>
                                <option value="profesional">Profesional</option>
                                <option value="administrador">Administrador</option>
                            </select>
                        </div>
                    </form>
                </div>
                
                <div class="modal-footer" style="
                    padding: 16px 24px;
                    border-top: 1px solid #e9ecef;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button class="btn-cancel" style="
                        padding: 10px 16px;
                        border: 1px solid #d1d5db;
                        border-radius: 6px;
                        background-color: white;
                        color: #374151;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                    ">Cancelar</button>
                    <button class="btn-create" type="submit" form="signupForm" style="
                        padding: 10px 16px;
                        border: none;
                        border-radius: 6px;
                        background-color: #1a56db;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                    ">Crear Usuario</button>
                </div>
            </div>
        `;

        return modalOverlay;
    }

    async handleSignupSubmit(form: HTMLFormElement): Promise<void> {
        const formData = new FormData(form);
        const createButton = this.modal?.querySelector('.btn-create') as HTMLButtonElement;
        
        const userData: RegisterRequest = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            password: formData.get('password') as string
        };

        // Validar datos
        if (!userData.name || !userData.email || !userData.role || !userData.password) {
            this.showError('Todos los campos son obligatorios');
            return;
        }

        // Deshabilitar botón durante la petición
        if (createButton) {
            createButton.disabled = true;
            createButton.textContent = 'Creando...';
        }

        try {
            const response = await AuthService.register(userData);
            
            // Mostrar mensaje de éxito
            this.showSuccess('Usuario creado exitosamente. Ahora puedes iniciar sesión.');
            
            // Cerrar modal después de un breve delay
            setTimeout(() => {
                this.hideModal();
            }, 2000);
            
        } catch (error) {
            console.error('Error en registro:', error);
            
            if (error instanceof Error) {
                if (error.message.includes('422')) {
                    this.showError('Datos inválidos. Verifica la información ingresada.');
                } else if (error.message.includes('400')) {
                    this.showError('El email ya está registrado.');
                } else {
                    this.showError('Error de conexión. Intenta nuevamente.');
                }
            } else {
                this.showError('Error inesperado. Intenta nuevamente.');
            }
        } finally {
            // Rehabilitar botón
            if (createButton) {
                createButton.disabled = false;
                createButton.textContent = 'Crear Usuario';
            }
        }
    }

    showModal(): void {
        if (this.modal) {
            this.modal.style.display = 'flex';
        }
    }

    hideModal(): void {
        if (this.modal) {
            this.modal.style.display = 'none';
            // Limpiar formulario
            const form = this.modal.querySelector('#signupForm') as HTMLFormElement;
            if (form) {
                form.reset();
            }
            // Remover mensajes de error/éxito
            const messages = this.modal.querySelectorAll('.message');
            messages.forEach(msg => msg.remove());
        }
    }

    addModalListeners(modal: HTMLElement): void {
        // Cerrar modal al hacer clic en X
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Cerrar modal al hacer clic en cancelar
        const cancelButton = modal.querySelector('.btn-cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.hideModal();
            });
        }

        // Cerrar modal al hacer clic fuera del contenido
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });

        // Manejar envío del formulario
        const form = modal.querySelector('#signupForm') as HTMLFormElement;
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSignupSubmit(form);
            });
        }
    }

    showError(message: string): void {
        this.removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message error-message';
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
        
        const modalBody = this.modal?.querySelector('.modal-body');
        if (modalBody) {
            modalBody.insertBefore(errorDiv, modalBody.firstChild);
        }
    }

    showSuccess(message: string): void {
        this.removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'message success-message';
        successDiv.style.cssText = `
            background-color: #efe;
            color: #363;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            border: 1px solid #cfc;
            font-size: 14px;
        `;
        successDiv.textContent = message;
        
        const modalBody = this.modal?.querySelector('.modal-body');
        if (modalBody) {
            modalBody.insertBefore(successDiv, modalBody.firstChild);
        }
    }

    private removeMessages(): void {
        const messages = this.modal?.querySelectorAll('.message');
        if (messages) {
            messages.forEach(msg => msg.remove());
        }
    }
}

// Inicializar el manager cuando se carga la página
document.addEventListener('DOMContentLoaded', (): void => {
    const signupManager = new SignupModalManager();
    signupManager.init();
});
