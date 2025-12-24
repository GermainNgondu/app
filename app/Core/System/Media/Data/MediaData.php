<?php

namespace App\Core\System\Media\Data;

use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $file_name,
        public string $mime_type,
        public int $size,
        public string $url,        // L'URL originale
        public ?string $thumbnail, // L'URL de la miniature (si conversion)
        public string $updated_at,
    ) {}

    /**
     * Cette méthode magique permet de mapper le Modèle Media vers ce DTO.
     */
    public static function fromModel(Media $media): self
    {
        return new self(
            id: $media->id,
            name: $media->name,
            file_name: $media->file_name,
            mime_type: $media->mime_type,
            size: $media->size,
            // Spatie MediaLibrary : méthode getUrl()
            url: $media->getUrl(), 
            // On vérifie si une conversion 'thumb' existe, sinon on prend l'original
            thumbnail: $media->hasGeneratedConversion('thumb') ? $media->getUrl('thumb') : $media->getUrl(),
            updated_at: $media->updated_at->diffForHumans(),
        );
    }
}