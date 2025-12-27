// app/Core/Resources/js/system/media/components/MediaUnsplashTab.jsx
import React, { useState } from 'react';
import { Search, Loader2, Download, ExternalLink } from "lucide-react";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { __ } from '@/common/lib/i18n';
import axios from 'axios';
import { toast } from "sonner";

export const MediaUnsplashTab = ({ onImportSuccess }) => {
    const [search, setSearch] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importingId, setImportingId] = useState(null);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.get(`/admin/media/unsplash/search?query=${search}`);
            setImages(res.data.results);
        } catch (error) {
            toast.error(__('Erreur Unsplash'));
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (image) => {
        setImportingId(image.id);
        try {
            await axios.post('/admin/media/upload-url', { 
                url: image.urls.regular,
                name: image.alt_description || 'Unsplash Photo'
            });
            toast.success(__('Image importée dans votre bibliothèque'));
            onImportSuccess(); // Retour à la bibliothèque
        } catch (error) {
            toast.error(__('Erreur d\'importation'));
        } finally {
            setImportingId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <form onSubmit={handleSearch} className="p-4 border-b flex gap-2 shrink-0 bg-zinc-50/50">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input 
                        placeholder={__('Chercher sur Unsplash...')} 
                        className="pl-9" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : __('Rechercher')}</Button>
            </form>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map(img => (
                        <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden bg-zinc-100">
                            <img src={img.urls.small} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                <p className="text-[10px] text-white text-center mb-4 line-clamp-2">By {img.user.name}</p>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleImport(img)}
                                    disabled={importingId === img.id}
                                >
                                    {importingId === img.id ? <Loader2 className="animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                    {__('Importer')}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};