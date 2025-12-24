<?php
namespace App\Core\Infrastructure\Providers;

use App\Core\Support\Facades\Menu;
use Illuminate\Support\Facades\File;
use App\Core\System\Auth\Models\User;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use App\Core\System\Intents\IntentManager;
use App\Core\System\Intents\Facades\Intent;
use App\Core\System\Features\FeatureManager;
use App\Core\Support\Registries\MenuRegistry;
use App\Core\System\Dashboard\Data\DashboardWidget;
use App\Core\System\Dashboard\Services\DashboardRegistry;
use App\Core\System\Activity\Actions\LogManualActivityAction;
use App\Core\System\Notifications\Actions\SendNotificationAction;

class CoreServiceProvider extends ServiceProvider
{
    /**
     * Enregistrement des Singletons et services de base.
     */
    public function register(): void
    {
        $this->app->singleton(DashboardRegistry::class);
        // Enregistre l'IntentManager (Singleton)
        $this->app->singleton(IntentManager::class, fn() => new IntentManager());

        // Enregistre le FeatureManager (Singleton)
        $this->app->singleton(FeatureManager::class, fn() => new FeatureManager());
    }

    /**
     * Bootstrapping de la plateforme.
     */
    public function boot(): void
    {
        
        $this->registerCoreResources();
        $this->registerCoreRoutes();

        if ($this->appIsInstalled()) {
            $this->bootActiveFeatures();
        }

        $this->bootMenu();
        $this->bootDashboard();
        $this->bootBladeDirectives();

        // Enregistrement de l'Intent
        Intent::register('core.notify', SendNotificationAction::class);
        Intent::register('core.log', LogManualActivityAction::class);

    }

    /**
     * Vérifie si l'application est prête à requêter la base de données
     */
    protected function appIsInstalled(): bool
    {
        // On vérifie l'existence du fichier créé par l'installeur
        $installed = File::exists(storage_path('installed'));

        // Sécurité supplémentaire : si on est en ligne de commande (migrations), 
        // on évite aussi de bloquer le processus
        if ($this->app->runningInConsole()) {
            // Optionnel : on peut vérifier si la table existe vraiment
            // return Schema::hasTable('features');
            return $installed; 
        }

        return $installed;
    }

    /**
     * Configuration du Menu du Core.
     */
    private function bootMenu(): void
    {
        Menu::register([
            'label' => 'Dashboard',
            'icon'  => 'LayoutDashboard',
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
                ->title('Utilisateurs')
                ->icon('Users')
                ->order(10)
                ->value(function() {
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
     * Charge les migrations, vues et traductions du Core.
     */
    protected function registerCoreResources(): void
    {
        $this->loadMigrationsFrom(app_path('Core/Database/Migrations'));
        $this->loadViewsFrom(app_path('Core/Resources/views'), 'core');
        $this->loadJsonTranslationsFrom(app_path('Core/Resources/lang'));
    }

    /**
     * Charge les routes standards (Web et API) du Core.
     */
    protected function registerCoreRoutes(): void
    {
        Route::middleware('web')->prefix('admin')->group(app_path('Core/Infrastructure/Routes/auth.php'));
        Route::middleware('web')->group(app_path('Core/Infrastructure/Routes/admin.php'));
        Route::middleware('web')->group(app_path('Core/Infrastructure/Routes/installer.php'));
        Route::middleware('api')->prefix('api')->group(app_path('Core/Infrastructure/Routes/api.php'));
    }

    /**
     * Démarre dynamiquement les Features actives.
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