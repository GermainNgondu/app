<?php

namespace App\Core\System\Settings\Actions;

use App\Core\System\Settings\Data\SettingsData;
use App\Core\System\Settings\Models\Setting;
use Lorisleiva\Actions\Concerns\AsAction;

class UpdateSettingsAction
{
    use AsAction;

    public function handle(SettingsData $data): void
    {
        // On transforme l'objet Data en tableau et on boucle
        foreach ($data->all() as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
            
            // Invalidation du cache pour cette clé
            cache()->forget("setting.{$key}");
        }
    }

    /**
     * Laravel Data injecte et valide automatiquement la Request ici.
     */
    public function asController(SettingsData $data)
    {
        $this->handle($data);

        return response()->json([
            'status' => 'success',
            'message' => __('Paramètres mis à jour avec succès.')
        ]);
    }
}