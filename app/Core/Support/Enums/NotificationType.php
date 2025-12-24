<?php

namespace App\Core\Support\Enums;

enum NotificationType: string
{
    case INFO = 'info';
    case SUCCESS = 'success';
    case WARNING = 'warning';
    case ERROR = 'error';

    public function color(): string
    {
        return match($this) {
            self::INFO => 'blue',
            self::SUCCESS => 'green',
            self::WARNING => 'orange',
            self::ERROR => 'red',
        };
    }
}