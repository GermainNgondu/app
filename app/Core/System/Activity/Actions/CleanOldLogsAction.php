<?php

namespace App\Core\System\Activity\Actions;

use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsCommand;
use Spatie\Activitylog\Models\Activity;

class CleanOldLogsAction
{
    use AsAction, AsCommand;

    public $commandSignature = 'system:clean-logs';
    public $commandDescription = 'Supprime les logs de plus de 30 jours';

    public function handle(): void
    {
        // Supprime les logs de plus de 30 jours
        Activity::where('created_at', '<', now()->subDays(30))->delete();
    }
}