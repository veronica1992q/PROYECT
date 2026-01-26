<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('type');              // Tipo de evento
            $table->string('presetTitle');       // Título con emoji 🎂 / 🎓
            $table->date('date');                // Fecha del evento
            $table->string('organizer');         // Organizador
            $table->string('hall');              // Salón
            $table->integer('guests');           // Número de invitados
            $table->text('extras')->nullable();  // Extras opcionales
            $table->json('services')->nullable();// Servicios contratados
            $table->integer('totalGeneral');     // Total calculado
            $table->string('user_email');        // Usuario que creó el evento
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
