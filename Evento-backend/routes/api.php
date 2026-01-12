<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Models\User;
use Illuminate\Support\Facades\Hash;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});


User::create([
 'name' => 'Nicole Alvia',
 'email' => 'nickyalvia26@gmail.com',
 'password' => Hash::make('123456')
]);
