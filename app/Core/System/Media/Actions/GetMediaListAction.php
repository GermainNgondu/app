<?php

namespace App\Core\System\Media\Actions;

use App\Core\System\Media\Data\MediaData;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Http\Request;
use Spatie\LaravelData\PaginatedDataCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Database\Eloquent\Builder;

class GetMediaListAction
{
    use AsAction;

    public function handle(Request $request): PaginatedDataCollection
    {
        $medias = QueryBuilder::for(Media::class)
            ->allowedFilters([
                // 1. Recherche globale (Nom ou Nom de fichier)
                AllowedFilter::callback('search', function (Builder $query, $value) {
                    $searchTerm = is_array($value) ? ($value[0] ?? '') : $value;

                    if (empty($searchTerm) || !is_string($searchTerm)) {
                        return;
                    }
                    $query->where(function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%{$searchTerm}%")
                          ->orWhere('file_name', 'LIKE', "%{$searchTerm}%");
                    });
                }),
                
                // 2. Filtre par Collection (ex: 'avatar', 'posts')
                AllowedFilter::exact('collection', 'collection_name'),

                // 3. Filtre par Type (ex: 'image', 'pdf')
                AllowedFilter::callback('type', function (Builder $query, $value) {
                    if ($value === 'image') {
                        $query->where('mime_type', 'LIKE', 'image/%');
                    } elseif ($value === 'document') {
                        $query->where('mime_type', 'NOT LIKE', 'image/%');
                    } else {
                        $query->where('mime_type', 'LIKE', "%{$value}%");
                    }
                }),
            ])
            ->defaultSort('-created_at')
            ->allowedSorts(['created_at', 'size', 'name', 'file_name'])
            ->paginate($request->get('per_page', 20))
            ->appends($request->query()); // Conserve les filtres dans les liens de pagination

        return MediaData::collect($medias, PaginatedDataCollection::class);
    }

    public function asController(Request $request)
    {
        return $this->handle($request);
    }
}