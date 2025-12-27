<?php

namespace App\Core\Support\Registries;

class CommandRegistry
{
    protected array $commands = [];

    /**
     * Enregistre une ou plusieurs commandes.
     */
    public function register(array $command): void
    {
        $this->commands[] = $command;
    }

    /**
     * Récupère toutes les commandes enregistrées.
     */
    public function getCommands(): array
    {
        return $this->commands;
    }
}