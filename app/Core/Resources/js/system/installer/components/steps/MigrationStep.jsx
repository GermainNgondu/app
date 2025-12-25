import React, { useEffect, useState } from 'react';
import { __ } from '@/common/lib/i18n';
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
                setErrorMessage(err.response?.data?.message || __('unknown_migration_error'));
            }
        };
        runMigration();
    }, []);

    if (status === 'error') {
        return (
            <div className="text-center space-y-4">
                <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-600 font-bold">{__('migration_error')}</p>
                <p className="text-sm text-zinc-600">{errorMessage}</p>
                <Button className="cursor-pointer" onClick={() => window.location.reload()}>{__('retry')}</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            {status === 'processing' ? (
                <>
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-lg font-medium">{__('creating_database')}</p>
                    <p className="text-sm text-zinc-500">{__('takes_moments')}</p>
                </>
            ) : (
                <div className="text-center space-y-2">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-red-600 font-bold">{__('migration_error')}</p>
                    <p className="text-sm text-zinc-500">{__('check_db_credentials')}</p>
                </div>
            )}
        </div>
    );
}