<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Concerns\InteractsWithSchemas;
use Filament\Schemas\Contracts\HasSchemas;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

class ManageSettings extends Page implements HasSchemas
{
    use InteractsWithSchemas;

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static ?string $navigationLabel = 'Site settings';

    protected static ?string $title = 'Site settings';

    protected static ?string $slug = 'settings';

    protected string $view = 'filament.pages.manage-settings';

    /** @var array<string, mixed>|null */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = SiteSetting::current()->makeVisible('uddoktapay_api_key');

        $this->form->fill($settings->attributesToArray());
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Homepage')
                    ->description('Hero image and the featured video shown on the case studies page.')
                    ->columns(2)
                    ->schema([
                        FileUpload::make('hero_image_url')
                            ->label('Hero portrait')
                            ->image()
                            ->disk('public')
                            ->directory('site')
                            ->imageEditor()
                            ->columnSpanFull(),
                        TextInput::make('case_studies_iframe_url')
                            ->label('Featured video embed URL')
                            ->url()
                            ->columnSpanFull(),
                        TextInput::make('intro_video_url')
                            ->label('Homepage intro video (YouTube URL)')
                            ->url()
                            ->helperText('Shown behind the play button in the hero.')
                            ->columnSpanFull(),
                    ]),

                Section::make('Analytics')
                    ->description('Google Tag Manager container loaded on every page.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('gtm_container_id')
                            ->label('GTM container ID')
                            ->placeholder('GTM-XXXXXXX')
                            ->regex('/^GTM-[A-Z0-9]{4,10}$/i')
                            ->helperText('Leave empty to disable Tag Manager. Meta Pixel, CAPI and other tags are configured inside GTM.')
                            ->columnSpanFull(),
                    ]),

                Section::make('Payments')
                    ->description('UddoktaPay (self-hosted) — used for paid lead magnets.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('uddoktapay_base_url')
                            ->label('UddoktaPay URL')
                            ->url()
                            ->placeholder('https://pay.your-domain.com')
                            ->helperText('Your self-hosted UddoktaPay installation URL.'),
                        TextInput::make('uddoktapay_api_key')
                            ->label('API key')
                            ->password()
                            ->revealable()
                            ->helperText('From UddoktaPay → API Settings.'),
                        TextInput::make('uddoktapay_currency')
                            ->label('Currency')
                            ->default('BDT')
                            ->maxLength(8),
                    ]),

                Section::make('Email (SMTP)')
                    ->description('Used for lead-magnet downloads and contact-form replies.')
                    ->columns(3)
                    ->schema([
                        TextInput::make('mail_host')
                            ->label('SMTP host')
                            ->placeholder('smtp.your-provider.com'),
                        TextInput::make('mail_port')
                            ->label('Port')
                            ->numeric()
                            ->placeholder('587'),
                        Select::make('mail_encryption')
                            ->label('Encryption')
                            ->options(['tls' => 'TLS (587)', 'ssl' => 'SSL (465)'])
                            ->placeholder('None'),
                        TextInput::make('mail_username')
                            ->label('Username')
                            ->autocomplete('off'),
                        TextInput::make('mail_password')
                            ->label('Password')
                            ->password()
                            ->revealable()
                            ->autocomplete('new-password'),
                        TextInput::make('mail_from_address')
                            ->label('From address')
                            ->email()
                            ->placeholder('hello@askpias.com'),
                        TextInput::make('mail_from_name')
                            ->label('From name')
                            ->placeholder('Pias Ahmed'),
                    ]),

                Section::make('SEO')
                    ->description('Sitemap and robots.txt served by the website.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('seo_site_url')
                            ->label('Site URL')
                            ->url()
                            ->placeholder('https://askpias.com'),
                        Toggle::make('sitemap_enabled')
                            ->label('Serve sitemap.xml')
                            ->default(true),
                        Textarea::make('robots_txt')
                            ->label('robots.txt')
                            ->rows(7)
                            ->columnSpanFull()
                            ->placeholder("User-agent: *\nAllow: /\nSitemap: https://askpias.com/sitemap.xml"),
                    ]),

                Section::make('Contact')
                    ->columns(2)
                    ->schema([
                        TextInput::make('contact_email')
                            ->label('Contact email')
                            ->email(),
                        TextInput::make('tagline')
                            ->label('Footer tagline'),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        SiteSetting::current()->update($this->form->getState());

        Notification::make()
            ->title('Site settings saved')
            ->success()
            ->send();
    }
}
