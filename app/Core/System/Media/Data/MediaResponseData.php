<?php

namespace App\Core\System\Media\Data;

use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaResponseData extends Data
{
    public function __construct(
        public string $uuid,
        public string $name,
        public string $original_url,
        public ?string $thumb_url,
        public string $mime_type,
        public string $human_size,
    ) {}

    /**
     * Mapping depuis le modèle Spatie vers le DTO
     */
    public static function fromModel(Media $media): self
    {
        return new self(
            uuid: $media->uuid,
            name: $media->file_name,
            original_url: $media->getFullUrl(),
            thumb_url: $media->hasGeneratedConversion('thumb') ? $media->getFullUrl('thumb') : null,
            mime_type: $media->mime_type,
            human_size: $media->human_readable_size,
        );
    }
}