import { useState } from 'react';

export function useMediaSelection(multiple, onSelect, onOpenChange, defaultSelected) {
    const [selectedMedia, setSelectedMedia] = useState([]);

    const isFileSelected = (file) => {
        if (selectedMedia.some(m => m.id === file.id)) return true;
        if (defaultSelected) {
            const defaults = Array.isArray(defaultSelected) ? defaultSelected : [defaultSelected];
            return defaults.includes(file.url);
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
            const exists = prev.find(m => m.id === file.id);
            return exists ? prev.filter(m => m.id !== file.id) : [...prev, file];
        });
    };

    return { selectedMedia, isFileSelected, toggleSelection };
}