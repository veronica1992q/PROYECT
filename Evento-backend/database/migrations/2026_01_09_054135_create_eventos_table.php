<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('eventos', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('presetTitle');
            $table->date('date');
            $table->string('organizer');
            $table->string('hall');
            $table->integer('guests');
            $table->text('extras')->nullable();
            $table->json('services')->nullable();
            $table->integer('totalGeneral');
            $table->string('user_email');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
