<?php

namespace App\Core\System\Media\Models;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Library extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'media_libraries';
    protected $fillable = ['name', 'slug'];

    /**
     * Définir des conversions par défaut pour la bibliothèque
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->sharpen(10);

        $this->addMediaConversion('webp')
            ->format('webp')
            ->quality(80)
            ->queued();
    }
}