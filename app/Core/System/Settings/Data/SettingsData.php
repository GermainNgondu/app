<?php

namespace App\Core\System\Settings\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Url;

class SettingsData extends Data
{
    public function __construct(
        #[Required, StringType, Max(50)]
        public string $app_name,

        #[Nullable, StringType, Max(255)]
        public ?string $app_description,

        #[Nullable, Url]
        public ?string $app_url,

        #[Nullable, StringType]
        public ?string $app_logo,

        #[Nullable, StringType]
        public ?string $app_favicon,

        #[Required, In(['fr', 'en', 'es'])]
        public string $app_locale,

        #[Required, StringType]
        public string $app_timezone,

        #[BooleanType]
        public bool $maintenance_mode,
        
        // Champs optionnels supplémentaires
        #[Nullable, Url]
        public ?string $social_twitter,

        #[Nullable, Url]
        public ?string $social_facebook,
    ) {}
}