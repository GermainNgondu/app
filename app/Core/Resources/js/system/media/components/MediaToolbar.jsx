import React from 'react';
import { Search, Folder, Filter, Loader2 } from "lucide-react";
import { Input } from "@ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { __ } from '@/common/lib/i18n';

export const MediaToolbar = ({ filters, setFilters, collections = [], isFetching }) => {
    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    return (
        <div className="p-4 border-b flex items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
            <div className="flex flex-1 items-center gap-2 max-w-2xl">
                {/* Recherche */}
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input 
                        placeholder={__('Rechercher des fichiers...')} 
                        className="pl-9 bg-white dark:bg-zinc-950" 
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                    />
                </div>
                
                {/* Filtre Collections Dynamiques */}
                <Select value={filters.collection} onValueChange={(val) => updateFilter('collection', val)}>
                    <SelectTrigger className="w-[160px] bg-white dark:bg-zinc-950">
                        <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-zinc-500"/>
                            <SelectValue placeholder={__('Collection')} />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{__('Toutes les collections')}</SelectItem>
                        {collections.map((col) => (
                            <SelectItem key={col} value={col}>
                                {col.charAt(0).toUpperCase() + col.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Filtre Types */}
                <Select value={filters.type} onValueChange={(val) => updateFilter('type', val)}>
                    <SelectTrigger className="w-[160px] bg-white dark:bg-zinc-950">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-zinc-500"/>
                            <SelectValue placeholder={__('Type')} />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{__('Tous les formats')}</SelectItem>
                        <SelectItem value="image">{__('Images')}</SelectItem>
                        <SelectItem value="video">{__('Vidéos')}</SelectItem>
                        <SelectItem value="document">{__('Documents')}</SelectItem>
                        <SelectItem value="audio">{__('Audio')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {isFetching && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>
    );
};