# Dockerfile simple y robusto para React/Vite
FROM node:20-bullseye AS builder

WORKDIR /app

# Variables de entorno
ENV VITE_AUTH_BASE_URL=http://localhost:8000
ENV VITE_CONVOCATORIAS_BASE_URL=http://localhost:8002
ENV VITE_NOTIFICATIONS_BASE_URL=http://localhost:8001
ENV VITE_CONVENIOS_BASE_URL=http://localhost:8000
ENV VITE_CONVOCATORIAS_API_URL=http://localhost:8002/convocatorias/
ENV VITE_AUTH_API_URL=http://localhost:8000/api/v1/auth/
ENV VITE_NOTIFICATIONS_API_URL=http://localhost:8001/api/v1/notification/
ENV VITE_TOKEN_KEY=access_token
ENV VITE_DEFAULT_REDIRECT=/dashboard
ENV VITE_LOGIN_PATH=/login

# Instalar dependencias del sistema de forma más limpia
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración
COPY package.json ./
COPY package-lock.json* ./

# --- COMIENZO DE LA SOLUCIÓN ROBUSTA ---
# Forzar la reinstalación limpia de dependencias para el entorno Linux
RUN rm -f package-lock.json
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
# --- FIN DE LA SOLUCIÓN ROBUSTA ---

# Copiar código fuente
COPY . .

# Verificar que vite está disponible
RUN npx vite --version

# Build del proyecto
RUN NODE_ENV=production npm run build

# Etapa nginx
FROM nginx:alpine

# Instalar curl
RUN apk add --no-cache curl

# Copiar archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear configuración nginx
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /health { \
        return 200 "healthy"; \
        add_header Content-Type text/plain; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]