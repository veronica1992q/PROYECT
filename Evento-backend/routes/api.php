<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 🔐 Autenticación
Route::post('/register', [AuthController::class, 'register']); // opcional si tienes registro
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas con Sanctum
Route::middleware(['auth:sanctum'])->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });



    // 📋 Eventos CRUD
    Route::get('/eventos', [EventoController::class, 'index']);      // listar todos
    Route::post('/eventos', [EventoController::class, 'store']);     // crear nuevo
    Route::get('/eventos/{id}', [EventoController::class, 'show']);  // ver uno
    Route::put('/eventos/{id}', [EventoController::class, 'update']); // actualizar
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']); // eliminar
});
