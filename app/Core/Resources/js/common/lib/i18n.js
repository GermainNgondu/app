import axios from 'axios';

// On initialise window.translations à vide pour éviter les erreurs "undefined" avant chargement
window.translations = window.translations || {};

/**
 * Charge les traductions (Cache First, Network Second)
 */
export async function loadTranslations(locale) {
    const storageKey = `translations_${locale}`;
    const versionKey = `translations_version`;
    const currentVersion = window.appConfig?.version || '1.0.0';

    // 1. Vérification du cache et de la version
    const cachedData = localStorage.getItem(storageKey);
    const cachedVersion = localStorage.getItem(versionKey);

    if (cachedData && cachedVersion === currentVersion) {
        // Cache valide : on utilise
        window.translations = JSON.parse(cachedData);
        return;
    }

    // 2. Cache invalide ou absent : Appel Réseau
    try {
        const response = await axios.get(`/api/lang/${locale}`);
        window.translations = response.data;

        // Mise en cache pour la prochaine fois
        localStorage.setItem(storageKey, JSON.stringify(window.translations));
        localStorage.setItem(versionKey, currentVersion);
        
        console.log(`[i18n] Traductions chargées et mises en cache (${locale} v${currentVersion})`);
    } catch (error) {
        console.error("Erreur lors du chargement des traductions", error);
    }
}

/**
 * Récupère la liste des langues disponibles (avec cache)
 * Usage: const locales = await getAvailableLocales();
 */
export async function getAvailableLocales() {
    const cacheKey = 'app_available_locales';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    try {
        // On suppose que vous avez créé une route générique api ou utilisez celle de l'installeur
        // Vous pouvez adapter l'URL selon vos routes (ex: /api/locales ou /install/locales)
        const response = await axios.get('/install/locales'); 
        
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error("Impossible de charger la liste des langues", error);
        return [];
    }
}

// Fonction Helper existante
export function __(key, replace = {}) {
    let translation = window.translations[key] || key;

    Object.keys(replace).forEach(r => {
        translation = translation.replace(`:${r}`, replace[r]);
    });

    return translation;
}