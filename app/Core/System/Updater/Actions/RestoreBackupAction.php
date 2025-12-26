<?php

namespace App\Core\System\Updater\Actions;

use ZipArchive;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Lorisleiva\Actions\Concerns\AsAction;

class RestoreBackupAction
{
    use AsAction;

    public function handle(string $backupPath): void
    {
        if (!File::exists($backupPath)) {
            throw new \Exception("Fichier de backup introuvable pour la restauration.");
        }

        $zip = new ZipArchive;
        if ($zip->open($backupPath) === TRUE) {
            
            // 1. Restauration des fichiers
            // On écrase tout ce qui est à la racine
            $zip->extractTo(base_path());
            
            // 2. Restauration de la DB
            // On désactive les contraintes de clés étrangères temporairement
            Schema::disableForeignKeyConstraints();
            
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $filename = $zip->getNameIndex($i);
                
                // Si c'est un fichier de base de données (database/users.json)
                if (str_starts_with($filename, 'database/') && str_ends_with($filename, '.json')) {
                    $tableName = basename($filename, '.json');
                    $content = $zip->getFromIndex($i);
                    $data = json_decode($content, true);

                    if (Schema::hasTable($tableName)) {
                        DB::table($tableName)->truncate();
                        // Insertion par lots pour éviter la surcharge mémoire
                        foreach (array_chunk($data, 100) as $chunk) {
                            DB::table($tableName)->insert($chunk);
                        }
                    }
                }
            }
            
            Schema::enableForeignKeyConstraints();
            $zip->close();
        } else {
            throw new \Exception("Impossible d'ouvrir le backup pour restauration.");
        }
    }
}