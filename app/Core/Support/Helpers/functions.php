<?php

use App\Core\System\Settings\Models\Setting;



if (!function_exists('public_settings')) {
    function public_settings() {

        return Setting::getPublicSettings();
    }
}

if (!function_exists('setting')) {
    function setting($key, $default = null) {

        return Setting::get($key, $default);
    }
}

if (!function_exists('set_setting')) {

    function set_setting(string $key, $value, $type = 'string')
    {
        Setting::set($key, $value, $type);
    }
}