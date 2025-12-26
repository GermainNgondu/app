import React, { useState, useMemo } from 'react';
import { 
    X, Plus, Image as ImageIcon, FileText, Film, 
    FileSpreadsheet, FileMusic, PlaySquare, File as FileGeneric, 
    ExternalLink, Play
} from "lucide-react";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { cn } from "@/common/lib/utils";
import { __ } from '@/common/lib/i18n';
import MediaLibraryModal from '@/system/media/components/MediaLibraryModal';

const getMediaType = (url) => {
    if (!url) return 'unknown';
    const cleanUrl = url.toLowerCase();

    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) return 'youtube';
    if (/\.(jpeg|jpg|png|gif|webp|svg)$/.test(cleanUrl)) return 'image';
    if (/\.(mp4|webm|ogg)$/.test(cleanUrl)) return 'video';
    if (/\.(mp3|wav|m4a)$/.test(cleanUrl)) return 'audio';
    if (/\.(pdf)$/.test(cleanUrl)) return 'pdf';
    if (/\.(doc|docx|xls|xlsx|csv|txt)$/.test(cleanUrl)) return 'document';
    
    return 'file';
};

const MediaPreviewItem = ({ url, onRemove, className }) => {
    const type = useMemo(() => getMediaType(url), [url]);
    
    const fileName = url.split('/').pop().split('?')[0];

    const renderContent = () => {
        switch (type) {
            case 'youtube':
                // Extraction ID Youtube pour la miniature
                const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                return (
                    <div className="relative w-full h-full bg-black">
                         {thumb && <img src={thumb} className="w-full h-full object-cover opacity-80" />}
                         <div className="absolute inset-0 flex items-center justify-center">
                            <PlaySquare className="w-8 h-8 text-red-600 fill-white" />
                         </div>
                    </div>
                );

            case 'image':
                return <img src={url} alt="Preview" className="w-full h-full object-cover" />;

            case 'video':
                return (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative group">
                        <Film className="w-8 h-8 text-zinc-500 group-hover:hidden" />
                        <video src={url} className="w-full h-full object-cover hidden group-hover:block" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1 rounded">MP4</div>
                    </div>
                );

            case 'audio':
                return (
                    <div className="w-full h-full bg-blue-50 flex flex-col items-center justify-center p-2 text-center">
                        <FileMusic className="w-8 h-8 text-blue-500 mb-2" />
                        <span className="text-[10px] text-blue-700 font-medium truncate w-full">{fileName}</span>
                    </div>
                );

            case 'pdf':
                return (
                    <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center p-2 text-center">
                        <FileText className="w-8 h-8 text-red-500 mb-2" />
                        <span className="text-[10px] text-red-700 font-medium truncate w-full">{fileName}</span>
                    </div>
                );

            default: // Documents et autres
                return (
                    <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center p-2 text-center">
                        <FileGeneric className="w-8 h-8 text-zinc-400 mb-2" />
                        <span className="text-[10px] text-zinc-600 truncate w-full">{fileName}</span>
                    </div>
                );
        }
    };

    return (
        <div className={cn("relative group border rounded-lg overflow-hidden bg-white aspect-square", className)}>
            {renderContent()}
            
            {/* Actions Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-1 gap-1 opacity-0 group-hover:opacity-100">
                <a href={url} target="_blank" rel="noopener noreferrer" className="bg-white/90 text-zinc-700 p-1 rounded-full hover:text-primary shadow-sm" title="Ouvrir">
                    <ExternalLink className="w-3 h-3" />
                </a>
                <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
                    title="Retirer"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};


export function MediaPicker({ 
    label, 
    value, 
    onChange, 
    multiple = false, 
    accept = 'all',
    className,
    placeholder = "Ajouter un média" 
}) {
    const [open, setOpen] = useState(false);

    // Normalisation des valeurs en tableau pour le traitement interne
    const valuesArray = useMemo(() => {
        if (Array.isArray(value)) return value;
        if (value) return [value];
        return [];
    }, [value]);

    // Handler : Sélection depuis la modale
    const handleSelect = (selectedUrlOrArray) => {
        if (multiple) {
            // En mode multiple, on reçoit un tableau ou une string, on fusionne
            const newSelection = Array.isArray(selectedUrlOrArray) ? selectedUrlOrArray : [selectedUrlOrArray];
            // On évite les doublons
            const unique = [...new Set([...valuesArray, ...newSelection])];
            onChange(unique);
        } else {
            // En mode simple, on remplace la valeur
            // Note: MediaLibraryModal retourne parfois un array en mode simple si mal configuré, on sécurise
            const singleUrl = Array.isArray(selectedUrlOrArray) ? selectedUrlOrArray[0] : selectedUrlOrArray;
            onChange(singleUrl);
            setOpen(false); // Fermeture explicite en mode simple
        }
    };

    // Handler : Suppression
    const handleRemove = (indexToRemove) => {
        if (multiple) {
            onChange(valuesArray.filter((_, i) => i !== indexToRemove));
        } else {
            onChange(null); // ou ''
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {label && <Label>{label}</Label>}

            {/* RENDU : MODE MULTIPLE (GRILLE) */}
            {multiple ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {valuesArray.map((url, idx) => (
                        <MediaPreviewItem 
                            key={`${url}-${idx}`} 
                            url={url} 
                            onRemove={() => handleRemove(idx)} 
                        />
                    ))}

                    {/* Bouton Ajouter (+) */}
                    <button 
                        type="button"
                        onClick={() => setOpen(true)}
                        className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-primary/50 transition-all group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Plus className="w-5 h-5 text-zinc-400 group-hover:text-primary" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 mt-2 group-hover:text-primary">{__('Ajouter')}</span>
                    </button>
                </div>

            ) : (
                /* RENDU : MODE SIMPLE (ZONE UNIQUE) */
                <div 
                    onClick={() => setOpen(true)}
                    className={cn(
                        "relative w-full border-2 border-dashed rounded-lg transition-all group overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 cursor-pointer",
                        valuesArray.length > 0 ? "border-zinc-200 dark:border-zinc-800 p-0" : "border-zinc-300 dark:border-zinc-700 p-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-primary/50"
                    )}
                >
                    {valuesArray.length > 0 ? (
                        // Affiche le média sélectionné en grand
                        <div className="relative w-full aspect-video md:aspect-[3/1] bg-white dark:bg-black">
                            {(() => {
                                const url = valuesArray[0];
                                const type = getMediaType(url);
                                
                                // Rendu spécifique pour le mode "Header" large
                                if (type === 'image') return <img src={url} className="w-full h-full object-contain" />;
                                if (type === 'youtube') return <MediaPreviewItem url={url} className="w-full h-full border-none rounded-none" />;
                                // Pour les fichiers non visuels, on garde le style "MediaPreviewItem" mais adapté
                                return (
                                    <div className="flex items-center justify-center h-full gap-4">
                                        <MediaPreviewItem url={url} onRemove={() => {}} className="w-24 h-24 pointer-events-none" />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-lg">{url.split('/').pop()}</span>
                                            <span className="text-zinc-500 text-sm uppercase">{type}</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Bouton Supprimer Flottant */}
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); handleRemove(0); }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        // Placeholder
                        <div className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                                <Plus className="h-5 w-5 text-zinc-400" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{placeholder}</p>
                                <p className="text-xs text-zinc-400">Image, Vidéo, PDF, Audio...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* LA MODALE UNIVERSELLE */}
            <MediaLibraryModal 
                open={open} 
                onOpenChange={setOpen} 
                multiple={multiple} 
                allowedType={accept}
                defaultSelected={value}
                onSelect={handleSelect}
            />
        </div>
    );
}