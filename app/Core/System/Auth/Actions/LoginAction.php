<?php

namespace App\Core\System\Auth\Actions;

use App\Core\System\Auth\Data\LoginData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;

class LoginAction
{
    use AsAction;

    public function authorize(): bool
    {
        return Auth::guest();
    }

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

    public function asController(LoginData $data)
    {
        // On exécute la logique (qui gère déjà les erreurs de validation via handle)
        $this->handle($data);

        // On prépare la redirection "intended" (vers la page demandée initialement ou le dashboard)
        $redirect = redirect()->intended(route('admin.dashboard'));

        // SI c'est une requête AJAX (Axios), on renvoie du JSON
        if (request()->wantsJson()) {
            return response()->json([
                'redirect' => $redirect->getTargetUrl()
            ]);
        }
        return $redirect;
    }
}