<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'type',
        'price',
        'description',
        'colors',
        'image_url',
        'is_new'
    ];

    protected $casts = [
        'colors' => 'array',
        'is_new' => 'boolean',
        'price' => 'decimal:2',
    ];
}
