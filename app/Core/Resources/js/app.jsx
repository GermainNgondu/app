import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Évite de recharger quand on change de fenêtre
            retry: 1, // Ne réessaie qu'une fois en cas d'erreur
        },
    },
});
/**
 * 1. GLOB GÉNÉRIQUE
 * On scanne le Core ET toutes les Features dynamiquement.
 * Vite va créer un objet avec les chemins complets comme clés.
 */
const components = import.meta.glob([
    './components/**/*.jsx', 
    '../../../Features/**/Resources/js/components/**/*.jsx' // <--- Remonte à la racine 'app' pour trouver les Features
], { eager: true });

/**
 * 2. RÉSOLUTION DYNAMIQUE
 * Transforme "Namespace::Path/To/Component" en chemin de fichier réel.
 */
const resolveComponent = (name) => {

    if (!name || typeof name !== 'string') {
        return null;
    }

    const parts = name.split('::');
    
    // Si format invalide, on arrête
    if (parts.length < 2) return null;


    

    const namespace = parts[0]; 
    const componentPath = parts[1];

    let lookupKey = '';

    if (namespace === 'Core') {
        // Chemin local pour le Core
        lookupKey = `./components/${componentPath}.jsx`;
    } else {
        // Chemin dynamique pour N'IMPORTE QUELLE Feature
        // On injecte le namespace directement dans le chemin
        lookupKey = `../../../Features/${namespace}/Resources/js/components/${componentPath}.jsx`;
    }

    // On vérifie si Vite a trouvé ce fichier
    const component = components[lookupKey];

    if (!component) {
        console.warn(`[React Resolver] Module introuvable pour : ${name}`);
        console.warn(`Chemin tenté : ${lookupKey}`);
    }

    return component;
};

/**
 * 3. MOTEUR DE RENDU (ISLANDS)
 * (Identique à l'étape précédente, mais utilise le nouveau resolveComponent)
 */
export function mountIslands(container = document) {
    const islands = container.querySelectorAll('[data-react-component]');

    islands.forEach(el => {
        if (el.dataset.mounted === "true") return;

        const name = el.dataset.reactComponent;
        const props = JSON.parse(el.dataset.props || '{}');
        
        // Appel de notre résolveur générique
        const module = resolveComponent(name);

        if (module) {
            const Component = module.default || module;
            createRoot(el).render(<QueryClientProvider client={queryClient}><Component {...props} /></QueryClientProvider>);
            el.dataset.mounted = "true";
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    mountIslands(document);
});