<?php

namespace App\Core\Support\Contracts;

interface UserProvider
{
    public function findById(int $id): ?object;
    public function findByEmail(string $email): ?object;
    public function create(array $data): object;
    public function current(): ?object;
}