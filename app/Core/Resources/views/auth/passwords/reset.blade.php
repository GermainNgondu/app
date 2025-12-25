@extends('core::layouts.auth')
@section('title', ucfirst(__('reset_password')))
@section('content')
    @react('Core::system/auth/components/ResetPasswordPage', [
        'token' => $token,
        'email' => $email,
        'submitUrl' => route('password.update')
    ])@endreact
@endsection