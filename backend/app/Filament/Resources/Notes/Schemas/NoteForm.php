<?php

namespace App\Filament\Resources\Notes\Schemas;

use App\Filament\RichEditor\YouTubePlugin;
use App\Models\Note;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class NoteForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Content')
                ->description('Title, summary, body and cover image.')
                ->columns(2)
                ->schema([
                    TextInput::make('title')
                        ->required()
                        ->maxLength(255)
                        ->live(onBlur: true)
                        ->afterStateUpdated(function (string $operation, ?string $state, Set $set): void {
                            if ($operation === 'create') {
                                $set('slug', Str::slug((string) $state));
                            }
                        }),
                    TextInput::make('slug')
                        ->required()
                        ->maxLength(255)
                        ->rules([
                            fn (?Note $record) => Rule::unique('notes', 'slug')->ignore($record?->id),
                        ])
                        ->helperText('Public URL: /notes/{slug}'),
                    Textarea::make('excerpt')
                        ->rows(3)
                        ->maxLength(500)
                        ->columnSpanFull(),
                    RichEditor::make('content')
                        ->columnSpanFull()
                        ->placeholder('Write the note…')
                        ->fileAttachmentsDisk('public')
                        ->fileAttachmentsDirectory('content')
                        ->fileAttachmentsVisibility('public')
                        ->fileAttachmentsAcceptedFileTypes([
                            'image/png',
                            'image/jpeg',
                            'image/webp',
                            'image/gif',
                        ])
                        ->fileAttachmentsMaxSize(5120)
                        ->plugins([new YouTubePlugin()])
                        ->toolbarButtons([
                            ['bold', 'italic', 'underline', 'strike', 'link'],
                            ['h2', 'h3'],
                            ['alignStart', 'alignCenter', 'alignEnd'],
                            [
                                'blockquote',
                                'codeBlock',
                                'bulletList',
                                'orderedList',
                                'horizontalRule',
                            ],
                            ['table', 'attachFiles', 'youtube'],
                            ['undo', 'redo'],
                        ]),
                    FileUpload::make('image_url')
                        ->label('Cover image')
                        ->image()
                        ->disk('public')
                        ->directory('notes')
                        ->imageEditor()
                        ->columnSpanFull(),
                ]),

            Section::make('Publishing')
                ->columns(3)
                ->schema([
                    Toggle::make('is_published')
                        ->label('Published')
                        ->default(true),
                    Toggle::make('featured')
                        ->label('Featured'),
                    Toggle::make('locked')
                        ->label('Members only'),
                    DatePicker::make('published_at')
                        ->default(now()),
                    TextInput::make('sort_order')
                        ->numeric()
                        ->default(0)
                        ->minValue(0),
                ]),

            Section::make('Lead magnet')
                ->description('Optional download offered at the end of the note.')
                ->columns(2)
                ->collapsed()
                ->schema([
                    TextInput::make('lead_magnet_file_url')
                        ->label('File URL')
                        ->url()
                        ->maxLength(255),
                    TextInput::make('lead_magnet_cta_label')
                        ->label('Button label')
                        ->maxLength(255),
                    Toggle::make('lead_magnet_payment_required')
                        ->label('Requires payment'),
                    TextInput::make('lead_magnet_price')
                        ->numeric()
                        ->prefix('৳'),
                ]),
        ]);
    }
}
