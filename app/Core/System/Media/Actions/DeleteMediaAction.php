<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Http\JsonResponse;
use App\Core\System\Media\Models\Media;
use Lorisleiva\Actions\Concerns\AsAction;

class DeleteMediaAction
{
    use AsAction;

    /**
     * Exécute la suppression du média.
     * * @param string $uuid L'UUID envoyé par le frontend
     * @return JsonResponse
     */
    public function handle(string $uuid): JsonResponse
    {
        // 1. On cherche le média par son UUID (sécurité)
        // firstOrFail renvoie une erreur 404 si l'UUID n'existe pas
        $media = Media::where('uuid', $uuid)->firstOrFail();

        /**
         * 2. Suppression du média.
         * En appelant delete() sur un modèle Spatie Media, le package :
         * - Supprime l'entrée en base de données.
         * - Supprime physiquement les fichiers (original + miniatures) sur le disque.
         */
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => __('Média supprimé avec succès')
        ]);
    }

    /**
     * Permet à l'action d'être appelée comme un contrôleur
     */
    public function asController(string $uuid): JsonResponse
    {
        return $this->handle($uuid);
    }
}