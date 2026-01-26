<?php
use App\Http\Controllers\EventoController;

Route::get('/eventos', [EventoController::class, 'index']);
Route::post('/eventos', [EventoController::class, 'store']);
Route::get('/eventos/{id}', [EventoController::class, 'show']);
Route::put('/eventos/{id}', [EventoController::class, 'update']);
Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);
