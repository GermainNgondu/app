<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{{ ucfirst(setting('app_name',config('app.name'))) }}</title>
        <link rel="icon" href="{{asset(setting('app_favicon'))}}" sizes="any">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['app/Core/Resources/css/app.css', 'app/Core/Resources/js/app.jsx'])

    </head>

    <body class="min-h-screen bg-white antialiased dark:bg-linear-to-b dark:from-neutral-950 dark:to-neutral-900">
        <div class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div class="flex w-full max-w-sm flex-col gap-2">
                <div class="flex flex-col items-center gap-2 font-medium">
                    <div class="flex max-w-36 mb-1 items-center justify-center rounded-md">
                        <img src="{{asset(setting('app_logo'))}}" alt="Logo">
                    </div>
                </div>
            </div>
        </div>

    </body>

</html>