<?php

namespace App\Core\System\Media\Actions;


use Illuminate\Http\Request;
use App\Core\System\Media\Models\Media;
use Lorisleiva\Actions\Concerns\AsAction;

class ForceDeleteMediaAction
{
    use AsAction;

    public function handle(Request $request)
    {
        $request->validate([
            'ids' => 'required|array', // Peut être un seul ID ou plusieurs
        ]);

        $uuids = $request->input('ids');

        // On cible uniquement les éléments qui sont déjà dans la corbeille
        $medias = Media::onlyTrashed()->whereIn('uuid', $uuids)->get();

        foreach ($medias as $media) {
            /**
             * forceDelete() est crucial ici. 
             * Contrairement à delete(), il ne remet pas l'élément en corbeille,
             * il ordonne à Spatie d'effacer les fichiers du stockage définitvement.
             */
            $media->forceDelete();
        }

        return response()->json([
            'message' => __('Médias effacés définitivement du serveur')
        ]);
    }
}