<?php

namespace App\Core\Support\Data;

use Spatie\LaravelData\Data;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Throwable;

class MenuItemData extends Data
{
    public function __construct(
        public string $label,
        public string $route,
        public string $icon = 'Circle',
        public string $group = '',
        public int $order = 10,
        public ?string $url = '#',
        public bool $active = false,
    ) {}

    /**
     * Crée une instance sécurisée à partir d'un tableau brut
     */
    public static function fromRegistry(array $payload): self
    {
        $routeName = $payload['route'] ?? '';
        $url = '#';
        $active = false;

        if (!empty($routeName) && Route::has($routeName)) {
            try {
                // On tente de générer l'URL. 
                // Si la route demande des paramètres (ex: {id}), cela échouera.
                $url = route($routeName);
                $active = request()->routeIs($routeName . '*');
            } catch (Throwable $e) {
                // On log l'erreur pour le développeur mais on ne bloque pas l'app
                Log::warning("MenuRegistry: Impossible de générer l'URL pour [{$routeName}]. " . $e->getMessage());
            }
        }

        return new self(
            label: __($payload['label'] ?? 'Untitled'),
            route: $routeName,
            icon: $payload['icon'] ?? 'Circle',
            group: __($payload['group'] ?? ''),
            order: (int) ($payload['order'] ?? 10),
            url: $url,
            active: $active
        );
    }
}