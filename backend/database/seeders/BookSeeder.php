<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        Book::query()->updateOrCreate(
            ['slug' => 'meta-ads-thermodynamics'],
            [
                'title' => 'Meta Ads Thermodynamics',
                'subtitle' => 'Understand the science behind better ads.',
                'badge' => 'Featured ebook',
                'price' => 298,
                'currency' => 'BDT',
                'features' => [
                    'PDF ebook (120 pages)',
                    'Community access',
                    'Lifetime updates',
                ],
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'description' => '<p>A practical guide to thinking clearly about Meta Ads: how the auction really works, why creative decays, and how to build a testing system you can trust.</p><h2>What you will learn</h2><ul><li>Reading the auction without drowning in metrics.</li><li>Creative testing that produces decisions, not noise.</li><li>Budget and scaling rules for small and mid-size accounts.</li></ul>',
            ],
        );
    }
}
