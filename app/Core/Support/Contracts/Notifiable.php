<?php

namespace App\Core\Support\Contracts;

/**
 * Interface marqueur pour s'assurer qu'un modèle peut recevoir des notifs
 * (Souvent déjà couvert par le trait Notifiable de Laravel, mais utile pour le typage strict)
 */
interface Notifiable
{
    public function routeNotificationFor($driver, $notification = null);
}