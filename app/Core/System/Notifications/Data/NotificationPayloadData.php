<?php

namespace App\Core\System\Notifications\Data;

use Spatie\LaravelData\Data;
use App\Core\Support\Enums\NotificationType;
use Spatie\LaravelData\Support\Validation\ValidationContext;

class NotificationPayloadData extends Data
{
    public function __construct(
        public string $title,
        public string $body,
        public NotificationType $type = NotificationType::INFO,
        public ?string $action_url = null,
        public ?string $action_text = null,
        public array $channels = ['database'], // 'mail', 'database', 'broadcast'
    ) {}

    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'type' => ['required', 'string', 'in:info,success,warning,error'], // Validation via Enum backing value
            'action_url' => ['nullable', 'url'],
            'channels' => ['array'],
        ];
    }
}