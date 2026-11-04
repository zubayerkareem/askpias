<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Page */
class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'meta_description' => $this->meta_description,
            'blocks' => $this->blocks(),
        ];
    }

    /**
     * @return array<int, array{type: string, data: array<string, mixed>}>
     */
    private function blocks(): array
    {
        $blocks = is_array($this->blocks) ? $this->blocks : [];

        return array_values(array_map(function (array $block): array {
            $type = (string) ($block['type'] ?? '');
            $data = is_array($block['data'] ?? null) ? $block['data'] : [];

            if ($type === 'story') {
                $data['image'] = $this->mediaUrl($data['image'] ?? null);
                $data['facts'] = array_values(is_array($data['facts'] ?? null) ? $data['facts'] : []);
            }

            if ($type === 'practice') {
                $items = is_array($data['items'] ?? null) ? $data['items'] : [];
                $data['items'] = array_values(array_map(function ($item): array {
                    $item = is_array($item) ? $item : [];
                    $item['image'] = $this->mediaUrl($item['image'] ?? null);

                    return $item;
                }, $items));
            }

            if ($type === 'stats') {
                $data['items'] = array_values(is_array($data['items'] ?? null) ? $data['items'] : []);
            }

            return ['type' => $type, 'data' => $data];
        }, $blocks));
    }

    private function mediaUrl(mixed $path): ?string
    {
        if (! is_string($path) || $path === '') {
            return null;
        }

        if (str_starts_with($path, 'http') || str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
