<?php

namespace App\Core\System\Auth\Actions;

use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UpdateUserProfileAction
{
    use AsAction;

    public function handle(Request $request)
    {
        $user = Auth::user();

        // 1. Validation
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'avatar_url' => 'nullable|string',
            'current_password' => 'nullable|required_with:new_password|current_password',
            'new_password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        // 2. Mise à jour des infos de base
        $user->forceFill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'avatar_url' => $validated['avatar_url'],
        ]);

        // 3. Changement de mot de passe (si demandé)
        if ($request->filled('new_password')) {
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return $user;
    }

    public function asController(Request $request)
    {
        $this->handle($request);

        return response()->json([
            'status' => 'success',
            'message' => __('Profil mis à jour avec succès.'),
            'user' => Auth::user()
        ]);
    }
}