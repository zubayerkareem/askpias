<?php

namespace App\Filament\Widgets;

use App\Models\CaseStudy;
use App\Models\Lead;
use App\Models\Message;
use App\Models\Note;
use App\Models\Testimonial;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ContentStats extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $unreadMessages = Message::query()->where('is_read', false)->count();
        $totalMessages = Message::query()->count();

        return [
            Stat::make('Notes', Note::query()->count())
                ->description(Note::query()->published()->count().' published')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make('Case studies', CaseStudy::query()->count())
                ->description(CaseStudy::query()->published()->count().' published')
                ->descriptionIcon('heroicon-m-briefcase')
                ->color('primary'),

            Stat::make('Testimonials', Testimonial::query()->count())
                ->description(Testimonial::query()->published()->count().' live on the site')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->color('primary'),

            Stat::make('Unread messages', $unreadMessages)
                ->description($totalMessages.' received in total')
                ->descriptionIcon('heroicon-m-envelope')
                ->color($unreadMessages > 0 ? 'danger' : 'success'),

            Stat::make('Leads', Lead::query()->count())
                ->description('Lead magnet downloads')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('primary'),
        ];
    }
}
