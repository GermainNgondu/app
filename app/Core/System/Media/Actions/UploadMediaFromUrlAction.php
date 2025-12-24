<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Http\Request;
use App\Core\System\Media\Data\MediaData;
use App\Core\System\Media\Models\Library;
use Lorisleiva\Actions\Concerns\AsAction;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileCannotBeAdded;

class UploadMediaFromUrlAction
{
    use AsAction;

    /**
     * Télécharge un fichier depuis une URL et l'attache à la Library.
     *
     * @param string $url
     * @return MediaData
     * @throws FileCannotBeAdded
     */
    public function handle(string $url): MediaData
    {
        // 1. Récupération du conteneur central
        $library = Library::firstOrCreate(
            ['slug' => 'default'],
            ['name' => 'Bibliothèque Globale']
        );

        // 2. Spatie gère tout : téléchargement, extension, mime-type
        $media = $library->addMediaFromUrl($url)
            ->toMediaCollection('default');

        // 3. Retour standardisé (DTO)
        return MediaData::fromModel($media);
    }

    public function asController(Request $request)
    {
        $request->validate([
            'url' => 'required|url'
        ]);

        try {
            $mediaData = $this->handle($request->input('url'));

            // On retourne la structure JSON attendue par le Frontend (MediaData)
            return response()->json($mediaData);

        } catch (\Exception $e) {
            // Gestion des erreurs (ex: image introuvable, timeout, format non supporté)
            return response()->json([
                'message' => __('Impossible de récupérer l\'image. Vérifiez l\'URL.') . ' ' . $e->getMessage(),
            ], 422);
        }
    }
}