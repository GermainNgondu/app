import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Check, Eye, Trash2, FileText } from "lucide-react";
import { Button } from "@ui/button";

/**
 * Composant représentant une carte individuelle dans la médiathèque.
 * * @param {Object} file - Les données du média (id, url, thumbnail, mime_type, etc.)
 * @param {Boolean} isSelected - État de sélection (géré par le hook useMediaSelection)
 * @param {Function} onToggle - Fonction pour sélectionner/désélectionner l'item
 * @param {Function} onPreview - Fonction pour ouvrir l'aperçu plein écran
 * @param {Function} onDelete - Fonction pour déclencher la suppression (ouvre l'AlertDialog)
 */
export const MediaItem = ({ file, isSelected, onToggle, onPreview, onDelete }) => {
    const isImage = file.mime_type?.startsWith('image/');

    return (
        <motion.div 
            layout // Animation fluide lors des changements de grille
            whileHover={{ y: -4 }} // Soulèvement au survol
            whileTap={{ scale: 0.98 }} // Effet de pression au clic
            onClick={() => onToggle(file)}
            className={`group relative aspect-square border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                isSelected 
                    ? 'border-primary shadow-lg shadow-primary/20 bg-primary/5' 
                    : 'border-zinc-200 bg-white dark:bg-zinc-900'
            }`}
        >
            {/* 1. Contenu du média (Image ou Icône de document) */}
            <motion.div 
                animate={{ scale: isSelected ? 0.92 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full h-full"
            >
                {isImage ? (
                    <img 
                        src={file.thumbnail || file.url} 
                        className="w-full h-full object-cover" 
                        alt={file.name} 
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-zinc-50 dark:bg-zinc-800/50">
                        <FileText className="w-10 h-10 text-zinc-300" />
                        <span className="text-[10px] mt-2 px-2 truncate w-full text-center text-zinc-500 font-medium">
                            {file.file_name}
                        </span>
                    </div>
                )}
            </motion.div>

            {/* 2. Overlay d'Actions (Apparition au survol) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                {/* Bouton Aperçu */}
                <Button 
                    type="button"
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8 rounded-full shadow-xl cursor-pointer"
                    onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); // EMPÊCHE la sélection de l'item lors du clic
                        onPreview(file); 
                    }}
                >
                    <Eye className="h-4 w-4" />
                </Button>

                {/* Bouton Supprimer */}
                <Button 
                    type="button"
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 rounded-full shadow-xl cursor-pointer"
                    onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); // EMPÊCHE la sélection de l'item
                        if (file && file.id) {
                            onDelete(file.id);
                        } else {
                            console.warn("MediaItem: file.id est manquant", file);
                        }  // Transmet l'ID au parent pour ouvrir l'AlertDialog
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            
            {/* 3. Badge de Sélection (Checkmark) avec Animation */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div 
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 45 }}
                        className="absolute top-2 right-2 bg-primary text-white rounded-full p-1.5 shadow-xl z-10"
                    >
                        <Check className="w-4 h-4 stroke-[4]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Bordure de sélection active (Layout Animation) */}
            {isSelected && (
                <motion.div 
                    layoutId="selection-border"
                    className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </motion.div>
    );
};