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
        public ?string $thumbnail,
        public string $mime_type,
        public string $human_size,
    ) {}

    /**
     * Mapping depuis le modèle Spatie vers le DTO
     */
    public static function fromModel(Media $media): self
    {
        $thumbnail = $media->hasGeneratedConversion('thumb') 
            ? $media->getFullUrl('thumb') 
            : $media->getFullUrl();

        return new self(
            uuid: $media->uuid,
            name: $media->file_name,
            original_url: $media->getFullUrl(),
            thumbnail: $thumbnail,
            mime_type: $media->mime_type,
            human_size: $media->human_readable_size,
        );
    }

    /**
     * Formate un paginateur Laravel pour le frontend
     */
    public static function fromPaginator($paginator, array $collections = []): array
    {
        return [
            'data' => array_map(
                fn($item) => self::fromModel($item), 
                $paginator->items()
            ),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
                'collections' => $collections, 
            ],
        ];
    }
}