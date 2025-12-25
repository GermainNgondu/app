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
            window.translations = {!! \App\Core\Support\Helpers\TranslationHelper::getJsonTranslations() !!};
            window.locale = "{{ app()->getLocale() }}";
        </script>
    </head>

    <body class="h-full font-sans antialiased text-zinc-900 overflow-hidden">

        @react('Core::layouts/admin/AdminLayout', [
            'user' => \App\Core\System\Auth\Data\UserData::fromModel(auth()->user()),
            'menu' => \App\Core\Support\Facades\Menu::getMenu(),
            'currentRoute' => request()->route()->getName(),
            'title' => $__env->yieldContent('title', __('Panel Administration')),
            'settings'=> public_settings()
        ])
            {{-- 
                SLOT : Le contenu généré par Blade (via vos contrôleurs) 
                sera injecté ici à l'intérieur du layout React.
            --}}
            <div class="p-6 lg:p-10 animate-in fade-in duration-500">
                @yield('content')
            </div>
        @endreact

    </body>
</html>