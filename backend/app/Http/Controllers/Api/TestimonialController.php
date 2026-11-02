<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TestimonialController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $testimonials = Testimonial::query()
            ->published()
            ->orderBy('sort_order')
            ->get();

        return TestimonialResource::collection($testimonials);
    }
}
