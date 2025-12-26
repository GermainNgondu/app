import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon } from "lucide-react";
import { Label } from "@ui/label";
import { __ } from '@/common/lib/i18n';
import MediaLibraryModal from '@/system/media/components/MediaLibraryModal';

export function MultiImagePicker({ label, values = [], onChange, className }) {
    const [open, setOpen] = useState(false);

    const handleSelect = (urls) => {
        const mergedValues = [...values, ...urls];
        const uniqueValues = [...new Set(mergedValues)];
        
        onChange(uniqueValues);
    };

    const handleRemove = (indexToRemove) => {
        onChange(values.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className={className || "space-y-3"}>
            {label && <Label>{label}</Label>}
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {values.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden group bg-zinc-50 dark:bg-zinc-900">
                        <img 
                            src={url} 
                            alt={`Selection ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        />
                        
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                        {/* Bouton de suppression */}
                        <button 
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-sm hover:bg-red-600"
                            title={__('Retirer')}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {/* Bouton pour ajouter */}
                <button 
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg aspect-square hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-primary/50 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Plus className="w-5 h-5 text-zinc-400 group-hover:text-primary" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 mt-2 group-hover:text-primary">{__('Ajouter')}</span>
                </button>
            </div>

            {/* MODALE MÉDIA */}
            <MediaLibraryModal 
                open={open} 
                onOpenChange={setOpen} 
                multiple={true} 
                defaultSelected={values} 
                onSelect={handleSelect}
            />
        </div>
    );
}