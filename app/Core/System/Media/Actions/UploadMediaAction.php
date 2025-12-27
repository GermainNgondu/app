<?php

namespace App\Core\System\Media\Actions;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Spatie\LaravelData\DataCollection;
use App\Core\System\Media\Data\MediaData;
use App\Core\System\Media\Models\Library;
use Lorisleiva\Actions\Concerns\AsAction;

class UploadMediaAction
{
    use AsAction;

    /**
     * @param array|object $files
     * @return DataCollection|MediaData
     */
    public function handle(array|object $files): DataCollection|MediaData
    {
        $library = Library::firstOrCreate(['slug' => 'default'], ['name' => 'Bibliothèque Globale']);
        
        $processFile = function($file) use ($library) {
            
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $safeName = Str::slug($originalName) . '.' . $extension;

            $media = $library->addMedia($file)
                ->usingFileName($safeName)
                ->toMediaCollection('default');

            return MediaData::fromModel($media);
        };

        if (is_array($files)) {
            $uploadedMedia = array_map($processFile, $files);
            return MediaData::collect($uploadedMedia, DataCollection::class);
        }

        return $processFile($files);
    }

    public function asController(Request $request)
    {
        // Définition des restrictions par type
        $type = $request->input('type', 'all');

        $rulesByGroup = [
            'image'    => 'jpg,jpeg,png,webp,gif,svg',
            'video'    => 'mp4,webm,ogg,mov,avi',
            'audio'    => 'mp3,wav,ogg,m4a',
            'document' => 'pdf,doc,docx,xls,xlsx,txt,csv,zip,rar,pptx,ppt',
            'all'      => 'jpg,jpeg,png,webp,gif,svg,mp4,webm,pdf,doc,docx,xls,xlsx,txt,zip'
        ];

        $allowedExtensions = $rulesByGroup[$type] ?? $rulesByGroup['all'];
        $request->validate([
            'type'    => 'nullable|string|in:image,video,audio,document,all',
            'files'   => 'nullable|array',
            'files.*' => "file|mimes:{$allowedExtensions}|max:524288", 
            'file'    => "nullable|file|mimes:{$allowedExtensions}|max:524288",
        ], [
            'files.*.mimes' => __('Le format du fichier est invalide pour ce champ.'),
            'file.mimes'    => __('Le format du fichier est invalide pour ce champ.'),
            'file.max'      => __('Le fichier est trop lourd.'),
        ]);

        // Traitement
        $files = $request->file('files') ?? $request->file('file');

        if (!$files) {
            return response()->json(['message' => __('Aucun fichier reçu.')], 422);
        }

        try {
            $data = $this->handle($files);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'message' => __('Erreur lors de l\'upload : ') . $e->getMessage()
            ], 500);
        }
    }
}