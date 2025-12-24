<?php

namespace App\Core\System\Media\Actions;

use App\Core\System\Media\Data\UrlUploadData;
use Illuminate\Support\Facades\Http;
use Lorisleiva\Actions\Concerns\AsAction;
use Spatie\MediaLibrary\HasMedia;

class UploadFromUnsplashAction
{
    use AsAction;

    public function handle(HasMedia $model, string $unsplashPhotoId, string $collection = 'default')
    {
        // 1. Récupérer l'URL de téléchargement via l'API Unsplash
        $response = Http::withToken(config('services.unsplash.key'))
            ->get("https://api.unsplash.com/photos/{$unsplashPhotoId}/download");

        $downloadUrl = $response->json('url');

        // 2. Utiliser l'action d'upload par URL existante
        return UploadMediaFromUrlAction::run($model, new UrlUploadData(
            url: $downloadUrl,
            collection: $collection
        ));
    }
}