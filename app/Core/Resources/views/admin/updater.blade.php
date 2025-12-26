@extends('core::layouts.app', ['title' => __('Mise à jour du système')])

@section('content')
    @react('Core::system/updater/components/UpdaterPage')
    @endreact
@endsection