import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@ui/dialog";
import { Button } from "@ui/button";
import { X, FileText, Download, Trash2, CheckCircle, PlaySquare } from "lucide-react";
import { __ } from '@/common/lib/i18n';

export const MediaPreview = ({ media, onClose, onSelect, onDelete }) => {
    if (!media) return null;

    // Détection des types
    const isImage = media.mime_type?.startsWith('image/');
    const isYoutube = media.mime_type === 'video/youtube';
    const isVideo = media.mime_type?.startsWith('video/') && !isYoutube;

    // Helper pour extraire l'ID YouTube proprement
    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <Dialog open={!!media} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0 bg-zinc-950 border-none overflow-hidden flex flex-col shadow-2xl">
                <DialogTitle className="sr-only">Aperçu du média</DialogTitle>
                
                {/* ZONE D'AFFICHAGE PRINCIPALE */}
                <div className="relative flex-1 flex items-center justify-center min-h-[500px] bg-black">
                    {isImage ? (
                        <img 
                            src={media.url} 
                            className="max-w-full max-h-[75vh] object-contain animate-in fade-in duration-300" 
                            alt={media.name} 
                        />
                    ) : isYoutube ? (
                        <div className="w-full aspect-video bg-black flex items-center justify-center">
                            <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${getYoutubeId(media.url)}?autoplay=1`} 
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            />
                        </div>
                    ) : isVideo ? (
                        <video 
                            src={media.url} 
                            controls 
                            className="max-w-full max-h-[75vh]"
                            autoPlay
                        />
                    ) : (
                        <div className="text-white flex flex-col items-center gap-6">
                            <div className="p-8 bg-zinc-900 rounded-2xl">
                                <FileText className="w-24 h-24 text-zinc-700" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg">{media.file_name}</p>
                                <p className="text-zinc-500 text-sm uppercase">{media.mime_type}</p>
                            </div>
                            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                <a href={media.url} download>
                                    <Download className="mr-2 w-4 h-4" /> {__('download_file')}
                                </a>
                            </Button>
                        </div>
                    )}
                </div>
                
                {/* BARRE D'INFOS ET ACTIONS */}
                <div className="bg-zinc-900 p-4 flex items-center justify-between text-white border-t border-white/10 shrink-0">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            {isYoutube && <PlaySquare className="w-4 h-4 text-red-500" />}
                            <span className="font-bold text-sm truncate max-w-[300px]">{media.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                            {media.mime_type} • {media.size ? (media.size / 1024).toFixed(2) : '0'} KB
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Bouton Supprimer */}
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            className="h-9 px-4 cursor-pointer"
                            onClick={() => {
                                if (media && media.id) {
                                    onDelete(media.id);
                                } else {
                                    console.warn("MediaPreview: media.id est manquant", media);
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> {__('delete')}
                        </Button>

                        {/* Bouton Sélectionner */}
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="h-9 px-4 bg-white text-black hover:bg-zinc-200 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(media.url);
                            }}
                        >
                            <CheckCircle className="w-4 h-4 mr-2" /> 
                            {__('select_media')}
                        </Button>

                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2 cursor-pointer"
                        >
                            <X className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};