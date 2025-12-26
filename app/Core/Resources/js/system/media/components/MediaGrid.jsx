import React from 'react';
import { ScrollArea } from "@ui/scroll-area";
import { Loader2 } from "lucide-react";
import { __ } from '@/common/lib/i18n';

export const MediaGrid = ({ isLoading, children }) => {
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-zinc-300" />
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1 min-h-0">
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">
                    {children}
                </div>
                {React.Children.count(children) === 0 && (
                    <div className="text-center py-20 text-zinc-500">
                        {__('Aucun média trouvé')}
                    </div>
                )}
            </div>
        </ScrollArea>
    );
};