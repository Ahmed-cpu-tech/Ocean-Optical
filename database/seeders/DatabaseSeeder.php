<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@ocean.com'],
            [
                'name' => 'Admin Manager',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Products
        \App\Models\Product::updateOrCreate(
            ['name' => 'Classic Black Frames'],
            [
                'type' => 'medical',
                'price' => 120.00,
                'description' => 'Elegant black frames perfect for any occasion.',
                'colors' => ['#000000', '#333333'],
                'image_url' => 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=60',
                'is_new' => true,
            ]
        );

        \App\Models\Product::updateOrCreate(
            ['name' => 'Retro Aviator'],
            [
                'type' => 'sunglasses',
                'price' => 85.50,
                'description' => 'Classic retro aviators providing 100% UV protection.',
                'colors' => ['#d4af37', '#808080'],
                'image_url' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=60',
                'is_new' => false,
            ]
        );

        \App\Models\Product::updateOrCreate(
            ['name' => 'Clear Blue Light Blockers'],
            [
                'type' => 'medical',
                'price' => 60.00,
                'description' => 'Protect your eyes from screen fatigue with these stylish clear frames.',
                'colors' => ['#ffffff', '#e0e0e0'],
                'image_url' => 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&auto=format&fit=crop&q=60',
                'is_new' => true,
            ]
        );
    }
}
