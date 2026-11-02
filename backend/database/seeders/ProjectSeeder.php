<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'slug' => 'oopscode',
                'name' => 'OopsCode',
                'kicker' => 'Web & software development',
                'icon' => 'code',
                'summary' => 'Custom websites, web apps and software products for ambitious teams.',
                'tags' => ['Web', 'Apps', 'Software'],
                'sort_order' => 1,
                'description' => '<p>OopsCode is the development arm — a small team that ships fast, accessible marketing sites, dashboards and internal tools.</p><h2>What we build</h2><ul><li>Marketing sites and landing pages that load fast and convert.</li><li>Web apps and admin dashboards (React, Laravel, MySQL).</li><li>Internal tooling and automations that remove manual work.</li></ul><h2>How we work</h2><p>One short discovery, then weekly releases. You always see a working URL, never a status report.</p>',
            ],
            [
                'slug' => 'branding-curve',
                'name' => 'Branding Curve',
                'kicker' => 'Marketing & brand growth',
                'icon' => 'pen',
                'summary' => 'Strategy, content and growth systems for modern brands.',
                'tags' => ['Strategy', 'Content', 'Growth'],
                'sort_order' => 2,
                'description' => '<p>Branding Curve is the marketing agency I founded. It exists for one reason: to give growing brands a repeatable growth system instead of one-off campaigns.</p><h2>The engagement</h2><ul><li>Audience, offer and positioning research.</li><li>Performance media across Meta and Google.</li><li>Conversion funnels, follow-up and reporting.</li></ul><h2>Who it is for</h2><p>E-commerce, clinics, schools and B2B teams who already have something that works and want to scale it without guessing.</p>',
            ],
            [
                'slug' => 'ads-gpt',
                'name' => 'ADS GPT',
                'kicker' => 'Digital marketing',
                'icon' => 'chart',
                'summary' => 'Tools, resources and done-for-you solutions for better advertising.',
                'tags' => ['Ads', 'Tools', 'Automation'],
                'sort_order' => 3,
                'description' => '<p>ADS GPT is where the playbooks live: templates, prompt libraries and small tools that make ad work faster and more honest.</p><h2>Inside</h2><ul><li>Ad copy frameworks tested on real accounts.</li><li>Reporting templates that show profit, not just clicks.</li><li>Prompt kits for research, hooks and creative briefs.</li></ul><h2>Why it exists</h2><p>Most agencies hide their process. I prefer to hand it over — better clients, better results.</p>',
            ],
        ];

        foreach ($projects as $project) {
            Project::query()->updateOrCreate(
                ['slug' => $project['slug']],
                [...$project, 'is_published' => true, 'cta_label' => 'Visit project'],
            );
        }
    }
}
