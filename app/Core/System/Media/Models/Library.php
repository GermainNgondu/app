<?php

namespace App\Core\System\Media\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Library extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'media_libraries';
    protected $fillable = ['name', 'slug'];

    /**
     * Optionnel : Définir des conversions par défaut pour la bibliothèque
     */
    public function registerMediaConversions(\Spatie\MediaLibrary\MediaCollections\Models\Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->sharpen(10);
    }
}