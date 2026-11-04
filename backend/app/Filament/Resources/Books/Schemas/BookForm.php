<?php

namespace App\Filament\Resources\Books\Schemas;

use App\Models\Book;
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

class BookForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Book')
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
                            fn (?Book $record) => Rule::unique('books', 'slug')->ignore($record?->id),
                        ])
                        ->helperText('Public URL: /books/{slug}'),
                    TextInput::make('subtitle')
                        ->maxLength(500)
                        ->columnSpanFull(),
                    RichEditor::make('description')
                        ->columnSpanFull()
                        ->fileAttachmentsDisk('public')
                        ->fileAttachmentsDirectory('content')
                        ->fileAttachmentsVisibility('public')
                        ->fileAttachmentsMaxSize(5120)
                        ->toolbarButtons([
                            ['bold', 'italic', 'underline', 'strike', 'link'],
                            ['h2', 'h3'],
                            ['blockquote', 'bulletList', 'orderedList'],
                            ['attachFiles'],
                            ['undo', 'redo'],
                        ]),
                    FileUpload::make('cover_image_url')
                        ->label('Cover image (books page)')
                        ->image()
                        ->disk('public')
                        ->directory('books')
                        ->imageEditor()
                        ->helperText('Used in the books grid, the book page and social previews.')
                        ->columnSpanFull(),
                    FileUpload::make('featured_image_url')
                        ->label('Homepage image (featured)')
                        ->image()
                        ->disk('public')
                        ->directory('books')
                        ->imageEditor()
                        ->helperText('Used in the homepage featured book block. Falls back to the cover image when empty.')
                        ->columnSpanFull(),
                ]),

            Section::make('Pricing & links')
                ->columns(3)
                ->schema([
                    TextInput::make('price')
                        ->numeric()
                        ->prefix('৳'),
                    TextInput::make('currency')
                        ->default('BDT')
                        ->maxLength(8),
                    TextInput::make('badge')
                        ->label('Badge')
                        ->placeholder('Featured ebook')
                        ->maxLength(60),
                    TextInput::make('buy_url')
                        ->label('Buy URL')
                        ->url()
                        ->helperText('Used when no book file is uploaded.'),
                    TextInput::make('sample_url')
                        ->label('Sample URL')
                        ->url(),
                    FileUpload::make('file_url')
                        ->label('Book file (delivered after payment)')
                        ->disk('public')
                        ->directory('books/files')
                        ->acceptedFileTypes(['application/pdf', 'application/epub+zip', 'application/zip'])
                        ->maxSize(51200)
                        ->helperText('Upload the ebook here. The download link is revealed only after a successful UddoktaPay payment.')
                        ->columnSpanFull(),
                    TagsInput::make('features')
                        ->label('What’s included')
                        ->helperText('One bullet per item.')
                        ->columnSpan(3),
                ]),

            Section::make('Visibility')
                ->columns(3)
                ->schema([
                    Toggle::make('is_featured')
                        ->label('Featured on the homepage'),
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
