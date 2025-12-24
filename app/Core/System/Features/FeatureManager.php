<?php

namespace App\Core\System\Features;

use App\Core\System\Features\Models\Feature;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class FeatureManager
{
    protected const CACHE_KEY = 'system_active_features';

    /**
     * Liste des dossiers présents dans app/Features
     */
    public function getAvailableFolders(): array
    {
        return collect(File::directories(app_path('Features')))
            ->map(fn($path) => basename($path))
            ->toArray();
    }

    /**
     * Récupère les features actives (optimisé via Cache)
     */
    public function getActiveFeatures()
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return Feature::where('is_active', true)->get();
        });
    }

    public function isActive(string $name): bool
    {
        return $this->getActiveFeatures()->contains('name', strtolower($name));
    }

    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}