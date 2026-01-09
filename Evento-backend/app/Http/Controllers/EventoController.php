<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    // 📋 Listar todos los eventos
    public function index()
    {
        return response()->json(Evento::all(), 200);
    }

    // ➕ Crear un nuevo evento
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'presetTitle' => 'nullable|string',
            'fecha' => 'required|date',
            'organizer' => 'required|string',
            'hall' => 'required|string',
            'guests' => 'required|integer',
            'budget' => 'required|integer',
            'extras' => 'nullable|string',
            'services' => 'nullable|array',
            'totalServices' => 'nullable|integer',
            'totalGeneral' => 'nullable|integer',
            'user_email' => 'nullable|string|email',
        ]);

        $evento = Evento::create($validated);

        return response()->json($evento, 201);
    }

    // 🔎 Mostrar un evento específico
    public function show($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        return response()->json($evento, 200);
    }

    // ✏️ Actualizar un evento
    public function update(Request $request, $id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $validated = $request->validate([
            'type' => 'nullable|string',
            'presetTitle' => 'nullable|string',
            'fecha' => 'nullable|date',
            'organizer' => 'nullable|string',
            'hall' => 'nullable|string',
            'guests' => 'nullable|integer',
            'budget' => 'nullable|integer',
            'extras' => 'nullable|string',
            'services' => 'nullable|array',
            'totalServices' => 'nullable|integer',
            'totalGeneral' => 'nullable|integer',
            'user_email' => 'nullable|string|email',
        ]);

        $evento->update($validated);

        return response()->json($evento, 200);
    }

    // 🗑 Eliminar un evento
    public function destroy($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento eliminado con éxito'], 200);
    }
}
