<?php

namespace App\Core\Support\Enums;

enum Status: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case DELETED = 'deleted';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'En attente',
            self::ACTIVE => 'Actif',
            self::INACTIVE => 'Inactif',
            self::DELETED => 'Supprimé',
        };
    }
}