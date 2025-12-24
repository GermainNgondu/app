<?php

namespace App\Core\System\Installer\Actions;

use Lorisleiva\Actions\Concerns\AsAction;

class CheckPermissionsAction
{
    use AsAction;

    protected array $paths = [
        'storage/app' => '775',
        'storage/framework' => '775',
        'storage/logs' => '775',
        'bootstrap/cache' => '775',
    ];

    public function handle(): array
    {
        $results = [];
        foreach ($this->paths as $path => $permission) {
            $fullPath = base_path($path);
            $results[$path] = [
                'is_writable' => is_writable($fullPath),
                'current_perm' => substr(sprintf('%o', fileperms($fullPath)), -3)
            ];
        }
        return $results;
    }
}