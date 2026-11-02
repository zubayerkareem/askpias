<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Testimonial */
class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'headline' => $this->headline,
            'quote' => $this->quote,
            'name' => $this->name,
            'role' => $this->role,
            'company' => $this->company,
            'initials' => $this->initials,
            'rating' => (int) $this->rating,
            'sort_order' => (int) $this->sort_order,
        ];
    }
}
