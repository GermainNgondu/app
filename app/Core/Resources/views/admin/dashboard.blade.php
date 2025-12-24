@extends('core::layouts.app')

@section('title', __('Dashboard'))

@section('content')
    {{-- On utilise text-foreground pour que la couleur s'adapte automatiquement --}}
    <div class="space-y-6 text-zinc-900 dark:text-zinc-50">
        
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-3xl font-bold tracking-tight">{{ __('Tableau de bord') }}</h2>
                <p class="text-zinc-500 dark:text-zinc-400">
                    {{ __('Vue d\'ensemble de votre activité et des performances.') }}
                </p>
            </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {{-- Utilisation de dark:bg-zinc-900 et dark:border-zinc-800 --}}
            <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ __('Revenu Total') }}</h3>
                <div class="text-2xl font-bold mt-2">45,231.89 €</div>
                <p class="text-xs text-green-600 mt-1">+20.1% {{ __('vs mois dernier') }}</p>
            </div>

            <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 class="text-sm font-medium text-zinc-500 dark:text-zinc-400">{{ __('Abonnements') }}</h3>
                <div class="text-2xl font-bold mt-2">+2350</div>
                <p class="text-xs text-green-600 mt-1">+180.1% {{ __('vs mois dernier') }}</p>
            </div>
            
            {{-- ... Répétez pour les autres cartes ... --}}
        </div>

        {{-- Section Graphique --}}
        <div class="grid gap-4 md:grid-cols-7">
            <div class="col-span-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 class="font-semibold mb-4">{{ __('Vue d\'ensemble') }}</h3>
                <div class="h-[200px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded border border-dashed border-zinc-200 dark:border-zinc-800">
                    <span class="text-zinc-400">{{ __('Graphique React à venir...') }}</span>
                </div>
            </div>

            <div class="col-span-3 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 class="font-semibold mb-4">{{ __('Ventes récentes') }}</h3>
                <div class="space-y-4">
                    <div class="flex items-center">
                        <div class="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">OM</div>
                        <div class="ml-4">
                            <p class="text-sm font-medium">Olivia Martin</p>
                            <p class="text-xs text-zinc-500">olivia.martin@email.com</p>
                        </div>
                        <div class="ml-auto font-medium text-green-600">+1,999.00€</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection