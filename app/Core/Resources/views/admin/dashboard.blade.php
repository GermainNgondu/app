@extends('core::layouts.app')

@section('title', ucfirst(__('dashboard')))

@section('content')
    @react('Core::system/dashboard/components/DashboardPage')@endreact
@endsection