<?php

namespace App\Core\System\Features\Actions;

use App\Core\System\Features\Models\Feature;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Lorisleiva\Actions\Concerns\AsAction;

class InstallFeatureAction
{
    use AsAction;

    public function handle(string $name, string $displayName): Feature
    {
        $featurePath = "app/Features/" . ucfirst($name);

        // 1. Exécuter les migrations de la feature si elles existent
        $migrationPath = "{$featurePath}/Database/Migrations";
        if (File::isDirectory(base_path($migrationPath))) {
            Artisan::call('migrate', [
                '--path' => $migrationPath,
                '--force' => true,
            ]);
        }

        // 2. Créer ou mettre à jour l'entrée en BDD
        $feature = Feature::updateOrCreate(
            ['name' => strtolower($name)],
            [
                'display_name' => $displayName,
                'installed_at' => now(),
                'is_active' => true,
            ]
        );

        // 3. Vider le cache des features pour que le changement soit immédiat
        app(\App\Core\System\Features\FeatureManager::class)->clearCache();

        return $feature;
    }
}