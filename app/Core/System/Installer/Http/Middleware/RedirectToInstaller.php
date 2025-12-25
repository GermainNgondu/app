<?php

namespace App\Core\System\Installer\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class RedirectToInstaller
{
    protected array $except = [
        'install*',  
        'themes/*',        
        '_debugbar/*',     
    ];
    public function handle(Request $request, Closure $next)
    {
        $flagPath = storage_path('installed');
        $isFilePresent = File::exists($flagPath);

        // The application thinks it is installed (File present)
        
        if ($isFilePresent) {
            
            // VERIFICATION OF INTEGRITY (New)
            // We use the cache to not make a SQL query on each page.
            // We cache for 60 minutes that "It's OK".
            $isDatabaseHealthy = Cache::remember('app_install_integrity', 3600, function () {
                return $this->checkDatabaseHealth();
            });

            if (!$isDatabaseHealthy) {
                // PROBLEM DETECTED: The file is there, but the DB is empty/dead.
                
                // We delete the marker file (Reset)
                File::delete($flagPath);
                
                // We empty the integrity cache to force revalidation
                Cache::forget('app_install_integrity');

                Log::alert("File 'installed' detected but database empty. Redirecting to the installer.");

                // We redirect to the installer
                return redirect()->route('installer.index');
            }

            // If everything is fine but we try to access the install -> Home
            if ($request->is('install*')) {
                return redirect('/');
            }

            return $next($request);
        }

        // The file is ABSENT (Previous logic)
        
        // Auto-healing : If DB full but file absent
        if ($this->checkDatabaseHealth()) { // We reuse the same function
            File::put($flagPath, 'RESTORED ON ' . now());
            Log::warning("Fichier 'installed' restauré car la DB est valide.");
            
            if ($request->is('install*')) return redirect('/');
            return $next($request);
        }

        // Really not installed -> Redirect Install
        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) return $next($request);
        }

        return redirect()->route('installer.index');
    }
    
    /**
     * Physically checks if the DB contains the essential tables.
     * Returns TRUE if the DB is ready, FALSE if it is empty/inaccessible.
     */
    private function checkDatabaseHealth(): bool
    {
        try {
            // Test basic connection
            DB::connection()->getPdo();

            // Check if the table Users exists
            if (!Schema::hasTable('users')) {
                return false; // Table missing
            }

            // (Optional) Check if there is at least 1 user (Admin)
            // If you want to force reinstallation if the users table is empty :
            if (DB::table('users')->count() === 0) {
                return false; 
            }

            return true;

        } catch (\Exception $e) {
            // If connection error or other SQL exception
            return false;
        }
    }
}