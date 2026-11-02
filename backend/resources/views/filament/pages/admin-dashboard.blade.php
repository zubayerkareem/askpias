<x-filament-panels::page>
    <style>
        /* This page renders its own welcome heading. */
        .fi-header { display: none; }
    </style>

    <div class="ap-dash">
        <div class="ap-dash-head">
            <div>
                <h1 class="ap-h1">Welcome back, Pias <span aria-hidden>👋</span></h1>
                <p class="ap-sub">Your content, leads and messages — all in one place.</p>
            </div>

            <div class="ap-dash-actions">
                <span class="ap-pill">{{ now()->format('d M Y') }}</span>
                <a href="{{ $this->newNoteUrl() }}" class="ap-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ap-primary-ic"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
                    New note
                </a>
            </div>
        </div>

        <div class="ap-stats">
            @foreach ($this->stats() as $stat)
                <a href="{{ $stat['url'] }}" class="ap-stat">
                    <div class="ap-stat-top">
                        <span class="ap-ic ap-ic-{{ $stat['tone'] }}">
                            @switch($stat['icon'])
                                @case('briefcase')
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg>
                                    @break
                                @case('mail')
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                                    @break
                                @default
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 13h5M10 17h5"/></svg>
                            @endswitch
                        </span>
                        <span class="ap-stat-value">{{ $stat['value'] }}</span>
                        <span class="ap-stat-label">{{ $stat['label'] }}</span>
                    </div>
                    <div class="ap-stat-foot">
                        <span>{{ $stat['meta'] }}</span>
                        <span class="ap-link">View details <span aria-hidden>→</span></span>
                    </div>
                </a>
            @endforeach
        </div>

        <div class="ap-grid">
            <div class="ap-col">
                <div class="ap-card">
                    <div class="ap-card-head">
                        <div>
                            <p class="ap-card-title">Publishing activity</p>
                            <p class="ap-card-sub">Notes published per month</p>
                        </div>
                        <span class="ap-chip">
                            {{ now()->subMonths(7)->format('M Y') }} – {{ now()->format('M Y') }}
                        </span>
                    </div>

                    @php($chart = $this->chart())

                    <div class="ap-chart">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="ap-chart-svg" aria-hidden>
                            <defs>
                                <linearGradient id="apFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stop-color="#0141C5" stop-opacity="0.18"/>
                                    <stop offset="100%" stop-color="#0141C5" stop-opacity="0"/>
                                </linearGradient>
                            </defs>
                            <polyline points="0,100 {{ $chart['points'] }} 100,100" fill="url(#apFill)" stroke="none"/>
                            <polyline
                                points="{{ $chart['points'] }}"
                                fill="none"
                                stroke="#0141C5"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                vector-effect="non-scaling-stroke"
                            />
                        </svg>
                        <div class="ap-chart-x">
                            @foreach ($chart['labels'] as $label)
                                <span>{{ $label }}</span>
                            @endforeach
                        </div>
                    </div>
                </div>

                <div class="ap-card">
                    <div class="ap-card-head">
                        <p class="ap-card-title">Recently updated</p>
                        <a class="ap-link" href="{{ \App\Filament\Resources\Notes\NoteResource::getUrl('index') }}">View all <span aria-hidden>→</span></a>
                    </div>

                    <div class="ap-people">
                        @foreach ($this->recentNotes() as $note)
                            <a class="ap-person" href="{{ \App\Filament\Resources\Notes\NoteResource::getUrl('edit', ['record' => $note]) }}">
                                <span class="ap-avatar">{{ \Illuminate\Support\Str::upper(\Illuminate\Support\Str::substr($note->category, 0, 2)) }}</span>
                                <span class="ap-person-main">
                                    <span class="ap-person-name">{{ \Illuminate\Support\Str::limit($note->title, 44) }}</span>
                                    <span class="ap-person-mail">{{ $note->category }} · {{ $note->updated_at?->diffForHumans() }}</span>
                                </span>
                                <span class="ap-dots" aria-hidden>⋮</span>
                            </a>
                        @endforeach
                    </div>
                </div>
            </div>

            <div class="ap-col">
                <div class="ap-card">
                    <div class="ap-card-head">
                        <p class="ap-card-title">Inbox</p>
                        <span class="ap-chip">{{ now()->format('d M') }}</span>
                    </div>

                    <div class="ap-today">
                        @forelse ($this->recentMessages() as $message)
                            <a class="ap-event" href="{{ \App\Filament\Resources\Messages\MessageResource::getUrl('view', ['record' => $message]) }}">
                                <span class="ap-event-bar ap-event-{{ $loop->index % 3 }}"></span>
                                <span class="ap-event-main">
                                    <span class="ap-event-title">{{ $message->name ?: 'New message' }}</span>
                                    <span class="ap-event-time">{{ $message->created_at?->format('H:i') }} · {{ $message->email }}</span>
                                </span>
                            </a>
                        @empty
                            <p class="ap-empty">No messages yet — they'll appear here.</p>
                        @endforelse
                    </div>
                </div>

                <div class="ap-card ap-card-gradient">
                    <p class="ap-grad-label">Lead magnet downloads</p>
                    <p class="ap-grad-value">{{ $this->secondaryStats()['leads'] }}</p>
                    <p class="ap-grad-sub">{{ $this->secondaryStats()['messages'] }} messages received</p>
                </div>

                <div class="ap-card">
                    <div class="ap-card-head">
                        <p class="ap-card-title">Content</p>
                    </div>
                    <ul class="ap-links">
                        @foreach ($this->shortLinks() as $link)
                            <li>
                                <a href="{{ $link['url'] }}">
                                    <span>{{ $link['label'] }}</span>
                                    <span class="ap-count">{{ $link['count'] }}</span>
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>
</x-filament-panels::page>
