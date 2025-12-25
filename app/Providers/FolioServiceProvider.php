<?php

namespace App\Providers;

use Laravel\Folio\Folio;
use Illuminate\Support\ServiceProvider;
use App\Core\System\Installer\Http\Middleware\RedirectToInstaller;

class FolioServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Folio::path(resource_path('views/pages'))->middleware([
            '*' => [
                RedirectToInstaller::class,
            ],
        ]);
    }
}
