<?php

namespace Database\Seeders;

use App\Models\CaseStudy;
use App\Models\Note;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin account — change the password after the first login.
        User::query()->updateOrCreate(
            ['email' => 'admin@askpias.com'],
            [
                'name' => 'Pias Ahmed',
                'password' => Hash::make('password'),
            ],
        );

        SiteSetting::query()->updateOrCreate(['id' => 1], [
            'contact_email' => 'pias@askpias.com',
            'tagline' => 'Marketing systems, not marketing tricks.',
        ]);

        $this->seedNotes();
        $this->seedCaseStudies();
        $this->seedTestimonials();

        $this->call([
            ProjectSeeder::class,
            BookSeeder::class,
        ]);
    }

    private function seedNotes(): void
    {
        $notes = [
            [
                'slug' => 'why-your-ads-stop-working-after-month-two',
                'title' => 'Why your ads stop working after month two',
                'image_url' => '/blog/cover-1.svg',
                'excerpt' => "The first weeks look great, then cost per lead climbs. It's rarely the algorithm — it's creative fatigue and audience overlap.",
                'featured' => true,
                'published_at' => '2026-10-18',
                'sort_order' => 1,
                'content' => '<p>Every account follows the same curve. Week one is cheap, week four is respectable, month two is a small panic. The instinct is to blame the platform. Usually the real cause is that you are showing the same promise to the same people.</p><h2>What actually decays</h2><p>Creative is the only real lever in a modern ad account. When the same three assets run against the same audience for six weeks, frequency climbs and the auction charges you for the repetition.</p><ul><li>Track frequency weekly, not monthly.</li><li>Refresh the hook, keep the offer.</li><li>Separate cold and warm audiences so they cannot overlap.</li></ul><h2>The reset that worked</h2><p>In one e-commerce account, four new hooks built on the same offer brought cost per purchase back down 38% without touching budget or bidding.</p>',
            ],
            [
                'slug' => 'the-follow-up-system-behind-a-dental-clinic',
                'title' => "The follow-up system behind a dental clinic's 3x bookings",
                'image_url' => '/blog/cover-2.svg',
                'excerpt' => 'No clever creative. Just a five-touch follow-up sequence and a booking page that removes every reason to hesitate.',
                'featured' => true,
                'published_at' => '2026-09-30',
                'sort_order' => 2,
                'content' => "<p>The clinic didn't have a traffic problem. It had a memory problem: enquiries arrived, nobody followed up, and the lead went to whichever clinic called first.</p><h2>The five touches</h2><p>Call within 10 minutes, WhatsApp summary the same hour, a reminder the next morning, a slot offer on day three, and a final check-in on day seven.</p><p>Bookings tripled in six weeks with the same ad spend.</p>",
            ],
            [
                'slug' => 'fix-the-offer-before-you-touch-the-audience',
                'title' => 'Fix the offer before you touch the audience',
                'image_url' => '/blog/cover-3.svg',
                'excerpt' => 'Most “bad traffic” complaints are an offer problem. A simple test tells you which one you are actually dealing with.',
                'featured' => false,
                'published_at' => '2026-09-12',
                'sort_order' => 3,
                'content' => "<p>If people click but don't buy, the traffic isn't the problem. Run two ad sets with identical creative — one to a warm list, one to cold traffic.</p><p>If both convert at the same weak rate, the offer is the constraint. If only cold underperforms, it is a trust or targeting issue.</p>",
            ],
            [
                'slug' => 'positioning-in-one-sentence',
                'title' => 'Positioning in one sentence',
                'image_url' => '/blog/cover-4.svg',
                'excerpt' => 'If your team cannot finish “we are the only ___ that ___”, no landing page will save the campaign.',
                'featured' => false,
                'published_at' => '2026-08-27',
                'sort_order' => 4,
                'content' => '<p>Positioning is not a values statement. It is a claim about who you are for, what you replace, and why you win. One sentence, no adjectives.</p><p>Write it. Then read it out loud in a sales call. If it sounds like everybody else, it is.</p>',
            ],
        ];

        foreach ($notes as $note) {
            Note::query()->updateOrCreate(
                ['slug' => $note['slug']],
                [...$note, 'is_published' => true],
            );
        }
    }

    private function seedCaseStudies(): void
    {
        $caseStudies = [
            [
                'slug' => 'zarin-lifestyle',
                'name' => 'Zarin Lifestyle',
                'summary' => 'A fashion brand stuck at BDT 6L a month. One hero offer, a rebuilt funnel and a cleaner creative system cut acquisition cost by 41% in a quarter.',
                'tags' => ['E-commerce', 'Meta Ads'],
                'sort_order' => 1,
                'content' => '<h2>The problem</h2><p>Five offers running at once, each with its own landing page, none converting above 1.2%.</p><h2>The system</h2><p>Consolidated to one hero offer, rebuilt the product page around a single promise, and moved every campaign to a two-stage funnel with retargeting built in.</p><h2>The result</h2><p>Cost per purchase down 41%, monthly revenue up from BDT 6L to BDT 14L in eleven weeks.</p>',
            ],
            [
                'slug' => 'dhaka-dental-studio',
                'name' => 'Dhaka Dental Studio',
                'summary' => 'Three clinics, one pipeline. A follow-up and booking system turned missed enquiries into 3.2x weekly appointments.',
                'tags' => ['Local service', 'Funnel'],
                'sort_order' => 2,
                'content' => '<h2>The problem</h2><p>Enquiries arrived across four channels and lived in four different inboxes.</p><h2>The system</h2><p>One shared inbox, one booking page, and a five-touch follow-up sequence with a named owner for every stage.</p><h2>The result</h2><p>Weekly appointments up 3.2x with the same ad budget.</p>',
            ],
            [
                'slug' => 'ledgerly',
                'name' => 'Ledgerly',
                'summary' => 'B2B SaaS with a strong product and a weak message. Repositioning plus a rebuilt onboarding sequence lifted trial-to-paid by 62%.',
                'tags' => ['B2B SaaS', 'Positioning'],
                'sort_order' => 3,
                'content' => '<h2>The problem</h2><p>Signups were healthy, activation was not. The product looked like a tool, so it was compared on price.</p><h2>The system</h2><p>Repositioned around the outcome finance teams report upward, then rewrote the trial emails around the first useful moment.</p><h2>The result</h2><p>Trial-to-paid conversion up 62% over one quarter.</p>',
            ],
        ];

        foreach ($caseStudies as $caseStudy) {
            CaseStudy::query()->updateOrCreate(
                ['slug' => $caseStudy['slug']],
                [...$caseStudy, 'is_published' => true],
            );
        }
    }

    private function seedTestimonials(): void
    {
        $testimonials = [
            [
                'headline' => 'Sales more than doubled',
                'quote' => "Pias doesn't just run ads — he understands the whole business and builds a system around it. Our sales more than doubled in three months.",
                'name' => 'Sadia Rahman',
                'role' => 'Founder',
                'company' => 'Zarin Lifestyle',
                'initials' => 'SR',
                'sort_order' => 1,
            ],
            [
                'headline' => 'No more missed appointments',
                'quote' => "In the very first meeting I realised our problem wasn't marketing, it was follow-up. Since his system went live we don't miss appointments anymore.",
                'name' => 'Dr. Tanvir Hasan',
                'role' => 'Director',
                'company' => 'Dhaka Dental Studio',
                'initials' => 'TH',
                'sort_order' => 2,
            ],
            [
                'headline' => 'Our messaging finally clicked',
                'quote' => 'Our messaging changed completely. Now prospects tell us on sales calls exactly what we solve.',
                'name' => 'Imran K.',
                'role' => 'Co-founder',
                'company' => 'Ledgerly',
                'initials' => 'IK',
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::query()->updateOrCreate(
                ['name' => $testimonial['name'], 'headline' => $testimonial['headline']],
                [...$testimonial, 'is_published' => true, 'rating' => 5],
            );
        }
    }
}
