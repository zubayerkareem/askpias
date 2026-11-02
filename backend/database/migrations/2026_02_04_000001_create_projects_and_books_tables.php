<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('kicker')->nullable();
            $table->string('summary', 500)->nullable();
            $table->longText('description')->nullable();
            $table->string('icon')->default('code');
            $table->json('tags')->nullable();
            $table->string('url')->nullable();
            $table->string('cta_label')->nullable();
            $table->boolean('is_published')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
        });

        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle', 500)->nullable();
            $table->longText('description')->nullable();
            $table->string('badge')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('currency', 8)->default('BDT');
            $table->json('features')->nullable();
            $table->string('buy_url')->nullable();
            $table->string('sample_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_published', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
        Schema::dropIfExists('projects');
    }
};
