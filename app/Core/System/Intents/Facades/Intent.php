<?php

namespace App\Core\System\Intents\Facades;

use Illuminate\Support\Facades\Facade;
use App\Core\System\Intents\IntentManager;

/**
 * @method static void register(string $name, string|callable $handler)
 * @method static mixed execute(string $name, ...$parameters)
 * @method static bool has(string $name)
 */
class Intent extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return IntentManager::class;
    }
}