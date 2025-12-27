// app/Core/Resources/js/system/media/components/BatchActionBar.jsx
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X, CheckSquare, Download } from "lucide-react";
import { Button } from "@ui/button";
import { __ } from '@/common/lib/i18n';

export const BatchActionBar = ({ count, onClear, onDelete }) => {
    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 flex items-center gap-6 backdrop-blur-lg">
                        <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                            <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                {count}
                            </div>
                            <span className="text-sm font-medium">{__('éléments sélectionnés')}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white hover:bg-white/10 h-9"
                                onClick={onDelete}
                            >
                                <Trash2 className="w-4 h-4 mr-2 text-red-400" />
                                {__('Supprimer')}
                            </Button>

                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white hover:bg-white/10 h-9"
                                onClick={onClear}
                            >
                                <X className="w-4 h-4 mr-2" />
                                {__('Annuler')}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};