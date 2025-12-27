<?php
namespace App\Core\Infrastructure\Providers;

use App\Core\Support\Facades\Menu;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;
use App\Core\System\Auth\Models\User;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use App\Core\System\Intents\IntentManager;
use App\Core\System\Intents\Facades\Intent;
use App\Core\Support\Contracts\UserProvider;
use App\Core\Support\Facades\CommandPalette;
use App\Core\System\Features\FeatureManager;
use App\Core\Support\Registries\CommandRegistry;
use App\Core\System\Admin\Actions\ClearCacheAction;
use App\Core\System\Dashboard\Data\DashboardWidget;
use App\Core\System\Admin\Actions\OptimizeSystemAction;
use App\Core\System\Auth\Services\EloquentUserProvider;
use App\Core\System\Dashboard\Services\DashboardRegistry;
use App\Core\System\Features\Commands\MakeFeatureCommand;
use App\Core\System\Activity\Actions\LogManualActivityAction;
use App\Core\System\Notifications\Actions\SendNotificationAction;


class CoreServiceProvider extends ServiceProvider
{
    /**
     * Register Singletons and base services.
     */
    public function register(): void
    {
        $this->app->singleton(CommandRegistry::class);
        
        $this->app->singleton(DashboardRegistry::class);

        $this->app->singleton(IntentManager::class, fn() => new IntentManager());

        $this->app->singleton(FeatureManager::class, fn() => new FeatureManager());

        $this->app->bind(UserProvider::class, EloquentUserProvider::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $composerData = json_decode(file_get_contents(base_path('composer.json')), true);
        $appVersion = $composerData['version'] ?? '1.0.0';

        View::share('appVersion', $appVersion);

        $this->registerCoreResources();
        $this->registerCoreRoutes();

        if ($this->appIsInstalled()) {
            $this->bootActiveFeatures();
        }

        if ($this->app->runningInConsole()) {
            $this->commands([
                MakeFeatureCommand::class,
            ]);
        }

        $this->bootMenu();
        $this->bootDashboard();
        $this->bootCoreCommands();
        $this->bootBladeDirectives();

        Intent::register('core.notify', SendNotificationAction::class);
        Intent::register('core.log', LogManualActivityAction::class);
        Intent::register('core.optimize', OptimizeSystemAction::class);
        Intent::register('core.clear_cache', ClearCacheAction::class);
    }

    /**
     * Check if the application is ready to query the database
     */
    protected function appIsInstalled(): bool
    {
        // Vérification du fichier témoin en priorité
        if (! File::exists(storage_path('installed'))) {
            return false;
        }

        // On peut mettre en cache le résultat de la vérification de table pour éviter les requêtes SQL SQL
        return Cache::rememberForever('system_installed_db_check', function() {
            try {
                return Schema::hasTable('features');
            } catch (\Exception $e) {
                return false;
            }
        });
    }

    /**
     * Configure the Core menu.
     */
    private function bootMenu(): void
    {
        Menu::register([
            'label' => 'Dashboard',
            'icon' => 'LayoutDashboard',
            'route' => 'admin.dashboard',
            'order' => 1,
        ]);
    }

    private function bootDashboard(): void
    {
        $registry = $this->app->make(DashboardRegistry::class);

        // Widget 1 : Utilisateurs Totaux
        $registry->register(
            DashboardWidget::make('total_users')
                ->title('users')
                ->icon('Users')
                ->order(10)
                ->value(function () {
                    return [
                        'value' => User::count(),
                        'trend' => '+12% cette semaine' // Tu pourrais calculer ça dynamiquement
                    ];
                })
        );

        // Widget 2 : État du Système
        $registry->register(
            DashboardWidget::make('system_status')
                ->title('État Système')
                ->icon('Activity')
                ->order(20)
                ->value(fn() => ['value' => 'Opérationnel', 'color' => 'text-green-500'])
        );
    }
    
    private function bootCoreCommands(): void
    {
        CommandPalette::register([
            'label' => 'Tableau de bord',
            'icon' => 'LayoutDashboard',
            'type' => 'nav',
            'value' => '/admin/dashboard',
            'group' => 'Navigation'
        ]);
        CommandPalette::register([
            'label' => 'Paramètres',
            'icon' => 'Settings',
            'type' => 'nav',
            'value' => '/admin/settings',
            'group' => 'Navigation'
        ]);

        CommandPalette::register([
            'label' => 'Vider le cache',
            'icon' => 'Trash2',
            'type' => 'intent',
            'value' => 'core.clear_cache',
            'group' => 'Système'
        ]);
        CommandPalette::register([
            'label' => 'Optimiser le système',
            'icon' => 'Zap',
            'type' => 'intent',
            'value' => 'core.optimize',
            'group' => 'Système'
        ]);
    }
    /**
     * Définition des directives Blade personnalisées (@react / @endreact).
     */
    private function bootBladeDirectives(): void
    {
        // Directive : @react('Component', ['props' => ...])
        Blade::directive('react', function ($expression) {
            return <<<PHP
                <?php
                    // 1. Parsing des arguments (Nom + Props)
                    \$__reactParams = [{$expression}];
                    \$__componentName = \$__reactParams[0] ?? '';
                    \$__reactProps = \$__reactParams[1] ?? [];

                    // 2. Démarrage de la capture du contenu HTML (Slot)
                    ob_start();
                ?>
                PHP;
        });

        // Directive : @endreact
        Blade::directive('endreact', function () {
            return <<<PHP
                <?php
                    // 3. Récupération et nettoyage du buffer
                    \$__slotContent = ob_get_clean();

                    // 4. Injection du contenu HTML dans les props
                    \$__reactProps['innerHtml'] = \$__slotContent;

                    // 5. Rendu via le service (Résolu via le conteneur)
                    echo app(\App\Core\Support\Helpers\ReactRender::class)
                            ->make(\$__componentName, \$__reactProps);

                    // 6. Nettoyage des variables temporaires
                    unset(\$__componentName, \$__reactProps, \$__reactParams, \$__slotContent);
                ?>
                PHP;
        });
    }

    /**
     * Load migrations, views and translations from the Core.
     */
    protected function registerCoreResources(): void
    {
        //Chargement intelligent des migrations
        $migrationPaths = [app_path('Core/Database/Migrations')];
        
        // Permet de charger des migrations situées dans des sous-dossiers de System
        $systemPaths = File::directories(app_path('Core/System'));
        foreach ($systemPaths as $path) {
            if (File::isDirectory($path . '/Database/Migrations')) {
                $migrationPaths[] = $path . '/Database/Migrations';
            }
        }

        $this->loadMigrationsFrom($migrationPaths);
        $this->loadViewsFrom(app_path('Core/Resources/views'), 'core');
        $this->loadJsonTranslationsFrom(app_path('Core/Resources/lang'));
        $this->loadTranslationsFrom(app_path('Core/Resources/lang'), 'core');
    }

    /**
     * Load core routes.
     */
    protected function registerCoreRoutes(): void
    {
        Route::middleware('web')->prefix('admin')->group(app_path('Core/Infrastructure/Routes/auth.php'));
        Route::middleware('web')->group(app_path('Core/Infrastructure/Routes/admin.php'));
        Route::middleware('web')->group(app_path('Core/Infrastructure/Routes/installer.php'));
        Route::middleware('api')->prefix('api')->group(app_path('Core/Infrastructure/Routes/api.php'));
    }

    /**
     * Start dynamically active features.
     */
    protected function bootActiveFeatures(): void
    {
        $manager = app(FeatureManager::class);

        foreach ($manager->getActiveFeatures() as $feature) {

            $providerClass = "App\\Features\\" . ucfirst($feature->name) . "\\Providers\\" . ucfirst($feature->name) . "ServiceProvider";

            if (class_exists($providerClass)) {
                $this->app->register($providerClass);
            }
        }
    }
}