<?php

namespace App\Core\System\Media\Models;

use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends BaseMedia {
    use SoftDeletes;
}