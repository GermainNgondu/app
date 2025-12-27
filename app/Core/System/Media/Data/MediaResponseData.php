<?php

namespace App\Core\System\Media\Data;

use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaResponseData extends Data
{
    public function __construct(
        /** * On utilise l'UUID comme identifiant public.
         * Cela évite d'exposer les IDs incrémentaux de la base de données.
         */
        public string $id, 
        public string $name,
        public string $url,
        public ?string $thumbnail,
        public string $mime_type,
        public int $size,
        public string $file_name,
    ) {}

    /**
     * Transforme un modèle Spatie Media en DTO pour le Frontend.
     */
    public static function fromModel(Media $media): self
    {
        // On récupère la miniature si elle existe, sinon l'URL originale
        $thumbnail = $media->hasGeneratedConversion('thumb') 
            ? $media->getFullUrl('thumb') 
            : $media->getFullUrl();

        return new self(
            // STRATÉGIE : On injecte l'UUID dans la propriété 'id'
            id: (string) $media->uuid, 
            name: $media->name,
            url: $media->getFullUrl(),
            thumbnail: $thumbnail,
            mime_type: $media->mime_type,
            // On force le cast en entier pour éviter le bug "NaN KB" en JS
            size: (int) $media->size, 
            file_name: $media->file_name,
        );
    }

    /**
     * Formate une collection paginée avec les métadonnées.
     */
    public static function fromPaginator($paginator, array $collections = []): array
    {
        return [
            'data' => array_map(fn($item) => self::fromModel($item), $paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'collections' => $collections, // Liste dynamique des dossiers pour le filtre
            ],
        ];
    }
}