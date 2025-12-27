<?php

namespace App\Core\System\Media\Actions;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Http\JsonResponse;

class RestoreMediaAction
{
    use AsAction;

    public function handle(string $uuid): JsonResponse
    {
        // On cherche uniquement dans les fichiers supprimés (Soft Deletes)
        $media = Media::onlyTrashed()->where('uuid', $uuid)->firstOrFail();
        
        $media->restore();

        return response()->json([
            'success' => true,
            'message' => __('Média restauré avec succès')
        ]);
    }

    public function asController(string $uuid): JsonResponse
    {
        return $this->handle($uuid);
    }
}