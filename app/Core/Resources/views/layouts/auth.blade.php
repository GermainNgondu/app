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
    <body class="h-full font-sans antialiased text-zinc-900">
        <div class="min-h-screen flex flex-col items-center justify-center p-6">
            
            <div class="w-full max-w-md">
                <div class="flex flex-col items-center gap-2 font-medium">
                    <div class="flex max-w-36 items-center justify-center rounded-md mb-8">
                        @if(setting('app_logo'))
                            <img src="{{asset(setting('app_logo'))}}" alt="Logo">
                        @else
                            <h1 class="text-3xl font-bold tracking-tighter">
                                {{ucfirst(setting('app_name',config('app.name'))) }}
                            </h1>
                        @endif
                    </div>
                </div>

                @yield('content')
            </div>

        </div>
    </body>
</html>