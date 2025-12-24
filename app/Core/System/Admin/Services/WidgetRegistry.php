<?php
namespace App\Core\System\Admin\Services;

class WidgetRegistry
{
    protected array $widgets = [];

    /**
     * Permet à une Feature d'enregistrer un widget
     */
    public function register(string $widgetClass): void
    {
        $this->widgets[] = $widgetClass;
    }

    /**
     * Récupère toutes les instances de widgets enregistrés
     */
    public function getWidgets(): array
    {
        return collect($this->widgets)
            ->map(fn($widget) => app($widget))
            ->toArray();
    }
}