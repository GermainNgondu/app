import React, { useState } from 'react';
import { Button } from "@/ui/button";
import { ImagePlus, X } from "lucide-react";
import { __ } from '@/common/lib/i18n';
import MediaLibraryModal from '../system/media/components/MediaLibraryModal';

export function ImagePicker({ label, value, onChange }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-2 my-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            
            <div className="flex items-center gap-4 my-2">
                {/* Zone d'aperçu */}
                <div 
                    className="relative h-20 w-20 rounded-md border border-zinc-200 bg-zinc-50 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition"
                    onClick={() => setOpen(true)}
                >
                    {value ? (
                        <img src={value} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <ImagePlus className="h-8 w-8 text-zinc-300" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Button className="cursor-pointer" type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
                        {value ? __('Changer') : __('Sélectionner')}
                    </Button>
                    
                    {value && (
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 h-8 justify-start px-2 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                            onClick={() => onChange('')}
                        >
                            <X className="mr-2 h-3 w-3" /> {__('Retirer')}
                        </Button>
                    )}
                </div>
            </div>

            {/* LA MODALE MÉDIATHÈQUE */}
            <MediaLibraryModal 
                open={open} 
                onOpenChange={setOpen} 
                onSelect={(url) => {
                    onChange(url); // On met à jour l'URL dans le formulaire parent
                }}
            />
        </div>
    );
}