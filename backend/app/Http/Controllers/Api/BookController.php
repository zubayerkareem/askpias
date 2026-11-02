<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $books = Book::query()->published()->orderBy('sort_order')->get();

        return BookResource::collection($books);
    }

    public function show(string $slug): BookResource
    {
        $book = Book::query()->published()->where('slug', $slug)->firstOrFail();

        return new BookResource($book);
    }
}
