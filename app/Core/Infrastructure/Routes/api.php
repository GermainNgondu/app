<?php

use Illuminate\Support\Facades\Route;
use App\Core\System\Settings\Actions\GetSettingsAction;
use App\Core\System\Auth\Actions\UpdateUserProfileAction;
use App\Core\System\Settings\Actions\UpdateSettingsAction;
use App\Core\System\Dashboard\Actions\ReorderWidgetsAction;
use App\Core\System\Dashboard\Actions\GetDashboardStatsAction;
use App\Core\System\Dashboard\Actions\GetDashboardWidgetsAction;

Route::middleware(['web', 'auth'])->prefix('admin')->group(function () {
    
    Route::get('settings', GetSettingsAction::class)->name('admin.api.settings.show');
    Route::post('settings', UpdateSettingsAction::class)->name('admin.settings.update');

    Route::get('dashboard/stats', GetDashboardStatsAction::class)->name('admin.api.dashboard.stats');
    Route::get('dashboard/widgets', GetDashboardWidgetsAction::class)->name('admin.api.dashboard.widgets');
    Route::post('dashboard/reorder', ReorderWidgetsAction::class)->name('admin.api.dashboard.reorder');
    Route::post('profile', UpdateUserProfileAction::class)->name('admin.api.profile.update');
});