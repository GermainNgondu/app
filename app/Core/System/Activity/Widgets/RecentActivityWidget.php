<?php

namespace App\Core\System\Activity\Widgets;

use App\Core\Support\Contracts\BaseWidget;
use App\Core\System\Activity\Actions\GetRecentActivityAction;

class RecentActivityWidget extends BaseWidget
{
    public function title(): string
    {
        return 'Activités Récentes';
    }

    public function width(): string
    {
        return 'full'; // Prend toute la largeur
    }

    public function render()
    {
        $activities = GetRecentActivityAction::run(5);

        // Note: Assurez-vous d'avoir la vue correspondante
        return view('core::activity.widgets.list', [
            'activities' => $activities
        ]);
    }
}