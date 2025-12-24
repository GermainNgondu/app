<?php

namespace App\Core\Support\Helpers;

use Illuminate\Support\Facades\File;

class TranslationHelper
{
    public static function getJsonTranslations(): string
    {
        $locale = app()->getLocale();
        $path = lang_path("{$locale}.json");

        if (!File::exists($path)) {
            return '{}';
        }

        return File::get($path);
    }
}