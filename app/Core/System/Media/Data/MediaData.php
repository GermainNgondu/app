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
        public string $url,
        public ?string $thumbnail,
        public string $extension,
        public ?string $disk,
        public ?string $updated_at,
    ) {}

    public static function fromModel(Media $media): self
    {
        $url = $media->getUrl();
        
        if ($media->mime_type === 'video/youtube' && $media->hasCustomProperty('youtube_url')) {
            $url = $media->getCustomProperty('youtube_url');
        }

        return new self(
            id: $media->id,
            name: $media->name,
            file_name: $media->file_name,
            mime_type: $media->mime_type,
            size: $media->size,
            url: $url, 
            thumbnail: $media->getUrl(),
            extension: $media->extension,
            disk: $media->disk,
            updated_at: $media->updated_at?->diffForHumans()
        );
    }
}