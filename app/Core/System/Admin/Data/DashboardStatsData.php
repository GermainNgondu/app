<?php

namespace App\Core\System\Admin\Data;

use Spatie\LaravelData\Data;

class DashboardStatsData extends Data
{
    public function __construct(
        public int $total_users,
        public int $active_features_count,
        public int $total_media_size_mb,
        public array $recent_activities,
    ) {}
}