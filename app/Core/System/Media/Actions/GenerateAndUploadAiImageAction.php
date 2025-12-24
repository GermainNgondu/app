<?php

namespace App\Core\System\Media\Actions;

use Spatie\MediaLibrary\HasMedia;
use Illuminate\Support\Facades\Http;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Media\Data\UrlUploadData;
use App\Core\System\Media\Data\AiGenerationData;

class GenerateAndUploadAiImageAction
{
    use AsAction;

    public function handle(HasMedia $model, AiGenerationData $data)
    {
        // 1. Appel à OpenAI (DALL-E 3 par exemple)
        $response = Http::withToken(config('services.openai.key'))
            ->post('https://api.openai.com/v1/images/generations', [
                'model' => 'dall-e-3',
                'prompt' => $data->prompt,
                'n' => 1,
                'size' => $data->size,
            ]);

        $generatedUrl = $response->json('data.0.url');

        // 2. Téléchargement et stockage
        return UploadMediaFromUrlAction::run($model, new UrlUploadData(
            url: $generatedUrl,
            collection: $data->collection
        ));
    }
}