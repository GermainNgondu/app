<?php

namespace App\Core\System\Installer\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class DatabaseConfigData extends Data
{
    public function __construct(
        public string $db_connection = 'mysql',
        public ?string $db_host = '127.0.0.1',
        public ?string $db_port = '3306',
        public string $db_database = 'database.sqlite', // Par défaut pour sqlite
        public ?string $db_username = 'root',
        public ?string $db_password = '',
    ) {}

    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'db_connection' => ['required', 'string', 'in:mysql,pgsql,sqlite'],
            'db_host' => ['required_unless:db_connection,sqlite', 'nullable', 'string'],
            'db_port' => ['required_unless:db_connection,sqlite', 'nullable', 'string'],
            'db_database' => ['required', 'string'],
            'db_username' => ['required_unless:db_connection,sqlite', 'nullable', 'string'],
        ];
    }
}