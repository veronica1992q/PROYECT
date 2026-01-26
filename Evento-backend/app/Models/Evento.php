<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    // Nombre de la tabla (opcional si sigue la convención plural)
    protected $table = 'eventos';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'type',
        'presetTitle',
        'date',
        'organizer',
        'hall',
        'guests',
        'extras',
        'services',
        'totalGeneral',
        'user_email',
    ];

    // Cast para que "services" se guarde y recupere como array JSON
    protected $casts = [
        'services' => 'array',
    ];
}
