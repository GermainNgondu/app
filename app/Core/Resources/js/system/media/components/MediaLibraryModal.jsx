import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { ScrollArea } from "@ui/scroll-area";
import { Label } from "@ui/label";
import { 
    UploadCloud, Check, Loader2, Download, Search, Sparkles, Filter,
    FileText, FileMusic, Film, FileSpreadsheet, FileIcon, PlaySquare,Folder
} from "lucide-react"
import { __ } from '@/common/lib/i18n';
import axios from 'axios';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { useDebounce } from '@/common/hooks/useDebounce';

export default function MediaLibraryModal({ 
    open, 
    onOpenChange, 
    onSelect, 
    multiple = false, 
    allowedType = 'all', // 'image', 'video', 'audio', 'document', 'all'
    defaultSelected = null 
}){

    const [activeTab, setActiveTab] = useState("library");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [fileType, setFileType] = useState(allowedType);
    const [collection, setCollection] = useState("all");
    const [selectedMedia, setSelectedMedia] = useState([]);
    // États pour Unsplash
    const [unsplashQuery, setUnsplashQuery] = useState("");
    const [unsplashResults, setUnsplashResults] = useState([]);

    // États pour AI
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiGeneratedImage, setAiGeneratedImage] = useState(null);

    // États pour URL
    const [externalUrl, setExternalUrl] = useState("");
  
    // Déterminer les extensions acceptées pour l'input upload
    const getAcceptMime = () => {
        switch(allowedType) {
            case 'image': return "image/*";
            case 'video': return "video/*";
            case 'audio': return "audio/*";
            case 'document': return ".pdf,.doc,.docx,.xls,.xlsx,.txt,.ppt,.pptx,.csv,.xml,.zip,.rar,.7z";
            default: return "*/*";
        }
    };

    // Gérer le clic sur un média
    const toggleSelection = (file) => {
        if (!multiple) {
            onSelect(file.url);
            onOpenChange(false);
            return;
        }
        setSelectedMedia(prev => {
            const exists = prev.find(m => m.id === file.id);
            return exists ? prev.filter(m => m.id !== file.id) : [...prev, file];
        });
    };

    const isFileSelected = (file) => {
        // 1. Vérifier la sélection manuelle en cours (Objet complet)
        if (selectedMedia.some(m => m.id === file.id)) return true;

        // 2. Vérifier la pré-sélection fournie par le parent (URL string ou Array)
        if (defaultSelected) {
            const defaults = Array.isArray(defaultSelected) ? defaultSelected : [defaultSelected];
            return defaults.includes(file.url);
        }
        return false;
    };

    // Validation de la sélection multiple
    const confirmSelection = () => {
        onSelect(selectedMedia.map(m => m.url)); // On renvoie un tableau d'URLs
        onOpenChange(false);
        setSelectedMedia([]);
    };   
    
    // On debounce la recherche pour ne pas spammer l'API à chaque frappe
    const debouncedSearch = useDebounce(search, 500); 

    // --- APPEL TANSTACK QUERY ---
    const { data: mediaData, isLoading, isError, isFetching } = useMediaLibrary({
        page,
        search: debouncedSearch,
        type: fileType,
        collection: collection
    });

    // Helper pour la pagination
    const files = mediaData?.data || [];
    const meta = mediaData?.meta;
    const dynamicCollections = meta?.collections || [];

    // --- HELPER POUR LES ICONES ---
    const getFileDetails = (file) => {
        const mime = file.mime_type || '';
        
        // Cas YouTube / Liens externes
        if (file.disk === 'youtube' || (file.url && file.url.includes('youtube.com'))) {
            return { icon: PlaySquare, color: 'text-red-600', bg: 'bg-red-50', label: 'YouTube' };
        }

        // Vidéo (MP4, WebM...)
        if (mime.startsWith('video/')) {
            return { icon: Film, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Vidéo' };
        }

        // Audio (MP3, WAV...)
        if (mime.startsWith('audio/')) {
            return { icon: FileMusic, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Audio' };
        }

        // PDF
        if (mime === 'application/pdf') {
            return { icon: FileText, color: 'text-red-500', bg: 'bg-red-50', label: 'PDF' };
        }

        // Excel / CSV
        if (mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('csv')) {
            return { icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50', label: 'Excel' };
        }

        // Word
        if (mime.includes('word') || mime.includes('document')) {
            return { icon: FileText, color: 'text-blue-700', bg: 'bg-blue-50', label: 'Word' };
        }

        // Défaut
        return { icon: FileIcon, color: 'text-zinc-500', bg: 'bg-zinc-50', label: file.extension?.toUpperCase() || 'Fichier' };
    };
    
    // --- 2. UPLOAD CLASSIQUE ---
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', allowedType);
        processUpload('/admin/media/upload', formData);
    };

    // --- 3. UPLOAD VIA URL ---
    const handleUrlUpload = async () => {
        if (!externalUrl) return;
        setLoading(true);
        const isYoutube = externalUrl.includes('youtube.com') || externalUrl.includes('youtu.be');
        const endpoint = isYoutube ? '/admin/media/upload-youtube' : '/admin/media/upload-url';

        try {
            const res = await axios.post(endpoint, { url: externalUrl });
            toast.success(__('media_added_success'));
            setExternalUrl("");
            setActiveTab("library");
            refetch();
        } catch (error) {
            toast.error(__('error_occurred'));
        } finally {
            setLoading(false);
        }
    };

    // --- 4. UNSPLASH ---
    const searchUnsplash = async (e) => {
        if (e) e.preventDefault();
        if (!unsplashQuery) return;

        setLoading(true);
        try {
            const res = await axios.get('/admin/media/unsplash/search', { 
                params: { query: unsplashQuery } 
            });

            const results = Array.isArray(res.data) ? res.data : (res.data.results || []);
            setUnsplashResults(results);
            
        } catch (error) {
            toast.error(__('unsplash_error'));
            setUnsplashResults([]); // On reset à un tableau vide en cas d'erreur
        } finally {
            setLoading(false);
        }
    };

    const saveUnsplash = async (imageUrl) => {
        // On envoie l'URL au backend pour qu'il la télécharge et la stocke localement
        processUpload('/admin/media/unsplash/save', { url: imageUrl });
    };

    // --- 5. AI GENERATION ---
    const generateAiImage = async () => {
        if (!aiPrompt) return;
        setLoading(true);
        setAiGeneratedImage(null);
        try {
            // Le backend appelle OpenAI et retourne une URL temporaire ou base64
            const res = await axios.post('/admin/media/ai/generate', { prompt: aiPrompt });
            setAiGeneratedImage(res.data.url); 
        } catch (error) {
            toast.error(__('generation_error'));
        } finally {
            setLoading(false);
        }
    };

    const saveAiImage = async () => {
        if (!aiGeneratedImage) return;
        processUpload('/admin/media/upload-url', { url: aiGeneratedImage });
    };

    // --- FONCTION GÉNÉRIQUE DE TRAITEMENT ---
    const processUpload = async (endpoint, payload) => {
        setLoading(true);
        try {
            const res = await axios.post(endpoint, payload);
            toast.success(__('media_added_success'));
            
            // Si on a un callback onSelect (ex: Settings page), on l'utilise
            if (onSelect) {
                onSelect(res.data.url);
                onOpenChange(false);
            } else {
                // Sinon on retourne à la bibliothèque
                setActiveTab("library");
                fetchFiles();
            }
        } catch (error) {
            toast.error(__('error_occurred'));
        } finally {
            setLoading(false);
            setExternalUrl("");
            setAiGeneratedImage(null);
            setAiPrompt("");
        }
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl h-[85vh] flex flex-col overflow-hidden p-0 gap-0 bg-white dark:bg-zinc-950">
                <DialogHeader className="px-6 py-4 shrink-0 border-b border-zinc-200 dark:border-zinc-800">
                    <DialogTitle>{__('media_manager')}</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden min-h-0">
                    <div className="px-6 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <TabsList className="bg-transparent p-0 gap-6">
                            <TabsTrigger value="library" className="capitalize cursor-pointer">{__('library')}</TabsTrigger>
                            <TabsTrigger value="upload" className="capitalize cursor-pointer">{__('upload')}</TabsTrigger>
                            <TabsTrigger value="url" className="capitalize cursor-pointer">{__('from_url')}</TabsTrigger>
                            <TabsTrigger value="unsplash" className="capitalize cursor-pointer">Unsplash</TabsTrigger>
                            <TabsTrigger value="ai" className="capitalize cursor-pointer">{__('generative_ai')}</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* === 1. BIBLIOTHÈQUE === */}
                    <TabsContent value="library" className="flex-1 flex flex-col p-0 m-0 min-h-0 data-[state=active]:flex-1">
                        {/* BARRE D'OUTILS (FILTRES) */}
                        <div className="shrink-0 p-4 border-b flex items-center gap-4 bg-zinc-50/50">
                            {/* ... Recherche ... */}
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input 
                                    placeholder={__('search_file')} 
                                    className="pl-9 bg-white" 
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }} // Reset page on search
                                />
                            </div>
                            {/* ... Sélecteur de Collection ... */}
                            <Select value={collection} onValueChange={(val) => { setCollection(val); setPage(1); }}>
                                <SelectTrigger className="w-[180px] bg-white">
                                    <div className="flex items-center gap-2">
                                        <Folder className="w-4 h-4 text-zinc-500"/>
                                        <SelectValue placeholder={__('collection')} />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{__('all_collections')}</SelectItem>
                                    
                                    {dynamicCollections.map((colName) => (
                                        <SelectItem key={colName} value={colName}>
                                            {colName.charAt(0).toUpperCase() + colName.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {/* ... Sélecteur de Type ... */}
                            <Select 
                                value={fileType} 
                                onValueChange={setFileType} 
                                disabled={allowedType !== 'all'}
                            >
                                <SelectTrigger className="w-[180px] bg-white capitalize">
                                    <SelectValue placeholder={__('type')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="capitalize">{__('all')}</SelectItem>
                                    <SelectItem value="image" className="capitalize">{__('images')}</SelectItem>
                                    <SelectItem value="document" className="capitalize">{__('documents')}</SelectItem>
                                    <SelectItem value="video" className="capitalize">{__('videos')}</SelectItem>
                                    <SelectItem value="audio" className="capitalize">{__('audio')}</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Indicateur de chargement discret (IsFetching) */}
                            {isFetching && !isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />}
                        </div>
                        {/* GRILLE DE RÉSULTATS */}
                        <ScrollArea className="flex-1 p-6 w-full h-full">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin" /></div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-10">
                                    {files.map((file) => {
                                        // Utilisation de la nouvelle fonction de vérification
                                        const selected = isFileSelected(file);
                                        
                                        return (
                                            <div 
                                                key={file.id} 
                                                onClick={() => toggleSelection(file)}
                                                className={`
                                                    group relative aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all
                                                    ${selected 
                                                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                                                        : 'border-zinc-200 hover:border-primary/50'
                                                    }
                                                `}
                                            >
                                                {/* CONTENU (Image ou Icône) */}
                                                {file.mime_type.startsWith('image/') ? (
                                                    <img 
                                                        src={file.thumbnail || file.url} 
                                                        alt={file.name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                                                        <FileText className="w-12 h-12 mb-2 text-zinc-300" />
                                                        <span className="text-xs truncate max-w-[90%] px-2 font-medium">{file.file_name}</span>
                                                        <span className="text-[10px] uppercase text-zinc-400 mt-1">{file.extension}</span>
                                                    </div>
                                                )}
                                                
                                                {/* OVERLAY CHECKMARK (Sorti du bloc image pour être visible partout) */}
                                                {selected && (
                                                    <div className="absolute top-2 right-2 z-10 bg-primary text-white rounded-full p-1.5 shadow-lg animate-in zoom-in-50 duration-200">
                                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                    </div>
                                                )}
                                                
                                                {/* INFO HOVER */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center pointer-events-none">
                                                    <span className="text-xs font-medium truncate w-full">{file.name}</span>
                                                    <span className="text-[10px] opacity-70">{(file.size / 1024).toFixed(1)} KB</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>

                        {/* PAGINATION FOOTER */}
                        {meta && meta.last_page > 1 && (
                            <div className="p-4 border-t bg-zinc-50 flex items-center justify-between text-sm shrink-0">
                                <span className="text-zinc-500">
                                    {__('page')} {meta.current_page} {__('of')} {meta.last_page}
                                </span>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" size="sm" 
                                        disabled={meta.current_page === 1}
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                    >
                                        {__('previous')}
                                    </Button>
                                    <Button 
                                        variant="outline" size="sm"
                                        disabled={meta.current_page === meta.last_page}
                                        onClick={() => setPage(p => p + 1)}
                                    >
                                        {__('next')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {multiple && (
                        <div className="p-4 border-t bg-zinc-50 flex items-center justify-between shrink-0">
                                <span className="text-sm font-medium">
                                    {selectedMedia.length} {__('items_selected')}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => setSelectedMedia([])}>
                                        {__('cancel')}
                                    </Button>
                                    <Button onClick={confirmSelection} disabled={selectedMedia.length === 0}>
                                        {__('insert_selection')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* === 2. UPLOAD LOCAL === */}
                    <TabsContent value="upload" className="flex-1 flex flex-col items-center justify-center p-10 m-0 min-h-0 data-[state=active]:flex-1">
                        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-10 text-center w-full max-w-4xl bg-zinc-50 dark:bg-zinc-900/50 relative hover:bg-zinc-100 transition">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple={multiple} onChange={handleFileUpload} accept={getAcceptMime()} disabled={loading} />
                            <div className="flex flex-col items-center gap-2">
                                {loading ? <Loader2 className="h-10 w-10 animate-spin text-primary" /> : <UploadCloud className="h-10 w-10 text-zinc-400" />}
                                <h3 className="font-semibold">{__('drop_file_here')}</h3>
                            </div>
                        </div>
                    </TabsContent>

                    {/* === 3. URL EXTERNE === */}
                    <TabsContent value="url" className="flex-1 flex flex-col items-center justify-center p-10 m-0 space-y-4 min-h-0 data-[state=active]:flex-1">
                         <div className="w-full max-w-md space-y-4 text-center">
                            <h3 className="font-medium">Importer depuis une URL ou YouTube</h3>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="https://site.com/image.jpg ou https://youtube.com/watch?v=..." 
                                    value={externalUrl} 
                                    onChange={e => setExternalUrl(e.target.value)} 
                                />
                                <Button onClick={handleUrlUpload} disabled={loading || !externalUrl}>
                                    {loading ? <Loader2 className="animate-spin w-4 h-4"/> : <Download className="w-4 h-4"/>}
                                </Button>
                            </div>
                            <p className="text-xs text-zinc-500">
                                Les liens YouTube seront stockés comme référence, les autres fichiers seront téléchargés.
                            </p>
                        </div>
                    </TabsContent>

                    {/* === 4. UNSPLASH === */}
                    <TabsContent value="unsplash" className="flex-1 p-0 m-0 flex flex-col min-h-0 data-[state=active]:flex-1">
                        <div className="p-4 border-b flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input className="pl-9" placeholder={__('search_unsplash')} value={unsplashQuery} onChange={e => setUnsplashQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchUnsplash(e)} />
                            </div>
                            <Button className="cursor-pointer" onClick={searchUnsplash} disabled={loading}>{__('search')}</Button>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="columns-2 md:columns-4 gap-4 space-y-4">
                                {Array.isArray(unsplashResults) && unsplashResults.length > 0 ? (
                                            unsplashResults.map((img) => (
                                                <div 
                                                    key={img.id} 
                                                    className="break-inside-avoid relative group rounded-lg overflow-hidden cursor-pointer" 
                                                    onClick={() => saveUnsplash(img.urls.regular)}
                                                >
                                                    <img src={img.urls.small} className="w-full h-auto" loading="lazy" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs">
                                                        {__('import')}
                                                    </div>
                                                </div>
                                            ))
                                        ) : !loading && (
                                            <div className="text-center py-20 text-zinc-500 col-span-full">
                                                {__('no_results_search')}
                                            </div>
                                        )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    {/* === 5. AI GENERATION === */}
                    <TabsContent value="ai" className="flex-1 flex flex-col p-6 gap-6 min-h-0 data-[state=active]:flex-1">
                        <div className="flex gap-4 items-start max-w-3xl mx-auto w-full">
                            <div className="flex-1 space-y-2">
                                <Label>{__('describe_image')}</Label>
                                <Input placeholder="Un chat astronaute sur la lune, style cyberpunk..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} />
                            </div>
                            <Button className="mt-5 cursor-pointer" onClick={generateAiImage} disabled={loading || !aiPrompt}>
                                <Sparkles className="mr-2 h-4 w-4" /> {__('generate')}
                            </Button>
                        </div>
                        <div className="max-w-3xl m-auto w-full">
                            <div className="h-96 flex-1 flex items-center justify-center bg-zinc-50/50 rounded-xl border-2 border-dashed">
                                {loading ? (
                                    <div className="text-center space-y-2">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500" />
                                        <p className="text-sm text-zinc-500">{__('ai_creating')}</p>
                                    </div>
                                ) : aiGeneratedImage ? (
                                    <div className="relative group max-h-[400px] p-4">
                                        <img src={aiGeneratedImage} className="max-h-[400px] rounded-lg shadow-lg" />
                                        <div className="absolute bottom-8 right-8 flex gap-2">
                                            <Button onClick={saveAiImage}>
                                                <Check className="mr-2 h-4 w-4" /> {__('save')}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    
                                    <div className="text-center text-zinc-400">
                                        <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                        <p>{__('generated_image_placeholder')}</p>
                                    </div>
                                )}
                            </div>                            
                        </div>

                    </TabsContent>

                </Tabs>
            </DialogContent>
        </Dialog>
    );
}