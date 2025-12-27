@extends('core::layouts.app')

@section('title', ucfirst(__('system_update')))

@section('content')
    @react('Core::system/updater/components/UpdaterPage')
    @endreact
@endsection