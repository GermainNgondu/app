<?php

namespace App\Core\System\Features\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeFeatureCommand extends Command
{
    // Utilisation : php artisan make:feature Blog
    protected $signature = 'make:feature {name}';
    protected $description = 'Crée une nouvelle feature avec sa structure standard';

    public function handle()
    {
        $name = ucfirst($this->argument('name'));
        $path = app_path("Features/{$name}");

        if (File::exists($path)) {
            $this->error("La feature {$name} existe déjà !");
            return;
        }

        // 1. Création de l'arborescence
        $directories = [
            $path . '/Providers',
            $path . '/Database/Migrations',
            $path . '/Resources/js/components',
            $path . '/Infrastructure/Routes',
        ];

        foreach ($directories as $dir) {
            File::makeDirectory($dir, 0755, true);
        }

        // 2. Génération du ServiceProvider
        $this->generateServiceProvider($name, $path);

        $this->info("Feature {$name} créée avec succès dans app/Features/{$name}");
        $this->warn("N'oubliez pas d'activer la feature dans la table 'features' pour qu'elle soit chargée.");
    }

    protected function generateServiceProvider($name, $path)
    {
        $stub = <<<PHP
<?php
namespace App\Features\\{$name}\Providers;

use Illuminate\Support\ServiceProvider;

class {$name}ServiceProvider extends ServiceProvider
{
    public function register(): void {
        // Enregistrement des services
    }

    public function boot(): void {
        \$this->loadMigrationsFrom(__DIR__ . '/../Database/Migrations');
        // Charger les routes, vues, etc.
    }
}
PHP;
        File::put("{$path}/Providers/{$name}ServiceProvider.php", $stub);
    }
}