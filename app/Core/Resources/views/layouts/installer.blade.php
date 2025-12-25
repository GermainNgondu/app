<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-zinc-50">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link rel="shortcut icon" href="{{ asset('core/assets/images/favicon.png') }}" type="image/x-icon">
        <title>@yield('title') | {{ config('app.name') }}</title>

        @vite(['app/Core/Resources/css/app.css', 'app/Core/Resources/js/app.jsx'])

        <script>
            window.appConfig = {
                name: "{{ config('app.name') }}",
                version: "{{ $appVersion }}",
            };
            window.locale = "{{ app()->getLocale() }}";
        </script>
    </head>
    <body class="h-full font-sans antialiased text-zinc-900">
        <div class="min-h-screen flex flex-col items-center justify-center p-6">
            <div class="flex flex-col items-center gap-2 font-medium mb-8">
                <div class="flex max-w-36 items-center justify-center rounded-md">
                    @if(setting('app_logo'))
                        <img src="{{asset(setting('app_logo'))}}" alt="Logo">
                    @else
                        <h1 class="text-3xl font-bold tracking-tighter">
                            {{ucfirst(config('app.name')) }}
                        </h1>
                    @endif
                </div>
            </div>

            <div class="w-full max-w-2xl bg-white border border-zinc-200 shadow-xl rounded-2xl overflow-hidden">
                <div class="bg-zinc-900 px-8 py-4 flex justify-between items-center">
                    <span class="text-white text-xs font-mono uppercase tracking-widest">{{ __("Assistant d'installation") }}</span>
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
                &copy; {{ date('Y') }} {{ config('app.name') }} - v{{ $appVersion }}
        </div>
        </div>
    </body>

</html>