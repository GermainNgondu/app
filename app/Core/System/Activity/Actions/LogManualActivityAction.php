<?php

namespace App\Core\System\Activity\Actions;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsJob;

class LogManualActivityAction
{
    use AsAction, AsJob;

    public function handle(string $description, ?Model $subject = null, array $properties = []): void
    {
        $logger = activity();

        if (Auth::check()) {
            $logger->causedBy(Auth::user());
        }

        if ($subject) {
            $logger->performedOn($subject);
        }

        $logger->withProperties($properties)
               ->log($description);
    }
}