<?php

namespace App\Core\System\Admin\Actions;

use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Admin\Services\WidgetRegistry;

class DashboardAction
{
    use AsAction;

    public function handle(WidgetRegistry $registry)
    {
        return $registry->getWidgets();
    }

    public function asController(WidgetRegistry $registry)
    {
        return view('core::admin.dashboard', [
            'widgets' => $this->handle($registry)
        ]);
    }
}