@extends('core::layouts.app')

@section('title', __('Paramètres'))

@section('content')
    @react('Core::Admin/Settings/SettingsPage')@endreact
@endsection