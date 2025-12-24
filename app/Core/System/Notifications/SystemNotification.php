<?php

namespace App\Core\System\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Core\System\Notifications\Data\NotificationPayloadData;

class SystemNotification extends Notification
{
    use Queueable;

    public function __construct(
        public NotificationPayloadData $payload
    ) {}

    public function via($notifiable): array
    {
        return $this->payload->channels;
    }

    public function toMail($notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject($this->payload->title)
            ->line($this->payload->body);

        if ($this->payload->action_url) {
            $mail->action($this->payload->action_text ?? 'Voir', $this->payload->action_url);
        }

        return $mail;
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => $this->payload->title,
            'body' => $this->payload->body,
            'type' => $this->payload->type->value,
            'action_url' => $this->payload->action_url,
        ];
    }
}