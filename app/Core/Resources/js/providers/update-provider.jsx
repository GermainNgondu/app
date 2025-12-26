import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UpdateProviderContext = createContext(null);

export function UpdateProvider({ children }) {
    const [hasUpdate, setHasUpdate] = useState(false);
    const [updateData, setUpdateData] = useState(null);

    const checkUpdates = async () => {
        try {
            const res = await axios.get('/api/admin/system/update/check');
            if (res.data.update_available) {
                setHasUpdate(true);
                setUpdateData(res.data);
            }
        } catch (error) {
            console.error("Échec de la vérification des mises à jour automatique.");
        }
    };

    useEffect(() => {
        // On vérifie les mises à jour au montage du layout admin
        checkUpdates();
    }, []);

    return (
        <UpdateProviderContext.Provider value={{ hasUpdate, updateData }}>
            {children}
        </UpdateProviderContext.Provider>
    );
}

export const useUpdateStatus = () => useContext(UpdateProviderContext);