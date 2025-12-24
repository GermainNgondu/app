<?php

namespace App\Core\Support\Facades;

use Illuminate\Support\Facades\Facade;
use App\Core\Support\Registries\MenuRegistry;


class Menu extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return MenuRegistry::class;
    }
}