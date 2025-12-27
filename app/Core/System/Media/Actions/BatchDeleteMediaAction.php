<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Core\System\Media\Models\Media;
use Lorisleiva\Actions\Concerns\AsAction;

class BatchDeleteMediaAction
{
    use AsAction;

    public function handle(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:media,uuid' // On valide via UUID pour la sécurité
        ]);

        $uuids = $request->input('ids');
        $medias = Media::whereIn('uuid', $uuids)->get();

        foreach ($medias as $media) {
            // delete() effectue un Soft Delete si le trait est présent sur le modèle
            $media->delete();
        }

        return response()->json([
            'success' => true,
            'message' => __(':count médias déplacés vers la corbeille', ['count' => count($uuids)])
        ]);
    }
}