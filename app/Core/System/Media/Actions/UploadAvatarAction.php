<?php

namespace App\Core\System\Media\Actions;

use App\Core\System\Media\Data\UploadMediaData;
use App\Core\System\Media\Data\MediaResponseData;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class UploadAvatarAction
{
    use AsAction;

    /**
     * Vérifie si l'utilisateur peut uploader un média
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Logique métier : Interaction avec Spatie MediaLibrary
     */
    public function handle(UploadMediaData $data): MediaResponseData
    {
        $user = Auth::user();

        // On nettoie la collection précédente pour l'avatar (remplacement)
        $media = $user->addMedia($data->file)
            ->usingFileName("avatar_{$user->uuid}.{$data->file->extension()}")
            ->toMediaCollection('avatars', $data->disk);

        return MediaResponseData::fromModel($media);
    }

    /**
     * Exécution via l'API (POST)
     */
    public function asController(UploadMediaData $data)
    {
        $result = $this->handle($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Avatar mis à jour',
            'data' => $result
        ]);
    }
}