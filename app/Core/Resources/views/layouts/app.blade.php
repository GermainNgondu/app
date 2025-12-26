<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-zinc-50">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="shortcut icon" href="{{ asset(setting('app_favicon', 'core/assets/images/favicon.png')) }}" type="image/x-icon">
        <title>@yield('title') | {{ setting('app_name', config('app.name')) }}</title>

        @vite(['app/Core/Resources/css/app.css', 'app/Core/Resources/js/app.jsx'])

        <script>
            window.appConfig = {
                name: "{{ setting('app_name', config('app.name')) }}",
                version: "{{ $appVersion }}",
            };
            window.locale = "{{ app()->getLocale() }}";
        </script>
    </head>

    <body class="h-full font-sans antialiased text-zinc-900 overflow-hidden">
        {{-- === SCRIPT DE GESTION DU LOADER === --}}
        <script>
            if (sessionStorage.getItem('app_is_ready')) {
                document.body.classList.add('app-loaded');
            }
        </script>

        {{-- === STYLE CSS INLINE === --}}
        <style>
            /* Par défaut le loader est visible */
            #app-loader { opacity: 1; transition: opacity 0.5s ease-out; }
            
            /* masquage immédiat */
            body.app-loaded #app-loader { display: none !important; }
        </style>
        
        <div id="app-loader" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-opacity duration-500">
            <div class="flex flex-col items-center space-y-4">
                {{-- Logo Optionnel --}}
                @php  $logo = setting('app_logo',null) @endphp

                @if($logo)
                    <img src="{{ $logo }}" alt="Logo" class="h-12 w-auto animate-pulse">
                @endif
                
                {{-- Spinner SVG (Tailwind) --}}
                <svg class="animate-spin h-8 w-8 text-zinc-600 dark:text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                
                <p class="text-xs text-zinc-400 font-medium animate-pulse capitalize">{{ __('loading...') }}</p>
            </div>
        </div>
        @react('Core::layouts/admin/AdminLayout', [
            'user' => \App\Core\System\Auth\Data\UserData::fromModel(auth()->user()),
            'menu' => \App\Core\Support\Facades\Menu::getMenu(),
            'currentRoute' => request()->route()->getName(),
            'title' => $__env->yieldContent('title', __('Panel Administration')),
            'settings'=> public_settings()
        ])
            <div class="p-6 lg:p-10 animate-in fade-in duration-500">
                @yield('content')
            </div>
        @endreact

    </body>
</html>