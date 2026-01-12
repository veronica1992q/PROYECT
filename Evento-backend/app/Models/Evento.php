<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si coincide con plural del modelo)
    protected $table = 'eventos';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'type',
        'presetTitle',
        'fecha',
        'organizer',
        'hall',
        'guests',
        'budget',
        'extras',
        'services',
        'totalServices',
        'totalGeneral',
        'user_email',
    ];

    // Si 'services' es un array/JSON, lo convertimos automáticamente
    protected $casts = [
        'services' => 'array',
    ];
}
