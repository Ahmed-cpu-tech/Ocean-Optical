<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Contact::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        Contact::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully'
        ], 201);
    }
    
    public function show($id)
    {
        return response()->json(Contact::findOrFail($id));
    }
    
    public function reply(Request $request, $id)
    {
        $validated = $request->validate([
            'reply' => 'required|string'
        ]);

        // Logic to send email would go here
        // Mail::to(Contact::findOrFail($id)->email)->send(new SupportReply($validated['reply']));

        return response()->json(['message' => 'Réponse envoyée avec succès']);
    }

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return response()->json(['message' => 'Message supprimé']);
    }
}
