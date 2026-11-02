<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'excerpt',
        'content',
        'image_url',
        'featured',
        'locked',
        'published_at',
        'sort_order',
        'is_published',
        'lead_magnet_file_url',
        'lead_magnet_cta_label',
        'lead_magnet_payment_required',
        'lead_magnet_price',
    ];

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'locked' => 'boolean',
            'is_published' => 'boolean',
            'lead_magnet_payment_required' => 'boolean',
            'lead_magnet_price' => 'decimal:2',
            'sort_order' => 'integer',
            'published_at' => 'date',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }
}
