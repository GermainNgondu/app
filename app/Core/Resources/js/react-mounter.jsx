import React from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Cette fonction scanne le DOM à la recherche d'éléments ayant l'attribut 'data-react-component'
 * et y injecte le composant React correspondant.
 */
export default function mountReactComponents(components = {}) {
    const rootElements = document.querySelectorAll('[data-react-component]');

    rootElements.forEach((el) => {
        const componentName = el.dataset.reactComponent;
        const props = JSON.parse(el.dataset.props || '{}');

        // On vérifie si le composant existe dans la liste fournie
        const Component = components[componentName];

        if (Component) {
            const root = createRoot(el);
            root.render(<Component {...props} />);
        } else {
            console.warn(`Le composant React "${componentName}" n'a pas été trouvé.`);
        }
    });
}