@extends('core::layouts.auth')

@section('content')
    @react('Core::Auth/ForgotPasswordPage', [
        'submitUrl' => route('password.email'),
        'loginUrl' => route('login')
    ])@endreact
@endsection