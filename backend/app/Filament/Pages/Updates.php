<?php

namespace App\Filament\Pages;

use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Throwable;

class Updates extends Page
{
    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowPathRoundedSquare;

    protected static string|\UnitEnum|null $navigationGroup = 'System';

    protected static ?string $navigationLabel = 'Updates';

    protected static ?string $title = 'Application updates';

    protected static ?int $navigationSort = 90;

    protected static ?string $slug = 'updates';

    protected string $view = 'filament.pages.updates';

    public ?string $output = null;

    public function mount(): void
    {
        $this->output = $this->lastOutput();
    }

    public function version(): string
    {
        return (string) config('app.version', '1.0.0');
    }

    public function branch(): string
    {
        return (string) config('app.branch', 'main');
    }

    public function lastUpdated(): string
    {
        $log = storage_path('logs/update.log');

        return is_file($log) ? date('d M Y, H:i', (int) filemtime($log)) : 'Never';
    }

    public function runUpdate(): void
    {
        // A frontend build can take minutes; never let PHP kill the request mid-deploy.
        @set_time_limit(0);
        ignore_user_abort(true);

        $script = base_path('../update.sh');

        if (! is_file($script)) {
            Notification::make()
                ->title('update.sh was not found next to the backend folder')
                ->danger()
                ->send();

            return;
        }

        try {
            $result = Process::path(base_path('..'))
                ->timeout(900)
                ->run(['bash', $script]);

            $this->output = trim($result->output()."\n".$result->error());

            $this->writeLog($this->output);

            if ($result->successful()) {
                Notification::make()->title('Application updated')->success()->send();
            } else {
                Notification::make()
                    ->title('Update failed — read the output below')
                    ->danger()
                    ->send();
            }
        } catch (Throwable $exception) {
            $this->output = $exception->getMessage();
            $this->writeLog($exception->getMessage());

            Notification::make()
                ->title('Could not run the updater')
                ->body('Run update.sh over SSH instead — the PHP user may not have shell access.')
                ->danger()
                ->send();
        }
    }

    private function writeLog(string $output): void
    {
        File::put(
            storage_path('logs/update.log'),
            '['.now()->toDateTimeString().']'.PHP_EOL.$output.PHP_EOL,
        );
    }

    private function lastOutput(): ?string
    {
        $log = storage_path('logs/update.log');

        return is_file($log) ? trim((string) File::get($log)) : null;
    }
}
