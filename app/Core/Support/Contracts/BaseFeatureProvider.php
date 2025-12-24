<?php

namespace App\Core\Support\Contracts;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

abstract class BaseFeatureProvider extends ServiceProvider
{
    /**
     * Le nom de la feature (ex: billing, orders)
     */
    protected string $featureName;

    /**
     * Le chemin racine de la feature
     */
    protected string $featurePath;

    public function register(): void
    {
        $this->featureName = $this->getFeatureName();
        $this->featurePath = app_path("Features/" . ucfirst($this->featureName));

        $this->registerIntents();
    }

    public function boot(): void
    {
        $this->loadRoutes();
        $this->loadViews();
        $this->loadTranslations();
    }

    /**
     * À surcharger dans la Feature pour enregistrer les Intents
     */
    protected function registerIntents(): void 
    {
        //
    }

    protected function loadRoutes(): void
    {
        $webRoutes = "{$this->featurePath}/Routes/web.php";
        $apiRoutes = "{$this->featurePath}/Routes/api.php";

        if (File::exists($webRoutes)) {
            Route::middleware('web')->group($webRoutes);
        }

        if (File::exists($apiRoutes)) {
            Route::middleware('api')->prefix('api')->group($apiRoutes);
        }
    }

    protected function loadViews(): void
    {
        $viewPath = "{$this->featurePath}/Resources/views";
        if (File::isDirectory($viewPath)) {
            $this->loadViewsFrom($viewPath, $this->featureName);
        }
    }

    protected function loadTranslations(): void
    {
        $langPath = "{$this->featurePath}/Resources/lang";
        if (File::isDirectory($langPath)) {
            $this->loadJsonTranslationsFrom($langPath);
        }
    }

    abstract protected function getFeatureName(): string;
}