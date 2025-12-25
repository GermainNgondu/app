<?php

namespace App\Core\System\Settings\Actions;

use DateTimeZone;
use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Settings\Models\Setting;
use App\Core\Support\Helpers\TranslationHelper;

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
                'timezones' => DateTimeZone::listIdentifiers(),
                'locales' => TranslationHelper::getAvailableLocales()
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