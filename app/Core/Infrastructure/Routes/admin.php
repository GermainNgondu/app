<?php

use Illuminate\Support\Facades\Route;
use App\Core\System\Admin\Actions\DashboardAction;
use App\Core\System\Media\Actions\UploadMediaAction;
use App\Core\System\Media\Actions\GetMediaListAction;
use App\Core\System\Media\Actions\SearchUnsplashAction;
use App\Core\System\Media\Actions\UploadFromUnsplashAction;
use App\Core\System\Media\Actions\UploadMediaFromUrlAction;
use App\Core\System\Media\Actions\GenerateAndUploadAiImageAction;

Route::middleware(['web', 'auth'])->prefix('admin')->group(function () {
    
    Route::get('/dashboard', DashboardAction::class)->name('admin.dashboard');

    Route::get('/settings', function () {
        return view('core::admin.settings');
    })->name('admin.settings');

    Route::get('profile', function () {
        return view('core::admin.profile');
    })->name('admin.profile.edit');

    Route::prefix('system/update')->name('system.update')->group(function() {

        Route::get('/', function () {
            return view('core::admin.updater');
        });

    });

    Route::prefix('media')->group(function () {

        Route::get('/', GetMediaListAction::class)->name('admin.media.index');
        
        Route::get('unsplash/search', SearchUnsplashAction::class)->name('admin.media.unsplash.search');

        Route::post('upload', UploadMediaAction::class)->name('admin.media.upload');

        Route::post('upload-url', UploadMediaFromUrlAction::class)->name('admin.media.upload-url');
        Route::post('unsplash/save', UploadFromUnsplashAction::class)->name('admin.media.unsplash.save');

        Route::post('ai/generate', GenerateAndUploadAiImageAction::class)->name('admin.media.ai.generate');

    });

});