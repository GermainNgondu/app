<?php

namespace App\Core\System\Installer\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class RedirectToInstaller
{
    public function handle(Request $request, Closure $next)
    {
        $isInstalled = File::exists(storage_path('installed'));
        $isInstallRoute = $request->is('install*');

        // Si l'app n'est pas installée et qu'on n'est pas déjà sur l'installeur
        if (!$isInstalled && !$isInstallRoute) {
            return redirect()->route('installer.index');
        }

        // Si l'app est installée mais qu'on tente de revenir sur l'installeur
        if ($isInstalled && $isInstallRoute) {
            return redirect('/');
        }

        return $next($request);
    }
}