import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['app/Core/Resources/css/app.css', 'app/Core/Resources/js/app.jsx'],
            refresh: [
                'app/Core/Resources/views/**',
                'app/Features/**/Resources/views/**', 
                'app/Core/Infrastructure/Routes/**',
            ],
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            // Racine du JS Core (pour imports génériques ex: '@/lib/utils')
            '@': path.resolve(__dirname, './app/Core/Resources/js'),
            
            // Accès direct au Design System (ex: '@ui/button')
            '@ui': path.resolve(__dirname, './app/Core/Resources/js/ui'),
            
            // Accès System du Core (ex: '@core/auth')
            '@core-system': path.resolve(__dirname, './app/Core/Resources/js/system'),
            
            // Accès aux Features Externes / Modules (ex: '@modules/Blog')
            '@modules': path.resolve(__dirname, './app/Features'),
        },
    },
    server: {
        watch: {
            usePolling: true,
            ignored: ['**/storage/framework/views/**'],
        },
    },

    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                }
            }
        }
    }
});