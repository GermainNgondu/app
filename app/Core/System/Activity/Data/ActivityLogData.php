<?php

namespace App\Core\System\Activity\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\ValidationContext;
use Spatie\Activitylog\Models\Activity;

class ActivityLogData extends Data
{
    public function __construct(
        public int $id,
        public string $description,
        public ?string $causer_name, // Qui a fait l'action
        public ?string $subject_type, // Sur quoi (ex: Invoice)
        public ?string $event,        // created, updated, deleted
        public array $properties,     // Détails (ancien/nouveau)
        public string $created_at_human,
    ) {}

    /**
     * Signature stricte respectée avec ValidationContext
     */
    public static function rules(ValidationContext|null $context = null): array
    {
        return [
            'description' => ['required', 'string'],
            'event' => ['nullable', 'string'],
            'properties' => ['array'],
        ];
    }

    public static function fromModel(Activity $activity): self
    {
        return new self(
            id: $activity->id,
            description: $activity->description,
            causer_name: $activity->causer ? $activity->causer->name : 'Système',
            subject_type: $activity->subject_type ? class_basename($activity->subject_type) : null,
            event: $activity->event,
            properties: $activity->properties->toArray(),
            created_at_human: $activity->created_at->diffForHumans(),
        );
    }
}