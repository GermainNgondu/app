@extends('core::layouts.auth')

@section('content')

    @react('Core::Auth/LoginPage', [
        'forgotPasswordUrl' => route('password.request'),
        'loginEndpoint' => route('login.post')
    ])@endreact
@endsection