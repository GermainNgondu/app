import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, UploadCloud, FileArchive, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { __ } from '@/common/lib/i18n';
import { useUpdater } from '../hooks/useUpdater';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@ui/card";
import { Button } from "@ui/button";
import { Progress } from "@ui/progress";
import { Alert, AlertDescription } from "@ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";

export default function UpdaterPage() {
    const { 
        status, updateInfo, progress, error, 
        checkForUpdate, startAutoUpdate, startManualUpdate 
    } = useUpdater();

    const [file, setFile] = useState(null);

    useEffect(() => { checkForUpdate(); }, [checkForUpdate]);

    if (['downloading', 'uploading', 'installing'].includes(status)) {
        return (
            <div className="max-w-xl mx-auto py-32 text-center space-y-6">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                <h2 className="text-2xl font-bold">
                    {status === 'installing' ? __('Installation et sauvegarde...') : __('Traitement des fichiers...')}
                </h2>
                <div className="space-y-2">
                    <Progress value={progress} className="h-2 w-64 mx-auto" />
                    <p className="text-sm text-zinc-500">{progress}%</p>
                </div>
                <p className="text-amber-600 text-sm font-medium">{__('Ne fermez pas cette fenêtre.')}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RefreshCw className={status === 'checking' ? 'animate-spin' : ''} />
                        {__('Mise à jour du système')}
                    </CardTitle>
                    <CardDescription>Version v{window.appConfig?.version}</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {status === 'success' ? (
                        <div className="py-10 text-center space-y-4">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h3 className="text-xl font-bold">{__('Système mis à jour !')}</h3>
                            <p>{__('Redémarrage en cours...')}</p>
                        </div>
                    ) : (
                        <Tabs defaultValue="auto">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="auto">{__('Automatique')}</TabsTrigger>
                                <TabsTrigger value="manual">{__('Manuelle')}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="auto">
                                {status === 'uptodate' ? (
                                    <p className="text-center py-10 text-zinc-500">{__('Vous utilisez la dernière version.')}</p>
                                ) : updateInfo && (
                                    <div className="p-4 bg-zinc-50 rounded-lg border">
                                        <h4 className="font-bold text-lg mb-2">v{updateInfo.new_version}</h4>
                                        <p className="text-sm mb-6">{updateInfo.description}</p>
                                        <Button onClick={startAutoUpdate} className="w-full">
                                            <Download className="mr-2 h-4 w-4" /> {__('Lancer la mise à jour')}
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="manual" className="space-y-4">
                                <div 
                                    className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:bg-zinc-50"
                                    onClick={() => document.getElementById('manual-zip').click()}
                                >
                                    <input 
                                        type="file" id="manual-zip" hidden accept=".zip" 
                                        onChange={(e) => setFile(e.target.files[0])} 
                                    />
                                    <UploadCloud className="mx-auto h-10 w-10 text-zinc-400 mb-2" />
                                    <p>{file ? file.name : __('Sélectionnez le fichier update.zip')}</p>
                                </div>
                                <Button 
                                    className="w-full" disabled={!file} 
                                    onClick={() => startManualUpdate(file)}
                                >
                                    <FileArchive className="mr-2 h-4 w-4" /> {__('Installer le ZIP')}
                                </Button>
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}