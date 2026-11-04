<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Creates the About page from the content that used to live in
 * src/routes/about.tsx. Production never runs the seeders, so the content
 * ships with the migration instead.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('pages')->where('slug', 'about')->exists()) {
            return;
        }

        $storyBody = <<<'HTML'
<p>I wasn't born into a business family and luck wasn't on my side. It all started with curiosity — a stubborn need to understand what actually makes a business grow.</p>
<p>My first few years were hands-on: running ads for small brands, breaking and rebuilding funnels, reading data every single day. Then it clicked — great marketing isn't just creative work, it's a system.</p>
<p>Today I build exactly that for brands: positioning, paid media, conversion funnels and the reporting that keeps it all honest.</p>
HTML;

        $blocks = [
            [
                'type' => 'hero',
                'data' => [
                    'label' => 'About',
                    'heading' => 'I build marketing systems that grow businesses',
                    'body' => "I'm Pias Ahmed — a brand builder and growth marketer based in Dhaka, and the founder of Branding Curve. I help founders turn scattered marketing into a system that compounds.",
                ],
            ],
            [
                'type' => 'story',
                'data' => [
                    'heading' => 'From curiosity to real impact',
                    'body' => $storyBody,
                    'image' => null,
                    'caption_name' => 'Pias Ahmed',
                    'caption_location' => 'Dhaka, Bangladesh',
                    'facts' => [
                        ['value' => '5 Years', 'label' => 'in Marketing'],
                        ['value' => '20+', 'label' => 'Brands Worked With'],
                    ],
                ],
            ],
            [
                'type' => 'practice',
                'data' => [
                    'heading' => 'What I do',
                    'items' => [
                        [
                            'image' => null,
                            'title' => 'Strategy & positioning',
                            'body' => 'Finding what the market actually buys, then naming it clearly.',
                        ],
                        [
                            'image' => null,
                            'title' => 'Meta & Google Ads',
                            'body' => 'Paid media run against unit economics, not vanity metrics.',
                        ],
                        [
                            'image' => null,
                            'title' => 'Conversion funnels',
                            'body' => 'Landing pages, follow-up and offers that close the loop.',
                        ],
                        [
                            'image' => null,
                            'title' => 'Scaling systems',
                            'body' => 'SOPs and reporting your team can run without me.',
                        ],
                    ],
                ],
            ],
            [
                'type' => 'stats',
                'data' => [
                    'items' => [
                        ['value' => '5+', 'label' => 'years in marketing & growth'],
                        ['value' => '20+', 'label' => 'brands served'],
                        ['value' => '90', 'label' => 'days to steady growth'],
                    ],
                ],
            ],
            [
                'type' => 'cta',
                'data' => [
                    'heading' => "Let's look at your numbers",
                    'body' => "Book a free 30-minute call, or send a message and I'll reply personally.",
                    'primary_label' => 'Book a call',
                    'primary_url' => '/booking',
                    'secondary_label' => 'Contact me',
                    'secondary_url' => '/contact',
                ],
            ],
        ];

        DB::table('pages')->insert([
            'slug' => 'about',
            'title' => 'About Pias Ahmed — Brand Builder & Marketing Consultant',
            'meta_description' => 'Pias Ahmed is a brand builder and growth marketer in Dhaka, founder of Branding Curve. Strategy, performance media and conversion systems for brands that want to scale.',
            'blocks' => json_encode($blocks, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            'is_published' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('pages')->where('slug', 'about')->delete();
    }
};
