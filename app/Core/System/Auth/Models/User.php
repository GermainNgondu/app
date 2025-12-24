<?php

namespace App\Core\System\Auth\Models;

use Spatie\MediaLibrary\HasMedia;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\InteractsWithMedia;
use App\Core\Support\Traits\HasExternalUuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements HasMedia
{
    use HasRoles, Notifiable, InteractsWithMedia, HasExternalUuid, SoftDeletes;

    protected $fillable = ['name', 'email', 'password', 'uuid'];
    protected $hidden = ['password', 'remember_token'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'props'=> 'array',
            'avatar'=> 'array'
        ];
    }
}