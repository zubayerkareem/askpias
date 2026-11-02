<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('uddoktapay_base_url')->nullable()->after('gtm_container_id');
            $table->string('uddoktapay_api_key')->nullable()->after('uddoktapay_base_url');
            $table->string('uddoktapay_currency', 8)->default('BDT')->after('uddoktapay_api_key');
        });

        Schema::table('leads', function (Blueprint $table) {
            $table->string('invoice_id')->nullable()->unique()->after('note_id');
            $table->decimal('amount', 10, 2)->nullable()->after('invoice_id');
            $table->string('currency', 8)->nullable()->after('amount');
            $table->string('status', 20)->default('free')->after('currency');
            $table->string('payment_method')->nullable()->after('status');
            $table->string('transaction_id')->nullable()->after('payment_method');
            $table->timestamp('paid_at')->nullable()->after('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn([
                'invoice_id',
                'amount',
                'currency',
                'status',
                'payment_method',
                'transaction_id',
                'paid_at',
            ]);
        });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['uddoktapay_base_url', 'uddoktapay_api_key', 'uddoktapay_currency']);
        });
    }
};
