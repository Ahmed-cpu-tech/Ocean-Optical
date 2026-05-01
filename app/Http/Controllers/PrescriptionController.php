<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Prescription::with(['user', 'product'])->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'product_id' => 'nullable|exists:products,id',
            'od_sph' => 'nullable|string',
            'od_cyl' => 'nullable|string',
            'od_axis' => 'nullable|string',
            'og_sph' => 'nullable|string',
            'og_cyl' => 'nullable|string',
            'og_axis' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('ordonnances', 'public');
        }

        // Group flat fields into prescription_details for the database
        $prescriptionData = [
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'product_id' => $validated['product_id'],
            'image_path' => $imagePath,
            'user_id' => auth('sanctum')->id(),
            'prescription_details' => [
                'od_sph' => $validated['od_sph'] ?? '',
                'od_cyl' => $validated['od_cyl'] ?? '',
                'od_axis' => $validated['od_axis'] ?? '',
                'og_sph' => $validated['og_sph'] ?? '',
                'og_cyl' => $validated['og_cyl'] ?? '',
                'og_axis' => $validated['og_axis'] ?? '',
            ],
            'status' => 'pending'
        ];

        $prescription = Prescription::create($prescriptionData);

        // Add full URL to response
        $prescription->image_url = $imagePath ? asset('storage/' . $imagePath) : null;

        return response()->json(['message' => 'Ordonnance soumise avec succès', 'data' => $prescription], 201);
    }

    public function show($id)
    {
        return response()->json(Prescription::with(['user', 'product'])->findOrFail($id));
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processed'
        ]);

        $prescription = Prescription::findOrFail($id);
        $prescription->update($validated);

        return response()->json($prescription);
    }

    public function destroy($id)
    {
        Prescription::findOrFail($id)->delete();
        return response()->json(['message' => 'Demande supprimée']);
    }
}
