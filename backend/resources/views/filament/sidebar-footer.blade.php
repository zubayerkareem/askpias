@php
    $user = auth()->user();
    $initials = strtoupper(
        collect(explode(' ', $user?->name ?? 'Admin'))
            ->filter()
            ->map(fn ($part) => mb_substr($part, 0, 1))
            ->take(2)
            ->implode(''),
    );
@endphp

<div class="ap-ws">
    <span class="ap-ws-avatar">{{ $initials ?: 'AD' }}</span>

    <span class="ap-ws-main">
        <span class="ap-ws-name">{{ $user?->name ?? 'Administrator' }}</span>
        <span class="ap-ws-role">Administrator</span>
    </span>

    <a class="ap-ws-link" href="{{ url('/') }}" target="_blank" rel="noopener" title="View site">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden>
            <path d="M14 4h6v6M20 4 10 14M9 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </a>
</div>
