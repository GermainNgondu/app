<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-zinc-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'SystemCore') }} | Auth</title>

    @vite(['app/Core/Resources/css/app.css', 'app/Core/Resources/js/app.jsx'])

    <script>
        window.translations = {!! \App\Core\Support\Helpers\TranslationHelper::getJsonTranslations() !!};
        window.locale = "{{ app()->getLocale() }}";
    </script>
</head>
<body class="h-full font-sans antialiased text-zinc-900">
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        
        <div class="w-full max-w-md">
            {{-- Logo / Titre --}}
            <div class="mb-8 text-center">
                <h1 class="text-3xl font-bold tracking-tighter">System<span class="text-primary">Core</span></h1>
            </div>

            @yield('content')
        </div>

    </div>
</body>
</html>