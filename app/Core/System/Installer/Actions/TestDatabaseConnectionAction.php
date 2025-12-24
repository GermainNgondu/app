<?php

namespace App\Core\System\Installer\Actions;

use PDO;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Database\Connectors\ConnectionFactory;
use App\Core\System\Installer\Data\DatabaseConfigData;

class TestDatabaseConnectionAction
{
    use AsAction;

    public function handle(DatabaseConfigData $data): bool
    {
        if ($data->db_connection === 'sqlite') {
            return true; // SQLite géré précédemment
        }

        try {

            $config = $this->makeConfig($data->toArray());
            
            DB::purge();
            
            app(ConnectionFactory::class)->make($config)->getPdo();

            return true;

        } catch (Exception $e) {
            // Debug : On écrit l'erreur réelle dans les logs pour vous aider
            Log::error("Échec de connexion Installer : " . $e->getMessage());
            
            // On renvoie l'erreur à React
            throw new Exception("Erreur de connexion : " . $this->translateError($e->getMessage()));
        }
    }

        /**
     * @param array $dbArgs
     * @return mixed
     */
    public function makeConfig(array $data): mixed
    {
        $connection = $data['driver'] ?? 'mysql';
        $connectionConfig = config('database.connections.'.$connection);

        $connectionConfig['host'] = $data['db_host'];
        $connectionConfig['port'] = $data['db_port'];
        $connectionConfig['database'] = $data['db_database'];
        $connectionConfig['username'] = $data['db_username'];
        $connectionConfig['password'] = $data['db_password'];

        return $connectionConfig;
    }

    private function translateError($message): string
    {
        if (str_contains($message, 'Access denied')) return "Utilisateur ou mot de passe incorrect.";
        if (str_contains($message, 'Unknown database')) return "La base de données n'existe pas.";
        if (str_contains($message, 'Connection refused')) return "Le serveur MySQL est injoignable (Host/Port incorrect).";
        return $message;
    }
}