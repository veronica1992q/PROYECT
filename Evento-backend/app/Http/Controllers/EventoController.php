<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    // Crear nuevo evento
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
            'totalGeneral' => 'required|numeric',
            'user_email' => 'required|email',
        ]);

        $evento = Evento::create($validated);

        return response()->json([
            'message' => 'Evento creado exitosamente',
            'evento' => $evento
        ], 201);
    }

    // Listar todos los eventos
    public function index()
    {
        return Evento::all();
    }

    // Ver un evento específico
    public function show($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        return $evento;
    }

    // Actualizar evento
    public function update(Request $request, $id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $evento->update($request->all());

        return response()->json([
            'message' => 'Evento actualizado',
            'evento' => $evento
        ]);
    }

    // Eliminar evento
    public function destroy($id)
    {
        $evento = Evento::find($id);

        if (!$evento) {
            return response()->json(['message' => 'Evento no encontrado'], 404);
        }

        $evento->delete();

        return response()->json(['message' => 'Evento eliminado']);
    }
}
