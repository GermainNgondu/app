<?php

namespace App\Core\System\Dashboard\Services;

use Illuminate\Support\Facades\Auth;
use App\Core\System\Dashboard\Data\DashboardWidget;


class DashboardRegistry
{
    protected array $widgets = [];

    public function register(DashboardWidget $widget): void
    {
        $this->widgets[$widget->key] = $widget;
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

    /**
     * Résout les widgets en tenant compte des préférences utilisateur.
     */
    public function resolveForUser($user = null): array
    {
        $user = $user ?? Auth::user();
        $prefs = $user->preferences['dashboard'] ?? [];
        $order = $prefs['order'] ?? [];
        $hidden = $prefs['hidden'] ?? [];

        // 1. Filtrer les widgets masqués par l'utilisateur
        $visibleWidgets = array_filter($this->widgets, function($widget) use ($hidden) {
            return !in_array($widget->key, $hidden);
        });

        // 2. Trier selon l'ordre personnalisé, puis par l'ordre par défaut
        uasort($visibleWidgets, function ($a, $b) use ($order) {
            $posA = $order[$a->key] ?? $a->order + 1000;
            $posB = $order[$b->key] ?? $b->order + 1000;
            return $posA <=> $posB;
        });

        // 3. Résoudre les données
        return array_map(fn($widget) => $widget->resolve(), array_values($visibleWidgets));
    }
}