// Script para mostrar el modal de registro (signup) en index.html usando el modal de singup.html

interface ModalManager {
    modal: HTMLElement | null;
    signupLink: HTMLElement | null;
    init(): void;
    loadModal(): Promise<void>;
    showModal(): void;
    addModalListeners(modal: HTMLElement): void;
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
            // Cargar el modal desde singup.html (solo el modal, no el login)
            const response = await fetch('./pages/singup.html');
            const html = await response.text();
            
            // Extraer solo el modal-overlay
            const temp = document.createElement('div');
            temp.innerHTML = html;
            this.modal = temp.querySelector('.modal-overlay');
            
            if (this.modal) {
                document.body.appendChild(this.modal);
                this.addModalListeners(this.modal);
            }
        } catch (error) {
            console.error('Error loading signup modal:', error);
        }
    }

    showModal(): void {
        if (this.modal) {
            (this.modal as HTMLElement).style.display = 'flex';
        }
    }

    addModalListeners(modal: HTMLElement): void {
        // Cerrar con botón
        const closeButton = modal.querySelector('.modal-close') as HTMLElement;
        if (closeButton) {
            closeButton.onclick = (): void => {
                modal.style.display = 'none';
            };
        }

        // Cerrar con botón cancelar
        const btnCancel = modal.querySelector('.btn-cancel') as HTMLButtonElement;
        if (btnCancel) {
            btnCancel.onclick = (e: Event): void => {
                e.preventDefault();
                modal.style.display = 'none';
            };
        }

        // Cerrar haciendo click fuera del modal
        modal.onclick = (e: Event): void => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', (): void => {
    const modalManager = new SignupModalManager();
    modalManager.init();
});
