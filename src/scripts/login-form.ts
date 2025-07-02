// Script para el formulario de login
// Atomic Design: este script puede ser usado como átomo o molécula según la lógica

interface LoginFormElements extends HTMLFormElement {
  email?: HTMLInputElement;
  password?: HTMLInputElement;
}

document.addEventListener('DOMContentLoaded', (): void => {
    const loginForm = document.getElementById('loginForm') as LoginFormElements | null;
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e: Event): void => {
            e.preventDefault();
            
            // Aquí puedes agregar validación de formulario
            const email = loginForm.email?.value;
            const password = loginForm.password?.value;
            
            if (email && password) {
                // Redirigir a la página de convenios
                window.location.href = "./pages/convenios.html";
            } else {
                console.error('Email y contraseña son requeridos');
            }
        });
    }
});
