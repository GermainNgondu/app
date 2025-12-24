<?php

namespace App\Core\System\Installer\Actions;

use App\Core\System\Installer\Data\DatabaseConfigData;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;

class WriteEnvironmentAction
{
    use AsAction;

    public function handle(DatabaseConfigData $data): bool
    {
        $envPath = base_path('.env');
        $examplePath = base_path('.env.example');

        // 1. Sécurité : Créer le .env s'il n'existe pas
        if (!File::exists($envPath)) {
            if (!File::exists($examplePath)) {
                throw new \Exception("Le fichier .env.example est introuvable à la racine.");
            }
            File::copy($examplePath, $envPath);
        }

        // 2. Vérifier si le fichier est réellement scriptable
        if (!is_writable($envPath)) {
            throw new \Exception("Le fichier .env n'est pas scriptable. Vérifiez les permissions (chmod 664).");
        }

        $content = File::get($envPath);
        $config = $data->toArray();

        // Gestion SQLite
        if ($data->db_connection === 'sqlite') {
            $path = database_path($data->db_database);
            $config['db_database'] = $path;
            if (!File::exists($path)) {
                File::put($path, ''); // Créer le fichier vide
            }
        }

        // 3. Remplacement propre des clés
        foreach ($config as $key => $value) {
            $key = strtoupper($key);
            // On cherche la clé, si elle existe on la remplace, sinon on l'ajoute en fin de fichier
            if (preg_match("/^{$key}=/m", $content)) {
                $content = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $content);
            } else {
                $content .= "\n{$key}={$value}";
            }
        }

        // 4. Écriture physique
        $saved = File::put($envPath, $content);

        if ($saved) {
            // TRÈS IMPORTANT : On force Laravel à oublier l'ancien cache de config
            // Sinon le step "Migration" utilisera toujours les anciennes valeurs
            Artisan::call('config:clear');
            
            // On injecte les nouvelles valeurs dans la config actuelle du process
            config([
                'database.default' => $data->db_connection,
                "database.connections.{$data->db_connection}.database" => $config['db_database'],
                "database.connections.{$data->db_connection}.host" => $data->db_host,
                "database.connections.{$data->db_connection}.username" => $data->db_username,
                "database.connections.{$data->db_connection}.password" => $data->db_password,
            ]);
        }

        return (bool)$saved;
    }
}