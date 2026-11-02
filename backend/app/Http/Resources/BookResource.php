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
            'price' => $this->price !== null ? (float) $this->price : null,
            'currency' => $this->currency ?? 'BDT',
            'features' => $this->features ?? [],
            'buy_url' => $this->buy_url,
            'sample_url' => $this->sample_url,
            'is_featured' => (bool) $this->is_featured,
            'sort_order' => (int) $this->sort_order,
        ];
    }

    private function coverUrl(): ?string
    {
        if (! $this->cover_image_url) {
            return null;
        }

        return str_starts_with($this->cover_image_url, 'http')
            ? $this->cover_image_url
            : Storage::disk('public')->url($this->cover_image_url);
    }
}
