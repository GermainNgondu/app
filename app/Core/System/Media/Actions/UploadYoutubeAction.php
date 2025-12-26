<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Http\Request;
use App\Core\System\Media\Data\MediaData;
use App\Core\System\Media\Models\Library;
use Lorisleiva\Actions\Concerns\AsAction;

class UploadYoutubeAction
{
    use AsAction;

    public function handle(string $url): MediaData
    {
        // 1. Extraction de l'ID vidéo
        $videoId = $this->extractVideoId($url);
        
        if (!$videoId) {
            throw new \Exception("URL YouTube invalide.");
        }

        // 2. On récupère la miniature haute qualité
        $thumbnailUrl = "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg";

        $library = Library::firstOrCreate(
            ['slug' => 'default'],
            ['name' => 'Bibliothèque Globale']
        );

        // 3. On ajoute la miniature comme "Fichier" principal
        $media = $library->addMediaFromUrl($thumbnailUrl)
            ->usingName("YouTube - {$videoId}")
            ->withCustomProperties([
                'youtube_url' => $url,
                'video_id' => $videoId
            ])
            ->toMediaCollection('default');

        // 4. ASTUCE : On force le mime_type pour que le frontend le reconnaisse comme vidéo
        // (Sinon ce serait image/jpeg car c'est la miniature qu'on a téléchargé)
        $media->mime_type = 'video/youtube';
        $media->save();

        return MediaData::fromModel($media);
    }

    /**
     * Regex robuste pour extraire l'ID Youtube (supporte youtu.be, embed, v=...)
     */
    private function extractVideoId(string $url): ?string
    {
        $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
        if (preg_match($pattern, $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    public function asController(Request $request)
    {
        $request->validate(['url' => 'required|url']);

        try {
            $mediaData = $this->handle($request->input('url'));
            return response()->json($mediaData);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}