<?php

namespace App\Filament\Resources\Pages\Schemas;

use App\Models\Page;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Page')
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
                            fn (?Page $record) => Rule::unique('pages', 'slug')->ignore($record?->id),
                        ])
                        ->helperText('The public page this content renders on, e.g. about'),
                    Textarea::make('meta_description')
                        ->label('Meta description')
                        ->rows(3)
                        ->maxLength(500)
                        ->helperText('Used for the page description and social previews.')
                        ->columnSpanFull(),
                    Toggle::make('is_published')
                        ->label('Published')
                        ->default(true),
                ]),

            Section::make('Sections')
                ->description('Build the page from blocks. Drag to reorder.')
                ->schema([
                    Builder::make('blocks')
                        ->label('')
                        ->addActionLabel('Add section')
                        ->blockNumbers(false)
                        ->blocks([
                            Block::make('hero')
                                ->label('Page header')
                                ->schema([
                                    TextInput::make('label')
                                        ->maxLength(60)
                                        ->helperText('Small kicker above the heading.'),
                                    TextInput::make('heading')
                                        ->required()
                                        ->maxLength(200),
                                    Textarea::make('body')
                                        ->rows(3),
                                ]),

                            Block::make('story')
                                ->label('Story')
                                ->schema([
                                    TextInput::make('heading')
                                        ->required()
                                        ->maxLength(200),
                                    RichEditor::make('body')
                                        ->fileAttachmentsDisk('public')
                                        ->fileAttachmentsDirectory('pages')
                                        ->fileAttachmentsVisibility('public')
                                        ->fileAttachmentsMaxSize(5120)
                                        ->toolbarButtons([
                                            ['bold', 'italic', 'underline', 'strike', 'link'],
                                            ['h2', 'h3'],
                                            ['blockquote', 'bulletList', 'orderedList'],
                                            ['attachFiles'],
                                            ['undo', 'redo'],
                                        ]),
                                    FileUpload::make('image')
                                        ->label('Portrait image')
                                        ->image()
                                        ->disk('public')
                                        ->directory('pages')
                                        ->imageEditor()
                                        ->helperText('Leave empty to use the hero portrait from site settings.'),
                                    TextInput::make('caption_name')
                                        ->label('Caption name')
                                        ->maxLength(120),
                                    TextInput::make('caption_location')
                                        ->label('Caption location')
                                        ->maxLength(120),
                                    Repeater::make('facts')
                                        ->label('Highlights')
                                        ->addActionLabel('Add highlight')
                                        ->schema([
                                            TextInput::make('value')
                                                ->required()
                                                ->maxLength(60),
                                            TextInput::make('label')
                                                ->required()
                                                ->maxLength(80),
                                        ])
                                        ->columns(2)
                                        ->reorderable()
                                        ->collapsible(),
                                ]),

                            Block::make('practice')
                                ->label('What I do')
                                ->schema([
                                    TextInput::make('heading')
                                        ->required()
                                        ->maxLength(120),
                                    Repeater::make('items')
                                        ->label('Cards')
                                        ->addActionLabel('Add card')
                                        ->schema([
                                            FileUpload::make('image')
                                                ->label('Image')
                                                ->image()
                                                ->disk('public')
                                                ->directory('pages')
                                                ->imageEditor(),
                                            TextInput::make('title')
                                                ->required()
                                                ->maxLength(120),
                                            Textarea::make('body')
                                                ->rows(3),
                                        ])
                                        ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                                        ->reorderable()
                                        ->collapsible(),
                                ]),

                            Block::make('stats')
                                ->label('Stats')
                                ->schema([
                                    Repeater::make('items')
                                        ->label('Stats')
                                        ->addActionLabel('Add stat')
                                        ->schema([
                                            TextInput::make('value')
                                                ->required()
                                                ->maxLength(40),
                                            TextInput::make('label')
                                                ->required()
                                                ->maxLength(80),
                                        ])
                                        ->columns(2)
                                        ->reorderable()
                                        ->collapsible(),
                                ]),

                            Block::make('cta')
                                ->label('Call to action')
                                ->columns(2)
                                ->schema([
                                    TextInput::make('heading')
                                        ->required()
                                        ->maxLength(160)
                                        ->columnSpanFull(),
                                    Textarea::make('body')
                                        ->rows(3)
                                        ->columnSpanFull(),
                                    TextInput::make('primary_label')
                                        ->label('Primary button label')
                                        ->maxLength(60),
                                    TextInput::make('primary_url')
                                        ->label('Primary button URL')
                                        ->maxLength(255)
                                        ->helperText('Internal paths like /booking or a full URL.'),
                                    TextInput::make('secondary_label')
                                        ->label('Secondary button label')
                                        ->maxLength(60),
                                    TextInput::make('secondary_url')
                                        ->label('Secondary button URL')
                                        ->maxLength(255),
                                ]),
                        ]),
                ]),
        ]);
    }
}
