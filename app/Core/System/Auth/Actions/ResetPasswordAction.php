<?php

namespace App\Core\System\Auth\Actions;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Validation\ValidationException;

class ResetPasswordAction
{
    use AsAction;

    public function handle(array $data)
    {
        // On utilise le Password Broker natif de Laravel
        $status = Password::broker()->reset(
            $data,
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        return $status;
    }

    public function asController(Request $request)
    {
        // 1. Validation des champs
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // 2. Appel du handle
        $status = $this->handle($request->only('email', 'password', 'password_confirmation', 'token'));

        // 3. Réponse selon le résultat
        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)], // Laravel traduit automatiquement le message d'erreur
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => __($status)
        ]);
    }
}