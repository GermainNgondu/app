<?php

namespace App\Core\System\Admin\Actions;

use App\Core\System\Features\Models\Feature;
use Lorisleiva\Actions\Concerns\AsAction;

class ListFeaturesAction
{
    use AsAction;

    public function authorize(): bool
    {
        return auth()->user()->hasRole('admin');
    }

    public function handle()
    {
        return Feature::orderBy('name')->get();
    }

    public function asController()
    {
        return view('core::admin.features.index', [
            'features' => $this->handle()
        ]);
    }
}