import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { __ } from '@/common/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@ui/alert-dialog";
import { Button } from "@ui/button";
import { Loader2, Sparkles, ChevronDown, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { useMediaSelection } from '../hooks/useMediaSelection';
import { MediaToolbar } from './MediaToolbar';
import { MediaGrid } from './MediaGrid';
import { MediaItem } from './MediaItem';
import { MediaPreview } from './MediaPreview';
import { BatchActionBar } from './BatchActionBar';
import { MediaUploadTab } from './tabs/MediaUploadTab';
import { MediaUnsplashTab } from './tabs/MediaUnsplashTab';
import { MediaAIGeneratorTab } from './tabs/MediaAIGeneratorTab';


export default function MediaLibraryModal({ open, onOpenChange, onSelect, multiple = false, defaultSelected = null, allowedType = 'all' }) {
    const queryClient = useQueryClient();
    
    // --- ÉTATS ---
    const [activeTab, setActiveTab] = useState("library");
    const [previewMedia, setPreviewMedia] = useState(null);
    const [idToDelete, setIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [allMedias, setAllMedias] = useState([]);
    
    const [filters, setFilters] = useState({ 
        page: 1, 
        search: "", 
        type: allowedType, 
        collection: "all",
        trashed: false
    });

    // --- DONNÉES ---
    const { data: mediaData, isLoading, isFetching } = useMediaLibrary(filters);
    const { selectedMedia, isFileSelected, toggleSelection, clearSelection } = useMediaSelection(multiple, onSelect, onOpenChange, defaultSelected);

    // --- LOGIQUE LOAD MORE ---
    useEffect(() => {
        if (mediaData?.data) {
            setAllMedias(prev => filters.page === 1 ? mediaData.data : [...prev, ...mediaData.data]);
        }
    }, [mediaData, filters.page, filters.search, filters.trashed]);

    //Raccourci clavier "Suppr"
    useEffect(() => {
        const handleKeyDown = (e) => {
            // On vérifie si :
            // 1. La touche est Suppr ou Retour arrière
            // 2. Il y a des médias sélectionnés
            // 3. On n'est pas déjà en train de supprimer (pour éviter les doublons)
            // 4. L'utilisateur n'est pas en train de taper dans un champ de saisie (input/textarea)
            const isTyping = document.activeElement.tagName === 'INPUT' || 
                            document.activeElement.tagName === 'TEXTAREA';

            if ((e.key === 'Delete' || e.key === 'Backspace') && 
                selectedMedia.length > 0 && 
                !idToDelete && 
                !isTyping) {
                e.preventDefault();
                setIdToDelete('batch'); // Ouvre l'AlertDialog de suppression multiple
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedMedia, idToDelete]);

    // --- ACTIONS ---
    //Load More
    const handleLoadMore = () => setFilters(prev => ({ ...prev, page: prev.page + 1 }));

    //Restore
    const handleRestore = async (uuid) => {
        try {
            await axios.put(`/admin/media/${uuid}/restore`);
            toast.success(__('Média restauré'));
            queryClient.invalidateQueries(['media-library']);
        } catch (error) { toast.error(__('Erreur restauration')); }
    };

    //Delete
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const isTrashedMode = filters.trashed;
            const endpoint = isTrashedMode ? '/admin/media/force-delete' : '/admin/media/batch-delete';
            const ids = idToDelete === 'batch' ? selectedMedia.map(m => m.id) : [idToDelete];

            await axios.post(endpoint, { ids });
            
            toast.success(isTrashedMode ? __('Effacé définitivement') : __('Mis en corbeille'));
            queryClient.invalidateQueries(['media-library']);
            setIdToDelete(null);
            clearSelection();
        } catch (error) { toast.error(__('Erreur suppression')); }
        finally { setIsDeleting(false); }
    };

    //Refresh 
    const refreshLibrary = () => {
        queryClient.invalidateQueries(['media-library']);
        setActiveTab("library");
    };
    
    return (
        <>
            {/* 1. DIALOG PRINCIPAL */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-7xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-950">
                    
                    <DialogHeader className="px-6 py-4 border-b shrink-0">
                        <DialogTitle>{__('media_manager')}</DialogTitle>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        
                        {/* Navigation des Onglets */}
                        <div className="px-6 border-b bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                            <TabsList className="bg-transparent h-12 gap-6">
                                <TabsTrigger value="library" className="capitalize cursor-pointer">
                                    {__('library')}
                                </TabsTrigger>
                                <TabsTrigger value="upload" className="capitalize cursor-pointer">
                                    {__('upload')}
                                </TabsTrigger>
                                {(allowedType === 'all' || allowedType === 'image') && (
                                    <>
                                        <TabsTrigger value="unsplash" className="capitalize cursor-pointer">
                                            {__('Unsplash')}
                                        </TabsTrigger>
                                        <TabsTrigger value="ai" className="gap-2 capitalize cursor-pointer">
                                            <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                                            {__('AI_Generate')}
                                        </TabsTrigger>
                                    </>
                                )}
                            </TabsList>
                        </div>

                        {/* CONTENU : BIBLIOTHÈQUE */}
                       <TabsContent value="library" className="flex-1 flex flex-col min-h-0 relative">
                            <MediaToolbar filters={filters} setFilters={setFilters} isFetching={isFetching} />

                            <MediaGrid isLoading={isLoading && filters.page === 1}>
                                {allMedias.map((file) => (
                                    <MediaItem 
                                        key={file.id} 
                                        file={file} 
                                        isSelected={isFileSelected(file)}
                                        onToggle={toggleSelection}
                                        onPreview={setPreviewMedia}
                                        onDelete={setIdToDelete}
                                        isTrashedMode={filters.trashed}
                                        onRestore={handleRestore}
                                    />
                                ))}
                            </MediaGrid>

                            {/* BOUTON LOAD MORE */}
                            {mediaData?.meta?.current_page < mediaData?.meta?.last_page && (
                                <div className="p-4 border-t text-center">
                                    <Button variant="ghost" onClick={handleLoadMore} disabled={isFetching}>
                                        {isFetching ? <Loader2 className="animate-spin mr-2" /> : <ChevronDown className="mr-2" />}
                                        {__('Load More')}
                                    </Button>
                                </div>
                            )}

                            <BatchActionBar count={selectedMedia.length} onClear={clearSelection} onDelete={() => setIdToDelete('batch')} />
                        </TabsContent>

                        {/* CONTENU : AUTRES ONGLETS */}
                        <TabsContent value="upload" className="flex-1 flex flex-col min-h-0 data-[state=active]:flex">
                            <MediaUploadTab allowedType={allowedType} onUploadSuccess={refreshLibrary} />
                        </TabsContent>

                        <TabsContent value="unsplash" className="flex-1 flex flex-col min-h-0 data-[state=active]:flex">
                            <MediaUnsplashTab onImportSuccess={refreshLibrary} />
                        </TabsContent>

                        <TabsContent value="ai" className="flex-1 flex flex-col min-h-0 data-[state=active]:flex">
                            <MediaAIGeneratorTab onGenerationSuccess={refreshLibrary} />
                        </TabsContent>

                    </Tabs>
                </DialogContent>
            </Dialog>

            <MediaPreview 
                media={previewMedia} 
                onClose={() => setPreviewMedia(null)} 
                onSelect={(url) => {
                    setPreviewMedia(null);
                    onSelect(url);
                    onOpenChange(false);
                }}
                onDelete={(id) => setIdToDelete(id)}
            />

            {/* ALERT DIALOG DYNAMIQUE */}
            <AlertDialog open={!!idToDelete} onOpenChange={() => !isDeleting && setIdToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{filters.trashed ? __('Supprimer définitivement ?') : __('Mettre en corbeille ?')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {filters.trashed ? __('Action irréversible.') : __('Vous pourrez le restaurer plus tard.')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>{__('Cancel')}</AlertDialogCancel>
                        <Button variant="destructive" disabled={isDeleting} onClick={handleConfirmDelete}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {__('Confirm')}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}