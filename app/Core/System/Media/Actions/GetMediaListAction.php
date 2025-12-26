<?php

namespace App\Core\System\Media\Actions;


use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Database\Eloquent\Builder;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Media\Data\MediaResponseData;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GetMediaListAction
{
    use AsAction;

    /**
     * Récupère la liste des médias avec filtres et métadonnées dynamiques.
     *
     * @param Request $request
     * @return array
     */
    public function handle(Request $request): array
    {
        // 1. Récupération dynamique des noms de collections existantes en base de données
        $collections = Media::query()
            ->select('collection_name')
            ->distinct()
            ->pluck('collection_name')
            ->toArray();

        // 2. Construction de la requête avec Spatie QueryBuilder
        $medias = QueryBuilder::for(Media::class)
            ->allowedFilters([
                // Filtre de recherche globale (Nom ou Nom de fichier)
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $searchTerm = is_array($value) ? ($value[0] ?? '') : $value;
                    if (empty($searchTerm)) return;

                    $query->where(function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%{$searchTerm}%")
                          ->orWhere('file_name', 'LIKE', "%{$searchTerm}%");
                    });
                }),
                
                // Filtre exact par collection (ex: 'avatars', 'products')
                AllowedFilter::exact('collection', 'collection_name'),

                // Filtre par type de média (image, video, audio, document)
                AllowedFilter::callback('type', function (Builder $query, $value) {
                    if ($value === 'image') {
                        $query->where('mime_type', 'LIKE', 'image/%');
                    } elseif ($value === 'video') {
                        // Gère les vidéos physiques et les références YouTube
                        $query->where(function($q) {
                            $q->where('mime_type', 'LIKE', 'video/%')
                              ->orWhere('mime_type', 'video/youtube');
                        });
                    } elseif ($value === 'audio') {
                        $query->where('mime_type', 'LIKE', 'audio/%');
                    } elseif ($value === 'document') {
                        // Exclut les formats visuels et sonores pour ne garder que les documents
                        $query->whereNot(function($q) {
                            $q->where('mime_type', 'LIKE', 'image/%')
                              ->orWhere('mime_type', 'LIKE', 'video/%')
                              ->orWhere('mime_type', 'video/youtube')
                              ->orWhere('mime_type', 'LIKE', 'audio/%');
                        });
                    } else {
                        $query->where('mime_type', 'LIKE', "%{$value}%");
                    }
                }),
            ])
            ->defaultSort('-created_at')
            ->allowedSorts(['created_at', 'size', 'name'])
            ->paginate($request->get('per_page', 20))
            ->appends($request->query());

        // 3. Retourne les données formatées via le DTO avec les collections dynamiques
        return MediaResponseData::fromPaginator($medias, $collections);
    }

    /**
     * Point d'entrée pour les requêtes API/HTTP.
     */
    public function asController(Request $request)
    {
        return response()->json($this->handle($request));
    }
}