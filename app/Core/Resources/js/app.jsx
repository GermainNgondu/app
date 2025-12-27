import './bootstrap';
import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { loadTranslations } from '@/common/lib/i18n';

// Simple loader for waiting (Suspense)
const PageLoader = () => (
    <div className="flex h-full w-full items-center justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

/**
 * SCAN GLOBAL (LAZY LOADING)
 * Use { eager: false } to not load everything at startup.
 */
const globImports = import.meta.glob([
    './ui/**/*.jsx',
    './layouts/**/*.jsx',
    './system/**/*.jsx',
    './common/**/*.jsx',
    './components/**/*.jsx',
    '../../../Features/**/Resources/js/components/**/*.jsx' 
], { eager: false });

/**
 * PATH RESOLVER
 */
const resolveComponent = (name) => {
    if (!name || typeof name !== 'string') return null;

    const parts = name.split('::');
    if (parts.length < 2) return null;

    const namespace = parts[0]; 
    const componentPath = parts[1];

    let possiblePaths = [];

    if (namespace === 'Core') {
        possiblePaths = [
            `./layouts/${componentPath}.jsx`,
            `./system/${componentPath}.jsx`,
            `./ui/${componentPath}.jsx`,
            `./common/${componentPath}.jsx`,
            `./${componentPath}.jsx`,
            `./components/${componentPath}.jsx`,
        ];
    } else {
        possiblePaths = [
            `../../../Features/${namespace}/Resources/js/components/${componentPath}.jsx`
        ];
    }

    for (const path of possiblePaths) {
        if (globImports[path]) {
            return globImports[path];
        }
    }

    console.warn(`[LazyResolver] Component not found : ${name}`);
    // In dev, show the tested paths to help with debugging
    if (import.meta.env.DEV) {
        console.warn('Paths tested:', possiblePaths);
    }

    return null;
};

/**
 * 4. MOUNT ISLANDS (ASYNC)
 */
export async function mountIslands(container = document) {
    const islands = container.querySelectorAll('[data-react-component]');

    for (const el of islands) {
        if (el.dataset.mounted === "true") continue;

        const name = el.dataset.reactComponent;
        let props = {};
        
        try {
            props = JSON.parse(el.dataset.props || '{}');
        } catch (e) {
            console.error(`Error parsing props for ${name}`, e);
        }

        const importFn = resolveComponent(name);

        if (importFn) {
            // Use React.lazy to load the JS file only when needed
            const Component = lazy(importFn);

            const root = createRoot(el);
            root.render(
                <QueryClientProvider client={queryClient}>
                    {/* Suspense shows the loader while the JS file is loading */}
                    <Suspense fallback={<PageLoader />}>
                        <Component {...props} />
                    </Suspense>
                </QueryClientProvider>
            );
            el.dataset.mounted = "true";
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load translations (fast if cached)
        await loadTranslations(window.locale || 'en');
        
        // Mount the app (Lazy Loading)
        // Suspense will show the PageLoader while the JS is loading
        await mountIslands(document);

        // Mark the app as ready for subsequent reloads
        sessionStorage.setItem('app_is_ready', 'true');

        // Logic to detect if the link points to a React Feature
        // and dynamically preload the component via globImports
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('mouseenter', () => {
                const url = new URL(link.href);
            });
        });

    } catch (error) {
        console.error("Startup error:", error);
        // Remove the app_is_ready flag in case of critical error
        sessionStorage.removeItem('app_is_ready');
    } finally {
        // DOM clean
        const loader = document.getElementById('app-loader');
        
        // Do the fade-out animation only if the loader is still visible
        // (Meaning it wasn't hidden by CSS on a previous reload)
        if (loader && getComputedStyle(loader).display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        } else if (loader) {
            // Remove the loader from the DOM if it was hidden by CSS
            loader.remove();
        }
    }
});