<?php

namespace App\Core\Support\Helpers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;

class TranslationHelper
{
    public static function getJsonTranslations(): string
    {
        $locale = app()->getLocale();
        
        // 1. Traductions par défaut de Laravel (racine /lang)
        // Cela permet de garder les messages d'erreur standard (validation, etc.)
        $defaultPath = lang_path("{$locale}.json");
        $defaultTranslations = [];
        
        if (File::exists($defaultPath)) {
            $defaultTranslations = json_decode(File::get($defaultPath), true) ?? [];
        }

        // 2. Traductions centralisées du Core (app/Core/Resources/lang)
        $corePath = app_path("Core/Resources/lang/{$locale}.json");
        $coreTranslations = [];

        if (File::exists($corePath)) {
            $coreTranslations = json_decode(File::get($corePath), true) ?? [];
        }

        // 3. Fusion : Le Core écrase les valeurs par défaut si elles existent en double
        $merged = array_merge($defaultTranslations, $coreTranslations);

        return json_encode($merged);
    }

    /**
     * Récupère la liste dynamique des langues disponibles sur le disque
     */
    public static function getAvailableLocales(): array
    {
        // On cache le résultat pour éviter de scanner le disque à chaque requête
        // Le cache est vidé si on vide le cache global de l'app (php artisan cache:clear)
        return Cache::remember('app_locales', 3600 * 24, function () {
            
            $locales = [];
            
            // 1. Définir les chemins à scanner
            $paths = [
                lang_path(), // /lang (Laravel default)
                app_path('Core/Resources/lang') // /app/Core/... (Votre Core)
            ];

            foreach ($paths as $path) {
                if (!File::exists($path)) continue;

                // Scanner les fichiers JSON (ex: fr.json)
                $files = File::files($path);
                foreach ($files as $file) {
                    if ($file->getExtension() === 'json') {
                        $locales[] = $file->getFilenameWithoutExtension();
                    }
                }

                // Scanner les dossiers (ex: fr/)
                $directories = File::directories($path);
                foreach ($directories as $dir) {
                    $locales[] = basename($dir);
                }
            }

            // 2. Nettoyage (doublons et validation)
            $uniqueLocales = array_unique($locales);
            $formattedLocales = [];

            foreach ($uniqueLocales as $code) {
                // On ignore les dossiers techniques ou cachés
                if ($code === 'vendor' || str_starts_with($code, '.')) continue;

                $details = self::getLanguageDetails($code);
                
                $formattedLocales[] = [
                    'code' => $code,
                    'label' => $details['name'],
                    'flag' => $details['flag']
                ];
            }

            return $formattedLocales;
        });
    }

    /**
     * Retourne les métadonnées pour un code langue donné
     */
    private static function getLanguageDetails(string $code): array
    {
        // Une map statique pour embellir l'affichage
        // Vous pouvez enrichir cette liste au fil du temps
        $map = [
            'fr' => ['name' => 'Français', 'flag' => '🇫🇷'],
            'en' => ['name' => 'English',  'flag' => '🇺🇸'],
            'es' => ['name' => 'Español',  'flag' => '🇪🇸'],
            'de' => ['name' => 'Deutsch',  'flag' => '🇩🇪'],
            'it' => ['name' => 'Italiano', 'flag' => '🇮🇹'],
            'pt' => ['name' => 'Português','flag' => '🇵🇹'],
            'ru' => ['name' => 'Русский',  'flag' => '🇷🇺'],
            'zh' => ['name' => '中文',      'flag' => '🇨🇳'],
        ];

        return $map[$code] ?? [
            'name' => strtoupper($code), // Fallback si inconnu (ex: FR)
            'flag' => '🌍'
        ];
    }
}