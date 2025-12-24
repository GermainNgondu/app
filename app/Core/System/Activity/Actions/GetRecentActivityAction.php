<?php

namespace App\Core\System\Activity\Actions;


use Spatie\Activitylog\Models\Activity;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Activity\Data\ActivityLogData;

class GetRecentActivityAction
{
    use AsAction;

    public function handle(int $limit = 10)
    {
        return Activity::with('causer')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn($log) => ActivityLogData::fromModel($log));
    }
}