<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class UddoktaPayService
{
    public function __construct(private readonly SiteSetting $settings) {}

    public static function make(): self
    {
        return new self(SiteSetting::current());
    }

    public function isConfigured(): bool
    {
        return filled($this->settings->uddoktapay_base_url)
            && filled($this->settings->uddoktapay_api_key);
    }

    public function currency(): string
    {
        return $this->settings->uddoktapay_currency ?: 'BDT';
    }

    /**
     * Create a charge and return UddoktaPay's response.
     *
     * @param  array{full_name: string, email: string, amount: string, metadata: array<string, mixed>, redirect_url: string, cancel_url: string}  $payload
     * @return array{status: bool, message?: string, payment_url?: string}
     */
    public function createCharge(array $payload): array
    {
        return $this->post('api/checkout-v2', [
            'return_type' => 'GET',
            ...$payload,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function verify(string $invoiceId): array
    {
        return $this->post('api/verify-payment', [
            'invoice_id' => $invoiceId,
        ]);
    }

    /**
     * @param  array<string, mixed>  $body
     * @return array<string, mixed>
     */
    private function post(string $path, array $body): array
    {
        if (! $this->isConfigured()) {
            return [
                'status' => false,
                'message' => 'UddoktaPay is not configured.',
            ];
        }

        $base = rtrim((string) $this->settings->uddoktapay_base_url, '/');

        // Accept both "https://pay.example.com" and "https://pay.example.com/api".
        $base = preg_replace('~/api$~i', '', $base);

        $url = $base.'/'.ltrim($path, '/');

        try {
            $response = Http::withHeaders([
                'RT-UDDOKTAPAY-API-KEY' => $this->settings->uddoktapay_api_key,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->connectTimeout(8)->timeout(15)->post($url, $body);

            $json = $response->json();

            if (! is_array($json)) {
                Log::warning('UddoktaPay returned a non-JSON response', [
                    'url' => $url,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return ['status' => false, 'message' => 'Unexpected response from the payment gateway.'];
            }

            return $json;
        } catch (Throwable $exception) {
            Log::error('UddoktaPay request failed', [
                'url' => $url,
                'error' => $exception->getMessage(),
            ]);

            return [
                'status' => false,
                'message' => 'Could not reach the payment gateway.',
            ];
        }
    }
}
