/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_BASE_URL: string
  readonly VITE_CONVOCATORIAS_BASE_URL: string
  readonly VITE_CONVENIOS_BASE_URL: string
  readonly VITE_CONVOCATORIAS_API_URL: string
  readonly VITE_TOKEN_KEY: string
  readonly VITE_DEFAULT_REDIRECT: string
  readonly VITE_LOGIN_PATH: string
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
