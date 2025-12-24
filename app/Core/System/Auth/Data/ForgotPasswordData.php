<?php

namespace App\Core\System\Auth\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class ForgotPasswordData extends Data
{
    public function __construct(
        public string $email,
    ) {}

    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
        ];
    }
}