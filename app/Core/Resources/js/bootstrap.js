import axios from 'axios';

/**
 * 1. Configuration d'Axios
 * On attache Axios à l'objet window pour qu'il soit accessible 
 * partout (même dans des scripts inline si nécessaire).
 */
window.axios = axios;

// Configuration des headers par défaut pour Laravel
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * 2. Gestion automatique du jeton CSRF
 * Laravel a besoin de ce jeton pour valider les requêtes POST/PUT/DELETE.
 * On le récupère depuis la balise <meta> générée dans votre layout Blade.
 */
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * 3. Intercepteurs Axios (Optionnel mais recommandé)
 * Utile pour gérer globalement les erreurs 401 (Session expirée) 
 * ou 419 (Page expirée / CSRF invalide).
 */
window.axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && [401, 419].includes(error.response.status)) {
            // Rediriger vers la page de login si la session expire
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

/**
 * 4. Laravel Echo (Temps Réel)
 * Décommentez si vous utilisez Pusher ou Reverb pour vos notifications React.
 */
/*
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
*/