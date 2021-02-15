@extends('layouts.app')

@section('content')

    <section class="content">
        <div class="container-fluid">

            <div class="p-3 mb-2 bg-info"> <h2 class="text-white no-margin"> {{ __('Cafeteria') }} </h2> </div>

            <div class="card shadow-sm p-3 mb-5 bg-white rounded">
                <div class="card-body">

                    <h2></h2>

                    <video class="col-12 margin-t20 margin-b20" loop autoplay playsinline controls="true" width="100%" height="100%" muted="muted" preload="true" poster="{{ URL::asset('assets/video/hall.jpg') }}">
                        <source src="https://assets.object.pscloud.io/video/hall.mov" type="video/mov"/>
                        <source src="https://assets.object.pscloud.io/video/hall.mp4" type="video/mp4" />
                        <source src="https://assets.object.pscloud.io/video/hall.ogg" type="video/oog" />
                        Your browser does not support the video tag.
                    </video>

                </div>
            </div>

        </div>
    </section>

@endsection