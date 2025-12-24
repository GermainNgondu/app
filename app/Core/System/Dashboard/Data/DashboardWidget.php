<?php

namespace App\Core\System\Dashboard\Data;

use Closure;

class DashboardWidget
{
    public string $key;
    public string $title;
    public string $type = 'stat'; // 'stat', 'chart', 'list'
    public string $icon = 'Activity';
    public int $width = 1; // 1 à 4 (pour la grille)
    public int $order = 100;
    protected $dataProvider; // La logique pour récupérer la donnée

    public static function make(string $key): self
    {
        $instance = new self();
        $instance->key = $key;
        return $instance;
    }

    public function title(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function type(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function icon(string $icon): self
    {
        $this->icon = $icon;
        return $this;
    }

    public function width(int $width): self
    {
        $this->width = $width;
        return $this;
    }

    public function order(int $order): self
    {
        $this->order = $order;
        return $this;
    }

    /**
     * Définit la logique de récupération de données.
     * Peut être une closure ou une classe invokable.
     */
    public function value(Closure|callable $callback): self
    {
        $this->dataProvider = $callback;
        return $this;
    }

    /**
     * Résout la donnée finale pour l'envoyer au frontend.
     */
    public function resolve(): array
    {
        $data = $this->dataProvider ? call_user_func($this->dataProvider) : null;

        return [
            'key' => $this->key,
            'title' => $this->title,
            'type' => $this->type,
            'icon' => $this->icon,
            'width' => $this->width,
            'order' => $this->order,
            // On fusionne le résultat du dataProvider (ex: value, trend)
            'data' => $data, 
        ];
    }
}