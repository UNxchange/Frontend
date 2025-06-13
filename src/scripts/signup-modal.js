// Script para mostrar el modal de registro (signup) en index.html usando el modal de singup.html

document.addEventListener('DOMContentLoaded', function() {
    // Crear el modal dinámicamente usando el HTML de singup.html
    const signupLink = document.querySelector('.signup-link');
    let modal = null;

    signupLink.addEventListener('click', async function(e) {
        e.preventDefault();
        if (!modal) {
            // Cargar el modal desde singup.html (solo el modal, no el login)
            const res = await fetch('./pages/singup.html');
            const html = await res.text();
            // Extraer solo el modal-overlay
            const temp = document.createElement('div');
            temp.innerHTML = html;
            modal = temp.querySelector('.modal-overlay');
            if (modal) {
                document.body.appendChild(modal);
                addModalListeners(modal);
            }
        }
        if (modal) modal.style.display = 'flex';
    });

    function addModalListeners(modal) {
        // Cerrar con botón
        modal.querySelector('.modal-close').onclick = () => modal.style.display = 'none';
        // Cerrar con botón cancelar
        const btnCancel = modal.querySelector('.btn-cancel');
        if (btnCancel) btnCancel.onclick = (e) => { e.preventDefault(); modal.style.display = 'none'; };
        // Cerrar haciendo click fuera del modal
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }
});
