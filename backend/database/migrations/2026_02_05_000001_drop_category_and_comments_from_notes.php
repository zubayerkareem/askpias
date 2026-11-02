<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            $table->dropIndex(['is_published', 'sort_order']);
        });

        Schema::table('notes', function (Blueprint $table) {
            $table->dropColumn(['category', 'comment_count']);
        });
    }

    public function down(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            $table->string('category')->default('General')->after('content');
            $table->unsignedInteger('comment_count')->default(0)->after('locked');
        });
    }
};
