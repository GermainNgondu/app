<?php

namespace App\Core\System\Auth\Actions;

use App\Core\System\Auth\Data\LoginData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class LoginAction
{
    use AsAction;

    /**
     * Autoriser tout le monde à voir/soumettre le login
     */
    public function authorize(): bool
    {
        return Auth::guest();
    }

    /**
     * Logique de traitement de la connexion
     */
    public function handle(LoginData $data): bool
    {
        if (!Auth::attempt($data->only('email', 'password')->toArray(), $data->remember)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        request()->session()->regenerate();

        return true;
    }

    /**
     * Point d'entrée HTTP
     */
    public function asController(LoginData $data)
    {
        if (! $this->handle($data)) {

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        request()->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }
}