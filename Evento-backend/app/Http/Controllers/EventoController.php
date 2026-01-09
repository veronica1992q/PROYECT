<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    // Crear un evento
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date',
            'anfitrion' => 'required|string|max:255',
            'lugar' => 'required|string|max:255',
            'invitados' => 'required|integer|min:1',
            'presupuesto' => 'required|numeric|min:0',
            'extras' => 'nullable|string'
        ]);

        $evento = Evento::create($validated);

        return response()->json([
            'message' => 'Evento creado correctamente',
            'evento' => $evento
        ], 201);
    }

    // Listar eventos
    public function index()
    {
        return response()->json(Evento::all(), 200);
    }

    // Ver un evento específico
    public function show($id)
    {
        $evento = Evento::findOrFail($id);
        return response()->json($evento, 200);
    }

    // Actualizar un evento
    public function update(Request $request, $id)
    {
        $evento = Evento::findOrFail($id);

        $evento->update($request->all());

        return response()->json([
            'message' => 'Evento actualizado correctamente',
            'evento' => $evento
        ], 200);
    }

    // Eliminar un evento
    public function destroy($id)
    {
        $evento = Evento::findOrFail($id);
        $evento->delete();

        return response()->json(['message' => 'Evento eliminado correctamente'], 200);
    }
}
