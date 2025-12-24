<?php

namespace App\Core\System\Features\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class FeatureData extends Data
{
    public function __construct(
        public string $name,
        public string $display_name,
        public bool $is_active = false,
        public ?array $settings = null,
    ) {}

    /**
     * Signature rigoureuse pour Laravel-Data
     */
    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'name' => ['required', 'string', 'alpha_dash', 'max:50'],
            'display_name' => ['required', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'settings' => ['nullable', 'array'],
        ];
    }
}