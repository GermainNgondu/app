<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Core\System\Media\Models\Media;
use Illuminate\Database\Eloquent\Builder;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Media\Data\MediaResponseData;

class GetMediaListAction
{
    use AsAction;

    /**
     * Récupère la liste des médias avec filtrage par type, collection et recherche.
     *
     * @param Request $request
     * @return array
     */
    public function handle(Request $request): array
    {
        // Récupération dynamique des collections présentes en DB pour le filtre du Modal
        $collections = Media::query()
            ->select('collection_name')
            ->distinct()
            ->pluck('collection_name')
            ->toArray();
        
        // On prépare la requête de base selon le mode (Normal vs Corbeille)
        $baseQuery = $request->boolean('trashed') 
            ? Media::onlyTrashed() 
            : Media::query();

        // Construction de la requête filtrable
        $medias = QueryBuilder::for($baseQuery)
            ->allowedFilters([
                // Recherche par nom ou nom de fichier
                AllowedFilter::partial('search', 'name'),
                
                // Filtre exact sur la collection
                AllowedFilter::exact('collection', 'collection_name'),

                // LOGIQUE DE FILTRAGE PAR TYPE (Indispensable pour le MediaPicker)
                AllowedFilter::callback('type', function (Builder $query, $value) {
                    if ($value === 'image') {
                        $query->where('mime_type', 'LIKE', 'image/%');
                    } elseif ($value === 'video') {
                        // Supporte les vidéos réelles et les liens YouTube (mime_type personnalisé)
                        $query->where(function($q) {
                            $q->where('mime_type', 'LIKE', 'video/%')
                              ->orWhere('mime_type', 'video/youtube');
                        });
                    } elseif ($value === 'audio') {
                        $query->where('mime_type', 'LIKE', 'audio/%');
                    } elseif ($value === 'document') {
                        // On exclut les médias visuels/sonores pour ne garder que le reste (PDF, Doc, etc.)
                        $query->whereNot(function($q) {
                            $q->where('mime_type', 'LIKE', 'image/%')
                              ->orWhere('mime_type', 'LIKE', 'video/%')
                              ->orWhere('mime_type', 'video/youtube')
                              ->orWhere('mime_type', 'LIKE', 'audio/%');
                        });
                    }
                }),
            ])
            ->latest() // Les plus récents en premier
            ->paginate($request->get('per_page', 24))
            ->appends($request->query());

        // On utilise le DTO pour formater la réponse avec les collections dynamiques
        return MediaResponseData::fromPaginator($medias, $collections);
    }

    /**
     * Point d'entrée pour la route API
     */
    public function asController(Request $request)
    {
        return response()->json($this->handle($request));
    }
}