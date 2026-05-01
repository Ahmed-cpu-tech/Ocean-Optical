<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Product::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:medical,sunglasses',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'colors' => 'nullable|string', // Send as JSON string from client
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_new' => 'boolean',
        ]);

        if (isset($validated['colors'])) {
            $validated['colors'] = json_decode($validated['colors'], true);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function show($id)
    {
        return response()->json(Product::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:medical,sunglasses',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'colors' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_new' => 'boolean',
        ]);

        if (isset($validated['colors'])) {
            $validated['colors'] = json_decode($validated['colors'], true);
        }

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image_url && str_contains($product->image_url, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image_url));
            }
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->image_url && str_contains($product->image_url, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $product->image_url));
        }

        $product->delete();

        return response()->json(['message' => 'Produit supprimé']);
    }
}
