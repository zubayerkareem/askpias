<?php

use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CaseStudyController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API (consumed by the TanStack Start frontend)
|--------------------------------------------------------------------------
*/

Route::get('/notes', [NoteController::class, 'index']);
Route::get('/notes/{slug}', [NoteController::class, 'show']);

Route::get('/case-studies', [CaseStudyController::class, 'index']);
Route::get('/case-studies/{slug}', [CaseStudyController::class, 'show']);

Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{slug}', [BookController::class, 'show']);

Route::get('/settings', [SiteSettingController::class, 'show']);

Route::get('/pages/{slug}', [PageController::class, 'show']);

Route::post('/messages', [MessageController::class, 'store'])->middleware('throttle:10,1');
Route::post('/leads', [LeadController::class, 'store'])->middleware('throttle:10,1');
Route::post('/leads/checkout', [LeadController::class, 'checkout'])->middleware('throttle:10,1');

Route::get('/payments/verify', [PaymentController::class, 'verify'])->middleware('throttle:30,1');
