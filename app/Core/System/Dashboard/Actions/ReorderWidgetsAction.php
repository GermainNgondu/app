<?php

namespace App\Core\System\Dashboard\Actions;

use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Support\Facades\Auth;

class ReorderWidgetsAction
{
    use AsAction;

    /**
     * Logique de mise à jour de l'ordre des widgets.
     */
    public function handle(array $widgetsOrder, $user)
    {
        // 1. On récupère les préférences actuelles de l'utilisateur
        // On suppose que tu as une colonne 'preferences' de type JSON sur ta table users
        $preferences = $user->preferences ?? [];
        
        // 2. On extrait le nouvel ordre
        // On crée un tableau associatif : ['widget_key' => position]
        $newOrder = [];
        foreach ($widgetsOrder as $item) {
            $newOrder[$item['key']] = $item['order'];
        }

        // 3. On met à jour la clé spécifique au dashboard
        $preferences['dashboard_order'] = $newOrder;

        // 4. On sauvegarde sur le modèle User
        $user->forceFill([
            'preferences' => $preferences
        ])->save();
    }

    /**
     * Utilisation en tant que contrôleur API.
     */
    public function asController(Request $request)
    {
        $request->validate([
            'widgets' => 'required|array',
            'widgets.*.key' => 'required|string',
            'widgets.*.order' => 'required|integer',
        ]);

        $this->handle(
            $request->input('widgets'), 
            Auth::user()
        );

        return response()->json([
            'status' => 'success',
            'message' => __('Ordre du tableau de bord mis à jour.')
        ]);
    }
}