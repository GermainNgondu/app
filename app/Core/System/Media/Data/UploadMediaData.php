<?php

namespace App\Core\System\Media\Data;

use Spatie\LaravelData\Data;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class UploadMediaData extends Data
{
    public function __construct(
        public UploadedFile $file,
        public string $collection = 'default',
        public ?string $disk = 'public',
    ) {}

    /**
     * Signature corrigée avec ValidationContext
     */
    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'file' => ['required', 'file', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
            'collection' => ['nullable', 'string', 'max:50'],
            'disk' => ['nullable', 'string', 'in:public,s3,local'],
        ];
    }
}