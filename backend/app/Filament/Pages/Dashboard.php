<?php

namespace App\Filament\Pages;

use App\Filament\Resources\Books\BookResource;
use App\Filament\Resources\CaseStudies\CaseStudyResource;
use App\Filament\Resources\Leads\LeadResource;
use App\Filament\Resources\Messages\MessageResource;
use App\Filament\Resources\Notes\NoteResource;
use App\Filament\Resources\Projects\ProjectResource;
use App\Filament\Resources\Testimonials\TestimonialResource;
use App\Models\Book;
use App\Models\CaseStudy;
use App\Models\Lead;
use App\Models\Message;
use App\Models\Note;
use App\Models\Project;
use App\Models\Testimonial;
use Carbon\CarbonImmutable;
use Filament\Pages\Dashboard as BaseDashboard;
use Illuminate\Support\Collection;

class Dashboard extends BaseDashboard
{
    protected string $view = 'filament.pages.admin-dashboard';

    /**
     * @return array<int, array<string, mixed>>
     */
    public function stats(): array
    {
        return [
            [
                'label' => 'Notes',
                'value' => Note::query()->count(),
                'meta' => Note::query()->published()->count().' published',
                'tone' => 'blue',
                'icon' => 'doc',
                'url' => NoteResource::getUrl('index'),
            ],
            [
                'label' => 'Case studies',
                'value' => CaseStudy::query()->count(),
                'meta' => CaseStudy::query()->published()->count().' live',
                'tone' => 'green',
                'icon' => 'briefcase',
                'url' => CaseStudyResource::getUrl('index'),
            ],
            [
                'label' => 'Unread messages',
                'value' => Message::query()->where('is_read', false)->count(),
                'meta' => Message::query()->count().' received in total',
                'tone' => 'orange',
                'icon' => 'mail',
                'url' => MessageResource::getUrl('index'),
            ],
        ];
    }

    /**
     * Note publishing activity for the last 8 months.
     *
     * @return array{labels: array<string>, values: array<int>, max: int, points: string}
     */
    public function chart(): array
    {
        $start = CarbonImmutable::now()->startOfMonth()->subMonths(7);

        $counts = Note::query()
            ->whereNotNull('published_at')
            ->where('published_at', '>=', $start)
            ->get(['published_at'])
            ->groupBy(fn (Note $note) => $note->published_at->format('Y-m'))
            ->map(fn (Collection $group) => $group->count());

        $labels = [];
        $values = [];

        for ($i = 0; $i < 8; $i++) {
            $month = $start->addMonths($i);
            $labels[] = $month->format('M');
            $values[] = (int) ($counts[$month->format('Y-m')] ?? 0);
        }

        $max = max(1, ...$values);
        $width = 100;
        $points = [];

        foreach ($values as $index => $value) {
            $x = $index * ($width / 7);
            $y = 100 - (($value / $max) * 82) - 8;
            $points[] = round($x, 2).','.round($y, 2);
        }

        return [
            'labels' => $labels,
            'values' => $values,
            'max' => $max,
            'points' => implode(' ', $points),
        ];
    }

    public function recentMessages(): Collection
    {
        return Message::query()->latest()->limit(4)->get();
    }

    public function recentNotes(): Collection
    {
        return Note::query()->latest('updated_at')->limit(6)->get();
    }

    /**
     * @return array<string, mixed>
     */
    public function secondaryStats(): array
    {
        return [
            'leads' => Lead::query()->count(),
            'messages' => Message::query()->count(),
            'projects' => Project::query()->count(),
            'books' => Book::query()->count(),
            'testimonials' => Testimonial::query()->count(),
        ];
    }

    public function shortLinks(): array
    {
        return [
            ['label' => 'Projects', 'url' => ProjectResource::getUrl('index'), 'count' => Project::query()->count()],
            ['label' => 'Books', 'url' => BookResource::getUrl('index'), 'count' => Book::query()->count()],
            ['label' => 'Testimonials', 'url' => TestimonialResource::getUrl('index'), 'count' => Testimonial::query()->count()],
            ['label' => 'Leads', 'url' => LeadResource::getUrl('index'), 'count' => Lead::query()->count()],
        ];
    }

    public function newNoteUrl(): string
    {
        return NoteResource::getUrl('create');
    }
}
