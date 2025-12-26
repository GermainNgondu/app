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

    /**
     * @param array|object $files
     * @return DataCollection|MediaData
     */
    public function handle(array|object $files): DataCollection|MediaData
    {
        $library = Library::firstOrCreate(['slug' => 'default'], ['name' => 'Bibliothèque Globale']);
        
        if (is_array($files)) {
            $uploadedMedia = [];
            foreach ($files as $file) {
                $media = $library->addMedia($file)->toMediaCollection('default');
                $uploadedMedia[] = MediaData::fromModel($media);
            }
            return MediaData::collect($uploadedMedia, DataCollection::class);
        }

        $media = $library->addMedia($files)->toMediaCollection('default');
        return MediaData::fromModel($media);
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
            // Liste "Safe" par défaut (exclut PHP, JS, HTML, EXE, etc.)
            'all'      => 'jpg,jpeg,png,webp,gif,svg,mp4,webm,pdf,doc,docx,xls,xlsx,txt,zip'
        ];

        // On récupère la liste des extensions autorisées
        $allowedExtensions = $rulesByGroup[$type] ?? $rulesByGroup['all'];

        // Validation stricte
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