@extends('core::layouts.app')

@section('title', __('Dashboard'))

@section('content')
    @react('Core::Admin/Dashboard/DashboardPage')@endreact
@endsection