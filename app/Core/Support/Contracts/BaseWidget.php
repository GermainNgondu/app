<?php 

namespace App\Core\Support\Contracts;

abstract class BaseWidget
{
    /**
     * Le titre du widget (ex: "Factures impayées")
     */
    abstract public function title(): string;

    /**
     * La largeur du widget (ex: 1/2, 1/3, full)
     * Utile pour la grille CSS (Tailwind)
     */
    public function width(): string
    {
        return '1/3'; 
    }

    /**
     * Les données ou la vue du widget
     */
    abstract public function render();
}