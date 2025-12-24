<?php

namespace App\Core\System\Auth\Actions;

use App\Core\System\Auth\Models\User;
use Exception;
use Illuminate\Support\Facades\Password;
use Lorisleiva\Actions\Concerns\AsAction;
use App\Core\System\Intents\Facades\Intent;
use App\Core\Support\Enums\NotificationType;
use App\Core\System\Auth\Data\ForgotPasswordData;
use App\Core\System\Notifications\Data\NotificationPayloadData;

class ForgotPasswordAction
{
    use AsAction;

    public function handle(ForgotPasswordData $data): string
    {
        $token = Password::createToken(User::where('email', $data->email)->first());

        $resetUrl = route('password.reset', ['token' => $token, 'email' => $data->email]);

        try {

            Intent::execute('core.notify',User::where('email', $data->email)->first(), new NotificationPayloadData(
                    title: 'Réinitialisation de mot de passe',
                    body: 'Vous avez demandé un lien pour changer votre mot de passe. Cliquez sur le bouton ci-dessous.',
                    type: NotificationType::INFO,
                    action_url: $resetUrl,
                    action_text: 'Réinitialiser mon mot de passe',
                    channels: ['mail']
                ));

        } catch (Exception $th) 
        {
            throw new Exception("Error Processing Request", 1);
        }
        

        return Password::RESET_LINK_SENT;
    }

    public function asController(ForgotPasswordData $data)
    {
        $status = $this->handle($data);

        return back()->with('status', __($status));
    }
}