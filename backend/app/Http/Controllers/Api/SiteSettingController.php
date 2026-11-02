<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class SiteSettingController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = SiteSetting::current();

        $heroImage = $settings->hero_image_url;

        if ($heroImage && ! str_starts_with($heroImage, 'http')) {
            $heroImage = Storage::disk('public')->url($heroImage);
        }

        return response()->json([
            'hero_image_url' => $heroImage,
            'case_studies_iframe_url' => $settings->case_studies_iframe_url,
            'intro_video_url' => $settings->intro_video_url,
            'gtm_container_id' => $settings->gtm_container_id,
            'contact_email' => $settings->contact_email,
            'tagline' => $settings->tagline,
            'seo_site_url' => $settings->seo_site_url,
            'robots_txt' => $settings->robots_txt,
            'sitemap_enabled' => (bool) $settings->sitemap_enabled,
        ]);
    }
}
