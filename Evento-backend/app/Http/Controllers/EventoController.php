<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;

class EventoController extends Controller
{
    // ✅ Requiere autenticación
    public function store(Request $request)
    {
        // Validar los datos
        $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha' => 'required|date',
            'lugar' => 'required|string|max:255',
            'invitados' => 'required|integer|min:1',
            'extras' => 'nullable|array',
            'total' => 'required|numeric|min:0',
        ]);

        // Crear el evento
        $evento = Evento::create([
            'user_id' => $request->user()->id, // ✅ vincular al usuario autenticado
            'nombre' => $request->nombre,
            'fecha' => $request->fecha,
            'lugar' => $request->lugar,
            'invitados' => $request->invitados,
            'extras' => json_encode($request->extras), // ✅ guardar como JSON si es array
            'total' => $request->total,
        ]);

        return response()->json([
            'message' => 'Evento creado correctamente',
            'evento' => $evento,
        ], 201);
    }
}
