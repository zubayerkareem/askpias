<?php

namespace App\Filament\Resources\Messages\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class MessageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Sender')
                ->columns(3)
                ->schema([
                    TextInput::make('name')->label('Name'),
                    TextInput::make('email')->label('Email'),
                    TextInput::make('phone')->label('Phone'),
                ]),

            Section::make('Question')
                ->schema([
                    Textarea::make('question')
                        ->rows(6)
                        ->columnSpanFull(),
                ]),
        ]);
    }
}
