// app/Core/Resources/js/system/media/components/MediaGrid.jsx
import React from 'react';
import { ScrollArea } from "@ui/scroll-area";
import { ImageOff } from "lucide-react";
import { MediaSkeleton } from './MediaSkeleton';
import { __ } from '@/common/lib/i18n';

export const MediaGrid = ({ isLoading, children }) => {
    // On génère un tableau de 15 éléments pour remplir la grille pendant le chargement
    const skeletons = Array.from({ length: 12 }, (_, i) => <MediaSkeleton key={i} />);

    return (
        <ScrollArea className="flex-1 min-h-0 w-full">
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">
                    {isLoading ? (
                        // Affiche les skeletons si on charge
                        skeletons 
                    ) : (
                        // Affiche les vrais médias sinon
                        children
                    )}
                </div>

                {/* État vide (si pas de chargement et pas d'enfants) */}
                {!isLoading && React.Children.count(children) === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                        <ImageOff className="w-12 h-12 mb-4 opacity-20" />
                        <p>{__('Aucun fichier trouvé')}</p>
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};