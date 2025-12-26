import React, { useState } from 'react';
import { X, Image as ImageIcon, UploadCloud, Edit2 } from "lucide-react";
import { Button } from "@ui/button";
import { cn } from "@/common/lib/utils";
import MediaLibraryModal from '@/system/media/components/MediaLibraryModal';

export function ImagePicker({ 
    value, 
    onChange, 
    className, 
    placeholder = "Choisir une image",
    disabled = false
}) {
    const [open, setOpen] = useState(false);

    const handleSelect = (url) => {
        onChange(url);
        setOpen(false);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        onChange(null);
    };

    return (
        <div className={cn("w-full", className)}>
            
            {/* ZONE DE PRÉVISUALISATION (TRIGGER) */}
            <div 
                onClick={() => !disabled && setOpen(true)}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-4 transition-all group min-h-[160px] flex flex-col items-center justify-center gap-3 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50",
                    !disabled ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-primary/50" : "opacity-60 cursor-not-allowed",
                    value ? "border-solid border-zinc-200 dark:border-zinc-800" : "border-zinc-300 dark:border-zinc-700"
                )}
            >
                {value ? (
                    <>
                        {/* Image Preview */}
                        <img 
                            src={value} 
                            alt="Selected" 
                            className="absolute inset-0 w-full h-full object-contain p-2 z-0" 
                        />
                        
                        {/* Overlay au survol */}
                        {!disabled && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                <div className="bg-white/90 text-zinc-900 px-3 py-1.5 rounded-full text-xs font-medium flex items-center shadow-sm">
                                    <Edit2 className="w-3 h-3 mr-1.5" /> Modifier
                                </div>
                            </div>
                        )}

                        {/* Bouton Supprimer */}
                        {!disabled && (
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md z-20 opacity-0 group-hover:opacity-100 transition-opacity scale-90 hover:scale-100"
                                onClick={handleRemove}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {/* Placeholder State */}
                        <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-zinc-400" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{placeholder}</p>
                            <p className="text-xs text-zinc-400">{disabled ? "Modification désactivée" : "Cliquez pour parcourir"}</p>
                        </div>
                    </>
                )}
            </div>

            {/* MODALE MÉDIA */}
            <MediaLibraryModal 
                open={open} 
                onOpenChange={setOpen} 
                onSelect={handleSelect}
                multiple={false}
                defaultSelected={value} 
            />
        </div>
    );
}