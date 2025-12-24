@extends('core::layouts.auth')

@section('content')
    @react('Core::Auth/ResetPasswordPage', [
        'token' => $token,
        'email' => $email,
        'submitUrl' => route('password.update')
    ])@endreact
@endsection