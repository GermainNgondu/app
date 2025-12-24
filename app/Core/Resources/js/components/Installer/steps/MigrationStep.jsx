import React, { useEffect, useState } from 'react';
import { __ } from '@/lib/i18n';
import { Loader2, Database } from "lucide-react";

export default function MigrationStep({ onNext }) {
    const [status, setStatus] = useState('processing'); 
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const runMigration = async () => {
            try {
                const response = await axios.post('/install/migrate');
                if (response.data.status === 'success') {
                    // On ne passe à la suite QUE si le serveur confirme le succès
                    setTimeout(onNext, 1500);
                } else {
                    throw new Error(response.data.message);
                }
            } catch (err) {
                setStatus('error');
                setErrorMessage(err.response?.data?.message || __('Erreur inconnue lors de la migration.'));
            }
        };
        runMigration();
    }, []);

    if (status === 'error') {
        return (
            <div className="text-center space-y-4">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-600 font-bold">{__('Erreur de migration')}</p>
                <p className="text-sm text-zinc-600">{errorMessage}</p>
                <Button className="cursor-pointer" onClick={() => window.location.reload()}>{__('Réessayer')}</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            {status === 'processing' ? (
                <>
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-lg font-medium">{__('Création de la base de données...')}</p>
                    <p className="text-sm text-zinc-500">{__('Cela peut prendre quelques instants.')}</p>
                </>
            ) : (
                <div className="text-center space-y-2">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-red-600 font-bold">{__('Erreur de migration')}</p>
                    <p className="text-sm text-zinc-500">{__('Vérifiez vos identifiants de base de données.')}</p>
                </div>
            )}
        </div>
    );
}