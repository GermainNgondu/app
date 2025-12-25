@extends('core::layouts.auth')

@section('title', ucfirst(__('login')))
@section('content')

    @react('Core::system/auth/components/LoginPage', [
        'forgotPasswordUrl' => route('password.request'),
        'loginEndpoint' => route('login.post')
    ])@endreact
@endsection