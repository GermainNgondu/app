<?php

namespace App\Core\Support\Facades;

use Illuminate\Support\Facades\Facade;
use App\Core\Support\Registries\CommandRegistry;

class CommandPalette extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return CommandRegistry::class;
    }
}