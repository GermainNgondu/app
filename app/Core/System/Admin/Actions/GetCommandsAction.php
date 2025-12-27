<?php

namespace App\Core\System\Admin\Actions;

use App\Core\Support\Registries\CommandRegistry;
use Lorisleiva\Actions\Concerns\AsAction;

class GetCommandsAction
{
    use AsAction;

    public function handle(CommandRegistry $registry)
    {
        return response()->json([
            'data' => $registry->getCommands()
        ]);
    }
}