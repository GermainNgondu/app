<?php

namespace App\Core\System\Auth\Services;

use Illuminate\Support\Facades\Auth;
use App\Core\System\Auth\Models\User;
use App\Core\Support\Contracts\UserProvider;

class EloquentUserProvider implements UserProvider
{
    public function findById(int $id): ?User
    {
        return User::find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function current(): ?User
    {
        return Auth::user();
    }
}