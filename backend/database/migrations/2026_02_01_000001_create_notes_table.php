<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->longText('content')->nullable();
            $table->string('category')->default('General');
            $table->string('image_url')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('locked')->default(false);
            $table->unsignedInteger('comment_count')->default(0);
            $table->date('published_at')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->string('lead_magnet_file_url')->nullable();
            $table->string('lead_magnet_cta_label')->nullable();
            $table->boolean('lead_magnet_payment_required')->default(false);
            $table->decimal('lead_magnet_price', 10, 2)->nullable();
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
            $table->index('published_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
