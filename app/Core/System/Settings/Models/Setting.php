<?php

namespace App\Core\System\Settings\Models;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    public int $cacheFor = 86400; // Cache 24h

    protected $fillable = ['group', 'key', 'value', 'type', 'description', 'is_locked'];

    protected static function booted() {
        static::updated(fn () => Cache::forget('core.settings.all'));
        static::created(fn () => Cache::forget('core.settings.all'));
    }

    /**
     * Magic accessor to retrieve the value in the correct type.
     * Ex: Setting::find('maintenance_mode')->formatted_value returns a boolean true/false
     */
    public function getFormattedValueAttribute()
    {
        $value = $this->value;

        return match ($this->type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'float'   => (float) $value,
            'array', 'json' => json_decode($value, true),
            default   => $value,
        };
    }
    
    /**
     * Static helper to retrieve a config quickly
     * Usage: Setting::get('app_name', 'Crivalide Default');
     */
    public static function get(string $key, $default = null)
    {
        $settings = Cache::rememberForever('core.settings.all', function () {
            return self::all()->keyBy('key');
        });

        if ($settings->has($key)) {
            $setting = $settings[$key];
            return self::castValue($setting->value, $setting->type);
        }

        return $default;
    }

    /**
     * Save an option
     */
    public static function set(string $key, $value, string $type = 'string', string $group = 'general'): void
    {
        self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group
            ]
        );
    }

    private static function castValue($value, $type)
    {
        return match ($type) {
            'boolean', 'bool' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer', 'int' => (int) $value,
            'json', 'array' => json_decode($value, true),
            default => $value,
        };
    }
}