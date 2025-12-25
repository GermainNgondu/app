@extends('core::layouts.app')

@section('title', ucfirst(__('profile')))

@section('content')
    @react('Core::system/profile/components/ProfilePage', [
        'user' => auth()->user()
    ])
    @endreact
@endsection