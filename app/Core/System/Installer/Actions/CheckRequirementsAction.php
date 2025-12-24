<?php

namespace App\Core\System\Installer\Actions;

use Lorisleiva\Actions\Concerns\AsAction;

class CheckRequirementsAction
{
    use AsAction;

    protected array $requirements = [
        'php' => '8.2.0',
        'extensions' => ['bcmath', 'ctype', 'fileinfo', 'json', 'mbstring', 'openssl', 'pcre', 'tokenizer', 'xml', 'gd', 'curl']
    ];

    public function handle(): array
    {
        $results = [
            'php' => [
                'required' => $this->requirements['php'],
                'current' => PHP_VERSION,
                'supported' => version_compare(PHP_VERSION, $this->requirements['php'], '>=')
            ],
            'extensions' => []
        ];

        foreach ($this->requirements['extensions'] as $ext) {
            $results['extensions'][$ext] = extension_loaded($ext);
        }

        return $results;
    }

    public function asController()
    {
        return response()->json($this->handle());
    }
}