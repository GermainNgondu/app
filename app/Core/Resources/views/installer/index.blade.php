@extends('core::layouts.installer')

@section('content')
    @react('Core::Installer/InstallWizard',['redirectPath' => route('admin.dashboard')])@endreact
@endsection