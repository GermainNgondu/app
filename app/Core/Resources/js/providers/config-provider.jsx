import React, { createContext, useContext } from 'react';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
    // On récupère les données injectées par Blade
    const config = window.appConfig || { name: 'QuickApp', version: '1.0.0' };

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

// Hook personnalisé pour utiliser la config partout
export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig doit être utilisé dans un ConfigProvider");
    }
    return context;
};