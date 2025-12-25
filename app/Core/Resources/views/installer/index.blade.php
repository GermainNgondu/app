@extends('core::layouts.installer')
@section('title', 'Installation')
@section('content')
    @react('Core::system/installer/components/InstallWizard',['redirectPath' => route('admin.dashboard')])@endreact
@endsection