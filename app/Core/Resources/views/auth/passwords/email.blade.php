@extends('core::layouts.auth')
@section('title',ucfirst(__('forgot_password')))
@section('content')
    @react('Core::system/auth/components/ForgotPasswordPage', [
        'submitUrl' => route('password.email'),
        'loginUrl' => route('login')
    ])@endreact
@endsection