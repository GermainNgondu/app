<?php

use Illuminate\Support\Facades\Route;
use App\Core\System\Auth\Actions\LoginAction;
use App\Core\System\Auth\Actions\LogoutAction;
use App\Core\System\Auth\Actions\ResetPasswordAction;
use App\Core\System\Auth\Actions\ForgotPasswordAction;

// Routes d'authentification (Invités)
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return view('core::auth.login');
    })->name('login');

    Route::post('/login', LoginAction::class)->name('login.post');
});

// Routes protégées
Route::middleware('auth')->group(function () {
    Route::post('/logout', LogoutAction::class)->name('logout');
});


Route::middleware('guest')->group(function () {
    // Affichage du formulaire (Blade + React)
    Route::get('/forgot-password', function () {
        return view('core::auth.passwords.email');
    })->name('password.request');

    // Traitement du formulaire (Action)
    Route::post('/forgot-password', ForgotPasswordAction::class)->name('password.email');

    // Route de retour après clic dans l'email (Reset Password Form)
    Route::get('/reset-password/{token}', function (string $token) {
        return view('core::auth.passwords.reset', ['token' => $token,'email' => request()->email]);
    })->name('password.reset');

    Route::post('reset-password', ResetPasswordAction::class)
        ->name('password.update');
});