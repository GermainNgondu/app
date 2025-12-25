import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
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
 * 1. SCAN GLOBAL INTELLIGENT
 */
const globImports = import.meta.glob([
    './ui/**/*.jsx',           // Design System
    './layouts/**/*.jsx',      // Layouts (Admin, Auth...)
    './system/**/*.jsx',     // System (Auth, Media...)
    './common/**/*.jsx',       // Composants partagés
    './components/**/*.jsx',   // Ancien dossier (à vider progressivement)
    '../../../Features/**/Resources/js/components/**/*.jsx' 
], { eager: true });

/**
 * 2. RÉSOLVEUR DE CHEMINS
 * Transforme "Core::Admin/AppSidebar" en chemin de fichier réel
 */
const resolveComponent = (name) => {
    if (!name || typeof name !== 'string') return null;

    const parts = name.split('::');
    if (parts.length < 2) return null;

    const namespace = parts[0]; 
    const componentPath = parts[1];

    // Liste des chemins possibles à tester
    let possiblePaths = [];

    if (namespace === 'Core') {
        // Pour le Core, on cherche dans les dossiers standards de la nouvelle architecture
        possiblePaths = [
            `./layouts/${componentPath}.jsx`,      // 1. Est-ce un Layout ?
            `./system/${componentPath}.jsx`,     // 2. Est-ce un System ?
            `./ui/${componentPath}.jsx`,           // 3. Est-ce un composant UI ?
            `./common/${componentPath}.jsx`,       // 4. Est-ce un utilitaire ?
            `./components/${componentPath}.jsx`,   // 5. Fallback ancien dossier
            `./${componentPath}.jsx`               // 6. Racine (rare)
        ];
    } else {
        // Pour les Modules externes (ex: Blog::PostList)
        // On suppose que componentPath est "PostList"
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

    console.warn(`[React Resolver] Composant introuvable : ${name}`);
    if (import.meta.env.DEV) {
        console.warn(`Chemins testés :`, possiblePaths);
    }

    return null;
};

/**
 * Monte les composants React dans les balises HTML <div data-react-component="...">
 */
export function mountIslands(container = document) {
    const islands = container.querySelectorAll('[data-react-component]');

    islands.forEach(el => {
        // Protection contre le double montage
        if (el.dataset.mounted === "true") return;

        const name = el.dataset.reactComponent;
        
        // Lecture sécurisée des props JSON
        let props = {};
        try {
            props = JSON.parse(el.dataset.props || '{}');
        } catch (e) {
            console.error(`Erreur de parsing JSON pour le composant ${name}`, e);
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
            
            // Marque l'élément comme monté
            el.dataset.mounted = "true";
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mountIslands(document);
});