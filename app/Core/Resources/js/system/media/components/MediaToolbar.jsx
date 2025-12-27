// app/Core/Resources/js/system/media/components/MediaToolbar.jsx

import React, { useState, useEffect } from 'react';
import { Search, Filter, Folder, Trash2, Loader2, X } from "lucide-react";
import { Input } from "@ui/input";
import { 
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@ui/select";
import { Button } from "@ui/button";
import { useDebounce } from '@/common/hooks/useDebounce';
import { __ } from '@/common/lib/i18n';

export const MediaToolbar = ({ filters, setFilters, collections = [], isFetching, allowedType }) => {
    // État local pour la recherche (réactivité immédiate au clavier)
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const debouncedSearch = useDebounce(searchTerm, 500);

    // Mise à jour des filtres parent quand le debounce est terminé
    useEffect(() => {
        setFilters(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
    }, [debouncedSearch]);

    // Réinitialisation si la recherche est vidée manuellement
    const clearSearch = () => setSearchTerm("");

    return (
        <div className="px-6 py-4 border-b flex flex-wrap items-center gap-4 bg-white dark:bg-zinc-950 shrink-0">
            
            {/* 1. Recherche avec indicateur de chargement */}
            <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                    placeholder={__('Rechercher un média...')} 
                    className="pl-10 pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {isFetching ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
                ) : searchTerm && (
                    <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* 2. Filtre par Collection (Dossiers) */}
            <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-zinc-400" />
                <Select 
                    value={filters.collection} 
                    onValueChange={(val) => setFilters(prev => ({ ...prev, collection: val, page: 1 }))}
                >
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder={__('Toutes les collections')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{__('Toutes les collections')}</SelectItem>
                        {collections.map(col => (
                            <SelectItem key={col} value={col}>{col}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* 3. Filtre par Type (Image, Video, etc.) - Désactivé si allowedType est imposé */}
            {allowedType === 'all' && (
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-zinc-400" />
                    <Select 
                        value={filters.type} 
                        onValueChange={(val) => setFilters(prev => ({ ...prev, type: val, page: 1 }))}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={__('Tous les types')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{__('Tous les types')}</SelectItem>
                            <SelectItem value="image">{__('Images')}</SelectItem>
                            <SelectItem value="video">{__('Vidéos')}</SelectItem>
                            <SelectItem value="pdf">{__('Documents PDF')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* 4. Bouton Corbeille (Mode Bascule) */}
            <Button 
                variant={filters.trashed ? "destructive" : "outline"}
                size="sm"
                className={`ml-auto gap-2 cursor-pointer ${filters.trashed ? 'ring-2 ring-destructive/20' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, trashed: !prev.trashed, page: 1 }))}
            >
                <Trash2 className={`w-4 h-4 ${filters.trashed ? 'animate-bounce' : ''}`} />
                {filters.trashed ? __('Quitter la corbeille') : __('Voir la corbeille')}
            </Button>
        </div>
    );
};