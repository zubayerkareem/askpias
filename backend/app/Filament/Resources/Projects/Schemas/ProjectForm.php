<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Models\Project;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Project')
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
                            fn (?Project $record) => Rule::unique('projects', 'slug')->ignore($record?->id),
                        ])
                        ->helperText('Public URL: /projects/{slug}'),
                    TextInput::make('kicker')
                        ->label('Kicker')
                        ->maxLength(120)
                        ->helperText('Short category shown under the name.'),
                    Select::make('icon')
                        ->options([
                            'code' => 'Code',
                            'pen' => 'Pen / design',
                            'chart' => 'Chart / growth',
                        ])
                        ->default('code')
                        ->required()
                        ->helperText('Fallback icon when no logo image is uploaded.'),
                    FileUpload::make('image_url')
                        ->label('Logo / image')
                        ->image()
                        ->disk('public')
                        ->directory('projects')
                        ->imageEditor()
                        ->columnSpanFull()
                        ->helperText('Shown on the homepage "What I\'m building" card and the project page instead of the icon.'),
                    TextInput::make('summary')
                        ->maxLength(500)
                        ->columnSpanFull(),
                    RichEditor::make('description')
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
                        ->toolbarButtons([
                            ['bold', 'italic', 'underline', 'strike', 'link'],
                            ['h2', 'h3'],
                            ['blockquote', 'bulletList', 'orderedList', 'horizontalRule'],
                            ['table', 'attachFiles'],
                            ['undo', 'redo'],
                        ]),
                ]),

            Section::make('Links & visibility')
                ->columns(3)
                ->schema([
                    TagsInput::make('tags')
                        ->placeholder('Add a tag')
                        ->columnSpan(2),
                    TextInput::make('url')
                        ->label('External URL')
                        ->url(),
                    TextInput::make('cta_label')
                        ->label('CTA label')
                        ->default('Visit project'),
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
