<?php

namespace App\Core\System\Installer\Actions;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Artisan;
use Lorisleiva\Actions\Concerns\AsAction;

class MigrateDatabaseAction
{
    use AsAction;

    public function handle(): array
    {
        try {
            // Récupérer tous les chemins de migration
            $paths = $this->getMigrationPaths();

            // Exécuter les migrations avec les chemins détectés
            Artisan::call('migrate', [
                '--path' => $paths,
                '--realpath' => true,
                '--force' => true,
            ]);

            // Lancer les seeders de base si nécessaire
            $this->runModuleSeeders();

            return [
                'status' => 'success',
                'message' => 'Migrations terminées avec succès.',
                'details' => count($paths) . ' dossiers de migration traités.'
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Erreur lors des migrations : ' . $e->getMessage()
            ];
        }
    }

    /**
     * Scanne dynamiquement le Core et les Features pour trouver les migrations.
     */
    protected function getMigrationPaths(): array
    {
        // On commence par le dossier standard de Laravel
        $paths = [database_path('migrations')];

        // 1. Détection des migrations du CORE
        // Chemin : app/Core/Infrastructure/Database/Migrations
        $coreMigrationPath = app_path('Core/Infrastructure/Database/Migrations');
        if (File::isDirectory($coreMigrationPath)) {
            $paths[] = $coreMigrationPath;
        }

        // 2. Détection des migrations des FEATURES
        // Chemin : app/Features/{FeatureName}/Infrastructure/Database/Migrations
        $featuresPath = app_path('Features');
        
        if (File::isDirectory($featuresPath)) {
            $featureFolders = File::directories($featuresPath);

            foreach ($featureFolders as $folder) {
                $migrationPath = $folder . '/Infrastructure/Database/Migrations';
                if (File::isDirectory($migrationPath)) {
                    $paths[] = $migrationPath;
                }
            }
        }

        return $paths;
    }

    public function asController()
    {
        return response()->json($this->handle());
    }


    /**
     * Scans and executes all Seeders.
     */
    private function runModuleSeeders(): void
    {
        $directories = [
            database_path('seeders'),          // Laravel standard
            base_path('app/Core/Infrastructure/Database/Seeders'), // Core
        ];

        // Dynamic modules
        foreach (['Features', 'Plugins', 'Themes'] as $module) {
            $parent = base_path("app/{$module}");
            if (File::isDirectory($parent)) {
                foreach (glob($parent . '/*', GLOB_ONLYDIR) as $dir) {
                    $path = $dir . '/Infrastructure/Database/Seeders';
                    if (File::isDirectory($path)) {
                        $directories[] = $path;
                    }
                }
            }
        }

        foreach ($directories as $dir) {
            if (!File::isDirectory($dir)) continue;

            $files = File::allFiles($dir);
            
            /** @var \SplFileInfo $file */
            foreach ($files as $file) {
                // Only take PHP files ending with Seeder.php
                if (str_ends_with($file->getFilename(), 'Seeder.php')) {
                    $fullClassName = $this->getClassNamespaceFromFile($file->getRealPath());
                    
                    if ($fullClassName) {
                        $this->runSeeder($fullClassName);
                    }
                }
            }
        }
    }

    /**
     * Executes a specific seeder.
     */
    private function runSeeder(string $className): void
    {
        try {
            Artisan::call('db:seed', [
                '--class' => $className,
                '--force' => true
            ]);
            Log::info("Seeder executed : {$className}");
        } catch (Exception $e) {
            Log::error("Error seeding {$className} : " . $e->getMessage());
        }
    }

    /**
     * Extracts the complete namespace of a PHP file.
     */
    private function getClassNamespaceFromFile(string $filePath): ?string
    {
        $content = File::get($filePath);
        
        // Regex to find "namespace X;" and "class Y"
        if (preg_match('/namespace\s+(.+?);/', $content, $nsMatch) && 
            preg_match('/class\s+(\w+)/', $content, $classMatch)) {
            
            return $nsMatch[1] . '\\' . $classMatch[1];
        }

        return null;
    }
}