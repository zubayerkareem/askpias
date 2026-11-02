<?php

namespace App\Filament\RichEditor;

use Filament\Forms\Components\RichEditor\Plugins\Contracts\RichContentPlugin;
use Filament\Forms\Components\RichEditor\RichEditorTool;
use Filament\Support\Icons\Heroicon;

/**
 * Adds a "YouTube" toolbar button to the rich editor. It inserts the video URL
 * as a standalone paragraph link; the site renders those as responsive players.
 */
class YouTubePlugin implements RichContentPlugin
{
    public function getEditorTools(): array
    {
        return [
            RichEditorTool::make('youtube')
                ->label('Embed YouTube video')
                ->icon(Heroicon::OutlinedVideoCamera)
                ->jsHandler(<<<'JS'
                    (function(){var u=window.prompt('Paste a YouTube URL');if(!u)return;var e=$getEditor();if(!e)return;e.chain().focus().insertContent([{type:'text',text:u,marks:[{type:'link',attrs:{href:u}}]}]).run();})()
                JS),
        ];
    }

    public function getEditorActions(): array
    {
        return [];
    }

    public function getTipTapPhpExtensions(): array
    {
        return [];
    }

    public function getTipTapJsExtensions(): array
    {
        return [];
    }
}
