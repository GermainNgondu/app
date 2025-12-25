@extends('core::layouts.app')

@section('title', ucfirst(__('settings')))

@section('content')
    @react('Core::system/settings/components/SettingPage')@endreact
@endsection