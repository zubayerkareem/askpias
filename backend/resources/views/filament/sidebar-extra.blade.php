@php
    use App\Filament\Resources\Books\BookResource;
    use App\Filament\Resources\CaseStudies\CaseStudyResource;
    use App\Filament\Resources\Notes\NoteResource;
    use App\Filament\Resources\Projects\ProjectResource;

    $actions = [
        ['label' => 'New note', 'url' => NoteResource::getUrl('create'), 'icon' => 'note'],
        ['label' => 'New case study', 'url' => CaseStudyResource::getUrl('create'), 'icon' => 'case'],
        ['label' => 'New project', 'url' => ProjectResource::getUrl('create'), 'icon' => 'project'],
        ['label' => 'New book', 'url' => BookResource::getUrl('create'), 'icon' => 'book'],
    ];
@endphp

<div class="ap-side-extra">
    <p class="ap-side-label">Quick actions</p>

    @foreach ($actions as $action)
        <a class="ap-side-action" href="{{ $action['url'] }}">
            <span class="ap-side-ic">
                @switch($action['icon'])
                    @case('case')
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        @break
                    @case('project')
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 19c3-8 8-11 14-12"/><path d="M14 4h5v5"/></svg>
                        @break
                    @case('book')
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M8 3v18"/></svg>
                        @break
                    @default
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 13h5M10 17h5"/></svg>
                @endswitch
            </span>
            {{ $action['label'] }}
        </a>
    @endforeach

    <a class="ap-side-action" href="{{ url('/') }}" target="_blank" rel="noopener">
        <span class="ap-side-ic">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 4h6v6M20 4 10 14"/><path d="M9 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4"/></svg>
        </span>
        View live site
    </a>
</div>
