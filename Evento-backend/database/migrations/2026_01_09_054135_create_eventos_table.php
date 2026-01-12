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

            // Tipo de evento (Cumpleaños, Graduación, etc.)
            $table->string('type');

            // Título predefinido (🎂 Cumpleaños, 🎓 Graduación)
            $table->string('presetTitle')->nullable();

            // Fecha del evento
            $table->date('fecha');

            // Organizador
            $table->string('organizer');

            // Salón o lugar
            $table->string('hall');

            // Número de invitados
            $table->integer('guests');

            // Presupuesto
            $table->integer('budget');

            // Extras opcionales
            $table->text('extras')->nullable();

            // Servicios contratados (JSON)
            $table->json('services')->nullable();

            // Totales
            $table->integer('totalServices')->nullable();
            $table->integer('totalGeneral')->nullable();

            // Usuario que creó el evento
            $table->string('user_email')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
