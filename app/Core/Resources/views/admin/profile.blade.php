@extends('core::layouts.app')

@section('title', __('Mon Profil'))

@section('content')
    
    @react('Core::Admin/Profile/ProfilePage', [
        'user' => auth()->user()
    ])
    @endreact
@endsection