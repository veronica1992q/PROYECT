<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    // Obtener todos
    public function index()
    {
        return response()->json(Evento::all(), 200);
    }

    // Obtener uno
    public function show($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        return response()->json($evento, 200);
    }

    // Crear
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'presetTitle' => 'required|string',
            'date' => 'required|date',
            'organizer' => 'required|string',
            'hall' => 'required|string',
            'guests' => 'required|integer',
            'extras' => 'nullable|string',
            'services' => 'nullable|array',
            'totalGeneral' => 'required|integer',
            'user_email' => 'required|email'
        ]);

        $evento = Evento::create($validated);

        return response()->json($evento, 201);
    }

    // Actualizar
    public function update(Request $request, $id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $evento->update($request->all());

        return response()->json($evento, 200);
    }

    // Eliminar
    public function destroy($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento eliminado correctamente'], 200);
    }
}
