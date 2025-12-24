<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-zinc-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title') | {{ config('app.name', 'SystemCore') }}</title>

    {{-- Chargement des assets via Vite (Tailwind v4 & React) --}}
    @vite(['app/Core/Resources/css/app.css', 'app/Core/Resources/js/app.jsx'])

    <script>
        window.translations = {!! \App\Core\Support\Helpers\TranslationHelper::getJsonTranslations() !!};
        window.locale = "{{ app()->getLocale() }}";
    </script>
</head>

<body class="h-full font-sans antialiased text-zinc-900 overflow-hidden">

    {{-- 
        On monte le composant AdminLayout (React).
        On lui passe l'utilisateur et le menu en tant que props initiales.
    --}}
    @react('Core::Admin/AdminLayout', [
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

    {{-- Notifications Flash (Optionnel) --}}
    @if (session('success'))
        <script>
            window.addEventListener('load', () => {
                // Vous pourrez appeler un toast React ici
                console.log("Success: {{ session('success') }}");
            });
        </script>
    @endif

</body>
</html>