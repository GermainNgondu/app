<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Http\Request;
use Spatie\LaravelData\DataCollection;
use App\Core\System\Media\Data\MediaData;
use App\Core\System\Media\Models\Library;
use Lorisleiva\Actions\Concerns\AsAction;

class UploadMediaAction
{
    use AsAction;

    public function handle(array|object $files): DataCollection|MediaData
    {
        $library = Library::firstOrCreate(['slug' => 'default'], ['name' => 'Bibliothèque Globale']);
        
        // Si c'est un tableau de fichiers (Upload multiple)
        if (is_array($files)) {
            $uploadedMedia = [];
            foreach ($files as $file) {
                $media = $library->addMedia($file)->toMediaCollection('default');
                $uploadedMedia[] = MediaData::fromModel($media);
            }
            return MediaData::collect($uploadedMedia, DataCollection::class);
        }

        // Si c'est un fichier unique
        $media = $library->addMedia($files)->toMediaCollection('default');
        return MediaData::fromModel($media);
    }

    public function asController(Request $request)
    {
        $request->validate([
            'files'   => 'nullable|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
            'file'    => 'nullable|file|mimes:jpg,jpeg,png,webp,pdf|max:10240',
        ]);

        // On traite soit 'files' (multiple) soit 'file' (unique)
        $data = $this->handle($request->file('files') ?? $request->file('file'));

        return response()->json($data);
    }
}