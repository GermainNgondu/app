<?php

namespace App\Core\System\Media\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class UrlUploadData extends Data
{
    public function __construct(
        public string $url,
        public string $collection = 'default',
    ) {}

    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'url' => ['required', 'url', 'active_url'],
            'collection' => ['nullable', 'string'],
        ];
    }
}