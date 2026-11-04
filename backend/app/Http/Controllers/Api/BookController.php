<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Models\Lead;
use App\Services\UddoktaPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

    /**
     * Start a UddoktaPay charge for an uploaded book file.
     */
    public function checkout(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^(?:\+?880|0)1[3-9]\d{8}$/'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'slug' => ['required', 'string', 'exists:books,slug'],
        ]);

        $book = Book::query()->published()->where('slug', $data['slug'])->firstOrFail();

        if (! $book->file_url || $book->price === null || (float) $book->price <= 0) {
            return response()->json([
                'message' => 'This book is not available for purchase yet.',
            ], 422);
        }

        $service = UddoktaPayService::make();

        if (! $service->isConfigured()) {
            return response()->json([
                'message' => 'Payments are not configured yet. Please try again later.',
            ], 503);
        }

        $lead = Lead::query()->create([
            'book_id' => $book->id,
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'amount' => $book->price,
            'currency' => $service->currency(),
            'status' => 'pending',
        ]);

        $frontend = rtrim((string) config('services.uddoktapay.frontend_url'), '/');
        $returnUrl = $frontend.'/books/download?slug='.$book->slug;

        $response = $service->createCharge([
            'full_name' => $lead->name,
            'email' => $lead->email,
            'amount' => number_format((float) $book->price, 2, '.', ''),
            'metadata' => [
                'lead_id' => $lead->id,
                'book_slug' => $book->slug,
                'phone' => $lead->phone,
            ],
            'redirect_url' => $returnUrl,
            'cancel_url' => $returnUrl.'&result=cancel',
        ]);

        if (empty($response['status']) || empty($response['payment_url'])) {
            $lead->update(['status' => 'failed']);

            return response()->json([
                'message' => $response['message'] ?? 'Could not start the payment.',
            ], 502);
        }

        return response()->json([
            'payment_url' => $response['payment_url'],
            'lead_id' => $lead->id,
        ], 201);
    }
}
