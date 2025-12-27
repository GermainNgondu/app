// app/Core/Resources/js/system/media/components/MediaUploadTab.jsx
import React, { useState, useCallback } from 'react';
import { UploadCloud, Loader2, FileCheck } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { Progress } from "@ui/progress";
import { __ } from '@/common/lib/i18n';
import axios from 'axios';
import { toast } from "sonner";

export const MediaUploadTab = ({ onUploadSuccess, allowedType }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback(acceptedFiles => {
        handleUpload(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: allowedType === 'image' ? { 'image/*': [] } : undefined 
    });

    const handleUpload = async (files) => {
        setUploading(true);
        const formData = new FormData();
        files.forEach(file => formData.append('files[]', file));
        formData.append('type', allowedType);

        try {
            await axios.post('/admin/media/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });
            toast.success(__('Fichiers téléchargés avec succès'));
            onUploadSuccess(); // Rafraîchit la bibliothèque et change d'onglet
        } catch (error) {
            toast.error(__('Erreur lors du téléchargement'));
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-10">
            <div 
                {...getRootProps()} 
                className={`w-full max-w-2xl aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-zinc-200 hover:border-primary/50'}
                    ${uploading ? 'pointer-events-none opacity-50' : ''}
                `}
            >
                <input {...getInputProps()} />
                
                {uploading ? (
                    <div className="w-full max-w-xs space-y-4 text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <p className="font-medium">{__('Téléchargement...')} {progress}%</p>
                        <Progress value={progress} className="h-2" />
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                            <UploadCloud className="w-8 h-8 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{__('Glissez vos fichiers ici')}</p>
                            <p className="text-sm text-zinc-500">{__('ou cliquez pour parcourir vos dossiers')}</p>
                        </div>
                        <p className="text-xs text-zinc-400 uppercase tracking-widest">{allowedType} supportés</p>
                    </div>
                )}
            </div>
        </div>
    );
};