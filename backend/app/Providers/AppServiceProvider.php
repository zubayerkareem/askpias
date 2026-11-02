<?php

namespace App\Providers;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Throwable;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureMailFromAdmin();
    }

    /**
     * Use the SMTP account configured in the admin panel, when it exists.
     */
    private function configureMailFromAdmin(): void
    {
        try {
            if (! Schema::hasTable('site_settings')) {
                return;
            }

            SiteSetting::query()->first()?->applyMailConfig();
        } catch (Throwable) {
            // Database not ready (fresh install / migrations) — ignore.
        }
    }
}
