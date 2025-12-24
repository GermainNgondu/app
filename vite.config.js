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
           
            '@': path.resolve(__dirname, './app/Core/Resources/js'),
            '@features': path.resolve(__dirname, './app/Features'),
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
