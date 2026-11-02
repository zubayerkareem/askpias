<?php

namespace App\Filament\Resources\CaseStudies\Schemas;

use App\Filament\RichEditor\YouTubePlugin;
use App\Models\CaseStudy;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CaseStudyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Case study')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
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
                            fn (?CaseStudy $record) => Rule::unique('case_studies', 'slug')->ignore($record?->id),
                        ])
                        ->helperText('Public URL: /case-studies/{slug}'),
                    Textarea::make('summary')
                        ->rows(3)
                        ->maxLength(400)
                        ->columnSpanFull(),
                    RichEditor::make('content')
                        ->columnSpanFull()
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
                            ['blockquote', 'bulletList', 'orderedList', 'horizontalRule'],
                            ['table', 'attachFiles', 'youtube'],
                            ['undo', 'redo'],
                        ]),
                    FileUpload::make('image_url')
                        ->label('Cover image')
                        ->image()
                        ->disk('public')
                        ->directory('case-studies')
                        ->imageEditor()
                        ->columnSpanFull(),
                ]),

            Section::make('Details')
                ->columns(3)
                ->schema([
                    TagsInput::make('tags')
                        ->placeholder('Add a tag')
                        ->columnSpan(2),
                    Toggle::make('is_published')
                        ->label('Published')
                        ->default(true),
                    TextInput::make('sort_order')
                        ->numeric()
                        ->default(0)
                        ->minValue(0),
                ]),
        ]);
    }
}
