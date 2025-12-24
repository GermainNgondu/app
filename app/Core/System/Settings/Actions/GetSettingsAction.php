<?php

namespace App\Core\System\Settings\Actions;

use DateTimeZone;
use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Settings\Models\Setting;

class GetSettingsAction
{
    use AsAction;

    public function handle(): array
    {
        return [
            // 1. Les valeurs actuelles (clé => valeur)
            'values' => Setting::pluck('value', 'key')->toArray(),
            
            // 2. Les métadonnées (Options pour les selecteurs)
            'meta' => [
                'timezones' => DateTimeZone::listIdentifiers(), // Liste officielle PHP
                'locales' => [
                    ['code' => 'fr', 'label' => 'Français'],
                    ['code' => 'en', 'label' => 'English'],
                    ['code' => 'es', 'label' => 'Español'],
                    ['code' => 'ar', 'label' => 'Arabe'],
                    // Tu pourras ajouter d'autres langues ici dynamiquement via config
                ]
            ]
        ];
    }

    public function asController(Request $request)
    {
        return response()->json([
            'data' => $this->handle()
        ]);
    }
}