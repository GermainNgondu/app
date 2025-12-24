<?php

namespace App\Core\System\Admin\Actions;

use App\Core\System\Auth\Models\User;
use App\Core\System\Features\Models\Feature;
use App\Core\System\Admin\Data\DashboardStatsData;
use Lorisleiva\Actions\Concerns\AsAction;
use Spatie\Activitylog\Models\Activity;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GetDashboardStatsAction
{
    use AsAction;

    public function handle(): DashboardStatsData
    {
        return new DashboardStatsData(
            total_users: User::count(),
            active_features_count: Feature::where('is_active', true)->count(),
            total_media_size_mb: (int) (Media::sum('size') / 1024 / 1024),
            recent_activities: Activity::latest()->limit(5)->get()->toArray(),
        );
    }
}