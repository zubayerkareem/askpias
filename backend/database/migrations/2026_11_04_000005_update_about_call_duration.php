<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The About page copy still advertises a 30-minute call. Replace the duration
 * in any block text, without touching other admin edits.
 */
return new class extends Migration
{
    public function up(): void
    {
        $this->replace('30-minute', '30-90 minute');
    }

    public function down(): void
    {
        $this->replace('30-90 minute', '30-minute');
    }

    private function replace(string $search, string $replace): void
    {
        $page = DB::table('pages')->where('slug', 'about')->first();

        if (! $page) {
            return;
        }

        $blocks = json_decode((string) $page->blocks, true);

        if (! is_array($blocks)) {
            return;
        }

        array_walk_recursive($blocks, function (&$value) use ($search, $replace): void {
            if (is_string($value)) {
                $value = str_replace($search, $replace, $value);
            }
        });

        DB::table('pages')->where('id', $page->id)->update([
            'blocks' => json_encode($blocks, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'updated_at' => now(),
        ]);
    }
};
