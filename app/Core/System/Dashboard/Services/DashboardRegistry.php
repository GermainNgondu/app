<?php

namespace App\Core\System\Dashboard\Services;

use App\Core\System\Dashboard\Data\DashboardWidget;

class DashboardRegistry
{
    protected array $widgets = [];

    /**
     * Enregistrer un nouveau widget.
     */
    public function register(DashboardWidget $widget): void
    {
        $this->widgets[] = $widget;
    }

    /**
     * Récupérer tous les widgets triés et résolus.
     */
    public function resolveAll(): array
    {
        // 1. Trier par ordre
        usort($this->widgets, fn($a, $b) => $a->order <=> $b->order);

        // 2. Résoudre les données (exécuter les requêtes SQL de chaque widget)
        return array_map(fn($widget) => $widget->resolve(), $this->widgets);
    }
}