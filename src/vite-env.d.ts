/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_AUTH_COOKIE_NAME: string;
    readonly VITE_ENV: 'development' | 'production' | 'test';
    // Add other env variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
