import { useState, useEffect } from 'react';

export function useMediaSelection(multiple, onSelect, onOpenChange, defaultSelected) {
    const [selectedMedia, setSelectedMedia] = useState([]);

    // Synchroniser la sélection initiale si elle existe
    useEffect(() => {
        if (defaultSelected) {
            const defaults = Array.isArray(defaultSelected) ? defaultSelected : [defaultSelected];
            // On pourrait ici charger les objets médias complets si nécessaire, 
            // mais pour l'affichage du "check", on garde la logique simple
        }
    }, [defaultSelected]);

    const isFileSelected = (file) => {
        if (!file) return false;

        // 1. Vérifier si l'élément est dans la sélection en cours (clics récents)
        const isCurrentlySelected = selectedMedia.some(m => String(m.id) === String(file.id));
        if (isCurrentlySelected) return true;

        // 2. Vérifier si l'élément est la valeur par défaut (déjà sauvegardée)
        // UNIQUEMENT si l'utilisateur n'a pas encore interagi avec cet item
        if (defaultSelected && selectedMedia.length === 0) {
            const defaults = Array.isArray(defaultSelected) ? defaultSelected : [defaultSelected];
            return defaults.some(d => String(d) === String(file.url) || String(d) === String(file.id));
        }

        return false;
    };

    const toggleSelection = (file) => {
        if (!multiple) {
            onSelect(file.url);
            onOpenChange(false);
            return;
        }

        setSelectedMedia(prev => {
            const exists = prev.find(m => String(m.id) === String(file.id));
            if (exists) {
                return prev.filter(m => String(m.id) !== String(file.id));
            } else {
                return [...prev, file];
            }
        });
    };

    const clearSelection = () => setSelectedMedia([]);

    return { selectedMedia, isFileSelected, toggleSelection, clearSelection };
}