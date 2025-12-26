<?php

namespace App\Core\System\Updater\Actions;

use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class UploadUpdateFileAction
{
    use AsAction;

    public function handle($file): string
    {
        $path = storage_path('app/updates');
        
        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0755, true);
        }

        // Move and rename the file for standard installation
        $file->move($path, 'update.zip');

        return $path . '/update.zip';
    }

    public function asController(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:zip|max:102400', // Max 100MB
        ]);

        try {
            $this->handle($request->file('file'));
            return response()->json(['status' => 'uploaded']);
        } catch (\Exception $e) {
            return response()->json(['message' => "Upload error: " . $e->getMessage()], 500);
        }
    }
}