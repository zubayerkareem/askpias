<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->text('question');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->index('is_read');
        });

        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('note_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->timestamps();

            $table->index('created_at');
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_image_url')->nullable();
            $table->string('case_studies_iframe_url')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('tagline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('leads');
        Schema::dropIfExists('messages');
    }
};
