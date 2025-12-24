<?php

use Illuminate\Support\Facades\Route;
use App\Core\System\Auth\Actions\CreateAdminAction;
use App\Core\System\Installer\Data\DatabaseConfigData;
use App\Core\System\Installer\Actions\MigrateDatabaseAction;
use App\Core\System\Installer\Actions\CheckPermissionsAction;
use App\Core\System\Installer\Actions\WriteEnvironmentAction;
use App\Core\System\Installer\Actions\CheckRequirementsAction;
use App\Core\System\Installer\Actions\FinalizeInstallationAction;
use App\Core\System\Installer\Actions\TestDatabaseConnectionAction;

Route::prefix('install')->name('installer.')->group(function () {
    
    // Page d'accueil du Wizard (Blade qui charge React)
    Route::get('/', function () {
        return view('core::installer.index');
    })->name('index');

    // Endpoints API pour le Wizard React
    Route::get('/requirements', CheckRequirementsAction::class);
    Route::get('/permissions', CheckPermissionsAction::class);
    
    Route::post('/database', function (DatabaseConfigData $data) {
        try {
            
            TestDatabaseConnectionAction::run($data);
            WriteEnvironmentAction::run($data);

            return response()->json([
                'status' => 'success', 
                'message' => 'Configuration enregistrée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    });

    Route::post('/migrate', MigrateDatabaseAction::class);
    Route::post('/admin', CreateAdminAction::class);
    Route::post('/finalize', FinalizeInstallationAction::class);
});