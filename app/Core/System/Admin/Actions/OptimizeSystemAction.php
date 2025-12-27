<?php

namespace App\Core\System\Admin\Actions;

use Lorisleiva\Actions\Concerns\AsAction;

use Illuminate\Support\Facades\Artisan;
class OptimizeSystemAction 
{
    use AsAction;
    public function handle() {
        Artisan::call('optimize');
        return ['message' => 'Système optimisé !'];
    }
}