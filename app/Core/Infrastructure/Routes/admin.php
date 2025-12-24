<?php

use Illuminate\Support\Facades\Route;
use App\Core\System\Admin\Actions\DashboardAction;
use App\Core\System\Media\Actions\UploadMediaAction;
use App\Core\System\Media\Actions\GetMediaListAction;
use App\Core\System\Media\Actions\SearchUnsplashAction;
use App\Core\System\Settings\Actions\GetSettingsAction;
use App\Core\System\Auth\Actions\UpdateUserProfileAction;
use App\Core\System\Settings\Actions\UpdateSettingsAction;
use App\Core\System\Dashboard\Actions\ReorderWidgetsAction;
use App\Core\System\Media\Actions\UploadFromUnsplashAction;
use App\Core\System\Media\Actions\UploadMediaFromUrlAction;
use App\Core\System\Dashboard\Actions\GetDashboardStatsAction;
use App\Core\System\Dashboard\Actions\GetDashboardWidgetsAction;
use App\Core\System\Media\Actions\GenerateAndUploadAiImageAction;

Route::middleware(['web', 'auth'])->prefix('admin')->group(function () {
    
    // Le Dashboard (appelle asController() automatiquement)
    Route::get('/dashboard', DashboardAction::class)->name('admin.dashboard');

    Route::get('/settings', function () {
        return view('core::admin.settings');
    })->name('admin.settings');
    
    Route::get('api/settings', GetSettingsAction::class)->name('admin.api.settings.show');
    Route::post('api/settings', UpdateSettingsAction::class)->name('admin.settings.update');

    Route::get('api/dashboard/stats', GetDashboardStatsAction::class)->name('admin.api.dashboard.stats');
    // Route pour récupérer tous les widgets dynamiques
    Route::get('api/dashboard/widgets', GetDashboardWidgetsAction::class)->name('admin.api.dashboard.widgets');

    // Route pour sauvegarder le nouvel ordre après un Drag & Drop
    Route::post('api/dashboard/reorder', ReorderWidgetsAction::class)->name('admin.api.dashboard.reorder');
    
    // Page d'affichage (Blade -> React)
    Route::get('profile', function () {
        return view('core::admin.profile'); // Vue wrapper simple
    })->name('admin.profile.edit');

    // API de mise à jour
    Route::post('api/profile', UpdateUserProfileAction::class)->name('admin.api.profile.update');

    Route::prefix('media')->group(function () {

        // --- LECTURE (READ) ---
        // Remplace MediaController@index
        Route::get('/', GetMediaListAction::class)->name('admin.media.index');
        
        // Remplace MediaController@searchUnsplash
        Route::get('unsplash/search', SearchUnsplashAction::class)->name('admin.media.unsplash.search');


        // --- ÉCRITURE (WRITE) ---
        
        // 1. Upload Standard (Drag & Drop)
        Route::post('upload', UploadMediaAction::class)->name('admin.media.upload');

        // 2. Upload depuis URL externe
        Route::post('upload-url', UploadMediaFromUrlAction::class)->name('admin.media.upload-url');

        // 3. Sauvegarder depuis Unsplash (Téléchargement effectif)
        Route::post('unsplash/save', UploadFromUnsplashAction::class)->name('admin.media.unsplash.save');

        // 4. Générer via IA
        Route::post('ai/generate', GenerateAndUploadAiImageAction::class)->name('admin.media.ai.generate');

    });
});