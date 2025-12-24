<?php

namespace App\Core\System\Intents;

use Illuminate\Support\Facades\App;

class IntentManager
{
    protected array $registry = [];

    /**
     * Enregistre un gestionnaire pour une intention donnée.
     */
    public function register(string $name, string|callable $handler): void
    {
        $this->registry[$name] = $handler;
    }

    /**
     * Exécute l'intention et retourne le résultat.
     */
    public function execute(string $name, ...$parameters): mixed
    {
        if (! $this->has($name)) {
            return null;
        }

        $handler = $this->registry[$name];

        // Résolution si c'est une Action (Classe)
        if (is_string($handler) && class_exists($handler)) {
            $instance = App::make($handler);
            
            return method_exists($instance, 'run') 
                ? $instance->run(...$parameters) 
                : $instance->handle(...$parameters);
        }

        // Résolution si c'est un Callable (Closure)
        return $handler(...$parameters);
    }

    public function has(string $name): bool
    {
        return isset($this->registry[$name]);
    }
}