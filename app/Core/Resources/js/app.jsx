import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadTranslations } from '@/common/lib/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

/**
 * SCAN GLOBAL INTELLIGENT
 */
const globImports = import.meta.glob([
    './ui/**/*.jsx',           // Design System
    './layouts/**/*.jsx',      // Layouts (Admin, Auth...)
    './system/**/*.jsx',     // System (Auth, Media...)
    './common/**/*.jsx',       // Shared components
    './components/**/*.jsx',
    '../../../Features/**/Resources/js/components/**/*.jsx' 
], { eager: true });

/**
 * PATH RESOLVER
 */
const resolveComponent = (name) => {
    if (!name || typeof name !== 'string') return null;

    const parts = name.split('::');
    if (parts.length < 2) return null;

    const namespace = parts[0]; 
    const componentPath = parts[1];

    // List of possible paths to test
    let possiblePaths = [];

    if (namespace === 'Core') {
        // For the Core, we look for standard folders in the new architecture
        possiblePaths = [
            `./layouts/${componentPath}.jsx`,
            `./system/${componentPath}.jsx`,
            `./ui/${componentPath}.jsx`,
            `./common/${componentPath}.jsx`,
            `./components/${componentPath}.jsx`,
            `./${componentPath}.jsx`
        ];
    } else {
        // For external modules (ex: Blog::PostList)
        // We suppose that componentPath is "PostList"
        possiblePaths = [
            `../../../Features/${namespace}/Resources/js/components/${componentPath}.jsx`
        ];
    }

    // On retourne le premier module trouvé
    for (const path of possiblePaths) {
        if (globImports[path]) {
            return globImports[path];
        }
    }

    console.warn(`[React Resolver] Component not found : ${name}`);
    if (import.meta.env.DEV) {
        console.warn(`Paths tested :`, possiblePaths);
    }

    return null;
};

/**
 * Mount React components in HTML <div data-react-component="...">
 */
export function mountIslands(container = document) {
    const islands = container.querySelectorAll('[data-react-component]');

    islands.forEach(el => {
        // Protection against double mounting
        if (el.dataset.mounted === "true") return;

        const name = el.dataset.reactComponent;
        
        // Secure JSON parsing
        let props = {};
        try {
            props = JSON.parse(el.dataset.props || '{}');
        } catch (e) {
            console.error(`Error parsing JSON for component ${name}`, e);
        }

        const module = resolveComponent(name);

        if (module) {
            const Component = module.default || module;
            
            const root = createRoot(el);
            root.render(
                <QueryClientProvider client={queryClient}>
                    <Component {...props} />
                </QueryClientProvider>
            );

            el.dataset.mounted = "true";
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTranslations(window.locale || 'en');
        mountIslands(document);

    } catch (error) {
        console.error("Critical error at startup :", error);
    } finally {

        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.opacity = '0';
            
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }
});