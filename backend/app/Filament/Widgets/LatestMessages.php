<?php

namespace App\Filament\Widgets;

use App\Models\Message;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestMessages extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Latest messages')
            ->description('The five most recent "Ask me anything" submissions.')
            ->query(Message::query()->latest()->limit(5))
            ->paginated(false)
            ->columns([
                IconColumn::make('is_read')
                    ->label('')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-envelope'),
                TextColumn::make('name')
                    ->default('—')
                    ->weight('semibold'),
                TextColumn::make('email')
                    ->label('Email')
                    ->copyable(),
                TextColumn::make('question')
                    ->limit(60)
                    ->wrap(),
                TextColumn::make('created_at')
                    ->label('Received')
                    ->since(),
            ]);
    }
}
