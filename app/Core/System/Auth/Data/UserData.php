<?php

namespace App\Core\System\Auth\Data;

use Spatie\LaravelData\Data;
use App\Core\System\Auth\Models\User;

class UserData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public array $permissions = [],
        public ?string $avatar_url = null,
    ) {}

    public static function fromModel(User $user): self
    {
        return self::from([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            'avatar_url' => 'https://ui-avatars.com/api/?name=' . urlencode($user->name),
        ]);
    }
}