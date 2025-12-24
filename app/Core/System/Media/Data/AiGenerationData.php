<?php

namespace App\Core\System\Media\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class AiGenerationData extends Data
{
    public function __construct(
        public string $prompt,
        public string $size = '1024x1024',
        public string $collection = 'ai_generated',
    ) {}

    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'prompt' => ['required', 'string', 'min:10', 'max:1000'],
            'size' => ['required', 'string', 'in:256x256,512x512,1024x1024'],
        ];
    }
}