<?php

namespace App\Filament\Resources\Testimonials\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TestimonialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Testimonial')
                ->columns(2)
                ->schema([
                    TextInput::make('headline')
                        ->required()
                        ->maxLength(255)
                        ->helperText('Short title shown in bold, e.g. "Sales more than doubled".'),
                    TextInput::make('name')
                        ->required()
                        ->maxLength(255),
                    Textarea::make('quote')
                        ->required()
                        ->rows(4)
                        ->maxLength(600)
                        ->columnSpanFull(),
                    TextInput::make('role')
                        ->maxLength(255),
                    TextInput::make('company')
                        ->maxLength(255),
                ]),

            Section::make('Display')
                ->columns(4)
                ->schema([
                    TextInput::make('initials')
                        ->maxLength(4)
                        ->helperText('Shown in the avatar circle.'),
                    Select::make('rating')
                        ->options([1 => '1', 2 => '2', 3 => '3', 4 => '4', 5 => '5'])
                        ->default(5)
                        ->required(),
                    TextInput::make('sort_order')
                        ->numeric()
                        ->default(0)
                        ->minValue(0),
                    Toggle::make('is_published')
                        ->label('Published')
                        ->default(true),
                ]),
        ]);
    }
}
