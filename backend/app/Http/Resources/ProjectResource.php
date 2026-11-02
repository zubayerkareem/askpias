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
            'tags' => $this->tags ?? [],
            'url' => $this->url,
            'cta_label' => $this->cta_label,
            'sort_order' => (int) $this->sort_order,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
