<?php

namespace App\Core\Infrastructure\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Core\System\Features\FeatureManager;

class EnsureFeatureIsActive
{
    public function handle(Request $request, Closure $next, string $featureName)
    {
        if (! app(FeatureManager::class)->isActive($featureName)) {
            return abort(404, "La fonctionnalité {$featureName} n'est pas activée.");
        }

        return $next($request);
    }
}