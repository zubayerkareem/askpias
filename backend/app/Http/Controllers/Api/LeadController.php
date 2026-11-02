<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\LeadMagnetReady;
use App\Models\Lead;
use App\Models\Note;
use App\Services\UddoktaPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class LeadController extends Controller
{
    /**
     * Free lead magnet — capture the lead and hand back the file.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^(?:\+?880|0)1[3-9]\d{8}$/'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'note_id' => ['nullable', 'integer', 'exists:notes,id'],
            'slug' => ['nullable', 'string', 'exists:notes,slug'],
        ]);

        $noteId = $data['note_id']
            ?? (isset($data['slug']) ? Note::query()->where('slug', $data['slug'])->value('id') : null);

        unset($data['slug']);

        $lead = Lead::query()->create([
            'note_id' => $noteId,
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'status' => 'free',
        ]);

        $note = $lead->note;

        if ($note?->lead_magnet_file_url && $lead->email) {
            try {
                Mail::to($lead->email)->send(
                    new LeadMagnetReady($lead->name, $note->lead_magnet_file_url, $note->title),
                );
            } catch (Throwable $exception) {
                Log::warning('Lead magnet email failed', ['error' => $exception->getMessage()]);
            }
        }

        return response()->json([
            'message' => 'You are in — the download is ready.',
            'download_url' => $note?->lead_magnet_file_url,
        ], 201);
    }

    /**
     * Paid lead magnet — create the lead, then a UddoktaPay charge.
     */
    public function checkout(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^(?:\+?880|0)1[3-9]\d{8}$/'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'slug' => ['required', 'string', 'exists:notes,slug'],
        ]);

        $note = Note::query()->published()->where('slug', $data['slug'])->firstOrFail();

        if (! $note->lead_magnet_payment_required || $note->lead_magnet_price === null) {
            return response()->json(['message' => 'This download is free.'], 422);
        }

        $service = UddoktaPayService::make();

        if (! $service->isConfigured()) {
            return response()->json([
                'message' => 'Payments are not configured yet. Please try again later.',
            ], 503);
        }

        $lead = Lead::query()->create([
            'note_id' => $note->id,
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'amount' => $note->lead_magnet_price,
            'currency' => $service->currency(),
            'status' => 'pending',
        ]);

        $frontend = rtrim((string) config('services.uddoktapay.frontend_url'), '/');
        $returnUrl = $frontend.'/notes/download?slug='.$note->slug;

        $response = $service->createCharge([
            'full_name' => $lead->name,
            'email' => $lead->email,
            'amount' => number_format((float) $note->lead_magnet_price, 2, '.', ''),
            'metadata' => [
                'lead_id' => $lead->id,
                'note_slug' => $note->slug,
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
