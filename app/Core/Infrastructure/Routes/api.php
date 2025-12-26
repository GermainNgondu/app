<?php

use Illuminate\Support\Facades\Route;
use App\Core\Support\Helpers\TranslationHelper;
use App\Core\System\Settings\Actions\GetSettingsAction;
use App\Core\System\Updater\Actions\InstallUpdateAction;
use App\Core\System\Auth\Actions\UpdateUserProfileAction;
use App\Core\System\Updater\Actions\CheckForUpdateAction;
use App\Core\System\Updater\Actions\DownloadUpdateAction;
use App\Core\System\Settings\Actions\UpdateSettingsAction;
use App\Core\System\Dashboard\Actions\ReorderWidgetsAction;
use App\Core\System\Updater\Actions\UploadUpdateFileAction;
use App\Core\System\Dashboard\Actions\GetDashboardStatsAction;
use App\Core\System\Dashboard\Actions\GetDashboardWidgetsAction;


Route::get('/lang/{locale}', function ($locale) {

    $check =  collect(TranslationHelper::getAvailableLocales())->where('code',$locale)->first();

    if (!$check) {
        abort(404);
    }
    
    app()->setLocale($locale);
    
    return response()->json(json_decode(TranslationHelper::getJsonTranslations(), true));
});

Route::middleware(['web', 'auth'])->prefix('admin')->group(function () {
    
    Route::get('settings', GetSettingsAction::class)->name('admin.api.settings.show');
    Route::post('settings', UpdateSettingsAction::class)->name('admin.settings.update');

    Route::get('dashboard/stats', GetDashboardStatsAction::class)->name('admin.api.dashboard.stats');
    Route::get('dashboard/widgets', GetDashboardWidgetsAction::class)->name('admin.api.dashboard.widgets');
    Route::post('dashboard/reorder', ReorderWidgetsAction::class)->name('admin.api.dashboard.reorder');
    Route::post('profile', UpdateUserProfileAction::class)->name('admin.api.profile.update');


    Route::prefix('system/update')->name('system.update')->group(function() {

        Route::get('/check', CheckForUpdateAction::class)->name('.check');
        Route::post('/download', DownloadUpdateAction::class)->name('.download');
        Route::post('/upload', UploadUpdateFileAction::class)->name('.upload');
        Route::post('/install', InstallUpdateAction::class)->name('.install');
    });
});