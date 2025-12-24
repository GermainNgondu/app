import React from 'react';
import { SettingsGeneralTab } from '../tabs/SettingsGeneralTab';
import { SettingsFeaturesTab } from '../tabs/SettingsFeaturesTab'; // À créer ou placeholder
import { __ } from '@/lib/i18n';

export function useSettingsTabs(formData, setFormData, metaData) {
    // Liste de base des onglets
    const tabs = [
        {
            id: 'general',
            label: __('Général'),
            icon: 'Settings',
            // On passe le composant qui rendra le contenu
            component: (
                <SettingsGeneralTab 
                    data={formData} 
                    setData={setFormData} 
                    locales={metaData?.locales || []}
                    timezones={metaData?.timezones || []}
                />
            )
        },
        {
            id: 'features',
            label: __('Fonctionnalités'),
            icon: 'Cpu', // Icône Lucide
            component: <SettingsFeaturesTab data={formData} setData={setFormData} />
        }
    ];

    /**
     * ICI : Point d'extension futur.
     * Tu pourrais utiliser un Context ou un Window Event pour laisser d'autres
     * modules ajouter des tabs dans ce tableau avant de le retourner.
     */

    return tabs;
}