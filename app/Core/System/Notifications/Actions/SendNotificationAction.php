<?php

namespace App\Core\System\Notifications\Actions;

use App\Core\System\Auth\Models\User;
use Lorisleiva\Actions\Concerns\AsJob;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Core\System\Notifications\Data\NotificationPayloadData;
use App\Core\System\Notifications\SystemNotification;

class SendNotificationAction implements ShouldQueue
{
    use AsAction, AsJob;

    public function handle(User $user, NotificationPayloadData $payload): void
    {
        $user->notify(new SystemNotification($payload));
    }
}