// app/Core/Resources/js/system/media/components/MediaAIGeneratorTab.jsx
import React, { useState } from 'react';
import { Sparkles, Loader2, Save, Wand2 } from "lucide-react";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { __ } from '@/common/lib/i18n';
import axios from 'axios';
import { toast } from "sonner";

export const MediaAIGeneratorTab = ({ onGenerationSuccess }) => {
    const [prompt, setPrompt] = useState("");
    const [size, setSize] = useState("1024x1024");
    const [loading, setLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt) return;

        setLoading(true);
        setGeneratedUrl(null);
        try {
            // Appel vers votre endpoint backend qui communique avec DALL-E ou Replicate
            const res = await axios.post('/admin/media/ai/generate', { prompt, size });
            setGeneratedUrl(res.data.url);
            toast.success(__('Image générée avec succès !'));
        } catch (error) {
            toast.error(__('Erreur lors de la génération par l\'IA'));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToLibrary = async () => {
        setIsSaving(true);
        try {
            await axios.post('/admin/media/upload-url', { 
                url: generatedUrl,
                name: prompt.substring(0, 30) + ' (AI)'
            });
            toast.success(__('Image enregistrée dans votre bibliothèque'));
            onGenerationSuccess(); // Retour à la bibliothèque
        } catch (error) {
            toast.error(__('Erreur d\'enregistrement'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* Formulaire à gauche */}
            <div className="w-full md:w-1/3 p-6 border-r border-zinc-200 dark:border-zinc-800 space-y-6 overflow-y-auto">
                <div className="space-y-2">
                    <h3 className="font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-zinc-500" />
                        {__('Générateur d\'images IA')}
                    </h3>
                    <p className="text-xs text-zinc-500">
                        {__('Décrivez l\'image que vous souhaitez créer. L\'IA s\'occupe du reste.')}
                    </p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-zinc-400">{__('Votre Prompt')}</label>
                        <textarea 
                            className="w-full min-h-[120px] p-3 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:ring-2 focus:ring-primary outline-none resize-none"
                            placeholder={__('Ex: Un astronaute faisant du cheval sur Mars, style numérique, haute résolution...')}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-zinc-400">{__('Format')}</label>
                        <Select value={size} onValueChange={setSize}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1024x1024">{__('Carré (1:1)')}</SelectItem>
                                <SelectItem value="1024x1792">{__('Portrait (9:16)')}</SelectItem>
                                <SelectItem value="1792x1024">{__('Paysage (16:9)')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-zinc-600 to-blue-600 hover:from-zinc-700 hover:to-blue-700 text-white border-none shadow-lg"
                        disabled={loading || !prompt}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2 w-4 h-4" />}
                        {loading ? __('Génération en cours...') : __('Générer l\'image')}
                    </Button>
                </form>
            </div>

            {/* Aperçu à droite */}
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center p-8">
                {generatedUrl ? (
                    <div className="space-y-6 w-full max-w-lg animate-in zoom-in-95 duration-300">
                        <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
                            <img src={generatedUrl} className="w-full h-full object-cover" alt="AI Generated" />
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setGeneratedUrl(null)}>
                                {__('Recommencer')}
                            </Button>
                            <Button className="flex-1" onClick={handleSaveToLibrary} disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                                {__('Enregistrer dans la bibliothèque')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-4 opacity-30">
                        <Sparkles className="w-20 h-20 mx-auto" />
                        <p className="text-sm font-medium">{__('L\'image générée apparaîtra ici')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};