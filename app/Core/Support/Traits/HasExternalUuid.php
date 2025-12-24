<?php

namespace App\Core\Support\Traits;

use Illuminate\Support\Str;

trait HasExternalUuid
{
    protected static function bootHasExternalUuid()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::ulid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}