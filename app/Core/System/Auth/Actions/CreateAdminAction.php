<?php

namespace App\Core\System\Auth\Actions;

use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Core\System\Auth\Models\User;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Installer\Data\AdminSetupData;

class CreateAdminAction
{
    use AsAction;

    /**
     * Crée le premier utilisateur (Super Admin)
     */
    public function handle(AdminSetupData $data): User
    {
        $user = User::create([
            'name'     => $data->name,
            'email'    => $data->email,
            'password' => Hash::make($data->password),
            'email_verified_at' => now(),
        ]);

        $role = Role::where('name', 'super')->where('guard_name', 'web')->first();

        if (method_exists($user, 'assignRole') && $role) {
            $user->assignRole($role);
        }

        return $user;
    }

    public function asController(AdminSetupData $data)
    {
        $this->handle($data);

        return response()->json([
            'status'  => 'success',
            'message' => 'Administrateur créé avec succès.'
        ]);
    }
}