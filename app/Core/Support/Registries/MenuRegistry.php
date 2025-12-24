<?php

namespace App\Core\Support\Registries;

use App\Core\Support\Data\MenuItemData;

class MenuRegistry
{
    protected array $items = [];

    public function register(array|MenuItemData $item): void
    {
        $this->items[] = is_array($item) ? $item : $item->toArray();
    }

public function getMenu(): array
    {
        return collect($this->items)
            ->map(function ($item) {
                // On transforme chaque item via le DTO sécurisé
                return MenuItemData::fromRegistry($item);
            })
            ->sortBy('order')
            ->groupBy('group')
            ->toArray();
    }
}