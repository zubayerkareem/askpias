<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Note */
class NoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'image_url' => $this->imageUrl(),
            'featured' => (bool) $this->featured,
            'locked' => (bool) $this->locked,
            'published_at' => $this->published_at?->toDateString(),
            'sort_order' => (int) $this->sort_order,
            'lead_magnet_file_url' => $this->lead_magnet_file_url,
            'lead_magnet_cta_label' => $this->lead_magnet_cta_label,
            'lead_magnet_payment_required' => (bool) $this->lead_magnet_payment_required,
            'lead_magnet_price' => $this->lead_magnet_price !== null ? (float) $this->lead_magnet_price : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function imageUrl(): ?string
    {
        if (! $this->image_url) {
            return null;
        }

        // Absolute URLs and site-relative paths are served as-is.
        if (str_starts_with($this->image_url, 'http') || str_starts_with($this->image_url, '/')) {
            return $this->image_url;
        }

        return Storage::disk('public')->url($this->image_url);
    }
}
