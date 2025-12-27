<?php

namespace App\Core\System\Dashboard\Actions;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Dashboard\Services\DashboardRegistry;

class GetDashboardWidgetsAction
{
    use AsAction;

    public function __construct(protected DashboardRegistry $registry) {}

    public function handle(): array
    {
        $user = Auth::user();
        $widgets = $this->registry->resolveForUser();
    
        // Vérification : si preferences est bien un tableau et contient l'ordre
        if (is_array($user->preferences) && isset($user->preferences['dashboard_order'])) {
            $orderMap = $user->preferences['dashboard_order'];
        
            usort($widgets, function($a, $b) use ($orderMap) {
                // On récupère la position sauvegardée, sinon on met à la fin (1000+)
                $orderA = $orderMap[$a['key']] ?? ($a['order'] + 1000);
                $orderB = $orderMap[$b['key']] ?? ($b['order'] + 1000);
                
                return $orderA <=> $orderB;
            });
        }

        return $widgets;
    }

    public function asController(Request $request)
    {
        return response()->json([
            'data' => $this->handle()
        ]);
    }
}
