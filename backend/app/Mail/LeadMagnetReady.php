<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeadMagnetReady extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $recipientName,
        public string $downloadUrl,
        public ?string $noteTitle = null,
        public ?string $productKind = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your download is ready',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.lead-magnet-ready',
        );
    }
}
