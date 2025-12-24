<?php

namespace App\Core\Support\Helpers;

class ReactRender
{
    public static function make(string $componentName, array $props = []): string
    {
        $propsJson = htmlspecialchars(json_encode($props), ENT_QUOTES, 'UTF-8');
        
        // On retourne le HTML attendu par le mounter JS
        return <<<HTML
            <div 
                data-react-component="{$componentName}" 
                data-props="{$propsJson}"
            ></div>
        HTML;
    }
}