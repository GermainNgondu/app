<?php

namespace App\Core\System\Updater\Actions;

use ZipArchive;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;
use Lorisleiva\Actions\Concerns\AsAction;

class InstallUpdateAction
{
    use AsAction;
    public function handle(): void
    {
        $zipPath = storage_path('app/updates/update.zip');
        $basePath = base_path();
        $currentVersion = config('app.version', '1.0.0');
        $backupPath = null;

        if (!File::exists($zipPath)) {
            throw new \Exception("Fichier de mise à jour introuvable.");
        }

        // 1. Mode Maintenance
        Artisan::call('down', ['--secret' => 'admin-update-key','--refresh' => 15]);

        try {
            // -----------------------------------------------------
            // ÉTAPE A : BACKUP DE SÉCURITÉ
            // -----------------------------------------------------
            Log::info("Début du backup version {$currentVersion}...");
            $backupPath = CreateBackupAction::run($currentVersion);
            Log::info("Backup créé avec succès : {$backupPath}");


            // -----------------------------------------------------
            // ÉTAPE B : INSTALLATION
            // -----------------------------------------------------
            $zip = new ZipArchive;
            if ($zip->open($zipPath) === TRUE) {
                // Écrasement des fichiers
                $zip->extractTo($basePath);
                $zip->close();
            } else {
                throw new \Exception("Impossible d'ouvrir l'archive ZIP de mise à jour.");
            }

            // Migrations & Nettoyage
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('cache:clear');
            Artisan::call('view:clear');
            Artisan::call('config:clear');

            // Suppression du zip d'update (mais on garde le backup pour l'instant)
            File::delete($zipPath);

        } catch (\Exception $e) {
            // -----------------------------------------------------
            // ÉTAPE C : ROLLBACK EN CAS D'ERREUR
            // -----------------------------------------------------
            Log::error("Échec de la mise à jour. Tentative de restauration... Erreur: " . $e->getMessage());
            
            if ($backupPath) {
                try {
                    RestoreBackupAction::run($backupPath);
                    Log::info("Restauration effectuée avec succès.");
                    
                    // On remet le site en ligne avant de lancer l'erreur pour que l'admin y ait accès
                    Artisan::call('up');
                    
                    throw new \Exception("Mise à jour échouée. Le système a été restauré à la version précédente. Erreur : " . $e->getMessage());
                } catch (\Exception $restoreEx) {
                    // CATASTROPHE : Le restore a aussi échoué
                    Log::critical("Échec critique : Impossible de restaurer le backup. Système instable.");
                    throw new \Exception("Échec critique. La mise à jour a échoué ET la restauration a échoué. Vérifiez les logs.");
                }
            }
            
            throw $e;
        }

        // 4. Fin Maintenance (Succès)
        Artisan::call('up');
    }

    public function asController()
    {
        try {
            // Increase execution time for extraction
            set_time_limit(300);
            
            $this->handle();
            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}