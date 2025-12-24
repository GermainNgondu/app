<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-zinc-50">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ __('Installation') }} | {{ config('app.name', 'SystemCore') }}</title>

    @vite(['app/Core/Resources/css/app.css', 'app/Core/Resources/js/app.jsx'])

    <script>
        window.translations = {!! \App\Core\Support\Helpers\TranslationHelper::getJsonTranslations() !!};
        window.locale = "{{ app()->getLocale() }}";
    </script>
</head>

<body class="h-full font-sans antialiased text-zinc-900">
    <div class="min-h-screen flex flex-col items-center justify-center p-6">

        <div class="mb-8 text-center">
            <h1 class="text-3xl font-extrabold tracking-tight">System<span class="text-primary">Core</span></h1>
            <p class="text-zinc-500 mt-2">{{ __('Assistant de configuration du système') }}</p>
        </div>

        <div class="w-full max-w-2xl bg-white border border-zinc-200 shadow-xl rounded-2xl overflow-hidden">
            <div class="bg-zinc-900 px-8 py-4 flex justify-between items-center">
                <span class="text-white text-xs font-mono uppercase tracking-widest">Setup v1.0</span>
                <div class="flex gap-1">
                    <div class="w-2 h-2 rounded-full bg-zinc-700"></div>
                    <div class="w-2 h-2 rounded-full bg-zinc-700"></div>
                </div>
            </div>

            <div class="p-8">
                @yield('content')
            </div>
        </div>

        <footer class="mt-8 text-zinc-400 text-xs">
            &copy; {{ date('Y') }} SystemCore - {{ __('Tous droits réservés') }}
    </div>
    </div>
</body>

</html>