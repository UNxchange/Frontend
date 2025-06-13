// Script para el formulario de login
// Atomic Design: este script puede ser usado como átomo o molécula según la lógica

document.addEventListener('DOMContentLoaded', function() {
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = "./pages/convenios.html";
        });
    }
});
