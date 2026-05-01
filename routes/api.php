<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ModuleController;
// Public Routes
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/modules', [ModuleController::class, 'index']);
Route::get('/modules/{module}', [ModuleController::class, 'show']);

Route::post('/prescriptions', [PrescriptionController::class, 'store']);
Route::post('/contacts', [ContactController::class, 'store']);
Route::post('/contact', [ContactController::class, 'store']); // Fallback alias

// Instagram Mock Route
Route::get('/instagram-feed', function() {
    // If real API keys are present in env, you would call Http::get('https://graph.instagram.com/me/media...')
    // For now, return a mock response
    return response()->json([
        'data' => [
            ['id' => '1', 'media_url' => 'https://images.unsplash.com/photo-1577234286142-9908debe0e71'],
            ['id' => '2', 'media_url' => 'https://images.unsplash.com/photo-1509695507497-903c140c43b0'],
            ['id' => '3', 'media_url' => 'https://images.unsplash.com/photo-1582143093125-968b139db9ea'],
            ['id' => '4', 'media_url' => 'https://images.unsplash.com/photo-1549880181-59a44fc31cb3'],
        ]
    ]);
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin Routes
    Route::middleware('admin')->group(function () {
        Route::post('/modules', [ModuleController::class, 'store']);
        Route::put('/modules/{module}', [ModuleController::class, 'update']);
        Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::post('/products/{id}', [ProductController::class, 'update']); // Using POST with _method=PUT from frontend for multipart
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        Route::get('/prescriptions', [PrescriptionController::class, 'index']);
        Route::put('/prescriptions/{id}/status', [PrescriptionController::class, 'updateStatus']);
        Route::delete('/prescriptions/{id}', [PrescriptionController::class, 'destroy']);
        
        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/contacts/{id}', [ContactController::class, 'show']);
        Route::post('/contacts/{id}/reply', [ContactController::class, 'reply']);
        Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
        
        Route::put('/admin/profile', [AuthController::class, 'updateProfile']);
    });
});
