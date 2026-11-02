<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactNotification;
use App\Mail\ContactReceived;
use App\Models\Message;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class MessageController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^(?:\+?880|0)1[3-9]\d{8}$/'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'question' => ['required', 'string', 'min:2', 'max:5000'],
        ]);

        $message = Message::query()->create($data);

        $this->notify($message);

        return response()->json(['message' => 'Thanks — your question is in.'], 201);
    }

    private function notify(Message $message): void
    {
        try {
            Mail::to($message->email)->send(
                new ContactReceived($message->name ?: 'there', $message->question),
            );
        } catch (Throwable $exception) {
            Log::warning('Contact auto-reply failed', ['error' => $exception->getMessage()]);
        }

        $settings = SiteSetting::current();
        $to = $settings->contact_email ?: $settings->mail_from_address;

        if (! $to) {
            return;
        }

        try {
            Mail::to($to)->send(new ContactNotification($message));
        } catch (Throwable $exception) {
            Log::warning('Contact notification failed', ['error' => $exception->getMessage()]);
        }
    }
}
