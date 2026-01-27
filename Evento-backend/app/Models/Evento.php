<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $table = 'eventos';

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

    protected $casts = [
        'date' => 'date',
        'services' => 'array', // ✅ convierte JSON en array automáticamente
    ];
}
