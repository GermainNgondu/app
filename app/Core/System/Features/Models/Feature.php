<?php

namespace App\Core\System\Features\Models;

use App\Core\Support\Traits\HasExternalUuid;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    use HasExternalUuid;

    protected $fillable = [
        'uuid',
        'name',
        'display_name',
        'is_active',
        'settings',
        'installed_at'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
        'installed_at' => 'datetime',
    ];
}