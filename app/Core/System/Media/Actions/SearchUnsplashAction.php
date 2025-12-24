<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Lorisleiva\Actions\Concerns\AsAction;

class SearchUnsplashAction
{
    use AsAction;

    public function handle(string $query): array
    {
        $response = Http::get('https://api.unsplash.com/search/photos', [
            'client_id' => config('services.unsplash.access_key'),
            'query'     => $query,
            'per_page'  => 20,
        ]);

        if ($response->failed()) {
            return [];
        }

        return $response->json('results') ?? [];
    }

    public function asController(Request $request)
    {
        $query = $request->input('query');

        if (empty($query)) {
            return response()->json([]);
        }

        return response()->json($this->handle($query));
    }
}