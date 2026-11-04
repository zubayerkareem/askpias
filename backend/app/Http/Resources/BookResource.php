<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Book */
class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'badge' => $this->badge,
            'cover_image_url' => $this->coverUrl(),
            'featured_image_url' => $this->featuredUrl(),
            'price' => $this->price !== null ? (float) $this->price : null,
            'currency' => $this->currency ?? 'BDT',
            'features' => $this->features ?? [],
            'buy_url' => $this->buy_url,
            'sample_url' => $this->sample_url,
            'is_featured' => (bool) $this->is_featured,
            'purchasable' => filled($this->file_url) && $this->price !== null && (float) $this->price > 0,
            'sort_order' => (int) $this->sort_order,
        ];
    }

    private function coverUrl(): ?string
    {
        return $this->mediaUrl($this->cover_image_url);
    }

    private function featuredUrl(): ?string
    {
        return $this->mediaUrl($this->featured_image_url);
    }

    private function mediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, 'http')
            ? $path
            : Storage::disk('public')->url($path);
    }
}
