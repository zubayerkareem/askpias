<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NoteResource;
use App\Models\Note;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NoteController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $notes = Note::query()
            ->published()
            ->orderBy('sort_order')
            ->orderByDesc('published_at')
            ->get();

        return NoteResource::collection($notes);
    }

    public function show(string $slug): NoteResource
    {
        $note = Note::query()->published()->where('slug', $slug)->firstOrFail();

        return new NoteResource($note);
    }
}
