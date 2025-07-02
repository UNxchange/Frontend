// Punto de entrada principal del proyecto TypeScript

import './scripts/login-form';
import './scripts/signup-modal';

// Configuración global de la aplicación
const APP_CONFIG = {
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    apiUrl: 'https://api.ejemplo.com'
};

// Exponer configuración globalmente si es necesario
(window as any).APP_CONFIG = APP_CONFIG;

console.log(`Aplicación iniciada - Versión ${APP_CONFIG.version}`);

export { APP_CONFIG };
