<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\LeadMagnetReady;
use App\Models\Lead;
use App\Services\UddoktaPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class PaymentController extends Controller
{
    /**
     * Called by the payment return page with the invoice id from UddoktaPay.
     */
    public function verify(Request $request): JsonResponse
    {
        $invoiceId = trim((string) $request->query('invoice_id', ''));

        if ($invoiceId === '') {
            return response()->json(['status' => 'error', 'message' => 'Missing invoice id.'], 422);
        }

        $service = UddoktaPayService::make();

        if (! $service->isConfigured()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payments are not configured.',
            ], 503);
        }

        $result = $service->verify($invoiceId);
        $remoteStatus = strtoupper((string) ($result['status'] ?? 'ERROR'));

        $leadId = $result['metadata']['lead_id'] ?? null;

        $lead = $leadId
            ? Lead::query()->with('note')->find($leadId)
            : Lead::query()->with('note')->where('invoice_id', $invoiceId)->first();

        if (! $lead) {
            return response()->json([
                'status' => 'error',
                'message' => 'We could not find that payment.',
            ], 404);
        }

        $wasPaid = $lead->isPaid();

        if ($remoteStatus === 'COMPLETED') {
            $lead->update([
                'invoice_id' => $invoiceId,
                'status' => 'paid',
                'payment_method' => $result['payment_method'] ?? null,
                'transaction_id' => $result['transaction_id'] ?? null,
                'paid_at' => now(),
            ]);
        } elseif ($lead->status !== 'paid') {
            $lead->update([
                'invoice_id' => $invoiceId,
                'status' => $remoteStatus === 'PENDING' ? 'pending' : 'failed',
            ]);
        }

        $note = $lead->note;

        if (! $wasPaid && $lead->isPaid() && $note?->lead_magnet_file_url && $lead->email) {
            try {
                Mail::to($lead->email)->send(
                    new LeadMagnetReady($lead->name, $note->lead_magnet_file_url, $note->title),
                );
            } catch (Throwable $exception) {
                Log::warning('Paid lead magnet email failed', ['error' => $exception->getMessage()]);
            }
        }

        return response()->json([
            'status' => $lead->status,
            'note_slug' => $note?->slug,
            'note_title' => $note?->title,
            'download_url' => $lead->isPaid() ? $note?->lead_magnet_file_url : null,
            'amount' => $lead->amount !== null ? (float) $lead->amount : null,
            'currency' => $lead->currency,
        ]);
    }
}
