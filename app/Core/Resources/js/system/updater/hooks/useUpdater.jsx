import { useState, useCallback } from 'react';
import axios from 'axios';
import { __ } from '@/common/lib/i18n';

export function useUpdater() {
    const [status, setStatus] = useState('idle'); // idle, checking, available, downloading, uploading, installing, success, error, uptodate
    const [updateInfo, setUpdateInfo] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    // --- 1. Vérifier les mises à jour ---
    const checkForUpdate = useCallback(async () => {
        setStatus('checking');
        setError(null);
        try {
            const res = await axios.get('/api/admin/system/update/check');
            if (res.data.update_available) {
                setUpdateInfo(res.data);
                setStatus('available');
            } else {
                setStatus('uptodate');
            }
        } catch (err) {
            setError(__('Impossible de joindre le serveur de mise à jour.'));
            setStatus('error');
        }
    }, []);

    // --- 2. Lancer l'installation (Privé, appelé après download ou upload) ---
    const runInstall = async () => {
        setStatus('installing');
        setProgress(70);
        try {
            await axios.post('/api/admin/system/update/install');
            setProgress(100);
            setStatus('success');
        } catch (err) {
            // Le backend gère le rollback, on affiche juste l'erreur
            setError(err.response?.data?.message || __('L\'installation a échoué. Le système a tenté une restauration.'));
            setStatus('error');
        }
    };

    // --- 3. Flux Automatique (Download -> Install) ---
    const startAutoUpdate = async () => {
        if (!updateInfo?.download_url) return;
        
        setStatus('downloading');
        setProgress(20);
        try {
            await axios.post('/api/admin/system/update/download', { url: updateInfo.download_url });
            setProgress(50);
            await runInstall();
        } catch (err) {
            setError(__('Échec du téléchargement du package.'));
            setStatus('error');
        }
    };

    // --- 4. Flux Manuel (Upload -> Install) ---
    const startManualUpdate = async (file) => {
        if (!file) return;

        setStatus('uploading');
        setProgress(10);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/api/admin/system/update/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 40) / progressEvent.total);
                    setProgress(percentCompleted); // On grimpe jusqu'à 40% pour l'upload
                }
            });
            setProgress(50);
            await runInstall();
        } catch (err) {
            setError(__('Erreur lors du téléversement du fichier ZIP.'));
            setStatus('error');
        }
    };

    return {
        status,
        updateInfo,
        progress,
        error,
        checkForUpdate,
        startAutoUpdate,
        startManualUpdate,
        resetError: () => setError(null)
    };
}