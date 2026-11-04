<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'kicker' => $this->kicker,
            'summary' => $this->summary,
            'description' => $this->description,
            'icon' => $this->icon,
            'image_url' => $this->imageUrl(),
            'tags' => $this->tags ?? [],
            'url' => $this->url,
            'cta_label' => $this->cta_label,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function imageUrl(): ?string
    {
        if (! $this->image_url) {
            return null;
        }

        return str_starts_with($this->image_url, 'http')
            ? $this->image_url
            : Storage::disk('public')->url($this->image_url);
    }
}
