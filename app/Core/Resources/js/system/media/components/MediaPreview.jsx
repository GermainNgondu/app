import React from 'react';
import { Dialog, DialogContent } from "@ui/dialog";
import { Button } from "@ui/button";
import { X, FileText, Download, PlaySquare } from "lucide-react";
import { __ } from '@/common/lib/i18n';

export const MediaPreview = ({ media, onClose, onSelect }) => {
    if (!media) return null;

    const isImage = media.mime_type.startsWith('image/');
    const isYoutube = media.mime_type === 'video/youtube';

    return (
        <Dialog open={!!media} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-black border-none overflow-hidden flex flex-col">
                <div className="relative flex-1 flex items-center justify-center min-h-[400px] bg-zinc-950">
                    {isImage ? (
                        <img src={media.url} className="max-w-full max-h-[75vh] object-contain shadow-2xl" alt="" />
                    ) : isYoutube ? (
                        <div className="w-full aspect-video">
                            <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${media.url.split('v=')[1] || media.url.split('/').pop()}`} 
                                allowFullScreen 
                            />
                        </div>
                    ) : (
                        <div className="text-white flex flex-col items-center gap-4">
                            <FileText className="w-24 h-24 opacity-20" />
                            <p className="font-medium">{media.file_name}</p>
                            <Button asChild variant="outline" className="text-white border-white/20 hover:bg-white/10">
                                <a href={media.url} download><Download className="mr-2 w-4 h-4"/> {__('Télécharger')}</a>
                            </Button>
                        </div>
                    )}
                </div>
                
                <div className="bg-zinc-900 border-t border-white/10 p-4 flex items-center justify-between text-white">
                    <div className="flex flex-col">
                        <span className="font-bold text-sm truncate max-w-md">{media.name}</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                            {media.mime_type} • {(media.size / 1024).toFixed(2)} KB
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="primary" size="sm" onClick={() => onSelect(media.url)}>
                            {__('Sélectionner ce média')}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};