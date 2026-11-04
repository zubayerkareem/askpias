<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

// Serve uploads from the public disk. When public/storage resolves, nginx serves
// these files directly and never reaches PHP; this is the fallback for containers
// where the symlink is missing (for example, a mounted storage/app/public volume).
Route::get('/storage/{path}', function (string $path) {
    abort_if(str_contains($path, '..'), 404);
    abort_unless(Storage::disk('public')->exists($path), 404);

    return Storage::disk('public')->response($path);
})->where('path', '.*');
