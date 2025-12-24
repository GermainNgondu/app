<?php

namespace App\Core\System\Installer\Actions;

use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class FinalizeInstallationAction
{
    use AsAction;

    public function handle(): void
    {
        // 1. Générer la clé d'application si nécessaire
        Artisan::call('key:generate', ['--force' => true]);

        // 2. Créer le fichier indicateur d'installation
        File::put(storage_path('installed'), date('Y-m-d H:i:s'));

        // 3. Vider tous les caches pour être propre
        Artisan::call('config:cache');
        Artisan::call('route:cache');
    }

    public function asController()
    {
        $this->handle();
        return response()->json(['status' => 'installed']);
    }
}