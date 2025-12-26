<?php

namespace App\Core\System\Updater\Actions;

use ZipArchive;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateBackupAction
{
    use AsAction;

    public function handle(string $version): string
    {
        $backupDir = storage_path('app/backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $filename = "backup_v{$version}_" . date('Y-m-d_H-i-s') . ".zip";
        $zipPath = "{$backupDir}/{$filename}";

        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
            throw new \Exception("Impossible de créer le fichier de backup.");
        }

        // 1. Backup de la Base de Données (JSON Dump simple pour la restauration)
        // Note: Pour une prod robuste, préférez `mysqldump` ou `spatie/laravel-backup`
        $this->backupDatabase($zip);

        // 2. Backup des Fichiers (Code source)
        $this->backupFiles($zip);

        $zip->close();

        return $zipPath;
    }

    private function backupDatabase(ZipArchive $zip)
    {
        // On exporte chaque table en JSON dans le zip
        $tables = DB::connection()->getDoctrineSchemaManager()->listTableNames();
        foreach ($tables as $table) {
            $data = DB::table($table)->get();
            $zip->addFromString("database/{$table}.json", $data->toJson());
        }
    }

    private function backupFiles(ZipArchive $zip)
    {
        $rootPath = base_path();
        
        // Dossiers à exclure (très important !)
        $exclude = ['storage', '.git', 'node_modules', 'bootstrap/cache'];

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($rootPath),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file) {
            if ($file->isDir()) continue;

            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($rootPath) + 1);
            
            // Vérification des exclusions
            $shouldExclude = false;
            foreach ($exclude as $dir) {
                if (str_starts_with($relativePath, $dir)) {
                    $shouldExclude = true;
                    break;
                }
            }

            if (!$shouldExclude) {
                $zip->addFile($filePath, $relativePath);
            }
        }
    }
}