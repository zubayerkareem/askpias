<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'hero_image_url',
        'case_studies_iframe_url',
        'intro_video_url',
        'gtm_container_id',
        'uddoktapay_base_url',
        'uddoktapay_api_key',
        'uddoktapay_currency',
        'mail_host',
        'mail_port',
        'mail_username',
        'mail_password',
        'mail_encryption',
        'mail_from_address',
        'mail_from_name',
        'seo_site_url',
        'robots_txt',
        'sitemap_enabled',
        'contact_email',
        'tagline',
    ];

    protected $hidden = ['uddoktapay_api_key', 'mail_password'];

    protected function casts(): array
    {
        return [
            'sitemap_enabled' => 'boolean',
            'mail_port' => 'integer',
        ];
    }

    /**
     * Apply the SMTP settings stored in the admin to the mail config.
     */
    public function applyMailConfig(): void
    {
        if (blank($this->mail_host)) {
            return;
        }

        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => $this->mail_host,
            'mail.mailers.smtp.port' => $this->mail_port ?: 587,
            'mail.mailers.smtp.username' => $this->mail_username,
            'mail.mailers.smtp.password' => $this->mail_password,
            'mail.mailers.smtp.encryption' => $this->mail_encryption ?: null,
            'mail.from.address' => $this->mail_from_address ?: config('mail.from.address'),
            'mail.from.name' => $this->mail_from_name ?: config('mail.from.name'),
        ]);
    }

    /**
     * The settings row is a singleton (id = 1).
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate(['id' => 1], [
            'contact_email' => 'pias@askpias.com',
            'tagline' => 'Marketing systems, not marketing tricks.',
        ]);
    }
}
