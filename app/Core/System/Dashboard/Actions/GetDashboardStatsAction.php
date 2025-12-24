<?php

namespace App\Core\System\Dashboard\Actions;

use Illuminate\Http\Request;
use App\Core\System\Auth\Models\User;
use Lorisleiva\Actions\Concerns\AsAction;

class GetDashboardStatsAction
{
    use AsAction;

    public function handle(): array
    {
        // Exemple de logique réelle
        $usersCount = User::count();
        $recentUsers = User::latest()->take(5)->get()->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'initials' => substr($u->name, 0, 2),
                'joined_at' => $u->created_at->diffForHumans(),
            ];
        });

        // Données statiques pour l'exemple (à remplacer par tes Models Billing plus tard)
        return [
            'revenue' => '$45,231.89',
            'users_count' => $usersCount, // Dynamique
            'sales_count' => '+12,234',
            'active_now' => '573',
            'recent_users' => $recentUsers, // Dynamique
        ];
    }

    public function asController(Request $request)
    {
        return response()->json($this->handle());
    }
}