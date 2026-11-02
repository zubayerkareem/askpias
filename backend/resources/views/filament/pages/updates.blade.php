<x-filament-panels::page>
    <style>
        .ap-up { display: grid; gap: 1.25rem; }
        .ap-up-grid { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
        .ap-up-fact { border: 1px solid rgba(16, 16, 18, .1); border-radius: 10px; padding: .85rem 1rem; background: #fff; }
        .ap-up-label { font-size: .68rem; text-transform: uppercase; letter-spacing: .08em; color: #6b6b76; font-weight: 700; }
        .ap-up-value { margin-top: .3rem; font-size: .95rem; font-weight: 700; color: #101012; }
        .ap-up-btn { display: inline-flex; align-items: center; gap: .5rem; background: #0141c5; color: #fff; border: 0; border-radius: 8px; padding: .65rem 1.1rem; font-weight: 700; font-size: .85rem; cursor: pointer; }
        .ap-up-btn[disabled] { opacity: .6; cursor: progress; }
        .ap-up-hint { font-size: .82rem; line-height: 1.65; color: #6b6b76; max-width: 72ch; }
        .ap-up-hint code { background: rgba(16, 16, 18, .06); border-radius: 4px; padding: .1rem .35rem; font-size: .78rem; }
        .ap-up-log { margin: 0; padding: 1rem; border-radius: 10px; background: #0f1013; color: #d6dbe6; font-size: .76rem; line-height: 1.55; overflow: auto; max-height: 420px; white-space: pre-wrap; word-break: break-word; }
    </style>

    <div class="ap-up">
        <div class="ap-up-grid">
            <div class="ap-up-fact">
                <div class="ap-up-label">Version</div>
                <div class="ap-up-value">{{ $this->version() }}</div>
            </div>
            <div class="ap-up-fact">
                <div class="ap-up-label">Branch</div>
                <div class="ap-up-value">{{ $this->branch() }}</div>
            </div>
            <div class="ap-up-fact">
                <div class="ap-up-label">Last update</div>
                <div class="ap-up-value">{{ $this->lastUpdated() }}</div>
            </div>
        </div>

        <p class="ap-up-hint">
            Runs <code>update.sh</code> in the project root: git pull, composer install, pending
            migrations, cache rebuild, frontend build and the site restart. The database and
            uploaded files are untouched. If it fails with a permission error, run
            <code>bash update.sh</code> once over SSH so file ownership is corrected.
        </p>

        <div>
            <button
                type="button"
                class="ap-up-btn"
                wire:click="runUpdate"
                wire:loading.attr="disabled"
                wire:target="runUpdate"
                wire:confirm="Pull the latest code from GitHub and rebuild the site?"
            >
                <span wire:loading.remove wire:target="runUpdate">Run update now</span>
                <span wire:loading wire:target="runUpdate">Updating — this can take a couple of minutes…</span>
            </button>
        </div>

        @if ($output)
            <div>
                <div class="ap-up-label" style="margin-bottom: .5rem;">Last output</div>
                <pre class="ap-up-log">{{ $output }}</pre>
            </div>
        @endif
    </div>
</x-filament-panels::page>
